import { projects, hubs, locales, localizedPath } from './seo-page-data.mjs';
import { services, serviceHub } from '../lib/services.mjs';

const siteUrl = String(process.env.SITE_URL || '').replace(/\/$/, '');
if (!siteUrl) throw new Error('SITE_URL is required for live verification.');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(url, attempts = 6) {
  let last;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'cache-control': 'no-cache', 'user-agent': 'Ani-Maghakyan-Live-QA/1.0' },
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
  return [...new Set(urls)];
}

function canonicalFrom(html) {
  return html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]
    ?? html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1]
    ?? '';
}

const sitemapResponse = await get(`${siteUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expected = expectedUrls();

if (new Set(sitemapUrls).size !== sitemapUrls.length) {
  throw new Error('Live sitemap contains duplicate <loc> URLs.');
}
for (const url of expected) {
  if (!sitemapUrls.includes(url)) throw new Error(`Live sitemap is missing ${url}`);
}
if (sitemapUrls.length !== expected.length) {
  throw new Error(`Live sitemap count mismatch: expected ${expected.length}, found ${sitemapUrls.length}.`);
}

const robots = await (await get(`${siteUrl}/robots.txt`)).text();
if (!robots.includes(`${siteUrl}/sitemap.xml`)) throw new Error('robots.txt does not advertise the canonical sitemap.');

const failures = [];
const queue = [...sitemapUrls];
const workers = Array.from({ length: 10 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    if (!url) break;
    try {
      const response = await get(url, 3);
      const html = await response.text();
      const canonical = canonicalFrom(html);
      if (canonical !== url) failures.push(`${url}: canonical=${canonical || 'missing'}`);
      if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html)) failures.push(`${url}: third-party font dependency on critical path`);
      if (!/<h1(?:\s[^>]*)?>/i.test(html)) failures.push(`${url}: missing H1`);
    } catch (error) {
      failures.push(`${url}: ${error instanceof Error ? error.message : error}`);
    }
  }
});
await Promise.all(workers);

if (failures.length) {
  throw new Error(`Live QA failed:\n${failures.slice(0, 30).join('\n')}${failures.length > 30 ? `\n… and ${failures.length - 30} more` : ''}`);
}

const home = await (await get(`${siteUrl}/`)).text();
if (!/href=["'][^"']*services\//i.test(home)) throw new Error('Homepage does not expose the services cluster through a crawlable link.');

console.log(`Live QA passed: ${sitemapUrls.length} canonical URLs, robots.txt, service discovery and critical-render checks are healthy.`);
