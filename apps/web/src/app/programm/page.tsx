import type { Metadata } from "next";
import Link from "next/link";
import { EDEBATTE_CANONICAL_URL, VOG_QUESTIONS_PATH, VOG_TRANSPARENCY_PATH } from "@/config/links";
import { getRequestLocale } from "@/lib/locale";
import { loadProgrammeProjection } from "@/lib/programProjection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programmstand",
  description:
    "Versionierter VoiceOpenGov-Programmstand aus gültigen eDebatte-Mandaten. Die Seite bleibt bis zur produktiv verifizierten End-to-End-Projektion noindex.",
  robots: {
    index: false,
    follow: true,
  },
};

function pct(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function ProgrammePage() {
  const locale = await getRequestLocale();
  const isGerman = locale === "de";
  const projection = await loadProgrammeProjection();

  const copy = isGerman
    ? {
        eyebrow: "Programmstand",
        title: "Gültige Mandate statt eingefrorenes Parteiprogramm.",
        intro:
          "VoiceOpenGov führt keinen zweiten politischen Wahrheitsspeicher. Der öffentliche Programmstand wird ausschließlich aus gültig abgeschlossenen eDebatte-Entscheidungen innerhalb ihres dokumentierten Geltungsbereichs abgeleitet.",
        unavailableTitle: "Die kanonische Entscheidungsquelle ist derzeit nicht verifizierbar.",
        unavailableBody:
          "VoiceOpenGov zeigt in diesem Zustand keine zwischengespeicherten, manuell kopierten oder teilweise validierten Positionen als Programm. Sobald der eDebatte-Mandatsfeed wieder vollständig verifizierbar ist, wird die Projektion daraus neu aufgebaut.",
        emptyTitle: "Der Mandatsfeed ist verbunden – aktuell liegen keine gültigen produktiven Mandate vor.",
        emptyBody:
          "Das ist ein zulässiger Leerstand. VoiceOpenGov erzeugt daraus keine Ersatzpositionen und zeigt keine Demo- oder Fixture-Daten als aktuelles Programm.",
        source: "Entscheidungsquelle öffnen",
        questions: "50 Kernfragen ansehen",
        transparency: "Governance & Transparenz",
        minority: "Minderheitenpositionen",
        votes: "gültige/abgegebene Stimmen",
      }
    : {
        eyebrow: "Programme state",
        title: "Valid mandates instead of a frozen party manifesto.",
        intro:
          "VoiceOpenGov does not maintain a second political source of truth. The public programme state is derived only from validly concluded eDebatte decisions within their documented scope.",
        unavailableTitle: "The canonical decision source cannot currently be verified.",
        unavailableBody:
          "In this state, VoiceOpenGov does not present cached, manually copied or partially validated positions as programme truth. The projection is rebuilt from eDebatte once the mandate feed can be fully verified again.",
        emptyTitle: "The mandate feed is connected — there are currently no valid production mandates.",
        emptyBody:
          "This is a valid empty state. VoiceOpenGov does not invent substitute positions and does not present demo or fixture data as its current programme.",
        source: "Open decision source",
        questions: "View 50 core questions",
        transparency: "Governance & transparency",
        minority: "Minority positions",
        votes: "valid/cast ballots",
      };

  const unavailable = projection.status === "source_unavailable";
  const empty = projection.status === "ready" && projection.positions.length === 0;

  return (
    <main className="min-h-screen text-[#f8fafc]">
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#18cfc8]">{copy.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl">{copy.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro}</p>

        {unavailable ? (
          <section className="mt-10 rounded-3xl border border-amber-300/25 bg-amber-300/10 p-6" aria-labelledby="programme-source-status">
            <h2 id="programme-source-status" className="text-xl font-black text-amber-50">{copy.unavailableTitle}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-amber-50/90">{copy.unavailableBody}</p>
          </section>
        ) : empty ? (
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6" aria-labelledby="programme-empty-status">
            <h2 id="programme-empty-status" className="text-xl font-black">{copy.emptyTitle}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-300">{copy.emptyBody}</p>
          </section>
        ) : projection.status === "ready" ? (
          <div className="mt-10 grid gap-5">
            {projection.positions.map((position) => (
              <article key={position.decisionSnapshotId} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#18cfc8]">
                  <span>{position.scopeLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{position.scopeKey}</span>
                  <span aria-hidden="true">·</span>
                  <span>{position.versionRef}</span>
                </div>
                <h2 className="mt-3 text-2xl font-black">{position.title}</h2>
                <p className="mt-3 text-slate-300">{position.question}</p>
                <p className="mt-4 font-bold">
                  {position.majorityPosition} · {pct(position.majorityShare)}
                </p>
                {position.minorityPositions.length > 0 ? (
                  <p className="mt-2 text-sm text-slate-300">
                    {copy.minority}: {position.minorityPositions.join(" · ")}
                  </p>
                ) : null}
                <p className="mt-3 text-sm text-slate-300">
                  {position.electorateDescription} · {position.validBallots}/{position.ballotsCast} {copy.votes} · Quorum erfüllt · Integrität verifiziert
                </p>
                <a
                  className="mt-5 inline-flex font-black text-[#18cfc8] underline underline-offset-4"
                  href={position.sourceMandateUrl}
                >
                  {copy.source} ↗
                </a>
              </article>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="rounded-full border border-white/15 px-5 py-3 font-bold hover:border-[#18cfc8]/55 hover:text-[#18cfc8]" href={VOG_QUESTIONS_PATH}>
            {copy.questions}
          </Link>
          <Link className="rounded-full border border-white/15 px-5 py-3 font-bold hover:border-[#18cfc8]/55 hover:text-[#18cfc8]" href={VOG_TRANSPARENCY_PATH}>
            {copy.transparency}
          </Link>
          <a className="rounded-full border border-white/15 px-5 py-3 font-bold hover:border-[#18cfc8]/55 hover:text-[#18cfc8]" href={EDEBATTE_CANONICAL_URL + "/mandat"}>
            eDebatte Mandate ↗
          </a>
        </div>
      </section>
    </main>
  );
}
