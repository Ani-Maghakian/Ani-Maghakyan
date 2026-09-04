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
  return String(value)
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

function commonNav(locale) {
  const t = locales[locale];
  const links = [
    { label: t.homeLabel, tail: "" },
    { label: hubs.find((x) => x.slug === "about").titles[locale], tail: "about" },
    { label: hubs.find((x) => x.slug === "press").titles[locale], tail: "press" },
    { label: hubs.find((x) => x.slug === "books").titles[locale], tail: "books" },
    { label: hubs.find((x) => x.slug === "work-with-ani").titles[locale], tail: "work-with-ani" },
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
    <p class="kicker">EVIDENCE</p>
    <h2 id="sources-heading">${esc(locales[locale].sourcesLabel)}</h2>
    <ol>${sources.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ol>
  </section>`;
}

function layout({ locale, tail, title, description, eyebrow, body, jsonLd }) {
  const canonical = absoluteUrl(locale, tail);
  const lang = locales[locale].lang;
  return `<!doctype html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | Ani Maghakyan</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${esc(canonical)}">
${hreflangLinks(tail)}
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)} | Ani Maghakyan">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(`${siteUrl}/hero.webp`)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>
<style>
:root{color-scheme:light;--paper:#f1eadf;--ink:#171713;--muted:#6e675f;--line:rgba(23,23,19,.16);--accent:#815d39}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;line-height:1.55}
a{color:inherit;text-underline-offset:.18em}.shell{width:min(1120px,calc(100% - 32px));margin:auto}.masthead{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 0;border-bottom:1px solid var(--line)}.brand{font-weight:800;letter-spacing:.08em;text-decoration:none}.topnav,.languages{display:flex;flex-wrap:wrap;gap:14px;font-size:.83rem}.topnav a,.languages a{text-decoration:none;color:var(--muted)}.hero{padding:clamp(56px,9vw,120px) 0 54px;border-bottom:1px solid var(--line)}.kicker{margin:0 0 16px;font-size:.75rem;font-weight:800;letter-spacing:.16em;color:var(--accent)}h1{font-size:clamp(3rem,8vw,7.5rem);line-height:.88;letter-spacing:-.055em;margin:0;max-width:12ch}h2{font-size:clamp(1.5rem,3vw,2.3rem);letter-spacing:-.03em}.dek{font-size:clamp(1.05rem,2vw,1.35rem);max-width:760px;color:#37342f;margin:28px 0 0}.meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin:36px 0 0}.meta div{background:var(--paper);padding:18px}.meta strong{display:block;font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}.content{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(260px,.7fr);gap:clamp(36px,7vw,96px);padding:54px 0 80px}.prose{font-size:1.06rem;max-width:760px}.prose p:first-child{font-size:1.25rem}.sources{border-top:1px solid var(--line);padding-top:28px}.sources ol{padding-left:1.2rem}.sources li{margin:.7rem 0}.project-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:24px}.project-grid a{border:1px solid var(--line);padding:16px;text-decoration:none;display:block}.project-grid small{display:block;color:var(--muted);margin-top:4px}.cta{border:1px solid var(--ink);padding:24px;margin-top:28px}.cta a{font-weight:800}.footer{border-top:1px solid var(--line);padding:28px 0 48px;display:flex;justify-content:space-between;gap:20px;color:var(--muted);font-size:.86rem}@media(max-width:760px){.masthead{align-items:flex-start;flex-direction:column}.topnav{display:none}.content{grid-template-columns:1fr}.meta{grid-template-columns:1fr}.project-grid{grid-template-columns:1fr}.footer{flex-direction:column}h1{font-size:clamp(2.8rem,16vw,5rem)}}
</style>
</head>
<body>
<div class="shell">
<header class="masthead"><a class="brand" href="${esc(baseHref(locale))}">A. MAGHAKYAN</a>${commonNav(locale)}${languageNav(tail)}</header>
<main>
<section class="hero"><p class="kicker">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p class="dek">${esc(description)}</p></section>
${body}
</main>
<footer class="footer"><span>ANI MAGHAKYAN · OFFICIAL ARCHIVE</span><span>Updated ${esc(updatedIso)}</span></footer>
</div>
</body>
</html>`;
}

function projectPage(project, locale) {
  const tail = `projects/${project.slug}`;
  const title = project.titles[locale];
  const description = project.summaries[locale];
  const canonical = absoluteUrl(locale, tail);
  const personId = `${siteUrl}/#person`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${title} — Ani Maghakyan`,
        inLanguage: locales[locale].lang,
        description,
        about: { "@id": `${canonical}#work` },
        author: { "@id": personId },
      },
      {
        "@type": project.type,
        "@id": `${canonical}#work`,
        name: title,
        alternateName: [project.titles.hy, project.titles.en, project.titles.ru],
        datePublished: project.year.split("–")[0],
        creator: { "@id": personId },
        author: { "@id": personId },
        inLanguage: "hy",
        sameAs: project.sources.map((source) => source.url),
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Ani Maghakyan",
        alternateName: ["Անի Մաղաքյան", "Ани Магакян", "Ani Hamlet Maghakyan"],
        jobTitle: ["Screenwriter", "Showrunner", "Producer", "Author"],
        url: `${siteUrl}/`,
        sameAs: ["https://www.imdb.com/name/nm9250160/", "https://www.kinopoisk.ru/name/5444828/"],
      },
    ],
  };
  const facts = project.facts[locale];
  const body = `<section class="content"><article class="prose"><p>${esc(description)}</p>
    <div class="meta"><div><strong>Year</strong>${esc(facts[0] ?? project.year)}</div><div><strong>Role</strong>${esc(project.roles[locale])}</div><div><strong>Record</strong>${esc(facts[2] ?? facts[1] ?? "Official archive")}</div></div>
    <p>${locale === "ru" ? "Эта страница разделяет сведения официального авторского архива и данные независимых источников. Если внешние базы используют другую классификацию формата или количества эпизодов, расхождение не скрывается и не переписывается без проверки." : locale === "en" ? "This page distinguishes first-party author-archive information from independent third-party records. When outside databases classify a format or episode count differently, the discrepancy is preserved rather than silently overwritten." : "Այս էջը տարանջատում է պաշտոնական հեղինակային արխիվի և անկախ արտաքին աղբյուրների տվյալները։ Եթե արտաքին բազան ձևաչափը կամ սերիաների քանակը այլ կերպ է դասակարգում, տարբերությունը չի թաքցվում և առանց ստուգման չի վերագրվում։"}</p>
    <div class="cta"><a href="${esc(`${baseHref(locale)}#contact`)}">${esc(locale === "ru" ? "Связаться по поводу проекта или сотрудничества →" : locale === "en" ? "Contact for project or collaboration inquiries →" : "Կապվել նախագծի կամ համագործակցության հարցով →")}</a></div>
    </article>${sourceList(locale, project.sources)}</section>`;
  return layout({ locale, tail, title, description, eyebrow: `PROJECT · ${project.year}`, body, jsonLd });
}

function hubPage(hub, locale) {
  const tail = hub.slug;
  const title = hub.titles[locale];
  const description = hub.descriptions[locale];
  const canonical = absoluteUrl(locale, tail);
  const personId = `${siteUrl}/#person`;
  const projectGrid = projects.map((p) => `<a href="${esc(absoluteUrl(locale, `projects/${p.slug}`))}"><strong>${esc(p.titles[locale])}</strong><small>${esc(p.year)} · ${esc(p.roles[locale])}</small></a>`).join("");
  const workBody = hub.slug === "work-with-ani" ? `<article class="prose"><h2>${esc(locale === "ru" ? "Направления сотрудничества" : locale === "en" ? "Collaboration areas" : "Համագործակցության ուղղություններ")}</h2><ul>
    <li>${esc(locale === "ru" ? "Разработка идеи, концепции и архитектуры истории" : locale === "en" ? "Concept, story development and narrative architecture" : "Գաղափարի, կոնցեպտի և պատմության ճարտարապետության մշակում")}</li>
    <li>${esc(locale === "ru" ? "Сценарная разработка сериалов, фильмов и специальных форматов" : locale === "en" ? "Screenwriting for series, films and special formats" : "Սերիալների, ֆիլմերի և հատուկ ձևաչափերի սցենարային մշակում")}</li>
    <li>${esc(locale === "ru" ? "Руководство writers’ room и редактура сценарной команды" : locale === "en" ? "Writers’ room leadership and script-team editorial direction" : "Սցենարային սենյակի ղեկավարում և թիմային խմբագրում")}</li>
    <li>${esc(locale === "ru" ? "Шоураннинг, креативный контроль и творческое продюсирование" : locale === "en" ? "Showrunning, creative oversight and creative production" : "Շոուռանինգ, ստեղծագործական վերահսկողություն և կրեատիվ պրոդյուսինգ")}</li>
    </ul><div class="cta"><a href="https://www.instagram.com/maghakianscripts/" target="_blank" rel="noopener noreferrer">${esc(locale === "ru" ? "Связаться с Maghakian Scripts →" : locale === "en" ? "Contact Maghakian Scripts →" : "Կապվել Maghakian Scripts-ի հետ →")}</a></div></article>` : `<article class="prose"><p>${esc(description)}</p><h2>${esc(locale === "ru" ? "Ключевые проекты" : locale === "en" ? "Key projects" : "Առանցքային նախագծեր")}</h2><div class="project-grid">${projectGrid}</div></article>`;
  const body = `<section class="content">${workBody}${sourceList(locale, hub.sources)}</section>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", "@id": `${canonical}#page`, url: canonical, name: title, description, inLanguage: locales[locale].lang, mainEntity: { "@id": personId } },
      { "@type": "Person", "@id": personId, name: "Ani Maghakyan", alternateName: ["Անի Մաղաքյան", "Ани Магакян"], jobTitle: ["Screenwriter", "Showrunner", "Producer", "Author"], url: `${siteUrl}/`, sameAs: ["https://www.imdb.com/name/nm9250160/", "https://www.kinopoisk.ru/name/5444828/", "https://elcinema.com/en/person/2161108/"] },
    ],
  };
  return layout({ locale, tail, title, description, eyebrow: hub.slug.toUpperCase().replaceAll("-", " "), body, jsonLd });
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

