# Final portfolio refinement — 17 September 2026

## Brief and reference lock

Polish the existing three-language author and screenwriter portfolio for readers,
viewers and potential collaborators. Direct implementation is authorized by the
owner. The existing live design is the primary reference: mountain scene,
near-black canvas, pale text, original posters, restrained glass controls and the
approved two-line Armenian hero. Preserve the current Inter/Noto Sans Armenian
pair and all original artwork.

Refero live reference searches returned `NO_SUBSCRIPTION`. The audit therefore
uses actual live screenshots and Refero's bundled Typography and Craft Details
references, plus JASHAK's source-fidelity and evidence rules. No unseen external
reference is claimed as inspected.

| Decision | Evidence / rule | Purpose |
| --- | --- | --- |
| Keep the existing visual system and hero | Owner's earlier explicit hero correction; live homepage | Preserve the site's recognizable character |
| Put the covered, newer book first | Live Books screenshot begins with a long text-only block | Give the real book cover a clear visual role |
| Give Books and Interviews direct homepage navigation | New content previously requires deep scrolling | Make the expanded archive easy to find |
| Replace the large homepage source directory with three representative press items and compact source links | Live homepage is over 14,000 pixels tall | Show useful material before sending visitors to the full archive |
| Search all 29 archive items without removing server-rendered content | Craft Details: labels, keyboard behavior, progressive enhancement | Support readers who know a guest, title or outlet |
| Move inner-page header outside the narrow content shell | Live Books page has an 8-pixel horizontal overflow | Fit the navigation to the available viewport |
| Use existing 16px body type and clear metadata hierarchy | Refero Typography: readable measure, leading and contrast | Improve Armenian and multilingual reading |
| Add accurate sharing image metadata | Verified book cover and original project image dimensions | Present relevant link previews on social platforms |

No fake book cover, invented quotations, paid promotion, ranking guarantees or
unrequested social posts are part of this refinement.

## Validation

- Production application build and all static generators completed. All 41
  automated checks pass, including cross-language archive search, no-JavaScript
  access, matching Book schema/order and shared-asset cache versions.
- Lint, TypeScript and whitespace checks pass. The design regression check covers
  all 177 canonical pages, original poster framing and reduced-motion behavior.
- Browser review used the real exported HTML in a local responsive iframe at
  320, 375, 390, 768 and 1280 pixel frame widths. This is responsive browser QA,
  not a claim of physical-device testing. Armenian/English homepage headings,
  narrow-screen navigation, Armenian/Russian archive search presentation,
  Russian mobile Books and English tablet Books were inspected. The full-width
  Armenian homepage Books and Press sections were also visually inspected.
- The original horizontal header overhang was absent in checked new pages.
  Measured scroll width matched content width at 305, 360 and 1265 CSS pixels.
- A cross-language `Sarukhan` search on the Armenian archive returned the correct
  single item. Automated checks cover clear/focus, no-results and category restore.
- Text illumination retains its opacity effect without shifting headings into
  adjacent paragraphs. Footer brand/roles and literary-card actions have explicit
  spacing/alignment.
- A private Paper Dream video was replaced with a verified official public
  episode; White Shirt now links to its precise official film page. Full HTTP
  findings and access limitations are in the companion link audit.
- Changes to shared CSS/JS get a content-derived query version, avoiding stale
  layout or behavior immediately after deployment. Canonical URLs stay unchanged.

The first book's real cover remains unavailable. Its text presentation is
intentional and does not imply that a substitute cover is authentic. Search
rankings and third-party availability are not guaranteed by these checks.

## Publication and search notifications

The website refinement was published as `eb18b10749b5fc3c740db6ee3b180fdab5b0184c`.
GitHub Pages run `35208918003` passed both build and live verification. The live
homepage retains the approved Armenian heading, two book cards and three Press
previews; the live archive has all 29 items and working search/clear controls.

The release's global IndexNow notifications returned HTTP 200: the home submission
and all 174 localized inner pages. The duplicate direct Yandex submission returned
422. Following the [official IndexNow FAQ](https://www.indexnow.org/faq), which
specifies that one participating endpoint shares notifications across the network,
the redundant per-engine call was removed. This does not assert that any individual
search engine has indexed every submitted URL.
