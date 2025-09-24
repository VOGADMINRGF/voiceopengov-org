"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-sky-50/60 to-white pt-10 pb-12 md:pt-16 md:pb-16 border-b border-slate-200/60">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-wide text-sky-700 font-semibold mb-3">
              Direkte & Digitale Beteiligung – weltweite Bewegung
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Weniger reden. Mehr entscheiden.<br />
              <span className="text-sky-700">Dein Anliegen</span> – unsere Struktur.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-2xl">
              Schluss mit Endlosdebatten. Aus Anliegen werden Ergebnisse – fair, faktenbasiert
              und öffentlich nachvollziehbar. Die Gesellschaft entscheidet – wir organisieren
              Verfahren, Vertretung und Umsetzung.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#newsletter" className="inline-flex items-center rounded-full px-5 py-2.5 text-white bg-gradient-to-r from-cyan-500 to-indigo-600 shadow hover:shadow-md transition">
                Newsletter abonnieren
              </Link>
              <Link href="/de/localsupport" className="inline-flex items-center rounded-full px-5 py-2.5 text-slate-900 border border-slate-300 hover:bg-slate-50 transition">
                Lokal unterstützten
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="font-semibold text-slate-900">Anliegen rein, Ergebnis raus.</div>
                <div className="mt-1">In 60 Sekunden einreichen – barrierefrei, transparent und für alle zugänglich.</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="font-semibold text-slate-900">Mehr als Pro & Contra.</div>
                <div className="mt-1">Wir zeigen Eventualitäten, stärken Minderheiten und machen Nutzen sichtbar.</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="font-semibold text-slate-900">Faktenbasiert & KI-gestützt.</div>
                <div className="mt-1">International geprüft, wissenschaftlich belegt, redaktionell abgesichert.</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="font-semibold text-slate-900">Im Auftrag des Volkes.</div>
                <div className="mt-1">Das Volksvotum formt das Programm – dynamisch, klar, nach Mehrheitsprinzip.</div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[38%]">
            <div className="aspect-video w-full rounded-2xl border border-slate-200 bg-white shadow-sm grid place-items-center">
              <button type="button" className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-slate-300 hover:bg-slate-50 transition" aria-label="Kurzinfo-Video abspielen">
                ▶︎ <span>Video (90s)</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">Kurzinfo: So funktioniert VoiceOpenGov.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
