"use client";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LocationFields from "@/components/shared/LocationFields";

type Rhythm = "monthly" | "once";
const PRESETS = [5.63, 10, 20, 35];

export default function MembershipSection() {
  const pathname = usePathname() ?? "/de";
  const locale = pathname.split("/")[1] || "de";

  const [country, setCountry] = useState("Deutschland");
  const [postal, setPostal]   = useState("");
  const [city, setCity]       = useState("");

  const [amount, setAmount] = useState<number>(5.63);
  const [rhythm, setRhythm] = useState<Rhythm>("once"); // du wolltest „einmalig“ in der Demo
  const [skills, setSkills] = useState("");
  const [household, setHousehold] = useState(1);

  // Rechner
  const [calcOpen, setCalcOpen] = useState(false);
  const [net, setNet]   = useState<number | "">("");
  const [rent, setRent] = useState<number | "">("");

  const suggestion = useMemo(() => {
    const n = typeof net === "number" ? net : 0;
    const r = typeof rent === "number" ? rent : 0;
    const base = Math.max(0, n - r);
    const s = Math.max(5.63, base * 0.01); // 1% (Netto – Miete), min 5,63
    return Math.round(s * 100) / 100;
  }, [net, rent]);

  const total = useMemo(() => Math.round(amount * Math.max(1, household) * 100) / 100, [amount, household]);

  const supportHref = `/${locale}/support?country=${encodeURIComponent(country)}&postal=${encodeURIComponent(postal)}&city=${encodeURIComponent(city)}&amount=${amount}&rhythm=${rhythm}&household=${household}&skills=${encodeURIComponent(skills)}`;

  return (
    <section id="join" className="border-t border-slate-200 bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-2 text-xl font-bold text-brand-grad">Jedes Mitglied zählt.</h2>
        <p className="mb-6 max-w-3xl text-sm text-slate-600">
          Wir freuen uns über finanzielle und <strong>unentgeltliche Unterstützung</strong> (Zeit, Expertise, Netzwerk).
          Trag bei „Fähigkeiten“ gern ein, wie du mithelfen möchtest.
        </p>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Ort */}
          <div className="card">
            <LocationFields
              country={country} setCountry={setCountry}
              postal={postal}   setPostal={setPostal}
              city={city}       setCity={setCity}
            />
          </div>

          {/* Beitrag / Rhythmus / Skills */}
          <div className="card">
            <div className="text-sm font-medium text-slate-700">Betrag</div>

            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((v) => {
                const active = amount === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v)}
                    className="rounded-full px-3 py-1.5 border text-sm"
                    style={{
                      borderColor: active ? "var(--brand-accent-2)" : "var(--chip-border)",
                      color: active ? "var(--brand-accent-2)" : "inherit",
                      background: active ? "white" : "white"
                    }}
                  >
                    {v.toLocaleString("de-DE", { minimumFractionDigits: v % 1 ? 2 : 0 })} €
                  </button>
                );
              })}
              <div className="inline-flex items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  className="w-28 rounded-full border border-slate-300 px-3 py-1.5"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                />
                <span className="text-sm text-slate-600">€</span>
              </div>
            </div>

            <div className="mt-4 text-sm font-medium text-slate-700">Rhythmus</div>
            <div className="mt-2 inline-flex rounded-full border border-slate-300 p-1">
              <button
                type="button"
                onClick={() => setRhythm("monthly")}
                className={"rounded-full px-3 py-1.5 " + (rhythm === "monthly" ? "text-white" : "hover:bg-slate-50")}
                style={rhythm === "monthly" ? { background: "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))" } : {}}
              >
                monatlich
              </button>
              <button
                type="button"
                onClick={() => setRhythm("once")}
                className={"rounded-full px-3 py-1.5 " + (rhythm === "once" ? "text-white" : "hover:bg-slate-50")}
                style={rhythm === "once" ? { background: "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))" } : {}}
              >
                einmalig
              </button>
            </div>

            {/* Rechner */}
            <button type="button" onClick={() => setCalcOpen((v) => !v)}
                    className="mt-3 text-sm text-slate-700 underline underline-offset-4">
              {calcOpen ? "Rechner ausblenden" : "Empfehlung berechnen (1% Netto – Miete)"}
            </button>
            {calcOpen && (
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <label className="text-sm font-medium text-slate-700">
                  Haushaltsnetto (€)
                  <input type="number" step="0.01" min="0"
                         className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                         value={net === "" ? "" : net}
                         onChange={(e) => setNet(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Miete (€)
                  <input type="number" step="0.01" min="0"
                         className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                         value={rent === "" ? "" : rent}
                         onChange={(e) => setRent(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </label>
                <div className="flex items-end">
                  <button type="button" onClick={() => setAmount(suggestion)}
                          className="w-full btn-primary bg-brand-grad">
                    Vorschlag übernehmen ({suggestion.toLocaleString("de-DE",{minimumFractionDigits:2})} €)
                  </button>
                </div>
              </div>
            )}

            <label className="mt-4 block text-sm font-medium text-slate-700">
              Fähigkeiten (optional)
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="z. B. Design, Social Media, Moderation"
              />
            </label>
          </div>

          {/* Zusammenfassung */}
          <div className="card">
            <div className="text-sm font-semibold text-slate-900">Zusammenfassung</div>
            <dl className="mt-2 text-sm text-slate-700 grid grid-cols-3 gap-y-1">
              <dt className="col-span-1">Land</dt>
              <dd className="col-span-2">{country}</dd>
              <dt className="col-span-1">Region</dt>
              <dd className="col-span-2">{[postal, city].filter(Boolean).join(" ") || "—"}</dd>
              <dt className="col-span-1">Beitrag</dt>
              <dd className="col-span-2">{amount.toLocaleString("de-DE",{minimumFractionDigits: amount%1?2:0})} € · {rhythm === "monthly" ? "monatlich" : "einmalig"}</dd>
            </dl>

            <div className="mt-4 text-sm font-medium text-slate-700">Haushaltsgröße (≥ 16 Jahre)</div>
            <div className="mt-2 inline-flex items-center rounded-full border border-slate-300">
              <button type="button" className="px-3 py-1.5 hover:bg-slate-50 rounded-l-full"
                      onClick={() => setHousehold((v) => Math.max(1, v - 1))}>−</button>
              <div className="px-4 py-1.5 min-w-[2rem] text-center">{household}</div>
              <button type="button" className="px-3 py-1.5 hover:bg-slate-50 rounded-r-full"
                      onClick={() => setHousehold((v) => v + 1)}>+</button>
            </div>

            <div className="mt-3 text-sm text-slate-700">
              Beitrag gesamt: <span className="font-semibold">{total.toLocaleString("de-DE",{minimumFractionDigits:2})} €</span> {rhythm === "monthly" ? "/ Monat" : "einmalig"}
            </div>

            <Link href={supportHref}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-white shadow hover:shadow-md transition"
                  style={{ backgroundImage: "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))" }}>
              Jetzt unterstützen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
