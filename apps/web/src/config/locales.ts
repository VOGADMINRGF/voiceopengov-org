// apps/web/src/config/locales.ts

const CORE_LOCALES = ["de", "en"] as const;
const EXTENDED_LOCALES = ["fr", "pl", "es", "it", "tr", "ar", "ru", "zh"] as const;

export const SUPPORTED_LOCALES = [...CORE_LOCALES, ...EXTENDED_LOCALES] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "de";

export interface LocaleConfig {
  code: SupportedLocale;
  label: string;
  flagEmoji: string;
  defaultRegion?: string;
}

export const LOCALE_CONFIG: LocaleConfig[] = [
  { code: "de", label: "Deutsch", flagEmoji: "🇩🇪", defaultRegion: "DE" },
  { code: "en", label: "English", flagEmoji: "🇺🇳", defaultRegion: "EU" },
  { code: "fr", label: "Français", flagEmoji: "🇫🇷", defaultRegion: "FR" },
  { code: "pl", label: "Polski", flagEmoji: "🇵🇱", defaultRegion: "PL" },
  { code: "es", label: "Español", flagEmoji: "🇪🇸", defaultRegion: "ES" },
  { code: "it", label: "Italiano", flagEmoji: "🇮🇹", defaultRegion: "IT" },
  { code: "tr", label: "Türkçe", flagEmoji: "🇹🇷", defaultRegion: "TR" },
  { code: "ar", label: "العربية", flagEmoji: "🇦🇪", defaultRegion: "MENA" },
  { code: "ru", label: "Русский", flagEmoji: "🇷🇺", defaultRegion: "RU" },
  { code: "zh", label: "中文", flagEmoji: "🇨🇳", defaultRegion: "CN" },
];

export function getLocaleConfig(code: SupportedLocale): LocaleConfig {
  const cfg = LOCALE_CONFIG.find((item) => item.code === code);
  return (
    cfg ?? {
      code,
      label: code,
      flagEmoji: "🏳️",
      defaultRegion: undefined,
    }
  );
}

export function isSupportedLocale(locale: string | null | undefined): locale is SupportedLocale {
  return !!locale && (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export function isCoreLocale(locale: string | null | undefined): locale is SupportedLocale {
  return !!locale && (CORE_LOCALES as readonly string[]).includes(locale);
}

export function isExtendedLocale(locale: string | null | undefined): locale is SupportedLocale {
  return !!locale && (EXTENDED_LOCALES as readonly string[]).includes(locale);
}
