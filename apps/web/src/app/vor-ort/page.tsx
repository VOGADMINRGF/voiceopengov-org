import Link from "next/link";
import { getRequestLocale } from "@/lib/locale";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";
import { getTranslatedBundle } from "@/lib/i18n/getTranslatedBundle";
import { VOG_ROLES_PATH } from "@/config/links";
import RegionalInterestForm from "./RegionalInterestForm";
import { getRegionalActivationStrings } from "./strings";

async function getPageBundle() {
  const locale = await getRequestLocale();
  const bundle = await getTranslatedBundle({
    locale,
    original: getRegionalActivationStrings("de"),
    reviewedEnglish: getRegionalActivationStrings("en"),
  });
  return { locale, bundle };
}

export async function generateMetadata() {
  const { bundle } = await getPageBundle();
  return {
    ...bundle.value.meta,
    title: bundle.value.meta.title.replace(/\s*\|\s*VoiceOpenGov$/, ""),
  };
}

export default async function RegionalActivationPage() {
  const { locale, bundle } = await getPageBundle();
  const strings = bundle.value;

  return (
    <>
      <TranslationStatusNotice locale={locale} status={bundle.status} />
      <main className="min-h-screen bg-[#07110f] text-[#f4f1e8]">
        <section className="border-b border-[#f4f1e8]/10 bg-[radial-gradient(circle_at_78%_12%,rgba(214,255,101,0.16),transparent_34%)]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#d6ff65]">
              {strings.page.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.045em] md:text-6xl">
              {strings.page.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#f4f1e8]/66">
              {strings.page.intro}
            </p>
            <p className="mt-5 max-w-3xl rounded-2xl border border-[#d6ff65]/20 bg-[#d6ff65]/8 px-5 py-4 leading-7 text-[#f4f1e8]/72">
              {strings.page.promise}
            </p>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {strings.page.steps.map((step) => (
                <article
                  key={step.title}
                  className="rounded-3xl border border-[#f4f1e8]/10 bg-[#0b1714] p-5"
                >
                  <h2 className="font-black text-[#d6ff65]">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#f4f1e8]/55">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:py-24">
          <div className="space-y-5">
            <article className="rounded-3xl border border-[#f4f1e8]/10 bg-[#0b1714] p-6">
              <h2 className="text-2xl font-black tracking-[-0.03em]">
                {strings.page.todayTitle}
              </h2>
              <p className="mt-3 leading-7 text-[#f4f1e8]/58">
                {strings.page.todayBody}
              </p>
            </article>
            <article className="rounded-3xl border border-[#f4f1e8]/10 bg-[#0b1714] p-6">
              <h2 className="text-2xl font-black tracking-[-0.03em]">
                {strings.page.laterTitle}
              </h2>
              <p className="mt-3 leading-7 text-[#f4f1e8]/58">
                {strings.page.laterBody}
              </p>
            </article>
            <article className="rounded-3xl border border-[#d6ff65]/22 bg-[#d6ff65]/7 p-6">
              <h2 className="text-2xl font-black tracking-[-0.03em]">
                {strings.page.responsibilityTitle}
              </h2>
              <p className="mt-3 leading-7 text-[#f4f1e8]/62">
                {strings.page.responsibilityBody}
              </p>
            </article>
            <Link
              href={VOG_ROLES_PATH}
              className="inline-flex rounded-full border border-[#f4f1e8]/18 px-5 py-3 font-bold transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]"
            >
              {strings.page.rolesLink}
            </Link>
          </div>

          <RegionalInterestForm strings={strings} />
        </section>
      </main>
    </>
  );
}
