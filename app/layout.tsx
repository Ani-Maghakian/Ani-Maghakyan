import type { Metadata, Viewport } from "next";
import { basePath, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(`${siteUrl}/`) : undefined,
  title: "Ani Maghakyan",
  description: "Ani Maghakyan — Armenian screenwriter, showrunner, producer and author.",
  manifest: `${basePath}/manifest.webmanifest`,
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090a09",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy-AM" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={`${basePath}/site-theme.css`} />
        <link rel="stylesheet" href={`${basePath}/content-archive.css`} />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
