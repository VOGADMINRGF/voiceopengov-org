// apps/web/src/app/map/page.tsx
import NextDynamic from "next/dynamic";

const MapClient = NextDynamic(() => import("@features/map/components/MapClient"), { ssr: false });

// Diese Zeile ist ok – jetzt kein Konflikt mehr:
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Interaktive Karte</h1>
      <div style={{ height: "calc(100vh - 140px)" }}>
        <MapClient />
      </div>
    </main>
  );
}
