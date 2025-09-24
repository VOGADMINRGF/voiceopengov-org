export type BundleKey = "press_kit" | "social_kit" | "flyer_pack" | "poster_pack" | "stand_kit";
export type Bundle = {
  key: BundleKey;
  title: string;
  description: string;
  price: number;      // EUR (brutto od. netto – textlich klären)
  per: "digital" | "per_versand";
  defaultQty?: number;
};

export const B2B_BUNDLES: Bundle[] = [
  { key: "press_kit",  title: "Presse-Kit (digital)",       description: "Vorlagen, Texte, Bildmaterial.", price: 0, per: "digital" },
  { key: "social_kit", title: "Social-Media-Kit (digital)",  description: "Assets + Guidelines.",           price: 0, per: "digital" },
  { key: "flyer_pack", title: "Flyer-Paket",                  description: "z. B. 250/500/1000 Stk.",       price: 29, per: "per_versand", defaultQty: 1 },
  { key: "poster_pack",title: "Poster-Paket",                 description: "A3/A2 Mix",                      price: 35, per: "per_versand", defaultQty: 1 },
  { key: "stand_kit",  title: "Stand-Kit (optional)",         description: "Mobiler Aufsteller + Info",     price: 149, per: "per_versand", defaultQty: 1 },
];
