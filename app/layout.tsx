import type { Metadata, Viewport } from "next";
import { basePath, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./cinematic-10.css";
import "./quality-overrides.css";

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
        <link rel="preload" as="image" href={`${basePath}/ani-3180-web.jpg`} type="image/jpeg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
