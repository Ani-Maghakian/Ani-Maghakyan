import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { projects, hubs, locales, localizedPath, allSeoPageTails, updatedIso } from './seo-page-data.mjs';
import { interfaceCopy, sectionLinks, publicContactEmail } from '../lib/site-copy.mjs';
import { copy, siteLinks, sourceLinks } from '../lib/profile-content.mjs';
import { books, bookSchema } from '../lib/books.mjs';
import { projectStories, projectSummary, relatedProjects } from '../lib/project-editorial.mjs';

const [owner = '', repositoryName = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserOrOrgSite = Boolean(owner) && repositoryName === `${owner}.github.io`;
const basePath = process.env.SITE_BASE_PATH ?? (process.env.GITHUB_ACTIONS === 'true' && repositoryName && !isUserOrOrgSite ? `/${repositoryName}` : '');
const siteUrl = (process.env.SITE_URL || (owner ? `https://${owner}.github.io${basePath}` : 'https://ani-maghakian.github.io/Ani-Maghakyan')).replace(/\/$/, '');
const output = resolve('dist/client');
const personId = `${siteUrl}/#ani-maghakyan`;
const contactEmail = publicContactEmail(process.env.CONTACT_EMAIL);
const esc = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function absoluteUrl(locale, tail = '') {
  const path = localizedPath(locale, tail);
  return `${siteUrl}/${path ? `${path}/` : ''}`;
}
function pageHref(locale, tail = '') {
  const path = localizedPath(locale, tail);
  return `${basePath}/${path ? `${path}/` : ''}`;
}
function diskPath(locale, tail = '') { return resolve(output, localizedPath(locale, tail), 'index.html'); }
function sectionLabel(locale, slug) { return sectionLinks.find((s) => s.slug === slug).labels[locale]; }
function navLinks(locale, tail) {
  return sectionLinks.map((item) => `<a href="${esc(pageHref(locale, item.slug))}"${tail === item.slug ? ' aria-current="page"' : ''}>${esc(item.labels[locale])}</a>`).join('');
}
function personNode() {
  return { '@type': 'Person', '@id': personId, name: 'Ani Maghakyan', alternateName: ['Անի Մաղաքյան', 'Ани Магакян', 'Ani Maghakian'], url: `${siteUrl}/`, jobTitle: ['Screenwriter', 'Showrunner', 'Producer', 'Author'], sameAs: [siteLinks.imdb, siteLinks.personalInstagram, siteLinks.kinopoisk, siteLinks.elcinema] };
}
function breadcrumbs(locale, title, tail, isProject = false) {
  const items = [{ name: interfaceCopy[locale].home, tail: '' }];
  if (isProject) items.push({ name: sectionLabel(locale, 'projects'), tail: 'projects' });
  items.push({ name: title, tail });
  return {
    html: `<nav class="crumbs" aria-label="${esc(interfaceCopy[locale].breadcrumb)}">${items.map((item, index) => index === items.length - 1 ? `<span aria-current="page">${esc(item.name)}</span>` : `<a href="${esc(pageHref(locale, item.tail))}">${esc(item.name)}</a><span aria-hidden="true">/</span>`).join('')}</nav>`,
    node: { '@type': 'BreadcrumbList', '@id': `${absoluteUrl(locale, tail)}#breadcrumbs`, itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(locale, item.tail) })) },
  };
}
function sourceList(locale, sources) {
  if (!sources?.length) return '';
  const unique = [...new Map(sources.map((s) => [s.url, s])).values()];
  return `<aside class="sources" aria-labelledby="sources-heading"><h2 id="sources-heading">${esc(interfaceCopy[locale].sources)}</h2><ol>${unique.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label === 'Official / primary video' ? locales[locale].watchLabel : source.label)}</a></li>`).join('')}</ol></aside>`;
}
function projectImage(project) {
  if (project.poster) return project.poster.startsWith('/') ? `${siteUrl}${project.poster}` : project.poster;
  const id = project.watchUrl?.match(/[?&]v=([^&]+)/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : `${siteUrl}/hero.webp`;
}
function projectMediaSrc(project) {
  return project.poster?.startsWith('/') ? `${basePath}${project.poster}` : projectImage(project);
}
function uniqueTitles(project) { return [...new Set(Object.values(project.titles))]; }
function cardGrid(items, locale, className = 'related-grid') {
  return `<div class="${className}">${items.map((p) => `<a data-track="view_project" data-project="${esc(p.slug)}" href="${esc(pageHref(locale, `projects/${p.slug}`))}"><strong>${esc(p.titles[locale])}</strong><small>${esc(p.year)} · ${esc(p.slug === "elens-diary" ? {hy:"2 եթերաշրջան · 421 սերիա",en:"2 seasons · 421 episodes",ru:"2 сезона · 421 серия"}[locale] : p.credit[locale])}</small></a>`).join('')}</div>`;
}
function contactCta(locale) {
  const ui = interfaceCopy[locale];
  return `<div class="cta">${contactEmail ? `<a data-track="contact_email" href="mailto:${esc(contactEmail)}">${esc(ui.email)} ↗</a>` : ''}<a data-track="contact_instagram" ${contactEmail ? 'class="secondary" ' : ''}href="${esc(siteLinks.instagram)}" target="_blank" rel="noopener noreferrer">${esc(ui.instagram)} ↗</a></div>`;
}
function layout({ locale, tail, seoTitle, description, body, nodes, image }) {
  const ui = interfaceCopy[locale];
  const canonical = absoluteUrl(locale, tail);
  const jsonLd = { '@context': 'https://schema.org', '@graph': nodes };
  return `<!doctype html>
