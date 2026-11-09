// Episode counts come from the author's filmography; platform links are primary viewing destinations.
// Do not infer a final episode count or a head-writer credit for an ongoing series.
export const projectAnswers = {
  'elens-diary': {
    volume: { hy: '2 եթերաշրջան, ընդամենը՝ 421 սերիա․ առաջինը՝ 197, երկրորդը՝ 224՝ ըստ հեղինակային ֆիլմագրության։', en: '2 seasons and 421 episodes in the author filmography: 197 in season 1 and 224 in season 2.', ru: '2 сезона, всего 421 серия по авторской фильмографии: 197 в первом и 224 во втором.' },
    writer: { hy: 'Սցենարիստը և հեղինակային գաղափարի հեղինակը Անի Մաղաքյանն է։', en: 'Ani Maghakyan is the screenwriter and creator of the original concept.', ru: 'Сценарист и автор оригинальной идеи — Ани Магакян.' },
    platform: 'SHANT TV',
  },
  'sos-911': {
    seasons: 1,
    volume: { hy: '1 եթերաշրջան՝ 16 սերիա։ Armflix-ի կատալոգն ու հեղինակային ֆիլմագրությունը նշում են 16 սերիա։', en: '1 season with 16 episodes. Armflix and the author filmography both list 16 episodes.', ru: '1 сезон, 16 серий. В каталоге Armflix и авторской фильмографии указано 16 серий.' },
    writer: { hy: 'Սցենարիստը Անի Մաղաքյանն է՝ ըստ Armflix-ի պաշտոնական ստեղծագործական կազմի։', en: 'Armflix credits Ani Maghakyan as the screenwriter.', ru: 'В официальных титрах Armflix сценаристом указана Ани Магакян.' },
    platform: 'Armflix', url: 'https://www.armflix.com/sos-911',
  },
  'hotel-grand-3': {
    volume: { hy: 'Սա «Hotel Grand»-ի երրորդ եթերաշրջանն է՝ 12 սերիա՝ ըստ հեղինակային ֆիլմագրության։ 12-ը վերաբերում է այս եթերաշրջանին։', en: 'This is season 3 of Hotel Grand, with 12 episodes in the author filmography. The count applies to this season.', ru: 'Это третий сезон «Отеля Гранд»: 12 серий по авторской фильмографии. Число относится к этому сезону.' },
    writer: { hy: 'Սցենարիստը Անի Մաղաքյանն է։ Հեղինակներն են Իննա Խոջամիրյանը և Գոշ Հակոբյանը։', en: 'The screenwriter is Ani Maghakyan. The creators are Inna Khojamiryan and Gosh Hakobyan.', ru: 'Сценарист — Ани Магакян. Авторы проекта — Инна Ходжамирян и Гош Акопян.' },
    platform: 'PanArmenian TV · YouTube', url: 'https://www.youtube.com/watch?v=PAx1zk_Up1M',
    evidence: { label: 'NEWS.am STYLE · Hotel Grand 3', url: 'https://style.news.am/arm/news/99492/nazeni-hovhannisyany-khoren-levonyany-ev-ani-khachikyany-hotel-grand-seriali-3-rd-eterashrjanum-video.html' },
  },
  'mi-gexecik-or': {
    volume: { hy: 'Հեղինակային ֆիլմագրությունում նշված է 50+ սերիա։ Եթերաշրջանների և սերիաների վերջնական թիվը հաստատված չէ․ ընթացիկ թողարկումները ստուգեք SHANT TV-ում։', en: 'The author filmography records 50+ episodes. A final season and episode total is not confirmed; check SHANT TV for current releases.', ru: 'В авторской фильмографии указано 50+ серий. Итоговое число сезонов и серий не подтверждено; актуальные выпуски смотрите у SHANT TV.' },
    writer: { hy: 'Սցենարիստը Անի Մաղաքյանն է՝ ըստ Oragir News-ի՝ հեղինակի հետ հարցազրույցի։', en: 'Ani Maghakyan is the screenwriter, as identified in her Oragir News interview.', ru: 'Сценарист — Ани Магакян, как указано в интервью с ней для Oragir News.' },
    platform: 'SHANT TV Armenia · YouTube',
  },
};

export const answerLabels = {
  hy: { title: 'Նախագիծը՝ կարճ պատասխաններով', volume: 'Քանի՞ եթերաշրջան և սերիա ունի։', writer: 'Ո՞վ է սցենարիստը։', watch: 'Որտե՞ղ դիտել պաշտոնական տարբերակը։', note: 'Դիտման հասանելիությունն ու վճարովի պայմանները սահմանում է հարթակը։' },
  en: { title: 'Project at a glance', volume: 'How many seasons and episodes are there?', writer: 'Who is the screenwriter?', watch: 'Where can I watch the official release?', note: 'Availability and subscription terms are set by the viewing platform.' },
  ru: { title: 'Коротко о проекте', volume: 'Сколько сезонов и серий?', writer: 'Кто сценарист?', watch: 'Где смотреть официальную версию?', note: 'Доступность и условия подписки определяет платформа.' },
};
