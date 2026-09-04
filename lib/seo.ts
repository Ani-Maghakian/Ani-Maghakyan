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
  hy: "Անի Մաղաքյանի պաշտոնական կայքը՝ սցենարիստ, շոուռաներ, պրոդյուսեր և գրող․ 47 նախագիծ, 2,300+ սերիա, կենսագրություն, ֆիլմագրություն, հարցազրույցներ և հաստատված աղբյուրներ։",
  en: "Official site of Armenian screenwriter, showrunner, producer and author Ani Maghakyan: 47 projects, 2,300+ episodes, biography, filmography, interviews and verified sources.",
  ru: "Официальный сайт Ани Магакян — армянского сценариста, шоураннера, продюсера и автора: 47 проектов, 2 300+ серий, биография, фильмография, интервью и подтверждённые источники.",
};

const titles: Record<Locale, string> = {
  hy: "Անի Մաղաքյան — սցենարիստ, շոուռաներ, պրոդյուսեր | Ֆիլմագրություն",
  en: "Ani Maghakyan — Screenwriter, Showrunner & Producer | Filmography",
  ru: "Ани Магакян — сценарист, шоураннер, продюсер | Фильмография",
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
    applicationName: "Ani Maghakyan Filmography",
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
      type: "profile",
      locale: openGraphLocale,
      alternateLocale: allOpenGraphLocales.filter((item) => item !== openGraphLocale),
      title: titles[locale],
      description: descriptions[locale],
      siteName: "Ani Maghakyan",
      url: canonical,
      firstName: "Ani",
      lastName: "Maghakyan",
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

  const bookNames: Record<Locale, [string, string]> = {
    hy: ["Ժամանակավոր կանգառ", "Տակնուվրա. Մի օրում բոլորը վերադառնում են"],
    en: ["Temporary Stop", "Topsy-Turvy: Everyone Returns in One Day"],
    ru: ["Временная остановка", "Вверх дном. За один день возвращаются все"],
  };

  const itemList = projects.map((project) => ({
    "@type": "ListItem",
    position: project.id,
    item: {
      "@type": project.kind === "series" ? "TVSeries" : project.kind === "film" ? "Movie" : "CreativeWork",
      name: project.title[locale],
      alternateName: [project.title.hy, project.title.en, project.title.ru].filter(
        (value, index, values) => values.indexOf(value) === index,
      ),
      ...(project.year.includes("–")
        ? { temporalCoverage: project.year.replace("–", "/") }
        : { dateCreated: project.year }),
      ...(project.episodes ? { numberOfEpisodes: project.episodes } : {}),
      ...(pageUrl ? { url: `${pageUrl}#project-${project.id}` } : {}),
      creator: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
    },
  }));

  const knownFor = projects
    .filter((project) => project.featuredRank)
    .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0))
    .map((project) => ({
      "@type": project.kind === "series" ? "TVSeries" : project.kind === "film" ? "Movie" : "CreativeWork",
      name: project.title[locale],
      alternateName: [project.title.hy, project.title.en, project.title.ru].filter(
        (value, index, values) => values.indexOf(value) === index,
      ),
      ...(pageUrl ? { url: `${pageUrl}#project-${project.id}` } : {}),
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        ...(websiteId ? { "@id": websiteId } : {}),
        ...(siteUrl ? { url: `${siteUrl}/` } : {}),
        name: "Ani Maghakyan — Official Filmography",
        alternateName: ["Անի Մաղաքյան — պաշտոնական ֆիլմագրություն", "Ани Магакян — официальная фильмография"],
        inLanguage: ["hy-AM", "en", "ru"],
        publisher: orgId ? { "@id": orgId } : { "@type": "Organization", name: "Maghakian Scripts" },
      },
      {
        "@type": "Person",
        ...(personId ? { "@id": personId } : {}),
        name: localized.title,
        alternateName: ["Անի Մաղաքյան", "Ani Maghakyan", "Ани Магакян", "Ani Hamlet Maghakyan"],
        birthDate: "1988-06-03",
        birthPlace: { "@type": "Place", name: "Vanadzor, Armenia" },
        jobTitle: ["Screenwriter", "Showrunner", "Producer", "Author"],
        description: localized.intro,
        ...(siteUrl ? { image: `${siteUrl}/hero.webp` } : {}),
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
        knowsLanguage: ["Armenian", "Russian", "English"],
        knowsAbout: ["Screenwriting", "Television drama", "Film", "Theatre", "Story development"],
        knownFor,
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
        sameAs: [siteLinks.instagram],
        founder: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
      },
      {
        "@type": "ProfilePage",
        ...(profileId ? { "@id": profileId } : {}),
        url: pageUrl,
        name: titles[locale],
        description: descriptions[locale],
        dateModified: `${updatedIso}T00:00:00Z`,
        inLanguage: languageTags[locale],
        ...(websiteId ? { isPartOf: { "@id": websiteId } } : {}),
        mainEntity: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
        about: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
        citation: sourceLinks.map((source) => source.href),
      },
      {
        "@type": "Book",
        ...(pageUrl ? { "@id": `${pageUrl}#book-temporary-stop` } : {}),
        name: bookNames[locale][0],
        alternateName: [bookNames.hy[0], bookNames.en[0], bookNames.ru[0]],
        datePublished: "2010",
        inLanguage: "hy",
        author: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
      },
      {
        "@type": "Book",
        ...(pageUrl ? { "@id": `${pageUrl}#book-topsy-turvy` } : {}),
        name: bookNames[locale][1],
        alternateName: [bookNames.hy[1], bookNames.en[1], bookNames.ru[1]],
        datePublished: "2021",
        inLanguage: "hy",
        author: personId ? { "@id": personId } : { "@type": "Person", name: "Անի Մաղաքյան" },
      },
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
