import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { projects, hubs, locales, localizedPath, allSeoPageTails, updatedIso } from "./seo-page-data.mjs";

const repository = process.env.GITHUB_REPOSITORY ?? "";
const [owner = "", repositoryName = ""] = repository.split("/");
const isUserOrOrgSite = Boolean(owner) && repositoryName === `${owner}.github.io`;
const inferredBasePath =
  process.env.GITHUB_ACTIONS === "true" && repositoryName && !isUserOrOrgSite
    ? `/${repositoryName}`
    : "";
const basePath = process.env.SITE_BASE_PATH ?? inferredBasePath;
const inferredSiteUrl = owner ? `https://${owner}.github.io${basePath}` : "";
const siteUrl = (process.env.SITE_URL || inferredSiteUrl || "https://ani-maghakian.github.io/Ani-Maghakyan").replace(/\/$/, "");
const output = resolve("dist/client");

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function absoluteUrl(locale, tail = "") {
  const path = localizedPath(locale, tail);
  return `${siteUrl}/${path ? `${path}/` : ""}`;
}

function diskPath(locale, tail = "") {
  const path = localizedPath(locale, tail);
  return resolve(output, path, "index.html");
}

function baseHref(locale) {
  return absoluteUrl(locale);
}

function hreflangLinks(tail) {
  return [
    `<link rel="alternate" hreflang="hy-AM" href="${esc(absoluteUrl("hy", tail))}">`,
    `<link rel="alternate" hreflang="en" href="${esc(absoluteUrl("en", tail))}">`,
    `<link rel="alternate" hreflang="ru" href="${esc(absoluteUrl("ru", tail))}">`,
    `<link rel="alternate" hreflang="x-default" href="${esc(absoluteUrl("hy", tail))}">`,
  ].join("\n");
}

function hubBySlug(slug) {
  return hubs.find((hub) => hub.slug === slug);
}

function commonNav(locale) {
  const t = locales[locale];
  const navHubs = ["projects", "about", "press", "books", "work-with-ani"]
    .map(hubBySlug)
    .filter(Boolean);
  const links = [
    { label: t.homeLabel, tail: "" },
    ...navHubs.map((hub) => ({ label: hub.titles[locale], tail: hub.slug })),
  ];
  return `<nav class="topnav" aria-label="${esc(t.exploreLabel)}">${links
    .map((item) => `<a href="${esc(absoluteUrl(locale, item.tail))}">${esc(item.label)}</a>`)
    .join("")}</nav>`;
}

function languageNav(tail) {
  return `<nav class="languages" aria-label="Languages">
    <a hreflang="hy-AM" href="${esc(absoluteUrl("hy", tail))}">HY</a>
    <a hreflang="en" href="${esc(absoluteUrl("en", tail))}">EN</a>
    <a hreflang="ru" href="${esc(absoluteUrl("ru", tail))}">RU</a>
  </nav>`;
}

function sourceList(locale, sources) {
  if (!sources?.length) return "";
  return `<section class="sources" aria-labelledby="sources-heading">
    <p class="kicker">EVIDENCE / DESTINATIONS</p>
    <h2 id="sources-heading">${esc(locales[locale].sourcesLabel)}</h2>
    <ol>${sources.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ol>
  </section>`;
}

function projectImage(project) {
  if (project.poster) {
    if (project.poster.startsWith("/")) return `${siteUrl}${project.poster}`;
    return project.poster;
  }
  const videoId = project.watchUrl?.match(/[?&]v=([^&]+)/)?.[1];
  if (videoId) return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  return `${siteUrl}/hero.webp`;
}

function uniqueTitles(project) {
  return [...new Set([project.titles.hy, project.titles.en, project.titles.ru].filter(Boolean))];
}

function localizedSeoTitle(project, locale) {
  const title = project.titles[locale];
  if (locale === "hy") return `${title} (${project.year}) — Անի Մաղաքյան | Պաշտոնական էջ`;
  if (locale === "ru") return `${title} (${project.year}) — Ани Магакян | Официальная страница`;
  return `${title} (${project.year}) — Ani Maghakyan | Official Project`;
}

