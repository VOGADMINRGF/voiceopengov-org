"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import countriesTopo from "world-atlas/countries-110m.json";
import { useSvgZoom } from "@/components/home/useSvgZoom";

type CountryFeature = {
  type: "Feature";
  id?: string | number;
  properties?: { name?: string };
  geometry: any;
};

type CountryHit = { country: string; count: number };
type CityPoint = { city: string; lat: number; lng: number; count: number };

type FocusMarker = { name: string; lat: number; lng: number };

const FOCUS_MARKERS: FocusMarker[] = [
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Weimar", lat: 50.98, lng: 11.33 },
];

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function WorldPanoramaMap() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [countryHits, setCountryHits] = useState<CountryHit[]>([]);
  const [points, setPoints] = useState<CityPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { svgRef, transform, reset } = useSvgZoom({ minZoom: 1, maxZoom: 6 });

  // Responsive sizing (2:1 feel, but adapt to container)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = Math.max(240, Math.round(w * 0.5));
      setSize({ w, h });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fetch data: countries aggregate + city points
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [cRes, pRes] = await Promise.all([
          fetch("/api/members/public-countries", { cache: "no-store" }),
          fetch("/api/members/public-locations", { cache: "no-store" }),
        ]);
        const cj = await cRes.json().catch(() => null);
        const pj = await pRes.json().catch(() => null);
        if (!mounted) return;
        setCountryHits(Array.isArray(cj?.countries) ? cj.countries : []);
        setPoints(Array.isArray(pj?.points) ? pj.points : []);
      } catch {
        if (mounted) {
          setCountryHits([]);
          setPoints([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const topoCountries = useMemo(() => {
    const fc: any = feature(
      countriesTopo as any,
      (countriesTopo as any).objects.countries,
    );
    return (fc.features || []) as CountryFeature[];
  }, []);

  // Map: countryName -> count
  const hitMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const h of countryHits) {
      m.set(norm(h.country), (m.get(norm(h.country)) || 0) + Number(h.count || 0));
    }
    return m;
  }, [countryHits]);

  const { w, h } = size;
  const projection = useMemo(() => {
    if (!w || !h) return null;
    return geoNaturalEarth1().fitSize(
      [w, h],
      { type: "FeatureCollection", features: topoCountries } as any,
    );
  }, [w, h, topoCountries]);

  const pathGen = useMemo(() => {
    if (!projection) return null;
    return geoPath(projection);
  }, [projection]);

  const cityCircles = useMemo(() => {
    if (!projection) return [];
    return points
      .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
      .map((p) => {
        const xy = projection([p.lng, p.lat]) as [number, number] | null;
        if (!xy) return null;
        const r = Math.min(10, 4 + Math.log10(Math.max(1, p.count)) * 3);
        return { ...p, x: xy[0], y: xy[1], r };
      })
      .filter(Boolean) as Array<CityPoint & { x: number; y: number; r: number }>;
  }, [projection, points]);

  const focusPoints = useMemo(() => {
    if (!projection) return [];
    return FOCUS_MARKERS.map((m) => {
      const xy = projection([m.lng, m.lat]) as [number, number] | null;
      if (!xy) return null;
      return { ...m, x: xy[0], y: xy[1] };
    }).filter(Boolean) as Array<FocusMarker & { x: number; y: number }>;
  }, [projection]);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-600">
            WELTKARTE (SATELLIT)
          </div>
          <div className="text-xs text-slate-500">
            Zoombar, aggregiert, mobilfreundlich.
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {loading ? "lädt…" : `${cityCircles.length} Orte`}
        </div>
      </div>

      <div ref={wrapRef} className="w-full">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-slate-100">
          <button
            type="button"
            onClick={reset}
            className="absolute right-3 top-3 z-10 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-600 shadow hover:border-sky-300 hover:text-sky-700"
          >
            Zurück
          </button>
          <svg
            ref={svgRef}
            width={w || "100%"}
            height={h || 280}
            viewBox={`0 0 ${w || 800} ${h || 280}`}
            className="touch-none"
          >
            {!pathGen ? (
              <rect x="0" y="0" width="100%" height="100%" fill="rgba(15,23,42,0.06)" />
            ) : (
              <>
                <image
                  href="/media/earth_satellite.jpg"
                  x="0"
                  y="0"
                  width={w || 800}
                  height={h || 280}
                  preserveAspectRatio="xMidYMid slice"
                  opacity={0.6}
                />
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="rgba(2, 132, 199, 0.08)"
                />
                <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
                  <g>
                    {topoCountries.map((f, i) => {
                      const name = f.properties?.name || "";
                      const k = norm(name);
                      const c = hitMap.get(k) || 0;

                      const baseFill = "rgba(2, 132, 199, 0.12)";
                      const hitFill = c > 0 ? "rgba(8, 145, 178, 0.32)" : baseFill;
                      const stroke = "rgba(15, 23, 42, 0.18)";

                      const d = pathGen(f as any) || "";
                      return (
                        <path
                          key={`${name}-${i}`}
                          d={d}
                          fill={hitFill}
                          stroke={stroke}
                          strokeWidth={0.7}
                        >
                          <title>{c > 0 ? `${name}: ${c}` : name}</title>
                        </path>
                      );
                    })}
                  </g>

                  <g>
                    {cityCircles.map((p) => (
                      <circle
                        key={`${p.city}-${p.lat}-${p.lng}`}
                        cx={p.x}
                        cy={p.y}
                        r={p.r}
                        fill="rgba(8, 145, 178, 0.75)"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth={2}
                      >
                        <title>{`${p.city}: ${p.count}`}</title>
                      </circle>
                    ))}
                  </g>

                  <g>
                    {focusPoints.map((p) => (
                      <circle
                        key={p.name}
                        cx={p.x}
                        cy={p.y}
                        r={6}
                        fill="rgba(14, 165, 233, 0.9)"
                        stroke="rgba(255,255,255,0.95)"
                        strokeWidth={2}
                      >
                        <title>{p.name}</title>
                      </circle>
                    ))}
                  </g>
                </g>
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-500">
        Keine Einzelprofile. Nur Länder- und Orts-Summen.
      </div>
    </div>
  );
}
