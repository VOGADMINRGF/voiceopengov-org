import type { ReactNode } from "react";
type FeedItem = { id?: string | number; content: ReactNode };

export function MiniFeed({ items }: { items: FeedItem[] }) {
  return (
    <ul>
      {items.map((item, idx) => (
        <li key={item.id ?? idx}>{item.content}</li>
      ))}
    </ul>
  );
}
