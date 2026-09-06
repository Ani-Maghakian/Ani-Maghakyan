import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { projects, locales, localizedPath, updatedIso } from './seo-page-data.mjs';
import { serviceHub, services } from '../lib/services.mjs';
import { interfaceCopy, publicContactEmail, sectionLinks } from '../lib/site-copy.mjs';
import { siteLinks } from '../lib/profile-content.mjs';

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

function diskPath(locale, tail = '') {
  return resolve(output, localizedPath(locale, tail), 'index.html');
}

function personNode() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: 'Ani Maghakyan',
    alternateName: ['Անի Մաղաքյան', 'Ани Магакян', 'Ani Maghakian'],
    url: `${siteUrl}/`,
    jobTitle: ['Screenwriter', 'Showrunner', 'Producer', 'Author'],
    sameAs: [siteLinks.imdb, siteLinks.personalInstagram, siteLinks.kinopoisk, siteLinks.elcinema],
  };
}

function navLinks(locale, tail) {
  return sectionLinks
    .map((item) => {
      const active = tail === item.slug || tail.startsWith(`${item.slug}/`);
      return `<a href="${esc(pageHref(locale, item.slug))}"${active ? ' aria-current="page"' : ''}>${esc(item.labels[locale])}</a>`;
    })
    .join('');
}

