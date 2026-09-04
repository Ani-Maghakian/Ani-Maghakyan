import { allSeoPageTails, locales, localizedPath } from "./seo-page-data.mjs";

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
const key = (process.env.INDEXNOW_KEY || "").trim();

if (!siteUrl || !key) {
  console.log("IndexNow SEO: SITE_URL or INDEXNOW_KEY missing; skipping.");
  process.exit(0);
}

const urlList = [];
for (const tail of allSeoPageTails()) {
  for (const locale of Object.keys(locales)) {
    const path = localizedPath(locale, tail);
    urlList.push(`${siteUrl}/${path}/`);
  }
}

const parsed = new URL(siteUrl);
const payload = {
  host: parsed.host,
  key,
  keyLocation: `${siteUrl}/indexnow-key.txt`,
  urlList,
};

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (![200, 202].includes(response.status)) {
  const body = await response.text().catch(() => "");
  throw new Error(`IndexNow SEO submission failed: ${response.status} ${body}`);
}

console.log(`IndexNow SEO submitted ${urlList.length} URLs (${response.status}).`);
