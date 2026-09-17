import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";
import { REQUIRED_LAUNCH_LOCALES, getLocaleConfig } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";
import { REGIONAL_SEO_COPY, regionalSeoLocale } from "@/content/regionalSeo";
import { GERMANY_STATE_REGIONS, REGION_DIRECTORY_COPY } from "@/content/germanyRegions";
import {
  localeAlternates,
  localizedCanonicalUrl,
} from "@/lib/i18n/localeContract";
import { getRequestLocale } from "@/lib/locale";

const PATH = "/regionen/deutschland";

function href(path: string, locale: string) {
  const url = new URL(path, VOICEOPENGOV_URL);
  if (locale !== "de") url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = regionalSeoLocale(await getRequestLocale());
  const copy = REGIONAL_SEO_COPY[locale].germany;
  const baseCanonical = `${VOICEOPENGOV_URL}${PATH}`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);

  return {
    title: copy.title,
    description: copy.intro,
    alternates: {
      canonical,
      languages: localeAlternates(baseCanonical, REQUIRED_LAUNCH_LOCALES),
    },
    openGraph: {
      title: copy.title,
      description: copy.intro,
      url: canonical,
      type: "website",
    },
  };
}

export default async function GermanyRegionPage() {
  const requestLocale = await getRequestLocale();
  const locale = regionalSeoLocale(requestLocale);
  const copy = REGIONAL_SEO_COPY[locale].germany;
  const directoryCopy = REGION_DIRECTORY_COPY[requestLocale] ?? REGION_DIRECTORY_COPY.en;
  const baseCanonical = `${VOICEOPENGOV_URL}${PATH}`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);

  return (
    <main className="bg-[#020617] text-[#f8fafc]">
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${canonical}#page`,
            url: canonical,
            name: copy.title,
            description: copy.intro,
            inLanguage: getLocaleConfig(locale).bcp47,
            isPartOf: {
              "@type": "WebSite",
              "@id": `${VOICEOPENGOV_URL}/#website`,
              name: "VoiceOpenGov",
              url: `${VOICEOPENGOV_URL}/`,
            },
            about: {
              "@type": "Country",
              name: "Germany",
              alternateName: "Deutschland",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "VoiceOpenGov", item: `${VOICEOPENGOV_URL}/` },
              { "@type": "ListItem", position: 2, name: "Regionen", item: `${VOICEOPENGOV_URL}/regionen` },
              { "@type": "ListItem", position: 3, name: "Deutschland", item: canonical },
            ],
          },
        ]}
      />
      <TranslationStatusNotice
        locale={locale}
        status={getLocaleConfig(locale).defaultTranslationStatus}
      />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#18cfc8]">{copy.eyebrow}</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{copy.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro}</p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.whyTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.whyText}</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.modelTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.modelText}</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.guardrailTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.guardrailText}</p>
          </article>
        </div>

        <section className="mt-16" aria-labelledby="state-regions-title">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18cfc8]">Deutschland</p>
          <h2 id="state-regions-title" className="mt-3 text-3xl font-black sm:text-4xl">{directoryCopy.title}</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">{directoryCopy.intro}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GERMANY_STATE_REGIONS.map((region) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-white">{region.name}</h3>
                    <span
                      className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        region.status === "available" ? "bg-[#18cfc8]" : "bg-slate-600"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-300">
                    {region.status === "available" ? directoryCopy.available : directoryCopy.building}
                  </p>
                  {region.status === "building" ? (
                    <p className="mt-2 text-xs leading-5 text-slate-500">{directoryCopy.buildingDetail}</p>
                  ) : (
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#18cfc8]">{directoryCopy.openRegion} →</p>
                  )}
                </>
              );

              if (region.status === "available") {
                return (
                  <Link
                    key={region.slug}
                    href={href(`/regionen/deutschland/${region.slug}`, locale)}
                    className="rounded-2xl border border-[#18cfc8]/30 bg-[#0b1220] p-5 transition hover:border-[#18cfc8]/70"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <article key={region.slug} className="rounded-2xl border border-slate-800 bg-[#0b1220] p-5">
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[#18cfc8] px-6 py-3 font-bold text-[#071727]" href={href("/regionen/deutschland/berlin", locale)}>
            {copy.berlinAction} →
          </Link>
          <Link className="rounded-full border border-[#1a8cff] px-6 py-3 font-bold" href={href("/vor-ort", locale)}>
            {copy.regionalAction}
          </Link>
        </div>
      </section>
    </main>
  );
}
