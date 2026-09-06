# Visual, functional and SEO review — 6 September 2026

Reviewed the published cinematic redesign at `a9cbf926048be2f7136eb6bff5596cccbbef55f8`, then corrected its observable regressions while retaining the dark/ivory palette, serif headlines, editorial project sequence and supplied portrait.

## Findings and changes

| Published issue | Change and observed result |
| --- | --- |
| The mobile portrait occupied a zero-width implicit grid column. | Explicitly place portrait and copy in the single mobile column. The portrait now occupies 375 × 250 CSS pixels in the 390-pixel test frame. |
| The mobile dropdown was only 44 pixels wide; its links extended beyond the viewport. | Anchor the dropdown to the header. In the same test its panel is 351 pixels wide and every link stays within the 375-pixel document. Escape closes it. |
| Filmography titles inherited near-white text on an ivory background. Its introduction and search placeholder also retained light colors. | Give titles, descriptions, facts and controls explicit dark colors appropriate to the new background. |
| Large Armenian headings overlapped lines or split words unnecessarily. Mobile role labels were 10.56 pixels. | Use script-compatible line spacing and readable sizes; roles are now 14 pixels on mobile and body descriptions are 16 pixels. The decorative condensed font no longer carries labels or controls. |
| The collaboration action was hidden on mobile. | Restore the second action. The two actions end at approximately 498 and 556 pixels in the tested Armenian mobile document, inside its 844-pixel height. The primary work action opens the curated selection. |
| CSS forced failed featured images back into display, and an inner-page fallback could collapse. | Respect hidden failed images and reserve space for the text fallback. A deliberately unavailable poster triggers the fallback without collapsing the figure. |
| Scroll-linked entry animations reduced text opacity to 25%. | Keep text fully opaque and retain smaller positional movement; reduced-motion rules remain in place. |
| Inner pages and the homepage loaded different Latin/Cyrillic font families. | Use the same Noto Serif / Noto Sans families with Armenian counterparts. |

## Portrait limitation — original file still needed

Both supplied portrait files are incomplete. The 11,495-byte WebP declares a 11,542-byte RIFF container and fails a full decode. The 7,122-byte JPEG also fails a strict complete decode; Chrome displays its upper portrait area but the lower region is damaged/missing.

The site uses the JPEG directly and frames its available upper area at 3:2. This is a display workaround, **not restoration of the missing image data**. The full-resolution original IMG_3180 is required to finish the image quality work and validate complete decoding across browsers. Neither asset's bytes were synthesized, retouched or reconstructed. The invalid WebP is no longer selected or preloaded. Project pages with no artwork use the existing portfolio cover instead of a photograph of the author.

## Verification

- Fresh HTTP crawl of all 159 unique sitemap URLs: 159 HTTP 200 responses, unique titles, one H1 per page, self-canonicals, HY/EN/RU/x-default alternates, descriptions, parseable JSON-LD and no meta noindex. This is not a count of indexed pages.
- Browser review of the published desktop page and the corrected preview, including multilingual narrow iframes. Frames were 320, 360 and 390 pixels wide; scrollbar-adjusted document widths were 305, 345 and 375 pixels. This is responsive layout coverage, not physical-device or Safari testing.
- Verified mobile menu sizing and Escape, anchor navigation, Russian cross-language search for “Elen” (two results), clearing search, film filtering (two films), FAQ expansion, five persistent footer section links and inner-page navigation.
- Inspected Armenian collaboration, Russian Paper Dream and English books pages. Sampled documents had no horizontal overflow; headings and body text remained readable.
- `npm test`: production export and 13 test groups. Lint and TypeScript checks also pass; lint retains one existing Next custom-font warning for the Vite/Vinext layout.
- No field Core Web Vitals, PageSpeed/Lighthouse score, Search Console impressions/clicks or conversion analytics were available. No measured performance or ranking score is claimed.

## Expert assessment after these corrections

| Area | Score / 10 | Main remaining constraint |
| --- | --- | --- |
| Visual design / UI | 8 | Incomplete low-detail portrait and limited original project imagery. |
| UX | 8.5 | Long portfolio flow and an Instagram-only business contact path. |
| Tested functionality | 9 | Physical-device/browser coverage and full image validation remain limited. |
| Technical SEO | 8.5 | Good crawlable structure; portrait asset quality and real indexing/experience data still need verification. |

These are editorial audit judgments, not Google, Lighthouse or accessibility certification scores. Organic visibility itself is unscored because actual search data is unavailable.

## Most useful next steps for visibility

1. Supply the original portrait and approved high-quality artwork for priority projects.
2. Expand priority project pages with Ani's own production notes, precise credits and useful viewing information. The present catalogue still has many short factual entries.
3. Check sitemap acceptance and indexing in Search Console; compare clicks and impressions over comparable periods, separating name searches from project searches. Existing verification files do not prove account verification or sitemap acceptance.
4. Add the website to controlled professional profiles and obtain relevant editorial links through normal outreach. An approved public business email can improve the collaboration route.

Google explicitly states that first position and indexing are not guaranteed; useful original content and relevant discovery links matter beyond markup. See the [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). Contrast was reviewed against the principles in [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); actual experience metrics require separate measurement as described in [Web Vitals](https://web.dev/articles/vitals).
