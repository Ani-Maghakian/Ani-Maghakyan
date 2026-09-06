export const serviceHub = {
  slug: 'services',
  titles: {
    hy: 'Սցենարի մշակում, շոուռանինգ և ստեղծագործական պրոդյուսինգ — Անի Մաղաքյան',
    en: 'Screenwriting, Story Development & Showrunning — Ani Maghakyan',
    ru: 'Разработка сценария и шоураннинг — Ани Магакян',
  },
  headings: {
    hy: 'Պատմությունից մինչև էկրան',
    en: 'From story to screen',
    ru: 'От истории к экрану',
  },
  descriptions: {
    hy: 'Անի Մաղաքյանի մասնագիտական ծառայությունները՝ սցենարի մշակում, պատմության ճարտարապետություն, շոուռանինգ և ստեղծագործական պրոդյուսինգ։ 47 նախագծի և 2,300+ սերիայի փորձը՝ նոր նախագծերի զարգացման համար։',
    en: 'Professional services by Armenian screenwriter and showrunner Ani Maghakyan: screenwriting, story development, showrunning and creative production, informed by a 47-project archive and 2,300+ identified episodes.',
    ru: 'Профессиональные услуги армянского сценариста и шоураннера Ани Магакян: разработка сценария и истории, шоураннинг и креативное продюсирование — на базе опыта 47 проектов и 2 300+ серий.',
  },
  intros: {
    hy: 'Աշխատանքը կարող է սկսվել մեկ նախադասությամբ գաղափարից, արդեն գրված սցենարից կամ ընթացքի մեջ գտնվող սերիալից։ Նպատակը նույնն է՝ պատմությունը դարձնել կառուցվածքային, էմոցիոնալ և արտադրության համար կիրառելի։',
    en: 'The work can begin with a one-line idea, an existing draft, or a series already in development. The objective is the same: make the story structurally clear, emotionally durable and usable in production.',
    ru: 'Работа может начаться с идеи в одну строку, готового черновика или уже запущенной разработки сериала. Цель одна: сделать историю структурно ясной, эмоционально работающей и пригодной для производства.',
  },
};

