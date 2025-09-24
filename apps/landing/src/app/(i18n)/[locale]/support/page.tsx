"use client";

import { useEffect, useMemo, useState } from "react";
import LocationFields from "@/components/shared/LocationFields";
import { getCountries } from "@/libs/countries";

type Rhythm = "monthly" | "once";
type PaymentMethod = "sepa" | "wire";
type Member = { fullName: string; email: string; birth: string };

type Props = {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function SupportPage({ params: { locale }, searchParams }: Props) {
  const qp = (k: string, d = "") =>
    (Array.isArray(searchParams[k]) ? searchParams[k]?.[0] : searchParams[k]) ?? d;

  // Standort (ISO-Code!)
  const [countryCode, setCountryCode] = useState(qp("country", "DE"));
  const [postal, setPostal] = useState(qp("postal", ""));
  const [city, setCity] = useState(qp("city", ""));

  // Beitrag / Rhythmus / Haushalt / Skills
  const [amount, setAmount] = useState<number>(
    Number(qp("amount", "5.63")) || 5.63
  );
  const [rhythm, setRhythm] = useState<Rhythm>(
    (qp("rhythm", "once") as Rhythm) || "once"
  );
  const [household, setHousehold] = useState<number>(
    Number(qp("household", "1")) || 1
  );
  const [skills, setSkills] = useState(qp("skills", ""));

  // Rechner (1 % von (Haushaltsnetto – Miete))
  const [netIncome, setNetIncome] = useState<string>("");
  const [rent, setRent] = useState<string>("");
  const suggestion = useMemo(() => {
    const net = Number(netIncome.replace(",", ".")) || 0;
    const r = Number(rent.replace(",", ".")) || 0;
    const base = Math.max(0, net - r);
    const s = Math.round(base * 0.01 * 100) / 100;
    return s > 0 ? s : 5.63; // Mindestens 5,63 €
  }, [netIncome, rent]);

  // Mitglieder-Daten (eine Person pro >=16 Haushalt)
  const [members, setMembers] = useState<Member[]>(
    Array.from({ length: Math.max(1, Number(qp("household", "1")) || 1) }, () => ({
      fullName: "",
      email: "",
      birth: "",
    }))
  );

  useEffect(() => {
    setMembers((prev) => {
      const need = Math.max(1, household);
      if (prev.length === need) return prev;
      const next = [...prev];
      while (next.length < need)
        next.push({ fullName: "", email: "", birth: "" });
      return next.slice(0, need);
    });
  }, [household]);

  // Zahlung
  const [method, setMethod] = useState<PaymentMethod>("sepa");

  // Anzeige-Label für Land
  const countries = useMemo(() => getCountries(locale), [locale]);
  const countryLabel =
    countries.find((c) => c.code === countryCode)?.label ?? countryCode;

  // Gesamtsumme
  const total = useMemo(
    () => Math.round(amount * Math.max(1, household) * 100) / 100,
    [amount, household]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      locale,
      countryCode,
      postal,
      city,
      amount,
      rhythm,
      household,
      skills,
      method,
      members,
    };

    const res = await fetch("/api/support/intent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json().catch(() => null);
    alert(
      j?.ok
        ? "Danke! Jede eingetragene Person erhält eine Bestätigungs-E-Mail."
        : "Uups – bitte später erneut versuchen."
    );
  }

  return (
    <section className="section">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold leading-tight">
          <span className="text-brand-grad">Jedes Mitglied zählt.</span>
        </h1>
        <p className="mt-3 text-slate-600">
          Wir brauchen deine Unterstützung, damit direkte Demokratie sichtbar
          wird: Moderation, Faktenprüfung, Infrastruktur – all das kostet. Jede
          Person (≥ 16 Jahre) bekommt eine eigene Bestätigungs-Mail – unabhängig
          davon, wer bezahlt.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-6">
          {/* Standort */}
          <div className="card">
            <LocationFields
              locale={locale}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              postal={postal}
              setPostal={setPostal}
              city={city}
              setCity={setCity}
            />
          </div>

          {/* Beitrag / Rhythmus / Rechner / Skills */}
          <div className="card">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Betrag & Rhythmus */}
              <div className="lg:col-span-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      Betrag
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {([5.63, 10, 20, 35] as number[]).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAmount(v)}
                          className={
                            "rounded-full border px-3 py-1.5 text-sm " +
                            (amount === v
                              ? "border-brand-accent-1 ring-2 ring-brand-accent-1/30"
                              : "border-slate-300 hover:bg-slate-50")
                          }
                        >
                          {v.toLocaleString("de-DE", {
                            minimumFractionDigits: v % 1 ? 2 : 0,
                          })}{" "}
                          €
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        className="w-40 rounded-xl border border-slate-300 px-3 py-2"
                        value={amount}
                        onChange={(e) =>
                          setAmount(Math.max(0, Number(e.target.value) || 0))
                        }
                      />
                      <span className="text-slate-500">€</span>
                    </div>

                    <div className="mt-4 text-sm font-medium text-slate-700">
                      Rhythmus
                    </div>
                    <div className="mt-2 inline-flex rounded-full border border-slate-300 p-1">
                      <button
                        type="button"
                        onClick={() => setRhythm("monthly")}
                        className={
                          "rounded-full px-3 py-1.5 " +
                          (rhythm === "monthly"
                            ? "text-white"
                            : "hover:bg-slate-50")
                        }
                        style={
                          rhythm === "monthly"
                            ? {
                                background:
                                  "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
                              }
                            : {}
                        }
                      >
                        monatlich
                      </button>
                      <button
                        type="button"
                        onClick={() => setRhythm("once")}
                        className={
                          "rounded-full px-3 py-1.5 " +
                          (rhythm === "once"
                            ? "text-white"
                            : "hover:bg-slate-50")
                        }
                        style={
                          rhythm === "once"
                            ? {
                                background:
                                  "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
                              }
                            : {}
                        }
                      >
                        einmalig
                      </button>
                    </div>
                  </div>

                  {/* Rechner */}
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      Empfehlung berechnen (1 % Netto − Miete)
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-slate-500">
                          Haushaltsnetto (€)
                        </div>
                        <input
                          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                          value={netIncome}
                          onChange={(e) => setNetIncome(e.target.value)}
                          inputMode="decimal"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Miete (€)</div>
                        <input
                          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                          value={rent}
                          onChange={(e) => setRent(e.target.value)}
                          inputMode="decimal"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAmount(suggestion)}
                      className="mt-3 rounded-full px-3 py-1.5 text-sm font-semibold text-white"
                      style={{
                        background:
                          "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
                      }}
                      title="Vorschlag übernehmen"
                    >
                      Vorschlag übernehmen (
                      {suggestion.toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                      })}
                      €)
                    </button>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Fähigkeiten (optional)
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="z. B. Design, Social Media, Moderation"
                    />
                  </label>
                </div>
              </div>

              {/* Zusammenfassung */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm font-medium text-slate-700">
                  Zusammenfassung
                </div>
                <dl className="mt-2 space-y-1 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <dt>Land</dt>
                    <dd>{countryLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Region</dt>
                    <dd>{city || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Beitrag</dt>
                    <dd>
                      {amount.toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      € · {rhythm === "monthly" ? "monatlich" : "einmalig"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-3 text-sm font-medium text-slate-700">
                  Haushaltsgröße (≥ 16 Jahre)
                </div>
                <div className="mt-2 inline-flex items-center rounded-full border border-slate-300">
                  <button
                    type="button"
                    className="px-3 py-1.5 hover:bg-slate-50 rounded-l-full"
                    onClick={() => setHousehold((v) => Math.max(1, v - 1))}
                  >
                    −
                  </button>
                  <div className="px-4 py-1.5 min-w-[2rem] text-center">
                    {household}
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 hover:bg-slate-50 rounded-r-full"
                    onClick={() => setHousehold((v) => v + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="mt-4 text-sm text-slate-700">
                  Beitrag gesamt:{" "}
                  <strong>
                    {total.toLocaleString("de-DE", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    €
                  </strong>{" "}
                  {rhythm === "monthly" ? "/ Monat" : "einmalig"}
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-full px-4 py-2 font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
                  }}
                >
                  Jetzt unterstützen
                </button>
              </div>
            </div>
          </div>

          {/* Mitglieder-Daten */}
          <div className="card">
            <div className="text-sm font-medium text-slate-700 mb-2">
              Mitglieder-Daten
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Jede Person erhält eine eigene Bestätigungs-Mail.
            </p>

            <div className="grid gap-4">
              {members.map((m, i) => (
                <div key={i} className="grid gap-3 md:grid-cols-3">
                  <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder={`Vollständiger Name #${i + 1}`}
                    value={m.fullName}
                    onChange={(e) => {
                      const next = [...members];
                      next[i] = { ...next[i], fullName: e.target.value };
                      setMembers(next);
                    }}
                    required
                  />
                  <input
                    type="email"
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="E-Mail"
                    value={m.email}
                    onChange={(e) => {
                      const next = [...members];
                      next[i] = { ...next[i], email: e.target.value };
                      setMembers(next);
                    }}
                    required
                  />
                  <input
                    type="date"
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    value={m.birth}
                    onChange={(e) => {
                      const next = [...members];
                      next[i] = { ...next[i], birth: e.target.value };
                      setMembers(next);
                    }}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Zahlung */}
          <div className="card">
            <div className="text-sm font-medium text-slate-700">
              Zahlungsmethode
            </div>
            <div className="mt-2 inline-flex rounded-full border border-slate-300 p-1">
              <button
                type="button"
                onClick={() => setMethod("sepa")}
                className={
                  "rounded-full px-3 py-1.5 " +
                  (method === "sepa" ? "text-white" : "hover:bg-slate-50")
                }
                style={
                  method === "sepa"
                    ? {
                        background:
                          "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
                      }
                    : {}
                }
              >
                SEPA-Lastschrift
              </button>
              <button
                type="button"
                onClick={() => setMethod("wire")}
                className={
                  "rounded-full px-3 py-1.5 " +
                  (method === "wire" ? "text-white" : "hover:bg-slate-50")
                }
                style={
                  method === "wire"
                    ? {
                        background:
                          "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
                      }
                    : {}
                }
              >
                Direktüberweisung
              </button>
            </div>

            {method === "sepa" ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Kontoinhaber:in
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  IBAN
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 uppercase"
                    required
                    pattern="[A-Z]{2}[0-9A-Z ]{13,32}"
                    placeholder="DE12 3456 7890 1234 5678 90"
                  />
                </label>
                <label className="md:col-span-2 mt-1 inline-flex items-start gap-2 text-sm text-slate-700">
                  <input type="checkbox" required className="mt-1" />
                  <span>
                    Ich ermächtige VoiceOpenGov, Zahlungen per SEPA-Lastschrift
                    einzuziehen.
                  </span>
                </label>
              </div>
            ) : (
              <div className="mt-4 text-sm text-slate-700">
                <p>Überweise direkt an:</p>
                <ul className="mt-2 grid gap-1">
                  <li>
                    <strong>Empfänger:</strong> VoiceOpenGov UG (in Gründung)
                  </li>
                  <li>
                    <strong>IBAN:</strong> DE00 0000 0000 0000 0000 00
                  </li>
                  <li>
                    <strong>Verwendungszweck:</strong>{" "}
                    {locale.toUpperCase()} Unterstützung {new Date().getFullYear()}
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="btn-primary bg-brand-grad rounded-full px-4 py-2 font-semibold text-white"
            >
              Unterstützung senden
            </button>
            <a href={`/${locale}`} className="btn-outline rounded-full px-4 py-2">
              Abbrechen
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
