import Image from "next/image";
import Link from "next/link";
import { getRequestLocale } from "@/lib/locale";
import {
  EDEBATTE_URL,
  VOG_JOIN_PATH,
  VOG_TRANSPARENCY_PATH,
} from "@/config/links";
import {
  VOG_QUESTION_COUNT,
  VOG_QUESTION_GROUPS,
} from "@/content/vogQuestions";
import { getTranslatedBundle } from "@/lib/i18n/getTranslatedBundle";
import type {
  SupportedLocale,
  TranslationStatus,
} from "@/config/locales";

type PageContent = {
  copy: {
    title: string;
    description: string;
    eyebrow: string;
    intro: string;
    join: string;
    transparency: string;
    status: string;
    openRoom: string;
    qrSummary: string;
    qrAlt: string;
    stableId: string;
  };
  groups: Array<{
    id: string;
    title: string;
    questions: Array<{ id: string; text: string }>;
  }>;
};

const DE_CONTENT: PageContent = {
  copy: {
    title: "50 Fragen. Keine 50 fertigen Antworten.",
    description:
      "Die ersten 50 offenen Orientierungsfragen der VoiceOpenGov-Bewegung mit stabilen IDs und direktem eDebatte-Arbeitsraum-Handoff.",
    eyebrow: "Offener Kompass",
    intro:
      "Diese Fragen sind kein Parteiprogramm. Sie sind der öffentliche Arbeitsbeginn: mit Quellen, Gegenargumenten, Zielkonflikten, Alternativen und einem sichtbaren Lernstand. Jede Frage bleibt in allen Sprachen fachlich dieselbe Frage.",
    join: "Mitglied werden",
    transparency: "So machen wir den Stand sichtbar",
    status: "Status: Seed · direkter Arbeitsraum-Handoff",
    openRoom: "Frage öffnen & beteiligen",
    qrSummary: "QR-Code öffnen",
    qrAlt: "QR-Code zur Frage",
    stableId: "Stabile ID",
  },
  groups: VOG_QUESTION_GROUPS.map((group) => ({
    id: group.id,
    title: group.title.de,
    questions: group.questions.map((question) => ({
      id: question.id,
      text: question.de,
    })),
  })),
};

const EN_CONTENT: PageContent = {
  copy: {
    title: "50 questions. Not 50 finished answers.",
    description:
      "The first 50 open questions guiding VoiceOpenGov, with stable IDs and a direct eDebatte workspace handoff.",
    eyebrow: "An open compass",
    intro:
      "These questions are not a party manifesto. They are where the public work begins: with sources, counterarguments, trade-offs, alternatives and a visible state of learning. Each translation remains the same canonical question.",
    join: "Become a member",
    transparency: "See how we make progress visible",
    status: "Status: seed · direct workspace handoff",
    openRoom: "Open question & take part",
    qrSummary: "Open QR code",
    qrAlt: "QR code for this question",
    stableId: "Stable ID",
  },
  groups: VOG_QUESTION_GROUPS.map((group) => ({
    id: group.id,
    title: group.title.en,
    questions: group.questions.map((question) => ({
      id: question.id,
      text: question.en,
    })),
  })),
};

const STATUS_COPY: Partial<
  Record<
    SupportedLocale,
    Record<TranslationStatus, string>
  >
> = {
  de: {
    source: "Deutsche Originalfassung",
    human_reviewed: "Menschlich geprüfte Übersetzung",
    machine_assisted: "KI-unterstützte Lesefassung",
    missing: "Übersetzung noch nicht verfügbar – deutsche Originalfassung wird angezeigt",
  },
  en: {
    source: "German original",
    human_reviewed: "Human-reviewed translation",
    machine_assisted: "Machine-assisted reading version",
    missing: "Translation unavailable – the German original is shown",
  },
  fr: {
    source: "Version originale allemande",
    human_reviewed: "Traduction vérifiée par une personne",
    machine_assisted: "Version de lecture assistée par IA",
    missing: "Traduction indisponible – l’original allemand est affiché",
  },
  es: {
    source: "Versión original alemana",
    human_reviewed: "Traducción revisada por una persona",
    machine_assisted: "Versión de lectura asistida por IA",
    missing: "Traducción no disponible; se muestra el original alemán",
  },
  tr: {
    source: "Almanca özgün sürüm",
    human_reviewed: "İnsan tarafından gözden geçirilmiş çeviri",
    machine_assisted: "Yapay zekâ destekli okuma sürümü",
    missing: "Çeviri mevcut değil; Almanca özgün metin gösteriliyor",
  },
  ar: {
    source: "النسخة الألمانية الأصلية",
    human_reviewed: "ترجمة راجعها شخص",
    machine_assisted: "نسخة قراءة بمساعدة الذكاء الاصطناعي",
    missing: "الترجمة غير متاحة؛ تُعرض النسخة الألمانية الأصلية",
  },
};

