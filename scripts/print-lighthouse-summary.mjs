import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve('.lighthouseci');
const files = readdirSync(dir).filter((file) => file.endsWith('.json') && file !== 'manifest.json');
const rows = [];
const reports = [];

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
  });
  reports.push(report);
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

  for (const report of reports) {
    console.log(`\nAUDIT FAILURES — ${report.finalUrl}`);
    for (const categoryKey of ['accessibility', 'best-practices', 'seo']) {
      const category = report.categories[categoryKey];
      const failures = (category?.auditRefs ?? [])
        .filter((ref) => ref.weight > 0)
        .map((ref) => ({ ref, audit: report.audits?.[ref.id] }))
        .filter(({ audit }) => audit && audit.score != null && audit.score < 1);
      if (!failures.length) continue;
      console.log(`  ${category.title}:`);
      for (const { ref, audit } of failures) {
        const detail = audit.displayValue ? ` — ${audit.displayValue}` : '';
        console.log(`    - ${ref.id}: score=${audit.score} — ${audit.title}${detail}`);
      }
    }

    const opportunities = Object.entries(report.audits ?? {})
      .map(([id, audit]) => ({ id, audit }))
      .filter(({ audit }) => audit?.details?.type === 'opportunity' && (audit.numericValue ?? 0) > 0)
      .sort((a, b) => (b.audit.numericValue ?? 0) - (a.audit.numericValue ?? 0))
      .slice(0, 8);
    if (opportunities.length) {
      console.log('  Performance opportunities:');
      for (const { id, audit } of opportunities) {
        const detail = audit.displayValue ? ` — ${audit.displayValue}` : '';
        console.log(`    - ${id}: ${audit.title}${detail}`);
      }
    }
  }
}
