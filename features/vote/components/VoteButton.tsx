"use client";
import { useState } from "react";

type Val = "agree" | "neutral" | "disagree";
type Summary = { agree: number; neutral: number; disagree: number };

function ensureFp(): string {
  try {
    let fp = localStorage.getItem("vog_fp");
    if (!fp) {
      fp = crypto.randomUUID();
      localStorage.setItem("vog_fp", fp);
    }
    return fp;
  } catch {
    // Fallback, z. B. Private Mode
    return "fp-unavailable";
  }
}

const baseBtn =
  "px-3 py-1 rounded text-sm border transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1";

export default function VoteButtons({
  statementId,
  initialSummary,
  onAfter,
  lockAfterVote = false,
}: {
  statementId: string;
  initialSummary?: Summary;
  onAfter?: (value: Val) => void;
  /** true = weiterer Vote in der Session gesperrt */
  lockAfterVote?: boolean;
}) {
  const [busy, setBusy] = useState<Val | null>(null);
  const [voted, setVoted] = useState<Val | null>(null);
  const [summary, setSummary] = useState<Summary | undefined>(initialSummary);

  async function cast(value: Val) {
    if (busy) return; // nur Parallelklicks verhindern

    setBusy(value);

    // Optimistic Update mit sauberem Umstimmen (−1 alte, +1 neue Auswahl)
    const prevSummary = summary ? { ...summary } : undefined;
    const prevVote = voted;
    if (summary) {
      const next: Summary = { ...summary };
      next[value] += 1;
      if (!lockAfterVote && prevVote && prevVote !== value) {
        next[prevVote] = Math.max(0, next[prevVote] - 1);
      }
      setSummary(next);
    }

    try {
      const fp = ensureFp();
      const r = await fetch("/api/votes/cast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-fp": fp,
        },
        body: JSON.stringify({ statementId, value }),
      });

      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || "Vote fehlgeschlagen");

      // Falls der Server eine aktuelle Summary zurückgibt, diese übernehmen
      if (j?.summary && typeof j.summary === "object") {
        setSummary(j.summary as Summary);
      }

      // UI-Zustand zeigen, aber weitere Votes NICHT verhindern (außer lockAfterVote=true)
      setVoted(value);
      onAfter?.(value);
    } catch (e) {
      // Rollback bei Fehler
      if (prevSummary) setSummary(prevSummary);
      alert((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  // Buttons nur sperren, solange busy – bzw. nach erstem Vote, wenn lockAfterVote=true übergeben wurde
  const disabled = !!busy || (lockAfterVote && !!voted);

  return (
    <div className="flex flex-col gap-2">
      <div role="group" aria-label="Abstimmen" className="flex gap-2">
        <button
          disabled={disabled}
          className={`${baseBtn} border-green-600 text-green-700 hover:bg-green-50`}
          onClick={() => cast("agree")}
          title="Zustimmen"
          aria-busy={busy === "agree"}
          aria-pressed={voted === "agree"}
        >
          {busy === "agree" ? "…" : "Zustimmen"}
        </button>
        <button
          disabled={disabled}
          className={`${baseBtn} border-gray-400 text-gray-700 hover:bg-gray-50`}
          onClick={() => cast("neutral")}
          title="Neutral"
          aria-busy={busy === "neutral"}
          aria-pressed={voted === "neutral"}
        >
          {busy === "neutral" ? "…" : "Neutral"}
        </button>
        <button
          disabled={disabled}
          className={`${baseBtn} border-red-600 text-red-700 hover:bg-red-50`}
          onClick={() => cast("disagree")}
          title="Ablehnen"
          aria-busy={busy === "disagree"}
          aria-pressed={voted === "disagree"}
        >
          {busy === "disagree" ? "…" : "Ablehnen"}
        </button>
      </div>

      {voted && (
        <span className="text-sm text-gray-600">
          Danke für deine Stimme{summary ? "!" : "."}
          {summary && (
            <>
              {" "}
              Aktuelle Stimmen: 👍 {summary.agree} | 🤔 {summary.neutral} | 👎 {summary.disagree}
            </>
          )}
        </span>
      )}

      {!voted && summary && (
        <span className="text-xs text-gray-500">
          Aktuell: 👍 {summary.agree} | 🤔 {summary.neutral} | 👎 {summary.disagree}
        </span>
      )}
    </div>
  );
}
