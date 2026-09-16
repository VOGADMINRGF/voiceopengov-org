"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getCountryOptions } from "@/lib/countries";
import {
  EDEBATTE_SIGNUP_URL,
  VOG_JOIN_PATH,
  VOG_QUESTIONS_PATH,
} from "@/config/links";
import type { SupportedLocale } from "@/config/locales";

type Notice = { ok: boolean; msg: string } | null;

type LabeledItem = { title: string; body: string };

export type HomeRelaunchCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  heroQuote: string;
  heroQuoteSource: string;
  ctaJoin: string;
  ctaUnderstand: string;
  realityEyebrow: string;
  realityTitle: string;
  realityLead: string;
  realityItems: string[];
  bridge: string;
  landscapeTitle: string;
  landscapeBody: string;
  landscapeItems: LabeledItem[];
  movementTitle: string;
  movementBody: string;
  movementCards: LabeledItem[];
  ecosystemEyebrow: string;
  ecosystemTitle: string;
  ecosystemBody: string;
  ecosystemItems: LabeledItem[];
  edebatteTitle: string;
  edebatteBody: string;
  edebatteCta: string;
  voxyTitle: string;
  voxyBody: string;
  voxyQuote: string;
  regionalTitle: string;
  regionalBody: string;
  regionalItems: LabeledItem[];
  transparencyTitle: string;
  transparencyBody: string;
  transparencyEyebrow: string;
  transparencyItems: string[];
  questionsTitle: string;
  questionsBody: string;
  questionsEyebrow: string;
  questionsCta: string;
  questions: string[];
  joinTitle: string;
  joinBody: string;
  membershipEyebrow: string;
  contactLabel: string;
  person: string;
  organisation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  organisationName: string;
  email: string;
  city: string;
  country: string;
  countryPlaceholder: string;
  privacy: string;
  newsletter: string;
  submit: string;
  submitting: string;
  validationError: string;
  submitSuccess: string;
  submitError: string;
  submitUnavailable: string;
  supportTitle: string;
  supportBody: string;
  supportCta: string;
};

