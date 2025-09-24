export const LOCALES = ["de", "en", "fr"] as const;
export type Locale = typeof LOCALES[number];

export const isLocale = (v?: string): v is Locale =>
  !!v && LOCALES.includes(v as Locale);

export const labelForLocale = (l: Locale) =>
  ({ de: "Deutsch", en: "English", fr: "Français" } as const)[l];

export const flagForLocale = (l: Locale) =>
  // system-emoji flags (leicht & performant)
  ({ de: "🇩🇪", en: "🇬🇧", fr: "🇫🇷" } as const)[l];
