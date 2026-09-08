# Service-intent SEO implementation — 8 September 2026

## What changed

Applied the website-relevant parts of the owner-supplied local SEO article to the existing Ani Maghakyan portfolio. This is an on-page implementation, not a claim of higher rankings or a completed Google Maps campaign.

- Reworked the four service pages and their hub in HY, EN and RU: 15 existing URLs, no URL migration.
- Made each service H1 describe the actual work; shortened all 15 titles and descriptions and removed mixed-language filler from Armenian and Russian copy.
- Added scope, deliverables, working stages, realistic fee/timeline explanations and a first-inquiry checklist.
- Added visible, crawlable links from all three home and contact pages directly to the four services.
- Linked four relevant project pages back to their matching services in all three languages. Related-service links help readers choose the next stage.
- Limited the examples used to support showrunning and creative production to **Summer of ’84**, where those specific roles are documented in the existing project record. Did not silently assign those roles to other projects.
- Preserved the 47-project archive, posters, literary material, URLs, author identity and three-language structure.
- Kept FAQ text and its schema in sync; explicitly linked each Service node to its WebPage.
- Added five regression tests covering service metadata, actual content, inquiry instructions, reciprocal links and all 177 canonical language variants.

The five service page concepts, home, contact and four project pages produce 33 localized pages with changed content or links. The site still has 177 canonical pages; creating more pages is not itself the objective.

## Mapping the supplied method to this release

| Article section | Applied decision | Status |
| --- | --- | --- |
| 1. GBP categories | No verified business-profile URL, eligibility details or category audit available. Do not guess categories from a portfolio. | Owner input needed |
| 2. GBP attributes | Do not invent office accessibility, hours, location or appointment attributes. | Not changed |
| 3. Competitor reviews | No review or ranking dataset was obtained. No reviews, ratings or keyword scripts for customers were fabricated. | Data unavailable |
| 4. Review replies | No third-party replies or messages sent. | Outside repository change |
| 5. GBP posts | No profile posts published or posting cadence asserted as a ranking factor. | Outside repository change |
| 6. Service descriptions | Rewrote the existing website services and made their boundaries and deliverables explicit. GBP synchronization requires the actual profile. | Website implemented |
| 7. Business description | Clarified the service hub and search snippets without inventing local claims. | Website implemented |
| 8. Photos | Preserved the supplied portrait and project posters. Did not add false geotags or promise ranking gains from metadata. | Assets preserved |
| 9. Keyword gap | Created an editorial intent-to-URL map below. This is not measured competitor volume or keyword difficulty. | Mapping implemented; metrics unavailable |
| 10. Money pages | Improved existing service and contact pages, their H1s, descriptions, content and contextual incoming links. | Implemented |
| 11. Service + city pages | Kept one substantive page per real service. No city-cloned pages, invented offices, fake testimonials or same-day promises. | Adapted to this business |
| 12. GSC analysis | Search Console was not connected through the available analytics connector; Ahrefs returned “Insufficient plan.” No positions, CTR, clicks or impressions were inferred. | Access/export needed |

## Editorial search-intent map

These are content targets, not measured ranking terms. Armenian is at the root; English uses `/en/`, Russian `/ru/`. Preserve existing slugs to avoid splitting the same intent across duplicate pages.

| Existing path, after locale prefix | HY intent | EN intent | RU intent |
| --- | --- | --- | --- |
| `services/` | սցենարային ծառայություններ | screenwriting services | сценарные услуги |
| `services/screenwriting/` | ֆիլմերի և սերիալների սցենարի մշակում | film and TV screenwriting | сценарии для кино и сериалов |
| `services/story-development/` | պատմության և սերիալի գաղափարի մշակում | story development for film and series | разработка истории и концепции сериала |
| `services/showrunning/` | շոուռանինգ, սերիալի ղեկավարում | showrunning, series development | шоураннинг, разработка сериала |
| `services/creative-production/` | ստեղծագործական պրոդյուսինգ | creative production for film and TV | креативное продюсирование |

The home page serves identity/biography/filmography discovery; `work-with-ani/` serves the contact action. Neither replaces the detailed service URLs. Project pages remain about the works and their credits, with relevant service links placed after the project information.

## Measurement still required

Request a Search Console export for the exact `https://ani-maghakian.github.io/Ani-Maghakyan/` property and a consistent 90-day date range. Include queries, pages, clicks, impressions, CTR and average position; record country, device and search-type filters. For query-to-page analysis, use query + page data, or filter a query and export its Pages tab. Separate top-level Queries and Pages exports do not establish which query ranked on which page.

Then prioritize observed opportunities, not invented estimates:

1. Relevant service queries with impressions and positions 4–20: check the landing page against the intended service.
2. High-impression, low-CTR rows: inspect the actual result and intent before attributing the problem solely to a title or description.
3. The same query appearing on multiple URLs: review whether the pages meet different needs before calling it cannibalization.
4. Pages with no performance rows: inspect indexing and coverage; absence from an export is not proof of zero demand or zero indexing.
5. Compare equal reporting windows after recrawling, segmented by language and brand/non-brand. Track qualified inquiries separately from contact-link clicks.

Existing `data-track` attributes are hooks only; this release does not install analytics, transmit visitor data or claim that contact events are being collected.

## Policy and evidence guardrails

Unique, useful titles, descriptions and descriptive internal links follow [Google's SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). The 60/155-character budgets in tests are editorial targets, not Google ranking thresholds or a guarantee that snippets will display unchanged. No arbitrary minimum word count was imposed.

Avoiding near-identical city pages and keyword repetition follows [Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies). A future location page needs real distinct information and owner-confirmed facts. A Business Profile must represent an eligible, real business under [Google's business representation guidelines](https://support.google.com/business/answer/3038177).

Reciprocal, same-intent language alternates follow [Google's localized-page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).

The visible FAQs help prospective clients. Existing FAQPage markup is retained as machine-readable content, **not** a promised search-result enhancement: Google [deprecated FAQ rich results from 7 May 2026](https://developers.google.com/search/updates#may-2026). That update log also clarifies that `llms.txt` does not improve Google visibility or rankings. No such benefit is claimed here.

## Verification and publication

- Local production export: 177 canonical pages.
- `npm test`: 31 tests passed, including sitemap, internal-link and language checks.
- `npm run lint` and `npx tsc --noEmit`: passed.
- The GitHub Pages base-path export is checked in addition to the root-path tests.
- A local Browser preview was attempted but the browser returned `ERR_BLOCKED_BY_CLIENT` for the loopback URL. Do not count that attempt as a completed visual check. The existing GitHub Lighthouse workflow supplies independent rendered-page audits.
- The existing PR verification and Pages deployment workflows remain in place; no checks or protections were weakened.
- Successful deployment, crawling and indexing are separate events. The existing post-deploy verification checks URLs; IndexNow acceptance is not proof of indexing. This release does not guarantee first place or a “10/10” search outcome.

See the pull request and its Actions runs for the final CI and deployment result.
