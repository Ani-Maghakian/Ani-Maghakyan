# Project opinions — no Supabase or paid service

The owner's zero-spend instruction supersedes the earlier Supabase plan.
This implementation uses the existing public GitHub repository and static Pages
build. It does not create a database, subscribe to a service, install an app,
expose API credentials, schedule polling or add a workflow. The obsolete
Supabase implementation files are removed from this branch, not from Git history.

## Visitor journey and deliberate trade-offs

1. Discuss opens the project's own `#discussion` section.
2. A visitor writes a name/pseudonym and opinion on the website. They must
   acknowledge that GitHub publication is public, not a private moderation queue.
3. Prepare comment validates a local draft; it sends nothing and says so.
4. Continue on GitHub opens a new issue with the draft. The visitor needs a
   GitHub account and must click Create there. For long drafts the site supplies
   a complete copy/paste fallback instead of truncation or an oversized URL.
5. The owner reviews the issue. Only an explicitly approved static snapshot is
   committed to `data/project-opinions.json` and published by the existing build.
6. All HY/EN/RU versions show the same project thread. Approved replies have one
   level; additional reply chains and other-project references are rejected.

This is NOT anonymous on-site submission, a realtime chat or automatic
publication. The final submit happens on GitHub. The raw GitHub issue and account
are public even before site approval. These limitations are stated before the
form. Names/pseudonyms are not presented as verified identities.

A draft-ready message is never a receipt. There is no localStorage persistence,
third-party request on typing, token in browser code or visitor-text analytics.
Short prefill URLs carry draft text to GitHub and can remain in browser history;
users are told not to include personal information or unpublished scripts.
GitHub issues may notify repository subscribers according to their settings.

## Owner moderation

Review actual visitor submissions in the repository's Issues tab. Search titles
for `[site-opinion:`. A technical GitHub login or pseudonym is not evidence of
identity or a genuine client relationship. Check spam, abuse, unrelated content,
privacy and consent; do not reject a review simply because it is negative.

Obtain the actual issue JSON through an authorized GitHub read or the public
issue API. Do not invent an issue number or turn this document into a review.
After reading the complete source:

```sh
node scripts/approve-project-opinion.mjs issue.json --approve YOUR_GITHUB_LOGIN
```

The command validates the repository, project allow-list, issue title/body,
lengths, reply parent, timestamps and uniqueness. It records a SHA-256 of the
reviewed issue body and the reviewer/date, then writes a LOCAL JSON change only.
Review that diff, run the ordinary build/tests, commit and deploy to publish.
The source JSON file is an input, not executable code. No issue labels trigger
automatic publication. An edited GitHub issue never silently changes an already
approved website snapshot.

To reject an issue, do not import it; close or moderate it on GitHub as
appropriate. To remove a website opinion, remove the JSON record and its replies,
review, test, commit and deploy. GitHub's public source/history is separate:
removing the displayed snapshot is not a promise of erasure from Git history,
search caches or the original issue. Address those requests separately.

Business proposals remain private emails to the owner-approved
`maghaqyan@gmail.com`. Project viewing, book, source and language links are not
converted into mail links.

## Cost boundary

No Supabase, paid hosting, metered comment API, external widget installation or
paid browser-automation run is needed by this feature. The repository remains
public. Existing GitHub Pages and standard-runner workflows are unchanged.
GitHub service limits and existing account storage allowances still apply; this
is not a guarantee of unlimited usage or a billing audit of the whole account.
Do not upgrade runners, account plans or storage without the owner's permission.

## Tests and release

Local checks: pure Node validation/routing/moderation tests; apply integration to
an actual downloaded production artifact; compare canonical/hreflang/JSON-LD;
offline Chromium form behavior at 390 and 1440 pixels. Do not equate these with a
real visitor's authenticated GitHub submission or actual iPhone/Safari testing.

Release requires the ordinary GitHub lint, TypeScript, build and existing tests.
After deployment check the live project discussion section and email route.
Do not seed the public page with synthetic reviews. An authenticated visitor
submit and a real moderation cycle remain separate acceptance checks unless
actually executed and recorded.

## Rollback

Set `enabled` to false to stop new drafts while keeping approved opinions
readable, or revert the feature commit. Keep source snapshots for review; do not
silently delete opinions. Existing canonical URLs and site metadata remain
unchanged. The feature adds no automatic database migration or secret to revoke.

## Technical references checked 2026-09-17

- GitHub issue URL query: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue
- GitHub plans: https://docs.github.com/en/get-started/learning-about-github/githubs-plans
- Actions billing and standard/public runners: https://docs.github.com/en/billing/concepts/product-billing/github-actions

## September 17 release quality correction

The initial full run passed 56 tests but failed Lighthouse: the not-yet-prepared
handoff anchor had no href and the new CSS added a render-blocking request.
The idle link now has the real public issue-creation URL without draft text;
editing clears the prior draft and hides the handoff. The small scoped CSS is
inlined in generated HTML. All other links and metadata are preserved.

Performance acceptance is explicitly aligned to section 14 of the owner's
September 17 master brief: at least 90, median of three mobile-profile runs per
page. This replaces the prior all-runs 100 performance threshold; it must not be
reported as achieving 100. SEO, accessibility and best-practices retain the
100 worst-run gates, and CLS adds an explicit maximum of 0.1 on every run.
This is laboratory acceptance, not real-user Core Web Vitals certification.
