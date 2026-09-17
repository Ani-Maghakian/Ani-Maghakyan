import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';
import { mediaItems } from '../lib/media-archive.mjs';
import { books } from '../lib/books.mjs';

const interaction = await readFile('public/site-interactions.js', 'utf8');

for (const locale of ['hy', 'en', 'ru']) {
  test(`${locale}: media archive stays readable without JS and searches across languages`, async () => {
    const path = locale === 'hy' ? '' : `${locale}/`;
    const html = await readFile(`dist/client/${path}press/index.html`, 'utf8');
    // DOM behavior only; real-browser visual checks cover typography and layout.
    const dom = new JSDOM(html, { url: `https://example.com/${path}press/`, runScripts: 'outside-only', virtualConsole: new VirtualConsole() });
    const { window } = dom;
    const doc = window.document;
    const visible = () => [...doc.querySelectorAll('.media-entry')].filter((entry) => !entry.hidden);
    const visibleGroups = () => [...doc.querySelectorAll('.media-group')].filter((group) => !group.hidden);
    const search = (query, event = 'input') => {
      input.value = query;
      input.dispatchEvent(new window.Event(event, { bubbles: true }));
    };
    const input = doc.querySelector('.archive-search-input');
    const clear = doc.querySelector('.archive-search-clear');
    try {
      assert.equal(visible().length, mediaItems.length);
      assert.equal(visibleGroups().length, 3);
      assert.equal(doc.querySelector('.archive-search-controls').hidden, true);
      assert.ok(doc.querySelector(`label[for="${input.id}"]`).textContent.trim());
      assert.equal(doc.querySelector('.masthead').parentElement, doc.body);
      window.eval(interaction);
      assert.equal(doc.querySelector('.archive-search-controls').hidden, false);

      for (const query of [' Hrachya   SARUKHAN ', 'ՀՐԱՉՅԱ ՍԱՐՈՒԽԱՆ', 'Грачья Сарухан']) {
        search(query);
        assert.deepEqual(visible().map((entry) => entry.id), ['sarukhan-2015'], 'translated names find the same interview in each locale');
        assert.equal(visibleGroups().length, 1);
        assert.equal(visibleGroups()[0].getAttribute('aria-labelledby'), 'journalism');
      }
      search('Armenpress');
      assert.deepEqual(visible().map((entry) => entry.id), ['taknuvra-bestseller-december-2025'], 'publication names are searchable');
      search(mediaItems.find((item) => item.id === 'captives-newsam-2023').summaries[locale]);
      assert.deepEqual(visible().map((entry) => entry.id), ['captives-newsam-2023'], 'the current-language summary is searchable');
      search('no-matching-archive-item-xyz');
      assert.equal(visible().length, 0);
      assert.equal(visibleGroups().length, 0);
      assert.equal(doc.querySelector('.archive-empty').hidden, false);
      assert.match(doc.querySelector('.archive-result-count').textContent, /^0\D/);
      assert.equal(clear.hidden, false);

      clear.click();
      assert.equal(input.value, '');
      assert.equal(visible().length, mediaItems.length);
      assert.equal(visibleGroups().length, 3);
      assert.equal(doc.querySelector('.archive-empty').hidden, true);
      assert.equal(clear.hidden, true);
      assert.equal(doc.activeElement, input);

      search('Armenpress');
      const groupLink = doc.querySelector('.archive-nav a[href="#interview"]');
      assert.ok(groupLink.getAttribute('aria-label').length > groupLink.childNodes[0].textContent.trim().length);
      groupLink.click();
      assert.equal(input.value, '', 'category links restore a filtered-out destination before navigation');
      assert.equal(visible().length, mediaItems.length);
      assert.equal(doc.querySelector('#interview').closest('.media-group').hidden, false);

      search('Armenpress');
      search('', 'search');
      assert.equal(visible().length, mediaItems.length, 'native search clear restores every item');
      const submit = new window.Event('submit', { cancelable: true });
      doc.querySelector('.archive-search').dispatchEvent(submit);
      assert.equal(submit.defaultPrevented, true);
    } finally {
      window.close();
    }
  });

  test(`${locale}: Books shares the real cover and preserves matching visible and schema order`, async () => {
    const path = locale === 'hy' ? '' : `${locale}/`;
    const html = await readFile(`dist/client/${path}books/index.html`, 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    try {
      const first = doc.querySelector('.book-card');
      const coverBook = books.find((book) => book.slug === first.id);
      assert.equal(first.id, 'topsy-turvy');
      assert.equal(first.querySelector('img').getAttribute('loading'), 'eager');
      assert.notEqual(doc.title, doc.querySelector('h1').textContent, 'search title is descriptive while the visible heading stays concise');
      for (const name of locale === 'hy' ? ['Տակնուվրա', 'Ժամանակավոր կանգառ'] : locale === 'en' ? ['Taknuvra', 'Temporary Stop'] : ['Такнувра', 'Временная остановка']) {
        assert.ok(doc.title.includes(name));
      }
      const meta = (key) => doc.querySelector(`meta[property="${key}"],meta[name="${key}"]`)?.content;
      assert.ok(meta('og:image').endsWith(coverBook.cover.src));
      assert.equal(meta('og:image:width'), String(coverBook.cover.width));
      assert.equal(meta('og:image:height'), String(coverBook.cover.height));
      assert.ok(meta('og:image:alt').includes(coverBook.titles[locale]));
      assert.equal(meta('twitter:image'), meta('og:image'));
      assert.equal(meta('twitter:image:alt'), meta('og:image:alt'));
      assert.equal(meta('twitter:title'), doc.title);
      assert.equal(meta('twitter:description'), meta('description'));
      const nodes = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
      const listedIds = nodes.find((node) => node['@type'] === 'ItemList').itemListElement.map(({ item }) => item['@id'].split('#book-')[1]);
      assert.deepEqual(listedIds, [...doc.querySelectorAll('.book-card')].map((card) => card.id));
    } finally {
      dom.window.close();
    }
  });
}
