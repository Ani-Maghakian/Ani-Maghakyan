/** Pure browser/Node contract. This module has no network or storage side effects. */
export const REPOSITORY = 'Ani-Maghakian/Ani-Maghakyan';
export const MAX_PREFILL_URL = 7000;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const blockedControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export function normalizeOpinion(input) {
  if (!input || input.consent !== true) throw new Error('Publication consent is required.');
  const { project, locale } = input;
  const name = String(input.name ?? '').trim();
  const body = String(input.body ?? '').replace(/\r\n?/g, '\n').trim();
  const parent = input.parent || '';
  if (!slugPattern.test(project) || !['hy', 'en', 'ru'].includes(locale)
    || name.length < 2 || name.length > 60 || /[\r\n]/.test(name)
    || body.length < 5 || body.length > 3000 || blockedControls.test(name + body)
    || (parent && !/^gh-[1-9]\d*$/.test(parent))) {
    throw new Error('Invalid opinion fields.');
  }
  return { project, locale, name, body, parent };
}

export function buildIssueDraft(input) {
  if (input.repository !== REPOSITORY) throw new Error('Unexpected repository.');
  const opinion = normalizeOpinion(input);
  const marker = `<!-- MAGHAKIAN_OPINION_V2 project=${opinion.project} locale=${opinion.locale} parent=${opinion.parent || 'none'} -->`;
  const body = `${marker}\nName: ${opinion.name}\n\n${opinion.body}`;
  const title = `[site-opinion:${opinion.project}]`;
  const url = new URL(`https://github.com/${REPOSITORY}/issues/new`);
  // Only supported public query parameters. Never pass labels, tokens or assignees.
  url.searchParams.set('title', title);
  url.searchParams.set('body', body);
  const manualCopy = url.href.length > MAX_PREFILL_URL;
  if (manualCopy) url.searchParams.delete('body');
  return { url: url.href, body, manualCopy };
}

export function parseIssueBody(body) {
  const match = /^<!-- MAGHAKIAN_OPINION_V2 project=([a-z0-9-]+) locale=(hy|en|ru) parent=(none|gh-[1-9]\d*) -->\nName: ([^\n]+)\n\n([\s\S]*)$/.exec(String(body).replace(/\r\n/g, '\n'));
  if (!match) throw new Error('The issue is not a complete website-opinion draft.');
  return normalizeOpinion({ project: match[1], locale: match[2], parent: match[3] === 'none' ? '' : match[3], name: match[4], body: match[5], consent: true });
}
