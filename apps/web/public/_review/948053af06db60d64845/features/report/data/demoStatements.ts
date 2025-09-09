// features/statement/data/statements_demo.ts

export const demoStatements = [
  {
    id: "statement-001",
    title: "Soll Deutschland die Integration von Geflüchteten durch verpflichtende Sprachkurse fördern?",
    shortText: "Integration Geflüchteter durch Sprachkurse",
    category: "Integration",
    tags: ["Integration", "Sprachkurse", "Migration"],
    votes: {
      DE: { agree: 5000, neutral: 900, disagree: 600 },
      FR: { agree: 1800, neutral: 400, disagree: 200 },
      EU: { agree: 1200, neutral: 200, disagree: 100 }
    },
    userVote: "agree", // "agree" | "neutral" | "disagree"
    impactBar: [
      { label: "Zustimmung", value: 75.2, color: "#0cb13b" },
      { label: "Neutral", value: 10.6, color: "#e5b300" },
      { label: "Ablehnung", value: 14.2, color: "#ea3c3c" }
    ],
    countryList: [
      { code: "DE", label: "Deutschland", values: [5000, 900, 600] },
      { code: "FR", label: "Frankreich", values: [1800, 400, 200] },
      { code: "EU", label: "EU", values: [1200, 200, 100] }
    ],
    myImpact: "Zustimmung 👍",
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
  // Beispiel #2
  {
    id: "statement-002",
    title: "Soll die EU ihre Außengrenzen weiter ausbauen und besser schützen?",
    shortText: "EU-Grenzschutz verstärken",
    category: "Grenzschutz",
    tags: ["EU", "Grenzen", "Sicherheit"],
    votes: {
      DE: { agree: 2100, neutral: 1400, disagree: 800 },
      FR: { agree: 1400, neutral: 900, disagree: 900 },
      EU: { agree: 1000, neutral: 700, disagree: 300 }
    },
    userVote: "neutral",
    impactBar: [
      { label: "Zustimmung", value: 50.5, color: "#0cb13b" },
      { label: "Neutral", value: 18.3, color: "#e5b300" },
      { label: "Ablehnung", value: 31.2, color: "#ea3c3c" }
    ],
    countryList: [
      { code: "DE", label: "Deutschland", values: [2100, 1400, 800] },
      { code: "FR", label: "Frankreich", values: [1400, 900, 900] },
      { code: "EU", label: "EU", values: [1000, 700, 300] }
    ],
    myImpact: "Neutral 🤔",
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
  // Du kannst beliebig viele weitere Statements ergänzen
];
