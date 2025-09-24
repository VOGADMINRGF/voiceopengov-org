import Link from "next/link";

/**
 * JourneyStrip (ersetzt den bisherigen StoryStrip)
 * 4 Kacheln abgestimmt auf die Startseite:
 *  - Anliegen rein, Ergebnis raus.
 *  - Mehr als Pro & Contra.
 *  - Faktenbasiert & KI-gestützt.
 *  - Im Auftrag des Volkes.
 */
export default function StoryStrip({ locale, className = "" }: {
  locale: string; className?: string;
}) {
  const items = [
    {
      n: "01",
      t: "Anliegen rein, Ergebnis raus.",
      d: "In 60 Sekunden einreichen – gleiche Standards führen zum Ergebnis.",
      href: `/${locale}/statements/new`,
    },
    {
      n: "02",
      t: "Mehr als Pro & Contra.",
      d: "Positionen, Szenarien und Folgen transparent dargestellt – inkl. Minderheitenbericht.",
      href: `/${locale}/howtoworks#so-gehts`,
    },
    {
      n: "03",
      t: "Faktenbasiert & KI-gestützt.",
      d: "Evidenz-Graph, geprüfte Quellen, offene Methodik – nachvollziehbar für alle.",
      href: `/${locale}/howtoworks#technik`,
    },
    {
      n: "04",
      t: "Im Auftrag des Volkes.",
      d: "Geheime Stimmabgabe, klares Ergebnis, öffentliches Monitoring der Umsetzung.",
      href: `/${locale}/vote#nachher`,
    },
  ];

  return (
    <div className={`not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((s, i) => (
        <Link key={i} href={s.href} className="brand-card hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-slate-300">
          <div className="text-xs font-mono text-slate-500">{s.n}</div>
          <div className="text-sm font-semibold">{s.t}</div>
          <div className="text-sm text-slate-600 mt-1">{s.d}</div>
        </Link>
      ))}
    </div>
  );
}
