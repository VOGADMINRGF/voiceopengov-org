import { DEFAULT_LOCALE, type SupportedLocale } from "@/config/locales";

type LocaleValue<T> = Record<"de", T> & Partial<Record<SupportedLocale, T>>;

export type PrivacyDataPoint = {
  label: string;
  description: string;
};

const STRINGS = {
  label: {
    de: "Datenschutz",
    en: "Privacy",
  } as LocaleValue<string>,

  title: {
    de: "Datenschutz",
    en: "Privacy Policy",
  } as LocaleValue<string>,

  intro: {
    de: "VoiceOpenGov ist eine Initiative – keine Partei, kein Verein, keine Stiftung und derzeit keine eigene Gesellschaft. Wir verarbeiten personenbezogene Daten so sparsam wie möglich und passen diese Hinweise an, sobald sich Funktionen, Anbieter oder rechtliche Rahmenbedingungen ändern. Diese Hinweise sollen einen Überblick nach Art. 12 ff. DSGVO geben und ersetzen keine individuelle Rechtsberatung.",
    en: "VoiceOpenGov is an initiative – not a party, association, foundation or currently a separate company. We process personal data as sparingly as possible and update this notice whenever features, providers or legal requirements change. This notice is intended to provide an overview under Arts. 12 et seq. GDPR and does not constitute individual legal advice.",
  } as LocaleValue<string>,

  controllerTitle: {
    de: "Verantwortliche Stelle",
    en: "Controller",
  } as LocaleValue<string>,

  controllerBody: {
    de: [
      "Verantwortlich für die Verarbeitung personenbezogener Daten im Rahmen dieser Website und der angebundenen Dienste ist:",
      "",
      "Ricky G. Fleischer",
      "(VoiceOpenGov – Initiative; natürliche Person)",
      "Clara-Müller-Jahnke-Str. 41",
      "12589 Berlin",
      "Deutschland",
      "",
      "Eine VOG Holding oder sonstige eigene Gesellschaft ist derzeit nicht Verantwortlicher, Anbieter, Vertragspartner oder Zahlungsempfänger.",
      "E-Mail: privacy@voiceopengov.org",
    ].join("\n"),
    en: [
      "The controller responsible for processing personal data in connection with this website and related services is:",
      "",
      "Ricky G. Fleischer",
      "(VoiceOpenGov – initiative; natural person)",
      "Clara-Müller-Jahnke-Str. 41",
      "12589 Berlin",
      "Germany",
      "",
      "No VOG Holding or other separate company currently acts as controller, provider, contractual partner or payment recipient.",
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
        label: "Community-Anmeldung",
        description:
          "Über /mitmachen verarbeiten wir – je nach Angabe – Vor- und Nachname, E-Mail-Adresse, Geburtsdatum, Ort, Land, den gewählten Teilnahmemodus (aktive Mitwirkung oder Community), die Newsletter-Auswahl sowie Bestätigungs- und Zeitstempel des Double-Opt-In-Verfahrens. Vor- und Nachname sowie Land sind im aktuellen Formular optional; E-Mail, Geburtsdatum, Ort und die Datenschutzbestätigung sind erforderlich. Die Anmeldung dokumentiert die Zugehörigkeit zur VoiceOpenGov-Community und ist derzeit keine Vereins- oder gesellschaftsrechtliche Mitgliedschaft.",
      },
      {
        label: "Öffentliche Orts-Summen",
        description:
          "Die Community-Anmeldung wird derzeit mit Freigabe für anonyme Orts-Summen gespeichert. Wenn regionale Zahlen öffentlich dargestellt werden, verwenden wir dafür aggregierte Werte; Name, E-Mail-Adresse und Geburtsdatum werden dadurch nicht öffentlich angezeigt.",
      },
      {
        label: "Herkunft & Funnel-Ereignisse",
        description:
          "Zur technischen Auswertung des Einstiegs können Landing-Pfad, Referrer sowie UTM-Quelle, -Medium und -Kampagne erfasst werden. Separat gespeicherte Funnel-Ereignisse enthalten nur die dafür vorgesehenen Felder wie Ereignistyp, Zeitstempel, optionalen Session-Hash, Mitglieds-ID, Kampagnenparameter, Land, Sprache und Landing-Pfad und laufen nach 90 Tagen ab. Kampagnenparameter können zusätzlich im Community-Datensatz der Anmeldung gespeichert sein.",
      },
      {
        label: "Regionale Mitwirkung",
        description:
          "Beim Formular für regionale Mitwirkung verarbeiten wir Kontaktname, E-Mail-Adresse, Ort/Region, ausgewählte Mitwirkungsinteressen sowie optional Thema und Notizen. Zusätzlich speichern wir Kontakt-, Matching- und Datenschutz-Einwilligungen. Diese Datensätze sind privat, werden nicht automatisch veröffentlicht und nicht für politisches Profiling verwendet. Die technische Aufbewahrungsfrist hängt vom Bearbeitungsstatus ab und beträgt derzeit zwischen 30 und 180 Tagen.",
      },
      {
        label: "Freiwillige Unterstützung & Zahlungsstatus",
        description:
          "Wenn du VoiceOpenGov freiwillig finanziell unterstützt, verarbeiten wir insbesondere Betrag, Zahlungsrhythmus, Zahlungsstatus sowie technische Zahlungs- und Kund:innen-IDs. Die finanzielle Unterstützung ist von der kostenfreien Community-Anmeldung getrennt und begründet keine rechtliche Mitgliedschaft. Die Zahlungsabwicklung erfolgt über Stripe. Wenn PayPal im Stripe-Checkout angeboten und von dir gewählt wird, werden die für diese Zahlung erforderlichen Daten zusätzlich im Rahmen der Stripe-/PayPal-Zahlungsabwicklung verarbeitet. VoiceOpenGov speichert keine vollständigen Karten- oder PayPal-Zugangsdaten.",
      },
      {
        label: "Zahlungsdienstleister",
        description:
          "Stripe verarbeitet Zahlungs- und Betrugspräventionsdaten nach seinen eigenen Datenschutzbestimmungen. Bei Auswahl von PayPal gelten zusätzlich die Datenschutzbestimmungen von PayPal. Welche Zahlungsart tatsächlich verfügbar ist, zeigt der konkrete Checkout. Eine Unterstützung verschafft keine zusätzlichen Stimm-, Beteiligungs- oder Zugangsrechte.",
      },
      {
        label: "Initiativen-Intake",
        description:
          "Angaben zu Organisationen oder Initiativen (z. B. Name, Kontakt, Thema, Region, Ziel und Notizen), damit wir das Anliegen strukturiert prüfen und rückmelden können.",
      },
      {
        label: "Kontakt & Support",
        description:
          "Nachrichten und Kontaktdaten aus Formularen oder E-Mails, die für die Bearbeitung deiner Anfrage erforderlich sind.",
      },
      {
        label: "Technische Sicherheitsdaten",
        description:
          "Protokoll- und Sicherheitsdaten zur Absicherung der Formulare und Zugänge, z. B. Zeitstempel, technische Hashes und Rate-Limit-Informationen. Diese Daten dienen Missbrauchsschutz, Sicherheit und Stabilität.",
      },
    ],
    en: [
      {
        label: "Community registration",
        description:
          "Through /mitmachen we process, depending on what you provide, first and last name, email address, date of birth, city, country, the selected participation mode (active contribution or community), newsletter choice, and confirmation/timestamp data for the double opt-in process. First and last name and country are optional in the current form; email, date of birth, city and privacy acknowledgement are required. The registration records affiliation with the VoiceOpenGov community and is not currently a legal association or corporate membership.",
      },
      {
        label: "Public local totals",
        description:
          "Community registrations are currently stored with permission for anonymous local totals. If regional figures are displayed publicly, we use aggregated values; name, email address and date of birth are not displayed through those totals.",
      },
      {
        label: "Acquisition & funnel events",
        description:
          "To understand the technical entry path we may record the landing path, referrer and UTM source, medium and campaign. Separately stored funnel events contain only the fields intended for this purpose, such as event type, timestamp, optional session hash, member ID, campaign parameters, country, locale and landing path, and expire after 90 days. Campaign parameters may also be stored with the community registration record.",
      },
      {
        label: "Regional participation",
        description:
          "For regional participation we process contact name, email address, location/region, selected participation interests and, optionally, a topic and notes. We also store contact, matching and privacy consents. These records are private, are not automatically published and are not used for political profiling. The technical retention period depends on processing status and is currently between 30 and 180 days.",
      },
      {
        label: "Voluntary support & payment status",
        description:
          "If you voluntarily support VoiceOpenGov financially, we process, in particular, the amount, payment cadence, payment status, and technical payment and customer IDs. Financial support is separate from free community registration and does not create a legal membership. Payments are processed through Stripe. If PayPal is offered in Stripe Checkout and selected by you, the data required for that payment is also processed as part of the Stripe/PayPal payment flow. VoiceOpenGov does not store full card details or PayPal login credentials.",
      },
      {
        label: "Payment service providers",
        description:
          "Stripe processes payment and fraud-prevention data under its own privacy policy. If PayPal is selected, PayPal's privacy policy also applies. The payment methods actually available are shown in the specific checkout. Financial support does not grant additional voting, participation or access rights.",
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
          "Logging and security data used to protect forms and access, for example timestamps, technical hashes and rate-limit information. These data are used for abuse prevention, security and stability.",
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
      "Wir verzichten aktuell auf Tracking-Cookies für Werbenetzwerke. Für einen von dir gestarteten Zahlungsvorgang können Stripe und – bei Auswahl von PayPal – PayPal technisch erforderliche Cookies oder vergleichbare Technologien auf ihren Zahlungsseiten einsetzen. Details richten sich nach den Datenschutzhinweisen des jeweiligen Zahlungsdienstleisters.",
    ].join("\n"),
    en: [
      "We use technically necessary cookies and similar technologies (§ 25 (2) TDDDG) to operate this website, for example to enable logins, security features (such as CSRF protection) and load balancing.",
      "",
      "Optional cookies or storage technologies – for comfort features or simple reach measurement – are only used if you have explicitly consented via the cookie banner (§ 25 (1) TDDDG in conjunction with Art. 6 (1) (a) GDPR). You can withdraw your consent at any time with effect for the future via the banner settings.",
      "",
      "We currently do not use tracking cookies for advertising networks. For a payment flow initiated by you, Stripe and – if PayPal is selected – PayPal may use technically necessary cookies or similar technologies on their payment pages. Details are governed by the privacy notices of the respective payment provider.",
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
    de: "Du kannst dich außerdem bei einer Datenschutzaufsichtsbehörde beschweren, wenn du der Ansicht bist, dass die Verarbeitung der dich betreffenden personenbezogenen Daten gegen die DSGVO verstößt. Zuständig ist z. B. die Aufsichtsbehörde an deinem Wohnort oder der Berliner Beauftragte für Datenschutz und Informationsfreiheit.",
    en: "You also have the right to lodge a complaint with a data protection supervisory authority if you believe that the processing of personal data relating to you infringes the GDPR. You may contact, for example, the authority at your place of residence or the Berlin Commissioner for Data Protection and Freedom of Information.",
  } as LocaleValue<string>,

  contactTitle: {
    de: "Kontakt für Datenschutzanfragen",
    en: "Contact for privacy requests",
  } as LocaleValue<string>,

  contactBody: {
    de: [
      "Wenn du eines deiner Rechte wahrnehmen oder allgemein Fragen zur Datenverarbeitung bei VoiceOpenGov stellen möchtest, wende dich bitte an:",
      "",
      "Ricky G. Fleischer",
      "(VoiceOpenGov – Initiative)",
      "Clara-Müller-Jahnke-Str. 41",
      "12589 Berlin",
      "Deutschland",
    ].join("\n"),
    en: [
      "If you wish to exercise any of your rights or have general questions about data processing at VoiceOpenGov, please contact:",
      "",
      "Ricky G. Fleischer",
      "(VoiceOpenGov – initiative)",
      "Clara-Müller-Jahnke-Str. 41",
      "12589 Berlin",
      "Germany",
    ].join("\n"),
  } as LocaleValue<string>,

  contactEmail: {
    de: "privacy@voiceopengov.org",
    en: "privacy@voiceopengov.org",
  } as LocaleValue<string>,

  contactEmailLabel: {
    de: "Kontakt-E-Mail:",
    en: "Contact email:",
  } as LocaleValue<string>,

  updateNote: {
    de: "Diese Hinweise werden laufend aktualisiert und rechtlich überprüft, sobald sich unser Angebot oder die Rechtslage ändert.",
    en: "This notice is updated continuously and reviewed legally whenever our services or legal requirements change.",
  } as LocaleValue<string>,
} as const;

function pick<T>(entry: LocaleValue<T>, locale: SupportedLocale | string): T {
  const normalized = (locale || DEFAULT_LOCALE) as SupportedLocale;
  return entry[normalized] ?? entry.en ?? entry.de;
}

export function getPrivacyStrings(locale: SupportedLocale | string) {
  return {
    label: pick(STRINGS.label, locale),
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
    contactEmailLabel: pick(STRINGS.contactEmailLabel, locale),
    updateNote: pick(STRINGS.updateNote, locale),
  };
}
