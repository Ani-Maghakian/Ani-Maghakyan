# UX/UI and SEO improvements — 6 September 2026

The portfolio now gives visitors a shorter route from the first screen to Ani’s work and contact options. Existing project URLs, the 47-work filmography and the approved featured-project order are preserved.

## Implemented

- Replaced post-build footer HTML injection with React-rendered navigation. This removes the known cause of the footer hydration mismatch and disappearing links.
- Added native mobile menus, keyboard Escape handling, skip links, larger controls, a search-clear button, correct Russian result counts and featured-project scroll controls.
- Reduced hero spacing and type scale, shortened the introduction and matched the hero artwork frame to its actual aspect ratio. The two primary actions are visible in the first desktop and tested narrow viewports.
- Made featured covers and titles open the internal project detail page; the separate watch control keeps its viewing destination. Failed images have a title fallback.
- Gave generated pages the same serif/sans typography and paper/green visual palette. Added translated labels, current-language indication and navigation on narrow screens.
- Built distinct biography, press, books and collaboration pages. The books page includes both books, the catalogued 2024 Taknuvra edition and its ISBN, while explicitly preserving the earlier author-record year of 2021 as a separate note.
- Added concise source-based context for The Stranger, Elen’s Diary, Paper Dream, Dear Sahmi and Summer of ’84. Replaced the remaining repeated page-template prose with concise catalogue facts. Existing detailed entries for Blockade and Mi Gexecik Or remain available.
- Connected seasons and related formats, unified Ani’s Person identifier, used citations for supporting sources, and aligned Elen’s Diary’s visible total of 421 episodes with its series schema. The filmography keeps 197 and 224 as separate season entries.
- Replaced positional facts with named fields: SHANT TV is a broadcaster, and Paper Dream’s archive scope is 24 episodes. Source discrepancies (10 in the Seoul entry; 8 vs 12 for Summer of ’84) are stated alongside the relevant source.
- Shared book metadata between home and book pages, synchronized sitemap modification dates, and added an optional owner-configured public contact email.
- Added PR verification and made the deployment workflow test the exported pages before uploading its artifact.

## Verification

- Production export with `SITE_BASE_PATH=/Ani-Maghakyan` completed.
- All 13 Node test groups passed, including every one of the 159 canonical URLs, internal page destinations, language navigation, project schema, season totals and book-edition consistency.
- ESLint and TypeScript checks passed without errors or warnings.
- Browser inspection of the development homepage at 1363 × 936: action group starts at y=557 and ends at y=611; all five footer section links remain after hydration; no React errors were captured.
- Browser checks used narrow iframe viewports of 360 and 390 pixels for the three homepage languages and representative exported project, books and press pages. Native menu opening/Escape, search, clearing, filtering and carousel movement were exercised. The measured HY and RU document widths had no horizontal page overflow.
- This is browser layout and functional QA, not a physical-device test, a Lighthouse score or a measured Core Web Vitals result. Generated-page samples were served temporarily through the local QA preview; the production-site check follows publication.

## Work that needs owner data or publication

1. **Search performance:** verify the actual Search Console property and submit the deployed sitemap. Inspect impressions, clicks, queries and indexed pages after publication. A sitemap URL count is not an indexed-page count.
2. **Content:** 40 project entries still rely on concise catalogue facts rather than unique plot descriptions or author case studies. Approved synopses, specific creative credits, production details and images will make these entries more useful. No plots or unverified awards were invented.
3. **Contact:** configure `CONTACT_EMAIL` only with an address Ani wants public. Instagram works without this setting.
4. **Measurement:** `data-track` attributes identify project, watch and contact controls for a future analytics integration. They do not send, store or count events. No analytics account, measurement ID or traffic baseline was available.
5. **Root robots.txt:** this repository publishes under `/Ani-Maghakyan/`; its subdirectory robots file cannot control the origin. A root-site repository or domain configuration is a separate hosting change. The root 404 observed during the audit is not itself a Google crawl block. Submit the sitemap directly in the meantime. See [Google’s robots.txt specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) and [sitemap submission guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

The changes improve usability and technical consistency. They do not establish a “10/10” score or guarantee more visits.

## Content sources

- [Ani’s 2019 interview, Armenian Museum of Moscow](https://www.armmuseum.ru/news-blog/ani-maghakyan-interview): The Stranger and Elen’s Diary concepts.
- [Paper Dream, Seoul International Drama Awards](https://www.seouldrama.org/eng/theme/seoul/ajax/pop_exhibit.php?entryDataYear=&entryDataYear=2020&nationalCode=&num=2385&numIdx=3356&page=210&searchGenreType=&sfl=&stx=&submission2=&tt=2385): synopsis, writer, originating channel and festival episode record.
- [Dear Sahmi, PanArmenian TV](https://www.panarmenian.tv/programs/dear-sahmi/): premise and creative credits.
- [Summer of ’84, Kinodaran](https://kinodaran.com/en/title/summer_of_84_.html): premise, writing/production credits and platform episode record.
- [Taknuvra, Abril Books](https://abrilbooks.com/product/taknuvra/): 2024 edition, format, language, page count and ISBN.
