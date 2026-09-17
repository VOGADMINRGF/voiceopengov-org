import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";
import { REQUIRED_LAUNCH_LOCALES, getLocaleConfig } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";
import { REGIONAL_SEO_COPY, regionalSeoLocale } from "@/content/regionalSeo";
import {
  localeAlternates,
  localizedCanonicalUrl,
} from "@/lib/i18n/localeContract";
import { getRequestLocale } from "@/lib/locale";

const PATH = "/regionen";

function href(path: string, locale: string) {
  const url = new URL(path, VOICEOPENGOV_URL);
  if (locale !== "de") url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}

function regionalParticipationHref(locale: string) {
  const url = new URL("/mitmachen", VOICEOPENGOV_URL);
  if (locale !== "de") url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}#vor-ort`;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = regionalSeoLocale(await getRequestLocale());
  const copy = REGIONAL_SEO_COPY[locale].hub;
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
    twitter: {
      card: "summary",
      title: copy.title,
      description: copy.intro,
    },
  };
}

export default async function RegionsPage() {
  const locale = regionalSeoLocale(await getRequestLocale());
  const copy = REGIONAL_SEO_COPY[locale].hub;
  const baseCanonical = `${VOICEOPENGOV_URL}${PATH}`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
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
        "@type": "Thing",
        name: "Regional civic participation and representation",
      },
      hasPart: [
        {
          "@type": "WebPage",
          name: copy.germanyTitle,
          url: `${VOICEOPENGOV_URL}/regionen/deutschland`,
        },
        {
          "@type": "WebPage",
          name: copy.berlinTitle,
          url: `${VOICEOPENGOV_URL}/regionen/deutschland/berlin`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "VoiceOpenGov",
          item: `${VOICEOPENGOV_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: copy.eyebrow,
          item: canonical,
        },
      ],
    },
  ];

  return (
    <main className="bg-[#020617] text-[#f8fafc]">
      <StructuredData data={structuredData} />
      <TranslationStatusNotice
        locale={locale}
        status={getLocaleConfig(locale).defaultTranslationStatus}
      />
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#18cfc8]">
          {copy.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {copy.intro}
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18cfc8]">Country hub</p>
            <h2 className="mt-3 text-3xl font-bold">{copy.germanyTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.germanyText}</p>
            <Link
              className="mt-6 inline-flex rounded-full bg-[#18cfc8] px-5 py-3 font-bold text-[#071727]"
              href={href("/regionen/deutschland", locale)}
            >
              {copy.germanyTitle} →
            </Link>
          </article>

          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1a8cff]">Regional hub</p>
            <h2 className="mt-3 text-3xl font-bold">{copy.berlinTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.berlinText}</p>
            <Link
              className="mt-6 inline-flex rounded-full border border-[#1a8cff] px-5 py-3 font-bold text-[#f8fafc]"
              href={href("/regionen/deutschland/berlin", locale)}
            >
              {copy.berlinTitle} →
            </Link>
          </article>
        </div>

        <div className="mt-10">
          <Link
            className="inline-flex rounded-full bg-[#1a8cff] px-6 py-3 font-bold text-white"
            href={regionalParticipationHref(locale)}
          >
            {copy.action}
          </Link>
        </div>
      </section>
    </main>
  );
}
