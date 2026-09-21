# Maghakian Scripts rebrand

Primary direction: the supplied Maghakian Scripts wordmark and the approved writer-led studio brief. Existing project posters, portrait, all credits, literature and both categories of interviews are retained. Refero live research was unavailable (inactive subscription); the user's concrete reference and the bundled form/accessibility craft guidance were used.

Design commitments: charcoal canvas, ivory typography, restrained brass accents, original portrait beside the studio introduction, full uncropped project posters, numbered editorial service rows, square controls. Serif Armenian display type is locally hosted; existing Armenian-supporting UI fonts remain. No scroll-dependent image cropping, colour changes or large parallax.

## Source ownership

- `lib/studio.mjs`: shared localized brand copy, header, footer and route building.
- `components/portfolio-page.tsx`: studio homepage and existing archive content.
- `public/site-theme.css`: canonical visual system; `content-archive.css` extends it for books and press.
- `lib/inquiry.mjs` and `public/inquiry.js`: static-compatible project inquiry.
- `scripts/generate-seo-pages.mjs`: existing content pages plus six localized book detail URLs.
- `public/design-interactions.js`: shared menu behavior and lightweight scroll progress.

The six unused historical cinematic/mobile repair files were removed after confirming that neither the current layout nor the export loads them. They were not active production conflicts.

The uploaded JPEG is embedded unchanged in the SVG wordmarks. A luminance mask removes the white background at rendering time, and the viewBox removes only exterior whitespace. No tracing, replacement font or generative redraw is used. These are SVG wrappers around the supplied raster, not vector outlines. The two colors follow the brief. The Noto Serif Armenian fonts originate from Google Fonts and include their OFL license.

## Inquiry behavior

Only name, email, project type and description are required. Company, development stage, timeframe and budget are optional. Values stay in the page until the visitor explicitly opens their email app, copies or downloads the brief. There is no backend submission and no success message implying receipt. Review remains editable and exposes a plain email address as a fallback. Without JavaScript, the form stays hidden and the email contact remains accessible; personal data cannot accidentally become a GET query.

The existing export removes React hydration scripts. The inquiry therefore uses a dedicated, versioned static script. Do not replace it with an untested React-only event handler.

## URL and verification notes

All 177 prior sitemap URLs are retained. Six book detail URLs bring the sitemap to 183. Old `books/#slug` anchors still resolve. Organization and Person schema IDs remain stable; the homepage is now a WebPage about the studio rather than a personal ProfilePage. The dedicated founder page remains a ProfilePage.

Validation before deployment: 63 automated checks passed, including all sitemap URL/internal-link checks and localized inquiry validation, escaping and edit roundtrips. TypeScript and ESLint passed. Tests whose requirements changed were updated for the new hero, shared menu runtime, WebPage type and six additional book pages.

Physical iOS/Android testing and Lighthouse scoring are not claimed. Browser QA is recorded separately after deployment.
