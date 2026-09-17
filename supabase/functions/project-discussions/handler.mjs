/** Dependency-injected handler: testable in Node and served by Deno on Supabase. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_KEYS = new Set(['project', 'author', 'body', 'language', 'parent_id', 'request_id', 'consent', 'website']);
const BAD_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export function validateSubmission(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid_request');
  if (Object.keys(value).some((key) => !ALLOWED_KEYS.has(key))) throw new Error('invalid_request');
  const { project, author, body, language, parent_id, request_id, consent, website = '' } = value;
  if (typeof project !== 'string' || project.length > 100 || !SLUG.test(project)
      || typeof author !== 'string' || author.trim().length < 2 || author.trim().length > 60
      || typeof body !== 'string' || body.trim().length < 5 || body.trim().length > 3000
      || BAD_CONTROL.test(author) || BAD_CONTROL.test(body) || /[\r\n]/.test(author)
      || !['hy', 'en', 'ru'].includes(language) || (parent_id !== null && !UUID.test(parent_id || ''))
      || !UUID.test(request_id || '') || consent !== true || website !== '') throw new Error('invalid_request');
  return { project, author: author.trim(), body: body.trim(), language, parent_id, request_id };
}

async function readBoundedJson(request) {
  const declared = request.headers.get('content-length');
  if (declared && Number(declared) > 20000) throw new Error('payload_too_large');
  if (!request.body) throw new Error('invalid_request');
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > 20000) { await reader.cancel(); throw new Error('payload_too_large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const part of chunks) { bytes.set(part, offset); offset += part.length; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new Error('invalid_request'); }
}

async function hmac(secret, value) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function createHandler({ getEnv, fetch: fetcher }) {
  return async function handle(request) {
    const origins = (getEnv('DISCUSSION_ALLOWED_ORIGINS') || 'https://ani-maghakian.github.io').split(',').map((s) => s.trim());
    const origin = request.headers.get('origin');
    const allowed = origin && origins.includes(origin);
    const headers = {
      'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff', 'Vary': 'Origin',
      ...(allowed ? { 'Access-Control-Allow-Origin': origin } : {})
    };
    const json = (value, status = 200, extra = {}) => new Response(JSON.stringify(value), { status, headers: { ...headers, ...extra } });
    if (!allowed) return json({ error: 'origin_denied' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: {
      ...headers, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600'
    } });
    if (!['GET', 'POST'].includes(request.method)) return json({ error: 'method_not_allowed' }, 405, { Allow: 'GET, POST, OPTIONS' });
    const site = getEnv('SUPABASE_URL');
    let secret = getEnv('SUPABASE_SERVICE_ROLE_KEY');
    if (!secret) {
      try { secret = Object.values(JSON.parse(getEnv('SUPABASE_SECRET_KEYS') || '{}'))[0]; } catch { /* Fail closed below. */ }
    }
    if (!site || !secret || getEnv('DISCUSSION_SUBMISSIONS_READY') !== 'true') return json({ error: 'not_configured' }, 503);
    const rpc = async (name, args) => {
      const response = await fetcher(`${site}/rest/v1/rpc/${name}`, {
        method: 'POST', headers: { apikey: secret, 'Content-Type': 'application/json',
          ...(secret.startsWith('eyJ') ? { Authorization: `Bearer ${secret}` } : {}) },
        body: JSON.stringify(args), signal: AbortSignal.timeout(10000)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'storage_failed');
      return result;
    };
    try {
      if (request.method === 'GET') {
        const url = new URL(request.url);
        const project = url.searchParams.get('project') || '';
        if (!SLUG.test(project) || project.length > 100) return json({ error: 'invalid_request' }, 400);
        const after = url.searchParams.get('after');
        let time = null;
        let id = null;
        if (after) {
          const parts = after.split('|');
          if (parts.length !== 2 || !UUID.test(parts[1]) || parts[0].length > 40 || !Number.isFinite(Date.parse(parts[0]))) return json({ error: 'invalid_cursor' }, 400);
          [time, id] = parts;
        }
        return json(await rpc('discussion_list', { p_project: project, p_after_time: time, p_after_id: id }));
      }
      if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) return json({ error: 'unsupported_media_type' }, 415);
      const value = validateSubmission(await readBoundedJson(request));
      // Do not assume an arbitrary request header is a trusted identity. The deployer
      // must verify the gateway's overwritten client-IP header before opting in.
      const headerName = getEnv('DISCUSSION_TRUSTED_IP_HEADER');
      if (!headerName || !/^[a-z0-9-]+$/.test(headerName)) return json({ error: 'rate_limit_not_configured' }, 503);
      const forwarded = request.headers.get(headerName);
      if (!forwarded || forwarded.length > 512) return json({ error: 'client_context_missing' }, 503);
      const actor = await hmac(secret, 'discussion-actor-v1:' + forwarded);
      const digest = await hmac(secret, 'discussion-request-v1:' + actor + ':' + JSON.stringify(value));
      const result = await rpc('discussion_submit', {
        p_project: value.project, p_author: value.author, p_body: value.body,
        p_language: value.language, p_parent: value.parent_id,
        p_request_id: value.request_id, p_digest: digest, p_actor_hash: actor
      });
      if (result.status !== 'pending') throw new Error('storage_failed');
      return json({ status: 'pending' }, 202);
    } catch (error) {
      const message = String(error?.message || 'storage_failed');
      if (message.includes('rate_limited') || message.includes('queue_full')) return json({ error: 'rate_limited' }, 429, { 'Retry-After': '600' });
      if (message.includes('unknown_project')) return json({ error: 'unknown_project' }, 404);
      if (message.includes('request_conflict')) return json({ error: 'request_conflict' }, 409);
      if (message.includes('payload_too_large')) return json({ error: 'payload_too_large' }, 413);
      if (['invalid_request','invalid_parent','parent_not_published'].some((code) => message.includes(code))) return json({ error: 'invalid_request' }, 400);
      // Never leak SQL errors, service keys, visitor text or internal details.
      return json({ error: 'temporarily_unavailable' }, 503);
    }
  };
}
