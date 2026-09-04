import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const packageDir = dirname(fileURLToPath(import.meta.url));

function read(path) {
  const full = resolve(root, path);
  if (!existsSync(full)) throw new Error(`Missing ${path}. Run this script from the repository root.`);
  return readFileSync(full, "utf8");
}

function write(path, content) {
  writeFileSync(resolve(root, path), content);
  console.log(`updated ${path}`);
}

function replaceRequired(source, search, replacement, label = search.slice(0, 60)) {
  if (!source.includes(search)) throw new Error(`Expected source not found: ${label}`);
  return source.replace(search, replacement);
}

function replaceAllSafe(source, search, replacement) {
  return source.split(search).join(replacement);
}

// 1) Content: current 47th project, fresher authority sources, accurate visible totals.
{
  const path = "lib/content.ts";
  let text = read(path);

  text = replaceRequired(text, 'export const updatedIso = "2026-09-02";', 'export const updatedIso = "2026-09-03";', "updatedIso");

  if (!text.includes('id: 47, title: { hy: "Մի գեղեցիկ օր"')) {
    text = replaceRequired(
      text,
      '  { id: 46, title: { hy: "Se.La.Vi", en: "Se.La.Vi", ru: "Se.La.Vi" }, year: "2026", credit: { hy: "10 մաս", en: "10 parts", ru: "10 частей" }, kind: "series", episodes: 10, featuredRank: 10, poster: "https://i.ytimg.com/vi/CkbtuC2HHi8/maxresdefault.jpg", watchUrl: "https://www.youtube.com/watch?v=CkbtuC2HHi8", watchKind: "youtube" },\n];',
      '  { id: 46, title: { hy: "Se.La.Vi", en: "Se.La.Vi", ru: "Se.La.Vi" }, year: "2026", credit: { hy: "10 մաս", en: "10 parts", ru: "10 частей" }, kind: "series", episodes: 10, featuredRank: 10, poster: "https://i.ytimg.com/vi/CkbtuC2HHi8/maxresdefault.jpg", watchUrl: "https://www.youtube.com/watch?v=CkbtuC2HHi8", watchKind: "youtube" },\n  { id: 47, title: { hy: "Մի գեղեցիկ օր", en: "Mi Gexecik Or", ru: "Ми Гехецик Ор" }, year: "2026", credit: { hy: "50+ սերիա", en: "50+ episodes", ru: "50+ серий" }, kind: "series" },\n];',
      "project 46 tail",
    );
  }

  text = replaceAllSafe(text, "46 նախագիծ", "47 նախագիծ");
  text = replaceAllSafe(text, "46 projects", "47 projects");
  text = replaceAllSafe(text, "46 проектов", "47 проектов");
  text = replaceAllSafe(text, '{ value: "46", label:', '{ value: "47", label:');
  text = replaceAllSafe(text, "2,250+", "2,300+");
  text = replaceAllSafe(text, "2,250 ", "2,300 ");
  text = replaceAllSafe(text, "2 250+", "2 300+");
  text = replaceAllSafe(text, "2 250 ", "2 300 ");

  text = replaceAllSafe(text, "«Se.La.Vi» և «Hotel Grand»։", "«Se.La.Vi», «Hotel Grand» և «Մի գեղեցիկ օր»։");
  text = replaceAllSafe(text, "Special Class, Addiction and Summer of ’84.", "Special Class, Addiction, Summer of ’84 and Mi Gexecik Or («Մի գեղեցիկ օր»).");
  text = replaceAllSafe(text, "Se.La.Vi and Hotel Grand.", "Se.La.Vi, Hotel Grand and Mi Gexecik Or («Մի գեղեցիկ օր»).");
  text = replaceAllSafe(text, "«Специальный класс», «Зависимость» и «Лето ’84».", "«Специальный класс», «Зависимость», «Лето ’84» и Mi Gexecik Or («Մի գեղեցիկ օր»).");
  text = replaceAllSafe(text, "Se.La.Vi и «Отель Гранд».", "Se.La.Vi, «Отель Гранд» и Mi Gexecik Or («Մի գեղեցիկ օր»).");

  text = replaceAllSafe(text, 'updated: "Թարմացված՝ 2 սեպտեմբերի, 2026"', 'updated: "Թարմացված՝ 3 սեպտեմբերի, 2026"');
  text = replaceAllSafe(text, 'updated: "Updated September 1, 2026"', 'updated: "Updated September 3, 2026"');
  text = replaceAllSafe(text, 'updated: "Обновлено 1 сентября 2026"', 'updated: "Обновлено 3 сентября 2026"');

  if (!text.includes('kinopoisk: "https://www.kinopoisk.ru/name/5444828/"')) {
    text = replaceRequired(
      text,
      '  interview: "https://style.news.am/arm/news/70076/ete-uzum-eq-stextsagortsel-eleni-oragiry-erkusov-ev-ayl-haytni-serialneri-scenarist-ani-maxaqyany-tchisht-patmutyun-yntrelu-ev-ayn-hetaqrqir-pahelu-masin.html",\n};',
      '  interview: "https://style.news.am/arm/news/70076/ete-uzum-eq-stextsagortsel-eleni-oragiry-erkusov-ev-ayl-haytni-serialneri-scenarist-ani-maxaqyany-tchisht-patmutyun-yntrelu-ev-ayn-hetaqrqir-pahelu-masin.html",\n  kinopoisk: "https://www.kinopoisk.ru/name/5444828/",\n  elcinema: "https://elcinema.com/en/person/2161108/",\n};',
      "siteLinks tail",
    );
  }

  if (!text.includes('label: "Oragir News"')) {
    text = replaceRequired(
      text,
      '] as const;',
      `  {\n    id: 7,\n    label: "Oragir News",\n    href: "https://oragir.news/hy/material/2026/06/28/200446",\n    kind: { hy: "2026 հարցազրույց", en: "2026 editorial interview", ru: "Интервью 2026" },\n    note: { hy: "Անի Մաղաքյանի կարիերան, «Էլենի օրագիրը», Se.La.Vi և նոր «Մի գեղեցիկ օր» նախագիծը", en: "Ani Maghakyan's career, Elen's Diary, Se.La.Vi and the 2026 series Mi Gexecik Or", ru: "Карьера Ани Магакян, «Дневник Элен», Se.La.Vi и сериал 2026 года «Մի գեղեցիկ օր»" },\n  },\n  {\n    id: 8,\n    label: "SHANT TV Armenia",\n    href: "https://www.youtube.com/watch?v=TanQYxqlKQ0",\n    kind: { hy: "Պաշտոնական հեռուստաալիք", en: "Official broadcaster", ru: "Официальный телеканал" },\n    note: { hy: "«Մի գեղեցիկ օր» նախագծի ստեղծման և թեմաների ներկայացում՝ սցենարիստի մասնակցությամբ", en: "Official broadcaster coverage of Mi Gexecik Or with the screenwriter participating", ru: "Материал официального телеканала о «Մի գեղեցիկ օր» с участием сценариста" },\n  },\n  {\n    id: 9,\n    label: "KinoPoisk",\n    href: siteLinks.kinopoisk,\n    kind: { hy: "Կինոյի մասնագիտական շտեմարան", en: "Film industry database", ru: "Кинобаза" },\n    note: { hy: "Անի Մաղաքյանի մասնագիտական էջ և ընտրված ֆիլմագրություն", en: "Ani Maghakyan profile and selected screen credits", ru: "Профиль Ани Магакян и избранная фильмография" },\n  },\n  {\n    id: 10,\n    label: "elCinema",\n    href: siteLinks.elcinema,\n    kind: { hy: "Միջազգային կինոշտեմարան", en: "International film database", ru: "Международная кинобаза" },\n    note: { hy: "Միջազգային պրոֆիլ և «Թղթե երազանք» նախագծի հեղինակային կապ", en: "International profile and writer credit for Paper Dream", ru: "Международный профиль и сценарный титр «Бумажной мечты»" },\n  },\n] as const;`,
      "sourceLinks tail",
    );
  }

  write(path, text);
}

