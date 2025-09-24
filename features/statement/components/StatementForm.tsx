// VPM25/features/statement/components/StatementForm.tsx
"use client";

import React, { useState } from "react";

export interface StatementDraft {
  category: string;
  region: string;
  statement: string;
  alternative?: string;
}

export default function StatementForm({
  statement,
  onSubmit,
  onCancel,
}: {
  statement?: Partial<StatementDraft>;
  onSubmit: (data: StatementDraft) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<StatementDraft>({
    category: statement?.category ?? "",
    region: statement?.region ?? "",
    statement: statement?.statement ?? "",
    alternative: statement?.alternative ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof StatementDraft>(k: K, v: StatementDraft[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.category || !form.region || !form.statement) {
      setError("Bitte Kategorie, Region und Statement ausfüllen.");
      return;
    }
    try {
      setSaving(true);
      await onSubmit({
        category: form.category.trim(),
        region: form.region.trim(),
        statement: form.statement.trim(),
        alternative: form.alternative?.trim() || "",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 text-gray-700">Kategorie *</div>
          <input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="z. B. Verkehr, Bildung…"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 text-gray-700">Region *</div>
          <input
            value={form.region}
            onChange={(e) => set("region", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="z. B. DE-BE-11000000"
          />
        </label>
      </div>

      <label className="text-sm block">
        <div className="mb-1 text-gray-700">Statement *</div>
        <textarea
          value={form.statement}
          onChange={(e) => set("statement", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
          placeholder="Formuliere dein Anliegen…"
        />
      </label>

      <label className="text-sm block">
        <div className="mb-1 text-gray-700">Alternative (optional)</div>
        <input
          value={form.alternative}
          onChange={(e) => set("alternative", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Vorschlag / Kompromiss"
        />
      </label>

      {error && <div className="text-sm text-rose-600">{error}</div>}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Speichere…" : "Speichern"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
