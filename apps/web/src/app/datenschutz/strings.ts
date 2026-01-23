import { DEFAULT_LOCALE, type SupportedLocale } from "@/config/locales";

type LocaleValue<T> = Record<"de", T> & Partial<Record<SupportedLocale, T>>;

export type PrivacyDataPoint = {
  label: string;
  description: string;
};

const STRINGS = {
  title: {
    de: "Datenschutz",
    en: "Privacy Policy",
  } as LocaleValue<string>,

  intro: {
    de: "VoiceOpenGov ist eine Initiative – keine Partei, kein Verein und keine Stiftung. Wir verarbeiten personenbezogene Daten so sparsam wie möglich und passen diese Hinweise an, sobald sich Funktionen oder rechtliche Rahmenbedingungen ändern. Diese Hinweise sollen einen Überblick nach Art. 12 ff. DSGVO geben und ersetzen keine individuelle Rechtsberatung.",
    en: "VoiceOpenGov is an initiative – not a party, association or foundation. We process personal data as sparingly as possible and update this notice whenever features or legal requirements change. This notice is intended to provide an overview under Arts. 12 et seq. GDPR and does not constitute individual legal advice.",
  } as LocaleValue<string>,

  controllerTitle: {
    de: "Verantwortliche Stelle",
    en: "Controller",
  } as LocaleValue<string>,

  controllerBody: {
    de: [
      "Verantwortlich für die Verarbeitung personenbezogener Daten im Rahmen dieser Website und der angebundenen Dienste ist:",
      "",
      "VoiceOpenGov UG (haftungsbeschränkt) i.G.",
      "Ricky G. Fleischer",
      "Kolonnenstraße 8",
      "10827 Berlin",
      "Deutschland",
      "",
      "E-Mail: privacy@voiceopengov.org",
    ].join("\n"),
    en: [
      "The controller responsible for processing personal data in connection with this website and related services is:",
      "",
     "VoiceOpenGov UG (haftungsbeschränkt) i.G.",
      "Ricky G. Fleischer",
      "Kolonnenstraße 8",
      "10827 Berlin",
      "Germany",
      "",
      "E-mail: privacy@voiceopengov.org",
    ].join("\n"),
  } as LocaleValue<string>,

  dataTitle: {
    de: "Welche Daten wir verarbeiten",
    en: "Which data we process",
  } as LocaleValue<string>,

  dataPoints: {
    de: [
      {
        label: "Unterstuetzer:innen",
        description:
          "Angaben aus dem Mitmachen-Formular (z. B. Name, E-Mail, Geburtsdatum und -ort, Land, Support-Modus, optionale Skills). Wir nutzen diese Daten fuer Moderation, Rueckfragen und interne Abstimmungen. Fuer den Globus und die Live-Zahlen verwenden wir nur aggregierte Werte.",
      },
      {
        label: "Initiativen-Intake",
        description:
          "Angaben zu Organisationen oder Initiativen (z. B. Name, Kontakt, Thema, Region, Ziel und Notizen), damit wir das Anliegen strukturiert pruefen und rueckmelden koennen.",
      },
      {
        label: "Kontakt & Support",
        description:
          "Nachrichten und Kontaktdaten aus Formularen oder E-Mails, die fuer die Bearbeitung deiner Anfrage erforderlich sind.",
      },
      {
        label: "Technische Sicherheitsdaten",
        description:
          "Protokolldaten zur Absicherung der Formulare (z. B. Zeitstempel, IP/Agent-Hashes, Rate-Limits). Diese Daten dienen Missbrauchsschutz und Stabilitaet.",
      },
    ],
    en: [
      {
        label: "Supporters",
        description:
          "Details submitted via the join form (e.g. name, e-mail, birth date/place, country, support mode, optional skills). We use these details for moderation, follow-ups and internal coordination. The globe and live stats show aggregated data only.",
      },
      {
        label: "Initiatives intake",
        description:
          "Organisation or initiative details (e.g. name, contact, topic, region, goal, notes) so we can review and follow up in a structured way.",
      },
      {
        label: "Contact & support",
        description:
          "Messages and contact details submitted via forms or e-mail that are required to handle your request.",
      },
      {
        label: "Technical security data",
        description:
          "Log data used to protect forms (e.g. timestamps, hashed IP/user agent data, rate limits). This data is used for abuse prevention and stability.",
      },
    ],
  } as LocaleValue<PrivacyDataPoint[]>,

  cookiesTitle: {
    de: "Cookies, lokaler Speicher und Einwilligungen",
    en: "Cookies, local storage and consent",
  } as LocaleValue<string>,

  cookiesBody: {
    de: [
      "Für den Betrieb der Website verwenden wir technisch notwendige Cookies und vergleichbare Technologien (§ 25 Abs. 2 TDDDG), etwa um Logins, Sicherheitsfunktionen (z. B. CSRF-Schutz) und Lastverteilung zu ermöglichen.",
      "",
      "Optionale Cookies bzw. Speichertechnologien – etwa für Komfortfunktionen oder einfache Reichweitenmessung – setzen wir nur ein, wenn du im Cookie-Banner ausdrücklich eingewilligt hast (§ 25 Abs. 1 TDDDG i. V. m. Art. 6 Abs. 1 lit. a DSGVO). Du kannst deine Einwilligung über die Einstellungen im Banner jederzeit mit Wirkung für die Zukunft widerrufen.",
      "",
      "Wir verzichten aktuell auf Tracking-Cookies für Werbenetzwerke. Details zu den jeweils eingesetzten Diensten und Speicherdauern ergänzen wir, sobald neue Funktionen produktiv gehen.",
    ].join("\n"),
    en: [
      "We use technically necessary cookies and similar technologies (§ 25 (2) TDDDG) to operate this website, for example to enable logins, security features (such as CSRF protection) and load balancing.",
      "",
      "Optional cookies or storage technologies – for comfort features or simple reach measurement – are only used if you have explicitly consented via the cookie banner (§ 25 (1) TDDDG in conjunction with Art. 6 (1) (a) GDPR). You can withdraw your consent at any time with effect for the future via the banner settings.",
      "",
      "We currently do not use tracking cookies for advertising networks. Details on specific services and storage periods will be added as new features go live.",
    ].join("\n"),
  } as LocaleValue<string>,


  rightsTitle: {
    de: "Deine Rechte",
    en: "Your rights",
  } as LocaleValue<string>,

  rightsIntro: {
    de: "Du hast im Rahmen der DSGVO insbesondere die folgenden Rechte gegenüber der verantwortlichen Stelle:",
    en: "Under the GDPR you have, in particular, the following rights vis-à-vis the controller:",
  } as LocaleValue<string>,

  rightsPoints: {
    de: [
      "Recht auf Auskunft (Art. 15 DSGVO) über die zu dir gespeicherten Daten.",
      "Recht auf Berichtigung (Art. 16 DSGVO), wenn Daten unrichtig oder unvollständig sind.",
      "Recht auf Löschung (Art. 17 DSGVO), soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO).",
      "Recht auf Datenübertragbarkeit (Art. 20 DSGVO).",
      "Recht auf Widerspruch (Art. 21 DSGVO) gegen Verarbeitungen, die auf Art. 6 Abs. 1 lit. e oder f DSGVO beruhen.",
      "Recht, eine einmal erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen (Art. 7 Abs. 3 DSGVO).",
    ],
    en: [
      "Right of access (Art. 15 GDPR) to the personal data we hold about you.",
      "Right to rectification (Art. 16 GDPR) if data is inaccurate or incomplete.",
      "Right to erasure (Art. 17 GDPR) where no legal retention obligations apply.",
      "Right to restriction of processing (Art. 18 GDPR).",
      "Right to data portability (Art. 20 GDPR).",
      "Right to object (Art. 21 GDPR) to processing based on Art. 6 (1) (e) or (f) GDPR.",
      "Right to withdraw consent at any time with effect for the future (Art. 7 (3) GDPR).",
    ],
  } as LocaleValue<string[]>,

  rightsComplaintHint: {
    de: [
      "Du kannst dich außerdem bei einer Datenschutzaufsichtsbehörde beschweren, wenn du der Ansicht bist, dass die Verarbeitung der dich betreffenden personenbezogenen Daten gegen die DSGVO verstößt. Zuständig ist z. B. die Aufsichtsbehörde an deinem Wohnort oder der Berliner Beauftragte für Datenschutz und Informationsfreiheit.",
    ].join("\n"),
    en: [
      "You also have the right to lodge a complaint with a data protection supervisory authority if you believe that the processing of personal data relating to you infringes the GDPR. You may contact, for example, the authority at your place of residence or the Berlin Commissioner for Data Protection and Freedom of Information.",
    ].join("\n"),
  } as LocaleValue<string>,

  contactTitle: {
    de: "Kontakt für Datenschutzanfragen",
    en: "Contact for privacy requests",
  } as LocaleValue<string>,

  contactBody: {
    de: [
      "Wenn du eines deiner Rechte wahrnehmen oder allgemein Fragen zur Datenverarbeitung bei VoiceOpenGov stellen möchtest, wende dich bitte an:",
      "",
      "VoiceOpenGov UG (haftungsbeschränkt) i.G.",
      "Ricky G. Fleischer",
      "Kolonnenstraße 8",
      "10827 Berlin",
      "Deutschland",
    ].join("\n"),
    en: [
      "If you wish to exercise any of your rights or have general questions about data processing at VoiceOpenGov, please contact:",
      "",
      "VoiceOpenGov UG (haftungsbeschränkt) i.G.",
      "Ricky G. Fleischer",
      "Kolonnenstraße 8",
      "10827 Berlin",
      "Deutschland",
    ].join("\n"),
  } as LocaleValue<string>,

  contactEmail: {
    de: "privacy@voiceopengov.org",
    en: "privacy@voiceopengov.org",
  } as LocaleValue<string>,
} as const;

