import Link from "next/link";
import { getRequestLocale } from "@/lib/locale";
import { VOG_JOIN_PATH, VOG_QUESTIONS_PATH } from "@/config/links";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";

type Language = "de" | "en";

type Contribution = {
  title: string;
  body: string;
  action: string;
  href: string;
};

const COPY = {
  de: {
    metaTitle: "Mitwirken",
    description: "Konkrete Wege, wie Mitglieder und Unterstützer bei VoiceOpenGov mitwirken können.",
    eyebrow: "Mitwirken",
    title: "Du musst keine Funktion übernehmen. Du kannst einfach anfangen.",
    intro:
      "VoiceOpenGov braucht keine starren Titel, sondern konkrete Beiträge. Du kannst an Fragen arbeiten, Quellen prüfen, erklären, übersetzen, vor Ort Menschen zusammenbringen oder die Infrastruktur unterstützen.",
    clarificationTitle: "Kein Amt. Keine Bewerbung. Keine feste Schublade.",
    clarificationBody:
      "Die Beispiele unten zeigen mögliche Beiträge. Du kannst mehrere kombinieren, später wechseln oder klein anfangen. Entscheidend ist, was du konkret beitragen möchtest.",
    contributionLabel: "So kannst du mitwirken",
    contributions: [
      { title: "Themen verfolgen", body: "Du stellst Fragen, widersprichst, ergänzt Perspektiven und hilfst dabei, Prioritäten sichtbar zu machen.", action: "Öffentliche Fragen ansehen", href: "/fragen" },
      { title: "Quellen beitragen", body: "Du suchst belastbare Quellen, Gegenquellen und fehlende Perspektiven, ohne daraus automatisch eine politische Bewertung abzuleiten.", action: "Bei einer Frage mitarbeiten", href: "/fragen" },
      { title: "Zusammenhänge erklären", body: "Du hilfst dabei, komplexe Inhalte verständlicher zu machen, ohne Unsicherheit oder Zielkonflikte zu verstecken.", action: "Bei einer Frage mitarbeiten", href: "/fragen" },
      { title: "Sprachen verbinden", body: "Du hilfst Menschen über Sprachen und kulturelle Kontexte hinweg, dieselbe Frage möglichst gleich zu verstehen.", action: "Interesse mitteilen", href: "/kontakt" },
      { title: "Verfahren moderieren", body: "Du hilfst, respektvollen Widerspruch, klare Regeln und die Trennung zwischen Moderation und politischer Bewertung zu sichern.", action: "Interesse mitteilen", href: "/kontakt" },
      { title: "Vor Ort aktiv werden", body: "Du möchtest Menschen in deiner Region kennenlernen, einen Austausch anstoßen oder mit Raum, Kontakten und Erfahrung helfen.", action: "In meiner Region starten", href: "/vor-ort" },
      { title: "Qualität prüfen", body: "Du hinterfragst Quellenlage, Rechtsbezug, Annahmen, Repräsentativität und mögliche Interessenkonflikte.", action: "Bei einer Frage mitarbeiten", href: "/fragen" },
      { title: "Infrastruktur unterstützen", body: "Du ermöglichst Recherche, Technik und Community-Arbeit. Unterstützung kauft keine zusätzliche Stimme oder politische Gewichtung.", action: "VoiceOpenGov unterstützen", href: "/unterstuetzen" },
      { title: "Als Organisation beitragen", body: "Du bringst Wissen, Reichweite oder Infrastruktur ein – mit offengelegten Interessen und ohne bevorzugte politische Gewichtung.", action: "Partnerschaft kennenlernen", href: "/initiatives" },
    ] satisfies Contribution[],
    nextEyebrow: "Dein nächster Schritt",
    nextTitle: "Wähle nur, womit du heute anfangen möchtest.",
    nextBody:
      "Mitglied werden, an einer öffentlichen Frage mitarbeiten oder vor Ort aktiv werden – alles führt in denselben Beteiligungsprozess. Du musst dich heute nicht langfristig festlegen.",
    join: "Kostenfrei Mitglied werden",
    question: "An einer Frage mitarbeiten",
    regional: "In meiner Region aktiv werden",
  },
  en: {
    metaTitle: "Contribute",
    description: "Practical ways for members and supporters to contribute to VoiceOpenGov.",
    eyebrow: "Contribute",
    title: "You do not need a formal function. You can simply begin.",
    intro:
      "VoiceOpenGov does not need rigid titles. It needs concrete contributions: questions, sources, explanations, translation, local activity and support for the infrastructure.",
    clarificationTitle: "No office. No application. No fixed box.",
    clarificationBody:
      "The examples below are ways to contribute. You may combine several, switch later or start small. What matters is your next concrete step.",
    contributionLabel: "Ways to contribute",
    contributions: [
      { title: "Follow issues", body: "Ask questions, challenge assumptions, add perspectives and help make priorities visible.", action: "View public questions", href: "/fragen" },
      { title: "Contribute sources", body: "Find robust sources, counter-sources and missing perspectives without turning them into an automatic political judgement.", action: "Contribute to a question", href: "/fragen" },
      { title: "Explain context", body: "Help make complex issues easier to understand without hiding uncertainty or trade-offs.", action: "Contribute to a question", href: "/fragen" },
      { title: "Bridge languages", body: "Help people across languages and cultural contexts understand the same question as consistently as possible.", action: "Tell us you are interested", href: "/kontakt" },
      { title: "Moderate the process", body: "Help protect respectful dissent, clear rules and the separation between moderation and political judgement.", action: "Tell us you are interested", href: "/kontakt" },
      { title: "Get active locally", body: "Meet people nearby, help start a conversation or contribute space, contacts and experience.", action: "Start in my region", href: "/vor-ort" },
      { title: "Review quality", body: "Challenge sources, legal context, assumptions, representativeness and possible conflicts of interest.", action: "Contribute to a question", href: "/fragen" },
      { title: "Support the infrastructure", body: "Enable research, technology and community work. Support buys no additional voice or political weight.", action: "Support VoiceOpenGov", href: "/unterstuetzen" },
      { title: "Contribute as an organisation", body: "Bring knowledge, reach or infrastructure with disclosed interests and without privileged political weight.", action: "Explore a partnership", href: "/initiatives" },
    ] satisfies Contribution[],
    nextEyebrow: "Your next step",
    nextTitle: "Choose only what you want to start with today.",
    nextBody:
      "Become a member, contribute to a public question or get active locally. Each path leads into the same participation process, without forcing a long-term commitment today.",
    join: "Become a member for free",
    question: "Contribute to a question",
    regional: "Get active in my region",
  },
};

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const language: Language = locale === "de" ? "de" : "en";
  return {
    title: COPY[language].metaTitle,
    description: COPY[language].description,
  };
}

