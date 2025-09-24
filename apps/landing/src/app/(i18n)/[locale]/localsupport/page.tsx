// src/app/(i18n)/[locale]/lokal/page.tsx
"use client";

import { useMemo, useState } from "react";
import { B2B_BUNDLES, type Bundle } from "@/libs/b2b/bundles";
import LocationFields from "@/components/shared/LocationFields";
import { getCountries } from "@/libs/countries";

type Sel = { key: Bundle["key"]; qty: number };

export default function LokalPage({ params: { locale } }: { params: { locale: string } }) {
  const [countryCode, setCountryCode] = useState("DE");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [selected, setSelected] = useState<Sel[]>([]);

  const toggle = (key: Sel["key"]) => {
    setSelected((prev) => {
      const i = prev.findIndex((p) => p.key === key);
      if (i >= 0) {
        const cp = [...prev]; cp.splice(i, 1); return cp;
      }
      const def = B2B_BUNDLES.find(b => b.key === key)?.defaultQty ?? 1;
      return [...prev, { key, qty: def }];
    });
  };

  const setQty = (key: Sel["key"], qty: number) =>
    setSelected((prev) => prev.map((s) => (s.key === key ? { ...s, qty: Math.max(1, qty || 1) } : s)));

  const total = useMemo(() => {
    return selected.reduce((sum, s) => {
      const b = B2B_BUNDLES.find(bb => bb.key === s.key);
      return sum + (b ? b.price * s.qty : 0);
    }, 0);
  }, [selected]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { email, org, countryCode, postal, city, items: selected };
    const res = await fetch("/api/b2b/order", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload)
    });
    const j = await res.json().catch(() => null);
    alert(j?.ok ? "Danke! Wir melden uns mit Details & Versand." : "Uups – bitte später erneut versuchen.");
  }

  const countries = useMemo(() => getCountries(locale), [locale]);
  const countryLabel = countries.find(c => c.code === countryCode)?.label ?? countryCode;

  return (
    <section className="section">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold leading-tight">
          Kapitel starten / <span className="text-brand-grad">Region aktivieren</span>
        </h1>
        <p className="mt-3 text-slate-600">
          Wir sprechen gezielt <strong>lokalen Journalismus, Organisationen & Vereine</strong> an. Vieles geht digital –
          nicht überall braucht es Aufsteller. Die Einnahmen fließen vollständig in den Aufbau der Plattform zurück.
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-6">
          {/* Material-Auswahl */}
          <div className="card">
            <div className="text-sm font-medium text-slate-700">Material / Unterstützung</div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {B2B_BUNDLES.map((b) => {
                const active = selected.find((s) => s.key === b.key);
                return (
                  <div key={b.key} className="rounded-xl border border-slate-200 p-3">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1" checked={!!active} onChange={() => toggle(b.key)} />
                      <div>
                        <div className="font-medium">{b.title}</div>
                        <div className="text-xs text-slate-600">{b.description}</div>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs text-slate-500">
                            {b.price ? `${b.price.toFixed(2)} €` : "kostenfrei"}
                          </span>
                          {!!active && b.price > 0 && (
                            <input
                              type="number" min={1} value={active.qty}
                              onChange={(e) => setQty(b.key, parseInt(e.target.value || "1", 10))}
                              className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                            />
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kontakt + Standort */}
          <div className="card">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-slate-700">
                Organisation / Verein / Partner
                <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                       value={org} onChange={(e) => setOrg(e.target.value)} placeholder="z. B. Stadtjournal, Verein…" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                E-Mail
                <input type="email" required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                       value={email} onChange={(e) => setEmail(e.target.value)} placeholder="z. B. kontakt@…" />
              </label>
            </div>

            <div className="mt-4">
              <LocationFields
                locale={locale}
                countryCode={countryCode} setCountryCode={setCountryCode}
                postal={postal} setPostal={setPostal}
                city={city} setCity={setCity}
              />
            </div>
          </div>

          {/* Summe + CTA */}
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                <div><strong>Land:</strong> {countryLabel}</div>
                <div><strong>Summe:</strong> {total.toFixed(2)} €</div>
              </div>
              <div className="flex gap-3">
                <a href={`/${locale}/support`} className="btn btn-outline">
                  Lieber Privatperson/Mitglied?
                </a>
                <button className="btn btn-primary" style={{background:"linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))"}}>
                  Anfragen / Bestellen
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Hinweis: Wir sind ein neues Projekt – Beiträge aus Bestellungen fließen in Technik, Moderation & Faktenprüfung zurück.
          </p>
        </form>
      </div>
    </section>
  );
}
