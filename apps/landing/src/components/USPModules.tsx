import Link from "next/link";

const items = [
  { title: "Anliegen rein, Ergebnis raus.",
    body: "In 60 Sekunden einreichen – barrierefrei und für alle zugänglich. Danach startet das direktdemokratische Verfahren mit klaren Schritten bis zum Ergebnis.",
    href: "#app" },
  { title: "Mehr als Pro & Contra.",
    body: "Positionen, Szenarien und Folgen transparent gemacht. Minderheiten sichtbar, Mehrheiten erkennbar – Mehrheitsentscheidung ohne Hinterzimmer.",
    href: "#funktion" },
  { title: "Faktenbasiert & KI-gestützt.",
    body: "International geprüft, redaktionell kuratiert, wissenschaftlich belegt. Entscheidungen auf belastbaren Fakten.",
    href: "#pruefung" },
  { title: "Im Auftrag des Volkes.",
    body: "Die direkte Entscheidung formt das Programm – dynamisch, nach Mehrheitsprinzip. Wir organisieren Umsetzung und Rechenschaft.",
    href: "#ablauf" }
];

export default function USPModules() {
  return (
    <section id="usps" className="container mx-auto max-w-7xl px-4 py-8">
      {/* 2 Spalten Desktop, 1 Spalte mobil – Karten haben definierte Mindesthöhe */}
      <div className="grid gap-4 md:grid-cols-4">
        {items.map((it) => (
          <article
            key={it.title}
            className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition
                       min-h-[130px] flex flex-col"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
                 style={{ background: "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))" }} />
            <h3 className="text-base font-semibold text-slate-900">{it.title}</h3>
            <p className="mt-2 text-sm text-slate-600 flex-1">{it.body}</p>
            <Link href={it.href} className="mt-2 inline-flex text-sm font-medium text-slate-800">
              Mehr
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
