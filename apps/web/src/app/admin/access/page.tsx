"use client";

import { useEffect, useMemo, useState } from "react";
import type { AccessGroup, RoutePolicy } from "@features/access/types";

type RouteRow = RoutePolicy & { overrides: number };

const ACCESS_GROUP_OPTIONS: AccessGroup[] = [
  "public",
  "citizenBasic",
  "citizenPremium",
  "institutionBasic",
  "institutionPremium",
  "staff",
  "admin",
  "creator",
];

export default function AccessCenterPage() {
  const [routes, setRoutes] = useState<RouteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/access/routes", { cache: "no-store" });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || res.statusText);
        if (!ignore) setRoutes(body.routes ?? []);
      } catch (err: any) {
        if (!ignore) setError(err?.message ?? "Konnte Route-Policies nicht laden.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredRoutes = useMemo(() => {
    const base = [...routes].sort((a, b) => a.label.localeCompare(b.label));
    const normalized = query.trim().toLowerCase();
    if (!normalized) return base;
    const terms = normalized.split(/\s+/).filter(Boolean);

    return base.filter((route) => {
      const haystack = [
        route.label,
        route.routeId,
        route.pathPattern,
        route.defaultGroups.join(" "),
        route.allowAnonymous ? "öffentlich" : "privat",
        String(route.overrides ?? 0),
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [routes, query]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredRoutes.length / pageSize));
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);
  const pageRoutes = filteredRoutes.slice((page - 1) * pageSize, page * pageSize);

  const updatePolicy = async (routeId: string, patch: Partial<RoutePolicy>) => {
    const res = await fetch(`/api/admin/access/routes/${routeId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || res.statusText);
    setRoutes((prev) =>
      prev.map((route) => (route.routeId === routeId ? { ...route, ...body.policy } : route)),
    );
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Access Center</p>
          <h1 className="text-2xl font-bold text-slate-900">Seitenzugriffe verwalten</h1>
          <p className="text-sm text-slate-600">
            Definiere, welche Gruppen und Nutzer einzelne Seiten sehen dürfen. Änderungen wirken sofort.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4 text-slate-400"
          >
            <path
              d="m14.5 14.5 3 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="9" cy="9" r="5.6" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <input
            aria-label="Routen durchsuchen"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen (Route, Pfad, Gruppe, Status)"
            className="w-64 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </header>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{filteredRoutes.length} Seitenregeln</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 disabled:opacity-50"
            >
              Zurück
            </button>
            <span>
              Seite {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 disabled:opacity-50"
            >
              Weiter
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Pfad</th>
              <th className="px-4 py-3">Gruppen</th>
              <th className="px-4 py-3">Anonym</th>
              <th className="px-4 py-3">Overrides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Lädt …
                </td>
              </tr>
            ) : filteredRoutes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Keine Treffer für „{query}“.
                </td>
              </tr>
            ) : (
              pageRoutes.map((route) => (
                <tr key={route.routeId}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{route.label}</div>
                    <div className="text-xs text-slate-500">{route.routeId}</div>
                    {route.locked && (
                      <span className="mt-1 inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-700">
                        locked
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>{route.pathPattern}</span>
                      <a
                        className="text-[11px] font-semibold text-sky-700 underline-offset-2 hover:underline"
                        href={route.pathPattern.replace(/:.*$/, "") || "/"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        öffnen
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {ACCESS_GROUP_OPTIONS.map((group) => (
                        <label key={group} className="inline-flex items-center gap-1">
                          <input
                            type="checkbox"
                            disabled={route.locked}
                            checked={route.defaultGroups.includes(group)}
                            onChange={async () => {
                              try {
                                const nextGroups = route.defaultGroups.includes(group)
                                  ? route.defaultGroups.filter((g) => g !== group)
                                  : [...route.defaultGroups, group];
                                await updatePolicy(route.routeId, {
                                  defaultGroups: nextGroups,
                                  allowAnonymous: route.allowAnonymous,
                                });
                              } catch (err: any) {
                                setError(err?.message ?? "Aktualisierung fehlgeschlagen");
                              }
                            }}
                          />
                          {group}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        disabled={route.locked}
                        checked={route.allowAnonymous}
                        onChange={async () => {
                          try {
                            await updatePolicy(route.routeId, {
                              defaultGroups: route.defaultGroups,
                              allowAnonymous: !route.allowAnonymous,
                            });
                          } catch (err: any) {
                            setError(err?.message ?? "Aktualisierung fehlgeschlagen");
                          }
                        }}
                      />
                      öffentlich
                    </label>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {route.overrides}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
