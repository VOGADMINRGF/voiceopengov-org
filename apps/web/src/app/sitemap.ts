import { REQUIRED_LAUNCH_LOCALES, getLocaleConfig } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";

const PUBLIC_PATHS = [
  "",
  "/fragen",
  "/transparenz",
  "/mitmachen",
  "/mitmachen/rollen",
  "/regionen",
  "/regionen/deutschland",
  "/regionen/deutschland/berlin",
  "/thesen/ricky-gerd-fleischer",
] as const;

function localizedUrl(path: string, locale: string) {
  const url = new URL(`${VOICEOPENGOV_URL}${path}`);
  url.searchParams.set("lang", locale);
  return url.toString();
}

export default function sitemap() {
  const now = new Date();

  return PUBLIC_PATHS.map((path, index) => {
    const canonical = `${VOICEOPENGOV_URL}${path}`;
    const languages = Object.fromEntries(
      REQUIRED_LAUNCH_LOCALES.map((locale) => [
        getLocaleConfig(locale).bcp47,
        localizedUrl(path, locale),
      ]),
    );

    return {
      url: canonical,
      lastModified: now,
      changeFrequency: index === 0 ? "weekly" : "monthly",
      priority: index === 0 ? 1 : path.startsWith("/regionen") ? 0.8 : 0.7,
      alternates: {
        languages: {
          ...languages,
          "x-default": canonical,
        },
      },
    };
  });
}
