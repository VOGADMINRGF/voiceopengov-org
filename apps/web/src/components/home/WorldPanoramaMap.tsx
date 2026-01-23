"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import countriesTopo from "world-atlas/countries-110m.json";

type CountryFeature = {
  type: "Feature";
  id?: string | number;
  properties?: { name?: string };
  geometry: any;
};

type CountryHit = { country: string; count: number };
type CityPoint = { city: string; lat: number; lng: number; count: number };

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function WorldPanoramaMap() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [countryHits, setCountryHits] = useState<CountryHit[]>([]);
  const [points, setPoints] = useState<CityPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Responsive sizing (2:1 feel, but adapt to container)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = Math.max(220, Math.round(w * 0.42)); // panorama-ish, mobile friendly
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
        // radius subtle (count scaled)
        const r = Math.min(10, 4 + Math.log10(Math.max(1, p.count)) * 3);
        return { ...p, x: xy[0], y: xy[1], r };
      })
      .filter(Boolean) as Array<CityPoint & { x: number; y: number; r: number }>;
  }, [projection, points]);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-600">
            WELTKARTE (AGGREGIERT)
          </div>
          <div className="text-xs text-slate-500">
            Schnell, mobilfreundlich - Laender & Orte als Summen.
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {loading ? "laedt..." : `${cityCircles.length} Orte`}
        </div>
      </div>

      <div ref={wrapRef} className="w-full">
        <div className="overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-slate-100">
          <svg width={w || "100%"} height={h || 260} viewBox={`0 0 ${w || 800} ${h || 260}`}>
            {/* Skeleton */}
            {!pathGen ? (
              <rect x="0" y="0" width="100%" height="100%" fill="rgba(15,23,42,0.06)" />
            ) : (
              <>
                {/* Countries */}
                <g>
                  {topoCountries.map((f, i) => {
                    const name = f.properties?.name || "";
                    const k = norm(name);
                    const c = hitMap.get(k) || 0;

                    // CI look: subtle base fill, stronger for hits
                    const baseFill = "rgba(2, 132, 199, 0.08)"; // cyan-ish tint
                    const hitFill = c > 0 ? "rgba(8, 145, 178, 0.28)" : baseFill;
                    const stroke = "rgba(15, 23, 42, 0.14)";

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

                {/* City markers */}
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
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-500">
        Keine Einzelprofile. Nur aggregierte Laender-/Orts-Summen.
      </div>
    </div>
  );
}
