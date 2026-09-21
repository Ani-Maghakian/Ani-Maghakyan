import { homeHero } from "./site-copy.mjs";
import { books, bookSchema } from "./books.mjs";
import type { Metadata } from "next";
import {
  copy,
  locales,
  projects,
  siteLinks,
  sourceLinks,
  updatedIso,
  type Locale,
} from "@/lib/content";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const descriptions: Record<Locale, string> = {
  hy: `${homeHero.hy.intro} ${homeHero.hy.tagline}`,
  en: `${homeHero.en.intro} ${homeHero.en.tagline}`,
  ru: `${homeHero.ru.intro} ${homeHero.ru.tagline}`,
};

const titles: Record<Locale, string> = {
  hy: "Maghakian Scripts — սցենարական ստուդիա | Անի Մաղաքյան",
  en: "Maghakian Scripts — Screenwriting Studio | Ani Maghakyan",
  ru: "Maghakian Scripts — сценарная студия | Ани Магакян",
};

const languageTags: Record<Locale, string> = {
  hy: "hy-AM",
  en: "en",
  ru: "ru",
};

export function localePath(locale: Locale) {
  return locale === "hy" ? "/" : `/${locale}/`;
}

function absolute(path: string) {
  if (!siteUrl) return undefined;
  return `${siteUrl}${path === "/" ? "/" : path}`;
}

