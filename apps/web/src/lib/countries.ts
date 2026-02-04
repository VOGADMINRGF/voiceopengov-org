import countries from "world-countries";

type CountryEntry = (typeof countries)[number];

export type CountryOption = {
  code: string;
  label: string;
};

const PRIORITY_CODES = ["DE", "AT", "CH", "LI", "LU"];
const EU_CODES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
];

function germanLabel(country: CountryEntry) {
  const translations = (country as any)?.translations;
  return (
    translations?.deu?.common ||
    translations?.deu?.official ||
    country.name.common
  );
}

export const COUNTRY_OPTIONS: CountryOption[] = (() => {
  const options = (countries as CountryEntry[])
    .map((country) => ({
      code: country.cca2,
      label: germanLabel(country),
    }))
    .filter((entry) => Boolean(entry.code) && Boolean(entry.label));

  const byCode = new Map(options.map((entry) => [entry.code, entry]));
  const orderedCodes = [
    "DE",
    ...PRIORITY_CODES.filter((code) => code !== "DE"),
    ...EU_CODES.filter((code) => code !== "DE" && !PRIORITY_CODES.includes(code)),
  ];

  const ordered: CountryOption[] = [];
  const used = new Set<string>();
  orderedCodes.forEach((code) => {
    const entry = byCode.get(code);
    if (entry && !used.has(code)) {
      ordered.push(entry);
      used.add(code);
    }
  });

  const rest = options
    .filter((entry) => !used.has(entry.code))
    .sort((a, b) => a.label.localeCompare(b.label, "de"));

  return [...ordered, ...rest];
})();

const countryIndex = new Map(
  (countries as CountryEntry[]).map((country) => [country.cca2, country]),
);

export function getCountryMeta(code: string) {
  return countryIndex.get(code.toUpperCase());
}
