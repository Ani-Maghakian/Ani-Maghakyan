import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { services, serviceHub } from '../lib/services.mjs';
import { collectSeoUrls } from '../scripts/submit-indexnow-seo.mjs';

const root = resolve('dist/client');
const read = (path) => readFile(resolve(root, path, 'index.html'), 'utf8');

async function collectFiles(dir, suffix) {
  const found = [];
  for (const entry of await readdir(dir)) {
    const path = resolve(dir, entry);
    if ((await stat(path)).isDirectory()) found.push(...await collectFiles(path, suffix));
    else if (path.endsWith(suffix)) found.push(path);
  }
  return found;
}

for (const path of ['', 'en', 'ru', 'services/screenwriting', 'en/services/screenwriting', 'projects/elens-diary']) {
  test(`${path || 'home'} has no third-party font on the critical rendering path`, async () => {
    const html = await read(path);
    assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  });
}

test('exported CSS does not carry embedded hero image payloads', async () => {
  const cssFiles = await collectFiles(root, '.css');
  assert.ok(cssFiles.length > 0);
  for (const path of cssFiles) {
    const css = await readFile(path, 'utf8');
    assert.doesNotMatch(css, /data:image\/jpeg;base64,/i, `${path} should not embed a JPEG data URL`);
  }
});

test('home locales ship static HTML without the React hydration runtime', async () => {
  for (const path of ['', 'en', 'ru']) {
    const html = await read(path);
    assert.doesNotMatch(html, /<script[^>]+src=["'][^"']*\/assets\/[^"']+\.js/i);
    assert.doesNotMatch(html, /rel=["']modulepreload["'][^>]+\.js/i);
    assert.match(html, /data-filter="all"/);
    assert.match(html, /data-filter="series"/);
    assert.match(html, /data-kind="series"/);
    assert.match(html, /filmography-table tbody/);
    assert.match(html, /i\.ytimg\.com/);
  }
});

test('all home locales expose the services cluster through crawlable navigation', async () => {
  for (const path of ['', 'en', 'ru']) {
    const html = await read(path);
    assert.match(html, /href="[^\"]*services\//);
  }
});

test('IndexNow submission covers the full multilingual services cluster', () => {
  const urls = new Set(collectSeoUrls('https://example.com'));
  const prefixes = ['', 'en/', 'ru/'];
  for (const prefix of prefixes) {
    assert.ok(urls.has(`https://example.com/${prefix}${serviceHub.slug}/`));
    for (const service of services) {
      assert.ok(urls.has(`https://example.com/${prefix}${serviceHub.slug}/${service.slug}/`));
    }
  }
});