// Add visible internal links to every localized homepage after the framework build.
for (const locale of Object.keys(locales)) {
  const homePath = resolve(output, locales[locale].prefix, "index.html");
  if (!existsSync(homePath)) continue;
  let html = readFileSync(homePath, "utf8");
  if (!html.includes('data-seo-hub="ani"')) {
    const linkItems = [
      ...hubs.map((hub) => ({ label: hub.titles[locale], tail: hub.slug })),
      ...projects.map((project) => ({ label: project.titles[locale], tail: `projects/${project.slug}` })),
    ];
    const nav = `<nav data-seo-hub="ani" aria-label="${esc(locales[locale].exploreLabel)}" style="border-top:1px solid rgba(23,23,19,.16);padding:20px 0;margin-top:20px;display:flex;flex-wrap:wrap;gap:10px 16px;font-size:.82rem"><strong style="width:100%;letter-spacing:.08em">${esc(locales[locale].exploreLabel)}</strong>${linkItems.map((item) => `<a style="color:inherit;text-underline-offset:.2em" href="${esc(absoluteUrl(locale, item.tail))}">${esc(item.label)}</a>`).join("")}</nav>`;
    html = html.includes("</footer>") ? html.replace("</footer>", `${nav}</footer>`) : html.replace("</body>", `${nav}</body>`);
    writeFileSync(homePath, html);
  }
}

