export const updatedIso = "2026-09-03";

export const locales = {
  hy: { lang: "hy-AM", prefix: "", label: "Հայերեն", homeLabel: "Գլխավոր", sourcesLabel: "Աղբյուրներ", backLabel: "Վերադառնալ ֆիլմագրությանը", exploreLabel: "Լրացուցիչ էջեր" },
  en: { lang: "en", prefix: "en", label: "English", homeLabel: "Home", sourcesLabel: "Sources", backLabel: "Back to filmography", exploreLabel: "Explore more" },
  ru: { lang: "ru", prefix: "ru", label: "Русский", homeLabel: "Главная", sourcesLabel: "Источники", backLabel: "Вернуться к фильмографии", exploreLabel: "Ещё об Ани" },
};

export const projects = [
  {
    slug: "elens-diary",
    year: "2017–2019",
    type: "TVSeries",
    titles: { hy: "Էլենի օրագիրը", en: "Elen’s Diary", ru: "Дневник Элен" },
    roles: { hy: "Սցենարիստ · հեղինակային գաղափար", en: "Screenwriter · original concept", ru: "Сценарист · авторская идея" },
    summaries: {
      hy: "«Էլենի օրագիրը» Անի Մաղաքյանի կարիերայի առանցքային նախագծերից է։ IMDb-ն և Sputnik Արմենիան նրան նշում են որպես սերիալի սցենարիստ, իսկ 2019 թվականի խորքային հարցազրույցում Անին նախագիծը ներկայացնում է որպես իր հեղինակային գաղափարներից մեկը և կարիերայի կարևոր շրջադարձ։ Պաշտոնական հեղինակային արխիվը պահպանում է երկու եթերաշրջանի՝ ընդհանուր 421 սերիայի հաշվառումը։",
      en: "Elen’s Diary is one of the defining projects in Ani Maghakyan’s screenwriting career. IMDb and Sputnik Armenia credit her as the series writer, while a 2019 in-depth interview describes it as one of her original concepts and a major career milestone. The official author archive records two seasons and 421 episodes in total.",
      ru: "«Дневник Элен» — один из ключевых проектов в сценарной карьере Ани Магакян. IMDb и Sputnik Армения указывают её как сценариста сериала, а в большом интервью 2019 года Ани называет проект одной из своих авторских идей и важной точкой карьеры. Официальный авторский архив фиксирует два сезона и 421 серию суммарно.",
    },
    facts: {
      hy: ["2017–2019", "2 եթերաշրջան", "421 սերիա՝ պաշտոնական հեղինակային արխիվում"],
      en: ["2017–2019", "2 seasons", "421 episodes in the official author archive"],
      ru: ["2017–2019", "2 сезона", "421 серия в официальном авторском архиве"],
    },
    sources: [
      { label: "IMDb — full cast & crew", url: "https://www.imdb.com/title/tt7873636/fullcredits/" },
      { label: "Sputnik Armenia", url: "https://am.sputniknews.ru/20210501/Top-5-armyanskikh-serialov-gde-smotret-na-russkom-i-armyanskom-yazyke-27360211.html" },
      { label: "Armenian Museum of Moscow", url: "https://www.armmuseum.ru/news-blog/ani-maghakyan-interview" },
    ],
  },
  {
    slug: "paper-dream",
    year: "2019",
    type: "TVSeries",
    titles: { hy: "Թղթե երազանք", en: "Paper Dream", ru: "Бумажная мечта" },
    roles: { hy: "Սցենարիստ", en: "Screenwriter", ru: "Сценарист" },
    summaries: {
      hy: "«Թղթե երազանք»-ը 2019 թվականի դրամատիկ հեռուստանախագիծ է։ Seoul International Drama Awards-ի պաշտոնական 2020 թ. հայտի էջը Անի Մաղաքյանին նշում է որպես սցենարիստ և SHANT TV-ն՝ որպես սկզբնական հեռարձակող։ Արտաքին և հեղինակային արխիվներում սերիաների թվի դասակարգումը տարբեր է, ուստի կայքը պահպանում է այդ տարբերությունը բաց և աղբյուրներով։",
      en: "Paper Dream is a 2019 television drama. The official Seoul International Drama Awards 2020 entry credits Ani Maghakyan as screenwriter and SHANT TV as the originating channel. External and author records use different episode counts, so the official site preserves that discrepancy transparently instead of silently overwriting either source.",
      ru: "«Бумажная мечта» — телевизионная драма 2019 года. Официальная заявка Seoul International Drama Awards 2020 указывает Ани Магакян как сценариста, а SHANT TV — как канал происхождения. Во внешнем источнике и авторском архиве различается количество серий, поэтому официальный сайт сохраняет это расхождение прозрачно, со ссылкой на источник.",
    },
    facts: {
      hy: ["2019", "Դրամա", "SHANT TV"],
      en: ["2019", "Drama", "SHANT TV"],
      ru: ["2019", "Драма", "SHANT TV"],
    },
    sources: [
      { label: "Seoul International Drama Awards — 2020 entry", url: "https://www.seouldrama.org/eng/theme/seoul/ajax/pop_exhibit.php?entryDataYear=&entryDataYear=2020&nationalCode=&num=2385&numIdx=3356&page=210&searchGenreType=&sfl=&stx=&submission2=&tt=2385" },
      { label: "elCinema — Ani Maghakyan", url: "https://elcinema.com/en/person/2161108/" },
    ],
  },
  {
    slug: "dear-sahmi",
    year: "2024",
    type: "CreativeWork",
    titles: { hy: "Սիրելի Սահմի", en: "Dear Sahmi", ru: "Дорогая Сахми" },
    roles: { hy: "Սցենարիստ", en: "Screenwriter", ru: "Сценарист" },
    summaries: {
      hy: "«Սիրելի Սահմի»-ն 2024 թվականի նախագիծ է, որի սցենարի հեղինակությունը IMDb-ն վերագրում է Անի Մաղաքյանին։ Պաշտոնական հեղինակային արխիվն ու արտաքին կինոշտեմարանը նախագիծը տարբեր ձևաչափերով են դասակարգում, ուստի այս էջը հստակ տարանջատում է հեղինակային արխիվի տվյալը և արտաքին բազայի գրառումը։",
      en: "Dear Sahmi is a 2024 project for which IMDb credits Ani Maghakyan as writer. The official author archive and the external film database classify the work differently, so this page deliberately distinguishes the author-record format from the third-party database record.",
      ru: "«Дорогая Сахми» — проект 2024 года, в котором IMDb указывает Ани Магакян как сценариста. Официальный авторский архив и внешняя кинобаза по-разному классифицируют формат проекта, поэтому эта страница специально разделяет авторские данные и запись сторонней базы.",
    },
    facts: {
      hy: ["2024", "Սցենարի հեղինակ՝ Անի Մաղաքյան", "Հայաստան"],
      en: ["2024", "Written by Ani Maghakyan", "Armenia"],
      ru: ["2024", "Сценарист — Ани Магакян", "Армения"],
    },
    sources: [
      { label: "IMDb — Dear Sahmi", url: "https://www.imdb.com/title/tt39364997/" },
    ],
  },
  {
    slug: "summer-of-84",
    year: "2024",
    type: "TVSeries",
    titles: { hy: "84-ի ամառը", en: "Summer of ’84", ru: "Лето ’84" },
    roles: { hy: "Գաղափար · սցենար · շոուռանինգ · պրոդյուսինգ", en: "Creator · writer · showrunner · producer", ru: "Идея · сценарий · шоураннинг · продюсирование" },
    summaries: {
      hy: "«84-ի ամառը» Անի Մաղաքյանի հեղինակային և արտադրական առանցքային աշխատանքներից է։ Kinodaran-ը նրան նշում է որպես Writer և Producer, իսկ IMDb-ն հաստատում է սցենարային հեղինակությունը։ Պաշտոնական արխիվը լրացուցիչ պահպանում է գաղափարի հեղինակի և շոուռաների դերը՝ որպես առաջին կողմի արտադրական գրառում։",
      en: "Summer of ’84 is one of Ani Maghakyan’s key creator-led and production works. Kinodaran credits her as both Writer and Producer, while IMDb confirms the writing credit. The official archive additionally records creator and showrunner responsibilities as first-party production information.",
      ru: "«Лето ’84» — один из ключевых авторских и производственных проектов Ани Магакян. Kinodaran указывает её одновременно как Writer и Producer, а IMDb подтверждает сценарный титр. Официальный архив дополнительно фиксирует авторство идеи и шоураннинг как сведения из первичного производственного архива.",
    },
    facts: {
      hy: ["2024", "Սցենարիստ և պրոդյուսեր", "Պաշտոնական արխիվ՝ 12 սերիա"],
      en: ["2024", "Writer and producer", "Official archive: 12 episodes"],
      ru: ["2024", "Сценарист и продюсер", "Официальный архив: 12 серий"],
    },
    sources: [
      { label: "Kinodaran — Summer of 84", url: "https://kinodaran.com/en/title/summer_of_84_.html" },
      { label: "IMDb — Ani Maghakyan", url: "https://www.imdb.com/name/nm9250160/" },
    ],
  },
  {
    slug: "blockade",
    year: "2026",
    type: "CreativeWork",
    titles: { hy: "Բլոկադա", en: "Blockade", ru: "Блокада" },
    roles: { hy: "Թատերական պիեսի սցենարի հեղինակ", en: "Stage-play writer", ru: "Автор сценария спектакля" },
    summaries: {
      hy: "«Բլոկադա»-ն Անի Մաղաքյանի առաջին թատերական սցենարն է։ Sputnik Արմենիայի 2025 թվականի մամուլի հրապարակումը նրան հստակ նշում է որպես ներկայացման սցենարի հեղինակ և նկարագրում է աշխատանքը որպես իրական պատմություններից գեղարվեստականորեն մշակված երկգործողություն դրամա։",
      en: "Blockade is Ani Maghakyan’s first script written for the stage. Sputnik Armenia’s 2025 coverage explicitly identifies her as the playwright/screenwriter for the production and describes the work as a two-act drama artistically developed from real-life stories.",
      ru: "«Блокада» — первый театральный сценарий Ани Магакян. Публикация Sputnik Армения 2025 года прямо называет её автором сценария постановки и описывает спектакль как двухактную драму, художественно осмысляющую реальные истории.",
    },
    facts: {
      hy: ["2026", "Ներկայացում", "Առաջին թատերական սցենար"],
      en: ["2026", "Stage production", "First theatre script"],
      ru: ["2026", "Спектакль", "Первый театральный сценарий"],
    },
    sources: [
      { label: "Sputnik Armenia — Blockade", url: "https://am.sputniknews.ru/20251217/blokada-novaya-postanovka-o-karabakhskikh-sobytiyakh-96979633.html" },
    ],
  },
  {
    slug: "mi-gexecik-or",
    year: "2026",
    type: "TVSeries",
    titles: { hy: "Մի գեղեցիկ օր", en: "Mi Gexecik Or", ru: "Մի գեղեցիկ օր / Mi Gexecik Or" },
    roles: { hy: "Սցենարիստ", en: "Screenwriter", ru: "Сценарист" },
    summaries: {
      hy: "«Մի գեղեցիկ օր»-ը 2026 թվականի ընթացիկ հեռուստասերիալ է։ Oragir News-ի 2026 թվականի հարցազրույցը Անի Մաղաքյանին ներկայացնում է որպես «Էլենի օրագիրը» և «Մի գեղեցիկ օր» սերիալների սցենարիստ, իսկ SHANT TV-ի պաշտոնական ալիքը հրապարակում է սերիաների և անոնսների ընթացիկ թողարկումները։",
      en: "Mi Gexecik Or is an ongoing 2026 television series. A 2026 Oragir News interview identifies Ani Maghakyan as the screenwriter of both Elen’s Diary and Mi Gexecik Or, while SHANT TV’s verified official channel publishes the current episodes and series announcements.",
      ru: "«Մի գեղեցիկ օր / Mi Gexecik Or» — текущий телесериал 2026 года. В интервью Oragir News 2026 года Ани Магакян представлена как сценарист «Дневника Элен» и «Մի գեղեցիկ օր», а официальный верифицированный канал SHANT TV публикует текущие серии и анонсы проекта.",
    },
    facts: {
      hy: ["2026", "Ընթացիկ հեռուստասերիալ", "SHANT TV"],
      en: ["2026", "Ongoing TV series", "SHANT TV"],
      ru: ["2026", "Текущий телесериал", "SHANT TV"],
    },
    sources: [
      { label: "Oragir News — 28 June 2026", url: "https://oragir.news/hy/material/2026/06/28/200446" },
      { label: "SHANT TV Armenia — official YouTube", url: "https://www.youtube.com/watch?v=RGDcJA1q97o" },
      { label: "SHANT TV", url: "https://www.shanttv.com/?lang=a" },
    ],
  },
];

