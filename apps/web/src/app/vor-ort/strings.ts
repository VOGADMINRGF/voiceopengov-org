import type { SupportedLocale } from "@/config/locales";
import type { HumanCheckStrings } from "@/components/security/HumanCheck";

export type RegionalActivationStrings = {
  meta: { title: string; description: string };
  page: {
    eyebrow: string;
    title: string;
    intro: string;
    promise: string;
    steps: Array<{ title: string; body: string }>;
    todayTitle: string;
    todayBody: string;
    laterTitle: string;
    laterBody: string;
    responsibilityTitle: string;
    responsibilityBody: string;
    rolesLink: string;
  };
  form: {
    title: string;
    subtitle: string;
    labels: {
      name: string;
      email: string;
      location: string;
      topic: string;
      intentions: string;
      notes: string;
      contactConsent: string;
      matchingConsent: string;
      privacy: { before: string; link: string; after: string };
      honeypot: string;
    };
    placeholders: { location: string; topic: string; notes: string };
    intentionOptions: Array<{ value: string; label: string; hint: string }>;
    notices: {
      intentionRequired: string;
      consentRequired: string;
      humanRequired: string;
      submitOk: string;
      submitFail: string;
    };
    submit: string;
    submitting: string;
  };
  humanCheck: HumanCheckStrings;
};

const deHumanCheck: HumanCheckStrings = {
  compact: {
    title: "Kurze Bestätigung",
    description: "Ein kleiner Anti-Spam-Check – ohne Werbetracking.",
    open: "Bestätigung öffnen",
  },
  loading: "Lade kurze Bestätigung …",
  promptTitle: "Kurze Bestätigung: Bist du ein Mensch?",
  verified: "✓ geprüft",
  intro: "Bitte löse die kleine Aufgabe. Sie schützt das Formular vor automatischem Spam.",
  honeypotLabel: "Bitte leer lassen",
  answerLabel: "Ergebnis eintragen",
  buttonChecking: "Prüfen …",
  buttonSolved: "Bestätigt",
  buttonIdle: "Kurz prüfen",
  messages: {
    alreadySolved: "Sicherheitscheck bereits erledigt.",
    numberRequired: "Bitte trage das Ergebnis als Zahl ein.",
    verifyFailed: "Die Bestätigung hat nicht geklappt. Bitte versuche es erneut.",
    techError: "Es gab ein technisches Problem. Bitte später erneut versuchen.",
    verified: "Danke – kurz bestätigt.",
  },
};

const enHumanCheck: HumanCheckStrings = {
  compact: {
    title: "Quick confirmation",
    description: "A small anti-spam check without advertising trackers.",
    open: "Open confirmation",
  },
  loading: "Loading confirmation …",
  promptTitle: "Quick confirmation: Are you human?",
  verified: "✓ verified",
  intro: "Please solve the small task. It protects the form from automated spam.",
  honeypotLabel: "Please leave empty",
  answerLabel: "Enter the result",
  buttonChecking: "Checking …",
  buttonSolved: "Confirmed",
  buttonIdle: "Check",
  messages: {
    alreadySolved: "Security check already completed.",
    numberRequired: "Please enter the result as a number.",
    verifyFailed: "The confirmation failed. Please try again.",
    techError: "There was a technical problem. Please try again later.",
    verified: "Thank you – confirmed.",
  },
};

