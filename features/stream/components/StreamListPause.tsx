"use client";

import { useState, useMemo } from "react";
import StreamCard from "./StreamCard";

interface StreamData {
  id: string;
  title: string;
  status: "Live" | "Replay" | "Geplant";
  region: string;
  topic: string;
  language: string;
  viewers: number;
  images?: string[];
  trailerUrl?: string;
  description?: string;
  statements?: { agreed: number; rejected: number; unanswered: number };
  likes?: number;
  bookmarked?: boolean;
  calendarInviteSent?: boolean;
}

const MAIN_FILTERS = [
  { label: "Live", value: "Live" },
  { label: "In meiner Nähe", value: "nearby" },
  { label: "Heimatland", value: "heimat" },
  { label: "EU", value: "EU" },
];

type ViewType = "grid" | "list";

export default function StreamList({ streams = [] }: { streams?: StreamData[] }) {
  const [view, setView] = useState<ViewType>("grid");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Such-/Filter-Logik
  const filteredStreams = useMemo(() => {
    if (!Array.isArray(streams)) return [];
    return streams.filter((stream) => {
      const matchesFilter =
        activeFilters.length === 0 ||
        activeFilters.some((f) =>
          f === stream.status ||
          f === stream.region ||
          f === stream.topic ||
          (f === "Live" && stream.status === "Live") ||
          (f === "EU" && stream.region === "EU")
        );
      const matchesSearch =
        search.trim().length === 0 ||
        stream.title.toLowerCase().includes(search.toLowerCase()) ||
        stream.region.toLowerCase().includes(search.toLowerCase()) ||
        stream.topic.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [streams, activeFilters, search]);

  // Vorschläge für Suchfeld (optional)
  const searchSuggestions = useMemo(() => {
    const values = [
      ...new Set(
        streams.flatMap((s) => [s.region, s.topic, s.status]).filter(Boolean)
      ),
    ];
    return values.filter(
      (val) =>
        val &&
        val.toLowerCase().includes(search.toLowerCase()) &&
        !activeFilters.includes(val)
    );
  }, [search, streams, activeFilters]);

  return (
    <div className="w-full">
      {/* Suchfeld & Filterleiste */}
      <div className="flex flex-col md:flex-row gap-2 items-center mb-4 relative">
        <input
          className="border px-3 py-2 rounded-xl shadow-sm text-sm w-full md:max-w-xs dark:bg-neutral-800"
          placeholder="Suche nach Stream, Ort, Thema ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Vorschlagsliste unter dem Feld */}
        {search && searchSuggestions.length > 0 && (
          <div className="absolute mt-10 left-0 z-20 bg-white border rounded-xl shadow-lg max-h-36 overflow-auto w-64 dark:bg-neutral-800">
            {searchSuggestions.map((suggestion, i) => (
              <div
                key={i}
                className="px-4 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-sm"
                onClick={() => {
                  setActiveFilters((prev) => [...prev, suggestion]);
                  setSearch("");
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
        {/* Hauptfilter */}
        <div className="flex gap-2 flex-wrap">
          {MAIN_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`px-3 py-1 rounded-xl text-xs font-medium shadow-sm ${
                activeFilters.includes(f.value)
                  ? "bg-coral text-white"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
              }`}
              onClick={() =>
                setActiveFilters((prev) =>
                  prev.includes(f.value)
                    ? prev.filter((val) => val !== f.value)
                    : [...prev, f.value]
                )
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        {/* Ansicht-Umsteller */}
        <div className="ml-auto flex gap-2">
          <button
            className={`rounded-lg px-2 py-1 text-xs ${
              view === "grid"
                ? "bg-coral text-white"
                : "bg-neutral-200 dark:bg-neutral-700"
            }`}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            className={`rounded-lg px-2 py-1 text-xs ${
              view === "list"
                ? "bg-coral text-white"
                : "bg-neutral-200 dark:bg-neutral-700"
            }`}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Aktive Filter */}
      {activeFilters.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {activeFilters.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-coral text-white text-xs"
            >
              {f}
              <button
                onClick={() =>
                  setActiveFilters((prev) => prev.filter((val) => val !== f))
                }
                className="ml-1 text-white"
                aria-label="Filter entfernen"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Stream-Karten */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
            : "flex flex-col gap-4"
        }
      >
        {filteredStreams.length === 0 ? (
          <div className="text-neutral-400 py-12 text-center">
            Keine Streams gefunden.
          </div>
        ) : (
          filteredStreams.map((stream) => (
            <StreamCard key={stream.id} {...stream} />
          ))
        )}
      </div>
    </div>
  );
}
