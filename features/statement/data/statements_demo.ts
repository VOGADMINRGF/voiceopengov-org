// features/statement/data/statements_demo.ts

export const demoStatements = [
    {
      id: "statement-001",
      title: "Soll Deutschland die Integration von Geflüchteten durch verpflichtende Sprachkurse fördern?",
      shortText: "Integration Geflüchteter durch Sprachkurse",
      category: "Integration",
      tags: ["Integration", "Sprachkurse", "Migration"],
      // Stimmen pro Land (Kürzel)
      votes: {
        DE: { agree: 5000, neutral: 900, disagree: 600 },
        FR: { agree: 1800, neutral: 400, disagree: 200 },
        EU: { agree: 1200, neutral: 200, disagree: 100 }
      },
      // Summen über alle Länder
      votesTotal: {
        agree: 8000,
        neutral: 1500,
        disagree: 900
      },
      userVote: "agree", // "agree" | "neutral" | "disagree"
      // Voting-Eventualitäten (Entscheidungsbaum)
      eventualities: [
        {
          option: "Pflichtkurse für alle",
          votes: { agree: 4500, neutral: 900, disagree: 1100 },
          impact: [
            { type: "gesellschaftlich", description: "Fördert Zusammenhalt, aber kann Widerstand hervorrufen." },
            { type: "wirtschaftlich", description: "Bessere Jobchancen, weniger Sozialausgaben." }
          ]
        },
        {
          option: "Freiwillige Kurse, mehr Anreize",
          votes: { agree: 2900, neutral: 200, disagree: 400 },
          impact: [
            { type: "sozial", description: "Weniger Zwang, aber geringere Teilnahme." }
          ]
        },
        {
          option: "Individuelle Lösungen",
          votes: { agree: 800, neutral: 100, disagree: 300 },
          impact: [
            { type: "sozial", description: "Höhere Risiken von Ausgrenzung." }
          ]
        }
      ],
      impactSummary: {
        gesellschaftlich: "Verpflichtende Kurse erhöhen Zusammenhalt, bringen aber auch Debatte über Zwang.",
        sozial: "Mehr Teilhabe, aber auch Frustration bei Überforderung.",
        kulturell: "Sprache als Schlüssel zur Identität – Vielfalt und Integration stehen im Spannungsfeld."
      },
      voices: [
        {
          type: "media",
          name: "Süddeutsche Zeitung",
          quote: "Deutsch als Brücke zur Gesellschaft.",
          url: "https://sueddeutsche.de/migration",
          country: "DE",
          trustScore: 0.82
        },
        {
          type: "science",
          name: "DIW",
          quote: "Langfristige Integration sichert Wachstum.",
          url: "https://diw.de/integration",
          country: "DE",
          trustScore: 0.92
        }
      ],
      editorialSummary: {
        pro: [
          "Pflichtkurse verhindern Ausgrenzung und Parallelgesellschaften.",
          "Sprache als Türöffner für Teilhabe und Arbeitsmarkt."
        ],
        contra: [
          "Zwang kann Widerstand erzeugen.",
          "Nicht alle Geflüchteten haben gleiche Voraussetzungen."
        ],
        neutral: [
          "Integration ist ein Prozess – beide Seiten müssen sich öffnen."
        ]
      },
      relevanceFor: {
        citizen: "Mitbestimmung bei zentralen gesellschaftlichen Weichenstellungen.",
        youth: "Chancengleichheit und Teilhabe für alle.",
        business: "Fachkräfte sichern, Integration fördern.",
        ngo: "Soziale Begleitung und politische Teilhabe für Minderheiten."
      },
      myImpact: "Zustimmung 👍",
      date: "2025-07-25",
      facts: [
        {
          text: "Deutschland: 53 % befürworten kontrollierte Zuwanderung.",
          source: { name: "Statistisches Bundesamt", url: "https://destatis.de", trust: 0.9 }
        },
        {
          text: "Frankreich: 48 % für strengere Grenzkontrollen.",
          source: { name: "INSEE", url: "https://www.insee.fr", trust: 0.8 }
        }
      ],
      alternatives: [
        { text: "Individuelle Förderprogramme", impact: "Flexible Lösung, weniger Teilnahme" },
        { text: "Mehr Integration an Schulen", impact: "Langfristig wirksam, aufwendig" }
      ]
    },
    export const demoStatements = [
        {
          // ...alle Kernfelder wie oben,
          // Nobelpreis- und Redaktionsfelder (optional, keine Pflicht, aber ready für alle Usecases):
          regionalVoices: [
            {
              region: "Bayern",
              author: "Max Mustermann",
              authorId: "user-4711",
              role: "local_journalist",
              medium: "Münchner Merkur",
              verified: true,
              statement: "Gerade im ländlichen Raum zeigen Sprachpatenschaften enorme Wirkung.",
              impactAssessment: {
                gesellschaftlich: "Erhöhte Teilhabe",
                wirtschaftlich: "Stärkere Einbindung in Arbeitsmarkt"
              },
              submittedAt: "2025-07-28T15:32:00Z",
              redaktionFreigabe: false
            }
          ],
          localJournalism: {
            authors: [
              {
                id: "user-4711",
                name: "Max Mustermann",
                role: "local_journalist",
                medium: "Münchner Merkur",
                bio: "Seit 2012 Politikredakteur, Fokus auf Jugendbeteiligung.",
                verified: true
              }
            ],
            contribution: "Bringt empirische Erkenntnisse aus Oberbayern ein.",
            commentary: [
              {
                authorId: "user-4711",
                text: "Wahlalter 16 könnte gerade auf dem Land zur neuen Jugendbewegung führen.",
                date: "2025-07-28T15:40:00Z"
              }
            ],
            status: "pending_review",
            redaktionFreigabe: false
          },
          reviewedBy: ["editor-in-chief"],
          reviewStatus: "pending",
          redaktionFreigabe: false,
          createdBy: "user-42",
          createdAt: "2025-07-27T08:00:00Z",
          updatedAt: "2025-07-28T16:00:00Z"
        }
      ];
   
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
      votesTotal: {
        agree: 4500,
        neutral: 3000,
        disagree: 2000
      },
      userVote: "neutral",
      eventualities: [
        {
          option: "Grenzausbau mit High-Tech",
          votes: { agree: 2000, neutral: 700, disagree: 800 },
          impact: [
            { type: "sicherheit", description: "Effektivere Kontrolle, aber höhere Kosten und Debatte über Menschenrechte." }
          ]
        },
        {
          option: "Fokus auf Integration an Grenzen",
          votes: { agree: 1800, neutral: 1300, disagree: 700 },
          impact: [
            { type: "gesellschaftlich", description: "Mehr Perspektiven für Geflüchtete, gesellschaftliche Debatte bleibt kontrovers." }
          ]
        }
      ],
      impactSummary: {
        gesellschaftlich: "Strikter Grenzschutz polarisiert die Gesellschaft.",
        wirtschaftlich: "Erhöhte Kosten, kurzfristige Stabilität.",
        menschenrechtlich: "Risiko von Menschenrechtsverletzungen steigt."
      },
      voices: [
        {
          type: "media",
          name: "Tagesschau",
          quote: "EU setzt zunehmend auf digitale Grenzsicherung.",
          url: "https://tagesschau.de/eu-grenzen",
          country: "EU",
          trustScore: 0.85
        },
        {
          type: "ngo",
          name: "Amnesty International",
          quote: "Grenzschutz darf nicht auf Kosten von Menschenrechten gehen.",
          url: "https://amnesty.de/grenzschutz",
          country: "EU",
          trustScore: 0.9
        }
      ],
      editorialSummary: {
        pro: [
          "Grenzsicherheit schützt vor irregulärer Migration.",
          "Digitale Kontrollen ermöglichen bessere Steuerung."
        ],
        contra: [
          "Gefahr der Abschottung und Menschenrechtsverletzungen.",
          "Kosten und technische Komplexität sind hoch."
        ],
        neutral: [
          "Die Balance zwischen Schutz und Offenheit bleibt Herausforderung."
        ]
      },
      relevanceFor: {
        policymaker: "Entscheidungen wirken sich unmittelbar auf Schutz, Migration und Rechte aus.",
        citizen: "Wichtige Debatte für Zukunft der EU-Gesellschaft.",
        ngo: "Wächterfunktion für Grundrechte.",
        business: "Stabilität des Wirtschaftsraums EU ist betroffen."
      },
      myImpact: "Neutral 🤔",
      date: "2025-07-25",
      facts: [
        {
          text: "EU: 31 Staaten mit gemeinsamen Außengrenzen.",
          source: { name: "Eurostat", url: "https://ec.europa.eu", trust: 0.87 }
        },
        {
          text: "Schutz der EU-Grenzen ist eine Kernkompetenz.",
          source: { name: "EU-Kommission", url: "https://europa.eu", trust: 0.85 }
        }
      ],
      alternatives: [
        { text: "Mehr Fokus auf Integration statt Grenzausbau", impact: "Offenere Gesellschaft, aber Risiko von Unsicherheit" },
        { text: "EU-weite Abstimmung der Grenzpolitik", impact: "Harmonisierung, aber komplexer Konsensprozess" }
      ]
    }export const demoStatements = [
        {
          // ...alle Kernfelder wie oben,
          // Nobelpreis- und Redaktionsfelder (optional, keine Pflicht, aber ready für alle Usecases):
          regionalVoices: [
            {
              region: "Bayern",
              author: "Max Mustermann",
              authorId: "user-4711",
              role: "local_journalist",
              medium: "Münchner Merkur",
              verified: true,
              statement: "Gerade im ländlichen Raum zeigen Sprachpatenschaften enorme Wirkung.",
              impactAssessment: {
                gesellschaftlich: "Erhöhte Teilhabe",
                wirtschaftlich: "Stärkere Einbindung in Arbeitsmarkt"
              },
              submittedAt: "2025-07-28T15:32:00Z",
              redaktionFreigabe: false
            }
          ],
          localJournalism: {
            authors: [
              {
                id: "user-4711",
                name: "Max Mustermann",
                role: "local_journalist",
                medium: "Münchner Merkur",
                bio: "Seit 2012 Politikredakteur, Fokus auf Jugendbeteiligung.",
                verified: true
              }
            ],
            contribution: "Bringt empirische Erkenntnisse aus Oberbayern ein.",
            commentary: [
              {
                authorId: "user-4711",
                text: "Wahlalter 16 könnte gerade auf dem Land zur neuen Jugendbewegung führen.",
                date: "2025-07-28T15:40:00Z"
              }
            ],
            status: "pending_review",
            redaktionFreigabe: false
          },
          reviewedBy: ["editor-in-chief"],
          reviewStatus: "pending",
          redaktionFreigabe: false,
          createdBy: "user-42",
          createdAt: "2025-07-27T08:00:00Z",
          updatedAt: "2025-07-28T16:00:00Z"
        }
      ];

    // Du kannst beliebig viele weitere Statements ergänzen
  ];
  