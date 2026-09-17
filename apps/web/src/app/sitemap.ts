import { REQUIRED_LAUNCH_LOCALES, getLocaleConfig } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";
import { GERMAN_STATE_REGIONS } from "@/content/regionalStates";

const STATIC_PUBLIC_PATHS = [
  "",
  "/fragen",
  "/transparenz",
  "/mitmachen",
  "/regionen",
  "/regionen/deutschland",
  "/thesen/ricky-gerd-fleischer",
  "/unterstuetzen",
] as const;

const PUBLIC_PATHS = [
  ...STATIC_PUBLIC_PATHS,
  ...GERMAN_STATE_REGIONS
    .filter((region) => region.searchVisibility === "index")
    .map((region) => `/regionen/deutschland/${region.slug}`),
];

function localizedUrl(path: string, locale: string) {
  const url = new URL(`${VOICEOPENGOV_URL}${path}`);
  url.searchParams.set("lang", locale);
  return url.toString();
}

export default function sitemap() {
  return PUBLIC_PATHS.map((path) => {
    const canonical = `${VOICEOPENGOV_URL}${path}`;
    const languages = Object.fromEntries(
      REQUIRED_LAUNCH_LOCALES.map((locale) => [
        getLocaleConfig(locale).bcp47,
        localizedUrl(path, locale),
      ]),
    );

    return {
      url: canonical,
      alternates: {
        languages: {
          ...languages,
          "x-default": canonical,
        },
      },
    };
  });
}
