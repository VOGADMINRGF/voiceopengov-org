import { DEFAULT_LOCALE, type SupportedLocale } from "@/config/locales";

type LocaleValue<T> = Record<"de", T> & Partial<Record<SupportedLocale, T>>;

const HERO_CHIPS = ["Direktdemokratisch", "Lokal", "National", "Weltweit"];
const HERO_LINES = ["Weniger reden.", "Mehr entscheiden."];
const HERO_ACCENT = "Dein Anliegen";
const HERO_SUFFIX = "– unsere Struktur.";

// Fokus auf VoiceOpenGov + weltgesellschaftliche Perspektive, eDebatte nur als Werkzeug
const HERO_INTRO =
  "VoiceOpenGov ist eine Initiative für eine weltweite Gesellschaft, die ihre Entscheidungen selbst besser trifft – digital und vor Ort. Wir verbinden direkte Beteiligung mit klaren Regeln, Auswertungen und Transparenz, damit Mehrheiten und Minderheiten fair sichtbar werden. Unser VOG-System führt Kontexte, Quellen und Einschätzungen aus vielen Richtungen zu einem neuen Entscheidungsstandard zusammen, der Entscheidungen strukturiert, dokumentiert und für alle nachvollziehbar macht – von der Nachbarschaftsfrage bis zur großen Weichenstellung. Wir sind kein Staat, keine Partei, kein Verein und keine Stiftung, sondern bauen eine unabhängige Struktur, die demokratische Mehrheiten sichtbar macht, ohne sich von großen Geldgebern oder Lobby-Interessen abhängig zu machen.";

const HERO_BULLETS = [
  "<strong>Direkte Beteiligung:</strong> Menschen können vor Ort und von überall digital an denselben Fragen mitwirken – nach klaren Regeln, aber ohne Parteizwang.",
  "<strong>Gleicher Informationsstand:</strong> Alle sehen dieselben Kontexte, Optionen und Folgen – keine versteckten Wissensvorsprünge.",
  "<strong>Minderheiten sichtbar:</strong> Argumente von Minderheiten bleiben getrennt erkennbar, Mehrheiten werden sauber ausgewiesen.",
  "<strong>Dokumentierte Entscheidungen:</strong> Am Ende steht nicht nur ein Ergebnis, sondern eine nachvollziehbare, öffentlich prüfbare Entscheidung.",
];

// CTA-Reihenfolge angepasst: Mitglied werden im Fokus
const HERO_CTAS = {
  primary: "Mitglied werden",
  secondary: "Abstimmungen ansehen",
  tertiary: "Thema einreichen",
};

// Weniger "Behörde", mehr Einladung – neutrale Zielgruppen
const HERO_CARDS = [
  {
    title: "Für Bürger:innen",
    body:
      "Du möchtest mitreden, wenn es um deine Stadt, dein Land oder Europa geht – ohne Parteibuch und ohne stundenlange Recherche? VoiceOpenGov bereitet Fragen so auf, dass du schnell verstehst, worum es geht, welche Optionen es gibt und welche Folgen sie haben könnten. Deine Stimme fließt in nachvollziehbare Entscheidungen ein – sichtbar für alle.",
  },
  {
    title: "Für Medien & Forschung",
    body:
      "Du brauchst belastbare Daten, wie Menschen in verschiedenen Regionen oder Gruppen zu Themen stehen, und welche Informationen ihnen wichtig sind? Das VOG-System liefert strukturierte Auswertungen, Verläufe und Entscheidungsgründe – eine neue Datenbasis für Qualitätsjournalismus und unabhängige Forschung.",
  },
  {
    title: "Für Verwaltungen & öffentliche Stellen",
    body:
      "Du trägst Verantwortung für Stadt, Gemeinde, Region oder Fachbehörde und möchtest Beteiligung fair, transparent und effizient organisieren? VoiceOpenGov strukturiert Beteiligungsverfahren, dokumentiert Ergebnisse und macht Entscheidungen nachvollziehbar – von der ersten Eingabe bis zur Umsetzung.",
  },
  {
    title: "Für Politik & Mandatsträger:innen",
    body:
      "Du willst zeigen, dass du Verantwortung ernst nimmst und Entscheidungen nicht im Hinterzimmer, sondern gemeinsam mit der Bevölkerung triffst? Unsere Struktur hilft dabei, Mehrheitsmeinungen sauber zu erfassen, Minderheiten fair abzubilden und Beschlüsse erklärbar zu machen – auf allen Ebenen.",
  },
];

