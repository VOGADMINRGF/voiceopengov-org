import type { ReactNode } from "react";

export type AccordionItem = { title: string; content: ReactNode };

export function MiniAccordion({ items }: { items: AccordionItem[] }) {
  return (
    <div>
      {items.map((item, idx) => (
        <details key={idx}>
          <summary>{item.title}</summary>
          <div>{item.content}</div>
        </details>
      ))}
    </div>
  );
}
