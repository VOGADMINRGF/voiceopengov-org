# E150 Master Spec – Part 15: Offene Pfade & Restarbeiten

## Zweck

Dieses Dokument bündelt, welche Pfade (Part00–Part15) noch offen sind und welche Bestandteile erledigt werden müssen. Es verweist auf die Blöcke aus Part14, damit der nächste Run gezielt die Lücken schließen kann.

## Status-Übersicht der Pfade 00–15

- **Part00 Foundations / PII:** Fundament steht, weiter nichts offen, aber PII-Guardrails stets einhalten (siehe `docs/PII_ZONES_E150.md`).
- **Part01 Systemvision / Governance:** Leitplanken definiert, aktuell keine Umsetzungsaufgabe.
- **Part02 Rollen / XP / Gamification:** XP-Anbindung benötigt noch Research-/Streams-/Campaign-Hooks (siehe Blöcke E, F, G).
- **Part03 Access Tiers & Pricing:** Grundlogik aktiv; Folgeaufgaben nur, wenn weitere Produkte/Discounts hinzukommen.
- **Part04 B2G/B2B Modelle:** Warten auf Campaigns/Streams-Implementierung (Block F/G) für echten Pilotbetrieb.
- **Part05 Orchestrator (Block A):** Gemini-Provider, rollenspezifische Prompts und Health/Score fehlen noch.
- **Part06 Consequences (Block B):** Modelle, Persistenz und UI (Responsibility Navigator) stehen aus.
- **Part07 Graph & Reports (Block C):** Zentrale Graph-Schicht und Report-Adapter fehlen; AnalyzeResult-Sync offen.
- **Part08 Eventualities (Block D):** Eventuality-/DecisionTree-Typen, Analyzer-Prompts, Persistenz und UI fehlen.
- **Part09 Research Workflow (Block E/R2):** Tasks/Contributions vorhanden; offen sind Seeding aus Questions/Knots, Filter/Sortierung, Contributor-Feedback, Rückfluss in Statements/Graph und Anti-Spam.
- **Part10 Responsibility Navigator (Block B):** Directory/Paths und Frontend-Navigator müssen aufgebaut werden.
- **Part11 Streams (Block F):** Modelle, Routes/UI und XP-Gating fehlen; Stream-Deck aus Reports/Graph steht aus.
- **Part12 Campaigns (Block G):** Campaign/CampaignSession-Modelle, Admin-UI, QR-Flows und Reports fehlen.
- **Part13 I18N/A11y/Social (Block H):** Übersetzungs-Infra, A11y-Pass und minimale Community-Räume/Chat fehlen.
- **Part14 Implementation Roadmap:** Dient als Arbeitsmodus; Block-Reihenfolge beachten.
- **Part15 Codex Safe Mode:** Leitplanken aktiv; keine offenen Tasks, aber stets befolgen.

## Run-Plan nach Part15 (Block-Status & Definition of Done)

| Block | Bezug | Status | Definition of Done |
| --- | --- | --- | --- |
| **A – Orchestrator (E150 Core Provider)** | Part05 | **Offen** | `@features/ai/orchestrator_gemini.ts` (Adapter + `ProviderMeta`), rollenspezifische Prompts (citizen, staff, institution), Health-/Score-Tracking in `orchestrator_health.ts`; SSE bleibt intakt. |
| **B – Consequences & Responsibility Navigator** | Part06/10 | **Offen** | Prisma-Modelle `Consequence`, `Responsibility`, `ResponsibilityLink`; API-Routes `/api/responsibility/[id]`, `/api/consequence/[id]`; React-`ResponsibilityNavigator.tsx` mit Filter/Path-Tree/Score-Coloring; Admin-View fürs Mapping. |
| **C – Graph & Reports** | Part07 | **Offen** | `@features/graph/sync.ts` (AnalyzeResult → Graph), Graph-Store (Neo4j/Arango/Memgraph Connector), `/admin/graph/impact` mit echten Graph-Stats. |
| **D – Eventualities / DecisionTree** | Part08 | **Offen** | Typen `Eventuality`, `DecisionTreeNode`; Analyzer-Prompts für „was passiert wenn …“; UI `EventualityBoard.tsx`; API `/api/eventualities/analyze`. |
| **E (R2) – Research Workflow** | Part09 | **Offen** | Seeding aus Questions/Knots; Filter-/Sortier-API `/api/research/list`; Contributor-Feedback („Hilfreich?“-Rating); Rückfluss in Statements/Graph; Anti-Spam-Heuristik (Contributor-Cooldown). |
| **F – Streams** | Part11 | **Offen** | Modelle `Stream`, `StreamSession`; UI `StreamDeck` mit XP-Gating; XP-Zuwachs für Teilnahme/Hosting. |
| **G – Campaigns** | Part12 | **Offen** | Modelle `Campaign`, `CampaignSession`; Admin-UI + Statistik-View; QR-Flow `/campaign/[id]/join`; Reports/Erfolgsmessung. |
| **H – I18N / A11y / Social** | Part13 | **Offen** | I18N-Infra (next-intl, Namespaces `common`, `admin`, `analyze`); A11y-Audit + „A11y Pass“ im Build; Basis-Chat/Community-Räume für Citizen Pro +. |

## Konkrete Next Steps

1. **Starte mit Block A** (Part05): Gemini-Provider + rollenspezifische Prompts + Health/Score.
2. **Danach Block B** (Part06/10): Consequence-/Responsibility-Modelle, Persistenz, Navigator-UI & Admin.
3. **Block C & D parallel planen** (Part07/08): Graph-Sync plus Eventualities-Typen/Prompts/UI.
4. **Research R2 priorisieren** (Part09): Seeding, Filter, Contributor-Feedback, Rückfluss, Anti-Spam.
5. **Block F/G/H** (Part11/12/13): Streams/Campaigns/I18N-A11y-Social, sobald Basis aus A–D steht.

Diese Liste ist verbindlich für die nächsten Codex-Runs. Bei jedem Run den aktuell offenen Block aus Part14 wählen und die „Definition of Done“ erfüllen, bevor zum nächsten Pfad gewechselt wird. Sobald ein Block abgeschlossen ist, den Status im obigen Table auf **Done** setzen; aktuell sind alle Blöcke offen, d. h. es ist noch nichts erledigt.