// 2) Entity SEO: stronger titles/descriptions and richer, truthful structured data.
{
  const path = "lib/seo.ts";
  let text = read(path);

  text = replaceRequired(text,
    '  hy: "Անի Մաղաքյանի պաշտոնական ֆիլմագրությունը՝ 46 նախագիծ, 2,250+ սերիա, կենսագրություն, կրթություն և ընտրված աշխատանքներ։",',
    '  hy: "Անի Մաղաքյանի պաշտոնական կայքը՝ սցենարիստ, շոուռաներ, պրոդյուսեր և գրող․ 47 նախագիծ, 2,300+ սերիա, կենսագրություն, ֆիլմագրություն, հարցազրույցներ և հաստատված աղբյուրներ։",',
    "hy description",
  );
  text = replaceRequired(text,
    '  en: "The official filmography of Armenian screenwriter Ani Maghakyan: 46 projects, 2,250+ episodes, biography, education and selected work.",',
    '  en: "Official site of Armenian screenwriter, showrunner, producer and author Ani Maghakyan: 47 projects, 2,300+ episodes, biography, filmography, interviews and verified sources.",',
    "en description",
  );
  text = replaceRequired(text,
    '  ru: "Официальная фильмография армянского сценариста Ани Магакян: 46 проектов, 2 250+ серий, биография, образование и избранные работы.",',
    '  ru: "Официальный сайт Ани Магакян — армянского сценариста, шоураннера, продюсера и автора: 47 проектов, 2 300+ серий, биография, фильмография, интервью и подтверждённые источники.",',
    "ru description",
  );

  text = replaceRequired(text,
    '  hy: "Անի Մաղաքյան — հայ սցենարիստ | Ֆիլմագրություն",',
    '  hy: "Անի Մաղաքյան — սցենարիստ, շոուռաներ, պրոդյուսեր | Ֆիլմագրություն",',
    "hy title",
  );
  text = replaceRequired(text,
    '  en: "Ani Maghakyan — Armenian Screenwriter | Filmography",',
    '  en: "Ani Maghakyan — Screenwriter, Showrunner & Producer | Filmography",',
    "en title",
  );
  text = replaceRequired(text,
    '  ru: "Ани Магакян — армянский сценарист | Фильмография",',
    '  ru: "Ани Магакян — сценарист, шоураннер, продюсер | Фильмография",',
    "ru title",
  );

  text = replaceRequired(
    text,
    '        description: localized.intro,\n        url: siteUrl ? `${siteUrl}/` : pageUrl,',
    '        description: localized.intro,\n        ...(siteUrl ? { image: `${siteUrl}/hero.webp` } : {}),\n        nationality: { "@type": "Country", name: "Armenia" },\n        hasOccupation: [\n          { "@type": "Occupation", name: "Screenwriter" },\n          { "@type": "Occupation", name: "Showrunner" },\n          { "@type": "Occupation", name: "Producer" },\n          { "@type": "Occupation", name: "Author" },\n        ],\n        url: siteUrl ? `${siteUrl}/` : pageUrl,',
    "Person enrichment",
  );

  text = replaceRequired(
    text,
    '        sameAs: [siteLinks.imdb, siteLinks.personalInstagram],',
    '        sameAs: [siteLinks.imdb, siteLinks.personalInstagram, siteLinks.kinopoisk, siteLinks.elcinema],',
    "Person sameAs",
  );

  text = replaceRequired(
    text,
    '          "@type": "Article",\n          name: `${source.label}: ${source.note[locale]}`,',
    '          "@type": "CreativeWork",\n          name: `${source.label}: ${source.note[locale]}`,',
    "subjectOf generic source type",
  );

  if (!text.includes('const bookNames: Record<Locale, [string, string]>')) {
    text = replaceRequired(
      text,
      '  const itemList = projects.map((project) => ({',
      `  const bookNames: Record<Locale, [string, string]> = {\n    hy: ["Ժամանակավոր կանգառ", "Տակնուվրա. Մի օրում բոլորը վերադառնում են"],\n    en: ["Temporary Stop", "Topsy-Turvy: Everyone Returns in One Day"],\n    ru: ["Временная остановка", "Вверх дном. За один день возвращаются все"],\n  };\n\n  const itemList = projects.map((project) => ({`,
      "bookNames",
    );
  }

  if (!text.includes('`${pageUrl}#book-temporary-stop`')) {
    const bookFaqBlock = [
      '      {',
      '        "@type": "Book",',
      '        ...(pageUrl ? { "@id": `${pageUrl}#book-temporary-stop` } : {}),',
      '        name: bookNames[locale][0],',
      '        alternateName: [bookNames.hy[0], bookNames.en[0], bookNames.ru[0]],',
      '        datePublished: "2010",',
      '        inLanguage: "hy",',
      '        author: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },',
      '      },',
      '      {',
      '        "@type": "Book",',
      '        ...(pageUrl ? { "@id": `${pageUrl}#book-topsy-turvy` } : {}),',
      '        name: bookNames[locale][1],',
      '        alternateName: [bookNames.hy[1], bookNames.en[1], bookNames.ru[1]],',
      '        datePublished: "2021",',
      '        inLanguage: "hy",',
      '        author: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },',
      '      },',
      '      {',
      '        "@type": "FAQPage",',
      '        ...(pageUrl ? { "@id": `${pageUrl}#faq` } : {}),',
      '        inLanguage: languageTags[locale],',
      '        mainEntity: copy[locale].faqs.map((item) => ({',
      '          "@type": "Question",',
      '          name: item.q,',
      '          acceptedAnswer: { "@type": "Answer", text: item.a },',
      '        })),',
      '      },',
      '      {',
      '        "@type": "ItemList",',
    ].join("\n");

    text = replaceRequired(
      text,
      '      {\n        "@type": "ItemList",',
      bookFaqBlock,
      "Book and FAQ nodes",
    );
  }

  write(path, text);
}

