export type GermanStateRegion = {
  slug: string;
  name: string;
  type: "city-state" | "state";
  communityStatus: "building";
  searchVisibility: "index" | "noindex";
};

export const GERMAN_STATE_REGIONS: readonly GermanStateRegion[] = [
  { slug: "baden-wuerttemberg", name: "Baden-Württemberg", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "bayern", name: "Bayern", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "berlin", name: "Berlin", type: "city-state", communityStatus: "building", searchVisibility: "index" },
  { slug: "brandenburg", name: "Brandenburg", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "bremen", name: "Bremen", type: "city-state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "hamburg", name: "Hamburg", type: "city-state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "hessen", name: "Hessen", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "mecklenburg-vorpommern", name: "Mecklenburg-Vorpommern", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "niedersachsen", name: "Niedersachsen", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "nordrhein-westfalen", name: "Nordrhein-Westfalen", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "rheinland-pfalz", name: "Rheinland-Pfalz", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "saarland", name: "Saarland", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "sachsen", name: "Sachsen", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "sachsen-anhalt", name: "Sachsen-Anhalt", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "schleswig-holstein", name: "Schleswig-Holstein", type: "state", communityStatus: "building", searchVisibility: "noindex" },
  { slug: "thueringen", name: "Thüringen", type: "state", communityStatus: "building", searchVisibility: "noindex" },
] as const;

export function getGermanStateRegion(slug: string) {
  return GERMAN_STATE_REGIONS.find((region) => region.slug === slug);
}
