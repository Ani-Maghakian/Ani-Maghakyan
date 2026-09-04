# Ani UI Repair v1

This package is built specifically against the `ani-ui-fix-source.txt` snapshot supplied on 2026-09-04.

It fixes:
- hero artwork clipping and makes the hero folder/card genuinely clickable;
- Selected Works poster cropping and inconsistent card media sizing;
- Paper Dream's interview destination;
- Hotel Grand season-source mismatch;
- Summer of ’84 source/thumbnail;
- English `OKI` -> `OKE`, `OKI 2` -> `OKE 2`, and `OKI: New Year’s Secret` -> `OKE: New Year’s Secret`;
- official/primary watch/project destinations for 45/47 archive entries;
- visible internal links to the six existing standalone SEO project pages;
- regression tests for the new behavior.

## Apply in Codespaces

From the repository root:

```bash
python ani-ui-repair-v1/apply.py
npm test
```

The installer verifies SHA-256 hashes before touching the four reviewed files. If any reviewed file changed after the snapshot, it stops rather than overwriting newer work.

Do not commit until `npm test` is green.
