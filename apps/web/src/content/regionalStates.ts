export type GermanStateRegion = {
  slug: string;
  name: string;
  type: "city-state" | "state";
};

export const GERMAN_STATE_REGIONS: readonly GermanStateRegion[] = [
  { slug: "baden-wuerttemberg", name: "Baden-Württemberg", type: "state" },
  { slug: "bayern", name: "Bayern", type: "state" },
  { slug: "berlin", name: "Berlin", type: "city-state" },
  { slug: "brandenburg", name: "Brandenburg", type: "state" },
  { slug: "bremen", name: "Bremen", type: "city-state" },
  { slug: "hamburg", name: "Hamburg", type: "city-state" },
  { slug: "hessen", name: "Hessen", type: "state" },
  { slug: "mecklenburg-vorpommern", name: "Mecklenburg-Vorpommern", type: "state" },
  { slug: "niedersachsen", name: "Niedersachsen", type: "state" },
  { slug: "nordrhein-westfalen", name: "Nordrhein-Westfalen", type: "state" },
  { slug: "rheinland-pfalz", name: "Rheinland-Pfalz", type: "state" },
  { slug: "saarland", name: "Saarland", type: "state" },
  { slug: "sachsen", name: "Sachsen", type: "state" },
  { slug: "sachsen-anhalt", name: "Sachsen-Anhalt", type: "state" },
  { slug: "schleswig-holstein", name: "Schleswig-Holstein", type: "state" },
  { slug: "thueringen", name: "Thüringen", type: "state" },
] as const;

export function getGermanStateRegion(slug: string) {
  return GERMAN_STATE_REGIONS.find((region) => region.slug === slug);
}