export const services = [
  {
    slug: 'screenwriting',
    names: { hy: 'Սցենարի մշակում', en: 'Screenwriting', ru: 'Разработка сценария' },
    titles: {
      hy: 'Սցենարի մշակում և հայ սցենարիստ — Անի Մաղաքյան',
      en: 'Armenian Screenwriter & Screenwriting — Ani Maghakyan',
      ru: 'Армянский сценарист и разработка сценария — Ани Магакян',
    },
    descriptions: {
      hy: 'Սցենարի մշակում սերիալների, ֆիլմերի, ներկայացումների և մանկական պատմությունների համար՝ գաղափարից ու կառուցվածքից մինչև դրվագային պլան, սցենար և վերաշարադրում։',
      en: 'Screenwriting for series, films, stage works and children’s stories: from concept and structure through episode architecture, screenplay drafting and rewrites.',
      ru: 'Разработка сценариев для сериалов, фильмов, театра и детских проектов: от идеи и структуры до поэпизодного плана, сценария и переписывания.',
    },
    leads: {
      hy: 'Անի Մաղաքյանի պաշտոնական արխիվը ներառում է 47 նախագիծ և ավելի քան 2,300 նույնականացված սերիա։ Սցենարային աշխատանքում այդ փորձը վերածվում է ոչ թե «տեքստ գրելու», այլ պատմության ճարտարապետության՝ գաղափար, կոնֆլիկտ, կերպար, կառուցվածք, դրվագ և վերջաբան։',
      en: 'Ani Maghakyan’s official archive spans 47 projects and more than 2,300 identified episodes. That experience turns screenwriting into story architecture rather than simply writing pages: premise, conflict, character, structure, episode and ending.',
      ru: 'Официальный архив Ани Магакян включает 47 проектов и более 2 300 серий. Этот опыт превращает сценарную работу не просто в написание текста, а в архитектуру истории: идея, конфликт, персонаж, структура, эпизод и финал.',
    },
    sections: {
      hy: [
        ['Ինչ է ներառում', ['Գաղափարի և լոգլայնի մշակում', 'Սինոփսիս, treatment և պատմության կառուցվածք', 'Սերիալի սեզոնային ու դրվագային ճարտարապետություն', 'Սցենարի գրություն, script notes և վերաշարադրում']],
        ['Ում համար է', ['Պրոդյուսերների և ստուդիաների նոր նախագծեր', 'Արդեն գրված նյութ, որը կառուցվածքային վերամշակման կարիք ունի', 'Սերիալային գաղափար, որը պետք է վերածել երկարատև պատմության շարժիչի']],
      ],
      en: [
        ['What the work can cover', ['Premise, concept and logline development', 'Synopsis, treatment and story structure', 'Season and episode architecture for series', 'Screenplay drafting, script notes and rewrites']],
        ['Best fit', ['New projects from producers and studios', 'Existing material that needs structural redevelopment', 'A series concept that needs a durable long-form story engine']],
      ],
      ru: [
        ['Что может входить в работу', ['Разработка идеи, концепции и логлайна', 'Синопсис, treatment и структура истории', 'Архитектура сезона и серий', 'Написание сценария, script notes и переписывание']],
        ['Для каких задач', ['Новые проекты продюсеров и студий', 'Готовый материал, которому нужна структурная переработка', 'Идея сериала, которую нужно превратить в устойчивый двигатель длинной истории']],
      ],
    },
    faqs: {
      hy: [
        ['Կարելի՞ է գալ արդեն պատրաստ գաղափարով կամ սցենարով։', 'Այո։ Աշխատանքը կարող է սկսվել և՛ զրոյից, և՛ արդեն գոյություն ունեցող նյութի կառուցվածքային աուդիտից ու վերաշարումից։'],
        ['Ի՞նչ ձևաչափերի վրա է աշխատում Անին։', 'Պաշտոնական ֆիլմագրությունը ներառում է հեռուստասերիալներ, ֆիլմեր, ներկայացումներ և մանկական նախագծեր։'],
        ['Սերիալի դեպքում միայն առաջին սերիա՞ն է մշակվում։', 'Ոչ պարտադիր։ Առանձին աշխատանք կարող է լինել ամբողջ սեզոնի դրամատուրգիական կառուցվածքը, դրվագային քարտեզը և շարունակականության տրամաբանությունը։'],
      ],
      en: [
        ['Can the process start with an existing idea or draft?', 'Yes. The work can begin from zero or with a structural audit and redevelopment of material that already exists.'],
        ['Which formats does Ani work across?', 'The official filmography includes television series, films, stage works and children’s projects.'],
        ['For a series, is the work limited to the pilot?', 'Not necessarily. The scope can include season architecture, episode mapping and long-form continuity as a separate assignment.'],
      ],
      ru: [
        ['Можно прийти с уже готовой идеей или сценарием?', 'Да. Работа может начаться с нуля либо со структурного аудита и переработки уже существующего материала.'],
        ['С какими форматами работает Ани?', 'Официальная фильмография включает телесериалы, фильмы, театральные проекты и детские истории.'],
        ['Для сериала работа ограничивается пилотом?', 'Не обязательно. Отдельной задачей может быть архитектура сезона, карта серий и логика длинной драматургической линии.'],
      ],
    },
    related: ['elens-diary', 'paper-dream', 'dear-sahmi'],
  },
  {
    slug: 'story-development',
    names: { hy: 'Պատմության մշակում', en: 'Story Development', ru: 'Разработка истории' },
    titles: {
      hy: 'Պատմության մշակում և դրամատուրգիա — Անի Մաղաքյան',
      en: 'Story Development & Dramaturgy — Ani Maghakyan',
      ru: 'Разработка истории и драматургия — Ани Магакян',
    },
    descriptions: {
      hy: 'Story development՝ գաղափարի, կոնֆլիկտի, կերպարների, աշխարհի և կառուցվածքի մշակում մինչև սինոփսիս, treatment, սերիալային bible կամ սցենարային աշխատանք։',
      en: 'Story development for film and series: premise, conflict, characters, world and structure developed into a synopsis, treatment, series bible or screenplay-ready architecture.',
      ru: 'Разработка истории для кино и сериалов: идея, конфликт, персонажи, мир и структура — до синопсиса, treatment, библии сериала или готовой сценарной архитектуры.',
    },
    leads: {
      hy: 'Լավ սցենարի խնդիրը հաճախ սկսվում է սցենարից առաջ։ Եթե պատմության շարժիչը, գլխավոր ցանկությունը, հակամարտությունը կամ վերջաբանը հստակ չեն, էջերի քանակը խնդիրը չի լուծի։ Այս փուլը հենց այդ հիմքն է ամրացնում։',
      en: 'Many screenplay problems begin before the screenplay. If the story engine, central desire, opposition or ending is unclear, adding pages will not solve it. Story development is the stage where those foundations are engineered.',
      ru: 'Проблемы сценария часто начинаются до самого сценария. Если неясны двигатель истории, центральное желание героя, сопротивление или финал, дополнительные страницы не помогут. Этот этап выстраивает фундамент.',
    },
    sections: {
      hy: [
        ['Հիմնական աշխատանք', ['Premise և թեմատիկ առանցք', 'Գլխավոր ու երկրորդական կերպարների arcs', 'Կոնֆլիկտի և stakes-ի սրացում', 'Beat sheet, treatment, season map կամ series bible']],
        ['Արդյունքը', ['Պատմության հստակ շարժիչ', 'Կերպարների որոշումների պատճառահետևանքային շղթա', 'Ստեղծագործական թիմի համար մեկ ընդհանուր reference փաստաթուղթ']],
      ],
      en: [
        ['Core development work', ['Premise and thematic spine', 'Primary and secondary character arcs', 'Conflict and stakes escalation', 'Beat sheet, treatment, season map or series bible']],
        ['What the project should gain', ['A clear story engine', 'Causal logic behind character choices', 'A shared reference document for the creative team']],
      ],
      ru: [
        ['Основная разработка', ['Premise и тематический стержень', 'Арки главных и второстепенных персонажей', 'Эскалация конфликта и ставок', 'Beat sheet, treatment, карта сезона или библия сериала']],
        ['Что должен получить проект', ['Ясный двигатель истории', 'Причинно-следственную логику решений персонажей', 'Единый reference-документ для творческой команды']],
      ],
    },
    faqs: {
      hy: [
        ['Story development-ը նույնն է, ինչ սցենար գրե՞լը։', 'Ոչ։ Այն կարող է նախորդել սցենարին և կենտրոնանալ պատմության ճարտարապետության վրա՝ մինչև էջերի գրությունը սկսելը։'],
        ['Կարելի՞ է մշակել միայն սերիալի կոնցեպտը։', 'Այո։ Scope-ը կարող է սահմանափակվել գաղափարով, սեզոնի կառուցվածքով, կերպարներով և pitch-ready փաստաթղթերով։'],
        ['Հնարավո՞ր է աշխատել արդեն խնդիրներ ունեցող պատմության վրա։', 'Այո։ Այդ դեպքում առաջին քայլը կառուցվածքային աուդիտն է՝ գտնելու, թե որ տեղում է պատմությունը կորցնում շարժիչը, stakes-ը կամ կերպարի տրամաբանությունը։'],
      ],
      en: [
        ['Is story development the same as writing the screenplay?', 'No. It can precede the screenplay and focus on the architecture of the story before page writing begins.'],
        ['Can the scope be limited to developing a series concept?', 'Yes. It can focus on concept, season structure, characters and pitch-ready development documents.'],
        ['Can this be used to repair a story that is already struggling?', 'Yes. In that case the first step is a structural audit to identify where the story loses its engine, stakes or character logic.'],
      ],
      ru: [
        ['Разработка истории — это то же самое, что написать сценарий?', 'Нет. Она может предшествовать сценарию и сосредоточиться на архитектуре истории до начала постраничной работы.'],
        ['Можно ограничиться разработкой концепции сериала?', 'Да. Scope может включать концепцию, структуру сезона, персонажей и документы для питчинга.'],
        ['Можно работать с историей, которая уже не работает?', 'Да. В таком случае первый шаг — структурный аудит: где история теряет двигатель, ставки или логику персонажей.'],
      ],
    },
    related: ['summer-of-84', 'elens-diary', 'paper-dream'],
  },
  {
    slug: 'showrunning',
    names: { hy: 'Շոուռանինգ', en: 'Showrunning', ru: 'Шоураннинг' },
    titles: {
      hy: 'Շոուռանինգ և սերիալի ստեղծագործական ղեկավարում — Անի Մաղաքյան',
      en: 'Showrunning & Series Creative Leadership — Ani Maghakyan',
      ru: 'Шоураннинг и креативное руководство сериалом — Ани Магакян',
    },
    descriptions: {
      hy: 'Շոուռանինգ և սերիալային creative leadership՝ season architecture, writers’ room, սցենարային շարունակականություն, creative notes և արտադրության հետ կապ։',
      en: 'Showrunning and series creative leadership across season architecture, writers’ room direction, script continuity, creative notes and the handoff from writing into production.',
      ru: 'Шоураннинг и креативное руководство сериалом: архитектура сезона, writers’ room, сценарная непрерывность, creative notes и переход от сценария к производству.',
    },
    leads: {
      hy: 'Շոուռանինգը մեկ սցենար գրելու աշխատանք չէ։ Այն երկար պատմության միասնությունը պահելու համակարգ է՝ որպեսզի կերպարը, տոնը, սեզոնային arc-ը և յուրաքանչյուր սերիայի դրամատուրգիական նպատակը չքայքայվեն արտադրական արագության մեջ։',
      en: 'Showrunning is not the task of writing one script. It is the system that protects a long-form story across episodes so character, tone, season arc and the dramatic purpose of each installment survive production speed.',
      ru: 'Шоураннинг — не работа над одним сценарием. Это система, которая удерживает длинную историю между сериями, чтобы персонаж, тон, сезонная арка и драматургическая функция каждого эпизода не распались в производственном темпе.',
    },
    sections: {
      hy: [
        ['Շոուռաների scope', ['Season architecture և episode map', 'Writers’ room-ի ստեղծագործական ուղղություն', 'Սցենարների notes, revision priorities և continuity', 'Սցենարային որոշումների կապը արտադրական իրագործելիության հետ']],
        ['Հարմար է, երբ', ['Սերիալն ունի բազմաթիվ սերիաներ կամ հեղինակներ', 'Պետք է մեկ ձայն և մեկ story logic պահել ամբողջ սեզոնում', 'Սցենարային և արտադրական թիմերի միջև creative bridge է պետք']],
      ],
      en: [
        ['Showrunner scope', ['Season architecture and episode map', 'Creative direction of the writers’ room', 'Script notes, revision priorities and continuity', 'Connecting story decisions with production feasibility']],
        ['Best fit when', ['A series spans many episodes or multiple writers', 'One voice and one story logic must hold across the season', 'The writing and production teams need a clear creative bridge']],
      ],
      ru: [
        ['Scope шоураннера', ['Архитектура сезона и карта эпизодов', 'Креативное руководство writers’ room', 'Script notes, приоритеты правок и continuity', 'Связь драматургических решений с производственной реализуемостью']],
        ['Особенно полезно, когда', ['В сериале много серий или несколько авторов', 'Нужно сохранить единый голос и story logic сезона', 'Между сценарной и производственной командами нужен ясный creative bridge']],
      ],
    },
    faqs: {
      hy: [
        ['Շոուռաները պարտադիր գրո՞ւմ է բոլոր սերիաները։', 'Ոչ։ Շոուռաների հիմնական գործառույթը կարող է լինել սեզոնի և ամբողջ սցենարային համակարգի ստեղծագործական ղեկավարումը՝ տարբեր հեղինակների աշխատանքի միասնականացման միջոցով։'],
        ['Ե՞րբ է պետք շոուռաներ։', 'Երբ նախագիծը երկարաժամկետ է, ունի մեծ ծավալ, writers’ room կամ սցենարային ու արտադրական որոշումների միջև շարունակական համակարգման կարիք։'],
        ['Անիի ֆիլմագրության մեջ կա՞ շոուռաներական փորձ։', 'Այո։ «84-ի ամառը» պաշտոնական արխիվում ներկայացված է որպես Անի Մաղաքյանի creator-led նախագիծ, որտեղ նա եղել է գաղափարի ու սցենարի հեղինակ, շոուռաներ և պրոդյուսեր։'],
      ],
      en: [
        ['Does a showrunner have to write every episode?', 'No. The central role can be creative leadership of the season and the writing system, aligning work produced by multiple writers.'],
        ['When does a project need a showrunner?', 'When it is long-form, high-volume, built around a writers’ room, or needs continuous alignment between writing and production decisions.'],
        ['Does Ani have a documented showrunning credit?', 'Yes. Summer of ’84 is presented in the official archive as an Ani Maghakyan creator-led project in which she originated the idea, wrote the screenplay, served as showrunner and producer.'],
      ],
      ru: [
        ['Шоураннер обязан писать все серии?', 'Нет. Ключевая функция может заключаться в креативном руководстве сезоном и всей сценарной системой, объединяя работу нескольких авторов.'],
        ['Когда проекту нужен шоураннер?', 'Когда проект длинный, объёмный, работает через writers’ room или требует постоянной координации сценарных и производственных решений.'],
        ['Есть ли у Ани подтверждённый опыт шоураннинга?', 'Да. «Лето ’84» в официальном архиве представлено как creator-led проект Ани Магакян, где она была автором идеи и сценария, шоураннером и продюсером.'],
      ],
    },
    related: ['summer-of-84', 'mi-gexecik-or', 'elens-diary'],
  },
  {
    slug: 'creative-production',
    names: { hy: 'Ստեղծագործական պրոդյուսինգ', en: 'Creative Production', ru: 'Креативное продюсирование' },
    titles: {
      hy: 'Ստեղծագործական պրոդյուսինգ — Անի Մաղաքյան',
      en: 'Creative Production — Ani Maghakyan',
      ru: 'Креативное продюсирование — Ани Магакян',
    },
    descriptions: {
      hy: 'Ստեղծագործական պրոդյուսինգ՝ գաղափարի, սցենարի, ձևաչափի և ստեղծագործական որոշումների միասնական ղեկավարում՝ նյութը արտադրության համար հստակ փաթեթ դարձնելու նպատակով։',
      en: 'Creative production connecting concept, screenplay, format and creative decision-making so a project reaches production as a coherent, executable package.',
      ru: 'Креативное продюсирование, объединяющее идею, сценарий, формат и творческие решения, чтобы проект пришёл в производство как цельный и реализуемый пакет.',
    },
    leads: {
      hy: 'Ստեղծագործական պրոդյուսինգի արժեքը սցենարը և արտադրությունը նույն համակարգում պահելն է։ Նպատակը ոչ թե յուրաքանչյուր production ֆունկցիա փոխարինելն է, այլ պաշտպանել նախագծի ստեղծագործական առանցքը և այն վերածել հստակ որոշումների։',
      en: 'The value of creative production is keeping writing and production inside one decision system. The goal is not to replace every production function, but to protect the project’s creative spine and translate it into clear executable choices.',
      ru: 'Ценность креативного продюсирования — удерживать сценарий и производство в одной системе решений. Задача не в том, чтобы заменить все производственные функции, а в том, чтобы защитить творческий стержень проекта и перевести его в конкретные реализуемые решения.',
    },
    sections: {
      hy: [
        ['Ինչ կարող է ներառել', ['Project positioning և creative brief', 'Սցենարային նյութի ու production reality-ի համապատասխանեցում', 'Creative priorities՝ casting, tone, format, pacing և presentation', 'Pitch / development փաթեթի կառուցվածք']],
        ['Գործնական նպատակը', ['Քիչ հակասություններ ստեղծագործական և արտադրական որոշումների միջև', 'Մեկ պարզ creative direction ամբողջ թիմի համար', 'Պատմության առանցքի պահպանում մինչև արտադրական փուլ']],
      ],
      en: [
        ['What the scope can include', ['Project positioning and creative brief', 'Aligning screenplay material with production reality', 'Creative priorities across casting, tone, format, pacing and presentation', 'Structure of the pitch / development package']],
        ['Practical objective', ['Fewer contradictions between creative and production decisions', 'One clear creative direction for the team', 'Protecting the story spine through the production handoff']],
      ],
      ru: [
        ['Что может входить в scope', ['Позиционирование проекта и creative brief', 'Согласование сценарного материала с production reality', 'Креативные приоритеты: casting, tone, format, pacing и presentation', 'Структура pitch / development пакета']],
        ['Практическая цель', ['Меньше противоречий между креативными и производственными решениями', 'Единое понятное creative direction для команды', 'Сохранение стержня истории при переходе в производство']],
      ],
    },
    faqs: {
      hy: [
        ['Սա line production-ի փոխարինո՞ւմ է։', 'Ոչ։ Այստեղ շեշտը ստեղծագործական պրոդյուսինգի վրա է՝ պատմության, ձևաչափի և creative decisions-ի համակարգման, ոչ թե յուրաքանչյուր տեխնիկական production ֆունկցիայի փոխարինման։'],
        ['Կարելի՞ է միանալ արդեն մշակվող նախագծին։', 'Այո։ Scope-ը կարող է սկսվել արդեն գոյություն ունեցող սցենարի, pitch-ի կամ արտադրական փաթեթի creative audit-ից։'],
        ['Կա՞ creator-led production-ի օրինակ։', '«84-ի ամառը» Անի Մաղաքյանի պաշտոնական արխիվում նշված է որպես նախագիծ, որտեղ նա գաղափարի ու սցենարի հեղինակն է, շոուռաները և պրոդյուսերը։'],
      ],
      en: [
        ['Does this replace line production?', 'No. The emphasis here is creative production: coordinating story, format and creative decisions rather than replacing every technical production function.'],
        ['Can the work begin after a project is already in development?', 'Yes. The scope can begin with a creative audit of an existing screenplay, pitch or production package.'],
        ['Is there a creator-led production example in the archive?', 'Summer of ’84 is listed in Ani Maghakyan’s official archive as a project where she originated the idea, wrote the screenplay, and served as showrunner and producer.'],
      ],
      ru: [
        ['Это заменяет line production?', 'Нет. Здесь фокус на креативном продюсировании: координации истории, формата и creative decisions, а не на замене каждой технической производственной функции.'],
        ['Можно подключиться к уже разрабатываемому проекту?', 'Да. Scope может начаться с creative audit существующего сценария, pitch или производственного пакета.'],
        ['Есть ли в архиве пример creator-led production?', '«Лето ’84» указано в официальном архиве Ани Магакян как проект, где она была автором идеи и сценария, шоураннером и продюсером.'],
      ],
    },
    related: ['summer-of-84', 'paper-dream', 'mi-gexecik-or'],
  },
];
