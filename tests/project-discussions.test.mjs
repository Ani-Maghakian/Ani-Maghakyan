import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { discussionCopy, integrateHtml, pageIdentity, validateConfig, mailto } from '../lib/project-discussions.mjs';
import { createHandler, validateSubmission } from '../supabase/functions/project-discussions/handler.mjs';

const config = { enabled: true, endpoint: 'https://exampleproject.supabase.co/functions/v1/project-discussions', contactEmail: 'maghaqyan@gmail.com' };
const valid = { project: 'mi-gexecik-or', author: 'Visitor', body: 'A thoughtful comment.', language: 'hy', parent_id: null, request_id: '42d3a8b3-4e69-4a72-92d5-347ae6fb3c7b', consent: true, website: '' };
const origin = 'https://ani-maghakian.github.io';
function setup(override = {}, responder = () => new Response(JSON.stringify({ status: 'pending' }))) {
  const calls = [];
  const env = { SUPABASE_URL: 'https://exampleproject.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-server-only-secret-not-a-real-key', DISCUSSION_SUBMISSIONS_READY: 'true', DISCUSSION_TRUSTED_IP_HEADER: 'x-test-trusted-ip', ...override };
  const handler = createHandler({ getEnv: (name) => env[name], fetch: async (url, options) => { calls.push({ url, options }); return responder(url, options); } });
  return { handler, calls };
}
function post(value = valid, headers = {}) {
  return new Request(config.endpoint, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'x-test-trusted-ip': '192.0.2.1', ...headers }, body: JSON.stringify(value) });
}
function html(locale = 'hy', project = true) {
  const prefix = locale === 'hy' ? '' : locale + '/';
  const path = project ? 'projects/mi-gexecik-or/' : '';
  const old = { hy: 'Քննարկել նախագիծը', en: 'Discuss a project', ru: 'Обсудить проект' }[locale];
  return `<!doctype html><html lang="${locale}"><head><link rel="canonical" href="${origin}/Ani-Maghakyan/${prefix}${path}"><script type="application/ld+json">{"text":"${old}"}</script></head><body><main><h1>Title</h1><a class="secondary" href="/Ani-Maghakyan/${prefix}work-with-ani/">${old}</a><a data-track="contact_instagram" href="https://www.instagram.com/maghakianscripts/" target="_blank">Instagram contact</a><a class="profile" href="https://www.instagram.com/maghakianscripts/">Social profile</a><a href="https://www.youtube.com/watch?v=official">Watch</a></main></body></html>`;
}

test('language-independent project identity, including localized pages', () => {
  for (const locale of ['hy', 'en', 'ru']) {
    const prefix = locale === 'hy' ? '' : locale + '/';
    assert.deepEqual(pageIdentity(prefix + 'projects/mi-gexecik-or/index.html'), { locale, tail: 'projects/mi-gexecik-or', project: 'mi-gexecik-or' });
  }
  assert.equal(pageIdentity('services/screenwriting/index.html').project, null);
});

