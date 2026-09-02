import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const repository = process.env.GITHUB_REPOSITORY ?? "";
const [owner = "", repositoryName = ""] = repository.split("/");
const isUserOrOrgSite = Boolean(owner) && repositoryName === `${owner}.github.io`;
const inferredBasePath =
  process.env.GITHUB_ACTIONS === "true" && repositoryName && !isUserOrOrgSite
    ? `/${repositoryName}`
    : "";
const basePath = process.env.SITE_BASE_PATH ?? inferredBasePath;
const inferredSiteUrl = owner ? `https://${owner}.github.io${basePath}` : "";
const siteUrl = (process.env.SITE_URL || inferredSiteUrl).replace(/\/$/, "");
const output = resolve("dist/client");

mkdirSync(output, { recursive: true });

const robots = [
  "User-agent: *",
  "Allow: /",
  ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []),
  "",
].join("\n");

const urls = siteUrl
  ? [
      { loc: `${siteUrl}/`, priority: "1.0" },
      { loc: `${siteUrl}/en/`, priority: "0.9" },
      { loc: `${siteUrl}/ru/`, priority: "0.9" },
    ]
  : [];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>2026-09-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="hy-AM" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/" />
    <xhtml:link rel="alternate" hreflang="ru" href="${siteUrl}/ru/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>`).join("\n")}
</urlset>
`;

const manifest = {
  name: "Ani Maghakyan — Filmography",
  short_name: "A. Maghakyan",
  description: "Official filmography of Armenian screenwriter Ani Maghakyan.",
  start_url: `${basePath || "."}/`,
  display: "standalone",
  background_color: "#f1eadf",
  theme_color: "#f1eadf",
  icons: [{ src: `${basePath}/favicon.svg`, sizes: "any", type: "image/svg+xml" }],
};

writeFileSync(resolve(output, "robots.txt"), robots);
writeFileSync(resolve(output, "sitemap.xml"), sitemap);
writeFileSync(resolve(output, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));

// Normalize React-style attribute casing and correct each localized document's
// server-rendered language so crawlers see standards-compliant HTML before JS.
for (const { file, language } of [
  { file: "index.html", language: "hy-AM" },
  { file: "en/index.html", language: "en" },
  { file: "ru/index.html", language: "ru" },
]) {
  const path = resolve(output, file);
  const html = readFileSync(path, "utf8");
  const normalized = html.replaceAll("hrefLang=", "hreflang=");
  const localized = normalized.replace(/<html lang="hy-AM"/, `<html lang="${language}"`);
  if (!localized.includes(`lang="${language}"`)) {
    throw new Error(`Could not set the document language in ${file}`);
  }
  writeFileSync(path, localized);
}
