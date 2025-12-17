"use client";

import * as React from "react";

export type VoteValue = "pro" | "neutral" | "contra" | null;

type Props = {
  value: VoteValue;
  onChange: (next: VoteValue) => void;
  size?: "sm" | "md";
};

const OPTS = [
  {
    id: "pro" as const,
    label: "Zustimmen",
    icon: "👍",
    activeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm",
  },
  {
    id: "neutral" as const,
    label: "Neutral",
    icon: "🙂",
    activeClass:
      "border-sky-200 bg-sky-50 text-sky-800 shadow-sm",
  },
  {
    id: "contra" as const,
    label: "Ablehnen",
    icon: "👎",
    activeClass:
      "border-rose-200 bg-rose-50 text-rose-800 shadow-sm",
  },
];

export default function VogVoteButtons({ value, onChange, size = "md" }: Props) {
  const [flash, setFlash] = React.useState<Exclude<VoteValue, null>>(value ?? "pro");
  const [showFlash, setShowFlash] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2 text-sm";

  const click = (next: Exclude<VoteValue, null>) => {
    onChange(value === next ? null : next);
    setFlash(next);
    setShowFlash(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setShowFlash(false), 800);
  };

  return (
    <div className="relative inline-flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Bewertung">
      {showFlash ? (
        <div className="pointer-events-none absolute -top-6 left-0 right-0 flex justify-center">
          <div className="rounded-full bg-white/90 px-3 py-1 text-sm shadow-sm">
            {OPTS.find((o) => o.id === flash)?.icon}{" "}
            <span className="text-[11px] font-semibold text-slate-700">
              {OPTS.find((o) => o.id === flash)?.label}
            </span>
          </div>
        </div>
      ) : null}

      {OPTS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => click(opt.id)}
            role="radio"
            aria-checked={active}
            className={[
              "relative inline-flex items-center gap-2 rounded-full border font-semibold transition",
              "focus:outline-none focus:ring-2 focus:ring-sky-200",
              sizeClasses,
              active
                ? opt.activeClass
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs">
              {opt.icon}
            </span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
