// apps/web/src/app/context/page.tsx
import ContextExplorer, { ContextNode } from "@features/context/ContextExplorer";

const ROOTS: ContextNode[] = [
  { id: "de", label: "Deutschland", type: "country", hasChildren: true },
  { id: "fr", label: "Frankreich", type: "country", hasChildren: true },
];

async function fetchChildren(parentId: string): Promise<ContextNode[]> {
  // Beispiel – hier kannst du später echte Daten laden (Mongo/Neo4j/API)
  if (parentId === "de") {
    return [
      { id: "de-bw", label: "Baden-Württemberg", type: "state", hasChildren: true },
      { id: "de-by", label: "Bayern", type: "state", hasChildren: true },
    ];
  }
  return [];
}

export default function Page() {
  return (
    <div className="p-6">
      <ContextExplorer
        roots={ROOTS}
        fetchChildren={fetchChildren}
        onSelect={(n) => console.log("Kontext gewählt:", n)}
        enableSearch
        maxExpandedDepth={0}
      />
    </div>
  );
}
