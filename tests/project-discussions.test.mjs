import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { buildIssueDraft, parseIssueBody, REPOSITORY, MAX_PREFILL_URL } from '../public/project-discussions-core.js';
import { discussionCopy, discussionFragment, integrateHtml, pageIdentity, validateConfig, mailto } from '../lib/project-discussions.mjs';
import { opinionFromIssue, validateOpinions } from '../lib/project-opinions.mjs';

const config = { enabled: true, provider: 'github-issues', repository: REPOSITORY, contactEmail: 'maghaqyan@gmail.com' };
const base = { repository: REPOSITORY, project: 'mi-gexecik-or', locale: 'hy', name: 'Test reader', body: 'Fixture text, not a public review.', consent: true };
const approved = { id: 'gh-101', project: base.project, locale: 'hy', name: '<b>Test reader</b>', body: '<script>alert(1)</script> Not a real review.', parent: '', source: `https://github.com/${REPOSITORY}/issues/101`, createdAt: '2026-09-17T10:00:00Z', approvedAt: '2026-09-17T11:00:00Z', reviewedBy: 'Ani-Maghakian', sourceSha256: 'a'.repeat(64) };

for (const locale of ['hy', 'en', 'ru']) {
  test(`${locale}: draft round trip and correct public repository`, () => {
    const result = buildIssueDraft({ ...base, locale });
    const url = new URL(result.url);
    assert.equal(url.origin, 'https://github.com');
    assert.equal(url.pathname, `/${REPOSITORY}/issues/new`);
    assert.deepEqual([...url.searchParams.keys()], ['title', 'body']);
    assert.equal(url.searchParams.get('title'), '[site-opinion:mi-gexecik-or]');
    assert.equal(parseIssueBody(url.searchParams.get('body')).locale, locale);
    assert.equal(result.manualCopy, false);
  });
  test(`${locale}: accessible form and honest handoff, shared reviewed thread`, () => {
    const html = discussionFragment(base.project, locale, config, [approved]);
    assert.ok(html.includes(discussionCopy[locale].notice));
    assert.match(html, /name="consent" type="checkbox" required/);
    assert.match(html, /id="opinion-gh-101"/);
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.doesNotMatch(html, /<script>alert/);
    assert.doesNotMatch(html, /supabase|data-endpoint|fetch\(/i);
  });
}
test('long multilingual text uses a copy/paste fallback, not a 414 or truncation', () => {
  const result = buildIssueDraft({ ...base, body: 'Հայերեն '.repeat(370) });
  assert.equal(result.manualCopy, true);
  assert.ok(result.url.length < MAX_PREFILL_URL);
  assert.equal(new URL(result.url).searchParams.has('body'), false);
  assert.equal(parseIssueBody(result.body).body, 'Հայերեն '.repeat(370).trim());
});
test('consent, size, project, repository, locale and control characters are validated', () => {
  for (const changes of [{ consent: false }, { name: 'a' }, { body: 'x' }, { body: 'x'.repeat(3001) }, { name: 'x\ny' }, { body: 'hello\u0000world' }, { locale: 'de' }, { project: '../../bad' }, { repository: 'evil/repo' }, { parent: 'javascript:x' }]) {
    assert.throws(() => buildIssueDraft({ ...base, ...changes }));
  }
});
test('unpublished visitor text has no local storage, backend requests or analytics', () => {
  const script = readFileSync('public/project-discussions.js', 'utf8');
  assert.doesNotMatch(script, /localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon|gtag\(/);
  assert.match(script, /link\.href = 'https:\/\/github\.com\/Ani-Maghakian\/Ani-Maghakyan\/issues\/new'/);
  assert.match(script, /It has not been submitted|not submission/);
});
test('disabled new comments retain published opinions without a dummy form', () => {
  const html = discussionFragment(base.project, 'en', { ...config, enabled: false }, [approved]);
  assert.doesNotMatch(html, /<form/);
  assert.match(html, /id="opinion-gh-101"/);
});
test('configuration rejects external backends and wrong contact', () => {
  assert.equal(validateConfig(config), config);
  for (const patch of [{ endpoint: 'https://example.com' }, { provider: 'supabase' }, { repository: 'wrong/repo' }, { contactEmail: 'wrong@example.com' }]) assert.throws(() => validateConfig({ ...config, ...patch }));
});
test('routing preserves canonical, metadata, JS and source links', () => {
  const html = '<html><head><link rel="canonical" href="https://ani-maghakian.github.io/Ani-Maghakyan/en/projects/mi-gexecik-or/"><script type="application/ld+json">{"x":1}</script></head><body><main><h1>Mi Gexecik Or</h1><a class="secondary" href="/work-with-ani/">Discuss a project</a><a href="https://youtube.com/watch?v=x">Watch</a></main></body></html>';
  const result = integrateHtml(html, 'en/projects/mi-gexecik-or/index.html', config);
  assert.match(result, /href="#discussion"/);
  assert.ok(result.includes('<script type="application/ld+json">{"x":1}</script>'));
  assert.match(result, /href="https:\/\/youtube.com\/watch\?v=x"/);
  assert.ok(result.includes(mailto('en', 'Mi Gexecik Or')));
  assert.equal(integrateHtml(result, 'en/projects/mi-gexecik-or/index.html', config), result);
  assert.equal(pageIdentity('ru/projects/mi-gexecik-or/index.html').project, base.project);
});
test('unknown, duplicate, orphaned and cross-project approved records fail closed', () => {
  validateOpinions([approved], new Set([base.project]));
  assert.throws(() => validateOpinions([approved], new Set(['other-project'])));
  assert.throws(() => validateOpinions([approved, approved]));
  assert.throws(() => validateOpinions([{ ...approved, parent: 'gh-999' }]));
  assert.throws(() => validateOpinions([approved, { ...approved, id: 'gh-102', source: `https://github.com/${REPOSITORY}/issues/102`, project: 'other-project', parent: approved.id }]));
});
test('only an explicit reviewed issue snapshot is publishable', () => {
  const issue = { number: 101, html_url: approved.source, title: '[site-opinion:mi-gexecik-or]', created_at: approved.createdAt, body: buildIssueDraft(base).body };
  const result = opinionFromIssue(issue, 'Ani-Maghakian', approved.approvedAt, approved.sourceSha256);
  validateOpinions([result]);
  assert.equal(result.body, base.body);
  assert.throws(() => opinionFromIssue({ ...issue, html_url: 'https://example.com' }, 'Ani-Maghakian', approved.approvedAt, approved.sourceSha256));
  assert.throws(() => opinionFromIssue({ ...issue, pull_request: {} }, 'Ani-Maghakian', approved.approvedAt, approved.sourceSha256));
});
test('published snapshots are valid and contain no synthetic QA fixtures', () => {
  const records = validateOpinions(JSON.parse(readFileSync('data/project-opinions.json', 'utf8')));
  for (const record of records) assert.ok(!record.body.includes('Fixture text, not a public review.') && !record.body.includes('Not a real review.'));
});

// A handoff is a real destination even before preparation, never a href-less pseudo-link.
test('idle handoff has no visitor text and release CSS adds no blocking request', () => {
  const html = '<html><head><link rel="canonical" href="https://ani-maghakian.github.io/Ani-Maghakyan/projects/mi-gexecik-or/"></head><body><main><h1>Project</h1></main></body></html>';
  const css = readFileSync('public/project-discussions.css', 'utf8');
  const result = integrateHtml(html, 'projects/mi-gexecik-or/index.html', config, '?v=test', [], css);
  assert.match(result, /href="https:\/\/github\.com\/Ani-Maghakian\/Ani-Maghakyan\/issues\/new" data-github-handoff/);
  assert.match(result, /<style data-project-discussion-styles>/);
  assert.doesNotMatch(result, /<link[^>]*project-discussions\.css/);
  assert.ok(result.includes('.project-discussion'));
});