export default async function ContributePage() {
  const locale = await getRequestLocale();
  const language: Language = locale === "de" ? "de" : "en";
  const copy = COPY[language];

  return (
    <>
      <TranslationStatusNotice
        locale={locale}
        status={locale === "de" ? "source" : locale === "en" ? "human_reviewed" : "missing"}
      />
      <main className="min-h-screen bg-[#07110f] text-[#f4f1e8]">
        <section className="border-b border-[#f4f1e8]/10 bg-[radial-gradient(circle_at_78%_20%,rgba(214,255,101,0.15),transparent_32%)]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#d6ff65]">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] md:text-6xl">{copy.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#f4f1e8]/62">{copy.intro}</p>
            <div className="mt-8 max-w-3xl rounded-2xl border border-[#18cfc8]/25 bg-[#18cfc8]/8 p-5">
              <p className="font-black text-[#18cfc8]">{copy.clarificationTitle}</p>
              <p className="mt-2 text-sm leading-6 text-[#f4f1e8]/60">{copy.clarificationBody}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-22">
          <p className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-[#f4f1e8]/42">{copy.contributionLabel}</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {copy.contributions.map((item) => (
              <article key={item.title} className="flex min-h-[235px] flex-col rounded-3xl border border-[#f4f1e8]/10 bg-[#0b1714] p-6">
                <h2 className="text-xl font-black">{item.title}</h2>
                <p className="mt-3 flex-1 leading-7 text-[#f4f1e8]/58">{item.body}</p>
                <Link href={item.href} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-black text-[#d6ff65] transition hover:translate-x-0.5">
                  {item.action} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-[#d6ff65]/25 bg-[#d6ff65]/8 p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d6ff65]">{copy.nextEyebrow}</p>
            <h2 className="mt-3 text-3xl font-black">{copy.nextTitle}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-[#f4f1e8]/58">{copy.nextBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={VOG_JOIN_PATH} className="rounded-full bg-[#d6ff65] px-5 py-3 font-black text-[#07110f] transition hover:-translate-y-0.5">{copy.join}</Link>
              <Link href={VOG_QUESTIONS_PATH} className="rounded-full border border-[#f4f1e8]/18 px-5 py-3 font-bold transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]">{copy.question}</Link>
              <Link href="/vor-ort" className="rounded-full border border-[#f4f1e8]/18 px-5 py-3 font-bold transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]">{copy.regional}</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
