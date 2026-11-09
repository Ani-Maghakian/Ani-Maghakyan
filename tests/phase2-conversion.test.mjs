import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { projects, localizedPath } from '../scripts/seo-page-data.mjs';
import { services } from '../lib/services.mjs';
import { books } from '../lib/books.mjs';
import { publicContactEmail } from '../lib/site-copy.mjs';
import { integrateHtml } from '../lib/project-discussions.mjs';

const config = { repository: 'Ani-Maghakian/Ani-Maghakyan', provider: 'github-issues', enabled: false };
const readPage = (locale, tail) => readFileSync(resolve('dist/client', localizedPath(locale, tail), 'index.html'), 'utf8');
const graph = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];

test('production inquiries survive discussion postprocessing in every language and project', () => {
  for (const locale of ['hy', 'en', 'ru']) {
    for (const project of projects) {
      const tail = `projects/${project.slug}`;
      const html = integrateHtml(readPage(locale, tail), `${localizedPath(locale, tail)}/index.html`, config);
      const contactLinks = [...html.matchAll(/<a\b([^>]*data-track="view_contact"[^>]*)>/g)];
      assert.equal(contactLinks.filter(([, attrs]) => attrs.includes('data-source="project"')).length, 1, tail);
      for (const [, attrs] of contactLinks) {
        assert.match(attrs, /href="[^"#]*work-with-ani\/\?project=/, tail);
        assert.doesNotMatch(attrs, /href="#discussion"/, tail);
      }
      assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
      assert.ok(graph(html).some((node) => ['TVSeries', 'TVSeason', 'Movie', 'CreativeWork'].includes(node['@type'])));
    }
  }
});

test('service landing pages retain buyer context, proof, portfolio and usable inquiries', () => {
  for (const locale of ['hy', 'en', 'ru']) {
    for (const service of services) {
      const tail = `services/${service.slug}`;
      const html = integrateHtml(readPage(locale, tail), `${localizedPath(locale, tail)}/index.html`, config);
      assert.match(html, /2[ ,]300\+/);
      assert.match(html, /id="relevant-work"/);
      assert.match(html, /href="#relevant-work"/);
      assert.ok(html.includes(`?service=${service.slug}`));
      assert.match(html, /data-track="view_contact"/);
      if (publicContactEmail(process.env.CONTACT_EMAIL)) assert.match(html, /mailto:maghakianscripts@gmail.com/);
      assert.match(html, /data-track="contact_instagram"/);
      assert.ok(!html.includes('currently closed'));
      assert.ok(graph(html).some((node) => node['@type'] === 'Service'));
    }
  }
});

test('book purchase links distinguish editions and do not invent stock, prices or offers', () => {
  for (const locale of ['hy', 'en', 'ru']) {
    const html = readPage(locale, 'books/topsy-turvy');
    const links = [...html.matchAll(/<a\b([^>]*data-track="book_retailer_click"[^>]*)>/g)];
    assert.equal(links.length, 2);
    assert.match(links[0][1], /data-edition="2021"/);
    assert.match(links[1][1], /data-edition="2024"/);
    for (const retailer of books.find((book) => book.slug === 'topsy-turvy').retailers) assert.ok(html.includes(retailer.url));
    const book = graph(html).find((node) => node['@type'] === 'Book');
    assert.equal(book.isbn, '9789939050690');
    assert.equal(book.offers, undefined);
    assert.equal(book.availability, undefined);
    assert.doesNotMatch(readPage(locale, 'books/temporary-stop'), /data-track="book_retailer_click"/);
  }
});

test('only the existing public business email is displayed', () => {
  assert.equal(publicContactEmail(' MAGHAKIANSCRIPTS@gmail.com '), 'maghakianscripts@gmail.com');
  for (const value of ['', 'ani@example.com', 'maghakianscripts@gmail.com?bcc=private@example.com', '<invalid>']) assert.equal(publicContactEmail(value), '');
});
