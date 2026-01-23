"use client";

import React, { useEffect, useMemo, useState } from "react";

type Supporter = {
  name: string;
  type: "person" | "organisation";
  imageUrl?: string | null;
};

export function SupporterBanner() {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/members/public-supporters", { cache: "no-store" });
        const json = await res.json().catch(() => null);
        if (!mounted) return;
        setSupporters(Array.isArray(json?.supporters) ? json.supporters : []);
      } catch {
        if (!mounted) return;
        setSupporters([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const shown = useMemo(() => supporters.slice(0, 24), [supporters]);

  return (
    <section className="mx-auto mt-12 max-w-6xl px-4">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Unsere Unterstützer
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Danke für euren Rückenwind
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Nur öffentliche Einträge. Namen werden gekürzt.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            {loading ? "lädt…" : `${supporters.length} sichtbar`}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            {loading
              ? "Unterstützer werden geladen."
              : "Noch keine öffentlichen Unterstützer sichtbar."}
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((supporter, index) => (
              <div
                key={`${supporter.name}-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2"
              >
                {supporter.imageUrl ? (
                  <img
                    src={supporter.imageUrl}
                    alt={supporter.name}
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                    {supporter.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {supporter.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    {supporter.type === "organisation" ? "Organisation" : "Person"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
