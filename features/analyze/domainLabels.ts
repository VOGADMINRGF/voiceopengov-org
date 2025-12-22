import type { StatementRecord } from "./schemas";

export const DOMAIN_KEYS = [
  "gesellschaft",
  "nachbarschaft",
  "aussenbeziehungen_nachbarlaender",
  "aussenbeziehungen_eu",
  "aussenbeziehungen_schengen",
  "aussenbeziehungen_g7",
  "aussenbeziehungen_g20",
  "aussenbeziehungen_un",
  "aussenbeziehungen_nato",
  "aussenbeziehungen_oecd",
  "aussenbeziehungen_global",
  "innenpolitik",
  "wirtschaft",
  "bildung",
  "gesundheit",
  "sicherheit",
  "klima_umwelt",
  "digitales",
  "infrastruktur",
  "justiz",
  "kultur_medien",
  "sonstiges",
] as const;

export type DomainKey = (typeof DOMAIN_KEYS)[number];

export const DOMAIN_LABELS: Record<DomainKey, string> = {
  gesellschaft: "Gesellschaft",
  nachbarschaft: "Nachbarschaft",
  aussenbeziehungen_nachbarlaender: "Nachbarländer-Beziehungen",
  aussenbeziehungen_eu: "EU / Europa (auch aus Distanz)",
  aussenbeziehungen_schengen: "Schengen / Freizügigkeit",
  aussenbeziehungen_g7: "G7",
  aussenbeziehungen_g20: "G20",
  aussenbeziehungen_un: "UN / UNO",
  aussenbeziehungen_nato: "NATO",
  aussenbeziehungen_oecd: "OECD",
  aussenbeziehungen_global: "International / Global",
  innenpolitik: "Innenpolitik",
  wirtschaft: "Wirtschaft",
  bildung: "Bildung",
  gesundheit: "Gesundheit",
  sicherheit: "Sicherheit",
  klima_umwelt: "Klima & Umwelt",
  digitales: "Digitales",
  infrastruktur: "Infrastruktur",
  justiz: "Justiz",
  kultur_medien: "Kultur & Medien",
  sonstiges: "Sonstiges",
};

export function labelDomain(key?: string | null): string {
  if (!key) return "";
  return DOMAIN_LABELS[key as DomainKey] ?? key;
}

export function statementDomainKeys(s: Pick<StatementRecord, "domains" | "domain">): string[] {
  const arr =
    (Array.isArray(s.domains) && s.domains.length ? s.domains : null) ??
    (typeof s.domain === "string" && s.domain.trim() ? [s.domain.trim()] : null) ??
    [];
  return arr
    .filter((x) => typeof x === "string")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function statementDomainLabels(s: Pick<StatementRecord, "domains" | "domain">): string[] {
  return statementDomainKeys(s).map(labelDomain);
}

export const EDITORIAL_DOMAIN_GUIDE = `
Redaktionelle Zuordnung (domain/domains):
- Nutze bevorzugt einen dieser Keys (klein, mit underscore):
  gesellschaft | nachbarschaft |
  aussenbeziehungen_nachbarlaender | aussenbeziehungen_eu | aussenbeziehungen_schengen |
  aussenbeziehungen_g7 | aussenbeziehungen_g20 | aussenbeziehungen_un | aussenbeziehungen_nato |
  aussenbeziehungen_oecd | aussenbeziehungen_global |
  innenpolitik | wirtschaft | bildung | gesundheit | sicherheit | klima_umwelt | digitales |
  infrastruktur | justiz | kultur_medien | sonstiges

Definitionen (wichtig):
- gesellschaft: gesellschaftlicher Zusammenhalt, Teilhabe, Soziales, Gleichstellung, Integration, Kultur des Miteinanders.
- nachbarschaft: unmittelbares Umfeld/Quartier, Nachbarschaftskonflikte, lokale Gemeinschaft, Wohnumfeld, direkte lokale Interaktion.
- aussenbeziehungen_nachbarlaender: Beziehungen/Abkommen/Konflikte/Kooperationen mit konkreten Nachbarstaaten (nicht pauschal EU).
- aussenbeziehungen_eu: EU-Institutionen, EU-Recht, EU-Programme, EU-Verordnungen (auch aus Drittstaaten-Perspektive).
- aussenbeziehungen_schengen: Schengen-Raum, Freizügigkeit, Grenzregime.
- aussenbeziehungen_g7/g20/un/nato/oecd/global: internationale Ebene, spez. Bündnisse/Foren.

Wenn mehrere passen:
- setze domains als Array (z.B. ["gesellschaft","aussenbeziehungen_nachbarlaender"]).
- setze domain als primäre (domains[0]).
`.trim();
