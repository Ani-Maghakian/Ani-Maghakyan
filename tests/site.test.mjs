import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildIndexNowPayload } from "../scripts/submit-indexnow.mjs";

const pages = [
  { path: "dist/client/index.html", lang: "hy-AM" },
  { path: "dist/client/en/index.html", lang: "en" },
  { path: "dist/client/ru/index.html", lang: "ru" },
];

test("exports all localized pages with valid structured data", async () => {
  for (const page of pages) {
    const html = await readFile(page.path, "utf8");
    assert.match(html, new RegExp(`<html[^>]+lang=["']${page.lang}["']`));
    assert.match(html, /<meta[^>]+name=["']description["']/);
    assert.match(html, /47/);
    assert.match(html, /#filmography/);
    assert.match(html, /#sources/);
    assert.match(html, /hero\.webp/);
    assert.match(html, /Armenian Museum of Moscow/);
    assert.doesNotMatch(html, /\/_vinext\/image\?/);

    const h1s = html.match(/<h1(?:\s[^>]*)?>/g) ?? [];
    assert.equal(h1s.length, 1, `${page.path} should include one H1`);

    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(scripts.length > 0, `${page.path} should include JSON-LD`);
    for (const [, source] of scripts) {
      const data = JSON.parse(source);
      const types = data["@graph"].map((item) => item["@type"]);
      assert.deepEqual(types, ["WebSite", "Person", "Organization", "ProfilePage", "Book", "Book", "FAQPage", "ItemList"]);
    }
  }
});

test("exports crawl and sharing assets", async () => {
  for (const path of [
    "dist/client/robots.txt",
    "dist/client/sitemap.xml",
    "dist/client/manifest.webmanifest",
    "dist/client/favicon.svg",
    "dist/client/hero.webp",
    "dist/client/indexnow-key.txt",
    "dist/client/og.png",
    "dist/client/llms.txt",
  ]) {
    const file = await readFile(path);
    assert.ok(file.length > 0, `${path} should not be empty`);
  }

  const sitemap = await readFile("dist/client/sitemap.xml", "utf8");
  assert.match(sitemap, /2026-09-03/);
  assert.match(sitemap, /xmlns:image=/);
  assert.match(sitemap, /hero\.webp/);

  const indexNowKey = (await readFile("dist/client/indexnow-key.txt", "utf8")).trim();
  assert.match(indexNowKey, /^[a-f0-9]{32}$/);
});

test("keeps the approved key-project selection and Summer of ’84 authorship", async () => {
  const html = await readFile("dist/client/index.html", "utf8");
  const selected = html.slice(html.indexOf('id="selected"'), html.indexOf('id="filmography"'));
  const keyProjects = [
    "Էլենի օրագիրը",
    "Թղթե երազանք",
    "Սիրելի Սահմի",
    "Հատուկ դասարան",
    "Կախվածություն",
    "84-ի ամառը",
    "Բլոկադա",
    "Կհանդիպենք անտառի տնակում",
    "Եթե ես կրկին պարեի",
    "Se.La.Vi",
    "Hotel Grand",
  ];

  let previousIndex = -1;
  for (const title of keyProjects) {
    const index = selected.indexOf(title);
    assert.ok(index > previousIndex, `${title} should appear in the approved order`);
    previousIndex = index;
  }

  assert.match(selected, /Գաղափար · սցենար · շոուռանինգ · պրոդյուսինգ/);
  assert.doesNotMatch(selected, /Մալենա|Գերիները|Բեկորներ|Երկուսով/);
});

test("exports repaired project media, links and OKE naming", async () => {
  const hy = await readFile("dist/client/index.html", "utf8");
  const en = await readFile("dist/client/en/index.html", "utf8");

  assert.match(hy, /<a class="hero-art-crop" href="#selected"/);
  assert.match(hy, /featured-poster-backdrop/);
  assert.doesNotMatch(hy, /fastnews\.am\/culture\/post\/arsenn-vou-thghthe-erazanqy-harcazrvouyc/);

  assert.match(en, /id="project-32"[\s\S]{0,500}>OKE</);
  assert.match(en, /id="project-41"[\s\S]{0,500}>OKE 2</);

  for (const path of [
    "projects/elens-diary/",
    "projects/paper-dream/",
    "projects/dear-sahmi/",
    "projects/summer-of-84/",
    "projects/blockade/",
    "projects/mi-gexecik-or/",
  ]) {
    assert.match(en, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const verifiedUrlPart of [
    "watch?v=iIn9qu4Phls",
    "watch?v=TTRAx2ID01c",
    "watch?v=sNbNHBkiCpU",
    "watch?v=DDosY4yJooE",
    "armflix.com/kay",
    "armflix.com/soscali",
    "watch?v=QRCSe3vD3cM",
  ]) {
    assert.match(en, new RegExp(verifiedUrlPart.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  const watchButtons = en.match(/class="project-watch-mini"/g) ?? [];
  assert.ok(watchButtons.length >= 45, `expected at least 45 project watch links, got ${watchButtons.length}`);
});


test("keeps anchor navigation stable and Hotel Grand artwork loadable", async () => {
  const html = await readFile("dist/client/en/index.html", "utf8");
  const css = await readFile("app/globals.css", "utf8");
  const content = await readFile("lib/content.ts", "utf8");
  const component = await readFile("components/portfolio-page.tsx", "utf8");

  assert.match(content, /TTRAx2ID01c\/hqdefault\.jpg/);
  assert.doesNotMatch(content, /TTRAx2ID01c\/maxresdefault\.jpg/);
  assert.match(component, /function stableAnchorJump/);
  assert.match(component, /window\.history\.pushState/);
  assert.match(component, /window\.scrollTo\(\{ top, left: 0, behavior: "auto" \}\)/);
  assert.match(css, /overflow-anchor:\s*none/);
  assert.match(css, /backdrop-filter:\s*none/);
  assert.match(html, /Hotel Grand/);
});

test("builds a valid IndexNow payload for a GitHub project site", () => {
  const payload = buildIndexNowPayload(
    "https://example.github.io/ani-maghakyan/",
    "a70efe4a27d13ce5562b6b907877cf88",
  );

  assert.equal(payload.host, "example.github.io");
  assert.equal(payload.keyLocation, "https://example.github.io/ani-maghakyan/indexnow-key.txt");
  assert.deepEqual(payload.urlList, [
    "https://example.github.io/ani-maghakyan/",
    "https://example.github.io/ani-maghakyan/en/",
    "https://example.github.io/ani-maghakyan/ru/",
  ]);
});
