import countries from "world-countries";

type CountryEntry = (typeof countries)[number];

export type CountryOption = {
  code: string;
  label: string;
};

export const COUNTRY_OPTIONS: CountryOption[] = (countries as CountryEntry[])
  .map((country) => ({
    code: country.cca2,
    label: country.name.common,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const countryIndex = new Map(
  (countries as CountryEntry[]).map((country) => [country.cca2, country]),
);

export function getCountryMeta(code: string) {
  return countryIndex.get(code.toUpperCase());
}