export const hubs = [
  {
    slug: "about",
    titles: { hy: "Անի Մաղաքյան — կենսագրություն", en: "Ani Maghakyan — Biography", ru: "Ани Магакян — биография" },
    descriptions: {
      hy: "Անի Մաղաքյանը հայ սցենարիստ, շոուռաներ, պրոդյուսեր, արձակագիր և լրագրող է։ Պաշտոնական կենսագրական էջը համադրում է առաջին կողմի արխիվը և անկախ հրապարակումները՝ կրթության, լրագրության, սցենարային կարիերայի և ստեղծագործական մեթոդի մասին։",
      en: "Ani Maghakyan is an Armenian screenwriter, showrunner, producer, prose writer and journalist. This official biography combines the first-party archive with independent editorial sources covering her education, journalism, screenwriting career and creative method.",
      ru: "Ани Магакян — армянский сценарист, шоураннер, продюсер, прозаик и журналист. Официальная биографическая страница соединяет первичный авторский архив с независимыми публикациями об образовании, журналистике, сценарной карьере и творческом методе.",
    },
    sources: [
      { label: "Armenian Museum of Moscow — interview", url: "https://www.armmuseum.ru/news-blog/ani-maghakyan-interview" },
      { label: "Oragir News — 2026 interview", url: "https://oragir.news/hy/material/2026/06/28/200446" },
      { label: "IMDb", url: "https://www.imdb.com/name/nm9250160/" },
    ],
  },
  {
    slug: "press",
    titles: { hy: "Աղբյուրներ, հարցազրույցներ և մամուլ", en: "Press, Interviews & Sources", ru: "Пресса, интервью и источники" },
    descriptions: {
      hy: "Անի Մաղաքյանի մասին անկախ և ոլորտային աղբյուրների հավաքածու՝ կենսագրության, ստեղծագործական մեթոդի և ընտրված նախագծերի հեղինակային տվյալների ստուգման համար։",
      en: "A curated evidence hub of independent editorial and industry sources covering Ani Maghakyan’s biography, creative process and selected writing/production credits.",
      ru: "Собрание независимых редакционных и отраслевых источников об Ани Магакян: биография, творческий метод и подтверждение отдельных сценарных и производственных титров.",
    },
    sources: [
      { label: "IMDb", url: "https://www.imdb.com/name/nm9250160/" },
      { label: "Armenian Museum of Moscow", url: "https://www.armmuseum.ru/news-blog/ani-maghakyan-interview" },
      { label: "Oragir News", url: "https://oragir.news/hy/material/2026/06/28/200446" },
      { label: "Sputnik Armenia — Blockade", url: "https://am.sputniknews.ru/20251217/blokada-novaya-postanovka-o-karabakhskikh-sobytiyakh-96979633.html" },
      { label: "Seoul International Drama Awards", url: "https://www.seouldrama.org/eng/theme/seoul/ajax/pop_exhibit.php?entryDataYear=&entryDataYear=2020&nationalCode=&num=2385&numIdx=3356&page=210&searchGenreType=&sfl=&stx=&submission2=&tt=2385" },
      { label: "Kinodaran", url: "https://kinodaran.com/en/title/summer_of_84_.html" },
      { label: "elCinema", url: "https://elcinema.com/en/person/2161108/" },
      { label: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Ani_Maghakyan_screenwriter.jpg" },
    ],
  },
  {
    slug: "books",
    titles: { hy: "Անի Մաղաքյանի գրքերը", en: "Books by Ani Maghakyan", ru: "Книги Ани Магакян" },
    descriptions: {
      hy: "Պաշտոնական արխիվը ներառում է «Ժամանակավոր կանգառ» պատմվածքների ժողովածուն (2010) և «Տակնուվրա. Մի օրում բոլորը վերադառնում են» վեպը (2021)։ Հրատարակչական/գրավաճառքային արտաքին աղբյուրները ներկայացվում են առանձին՝ որպես հաստատում։",
      en: "The official archive lists Temporary Stop, a short-story collection (2010), and Topsy-Turvy: Everyone Returns in One Day, a novel (2021). Independent bookseller/catalogue records are presented separately as supporting evidence.",
      ru: "Официальный архив включает сборник рассказов «Временная остановка» (2010) и роман «Вверх дном. За один день возвращаются все» (2021). Внешние книжные каталоги приводятся отдельно как подтверждающие источники.",
    },
    sources: [
      { label: "Abril Books — Ani Maghakyan", url: "https://abrilbooks.com/creator/ani-maghakyan/" },
    ],
  },
  {
    slug: "work-with-ani",
    titles: { hy: "Համագործակցել Անի Մաղաքյանի հետ", en: "Work with Ani Maghakyan", ru: "Работа с Ани Магакян" },
    descriptions: {
      hy: "Համագործակցության պաշտոնական էջ՝ սցենարի մշակում, պատմության ճարտարապետություն, սցենարային սենյակի ղեկավարում, շոուռանինգ և ստեղծագործական պրոդյուսինգ։",
      en: "Official collaboration page for story development, screenplay architecture, writers’ room leadership, showrunning and creative production.",
      ru: "Официальная страница сотрудничества: разработка истории и сценария, архитектура проекта, руководство сценарной комнатой, шоураннинг и креативное продюсирование.",
    },
    sources: [],
  },
];

export function localizedPath(locale, tail = "") {
  const prefix = locales[locale].prefix;
  const cleanTail = tail.replace(/^\/+|\/+$/g, "");
  return [prefix, cleanTail].filter(Boolean).join("/");
}

export function allSeoPageTails() {
  return [
    ...projects.map((item) => `projects/${item.slug}`),
    ...hubs.map((item) => item.slug),
  ];
}
