# Maghakian Scripts SEO — 13 Nov 2026: production-safe execution runbook

## CRITICAL: DO NOT DEPLOY OLD GITHUB MAIN
Netlify currently publishes deployed build 6adefbbf934d96302f02b954 (verified via connected Netlify API).
Repository README describes 47 projects and 159 pages. Approved live Netlify release report describes 48 projects, 186 pages (62 per language). These are **different builds**.
Only edit a recovered, verified copy of approved Netlify source. Existing GitHub code must not overwrite production.

### Source integrity / rollback
- Original production deploy ZIP (named in Nov 11 release notes): deploy-6adefbbf934d96302f02b954.zip
- Original SHA-256: 2cecea13ce4500dcc8f094af98a471de9ca4cad08a7040765ebd8e631aa673e8
- Prepared but NOT published SEO ZIP: maghakian_scripts_seo_safe_2026-11-11.zip
- SEO patch SHA-256: cdc3612fe2f217724552f95dd1c8e17ead7fef02c0bfdc7f21cfe494f3498a42
- Recover actual archives (not just release notes). Compare archive hashes and static assets, then use a separate staging project.

## SEO baseline (GSC export: 2026-09-30–2026-11-10)
| KPI | Baseline |
|---|---:|
| Google clicks | 109 |
| Google impressions | 2,411 |
| Site CTR | 4.52% |
| Mobile clicks | 87 |
| Indexed URLs | 182 |
| Not indexed | 4 |
103 visible query rows sum to 35 clicks, not the full property volume. No valid Query × Page mapping was provided; do not claim keyword cannibalization from alternate-language URLs.

## Strategy
Primary = credible long-term professional author brand for Ani Maghakyan / Անի Մաղաքյան.
Secondary = qualified inquiries from producers/studios/broadcasters.
Tertiary = discovery traffic for relevant Armenian film and series titles.
Visitor journey: project -> verified screenwriter credit -> biography -> relevant service -> qualified inquiry.

## P0 pages and actions
- Home / + /en/ + /ru/: compare brand-first titles/meta while preserving exact design.
- About /about/ and translations: update only verified biography/credits and external evidence, align Person/ProfilePage semantics.
- /ru/projects/mi-gexecik-or/: test snippet and preserve official SHANT TV source; no speculative episode counts.
- /ru/projects/elens-diary/: season/episode query intent and explicit link to distinct /ru/projects/elens-diary-2/.
- /en/projects/sos-911/: disambiguate television series from unrelated emergency-number intent.
- /services/screenwriting/ and EN/RU equivalents: verified work examples, process, professional CTA, unchanged Unsolicited Materials Policy.
- Hold strong /ru/projects/elens-diary-2/ and /ru/projects/white-shirt/ snippets until testing evidence says otherwise.

## Required measurements
- Export GSC Query × Page for seven P0 URLs; inspect four excluded URLs.
- Implement/verify GA4 event lead_form_submit as key event, plus email_click, service_cta_click and instagram_click. Confirm in DebugView; qualified lead needs actual professional inquiry.
- Record URL, before title/meta, experiment hypothesis, publication date. Compare like-for-like 28-day windows after recrawl.
- Aspirational 90-day targets (NOT forecasts): 180–230 clicks and 3,500–4,500 impressions over a comparable 41-day window, plus 3–5 qualified B2B leads once measurement works.

## Release safety checklist
- [ ] Restore & checksum both Netlify ZIPs
- [ ] Diff 186 localized HTML pages, all fonts, posters, JS/CSS and Next RSC payloads
- [ ] Validate self-canonical / reciprocal hreflang, sitemap, robots, 404 and source attribution
- [ ] Verify form and legal Unsolicited Materials Policy
- [ ] Use separate Netlify staging, never production manual ZIP upload for preview
- [ ] Check mobile/desktop visuals across Home, About, projects, services, press, and inquiry
- [ ] Validate structured data and GA4 key events
- [ ] Publish only verified, approved candidate with rollback available

## Timeline
Week 1: GSC Query × Page, GA4, excluded URLs, source archive recovery.
Week 2: P0 title/meta review and template technical audit.
Week 3: verified authorship/press proof and internal links.
Week 4: staging QA and controlled launch.
Days 31–60: 8–12 high-intent project pages, true external references.
Days 61–90: measure authority/discovery/inquiry and expand only proven changes.

STATUS: documentation/preparation only. No live site changes are claimed.