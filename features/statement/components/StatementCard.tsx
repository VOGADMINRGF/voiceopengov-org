// features/statement/components/StatementCard.tsx
"use client";

import { formatEditorialStatus } from "@/lib/editorial/status";

type Perspective = {
  text: string;
  stance: "pro" | "contra" | "alternative";
  scenarioType?: "fallback" | "best_case" | "worst_case" | "compromise" | "baseline" | string | null;
  valueTags?: string[] | null;
  keyArguments?: string[] | null;
  condition?: string | null;
};

type StatementRecord = {
  core: {
    text: string;
    responsibility?: string | null;
    topicKanonId?: string | null;
    reviewStatus?: string | null;
  };
  evidence: Array<{
    id: string;
    sourceType: string;
    status?: string | null;
    baseCountry?: string | null;
    compareCountry?: string | null;
    tradeAspect?: string | null;
    searchQuery?: string | null;
    domainTags?: string[] | null;
    stakeholderTags?: string[] | null;
  }>;
  perspectives: {
    items: Perspective[];
  };
  quality: {
    precision: number;
    checkability: number;
    readability: number;
    balance: number;
    evidenceStrength: number;
  };
};

type Props = {
  statement: StatementRecord;
  index?: number;
  language?: string;
};

function groupPerspectives(perspectives: Perspective[]) {
  const pro = perspectives.filter((p) => p.stance === "pro");
  const contra = perspectives.filter((p) => p.stance === "contra");
  const alternative = perspectives.filter(
    (p) => p.stance === "alternative",
  );
  return { pro, contra, alternative };
}

function scenarioLabel(p: Perspective) {
  if (!p.scenarioType) return null;
  switch (p.scenarioType) {
    case "fallback":
      return "Fallback";
    case "best_case":
      return "Best Case";
    case "worst_case":
      return "Worst Case";
    case "compromise":
      return "Kompromiss";
    case "baseline":
    default:
      return "Baseline";
  }
}

export function StatementCard({ statement, index = 0 }: Props) {
  const { core, evidence, perspectives, quality } = statement;
  const grouped = groupPerspectives(perspectives.items);
  const editorial = formatEditorialStatus({ reviewStatus: core.reviewStatus });

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm p-4 mb-4">
      <header className="mb-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            Statement #{index + 1}
          </span>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
            <span className="rounded-full border border-slate-200 px-2 py-0.5">
              Zuständigkeit: {core.responsibility}
            </span>
            <span className="rounded-full border border-slate-200 px-2 py-0.5">
              Topic: {core.topicKanonId}
            </span>
            <span className="rounded-full border border-slate-200 px-2 py-0.5">
              Status Redaktion: {editorial.label}
            </span>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-900">
          {core.text}
        </p>
        <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 opacity-70" />
      </header>

      {/* Evidence */}
      {evidence.length > 0 && (
        <section className="mb-3">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Evidenz-Hypothesen
          </h3>
          <ul className="space-y-1">
            {evidence.map((ev) => (
              <li
                key={ev.id}
                className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs text-slate-700"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold">
                    {ev.sourceType} · {ev.status}
                  </span>
                  {(ev.baseCountry || ev.compareCountry) && (
                    <span className="text-[10px] text-slate-500">
                      {ev.baseCountry ?? "?"} ↔{" "}
                      {ev.compareCountry ?? "?"}
                      {ev.tradeAspect ? ` · ${ev.tradeAspect}` : ""}
                    </span>
                  )}
                </div>
                <p className="text-xs mb-1">
                  {ev.searchQuery || "—"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {ev.domainTags?.map((tag) => (
                    <span
                      key={`d-${ev.id}-${tag}`}
                      className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {ev.stakeholderTags?.map((tag) => (
                    <span
                      key={`s-${ev.id}-${tag}`}
                      className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Perspectives */}
      <section className="mb-3">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Perspektiven & Fallbacks
        </h3>
        <div className="grid gap-2 md:grid-cols-3">
          {(["pro", "contra", "alternative"] as const).map((stanceKey) => {
            const list = grouped[stanceKey];
            if (!list.length) return null;
            const title =
              stanceKey === "pro"
                ? "Pro"
                : stanceKey === "contra"
                ? "Contra"
                : "Alternativen / Fallbacks";

            return (
              <div
                key={stanceKey}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-2"
              >
                <h4 className="mb-1 text-[11px] font-semibold text-slate-600">
                  {title}
                </h4>
                {list.map((p) => (
                  <div
                    key={p.text}
                    className="mb-2 rounded-xl bg-white/80 px-2 py-1.5 text-[11px] text-slate-700 last:mb-0"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-1">
                      {p.scenarioType && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                          {scenarioLabel(p)}
                        </span>
                      )}
                      {p.valueTags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] text-sky-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mb-1">{p.text}</p>
                    {p.condition && (
                      <p className="mb-1 text-[10px] text-slate-500">
                        Bedingung: {p.condition}
                      </p>
                    )}
                    {p.keyArguments?.length > 0 && (
                      <ul className="list-disc pl-4 text-[10px] text-slate-600">
                        {p.keyArguments.map((arg) => (
                          <li key={arg}>{arg}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Quality */}
      <section>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Qualität (0–1)
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 md:grid-cols-5">
          <QualityBar label="Präzision" value={quality.precision} />
          <QualityBar label="Prüfbarkeit" value={quality.checkability} />
          <QualityBar label="Lesbarkeit" value={quality.readability} />
          <QualityBar label="Balance" value={quality.balance} />
          <QualityBar label="Evidenz" value={quality.evidenceStrength} />
        </div>
      </section>
    </article>
  );
}

type QualityBarProps = {
  label: string;
  value: number;
};

function QualityBar({ label, value }: QualityBarProps) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between gap-1">
        <span>{label}</span>
        <span className="tabular-nums">{(pct / 100).toFixed(2)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-emerald-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Damit kannst du weiter wie gewohnt `import StatementCard from ...` machen. */
export default StatementCard;
