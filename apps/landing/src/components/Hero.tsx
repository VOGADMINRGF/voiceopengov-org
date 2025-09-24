export default function Hero() {
  return (
  <section className="section text-center">
  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700">
  <span>Participatory • Transparent • Impact‑Driven</span>
  </div>
  <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
  <span className="text-brand-grad">Gemeinsam Politik besser machen</span>
  </h1>
  <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
  VoiceOpenGov vernetzt Bürger:innen, Journalismus und Politik – mit Tools für Debatten,
  Abstimmungen und Faktenprüfung.
  </p>
  <div className="mt-6 flex justify-center gap-3">
  <a href="#newsletter" className="btn-primary">Newsletter abonnieren</a>
  <a href="/de/localsupport" className="btn-outline"></a>
  </div>
  </section>
  );
  }