function archiveNote(locale) {
  if (locale === "hy") return "Այս էջը պաշտոնական հեղինակային արխիվի առաջին կողմի գրառում է։ Արտաքին աղբյուրները ներկայացվում են որպես լրացուցիչ հաստատում կամ դիտման ուղղություն, և հակասող տվյալները առանց ստուգման չեն վերագրվում։";
  if (locale === "ru") return "Эта страница является первичной записью официального авторского архива. Внешние источники приведены как дополнительное подтверждение или направление для просмотра; противоречащие данные не переписываются без проверки.";
  return "This page is a first-party record from the official author archive. External sources are presented as supporting evidence or viewing destinations; conflicting records are not silently overwritten without verification.";
}

function breadcrumbLabels(locale) {
  if (locale === "hy") return { projects: "Նախագծեր" };
  if (locale === "ru") return { projects: "Проекты" };
  return { projects: "Projects" };
}

function layout({ locale, tail, seoTitle, title, description, eyebrow, body, jsonLd, image }) {
  const canonical = absoluteUrl(locale, tail);
  const lang = locales[locale].lang;
  const socialImage = image || `${siteUrl}/hero.webp`;
  return `<!doctype html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(seoTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${esc(canonical)}">
${hreflangLinks(tail)}
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(seoTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(socialImage)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>
<style>
:root{color-scheme:light;--paper:#f4efe7;--paper2:#fffdf8;--ink:#171713;--muted:#6e675f;--line:rgba(23,23,19,.16);--accent:#66772d}
*{box-sizing:border-box}html{background:var(--paper)}body{margin:0;background:radial-gradient(circle at 90% 0,rgba(206,190,255,.38),transparent 30rem),radial-gradient(circle at 0 0,rgba(205,232,255,.45),transparent 28rem),var(--paper);color:var(--ink);font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;line-height:1.55}
a{color:inherit;text-underline-offset:.18em}.shell{width:min(1160px,calc(100% - 32px));margin:auto}.masthead{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0;border-bottom:1px solid var(--line)}.brand{font-weight:850;letter-spacing:.09em;text-decoration:none}.topnav,.languages{display:flex;flex-wrap:wrap;gap:13px;font-size:.8rem}.topnav a,.languages a{text-decoration:none;color:var(--muted)}.crumbs{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px;color:var(--muted);font-size:.78rem}.crumbs a{text-decoration:none}.hero{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(260px,.65fr);gap:clamp(32px,6vw,80px);padding:clamp(48px,8vw,104px) 0 48px;border-bottom:1px solid var(--line);align-items:center}.hero-media{border:1px solid var(--line);border-radius:28px;overflow:hidden;background:rgba(255,255,255,.46);aspect-ratio:16/10;display:grid;place-items:center}.hero-media img{display:block;width:100%;height:100%;object-fit:contain}.kicker{margin:0 0 16px;font-size:.72rem;font-weight:850;letter-spacing:.16em;color:var(--accent);text-transform:uppercase}h1{font-size:clamp(3rem,7.5vw,7.2rem);line-height:.9;letter-spacing:-.055em;margin:0;max-width:13ch}h2{font-size:clamp(1.45rem,3vw,2.25rem);letter-spacing:-.03em}.dek{font-size:clamp(1.03rem,1.8vw,1.28rem);max-width:760px;color:#37342f;margin:26px 0 0}.aliases{margin:19px 0 0;color:var(--muted);font-size:.82rem;font-weight:700;letter-spacing:.04em}.meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin:34px 0 0}.meta div{background:var(--paper2);padding:18px}.meta strong{display:block;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}.content{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(260px,.72fr);gap:clamp(36px,7vw,96px);padding:50px 0 78px}.prose{font-size:1.04rem;max-width:790px}.prose>p:first-child{font-size:1.2rem}.sources{border-top:1px solid var(--line);padding-top:28px}.sources ol{padding-left:1.2rem}.sources li{margin:.72rem 0}.cta{display:flex;flex-wrap:wrap;gap:12px;border-top:1px solid var(--line);padding-top:25px;margin-top:30px}.cta a{display:inline-flex;padding:13px 18px;border-radius:999px;background:var(--ink);color:#fff;text-decoration:none;font-size:.78rem;font-weight:800}.related{margin-top:34px}.related-grid,.project-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.related-grid a,.project-grid a{border:1px solid var(--line);border-radius:16px;padding:15px;text-decoration:none;display:block;background:rgba(255,255,255,.32)}.related-grid small,.project-grid small{display:block;color:var(--muted);margin-top:4px}.index-content{padding:48px 0 78px}.project-grid.all{grid-template-columns:repeat(3,minmax(0,1fr))}.footer{border-top:1px solid var(--line);padding:28px 0 48px;display:flex;justify-content:space-between;gap:20px;color:var(--muted);font-size:.82rem}@media(max-width:820px){.masthead{align-items:flex-start;flex-direction:column}.topnav{display:none}.hero{grid-template-columns:1fr}.hero-media{order:-1}.content{grid-template-columns:1fr}.meta{grid-template-columns:1fr}.project-grid,.project-grid.all,.related-grid{grid-template-columns:1fr}.footer{flex-direction:column}h1{font-size:clamp(2.8rem,15vw,5rem)}}
</style>
</head>
<body>
<div class="shell">
<header class="masthead"><a class="brand" href="${esc(baseHref(locale))}">A. MAGHAKYAN</a>${commonNav(locale)}${languageNav(tail)}</header>
${body}
<footer class="footer"><span>ANI MAGHAKYAN · OFFICIAL ARCHIVE</span><span>Updated ${esc(updatedIso)}</span></footer>
</div>
</body>
</html>`;
}

