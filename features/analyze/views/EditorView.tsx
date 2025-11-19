// features/analyze/views/EditorView.tsx
"use client";

import { useState } from "react";
import type { AnalyzeResult } from "@features/analyze/schemas";
import { StatementCard } from "@features/statement/components/StatementCard";

type Props = {
  result: AnalyzeResult;
};

type SuggestionTarget =
  | { kind: "note"; id: string }
  | { kind: "question"; id: string };

export function EditorView({ result }: Props) {
  const { notes, claims, questions, knots } = result;

  async function sendSuggestion(target: SuggestionTarget, text: string) {
    if (!text.trim()) return;
    try {
      await fetch("/api/contributions/suggest-edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          target,
          text,
          source: "editor_inline",
        }),
      });
      // optional: Toast / Hinweis
    } catch (e) {
      console.error("suggest-edit failed", e);
    }
  }

  return (
    <section
      aria-label="Redaktionsmodus"
      className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.6fr_0.9fr]"
    >
      {/* LINKS: Notes mit Mini-Comment-Funktion */}
      <aside className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Kontext (Notizen)
        </h3>
        {notes.map((note, idx) => (
          <EditableCard
            key={note.id || idx}
            title={`Abschnitt ${note.order ?? idx + 1}`}
            text={note.summary}
            onSubmit={(t) =>
              sendSuggestion({ kind: "note", id: note.id }, t)
            }
          />
        ))}
      </aside>

      {/* MITTE: vollständige StatementCards */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Abgeleitete Statements (Claims)
        </h3>
        {claims.map((c, idx) => (
          <StatementCard
            key={c.core.id}
            statement={c}
            index={idx}
          />
        ))}
      </section>

      {/* RECHTS: Fragen & Knoten mit Inline-Kommentar */}
      <aside className="space-y-4">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Fragen zum Weiterdenken
          </h3>
          <div className="space-y-2">
            {questions.map((q, idx) => (
              <EditableCard
                key={q.id || idx}
                title={q.kind.toUpperCase()}
                text={q.text}
                onSubmit={(t) =>
                  sendSuggestion({ kind: "question", id: q.id }, t)
                }
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Knoten (Themenhubs)
          </h3>
          <ul className="space-y-1 text-[11px] text-slate-600">
            {knots.map((k) => (
              <li
                key={k.id}
                className="rounded-xl border border-slate-100 bg-white/70 px-3 py-2"
              >
                <div className="text-[11px] font-semibold text-slate-700">
                  {k.label || "Unbenannter Knoten"}
                </div>
                <div className="text-[10px] text-slate-500">
                  {k.description}
                </div>
                <div className="mt-1 text-[10px] text-emerald-700">
                  Kategorie: {k.category}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}

/* ----- kleine editierbare Karte mit ✏-Icon ----- */

function EditableCard({
  title,
  text,
  onSubmit,
}: {
  title: string;
  text: string;
  onSubmit: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  function handleSave() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setDraft("");
    setOpen(false);
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 p-2 text-[11px] text-slate-700 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-600">
          {title}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-100"
          title="Kurzkommentar an Redaktion"
        >
          ✏
        </button>
      </div>
      <p className="text-[11px]">{text}</p>

      {open && (
        <div className="mt-2 space-y-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Kurze Anmerkung an Redaktion…"
            className="w-full rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
          />
          <div className="flex justify-end gap-1">
            <button
              type="button"
              onClick={() => {
                setDraft("");
                setOpen(false);
              }}
              className="rounded-full px-2 py-0.5 text-[10px] text-slate-400 hover:bg-slate-50"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white"
            >
              Senden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
