import { prisma } from "@db-core";

export async function getDomain(url: string): Promise<string> {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export async function getTrust(domain: string): Promise<{ score: number; flagged: boolean }> {
  const sourceTrust = (prisma as any).sourceTrust;
  if (!sourceTrust?.findUnique) return { score: 50, flagged: false };
  const row = await sourceTrust.findUnique({ where: { domain } });
  if (!row) return { score: 50, flagged: false };
  return { score: row.bayesScore, flagged: row.flagged };
}

// Exponentially Weighted Moving Average-Update (stabiler als hartes Überschreiben)
export async function ewmaTrustUpdate(domain: string, observed: number, alpha = 0.2) {
  const sourceTrust = (prisma as any).sourceTrust;
  if (!sourceTrust?.findUnique) return;
  const existing = await sourceTrust.findUnique({ where: { domain } });
  if (!existing) {
    await sourceTrust.create({
      data: { domain, bayesScore: observed, flagged: observed < 30 },
    });
    return;
  }
  const next = Math.max(0, Math.min(100, (1 - alpha) * existing.bayesScore + alpha * observed));
  await sourceTrust.update({
    where: { domain },
    data: { bayesScore: next, flagged: next < 30 },
  });
}
