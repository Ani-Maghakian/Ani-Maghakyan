import { projects, hubs, locales, localizedPath } from './seo-page-data.mjs';
import { services, serviceHub } from '../lib/services.mjs';

const siteUrl = String(process.env.SITE_URL || '').replace(/\/$/, '');
if (!siteUrl) throw new Error('SITE_URL is required for live verification.');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeUrl(value) {
  try {
    return new URL(value).href;
  } catch {
    return String(value || '');
  }
}

async function get(url, attempts = 6) {
  let last;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'cache-control': 'no-cache, no-store, max-age=0', 'user-agent': 'Ani-Maghakyan-Live-QA/1.2' },
      });
      if (response.ok) return response;
      last = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      last = error;
    }
    await sleep(3000 * (i + 1));
  }
  throw new Error(`Live check failed for ${url}: ${last instanceof Error ? last.message : last}`);
}

function expectedTails() {
  return [
    ...projects.map((project) => `projects/${project.slug}`),
    ...hubs.map((hub) => hub.slug),
    serviceHub.slug,
    ...services.map((service) => `${serviceHub.slug}/${service.slug}`),
  ];
}

function expectedUrls() {
  const urls = [
    `${siteUrl}/`,
    `${siteUrl}/en/`,
    `${siteUrl}/ru/`,
  ];
  for (const tail of expectedTails()) {
    for (const locale of Object.keys(locales)) {
      urls.push(`${siteUrl}/${localizedPath(locale, tail)}/`);
    }
  }
  return [...new Set(urls.map(normalizeUrl))];
}

function canonicalFrom(html) {
  return html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]
    ?? html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1]
    ?? '';
}

function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function waitForCurrentSitemap(expected, attempts = 10) {
  let lastUrls = [];
  for (let i = 0; i < attempts; i += 1) {
    const response = await get(`${siteUrl}/sitemap.xml?live_qa=${Date.now()}-${i}`, 2);
    const xml = await response.text();
    const rawUrls = sitemapLocs(xml);
    const urls = rawUrls.map(normalizeUrl);
    lastUrls = urls;

    const unique = new Set(urls);
    const complete = expected.every((url) => unique.has(url));
    if (complete && unique.size === expected.length && urls.length === expected.length) {
      return { xml, rawUrls, urls };
    }

    if (i < attempts - 1) await sleep(3000 * (i + 1));
  }

  const missing = expected.filter((url) => !lastUrls.includes(url));
  throw new Error(
    `Live sitemap did not converge to the deployed ${expected.length}-URL set. `
      + `Last count=${lastUrls.length}; missing=${missing.slice(0, 10).join(', ') || 'none'}`,
  );
}

const expected = expectedUrls();
const { rawUrls: sitemapRawUrls, urls: sitemapUrls } = await waitForCurrentSitemap(expected);

if (new Set(sitemapUrls).size !== sitemapUrls.length) {
  throw new Error('Live sitemap contains duplicate canonical URLs after URL normalization.');
}

const robots = await (await get(`${siteUrl}/robots.txt?live_qa=${Date.now()}`)).text();
const advertisedSitemap = robots.match(/^Sitemap:\s*(\S+)\s*$/im)?.[1] ?? '';
if (normalizeUrl(advertisedSitemap) !== normalizeUrl(`${siteUrl}/sitemap.xml`)) {
  throw new Error(`robots.txt sitemap mismatch: ${advertisedSitemap || 'missing'}`);
}

const failures = [];
const queue = sitemapRawUrls.map((rawUrl, index) => ({ rawUrl, canonicalUrl: sitemapUrls[index] }));
const workers = Array.from({ length: 10 }, async () => {
  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    const { rawUrl, canonicalUrl } = item;
    try {
      const response = await get(`${rawUrl}?live_qa=${Date.now()}`, 3);
      const html = await response.text();
      const canonical = canonicalFrom(html);
      if (normalizeUrl(canonical) !== canonicalUrl) failures.push(`${rawUrl}: canonical=${canonical || 'missing'}`);
      if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html)) failures.push(`${rawUrl}: third-party font dependency on critical path`);
      if (!/<h1(?:\s[^>]*)?>/i.test(html)) failures.push(`${rawUrl}: missing H1`);
    } catch (error) {
      failures.push(`${rawUrl}: ${error instanceof Error ? error.message : error}`);
    }
  }
});
await Promise.all(workers);

if (failures.length) {
  throw new Error(`Live QA failed:\n${failures.slice(0, 30).join('\n')}${failures.length > 30 ? `\n… and ${failures.length - 30} more` : ''}`);
}

const home = await (await get(`${siteUrl}/?live_qa=${Date.now()}`)).text();
if (!/href=["'][^"']*services\//i.test(home)) throw new Error('Homepage does not expose the services cluster through a crawlable link.');

console.log(`Live QA passed: ${sitemapUrls.length} canonical URLs, robots.txt, service discovery and critical-render checks are healthy.`);
