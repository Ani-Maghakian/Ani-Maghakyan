import type { Metadata, Viewport } from "next";
import { basePath, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./cinematic-10.css";
import "./mobile-visual-qa.css";

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
  colorScheme: "dark light",
  themeColor: "#080807",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy-AM" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <style>{`:root{--hero-retina-image:url("${basePath}/ani-3180-retina.webp")}`}</style>
        <link rel="preload" as="image" href={`${basePath}/ani-3180-retina.webp`} type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