export const HOME_RELAUNCH_COPY: Record<"de" | "en", HomeRelaunchCopy> = {
  de: {
    eyebrow: "Die Infrastruktur für informierte Demokratie",
    title: "Nicht die nächste Partei. Die Verbindung dazwischen.",
    intro:
      "VoiceOpenGov will Information, nachvollziehbare Debatte, Beteiligung und Wirkung in einer gemeinsamen Infrastruktur verbinden – politisch unabhängig, digital skalierbar und regional sichtbar.",
    heroQuote:
      "Eine starke Demokratie braucht nicht nur mehr Stimmen. Sie braucht bessere Wege, Wissen, Perspektiven und Entscheidungen nachvollziehbar miteinander zu verbinden.",
    heroQuoteSource: "VoiceOpenGov · Infrastruktur statt Parteilogik",
    ctaJoin: "Mitglied werden",
    ctaUnderstand: "Das Modell verstehen",
    realityEyebrow: "Gesellschaftliche Notwendigkeit",
    realityTitle: "Viele Akteure. Keine durchgängige Infrastruktur.",
    realityLead:
      "Heute sind zentrale Funktionen demokratischer Öffentlichkeit auf viele Systeme verteilt. Parteien vertreten Programme und Interessen, direkte Demokratie entscheidet konkrete Fragen, Wissensplattformen strukturieren Informationen und Verwaltungen organisieren Beteiligungsverfahren. Dazwischen fehlt häufig die durchgehende Verbindung.",
    realityItems: [
      "Information ist verfügbar – aber selten direkt mit Entscheidungsoptionen und Folgen verknüpft.",
      "Debatten finden statt – aber Quellen, Gegenargumente und Unsicherheit bleiben oft voneinander getrennt.",
      "Beteiligung existiert – aber häufig nur innerhalb einzelner Verfahren oder Institutionen.",
      "Nach Entscheidungen fehlt oft eine allgemein zugängliche Spur von Ausgangsfrage bis Wirkung.",
    ],
    bridge:
      "VoiceOpenGov will diese Systeme nicht ersetzen. Es soll die neutrale Infrastruktur zwischen Information, Debatte, Beteiligung, Entscheidung und Wirkung schaffen.",
    landscapeTitle: "Der Raum ist besetzt. Die Verbindung ist es nicht.",
    landscapeBody:
      "Bestehende Modelle erfüllen wichtige Aufgaben – aber unterschiedliche. VoiceOpenGov setzt dort an, wo diese Funktionen heute auseinanderliegen.",
    landscapeItems: [
      { title: "Parteien", body: "Bündeln politische Positionen, Programme und Personal und konkurrieren um demokratische Mandate." },
      { title: "Direkte Demokratie", body: "Ermöglicht Entscheidungen über konkrete Sachfragen dort, wo entsprechende Verfahren vorgesehen sind." },
      { title: "Wikipedia & Wissensplattformen", body: "Strukturieren Wissen und Quellen, sind aber keine Beteiligungs- oder Entscheidungsinfrastruktur." },
      { title: "Digitale Bürgerbeteiligung", body: "Organisiert häufig konkrete Beteiligungsverfahren von Kommunen, Verwaltungen oder Institutionen." },
    ],
    movementTitle: "VoiceOpenGov ist der Rahmen. eDebatte ist das Arbeitsinstrument.",
    movementBody:
      "Die Marke VoiceOpenGov steht für die gesellschaftliche Infrastruktur und ihre Governance. eDebatte übersetzt komplexe Themen in prüfbare Entscheidungsräume. Regionale Formate bringen diese Infrastruktur dorthin, wo Menschen leben.",
    movementCards: [
      { title: "Verstehen", body: "Quellen, Zielkonflikte, Argumente, Unsicherheiten und Alternativen werden sichtbar, bevor entschieden wird." },
      { title: "Beteiligen", body: "Menschen können Fragen, Perspektiven und Entscheidungen in nachvollziehbaren Räumen zusammenführen." },
      { title: "Nachverfolgen", body: "Entscheidungen enden nicht beim Voting: Umsetzung, Veränderungen und Wirkung sollen sichtbar bleiben." },
    ],
    ecosystemEyebrow: "VoiceOpenGov Ökosystem",
    ecosystemTitle: "Eine Holding-Logik für digitale Infrastruktur und regionale Präsenz.",
    ecosystemBody:
      "Perspektivisch soll VoiceOpenGov die gemeinsame Dachstruktur bilden: ein einheitlicher Vertrauensrahmen für digitale Produkte, regionale Präsenz, Medien- und Datenservices sowie physische Begegnungsräume.",
    ecosystemItems: [
      { title: "eDebatte", body: "Decision Dossiers, Pro/Contra, Faktenlogik, Alternativen und strukturierte Beteiligung." },
      { title: "VoiceOpenGov Platform", body: "Mitgliedschaft, Regionen, Voting, Reports, Transparenz und ImpactTrace." },
      { title: "eDebatte Mobil", body: "Busse, Roadshows, Podcast, Bildung, Live-Dialog und Beteiligung vor Ort." },
      { title: "Regionale Hubs & Läden", body: "Lokale Sichtbarkeit, Community, Workshops, Store, Veranstaltungen und Anlaufpunkte." },
      { title: "Data & Media Services", body: "Dashboards, API, redaktionelle Werkzeuge, White-Label und Datenprodukte mit klaren Governance-Regeln." },
    ],
    edebatteTitle: "eDebatte macht aus Information einen prüfbaren Entscheidungsraum.",
    edebatteBody:
      "Aus Quellen werden nachvollziehbare Claims, Gegenpositionen, Alternativen, Eventualitäten, Mehrheitsbilder, Minderheitenvoten und Wirkung. Der Reasoning Graph soll zeigen, wie aus Information eine Schlussfolgerung entsteht – und wo Unsicherheit bleibt.",
    edebatteCta: "eDebatte öffnen",
    voxyTitle: "Voxy begleitet. Voxy entscheidet nicht.",
    voxyBody:
      "Voxy strukturiert Beiträge, verbindet Quellen, erkennt Widersprüche und macht Unsicherheit sichtbar. Die politische Entscheidung bleibt beim Menschen.",
    voxyQuote: "Du musst uns nicht glauben. Du sollst prüfen können, wie wir zu unseren Aussagen kommen.",
    regionalTitle: "Digital allein reicht nicht. Vertrauen braucht Präsenz.",
    regionalBody:
      "Busse, regionale Hubs und perspektivisch Läden oder Studios sollen VoiceOpenGov aus dem Browser in Städte, Gemeinden, Schulen, Hochschulen und Nachbarschaften bringen.",
    regionalItems: [
      { title: "eDebatte Mobil", body: "Mobiler Debattenraum mit Dossier-Stationen, Live-Voting, Workshops und Content-Produktion." },
      { title: "Regionale Hubs", body: "Lokale Ansprechpartner, Veranstaltungen und sichtbare Räume für kontinuierliche Beteiligung." },
      { title: "Store & Community", body: "Merchandise, Debattenkarten, Dossier-Prints und Event-Kits finanzieren Sichtbarkeit und Gemeinschaft – nicht politische Gewichtung." },
    ],
    transparencyTitle: "Vertrauen beginnt bei der eigenen Architektur.",
    transparencyBody:
      "Transparenz ist kein Unterpunkt. Sie ist das Betriebssystem von VoiceOpenGov und eDebatte – bei Finanzierung, KI, Entscheidungen, Quellen und Governance.",
    transparencyEyebrow: "Vertrauensarchitektur",
    transparencyItems: [
      "Finanzierung und Abhängigkeiten",
      "Entscheidungen und Verantwortlichkeiten",
      "Mitgliederentwicklung und Governance",
      "Quellen, Änderungen und offene Fehler",
      "KI-Einsatz und Interessenkonflikte",
      "Wirkung, Zweifel und Kurskorrekturen",
    ],
    questionsTitle: "50 große Fragen. Keine 50 fertigen Antworten.",
    questionsBody:
      "Unsere öffentlichen Räume beginnen nicht mit Parteischubladen, sondern mit Zielkonflikten, Evidenz und der Frage, welche Optionen tatsächlich bestehen.",
    questionsEyebrow: "Öffentliche Entscheidungsräume",
    questionsCta: "Alle 50 öffentlichen Fragen ansehen →",
    questions: [
      "Wann ist eine politische Entscheidung wirklich legitim?",
      "Wie schützen wir Freiheit und Sicherheit zugleich?",
      "Wie nutzen wir KI so, dass sie Menschen stärkt?",
      "Wie sichern wir Wohlstand und unsere Lebensgrundlagen?",
      "Wie verbinden wir nationale Souveränität und internationale Verantwortung?",
      "Wie lernen Gesellschaften sichtbar aus Fehlern?",
    ],
    joinTitle: "Werde Teil der Infrastruktur.",
    joinBody:
      "Die Mitgliedschaft ist kostenfrei. Ein freiwilliger Beitrag hilft beim Aufbau, kauft aber niemals mehr Stimme, politische Gewichtung oder redaktionellen Einfluss.",
    membershipEyebrow: "Mitgliedschaft",
    contactLabel: "Kontakt",
    person: "Person",
    organisation: "Organisation",
    firstName: "Vorname",
    lastName: "Nachname",
    birthDate: "Geburtsdatum",
    organisationName: "Organisation",
    email: "E-Mail",
    city: "Ort",
    country: "Land",
    countryPlaceholder: "Bitte wählen",
    privacy: "Ich akzeptiere die Datenschutzhinweise und das Double-Opt-In-Verfahren.",
    newsletter: "Ich möchte Updates zu VoiceOpenGov erhalten.",
    submit: "Kostenfrei Mitglied werden",
    submitting: "Wird eingetragen …",
    validationError: "Bitte E-Mail, Ort und Datenschutz bestätigen.",
    submitSuccess: "Fast geschafft. Bitte bestätige jetzt die E-Mail.",
    submitError: "Das hat noch nicht funktioniert. Bitte versuche es erneut.",
    submitUnavailable: "Die Anmeldung ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.",
    supportTitle: "Infrastruktur ermöglichen, ohne Einfluss zu verkaufen.",
    supportBody:
      "Mitgliedschaft und Finanzierung bleiben getrennt. Wer mehr gibt, erhält nicht mehr politische Gewichtung oder redaktionelle Macht.",
    supportCta: "Freiwillig unterstützen",
  },
  en: {
    eyebrow: "Infrastructure for informed democracy",
    title: "Not another party. The connection in between.",
    intro:
      "VoiceOpenGov aims to connect information, traceable debate, participation and impact in one infrastructure – politically independent, digitally scalable and regionally visible.",
    heroQuote:
      "A strong democracy needs more than more voices. It needs better ways to connect knowledge, perspectives and decisions transparently.",
    heroQuoteSource: "VoiceOpenGov · Infrastructure instead of party logic",
    ctaJoin: "Become a member",
    ctaUnderstand: "Understand the model",
    realityEyebrow: "Societal need",
    realityTitle: "Many actors. No continuous infrastructure.",
    realityLead:
      "Key functions of democratic public life are distributed across many systems. Parties represent programmes and interests, direct-democratic instruments decide specific questions, knowledge platforms structure information, and administrations organise participation processes. The continuous connection between them is often missing.",
    realityItems: [
      "Information is available, but rarely connected directly to options, trade-offs and consequences.",
      "Debate happens, but sources, counterarguments and uncertainty often remain separated.",
      "Participation exists, but commonly within individual procedures or institutions.",
      "After decisions, a broadly accessible trace from the original question to real-world impact is often missing.",
    ],
    bridge:
      "VoiceOpenGov does not aim to replace these systems. It aims to build the neutral infrastructure between information, debate, participation, decision and impact.",
    landscapeTitle: "The space is occupied. The connection is not.",
    landscapeBody:
      "Existing models perform important but different functions. VoiceOpenGov starts where these functions are currently disconnected.",
    landscapeItems: [
      { title: "Parties", body: "Bundle political positions, programmes and personnel and compete for democratic mandates." },
      { title: "Direct democracy", body: "Enables decisions on specific public questions where corresponding procedures are provided." },
      { title: "Wikipedia & knowledge platforms", body: "Structure knowledge and sources but are not participation or decision infrastructures." },
      { title: "Digital civic participation", body: "Often organises defined participation procedures run by municipalities, administrations or institutions." },
    ],
    movementTitle: "VoiceOpenGov is the framework. eDebatte is the working instrument.",
    movementBody:
      "VoiceOpenGov represents the societal infrastructure and its governance. eDebatte turns complex issues into inspectable decision spaces. Regional formats bring this infrastructure to where people live.",
    movementCards: [
      { title: "Understand", body: "Sources, trade-offs, arguments, uncertainty and alternatives become visible before decisions are made." },
      { title: "Participate", body: "People can connect questions, perspectives and decisions in traceable public spaces." },
      { title: "Trace impact", body: "Decisions do not end with a vote: implementation, change and impact should remain visible." },
    ],
    ecosystemEyebrow: "VoiceOpenGov ecosystem",
    ecosystemTitle: "A holding logic for digital infrastructure and regional presence.",
    ecosystemBody:
      "Over time, VoiceOpenGov is intended to form the shared umbrella structure: one trust framework for digital products, regional presence, media and data services, and physical spaces for participation.",
    ecosystemItems: [
      { title: "eDebatte", body: "Decision dossiers, pro/con, evidence logic, alternatives and structured participation." },
      { title: "VoiceOpenGov Platform", body: "Membership, regions, voting, reports, transparency and ImpactTrace." },
      { title: "eDebatte Mobil", body: "Buses, roadshows, podcasts, education, live dialogue and on-site participation." },
      { title: "Regional hubs & stores", body: "Local visibility, community, workshops, store, events and contact points." },
      { title: "Data & Media Services", body: "Dashboards, API, editorial tools, white-label and data products under clear governance rules." },
    ],
    edebatteTitle: "eDebatte turns information into an inspectable decision space.",
    edebatteBody:
      "Sources become traceable claims, counterpositions, alternatives, contingencies, majority patterns, minority views and impact. The Reasoning Graph is designed to show how information becomes a conclusion – and where uncertainty remains.",
    edebatteCta: "Open eDebatte",
    voxyTitle: "Voxy assists. Voxy does not decide.",
    voxyBody:
      "Voxy structures contributions, connects sources, identifies contradictions and makes uncertainty visible. Political decisions remain with people.",
    voxyQuote: "You do not have to believe us. You should be able to inspect how we reached our conclusions.",
    regionalTitle: "Digital alone is not enough. Trust needs presence.",
    regionalBody:
      "Buses, regional hubs and, over time, stores or studios are intended to bring VoiceOpenGov from the browser into cities, municipalities, schools, universities and neighbourhoods.",
    regionalItems: [
      { title: "eDebatte Mobil", body: "A mobile debate space with dossier stations, live voting, workshops and content production." },
      { title: "Regional hubs", body: "Local contacts, events and visible spaces for continuous participation." },
      { title: "Store & Community", body: "Merchandise, debate cards, dossier prints and event kits help finance visibility and community – never political weight." },
    ],
    transparencyTitle: "Trust starts with our own architecture.",
    transparencyBody:
      "Transparency is not a subsection. It is the operating system of VoiceOpenGov and eDebatte – across funding, AI, decisions, sources and governance.",
    transparencyEyebrow: "Trust architecture",
    transparencyItems: [
      "Funding and dependencies",
      "Decisions and responsibilities",
      "Membership development and governance",
      "Sources, changes and open mistakes",
      "AI use and conflicts of interest",
      "Impact, doubts and course corrections",
    ],
    questionsTitle: "50 major questions. Not 50 finished answers.",
    questionsBody:
      "Our public spaces begin with trade-offs, evidence and the question of which options actually exist – not party labels.",
    questionsEyebrow: "Public decision spaces",
    questionsCta: "View all 50 public questions →",
    questions: [
      "When is a political decision truly legitimate?",
      "How do we protect freedom and security at the same time?",
      "How do we use AI to strengthen people?",
      "How do we protect prosperity and the foundations of life?",
      "How do we connect national sovereignty and international responsibility?",
      "How do societies visibly learn from mistakes?",
    ],
    joinTitle: "Become part of the infrastructure.",
    joinBody:
      "Membership is free. A voluntary contribution helps build the project, but never buys more voice, political weight or editorial influence.",
    membershipEyebrow: "Membership",
    contactLabel: "Contact",
    person: "Person",
    organisation: "Organisation",
    firstName: "First name",
    lastName: "Last name",
    birthDate: "Date of birth",
    organisationName: "Organisation",
    email: "Email",
    city: "City",
    country: "Country",
    countryPlaceholder: "Please choose",
    privacy: "I accept the privacy notice and double opt-in process.",
    newsletter: "I would like updates about VoiceOpenGov.",
    submit: "Join for free",
    submitting: "Joining …",
    validationError: "Please provide email, city and privacy consent.",
    submitSuccess: "Almost there. Please confirm your email.",
    submitError: "That did not work yet. Please try again.",
    submitUnavailable: "Registration is temporarily unavailable. Please try again later.",
    supportTitle: "Enable infrastructure without selling influence.",
    supportBody:
      "Membership and funding remain separate. Giving more never creates more political weight or editorial power.",
    supportCta: "Support voluntarily",
  },
};