<html lang="${esc(locales[locale].lang)}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(seoTitle)}</title><meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${esc(canonical)}">
${Object.keys(locales).map((code) => `<link rel="alternate" hreflang="${locales[code].lang}" href="${esc(absoluteUrl(code, tail))}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${esc(absoluteUrl('hy', tail))}">
<meta property="og:type" content="${tail.startsWith('projects/') ? 'article' : 'website'}"><meta property="og:title" content="${esc(seoTitle)}">
<meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:site_name" content="Ani Maghakyan">
<meta property="og:locale" content="${{hy:'hy_AM',en:'en_US',ru:'ru_RU'}[locale]}"><meta property="og:image" content="${esc(image || `${siteUrl}/og.png`)}">
<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${basePath}/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian:wght@400;500;600;700;800&family=Noto+Serif+Armenian:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${basePath}/inner-pages.css"><script src="${basePath}/site-interactions.js" defer></script>
<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>
</head><body><a class="skip-link" href="#main-content">${esc(ui.skip)}</a><div class="shell">
<header class="masthead"><a class="brand" href="${esc(pageHref(locale))}">A. MAGHAKYAN</a><nav class="topnav" aria-label="${esc(ui.explore)}">${navLinks(locale, tail)}</nav>
<nav class="languages" aria-label="${esc(ui.languages)}">${Object.keys(locales).map((code) => `<a href="${esc(pageHref(code, tail))}" hreflang="${locales[code].lang}" lang="${locales[code].lang}" aria-label="${esc(locales[code].label)}"${code === locale ? ' aria-current="page"' : ''}>${code.toUpperCase()}</a>`).join('')}</nav>
<details class="mobile-menu"><summary aria-label="${esc(ui.menu)}"><span aria-hidden="true">☰</span></summary><nav aria-label="${esc(ui.explore)}">${navLinks(locale, tail)}</nav></details></header>
${body}
<footer class="footer"><nav class="footer-nav" aria-label="${esc(ui.explore)}">${navLinks(locale, tail)}</nav><div class="footer-info"><a href="${esc(pageHref(locale))}">Ani Maghakyan · Maghakian Scripts</a><span>${esc(ui.updated)} <time datetime="${updatedIso}">${updatedIso}</time></span></div></footer>
</div></body></html>`;
}

function projectPage(project, locale) {
  const ui = interfaceCopy[locale];
  const tail = `projects/${project.slug}`;
  const title = project.titles[locale];
  const canonical = absoluteUrl(locale, tail);
  const story = projectStories[project.slug];
  const description = projectSummary(project, locale);
  const seoTitle = `${title} (${project.year}) — ${copy[locale].title}`;
  const crumbs = breadcrumbs(locale, title, tail, true);
  const image = projectImage(project);
  const { parts, related } = relatedProjects(project, projects);
  const isDiary = project.slug === 'elens-diary';
  const isDiary2 = project.slug === 'elens-diary-2';
  const knownRole = story?.role?.[locale] || (!project.roles.en.includes('official screenwriting/creative archive') ? project.roles[locale] : '');
  const scope = isDiary ? { hy:'2 եթերաշրջան · 421 սերիա (197 + 224)', en:'2 seasons · 421 episodes (197 + 224)', ru:'2 сезона · 421 серия (197 + 224)' }[locale] : project.credit[locale];
  const format = copy[locale].filters[project.kind];
  const facts = [[ui.year, project.year], [ui.type, format], [ui.volume, scope], ...(story?.broadcaster ? [[ui.broadcaster, story.broadcaster]] : []), ...(knownRole ? [[ui.role, knownRole]] : [])];
  const sourceItems = [...project.sources, ...(story ? [story.source] : [])];
  const seriesId = `${absoluteUrl(locale, 'projects/elens-diary')}#work`;
  const workNode = {
    '@type': isDiary2 ? 'TVSeason' : project.type, '@id': `${canonical}#work`, url: canonical, name: title,
    alternateName: uniqueTitles(project), description, image, inLanguage: 'hy',
    ...(project.year.includes('–') ? { temporalCoverage: project.year.replace('–', '/') } : { datePublished: project.year }),
    contributor: { '@id': personId }, citation: [...new Set(sourceItems.map((s) => s.url))],
    ...(knownRole ? { author: { '@id': personId } } : {}),
    ...(Number.isInteger(project.episodes) ? { numberOfEpisodes: isDiary ? 421 : project.episodes } : {}),
    ...(isDiary ? { numberOfSeasons: 2, containsSeason: [
      { '@type': 'TVSeason', '@id': `${canonical}#season-1`, seasonNumber: 1, numberOfEpisodes: 197, partOfSeries: { '@id': seriesId } },
      { '@type': 'TVSeason', '@id': `${absoluteUrl(locale, 'projects/elens-diary-2')}#work`, seasonNumber: 2, numberOfEpisodes: 224, partOfSeries: { '@id': seriesId } },
    ] } : {}),
    ...(isDiary2 ? { seasonNumber: 2, partOfSeries: { '@id': seriesId } } : {}),
    ...(project.slug === 'summer-of-84' ? { creator: { '@id': personId }, producer: { '@id': personId } } : {}),
  };
  const nodes = [
    { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: seoTitle, description, inLanguage: locales[locale].lang, dateModified: updatedIso, mainEntity: { '@id': `${canonical}#work` }, isPartOf: { '@id': `${siteUrl}/#website` }, breadcrumb: { '@id': `${canonical}#breadcrumbs` } },
    workNode, crumbs.node, personNode(),
  ];
  const watch = project.watchUrl ? `<a data-track="watch_project" data-project="${project.slug}" href="${esc(project.watchUrl)}" target="_blank" rel="noopener noreferrer">${esc(locales[locale].watchLabel)} ↗</a>` : '';
  const body = `<main id="main-content">${crumbs.html}<section class="hero"><div><p class="kicker">${esc(format)} · ${esc(project.year)}</p><h1>${esc(title)}</h1><p class="dek">${esc(description)}</p><div class="cta">${watch}<a class="secondary" href="${esc(pageHref(locale, 'work-with-ani'))}">${esc(ui.collaborate)} →</a></div><p class="aliases">${esc(uniqueTitles(project).join(' · '))}</p></div>
<figure class="hero-media"><span class="media-fallback" aria-hidden="true">${esc(title)}</span><img src="${esc(projectMediaSrc(project))}" alt="${esc(`${title} — ${project.year}`)}" width="640" height="400" loading="eager" decoding="async"></figure></section>
<section class="content"><article class="prose"><h2>${esc(ui.details)}</h2><dl class="meta">${facts.map(([label,value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
${isDiary ? `<p id="season-1" class="credit-note">${esc({hy:'1-ին եթերաշրջան՝ 197 սերիա։ 2-րդ եթերաշրջան՝ 224 սերիա։ Ընդամենը՝ 421 սերիա՝ ըստ հեղինակային ֆիլմագրության։',en:'Season 1: 197 episodes. Season 2: 224 episodes. Total: 421 episodes in the author filmography.',ru:'Сезон 1 — 197 серий. Сезон 2 — 224 серии. Всего — 421 серия по авторской фильмографии.'}[locale])}</p>` : ''}
${story?.note ? `<p class="credit-note">${esc(story.note[locale])}</p>` : ''}
${story ? `<p class="source-ref"><a href="${esc(story.source.url)}" target="_blank" rel="noopener noreferrer">${esc(story.source.label)} ↗</a></p>` : ''}
${parts.length ? `<section class="related"><h2>${esc(ui.season)}</h2>${cardGrid(parts, locale)}</section>` : ''}
${related.length ? `<section class="related"><h2>${esc(ui.related)}</h2>${cardGrid(related, locale)}</section>` : ''}
<div class="cta"><a class="secondary" href="${esc(pageHref(locale))}#filmography">${esc(locales[locale].backLabel)} →</a></div></article>${sourceList(locale, sourceItems)}</section></main>`;
  return layout({ locale, tail, seoTitle, description, body, nodes, image });
}

function hubPage(hub, locale) {
  const ui = interfaceCopy[locale];
  const t = copy[locale];
  const tail = hub.slug;
  const canonical = absoluteUrl(locale, tail);
  const title = hub.titles[locale];
  const crumbs = breadcrumbs(locale, title, tail);
  const descriptions = {
    projects: {hy:'Անի Մաղաքյանի 47 աշխատանքը՝ սերիալներ, ֆիլմեր, ներկայացումներ և մանկական նախագծեր։ Ընտրեք նախագիծը՝ մանրամասները և դիտման հղումը գտնելու համար։',en:'Explore 47 works by Ani Maghakyan across television, film, theatre and children’s stories. Find project details and viewing links.',ru:'47 работ Ани Магакян: сериалы, фильмы, спектакли и детские проекты. Выберите работу, чтобы узнать подробности и найти ссылку на просмотр.'},
    about: {hy:ui.shortIntro,en:ui.shortIntro,ru:ui.shortIntro},
    books: {hy:'Անի Մաղաքյանի արձակը՝ «Ժամանակավոր կանգառ» և «Տակնուվրա»։ Գրքեր, հրատարակության տվյալներ և կատալոգի հղումներ։',en:'Prose by Ani Maghakyan: Temporary Stop and Taknuvra. Explore the books, edition details and catalogue links.',ru:'Проза Ани Магакян: «Временная остановка» и «Такнувра». Книги, сведения об изданиях и ссылки на каталог.'},
    press: {hy:'Հարցազրույցներ Անի Մաղաքյանի հետ, հրապարակումներ և մասնագիտական աղբյուրներ՝ նրա կարիերայի և աշխատանքների մասին։',en:'Interviews with Ani Maghakyan, editorial coverage and industry sources about her career and work.',ru:'Интервью с Ани Магакян, публикации и профессиональные источники о её карьере и работах.'},
    'work-with-ani': {hy:t.contactText,en:t.contactText,ru:t.contactText},
  };
  const description = descriptions[tail][locale];
  const nodes = [
    { '@type': tail === 'about' ? 'ProfilePage' : tail === 'work-with-ani' ? 'ContactPage' : 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: title, description, inLanguage: locales[locale].lang, dateModified: updatedIso, isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': personId }, breadcrumb: { '@id': `${canonical}#breadcrumbs` }, ...(tail === 'about' ? {mainEntity:{'@id':personId}} : {}) },
    personNode(), crumbs.node,
  ];
  let article = '';
  let sources = hub.sources;
  if (tail === 'projects') {
    article = `<nav class="section-menu" aria-label="${esc(ui.format)}">${['series','film','stage','children'].map((kind) => `<a href="#${kind}">${esc(t.filters[kind])}</a>`).join('')}<a href="${esc(pageHref(locale))}#filmography">${esc(t.search.replace('…',''))} ↗</a></nav>${['series','film','stage','children'].map((kind) => `<section id="${kind}"><h2>${esc(t.filters[kind])}</h2>${cardGrid(projects.filter((p) => p.kind === kind), locale, 'project-grid all')}</section>`).join('')}`;
    nodes.push({ '@type':'ItemList', '@id':`${canonical}#collection`, numberOfItems:projects.length, itemListElement:projects.map((p,index) => ({'@type':'ListItem',position:index+1,name:p.titles[locale],url:absoluteUrl(locale,`projects/${p.slug}`)})) });
    nodes[0].mainEntity = {'@id':`${canonical}#collection`};
  } else if (tail === 'books') {
    article = books.map((book) => `<article class="book-card" id="${book.slug}"><p class="kicker">${esc(book.year)} · ${esc(book.format[locale])}</p><h2>${esc(book.titles[locale])}</h2><p>${esc(book.descriptions[locale])}</p>${book.isbn ? `<p>ISBN: ${esc(book.isbn)}</p>` : ''}${book.editionNote ? `<p class="edition-note">${esc(book.editionNote[locale])}</p>` : ''}${book.source ? `<div class="cta"><a href="${esc(book.source)}" target="_blank" rel="noopener noreferrer">${esc(ui.readBook)} ↗</a></div>` : ''}</article>`).join('');
    nodes.push(...books.map((book) => bookSchema(book, locale, siteUrl, personId)));
    nodes[0].mainEntity = books.map((book) => ({'@id':`${siteUrl}/#book-${book.slug}`}));
    sources = [{label:'Abril Books · Taknuvra',url:books[1].source}];
  } else if (tail === 'about') {
    article = `<p>${esc(t.bio)}</p><p>${esc(t.philosophy)}</p><h2>${esc(t.educationTitle)}</h2><ul>${t.education.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h2>${esc(t.practiceTitle)}</h2><ul>${t.practice.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><div class="cta"><a href="${esc(pageHref(locale,'projects'))}">${esc(ui.work)} →</a><a class="secondary" href="${esc(pageHref(locale,'books'))}">${esc(t.booksTitle)} →</a></div>`;
  } else if (tail === 'press') {
    const editorial = sourceLinks.filter((source) => source.id !== 1);
    article = `<ul class="press-list">${editorial.map((source) => `<li><p class="kicker">${esc(source.kind[locale])}</p><h2><a href="${esc(source.href)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a></h2><p>${esc(source.note[locale])}</p></li>`).join('')}</ul>`;
    nodes.push({'@type':'ItemList','@id':`${canonical}#articles`,numberOfItems:editorial.length,itemListElement:editorial.map((source,index) => ({'@type':'ListItem',position:index+1,item:{'@type':'CreativeWork',name:source.label,description:source.note[locale],url:source.href,about:{'@id':personId}}}))});
    nodes[0].mainEntity = {'@id':`${canonical}#articles`};
    sources = [{label:'IMDb',url:siteLinks.imdb},{label:'KinoPoisk',url:siteLinks.kinopoisk},{label:'elCinema',url:siteLinks.elcinema}];
  } else {
    article = `<h2>${esc(t.practiceTitle)}</h2><ul>${t.practice.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h2>${esc(ui.collaborate)}</h2><p>${esc(ui.contactHint)}</p>${contactCta(locale)}<section class="related"><h2>${esc(t.selectedTitle)}</h2>${cardGrid(projects.filter((p) => ['elens-diary','summer-of-84','paper-dream'].includes(p.slug)),locale)}</section>`;
  }
  const content = tail === 'projects' ? `<section class="index-content">${article}</section>` : `<section class="content"><div class="prose">${article}</div>${sourceList(locale, sources)}</section>`;
  const body = `<main id="main-content">${crumbs.html}<section class="hero single"><div><p class="kicker">${esc(sectionLabel(locale, tail))}</p><h1>${esc(title)}</h1><p class="dek">${esc(description)}</p></div></section>${content}</main>`;
  return layout({locale,tail,seoTitle:title,description,body,nodes});
}

for (const locale of Object.keys(locales)) {
  for (const project of projects) {
    const path = diskPath(locale, `projects/${project.slug}`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, projectPage(project, locale));
  }
  for (const hub of hubs) {
    const path = diskPath(locale, hub.slug);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, hubPage(hub, locale));
  }
}
// Homepage navigation is rendered by React so it survives hydration.

// Expand sitemap with every canonical localized project and hub URL.
const sitemapPath = resolve(output, "sitemap.xml");
if (existsSync(sitemapPath)) {
  let sitemap = readFileSync(sitemapPath, "utf8");
  const start = "<!-- ANI_PROJECT_SEO_START -->";
  const end = "<!-- ANI_PROJECT_SEO_END -->";
  const entries = [];
  for (const tail of allSeoPageTails()) {
    for (const locale of Object.keys(locales)) {
      const loc = absoluteUrl(locale, tail);
      entries.push(`  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${updatedIso}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${tail.startsWith("projects/") ? "0.85" : tail === "projects" ? "0.9" : "0.75"}</priority>\n    <xhtml:link rel="alternate" hreflang="hy-AM" href="${esc(absoluteUrl("hy", tail))}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${esc(absoluteUrl("en", tail))}" />\n    <xhtml:link rel="alternate" hreflang="ru" href="${esc(absoluteUrl("ru", tail))}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(absoluteUrl("hy", tail))}" />\n  </url>`);
    }
  }
  const block = `${start}\n${entries.join("\n")}\n${end}`;
  if (sitemap.includes(start) && sitemap.includes(end)) {
    sitemap = sitemap.replace(new RegExp(`${start}[\\s\\S]*?${end}`), block);
  } else {
    sitemap = sitemap.replace("</urlset>", `${block}\n</urlset>`);
  }
  writeFileSync(sitemapPath, sitemap);
}

// Machine-readable discovery aid; not treated as a Google ranking factor.
const llmsPath = resolve(output, "llms.txt");
const llmsStart = "<!-- ANI_PROJECT_INDEX_START -->";
const llmsEnd = "<!-- ANI_PROJECT_INDEX_END -->";
const keyPages = projects.map((project) => `- ${project.titles.en}: ${absoluteUrl("en", `projects/${project.slug}`)}`).join("\n");
const llmsBlock = `${llmsStart}\n## Full project index\n${keyPages}\n${llmsEnd}`;
if (existsSync(llmsPath)) {
  let llms = readFileSync(llmsPath, "utf8");
  if (llms.includes(llmsStart) && llms.includes(llmsEnd)) {
    llms = llms.replace(new RegExp(`${llmsStart}[\\s\\S]*?${llmsEnd}`), llmsBlock);
  } else {
    llms += `\n\n${llmsBlock}\n`;
  }
  writeFileSync(llmsPath, llms);
} else {
  writeFileSync(llmsPath, `# Ani Maghakyan\n\nOfficial multilingual portfolio and filmography.\n\n${llmsBlock}\n`);
}

console.log(`Generated ${allSeoPageTails().length * Object.keys(locales).length} standalone SEO pages (${projects.length} projects × ${Object.keys(locales).length} languages).`);
