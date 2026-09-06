export const books = [
  {
    slug: 'temporary-stop', year: '2010',
    titles: { hy: 'Ժամանակավոր կանգառ', en: 'Temporary Stop', ru: 'Временная остановка' },
    descriptions: {
      hy: 'Անի Մաղաքյանի պատմվածքների ժողովածուն՝ հեղինակային մատենագրության առաջին գիրքը։',
      en: 'Ani Maghakyan’s short-story collection, the first book in her author bibliography.',
      ru: 'Сборник рассказов Ани Магакян — первая книга в её авторской библиографии.',
    },
    format: { hy: 'Պատմվածքների ժողովածու', en: 'Short-story collection', ru: 'Сборник рассказов' },
  },
  {
    slug: 'topsy-turvy', year: '2024', archiveYear: '2021',
    titles: { hy: 'Տակնուվրա․ Մի օր բոլորը վերադառնում են', en: 'Taknuvra (Upside Down)', ru: 'Такнувра (Вверх дном)' },
    descriptions: {
      hy: 'Պատմվածքներ և մենախոսություններ։ Abril Books-ի կատալոգում ներկայացված է 2024 թվականի երևանյան հրատարակությունը՝ արևելահայերեն, կոշտ կազմով, 160 էջ։',
      en: 'Short stories and monologues. Abril Books lists the 2024 Yerevan edition: Eastern Armenian, hardcover, 160 pages.',
      ru: 'Рассказы и монологи. В каталоге Abril Books представлено ереванское издание 2024 года: восточноармянский язык, твёрдый переплёт, 160 страниц.',
    },
    format: { hy: 'Պատմվածքներ և մենախոսություններ', en: 'Short stories and monologues', ru: 'Рассказы и монологи' },
    editionNote: {
      hy: 'Հեղինակային նախկին գրառման մեջ նշված է 2021 թվականը։ Այստեղ բերված 2024 թվականը և ISBN-ը վերաբերում են Abril Books-ի կատալոգի հրատարակությանը։',
      en: 'The earlier author record gives 2021. The 2024 date and ISBN shown here refer to the edition listed by Abril Books.',
      ru: 'В прежней авторской записи указан 2021 год. Дата 2024 и ISBN на этой странице относятся к изданию из каталога Abril Books.',
    },
    isbn: '9789939050690', pages: 160,
    source: 'https://abrilbooks.com/product/taknuvra/',
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
    ...(book.isbn ? { isbn: book.isbn, numberOfPages: book.pages, bookFormat: 'https://schema.org/Hardcover', citation: book.source } : {}),
  };
}
