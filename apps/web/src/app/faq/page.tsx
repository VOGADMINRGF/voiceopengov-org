"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getFaqTabs } from "./strings";

function FAQTabs() {
  const { locale } = useLocale();
  const faqTabs = getFaqTabs(locale);
  const [tab, setTab] = useState(0);
  return (
    <section className="mb-10">
      <div className="flex gap-2 justify-center mb-4 flex-wrap">
        {faqTabs.map((item, idx) => (
          <button
            key={item.label}
            onClick={() => setTab(idx)}
            className={`px-4 py-2 rounded-full font-semibold
              ${tab === idx ? "bg-coral text-white shadow" : "bg-gray-50 text-coral border border-coral"}
              transition`}
            style={{ minWidth: 170 }}
            aria-selected={tab === idx}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow border border-coral text-gray-800 min-h-[80px]">
        <p>{faqTabs[tab].body}</p>
      </div>
    </section>
  );
}

export default function FAQPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">FAQ</p>
        <h1 className="text-3xl font-bold text-slate-900">Häufig gestellte Fragen</h1>
        <p className="text-sm text-slate-600">
          Hier beantworten wir die wichtigsten Fragen rund um VoiceOpenGov und den Evidence/Vote-Stack.
        </p>
      </header>
      <FAQTabs />
    </main>
  );
}
