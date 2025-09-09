// apps/web/src/app/context/page.tsx
"use client";

import ContextExplorer from "@/components/context/ContextExplorer";

export default function ContextPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Kommentare im Kontext</h1>
      <ContextExplorer />
    </main>
  );
}
