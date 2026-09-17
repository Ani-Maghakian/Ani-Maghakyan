export const books = [
  {
    slug: 'temporary-stop', year: '2010',
    titles: { hy: 'Ժամանակավոր կանգառ', en: 'Temporary Stop', ru: 'Временная остановка' },
    descriptions: {
      hy: 'Անի Մաղաքյանի առաջին գիրքը՝ պատմվածքների ժողովածու։ Լույս է տեսել Երևանում՝ «Վան Արյան» հրատարակչությունում, 2010 թվականին։ ԱՄՆ Կոնգրեսի գրադարանի գրանցման մեջ նշված է 172 էջ։',
      en: 'Ani Maghakyan’s first book, a short-story collection published by Van Aryan in Yerevan in 2010. The Library of Congress catalogue records a 172-page Armenian edition.',
      ru: 'Первая книга Ани Магакян — сборник рассказов, выпущенный издательством «Ван Арьян» в Ереване в 2010 году. В каталоге Библиотеки Конгресса указано армянское издание объёмом 172 страницы.',
    },
    format: { hy: 'Պատմվածքների ժողովածու', en: 'Short-story collection', ru: 'Сборник рассказов' },
    isbn: '9789939812953', pages: 172, publisher: 'Վան Արյան / Van Aryan',
    source: 'https://lccn.loc.gov/2010471647',
    sources: [{ label: 'Library of Congress · Ժամանակավոր կանգառ', url: 'https://lccn.loc.gov/2010471647' }],
    cover: null,
  },
  {
    slug: 'topsy-turvy', year: '2024', archiveYear: '2021',
    titles: { hy: 'Տակնուվրա․ Մի օր բոլորը վերադառնում են', en: 'Taknuvra (Upside Down)', ru: 'Такнувра (Вверх дном)' },
    descriptions: {
      hy: 'Պատմվածքների և մենախոսությունների ժողովածու՝ «Մի օր բոլորը վերադառնում են» ենթավերնագրով։ Abril Books-ի կատալոգում ներկայացված է 2024 թվականի երևանյան հրատարակությունը՝ արևելահայերեն, կոշտ կազմով, 160 էջ։',
      en: 'A collection of stories and monologues subtitled “One Day Everyone Returns.” Abril Books lists the 2024 Yerevan edition: Eastern Armenian, hardcover, 160 pages.',
      ru: 'Сборник рассказов и монологов с подзаголовком «Однажды все возвращаются». В каталоге Abril Books представлено ереванское издание 2024 года: восточноармянский язык, твёрдый переплёт, 160 страниц.',
    },
    format: { hy: 'Պատմվածքներ և մենախոսություններ', en: 'Short stories and monologues', ru: 'Рассказы и монологи' },
    editionNote: {
      hy: '2021 թվականի հրատարակությունը՝ «Երևանյան էսքիզ», ISBN 9789939894065։ Այս էջում ներկայացված 2024 թվականի հրատարակության ISBN-ը 9789939050690 է՝ ըստ Abril Books-ի կատալոգի։',
      en: 'The 2021 edition was published by Yerevanyan Eskiz with ISBN 9789939894065. The 2024 edition shown here carries ISBN 9789939050690 in the Abril Books catalogue.',
      ru: 'Издание 2021 года вышло в «Ереванян эскиз» с ISBN 9789939894065. Представленное здесь издание 2024 года имеет ISBN 9789939050690 по каталогу Abril Books.',
    },
    isbn: '9789939050690', pages: 160,
    source: 'https://abrilbooks.com/product/taknuvra/',
    bookFormat: 'https://schema.org/Hardcover',
    sources: [
      { label: 'Abril Books · Տակնուվրա · 2024', url: 'https://abrilbooks.com/product/taknuvra/' },
      { label: 'Online Armenian Store · Տակնուվրա · 2021', url: 'https://onlinearmenianstore.com/products/ani-maghakyan-upside-down-one-day-everyone-returns' },
      { label: 'Books.am · Տակնուվրա', url: 'https://www.books.am/am/catalog/product/view/id/75187' },
    ],
    cover: { src: '/books/taknuvra.webp', width: 612, height: 900, source: 'https://abrilbooks.com/product/taknuvra/', credit: 'Abril Books' },
  },
];

export function bookSchema(book, locale, siteUrl, personId) {
  const prefix = locale === 'hy' ? '' : `${locale}/`;
  return {
    '@type': 'Book', '@id': `${siteUrl}/#book-${book.slug}`,
    url: `${siteUrl}/${prefix}books/#${book.slug}`,
    name: book.titles[locale], alternateName: Object.values(book.titles),
    description: book.descriptions[locale], datePublished: book.year,
    inLanguage: 'hy', author: { '@id': personId },
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.pages ? { numberOfPages: book.pages } : {}),
    ...(book.publisher ? { publisher: { '@type': 'Organization', name: book.publisher } } : {}),
    ...(book.bookFormat ? { bookFormat: book.bookFormat } : {}),
    ...(book.cover ? { image: `${siteUrl}${book.cover.src}` } : {}),
    ...(book.sources ? { citation: book.sources.map((source) => source.url) } : {}),
  };
}
