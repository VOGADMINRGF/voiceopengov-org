// apps/web/src/app/map/MapPageClient.tsx
"use client";

import dynamic from "next/dynamic";

// MapClient ist selbst clientseitig (Map/GL/DOM-APIs)
const MapClient = dynamic(() => import("@features/map/components/MapClient"), {
  ssr: false,
  // optional: loading placeholder
  // loading: () => <div className="p-6">Karte lädt…</div>,
});

export default function MapPageClient() {
  return <MapClient />;
}
