export type DemoVoteStatus = "draft" | "review" | "published";

export type DemoVoteOption = {
  id: string;
  label: string;
  description: string;
};

export type DemoVoteClaim = {
  text: string;
  sourceHint?: string;
};

export type DemoVoteEvidence = {
  label: string;
  source: string;
  url?: string;
};

export type DemoVoteTreeStep = {
  title: string;
  detail: string;
  outcome: string;
};

export type DemoVoteTimelineItem = {
  label: string;
  date: string;
  status: "done" | "in_progress" | "planned";
};

export type DemoVote = {
  id: string;
  title: string;
  summary: string;
  regionCode: string;
  regionLabel: string;
  status: DemoVoteStatus;
  createdAt: string;
  updatedAt: string;
  participationTarget: string;
  options: DemoVoteOption[];
  claims: DemoVoteClaim[];
  evidence: DemoVoteEvidence[];
  decisionTree: DemoVoteTreeStep[];
  timeline: DemoVoteTimelineItem[];
};

export const demoVotes: DemoVote[] = [
  {
    id: "demo-vote-001",
    title: "Sichere Radwege - Innenstadt 2026",
    summary:
      "Priorisierung eines durchgaengigen Radwegenetzes in der Innenstadt. Drei Optionen mit Zeitplan, Budget und Ausweichrouten.",
    regionCode: "DE:BE",
    regionLabel: "Berlin Mitte",
    status: "published",
    createdAt: "2025-07-02",
    updatedAt: "2025-07-18",
    participationTarget: "Quorum 15 % - Ziel 12.000 Stimmen",
    options: [
      {
        id: "opt-a",
        label: "Variante A: Pop-up Ausbau",
        description: "Sofortstart mit temporaeren Spuren, 12 Monate Evaluationsphase.",
      },
      {
        id: "opt-b",
        label: "Variante B: Dauerhafte Trennung",
        description: "Bauliche Trennung, hoeheres Budget, weniger Parkplaetze.",
      },
      {
        id: "opt-c",
        label: "Variante C: Mischverkehr",
        description: "Flankiert durch Tempo 30 und Vorrangrouten.",
      },
    ],
    claims: [
      {
        text: "45 % der Radpendler:innen nutzen aktuell Mischverkehr auf Hauptachsen.",
        sourceHint: "Verkehrsmonitor 2024",
      },
      {
        text: "Unfallzahlen steigen an drei Hotspots jaehrlich um 6 %.",
        sourceHint: "Polizeibericht Q4/2024",
      },
      {
        text: "Temporaere Spuren senken Unfallrisiken kurzfristig um 18 %.",
        sourceHint: "Pilotprojekt Kiez West",
      },
    ],
    evidence: [
      {
        label: "Unfallstatistik 2024",
        source: "Polizei Berlin",
        url: "https://www.berlin.de/polizei/",
      },
      {
        label: "Radverkehrs-Report",
        source: "Senatsverwaltung",
        url: "https://www.berlin.de/sen/uvk/",
      },
      {
        label: "Buerger:innen-Feedback",
        source: "Beteiligungsplattform",
      },
    ],
    decisionTree: [
      {
        title: "Quorum erreicht?",
        detail: "Mindestens 15 % Beteiligung in 21 Tagen.",
        outcome: "Wenn nein -> Verlaengerung + Info-Kampagne.",
      },
      {
        title: "Mehrheit fuer Variante B?",
        detail: "Mehrheit der gueltigen Stimmen.",
        outcome: "Wenn nein -> Vergleich A vs. C mit Kurzstudie.",
      },
      {
        title: "Budgetfreigabe",
        detail: "Finanzausschuss bestaetigt Umsetzungsrahmen.",
        outcome: "Wenn nein -> Phasenweise Umsetzung.",
      },
    ],
    timeline: [
      { label: "Beteiligungsstart", date: "2025-07-20", status: "done" },
      { label: "Auswertung & Review", date: "2025-08-05", status: "in_progress" },
      { label: "Finales Mandat", date: "2025-08-20", status: "planned" },
    ],
  },
  {
    id: "demo-vote-002",
    title: "Tempo 30 in Wohnquartieren",
    summary:
      "Schrittweise Einfuehrung von Tempo 30 in Wohngebieten mit Ausnahmen fuer OEPNV-Korridore.",
    regionCode: "DE:HH",
    regionLabel: "Hamburg",
    status: "review",
    createdAt: "2025-06-18",
    updatedAt: "2025-07-01",
    participationTarget: "Ziel 8.000 Stimmen - Mindestquote 10 %",
    options: [
      {
        id: "opt-a",
        label: "Stufe 1: Pilotquartiere",
        description: "Vier Quartiere, Evaluation nach 6 Monaten.",
      },
      {
        id: "opt-b",
        label: "Stufe 2: Gesamtstadt",
        description: "Breiter Rollout mit OEPNV-Ausnahmen.",
      },
    ],
    claims: [
      {
        text: "Laerm- und Feinstaubwerte ueberschreiten Richtwerte in 6 von 10 Quartieren.",
        sourceHint: "Umweltmonitor 2024",
      },
      {
        text: "Tempo 30 senkt Bremswege in Wohnstrassen um durchschnittlich 9 Meter.",
        sourceHint: "ADAC Safety Study",
      },
    ],
    evidence: [
      {
        label: "Laermkarte 2024",
        source: "Hamburg.de",
        url: "https://www.hamburg.de/",
      },
      {
        label: "Verkehrssicherheit",
        source: "ADAC",
        url: "https://www.adac.de/",
      },
    ],
    decisionTree: [
      {
        title: "Pilot ausreichend?",
        detail: "Mindestens 3 Quartiere bestaetigen Wirkung.",
        outcome: "Wenn nein -> Anpassung der Massnahmen.",
      },
      {
        title: "Ausnahme fuer OEPNV?",
        detail: "Zeitkritische Linien behalten 40 km/h.",
        outcome: "Wenn ja -> Sonderregelung im Beschluss.",
      },
    ],
    timeline: [
      { label: "Beteiligungsphase", date: "2025-06-25", status: "done" },
      { label: "Redaktionsreview", date: "2025-07-05", status: "in_progress" },
      { label: "Veroeffentlichung", date: "2025-07-15", status: "planned" },
    ],
  },
  {
    id: "demo-vote-003",
    title: "Schulhof-Entsiegelung & Klimaresilienz",
    summary:
      "Investitionen in beschattete Schulhoefe, Regenwasserspeicher und Begruenung.",
    regionCode: "DE:NRW",
    regionLabel: "Nordrhein-Westfalen",
    status: "draft",
    createdAt: "2025-06-04",
    updatedAt: "2025-06-22",
    participationTarget: "Ziel 5.000 Stimmen - Fokus Pilot-Schulen",
    options: [
      {
        id: "opt-a",
        label: "Variante A: 12 Pilotstandorte",
        description: "Schneller Start, geringe Investition pro Standort.",
      },
      {
        id: "opt-b",
        label: "Variante B: 30 Standorte",
        description: "Breite Streuung, gestaffelte Finanzierung.",
      },
    ],
    claims: [
      {
        text: "Hitzetage in Innenhoefen steigen seit 2018 um 23 %.",
        sourceHint: "Klimaatlas NRW",
      },
      {
        text: "Entsiegelung reduziert Oberflaechentemperatur um bis zu 6 Grad.",
        sourceHint: "TU Dortmund Studie",
      },
    ],
    evidence: [
      {
        label: "Klimaatlas",
        source: "NRW Umweltportal",
        url: "https://www.umwelt.nrw.de/",
      },
      {
        label: "Schulhof-Projektbericht",
        source: "Staedtetag NRW",
      },
    ],
    decisionTree: [
      {
        title: "Foerdermittel gesichert?",
        detail: "Mindestens 60 % externe Foerderung.",
        outcome: "Wenn nein -> Reduktion auf Pilot-Standorte.",
      },
      {
        title: "Umsetzung in 18 Monaten?",
        detail: "Ausschreibung + Bauzeit",
        outcome: "Wenn nein -> Rollout in zwei Etappen.",
      },
    ],
    timeline: [
      { label: "Entwurf", date: "2025-06-15", status: "done" },
      { label: "Vorpruefung", date: "2025-06-30", status: "in_progress" },
      { label: "Beteiligung", date: "2025-07-20", status: "planned" },
    ],
  },
];

export function getDemoVote(id: string) {
  return demoVotes.find((vote) => vote.id === id) ?? null;
}
