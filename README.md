# VoiceOpenGov

> **Willkommen Nachbar.**
>
> Wir kennen uns wahrscheinlich nicht. Trotzdem treffen wir jeden Tag Entscheidungen, die unser gemeinsames Leben beeinflussen. Vielleicht wird es Zeit, dass wir anfangen, sie gemeinsam besser zu verstehen.

VoiceOpenGov ist eine offene, internationale Mitgliederbewegung für nachvollziehbare Politik, echte Beteiligung, gesellschaftliche Souveränität und eine Kultur des Vertrauens.

Wir bauen keine Plattform, auf der Menschen einer Meinung sein müssen. Wir schaffen eine Bewegung und eine Infrastruktur, in der Menschen trotz unterschiedlicher Meinungen gemeinsam verantwortbare Entscheidungen entwickeln können.

## Die Rollen sind klar

- **Vote4Gov** ist der kritische Denk- und Reviewraum: Systemfragen, prüfbare Thesen, Gegenfragen und internationale Vergleiche.
- **VoiceOpenGov** ist die Mitgliederbewegung und Community-Ebene: Menschen, Regionen, lokale Präsenz, Partnerschaften und gemeinsames Handeln.
- **eDebatte** ist die unabhängige Arbeits- und Entscheidungsinfrastruktur: Quellen, Evidenz, Gegenpositionen, Dossiers, Alternativen, Beteiligung, Abstimmungen, Wirkung und Lernen.
- **Voxy** erklärt, strukturiert und übersetzt. Voxy hilft beim Verstehen und ist keine autonome Entscheidungsebene.

## Wofür wir stehen

- Verstehen vor Bewerten
- Quellen vor Behauptungen
- Transparenz vor Vertrauen auf Zuruf
- Verantwortung statt bloßer Reichweite
- Mehrheiten mit sichtbaren Minderheiten
- offene Unsicherheit statt künstlicher Gewissheit
- Lernen und Korrigieren statt politischem Gesichtsverlust
- Geld ermöglicht Arbeit, kauft aber keine Stimme

## Mitgliedschaft ist kein Newsletter

VoiceOpenGov ist auf Mitgliedschaften ausgelegt. Mitglieder können die Charta mitentwickeln, Themen einbringen, regionale und thematische Gruppen aufbauen, an Entscheidungen der Bewegung teilnehmen und Verantwortung übernehmen.

Mögliche Rollen reichen vom Nachbarn und Quellenfinder über Moderation, Übersetzung und regionale Verantwortung bis zu Fördermitgliedern und Partnerorganisationen. Finanzielle Unterstützung führt niemals zu mehr politischer Gewichtung.

## Transparenz ist unser Betriebssystem

Wir verlangen nichts, was wir nicht selbst tun.

Darum machen wir schrittweise sichtbar:

- Finanzierung und Abhängigkeiten
- Mitgliederentwicklung
- Entscheidungen und Verantwortlichkeiten
- Partnerschaften und Interessenkonflikte
- Charta-Versionen
- Einsatz von KI
- offene Fehler, Risiken und Lernstände
- Wirkung und Kursänderungen

Wir behaupten nicht, objektiv oder unabhängig von jeder Beziehung zu sein. Wir machen nachvollziehbar, wie Einschätzungen entstehen und welche Abhängigkeiten bestehen.

## eDebatte: Dort werden Themen fachlich bearbeitet

In eDebatte wird aus Information keine schnelle Meinung, sondern ein nachvollziehbarer Weg:

```text
Quelle
↓
Beobachtung
↓
Claim und Evidenz
↓
Interpretation und Annahme
↓
Zielkonflikt und Alternativen
↓
Orientierung
↓
Beteiligung und Mehrheitsbild
↓
Entscheidung
↓
Wirkung
↓
Lernen und neue Version
```

Der Reasoning Graph gehört in den methodischen und technischen Kern von eDebatte. VoiceOpenGov definiert den Transparenzanspruch und den Community-Kontext; eDebatte macht die fachliche Bearbeitung praktisch überprüfbar.

## Grundsatzfragen und bestehende Altflächen

Grundsatzfragen, Systemthesen, institutionelle Reviews und internationale Systemvergleiche gehören primär zu Vote4Gov. Bestehende ältere VoiceOpenGov-Seiten in diesem Bereich werden nicht stillschweigend gelöscht, sondern über ein dokumentiertes Migrations- und Redirect-Verfahren getrennt.

## Relaunch-Grundlage

Die kanonische Marken-, Mitgliedschafts- und Vertrauensarchitektur liegt hier:

[`docs/VOICEOPENGOV-MOVEMENT-RELAUNCH-2026.md`](docs/VOICEOPENGOV-MOVEMENT-RELAUNCH-2026.md)

## Technische Architektur

Das Repository ist ein Monorepo mit:

- **apps/web** – Next.js 15 Frontend und öffentliche Bewegungssurfaces
- **core** – Domain-Logik, Identity, Telemetrie und Orchestrierung
- **features** – wiederverwendbare UI- und Domain-Module
- **packages/tri-mongo** – Datenzugriff für `core`, `votes`, `pii` und `ai_reader`
- **packages/ui** – gemeinsame UI-Bausteine

### Stack

- Node.js 20 und pnpm 10.x
- Next.js 15 App Router
- MongoDB, Redis und optionale Graph-Komponenten
- KI-Orchestrierung mit mehreren Providern

### Lokaler Start

```bash
pnpm install --frozen-lockfile
cp apps/web/.env.example apps/web/.env.local
pnpm -C apps/web dev
```

### Qualität

```bash
pnpm -C apps/web exec tsc --noEmit
pnpm -C apps/web run lint
pnpm -C apps/web run build
```

## Nordstern für jede Änderung

> **Steigert diese Änderung nachvollziehbares Vertrauen?**
