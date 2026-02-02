import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Für Initiativen – VoiceOpenGov",
  description: "Bringt euer Thema – wir helfen beim sauberen Prozess.",
};

export default function InitiativesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--brand-from)] via-white to-white pb-16">
      <section className="mx-auto max-w-5xl px-4 py-16 space-y-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Für Initiativen</p>
          <h1
            className="text-3xl md:text-4xl font-extrabold leading-tight"
            style={{
              backgroundImage: "linear-gradient(90deg,var(--brand-cyan),var(--brand-blue))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Bringt euer Thema – wir helfen beim sauberen Prozess
          </h1>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Wir strukturieren Anliegen so, dass Beteiligung nachvollziehbar bleibt: klare Fragen,
            dokumentierte Quellen und transparente Mehrheiten.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            "Thema und Ziel kurz beschreiben",
            "Region, Zielgruppe und Zeitfenster nennen",
            "Bestehende Quellen oder Daten beifügen",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white/95 p-4 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Umsetzung im Tool</h2>
          <p className="mt-2 text-sm text-slate-700">
            Für die praktische Umsetzung nutzen wir das Tool eDebatte.
          </p>
          <a
            href="https://edebatte.org"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
          >
            eDebatte (Tool)
            <span aria-hidden="true">→</span>
          </a>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">
                Bereit für eure Initiative?
              </h2>
              <p className="text-sm text-slate-700">
                Schickt uns eine kurze Beschreibung eures Anliegens. Wir melden uns mit den
                nächsten Schritten.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/kontakt" className="btn btn-primary bg-brand-grad text-white">
                Kontakt aufnehmen
              </Link>
              <Link href="/#mitmachen" className="btn border border-slate-300 bg-white/80 hover:bg-white">
                Mitmachen
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
