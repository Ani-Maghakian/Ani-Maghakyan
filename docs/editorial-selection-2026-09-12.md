# Editorial selection and literary preview

This extends the glass-navigation proposal in PR #18. It is not a published redesign.

## Selection

`featuredRank` in `lib/content.ts` is the sole selection and ordering control. All twelve ranked projects render, including Dear Sahmi, Special Class, Forest Cottage, If I Danced Again and the newly selected White Shirt. No CSS position selector hides or curates projects. The Armenian title is corrected to the owner's supplied «Եթե ես կրկին պարեմ» in home and project-page data.

The grid uses three columns on desktop, two on medium screens, and one on phones. Covers preserve the entire image using `object-fit: contain`. The previous seven-project CSS layout has been removed, including its seventh-card color override in the static exporter.

## Supplied artwork integrated

All twelve selected projects now use owner-supplied local artwork. Nine image files were added from the new JPEG and three portfolio PDFs; the existing supplied Dear Sahmi, Blockade and Se.La.Vi originals are retained.

| Project | Source |
| --- | --- |
| White Shirt | IMG_5374.jpeg, unchanged, 2048 × 1152 |
| Hotel Grand | Portfolio(1).pdf, page 2; season 3 artwork, explicitly captioned |
| Paper Dream | Portfolio(1).pdf, page 4 |
| Elen’s Diary | Portfolio(1).pdf, page 8 |
| Special Class | Portfolio(1).pdf, page 22; season 2 artwork, explicitly captioned |
| Forest Cottage | Portfolio(1).pdf, page 24; supplied title artwork |
| Summer of ’84 | portfolio1.pdf, page 2, 751 × 1001 |
| If I Danced Again | portfolio1.pdf, page 20 |
| Addiction | Portfolio.pdf, page 9 |

PDF image streams were extracted at their embedded resolution, without cropping, redrawing or upscaling. `docs/poster-provenance.json` records source pages, dimensions, byte sizes and SHA-256 hashes. These are the images supplied in the PDFs; an extracted image is not claimed to be a higher-resolution production master.

Homepage cards and all three localized project pages use the same original-art registry and generated responsive WebP encodings. Original downloads stay available on project pages. No selected project uses an external thumbnail or text-only placeholder. Season-specific artwork has explicit localized captions. The PDFs' episode counts and historical dates do not overwrite existing project facts.

## Literary and mobile changes

- Three original Armenian excerpts appear with source links, Armenian language tags and translated reading links. No new quotations or translations are invented.
- HY / EN / RU remain in the glass mobile menu. Mobile headings can wrap instead of being forced onto one line; role labels and menu targets have readable sizes.
- Glass is limited to navigation and project-open affordances, with opaque fallbacks and reduced-transparency / increased-contrast handling.
- Static-export interactions now support cross-language search, clear-search focus restoration, empty results, filter state and broken-image fallback.

## Validation and remaining gate

Production export and 34 automated tests pass, including DOM interaction checks in HY / EN / RU. ESLint, TypeScript and diff checks are also run. DOM tests do not measure layout, font fit, contrast, touch behavior or Safari compatibility.

The cloud browser refused localhost/project-preview navigation, and its URL policy rejected an offline preview. No alternate browser or policy workaround was used. Visual QA at narrow phone, tablet and desktop widths remains required before publication, The requested poster gap is resolved. There is no claimed pixel-height reduction or live visual pass for this revision.
