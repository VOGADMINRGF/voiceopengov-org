import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spenden – VoiceOpenGov",
  description: "Unterstuetze Aufbau, Recherche, Uebersetzung und Community.",
};

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--brand-from)] via-white to-white pb-16">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Spenden</p>
          <h1
            className="text-3xl md:text-4xl font-extrabold leading-tight"
            style={{
              backgroundImage: "linear-gradient(90deg,var(--brand-cyan),var(--brand-blue))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Halte VoiceOpenGov stabil und unabhaengig
          </h1>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Deine Unterstuetzung finanziert Hosting, Recherche, Uebersetzung, Recht und Community.
            Aktuell kannst du ueber Startnext spenden oder dich direkt bei uns melden.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            "Hosting & Infrastruktur",
            "Recherche & Quellenpflege",
            "Uebersetzung & Lokalisierung",
            "Recht & Prozessdesign",
            "Community & Moderation",
            "Transparenzberichte",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white/95 p-4 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Spendenwege</h2>
          <p className="mt-2 text-sm text-slate-700">
            Wenn du direkt spenden oder eine groessere Partnerschaft anfragen moechtest,
            schreib uns an contact@voiceopengov.org. Fuer alle anderen Spenden nutzen wir
            aktuell Startnext.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <a
            href="https://startnext.com/mehrheit"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
          >
            Zu Startnext (Mehrheit)
          </a>
          <a
            href="mailto:contact@voiceopengov.org"
            className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
          >
            Direktkontakt: contact@voiceopengov.org
          </a>
        </section>
      </section>
    </main>
  );
}