function breadcrumbs(locale, title, tail, includeHub = false) {
  const ui = interfaceCopy[locale];
  const items = [{ name: ui.home, tail: '' }];
  if (includeHub) items.push({ name: serviceHub.headings[locale], tail: 'services' });
  items.push({ name: title, tail });
  const canonical = absoluteUrl(locale, tail);
  return {
    html: `<nav class="crumbs" aria-label="${esc(ui.breadcrumb)}">${items.map((item, index) => index === items.length - 1 ? `<span aria-current="page">${esc(item.name)}</span>` : `<a href="${esc(pageHref(locale, item.tail))}">${esc(item.name)}</a><span aria-hidden="true">/</span>`).join('')}</nav>`,
    node: {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumbs`,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(locale, item.tail),
      })),
    },
  };
}

function contactCta(locale) {
  const ui = interfaceCopy[locale];
  return `<div class="cta">${contactEmail ? `<a data-track="contact_email" href="mailto:${esc(contactEmail)}">${esc(ui.email)} ↗</a>` : ''}<a data-track="contact_instagram" ${contactEmail ? 'class="secondary" ' : ''}href="${esc(siteLinks.instagram)}" target="_blank" rel="noopener noreferrer">${esc(ui.instagram)} ↗</a></div>`;
}

function layout({ locale, tail, seoTitle, description, body, nodes }) {
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
<meta property="og:type" content="website"><meta property="og:title" content="${esc(seoTitle)}">
<meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:site_name" content="Ani Maghakyan">
<meta property="og:locale" content="${{ hy: 'hy_AM', en: 'en_US', ru: 'ru_RU' }[locale]}"><meta property="og:image" content="${siteUrl}/og.png">
<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${basePath}/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Armenian:wght@400;500;600;700&family=Noto+Serif:wght@400;500;600&family=Noto+Serif+Armenian:wght@400;500;600&display=swap" rel="stylesheet">
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

function projectCards(service, locale) {
  const selected = service.related.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean);
  const labels = {
    hy: 'Հարակից աշխատանքներ',
    en: 'Relevant work',
    ru: 'Связанные работы',
  };
  return `<section class="related"><h2>${esc(labels[locale])}</h2><div class="related-grid">${selected.map((project) => `<a data-track="view_project" data-project="${esc(project.slug)}" href="${esc(pageHref(locale, `projects/${project.slug}`))}"><strong>${esc(project.titles[locale])}</strong><small>${esc(project.year)} · ${esc(project.credit[locale])}</small></a>`).join('')}</div></section>`;
}

function faqSection(service, locale, canonical) {
  const title = { hy: 'Հաճախ տրվող հարցեր', en: 'Frequently asked questions', ru: 'Частые вопросы' }[locale];
  const entries = service.faqs[locale];
  return {
    html: `<section class="prose"><h2>${esc(title)}</h2>${entries.map(([question, answer]) => `<details class="faq-item"><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</section>`,
    node: {
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      mainEntity: entries.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  };
}

function serviceHubPage(locale) {
  const tail = serviceHub.slug;
  const canonical = absoluteUrl(locale, tail);
  const title = serviceHub.titles[locale];
  const crumbs = breadcrumbs(locale, serviceHub.headings[locale], tail);
  const itemListId = `${canonical}#services`;
  const labels = {
    hy: { kicker: 'Ծառայություններ', explore: 'Ընտրել աշխատանքի ձևաչափը', proof: 'Փորձի հիմքը', proofText: '47 նախագիծ · 2,300+ նույնականացված սերիա · սերիալ, ֆիլմ, բեմ և մանկական պատմություններ։' },
    en: { kicker: 'Services', explore: 'Choose the working scope', proof: 'Built on documented work', proofText: '47 projects · 2,300+ identified episodes · television, film, stage and children’s stories.' },
    ru: { kicker: 'Услуги', explore: 'Выберите формат работы', proof: 'Основа — реальная фильмография', proofText: '47 проектов · 2 300+ серий · сериалы, фильмы, театр и детские истории.' },
  }[locale];
  const cards = services.map((service) => `<a href="${esc(pageHref(locale, `services/${service.slug}`))}"><strong>${esc(service.names[locale])}</strong><small>${esc(service.descriptions[locale])}</small></a>`).join('');
  const body = `<main id="main-content">${crumbs.html}<section class="hero single"><div><p class="kicker">${esc(labels.kicker)}</p><h1>${esc(serviceHub.headings[locale])}</h1><p class="dek">${esc(serviceHub.descriptions[locale])}</p></div></section><section class="content"><div class="prose"><p>${esc(serviceHub.intros[locale])}</p><h2>${esc(labels.explore)}</h2><div class="project-grid all">${cards}</div><h2>${esc(labels.proof)}</h2><p>${esc(labels.proofText)}</p><div class="cta"><a href="${esc(pageHref(locale, 'projects'))}">${esc(interfaceCopy[locale].work)} →</a><a class="secondary" href="${esc(pageHref(locale, 'work-with-ani'))}">${esc(interfaceCopy[locale].collaborate)} →</a></div></div></section></main>`;
  const nodes = [
    {
      '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: title,
      description: serviceHub.descriptions[locale], inLanguage: locales[locale].lang, dateModified: updatedIso,
      isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': personId }, mainEntity: { '@id': itemListId }, breadcrumb: { '@id': `${canonical}#breadcrumbs` },
    },
    {
      '@type': 'ItemList', '@id': itemListId, numberOfItems: services.length,
      itemListElement: services.map((service, index) => ({ '@type': 'ListItem', position: index + 1, name: service.names[locale], url: absoluteUrl(locale, `services/${service.slug}`) })),
    },
    personNode(), crumbs.node,
  ];
  return layout({ locale, tail, seoTitle: title, description: serviceHub.descriptions[locale], body, nodes });
}

function servicePage(service, locale) {
  const tail = `services/${service.slug}`;
  const canonical = absoluteUrl(locale, tail);
  const title = service.titles[locale];
  const crumbs = breadcrumbs(locale, service.names[locale], tail, true);
  const faq = faqSection(service, locale, canonical);
  const labels = {
    hy: { kicker: 'Ծառայություն', discuss: 'Քննարկել այս աշխատանքի scope-ը' },
    en: { kicker: 'Service', discuss: 'Discuss this scope' },
    ru: { kicker: 'Услуга', discuss: 'Обсудить этот scope' },
  }[locale];
  const sections = service.sections[locale].map(([heading, items]) => `<section class="prose"><h2>${esc(heading)}</h2><ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>`).join('');
  const body = `<main id="main-content">${crumbs.html}<section class="hero single"><div><p class="kicker">${esc(labels.kicker)}</p><h1>${esc(service.names[locale])}</h1><p class="dek">${esc(service.descriptions[locale])}</p></div></section><section class="content"><div><article class="prose"><p>${esc(service.leads[locale])}</p></article>${sections}${projectCards(service, locale)}${faq.html}<section class="prose"><h2>${esc(labels.discuss)}</h2><p>${esc(interfaceCopy[locale].contactHint)}</p>${contactCta(locale)}</section></div></section></main>`;
  const serviceId = `${canonical}#service`;
  const nodes = [
    {
      '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: title,
      description: service.descriptions[locale], inLanguage: locales[locale].lang, dateModified: updatedIso,
      isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': serviceId }, mainEntity: { '@id': serviceId }, breadcrumb: { '@id': `${canonical}#breadcrumbs` },
    },
    {
      '@type': 'Service', '@id': serviceId, name: service.names[locale], serviceType: service.names[locale],
      description: service.descriptions[locale], url: canonical, provider: { '@id': personId },
      subjectOf: service.related.map((slug) => ({ '@type': 'CreativeWork', url: absoluteUrl(locale, `projects/${slug}`) })),
    },
    faq.node, personNode(), crumbs.node,
  ];
  return layout({ locale, tail, seoTitle: title, description: service.descriptions[locale], body, nodes });
}

for (const locale of Object.keys(locales)) {
  const hubPath = diskPath(locale, 'services');
  mkdirSync(dirname(hubPath), { recursive: true });
  writeFileSync(hubPath, serviceHubPage(locale));
  for (const service of services) {
    const path = diskPath(locale, `services/${service.slug}`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, servicePage(service, locale));
  }
}

const serviceTails = ['services', ...services.map((service) => `services/${service.slug}`)];
const sitemapPath = resolve(output, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  let sitemap = readFileSync(sitemapPath, 'utf8');
  const start = '<!-- ANI_SERVICE_SEO_START -->';
  const end = '<!-- ANI_SERVICE_SEO_END -->';
  const entries = [];
  for (const tail of serviceTails) {
    for (const locale of Object.keys(locales)) {
      const loc = absoluteUrl(locale, tail);
      entries.push(`  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${updatedIso}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${tail === 'services' ? '0.9' : '0.85'}</priority>\n    <xhtml:link rel="alternate" hreflang="hy-AM" href="${esc(absoluteUrl('hy', tail))}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${esc(absoluteUrl('en', tail))}" />\n    <xhtml:link rel="alternate" hreflang="ru" href="${esc(absoluteUrl('ru', tail))}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(absoluteUrl('hy', tail))}" />\n  </url>`);
    }
  }
  const block = `${start}\n${entries.join('\n')}\n${end}`;
  if (sitemap.includes(start) && sitemap.includes(end)) {
    sitemap = sitemap.replace(new RegExp(`${start}[\\s\\S]*?${end}`), block);
  } else {
    sitemap = sitemap.replace('</urlset>', `${block}\n</urlset>`);
  }
  writeFileSync(sitemapPath, sitemap);
}

const llmsPath = resolve(output, 'llms.txt');
const llmsStart = '<!-- ANI_SERVICE_INDEX_START -->';
const llmsEnd = '<!-- ANI_SERVICE_INDEX_END -->';
const serviceLines = services.map((service) => `- ${service.names.en}: ${absoluteUrl('en', `services/${service.slug}`)}`).join('\n');
const llmsBlock = `${llmsStart}\n## Professional services\n- Services overview: ${absoluteUrl('en', 'services')}\n${serviceLines}\n${llmsEnd}`;
if (existsSync(llmsPath)) {
  let llms = readFileSync(llmsPath, 'utf8');
  if (llms.includes(llmsStart) && llms.includes(llmsEnd)) {
    llms = llms.replace(new RegExp(`${llmsStart}[\\s\\S]*?${llmsEnd}`), llmsBlock);
  } else {
    llms += `\n\n${llmsBlock}\n`;
  }
  writeFileSync(llmsPath, llms);
}

console.log(`Generated ${serviceTails.length * Object.keys(locales).length} multilingual service-intent SEO pages.`);
