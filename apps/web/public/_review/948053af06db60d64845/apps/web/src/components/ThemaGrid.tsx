import { colors } from "@ui/theme";

export function ThemaGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
      {items.map(item => (
        <a
          key={item.title}
          href={item.href || "#"}
          className="block p-5 rounded-2xl shadow-lg bg-white border transition hover:bg-indigo-50"
          style={{ borderColor: item.color || colors.indigo, color: item.color || colors.indigo }}
        >
          <div className="text-2xl mb-2">{item.icon}</div>
          <div className="font-bold text-lg mb-1">{item.title}</div>
          <div className="text-sm opacity-80">{item.desc}</div>
        </a>
      ))}
    </div>
  );
}

// Beispiel-Aufruf:
// <ThemaGrid items={[
//   { icon: "🌊", title: "Klimaschutz", desc: "Was bewegt deine Region?", href: "/thema/klima", color: colors.turquoise },
//   { icon: "🏥", title: "Gesundheit", desc: "Ideen & Abstimmungen", href: "/thema/gesundheit", color: colors.coral },
// ]} />
