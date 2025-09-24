"use client";
type Kind = "info" | "success" | "warn";
const styles: Record<Kind, string> = {
  info: "border-sky-300/60 bg-sky-50/60",
  success: "border-emerald-300/60 bg-emerald-50/60",
  warn: "border-amber-300/60 bg-amber-50/60",
};
export default function Callout({
  kind = "info",
  title,
  children,
}: { kind?: Kind; title: string; children: React.ReactNode }) {
  return (
    <aside className={`not-prose rounded-xl border p-4 ${styles[kind]}`}>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-slate-700">{children}</div>
    </aside>
  );
}
