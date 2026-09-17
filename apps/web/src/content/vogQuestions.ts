export type QuestionText = {
  id: `vog-question-${string}`;
  de: string;
  en: string;
};

export type QuestionGroup = {
  id: `vog-group-${string}`;
  title: { de: string; en: string };
  questions: QuestionText[];
};

export const VOG_QUESTION_GROUPS: QuestionGroup[] = [
  {
    id: "vog-group-democracy-rights",
    title: { de: "Demokratie, Grundrechte und Macht", en: "Democracy, rights and power" },
    questions: [
      { id: "vog-question-01", de: "Welche Grund- und Freiheitsrechte müssen auch gegenüber demokratischen Mehrheiten besonders geschützt bleiben?", en: "Which fundamental rights and freedoms require special protection even against democratic majorities?" },
      { id: "vog-question-02", de: "Wie soll verbindliche Bürgerbeteiligung zwischen Wahlen funktionieren und wo liegen ihre Grenzen?", en: "How should binding public participation work between elections, and where should its limits lie?" },
      { id: "vog-question-03", de: "Welche Mehrheiten, Quoren und Schutzregeln sollen je nach Tragweite einer Entscheidung gelten?", en: "Which majorities, quorums and safeguards should apply depending on the impact of a decision?" },
      { id: "vog-question-04", de: "Wie bleiben Minderheiten wirksam geschützt, ohne den demokratisch festgestellten Mehrheitswillen dauerhaft zu blockieren?", en: "How can minorities remain effectively protected without permanently blocking a democratically established majority will?" },
      { id: "vog-question-05", de: "Wie müssen politische Zuständigkeit, Verantwortung und Umsetzung so dokumentiert werden, dass sie für Bürger nachvollziehbar bleiben?", en: "How should political authority, responsibility and implementation be documented so citizens can trace them?" },
    ],
  },
  {
    id: "vog-group-state-administration-finance",
    title: { de: "Staat, Verwaltung und öffentliche Finanzen", en: "Government, administration and public finance" },
    questions: [
      { id: "vog-question-06", de: "Welche Aufgaben gehören sinnvoll auf kommunale, regionale, nationale oder europäische Ebene?", en: "Which responsibilities are best handled at municipal, regional, national or European level?" },
      { id: "vog-question-07", de: "Wo brauchen wir einheitliche Standards und wo mehr lokale oder regionale Entscheidungsfreiheit?", en: "Where do we need common standards, and where should local or regional decision-making have more freedom?" },
      { id: "vog-question-08", de: "Wie sollen Steuern, öffentliche Ausgaben und Verschuldung priorisiert und demokratisch kontrolliert werden?", en: "How should taxes, public spending and debt be prioritised and democratically controlled?" },
      { id: "vog-question-09", de: "Welche staatlichen Leistungen sollen digital, analog oder grundsätzlich auf beiden Wegen erreichbar sein?", en: "Which public services should be digital, analogue, or always accessible through both channels?" },
      { id: "vog-question-10", de: "Welche Transparenz-, Lobby- und Antikorruptionsregeln braucht ein nachvollziehbarer Staat?", en: "Which transparency, lobbying and anti-corruption rules does a traceable government need?" },
    ],
  },
  {
    id: "vog-group-economy-work-social",
    title: { de: "Wirtschaft, Arbeit und soziale Sicherheit", en: "Economy, work and social security" },
    questions: [
      { id: "vog-question-11", de: "Wie sollen Steuern, Wettbewerb und Regulierung gestaltet sein, damit Wertschöpfung, Innovation und faire Chancen zusammenpassen?", en: "How should taxation, competition and regulation balance value creation, innovation and fair opportunity?" },
      { id: "vog-question-12", de: "Welche Regeln für Löhne, Arbeitszeit, Tarifbindung und flexible Arbeit schaffen einen fairen Ausgleich zwischen Beschäftigten und Unternehmen?", en: "Which rules for wages, working time, collective bargaining and flexible work create a fair balance between workers and businesses?" },
      { id: "vog-question-13", de: "Welche soziale Mindestsicherung soll jedem Menschen zustehen und welche Erwartungen dürfen damit verbunden sein?", en: "What minimum social protection should every person receive, and what expectations may reasonably accompany it?" },
      { id: "vog-question-14", de: "Wie soll Alterssicherung langfristig finanzierbar, verlässlich und generationengerecht organisiert werden?", en: "How should retirement security be organised to remain affordable, reliable and fair across generations?" },
      { id: "vog-question-15", de: "Woran sollen Wohlstand, gesellschaftlicher Fortschritt und Verteilungsgerechtigkeit gemessen werden?", en: "How should prosperity, social progress and distributive fairness be measured?" },
    ],
  },
  {
    id: "vog-group-health-care-family",
    title: { de: "Gesundheit, Pflege und Familie", en: "Health, care and family" },
    questions: [
      { id: "vog-question-16", de: "Wie soll eine hochwertige Gesundheitsversorgung finanziert und für alle verlässlich zugänglich bleiben?", en: "How should high-quality healthcare be funded and remain reliably accessible to everyone?" },
      { id: "vog-question-17", de: "Wie sollen ambulante Versorgung, Krankenhäuser und Notfallversorgung regional zusammenspielen?", en: "How should primary care, hospitals and emergency care work together across regions?" },
      { id: "vog-question-18", de: "Wie organisieren und finanzieren wir Pflege so, dass Würde, Qualität, Angehörige und Fachkräfte gleichermaßen berücksichtigt werden?", en: "How should care be organised and funded to respect dignity, quality, families and care professionals alike?" },
      { id: "vog-question-19", de: "Welche Rolle sollen Prävention, Eigenverantwortung und solidarische Finanzierung im Gesundheitssystem jeweils spielen?", en: "What roles should prevention, personal responsibility and solidarity-based funding play in healthcare?" },
      { id: "vog-question-20", de: "Welche Rahmenbedingungen brauchen Kinder, Familien und Jugendliche für verlässliche Teilhabe und Entwicklungschancen?", en: "Which conditions do children, families and young people need for reliable participation and development opportunities?" },
    ],
  },
  {
    id: "vog-group-education-research-culture",
    title: { de: "Bildung, Forschung, Medien und Kultur", en: "Education, research, media and culture" },
    questions: [
      { id: "vog-question-21", de: "Welche Bildungsstandards sollen überall gelten und welche Unterschiede zwischen Regionen oder Schulformen sind sinnvoll?", en: "Which education standards should apply everywhere, and which regional or school-level differences are useful?" },
      { id: "vog-question-22", de: "Wie sollen frühkindliche Bildung, Schule, Ausbildung und lebenslanges Lernen ineinandergreifen?", en: "How should early education, school, vocational training and lifelong learning connect?" },
      { id: "vog-question-23", de: "Welche Rolle sollen politische Bildung, Medienkompetenz, Quellenprüfung und demokratische Entscheidungsfähigkeit spielen?", en: "What role should civic education, media literacy, source checking and democratic decision skills play?" },
      { id: "vog-question-24", de: "Wie viel öffentliche Förderung brauchen Forschung und Innovation und wie sichern wir dabei Freiheit, Offenheit und Transfer?", en: "How much public support should research and innovation receive, and how do we protect freedom, openness and transfer?" },
      { id: "vog-question-25", de: "Wie sollen unabhängige Medien, öffentlich finanzierte Angebote, Kultur und Meinungsvielfalt in einer digitalen Öffentlichkeit gesichert werden?", en: "How should independent media, publicly funded services, culture and pluralism be sustained in a digital public sphere?" },
    ],
  },
  {
    id: "vog-group-housing-transport-infrastructure",
    title: { de: "Wohnen, Verkehr und Infrastruktur", en: "Housing, transport and infrastructure" },
    questions: [
      { id: "vog-question-26", de: "Wie schaffen wir ausreichend bezahlbaren Wohnraum und welche Rolle sollen Markt, öffentliche Hand und gemeinwohlorientierte Träger spielen?", en: "How do we create enough affordable housing, and what roles should markets, public authorities and public-interest providers play?" },
      { id: "vog-question-27", de: "Wie sollen Flächen für Wohnen, Gewerbe, Natur, Landwirtschaft und öffentliche Infrastruktur gegeneinander abgewogen werden?", en: "How should land for housing, business, nature, agriculture and public infrastructure be balanced?" },
      { id: "vog-question-28", de: "Welche Prioritäten sollen öffentlicher Verkehr, Auto, Fahrrad und Fußverkehr in unterschiedlichen Regionen erhalten?", en: "What priorities should public transport, cars, cycling and walking receive in different regions?" },
      { id: "vog-question-29", de: "Wie sollen Bahn, Straßen, Netze und andere kritische Infrastruktur finanziert, erhalten und modernisiert werden?", en: "How should rail, roads, networks and other critical infrastructure be funded, maintained and modernised?" },
      { id: "vog-question-30", de: "Welche öffentlichen Angebote müssen auch in ländlichen oder strukturschwachen Regionen verlässlich erreichbar bleiben?", en: "Which public services must remain reliably accessible in rural or structurally weaker regions?" },
    ],
  },
  {
    id: "vog-group-climate-energy-resources",
    title: { de: "Klima, Energie, Umwelt und Ernährung", en: "Climate, energy, environment and food" },
    questions: [
      { id: "vog-question-31", de: "Welche Klimaziele sollen gelten und mit welchen Instrumenten sollen sie erreicht, überprüft und angepasst werden?", en: "Which climate targets should apply, and which instruments should be used to achieve, review and adjust them?" },
      { id: "vog-question-32", de: "Wie sollen Versorgungssicherheit, Energiepreise, Klimaschutz und technologische Offenheit beim Energiemix gewichtet werden?", en: "How should security of supply, energy prices, climate goals and technological openness be balanced in the energy mix?" },
      { id: "vog-question-33", de: "Wie viel Schutz brauchen Natur, Wasser, Böden und Artenvielfalt und wie werden Nutzungskonflikte entschieden?", en: "How much protection do nature, water, soils and biodiversity require, and how should conflicts over use be decided?" },
      { id: "vog-question-34", de: "Welche Regeln für Landwirtschaft, Tierhaltung, Lebensmittelqualität und Preise schaffen einen tragfähigen Ausgleich?", en: "Which rules for agriculture, animal welfare, food quality and prices create a sustainable balance?" },
      { id: "vog-question-35", de: "Wie reduzieren wir Rohstoffverbrauch und Abfall und welche Verantwortung tragen Produzenten, Verbraucher und Staat?", en: "How should resource use and waste be reduced, and what responsibilities should producers, consumers and government bear?" },
    ],
  },
  {
    id: "vog-group-digital-ai-data",
    title: { de: "Digitalisierung, Daten und KI", en: "Digitalisation, data and AI" },
    questions: [
      { id: "vog-question-36", de: "Wie sollen Datenschutz, Datennutzung, offene Daten und gesellschaftlicher Nutzen miteinander ausbalanciert werden?", en: "How should privacy, data use, open data and public benefit be balanced?" },
      { id: "vog-question-37", de: "Welche digitale Identität und welche digitalen Verwaltungsdienste braucht eine demokratische Gesellschaft?", en: "What kind of digital identity and digital public services does a democratic society need?" },
      { id: "vog-question-38", de: "Welche Entscheidungen dürfen KI-Systeme unterstützen oder automatisieren und wo muss menschliche Verantwortung zwingend bleiben?", en: "Which decisions may AI systems support or automate, and where must human responsibility remain mandatory?" },
      { id: "vog-question-39", de: "Welche Transparenz-, Haftungs- und Kontrollregeln brauchen Algorithmen und KI mit erheblicher gesellschaftlicher Wirkung?", en: "Which transparency, liability and oversight rules are needed for algorithms and AI with significant social impact?" },
      { id: "vog-question-40", de: "Wie sichern wir digitale Infrastruktur, Wettbewerb und Zugang, ohne neue private oder staatliche Machtmonopole zu schaffen?", en: "How do we secure digital infrastructure, competition and access without creating new private or state monopolies of power?" },
    ],
  },
  {
    id: "vog-group-migration-security-justice",
    title: { de: "Migration, Sicherheit und Rechtsstaat", en: "Migration, security and rule of law" },
    questions: [
      { id: "vog-question-41", de: "Welche Regeln sollen für Flucht, Asyl, Einwanderung und Rückkehr gelten und wie werden humanitäre, rechtliche und praktische Anforderungen verbunden?", en: "Which rules should govern refuge, asylum, immigration and return, and how should humanitarian, legal and practical requirements be combined?" },
      { id: "vog-question-42", de: "Welche Rechte, Pflichten und Wege zur gesellschaftlichen Teilhabe sollen Integration und Einbürgerung bestimmen?", en: "Which rights, duties and paths to participation should shape integration and citizenship?" },
      { id: "vog-question-43", de: "Welche Befugnisse brauchen Polizei und Sicherheitsbehörden und welche Kontrollen schützen Freiheitsrechte und Rechtsstaat?", en: "Which powers do police and security authorities need, and which controls protect civil liberties and the rule of law?" },
      { id: "vog-question-44", de: "Wie machen wir Justiz schnell, zugänglich und wirksam, ohne Unabhängigkeit und Verfahrensrechte zu schwächen?", en: "How can justice be made timely, accessible and effective without weakening independence and due process?" },
      { id: "vog-question-45", de: "Wie sollen Bevölkerungsschutz, Katastrophenvorsorge und Krisenentscheidungen organisiert und demokratisch kontrolliert werden?", en: "How should civil protection, disaster preparedness and crisis decisions be organised and democratically controlled?" },
    ],
  },
  {
    id: "vog-group-europe-world-future",
    title: { de: "Europa, Welt, Frieden und Zukunft", en: "Europe, the world, peace and the future" },
    questions: [
      { id: "vog-question-46", de: "Welche Aufgaben und Kompetenzen sollen künftig bei EU, Mitgliedstaaten, Regionen und Kommunen liegen?", en: "Which responsibilities and powers should in future lie with the EU, member states, regions and municipalities?" },
      { id: "vog-question-47", de: "Wie sollen Verteidigung, Bündnisse, zivile Sicherheit und demokratische Kontrolle miteinander verbunden werden?", en: "How should defence, alliances, civilian security and democratic oversight fit together?" },
      { id: "vog-question-48", de: "Nach welchen Regeln sollen Außen-, Handels- und Entwicklungspolitik Interessen, Menschenrechte, Frieden und gegenseitige Abhängigkeiten abwägen?", en: "By which rules should foreign, trade and development policy balance interests, human rights, peace and interdependence?" },
      { id: "vog-question-49", de: "Welche internationale Zusammenarbeit brauchen grenzüberschreitende Probleme, ohne demokratische Verantwortung unklar werden zu lassen?", en: "What international cooperation do cross-border problems require without making democratic accountability unclear?" },
      { id: "vog-question-50", de: "Wann und nach welchen Regeln muss eine frühere demokratische Entscheidung wegen neuer Evidenz, veränderter Umstände oder eines veränderten Mehrheitswillens erneut geöffnet werden?", en: "When and under which rules should an earlier democratic decision be reopened because of new evidence, changed circumstances or a changed majority will?" },
    ],
  },
];

export const VOG_QUESTION_COUNT = VOG_QUESTION_GROUPS.reduce(
  (total, group) => total + group.questions.length,
  0,
);
