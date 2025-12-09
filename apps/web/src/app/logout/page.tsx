export const dynamic = "force-dynamic";

export default function LogoutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center">
        <div className="rounded-3xl bg-white/90 px-6 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] text-sky-600">Abgemeldet</div>
          <h1 className="text-2xl font-semibold text-slate-900">Du bist jetzt abgemeldet.</h1>
          <p className="text-sm text-slate-600">
            Wir haben deinen Wunsch verarbeitet. Du kannst die Seite schließen oder dich jederzeit neu anmelden.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-105"
          >
            Zur Anmeldung
          </a>
        </div>
      </div>
    </main>
  );
}
