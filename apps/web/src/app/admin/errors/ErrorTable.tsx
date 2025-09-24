// apps/web/src/app/admin/errors/ErrorTable.tsx
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { absUrl } from "@/utils/absUrl";

type Row = {
  _id: string; traceId: string; code?: string; path?: string;
  status?: number; resolved: boolean; timestamp: string;
};

export default function ErrorTable({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "open" | "resolved">("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(initial.length);

  const fetchPage = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const u = new URL(absUrl("/api/errors/list"));
      if (q) u.searchParams.set("q", q);
      if (status !== "all") u.searchParams.set("status", status);
      u.searchParams.set("page", String(p));
      u.searchParams.set("pageSize", String(pageSize));
      const r = await fetch(u, { cache: "no-store" });
      const j = await r.json();
      setRows(j.items); setTotal(j.total); setPage(j.page);
    } finally { setLoading(false); }
  }, [q, status, pageSize]);

  useEffect(() => { const t = setTimeout(() => fetchPage(1), 250); return () => clearTimeout(t); }, [q, status, fetchPage]);

  async function toggleResolved(id: string) {
    const idx = rows.findIndex(r => r._id === id); if (idx < 0) return;
    const prev = rows[idx]; const next = { ...prev, resolved: !prev.resolved };
    setRows([...rows.slice(0, idx), next, ...rows.slice(idx + 1)]);
    const res = await fetch(absUrl("/api/errors/resolve"), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, resolved: next.resolved }),
    });
    if (!res.ok) setRows([...rows.slice(0, idx), prev, ...rows.slice(idx + 1)]);
  }

  function exportCSV() {
    const header = ["Trace-ID", "Code", "Pfad", "Status", "Zuletzt"];
    const lines = rows.map(r => [
      safe(r.traceId), safe(r.code ?? ""), safe(r.path ?? ""),
      r.resolved ? "Gelöst" : "Offen",
      new Date(r.timestamp).toISOString()
    ].map(csvCell).join(","));
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `errors_p${page}.csv`; a.click();
    URL.revokeObjectURL(a.href);
  }

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const info = useMemo(() => `${(page-1)*pageSize+1}–${Math.min(page*pageSize,total)} von ${total}`, [page,pageSize,total]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input className="border rounded px-2 py-1 w-64" placeholder="Suche trace/code/pfad…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="border rounded px-2 py-1" value={status} onChange={e=>setStatus(e.target.value as any)}>
          <option value="all">Alle</option>
          <option value="open">Offen</option>
          <option value="resolved">Gelöst</option>
        </select>
        <button className="border rounded px-3 py-1" onClick={exportCSV} disabled={!rows.length}>CSV Export</button>
        <span className="text-sm text-gray-600">{loading ? "Lädt…" : info}</span>
      </div>

      <table className="table-auto w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="py-2 px-4">Trace-ID</th><th>Code</th><th>Pfad</th><th>Status</th><th>Zuletzt</th><th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(err => (
            <tr key={err._id} className="border-b hover:bg-gray-50">
              <td className="px-4 font-mono text-xs">{err.traceId}</td>
              <td>{err.code ?? "—"}</td>
              <td className="truncate max-w-[320px]" title={err.path ?? ""}>{err.path ?? "—"}</td>
              <td>
                <span className={`px-2 py-1 rounded ${err.resolved ? "bg-green-200" : "bg-red-200"}`}>
                  {err.resolved ? "Gelöst" : "Offen"}
                </span>
              </td>
              <td>{new Date(err.timestamp).toLocaleString()}</td>
              <td>
                <button className="text-blue-600 underline" onClick={() => toggleResolved(err._id)}>
                  {err.resolved ? "Wieder öffnen" : "Als gelöst markieren"}
                </button>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={6} className="py-8 text-center text-gray-500">Keine Einträge</td></tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center gap-2 justify-end">
        <button className="border rounded px-2 py-1" onClick={()=> fetchPage(Math.max(1, page-1))} disabled={page<=1}>Zurück</button>
        <span className="text-sm">Seite {page} / {pages}</span>
        <button className="border rounded px-2 py-1" onClick={()=> fetchPage(Math.min(pages, page+1))} disabled={page>=pages}>Weiter</button>
      </div>
    </div>
  );
}

function safe(s: string){ return (s||"").replace(/\n/g," ").slice(0,2000); }
function csvCell(s: string){ return `"${s.replace(/"/g,'""')}"`; }
