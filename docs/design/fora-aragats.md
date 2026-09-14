# Fora-inspired Armenian landscape redesign

The approved direction applies to all 177 canonical pages: the three homepages, 47 project pages per language, six editorial hubs per language, and the services hub plus four services per language.

Visual reference: https://fora.so/ and its Blog and Contact pages, inspected 2026-09-13. Headings use Inter 400 at up to 56px; section headings use Inter 500 at up to 40px. Noto Sans Armenian covers Armenian glyphs. Fonts are served locally, with `font-display: swap`. Typography, dark surfaces, pale blush text, rounded controls, mobile navigation, poster frames and subtle entrance motion share `public/site-theme.css`.

The three landscape layers are original AI-generated concept assets inspired by Aragats, not documentary photographs or copied Fora assets. They were generated for this project and approved in the conversation. Transparent WebP assets preserve that approved preview. The mountain stays unobstructed initially; the author portrait follows the landscape. Native scroll drives bounded 0.62 / 0.24 layer travel and a 1–1.18 foreground scale. Reduced-motion preferences disable transforms. No scroll hijacking or looping animation.

Existing project descriptions, literary quotations, language routes, canonical URLs, structured data and supplied original posters are retained. The catalogue now also displays the available originals. All 12 featured projects remain content-selected and visible.

Validation: production-prefix build, 34 existing regression checks, TypeScript, and `node scripts/design-regression-check.mjs` covering all 177 canonical routes and the parallax behavior. A cloud browser cannot access this workspace's local preview, so automated DOM checks are not a substitute for final browser/device visual acceptance. The in-conversation preview is provided for that review.

The user approved publication on 2026-09-14, requesting the earlier translucent header. The sticky header now uses a 40% tinted background and 12px backdrop blur (including Safari), with the dusk sky extending beneath it on the homepage.
