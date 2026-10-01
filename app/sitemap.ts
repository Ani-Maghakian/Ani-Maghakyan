import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { homeSeoUpdatedIso } from "@/lib/site-copy.mjs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];

  return [
    { url: `${siteUrl}/`, lastModified: homeSeoUpdatedIso, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/en/`, lastModified: homeSeoUpdatedIso, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/ru/`, lastModified: homeSeoUpdatedIso, changeFrequency: "monthly", priority: 0.9 },
  ];
}
