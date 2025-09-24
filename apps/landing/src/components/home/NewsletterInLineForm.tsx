"use client";
import { useState } from "react";

export default function NewsletterInlineForm() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<null | boolean>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, website: "" }) // website = Honeypot
      });
      const j = await res.json().catch(() => ({}));
      setOk(Boolean(j?.ok));
      if (j?.ok) setEmail("");
    } catch {
      setOk(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full sm:w-auto items-center gap-2">
      <div className="relative flex-1 sm:flex-none">
        <input
          type="email"
          required
          placeholder="E-Mail"
          className="w-full sm:w-72 rounded-full border border-slate-300 bg-white/90 px-4 py-2.5
                     focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent-1)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Honeypot */}
        <input type="text" name="website" autoComplete="off" tabIndex={-1}
               className="hidden" aria-hidden="true" />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-white shadow
                   hover:shadow-md transition disabled:opacity-60"
        style={{ backgroundImage: "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))" }}
      >
        Newsletter abonnieren
      </button>
      {ok === true && <span className="text-sm text-emerald-600">Danke! Check deine Mail.</span>}
      {ok === false && <span className="text-sm text-rose-600">Ups, versuch’s nochmal.</span>}
    </form>
  );
}