const MEMBERSHIP_HIGHLIGHT = {
  title:
    "Deine Mitgliedschaft ist ein Signal – nicht für eine Partei, sondern für eine neue demokratische Infrastruktur.",
  body:
    "Wir wollen VoiceOpenGov als unabhängige, weltweit nutzbare Struktur aufbauen. Um das zu schaffen, brauchen wir planbare, faire Finanzierung – ohne große Equity-Investoren, ohne parteinahe Stiftungen und ohne Lobby-Verpflichtungen. Wir stellen keine Spendenquittungen aus und holen uns kein Geld über Rücksubventionen. Alles, was reinkommt, wird wie normales Einkommen versteuert. So bleiben wir frei in der Ausrichtung: im Auftrag einer Gesellschaft, die nach Mehrheitsprinzip entscheidet – nicht im Auftrag einzelner Interessen.",
  button: "Mitglied werden",
};

const HERO_VIDEO_NOTE = "Direkte Beteiligung in 90 Sekunden erklärt.";
const HERO_VIDEO_LINK = "Erklärfilm ansehen";

const USP_ITEMS = [
  {
    title: "Vom Anliegen zur Entscheidung",
    body:
      "In etwa einer Minute schilderst du, was dich bewegt. Danach folgt ein klarer Ablauf: Einordnung, Kontext, Abwägung der Optionen und am Ende eine Entscheidung nach gemeinsam vereinbarten Mehrheitsregeln – sichtbar für alle Beteiligten.",
  },
  {
    title: "Mehr Tiefe als ein einfaches Ja oder Nein",
    body:
      "Zu jedem Thema werden Aussagen, Gegenargumente, mögliche Folgen und Zuständigkeiten sichtbar. So wird erkennbar, wer betroffen ist, wer entscheiden kann und welche Wege wirklich zur Wahl stehen.",
  },
  {
    title: "Automatisches VOG-System als Ordnungshilfe",
    body:
      "Das System liest Eingaben und Texte, ordnet sie zu Themen, erkennt Widersprüche und Ergänzungen und weist auf Lücken hin. KI hilft, komplexe Inhalte verständlich aufzubereiten, Filter schützen vor Hass, Rassismus und Desinformation. Technik hilft beim Sortieren – entscheiden tun immer Menschen.",
  },
  {
    title: "Aus der Mitte der Gesellschaft gedacht",
    body:
      "Wir dokumentieren jede Stufe des Verfahrens, halten unsere Regeln offen und ermöglichen Prüfung von außen. Es geht nicht um Sieger und Besiegte, sondern um tragfähige Entscheidungen für eine gemeinsame Zukunft.",
  },
];

const QUALITY_SECTION = {
  title: "Qualität vor Lautstärke.",
  body:
    "Sorgfältige Auswertung, offene Verfahren, überprüfbare Auszählungen, dokumentierte Konklusionen und öffentliche Prüfspuren bilden den Kern unseres Qualitätsverständnisses. Zu jeder Entscheidung lässt sich später nachvollziehen, welche Informationen zugrunde lagen, welche Argumente und Zweifel abgewogen wurden und mit welchem Ergebnis entschieden wurde – inklusive der Verantwortung für die Umsetzung. Wir setzen auf nachvollziehbare Technik, nicht auf blinden Algorithmus-Glauben. Unser Ziel ist, dass Menschen das Vertrauen zurückgewinnen, dass Politik und Wissenschaft für alle nachvollziehbar handeln – nicht nur für Expert:innen.",
  ctaReports: "Themen und Entscheidungen ansehen",
  ctaMembers: "Mitglied werden",
};

// Mehrheit entscheidet – bewusst und informiert, mit Verweis auf VoiceOpenGov
const MAJORITY_SECTION = {
  title: "Mehrheit entscheidet – informiert, fair und nachvollziehbar",
  lead:
    "Am Ende zählt für VoiceOpenGov das Mehrheitsprinzip: Was eine klar informierte Mehrheit der betroffenen Bevölkerung will, soll gelten – im Stadtviertel, im Land und über Grenzen hinweg.",
  bullets: [
    "Wer das bisherige System weiterführen möchte, darf das sagen – und wenn eine deutliche Mehrheit in einer Gemeinde, einer Region oder einem Land diese Haltung teilt, respektieren wir das Ergebnis. Niemand wird gedrängt, in ein neues Verfahren zu wechseln.",
    "Das Verfahren von VoiceOpenGov – mit unserem eDebatte-Werkzeug im Hintergrund – sorgt dafür, dass Behauptungen, Befürchtungen und Hoffnungen getrennt sichtbar werden: mit Begründungen, Gegenstimmen, offenen Fragen und möglichen Folgen. So können Gesellschaften schneller lernen, ohne Menschen zurückzulassen.",
    "Populistische oder völlig faktenlose Aussagen werden nicht einfach übernommen: Sie müssen sich an den gleichen Anforderungen messen lassen wie jede andere Behauptung – nachvollziehbar für skeptische Menschen ebenso wie für kritische Wissenschaft.",
  ],
  closing:
    "Moderne Technik kann man hinterfragen – in diesem Verfahren bleibt sie bewusst ein Werkzeug. Das automatische VOG-System hilft nur dabei, alles zu ordnen und Lücken sichtbar zu machen. Die Entscheidungen selbst treffen Menschen, nach gemeinsam vereinbarten Mehrheitsregeln und mit dem Bewusstsein, dass wir alle Teil derselben Menschheit auf dieser Erde sind.",
};

