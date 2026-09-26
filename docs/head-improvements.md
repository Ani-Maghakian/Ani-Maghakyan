# HEAD metadata improvements

Reference: https://github.com/joshbuchea/HEAD

The live homepage linked its manifest at the domain root, outside the GitHub
Pages project path. Inner pages lacked the homepage's browser theme settings,
manifest and alternate Open Graph locales. Only an SVG favicon was supplied.

The final static export now applies shared HEAD essentials after every page
producer has finished:

- Charset, viewport and title appear first; zoom remains enabled.
- Manifest and icon URLs stay inside the canonical site's project path.
- PNG favicon, 180px Apple touch icon, and 192px/512px manifest icons are
  generated from the existing custom SVG mark, without changing the artwork.
- Manifest identity, scope and dark colors match the studio; browser display
  retains normal navigation for this portfolio rather than implying an app.
- Every content page has consistent dark browser colors and referrer policy.
- Open Graph alternate locales and X image alternative text are completed.
- Existing per-page titles, descriptions, canonical/hreflang URLs, social
  pictures, verification files and structured data are retained.

`tests/head.test.mjs` checks every sitemap URL and resolves every icon/manifest
link to a real exported file, including project-path containment and PNG sizes.
Run it after `npm run build`. The existing deployment test gate includes it.

HEAD is a menu of context-dependent elements, not a list to copy wholesale.
No obsolete keywords, invented verification tokens, app-store IDs, blanket
preloads, or restrictive CSP meta tag have been added. Search rankings are
not implied by these technical fixes.
