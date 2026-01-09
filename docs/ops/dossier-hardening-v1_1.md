# Dossier/Factcheck Hardening v1.1

## Inventory (call sites)
- ensureDossierForStatement: `features/dossier/db.ts`, `apps/web/src/app/api/statements/route.ts`, `apps/web/src/app/api/factcheck/enqueue/route.ts`, `apps/web/src/app/api/finding/upsert/route.ts`, `apps/web/src/app/api/dossiers/by-statement/[statementId]/route.ts`, `apps/web/src/app/dossier/[dossierId]/page.tsx`, `scripts/backfill_dossiers_from_statements.ts`.
- refreshDossierCounts: `features/dossier/db.ts`, `features/dossier/seed.ts`, `apps/web/src/app/api/dossiers/[dossierId]/*/route.ts`, `apps/web/src/app/api/factcheck/enqueue/route.ts`, `apps/web/src/app/api/finding/upsert/route.ts`, `apps/web/src/app/dossier/[dossierId]/page.tsx`.
- dossier_findings / dossier_edges: `features/dossier/db.ts`, `apps/web/src/app/api/factcheck/enqueue/route.ts`, `apps/web/src/app/api/finding/upsert/route.ts`, `apps/web/src/app/api/dossiers/[dossierId]/graph/route.ts`.
- public exports/embed: `apps/web/src/app/api/dossiers/[dossierId]/export.json/route.ts`, `apps/web/src/app/api/dossiers/[dossierId]/export.csv/route.ts`, `apps/web/src/app/embed/dossier/[dossierId]/page.tsx`, `apps/web/src/middleware.ts`.

## Before / After Summary
- Findings uniqueness: previously unique `(dossierId, claimId)` and single `findingId`. Now allow parallel findings via `producedBy` with unique `(dossierId, claimId, producedBy)` and a migration script.
- Edge stale: previously verdict flips could leave conflicting rel edges. Now edges are archived (active=false) on verdict change and graph defaults to active edges only.
- Missing revisions: dossier creation and count updates now emit revision events (system_update).
- SERP ingestion: titles/snippets now clamped before upsert to avoid oversize/quote-unsafe data.
- Public access: export JSON/CSV and embed view are rate-limited; exports strip `authorRef.userId`.

## Risks / Notes
- Migration needed: run `scripts/migrate_findings_producedBy.ts` before enabling editor findings in prod to avoid unique index conflicts.
- Edge archival adds optional fields; legacy edges are treated as active unless `active=false`.
- Rate limit is in-memory; for multi-instance deployments, replace with shared store if needed.

## How to test (smoke)
1) Create a statement -> dossier is created and a revision entry exists ("Dossier erstellt.").
2) Run factcheck twice with different verdict -> old edges archived, graph shows only latest relation.
3) SERP source with huge snippet -> stored clamped (title/snippet lengths stay within limits).
4) Export JSON/CSV and embed -> repeated calls hit 429 rate limit.
5) Export JSON/CSV -> no `authorRef.userId` in outputs.
