"use client";

import { useState } from "react";
import streamData from "@features/stream/data/streamData";
import StreamCard from "@features/stream/components/pauseStreamCard";
import StreamFilters from "@features/stream/components/StreamFilters";
import StreamViewToggle from "@features/stream/components/StreamViewToggle";

console.log("streamData", streamData); // 👉 Hier debuggen!

export default function StreamPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Live & Replay</h1>
        <StreamViewToggle onChange={setView} />
      </div>

      <StreamFilters />

      <div className={`${view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "flex flex-col gap-4"}`}>
        {streamData.map((stream) => (
          <StreamCard key={stream.id} stream={stream} layout={view} />
        ))}
      </div>
    </main>
  );
}