function projectPage(project, locale, index) {
  const tail = `projects/${project.slug}`;
  const title = project.titles[locale];
  const seoTitle = localizedSeoTitle(project, locale);
  const description = project.summaries[locale];
  const canonical = absoluteUrl(locale, tail);
  const personId = `${siteUrl}/#person`;
  const image = projectImage(project);
  const aliasText = uniqueTitles(project).join(" · ");
  const facts = project.facts[locale];
  const previous = projects[index - 1];
  const next = projects[index + 1];
  const related = [previous, next].filter(Boolean);
  const crumbs = breadcrumbLabels(locale);
  const workNode = {
    "@type": project.type,
    "@id": `${canonical}#work`,
    url: canonical,
    name: title,
    alternateName: uniqueTitles(project),
    datePublished: project.year.split("–")[0],
    image,
    inLanguage: "hy",
    contributor: { "@id": personId },
    isPartOf: { "@id": `${absoluteUrl(locale, "projects")}#collection` },
    sameAs: project.sources.map((source) => source.url),
    ...(Number.isInteger(project.episodes) ? { numberOfEpisodes: project.episodes } : {}),
  };
  if (["elens-diary", "paper-dream", "dear-sahmi", "summer-of-84", "blockade", "mi-gexecik-or"].includes(project.slug)) {
    workNode.author = { "@id": personId };
  }
  if (project.slug === "summer-of-84") {
    workNode.creator = { "@id": personId };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: seoTitle,
        headline: title,
        inLanguage: locales[locale].lang,
        description,
        image,
        about: { "@id": `${canonical}#work` },
        mainEntity: { "@id": `${canonical}#work` },
        author: { "@id": personId },
        isPartOf: { "@id": `${absoluteUrl(locale, "projects")}#collection` },
      },
      workNode,
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locales[locale].homeLabel, item: baseHref(locale) },
          { "@type": "ListItem", position: 2, name: crumbs.projects, item: absoluteUrl(locale, "projects") },
          { "@type": "ListItem", position: 3, name: title, item: canonical },
        ],
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Ani Maghakyan",
        alternateName: ["Անի Մաղաքյան", "Ани Магакян", "Ani Hamlet Maghakyan", "Ani Maghakian"],
        jobTitle: ["Screenwriter", "Showrunner", "Producer", "Author"],
        url: `${siteUrl}/`,
        sameAs: [
          "https://www.imdb.com/name/nm9250160/",
          "https://www.kinopoisk.ru/name/5444828/",
          "https://elcinema.com/en/person/2161108/",
          "https://www.instagram.com/ani_maghaqia/",
        ],
      },
    ],
  };

  const watchCta = project.watchUrl
    ? `<div class="cta"><a href="${esc(project.watchUrl)}" target="_blank" rel="noopener noreferrer">${esc(locales[locale].watchLabel)} →</a><a href="${esc(`${baseHref(locale)}#filmography`)}">${esc(locales[locale].backLabel)} →</a></div>`
    : `<div class="cta"><a href="${esc(`${baseHref(locale)}#filmography`)}">${esc(locales[locale].backLabel)} →</a></div>`;

  const relatedHtml = related.length
    ? `<section class="related"><h2>${esc(locales[locale].relatedLabel)}</h2><div class="related-grid">${related
        .map((item) => `<a href="${esc(absoluteUrl(locale, `projects/${item.slug}`))}"><strong>${esc(item.titles[locale])}</strong><small>${esc(item.year)} · ${esc(item.credit[locale])}</small></a>`)
        .join("")}</div></section>`
    : "";

  const body = `<main>
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${esc(baseHref(locale))}">${esc(locales[locale].homeLabel)}</a><span>/</span><a href="${esc(absoluteUrl(locale, "projects"))}">${esc(crumbs.projects)}</a><span>/</span><span>${esc(title)}</span></nav>
    <section class="hero">
      <div><p class="kicker">PROJECT ${String(project.id).padStart(2, "0")} · ${esc(project.year)}</p><h1>${esc(title)}</h1><p class="aliases"><strong>${esc(locales[locale].aliasesLabel)}:</strong> ${esc(aliasText)}</p><p class="dek">${esc(description)}</p></div>
      <figure class="hero-media"><img src="${esc(image)}" alt="${esc(`${title} — ${project.year}`)}" loading="eager" decoding="async"></figure>
    </section>
    <section class="content"><article class="prose">
      <div class="meta"><div><strong>Year</strong>${esc(facts[0] ?? project.year)}</div><div><strong>Archive</strong>${esc(facts[1] ?? project.roles[locale])}</div><div><strong>Volume</strong>${esc(facts[2] ?? project.credit[locale])}</div></div>
      <p>${esc(archiveNote(locale))}</p>
      <p><strong>${esc(project.roles[locale])}</strong></p>
      ${watchCta}
      ${relatedHtml}
    </article>${sourceList(locale, project.sources)}</section>
  </main>`;

  return layout({ locale, tail, seoTitle, title, description, eyebrow: `PROJECT · ${project.year}`, body, jsonLd, image });
}