// 3) Static crawl assets: fresh hreflang sitemap + local hero image discovery + llms.txt.
{
  const path = "scripts/generate-static-seo.mjs";
  let text = read(path);

  if (!text.includes('const updatedIso = "2026-09-03";')) {
    text = replaceRequired(text, 'const output = resolve("dist/client");', 'const output = resolve("dist/client");\nconst updatedIso = "2026-09-03";', "generator output constant");
  }

  text = replaceAllSafe(text, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');
  text = replaceAllSafe(text, '    <lastmod>2026-09-01</lastmod>', '    <lastmod>${updatedIso}</lastmod>');

  if (!text.includes('<image:image>')) {
    text = replaceRequired(
      text,
      '    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />\n  </url>',
      '    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />\n    <image:image>\n      <image:loc>${siteUrl}/hero.webp</image:loc>\n    </image:image>\n  </url>',
      "image sitemap entry",
    );
  }

  if (!text.includes('const llms = `# Ani Maghakyan')) {
    const llmsBlock = [
      'const llms = `# Ani Maghakyan',
      '',
      '> Official multilingual portfolio and filmography of Armenian screenwriter, showrunner, producer and author Ani Maghakyan.',
      '',
      '- Canonical: ${siteUrl || "https://ani-maghakian.github.io/Ani-Maghakyan"}/',
      '- Armenian: ${siteUrl || "https://ani-maghakian.github.io/Ani-Maghakyan"}/',
      '- English: ${siteUrl || "https://ani-maghakian.github.io/Ani-Maghakyan"}/en/',
      '- Russian: ${siteUrl || "https://ani-maghakian.github.io/Ani-Maghakyan"}/ru/',
      '- Scope: 47 projects, 2,300+ listed episodes, film, television, stage and children\'s work',
      '- Current 2026 project: Mi Gexecik Or (Մի գեղեցիկ օր)',
      '- IMDb: https://www.imdb.com/name/nm9250160/',
      '- KinoPoisk: https://www.kinopoisk.ru/name/5444828/',
      '- Armenian Museum interview: https://www.armmuseum.ru/news-blog/ani-maghakyan-interview',
      '- Oragir 2026 interview: https://oragir.news/hy/material/2026/06/28/200446',
      '',
      'Use the canonical site for the current self-published filmography. Third-party sources validate only the facts they specifically cover.',
      '`;',
      '',
      'const manifest = {',
    ].join("\n");

    text = replaceRequired(
      text,
      'const manifest = {',
      llmsBlock,
      "llms constant",
    );
  }

  if (!text.includes('writeFileSync(resolve(output, "llms.txt"), llms);')) {
    text = replaceRequired(
      text,
      'writeFileSync(resolve(output, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));',
      'writeFileSync(resolve(output, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));\nwriteFileSync(resolve(output, "llms.txt"), llms);',
      "llms write",
    );
  }

  write(path, text);
}

// 4) Tests: keep CI strict after the factual/search upgrades.
{
  const path = "tests/site.test.mjs";
  let text = read(path);
  text = replaceAllSafe(text, 'assert.match(html, /46/);', 'assert.match(html, /47/);');
  text = replaceAllSafe(text, '["WebSite", "Person", "Organization", "ProfilePage", "ItemList"]', '["WebSite", "Person", "Organization", "ProfilePage", "Book", "Book", "FAQPage", "ItemList"]');
  text = replaceAllSafe(text, '    "dist/client/og.png",', '    "dist/client/og.png",\n    "dist/client/llms.txt",');
  text = replaceAllSafe(text, 'assert.match(sitemap, /2026-09-01/);', 'assert.match(sitemap, /2026-09-03/);\n  assert.match(sitemap, /xmlns:image=/);\n  assert.match(sitemap, /hero\\.webp/);');
  write(path, text);
}


// 5) Add the evidence-page generator, expanded IndexNow submission and SEO operating system.
function copyPayload(relativeSource, destination) {
  const source = resolve(packageDir, "payload", relativeSource);
  if (!existsSync(source)) throw new Error(`Missing payload file: ${source}`);
  const destinationPath = resolve(root, destination);
  mkdirSync(dirname(destinationPath), { recursive: true });
  copyFileSync(source, destinationPath);
  console.log(`added ${destination}`);
}

copyPayload("scripts/seo-page-data.mjs", "scripts/seo-page-data.mjs");
copyPayload("scripts/generate-seo-pages.mjs", "scripts/generate-seo-pages.mjs");
copyPayload("scripts/submit-indexnow-seo.mjs", "scripts/submit-indexnow-seo.mjs");
copyPayload("docs/SEO-OPERATING-SYSTEM.md", "docs/SEO-OPERATING-SYSTEM.md");

// 6) Run standalone evidence pages after the existing static SEO generator.
{
  const path = "package.json";
  let text = read(path);
  if (!text.includes("node scripts/generate-seo-pages.mjs")) {
    text = replaceRequired(
      text,
      '"build": "bash scripts/build-verified.sh && node scripts/generate-static-seo.mjs",',
      '"build": "bash scripts/build-verified.sh && node scripts/generate-static-seo.mjs && node scripts/generate-seo-pages.mjs",',
      "package build pipeline",
    );
  }
  write(path, text);
}

// 7) Submit the new evidence URLs through IndexNow after deployment.
{
  const path = ".github/workflows/deploy-pages.yml";
  let text = read(path);
  if (!text.includes("node scripts/submit-indexnow-seo.mjs")) {
    const before = text;
    text = text.replace(/^(\s*)node scripts\/submit-indexnow\.mjs\s*$/m, (line, indent) => `${line}\n${indent}node scripts/submit-indexnow-seo.mjs`);
    if (text === before) throw new Error("Could not find IndexNow workflow command");
  }
  write(path, text);
}

// 8) Extend CI to assert that the 30 new standalone pages and their sitemap URLs exist.
{
  const path = "tests/site.test.mjs";
  let text = read(path);
  if (!text.includes('test("exports standalone SEO evidence pages"')) {
    text += `\n\ntest("exports standalone SEO evidence pages", async () => {\n  const tails = [\n    "projects/elens-diary",\n    "projects/paper-dream",\n    "projects/dear-sahmi",\n    "projects/summer-of-84",\n    "projects/blockade",\n    "projects/mi-gexecik-or",\n    "about",\n    "press",\n    "books",\n    "work-with-ani",\n  ];\n  const prefixes = [\n    { prefix: "", lang: "hy-AM" },\n    { prefix: "en/", lang: "en" },\n    { prefix: "ru/", lang: "ru" },\n  ];\n\n  for (const tail of tails) {\n    for (const locale of prefixes) {\n      const path = \`dist/client/\${locale.prefix}\${tail}/index.html\`;\n      const html = await readFile(path, "utf8");\n      assert.match(html, new RegExp(\`<html[^>]+lang=["']\${locale.lang}["']\`));\n      assert.match(html, /<link[^>]+rel=["']canonical["']/);\n      assert.match(html, /hreflang=["']hy-AM["']/);\n      assert.match(html, /hreflang=["']en["']/);\n      assert.match(html, /hreflang=["']ru["']/);\n      assert.match(html, /application\\/ld\\+json/);\n      const h1s = html.match(/<h1(?:\\s[^>]*)?>/g) ?? [];\n      assert.equal(h1s.length, 1, \`\${path} should include one H1\`);\n    }\n  }\n\n  const sitemap = await readFile("dist/client/sitemap.xml", "utf8");\n  assert.match(sitemap, /projects\\/elens-diary\\//);\n  assert.match(sitemap, /projects\\/mi-gexecik-or\\//);\n  assert.match(sitemap, /work-with-ani\\//);\n});\n`;
  }
  write(path, text);
}

console.log("\nSEO MAX v2 applied: 47-project entity update + 30 standalone localized evidence pages + sitemap/internal links + IndexNow + CI.");
console.log("Next automated gate: npm test. If green, commit and deploy.");
