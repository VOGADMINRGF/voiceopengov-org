import HomeClient, { HOME_RELAUNCH_COPY } from "@/components/home/HomeClient";
import RegionalActivationTeaser from "@/components/home/RegionalActivationTeaser";
import HomeDiscoverabilityLinks from "@/components/home/HomeDiscoverabilityLinks";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";
import { getRequestLocale } from "@/lib/locale";
import { getTranslatedBundle } from "@/lib/i18n/getTranslatedBundle";

export default async function HomePage() {
  const locale = await getRequestLocale();
  const home = await getTranslatedBundle({
    locale,
    original: HOME_RELAUNCH_COPY.de,
    reviewedEnglish: HOME_RELAUNCH_COPY.en,
  });
  const fallbackCopy = locale === "en" ? HOME_RELAUNCH_COPY.en : HOME_RELAUNCH_COPY.de;
  const homeCopy = home?.value ?? fallbackCopy;

  return (
    <>
      <TranslationStatusNotice
        locale={locale}
        status={home?.status ?? "missing"}
      />
      <HomeClient
        copy={homeCopy}
        renderedLocale={home?.renderedLocale ?? locale}
      />
      <RegionalActivationTeaser />
      <HomeDiscoverabilityLinks locale={locale} />
    </>
  );
}
