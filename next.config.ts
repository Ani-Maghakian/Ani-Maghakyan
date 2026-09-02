import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY ?? "";
const [owner = "", repositoryName = ""] = repository.split("/");
const isUserOrOrgSite = Boolean(owner) && repositoryName === `${owner}.github.io`;
const inferredBasePath =
  process.env.GITHUB_ACTIONS === "true" && repositoryName && !isUserOrOrgSite
    ? `/${repositoryName}`
    : "";
const basePath = process.env.SITE_BASE_PATH ?? inferredBasePath;
const inferredSiteUrl = owner
  ? `https://${owner}.github.io${basePath}`
  : "";
const siteUrl = (process.env.SITE_URL || inferredSiteUrl).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
};

export default nextConfig;
