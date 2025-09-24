export default function KpiBadges({
    items,
  }: { items: { k: string; v: string }[] }) {
    return (
      <div className="mt-3 flex flex-wrap gap-2 not-prose" aria-label="Qualitätsindikatoren">
        {items.map((b, i) => (
          <span key={i} className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
            <span className="font-medium mr-1">{b.k}:</span>{b.v}
          </span>
        ))}
      </div>
    );
  }
  