import type { Metadata } from "next";
import { FUNNEL_STAGES, getFunnelSummary } from "@/lib/funnelSummary";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Growth Funnel · VoiceOpenGov", robots: { index: false, follow: false } };

const LABELS: Record<string, string> = {
  landing_viewed: "Landing",
  form_started: "Formular begonnen",
  registration_submitted: "Abgesendet",
  doi_sent: "DOI versendet",
  membership_confirmed: "Bestätigt",
  funding_started: "Funding begonnen",
  payment_succeeded: "Zahlung erfolgreich",
};

function percentage(value: number, base: number) {
  return base > 0 ? `${((value / base) * 100).toFixed(1)} %` : "—";
}

export default async function GrowthDashboard() {
  const summary = await getFunnelSummary(30);
  const landing = summary.totals.landing_viewed || 0;
  return (
    <main className="min-h-screen bg-[#020617] px-5 py-12 text-[#f8fafc] md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#18cfc8]">Interner Bereich · letzte 30 Tage</p>
        <h1 className="mt-3 text-4xl font-black">Membership & Funding Funnel</h1>
        <p className="mt-3 text-slate-300">Datensparsame Ereignisse, 90 Tage Rohdaten-Aufbewahrung. Keine E-Mail-, IP- oder User-Agent-Auswertung.</p>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FUNNEL_STAGES.map((stage) => <article key={stage} className="rounded-2xl border border-slate-800 bg-[#0b1220] p-5"><p className="text-sm text-slate-400">{LABELS[stage]}</p><p className="mt-2 text-3xl font-black">{summary.totals[stage] || 0}</p><p className="mt-1 text-sm text-[#18cfc8]">{percentage(summary.totals[stage] || 0, landing)} von Landing</p></article>)}
        </section>
        {Object.entries(summary.breakdowns).map(([dimension, rows]) => (
          <section key={dimension} className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1220]">
            <h2 className="border-b border-slate-800 px-5 py-4 text-xl font-bold capitalize">Nach {dimension}</h2>
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="text-slate-400"><tr><th className="px-5 py-3">Wert</th>{FUNNEL_STAGES.map((stage) => <th key={stage} className="px-3 py-3">{LABELS[stage]}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.value} className="border-t border-slate-800"><th className="px-5 py-3 font-semibold">{row.value}</th>{FUNNEL_STAGES.map((stage) => <td key={stage} className="px-3 py-3 tabular-nums">{row.stages[stage] || 0}</td>)}</tr>)}</tbody></table></div>
          </section>
        ))}
        <p className="mt-8 text-xs text-slate-500">Stand: {new Date(summary.generatedAt).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</p>
      </div>
    </main>
  );
}
