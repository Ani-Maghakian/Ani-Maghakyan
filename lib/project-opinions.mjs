import { REPOSITORY, normalizeOpinion, parseIssueBody } from '../public/project-discussions-core.js';

export function validateOpinions(records, allowedProjects) {
  if (!Array.isArray(records)) throw new Error('Opinions must be an array.');
  const seen = new Set();
  for (const item of records) {
    normalizeOpinion({ ...item, consent: true });
    if (!/^gh-[1-9]\d*$/.test(item.id) || seen.has(item.id)
      || item.source !== `https://github.com/${REPOSITORY}/issues/${item.id.slice(3)}`
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(item.createdAt)
      || !Number.isFinite(Date.parse(item.createdAt))
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(item.approvedAt)
      || !Number.isFinite(Date.parse(item.approvedAt))
      || !/^[a-zA-Z0-9-]{1,39}$/.test(item.reviewedBy)
      || !/^[a-f0-9]{64}$/.test(item.sourceSha256)) throw new Error('Invalid approved snapshot.');
    if (allowedProjects && !allowedProjects.has(item.project)) throw new Error('Unknown project.');
    seen.add(item.id);
  }
  for (const item of records) {
    if (!item.parent) continue;
    const parent = records.find((entry) => entry.id === item.parent);
    if (!parent || parent.parent || parent.project !== item.project) throw new Error('Reply must target a top-level comment on this project.');
  }
  return records;
}

export function opinionFromIssue(issue, reviewedBy, approvedAt, hash) {
  if (issue.pull_request || !Number.isSafeInteger(issue.number) || issue.number < 1
    || issue.html_url !== `https://github.com/${REPOSITORY}/issues/${issue.number}`) {
    throw new Error('Expected an issue from the approved repository.');
  }
  const opinion = parseIssueBody(issue.body);
  if (issue.title !== `[site-opinion:${opinion.project}]`) throw new Error('Issue title and project do not match.');
  return { id: `gh-${issue.number}`, ...opinion, source: issue.html_url,
    createdAt: issue.created_at, approvedAt, reviewedBy, sourceSha256: hash };
}
