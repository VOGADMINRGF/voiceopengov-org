"use client";
export default function ShareBar({ title, path }: { title: string; path: string }) {
  async function onShare() {
    const url = `${window.location.origin}${path}`;
    const text = title;
    try {
      if ((navigator as any).share) await (navigator as any).share({ title, text, url });
      else { await navigator.clipboard.writeText(url); alert("Link kopiert. Danke fürs Teilen!"); }
    } catch {}
  }
  return (
    <div className="not-prose mt-4 flex gap-2">
      <button onClick={onShare} className="rounded-lg border px-3 py-1 text-sm">Teilen</button>
      <a href={path} className="rounded-lg border px-3 py-1 text-sm" aria-label="Permalink">Permalink</a>
    </div>
  );
}
