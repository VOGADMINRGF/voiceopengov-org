"use client";

import Link from "next/link";

const IMPACT_LINKS = [
  {
    label: "Graph Impact",
    href: "/admin/graph/impact",
    description: "Aggregierte KPIs aus dem Graph – Statements, Eventualitäten, Pfade.",
  },
  {
    label: "Topic Impact Report",
    href: "/admin/reports/topic/demo-topic",
    description: "Impact-Profil für ein Thema (Demo-Slug). Später durch Picker ersetzen.",
  },
  {
    label: "Region Impact Report",
    href: "/admin/reports/region/demo-region",
    description: "Impact-Profil für eine Region (Demo-Region-ID).",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin · Übersicht</p>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">
          Schnellzugriff auf Impact- und Report-Ansichten. Weitere Bereiche folgen, sobald sie in Safe Mode
          freigegeben sind.
        </p>
      </header>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Impact & Reports</h2>
          <p className="text-xs text-slate-500">Schnellzugriff auf neue E150-Auswertungen</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {IMPACT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-slate-900">{link.label}</p>
              <p className="mt-1 text-xs text-slate-600">{link.description}</p>
            </Link>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">
          Hinweise: Topic- und Region-Reports verwenden derzeit Demo-Parameter. Ein Selector folgt in einem späteren
          Schritt (siehe Next Steps).
        </p>
      </section>
    </main>
  );
}
