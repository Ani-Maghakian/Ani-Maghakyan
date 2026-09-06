// Synopses are short paraphrases of the linked primary sources, not invented plots.
const museum = 'https://www.armmuseum.ru/news-blog/ani-maghakyan-interview';
const seoul = 'https://www.seouldrama.org/eng/theme/seoul/ajax/pop_exhibit.php?entryDataYear=&entryDataYear=2020&nationalCode=&num=2385&numIdx=3356&page=210&searchGenreType=&sfl=&stx=&submission2=&tt=2385';
const panarmenian = 'https://www.panarmenian.tv/programs/dear-sahmi/';
const kinodaran = 'https://kinodaran.com/en/title/summer_of_84_.html';

export const projectStories = {
  'the-stranger': {
    text: {
      hy: '«Օտարը» Անի Մաղաքյանի առաջին ինքնուրույն սցենարային աշխատանքն է։ Գաղափարը նա մշակել է Ալեքսանդր Միտտայի կինոդպրոցում ուսանելու ընթացքում։',
      en: 'The Stranger was Ani Maghakyan’s first independently written screenplay. She developed the concept while studying at Alexander Mitta’s film school.',
      ru: '«Чужой» — первая самостоятельная сценарная работа Ани Магакян. Идея разрабатывалась во время её учёбы в киношколе Александра Митты.',
    },
    source: { label: 'Armenian Museum of Moscow · 2019', url: museum },
    role: { hy: 'Սցենարիստ · հեղինակային գաղափար', en: 'Screenwriter · original concept', ru: 'Сценарист · авторская идея' },
  },
  'elens-diary': {
    text: {
      hy: 'Դպրոցական սեր, առաջին հիասթափություններ և մեծանալու փորձառություն։ Անի Մաղաքյանի հեղինակային գաղափարով ստեղծված սերիալը հետևում է դեռահասների հարաբերություններին։',
      en: 'School romance, first disappointments and growing up. Created from Ani Maghakyan’s original concept, the series follows relationships between teenagers.',
      ru: 'Школьная любовь, первые разочарования и взросление. Сериал по авторской идее Ани Магакян посвящён отношениям подростков.',
    },
    source: { label: 'Armenian Museum of Moscow · 2019', url: museum },
  },
  'paper-dream': {
    text: {
      hy: '1988 թվականի երկրաշարժից հետո տասնամյա Հայկը երազում է կրթության միջոցով փոխել իր և մոր կյանքը։ Մաթեմատիկական օլիմպիադայում հաղթանակը նոր ուղի է բացում նրա համար։',
      en: 'After the 1988 earthquake, ten-year-old Hayk hopes education will change life for him and his mother. Winning a mathematics olympiad opens a new path.',
      ru: 'После землетрясения 1988 года десятилетний Айк мечтает изменить свою жизнь и помочь матери благодаря образованию. Победа на математической олимпиаде открывает ему новый путь.',
    },
    source: { label: 'Seoul International Drama Awards · 2020', url: seoul },
    broadcaster: 'SHANT TV',
    note: {
      hy: 'Հեղինակային ֆիլմագրություն՝ 24 սերիա։ Seoul International Drama Awards-ի 2020 թ. հայտում՝ 10 սերիա։ Աղբյուրներում հաշվառումը տարբերվում է։',
      en: 'Author filmography: 24 episodes. The 2020 Seoul International Drama Awards entry lists 10. The two records use different episode counts.',
      ru: 'В авторской фильмографии — 24 серии. В заявке Seoul International Drama Awards 2020 — 10. Количество серий в этих записях различается.',
    },
  },
  'dear-sahmi': {
    text: {
      hy: 'Ռոմանտիկ դրամա՝ ֆանտաստիկայի տարրերով․ 19-րդ դարից մեր օրեր հայտնված հերոսի պատմությունը միավորում է տարբեր ժամանակների սերերն ու ընտրությունները։ Ռեժիսոր՝ Գոշ Հակոբյան, սցենարիստ՝ Անի Մաղաքյան։',
      en: 'A romantic drama with a fantasy premise: a character travels from the nineteenth century to the present, connecting love and choices across eras. Directed by Gosh Hakobyan and written by Ani Maghakyan.',
      ru: 'Романтическая драма с фантастической завязкой: герой переносится из XIX века в наши дни, связывая любовь и выбор людей разных эпох. Режиссёр — Гош Акопян, сценарист — Ани Магакян.',
    },
    source: { label: 'PanArmenian TV · Dear Sahmi', url: panarmenian },
    broadcaster: 'PanArmenian TV',
  },
  'summer-of-84': {
    text: {
      hy: 'Ուսանողական տարիների երկու ընկեր պատահաբար հանդիպում են 40 տարի անց։ Երիտասարդությունից մնացած մի հարցի պատասխանը փնտրելը նրանց տանում է նոր արկածների։',
      en: 'Two former college friends meet unexpectedly after forty years. Their search for an answer to a question from their youth leads to new adventures.',
      ru: 'Двое друзей студенческой поры случайно встречаются спустя сорок лет. Поиск ответа на вопрос из молодости становится началом нового приключения.',
    },
    source: { label: 'Kinodaran · Summer of ’84', url: kinodaran },
    note: {
      hy: 'Հեղինակային ֆիլմագրություն՝ 12 սերիա։ Kinodaran-ի էջում ներկայացված է 8 սերիա։ Անին գաղափարի ու սցենարի հեղինակն է, շոուռաները և պրոդյուսերը։',
      en: 'Author filmography: 12 episodes; Kinodaran lists 8. Ani’s author credits cover the concept, screenplay, showrunning and production.',
      ru: 'В авторской фильмографии — 12 серий, на странице Kinodaran — 8. Авторские роли Ани: идея, сценарий, шоураннинг и продюсирование.',
    },
  },
};

export const projectFamilies = [
  ['elens-diary', 'elens-diary-2'],
  ['forest-cottage', 'forest-cottage-2'],
  ['special-class', 'special-class-2'],
  ['hotel-grand', 'hotel-grand-2', 'hotel-grand-3'],
  ['oke', 'oke-2', 'oke-new-years-secret'],
];

export function relatedProjects(project, projects) {
  const family = projectFamilies.find((slugs) => slugs.includes(project.slug)) ?? [];
  const parts = family.filter((slug) => slug !== project.slug).map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);
  const others = projects.filter((p) => p.slug !== project.slug && !family.includes(p.slug) && p.kind === project.kind)
    .sort((a, b) => Math.abs(Number(a.year.slice(0, 4)) - Number(project.year.slice(0, 4))) - Math.abs(Number(b.year.slice(0, 4)) - Number(project.year.slice(0, 4))));
  return { parts, related: others.slice(0, 3) };
}

export function projectSummary(project, locale) {
  const story = projectStories[project.slug];
  if (story) return story.text[locale];
  if (['blockade', 'mi-gexecik-or'].includes(project.slug)) return project.summaries[locale];
  const type = {
    hy: { series: 'Սերիալ', film: 'Ֆիլմ', stage: 'Ներկայացում', children: 'Մանկական նախագիծ' },
    en: { series: 'Television series', film: 'Film', stage: 'Stage work', children: 'Children’s project' },
    ru: { series: 'Сериал', film: 'Фильм', stage: 'Спектакль', children: 'Детский проект' },
  }[locale][project.kind];
  return `${project.titles[locale]} (${project.year}). ${type} · ${project.credit[locale]}.`;
}
