"use client";
import { useMemo, useState } from "react";

export default function SupporterFormLite() {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [amount, setAmount] = useState<number>(5);
  const [cycle, setCycle] = useState<"monthly"|"once">("monthly");
  const [skills, setSkills] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);

  const summary = useMemo(() => ({ country, region, amount, cycle, skills }), [country, region, amount, cycle, skills]);

  async function submit() {
    setPending(true); setOk(null);
    const res = await fetch("/api/supporters/request", {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        intent: { amount, cycle },
        supporter: { email, skills, payment: "banktransfer" },
        chapter: { country, region }
      })
    });
    setOk(res.ok); setPending(false);
  }

  return (
    <section id="mitglied" className="container py-12">
      <h2 className="text-2xl font-bold mb-4">Jedes Mitglied zählt.</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <label className="text-sm text-slate-600">Land</label>
          <input value={country} onChange={e=>setCountry(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
          <label className="mt-3 text-sm text-slate-600">Region/Frei</label>
          <input value={region} onChange={e=>setRegion(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
          <label className="mt-3 text-sm text-slate-600">E-Mail</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border px-3 py-2" />
        </div>
        <div className="card">
          <label className="text-sm text-slate-600">Betrag</label>
          <div className="mt-1 flex gap-2">
            {[5,10,20,35].map(v=>(
              <button type="button" key={v} onClick={()=>setAmount(v)}
                className={"rounded-full border px-3 py-1.5 text-sm " + (amount===v ? "bg-black text-white" : "bg-white")}>
                {v} €
              </button>
            ))}
          </div>
          <label className="mt-3 text-sm text-slate-600">Rhythmus</label>
          <div className="mt-1 flex gap-2">
            <button type="button" onClick={()=>setCycle("monthly")}
              className={"rounded-full border px-3 py-1.5 text-sm " + (cycle==="monthly" ? "bg-black text-white":"bg-white")}>monatlich</button>
            <button type="button" onClick={()=>setCycle("once")}
              className={"rounded-full border px-3 py-1.5 text-sm " + (cycle==="once" ? "bg-black text-white":"bg-white")}>einmalig</button>
          </div>
          <label className="mt-3 text-sm text-slate-600">Fähigkeiten (optional)</label>
          <input value={skills} onChange={e=>setSkills(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Zusammenfassung</h3>
          <p className="text-sm text-slate-600">Land: {summary.country || "—"}<br/>Region: {summary.region || "—"}</p>
          <p className="mt-1 text-sm text-slate-600">Beitrag: <b>{summary.amount} €</b> · {summary.cycle==="monthly"?"monatlich":"einmalig"}</p>
          <button onClick={submit} disabled={pending}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-from to-brand-to py-2 text-white shadow-soft">
            {pending?"Sende …":"Jetzt unterstützen"}
          </button>
          {ok===true && <p className="mt-2 text-emerald-600 text-sm">Danke – wir melden uns!</p>}
          {ok===false && <p className="mt-2 text-rose-600 text-sm">Senden fehlgeschlagen.</p>}
        </div>
      </div>
    </section>
  );
}
