"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import LocationFields from "@/components/shared/LocationFields";

type Interest = "support" | "org";
type Shipping = { name: string; company: string; street: string; postal: string; city: string; countryCode: string };

const REQUESTS = [
  { key: "pressKit",   label: "Presse-Kit (digital)",                      ship: false },
  { key: "socialPack", label: "Social-Media-Paket (digital)",              ship: false },
  { key: "talk",       label: "Vortrag/Workshop vor Ort (Kontakt)",        ship: false },
  { key: "flyers",     label: "Flyer-Paket",                                ship: true  },
  { key: "posters",    label: "Poster-Paket",                               ship: true  },
  { key: "standKit",   label: "Stand-Kit (optional – kein Muss)",          ship: true  },
] as const;

export default function LocalFormLite() {
  // Locale aus dem Pfad ableiten (/de/…, /en/…)
  const pathname = usePathname() || "/de";
  const locale = (pathname.split("/").filter(Boolean)[0] ?? "de").toLowerCase();

  // Standort-Felder (werden von LocationFields befüllt)
  const [country, setCountry] = useState<string>("Deutschland");
  const [postal, setPostal]   = useState<string>("");
  const [city, setCity]       = useState<string>("");

  // Basisdaten
  const [email, setEmail]         = useState("");
  const [interest, setInterest]   = useState<Interest>("support");
  const [message, setMessage]     = useState("");

  // Anfragen (Checkboxen)
  const [selected, setSelected] = useState<Record<string, boolean>>({
    pressKit: false, socialPack: false, talk: false, flyers: false, posters: false, standKit: false,
  });
  const needShip = useMemo(
    () => REQUESTS.some(r => r.ship && selected[r.key]),
    [selected]
  );

  // Versandadresse (nur wenn nötig)
  const [ship, setShip] = useState<Shipping>({
    name: "", company: "", street: "", postal: "", city: "", country: "DE"
  });

  const toggle = (key: keyof typeof selected) =>
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Bitte gültige E-Mail angeben.");
      return;
    }

    const payload = {
      locale,
      interest,
      email,
      country,
      postal,
      city,
      requests: Object.entries(selected).filter(([,v]) => v).map(([k]) => k),
      shipping: needShip ? ship : undefined,
      message: message || undefined,
    };

    // Backend-Route: falls du bereits /api/chapters nutzt, passt das hier:
    const res = await fetch("/api/localsupport", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json().catch(() => ({}));

    if (j?.ok) {
      alert("Danke! Wir melden uns mit den nächsten Schritten.");
      setSelected({ pressKit:false, socialPack:false, talk:false, flyers:false, posters:false, standKit:false });
      setMessage("");
      if (needShip) setShip(s => ({ ...s, name:"", company:"", street:"", postal:"", city:"" }));
    } else {
      alert("Leider Fehler bei der Übermittlung – bitte später erneut versuchen.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="card">
      {/* Intro */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          <span className="text-brand-grad">Region aktivieren – so passt es zu uns.</span>
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          Wir sprechen gezielt <strong>lokalen Journalismus, Vereine &amp; Verbände</strong> an – Menschen,
          die vor Ort Wirkung entfalten. <em>Tablets &amp; Aufsteller sind kein Muss.</em> Vieles geht
          digital, mit Gesprächen und Veranstaltungen.
        </p>
      </div>

      {/* Interesse & Email */}
      <fieldset className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Worum geht’s?</label>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setInterest("support")}
              className={`btn ${interest === "support" ? "btn-primary" : "btn-outline"}`}
            >
              Mitmachen vor Ort
            </button>
            <button
              type="button"
              onClick={() => setInterest("org")}
              className={`btn ${interest === "org" ? "btn-primary" : "btn-outline"}`}
            >
              Organisation / Verein / Partner
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">E-Mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="z. B. kontakt@…"
          />
        </div>
      </fieldset>

      {/* Standort */}
      <div className="mt-5">
        <label className="text-sm font-medium">Standort</label>
        <div className="mt-2">
          <LocationFields
            country={country} setCountry={setCountry}
            postal={postal}   setPostal={setPostal}
            city={city}       setCity={setCity}
          />
        </div>
      </div>

      {/* Bedarf (ohne Previews) */}
      <div className="mt-6">
        <label className="text-sm font-medium">Wobei brauchst du Material/Unterstützung?</label>
        <div className="mt-2 grid sm:grid-cols-2 gap-3">
          {REQUESTS.map(item => (
            <label key={item.key} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
              <input
                type="checkbox"
                checked={!!selected[item.key]}
                onChange={() => toggle(item.key)}
                className="mt-1"
              />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-slate-600">
                  {item.ship ? "per Versand" : "digital / Kontakt"}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Versandadresse – nur wenn nötig */}
      {needShip && (
        <div className="mt-6">
          <label className="text-sm font-medium">Versandadresse</label>
          <div className="mt-2 grid md:grid-cols-2 gap-3">
            <input placeholder="Name" value={ship.name} onChange={(e)=>setShip({...ship, name:e.target.value})}
                   className="rounded-xl border border-slate-300 px-3 py-2" />
            <input placeholder="Firma (optional)" value={ship.company} onChange={(e)=>setShip({...ship, company:e.target.value})}
                   className="rounded-xl border border-slate-300 px-3 py-2" />
            <input placeholder="Straße & Nr." value={ship.street} onChange={(e)=>setShip({...ship, street:e.target.value})}
                   className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
            <input placeholder="PLZ" value={ship.postal} onChange={(e)=>setShip({...ship, postal:e.target.value})}
                   className="rounded-xl border border-slate-300 px-3 py-2" />
            <input placeholder="Ort" value={ship.city} onChange={(e)=>setShip({...ship, city:e.target.value})}
                   className="rounded-xl border border-slate-300 px-3 py-2" />
          </div>
        </div>
      )}

      {/* Nachricht */}
      <div className="mt-6">
        <label className="text-sm font-medium">Nachricht (optional)</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
          placeholder={
            interest === "org"
              ? "z. B. Zielgruppe, geplante Veranstaltung, gewünschte Materialien…"
              : "z. B. wann du Zeit hast, was du einbringen möchtest…"
          }
        />
      </div>

      {/* Submit */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Wir sind transparent zu Partnern & Infrastruktur (Hosting/CI/CD). Mehr unter <code>/legal/transparency</code>.
        </p>
        <button
          className="btn"
          style={{ background: "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))", color: "white" }}
        >
          Abschicken
        </button>
      </div>
    </form>
  );
}