const sectionClass = "mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28";
const cardClass = "rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/10 backdrop-blur";

export default function HomeClient({
  contactEmail,
  copy = HOME_RELAUNCH_COPY.de,
  renderedLocale,
}: {
  supportBank: Record<string, unknown>;
  contactEmail: string;
  copy: HomeRelaunchCopy;
  renderedLocale: SupportedLocale;
}) {
  const { locale } = useLocale();
  const countryOptions = useMemo(() => getCountryOptions(locale), [locale]);
  const [type, setType] = useState<"person" | "organisation">("person");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);
  const formStarted = useRef(false);
  const sessionId = useRef("");

  function track(event: "landing_viewed" | "form_started") {
    const params = new URLSearchParams(window.location.search);
    void fetch("/api/funnel/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event,
        sessionId: sessionId.current,
        source: params.get("utm_source") || undefined,
        medium: params.get("utm_medium") || undefined,
        campaign: params.get("utm_campaign") || undefined,
        locale: renderedLocale,
        landingPath: window.location.pathname,
      }),
    }).catch(() => undefined);
  }

  function markFormStarted() {
    if (formStarted.current) return;
    formStarted.current = true;
    track("form_started");
  }

  useEffect(() => {
    const storageKey = "vog_funnel_session";
    sessionId.current = sessionStorage.getItem(storageKey) || crypto.randomUUID();
    sessionStorage.setItem(storageKey, sessionId.current);
    track("landing_viewed");
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    if (!privacy || !email.trim() || !city.trim()) {
      setNotice({ ok: false, msg: copy.validationError });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/members/public-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          email: email.trim(),
          firstName: type === "person" ? firstName.trim() || undefined : undefined,
          lastName: type === "person" ? lastName.trim() || undefined : undefined,
          birthDate: type === "person" ? birthDate || undefined : undefined,
          orgName: type === "organisation" ? organisation.trim() || undefined : undefined,
          city: city.trim(),
          country: country || undefined,
          isPublic: true,
          wantsNewsletter: newsletter,
          wantsNewsletterEdDebatte: false,
          locale: renderedLocale,
          acquisition: {
            landingPath: window.location.pathname,
            referrer: document.referrer || undefined,
            utmSource: new URLSearchParams(window.location.search).get("utm_source") || undefined,
            utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
            utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) {
        if (response.status === 503) throw new Error("registration_unavailable");
        throw new Error("registration_failed");
      }
      setNotice({ ok: true, msg: copy.submitSuccess });
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setOrganisation("");
      setEmail("");
      setCity("");
      setCountry("");
      setPrivacy(false);
      setNewsletter(false);
    } catch (error) {
      setNotice({
        ok: false,
        msg:
          error instanceof Error && error.message === "registration_unavailable"
            ? copy.submitUnavailable
            : copy.submitError,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07110f] text-[#f4f1e8]">
      <section className="relative isolate min-h-[88vh] border-b border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(26,140,255,0.24),transparent_30%),radial-gradient(circle_at_20%_75%,rgba(24,207,200,0.18),transparent_34%)]" />
        <div className="mx-auto grid min-h-[88vh] max-w-6xl items-center gap-12 px-5 py-20 md:px-8 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.28em] text-[#d6ff65]">{copy.eyebrow}</p>
            <h1 className="max-w-5xl text-6xl font-black leading-[0.94] tracking-[-0.055em] md:text-8xl">{copy.title}</h1>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-white/72 md:text-2xl">{copy.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#reality" className="rounded-full bg-[#d6ff65] px-6 py-3 font-bold text-[#07110f]">{copy.ctaUnderstand}</a>
              <Link href={VOG_JOIN_PATH} className="rounded-full border border-white/20 px-6 py-3 font-bold text-white">{copy.ctaJoin}</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md rounded-[3rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl">
            <div className="flex min-h-[28rem] flex-col justify-between rounded-[2.2rem] border border-[#d6ff65]/25 bg-[#0d1d19] p-7">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.24em] text-[#d6ff65]"><span>VoiceOpenGov</span><span>01</span></div>
              <blockquote className="text-3xl font-semibold leading-snug">“{copy.heroQuote}”</blockquote>
              <p className="text-sm leading-relaxed text-white/55">{copy.heroQuoteSource}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="reality" className={sectionClass}>
        <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6ff65]">{copy.realityEyebrow}</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{copy.realityTitle}</h2>
          </div>
          <div>
            <p className="text-xl leading-relaxed text-white/70">{copy.realityLead}</p>
            <div className="mt-8 grid gap-3">
              {copy.realityItems.map((item, index) => (
                <div key={item} className="flex gap-4 border-t border-white/10 py-5">
                  <span className="font-mono text-sm text-[#d6ff65]">0{index + 1}</span>
                  <p className="text-lg">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 border-l-2 border-[#d6ff65] pl-6 text-2xl font-semibold leading-relaxed">{copy.bridge}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b1714]">
        <div className={sectionClass}>
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6ff65]">Landscape</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{copy.landscapeTitle}</h2>
            <p className="mt-6 text-xl leading-relaxed text-white/65">{copy.landscapeBody}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {copy.landscapeItems.map((item, index) => (
              <article key={item.title} className={cardClass}>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d6ff65]">0{index + 1}</p>
                <h3 className="mt-5 text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 leading-relaxed text-white/62">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="movement" className={sectionClass}>
        <div className="max-w-4xl">
          <h2 className="text-4xl font-black tracking-tight md:text-6xl">{copy.movementTitle}</h2>
          <p className="mt-6 text-xl leading-relaxed text-white/65">{copy.movementBody}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {copy.movementCards.map((card) => (
            <article key={card.title} className={cardClass}>
              <h3 className="text-2xl font-bold">{card.title}</h3>
              <p className="mt-4 leading-relaxed text-white/62">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b1714]">
        <div className={sectionClass}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6ff65]">{copy.ecosystemEyebrow}</p>
          <h2 className="mt-4 max-w-5xl text-4xl font-black tracking-tight md:text-6xl">{copy.ecosystemTitle}</h2>
          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/65">{copy.ecosystemBody}</p>
          <div className="mt-12 rounded-[2.4rem] border border-[#d6ff65]/25 bg-white/[0.035] p-5 md:p-8">
            <div className="mb-8 rounded-3xl border border-[#d6ff65]/35 bg-[#0d1d19] p-7 text-center">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#d6ff65]">Dach & Governance</p>
              <h3 className="mt-3 text-3xl font-black">VoiceOpenGov</h3>
              <p className="mt-2 text-white/55">Politisch unabhängig · wirtschaftlich tragfähig · regional sichtbar</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {copy.ecosystemItems.map((item, index) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="font-mono text-xs text-[#d6ff65]">0{index + 1}</p>
                  <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/58">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="edebatte" className={sectionClass}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d6ff65]">eDebatte · Decision Dossier Engine</p>
            <h2 className="mt-5 text-4xl font-black tracking-tight">{copy.edebatteTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-white/65">{copy.edebatteBody}</p>
            <a href={EDEBATTE_SIGNUP_URL} className="mt-8 inline-flex rounded-full border border-[#d6ff65]/50 px-5 py-2.5 font-bold text-[#d6ff65]">{copy.edebatteCta} ↗</a>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#d6ff65] p-8 text-[#07110f]">
            <p className="text-xs font-black uppercase tracking-[0.25em]">Voxy</p>
            <h2 className="mt-5 text-4xl font-black tracking-tight">{copy.voxyTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-[#07110f]/70">{copy.voxyBody}</p>
            <blockquote className="mt-9 border-l-2 border-[#07110f] pl-5 text-2xl font-bold leading-snug">„{copy.voxyQuote}“</blockquote>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b1714]">
        <div className={sectionClass}>
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6ff65]">Regionale Präsenz</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{copy.regionalTitle}</h2>
              <p className="mt-6 text-xl leading-relaxed text-white/65">{copy.regionalBody}</p>
            </div>
            <div className="grid gap-4">
              {copy.regionalItems.map((item, index) => (
                <article key={item.title} className={cardClass}>
                  <div className="flex items-start gap-5">
                    <span className="font-mono text-sm text-[#d6ff65]">0{index + 1}</span>
                    <div><h3 className="text-2xl font-bold">{item.title}</h3><p className="mt-3 leading-relaxed text-white/62">{item.body}</p></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="transparency" className="border-y border-white/10 bg-[#f0eee5] text-[#07110f]">
        <div className={sectionClass}>
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em]">{copy.transparencyEyebrow}</p>
              <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{copy.transparencyTitle}</h2>
              <p className="mt-6 text-xl leading-relaxed text-[#07110f]/65">{copy.transparencyBody}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.transparencyItems.map((item) => <div key={item} className="rounded-2xl border border-[#07110f]/15 p-5 font-bold">↗ {item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6ff65]">{copy.questionsEyebrow}</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{copy.questionsTitle}</h2>
          <p className="mt-6 text-xl text-white/65">{copy.questionsBody}</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {copy.questions.map((question, index) => (
            <div key={question} className="group flex items-start gap-5 rounded-2xl border border-white/10 p-6 transition hover:border-[#d6ff65]/50">
              <span className="font-mono text-sm text-[#d6ff65]">{String(index + 1).padStart(2, "0")}</span>
              <p className="text-xl font-semibold leading-snug">{question}</p>
            </div>
          ))}
        </div>
        <Link href={VOG_QUESTIONS_PATH} className="mt-8 inline-flex font-bold text-[#d6ff65]">{copy.questionsCta}</Link>
      </section>

      <section id="mitmachen" className="scroll-mt-24 border-t border-white/10 bg-[#0b1714]">
        <div className={sectionClass}>
          <div className="grid min-w-0 gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6ff65]">{copy.membershipEyebrow}</p>
              <h2 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">{copy.joinTitle}</h2>
              <p className="mt-6 text-xl leading-relaxed text-white/65">{copy.joinBody}</p>
              <p className="mt-8 break-all text-sm text-white/45">{copy.contactLabel}: {contactEmail}</p>
            </div>
            <form onSubmit={submit} onFocusCapture={markFormStarted} className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6 md:p-8">
              <div className="mb-6 flex gap-2">
                <button type="button" aria-pressed={type === "person"} onClick={() => setType("person")} className={`rounded-full px-4 py-2 text-sm font-bold ${type === "person" ? "bg-[#d6ff65] text-[#07110f]" : "border border-white/15"}`}>{copy.person}</button>
                <button type="button" aria-pressed={type === "organisation"} onClick={() => setType("organisation")} className={`rounded-full px-4 py-2 text-sm font-bold ${type === "organisation" ? "bg-[#d6ff65] text-[#07110f]" : "border border-white/15"}`}>{copy.organisation}</button>
              </div>
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                {type === "person" ? <>
                  <input aria-label={copy.firstName} autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={copy.firstName} className="w-full min-w-0 max-w-full rounded-xl border border-white/15 bg-[#07110f] px-4 py-3 outline-none focus:border-[#d6ff65]" />
                  <input aria-label={copy.lastName} autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={copy.lastName} className="w-full min-w-0 max-w-full rounded-xl border border-white/15 bg-[#07110f] px-4 py-3 outline-none focus:border-[#d6ff65]" />
                  <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} aria-label={copy.birthDate} autoComplete="bday" className="w-full min-w-0 max-w-full rounded-xl border border-white/15 bg-[#07110f] px-4 py-3 outline-none focus:border-[#d6ff65]" />
                </> : <input aria-label={copy.organisationName} autoComplete="organization" value={organisation} onChange={(e) => setOrganisation(e.target.value)} placeholder={copy.organisationName} className="w-full min-w-0 max-w-full rounded-xl border border-white/15 bg-[#07110f] px-4 py-3 outline-none focus:border-[#d6ff65] sm:col-span-2" />}
                <input type="email" required aria-label={copy.email} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={copy.email} className="w-full min-w-0 max-w-full rounded-xl border border-white/15 bg-[#07110f] px-4 py-3 outline-none focus:border-[#d6ff65]" />
                <input required aria-label={copy.city} autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} placeholder={copy.city} className="w-full min-w-0 max-w-full rounded-xl border border-white/15 bg-[#07110f] px-4 py-3 outline-none focus:border-[#d6ff65]" />
                <select aria-label={copy.countryPlaceholder} autoComplete="country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full min-w-0 max-w-full rounded-xl border border-white/15 bg-[#07110f] px-4 py-3 outline-none focus:border-[#d6ff65] sm:col-span-2"><option value="">{copy.countryPlaceholder}</option>{countryOptions.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}</select>
              </div>
              <label className="mt-6 flex min-w-0 items-start gap-3 text-sm text-white/65"><input type="checkbox" required checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-1 shrink-0" /><span className="min-w-0 break-words">{copy.privacy}</span></label>
              <label className="mt-3 flex min-w-0 items-start gap-3 text-sm text-white/65"><input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-1 shrink-0" /><span className="min-w-0 break-words">{copy.newsletter}</span></label>
              {notice && <p role={notice.ok ? "status" : "alert"} aria-live="polite" className={`mt-5 min-w-0 break-words rounded-xl px-4 py-3 text-sm ${notice.ok ? "bg-emerald-400/15 text-emerald-200" : "bg-red-400/15 text-red-200"}`}>{notice.msg}</p>}
              <button disabled={submitting} className="mt-6 w-full min-w-0 whitespace-normal rounded-full bg-[#d6ff65] px-4 py-3.5 text-center font-black leading-snug text-[#07110f] disabled:opacity-60">{submitting ? copy.submitting : copy.submit}</button>
            </form>
          </div>
        </div>
      </section>

      <section id="voiceopengov-support" className="scroll-mt-24 border-t border-white/10">
        <div className={`${sectionClass} py-14 md:py-16`}>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div><h2 className="text-3xl font-black">{copy.supportTitle}</h2><p className="mt-3 max-w-2xl text-white/60">{copy.supportBody}</p></div>
            <Link href="/unterstuetzen" className="rounded-full border border-white/20 px-6 py-3 font-bold transition hover:border-[#d6ff65]/60 hover:text-[#d6ff65]">{copy.supportCta}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
