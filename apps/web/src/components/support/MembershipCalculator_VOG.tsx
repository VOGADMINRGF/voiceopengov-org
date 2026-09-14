"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/context/LocaleContext";

type CalculatorStrings = {
  label: string;
  title: string;
  body: string;
  lockedTitle: string;
  lockedBody: string;
  lockedCta: string;
  net: string;
  rent: string;
  household: string;
  interval: string;
  monthly: string;
  once: string;
  presets: string;
  suggestion: string;
  perPerson: string;
  total: string;
  note: string;
  peopleTitle: string;
  peopleHint: string;
  personLabel: string;
  personName: string;
  personEmail: string;
  mailListLabel: string;
  mailListHint: string;
};

const MIN_SUGGESTION = 4.99;
const PRESETS = [4.99, 15, 25, 50];

function parseAmount(value: string) {
  if (!value) return null;
  const normalized = value.replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function clampHousehold(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

export function MembershipCalculator_VOG({
  strings,
  canOpen = true,
  onRequestEmail,
}: {
  strings: CalculatorStrings;
  canOpen?: boolean;
  onRequestEmail?: () => void;
}) {
  const { locale } = useLocale();
  const [people, setPeople] = useState<Array<{ name: string; email: string }>>([
    { name: "", email: "" },
  ]);
  const [net, setNet] = useState("");
  const [rent, setRent] = useState("");
  const [household, setHousehold] = useState("1");
  const [interval, setInterval] = useState<"monthly" | "once">("monthly");
  const [amount, setAmount] = useState("");

  const netValue = parseAmount(net) ?? 0;
  const rentValue = parseAmount(rent) ?? 0;
  const householdValue = clampHousehold(household);
  const isLocked = !canOpen;

  const suggestion = useMemo(() => {
    const base = Math.max(0, netValue - rentValue);
    const raw = base * 0.01;
    return Math.max(MIN_SUGGESTION, raw);
  }, [netValue, rentValue]);

  const amountValue = parseAmount(amount) ?? suggestion;
  const totalValue = amountValue * householdValue;

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(locale || "de", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  useEffect(() => {
    setPeople((prev) => {
      const next = [...prev];
      if (householdValue > next.length) {
        for (let i = next.length; i < householdValue; i += 1) {
          next.push({ name: "", email: "" });
        }
      }
      if (householdValue < next.length) {
        next.length = householdValue;
      }
      return next;
    });
  }, [householdValue]);

  if (isLocked) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {strings.label}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-100">{strings.lockedTitle}</h2>
        <p className="mt-2 text-sm text-slate-300">{strings.lockedBody}</p>
        <button
          type="button"
          className="btn btn-primary mt-4"
          onClick={() => onRequestEmail?.()}
        >
          {strings.lockedCta}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {strings.label}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-100">{strings.title}</h2>
      <p className="mt-2 text-sm text-slate-300">{strings.body}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs font-medium text-slate-300">
              <span>{strings.net}</span>
              <input
                value={net}
                onChange={(e) => setNet(e.target.value)}
                inputMode="decimal"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-800/40"
                placeholder="0,00"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-300">
              <span>{strings.rent}</span>
              <input
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                inputMode="decimal"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-800/40"
                placeholder="0,00"
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs font-medium text-slate-300">
              <span>{strings.household}</span>
              <input
                value={household}
                onChange={(e) => setHousehold(e.target.value)}
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-800/40"
                min={1}
              />
            </label>

            <label className="space-y-1 text-xs font-medium text-slate-300">
              <span>{strings.interval}</span>
              <div className="inline-flex w-full rounded-full border border-slate-700 bg-slate-950/60 p-1 text-xs font-semibold text-slate-300">
                {(["monthly", "once"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setInterval(value)}
                    className={`rounded-full px-3 py-1 ${
                      interval === value ? "bg-sky-600 text-white" : "hover:bg-slate-900"
                    }`}
                  >
                    {value === "monthly" ? strings.monthly : strings.once}
                  </button>
                ))}
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-300">{strings.presets}</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toFixed(2))}
                  className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:border-sky-300 hover:text-sky-200"
                >
                  {formatMoney(preset)}
                </button>
              ))}
            </div>
          </div>

          <label className="space-y-1 text-xs font-medium text-slate-300">
            <span>{strings.perPerson}</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-800/40"
              placeholder={formatMoney(suggestion)}
            />
          </label>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-300">{strings.peopleTitle}</p>
            <p className="text-xs text-slate-400">{strings.peopleHint}</p>
            <div className="space-y-3">
              {people.map((person, index) => (
                <div key={`${index}-${householdValue}`} className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-1 text-xs font-medium text-slate-300">
                    <span>
                      {strings.personName}{" "}
                      <span className="text-slate-400">
                        {strings.personLabel.replace("{n}", String(index + 1))}
                      </span>
                    </span>
                    <input
                      value={person.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPeople((prev) => {
                          const next = [...prev];
                          next[index] = { ...next[index], name: value };
                          return next;
                        });
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-800/40"
                      placeholder={strings.personName}
                    />
                  </label>
                  <label className="space-y-1 text-xs font-medium text-slate-300">
                    <span>{strings.personEmail}</span>
                    <input
                      value={person.email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPeople((prev) => {
                          const next = [...prev];
                          next[index] = { ...next[index], email: value };
                          return next;
                        });
                      }}
                      type="email"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-800/40"
                      placeholder="name@email.com"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs font-medium text-slate-300">{strings.mailListLabel}</p>
            <p className="text-xs text-slate-400">{strings.mailListHint}</p>
            <textarea
              readOnly
              className="w-full min-h-[120px] rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 outline-none"
              value={people
                .map((person, index) => {
                  const name =
                    person.name.trim() ||
                    strings.personLabel.replace("{n}", String(index + 1));
                  const email = person.email.trim() || "—";
                  return `${index + 1}. ${name} <${email}> — ${formatMoney(
                    amountValue,
                  )} · ${interval === "monthly" ? strings.monthly : strings.once}`;
                })
                .join("\n")}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {strings.suggestion}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-100">
                {formatMoney(suggestion)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {strings.total}
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">
                {formatMoney(totalValue)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {strings.perPerson} · {interval === "monthly" ? strings.monthly : strings.once}
              </p>
            </div>
            <p className="text-xs text-slate-400">{strings.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { CalculatorStrings };
