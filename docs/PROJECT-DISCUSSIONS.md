# Project discussions and business email

Implementation prepared on 2026-09-17 against commit
`dafae459000823f516ce5bcbd168e484f8393601` in
`Ani-Maghakian/Ani-Maghakyan`.

## Status and scope

This is a feature implementation awaiting backend connection and acceptance, not
confirmation of live comments. The public site's deployment has not been changed.
Supabase was not connected when this version was prepared. No Supabase project,
paid subscription, database migration, or real visitor comment was created.
`project-discussions.config.json` deliberately ships with `enabled: false`.

The owner approved the public business address `maghaqyan@gmail.com`. Business
proposal actions use that address. A project's Discuss action instead points to
its own `#discussion` section. Source/viewing/book/social-profile links and
language navigation retain their existing destinations.

The implementation adds one discussion per project slug across HY/EN/RU, names
or pseudonyms without visitor accounts, plain-text comments, a consent checkbox,
premoderation, and one level of replies. It does not add star ratings, fabricated
reviews, marketing consent, uploads, or a public administrative interface.

## Files and build integration

`npm run build` retains the existing build pipeline and appends
`node scripts/integrate-project-discussions.mjs` after export optimization.
The adapter reads the already generated HTML, changes the known contact/discuss
anchor shapes, and adds scoped assets and the comment section. Existing inline
scripts, canonical, hreflang and JSON-LD remain unchanged.

This adapter keeps the existing framework, project URLs, design assets and
workflow files intact. It is intentionally narrow: if upstream CTA markup or
translations change, update the adapter's fixtures and tests. It does not attempt
an unrestricted site-wide replacement of every link containing "contact".

The browser uses only the public Edge Function endpoint. It receives no service
key, secret key or database credentials. Visitor text is rendered using
`textContent`, is not placed in URLs, and is not retained in localStorage or sent
by this feature to analytics.

## Backend activation checklist

1. Connect the owner's Supabase account and identify the intended owner-controlled
   project. Do not create a paid plan or migrate an unrelated application.
2. Inspect existing schema for naming conflicts. Apply
   `supabase/migrations/202609170001_project_discussions.sql` in a development
   environment first. The migration is transactional and intentionally fails on
   conflicting existing objects instead of overwriting them.
3. Populate the allow-list from the site's authoritative data:
   `node scripts/generate-discussion-seed.mjs > discussion-seed.sql`.
   Review and execute that SQL in the same project. The provided seed snapshot
   contains the 47 slugs from the pinned production artifact; regenerate it if
   source projects change. New projects must be explicitly added to this list.
4. Deploy `supabase/functions/project-discussions`. Its `verify_jwt = false`
   setting is intentional because guest comments do not require sign-in. It is
   NOT an administrative endpoint. Direct table access and direct RPC execution
   are revoked from `anon`, `authenticated` and `PUBLIC`.
5. Configure server-only environment variables securely in Supabase, never in
   chat or the public repository:
   - Standard platform `SUPABASE_URL` and service-role/secret credentials.
   - `DISCUSSION_ALLOWED_ORIGINS=https://ani-maghakian.github.io` (add only
     explicitly approved preview origins).
   - `DISCUSSION_TRUSTED_IP_HEADER`: set only after verifying which client-IP
     header the deployed gateway overwrites. Do not assume arbitrary forwarded
     headers are trustworthy. A missing header makes writes fail closed.
   - `DISCUSSION_SUBMISSIONS_READY=true` only for the configured/tested backend.
6. Run the live acceptance tests below. Review privacy/retention language against
   the actual deployed provider, region and administration process. This document
   does not certify legal compliance.
7. Set the actual HTTPS function endpoint in `project-discussions.config.json`.
   Enable submissions there only after acceptance, then merge and publish using
   the existing site workflow. Verify the public version again.

Supabase CLI deployments should use the owner's authenticated CLI/session. Do
not paste project secrets into a command stored in Git, an issue or a PR. The
site's existing GitHub workflow does not need a service-role secret.

## Moderation and operation

In the owner's Supabase dashboard, open `public.discussion_comments` and filter
`status = pending`, ordered by `created_at`. Approve by changing status to
`approved`; the trigger sets `published_at`. Reject by setting `rejected`.
Deleting a comment also deletes its replies. Withdrawing an approved root sends
its approved replies back to pending, preventing replies from leaking after the
root is hidden and requiring explicit reapproval after restoration.

