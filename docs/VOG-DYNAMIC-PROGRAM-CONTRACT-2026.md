# VoiceOpenGov – Dynamic Program & Independence Contract

**Status:** kanonischer Architekturvertrag  
**Scope:** VoiceOpenGov-Programm, regionale Repräsentation und Nutzung von eDebatte  
**Gültig ab:** 17. September 2026

## 1. Zweck

VoiceOpenGov führt ein dynamisches, versioniertes Programm. Dieses Programm darf weder zu einem statischen Parteikatalog noch zu einer automatischen Spiegelung von eDebatte-Ergebnissen werden.

Der Kernvertrag lautet:

> **eDebatte liefert unabhängige Evidenz-, Dossier- und Beteiligungsräume. VoiceOpenGov bildet daraus nur durch einen eigenen demokratischen Willensbildungsakt eine Position der Bewegung.**

## 2. Harte institutionelle Trennung

### Vote4Gov

Vote4Gov ist die persönliche öffentliche Analyse- und Positionierungsebene von Ricky Gerd Fleischer. Dort können historische Herleitungen, internationale Vergleiche, Systemkritik, persönliche Thesen und eigene Reform- oder Systementwürfe veröffentlicht werden.

Eine Vote4Gov-These ist keine VoiceOpenGov-Position.

### VoiceOpenGov

VoiceOpenGov ist die Mitgliederbewegung. Sie organisiert Menschen, Regionen, physische Präsenz, Governance, programmatische Willensbildung und die Vertretung des jeweils gültigen programmatischen Standes.

Eine VoiceOpenGov-Position benötigt einen eigenen, nachvollziehbaren Entscheidungsakt der Bewegung.

### eDebatte

eDebatte ist eine unabhängig nutzbare Infrastruktur für Quellen, Claims, Gegenpositionen, Dossiers, Alternativen, Beteiligung, Mehrheitsbilder, Wirkung und Lernen.

eDebatte entscheidet nicht für VoiceOpenGov. Ein Mehrheitsbild, Voting-Ergebnis, Konsens oder Dossierstatus bei eDebatte darf niemals automatisch einen programmatischen Status bei VoiceOpenGov erzeugen.

### Voxy

Voxy erklärt, strukturiert und übersetzt. Voxy trifft weder programmatische noch redaktionelle oder organisatorische Entscheidungen.

## 3. Kein automatischer Programmdurchgriff

Technisch und organisatorisch ist folgender Durchgriff verboten:

```text
eDebatte-Ergebnis
=> automatische VoiceOpenGov-Position
```

Zulässig ist ausschließlich:

```text
eDebatte-Dossier / Evidenzstand
↓
VoiceOpenGov referenziert den Stand für eine eigene Willensbildung
↓
eigener VOG-Entscheidungsprozess nach den geltenden Governance-Regeln
↓
veröffentlichter ProgramRecord
```

Jeder Übergang von eDebatte zu VoiceOpenGov benötigt deshalb einen expliziten VOG-Akt mit eigener Identität, Zeit, Regelversion und Ergebnis.

## 4. Mindestdaten eines programmatischen VOG-Standes

Ein veröffentlichter programmatischer Stand muss mindestens enthalten:

- `programRecordId` – stabile, sprachunabhängige ID,
- `topicId` – stabiles VOG-Thema,
- `status` – Entwurf, in Diskussion, gültig, zu überprüfen, ersetzt oder verworfen,
- `majorityPosition` – aktuell angenommene Mehrheitsposition,
- `minorityPositions[]` – relevante Minderheitenpositionen ohne nachträgliche Glättung,
- `decisionRule` – angewandte Mehrheits-, Quorum- und Schutzregel,
- `decisionEventId` – eigener VOG-Entscheidungsakt,
- `evidenceRefs[]` – referenzierte eDebatte-Dossiers und weitere Quellenstände,
- `openUncertainties[]` – bekannte Unsicherheiten,
- `counterArguments[]` – dokumentierte tragende Gegenargumente,
- `effectiveFrom` – Beginn des Geltungszeitraums,
- `version` – Programversion,
- `supersedes` – vorheriger ProgramRecord, falls vorhanden,
- `reviewTrigger` – Bedingungen für erneute Prüfung,
- `auditTrail` – nachvollziehbare Änderungen und Verantwortlichkeiten.

Der ProgramRecord speichert keine zweite Kopie des vollständigen eDebatte-Dossiers. Er referenziert den verwendeten Evidenzstand.

## 5. Minderheitenschutz ist Bestandteil des Programms

Das dynamische Programm zeigt nicht nur die Mehrheitsposition.

Zu jedem materiellen ProgramRecord gehören:

