# Mega Hardening Plan (Dossier/Factcheck)

## Scope
- No writes on GET: viewer/embed/export and dossier read endpoints.
- Quote-safe clamps for all source/finding ingestion paths.
- Findings: editor overrides via `producedBy` with effective selection.
- Edge cleanup on verdict change (archive stale edges).
- Public export/embed protections: rate limits + PII strip.
- Governance: revision hash-chain + verify endpoint + backfill script.

## Changes (high-level)
1) Read paths are write-free
- Viewer and `GET /api/dossiers/*` no longer call count refresh/upserts.
- `GET /api/dossiers/by-statement/[id]` no longer auto-creates dossiers.

2) Quote-safe everywhere
- Centralized limits in `features/dossier/limits.ts`.
- Clamps applied in:
  - SERP ingestion (`/api/factcheck/enqueue`)
  - finding upsert (`/api/finding/upsert`)
  - source upsert (`/api/dossiers/[id]/sources/upsert`)
  - suggestions validation uses same limits.

3) Findings + overrides
- Findings are unique per `(dossierId, claimId, producedBy)`.
- Effective selection: editor overrides pipeline.
- Editor upsert endpoint: `/api/dossiers/[id]/findings/upsert`.
- Admin UI loads raw findings (`?include=raw`) for full visibility.
- Shared helpers in `features/dossier/effective.ts` to avoid drift.

4) Graph consistency
- Verdict changes archive stale edges for finding→source pairs.
- Graph reads exclude archived edges by default.

5) Public surface protection
- Export JSON/CSV rate-limited.
- Embed rate-limited in middleware.
- authorRef.userId stripped from public outputs.
- Env flag `VOG_DISABLE_RATE_LIMIT=1` disables public rate limits.

6) Audit hardening
- Revisions include prevHash/hash/hashAlgo (sha256).
- Admin verify endpoint: `/api/admin/dossiers/[id]/verify-revisions`.
- Backfill script: `scripts/backfill_revision_hash_chain.ts`.
- Revision chain uses CAS updates via `dossiers.lastRevisionHash` to reduce race hazards.
- Env flag `VOG_DISABLE_REVISION_HASH_CHAIN=1` disables hash-chain writes.
- Verify endpoint returns `hash_chain_disabled` when the flag is set.

7) Counts consistency
- `findings` count uses the same effective selection as the API/UI (editor overrides).

## Scripts added
- `scripts/migrate_findings_producedBy.ts`
- `scripts/backfill_revision_hash_chain.ts`
- `scripts/cleanup_stale_edges.ts`
- `scripts/clamp_existing_sources.ts`

## Rollback Notes
- Rate limit:
  - Remove limits from export routes and middleware matcher for embed.
- Effective findings:
  - Switch viewer/API selection to raw findings order.
  - Ignore `producedBy` in selection.
- Hash chain:
  - Ignore verify endpoint or skip hash checks in admin tooling.
  - Do not run backfill script.
- No-writes on GET:
  - Restore `ensureDossierForStatement` in read paths if needed.

## Risks / Notes
- `GET /api/dossiers/by-statement/[id]` now returns 404 if dossier not created.
- Backfill scripts are idempotent but should be run in a controlled window.
- Legacy scripts/migrations cleanup not executed in this pass; only inventoried.
