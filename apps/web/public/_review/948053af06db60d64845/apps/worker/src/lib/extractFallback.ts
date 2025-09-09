// apps/worker/src/lib/extractFallback.ts
export function extractFallback(text: string) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    const firstSentence = clean.split(/[.!?]/)[0]?.slice(0, 120)?.trim();
    const title = firstSentence || clean.slice(0, 80);
  
    // sehr grobe Region-Erkennung
    const regions = ["Berlin","Hamburg","Bayern","NRW","Sachsen","Deutschland","EU","Europa"];
    const region = regions.find(r => new RegExp(`\\b${r}\\b`, "i").test(clean));
  
    // simple Claims: Sätze > 8 Wörter
    const claims = clean
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.split(/\s+/).length >= 8)
      .slice(0, 5);
  
    return { title, region, claims };
  }
  