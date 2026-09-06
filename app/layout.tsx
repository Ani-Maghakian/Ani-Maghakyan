import type { Metadata, Viewport } from "next";
import { basePath, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./cinematic-10.css";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Armenian:wght@400;500;600;700&family=Noto+Serif:wght@400;500;600&family=Noto+Serif+Armenian:wght@400;500;600&display=swap"
        />
        <link rel="preload" as="image" href={`${basePath}/ani-3180-web.jpg`} type="image/jpeg" />
      </head>
      <body>{children}</body>
    </html>
  );
}