import type { Metadata } from "next";
import Link from "next/link";
import ChapterIntakeForm from "./ChapterIntakeForm";

export const metadata: Metadata = {
  title: "Chapter starten - VoiceOpenGov",
  description: "Unverbindliche Anfrage für lokale VoiceOpenGov Chapter.",
};

export default function ChapterPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <section>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Chapter starten - lokal verankert, weltweit vergleichbar.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Chapter sind regionale Ankerpunkte: Themen sammeln, Optionen prüfen, Mehrheiten
            nachvollziehbar machen. Überparteilich. Transparent. Skalierbar.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { t: "1) Vormerken", d: "30 Sekunden - wir melden uns mit den Schritten." },
              { t: "2) Region wählen", d: "Ort/Bezirk und Sichtbarkeit festlegen." },
              { t: "3) Launch-Kit", d: "Vorlagen, Regeln, QR-Material und Support." },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{x.t}</div>
                <div className="mt-1 text-sm text-slate-600">{x.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="#vormerken"
              className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Sich vormerken lassen
            </a>
            <Link
              href="/"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Zurück
            </Link>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Öffentlich nur Orts-Summen - keine Einzelprofile
          </div>
        </section>

        <ChapterIntakeForm id="vormerken" />
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
          <div className="text-sm font-semibold text-slate-900">Was ein Chapter ist</div>
          <p className="mt-2 text-sm text-slate-600">
            Ein Chapter bringt lokale Themen in eine saubere Struktur: Fakten, Optionen,
            Konsequenzen, Mehrheiten.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
          <div className="text-sm font-semibold text-slate-900">Was wir nicht sind</div>
          <p className="mt-2 text-sm text-slate-600">
            Keine Partei, kein Lobby-Instrument. Inhalte sind offen dokumentiert - nachvollziehbar
            statt taktisch.
          </p>
        </div>
      </section>
    </main>
  );
}
