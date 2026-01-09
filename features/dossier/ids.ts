import { safeRandomId } from "@core/utils/random";

export function makeDossierEntityId(prefix: string) {
  return `${prefix}_${safeRandomId()}`;
}