Only trusted project administrators get dashboard access. Prefer separate
administrator accounts and MFA. Visitors cannot call an approve/delete endpoint;
none is exposed by this feature. Supabase dashboard users can edit data, so
review project roles before activation. Negative opinions are not spam merely
because they are negative.

`discussion_moderation_log` records changes without copying comment text into the
log. It records the authenticated database identity where available, otherwise
the database session role; that fallback is not proof of which human clicked.

Rate limits are enforced transactionally in SQL: at most five accepted writes
per client hash per ten-minute bucket and 100 globally per hour. A pending queue
cap adds a further bound. Idempotent retries use a UUID and server-HMAC digest.
The raw client-IP header is not stored in these tables; expiring keyed hashes
are used for rate limiting. Provider infrastructure logs have their own policies.
These measures reduce abuse; they are not a guarantee against all spam or DoS.

Review the queue routinely. Document retention with the owner before launch.
Delete rejected comments after the agreed retention period and honor removal
requests through the published email. Rate-limit rows are removed on subsequent
writes after expiry; set up a scheduled purge in the owner's Supabase project if
strict wall-clock removal is required. Approved comments and moderation logs do
not have automatic expiry in this version. No email notifications were enabled.

## Live acceptance still required

- Apply migration and seed; verify they execute successfully on actual PostgreSQL.
- An anonymous browser can submit a root and receives HTTP 202 only after storage.
- A second anonymous browser cannot read pending/rejected content, including via
  direct Data API queries and direct RPC calls.
- The owner approves in the dashboard; a fresh browser sees the same comment on
  HY, EN and RU pages. Reload confirms database persistence.
- A reply attaches to an approved root in the same project; cross-project,
  hidden-parent and nested replies are rejected.
- Withdraw the root; replies disappear publicly. Delete the root; replies cannot
  be fetched. Check the moderation log.
- Attempt to submit `status=approved`, HTML-like text, an oversized body, duplicate
  retries and excessive requests. Verify permissions, text-only rendering,
  idempotency and rate limiting against the real backend.
- Verify the trusted client-IP header cannot be chosen by the visitor.
- Confirm failed writes leave the visitor's text in the form; no false success.
- Test the full production CSS, keyboard flow, Safari/iPhone and Android, plus
  mail links/copy fallback in configured and unconfigured email-client scenarios.
- Verify GitHub CI, public deployment, rollback and owner access.

## Checks actually performed for this implementation

- Fourteen Node tests passed: identity/routing/localization, inactive-state safety,
  config validation, input validation, pending-only responses, shared project
  reads, missing configuration, invalid origins, oversized requests, backend
  error handling, rate-limit response, cursor validation and migration permission
  declarations. Database calls were mocked; the migration check was structural.
- The adapter ran on a downloaded artifact of the pinned production deployment:
  177 canonical pages, including 141 localized project pages. Canonical links,
  hreflang and JSON-LD were compared before/after and preserved on all 177.
- Six offline Chromium DOM scenarios passed using actual generated page markup:
  queued-not-public submission, plain-text rendering of HTML-like input, reply
  parent association, 503/429 text preservation, isolated component width and no
  JavaScript errors. API responses were mocked in memory, not stored in Supabase.
- A normal browser test against a local HTTP server was blocked by the environment
  (`ERR_BLOCKED_BY_ADMINISTRATOR`). No network-policy bypass was attempted. The
  offline DOM tests are not a substitute for full-site browser or device QA.

Do not describe these checks as completed live persistence, real-device testing,
full-site accessibility acceptance, or final release approval.

## Rollback

Set `enabled` to false and rebuild to stop rendering submission forms. To undo
this feature entirely, revert its commit and redeploy the previous site version.
Do not drop database tables as part of a code rollback. First export and protect
existing comments; deletion of stored visitor data requires a separate decision.

## Primary references checked 2026-09-17

- https://supabase.com/docs/guides/functions/auth
- https://supabase.com/docs/guides/functions/auth-headers
- https://supabase.com/docs/guides/functions/secrets
- https://supabase.com/docs/guides/database/secure-data
