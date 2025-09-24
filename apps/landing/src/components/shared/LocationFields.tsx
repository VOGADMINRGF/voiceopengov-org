"use client";

import { useMemo } from "react";
import { getCountries } from "@/libs/countries";

type Props = {
  locale: string;
  countryCode: string; setCountryCode: (v: string) => void;
  postal: string;      setPostal: (v: string) => void;
  city: string;        setCity: (v: string) => void;
};

export default function LocationFields({
  locale, countryCode, setCountryCode, postal, setPostal, city, setCity
}: Props) {
  const COUNTRIES = useMemo(() => getCountries(locale), [locale]);

  return (
    <div className="grid gap-4">
      <label className="block text-sm font-medium text-slate-700">
        Land
        <select
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          PLZ
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
            placeholder="z. B. 10115"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Ort
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="z. B. Berlin"
          />
        </label>
      </div>
    </div>
  );
}
