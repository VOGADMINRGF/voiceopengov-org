type Thema = { title: string; description?: string; href?: string };
export function ThemaGrid({ items }: { items: Thema[] }) {
  return (
    <div>
      {items.map((item, i) => (
        <a key={i} href={item.href ?? "#"}>{item.title}</a>
      ))}
    </div>
  );
}