function pick<T>(entry: LocaleValue<T>, locale: SupportedLocale | string): T {
  const normalized = (locale || DEFAULT_LOCALE) as SupportedLocale;
  return entry[normalized] ?? entry.de;
}

export function getPrivacyStrings(locale: SupportedLocale | string) {
  return {
    title: pick(STRINGS.title, locale),
    intro: pick(STRINGS.intro, locale),
    controllerTitle: pick(STRINGS.controllerTitle, locale),
    controllerBody: pick(STRINGS.controllerBody, locale),
    dataTitle: pick(STRINGS.dataTitle, locale),
    dataPoints: pick(STRINGS.dataPoints, locale),
    cookiesTitle: pick(STRINGS.cookiesTitle, locale),
    cookiesBody: pick(STRINGS.cookiesBody, locale),
    rightsTitle: pick(STRINGS.rightsTitle, locale),
    rightsIntro: pick(STRINGS.rightsIntro, locale),
    rightsPoints: pick(STRINGS.rightsPoints, locale),
    rightsComplaintHint: pick(STRINGS.rightsComplaintHint, locale),
    contactTitle: pick(STRINGS.contactTitle, locale),
    contactBody: pick(STRINGS.contactBody, locale),
    contactEmail: pick(STRINGS.contactEmail, locale),
  };
}
