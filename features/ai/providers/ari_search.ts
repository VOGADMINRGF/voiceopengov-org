type AriSearchResult = { ok: true; snippets: string[] } | { ok: false; error: string };

export async function callAriSearch(query: string): Promise<AriSearchResult> {
  if (process.env.ARI_DISABLED === "1") return { ok: false, error: "ARI disabled" };
  const base = process.env.ARI_BASE_URL || process.env.ARI_URL || process.env.ARI_API_URL || process.env.YOUCOM_ARI_API_URL;
  const key = process.env.ARI_API_KEY || process.env.YOUCOM_ARI_API_KEY;
  if (!base || !key) return { ok: false, error: "ARI not configured" };

  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/v1/search`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ q: query, topK: 5 }),
    });
    if (!res.ok) return { ok: false, error: `ARI ${res.status}` };
    const json = await res.json().catch(() => ({}));
    const snippets =
      Array.isArray(json?.items) && json.items.length
        ? (json.items as any[])
            .map((it) => it?.snippet || it?.summary || it?.text || it?.content)
            .filter((t): t is string => typeof t === "string")
            .slice(0, 5)
        : [];
    return { ok: true, snippets };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "ARI search failed" };
  }
}
