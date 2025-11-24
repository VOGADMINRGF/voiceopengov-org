# VoiceOpenGov / e-Debatte – Monorepo

Willkommen beim VOG / eDbtt Workspace. Dieses Repository enthält alle Apps (Next.js), Core-Packages, Features und Migrationstools für den E150-Standard.

## Schnellstart

1. **Voraussetzungen**
   - Node.js 20.x (LTS)
   - pnpm 10.17+ (`npm i -g pnpm@10.17.1`)
   - Docker (optional, für CI-Parität)
2. **Installation**

```bash
pnpm install --frozen-lockfile
pnpm run prisma:gen
pnpm --filter @vog/web run dev
```

3. **Qualitätssicherung**

```bash
pnpm run lint
pnpm run typecheck
pnpm --filter @vog/web run build
```

## Datenschutz & PII-Zonen

Der Umgang mit personenbezogenen Daten wird in `docs/PII_ZONES_E150.md` beschrieben. Wichtige Punkte:

- PII darf ausschließlich in ausgewiesenen Modulen verarbeitet werden (`core/pii/**`, Auth-/Identity-APIs, dedizierte DB-Verbindungen).
- Logger (core + apps) nutzen gemeinsame Redaktionspfade (`@core/pii/redact`). Für manuelle Logs stehen `safeUserSummary`, `logSafeUser`, `maskEmail` u. a. bereit.
- Features/UI/Telemetry erhalten **nur** IDs, Masken oder Aggregationen.

## Orphan-Scanner (VPM25-Aufräumen)

Ein CLI-Report hilft beim Identifizieren ungenutzter Features/Routen:

```bash
pnpm exec tsx scripts/orphan-scanner.mts
```

Das Script durchsucht alle `features/*`-Module nach Imports (`@features/<name>`) und listet deaktivierte Routen (`_disabled`, `legacy`, `deprecated`). Ergebnisse können in `ORPHAN_FEATURES_VPM25.md` dokumentiert werden.

## Admin-Dashboards

- **Identity Funnel** – `/admin/identity`
  - Aggregierte Zahlen zu Registrierung, E-Mail-Verifikation, Onboarding und 2FA (PII-frei).
- **AI Telemetry** – `/admin/telemetry/ai/dashboard`
  - Zeigt Provider-Health, Erfolgsquoten, Durchschnittslaufzeiten sowie die letzten Orchestrator-Events.
- **AI Orchestrator Smoke** – `/admin/telemetry/ai/orchestrator`
  - Manuelle Provider-Checks (bestehende Ansicht).

Alle Admin-Routen prüfen `u_role=admin` via Cookies; API-Endpunkte liegen unter `apps/web/src/app/api/admin/**`.

## CI / Automatisierung

- Hauptpipeline: `.github/workflows/e150-ci.yml`
  - Läuft auf Node 20 + pnpm 10, installiert Abhängigkeiten via `pnpm install --frozen-lockfile`.
  - Schritte: Prisma-Setup, Typecheck, Lint, optionale Unit-Tests (`test:ci`), Web-Build, Semgrep, Gitleaks, Docker Build + Trivy, ZAP Baseline.
- Lokale Mirror-Befehle:
  - `pnpm run build` (UI + Web)
  - `pnpm --filter @vog/web run build`

## Nützliche Scripts

- `pnpm dev:web` – Next.js Dev-Server
- `pnpm build:web` – Production-Build
- `pnpm lint:clean` – automatische Lint-Fixes (Repo-weit)
- `pnpm tc:web` – TypeScript Check für Web-App

Weitere Details findest du in den jeweiligen Feature-/Package-READMEs sowie in `tools/codex/e150_master_codex_briefing.ts`.
