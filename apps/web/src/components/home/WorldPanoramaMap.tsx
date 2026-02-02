"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import countriesTopo from "world-atlas/countries-110m.json";
import landTopo from "world-atlas/land-110m.json";
import countryList from "world-countries";
import {
  mapOverridesDefault,
  type MapOverrides,
  type MapPoint,
} from "@/config/mapOverrides.default";

type ApiResponse = { ok: boolean; points: MapPoint[] };

type OverridesResponse = { ok: boolean; overrides?: MapOverrides };

type CountryFeature = {
  type: "Feature";
  id?: string | number;
  properties?: { name?: string };
  geometry: any;
};

type CountryRef = { id: string; iso2?: string; name?: string };

type CountryFillMode = {
  code: string;
  mode: "gradient" | "solid";
  from?: string;
  to?: string;
  color?: string;
  intensity: number;
};

const FALLBACK_POINTS: MapPoint[] = [
  { city: "Berlin", country: "DE", lat: 52.52, lng: 13.405, count: 1 },
  { city: "Weimar", country: "DE", lat: 50.98, lng: 11.33, count: 1 },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function normalizeCity(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function buildIso2Map() {
  const map = new Map<string, string>();
  (countryList as any[]).forEach((entry) => {
    const numeric = entry?.ccn3;
    const iso2 = entry?.cca2;
    if (!numeric || !iso2) return;
    map.set(String(numeric).padStart(3, "0"), iso2);
  });
  return map;
}

export function WorldPanoramaMap() {
  const W = 980;
  const H = 420;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number; dragging: boolean } | null>(null);

  const [k, setK] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const [overrides, setOverrides] = useState<MapOverrides>(mapOverridesDefault);
  const [points, setPoints] = useState<MapPoint[]>(FALLBACK_POINTS);
  const [loading, setLoading] = useState(true);

  const iso2Map = useMemo(() => buildIso2Map(), []);

  const topoCountries = useMemo(() => {
    const fc: any = feature(
      countriesTopo as any,
      (countriesTopo as any).objects.countries,
    );
    return (fc.features || []) as CountryFeature[];
  }, []);

  const landFeature = useMemo(() => {
    try {
      const fc: any = feature(landTopo as any, (landTopo as any).objects.land);
      return fc as any;
    } catch {
      return null;
    }
  }, []);

  const projection = useMemo(() => {
    return geoEquirectangular()
      .translate([W / 2, H / 2])
      .scale((W / (2 * Math.PI)) * 0.98);
  }, [W, H]);

  const pathGen = useMemo(() => geoPath(projection as any), [projection]);

  useEffect(() => {
    let active = true;
    fetch("/api/map/overrides", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: OverridesResponse) => {
        if (!active) return;
        if (data?.overrides) {
          setOverrides({
            ...mapOverridesDefault,
            ...data.overrides,
            countryFills: {
              ...mapOverridesDefault.countryFills,
              ...(data.overrides.countryFills ?? {}),
            },
          });
        }
      })
      .catch(() => {
        if (!active) return;
        setOverrides(mapOverridesDefault);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/members/public-locations", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (!active) return;
        setPoints(Array.isArray(data?.points) ? data.points : FALLBACK_POINTS);
      })
      .catch(() => {
        if (!active) return;
        setPoints(FALLBACK_POINTS);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const mergedPoints = useMemo(() => {
    if (overrides.manualPoints?.length) return overrides.manualPoints;
    return points;
  }, [overrides.manualPoints, points]);

  const startCity = normalizeCity(overrides.start?.city || mapOverridesDefault.start.city);

  const pointsProjected = useMemo(() => {
    return mergedPoints
      .map((p) => {
        if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return null;
        const xy = projection([p.lng, p.lat]);
        if (!xy) return null;
        return { ...p, x: xy[0], y: xy[1] };
      })
      .filter(Boolean) as Array<MapPoint & { x: number; y: number }>;
  }, [mergedPoints, projection]);

  const countryRefs = useMemo(() => {
    return topoCountries.map((f) => {
      const numeric = f.id ? String(f.id).padStart(3, "0") : "";
      const iso2 = numeric ? iso2Map.get(numeric) : undefined;
      return { id: String(f.id ?? ""), iso2, name: f.properties?.name } satisfies CountryRef;
    });
  }, [topoCountries, iso2Map]);

  const fillModes = useMemo(() => {
    return Object.entries({
      ...mapOverridesDefault.countryFills,
      ...(overrides.countryFills ?? {}),
    }).map(([code, cfg]) => ({
      code,
      mode: cfg.mode,
      from: cfg.from,
      to: cfg.to,
      color: cfg.color,
      intensity: clamp(cfg.intensity ?? 1, 0, 1),
    }));
  }, [overrides.countryFills]);

  function resetView() {
    setK(1);
    setTx(0);
    setTy(0);
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    const el = svgRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      tx,
      ty,
      dragging: true,
    };
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = dragRef.current;
    if (!d?.dragging) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    setTx(d.tx + dx);
    setTy(d.ty + dy);
  }

  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    const d = dragRef.current;
    if (!d) return;
    d.dragging = false;

    const el = svgRef.current;
    if (el) el.releasePointerCapture(e.pointerId);
  }

  function onWheel(e: React.WheelEvent<SVGSVGElement>) {
    e.preventDefault();

    const el = svgRef.current;
    if (!el) return;

    const delta = -Math.sign(e.deltaY);
    const nextK = clamp(k * (delta > 0 ? 1.12 : 0.9), 1, 6);

    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const my = ((e.clientY - rect.top) / rect.height) * H;

    const scaleFactor = nextK / k;
    setTx((prev) => (prev - mx) * scaleFactor + mx);
    setTy((prev) => (prev - my) * scaleFactor + my);
    setK(nextK);
  }

  const placesCount = mergedPoints.length;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4 px-5 pt-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            WELTKARTE (AGGREGIERT)
          </div>
          <div className="text-xs text-slate-500">
            Start in Deutschland (Berlin). Zoombar, mit Grenzen.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            {loading ? "lädt…" : `${placesCount} Orte`}
          </div>
          <button
            type="button"
            onClick={resetView}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Zurück
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="vog-map-svg h-[260px] w-full select-none rounded-2xl bg-[radial-gradient(1200px_500px_at_50%_10%,rgba(14,165,233,0.08),transparent_60%),linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.00))]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
          role="img"
          aria-label="Weltkarte mit Grenzen und Standorten"
        >
          <defs>
            {fillModes
              .filter((cfg) => cfg.mode === "gradient")
              .map((cfg) => (
                <linearGradient
                  key={cfg.code}
                  id={`vog-${cfg.code.toLowerCase()}-grad`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={cfg.from || "var(--map-de-from)"}
                    stopOpacity={cfg.intensity}
                  />
                  <stop
                    offset="100%"
                    stopColor={cfg.to || "var(--map-de-to)"}
                    stopOpacity={cfg.intensity}
                  />
                </linearGradient>
              ))}
          </defs>

          <g transform={`translate(${tx} ${ty}) scale(${k})`}>
            {topoCountries.map((f, idx) => {
              const ref = countryRefs[idx];
              const iso2 = ref?.iso2;
              const fillCfg = iso2
                ? overrides.countryFills?.[iso2] ?? mapOverridesDefault.countryFills?.[iso2]
                : undefined;

              let fill = "var(--map-base-fill, rgba(15, 23, 42, 0.03))";
              if (fillCfg) {
                if (fillCfg.mode === "solid") {
                  fill = fillCfg.color || "var(--map-focus)";
                } else {
                  fill = `url(#vog-${iso2?.toLowerCase()}-grad)`;
                }
              }

              const d = pathGen(f as any) || "";
              return (
                <path
                  key={`${ref?.id}-${idx}`}
                  d={d}
                  fill={fill}
                  stroke="var(--map-stroke)"
                  strokeWidth="var(--map-stroke-width)"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              );
            })}

            {landFeature && (
              <path
                d={pathGen(landFeature as any) || ""}
                fill="none"
                stroke="var(--map-coast)"
                strokeWidth="var(--map-coast-width)"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {pointsProjected.map((p, idx) => {
              const count = Math.max(1, Math.min(12, Number(p.count || 1)));
              const baseRadius = 3 + Math.log2(count) * 2;
              const isStart = normalizeCity(p.city) === startCity;

              return (
                <g key={`${p.city ?? "x"}-${p.lat}-${p.lng}-${idx}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={baseRadius * (isStart ? 3.2 : 2.2)}
                    fill="rgba(8,145,178,0.18)"
                  />
                  {isStart ? (
                    <polygon
                      points={Array.from({ length: 10 })
                        .map((_, i) => {
                          const outer = baseRadius * 2.2;
                          const inner = baseRadius * 0.95;
                          const angle = i * (Math.PI / 5) - Math.PI / 2;
                          const r = i % 2 === 0 ? outer : inner;
                          const x = p.x + Math.cos(angle) * r;
                          const y = p.y + Math.sin(angle) * r;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                      fill="var(--map-focus)"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth="1.6"
                    />
                  ) : (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={baseRadius}
                      fill="var(--map-marker)"
                      stroke="var(--map-marker-stroke)"
                      strokeWidth="1.8"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        <div className="mt-2 space-y-1 text-xs text-slate-500">
          <p>Wir starten in Deutschland. Berlin als Startpunkt – danach wachsen Chapters bundesweit, EU-weit, weltweit.</p>
          <p>Keine Einzelprofile. Nur aggregierte Länder-/Ort-Summen.</p>
        </div>
      </div>
    </div>
  );
}
