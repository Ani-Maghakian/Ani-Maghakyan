import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
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

export function collectSeoUrls(targetSiteUrl = siteUrl) {
  const clean = String(targetSiteUrl || "").replace(/\/$/, "");
  if (!clean) return [];

  const urlList = [];
  for (const tail of allSeoPageTails()) {
    for (const locale of Object.keys(locales)) {
      const path = localizedPath(locale, tail);
      urlList.push(`${clean}/${path}/`);
    }
  }
  return urlList;
}

export function buildSeoIndexNowPayload(targetSiteUrl, key) {
  const clean = String(targetSiteUrl || "").replace(/\/$/, "");
  const parsed = new URL(clean);
  return {
    host: parsed.host,
    key,
    keyLocation: `${clean}/indexnow-key.txt`,
    urlList: collectSeoUrls(clean),
  };
}

async function readLocalKey() {
  try {
    return (await readFile(resolve("dist/client/indexnow-key.txt"), "utf8")).trim();
  } catch {
    return "";
  }
}

async function readLiveKey(targetSiteUrl) {
  try {
    const response = await fetch(`${targetSiteUrl}/indexnow-key.txt`, {
      headers: { "user-agent": "Ani-Maghakyan-SEO-Indexer/1.0" },
    });
    if (!response.ok) return "";
    return (await response.text()).trim();
  } catch {
    return "";
  }
}

export async function resolveIndexNowKey(targetSiteUrl = siteUrl) {
  const envKey = (process.env.INDEXNOW_KEY || "").trim();
  if (envKey) return envKey;

  // Prefer the already-live verification key. This is safest when the submit step
  // runs before the newest GitHub Pages artifact is published.
  const liveKey = await readLiveKey(targetSiteUrl);
  if (liveKey) return liveKey;

  return readLocalKey();
}

async function submit(endpoint, payload) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const body = response.ok ? "" : await response.text().catch(() => "");
    return { endpoint, ok: [200, 202].includes(response.status), status: response.status, body };
  } catch (error) {
    return { endpoint, ok: false, status: 0, body: error instanceof Error ? error.message : String(error) };
  }
}

export async function submitSeoIndexNow(targetSiteUrl = siteUrl) {
  if (!targetSiteUrl) {
    console.log("IndexNow SEO: SITE_URL unavailable; skipping.");
    return [];
  }

  const key = await resolveIndexNowKey(targetSiteUrl);
  if (!key) {
    console.log("IndexNow SEO: verification key unavailable; skipping.");
    return [];
  }

  const payload = buildSeoIndexNowPayload(targetSiteUrl, key);
  if (!payload.urlList.length) {
    console.log("IndexNow SEO: no URLs to submit; skipping.");
    return [];
  }

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://yandex.com/indexnow",
  ];
  const results = [];
  for (const endpoint of endpoints) {
    const result = await submit(endpoint, payload);
    results.push(result);
    if (result.ok) {
      console.log(`IndexNow SEO: submitted ${payload.urlList.length} URLs to ${endpoint} (${result.status}).`);
    } else {
      console.warn(`IndexNow SEO: ${endpoint} returned ${result.status || "network error"} ${result.body}`.trim());
    }
  }

  if (!results.some((result) => result.ok)) {
    throw new Error("IndexNow SEO submission failed on all configured endpoints.");
  }

  return results;
}

const isMain = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  await submitSeoIndexNow();
}
