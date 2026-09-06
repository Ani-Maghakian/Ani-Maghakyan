import type { Metadata, Viewport } from "next";
import { basePath, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./cinematic.css";

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
  themeColor: "#0b0b0a",
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Armenian:wght@300;400;500;600;700;800&family=Noto+Serif+Armenian:wght@400;500;600;700&display=swap"
        />
        <link rel="preload" as="image" href={`${basePath}/hero.webp`} type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
