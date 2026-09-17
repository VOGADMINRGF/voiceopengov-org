// E200: Public root layout with locale bootstrap and consent banner.
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import "./globals.css";
import "./brand-ci.css";
import { LocaleProvider } from "@/context/LocaleContext";
import {
  DEFAULT_LOCALE,
  REQUIRED_LAUNCH_LOCALES,
  getLocaleConfig,
  getTextDirection,
  type SupportedLocale,
  isSupportedLocale,
} from "@/config/locales";
import { SiteHeader } from "./(components)/SiteHeader";
import { getPrivacyStrings } from "./privacyStrings";
import { VogCookieBanner } from "@/components/privacy/VogCookieBanner";
import { CONSENT_COOKIE_NAME, parseConsentCookie } from "@/lib/privacy/consent";
import SiteFooter from "@/components/SiteFooter";
import StructuredData from "@/components/seo/StructuredData";
import { VOICEOPENGOV_URL } from "@/config/links";
import { getRequestLocale } from "@/lib/locale";
import {
  localeAlternates,
  localizedCanonicalUrl,
} from "@/lib/i18n/localeContract";

const META: Partial<
  Record<SupportedLocale, { title: string; description: string; skip: string }>
> = {
  de: {
    title: "VoiceOpenGov | Bürgerbeteiligung & regionale Repräsentation",
    description:
      "VoiceOpenGov verbindet Bürgerbeteiligung mit regionaler Präsenz: eDebatte-Entscheidungen nachvollziehbar machen, Mehrheiten vertreten und Umsetzung sichtbar halten.",
    skip: "Zum Inhalt",
  },
  en: {
    title: "VoiceOpenGov | Civic participation & regional representation",
    description:
      "VoiceOpenGov links civic participation with local presence: trace eDebatte decisions, represent valid majorities and make political implementation visible.",
    skip: "Skip to content",
  },
  fr: {
    title: "VoiceOpenGov | Participation citoyenne & représentation régionale",
    description:
      "VoiceOpenGov relie participation citoyenne et présence locale : décisions eDebatte traçables, majorités représentées et mise en œuvre politique visible.",
    skip: "Aller au contenu",
  },
  es: {
    title: "VoiceOpenGov | Participación ciudadana y representación regional",
    description:
      "VoiceOpenGov conecta participación ciudadana y presencia local: decisiones de eDebatte trazables, mayorías representadas e implementación política visible.",
    skip: "Ir al contenido",
  },
  tr: {
    title: "VoiceOpenGov | Yurttaş katılımı ve bölgesel temsil",
    description:
      "VoiceOpenGov yurttaş katılımını yerel varlıkla birleştirir: eDebatte kararlarını izlenebilir kılar, geçerli çoğunluğu temsil eder ve uygulamayı görünür tutar.",
    skip: "İçeriğe geç",
  },
  ar: {
    title: "VoiceOpenGov | المشاركة المدنية والتمثيل الإقليمي",
    description:
      "تربط VoiceOpenGov المشاركة المدنية بالحضور المحلي: قرارات eDebatte قابلة للتتبع، وتمثيل للأغلبية المعتمدة، ومتابعة شفافة للتنفيذ السياسي.",
    skip: "الانتقال إلى المحتوى",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = META[locale] ?? META.en!;
  const canonical = localizedCanonicalUrl(VOICEOPENGOV_URL, locale);

  return {
    metadataBase: new URL(VOICEOPENGOV_URL),
    applicationName: "VoiceOpenGov",
    category: "Civic participation",
    title: {
      default: copy.title,
      template: "%s | VoiceOpenGov",
    },
    description: copy.description,
    alternates: {
      canonical,
      languages: localeAlternates(VOICEOPENGOV_URL, REQUIRED_LAUNCH_LOCALES),
    },
    openGraph: {
      type: "website",
      siteName: "VoiceOpenGov",
      title: copy.title,
      description: copy.description,
      url: canonical,
      locale: getLocaleConfig(locale).bcp47.replace("-", "_"),
    },
    twitter: {
      card: "summary",
      title: copy.title,
      description: copy.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport = {
  themeColor: "#020617",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLocale = await detectInitialLocale(cookieStore);
  const initialConsent = parseConsentCookie(
    cookieStore.get(CONSENT_COOKIE_NAME)?.value,
  );
  const privacyStrings = getPrivacyStrings(initialLocale);
  const meta = META[initialLocale] ?? META.en!;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${VOICEOPENGOV_URL}/#organization`,
      name: "VoiceOpenGov",
      url: `${VOICEOPENGOV_URL}/`,
      description: meta.description,
      knowsAbout: [
        "civic participation",
        "democratic decision-making",
        "regional political representation",
        "transparent political implementation",
        "majority and minority positions",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${VOICEOPENGOV_URL}/#website`,
      name: "VoiceOpenGov",
      url: `${VOICEOPENGOV_URL}/`,
      description: meta.description,
      publisher: { "@id": `${VOICEOPENGOV_URL}/#organization` },
      inLanguage: REQUIRED_LAUNCH_LOCALES.map(
        (locale) => getLocaleConfig(locale).bcp47,
      ),
    },
  ];

  return (
    <html
      lang={initialLocale}
      dir={getTextDirection(initialLocale)}
      className="h-full"
    >
      <body className="min-h-screen bg-[#020617] text-[#f8fafc] antialiased">
        <StructuredData data={structuredData} />
        <LocaleProvider initialLocale={initialLocale}>
          <div className="flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="fixed start-4 top-4 z-[70] -translate-y-24 rounded-full bg-[#18cfc8] px-4 py-2 font-bold text-[#071727] transition focus:translate-y-0"
            >
              {meta.skip}
            </a>
            <SiteHeader />
            <div id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </div>
            <SiteFooter locale={initialLocale} />
            <div className="h-[env(safe-area-inset-bottom)]" />
            <VogCookieBanner
              strings={privacyStrings}
              initialConsent={initialConsent}
            />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}

async function detectInitialLocale(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<SupportedLocale> {
  const headerStore = await headers();
  const routedLocale = headerStore.get("x-vog-locale");
  if (isSupportedLocale(routedLocale)) return routedLocale;

  const cookieLocale = cookieStore.get("lang")?.value;
  if (isSupportedLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = headerStore.get("accept-language");
  if (acceptLanguage) {
    const candidates = acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0]?.trim())
      .filter(Boolean);

    for (const candidate of candidates) {
      const short = candidate?.slice(0, 2).toLowerCase();
      if (isSupportedLocale(short)) return short;
    }
  }

  return DEFAULT_LOCALE;
}
