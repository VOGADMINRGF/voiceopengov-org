import Link from "next/link";

function formatValue(value: number) {
  return new Intl.NumberFormat("de-DE").format(value);
}

function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 opacity-70" />
      <div className="text-sm font-medium text-slate-600">{label}</div>

      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-4xl font-semibold tracking-tight text-slate-900">{value}</div>
        <div className="text-sm text-slate-500">{hint}</div>
      </div>

      <div className="mt-4 text-sm font-medium text-slate-600 opacity-80 group-hover:opacity-100">
        Mehr -&gt;
      </div>
    </Link>
  );
}

export function MomentumAndCtas({
  members,
  chapters,
  countries,
}: {
  members: number;
  chapters: number;
  countries: number;
}) {
  const mHint = members === 0 ? "Starte den Anfang" : "machen bereits mit";
  const cHint = chapters === 0 ? "Dein Ort kann der erste sein" : "in Vorbereitung";
  const lHint = countries === 0 ? "Wir bauen international" : "aktiv";
  const ctaBase =
    "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition shadow-sm";
  const ctaPrimary = `${ctaBase} bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white hover:brightness-105`;
  const ctaSecondary = `${ctaBase} border border-cyan-200 bg-white text-slate-900 hover:bg-cyan-50/40`;
  const ctaGhost = `${ctaBase} border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white`;

  return (
    <section className="mt-8">
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Mitglieder"
          value={formatValue(members)}
          hint={mHint}
          href="/#mitmachen"
        />
        <StatCard
          label="Chapter"
          value={formatValue(chapters)}
          hint={cHint}
          href="/chapter"
        />
        <StatCard
          label="Länder"
          value={formatValue(countries)}
          hint={lHint}
          href="/"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link href="/#mitmachen" className={ctaPrimary}>
          Kostenfrei beitreten
        </Link>

        <Link href="/chapter" className={ctaSecondary}>
          Chapter starten
        </Link>

        <a
          className={ctaGhost}
          href="https://startnext.com/mehrheit"
          target="_blank"
          rel="noreferrer"
        >
          Spenden (Startnext)
        </a>
      </div>

      <div className="mt-2 text-xs text-slate-500">
        60 Sekunden - Double-Opt-In - öffentlich nur Orts-Summen - keine Einzelprofile
      </div>
    </section>
  );
}
