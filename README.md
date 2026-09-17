# VoiceOpenGov

> **Willkommen Nachbar.**
>
> Wir kennen uns wahrscheinlich nicht. Trotzdem treffen wir jeden Tag Entscheidungen, die unser gemeinsames Leben beeinflussen. Vielleicht wird es Zeit, dass wir anfangen, sie gemeinsam besser zu verstehen.

VoiceOpenGov ist eine offene, internationale Initiative und Community für nachvollziehbare Entscheidungsgrundlagen, echte Beteiligung, gesellschaftliche Verantwortung und eine Kultur des Vertrauens.

Wir bauen keinen Raum, in dem Menschen einer Meinung sein müssen. VoiceOpenGov verbindet Menschen, regionale Beteiligung und nachvollziehbare Entscheidungsgrundlagen – digital und vor Ort. Die rechtliche Träger- und Mitgliedschaftsstruktur befindet sich noch im Aufbau und wird nicht vorweggenommen.

## Die Rollen sind klar

- **VoiceOpenGov** ist die Initiative und Community: Werte, Beteiligung, regionale Organisation, Transparenz und gemeinsames Handeln. Die heutige Community-Anmeldung ist keine Vereins- oder gesellschaftsrechtliche Mitgliedschaft.
- **eDebatte** ist eine eigenständige offene Informations- und Entscheidungsinfrastruktur: Quellen, Aussagen, Dossiers, Gegenpositionen, Alternativen und nachvollziehbare Orientierung. VoiceOpenGov nutzt eDebatte; VoiceOpenGov und eDebatte werden nicht gleichgesetzt.
- **Vote4Gov** ist ein getrenntes Projekt und keine verbindliche Position von VoiceOpenGov.
- **Voxy** erklärt, strukturiert und übersetzt. Voxy hilft beim Verstehen und trifft keine politischen oder organisatorischen Entscheidungen.

## Wofür wir stehen

- Verstehen vor Bewerten
- Quellen vor Behauptungen
- Transparenz vor Vertrauen auf Zuruf
- Verantwortung statt bloßer Reichweite
- Mehrheiten mit sichtbaren Minderheiten
- offene Unsicherheit statt künstlicher Gewissheit
- Lernen und Korrigieren statt Gesichtsverlust
- Geld ermöglicht Arbeit, kauft aber keine Stimme

## Community heute, rechtliche Struktur transparent später

Menschen können sich heute der VoiceOpenGov-Community anschließen, aktiv mitwirken oder regionale Beteiligung ermöglichen. Diese Community-Zugehörigkeit ist derzeit keine Vereins- oder gesellschaftsrechtliche Mitgliedschaft.

Die endgültige Träger-, Governance- und gegebenenfalls Mitgliedschaftsstruktur wird erst dann als bestehend beschrieben, wenn sie rechtlich und organisatorisch feststeht. Finanzielle Unterstützung ist davon getrennt und führt niemals zu zusätzlichem Stimmgewicht, redaktionellen Rechten oder bevorzugtem Zugang.

## Transparenz ist unser Betriebssystem

Wir verlangen nichts, was wir nicht selbst tun.

Darum machen wir schrittweise sichtbar:

- Finanzierung und Abhängigkeiten
- Community-Entwicklung
- Entscheidungen und Verantwortlichkeiten
- Partnerschaften und Interessenkonflikte
- Governance- und Charta-Versionen, sobald diese verbindlich sind
- Einsatz von KI
- offene Fehler, Risiken und Lernstände
- Wirkung und Kursänderungen

Wir behaupten nicht, objektiv oder unabhängig von jeder Beziehung zu sein. Wir machen nachvollziehbar, wie Einschätzungen entstehen und welche Abhängigkeiten bestehen.

## eDebatte: nachvollziehbare Entscheidungsgrundlagen

In eDebatte wird aus Information keine schnelle Meinung, sondern ein nachvollziehbarer Weg:

```text
Quelle
↓
Beobachtung
↓
Aussage und Evidenz
↓
Interpretation und Annahme
↓
Zielkonflikt und Alternativen
↓
Orientierung
↓
Beteiligung und Mehrheitsbild
↓
Entscheidungsgrundlage
↓
Wirkung
↓
Lernen und neue Version
```

eDebatte strukturiert Informationen und Unsicherheiten. Entscheidungen bleiben beim Menschen beziehungsweise bei den dafür legitimierten demokratischen Verfahren.

## Die ersten 50 öffentlichen Fragen

Die erste Seed-Welle besteht aus 50 großen, international verständlichen Orientierungsfragen – nicht aus klassischen Parteikapiteln oder Ministeriumsschubladen.

Jeder Raum erhält eine Leitfrage, Zielkonflikte, Werte- und Rechtsbezüge, betroffene Gruppen, internationale Perspektiven, Quellen, Aussagen, Unsicherheiten, Alternativen, Erfolgskriterien, Beteiligung, Versionierung und Wirkungsprüfung.

Siehe: [`docs/VOICEOPENGOV-50-FRAGEN.md`](docs/VOICEOPENGOV-50-FRAGEN.md)

## Aktuelle Positionierungsgrundlage

Die öffentliche Positionierung muss dem aktuellen Laufzeitstand entsprechen: VoiceOpenGov ist Initiative & Community; eDebatte ist eigenständige offene Infrastruktur; Zukunftsformate werden als Aufbau oder Perspektive gekennzeichnet. Die verbindlichen Brand- und i18n-Regeln stehen in [`AGENTS.md`](AGENTS.md).

Ältere Relaunch- und Planungsdokumente in `docs/` sind historische Arbeitsstände und dürfen aktuelle Laufzeit-, Rechts- oder Produktangaben nicht überschreiben.

## Technische Architektur

Das Repository ist ein Monorepo mit:

- **apps/web** – Next.js 15 Frontend und öffentliche VoiceOpenGov-Surfaces
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
