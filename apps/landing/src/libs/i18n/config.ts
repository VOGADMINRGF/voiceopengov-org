import Link from "next/link";

export default function USPModules() {
  const items = [
    { title: "Anliegen rein, Ergebnis raus.", body: "In 60 Sekunden einreichen – barrierefrei, transparent und für alle zugänglich.", href: "#app" },
    { title: "Mehr als Pro & Contra.", body: "Wir zeigen Eventualitäten, stärken Minderheiten und machen Nutzen sichtbar.", href: "#funktion" },
    { title: "Faktenbasiert & KI-gestützt.", body: "International geprüft, wissenschaftlich belegt, redaktionell abgesichert.", href: "#pruefung" },
    { title: "Im Auftrag des Volkes.", body: "Das Volksvotum formt das Programm – dynamisch, klar, nach Mehrheitsprinzip.", href: "#ablauf" }
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <article key={it.title} className="card">
          <h3 className="text-lg font-semibold">{it.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{it.body}</p>
          <Link href={it.href} className="link-cta">Mehr</Link>
        </article>
      ))}
    </div>
  );
}
