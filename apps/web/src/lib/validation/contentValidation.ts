// apps/web/src/lib/validation/contentValidation.ts
import type { ContentKind, RegionMode } from "@prisma/client";
import {
  validateItemDraft,
  type ValidationResult,
} from "@/server/validation/contentValidation";

// Typen exportieren, damit Call-Sites sie weiterverwenden können
export type { ValidationResult } from "@/server/validation/contentValidation";

/**
 * Kompatible Wrapper-Funktion: bisheriger Import erwartet meist
 * `validateContentItem`/`validateCreateItem`/`validateUpdateItem`.
 * Intern delegieren wir auf deine Server-Validierung `validateItemDraft`.
 */
export function validateContentItem(input: {
  kind: ContentKind;
  text: string;
  topicId: string;
  regionMode: RegionMode;
  regionManualId?: string | null;
  publishAt?: string | Date | null;
  expireAt?: string | Date | null;
  locale?: string;
  answerOptions?: Array<{
    id?: string;
    label: string;
    value: string;
    exclusive?: boolean;
    order?: number;
  }>;
}): Promise<ValidationResult> {
  return validateItemDraft(input);
}

// Alias-Namen, die ggf. an anderen Stellen genutzt werden
export const validateCreateItem = validateContentItem;
export const validateUpdateItem = validateContentItem;

// Falls Call-Sites etwas „sanitizen“ wollen – no-op passt meist
export function sanitizeContentItem<T>(x: T): T {
  return x;
}

// default + named Exports, deckt beide Import-Stile ab
export default {
  validateContentItem,
  validateCreateItem,
  validateUpdateItem,
  sanitizeContentItem,
};
