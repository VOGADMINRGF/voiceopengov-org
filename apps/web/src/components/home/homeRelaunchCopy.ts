type Item = { title: string; body: string };

export type HomeRelaunchCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  ctaJoin: string;
  ctaModel: string;
  whyEyebrow: string;
  whyTitle: string;
  whyLead: string;
  whyItems: Item[];
  bridge: string;
  ecosystemEyebrow: string;
  ecosystemTitle: string;
  ecosystemBody: string;
  ecosystemItems: Item[];
  edebatteTitle: string;
  edebatteBody: string;
  edebatteCta: string;
  regionalTitle: string;
  regionalBody: string;
  regionalItems: Item[];
  trustTitle: string;
  trustBody: string;
  trustItems: string[];
  questionsTitle: string;
  questionsBody: string;
  questionsCta: string;
  joinTitle: string;
  joinBody: string;
  joinCta: string;
  supportTitle: string;
  supportBody: string;
  supportCta: string;
};

export const HOME_RELAUNCH_COPY: Record<"de" | "en", HomeRelaunchCopy> = {
  de: {
    eyebrow: "VoiceOpenGov",
    title: "Gemeinsam für informierte demokratische Beteiligung.",
    intro:
      "VoiceOpenGov ist eine politische Bürger- und Mitgliederbewegung im Aufbau. Ein nach veröffentlichten Regeln gültig abgeschlossenes eDebatte-Ergebnis wird im jeweiligen Geltungsbereich zum bindenden Repräsentationsauftrag; Mehrheit, relevante Minderheiten und spätere Änderungen bleiben nachvollziehbar.",
    ctaJoin: "Mitmachen",
    ctaModel: "Warum das fehlt",
    whyEyebrow: "Gesellschaftliche Lücke",
    whyTitle: "Viele Akteure. Oft fehlt die durchgängige Verbindung.",
    whyLead:
      "Parteien, direkte Demokratie, Wissensplattformen und digitale Bürgerbeteiligung erfüllen jeweils wichtige Aufgaben. Häufig fehlt eine nachvollziehbare Spur vom Verstehen über Evidenz, Beteiligung und eine gültige Entscheidung bis zur politischen Repräsentation und Wirkung.",
    whyItems: [
      { title: "Parteien", body: "Bündeln Programme, Interessen und Personal." },
      { title: "Direkte Demokratie", body: "Entscheidet konkrete Sachfragen, wo entsprechende Verfahren vorgesehen sind." },
      { title: "Wissensplattformen", body: "Strukturieren Informationen und Quellen." },
      { title: "Bürgerbeteiligung", body: "Organisiert häufig einzelne Verfahren von Verwaltungen oder Institutionen." },
    ],
    bridge:
      "VoiceOpenGov soll diese Systeme nicht ersetzen. eDebatte bleibt der unabhängige Evidenz-, Beteiligungs- und Entscheidungsraum; VoiceOpenGov übernimmt für gültig abgeschlossene Entscheidungen innerhalb ihres definierten Geltungsbereichs die politische Repräsentation und Umsetzungsverfolgung.",
    ecosystemEyebrow: "Rollen & Angebote",
    ecosystemTitle: "Eine Bewegung. Getrennte Rollen und Werkzeuge.",
    ecosystemBody:
      "eDebatte strukturiert Quellen, Gegenpositionen, Alternativen und Beteiligung unabhängig von VoiceOpenGov. Erst ein gültig abgeschlossenes Verfahren bindet die zuständige VoiceOpenGov-Repräsentation; Entwürfe, laufende Debatten und informelle Stimmungsbilder tun das nicht.",
    ecosystemItems: [
      {
        title: "VoiceOpenGov Bewegung",
        body: "Mitglieder und regionale Communities bringen Themen, Thesen und Gegenpositionen ein. Der aktuelle, versionierte Programmstand bildet gültige eDebatte-Mandate in ihrem jeweiligen Geltungsbereich ab; die rechtliche Trägerstruktur befindet sich noch im Aufbau.",
      },
      {
        title: "eDebatte",
        body: "Unabhängige offene Infrastruktur für Entscheidungsdossiers, Aussagen, Gegenpositionen, Quellen, Alternativen und Beteiligung – nutzbar auch außerhalb von VoiceOpenGov.",
      },
      {
        title: "Regionale Präsenz",
        body: "Im Aufbau: lokale Teams, Treffen und Beteiligungsformate. Hubs und mobile Formate kommen nur dort hinzu, wo sie tatsächlich aufgebaut wurden.",
      },
      {
        title: "Programm & Wirkung",
        body: "Im Aufbau: versionierte Projektion gültiger Mandate mit Scope, Mehrheits- und Minderheitenbild, Verantwortlichkeit, Umsetzungsstand und nachvollziehbarer Wirkung.",
      },
      {
        title: "Data & Media Services",
        body: "Perspektive: APIs, Dashboards und redaktionelle Werkzeuge für nachvollziehbare öffentliche Informationen.",
      },
    ],
    edebatteTitle: "eDebatte bleibt unabhängig – und gültige Entscheidungen binden VoiceOpenGov.",
    edebatteBody:
      "Aus Quellen werden strukturierte Aussagen, Gegenpositionen, Alternativen und offene Unsicherheiten. Dasselbe Dossier kann von Bürgern, Medien, Wissenschaft, Kommunen oder anderen Organisationen genutzt werden. Erst wenn ein Verfahren nach seinen veröffentlichten Regeln gültig abgeschlossen ist, wird das Ergebnis für die zuständige VoiceOpenGov-Repräsentation im definierten Geltungsbereich verbindlich.",
    edebatteCta: "eDebatte öffnen",
    regionalTitle: "Digital reicht nicht. Repräsentation braucht regionale Präsenz.",
    regionalBody:
      "VoiceOpenGov will regionale Communities, Teams und wiederkehrende Formate aufbauen. Beteiligungsorte, Hubs oder mobile Angebote werden erst als verfügbar bezeichnet, wenn sie tatsächlich bestehen.",
    regionalItems: [
      { title: "Teams & Treffen", body: "Lokaler Austausch, Beteiligung und Aufbau regionaler Communities in nachvollziehbar organisierten Formaten." },
      { title: "Beteiligungsorte", body: "Perspektive für wiederkehrende lokale Anlaufpunkte und Formate, sobald sie real aufgebaut und verifiziert sind." },
      { title: "Mobil vor Ort", body: "Perspektive für mobile Formate und Busse – kein flächendeckendes Versprechen, solange die Struktur nicht besteht." },
    ],
    trustTitle: "Vertrauen beginnt bei der eigenen Architektur.",
    trustBody:
      "Finanzierung, Quellen, KI-Einsatz, Entscheidungsregeln, Geltungsbereich, Beteiligung, Programmversionen, Minderheitenpositionen und Umsetzung sollen nachvollziehbar bleiben – einschließlich offener Lücken und Aufbauphasen.",
    trustItems: ["Finanzierung", "Quellen", "KI-Einsatz", "Entscheidungen", "Governance", "Wirkung"],
    questionsTitle: "50 große Fragen. Kein eingefrorenes Programm.",
    questionsBody:
      "Die Kernfragen strukturieren den Einstieg. Konkrete, entscheidungsfähige Teilfragen werden in eDebatte evidenzbasiert bearbeitet; ein später gültiger Entscheid kann den versionierten VoiceOpenGov-Programmstand ergänzen, ersetzen oder erneut öffnen.",
    questionsCta: "50 Fragen ansehen",
    joinTitle: "Den passenden Einstieg wählen.",
    joinBody:
      "Mitgliedschaft, aktive Mitarbeit an öffentlichen Fragen und regionale Mitwirkung sind unterschiedliche Wege. Die Mitmachen-Seite erklärt transparent, was heute bereits möglich ist und was noch aufgebaut wird.",
    joinCta: "Mitmachen ansehen",
    supportTitle: "Aufbau ermöglichen, ohne Einfluss zu verkaufen.",
    supportBody:
      "Freiwillige finanzielle Unterstützung verändert weder Stimmgewicht noch politische oder redaktionelle Rechte und ist von der Mitgliedschaft getrennt.",
    supportCta: "Unterstützen",
  },
  en: {
    eyebrow: "VoiceOpenGov",
    title: "Together for informed democratic participation.",
    intro:
      "VoiceOpenGov is a civic and membership movement being built. An eDebatte decision validly concluded under published rules becomes the binding representation mandate within its defined scope; the majority, relevant minority positions and later changes remain traceable.",
    ctaJoin: "Participate",
    ctaModel: "Why this matters",
    whyEyebrow: "Societal gap",
    whyTitle: "Many actors. The continuous connection is often missing.",
    whyLead:
      "Parties, direct democracy, knowledge platforms and digital civic participation each serve important roles. What is often missing is a traceable path from understanding through evidence, participation and a valid decision to political representation and impact.",
    whyItems: [
      { title: "Parties", body: "Bundle programmes, interests and personnel." },
      { title: "Direct democracy", body: "Decides specific public questions where corresponding procedures exist." },
      { title: "Knowledge platforms", body: "Structure information and sources." },
      { title: "Civic participation", body: "Often organises individual procedures run by administrations or institutions." },
    ],
    bridge:
      "VoiceOpenGov is not intended to replace these systems. eDebatte remains the independent evidence, participation and decision space; VoiceOpenGov takes responsibility for political representation and implementation tracking of validly concluded decisions within their defined scope.",
    ecosystemEyebrow: "Roles & services",
    ecosystemTitle: "One movement. Separate roles and tools.",
    ecosystemBody:
      "eDebatte structures sources, counterpositions, alternatives and participation independently of VoiceOpenGov. Only a validly concluded process binds the responsible VoiceOpenGov representation; drafts, ongoing deliberation and informal sentiment do not.",
    ecosystemItems: [
      {
        title: "VoiceOpenGov movement",
        body: "Members and regional communities bring forward topics, theses and counterpositions. The current versioned programme state projects valid eDebatte mandates within their respective scope; the final legal entity structure is still being established.",
      },
      {
        title: "eDebatte",
        body: "Independent open infrastructure for decision dossiers, claims, counterpositions, sources, alternatives and participation — usable beyond VoiceOpenGov.",
      },
      {
        title: "Regional presence",
        body: "Being built: local teams, meetings and participation formats. Hubs and mobile formats are only presented as available where they actually exist.",
      },
      {
        title: "Programme & impact",
        body: "Being built: a versioned projection of valid mandates with scope, majority and minority positions, responsibility, implementation state and traceable impact.",
      },
      {
        title: "Data & Media Services",
        body: "Planned: APIs, dashboards and newsroom tools for traceable public information.",
      },
    ],
    edebatteTitle: "eDebatte remains independent — and valid decisions bind VoiceOpenGov.",
    edebatteBody:
      "Sources become structured claims, counterpositions, alternatives and visible uncertainty. The same dossier can be used by citizens, media, science, municipalities or other organisations. Only when a process is validly concluded under its published rules does its result become binding for the responsible VoiceOpenGov representation within the defined scope.",
    edebatteCta: "Open eDebatte",
    regionalTitle: "Digital is not enough. Representation needs regional presence.",
    regionalBody:
      "VoiceOpenGov intends to build regional communities, teams and recurring formats. Participation venues, hubs or mobile offers are only described as available once they actually exist.",
    regionalItems: [
      { title: "Teams & meetings", body: "Local exchange, participation and regional community building in transparently organised formats." },
      { title: "Participation venues", body: "A future option for recurring local touchpoints and formats once they are genuinely built and verified." },
      { title: "Mobile presence", body: "A future option for mobile formats and buses — not a broad operating claim before the structure exists." },
    ],
    trustTitle: "Trust starts with our own architecture.",
    trustBody:
      "Funding, sources, AI use, decision rules, scope, participation, programme versions, minority positions and implementation should remain traceable — including open gaps and work in progress.",
    trustItems: ["Funding", "Sources", "AI use", "Decisions", "Governance", "Impact"],
    questionsTitle: "50 major questions. No frozen programme.",
    questionsBody:
      "The core questions structure the starting point. Concrete decision-ready subquestions are worked through in eDebatte with evidence; a later valid decision can add to, replace or reopen the versioned VoiceOpenGov programme state.",
    questionsCta: "View 50 questions",
    joinTitle: "Choose the right way to participate.",
    joinBody:
      "Membership, active work on public questions and regional participation are different paths. The participation page explains transparently what is available today and what is still being built.",
    joinCta: "Explore participation",
    supportTitle: "Enable the build without selling influence.",
    supportBody:
      "Voluntary financial support changes neither voting weight nor political or editorial rights and remains separate from membership.",
    supportCta: "Support",
  },
};
