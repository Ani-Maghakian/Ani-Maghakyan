import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';
import { originalProjectPosters } from '../lib/project-posters.mjs';
import { writings } from '../lib/writings.mjs';

const selected = ['elens-diary', 'paper-dream', 'dear-sahmi', 'special-class', 'addiction', 'summer-of-84', 'blockade', 'forest-cottage', 'if-i-danced-again', 'se-la-vi', 'hotel-grand', 'white-shirt'];
const interaction = await readFile('public/home-interactions.js', 'utf8');

for (const locale of ['hy', 'en', 'ru']) {
  test(`${locale}: selection, original excerpts, language links and static interactions`, async () => {
    const path = locale === 'hy' ? '' : `${locale}/`;
    const html = await readFile(`dist/client/${path}index.html`, 'utf8');
    // DOM behavior only: this test makes no layout or browser-rendering claims.
    const dom = new JSDOM(html, { url: `https://example.com/${path}`, runScripts: 'outside-only', virtualConsole: new VirtualConsole() });
    const { window } = dom;
    const doc = window.document;
    // The exported canonical retains the deployment prefix on GitHub Pages.
    const basePath = new URL(doc.querySelector('link[rel="canonical"]').href).pathname.slice(0, -(path.length + 1));
    try {
      window.eval(interaction);
      assert.deepEqual([...doc.querySelectorAll('[data-selected-project]')].map((el) => el.dataset.selectedProject), selected);
      for (const slug of selected) {
        const card = doc.querySelector(`[data-selected-project="${slug}"]`);
        assert.equal(card.querySelector('.featured-text-cover'), null);
        assert.equal(card.querySelector('img').getAttribute('src'), `${basePath}${originalProjectPosters[slug].src}`);
        assert.ok(card.querySelector('img').getAttribute('srcset'));
      }
      assert.ok(doc.querySelector('[data-selected-project="dear-sahmi"] img').getAttribute('src').includes('dear-sahmi-original.jpg'));
      const languageLinks = [...doc.querySelectorAll('.mobile-language-options a')];
      assert.equal(languageLinks.length, 3);
      assert.deepEqual(languageLinks.map((a) => new URL(a.href).pathname), ['/', '/en/', '/ru/'].map((path) => `${basePath}${path}`));
      assert.equal(languageLinks.filter((a) => a.getAttribute('aria-current') === 'page').length, 1);
      assert.equal(languageLinks.find((a) => a.getAttribute('aria-current') === 'page').textContent, locale.toUpperCase());
      for (const work of [writings[0], writings[1], writings[4]]) {
        const quote = [...doc.querySelectorAll('.writing-preview blockquote')].find((el) => el.textContent === work.excerpt);
        assert.ok(quote);
        assert.equal(quote.lang, 'hy');
        assert.equal(quote.getAttribute('cite'), work.source);
      }
      const input = doc.querySelector('.search-field input');
      const rows = () => [...doc.querySelectorAll('.filmography-table tbody tr')].filter((el) => !el.hidden);
      input.value = 'Elen';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      assert.equal(rows().length, 2, 'cross-language search finds both seasons');
      input.value = 'no-matching-project-xyz';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      assert.equal(rows().length, 0);
      assert.equal(doc.querySelector('[data-empty-state]').hidden, false);
      doc.querySelector('[data-clear-search]').click();
      assert.equal(rows().length, 47);
      assert.equal(doc.activeElement, input);
      assert.equal(doc.querySelector('[data-clear-search]').hidden, true);
      doc.querySelector('[data-filter="film"]').click();
      assert.ok(rows().length > 0);
      assert.ok(rows().every((el) => el.dataset.kind === 'film'));
      assert.equal(doc.querySelector('[data-filter="film"]').getAttribute('aria-pressed'), 'true');
      const menu = doc.querySelector('.mobile-menu');
      menu.open = true;
      menu.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      assert.equal(menu.open, false);
      assert.equal(doc.activeElement, menu.querySelector('summary'));
      const image = doc.querySelector('.featured-poster');
      image.hidden = false;
      image.dispatchEvent(new window.Event('error'));
      assert.equal(image.hidden, true);
    } finally {
      window.close();
    }
  });
}
