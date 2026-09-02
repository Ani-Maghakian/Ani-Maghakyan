# Անի Մաղաքյան — SEO աուդիտ և աճի քարտեզ

Թարմացված՝ 1 սեպտեմբերի, 2026

## Գնահատական

Սա Google-ի կամ որևէ SEO գործիքի «պաշտոնական միավոր» չէ, այլ հրապարակման պատրաստվածության կշռված աուդիտ։ Իրական որոնողական տեսանելիությունը պետք է չափել Google Search Console և Bing Webmaster Tools տվյալներով՝ կայքը հրապարակելուց հետո։

| Շերտ | Նախքան բարելավումը | Հիմա | Մեկնաբանություն |
|---|---:|---:|---|
| Crawl / index տեխնիկական հիմք | 75/100 | 96/100 | Canonical, robots, sitemap, ստանդարտ hreflang, IndexNow և GitHub subpath ստուգում |
| Եռալեզու on-page SEO | 80/100 | 95/100 | Առանձին URL-ներ, query-aligned title-ներ, localized copy և alt text |
| Բովանդակություն և intent | 70/100 | 86/100 | Ուղիղ «ով է» պատասխան, հայտնի աշխատանքներ, 46 նախագծի ամբողջական HTML ցուցակ |
| Entity / վստահություն | 55/100 | 90/100 | WebSite → ProfilePage → Person graph, alternate names, knownFor և բաց աղբյուրներ |
| Performance / UX | 75/100 | 92/100 | LCP hero-ն 1.2 ՄԲ PNG-ից դարձել է 57 ԿԲ WebP, պահպանվել է սոցիալական PNG-ն |
| Off-page հեղինակություն | 25/100 | 25/100 | Սա հնարավոր չէ ստեղծել միայն կայքի կոդով. պետք են իրական խմբագրական հղումներ և նույնականացված պրոֆիլներ |
| Չափման պատրաստվածություն | 15/100 | 85/100 | Verification hooks կան, բայց Search Console/Bing հաշիվները պետք է կապի սեփականատերը |

Կշռված on-site պատրաստվածություն՝ մոտ **64/100 → 85/100**։ Տեխնիկական/on-page հիմքը մոտ **94/100** է։ Ամենամեծ մնացած բացը կոդը չէ, այլ նոր դոմեյնի հեղինակությունը, հրապարակայնությունը և արտաքին հղումները։

## Ինչ է ցույց տվել ուսումնասիրությունը

- [Google-ի 2026 AI-search ուղեցույցը](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) ասում է, որ AI Overviews/AI Mode-ի հիմքը նույն SEO-ն է՝ ինդեքսավորվող տեխնիկական կառուցվածք և եզակի, օգտակար բովանդակություն։ `llms.txt`, հատուկ «AI markup» կամ արհեստական հիշատակումներ Google-ի համար առավելություն չեն տալիս։
- [Google-ի multilingual ուղեցույցը](https://developers.google.com/search/docs/specialty/international/localized-versions) խորհուրդ է տալիս առանձին լեզվային URL-ներ և reciprocal hreflang. կայքի `/`, `/en/`, `/ru/` ճարտարապետությունը համապատասխանում է դրան։
- [ProfilePage փաստաթուղթը](https://developers.google.com/search/docs/appearance/structured-data/profile-page) հաստատում է, որ անձի պաշտոնական պրոֆիլի համար այս schema-ն ճիշտ ընտրություն է։
- [Bing-ի ուղեցույցը](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search) առաջարկում է միասին օգտագործել sitemap, IndexNow և Bing Webmaster Tools։
- iPullRank-ի մոտեցման առանցքը entity/relevance-ն է, Seer Interactive-ինը՝ retrieval և չափումը, Siege Media-ինը՝ իրական digital PR ու հղում վաստակող նյութը, Amsive-ինը՝ audience intent և հստակ պատասխաններ։ Կայքում ներդրվել է այն մասը, որն ապացուցելի է և կիրառելի այս նախագծի համար։
- [Reddit-ի 2026 SEO քննարկումներում](https://www.reddit.com/r/SEO/comments/1vtqm0y/should_a_small_business_optimize_for_ai_searches/) և X-ի մասնագիտական հոսքում կրկնվում է նույն գործնական եզրակացությունը՝ GEO/AEO-ն հիմնականում SEO-ի ընդլայնումն է, բայց կայքից դուրս վստահելի հիշատակումները դեռ վճռական են։ Համայնքային կարծիքները դիտարկվել են որպես փորձի ազդանշան, ոչ որպես Google-ի ranking փաստ։

## Ներդրված փոփոխությունները

- HY/EN/RU query-aligned title և description համակարգ
- բոլոր լեզուների ստանդարտ `lang`, canonical և reciprocal `hreflang`
- WebSite, Person, Organization, ProfilePage և 46 աշխատանքի ItemList JSON-LD graph
- տեսանելի «Աղբյուրներ և հաստատումներ» բաժին՝ IMDb, Armenian Museum, NEWS.am, Sputnik Armenia, Abril Books և Okko հղումներով
- անունների երեք գրությունները՝ Անի Մաղաքյան / Ani Maghakyan / Ани Магакян
- տեղայնացված image alt, anchor-ներով հայտնի աշխատանքներ և ամբողջ ֆիլմագրություն
- Search Console, Bing և Yandex verification environment variables
- GitHub Pages deploy-ից հետո IndexNow notification
- accurate sitemap `lastmod`, robots sitemap reference և paper-theme manifest
- 57 ԿԲ WebP hero՝ 1.2 ՄԲ PNG fallback/share պատկերի փոխարեն

## Հաջորդ բարձր ազդեցության քայլերը

1. Հրապարակել GitHub Pages-ում կամ, ավելի լավ, սեփական կարճ դոմեյնով և չփոխել հիմնական URL-ը։
2. Կապել Google Search Console և Bing Webmaster Tools, submit անել `sitemap.xml`-ը, ապա ստուգել երեք լեզվային URL-ները։
3. IMDb, Instagram, YouTube/TV credits և մյուս պաշտոնական պրոֆիլներից հղում տալ հենց նույն canonical կայքին։
4. Խմբագրական հրապարակումներում պահանջել բնական հղում դեպի պաշտոնական ֆիլմագրություն՝ առանց վճարովի/արհեստական link scheme-ի։
5. Առանձին նախագծային էջ ստեղծել միայն այն աշխատանքի համար, որի համար կան եզակի synopsis, credit-ներ, հարթակ, լուսանկար և առնվազն մեկ հաստատող աղբյուր։
6. 28–90 օր անց որոշումները կայացնել Search Console query/page տվյալներով, ոչ ենթադրյալ «SEO score»-ով։

Ոչ մի տեխնիկական փոփոխություն չի երաշխավորում առաջին դիրքը։ Այս տարբերակը հեռացրել է on-site խոչընդոտների մեծ մասը և պատրաստել է կայքը ինդեքսավորման, entity understanding-ի և AI-assisted search discovery-ի համար։
