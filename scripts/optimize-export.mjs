import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('dist/client');
let optimized = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if (!path.endsWith('.html')) continue;

    const before = readFileSync(path, 'utf8');
    const after = before
      // Avoid third-party font CSS on the critical rendering path. The design
      // already declares robust serif/sans fallback stacks in local CSS.
      .replace(/<link\b[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\s*/gi, '');

    if (after !== before) {
      writeFileSync(path, after);
      optimized += 1;
    }
  }
}

walk(root);
console.log(`Optimized critical rendering path in ${optimized} exported HTML files.`);
