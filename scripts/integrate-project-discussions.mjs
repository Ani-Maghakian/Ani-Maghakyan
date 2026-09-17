import { copyFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { integrateHtml, pageIdentity, validateConfig } from '../lib/project-discussions.mjs';

const root = resolve(process.argv[2] || 'dist/client');
const config = validateConfig(JSON.parse(readFileSync('project-discussions.config.json', 'utf8')));
if (!existsSync(join(root, 'sitemap.xml'))) throw new Error('Build the existing static site before integrating discussions.');
const assetNames = ['project-discussions.js', 'project-discussions.css'];
const digest = createHash('sha256');
for (const name of assetNames) {
  const path = resolve('public', name);
  digest.update(readFileSync(path));
  copyFileSync(path, join(root, name));
}
const suffix = `?v=${digest.digest('hex').slice(0, 12)}`;
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
}
let pages = 0;
let projects = 0;
for (const path of files(root).filter((path) => path.endsWith('.html'))) {
  const original = readFileSync(path, 'utf8');
  const name = relative(root, path);
  const html = integrateHtml(original, name, config, suffix);
  if (html === original) continue;
  writeFileSync(path, html);
  pages++;
  if (pageIdentity(name).project) projects++;
}
if (!pages) throw new Error('No eligible pages were changed; check for a duplicate integration or missing canonical URLs.');
console.log(JSON.stringify({ contactEmail: config.contactEmail, pages, projectPages: projects, submissionsEnabled: config.enabled }));
