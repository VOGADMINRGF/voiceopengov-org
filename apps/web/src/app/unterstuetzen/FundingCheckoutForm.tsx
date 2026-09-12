"use client";

import { useRef, useState } from "react";
import type { SupportedLocale } from "@/config/locales";
import type { FundingCadence } from "@/lib/fundingCheckout";
import type { FundingStrings } from "./fundingStrings";

const PRESETS = [10, 25, 50, 100];

export default function FundingCheckoutForm({ locale, strings, enabled }: { locale: SupportedLocale; strings: FundingStrings; enabled: boolean }) {
  const [cadence, setCadence] = useState<FundingCadence>("monthly");
  const [amount, setAmount] = useState(25);
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const attemptId = useRef(crypto.randomUUID());

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!accepted || !enabled) return;
    setPending(true); setError(false);
    try {
      const response = await fetch("/api/funding/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amountCents: Math.round(amount * 100), cadence, locale, attemptId: attemptId.current, termsAccepted: true }) });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.url) throw new Error("checkout_failed");
      window.location.assign(data.url);
    } catch {
      setError(true); setPending(false);
    }
  }

  return <form onSubmit={submit} className="rounded-3xl border border-cyan-400/25 bg-slate-900/80 p-5 shadow-xl sm:p-8">
    <div className="grid grid-cols-3 gap-2" role="group" aria-label={strings.amount}>
      {(["one_time", "monthly", "annual"] as FundingCadence[]).map((value) => <button key={value} type="button" onClick={() => setCadence(value)} className={`min-w-0 rounded-xl px-2 py-3 text-sm font-semibold ${cadence === value ? "bg-cyan-300 text-slate-950" : "border border-slate-700 text-slate-200"}`}>{value === "one_time" ? strings.oneTime : value === "monthly" ? strings.monthly : strings.annual}</button>)}
    </div>
    <fieldset className="mt-6"><legend className="text-sm font-semibold text-slate-200">{strings.amount}</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{PRESETS.map((value) => <button key={value} type="button" onClick={() => setAmount(value)} className={`rounded-xl px-3 py-3 font-bold ${amount === value ? "bg-blue-500 text-white" : "border border-slate-700"}`}>€{value}</button>)}</div></fieldset>
    <label className="mt-4 block text-sm text-slate-300"><span>{strings.customAmount}</span><input type="number" min="5" max="10000" step="1" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base" /></label>
    <label className="mt-5 flex min-w-0 gap-3 text-sm text-slate-300"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 shrink-0" required /><span className="min-w-0">{strings.accept}</span></label>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-950/60 p-3 text-sm text-red-200">{strings.error}</p>}
    <button disabled={!accepted || !enabled || pending || amount < 5 || amount > 10000} className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 px-6 py-4 font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{pending ? strings.processing : strings.start}</button>
  </form>;
}
