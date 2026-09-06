import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { projects, hubs, localizedPath } from '../scripts/seo-page-data.mjs';
import { services } from '../lib/services.mjs';
import { interfaceCopy, publicContactEmail, resultLabel, updatedIso } from '../lib/site-copy.mjs';

const codes = ['hy', 'en', 'ru'];
const root = resolve('dist/client');
const readPage = (code, tail = '') => readFile(resolve(root, localizedPath(code, tail), 'index.html'), 'utf8');
const graph = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];

test('home navigation, project covers and book links are usable in exported HTML', async () => {
  for (const code of codes) {
    const html = await readPage(code);
    assert.match(html, /<details class="mobile-menu"/);
    assert.match(html, /href="#main-content"/);
    assert.match(html, /<nav[^>]*data-seo-hub="ani"/);
    assert.match(html, /books\/#temporary-stop/);
    assert.match(html, /books\/#topsy-turvy/);
    assert.match(html, /services\//);
    const covers = [...html.matchAll(/<a\b([^>]*class="featured-poster-link"[^>]*)>/g)];
    assert.equal(covers.length, 11);
    for (const [, attributes] of covers) {
      assert.match(attributes, /href="[^"\s]*\/projects\/[a-z0-9-]+\/"/);
      assert.doesNotMatch(attributes, /target="_blank"/);
    }
  }
});

test('every sitemap URL has a unique canonical, translated navigation and valid internal links', async () => {
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const expectedCount = codes.length + ((projects.length + hubs.length + services.length + 1) * codes.length);
  assert.equal(urls.length, expectedCount);
  assert.equal(new Set(urls).size, expectedCount);
  const base = new URL(urls[0]);
  assert.ok([...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].every((match) => match[1] === updatedIso));
  for (const url of urls) {
    const relative = new URL(url).pathname.slice(base.pathname.length);
    const html = await readFile(resolve(root, relative, 'index.html'), 'utf8');
    assert.ok(html.includes(`rel="canonical" href="${url}"`), url);
    assert.match(html, /aria-current="page"/);
    assert.match(html, /class="mobile-menu"/);
    assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) ?? []).length, 1, url);
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"#]+)"/g)) {
      const linked = new URL(href.replaceAll('&amp;', '&'), url);
      if (linked.origin !== base.origin) continue;
      assert.ok(linked.pathname.startsWith(base.pathname), `${url} links outside the project: ${href}`);
      const local = linked.pathname.slice(base.pathname.length);
      await access(resolve(root, local, local.endsWith('/') || !local ? 'index.html' : ''));
    }
  }
});

test('service-intent pages expose visible copy, FAQ schema and one consistent provider identity', async () => {
  for (const code of codes) {
    const homePerson = graph(await readPage(code)).find((node) => node['@type'] === 'Person');
    const hub = await readPage(code, 'services');
    const hubNodes = graph(hub);
    assert.equal(hubNodes.find((node) => node['@type'] === 'ItemList').numberOfItems, services.length);
    for (const service of services) {
      const html = await readPage(code, `services/${service.slug}`);
      assert.ok(html.includes(`<h1>${service.names[code]}</h1>`));
      assert.ok(html.includes(service.descriptions[code].replaceAll('&', '&amp;')));
      const nodes = graph(html);
      const serviceNode = nodes.find((node) => node['@type'] === 'Service');
      const faq = nodes.find((node) => node['@type'] === 'FAQPage');
      const person = nodes.find((node) => node['@type'] === 'Person');
      assert.equal(serviceNode.provider['@id'], homePerson['@id']);
      assert.equal(person['@id'], homePerson['@id']);
      assert.equal(faq.mainEntity.length, service.faqs[code].length);
      assert.equal(serviceNode.subjectOf.length, service.related.length);
    }
  }
});

test('project facts and schema agree on series, seasons and author identity', async () => {
  for (const code of codes) {
    const home = graph(await readPage(code));
    const personId = home.find((node) => node['@type'] === 'Person')['@id'];
    const diary = graph(await readPage(code, 'projects/elens-diary'));
    const series = diary.find((node) => node['@type'] === 'TVSeries');
    assert.equal(series.numberOfEpisodes, 421);
    assert.equal(series.numberOfSeasons, 2);
    assert.equal(series.containsSeason.reduce((sum, season) => sum + season.numberOfEpisodes, 0), 421);
    const second = graph(await readPage(code, 'projects/elens-diary-2')).find((node) => node['@type'] === 'TVSeason');
    assert.equal(second.numberOfEpisodes, 224);
    assert.equal(second.partOfSeries['@id'], series['@id']);
    for (const project of projects) {
      const nodes = graph(await readPage(code, `projects/${project.slug}`));
      assert.equal(nodes.find((node) => node['@type'] === 'Person')['@id'], personId);
      const work = nodes.find((node) => node['@id']?.endsWith('#work'));
      assert.ok(Array.isArray(work.citation));
      assert.equal(work.sameAs, undefined, 'Related sources must not be equated with the work');
    }
    const paper = await readPage(code, 'projects/paper-dream');
    assert.ok(paper.includes(`<dt>${interfaceCopy[code].broadcaster}</dt><dd>SHANT TV</dd>`));
    assert.ok(paper.includes(`<dt>${interfaceCopy[code].volume}</dt><dd>${projects.find((p) => p.slug === 'paper-dream').credit[code]}</dd>`));
  }
});

test('book and press hubs contain their own content and consistent book editions', async () => {
  for (const code of codes) {
    const books = await readPage(code, 'books');
    assert.equal((books.match(/class="book-card"/g) ?? []).length, 2);
    assert.doesNotMatch(books, /class="project-grid/);
    assert.match(books, /9789939050690/);
    assert.match(books, /2021/);
    const bookNodes = graph(books).filter((node) => node['@type'] === 'Book');
    const homeBooks = graph(await readPage(code)).filter((node) => node['@type'] === 'Book');
    assert.deepEqual(bookNodes, homeBooks);
    assert.equal(bookNodes[1].datePublished, '2024');
    const press = await readPage(code, 'press');
    assert.match(press, /class="press-list"/);
    assert.doesNotMatch(press, /class="project-grid/);
    for (const hub of hubs) assert.match(await readPage(code, hub.slug), /BreadcrumbList/);
  }
});

test('localized result counts and optional public contact handle real edge cases', () => {
  assert.equal(resultLabel(1, 'ru'), '1 результат');
  assert.equal(resultLabel(2, 'ru'), '2 результата');
  assert.equal(resultLabel(11, 'ru'), '11 результатов');
  assert.equal(resultLabel(21, 'ru'), '21 результат');
  assert.equal(resultLabel(0, 'en'), '0 results');
  assert.equal(publicContactEmail(''), '');
  assert.equal(publicContactEmail(' editor@example.com '), 'editor@example.com');
  assert.equal(publicContactEmail('editor@example.com?bcc=other@example.com'), '');
  assert.equal(publicContactEmail('invalid-address'), '');
});
