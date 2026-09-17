# Final link audit — 17 September 2026

## Scope and method

The published baseline was commit `2926fdb5f3a8362a7e9a22ec78f07ab9447333f7`. Read-only HTTP requests checked all 177 sitemap pages and 88 unique external destinations linked from the homepage, Books and Press pages. Requests used at most five concurrent workers. Page titles, final destinations and response status were reviewed; HTTP 200 alone was not treated as proof that a video was publicly playable.

The local export was rechecked after the final design/content build. It contains 177 canonical pages, 8,874 internal link/asset references and 114 distinct referenced assets. Every referenced local file exists and every linked HTML fragment has a matching target. This includes the localized book and literary-work anchors. CSS font/image references were included in the file checks.

## Results

| Check | Result |
| --- | --- |
| Published sitemap pages | 177 of 177 returned HTTP 200 |
| Published page canonical destinations | All matched the requested host and path after URL normalization |
| Published page main headings | Exactly one H1 on every page |
| Final local export links and assets | No missing files or fragment targets among 8,874 references |
| External HTTP responses | 79 HTTP 200, one HTTP 202, eight HTTP 403 |
| Confirmed unusable public watch link | One private Paper Dream video; verified public replacement found |
| More precise official project destination | White Shirt has a dedicated MONK3 page |

The 114 asset result is a local export integrity check, not a claim that 114 separate production asset HTTP requests completed. Production page HTML was fetched directly. A broader asset HEAD sweep was stopped when the remaining actionable external-link findings had been resolved for integration.

## Exact changes identified for integration

### Paper Dream: replace the private video

The existing [Paper Dream video](https://www.youtube.com/watch?v=iIn9qu4Phls) returns HTTP 200 but displays **Private video**. Its public player response reports `LOGIN_REQUIRED` and `Private video`; this is an unusable general-public watch destination, not an intermittent HTTP failure.

Use [SHANT TV Armenia’s public episode 1](https://www.youtube.com/watch?v=tqXaUXqvRu4). The destination returned HTTP 200; its title identifies Paper Dream, episode 1, and its publisher is **SHANT TV Armenia**. The public player reports `OK`. The new upload was found through the broadcaster’s public YouTube search results; it is a separate public upload, not an attempt to access the private recording.

Replace `iIn9qu4Phls` with `tqXaUXqvRu4` in:

- `lib/content.ts`: the Paper Dream watch URL.
- `scripts/seo-page-data.mjs`: the Paper Dream watch URL and its official-video source URL.

### White Shirt: link directly to the film

The existing [MONK3 films listing](https://www.monk3.com/films) contains White Shirt and is valid, but it also links to the more precise [White Shirt page](https://www.monk3.com/white-shirt). The direct page returned HTTP 200 with the title `Ճերմակ շապիկ | MONK3`.

Use the direct film page for White Shirt’s watch/project URL in `lib/content.ts` and `scripts/seo-page-data.mjs`, retaining any intentionally general studio references elsewhere.

## Access limitations, not confirmed broken links

- Eight NEWS.am STYLE article URLs returned HTTP 403 with the explicit Cloudflare page title `Attention Required! | Cloudflare`. Article IDs: 116068, 34291, 61739, 70076, 99861, 111686, 62779 and 99539. These are the previously verified publication URLs. The challenge is not evidence that the articles were deleted; no challenge bypass or speculative replacement was attempted.
- Instagram’s two profile URLs redirect to its login page while preserving the original destination in `next`. The anonymous response does not independently verify profile content.
- KinoPoisk redirects through Yandex SSO with the requested profile URL retained in `retpath`. IMDb returned HTTP 202 without a readable profile title. Okko returned HTTP 200 without a readable article body/title. These responses do not establish a dead link or a correct visible destination on their own.
- The [Library of Congress permalink](https://lccn.loc.gov/2010471647) returned HTTP 200 after redirecting to its new catalogue search for the same exact LCCN, `2010471647`. The stable permalink should remain; the record’s bibliographic facts were previously verified through the Library’s MARC record.

## Destination checks that passed

All 12 authored interview blog links returned the expected interview or author-blog titles. The Oragir, MediaHub, Armenian Museum of Moscow, ShantNews, Sputnik and Armenpress links led to their expected publications. The three Taknuvra bookseller product pages and Abril’s author catalogue led to the intended book/author. Armflix and Kinodaran project titles matched their linked works. The public YouTube links returned the expected series, episode, trailer or channel titles, apart from the private Paper Dream upload identified above.

The existing [SHANT Women’s Club video](https://www.youtube.com/watch?v=TanQYxqlKQ0) was specifically rechecked because its title foregrounds the cast. Its full publisher description explicitly describes the screenwriter and principal actors discussing the project’s creation and themes. The existing source note about the screenwriter’s participation is supported; no correction is required. Its public player also reports `OK`.

This audit verifies destinations at the time of inspection. It does not assert that third-party playback, login requirements, regional availability or publication URLs will remain unchanged indefinitely.
