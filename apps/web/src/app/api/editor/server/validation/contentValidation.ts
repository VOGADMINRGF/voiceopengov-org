// apps/web/src/server/validation/contentValidation.ts
import { prisma } from "@/lib/prisma";
import { ContentKind, RegionMode } from "@prisma/client";

type AnswerOpt = { id?: string; label: string; value: string; exclusive?: boolean; order?: number };

export type ValidationResult = {
  errors: string[];
  warnings: string[];
  checks: Record<string, boolean>;
  regionAuto?: { candidates: Array<{ regionId: string; score: number }>; decidedRegionId?: string };
};

export async function validateItemDraft(input: {
  kind: ContentKind;
  text: string;
  topicId: string;
  regionMode: RegionMode;
  regionManualId?: string | null;
  publishAt?: string | Date | null;
  expireAt?: string | Date | null;
  locale?: string;
  answerOptions?: AnswerOpt[];
}): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks: Record<string, boolean> = {};

  // Required
  checks.hasText = !!input.text && input.text.trim().length >= 8;
  if (!checks.hasText) errors.push("Text zu kurz (min. 8 Zeichen).");

  const topic = await prisma.topic.findUnique({ where: { id: input.topicId } });
  checks.topicExists = !!topic;
  if (!checks.topicExists) errors.push("Topic nicht gefunden.");

  // Kind-specific
  if (input.kind === "EVENT" || input.kind === "SUNDAY_POLL") {
    const opts = input.answerOptions ?? [];
    checks.hasOptions = opts.length >= 2;
    if (!checks.hasOptions) errors.push("Mindestens 2 Antwortoptionen erforderlich.");

    if (input.kind === "EVENT") {
      const hasExclusive = opts.some(o => o.exclusive === true);
      checks.hasExclusive = hasExclusive;
      if (!hasExclusive) errors.push("Mindestens eine exklusive Option für EVENT erforderlich.");
    }
  }

  // Schedule
  if (input.publishAt && input.expireAt) {
    const p = new Date(input.publishAt);
    const e = new Date(input.expireAt);
    checks.scheduleOrder = e.getTime() > p.getTime();
    if (!checks.scheduleOrder) errors.push("expireAt muss nach publishAt liegen.");
  }

  // Region
  let regionAuto: ValidationResult["regionAuto"] | undefined = undefined;
  if (input.regionMode === "MANUAL") {
    checks.hasManualRegion = !!input.regionManualId;
    if (!checks.hasManualRegion) errors.push("regionManualId fehlt (RegionMode=MANUAL).");
    else {
      const reg = await prisma.region.findUnique({ where: { id: input.regionManualId! } });
      checks.manualRegionExists = !!reg;
      if (!checks.manualRegionExists) errors.push("regionManualId ungültig.");
    }
  } else {
    regionAuto = await inferRegionFromText(input.text);
    checks.hasAutoCandidates = Array.isArray(regionAuto?.candidates) && regionAuto.candidates.length > 0;
    if (!checks.hasAutoCandidates) warnings.push("Keine Region-Kandidaten gefunden (AUTO).");
    const top = regionAuto?.candidates?.[0];
    if (top && top.score >= 0.75) regionAuto!.decidedRegionId = top.regionId;
  }

  return { errors, warnings, checks, regionAuto };
}

// Sehr pragmatische Heuristik (kann später durch NER/Geo-Resolver ersetzt werden)
async function inferRegionFromText(text: string) {
  const t = text.toLowerCase();
  const candidates: Array<{ regionId: string; score: number }> = [];

  if (/\bdeutschland\b|\bbund\b/.test(t)) candidates.push({ regionId: await regionIdByCode("DE"), score: 0.9 });
  if (/\bberlin\b/.test(t))               candidates.push({ regionId: await regionIdByCode("DE-BE"), score: 0.88 });
  if (/\bbayern\b/.test(t))               candidates.push({ regionId: await regionIdByCode("DE-BY"), score: 0.86 });
  if (/\beu\b|\beuropäische union\b/.test(t)) candidates.push({ regionId: await regionIdByCode("EU"), score: 0.8 });

  if (candidates.length === 0) candidates.push({ regionId: await regionIdByCode("WORLD"), score: 0.5 });

  // Score-Absteigend
  candidates.sort((a, b) => b.score - a.score);
  return { candidates };
}

async function regionIdByCode(code: string) {
  const known = await prisma.region.findFirst({ where: { code } });
  if (known) return known.id;
  const level = code === "WORLD" ? 0 : code === "EU" ? 1 : code.startsWith("DE-") ? 3 : code === "DE" ? 2 : 0;
  const created = await prisma.region.create({
    data: { code, name: code, level },
  });
  return created.id;
}
