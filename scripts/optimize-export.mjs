import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { projects } from './seo-page-data.mjs';

const root = resolve('dist/client');
let optimized = 0;
const projectKinds = new Map(projects.map((project) => [String(project.id), project.kind]));
const filterKinds = ['all', 'series', 'film', 'stage', 'children'];
const homeLocales = new Map([
  [resolve(root, 'index.html'), 'hy'],
  [resolve(root, 'en/index.html'), 'en'],
  [resolve(root, 'ru/index.html'), 'ru'],
]);

const homeQualityStyle = `<style id="homepage-quality-overrides">
.format-mark{color:#5f5b54!important;font-weight:650!important}
.featured-card:nth-child(7) .format-mark{color:#c8c1b6!important}
.archive-section .section-heading>div>p{color:#504b43!important}
.faq-section .section-heading .eyebrow,.faq-list summary>span{color:#634b27!important}
.hero-art-crop{background-image:none!important}
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

function interactionScript(locale) {
  const language = locale === 'hy' ? 'hy-AM' : locale;
  return `<script>(()=>{const locale=${JSON.stringify(locale)},language=${JSON.stringify(language)};const label=n=>locale==='hy'?n+' արդյունք':locale==='en'?n+' '+(n===1?'result':'results'):(()=>{const a=n%10,b=n%100,c=a===1&&b!==11?'результат':a>=2&&a<=4&&(b<12||b>14)?'результата':'результатов';return n+' '+c})();const rows=[...document.querySelectorAll('.filmography-table tbody tr[id^="project-"]')],buttons=[...document.querySelectorAll('.filter-button[data-filter]')],input=document.querySelector('.search-field input[type="search"]'),count=document.querySelector('.result-count');let active='all';const apply=()=>{const q=(input?.value||'').trim().toLocaleLowerCase(language);let visible=0;for(const row of rows){const text=(row.textContent||'').toLocaleLowerCase(language),show=(active==='all'||row.dataset.kind===active)&&(!q||text.includes(q));row.hidden=!show;if(show)visible++}if(count)count.textContent=label(visible);for(const button of buttons){const on=button.dataset.filter===active;button.dataset.active=String(on);button.setAttribute('aria-pressed',String(on))}};input?.addEventListener('input',apply,{passive:true});for(const button of buttons)button.addEventListener('click',()=>{active=button.dataset.filter||'all';apply()});document.addEventListener('click',event=>{const anchor=event.target.closest?.('a[href^="#"]');if(!anchor)return;const href=anchor.getAttribute('href');if(!href||href==='#')return;const target=document.getElementById(decodeURIComponent(href.slice(1)));if(!target)return;event.preventDefault();const header=document.querySelector('.site-header'),offset=(header?.getBoundingClientRect().height||64)+28,top=href==='#top'?0:Math.max(0,window.scrollY+target.getBoundingClientRect().top-offset);history.pushState(null,'',href);window.scrollTo({top,left:0,behavior:'auto'});anchor.closest('details')?.removeAttribute('open')});document.querySelector('.mobile-menu')?.addEventListener('keydown',event=>{if(event.key==='Escape'){event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus()}});const grid=document.getElementById('featured-projects');document.querySelectorAll('.featured-scroll-controls button').forEach((button,index)=>button.addEventListener('click',()=>{if(!grid)return;grid.scrollBy({left:(index===0?-1:1)*grid.clientWidth*.9,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}));apply()})();</script>`;
}

function optimizeHomepage(html, locale) {
  let result = stripHydrationRuntime(html);
  result = addStaticInteractionHooks(result);
  const additions = [];
  if (!/rel=["']preconnect["'][^>]+i\.ytimg\.com/i.test(result)) {
    additions.push('<link rel="preconnect" href="https://i.ytimg.com" crossorigin>');
  }
  additions.push(homeQualityStyle);
  result = result.replace('</head>', `${additions.join('\n')}\n</head>`);
  return result.replace('</body>', `${interactionScript(locale)}\n</body>`);
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if (!path.endsWith('.html')) continue;

    const before = readFileSync(path, 'utf8');
    let after = stripRemoteFonts(before);
    const locale = homeLocales.get(resolve(path));
    if (locale) after = optimizeHomepage(after, locale);

    if (after !== before) {
      writeFileSync(path, after);
      optimized += 1;
    }
  }
}

walk(root);
console.log(`Optimized critical rendering path in ${optimized} exported HTML files.`);