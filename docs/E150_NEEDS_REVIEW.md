# E150_NEEDS_REVIEW

Diese Datei sammelt Stellen im Code, an denen weiterer Feinschliff oder E150-Hardening sinnvoll wäre.

## Potenzielle Baustellen

- [ ] `apps/web/src/app/api/admin/identity/funnel/route.ts` – nutzt direkte `getCol("users")`-Zählungen; sollte auf Telemetrie/PII-Helfer umgestellt oder klar abgegrenzt werden.
- [ ] `features/ai/orchestratorE150.ts` – komplexe Provider-Matrix ohne explizite Error-Budgets/Retry-Strategie; brauchbare Monitoring-Hooks und Grenzwerte fehlen.
- [ ] `scripts/vog_apply_civic_search_v2.sh` – TODO für echten Endpoint/Schema, derzeit nur Platzhalteraufruf.
- [ ] `scripts/wire_vog_pipeline.sh` und `scripts/apply_vog_ux_pipeline.sh` – enthalten TODO-Kommentare für DB-Speicherung/Factcheck-Queue, wirken unvollständig.
- [ ] `scripts/fix_v1_landingeDbtt.sh` – beinhaltet `TODOPage`-Stub, vermutlich Legacy-Testcode.
- [ ] `scripts/hotfix_run.sh` – React-Formular mit `/* TODO */`-Handler; unklarer Zweck, sollte entweder entfernt oder fertiggestellt werden.

## Hinweise für nächste Codex-Runs

- Fokus auf Bereinigung alter Migration-/Hotfix-Skripte unter `scripts/` (Platzhalter entfernen oder dokumentieren).
- Identity-Pipeline weiter harmonisieren: Telemetrie-basierte Auswertungen bevorzugen, direkte DB-Zugriffe in Admin-APIs prüfen.
- KI-Orchestrator E150 mit klaren Limits/Observability versehen (z.B. Timeout- und Fehlerquoten-Monitoring, Region-Filter in Dashboards ergänzen).
