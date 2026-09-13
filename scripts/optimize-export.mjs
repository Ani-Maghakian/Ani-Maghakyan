import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { projects } from './seo-page-data.mjs';

const root = resolve('dist/client');
let optimized = 0;
const projectKinds = new Map(projects.map((project) => [String(project.id), project.kind]));
const filterKinds = ['all', 'series', 'film', 'stage', 'children'];
const homePaths = new Set([
  resolve(root, 'index.html'),
  resolve(root, 'en/index.html'),
  resolve(root, 'ru/index.html'),
]);

const repository = process.env.GITHUB_REPOSITORY ?? '';
const [owner = '', repositoryName = ''] = repository.split('/');
const isUserOrOrgSite = Boolean(owner) && repositoryName === `${owner}.github.io`;
const inferredBasePath =
  process.env.GITHUB_ACTIONS === 'true' && repositoryName && !isUserOrOrgSite
    ? `/${repositoryName}`
    : '';
const basePath = process.env.SITE_BASE_PATH ?? inferredBasePath;
const interactionBytes = readFileSync('public/home-interactions.js');
const interactionHash = createHash('sha256').update(interactionBytes).digest('hex').slice(0, 12);
const interactionFilename = `home-interactions.${interactionHash}.js`;
writeFileSync(join(root, interactionFilename), interactionBytes);
const homeInteractionSrc = `${basePath}/${interactionFilename}`.replace(/\/\/+/, '/');

const homeQualityStyle = `<style id="homepage-quality-overrides">
.format-mark{color:#5f5b54!important;font-weight:650!important}
.archive-section .section-heading>div>p{color:#504b43!important}
.faq-section .section-heading .eyebrow,.faq-list summary>span{color:#634b27!important}
.archive-section,.archive-controls,.filmography-table-wrap,.filmography-table,.filmography-table tbody,.filmography-table tbody tr{background:var(--cine-paper,#e8e0d4)!important}
.filmography-table tbody th,.filmography-table tbody th a{color:var(--cine-ink,#171713)!important}
.filmography-table tbody td{color:#3f3a33!important}
.filmography-table tbody td:first-child{color:#4b391c!important}
</style>`;

function stripRemoteFonts(html) {
  return html.replace(/<link\b[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\s*/gi, '');
}

function stripHydrationRuntime(html) {
  return html
    .replace(/<link\b(?=[^>]*\brel=["']modulepreload["'])[^>]*>\s*/gi, '')
    .replace(/<link\b(?=[^>]*\bas=["']script["'])[^>]*>\s*/gi, '')
    .replace(/<script\b(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

function stripEmbeddedHeroPayload(css) {
  return css.replace(
    /background-image\s*:\s*url\(\s*["']?data:image\/jpeg;base64,[^)]+\)\s*;?/gi,
    'background-image:none;',
  );
}

function addStaticInteractionHooks(html) {
  let filterIndex = 0;
  let result = html.replace(
    /<button\b([^>]*\bclass=["'][^"']*\bfilter-button\b[^"']*["'][^>]*)>/gi,
    (match, attrs) => {
      const kind = filterKinds[filterIndex++] ?? 'all';
      return /\bdata-filter=/.test(attrs)
        ? match
        : `<button${attrs} data-filter="${kind}">`;
    },
  );

  result = result.replace(/<tr id="project-(\d+)"/g, (match, id) => {
    const kind = projectKinds.get(id);
    return kind ? `<tr id="project-${id}" data-kind="${kind}"` : match;
  });

  return result;
}

function optimizeHomepage(html) {
  let result = stripHydrationRuntime(html);
  result = addStaticInteractionHooks(result);
  const additions = [];
  if (!/rel=["']preconnect["'][^>]+i\.ytimg\.com/i.test(result)) {
    additions.push('<link rel="preconnect" href="https://i.ytimg.com" crossorigin>');
  }
  additions.push(homeQualityStyle);
  result = result.replace('</head>', `${additions.join('\n')}\n</head>`);
  return result.replace(
    '</body>',
    `<script src="${homeInteractionSrc}" defer></script>\n</body>`,
  );
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }

    if (path.endsWith('.css')) {
      const before = readFileSync(path, 'utf8');
      const after = stripEmbeddedHeroPayload(before);
      if (after !== before) {
        writeFileSync(path, after);
        optimized += 1;
      }
      continue;
    }

    if (!path.endsWith('.html')) continue;
    const before = readFileSync(path, 'utf8');
    let after = stripRemoteFonts(before);
    if (homePaths.has(resolve(path))) after = optimizeHomepage(after);

    if (after !== before) {
      writeFileSync(path, after);
      optimized += 1;
    }
  }
}

walk(root);
console.log(`Optimized critical rendering path in ${optimized} exported files.`);