export function createMetadata(locale: Locale): Metadata {
  const canonical = absolute(localePath(locale));
  const image = siteUrl ? `${siteUrl}/og.png` : undefined;
  const localized = copy[locale];
  const openGraphLocale = locale === "hy" ? "hy_AM" : locale === "ru" ? "ru_RU" : "en_US";
  const allOpenGraphLocales = ["hy_AM", "en_US", "ru_RU"];
  const verification: NonNullable<Metadata["verification"]> = {};
  const verificationOther: Record<string, string> = {};
  const languageAlternates = siteUrl
    ? {
        "hy-AM": `${siteUrl}/`,
        en: `${siteUrl}/en/`,
        ru: `${siteUrl}/ru/`,
        "x-default": `${siteUrl}/`,
      }
    : undefined;

  if (process.env.GOOGLE_SITE_VERIFICATION) verification.google = process.env.GOOGLE_SITE_VERIFICATION;
  if (process.env.YANDEX_SITE_VERIFICATION) verification.yandex = process.env.YANDEX_SITE_VERIFICATION;
  if (process.env.BING_SITE_VERIFICATION) {
    verificationOther["msvalidate.01"] = process.env.BING_SITE_VERIFICATION;
    verification.other = verificationOther;
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    applicationName: "Maghakian Scripts",
    authors: [{ name: "Ani Maghakyan" }],
    creator: "Maghakian Scripts",
    publisher: "Maghakian Scripts",
    category: "Film and television",
    referrer: "strict-origin-when-cross-origin",
    formatDetection: { address: false, email: false, telephone: false },
    verification: Object.keys(verification).length ? verification : undefined,
    alternates: canonical
      ? { canonical, languages: languageAlternates }
      : undefined,
    openGraph: {
      type: "website",
      locale: openGraphLocale,
      alternateLocale: allOpenGraphLocales.filter((item) => item !== openGraphLocale),
      title: titles[locale],
      description: descriptions[locale],
      siteName: "Maghakian Scripts",
      url: canonical,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: localized.imageAlt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descriptions[locale],
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function structuredData(locale: Locale) {
  const localized = copy[locale];
  const pageUrl = absolute(localePath(locale));
  const personId = siteUrl ? `${siteUrl}/#ani-maghakyan` : undefined;
  const orgId = siteUrl ? `${siteUrl}/#maghakyan-scripts` : undefined;
  const websiteId = siteUrl ? `${siteUrl}/#website` : undefined;
  const profileId = pageUrl ? `${pageUrl}#profile` : undefined;

  const itemList = projects.map((project) => ({
    "@type": "ListItem",
    position: project.id,
    item: {
      "@type": [2, 3].includes(project.id) ? "TVSeason" : project.kind === "series" ? "TVSeries" : project.kind === "film" ? "Movie" : "CreativeWork",
      name: project.title[locale],
      alternateName: [project.title.hy, project.title.en, project.title.ru].filter(
        (value, index, values) => values.indexOf(value) === index,
      ),
      ...(project.year.includes("–")
        ? { temporalCoverage: project.year.replace("–", "/") }
        : { dateCreated: project.year }),
      ...(project.episodes ? { numberOfEpisodes: project.episodes } : {}),
      ...(pageUrl ? { url: `${pageUrl}projects/${project.seoSlug}/${project.id === 2 ? "#season-1" : ""}` } : {}),
      ...([2, 3].includes(project.id) && pageUrl ? { seasonNumber: project.id - 1, partOfSeries: { "@id": `${pageUrl}projects/elens-diary/#work` } } : {}),
      contributor: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        ...(websiteId ? { "@id": websiteId } : {}),
        ...(siteUrl ? { url: `${siteUrl}/` } : {}),
        name: "Maghakian Scripts",
        alternateName: ["Անի Մաղաքյան", "Ани Магакян", "Ani Maghakian"],
        inLanguage: ["hy-AM", "en", "ru"],
        publisher: orgId ? { "@id": orgId } : { "@type": "Organization", name: "Maghakian Scripts" },
      },
      {
        "@type": "Person",
        ...(personId ? { "@id": personId } : {}),
        name: localized.title,
        alternateName: ["Անի Մաղաքյան", "Ani Maghakyan", "Ани Магакян", "Ani Maghakian", "Ani Hamlet Maghakyan"],
        birthDate: "1988-06-03",
        birthPlace: { "@type": "Place", name: "Vanadzor, Armenia" },
        jobTitle: ["Screenwriter", "Showrunner", "Producer", "Author"],
        description: localized.intro,
        ...(siteUrl ? { image: `${siteUrl}/ani-3180-web.jpg` } : {}),
        nationality: { "@type": "Country", name: "Armenia" },
        hasOccupation: [
          { "@type": "Occupation", name: "Screenwriter" },
          { "@type": "Occupation", name: "Showrunner" },
          { "@type": "Occupation", name: "Producer" },
          { "@type": "Occupation", name: "Author" },
        ],
        url: siteUrl ? `${siteUrl}/` : pageUrl,
        ...(profileId ? { mainEntityOfPage: { "@id": profileId } } : {}),
        sameAs: [siteLinks.imdb, siteLinks.personalInstagram, siteLinks.kinopoisk, siteLinks.elcinema],
        subjectOf: sourceLinks.slice(1).map((source) => ({
          "@type": "CreativeWork",
          name: `${source.label}: ${source.note[locale]}`,
          url: source.href,
        })),
        knowsLanguage: ["hy", "ru", "en"],
        knowsAbout: ["Screenwriting", "Television drama", "Film", "Theatre", "Story development"],
        worksFor: orgId ? { "@id": orgId } : { "@type": "Organization", name: "Maghakian Scripts" },
        alumniOf: [
          { "@type": "EducationalOrganization", name: "Caucasus Institute" },
          { "@type": "EducationalOrganization", name: "Alexander Mitta Film School" },
        ],
      },
      {
        "@type": "Organization",
        ...(orgId ? { "@id": orgId } : {}),
        name: "Maghakian Scripts",
        ...(siteUrl ? { url: `${siteUrl}/` } : {}),
        ...(siteUrl ? { logo: `${siteUrl}/brand/maghakian-scripts-light.svg?v=vector-1` } : {}),
        sameAs: [siteLinks.instagram],
        founder: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
      },
      {
        "@type": "WebPage",
        ...(profileId ? { "@id": profileId } : {}),
        url: pageUrl,
        name: titles[locale],
        description: descriptions[locale],
        dateModified: `${updatedIso}T00:00:00Z`,
        inLanguage: languageTags[locale],
        ...(websiteId ? { isPartOf: { "@id": websiteId } } : {}),
        mainEntity: orgId ? { "@id": orgId } : { "@type": "Organization", name: "Maghakian Scripts" },
        about: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
        citation: sourceLinks.map((source) => source.href),
      },
      ...books.map((book) => bookSchema(book, locale, siteUrl, personId)),
      {
        "@type": "FAQPage",
        ...(pageUrl ? { "@id": `${pageUrl}#faq` } : {}),
        inLanguage: languageTags[locale],
        mainEntity: copy[locale].faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "ItemList",
        ...(pageUrl ? { "@id": `${pageUrl}#filmography-list`, url: `${pageUrl}#filmography` } : {}),
        name: locale === "hy" ? "Անի Մաղաքյանի ֆիլմագրություն" : locale === "ru" ? "Фильмография Ани Магакян" : "Ani Maghakyan Filmography",
        inLanguage: languageTags[locale],
        numberOfItems: projects.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: itemList,
      },
    ],
  };
}

export function languageLinks() {
  return (Object.keys(locales) as Locale[]).map((locale) => ({ locale, href: localePath(locale) }));
}