function projectIndexPage(hub, locale) {
  const tail = hub.slug;
  const title = hub.titles[locale];
  const seoTitle = title;
  const description = hub.descriptions[locale];
  const canonical = absoluteUrl(locale, tail);
  const personId = `${siteUrl}/#person`;
  const grid = projects
    .map((p) => `<a href="${esc(absoluteUrl(locale, `projects/${p.slug}`))}"><strong>${String(p.id).padStart(2, "0")} · ${esc(p.titles[locale])}</strong><small>${esc(p.year)} · ${esc(p.credit[locale])}</small></a>`)
    .join("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${canonical}#page`, url: canonical, name: title, description, inLanguage: locales[locale].lang, mainEntity: { "@id": `${canonical}#collection` } },
      {
        "@type": "ItemList",
        "@id": `${canonical}#collection`,
        name: title,
        numberOfItems: projects.length,
        itemListElement: projects.map((p, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(locale, `projects/${p.slug}`),
          name: p.titles[locale],
        })),
      },
      { "@type": "Person", "@id": personId, name: "Ani Maghakyan", alternateName: ["Անի Մաղաքյան", "Ани Магакян"], url: `${siteUrl}/` },
    ],
  };
  const body = `<main><section class="hero"><div><p class="kicker">PROJECT INDEX · 47</p><h1>${esc(title)}</h1><p class="dek">${esc(description)}</p></div></section><section class="index-content"><div class="project-grid all">${grid}</div></section></main>`;
  return layout({ locale, tail, seoTitle, title, description, eyebrow: "PROJECT INDEX", body, jsonLd, image: `${siteUrl}/hero.webp` });
}

