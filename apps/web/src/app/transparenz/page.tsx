import Link from "next/link";
import { getRequestLocale } from "@/lib/locale";
import { VOG_QUESTIONS_PATH, VOG_ROLES_PATH } from "@/config/links";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";

type Language = "de" | "en";

const COPY = {
  de: {
    title: "Wir verlangen nichts, was wir nicht selbst tun.",
    description: "Öffentlicher Transparenzstand von VoiceOpenGov.",
    eyebrow: "Transparenzregister",
    intro: "Transparenz ist kein Siegel, das man sich selbst verleiht. Deshalb zeigen wir hier auch Lücken, unfertige Register und offene Prüfungen.",
    sections: [
      { title: "Finanzierung", status: "Im Aufbau", description: "Einnahmen, Ausgaben, Förderungen und Abhängigkeiten werden hier nachvollziehbar veröffentlicht. Solange Zahlen noch nicht belastbar vorliegen, zeigen wir keinen erfundenen Fortschritt." },
      { title: "Community-Entwicklung", status: "Datenschutzprüfung", description: "Veröffentlicht werden ausschließlich aggregierte Zahlen nach Regionen und Ländern. Keine Einzelprofile, keine Rohdaten und keine stärkeren Beteiligungsrechte durch finanzielle Unterstützung." },
      { title: "Entscheidungen & Verantwortung", status: "Verfahrensmodell in Arbeit", description: "Beschlüsse, Zuständigkeiten, offene Einwände, Minderheitenvoten und spätere Kursänderungen sollen versioniert nachvollziehbar werden." },
      { title: "Partnerschaften & Interessen", status: "Register vorgesehen", description: "Partner, institutionelle Beziehungen und mögliche Interessenkonflikte werden nicht hinter allgemeinen Unabhängigkeitsbehauptungen versteckt." },
      { title: "KI & Voxy", status: "Grundsatz veröffentlicht", description: "Voxy erklärt, strukturiert und übersetzt. Voxy entscheidet nicht. Modellwechsel, Unsicherheiten und menschliche Prüfungen sollen sichtbar bleiben." },
      { title: "Fehler & Lernstände", status: "Öffentliche Chronik geplant", description: "Wir wollen sichtbar machen, was nicht funktioniert hat, was verworfen wurde und warum wir unsere Einschätzung geändert haben." },
    ],
    limitsTitle: "Was wir heute noch nicht behaupten",
    limitsBody: "Wir behaupten weder repräsentative Zustimmung noch vollständige Unabhängigkeit oder objektive Wahrheit. Wir machen stattdessen Herkunft, Verfahren, Abhängigkeiten, Unsicherheit und Änderungen prüfbar.",
    questions: "Zu den 50 Fragen",
    roles: "Wie du beitragen kannst",
  },
  en: {
    title: "We demand nothing we are unwilling to do ourselves.",
    description: "The public transparency status of VoiceOpenGov.",
    eyebrow: "Transparency register",
    intro: "Transparency is not a seal an organisation can award itself. That is why we also show gaps, unfinished registers and open reviews here.",
    sections: [
      { title: "Funding", status: "Being established", description: "Income, expenditure, grants and dependencies will be published here in a traceable form. Until figures are robust, we will not invent progress." },
      { title: "Community development", status: "Privacy review", description: "Only aggregated figures by region and country will be published. No individual profiles, no raw data and no stronger participation rights through financial support." },
      { title: "Decisions & responsibility", status: "Process model in development", description: "Decisions, responsibilities, open objections, minority views and later changes of course are intended to remain traceable across versions." },
      { title: "Partnerships & interests", status: "Register planned", description: "Partners, institutional relationships and potential conflicts of interest will not be hidden behind generic claims of independence." },
      { title: "AI & Voxy", status: "Principle published", description: "Voxy explains, structures and translates. Voxy does not decide. Model changes, uncertainties and human reviews should remain visible." },
      { title: "Mistakes & learning", status: "Public record planned", description: "We want to show what did not work, what was discarded and why our assessment changed." },
    ],
    limitsTitle: "What we do not claim today",
    limitsBody: "We claim neither representative support nor complete independence or objective truth. Instead, we make origins, processes, dependencies, uncertainty and changes open to inspection.",
    questions: "Explore the 50 questions",
    roles: "See how you can contribute",
  },
};

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const language: Language = locale === "de" ? "de" : "en";
  return { title: COPY[language].eyebrow, description: COPY[language].description };
}

export default async function TransparencyPage() {
  const locale = await getRequestLocale();
  const language: Language = locale === "de" ? "de" : "en";
  const copy = COPY[language];

  return (
    <>
      <TranslationStatusNotice
        locale={locale}
        status={locale === "de" ? "source" : locale === "en" ? "human_reviewed" : "missing"}
      />
      <main className="min-h-screen bg-[#020617] text-[#f8fafc]">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_82%_18%,rgba(24,207,200,0.16),transparent_34%)]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#18cfc8]">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] md:text-6xl">{copy.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro}</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-22">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {copy.sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-white/10 bg-[#0b1220] p-6">
                <span className="inline-flex rounded-full border border-[#18cfc8]/25 bg-[#18cfc8]/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#18cfc8]">
                  {section.status}
                </span>
                <h2 className="mt-4 text-xl font-black">{section.title}</h2>
                <p className="mt-3 leading-7 text-slate-400">{section.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-[#f8fafc] p-7 text-[#071727] md:p-9">
            <h2 className="text-2xl font-black">{copy.limitsTitle}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#071727]/65">{copy.limitsBody}</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={VOG_QUESTIONS_PATH} className="rounded-full bg-gradient-to-r from-[#1a8cff] to-[#18cfc8] px-5 py-3 font-black text-[#071727] transition hover:-translate-y-0.5">{copy.questions}</Link>
            <Link href={VOG_ROLES_PATH} className="rounded-full border border-white/15 px-5 py-3 font-bold transition hover:border-[#18cfc8]/55 hover:text-[#18cfc8]">{copy.roles}</Link>
          </div>
        </section>
      </main>
    </>
  );
}
