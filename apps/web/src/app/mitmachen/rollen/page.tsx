import Link from "next/link";
import { getRequestLocale } from "@/lib/locale";
import { VOG_JOIN_PATH, VOG_QUESTIONS_PATH } from "@/config/links";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";

type Language = "de" | "en";

type RoleCopy = {
  title: string;
  body: string;
  action: string;
  href: string;
};

const COPY = {
  de: {
    metaTitle: "Mitwirkungsrollen",
    description:
      "Konkrete Möglichkeiten für Mitglieder und Unterstützer von VoiceOpenGov.",
    eyebrow: "Mitmachen",
    title: "Du musst nicht alles können. Du musst nur irgendwo anfangen.",
    intro:
      "Eine Bewegung wird nicht dadurch groß, dass alle dasselbe tun. Sie wird stark, wenn Menschen ihre unterschiedlichen Fähigkeiten verantwortlich einbringen können.",
    clarificationTitle: "Keine Ämter. Keine Bewerbung auf eine feste Rolle.",
    clarificationBody:
      "Die Begriffe unten beschreiben Arten, wie du dich einbringen kannst. Du musst dich nicht festlegen und kannst jederzeit zwischen ihnen wechseln. Entscheidend ist nur dein nächster konkreter Schritt.",
    roleLabel: "So kannst du beitragen",
    roles: [
      {
        title: "Nachbar",
        body: "Du verfolgst Themen, stellst Fragen, widersprichst und hilfst dabei, Prioritäten sichtbar zu machen.",
        action: "Eine öffentliche Frage öffnen",
        href: "/fragen",
      },
      {
        title: "Quellenfinder",
        body: "Du suchst belastbare Quellen, Gegenquellen und fehlende Perspektiven – ohne daraus automatisch eine Meinung abzuleiten.",
        action: "Bei einer Frage mitarbeiten",
        href: "/fragen",
      },
      {
        title: "Erklärer",
        body: "Du machst komplexe Zusammenhänge verständlicher, ohne Unsicherheit oder Zielkonflikte glattzubügeln.",
        action: "Bei einer Frage mitarbeiten",
        href: "/fragen",
      },
      {
        title: "Übersetzer",
        body: "Du hilfst Menschen über Sprachen und kulturelle Kontexte hinweg, dieselbe Frage wirklich zu verstehen.",
        action: "Interesse mitteilen",
        href: "/kontakt",
      },
      {
        title: "Moderator",
        body: "Du schützt das Verfahren, sorgst für respektvollen Widerspruch und trennst Moderation von politischer Bewertung.",
        action: "Interesse mitteilen",
        href: "/kontakt",
      },
      {
        title: "Vor Ort aktiv",
        body: "Du möchtest Menschen in deiner Nähe kennenlernen, bei einem Stammtisch dabei sein, einen ersten Austausch anstoßen oder mit Raum, Kontakten und Erfahrung helfen.",
        action: "In meiner Region starten",
        href: "/vor-ort",
      },
      {
        title: "Prüfer",
        body: "Du hinterfragst Quellenlage, Rechtsbezug, Annahmen, Repräsentativität und mögliche Interessenkonflikte.",
        action: "Bei einer Frage mitarbeiten",
        href: "/fragen",
      },
      {
        title: "Fördermitglied",
        body: "Du ermöglichst Recherche, Technik und Community-Arbeit. Dein Beitrag kauft keine zusätzliche Stimme oder Sichtbarkeit.",
        action: "VoiceOpenGov unterstützen",
        href: "/unterstuetzen",
      },
      {
        title: "Partnerorganisation",
        body: "Du bringst Wissen, Reichweite oder Infrastruktur ein – mit offengelegten Interessen und ohne bevorzugte politische Gewichtung.",
        action: "Partnerschaft kennenlernen",
        href: "/initiatives",
      },
    ] satisfies RoleCopy[],
    nextEyebrow: "Dein erster Schritt",
    nextTitle:
      "Du musst keine Rolle wählen. Wähle nur, womit du heute anfangen möchtest.",
    nextBody:
      "Mitglied werden, an einer öffentlichen Frage arbeiten oder vor Ort Menschen zusammenbringen – alles führt in denselben Beteiligungsprozess. Rollen entstehen aus dem, was du tatsächlich beiträgst, nicht aus einem Titel.",
    regional: "In meiner Region aktiv werden",
    join: "Kostenfrei Mitglied werden",
    question: "An einer Frage mitarbeiten",
  },
  en: {
    metaTitle: "Ways to contribute",
    description:
      "Practical ways for members and supporters to contribute to VoiceOpenGov.",
    eyebrow: "Take part",
    title: "You do not need to do everything. You only need somewhere to begin.",
    intro:
      "A movement does not grow strong because everyone does the same thing. It grows strong when people can contribute their different abilities responsibly.",
    clarificationTitle: "No offices. No application for a fixed role.",
    clarificationBody:
      "The labels below describe ways you can contribute. You do not have to choose one permanently and can move between them at any time. What matters is your next concrete step.",
    roleLabel: "How you can contribute",
    roles: [
      {
        title: "Neighbour",
        body: "You follow topics, ask questions, challenge assumptions and help make priorities visible.",
        action: "Open a public question",
        href: "/fragen",
      },
      {
        title: "Source finder",
        body: "You look for robust sources, counter-sources and missing perspectives without automatically turning them into an opinion.",
        action: "Contribute to a question",
        href: "/fragen",
      },
      {
        title: "Explainer",
        body: "You make complex relationships easier to understand without smoothing over uncertainty or trade-offs.",
        action: "Contribute to a question",
        href: "/fragen",
      },
      {
        title: "Translator",
        body: "You help people across languages and cultural contexts understand the same question fully.",
        action: "Tell us you are interested",
        href: "/kontakt",
      },
      {
        title: "Moderator",
        body: "You protect the process, enable respectful dissent and keep moderation separate from political judgement.",
        action: "Tell us you are interested",
        href: "/kontakt",
      },
      {
        title: "Active locally",
        body: "You would like to meet people nearby, join a meetup, help start a conversation or contribute a room, contacts or experience.",
        action: "Start in my region",
        href: "/vor-ort",
      },
      {
        title: "Reviewer",
        body: "You challenge sources, legal context, assumptions, representativeness and potential conflicts of interest.",
        action: "Contribute to a question",
        href: "/fragen",
      },
      {
        title: "Supporting member",
        body: "You enable research, technology and community work. Your contribution buys no additional voice or visibility.",
        action: "Support VoiceOpenGov",
        href: "/unterstuetzen",
      },
      {
        title: "Partner organisation",
        body: "You contribute knowledge, reach or infrastructure with disclosed interests and without privileged political weight.",
        action: "Explore a partnership",
        href: "/initiatives",
      },
    ] satisfies RoleCopy[],
    nextEyebrow: "Your first step",
    nextTitle:
      "You do not need to choose a role. Just choose what you want to start with today.",
    nextBody:
      "Become a member, work on a public question or connect people locally – each path leads into the same participation process. Roles emerge from what you actually contribute, not from a title.",
    regional: "Get active in my region",
    join: "Become a member for free",
    question: "Contribute to a question",
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

export default async function RolesPage() {
  const locale = await getRequestLocale();
  const language: Language = locale === "de" ? "de" : "en";
  const copy = COPY[language];

  return (
    <>
      <TranslationStatusNotice
        locale={locale}
        status={
          locale === "de"
            ? "source"
            : locale === "en"
              ? "human_reviewed"
              : "missing"
        }
      />
      <main className="min-h-screen bg-[#07110f] text-[#f4f1e8]">
        <section className="border-b border-[#f4f1e8]/10 bg-[radial-gradient(circle_at_78%_20%,rgba(214,255,101,0.15),transparent_32%)]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#d6ff65]">
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#f4f1e8]/62">
              {copy.intro}
            </p>
            <div className="mt-8 max-w-3xl rounded-2xl border border-[#18cfc8]/25 bg-[#18cfc8]/8 p-5">
              <p className="font-black text-[#18cfc8]">{copy.clarificationTitle}</p>
              <p className="mt-2 text-sm leading-6 text-[#f4f1e8]/60">{copy.clarificationBody}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-22">
          <p className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-[#f4f1e8]/42">
            {copy.roleLabel}
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {copy.roles.map((role) => (
              <article
                key={role.title}
                className="flex min-h-[235px] flex-col rounded-3xl border border-[#f4f1e8]/10 bg-[#0b1714] p-6"
              >
                <h2 className="text-xl font-black">{role.title}</h2>
                <p className="mt-3 flex-1 leading-7 text-[#f4f1e8]/58">
                  {role.body}
                </p>
                <Link
                  href={role.href}
                  className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-black text-[#d6ff65] transition hover:translate-x-0.5"
                >
                  {role.action} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-[#d6ff65]/25 bg-[#d6ff65]/8 p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d6ff65]">
              {copy.nextEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black">{copy.nextTitle}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-[#f4f1e8]/58">
              {copy.nextBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={VOG_JOIN_PATH}
                className="rounded-full bg-[#d6ff65] px-5 py-3 font-black text-[#07110f] transition hover:-translate-y-0.5"
              >
                {copy.join}
              </Link>
              <Link
                href={VOG_QUESTIONS_PATH}
                className="rounded-full border border-[#f4f1e8]/18 px-5 py-3 font-bold transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]"
              >
                {copy.question}
              </Link>
              <Link
                href="/vor-ort"
                className="rounded-full border border-[#f4f1e8]/18 px-5 py-3 font-bold transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]"
              >
                {copy.regional}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
