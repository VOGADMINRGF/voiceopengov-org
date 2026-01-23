"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import { geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import countriesTopo from "world-atlas/countries-110m.json";

type CountryFeature = {
  type: "Feature";
  id?: string | number;
  properties?: { name?: string };
  geometry: any;
};

type Marker = { name: string; lat: number; lng: number };

const MARKERS: Marker[] = [
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Weimar", lat: 50.98, lng: 11.33 },
];

export function WorldMiniGlobe() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ dragging: boolean; x: number; y: number }>({
    dragging: false,
    x: 0,
    y: 0,
  });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [rotation, setRotation] = useState<[number, number]>([-10, -50]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = Math.max(240, Math.min(420, Math.round(w * 0.9)));
      setSize({ w, h });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const topoCountries = useMemo(() => {
    const fc: any = feature(
      countriesTopo as any,
      (countriesTopo as any).objects.countries,
    );
    return (fc.features || []) as CountryFeature[];
  }, []);

  const { w, h } = size;
  const projection = useMemo(() => {
    if (!w || !h) return null;
    const scale = Math.min(w, h) * 0.45;
    return geoOrthographic()
      .translate([w / 2, h / 2])
      .scale(scale)
      .clipAngle(90)
      .rotate([rotation[0], rotation[1]]);
  }, [w, h, rotation]);

  const pathGen = useMemo(() => {
    if (!projection) return null;
    return geoPath(projection);
  }, [projection]);

  const markerPoints = useMemo(() => {
    if (!projection) return [] as Array<Marker & { x: number; y: number }>;
    return MARKERS.map((m) => {
      const xy = projection([m.lng, m.lat]) as [number, number] | null;
      return xy ? { ...m, x: xy[0], y: xy[1] } : null;
    }).filter(Boolean) as Array<Marker & { x: number; y: number }>;
  }, [projection]);

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    dragRef.current = { dragging: true, x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current.dragging) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;

    setRotation((prev) => {
      const next: [number, number] = [prev[0] + dx * 0.25, prev[1] - dy * 0.25];
      next[1] = Math.max(-85, Math.min(85, next[1]));
      return next;
    });
  };

  const handlePointerUp = () => {
    dragRef.current.dragging = false;
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-600">GLOBUS</div>
          <div className="text-xs text-slate-500">
            Berlin & Weimar als interaktive Marker.
          </div>
        </div>
        <div className="text-xs text-slate-500">drag: drehen</div>
      </div>

      <div ref={wrapRef} className="w-full">
        <div className="overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-slate-100">
          <svg
            width={w || "100%"}
            height={h || 320}
            viewBox={`0 0 ${w || 360} ${h || 320}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="touch-none"
          >
            {!pathGen ? (
              <rect x="0" y="0" width="100%" height="100%" fill="rgba(15,23,42,0.06)" />
            ) : (
              <>
                <path
                  d={pathGen({ type: "Sphere" } as any) || ""}
                  fill="rgba(2, 132, 199, 0.06)"
                  stroke="rgba(15, 23, 42, 0.15)"
                  strokeWidth={1}
                />
                <path
                  d={pathGen(geoGraticule10() as any) || ""}
                  fill="none"
                  stroke="rgba(15, 23, 42, 0.08)"
                  strokeWidth={0.6}
                />
                <g>
                  {topoCountries.map((f, i) => {
                    const d = pathGen(f as any) || "";
                    return (
                      <path
                        key={`land-${i}`}
                        d={d}
                        fill="rgba(8, 145, 178, 0.2)"
                        stroke="rgba(15, 23, 42, 0.12)"
                        strokeWidth={0.6}
                      />
                    );
                  })}
                </g>
                <g>
                  {markerPoints.map((m) => (
                    <circle
                      key={m.name}
                      cx={m.x}
                      cy={m.y}
                      r={5}
                      fill="rgba(8, 145, 178, 0.9)"
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth={2}
                    >
                      <title>{m.name}</title>
                    </circle>
                  ))}
                </g>
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-500">
        Ziehen zum Drehen. Marker zeigen aktuelle Standorte.
      </div>
    </div>
  );
}
