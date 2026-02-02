import Link from "next/link";

export default function DirekteDemokratieDossierPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white pb-16">
      <section className="mx-auto max-w-4xl px-4 pb-10 pt-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Beispiel-Dossier</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
          Direkte Demokratie
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Ein Dossier bündelt Behauptungen, Quellen, offene Fragen und Varianten. So wird sichtbar,
          worüber Mehrheiten entscheiden und welche Grundlagen geprüft wurden.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Wie sichern wir die Qualität von Abstimmungen?",
            "Welche Rollen haben Regionen und Gemeinden?",
            "Welche Standards braucht die Umsetzung?",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Diskussion
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                Beiträge aus eDebatte
              </h2>
              <p className="text-sm text-slate-700">
                Hier entsteht die Diskussion zu diesem Dossier. Die Live‑Einbindung folgt; bis
                dahin kannst du direkt im Tool mitdiskutieren.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://edebatte.org"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Diskussion öffnen
              </a>
              <Link
                href="/#mitmachen"
                className="btn border border-sky-300 text-sky-700 hover:bg-sky-50"
              >
                Mitglied werden
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#mitmachen" className="btn btn-primary">
            Mitglied werden
          </Link>
          <Link href="/initiatives" className="btn border border-sky-300 text-sky-700 hover:bg-sky-50">
            Thema einreichen
          </Link>
        </div>
      </section>
    </main>
  );
}
