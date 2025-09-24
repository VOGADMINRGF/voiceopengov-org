"use client";
import { useMemo, useState } from "react";

export type Country = { code: string; name: string };

// ISO 3166-1 alpha-2 (gekürzt; erweiterbar)
const COUNTRY_CODES = ["DE","AT","CH","FR","IT","ES","PT","NL","BE","LU","DK","SE","NO","FI","IE","GB","US","CA","MX"];

function getCountries(locale: string): Country[] {
  const dn = new Intl.DisplayNames([locale], { type: "region" });
  return COUNTRY_CODES.map((code) => ({ code, name: dn.of(code) || code }));
}

export default function CountryCombobox({
  locale = "de",
  onSelect
}: {
  locale?: string;
  onSelect: (c: Country) => void;
}) {
  const [q, setQ] = useState("");
  const COUNTRIES = useMemo(() => getCountries(locale), [locale]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(s) || c.code.toLowerCase().includes(s)
    );
  }, [q, COUNTRIES]);

  return (
    <div className="w-full">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Land suchen…"
        className="w-full rounded-xl border border-slate-300 px-3 py-2"
      />
      <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-slate-200">
        {filtered.slice(0, 50).map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => onSelect(c)}
            className="w-full text-left px-3 py-2 hover:bg-slate-50"
          >
            {c.name} ({c.code})
          </button>
        ))}
      </div>
    </div>
  );
}
