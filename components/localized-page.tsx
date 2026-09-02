import { PortfolioPage } from "@/components/portfolio-page";
import { structuredData } from "@/lib/seo";
import type { Locale } from "@/lib/content";

export function LocalizedPage({ locale }: { locale: Locale }) {
  const jsonLd = structuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PortfolioPage locale={locale} />
    </>
  );
}
