"use client";
import * as React from "react";

export type Outline = { id: string; label: string; summary: string; start: number; end: number };
export type AnalyzeResult = {
  outline?: Outline[];
  claims?: any[];
  questions?: any[];
  knots?: any[];
  notes?: any[];
  sourceText?: string;
};

export function MainEditor({
  onResult,
  outline,
  claims,
  onHeight,
  onActiveOutline,
  hasData,
}: {
  onResult: (r: AnalyzeResult) => void;
  outline: Outline[];
  claims: any[];
  onHeight: (h: number) => void;
  onActiveOutline: (id: string | null) => void;
  hasData?: boolean;
}) {
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [processedIds, setProcessedIds] = React.useState<string[]>([]);
  const [processed, setProcessed] = React.useState(0);

  const textRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Jump-Helfer (externes __edbtt_jumpTo)
  React.useEffect(() => {
    (window as any).__edbtt_jumpTo = (offset: number) => {
      const el = textRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(offset, offset);
      const ratio = offset / Math.max(1, el.value.length);
      el.scrollTop = Math.max(0, el.scrollHeight * ratio - el.clientHeight / 3);
    };
  }, []);

  // 👉 Auto-Scroll: Marker läuft beim Fortschritt ans Ende
  React.useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (!processed) return; // bei 0 nichts tun

    const end = Math.max(0, Math.min(el.value.length, processed - 1));
    onActiveOutline?.(null);
    el.setSelectionRange(end, end);
    el.scrollTop = el.scrollHeight;
  }, [processed, onActiveOutline]);

  // Auto-Resize + Höhe nach außen melden (abhängig von Text & Fortschritt)
  React.useEffect(() => {
    if (!textRef.current) return;
    const el = textRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    onHeight?.(el.getBoundingClientRect().height);
  }, [text, processed, onHeight]);

  // Wenn Text geändert wird → alte Markierungen zurücksetzen
  React.useEffect(() => {
    setProcessedIds([]);
    setProcessed(0);
  }, [text]);

  const showHighlights = (outline?.length ?? 0) > 0;

  function renderHighlights() {
    if (!showHighlights) return null;
    const value = text;
    const segs = [...(outline || [])].sort((a, b) => a.start - b.start);
    const nodes: React.ReactNode[] = [];
    let i = 0;
    for (const seg of segs) {
      const s = Math.max(0, Math.min(value.length, seg.start));
      const e = Math.max(s, Math.min(value.length, seg.end));
      if (s > i) nodes.push(<span key={`p-${i}`}>{value.slice(i, s)}</span>);
      const done = processedIds.includes(seg.id);
      nodes.push(
        <mark
          key={seg.id}
          title={seg.summary}
          className={done ? "done" : "pending"}
          onMouseEnter={() => onActiveOutline(seg.id)}
          onMouseLeave={() => onActiveOutline(null)}
        >
          {value.slice(s, e)}
        </mark>
      );
      i = e;
    }
    if (i < value.length) nodes.push(<span key={`tail-${i}`}>{value.slice(i)}</span>);
    return <div className="leading-relaxed text-black/90">{nodes}</div>;
  }

  function playOutline(ids: string[]) {
    setProcessedIds([]);
    ids.forEach((id, idx) => {
      setTimeout(
        () => setProcessedIds((p) => Array.from(new Set([...p, id]))),
        200 + idx * 200
      );
    });
  }

  function markerPct() {
    const total = text.length || 1;
    return Math.min(100, Math.round((processed / total) * 100));
  }

  async function analyze() {
    if (!text.trim()) return;
    setBusy(true);
    setProcessed(0);
    setProcessedIds([]);

    // Aggregierte Live-Daten für onResult
    let notesAcc: any[] = [];
    let questionsAcc: any[] = [];
    let knotsAcc: any[] = [];
    let claimsAcc: any[] = Array.isArray(claims) ? [...claims] : [];

    try {
      const res = await fetch("/api/contributions/analyze", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "text/event-stream",
        },
        body: JSON.stringify({
          text: text.slice(0, 8000),
          stream: true,
          locale: "de",
          maxClaims: 20,
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const dec = new TextDecoder();
      let buf = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });

        const parts = buf.split("\n\n");
        buf = parts.pop() || "";

        for (const chunk of parts) {
          const line = chunk.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;

          let evt: any;
          try {
            evt = JSON.parse(line.slice(5));
          } catch (e) {
            console.warn("Bad SSE line", line, e);
            continue;
          }

          if (evt.phase === "start") continue;

          // Fortschritt updaten → Marker & Auto-Height & Auto-Scroll
          if (typeof evt.processed === "number") {
            setProcessed(evt.processed);
          }

          // Notes / Questions / Knots / Claims sukzessive sammeln
          if (evt.note) {
            notesAcc.push(evt.note);
          }
          if (evt.question) {
            questionsAcc.push(evt.question);
          }
          if (evt.knot) {
            knotsAcc.push(evt.knot);
          }
          if (evt.claims) {
            claimsAcc = evt.claims;
          }

          // Live an Parent durchreichen (für Cards etc.)
          onResult({
            outline,
            claims: claimsAcc,
            questions: questionsAcc,
            knots: knotsAcc,
            notes: notesAcc,
            sourceText: text,
          });
        }
      }

      // Finaler Stand
      onResult({
        outline,
        claims: claimsAcc,
        questions: questionsAcc,
        knots: knotsAcc,
        notes: notesAcc,
        sourceText: text,
      });

      // Optional: Outline-Animation abspielen, falls vorhanden
      if (outline?.length) {
        playOutline(outline.map((o) => o.id));
      }
    } catch (e) {
      console.error(e);
      alert("Analyse fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border bg-white/75 p-4 shadow-[0_24px_64px_-40px_rgba(0,0,0,.35)] backdrop-blur relative">
      {!hasData && !text && (
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-6 opacity-90 animate-fade-in-up text-cyan-700 text-[15px] z-10">
          <svg
            className="mx-auto mb-1 h-6 w-6 animate-bounce"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 3v14m0 0l-5-5m5 5l5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Beschreibe dein Anliegen und klicke auf <strong>Analyse starten</strong>.
        </div>
      )}

      <div className="hl-wrap">
        {/* Overlay mit Outline-Highlights */}
        {showHighlights && <div className="hl-bg">{renderHighlights()}</div>}

        {/* Marker-Maske mit Fortschrittsvariable */}
        <div
          className="marker-mask"
          style={{ ["--marker-pct" as any]: `${markerPct()}%` }}
        >
          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="hl-ta"
            style={{
              color: showHighlights ? "transparent" : "#111",
              caretColor: "#111",
              overflow: "hidden",
            }}
            placeholder="Beschreibe dein Anliegen …"
            aria-busy={busy}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={analyze}
          disabled={busy || !text.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition active:scale-[.99] disabled:opacity-50"
        >
          {(outline?.length ?? 0) > 0 ? "Erneut analysieren" : "Analyse starten"}
        </button>
        <button className="rounded-xl border px-4 py-2 text-sm">Speichern</button>
        <button className="rounded-xl border px-4 py-2 text-sm">Melden</button>
      </div>
    </section>
  );
}
