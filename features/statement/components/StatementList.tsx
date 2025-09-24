// VPM25/features/statement/components/StatementList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import StatementForm from "./StatementForm";
import type { StatementDraft } from "./StatementForm";
import { utils, writeFile, read } from "xlsx";

type Statement = {
  _id?: string;
  category: string;
  region: string;
  statement: string;
  alternative?: string;
  analysis?: { topics?: { name: string }[] };
  createdAt?: string;
};

export default function StatementList() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Statement | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "title">("newest");

  async function refetch() {
    setLoading(true);
    try {
      const res = await fetch("/api/statements", { cache: "no-store" });
      const data = (await res.json()) as Statement[];
      setStatements(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refetch();
  }, []);

  const filtered = useMemo(() => {
    let arr = statements.slice();
    const query = q.trim().toLowerCase();
    if (query) {
      arr = arr.filter((s) =>
        (s.category + " " + s.region + " " + s.statement + " " + (s.alternative ?? "")).toLowerCase().includes(query)
      );
    }
    if (sort === "newest") {
      arr.sort(
        (a, b) =>
          Number(new Date(b.createdAt ?? 0)) -
          Number(new Date(a.createdAt ?? 0))
      );
    } else {
      arr.sort((a, b) => (a.statement || "").localeCompare(b.statement || ""));
    }
    return arr;
  }, [statements, q, sort]);

  async function handleFormSubmit(data: StatementDraft) {
    const res = await fetch("/api/statements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newStmt = (await res.json()) as Statement;
    setStatements((prev) => [newStmt, ...prev]);
    setEditing(null);
  }

  // EXPORT
  function exportStatementsToXLSX() {
    const data = statements.map((s) => ({
      Kategorie: s.category,
      Region: s.region,
      Statement: s.statement,
      Alternative: s.alternative || "",
      ...(s.analysis && {
        GPT_Themen: s.analysis.topics?.map((t) => t.name).join(", "),
      }),
      Erstellt: s.createdAt ?? "",
    }));
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, "Statements");
    writeFile(wb, "statements_export.xlsx");
  }

  // TEMPLATE
  function downloadTemplate() {
    const data = [
      {
        Kategorie: "Umwelt & Klima",
        Region: "National",
        Statement: "Hier ein Beispielstatement",
        Alternative: "",
      },
    ];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, "Template");
    writeFile(wb, "statement_template.xlsx");
  }

  // IMPORT
  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const wb = read(evt!.target!.result as string | ArrayBuffer, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = utils.sheet_to_json<any>(ws);
      await Promise.all(
        rows.map((row) =>
          fetch("/api/statements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category: row.Kategorie,
              region: row.Region,
              statement: row.Statement,
              alternative: row.Alternative,
            }),
          })
        )
      );
      await refetch();
    };
    reader.readAsBinaryString(file);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">Lädt …</div>;

  return (
    <div className="mx-auto mt-8 max-w-5xl">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={downloadTemplate}
          className="rounded-xl bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300"
        >
          Muster-Datei (xlsx)
        </button>

        <label className="cursor-pointer rounded-xl bg-green-100 px-4 py-2 font-semibold text-green-800 hover:bg-green-200">
          Import (xlsx)
          <input type="file" accept=".xlsx,.csv" onChange={handleImport} className="hidden" />
        </label>

        <button
          onClick={exportStatementsToXLSX}
          className="rounded-xl bg-indigo-200 px-4 py-2 font-semibold text-indigo-900 hover:bg-indigo-300"
        >
          Export (xlsx)
        </button>

        <div className="ml-auto flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Suche…"
            className="w-56 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Neueste</option>
            <option value="title">Alphabetisch</option>
          </select>
          <button
            onClick={() => setEditing({} as any)}
            className="rounded-xl bg-[#A259EB] px-4 py-2 font-semibold text-white hover:bg-[#842cc7]"
          >
            + Neues Statement
          </button>
        </div>
      </div>

      {editing && (
        <div className="mb-6">
          <StatementForm
            statement={editing}
            onSubmit={handleFormSubmit}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* Liste */}
      <div className="mt-6 space-y-2">
        {filtered.map((s, i) => (
          <div
            key={s._id ?? i}
            className="flex items-start justify-between rounded bg-gray-100 p-4"
          >
            <div className="pr-4">
              <strong>
                {s.category} ({s.region})
              </strong>
              <br />
              {s.statement}
              {s.alternative && (
                <div className="mt-1 text-xs text-gray-500">
                  Alternative: {s.alternative}
                </div>
              )}
              {s.createdAt && (
                <div className="mt-1 text-xs text-gray-500">
                  Erstellt: {new Date(s.createdAt).toLocaleString("de-DE")}
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            Keine Einträge.
          </div>
        )}
      </div>
    </div>
  );
}
