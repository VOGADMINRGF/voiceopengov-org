import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dossier – VoiceOpenGov",
  description: "Dossier zu weltpolitischen Standards und demokratischen Prozessen.",
};

export default function DossierPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--brand-from)] via-white to-white pb-16">
      <section className="mx-auto max-w-5xl px-4 py-16 space-y-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dossier</p>
          <h1
            className="text-3xl md:text-4xl font-extrabold leading-tight"
            style={{
              backgroundImage: "linear-gradient(90deg,var(--brand-cyan),var(--brand-blue))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Weltpolitische Neuordnung
          </h1>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Ein Einstieg in internationale Standards fuer demokratische Prozesse: klare Begriffe,
            zentrale Thesen, offene Fragen und realistische Optionen.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Frage & Scope</h2>
            <p className="mt-2 text-sm text-slate-700">
              Welche demokratischen Mindeststandards sollten weltweit gelten, damit Beteiligung
              nachvollziehbar, fair und belastbar bleibt?
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Roadmap</h2>
            <p className="mt-2 text-sm text-slate-700">
              Check → Dossier → Beteiligung: Erst klaeren wir Begriffe und Quellen, dann strukturieren
              wir Optionen und oeffnen die Diskussion fuer Beteiligung.
            </p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Thesen</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Verfahren brauchen klare Rollen, Zeitachsen und Entscheidungspunkte.</li>
              <li>Quellen und Begruendungen muessen transparent und dauerhaft zitierbar bleiben.</li>
              <li>Minderheitenperspektiven muessen sichtbar dokumentiert werden.</li>
              <li>Qualitaet entsteht durch nachvollziehbare Pruefpfade, nicht durch Lautstaerke.</li>
              <li>Globale Standards muessen lokal anwendbar bleiben.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quellen & Definitionen</h2>
            <p className="mt-2 text-sm text-slate-700">
              Wir sammeln Definitionen von Institutionen wie UN, ILO, OECD und weiteren
              Standardsetzern. Diese Liste wird fortlaufend erweitert.
            </p>
            <p className="mt-3 text-sm text-slate-700">
              Vorschlaege fuer Quellen kannst du jederzeit einreichen.
            </p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Offene Fragen</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Wie lassen sich lokale Verfahren mit globalen Standards verbinden?</li>
              <li>Welche Mindestdaten braucht eine belastbare Mehrheitsentscheidung?</li>
              <li>Wie bleiben Prozesse auch in Krisen transparent und pruefbar?</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Optionen</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Standardisierte Dossier-Formate mit Quellenpflicht.</li>
              <li>Offene Monitoring-Modelle fuer Umsetzung und Wirkung.</li>
              <li>Moderierte Beteiligung mit klaren Regeln und Zeitfenstern.</li>
            </ul>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">
                Mach das Dossier besser
              </h2>
              <p className="text-sm text-slate-700">
                Teile Quellen, offene Fragen oder Praxiserfahrungen, die hier fehlen.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/#mitmachen" className="btn btn-primary bg-brand-grad text-white">
                Mitmachen
              </Link>
              <Link href="/initiatives" className="btn border border-slate-300 bg-white/80 hover:bg-white">
                Initiative einreichen
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