function hubPage(hub, locale) {
  if (hub.slug === "projects") return projectIndexPage(hub, locale);

  const tail = hub.slug;
  const title = hub.titles[locale];
  const seoTitle = title;
  const description = hub.descriptions[locale];
  const canonical = absoluteUrl(locale, tail);
  const personId = `${siteUrl}/#person`;
  const featured = projects.filter((p) => ["elens-diary", "paper-dream", "summer-of-84", "blockade", "mi-gexecik-or", "hotel-grand"].includes(p.slug));
  const projectGrid = featured.map((p) => `<a href="${esc(absoluteUrl(locale, `projects/${p.slug}`))}"><strong>${esc(p.titles[locale])}</strong><small>${esc(p.year)} · ${esc(p.credit[locale])}</small></a>`).join("");
  const workBody = hub.slug === "work-with-ani" ? `<article class="prose"><h2>${esc(locale === "ru" ? "Направления сотрудничества" : locale === "en" ? "Collaboration areas" : "Համագործակցության ուղղություններ")}</h2><ul>
    <li>${esc(locale === "ru" ? "Разработка идеи, концепции и архитектуры истории" : locale === "en" ? "Concept, story development and narrative architecture" : "Գաղափարի, կոնցեպտի և պատմության ճարտարապետության մշակում")}</li>
    <li>${esc(locale === "ru" ? "Сценарная разработка сериалов, фильмов и специальных форматов" : locale === "en" ? "Screenwriting for series, films and special formats" : "Սերիալների, ֆիլմերի և հատուկ ձևաչափերի սցենարային մշակում")}</li>
    <li>${esc(locale === "ru" ? "Руководство writers’ room и редактура сценарной команды" : locale === "en" ? "Writers’ room leadership and script-team editorial direction" : "Սցենարային սենյակի ղեկավարում և թիմային խմբագրում")}</li>
    <li>${esc(locale === "ru" ? "Шоураннинг, креативный контроль и творческое продюсирование" : locale === "en" ? "Showrunning, creative oversight and creative production" : "Շոուռանինգ, ստեղծագործական վերահսկողություն և կրեատիվ պրոդյուսինգ")}</li>
    </ul><div class="cta"><a href="https://www.instagram.com/maghakianscripts/" target="_blank" rel="noopener noreferrer">${esc(locale === "ru" ? "Связаться с Maghakian Scripts →" : locale === "en" ? "Contact Maghakian Scripts →" : "Կապվել Maghakian Scripts-ի հետ →")}</a></div></article>` : `<article class="prose"><p>${esc(description)}</p><h2>${esc(locale === "ru" ? "Ключевые проекты" : locale === "en" ? "Key projects" : "Առանցքային նախագծեր")}</h2><div class="project-grid">${projectGrid}</div></article>`;
  const body = `<main><section class="hero"><div><p class="kicker">${esc(hub.slug.toUpperCase().replaceAll("-", " "))}</p><h1>${esc(title)}</h1><p class="dek">${esc(description)}</p></div></section><section class="content">${workBody}${sourceList(locale, hub.sources)}</section></main>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", "@id": `${canonical}#page`, url: canonical, name: title, description, inLanguage: locales[locale].lang, mainEntity: { "@id": personId } },
      { "@type": "Person", "@id": personId, name: "Ani Maghakyan", alternateName: ["Անի Մաղաքյան", "Ани Магакян"], jobTitle: ["Screenwriter", "Showrunner", "Producer", "Author"], url: `${siteUrl}/`, sameAs: ["https://www.imdb.com/name/nm9250160/", "https://www.kinopoisk.ru/name/5444828/", "https://elcinema.com/en/person/2161108/"] },
    ],
  };
  return layout({ locale, tail, seoTitle, title, description, eyebrow: hub.slug, body, jsonLd, image: `${siteUrl}/hero.webp` });
}

for (const locale of Object.keys(locales)) {
  projects.forEach((project, index) => {
    const path = diskPath(locale, `projects/${project.slug}`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, projectPage(project, locale, index));
  });
  for (const hub of hubs) {
    const path = diskPath(locale, hub.slug);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, hubPage(hub, locale));
  }
}

// Add a compact crawlable hub to every localized homepage. Individual projects are already linked
// from the visible filmography table; this nav exposes the collection/hub hierarchy without a 47-link footer dump.
for (const locale of Object.keys(locales)) {
  const homePath = resolve(output, locales[locale].prefix, "index.html");
  if (!existsSync(homePath)) continue;
  let html = readFileSync(homePath, "utf8");
  const start = "<!-- ANI_SEO_HUB_START -->";
  const end = "<!-- ANI_SEO_HUB_END -->";
  const linkItems = hubs.map((hub) => ({ label: hub.titles[locale], tail: hub.slug }));
  const nav = `${start}<nav data-seo-hub="ani" aria-label="${esc(locales[locale].exploreLabel)}" style="border-top:1px solid rgba(23,23,19,.16);padding:20px 0;margin-top:20px;display:flex;flex-wrap:wrap;gap:10px 16px;font-size:.82rem"><strong style="width:100%;letter-spacing:.08em">${esc(locales[locale].exploreLabel)}</strong>${linkItems.map((item) => `<a style="color:inherit;text-underline-offset:.2em" href="${esc(absoluteUrl(locale, item.tail))}">${esc(item.label)}</a>`).join("")}</nav>${end}`;
  if (html.includes(start) && html.includes(end)) {
    html = html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), nav);
  } else {
    html = html.includes("</footer>") ? html.replace("</footer>", `${nav}</footer>`) : html.replace("</body>", `${nav}</body>`);
  }
  writeFileSync(homePath, html);
}

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