const DE: RegionalActivationStrings = {
  meta: {
    title: "Für deine Nachbarschaft aktiv werden | VoiceOpenGov",
    description:
      "Bring Menschen in deiner Region zusammen, teile ein lokales Anliegen oder hilf beim Aufbau einer regionalen eDebatte × VoiceOpenGov-Anlaufstelle.",
  },
  page: {
    eyebrow: "VoiceOpenGov vor Ort",
    title: "Für deine Nachbarn. Für deine Region.",
    intro:
      "VoiceOpenGov soll dort sichtbar werden, wo Entscheidungen im Alltag ankommen: im Kiez, im Dorf, im Stadtteil, in der Stadt und im Landkreis. Du kannst Menschen zusammenbringen, regionale Anliegen sichtbar machen, eDebatte vor Ort zugänglich machen oder beim Aufbau einer dauerhaften Anlaufstelle helfen.",
    promise:
      "Unser Ziel ist ein wachsendes Netz aus lokalen Teams, Treffpunkten, mobilen Formaten und langfristig rund 400 eDebatte × VoiceOpenGov-Anlaufstellen in Deutschland. Wir bauen es Region für Region mit den Menschen vor Ort auf.",
    steps: [
      {
        title: "1. Sag uns, wo du etwas bewegen möchtest",
        body: "Ort, Region und ein paar Stichworte reichen für den Anfang.",
      },
      {
        title: "2. Finde Menschen aus deiner Umgebung",
        body: "Wir können passende regionale Interessen zusammenführen, sobald die Beteiligten dem Kontakt zustimmen.",
      },
      {
        title: "3. Mach daraus sichtbare Präsenz",
        body: "Ein Treffen, ein Themenabend, ein lokaler Ansprechpartner oder später eine feste Anlaufstelle kann daraus entstehen.",
      },
    ],
    todayTitle: "Was du heute schon tun kannst",
    todayBody:
      "Du kannst dein regionales Interesse anmelden, einen Ort oder Kontakte einbringen, ein Thema nennen, andere Menschen aus deiner Region kennenlernen oder selbst den ersten Impuls geben.",
    laterTitle: "Unser regionales Zielbild",
    laterBody:
      "Lokale Teams, erreichbare Anlaufstellen, mobile Beteiligungsformate und transparent legitimierte regionale Repräsentation sollen eDebatte und politische Umsetzung vor Ort miteinander verbinden.",
    responsibilityTitle: "Wer übernimmt vor Ort Verantwortung?",
    responsibilityBody:
      "Regionale Verantwortung soll sichtbar bei benannten Menschen liegen. Sie bringen Nachbarn zusammen, machen den Zugang zu eDebatte leichter und vertreten gültige regionale Entscheidungen nachvollziehbar nach außen.",
    rolesLink: "Weitere Möglichkeiten ansehen",
  },
  form: {
    title: "Was möchtest du für deine Region möglich machen?",
    subtitle:
      "Du musst dich nicht auf eine Rolle festlegen. Mehrere Antworten sind möglich.",
    labels: {
      name: "Dein Name",
      email: "Deine E-Mail",
      location: "Ort oder Region",
      topic: "Welches Thema ist dir in deiner Region wichtig? (optional)",
      intentions: "Ich möchte …",
      notes: "Was sollten wir noch wissen? (optional)",
      contactConsent: "VoiceOpenGov darf mich zu dieser regionalen Anfrage kontaktieren.",
      matchingConsent:
        "Wenn es passt, dürft ihr mich später nach meiner Zustimmung mit anderen Interessierten aus meiner Region zusammenbringen.",
      privacy: {
        before: "Ich akzeptiere die",
        link: "Datenschutzhinweise",
        after: ".",
      },
      honeypot: "Bitte dieses Feld frei lassen",
    },
    placeholders: {
      location: "z. B. Berlin-Rahnsdorf, Köln oder Rhein-Main",
      topic: "z. B. sichere Schulwege, Pflege, Wohnen, Verkehr oder ein anderes Anliegen",
      notes: "Zeit, Erfahrung, Kontakte, Räume oder etwas, das dir wichtig ist …",
    },
    intentionOptions: [
      {
        value: "stay_informed",
        label: "wissen, was in meiner Region passiert",
        hint: "Ich möchte zunächst verbunden bleiben und regionale Entwicklungen mitbekommen.",
      },
      {
        value: "join_meetup",
        label: "Menschen aus meiner Nachbarschaft kennenlernen",
        hint: "Ich möchte bei einem ersten regionalen Treffen dabei sein.",
      },
      {
        value: "start_meetup",
        label: "den ersten Impuls geben",
        hint: "Ich möchte ein Treffen oder einen Austausch anstoßen, ohne alles allein organisieren zu müssen.",
      },
      {
        value: "help_organize",
        label: "bei Organisation und regionalem Aufbau helfen",
        hint: "Ich kann einen überschaubaren Teil übernehmen und gemeinsam mit anderen aufbauen.",
      },
      {
        value: "offer_space",
        label: "einen Raum oder Treffpunkt ermöglichen",
        hint: "Ich kenne oder habe vielleicht einen geeigneten Ort.",
      },
      {
        value: "offer_contacts",
        label: "Menschen und Kontakte verbinden",
        hint: "Ich kenne Vereine, Einrichtungen, Initiativen oder Nachbarn, die sich einbringen könnten.",
      },
      {
        value: "offer_expertise",
        label: "Wissen oder Erfahrung einbringen",
        hint: "Ich kann fachlich, organisatorisch oder praktisch unterstützen.",
      },
      {
        value: "regional_long_term",
        label: "eine regionale Anlaufstelle mit aufbauen",
        hint: "Ich möchte längerfristig Verantwortung übernehmen und VoiceOpenGov vor Ort mitentwickeln.",
      },
    ],
    notices: {
      intentionRequired: "Bitte wähle mindestens eine Möglichkeit aus.",
      consentRequired: "Bitte bestätige Kontakt und Datenschutz.",
      humanRequired: "Bitte schließe den kurzen Anti-Spam-Check ab.",
      submitOk:
        "Danke. Dein regionales Interesse ist angekommen. Wir melden uns, sobald sich daraus ein sinnvoller nächster Schritt ergibt.",
      submitFail: "Das hat noch nicht funktioniert. Bitte versuche es später erneut.",
    },
    submit: "Für meine Region eintragen",
    submitting: "Wird übermittelt …",
  },
  humanCheck: deHumanCheck,
};

