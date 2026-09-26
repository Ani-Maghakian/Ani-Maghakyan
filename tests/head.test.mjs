import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';

const root = resolve('dist/client');
test('all sitemap pages have working HEAD assets and consistent localized metadata', async () => {
  const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]));
  const base = urls[0];
  for (const url of urls) {
    const html = await readFile(join(root, url.pathname.slice(base.pathname.length), 'index.html'), 'utf8');
    const dom = new JSDOM(html);
    const head = dom.window.document.head;
    assert.equal(head.children[0].getAttribute('charset'), 'utf-8', url.href);
    assert.equal(head.children[1].getAttribute('name'), 'viewport', url.href);
    assert.equal(head.children[2].tagName, 'TITLE', url.href);
    for (const selector of ['title', 'meta[name="description"]', 'meta[name="viewport"]', 'link[rel="canonical"]', 'link[rel="manifest"]', 'link[rel="apple-touch-icon"]', 'meta[name="theme-color"]']) {
      assert.equal(head.querySelectorAll(selector).length, 1, `${url.href}: ${selector}`);
    }
    assert.equal(head.querySelector('link[rel="canonical"]').href, url.href);
    assert.equal(head.querySelector('meta[property="og:url"]').content, url.href);
    for (const node of head.querySelectorAll('link[rel="manifest"], link[rel="icon"], link[rel="apple-touch-icon"]')) {
      const asset = new URL(node.getAttribute('href'), url);
      assert.equal(asset.origin, base.origin);
      assert.ok(asset.pathname.startsWith(base.pathname), `Asset escaped project path: ${asset}`);
      await access(join(root, asset.pathname.slice(base.pathname.length)));
    }
    const locale = head.querySelector('meta[property="og:locale"]').content;
    const alternates = [...head.querySelectorAll('meta[property="og:locale:alternate"]')].map(node => node.content);
    assert.equal(alternates.length, 2);
    assert.ok(!alternates.includes(locale));
    assert.equal(head.querySelector('meta[name="twitter:image:alt"]').content, head.querySelector('meta[property="og:image:alt"]').content);
    assert.equal(head.querySelectorAll('link[rel="alternate"][hreflang]').length, 4);
    dom.window.close();
  }
  const manifest = JSON.parse(await readFile(join(root, 'manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.start_url, base.pathname);
  assert.equal(manifest.scope, base.pathname);
  assert.equal(manifest.theme_color, '#090a09');
  for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    const image = await sharp(join(root, file)).metadata();
    assert.equal(image.width, size); assert.equal(image.height, size); assert.equal(image.format, 'png');
  }
});
