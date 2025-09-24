// src/libs/countries/index.ts
export type Country = { code: string; label: string };

// Auszug – erweiterbar
const COUNTRY_CODES = [
  "DE","AT","CH","FR","IT","ES","PT","NL","BE","LU","DK","SE","NO","FI","IE","GB",
  "PL","CZ","SK","HU","SI","HR","RO","BG","GR","TR",
  "US","CA","MX","BR","AR","CL",
  "AU","NZ","JP","KR","CN","IN","SG","AE","ZA"
];

export function getCountries(locale: string = "de-DE"): Country[] {
  const dn = new Intl.DisplayNames([locale], { type: "region" });
  return COUNTRY_CODES.map((code) => ({
    code,
    label: dn.of(code) ?? code
  }));
}

// Für Defaults (sauberer Fallback)
export function defaultCountryForLocale(locale: string): string {
  const l = locale.toLowerCase();
  if (l.startsWith("de")) return "DE";
  if (l.startsWith("fr")) return "FR";
  if (l.startsWith("it")) return "IT";
  if (l.startsWith("es")) return "ES";
  if (l.startsWith("en")) return "US";
  return "DE";
}