const HOME_STRINGS = {
  heroChips: {
    de: HERO_CHIPS,
    en: HERO_CHIPS,
  } satisfies LocaleValue<string[]>,
  heroHeadline: {
    lines: {
      de: HERO_LINES,
      en: HERO_LINES,
    },
    accent: {
      de: HERO_ACCENT,
      en: HERO_ACCENT,
    },
    suffix: {
      de: HERO_SUFFIX,
      en: HERO_SUFFIX,
    },
  },
  heroIntro: {
    de: HERO_INTRO,
    en: HERO_INTRO,
  },
  heroBullets: {
    de: HERO_BULLETS,
    en: HERO_BULLETS,
  } satisfies LocaleValue<string[]>,
  heroCtas: {
    de: HERO_CTAS,
    en: HERO_CTAS,
  },
  heroCards: {
    de: HERO_CARDS,
    en: HERO_CARDS,
  },
  membershipHighlight: {
    title: {
      de: MEMBERSHIP_HIGHLIGHT.title,
      en: MEMBERSHIP_HIGHLIGHT.title,
    },
    body: {
      de: MEMBERSHIP_HIGHLIGHT.body,
      en: MEMBERSHIP_HIGHLIGHT.body,
    },
    button: {
      de: MEMBERSHIP_HIGHLIGHT.button,
      en: MEMBERSHIP_HIGHLIGHT.button,
    },
  },
  heroVideoNote: {
    de: HERO_VIDEO_NOTE,
    en: HERO_VIDEO_NOTE,
  },
  heroVideoLink: {
    de: HERO_VIDEO_LINK,
    en: HERO_VIDEO_LINK,
  },
  uspItems: {
    de: USP_ITEMS,
    en: USP_ITEMS,
  },
  qualitySection: {
    title: {
      de: QUALITY_SECTION.title,
      en: QUALITY_SECTION.title,
    },
    body: {
      de: QUALITY_SECTION.body,
      en: QUALITY_SECTION.body,
    },
    ctaReports: {
      de: QUALITY_SECTION.ctaReports,
      en: QUALITY_SECTION.ctaReports,
    },
    ctaMembers: {
      de: QUALITY_SECTION.ctaMembers,
      en: QUALITY_SECTION.ctaMembers,
    },
  },
  majoritySection: {
    title: {
      de: MAJORITY_SECTION.title,
      en: MAJORITY_SECTION.title,
    },
    lead: {
      de: MAJORITY_SECTION.lead,
      en: MAJORITY_SECTION.lead,
    },
    bullets: {
      de: MAJORITY_SECTION.bullets,
      en: MAJORITY_SECTION.bullets,
    },
    closing: {
      de: MAJORITY_SECTION.closing,
      en: MAJORITY_SECTION.closing,
    },
  },
} as const;

export function getHomeStrings(locale: SupportedLocale | string) {
  const pick = <T,>(entry: LocaleValue<T>): T => {
    const normalized = (locale ?? DEFAULT_LOCALE) as SupportedLocale;
    return entry[normalized] ?? entry.de;
  };

  return {
    heroChips: pick(HOME_STRINGS.heroChips),
    heroHeadline: {
      lines: pick(HOME_STRINGS.heroHeadline.lines),
      accent: pick(HOME_STRINGS.heroHeadline.accent),
      suffix: pick(HOME_STRINGS.heroHeadline.suffix),
    },
    heroIntro: pick(HOME_STRINGS.heroIntro),
    heroBullets: pick(HOME_STRINGS.heroBullets),
    heroCtas: pick(HOME_STRINGS.heroCtas),
    heroCards: pick(HOME_STRINGS.heroCards),
    membershipHighlight: {
      title: pick(HOME_STRINGS.membershipHighlight.title),
      body: pick(HOME_STRINGS.membershipHighlight.body),
      button: pick(HOME_STRINGS.membershipHighlight.button),
    },
    heroVideoNote: pick(HOME_STRINGS.heroVideoNote),
    heroVideoLink: pick(HOME_STRINGS.heroVideoLink),
    uspItems: pick(HOME_STRINGS.uspItems),
    qualitySection: {
      title: pick(HOME_STRINGS.qualitySection.title),
      body: pick(HOME_STRINGS.qualitySection.body),
      ctaReports: pick(HOME_STRINGS.qualitySection.ctaReports),
      ctaMembers: pick(HOME_STRINGS.qualitySection.ctaMembers),
    },
    majoritySection: {
      title: pick(HOME_STRINGS.majoritySection.title),
      lead: pick(HOME_STRINGS.majoritySection.lead),
      bullets: pick(HOME_STRINGS.majoritySection.bullets),
      closing: pick(HOME_STRINGS.majoritySection.closing),
    },
  };
}