1. die gültige Mehrheitsposition,
2. relevante Minderheitenpositionen,
3. die Stärke beziehungsweise Verteilung der Positionen, soweit datenschutzkonform,
4. tragende Gegenargumente,
5. offene Unsicherheiten,
6. der Weg, über den eine spätere Neubewertung ausgelöst werden kann.

Eine Minderheitenposition wird nicht allein deshalb gelöscht, weil sie aktuell keine Mehrheit besitzt.

## 6. eDebatte bleibt für andere Akteure vollständig nutzbar

Dass VoiceOpenGov ein Dossier nutzt, erzeugt keinerlei Eigentum oder Prioritätsrecht.

Am selben Dossier können gleichzeitig oder nacheinander arbeiten:

- einzelne Bürger,
- Wissenschaftler,
- Journalisten und Redaktionen,
- Vereine und NGOs,
- Unternehmen und Verbände,
- Kommunen und öffentliche Einrichtungen,
- politische Parteien oder Wettbewerber,
- andere Bewegungen oder Initiativen,
- VoiceOpenGov-Mitglieder und -Repräsentanten.

Diese Akteure können aus demselben Evidenzstand unterschiedliche Schlussfolgerungen ableiten.

## 7. Regionale Repräsentation

Ein VoiceOpenGov-Repräsentant vertritt nicht seine persönliche Interpretation von eDebatte, sondern den für seinen Mandatsbereich gültigen VoiceOpenGov-ProgramRecord beziehungsweise die transparent dokumentierte regionale Abweichung, soweit die Governance eine solche vorsieht.

Der Repräsentant darf:

- den programmatischen Stand erklären,
- regionale Erfahrungen in neue Prüfungen einbringen,
- neue Dossiers oder Neubewertungen anstoßen,
- dokumentieren, wo praktische Umsetzung vom erwarteten Ergebnis abweicht.

Der Repräsentant darf nicht:

- ein eDebatte-Dossier kontrollieren oder exklusiv beanspruchen,
- ein eDebatte-Mehrheitsbild eigenmächtig zur VOG-Position erklären,
- Minderheitenpositionen ausblenden,
- die Programversion außerhalb des VOG-Verfahrens ändern.

## 8. Regionale Präsenz

VoiceOpenGov kann physische Präsenz aufbauen, insbesondere:

- regionale Teams,
- regelmäßige offene Treffen,
- temporäre Beteiligungsstände,
- mobile Formate und Beteiligungsbusse,
- dauerhafte Beteiligungsbüros oder Anlaufstellen,
- lokale Partnerschaften und Räume.

Der öffentliche Status muss immer realitätsgetreu sein:

- `geplant`,
- `in Vorbereitung`,
- `Pilot`,
- `aktiv`,
- `pausiert`,
- `beendet`.

Keine geplante Struktur darf als bestehende Community-Infrastruktur dargestellt werden.

## 9. Programmänderungen

Ein dynamisches Programm muss Änderungen erleichtern, ohne Beliebigkeit zu erzeugen.

Eine Neubewertung kann beispielsweise ausgelöst werden durch:

- neue belastbare Evidenz,
- veränderte Rechtslage,
- deutlich veränderte gesellschaftliche Rahmenbedingungen,
- dokumentierte unerwartete Wirkungen,
- neue tragende Alternativen,
- ein nach Governance zulässiges Mitgliederbegehren,
- turnusmäßige Überprüfung.

Die vorherige Position bleibt versioniert auffindbar.

## 10. Kein rechtlicher Vorgriff

Dieser Vertrag definiert die inhaltliche und technische Architektur der Bewegung. Er legt nicht vorzeitig fest, in welcher rechtlichen Form VoiceOpenGov später Kandidaturen, Listen, kommunale Vertretungen, Wählergruppen, Parteienkooperationen oder andere Wahlteilnahmen organisiert.

Solche Entscheidungen benötigen einen separaten rechtlichen und Governance-Vertrag.

## 11. Abnahmekriterien

Eine Umsetzung ist nur dann vertragskonform, wenn:

- kein eDebatte-Ergebnis automatisch einen VOG-ProgramRecord erzeugt,
- jeder gültige ProgramRecord einen eigenen VOG-Entscheidungsakt referenziert,
- Mehrheits- und Minderheitenpositionen gemeinsam sichtbar bleiben,
- eDebatte-Dossiers von anderen Akteuren unabhängig weiterverwendet werden können,
- ein Repräsentant weder Dossier noch Programmstand eigenmächtig kontrollieren kann,
- Änderungen versioniert und rückverfolgbar sind,
- regionale Präsenz nur im tatsächlich erreichten Status ausgewiesen wird,
- Vote4Gov-Personalthesen nicht als VOG-Programm erscheinen.
