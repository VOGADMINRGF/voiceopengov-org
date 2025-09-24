"use client";

import { useState } from "react";
type Tab = "overview" | "example";

export default function EvidenceGraphExplainer({
  className = "",
  compact = false,
}: { className?: string; compact?: boolean }) {
  const [tab, setTab] = useState<Tab>("overview");

  // CSS-Var helper
  const fill = (cssVar: string, fallback: string) => `var(${cssVar}, ${fallback})`;

  // Rechteck für Knoten
  const NodeRect = ({
    x,
    y,
    w,
    h,
    label,
    colorVar,
    fallback,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    colorVar: string;
    fallback: string;
  }) => (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        ry="12"
        fill={fill(colorVar, fallback)}
        opacity="0.9"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize="11"
        fill="#fff"
        style={{ fontWeight: 700 }}
      >
        {label}
      </text>
    </>
  );

  // Pfeil
  const Arrow = ({ d }: { d: string }) => (
    <path
      d={d}
      fill="none"
      stroke="var(--edge, rgba(15,23,42,.5))"
      strokeWidth="2"
      markerEnd="url(#arrow)"
    />
  );

  // SVG-Übersicht
  function SvgOverview() {
    return (
      <svg viewBox="0 0 720 250" role="img" aria-label="Überblick Evidenz-Flow" className="w-full h-auto">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--edge, rgba(15,23,42,.5))" />
          </marker>
        </defs>

        {/* Schritt-Labels */}
        <text x="70" y="28" fontSize="12" fill="#334155">
          1 · Aussage
        </text>
        <text x="240" y="28" fontSize="12" fill="#334155">
          2 · Belege sammeln
        </text>
        <text x="430" y="28" fontSize="12" fill="#334155">
          3 · Gegenposition prüfen
        </text>
        <text x="600" y="28" fontSize="12" fill="#334155">
          4 · Entscheidung
        </text>

        {/* Nodes */}
        <NodeRect x={40} y={70} w={130} h={50} label="Aussage" colorVar="--node-claim" fallback="#2563eb" />
        <NodeRect x={230} y={55} w={150} h={40} label="Beleg A" colorVar="--node-evidence" fallback="#10b981" />
        <NodeRect x={230} y={115} w={150} h={40} label="Beleg B" colorVar="--node-evidence" fallback="#10b981" />
        <NodeRect x={430} y={85} w={160} h={50} label="Gegenposition" colorVar="--node-counter" fallback="#f59e0b" />
        <NodeRect x={600} y={85} w={80} h={50} label="Entscheid" colorVar="--node-decision" fallback="#6d28d9" />

        {/* Flows */}
        <Arrow d="M170,95 C200,95 205,75 230,75" />
        <Arrow d="M170,95 C200,95 205,135 230,135" />
        <Arrow d="M380,75 C405,75 410,110 430,110" />
        <Arrow d="M380,135 C405,135 410,120 430,110" />
        <Arrow d="M590,110 C595,110 598,110 600,110" />
      </svg>
    );
  }

  // SVG-Beispiel
  function SvgExample() {
    return (
      <svg viewBox="0 0 720 260" role="img" aria-label="Beispiel Schulweg – Evidenz-Flow" className="w-full h-auto">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--edge, rgba(15,23,42,.5))" />
          </marker>
        </defs>

        <NodeRect x={40} y={85} w={150} h={50} label="Tempo 30 (Schule)" colorVar="--node-claim" fallback="#2563eb" />
        <NodeRect x={240} y={55} w={160} h={40} label="Unfalldaten 3 Jahre" colorVar="--node-evidence" fallback="#10b981" />
        <NodeRect x={240} y={105} w={160} h={40} label="800 Schüler:innen" colorVar="--node-evidence" fallback="#10b981" />
        <NodeRect x={240} y={155} w={160} h={40} label="Lärmkarte/WHO" colorVar="--node-evidence" fallback="#10b981" />
        <NodeRect x={440} y={95} w={160} h={50} label="Pendler-Stau (Gegen)" colorVar="--node-counter" fallback="#f59e0b" />
        <NodeRect x={630} y={95} w={80} h={50} label="Beschluss" colorVar="--node-decision" fallback="#6d28d9" />

        <Arrow d="M190,110 C210,110 220,75 240,75" />
        <Arrow d="M190,110 C210,110 220,125 240,125" />
        <Arrow d="M190,110 C210,110 220,175 240,175" />
        <Arrow d="M400,75 C420,75 425,115 440,120" />
        <Arrow d="M400,125 C420,125 425,120 440,120" />
        <Arrow d="M400,175 C420,175 425,125 440,120" />
        <Arrow d="M600,120 C610,120 618,120 630,120" />

        <text x="40" y="40" fontSize="12" fill="#334155">
          Beispiel: „Ganztägig Tempo 30 vor der Schule.“
        </text>
      </svg>
    );
  }

  // Legende-Daten
  const legendItems = [
    { label: "Aussagen", colorVar: "--node-claim", fallback: "#2563eb" },
    { label: "Belege", colorVar: "--node-evidence", fallback: "#10b981" },
    { label: "Gegenbelege", colorVar: "--node-counter", fallback: "#f59e0b" },
    { label: "Entscheidung", colorVar: "--node-decision", fallback: "#6d28d9" },
  ];

  return (
    <div className={`card ${className}`}>
      {/* Titel & Beschreibung */}
      <h3 className="text-lg font-semibold mb-2">Evidenz-Graph – so liest du ihn</h3>
      <p className="mb-3 text-slate-700 text-sm">
        Aussagen werden mit Belegen gestützt, Gegenbelege zeigen Grenzen. Daraus entsteht eine begründete Entscheidung.
        Pfeile zeigen, worauf sich etwas stützt; jede Kante verweist auf eine Quelle.
      </p>

      {/* Legende */}
      {!compact && (
        <div className="flex flex-wrap gap-4 items-center mb-4 text-xs">
          {legendItems.map((it, idx) => (
            <span key={idx} className="inline-flex items-center gap-1">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: fill(it.colorVar, it.fallback) }}
                aria-hidden="true"
              ></span>
              <span>{it.label}</span>
            </span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-3" role="tablist" aria-label="Evidence-Ansicht wählen">
        {[
          { id: "overview", label: "Überblick" },
          { id: "example", label: "Beispiel" },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`badge ${tab === t.id ? "ring-1 ring-slate-300" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Zeichnung */}
      <div className="rounded-xl border bg-white/70 p-3">
        {tab === "overview" && <SvgOverview />}
        {tab === "example" && <SvgExample />}
      </div>

      {/* Provenance-Hinweis */}
      {!compact && (
        <p className="mt-2 text-xs text-slate-600">
          Jede Verbindung hat <em>Provenance</em> (Wer? Wann? Kontext? Qualität?). Das macht Entscheidungen{" "}
          <strong>reproduzierbar</strong> und <strong>journalismus-tauglich</strong>.
        </p>
      )}
    </div>
  );
}
