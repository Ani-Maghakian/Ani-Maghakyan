import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve('.lighthouseci');
const files = readdirSync(dir).filter((file) => file.endsWith('.json') && file !== 'manifest.json');
const rows = [];

for (const file of files) {
  const report = JSON.parse(readFileSync(resolve(dir, file), 'utf8'));
  if (!report?.categories || !report?.finalUrl) continue;
  const score = (key) => Math.round((report.categories[key]?.score ?? 0) * 100);
  const metric = (id) => report.audits?.[id]?.numericValue ?? null;
  rows.push({
    url: report.finalUrl,
    performance: score('performance'),
    accessibility: score('accessibility'),
    bestPractices: score('best-practices'),
    seo: score('seo'),
    fcp: metric('first-contentful-paint'),
    lcp: metric('largest-contentful-paint'),
    tbt: metric('total-blocking-time'),
    cls: metric('cumulative-layout-shift'),
    speedIndex: metric('speed-index'),
    inp: metric('interaction-to-next-paint'),
  });
}

if (!rows.length) {
  console.error('No Lighthouse JSON reports found.');
  process.exitCode = 1;
} else {
  console.log('\nLIGHTHOUSE QUALITY MATRIX');
  console.table(rows.map((row) => ({
    URL: row.url,
    Performance: row.performance,
    Accessibility: row.accessibility,
    'Best Practices': row.bestPractices,
    SEO: row.seo,
    'FCP ms': Math.round(row.fcp ?? 0),
    'LCP ms': Math.round(row.lcp ?? 0),
    'TBT ms': Math.round(row.tbt ?? 0),
    CLS: row.cls == null ? 'n/a' : Number(row.cls.toFixed(3)),
    'Speed Index ms': Math.round(row.speedIndex ?? 0),
  })));
}