// Expand sitemap with all new localized pages and mutual hreflang annotations.
const sitemapPath = resolve(output, "sitemap.xml");
if (existsSync(sitemapPath)) {
  let sitemap = readFileSync(sitemapPath, "utf8");
  const tails = allSeoPageTails();
  const entries = [];
  for (const tail of tails) {
    for (const locale of Object.keys(locales)) {
      const loc = absoluteUrl(locale, tail);
      entries.push(`  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${updatedIso}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${tail.startsWith("projects/") ? "0.85" : "0.75"}</priority>\n    <xhtml:link rel="alternate" hreflang="hy-AM" href="${esc(absoluteUrl("hy", tail))}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${esc(absoluteUrl("en", tail))}" />\n    <xhtml:link rel="alternate" hreflang="ru" href="${esc(absoluteUrl("ru", tail))}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(absoluteUrl("hy", tail))}" />\n  </url>`);
    }
  }
  sitemap = sitemap.replace("</urlset>", `${entries.join("\n")}\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}

// Extend llms.txt as a machine-readable discovery aid. This is not treated as a ranking factor.
const llmsPath = resolve(output, "llms.txt");
const keyPages = allSeoPageTails().map((tail) => `- ${absoluteUrl("en", tail)}`).join("\n");
const llmsAppend = `\n\n## Key evidence and project pages\n${keyPages}\n`;
if (existsSync(llmsPath)) {
  let llms = readFileSync(llmsPath, "utf8");
  if (!llms.includes("## Key evidence and project pages")) writeFileSync(llmsPath, llms + llmsAppend);
} else {
  writeFileSync(llmsPath, `# Ani Maghakyan\n\nOfficial multilingual portfolio and filmography.\n${llmsAppend}`);
}

console.log(`Generated ${allSeoPageTails().length * Object.keys(locales).length} standalone SEO pages.`);
