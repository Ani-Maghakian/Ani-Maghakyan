# Ani Maghakyan — Official Filmography

Եռալեզու, mobile-first պորտֆոլիո և ամբողջական ֆիլմագրություն՝ կառուցված GitHub Pages-ի համար։

## Ինչ կա կայքում

- հայերեն հիմնական էջ, առանձին անգլերեն և ռուսերեն URL-ներ
- 47 նախագծի որոնում և ձևաչափային ֆիլտրեր
- 159 էջ՝ երեք լեզվով, ներառյալ նախագծերը, գրքերը, կենսագրությունը և մամուլը
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

Workflow-ն յուրաքանչյուր հաջող deploy-ից հետո 159 URL-ն ուղարկում է IndexNow-ին։ Սա կարող է օգնել Bing-ին և մասնակցող համակարգերին հայտնաբերել փոփոխությունները, բայց չի երաշխավորում ինդեքսավորում կամ դիրք։

GitHub project site-ի `robots.txt`-ը գտնվում է ենթապանակում և չի կառավարում ամբողջ հոսթի crawling-ը։ Sitemap-ը ուղարկեք անմիջապես Search Console և Bing Webmaster Tools․ [Google-ի robots.txt կանոնները](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec), [sitemap ուղարկելու ուղեցույցը](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)։

Անիի հաստատած հրապարակային գործնական email-ը կարելի է ավելացնել GitHub Actions variable `CONTACT_EMAIL`-ով։ Վերահրապարակումից հետո այն կերևա գլխավոր և համագործակցության էջերում։ Առանց այդ փոփոխականի այցելուները կարող են գրել Instagram-ում։ Git commit-ի email-ը կայքը չի օգտագործում որպես կապի հասցե։

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

GitHub Pages-ի ուղիներով տեղական ստուգում՝

```bash
SITE_URL=https://ani-maghakian.github.io/Ani-Maghakyan SITE_BASE_PATH=/Ani-Maghakyan npm run build
node --test tests/*.test.mjs
npm run lint
npx tsc --noEmit
```

`npm test`-ը կառուցում և ստուգում է նաև առանց ենթապանակի տարբերակը։ Pull request-ները ստուգվում են `Verify portfolio changes` workflow-ով, իսկ հրապարակման workflow-ն ստուգում է արդեն կառուցված էջերը։

Ֆիլմագրությունը՝ `lib/content.ts`, ընդհանուր եռալեզու տեքստերը՝ `lib/profile-content.mjs`, գրքերը՝ `lib/books.mjs`, աղբյուրներով լրացված նախագծերը՝ `lib/project-editorial.mjs`։ Գլխավոր էջի ոճերը՝ `app/globals.css`, ներքին էջերինը՝ `public/inner-pages.css`։

Կատարված փոփոխությունները, ստուգումները և հետագա SEO աշխատանքի սահմանները նկարագրված են [փոփոխությունների գրառման մեջ](docs/ux-seo-improvements.md)։
