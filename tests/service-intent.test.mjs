import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { services, serviceHub, serviceCopy } from '../lib/services.mjs';
import { locales, localizedPath } from '../scripts/seo-page-data.mjs';
import { serviceLinks } from '../scripts/service-fragments.mjs';

const root = resolve('dist/client');
const esc = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const readPage = (locale, tail = '') => readFile(resolve(root, localizedPath(locale, tail), 'index.html'), 'utf8');
const graph = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const main = (html) => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];

test('service metadata is distinct, concise and represented in the visible page', async () => {
  // Editorial budgets, not search-engine ranking thresholds or pixel guarantees.
  const titles = new Set();
  const descriptions = new Set();
  for (const locale of Object.keys(locales)) {
    for (const service of [serviceHub, ...services]) {
      const tail = service === serviceHub ? 'services' : `services/${service.slug}`;
      const html = await readPage(locale, tail);
      const title = service.titles[locale];
      const description = service.descriptions[locale];
      assert.ok(title.length > 15 && title.length <= 60, `${locale}/${tail}: title length`);
      assert.ok(description.length >= 90 && description.length <= 155, `${locale}/${tail}: description length`);
      assert.ok(!titles.has(title), `Duplicate service title: ${title}`);
      assert.ok(!descriptions.has(description), `Duplicate service description: ${description}`);
      titles.add(title);
      descriptions.add(description);
      assert.ok(html.includes(`<title>${esc(title)}</title>`));
      assert.ok(html.includes(`<meta name="description" content="${esc(description)}">`));
      assert.ok(main(html).includes(`<h1>${esc(service.headings[locale])}</h1>`));
      assert.ok(main(html).includes(esc(description)));
      // No fabricated local branches, ratings, location claims or guarantees.
      assert.doesNotMatch(JSON.stringify(graph(html)), /"(?:LocalBusiness|aggregateRating|reviewRating|streetAddress|openingHours)"/);
    }
  }
  assert.equal(titles.size, 15);
});

test('every service is directly discoverable from home and contact and links to real relevant work', async () => {
  for (const locale of Object.keys(locales)) {
    const home = main(await readPage(locale));
    const contact = main(await readPage(locale, 'work-with-ani'));
    for (const service of services) {
      const servicePath = `${localizedPath(locale, `services/${service.slug}`)}/`;
      assert.ok(home.includes(`${servicePath}"`), `Home discovery: ${locale}/${service.slug}`);
      assert.ok(contact.includes(`${servicePath}"`), `Contact discovery: ${locale}/${service.slug}`);
      const html = await readPage(locale, `services/${service.slug}`);
      for (const slug of service.related) {
        const project = main(await readPage(locale, `projects/${slug}`));
        assert.ok(project.includes(`${servicePath}"`), `Reciprocal project link: ${locale}/${slug}`);
        assert.ok(main(html).includes(`${localizedPath(locale, `projects/${slug}`)}/"`));
      }
      if (service.related.includes('elens-diary')) {
        assert.ok(main(html).includes({ hy: '2 եթերաշրջան · 421 սերիա', en: '2 seasons · 421 episodes', ru: '2 сезона · 421 серия' }[locale]));
      }
      assert.ok(service.next.length > 0);
      for (const slug of service.next) {
        assert.notEqual(slug, service.slug);
        assert.ok(services.some((item) => item.slug === slug));
        assert.ok(main(html).includes(`${localizedPath(locale, `services/${slug}`)}/"`));
      }
    }
  }
  for (const slug of ['showrunning', 'creative-production']) {
    assert.deepEqual(services.find((service) => service.slug === slug).related, ['summer-of-84']);
  }
});

test('service inquiry, deliverables and FAQ content work in static HTML and match structured data', async () => {
  for (const locale of Object.keys(locales)) {
    for (const service of services) {
      const html = await readPage(locale, `services/${service.slug}`);
      const visible = main(html);
      assert.ok(visible.includes('href="#project-brief"'));
      assert.ok(visible.includes('id="project-brief"'));
      assert.ok(visible.includes(esc(serviceCopy[locale].brief)));
      for (const item of serviceCopy[locale].briefItems) assert.ok(visible.includes(esc(item)));
      assert.ok(visible.includes(esc(serviceCopy[locale].scope)));
      for (const [heading, items] of service.sections[locale]) {
        assert.ok(visible.includes(`<h2>${esc(heading)}</h2>`));
        for (const item of items) assert.ok(visible.includes(esc(item)));
      }
      const nodes = graph(html);
      const faq = nodes.find((node) => node['@type'] === 'FAQPage');
      for (const question of faq.mainEntity) {
        assert.ok(visible.includes(`<summary>${esc(question.name)}</summary>`));
        assert.ok(visible.includes(`<p>${esc(question.acceptedAnswer.text)}</p>`));
      }
      const node = nodes.find((item) => item['@type'] === 'Service');
      const page = nodes.find((item) => item['@type'] === 'WebPage');
      assert.equal(node.mainEntityOfPage['@id'], page['@id']);
      assert.equal(page.mainEntity['@id'], node['@id']);
      assert.ok(visible.includes('data-track="contact_instagram"'));
    }
  }
});

test('service fragments preserve GitHub Pages base paths and reject stale service slugs', () => {
  assert.match(serviceLinks('ru', '/Ani-Maghakyan', ['showrunning']), /href="\/Ani-Maghakyan\/ru\/services\/showrunning\/"/);
  assert.equal(serviceLinks('en', '', []), '');
  assert.throws(() => serviceLinks('en', '', ['unknown']), /Unknown service link/);
});

test('all sitemap pages have reciprocal, same-intent language alternates and unique metadata', async () => {
  const xml = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  // URL hosts are case-insensitive; paths retain their case and full identity.
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).href);
  const base = new URL(urls[0]);
  const titles = new Set();
  const descriptions = new Set();
  for (const url of urls) {
    const relative = new URL(url).pathname.slice(base.pathname.length);
    const html = await readFile(resolve(root, relative, 'index.html'), 'utf8');
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const description = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/)[1];
    assert.ok(!titles.has(title), `Duplicate title at ${url}`);
    assert.ok(!descriptions.has(description), `Duplicate description at ${url}`);
    titles.add(title);
    descriptions.add(description);
    assert.doesNotMatch(html, /<meta[^>]*(?:name="(?:robots|googlebot)"[^>]*content="[^"]*noindex|content="[^"]*noindex[^>]*name="(?:robots|googlebot)")/i);
    const tail = relative.replace(/^(?:en|ru)\//, '').replace(/\/$/, '');
    const expected = Object.keys(locales).map((locale) => [locales[locale].lang, `${base.href}${localizedPath(locale, tail)}${tail || locale !== 'hy' ? '/' : ''}`]);
    expected.push(['x-default', expected[0][1]]);
    const alternates = [...html.matchAll(/<link\b[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"[^>]*>/g)]
      .map((match) => [match[1], new URL(match[2]).href]);
    assert.equal(alternates.length, expected.length, `${url}: complete language alternate set`);
    const targets = new Map(alternates);
    for (const [language, target] of expected) {
      assert.equal(targets.get(language), target, `${url}: ${language} must link to same intent`);
      assert.ok(urls.includes(target), `${url}: alternate must be indexable`);
    }
  }
});
