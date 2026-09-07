export const writingBlogUrl = 'https://maganuell.blogspot.com/';

// The five signed works on the author's supplied blog homepage.
// Publication dates and original links were checked against its Atom feed.
export const writings = [
  {
    slug: 'trap', title: '... թակարդ...', date: '2018-09-13', kind: 'poetry',
    source: 'https://maganuell.blogspot.com/2018/09/blog-post.html',
    excerpt: 'Քեզ սպասելը լարած թակարդ է…',
    descriptions: {
      hy: 'Բանաստեղծություն՝ սպասման, հավատի ու հրաժեշտի մասին։ Սիրո զգացումը բացվում է վտանգի և կորստի պատկերներով։',
      en: 'A poem about waiting, trust and parting, with love expressed through images of danger and loss.',
      ru: 'Стихотворение об ожидании, доверии и прощании. Чувство любви раскрывается через образы опасности и утраты.',
    },
  },
  {
    slug: 'ruins', title: 'Ավերակներ....', date: '2018-08-13', kind: 'fragment',
    source: 'https://maganuell.blogspot.com/2018/08/blog-post.html',
    excerpt: 'հիշողությամբ բնություն չեն նկարում',
    descriptions: {
      hy: 'Վիպակի հատված՝ բաժանման, հիշողության և ժամանակին չգնահատված սիրո մասին։',
      en: 'An excerpt from a novella about separation, memory and a love that was not appreciated at the time.',
      ru: 'Отрывок из повести о расставании, памяти и любви, которую не сумели вовремя оценить.',
    },
  },
  {
    slug: 'butterfly', title: '... թիթեռը հոգուս մեջ...', date: '2017-07-07', kind: 'writing',
    source: 'https://maganuell.blogspot.com/2017/07/blog-post.html',
    excerpt: 'Խոստանու՞մ ես վերջին տողս լինել անքուն...',
    descriptions: {
      hy: 'Քնարական գրություն՝ սիրելիին ուղղված խոստումների, չկայացած հանդիպման և ապրելու զգացումը վերագտնելու մասին։',
      en: 'A lyrical text addressed to a loved one, moving through promises, an unrealised meeting and the wish to feel alive again.',
      ru: 'Лирический текст, обращённый к любимому человеку: обещания, несостоявшаяся встреча и желание вновь почувствовать жизнь.',
    },
  },
  {
    slug: 'city', title: 'Լինում է չի լինում քաղաքը...', date: '2017-04-01', kind: 'poetry',
    source: 'https://maganuell.blogspot.com/2017/04/blog-post.html',
    excerpt: 'Այստեղ կարելի է քայլել երկար և ոչ մի տեղ չհասնել...',
    descriptions: {
      hy: 'Անձրևոտ քաղաքի, առօրյայի դադարների և սիրելիից հեռու լինելու մասին բանաստեղծություն։',
      en: 'A poem about a rainy city, pauses in everyday life and the distance from a loved one.',
      ru: 'Стихотворение о дождливом городе, паузах повседневности и расстоянии до любимого человека.',
    },
  },
  {
    slug: 'grasshopper', title: 'Մորեխիկ', date: '2016-04-21', kind: 'prose',
    source: 'https://maganuell.blogspot.com/2016/04/blog-post.html',
    excerpt: 'Ամենքս մեր մեջ մի կիսատ թռիչք ունենք...',
    descriptions: {
      hy: 'Պատմվածք՝ միասին ապրելու մենակության, հիշողությունների և սեփական ընթացքը կորցնելու մասին։',
      en: 'A short story about loneliness within a shared life, memories and losing one’s own direction.',
      ru: 'Рассказ об одиночестве в совместной жизни, воспоминаниях и утрате собственного пути.',
    },
  },
];

export const writingCopy = {
  hy: {
    title: 'Արձակ և պոեզիա', kicker: 'ԱՆՈՒԵԼԼ · 2016–2018',
    description: 'Անի Մաղաքյանի գրական էջը՝ «ԱՆՈՒԵԼԼ» բլոգի ընտրված հրապարակումներով։ Պատմվածքներ, բանաստեղծություններ և վիպակից հատված։',
    intro: 'Հինգ գրություն՝ հիշողության, սիրո, բաժանման և սեփական ճանապարհը փնտրելու մասին։',
    browse: 'Բացել գրական էջը', read: 'Կարդալ ամբողջությամբ', all: 'Բլոգի ամբողջ արխիվը',
    language: 'Բնօրինակները՝ հայերեն', published: 'Հրապարակվել է', source: 'Անի Մաղաքյան · «ԱՆՈՒԵԼԼ»',
    genres: { poetry: 'Բանաստեղծություն', fragment: 'Հատված վիպակից', prose: 'Պատմվածք', writing: 'Գրություն' },
  },
  en: {
    title: 'Prose & poetry', kicker: 'ANUELL · 2016–2018',
    description: 'Selected literary writings by Ani Maghakyan from her Anuell blog: short stories, poems and an excerpt from a novella.',
    intro: 'Five writings about memory, love, separation and finding one’s own path.',
    browse: 'Explore the writings', read: 'Read the Armenian original', all: 'The complete blog archive',
    language: 'Original texts in Armenian', published: 'Published', source: 'Ani Maghakyan · Anuell',
    genres: { poetry: 'Poem', fragment: 'Novella excerpt', prose: 'Short story', writing: 'Literary text' },
  },
  ru: {
    title: 'Проза и поэзия', kicker: 'АНУЭЛЛ · 2016–2018',
    description: 'Избранные литературные тексты Ани Магакян из блога «Ануэлл»: рассказы, стихотворения и отрывок из повести.',
    intro: 'Пять текстов о памяти, любви, расставании и поиске собственного пути.',
    browse: 'Перейти к литературным текстам', read: 'Читать оригинал на армянском', all: 'Полный архив блога',
    language: 'Оригиналы на армянском языке', published: 'Опубликовано', source: 'Ани Магакян · «Ануэлл»',
    genres: { poetry: 'Стихотворение', fragment: 'Отрывок из повести', prose: 'Рассказ', writing: 'Литературный текст' },
  },
};

export const writingHub = {
  slug: 'writings',
  titles: { hy: 'Գրականություն — Անի Մաղաքյան', en: 'Writings by Ani Maghakyan', ru: 'Литературные тексты Ани Магакян' },
  descriptions: Object.fromEntries(Object.entries(writingCopy).map(([locale, text]) => [locale, text.description])),
  sources: [],
};

export function writingDate(date, locale) {
  return new Intl.DateTimeFormat(locale === 'hy' ? 'hy-AM' : locale, {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}
