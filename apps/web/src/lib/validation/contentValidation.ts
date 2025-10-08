// apps/web/src/lib/validation/contentValidation.ts
import { ContentKind, RegionMode, Locale } from "@db-web";

// ---- Types ----
export type AnswerOptionInput = {
  id?: string;
  label: string;
  value: string;
  exclusive?: boolean;
  order?: number;
};

export interface ValidationResult {
  ok: boolean;
  errors?: Array<{ field: string; code: string; message: string }>;
  // abgeleitete Felder für Auto-Regionen etc.
  regionAuto?: { country?: string | null; regionCode?: string | null } | null;
}

export interface ItemDraftInput {
  kind: ContentKind;
  text: string;
  topicId: string;
  regionMode: RegionMode;
  regionManualId?: string | null;
  publishAt?: string | Date | null;
  expireAt?: string | Date | null;
  locale?: Locale | string;
  answerOptions?: AnswerOptionInput[];
}

// ---- Helpers ----
function toDate(v: unknown): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
}
function isNonEmpty(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}
function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// ---- Core validation ----
export async function validateItemDraft(input: ItemDraftInput): Promise<ValidationResult> {
  const errors: ValidationResult["errors"] = [];

  // kind
  if (!Object.values(ContentKind).includes(input.kind)) {
    errors.push({ field: "kind", code: "INVALID_KIND", message: "Ungültiger Content-Typ." });
  }

  // text
  if (!isNonEmpty(input.text)) {
    errors.push({ field: "text", code: "REQUIRED", message: "Text darf nicht leer sein." });
  } else if (input.text.length > 10_000) {
    errors.push({ field: "text", code: "TOO_LONG", message: "Text ist zu lang (max. 10.000 Zeichen)." });
  }

  // topicId
  if (!isNonEmpty(input.topicId)) {
    errors.push({ field: "topicId", code: "REQUIRED", message: "Topic ist erforderlich." });
  }

  // region
  if (!Object.values(RegionMode).includes(input.regionMode)) {
    errors.push({ field: "regionMode", code: "INVALID_REGION_MODE", message: "Ungültiger Regionsmodus." });
  }
  if (input.regionMode === RegionMode.MANUAL && !isNonEmpty(input.regionManualId)) {
    errors.push({ field: "regionManualId", code: "REQUIRED", message: "Manuelle Region ist erforderlich." });
  }

  // publish/expire
  const publishAt = toDate(input.publishAt);
  const expireAt = toDate(input.expireAt);
  if (publishAt && expireAt && publishAt.getTime() >= expireAt.getTime()) {
    errors.push({ field: "expireAt", code: "RANGE", message: "expireAt muss nach publishAt liegen." });
  }

  // locale (optional, aber wenn gesetzt, prüfen)
  if (input.locale && !Object.values(Locale as any).includes(input.locale as any)) {
    errors.push({ field: "locale", code: "INVALID_LOCALE", message: "Ungültiges Locale." });
  }

  // answerOptions (für SWIPE/SUNDAY_POLL etc. sinnvoll)
  if (Array.isArray(input.answerOptions)) {
    const opts = input.answerOptions;
    if (opts.length === 0) {
      errors.push({ field: "answerOptions", code: "EMPTY", message: "Mindestens eine Option erforderlich." });
    }
    const vals = opts.map(o => (o.value ?? "").toString().trim()).filter(Boolean);
    const labels = opts.map(o => (o.label ?? "").toString().trim()).filter(Boolean);
    if (uniq(vals).length !== vals.length) {
      errors.push({ field: "answerOptions", code: "DUP_VALUE", message: "Option-Werte müssen eindeutig sein." });
    }
    if (uniq(labels).length !== labels.length) {
      errors.push({ field: "answerOptions", code: "DUP_LABEL", message: "Option-Labels müssen eindeutig sein." });
    }
  }

  // regionAuto – hier ggf. Geo-Logik einhängen; Dummy vorerst:
  const regionAuto = input.regionMode === RegionMode.AUTO ? { country: null, regionCode: null } : null;

  return {
    ok: !errors.length,
    errors: errors.length ? errors : undefined,
    regionAuto,
  };
}

// ---- Wrapper, damit bestehende Call-Sites kompatibel bleiben ----
export function validateContentItem(input: ItemDraftInput): Promise<ValidationResult> {
  return validateItemDraft(input);
}
export const validateCreateItem = validateContentItem;
export const validateUpdateItem = validateContentItem;

export function sanitizeContentItem<T>(x: T): T {
  return x;
}

export default {
  validateItemDraft,
  validateContentItem,
  validateCreateItem,
  validateUpdateItem,
  sanitizeContentItem,
};
