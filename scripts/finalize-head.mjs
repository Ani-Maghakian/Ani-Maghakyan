// Apply HEAD essentials after all static page generators (including vinext).
// The exported HTML, rather than framework metadata support, is authoritative.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';

const root = resolve('dist/client');
const home = new JSDOM(await readFile(join(root, 'index.html'), 'utf8'));
const canonical = home.window.document.querySelector('link[rel="canonical"]')?.href;
const [owner = '', repository = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const inferredBase = process.env.GITHUB_ACTIONS === 'true' && repository && repository !== `${owner}.github.io` ? `/${repository}` : '';
const base = canonical ? new URL(canonical).pathname.replace(/\/$/, '') : (process.env.SITE_BASE_PATH ?? inferredBase);
home.window.close();

for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp('public/favicon.svg').resize(size, size).png().toFile(join(root, name));
}
const manifest = JSON.parse(await readFile(join(root, 'manifest.webmanifest'), 'utf8'));
Object.assign(manifest, {
  name: 'Maghakian Scripts — Ani Maghakyan', short_name: 'Maghakian Scripts',
  description: 'Screenwriting studio founded by Ani Maghakyan.',
  id: `${base}/`, start_url: `${base}/`, scope: `${base}/`,
  display: 'browser', background_color: '#090a09', theme_color: '#090a09',
  icons: [
    { src: `${base}/favicon.svg`, sizes: 'any', type: 'image/svg+xml' },
    ...[192, 512].map(size => ({ src: `${base}/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' })),
  ],
});
await writeFile(join(root, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

let count = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { await walk(path); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const html = await readFile(path, 'utf8');
    // Ownership verification files and error pages are not normal content pages.
    if (!html.includes('rel="canonical"')) continue;
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const head = doc.head;
    function set(selector, tag, attributes) {
      head.querySelectorAll(selector).forEach(node => node.remove());
      const node = doc.createElement(tag);
      for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
      head.append(node);
      return node;
    }
    const meta = (name, content) => set(`meta[name="${name}"]`, 'meta', { name, content });
    meta('theme-color', '#090a09');
    meta('color-scheme', 'dark');
    meta('referrer', 'strict-origin-when-cross-origin');
    set('link[rel="manifest"]', 'link', { rel: 'manifest', href: `${base}/manifest.webmanifest` });
    head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(node => node.remove());
    for (const [name, type, sizes] of [['favicon-32.png', 'image/png', '32x32'], ['favicon.svg', 'image/svg+xml', 'any']]) {
      const node = doc.createElement('link');
      Object.entries({ rel: 'icon', href: `${base}/${name}`, type, sizes }).forEach(([key, value]) => node.setAttribute(key, value));
      head.append(node);
    }
    set('link[rel="apple-touch-icon"]', 'link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}/apple-touch-icon.png` });
    const alt = head.querySelector('meta[property="og:image:alt"]')?.content;
    if (alt && head.querySelector('meta[name="twitter:image"]')) meta('twitter:image:alt', alt);
    const locale = head.querySelector('meta[property="og:locale"]')?.content;
    if (locale) {
      head.querySelectorAll('meta[property="og:locale:alternate"]').forEach(node => node.remove());
      for (const value of ['hy_AM', 'en_US', 'ru_RU'].filter(value => value !== locale)) {
        const node = doc.createElement('meta');
        node.setAttribute('property', 'og:locale:alternate'); node.content = value; head.append(node);
      }
    }
    // Keep encoding within the first 1024 bytes and responsive settings early.
    const charset = set('meta[charset]', 'meta', { charset: 'utf-8' });
    const viewport = meta('viewport', 'width=device-width, initial-scale=1');
    head.prepend(charset, viewport, ...head.querySelectorAll('title'));
    // Only replace head: preserve body markup and existing interaction contracts.
    await writeFile(path, html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, () => head.outerHTML));
    dom.window.close();
    count++;
  }
}
await walk(root);
console.log(`Finalized HEAD metadata and icons on ${count} content pages.`);
