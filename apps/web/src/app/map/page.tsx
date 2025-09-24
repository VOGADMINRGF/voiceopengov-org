// apps/web/src/app/map/page.tsx
import dynamic from "next/dynamic";

const OLMap = dynamic(() => import("@features/map/OLMap"), { ssr: false });
export const dynamic = "force-dynamic";

export default function MapPage() {
  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Karte</h1>
      <OLMap />
    </main>
  );
}
