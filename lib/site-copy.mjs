export const updatedIso = "2026-09-07";

export const sectionLinks = [
  { slug: 'projects', labels: { hy: 'Բոլոր նախագծերը', en: 'All projects', ru: 'Все проекты' } },
  { slug: 'about', labels: { hy: 'Կենսագրություն', en: 'Biography', ru: 'Биография' } },
  { slug: 'press', labels: { hy: 'Մամուլ և հարցազրույցներ', en: 'Press & interviews', ru: 'Пресса и интервью' } },
  { slug: 'books', labels: { hy: 'Գրքեր', en: 'Books', ru: 'Книги' } },
  { slug: 'writings', labels: { hy: 'Գրականություն', en: 'Writings', ru: 'Литература' } },
  { slug: 'services', labels: { hy: 'Ծառայություններ', en: 'Services', ru: 'Услуги' } },
  { slug: 'work-with-ani', labels: { hy: 'Համագործակցություն', en: 'Work with Ani', ru: 'Сотрудничество' } },
];

export const interfaceCopy = {
  hy: {
    menu: 'Բացել բաժինների ցանկը', skip: 'Անցնել բովանդակությանը', explore: 'Բաժիններ',
    shortIntro: 'Հայ սցենարիստ, շոուռաներ և պրոդյուսեր։ Սերիալներ, ֆիլմեր, ներկայացումներ և մանկական պատմություններ՝ 2016 թվականից։',
    work: 'Դիտել աշխատանքները', collaborate: 'Քննարկել նախագիծը', details: 'Նախագծի մասին',
    format: 'Նախագծի ձևաչափը', statistics: 'Կարիերան թվերով', clear: 'Մաքրել որոնումը',
    email: 'Գրել էլեկտրոնային նամակ', instagram: 'Գրել Instagram-ում',
    contactHint: 'Ներկայացրեք գաղափարը, ձևաչափը, աշխատանքի փուլը և նախատեսված ժամկետները։',
    year: 'Թվական', type: 'Ձևաչափ', volume: 'Ծավալ', broadcaster: 'Հարթակ / հեռուստաալիք', role: 'Անիի դերը',
    story: 'Նախագծի մասին', credit: 'Հեղինակային աշխատանք', watch: 'Որտեղ դիտել',
    sources: 'Աղբյուրներ և դիտման հղումներ', related: 'Հարակից աշխատանքներ', season: 'Եթերաշրջաններ և մասեր',
    updated: 'Թարմացված', home: 'Գլխավոր', languages: 'Ընտրել լեզուն', breadcrumb: 'Էջի ճանապարհը',
    sourceNote: 'Արտաքին հղումները կարող են բացվել այլ հարթակում։', readBook: 'Գիրքը կատալոգում',
    archiveRole: 'Ներառված է Անի Մաղաքյանի ֆիլմագրության մեջ',
  },
  en: {
    menu: 'Open section menu', skip: 'Skip to content', explore: 'Explore',
    shortIntro: 'Armenian screenwriter, showrunner and producer. Series, films, stage works and children’s stories since 2016.',
    work: 'Explore the work', collaborate: 'Discuss a project', details: 'About the project',
    format: 'Project format', statistics: 'Career statistics', clear: 'Clear search',
    email: 'Send an email', instagram: 'Message on Instagram',
    contactHint: 'Tell us about your idea, format, current stage and proposed timeline.',
    year: 'Year', type: 'Format', volume: 'Episodes / scope', broadcaster: 'Platform / broadcaster', role: 'Ani’s role',
    story: 'About the project', credit: 'Creative contribution', watch: 'Where to watch',
    sources: 'Sources & viewing links', related: 'Related work', season: 'Seasons & parts',
    updated: 'Updated', home: 'Home', languages: 'Choose language', breadcrumb: 'Breadcrumb',
    sourceNote: 'External links may open on another platform.', readBook: 'View book in catalogue',
    archiveRole: 'Included in Ani Maghakyan’s filmography',
  },
  ru: {
    menu: 'Открыть меню разделов', skip: 'Перейти к содержимому', explore: 'Разделы',
    shortIntro: 'Армянский сценарист, шоураннер и продюсер. Сериалы, фильмы, спектакли и детские истории — с 2016 года.',
    work: 'Смотреть работы', collaborate: 'Обсудить проект', details: 'О проекте',
    format: 'Формат проекта', statistics: 'Карьера в цифрах', clear: 'Очистить поиск',
    email: 'Написать по email', instagram: 'Написать в Instagram',
    contactHint: 'Расскажите об идее, формате, текущем этапе работы и предполагаемых сроках.',
    year: 'Год', type: 'Формат', volume: 'Серии / объём', broadcaster: 'Платформа / канал', role: 'Роль Ани',
    story: 'О проекте', credit: 'Авторская работа', watch: 'Где смотреть',
    sources: 'Источники и ссылки на просмотр', related: 'Связанные работы', season: 'Сезоны и части',
    updated: 'Обновлено', home: 'Главная', languages: 'Выбрать язык', breadcrumb: 'Навигационная цепочка',
    sourceNote: 'Внешние ссылки могут открываться на другой платформе.', readBook: 'Открыть книгу в каталоге',
    archiveRole: 'Входит в фильмографию Ани Магакян',
  },
};

export function resultLabel(count, locale) {
  if (locale === 'hy') return `${count} արդյունք`;
  if (locale === 'en') return `${count} ${count === 1 ? 'result' : 'results'}`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  const noun = mod10 === 1 && mod100 !== 11 ? 'результат'
    : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'результата' : 'результатов';
  return `${count} ${noun}`;
}

// Only an explicitly configured, owner-approved contact address is displayed.
export function publicContactEmail(value = '') {
  const email = value.trim();
  return /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email) && !/[?&#]/.test(email) ? email : '';
}