test('each project discussion anchor stays local while business actions use approved mail', () => {
  for (const locale of ['hy', 'en', 'ru']) {
    const prefix = locale === 'hy' ? '' : locale + '/';
    const result = integrateHtml(html(locale), prefix + 'projects/mi-gexecik-or/index.html', config);
    assert.match(result, /href="#discussion" data-track="view_discussion"/);
    assert.match(result, /data-project="mi-gexecik-or"/);
    assert.ok(result.includes(discussionCopy[locale].heading));
    assert.match(result, /href="mailto:maghaqyan@gmail.com\?subject=/);
    assert.doesNotMatch(result, /data-track="contact_instagram"/);
    assert.match(result, /class="profile" href="https:\/\/www.instagram.com\/maghakianscripts\/"/);
    assert.match(result, /href="https:\/\/www.youtube.com\/watch\?v=official"/);
    assert.match(result, /href="\/Ani-Maghakyan\/project-discussions.css/);
    assert.equal(integrateHtml(result, prefix + 'projects/mi-gexecik-or/index.html', config), result);
    assert.equal(result.match(/<script type="application\/ld\+json">.*?<\/script>/)[0], html(locale).match(/<script type="application\/ld\+json">.*?<\/script>/)[0]);
  }
});

test('homepage is a business proposal, not a discussion of an unspecified project', () => {
  const result = integrateHtml(html('en', false), 'en/index.html', config);
  assert.doesNotMatch(result, /id="discussion"/);
  assert.match(result, /Send a collaboration proposal/);
  assert.ok(mailto('hy').startsWith('mailto:maghaqyan@gmail.com?subject='));
});

test('disabled integration never displays a dummy submission form or backend endpoint', () => {
  const result = integrateHtml(html(), 'projects/mi-gexecik-or/index.html', { ...config, enabled: false, endpoint: '' });
  assert.doesNotMatch(result, /<form data-discussion-form/);
  assert.match(result, /data-enabled="false"/);
  assert.doesNotMatch(result, /exampleproject.supabase/);
});

test('configuration fails closed on missing endpoint, credentials, wrong provider, or recipient', () => {
  for (const endpoint of ['', 'http://exampleproject.supabase.co/functions/v1/project-discussions', 'https://evil.example/functions/v1/project-discussions', config.endpoint + '?secret=bad', 'https://user:pass@exampleproject.supabase.co/functions/v1/project-discussions']) {
    assert.throws(() => validateConfig({ ...config, endpoint }));
  }
  assert.throws(() => validateConfig({ ...config, contactEmail: 'other@example.com' }));
});

test('visitor cannot set status, moderator role, parent shape, or bypass consent', () => {
  for (const change of [{ status: 'approved' }, { role: 'admin' }, { consent: false }, { project: '../admin' }, { parent_id: 'wrong' }, { author: ' ' }, { body: 'a' }, { language: 'de' }, { website: 'spam' }, { body: 'a'.repeat(3001) }, { author: 'ab\ncd' }]) {
    assert.throws(() => validateSubmission({ ...valid, ...change }));
  }
  assert.equal(validateSubmission({ ...valid, body: '<script>alert(1)</script>' }).body, '<script>alert(1)</script>');
});

test('anonymous valid submission returns pending only after storage responds', async () => {
  const { handler, calls } = setup();
  const response = await handler(post());
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { status: 'pending' });
  assert.equal(calls.length, 1);
  const args = JSON.parse(calls[0].options.body);
  assert.equal(args.p_project, valid.project);
  assert.equal(args.p_parent, null);
  assert.match(args.p_actor_hash, /^[0-9a-f]{64}$/);
  assert.equal(args.status, undefined);
  assert.ok(!calls[0].options.body.includes('192.0.2.1'));
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
});

test('different language pages query the same project key', async () => {
  const { handler, calls } = setup({}, () => new Response(JSON.stringify({ items: [], next_cursor: null })));
  for (const locale of ['hy', 'en', 'ru']) {
    const response = await handler(new Request(config.endpoint + '?project=mi-gexecik-or', { headers: { Origin: origin, 'Accept-Language': locale } }));
    assert.equal(response.status, 200);
  }
  assert.equal(new Set(calls.map((call) => call.options.body)).size, 1);
});

test('missing settings or untrusted origin cannot store data', async () => {
  for (const env of [{ SUPABASE_SERVICE_ROLE_KEY: '' }, { DISCUSSION_SUBMISSIONS_READY: 'false' }, { DISCUSSION_TRUSTED_IP_HEADER: '' }]) {
    const { handler, calls } = setup(env);
    assert.equal((await handler(post())).status, 503);
    assert.equal(calls.length, 0);
  }
  const { handler, calls } = setup();
  assert.equal((await handler(post(valid, { Origin: 'https://attacker.example' }))).status, 403);
  assert.equal(calls.length, 0);
});

test('oversized, malformed and privileged writes fail without hitting database', async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(post({ ...valid, status: 'approved' }))).status, 400);
  assert.equal((await handler(post({ ...valid, body: 'a'.repeat(21000) }))).status, 413);
  assert.equal((await handler(new Request(config.endpoint, { method: 'DELETE', headers: { Origin: origin } }))).status, 405);
  assert.equal(calls.length, 0);
});

test('storage failure never becomes success and never exposes internal error text', async () => {
  const { handler } = setup({}, () => new Response(JSON.stringify({ message: 'private SQL details and secret' }), { status: 500 }));
  const response = await handler(post());
  assert.equal(response.status, 503);
  const body = await response.text();
  assert.ok(!body.includes('private'));
  assert.ok(!body.includes('secret'));
});

test('rate limit produces retry response, not an accepted comment', async () => {
  const { handler } = setup({}, () => new Response(JSON.stringify({ message: 'rate_limited' }), { status: 400 }));
  const response = await handler(post());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '600');
});

test('invalid cursor cannot reach database', async () => {
  const { handler, calls } = setup();
  const response = await handler(new Request(config.endpoint + '?project=mi-gexecik-or&after=invalid', { headers: { Origin: origin } }));
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});

test('migration declares default-deny permissions and parent-publication filtering', () => {
  const sql = readFileSync(new URL('../supabase/migrations/202609170001_project_discussions.sql', import.meta.url), 'utf8');
  assert.equal((sql.match(/enable row level security/g) || []).length, 4);
  assert.match(sql, /from public, anon, authenticated/);
  assert.match(sql, /parent\.status = 'approved'/);
  assert.doesNotMatch(sql, /grant\s+(?:all|insert|update|delete).*\bto\s+(?:anon|authenticated)/i);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /'pending', p_request_id, p_digest/);
});
