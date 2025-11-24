# Orphan-Features & -Routen – VPM25 ➜ eDbtt

Dieser Report ergänzt die Migration-Notizen unter `tools/migration/VPM25/*` und listet Module, die aktuell nicht mehr von der neuen E150-Codebasis verwendet werden. Die Analyse erfolgt automatisiert über `scripts/orphan-scanner.mts`.

## Nutzung des Scanners

```bash
pnpm exec tsx scripts/orphan-scanner.mts
```

Ausgabe: JSON mit allen Features (unter `features/*`) und Routen (Dateien `page.ts(x)` / `route.ts(x)`), die als potenziell verwaist gelten. Die Heuristik ist bewusst konservativ:

- **Feature-Module** gelten als Orphan, wenn kein Import der Form `@features/<name>` außerhalb des eigenen Ordners gefunden wird.
- **Routen** werden markiert, wenn ihr Pfad `_disabled`, `legacy` oder `deprecated` enthält bzw. wenn sie unter `apps/web/src/_disabled` liegen.

> **Wichtig:** Der Report ist ein Startpunkt für Reviews. Bevor ein Modul gelöscht wird, bitte manuell prüfen, ob es noch über Dynamic Imports, CMS-Referenzen oder Cronjobs erreicht wird.

## Aktuelle Kandidaten (Auszug)

| Typ | Pfad (Beispiel) | Status | Kommentar |
| --- | --- | --- | --- |
| Feature | `features/<name>` | orphan? | Wird nur gelistet, wenn kein `@features/<name>`-Import außerhalb des Ordners existiert. |
| Route | `apps/web/src/_disabled/.../page.tsx` | deaktiviert | Liegt explizit unter `_disabled`, bleibt bis zur finalen Entfernung isoliert. |
| Route | `apps/web/src/app/(legacy)/demo/page.tsx` | legacy | Enthält den String `legacy` oder `deprecated` im Pfad und ist nicht mehr verlinkt. |

Die vollständige Liste ist im JSON-Output des Scripts enthalten und kann für Housekeeping-Tasks (z.B. Lösch-PRs) verwendet werden.

## Workflow-Empfehlung

1. `pnpm exec tsx scripts/orphan-scanner.mts` ausführen und JSON-Ergebnis speichern (z.B. `tmp/orphans.json`).
2. Kandidaten triagieren:
   - **safe to delete** – keine Referenzen, keine historischen Abhängigkeiten.
   - **needs review** – unklar, ob per Dynamic Import genutzt.
   - **keep (documented)** – bewusst deaktiviert, bleibt bis zu einem späteren Milestone.
3. Ergebnisse in diesem Dokument ergänzen (Abschnitt „Aktuelle Kandidaten“) und im jeweiligen Team-Standup kommunizieren.

## TODO / Follow-ups

- Ergänzung weiterer Heuristiken (z.B. Analyse von Next.js `generateStaticParams`, Cron-Skripts).
- Automatisierte Ausgabe als Markdown (z.B. für CI-Kommentare).
- Entfernen der gekennzeichneten `_disabled`-Routen nach Abschluss der jeweiligen Teilprojekte.
