export type Locale = 'de' | 'en' | 'fr';

const fromEnv = (key: string, fallback: string) =>
  (process.env[key] ?? fallback).toString();

export const locales = fromEnv('SUPPORTED_LOCALES', 'de,en,fr')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean) as Locale[];

export const defaultLocale = (fromEnv('DEFAULT_LOCALE', 'de') as Locale);

const i18n = { locales, defaultLocale } as const;
export default i18n;
