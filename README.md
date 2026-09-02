# Ani Maghakyan — Official Filmography

Եռալեզու, mobile-first պորտֆոլիո և ամբողջական ֆիլմագրություն՝ կառուցված GitHub Pages-ի համար։

## Ինչ կա կայքում

- հայերեն հիմնական էջ, առանձին անգլերեն և ռուսերեն URL-ներ
- 46 նախագծի որոնում և ձևաչափային ֆիլտրեր
- WebSite, Person, Organization, ProfilePage և ItemList JSON-LD entity graph
- canonical, hreflang, Open Graph, X card, sitemap և robots
- հրապարակային աղբյուրների ու հաստատումների առանձին բաժին
- GitHub deploy-ից հետո IndexNow URL notification
- Google, Bing և Yandex ownership verification-ի պատրաստ hooks
- responsive cinematic editorial design
- ավտոմատ GitHub Pages deployment

## Հրապարակում GitHub Pages-ում

1. Ստեղծեք նոր GitHub repository և այս պանակի ամբողջ պարունակությունը push արեք `main` branch։
2. Repository → **Settings → Pages → Source** ընտրեք **GitHub Actions**։
3. Push-ից հետո `Deploy Ani Maghakyan portfolio to GitHub Pages` workflow-ն ինքնաշխատ կհրապարակի կայքը։

Repository-ն project site լինելու դեպքում canonical URL-ը և asset path-երը հաշվարկվում են ավտոմատ։ Եթե միացնում եք սեփական դոմեյն, repository-ի **Settings → Secrets and variables → Actions → Variables** բաժնում ավելացրեք `SITE_URL`, օրինակ՝ `https://animaghakyan.com`։

## Որոնողական համակարգերում գրանցում

Կայքը հրապարակելուց հետո՝

1. [Google Search Console](https://search.google.com/search-console/about)-ում ավելացրեք հրապարակային URL-ը, ստացեք HTML tag verification արժեքը և GitHub Actions Variables-ում պահեք որպես `GOOGLE_SITE_VERIFICATION`։
2. [Bing Webmaster Tools](https://www.bing.com/webmasters/about)-ում կարող եք import անել Search Console property-ն կամ ստացված meta tag արժեքը պահել որպես `BING_SITE_VERIFICATION`։
3. Ցանկության դեպքում Yandex verification արժեքը պահեք որպես `YANDEX_SITE_VERIFICATION`։
4. Նոր push արեք և երկու համակարգերում submit արեք հրապարակված `sitemap.xml`-ը։

Workflow-ն յուրաքանչյուր հաջող deploy-ից հետո երեք լեզվային URL-ները ուղարկում է IndexNow-ին։ Սա արագացնում է փոփոխության հայտնաբերումը Bing-ի և մասնակցող այլ համակարգերի համար, բայց չի երաշխավորում ինդեքսավորում կամ դիրք։

Ֆիլմերի կամ սերիալների առանձին էջեր ավելացրեք միայն այն ժամանակ, երբ յուրաքանչյուրի համար կան եզակի synopsis, ստեղծագործական կազմ, հեռարձակող հարթակ, պատկեր և հաստատող աղբյուրներ։ Միայն վերնագիր/տարի տվյալներով զանգվածային էջեր ստեղծելը կարող է բերել thin-content խնդիրների։

## Տեղական աշխատանք

```bash
npm ci
npm run dev
```

Production build՝

```bash
npm run build
```

Կայքի բովանդակությունը պահվում է `lib/content.ts` ֆայլում, իսկ հիմնական վիզուալ համակարգը՝ `app/globals.css`-ում։
