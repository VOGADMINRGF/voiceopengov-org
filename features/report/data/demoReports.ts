export const demoThemes = [
  { id: "migration", label: "Migration" },
  { id: "rente", label: "Rente" },
  { id: "gesundheit", label: "Gesundheit" },
  { id: "klima", label: "Klima" },
  { id: "bildung", label: "Bildung" },
  { id: "wirtschaft", label: "Wirtschaft" },
  { id: "energie", label: "Energie" },
  { id: "eu", label: "EU-Politik" }
];

import { demoStatements } from "./demoStatements";

export const demoReports = [
  {
    id: "demo-1",
    title: "Migration & Integration 2025",
    subtitle: "Wie viel Integration braucht Europa?",
    createdAt: "2025-07-25",
    updatedAt: "2025-07-27",
    author: "VOG-Redaktion",
    status: "active",
    visibility: "public",
    language: "de",
    tags: ["Integration", "Migration", "Deutschland", "EU"],
    imageUrl: "/dummy/dummy1.jpg",
    regionScope: ["Deutschland", "EU", "Global"], // 🔥 korrigiert und ergänzt!
    
    context: {
      scientific: "OECD und BAMF zeigen: Integration funktioniert dort, wo Teilhabe und Sprache politisch gefördert werden.",
      societal: "Debatte um Identität und Zusammenhalt spitzt sich in Krisenzeiten zu – Bürger:innen fordern Orientierung.",
      economic: "Fachkräftemangel und demografischer Wandel machen gesteuerte Zuwanderung zur Überlebensfrage."
    },

    startingPoint: {
      de: "Höchste Zuwanderung seit 2015 – Diskussion über Pflichtkurse und gesellschaftliche Leitbilder.",
      fr: "Integration in den Banlieues im Fokus – Schulpolitik als Hebel.",
      eu: "Spannung zwischen Grenzschutz und humanitären Verpflichtungen."
    },

    statements: ["statement-001", "statement-002"],
    votes: {
      total: { agree: 8500, neutral: 1200, disagree: 1600 },
      countries: [
        { code: "DE", region: "Deutschland", agree: 5000, neutral: 900, disagree: 600 },
        { code: "FR", region: "Frankreich", agree: 1800, neutral: 400, disagree: 200 },
        { code: "EU", region: "EU", agree: 1200, neutral: 200, disagree: 100 }
      ]
    },

    facts: [
      {
        text: "Deutschland: 53 % der Befragten befürworten kontrollierte Zuwanderung.",
        source: { name: "Statistisches Bundesamt", url: "https://destatis.de", trust: 0.9 }
      },
      {
        text: "EU-weit wünschen sich 56 % mehr Integrationsprojekte.",
        source: { name: "Eurobarometer", url: "https://europa.eu/eurobarometer", trust: 0.85 }
      }
    ],
    analytics: {
      statementsCount: 3,
      eventualitiesCount: 8,
      agreementDistribution: { agree: 67, neutral: 19, disagree: 14 },
      topImpacts: {
        gesellschaftlich: "Stärkere Teilhabe, weniger Parallelgesellschaften.",
        sozial: "Mehr Motivation durch Pflicht, aber auch Debatte über Zwang.",
        kulturell: "Sprache als Schlüssel – Integration als Identitätsfrage."
      },
      statements: [
        {
          id: "st1",
          title: "Sprachkurs-Pflicht?",
          eventualities: [
            { option: "Pflichtkurse", agree: 4500, neutral: 900, disagree: 1100, mainImpact: "gesellschaftlich" },
            { option: "Freiwillige Kurse", agree: 2900, neutral: 200, disagree: 400, mainImpact: "sozial" }
          ]
        }
      ],
      votesLastWeek: 3200,
      trend: [7800, 8000, 8200, 8500]
    },
    voices: [
      {
        type: "media",
        name: "SZ",
        quote: "Deutsch lernen ist Schlüssel zur Integration – aber auch zur gesellschaftlichen Teilhabe.",
        url: "https://www.sueddeutsche.de/thema/Migration",
        date: "2025-07-16"
      },
      {
        type: "association",
        name: "Deutscher Städtetag",
        quote: "Kommunen brauchen mehr Mittel für Integrationsarbeit, sonst geraten sie an ihre Grenzen.",
        url: "https://www.staedtetag.de/",
        date: "2025-07-18"
      },
      {
        type: "ngo",
        name: "Pro Asyl",
        quote: "Pflichtkurse sind hilfreich, wenn sie nicht zu Sanktionen bei Nicht-Teilnahme führen.",
        url: "https://www.proasyl.de/",
        date: "2025-07-15"
      },
      {
        type: "science",
        name: "DIW Berlin",
        quote: "Langfristige Investitionen in Integration rechnen sich volkswirtschaftlich in jedem Fall.",
        url: "https://www.diw.de/",
        date: "2025-07-13"
      }
    ],
    relevance: {
      citizen: "Bessere Integration bedeutet mehr Teilhabe und weniger Konflikte – jede:r kann mitgestalten.",
      policymaker: "Balance zwischen Steuerung und Offenheit sichert Akzeptanz und Zusammenhalt.",
      ngo: "NGOs übersetzen Erfahrungen vor Ort in politische Empfehlungen.",
      business: "Fachkräftebedarf macht Integration zur wirtschaftlichen Notwendigkeit.",
      directAction: "Wer helfen will, kann Sprachpartnerschaften und Mentoring übernehmen."
    },
    editorialSummary: {
      pro: [
        "Sprache als Türöffner für Teilhabe und Arbeitsmarkt.",
        "Pflichtkurse verhindern Ausgrenzung und Parallelgesellschaften."
      ],
      contra: [
        "Zwang kann Widerstand erzeugen.",
        "Nicht alle Geflüchteten haben gleiche Voraussetzungen."
      ],
      neutral: [
        "Integration ist ein Prozess – beide Seiten müssen sich öffnen."
      ]
    },
    globalTrend: "Integration ist weltweit Prüfstein für gesellschaftliche Resilienz.",
    metaRelevance: "Was heute in Europa gelingt oder scheitert, wird weltweit Modell oder Warnung.",
    legalBasis: ["Art. 16a GG", "Art. 3 EU-Grundrechtecharta"],
    responsibleBodies: ["Bundestag", "BAMF", "EU-Kommission"],
    timeline: [
      { date: "2025-07-01", agree: 8000, neutral: 1100, disagree: 1500 },
      { date: "2025-07-10", agree: 8250, neutral: 1150, disagree: 1550 }
    ],
    moderation: {
      reviewed: true,
      reviewedBy: ["admin", "expertpanel"],
      qualityScore: 0.98,
      aiNotes: "Statement-Coverage hoch, Debatte ausgewogen."
    }
  }
];

