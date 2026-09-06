import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve('dist/client');
const read = (path) => readFile(resolve(root, path, 'index.html'), 'utf8');

for (const path of ['', 'en', 'ru', 'services/screenwriting', 'en/services/screenwriting', 'projects/elens-diary']) {
  test(`${path || 'home'} has no third-party font on the critical rendering path`, async () => {
    const html = await read(path);
    assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  });
}

test('all home locales expose the services cluster through crawlable navigation', async () => {
  for (const path of ['', 'en', 'ru']) {
    const html = await read(path);
    assert.match(html, /href="[^\"]*services\//);
  }
});
