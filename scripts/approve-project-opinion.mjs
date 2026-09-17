/** Explicit local editorial approval, never an automatic import of public comments. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { projects } from './seo-page-data.mjs';
import { opinionFromIssue, validateOpinions } from '../lib/project-opinions.mjs';

const [filename, flag, reviewer] = process.argv.slice(2);
if (!filename || flag !== '--approve' || !/^[a-zA-Z0-9-]{1,39}$/.test(reviewer || '')) {
  throw new Error('Review the complete issue first. Usage: node scripts/approve-project-opinion.mjs issue.json --approve YOUR_GITHUB_LOGIN');
}
const issue = JSON.parse(readFileSync(filename, 'utf8'));
const hash = createHash('sha256').update(issue.body || '').digest('hex');
const record = opinionFromIssue(issue, reviewer, new Date().toISOString(), hash);
const file = 'data/project-opinions.json';
const records = JSON.parse(readFileSync(file, 'utf8'));
if (records.some((item) => item.id === record.id)) throw new Error('Already approved. Review an edit explicitly instead of silently replacing it.');
records.push(record);
validateOpinions(records, new Set(projects.map((item) => item.slug)));
writeFileSync(file, JSON.stringify(records, null, 2) + '\n');
console.log(`Prepared ${record.id} for ${record.project}. Review the diff, commit and deploy to publish. No remote data or labels were changed.`);
