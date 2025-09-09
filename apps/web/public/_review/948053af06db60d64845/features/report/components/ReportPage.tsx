Muss angepasst werden 

/features/report/components/ReportPage.tsx
"use client";

import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ReportCard from "./ReportCard";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import StatementCard from "@features/statement/components/StatementCard";
import { demoReports, demoThemes, demoStatements } from "../data/demoReports";

type Props = { nonce?: string };              // ✅ wichtig: Prop definieren

export default function ReportPage({ nonce }: Props) {
  const [search, setSearch] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState(demoReports[0]);
  const [language, setLanguage] = useState("de");

  const filteredReports = useMemo(
    () =>
      demoReports.filter(
        (report) =>
          (activeTheme ? report.tags.includes(activeTheme) : true) &&
          report.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search, activeTheme]
  );

  const relatedStatements = useMemo(
    () => demoStatements.filter((st) => selectedReport.statementIds?.includes(st.id)),
    [selectedReport]
  );

  const allNews = useMemo(() => selectedReport.news || [], [selectedReport]);

  return (
    <div className="min-h-screen py-16 bg-neutral-50">
      {/* Beispiel (nur falls du Inline-Scripts brauchst):
          <script nonce={nonce} dangerouslySetInnerHTML={{__html: "console.log('CSP ok')" }} />
      */}
      <div className="max-w-7xl mx-auto px-2 lg:px-6 flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <LeftSidebar />
        </aside>

        <main className="flex-1 min-w-0 flex flex-col">
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
            <h1 className="font-bold text-3xl text-indigo-800 flex-shrink-0">Reports & Analysen</h1>
            <div className="relative flex-1 max-w-md w-full">
              <FiSearch className="absolute left-3 top-3 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border w-full border-neutral-300 shadow-sm"
                placeholder="Suche Reports..."
                aria-label="Reports durchsuchen"
              />
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 scrollbar-hide mb-6 pb-2">
            <button
              onClick={() => setActiveTheme(null)}
              className={`text-sm px-4 py-1 rounded-full transition ${
                !activeTheme ? "bg-indigo-600 text-white" : "bg-neutral-100 text-neutral-700"
              }`}
            >
              Alle Themen
            </button>
            {demoThemes.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTheme(label)}
                className={`text-sm px-4 py-1 rounded-full transition ${
                  activeTheme === label ? "bg-indigo-600 text-white" : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`cursor-pointer ${selectedReport.id === report.id ? "ring-2 ring-indigo-400" : ""}`}
                tabIndex={0}
                aria-label={`Report: ${report.title}`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedReport(report)}
              >
                <ReportCard report={report} language={language} />
              </div>
            ))}
          </div>

          <section className="mt-8 max-w-4xl mx-auto space-y-3">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">
              Statements zu „{selectedReport.title}“
            </h2>
            {relatedStatements.map((statement) => (
              <StatementCard key={statement.id} statement={statement} language={language} />
            ))}
            {relatedStatements.length === 0 && (
              <div className="italic text-neutral-500">Keine passenden Statements verfügbar.</div>
            )}
          </section>
        </main>

        <aside className="hidden xl:block w-80 flex-shrink-0">
          <RightSidebar news={allNews} />
        </aside>
      </div>
    </div>
  );
}

2) Server-Feature rendert via DAL (kein interner fetch)

// apps/web/src/features/report/components/ReportPage.tsx
import "server-only";
import { listReports } from "../data/listReports";

export default async function ReportPage({ user }: { user: { id: string } }) {
  const list = await listReports({ forUserId: user.id, limit: 30 });
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map(r => (
          <div key={r.id} className="border rounded p-4">
            <div className="font-semibold">{r.title}</div>
            <div className="text-xs text-gray-500">
              {new Date(r.updatedAt ?? r.createdAt).toLocaleString()}
            </div>
            <p className="text-sm mt-2 line-clamp-3">{r.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}