export const demoStatements = [
  {
    id: "statement-001",
    title: "Soll Deutschland die Integration von Geflüchteten durch verpflichtende Sprachkurse fördern?",
    category: "Integration",
    countries: ["DE", "FR", "EU"],
    regionScope: ["Deutschland", "EU", "Frankfreich"], 
    countryVotes: {
      DE: { agree: 5000, neutral: 900, disagree: 600 },
      FR: { agree: 1800, neutral: 400, disagree: 200 },
      EU: { agree: 1200, neutral: 200, disagree: 100 }
    },
    votes: {
      agree: 8000,
      neutral: 1500,
      disagree: 900
    },
    userVote: "agree",
    date: "2025-07-25",
    facts: [
      "Deutschland: 53 % befürworten kontrollierte Zuwanderung.",
      "Frankreich: 48 % für strengere Grenzkontrollen."
    ],
    alternatives: [
      { text: "Individuelle Förderprogramme" },
      { text: "Mehr Integration an Schulen" }
    ]
  },
  {
    id: "statement-002",
    title: "Soll die EU ihre Außengrenzen weiter ausbauen und besser schützen?",
    category: "Grenzschutz",
    regionScope: ["Deutschland", "EU", "SP"], 
    countries: ["DE", "SP", "EU"],
    countryVotes: {
      DE: { agree: 2100, neutral: 1400, disagree: 800 },
      SP: { agree: 1400, neutral: 900, disagree: 900 },
      EU: { agree: 1000, neutral: 700, disagree: 300 }
    },
    votes: {
      agree: 4500,
      neutral: 3000,
      disagree: 2000
    },
    userVote: "neutral",
    date: "2025-07-25",
    facts: [
      "EU: 31 Staaten mit gemeinsamen Außengrenzen.",
      "Schutz der EU-Grenzen ist eine Kernkompetenz."
    ],
    alternatives: [
      { text: "Mehr Fokus auf Integration statt Grenzausbau" },
      { text: "EU-weite Abstimmung der Grenzpolitik" }
    ]
  }
];
