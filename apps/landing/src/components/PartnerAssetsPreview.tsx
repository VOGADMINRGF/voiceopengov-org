"use client";

export default function PartnerAssetsPreview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* QR‑Sticker */}
      <div className="card">
        <h4 className="font-semibold">QR‑Aufkleber (80×80 mm)</h4>
        <div className="mt-3 aspect-square rounded-xl border border-slate-200 p-3 flex items-center justify-center">
          <div className="w-20 h-20 rounded bg-slate-200" aria-label="QR‑Platzhalter" />
        </div>
        <p className="mt-2 text-xs text-slate-600">Wetterfest, hinten mit Kurz‑Claim.</p>
      </div>

      {/* Tischaufsteller */}
      <div className="card">
        <h4 className="font-semibold">Tischaufsteller A6 (Paar)</h4>
        <div className="mt-3 h-40 rounded-xl border border-slate-200 p-4">
          <div className="h-4 w-24 rounded bg-brand-grad" />
          <div className="mt-3 h-5 w-40 rounded bg-slate-200" />
          <div className="mt-3 h-16 w-16 rounded bg-slate-200" />
        </div>
        <p className="mt-2 text-xs text-slate-600">Beidseitig, Claim + QR + Kurz‑URL.</p>
      </div>

      {/* Tablet‑Tower */}
      <div className="card">
        <h4 className="font-semibold">Tablet‑Tower (Leihgabe)</h4>
        <div className="mt-3 h-40 rounded-xl border border-slate-200 p-4 flex items-end justify-center">
          <div className="w-24 h-32 rounded-xl border border-slate-300" />
        </div>
        <p className="mt-2 text-xs text-slate-600">Tablet + gesicherter Ständer + Kiosk‑App.</p>
      </div>
    </div>
  );
}