async function getPageContent(locale: SupportedLocale) {
  return getTranslatedBundle({
    locale,
    original: DE_CONTENT,
    reviewedEnglish: EN_CONTENT,
  });
}

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const bundle = await getPageContent(locale);
  return {
    title: bundle.value.copy.title,
    description: bundle.value.copy.description,
  };
}

export default async function QuestionsPage() {
  const locale = await getRequestLocale();
  const bundle = await getPageContent(locale);
  const { copy, groups } = bundle.value;
  const statusCopy = STATUS_COPY[locale] ?? STATUS_COPY.en!;

  return (
    <main className="min-h-screen bg-[#07110f] text-[#f4f1e8]">
      <section className="border-b border-[#f4f1e8]/10 bg-[radial-gradient(circle_at_82%_18%,rgba(214,255,101,0.16),transparent_30%)]">
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
          <div className="mt-6 inline-flex rounded-full border border-[#18cfc8]/35 bg-[#18cfc8]/8 px-4 py-2 text-xs font-bold text-[#18cfc8]">
            {statusCopy[bundle.status]}
          </div>
          <p className="mt-3 text-sm text-[#f4f1e8]/45">
            {VOG_QUESTION_COUNT} / 50 · IDs bleiben sprachunabhängig
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={VOG_JOIN_PATH}
              className="rounded-full bg-[#d6ff65] px-5 py-3 font-black text-[#07110f] transition hover:-translate-y-0.5"
            >
              {copy.join}
            </Link>
            <Link
              href={VOG_TRANSPARENCY_PATH}
              className="rounded-full border border-[#f4f1e8]/18 px-5 py-3 font-bold transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]"
            >
              {copy.transparency}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-22">
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((group) => (
            <article
              key={group.id}
              className="rounded-3xl border border-[#f4f1e8]/10 bg-[#0b1714] p-6 md:p-7"
            >
              <h2 className="text-xl font-black text-[#f4f1e8]">
                {group.title}
              </h2>
              <ol className="mt-5 space-y-5">
                {group.questions.map((question) => {
                  const current = Number(question.id.slice(-2));
                  const handoffHref = `${EDEBATTE_URL}?destination=vog-question&canonicalId=${encodeURIComponent(question.id)}&sourceTitle=${encodeURIComponent(question.text)}&lang=${locale}`;
                  const qrSrc = `/api/questions/qr?id=${encodeURIComponent(question.id)}&lang=${locale}`;

                  return (
                    <li
                      id={question.id}
                      key={question.id}
                      className="flex gap-4 border-t border-[#f4f1e8]/10 pt-5 first:border-0 first:pt-0"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d6ff65]/10 text-sm font-black text-[#d6ff65]">
                        {current}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-6 text-[#f4f1e8]">
                          {question.text}
                        </p>
                        <p className="mt-2 text-[11px] uppercase tracking-wide text-[#f4f1e8]/38">
                          {copy.stableId}: {question.id} · {copy.status}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <Link
                            href={handoffHref}
                            className="rounded-full border border-[#18cfc8]/35 px-3 py-2 text-xs font-bold text-[#18cfc8] transition hover:border-[#18cfc8] hover:bg-[#18cfc8]/8"
                          >
                            {copy.openRoom} ↗
                          </Link>
                          <details className="group">
                            <summary className="cursor-pointer text-xs font-bold text-[#f4f1e8]/60 hover:text-[#18cfc8]">
                              {copy.qrSummary}
                            </summary>
                            <div className="mt-3 w-fit rounded-2xl bg-white p-3">
                              <Image
                                src={qrSrc}
                                width={144}
                                height={144}
                                unoptimized
                                alt={`${copy.qrAlt}: ${current}`}
                              />
                            </div>
                          </details>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
