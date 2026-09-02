import { pathToFileURL } from "node:url";

export function buildIndexNowPayload(siteUrl, key) {
  if (!siteUrl || !key) {
    throw new Error("SITE_URL and INDEXNOW_KEY are required for IndexNow submission.");
  }

  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const parsed = new URL(normalizedSiteUrl);

  return {
    host: parsed.host,
    key,
    keyLocation: `${normalizedSiteUrl}/indexnow-key.txt`,
    urlList: [`${normalizedSiteUrl}/`, `${normalizedSiteUrl}/en/`, `${normalizedSiteUrl}/ru/`],
  };
}

export async function submitIndexNow({ siteUrl, key, endpoint = "https://api.indexnow.org/indexnow" }) {
  const payload = buildIndexNowPayload(siteUrl, key);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  console.log(`IndexNow: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`IndexNow submission failed: ${response.status} ${body}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await submitIndexNow({
    siteUrl: process.env.SITE_URL,
    key: process.env.INDEXNOW_KEY,
  });
}
