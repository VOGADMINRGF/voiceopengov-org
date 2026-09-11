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
  // Translation is an enhancement, never an availability dependency. A malformed
  // provider/cache response must not take the membership entry page offline.
  const fallbackCopy = locale === "en" ? HOME_RELAUNCH_COPY.en : HOME_RELAUNCH_COPY.de;
  const homeCopy = home?.value ?? fallbackCopy;
  const contactEmail =
    process.env.VOG_MEMBERSHIP_CONTACT_EMAIL || "members@voiceopengov.org";
  const supportBank = {
    recipient: process.env.VOG_PAYMENT_BANK_RECIPIENT,
    iban: process.env.VOG_PAYMENT_BANK_IBAN,
    bic: process.env.VOG_PAYMENT_BANK_BIC,
    bank: process.env.VOG_PAYMENT_BANK_NAME,
    referencePrefix: process.env.VOG_PAYMENT_REFERENCE_PREFIX,
  };

  return (
    <>
      <TranslationStatusNotice
        locale={locale}
        status={home?.status ?? "missing"}
      />
      <HomeClient
        supportBank={supportBank}
        contactEmail={contactEmail}
        copy={homeCopy}
        renderedLocale={home?.renderedLocale ?? locale}
      />
      <RegionalActivationTeaser />
      <HomeDiscoverabilityLinks locale={locale} />
    </>
  );
}
