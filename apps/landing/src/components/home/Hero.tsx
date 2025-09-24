"use client";
import Link from "next/link";

type HeroProps = {
  locale?: string;
};

export default function Hero({ locale = "de" }: HeroProps) {
  return (
    <section
      id="hero"
      // CI-Gradient: sanft mint → weiß
      className="border-b border-slate-200/60 bg-gradient-to-b from-[var(--brand-from)] to-[var(--brand-to)]"
    >
      <div className="container mx-auto max-w-7xl px-4 pt-12 pb-12 md:pt-16 md:pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Textbereich */}
          <div className="flex-1">
            {/* Chips */}
            <div className="mb-3 flex flex-wrap gap-2">
              {["Direktdemokratisch", "Lokal", "National", "Global"].map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                  style={{
                    borderColor: "var(--chip-border)",
                    background: "var(--chip-bg)",
                    color: "var(--chip-text)",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
              Weniger reden. <br />
              Mehr entscheiden.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
                }}
              >
                Dein Anliegen
              </span>{" "}
              – unsere Struktur.
            </h1>

            {/* Subcopy */}
            <p className="mt-5 max-w-2xl text-lg md:text-xl text-slate-700">
              Schluss mit Endlosdebatten: VoiceOpenGov verbindet Bürger:innen, Verwaltung und
              Journalist:innen. <strong>KI-orchestriert</strong> bündeln wir Quellen,
              Gegenquellen und Unsicherheiten in einem <strong>Evidenz-Graphen</strong>, stimmen
              fair ab und begleiten die Umsetzung öffentlich nachvollziehbar. Unser
              Qualitätsstandard ist reproduzierbar, transparent und wirkungsorientiert.
            </p>

            {/* Neue Vorteils-Liste */}
            <ul className="mt-5 list-disc pl-5 text-base text-slate-700">
              <li>
                <strong>Transparente Verfahren:</strong> Jede Quelle und jeder Schritt sind öffentlich einsehbar.
              </li>
              <li>
                <strong>Faire Debatten:</strong> Pro & Contra werden symmetrisch moderiert; Dominanz einzelner Stimmen wird verhindert.
              </li>
              <li>
                <strong>Regionale Legitimität:</strong> Entscheidungen können auf Gemeinden, Kreise oder Länder begrenzt werden.
              </li>
            </ul>

            {/* CTA-Gruppe */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/statements/new`}
                className="btn btn-primary bg-brand-grad"
                aria-label="Neues Thema einreichen"
              >
                Thema einreichen
              </Link>
              <Link
                href={`/${locale}/vote`}
                className="btn btn-outline"
                aria-label="Jetzt abstimmen"
              >
                Jetzt abstimmen
              </Link>
              <Link
                href={`/${locale}/support`}
                className="btn border border-slate-300 bg-white/70 hover:bg-white"
                aria-label="Mitglied werden und Unabhängigkeit sichern"
              >
                Mitglied werden
              </Link>
            </div>

            {/* Mini-Featurecards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-none">
              <div className="rounded-xl border bg-white/70 p-4">
                <div className="text-sm font-semibold">Für Bürger:innen</div>
                <p className="mt-1 text-sm text-slate-600">
                  Faire Pro/Contra-Darstellung, geheime Stimmabgabe, klare Regeln &amp; Quoren.
                </p>
              </div>
              <div className="rounded-xl border bg-white/70 p-4">
                <div className="text-sm font-semibold">Für Journalist:innen</div>
                <p className="mt-1 text-sm text-slate-600">
                  Dossiers, Embeds &amp; Exporte (CSV/JSON) – lokal, regional, investigativ.
                </p>
              </div>
              <div className="rounded-xl border bg-white/70 p-4">
                <div className="text-sm font-semibold">Für Verwaltungen</div>
                <p className="mt-1 text-sm text-slate-600">
                  Ergebnisse mit Mandat, Meilensteinen, Risiken &amp; Wirkung transparent tracken.
                </p>
              </div>
              <div className="rounded-xl border bg-white/70 p-4">
                <div className="text-sm font-semibold">Für Politik &amp; Repräsentanten</div>
                <p className="mt-1 text-sm text-slate-600">
                  Direktdemokratische Umfragen nach dem Mehrheitsprinzip, fair und transparent.
                </p>
              </div>
            </div>

            {/* Qualitäts-Callout */}
            <div className="mt-6 rounded-xl border bg-white/70 p-4">
              <div className="text-sm font-semibold">Unser Qualitätsstandard</div>
              <p className="mt-1 text-sm text-slate-600">
                Reproduzierbarkeit, offene Methoden, strenge Quellenarbeit, Fehlerkultur und öffentliche
                Audit-Trails – nicht als Versprechen, sondern als Betriebsprinzip. Öffentliche Impact-Dashboards
                &amp; graphbasierte Vertrauensmaße.
              </p>
            </div>

            {/* Mitgliedschafts-CTA innerhalb des Hero */}
            <div className="mt-6 rounded-2xl border p-4 bg-brand-grad text-white shadow-soft">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold">
                    Deine Mitgliedschaft hält VoiceOpenGov unabhängig
                  </h3>
                  <p className="opacity-90 text-sm">
                    Schon ab 5,63 € pro Monat hilfst du, Moderation, Faktenaufbereitung und Audit-Trails zu finanzieren. 
                  </p>
                </div>
                <Link
                  href={`/${locale}/support`}
                  className="btn btn-primary bg-black/20 hover:bg-black/30"
                >
                  Mitglied werden
                </Link>
              </div>
            </div>
          </div>

          {/* Media-Panel (rechts) */}
          <div className="w-full lg:w-[38%]">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <div
                className="h-full w-full grid place-items-center"
                style={{
                  background: "linear-gradient(135deg,var(--panel-from),var(--panel-to))",
                }}
              >
                <button
                  type="button"
                  aria-label="Kurzinfo-Video abspielen"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/85 px-4 py-2 backdrop-blur hover:bg-white transition"
                >
                  {/* simple play glyph */}
                  <span aria-hidden>▶︎</span>
                  <span className="text-slate-700">Video (90s)</span>
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-slate-500">Direkte Demokratie in 90 Sekunden.</p>
              <Link
                href={`/${locale}/howtoworks`}
                className="text-xs font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                aria-label="Mehr erfahren, wie VoiceOpenGov funktioniert"
              >
                Mehr erfahren →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
