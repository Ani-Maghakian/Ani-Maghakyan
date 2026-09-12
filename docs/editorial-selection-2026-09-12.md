# Editorial selection and literary preview

This extends the glass-navigation proposal in PR #18. It is not a published redesign.

## Selection

`featuredRank` in `lib/content.ts` is the sole selection and ordering control. All twelve ranked projects render, including Dear Sahmi, Special Class, Forest Cottage, If I Danced Again and the newly selected White Shirt. No CSS position selector hides or curates projects. The Armenian title is corrected to the owner's supplied «Եթե ես կրկին պարեմ» in home and project-page data.

The grid uses three columns on desktop, two on medium screens, and one on phones. Covers preserve the entire image using `object-fit: contain`. The previous seven-project CSS layout has been removed, including its seventh-card color override in the static exporter.

## Artwork required before publication

| Requested project | Available material | Action |
| --- | --- | --- |
| Սիրելի Սահմի | Owner-supplied `dear-sahmi-original.jpg`, 1920 × 1080 | Uses the original with responsive delivery encodings. |
| Հատուկ դասարան | `hatuk-dasaran.webp` visibly says season 2 | Request the intended original; selected card uses text temporarily. |
| Կհանդիպենք անտառի տնակում | `antarri-tnakum.webp` is a landscape title frame | Request the original poster; selected card uses text temporarily. |
| Եթե ես կրկին պարեմ | External VHX/Armflix preview URL; no owner-supplied original | Request the original; selected card uses text temporarily. |
| Ճերմակ շապիկ | No poster in repository | Request the original; selected card uses text temporarily. |

Other selected projects: Blockade and Se.La.Vi have supplied originals. Elen's Diary and Paper Dream have existing local WebP artwork; Addiction, Summer of '84 and Hotel Grand use existing YouTube previews. These five existing images have not been authenticated as original poster files. If every selected project requires an original, obtain those five originals as well. Existing images are not relabeled as originals.

`featuredArtworkReady: false` reserves a text cover without inventing art. Adding the correct supplied image to `originalProjectPosters` automatically takes precedence over that flag and supplies responsive encodings. No project is removed because artwork is missing.

## Literary and mobile changes

- Three original Armenian excerpts appear with source links, Armenian language tags and translated reading links. No new quotations or translations are invented.
- HY / EN / RU remain in the glass mobile menu. Mobile headings can wrap instead of being forced onto one line; role labels and menu targets have readable sizes.
- Glass is limited to navigation and project-open affordances, with opaque fallbacks and reduced-transparency / increased-contrast handling.
- Static-export interactions now support cross-language search, clear-search focus restoration, empty results, filter state and broken-image fallback.

## Validation and remaining gate

Production export and 34 automated tests pass, including DOM interaction checks in HY / EN / RU. ESLint, TypeScript and diff checks are also run. DOM tests do not measure layout, font fit, contrast, touch behavior or Safari compatibility.

The cloud browser refused localhost/project-preview navigation, and its URL policy rejected an offline preview. No alternate browser or policy workaround was used. Visual QA at narrow phone, tablet and desktop widths remains required before publication, along with the requested original posters. There is no claimed pixel-height reduction or live visual pass for this revision.
