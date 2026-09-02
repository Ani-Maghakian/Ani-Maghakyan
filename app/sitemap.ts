import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { updatedIso } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];

  return [
    { url: `${siteUrl}/`, lastModified: updatedIso, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/en/`, lastModified: updatedIso, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/ru/`, lastModified: updatedIso, changeFrequency: "monthly", priority: 0.9 },
  ];
}
