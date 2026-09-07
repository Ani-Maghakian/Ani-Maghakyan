import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { localizedPath } from '../scripts/seo-page-data.mjs';
import { writings } from '../lib/writings.mjs';
import { originalProjectPosters, posterPreviews } from '../lib/project-posters.mjs';

const root = resolve('dist/client');
const codes = ['hy', 'en', 'ru'];
const readPage = (code, tail = '') => readFile(resolve(root, localizedPath(code, tail), 'index.html'), 'utf8');
const graph = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];

test('literary previews preserve original attribution, dates and language in every locale', async () => {
  assert.equal(writings.length, 5);
  assert.equal(new Set(writings.map((work) => work.source)).size, 5);
  for (const code of codes) {
    const html = await readPage(code, 'writings');
    const home = await readPage(code);
    const personId = graph(home).find((node) => node['@type'] === 'Person')['@id'];
    const list = graph(html).find((node) => node['@type'] === 'ItemList');
    assert.equal((html.match(/class="writing-entry"/g) ?? []).length, 5);
    assert.equal(list.numberOfItems, 5);
    assert.match(home, /writings\/#ruins/);
    for (const [index, work] of writings.entries()) {
      assert.equal(new URL(work.source).hostname, 'maganuell.blogspot.com');
      assert.ok(html.includes(`id="${work.slug}"`));
      assert.ok(html.includes(`datetime="${work.date}"`));
      assert.ok(html.includes(`href="${work.source}"`));
      assert.equal(list.itemListElement[index].item.url, work.source);
      assert.equal(list.itemListElement[index].item.datePublished, work.date);
      assert.equal(list.itemListElement[index].item.inLanguage, 'hy');
      assert.equal(list.itemListElement[index].item.author['@id'], personId);
    }
  }
});

test('all six original posters are complete files and appear on all localized project pages', async () => {
  const sizes = { 'se-la-vi': 1034572, 'life-after-war': 182934, 'mi-gexecik-or': 107501, blockade: 890168, 'mtmtik-prptik': 666511, 'dear-sahmi': 652988 };
  for (const [slug, poster] of Object.entries(originalProjectPosters)) {
    assert.equal((await stat(resolve(root, poster.src.slice(1)))).size, sizes[slug]);
    for (const preview of posterPreviews(slug)) {
      const data = await readFile(resolve(root, preview.src.slice(1)));
      assert.equal(data.toString('ascii', 8, 12), 'WEBP');
      assert.ok(data.length < sizes[slug], `${slug} preview should reduce transfer size`);
    }
    for (const code of codes) {
      const html = await readPage(code, `projects/${slug}`);
      const img = [...html.matchAll(/<img\b[^>]*>/g)].find(([tag]) => tag.includes(poster.src))?.[0];
      assert.ok(img, `${code}/${slug} original image`);
      assert.ok(img.includes(`width="${poster.width}"`));
      assert.ok(img.includes(`height="${poster.height}"`));
      for (const preview of posterPreviews(slug)) assert.ok(img.includes(`${preview.src} ${preview.width}w`));
      assert.match(html, /<figcaption><a href="[^"]+original\.(jpg|png)"/);
      assert.ok(graph(html).find((node) => node['@id']?.endsWith('#work')).image.endsWith(poster.src));
    }
  }
});