const EN: RegionalActivationStrings = {
  meta: {
    title: "Get active for your neighbourhood | VoiceOpenGov",
    description:
      "Bring people together locally, share an issue or help build a regional eDebatte × VoiceOpenGov contact point.",
  },
  page: {
    eyebrow: "VoiceOpenGov locally",
    title: "For your neighbours. For your region.",
    intro:
      "VoiceOpenGov should be visible where decisions are felt in everyday life: in neighbourhoods, villages, towns, cities and districts. You can bring people together, make local issues visible, make eDebatte accessible locally or help build a lasting contact point.",
    promise:
      "Our goal is a growing network of local teams, meeting places, mobile formats and, over time, around 400 eDebatte × VoiceOpenGov contact points across Germany. We build it region by region with people on the ground.",
    steps: [
      {
        title: "1. Tell us where you want to make a difference",
        body: "A place, region and a few words are enough to start.",
      },
      {
        title: "2. Meet people nearby",
        body: "We can connect matching local interests once everyone involved agrees to contact.",
      },
      {
        title: "3. Turn it into visible local presence",
        body: "A meeting, issue night, local contact person or later a permanent contact point can grow from it.",
      },
    ],
    todayTitle: "What you can do today",
    todayBody:
      "Register local interest, contribute a place or contacts, name an issue, meet people nearby or provide the first impulse yourself.",
    laterTitle: "Our regional direction",
    laterBody:
      "Local teams, accessible contact points, mobile participation and transparently legitimised regional representation should connect eDebatte with political implementation on the ground.",
    responsibilityTitle: "Who takes responsibility locally?",
    responsibilityBody:
      "Local responsibility should sit visibly with named people. They bring neighbours together, make access to eDebatte easier and represent valid regional decisions transparently.",
    rolesLink: "See more ways to contribute",
  },
  form: {
    title: "What would you like to make possible in your region?",
    subtitle: "You do not need to choose one fixed role. Several answers are possible.",
    labels: {
      name: "Your name",
      email: "Your email",
      location: "City or region",
      topic: "Which local issue matters to you? (optional)",
      intentions: "I would like to …",
      notes: "Anything else we should know? (optional)",
      contactConsent: "VoiceOpenGov may contact me about this regional request.",
      matchingConsent:
        "Where appropriate, you may later ask whether I want to be introduced to other interested people nearby.",
      privacy: {
        before: "I accept the",
        link: "privacy notice",
        after: ".",
      },
      honeypot: "Please leave this field empty",
    },
    placeholders: {
      location: "e.g. Berlin-Rahnsdorf, Cologne or Rhine-Main",
      topic: "e.g. safer school routes, care, housing, transport or another local issue",
      notes: "Time, experience, contacts, spaces or anything important to you …",
    },
    intentionOptions: [
      {
        value: "stay_informed",
        label: "know what is happening in my region",
        hint: "I would initially like to stay connected and follow local developments.",
      },
      {
        value: "join_meetup",
        label: "meet people from my neighbourhood",
        hint: "I would like to join a first local gathering.",
      },
      {
        value: "start_meetup",
        label: "provide the first impulse",
        hint: "I would like to start a gathering or conversation without organising everything alone.",
      },
      {
        value: "help_organize",
        label: "help organise and build locally",
        hint: "I can take on a manageable part and build together with others.",
      },
      {
        value: "offer_space",
        label: "make a room or meeting place available",
        hint: "I may know or have a suitable place.",
      },
      {
        value: "offer_contacts",
        label: "connect people and contacts",
        hint: "I know associations, institutions, initiatives or neighbours who may want to contribute.",
      },
      {
        value: "offer_expertise",
        label: "contribute knowledge or experience",
        hint: "I can help with specialist, organisational or practical knowledge.",
      },
      {
        value: "regional_long_term",
        label: "help build a regional contact point",
        hint: "I want to take on longer-term responsibility and help develop VoiceOpenGov locally.",
      },
    ],
    notices: {
      intentionRequired: "Please select at least one option.",
      consentRequired: "Please confirm contact and privacy.",
      humanRequired: "Please complete the short anti-spam check.",
      submitOk:
        "Thank you. Your regional interest has arrived. We will contact you when there is a meaningful next step.",
      submitFail: "That did not work yet. Please try again later.",
    },
    submit: "Register for my region",
    submitting: "Submitting …",
  },
  humanCheck: enHumanCheck,
};

export function getRegionalActivationStrings(locale: SupportedLocale): RegionalActivationStrings {
  return locale === "en" ? EN : DE;
}
