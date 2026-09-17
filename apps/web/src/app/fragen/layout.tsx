import type { Metadata } from "next";
import { REQUIRED_LAUNCH_LOCALES } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";
import { getRequestLocale } from "@/lib/locale";
import { localeAlternates, localizedCanonicalUrl } from "@/lib/i18n/localeContract";

const COPY = {
  de: {
    title: "50 Kernfragen: dynamischer Programmstand",
    description:
      "50 Themenanker für eDebatte und den dynamischen VoiceOpenGov-Programmstand – offen für konkrete Unterfragen, neue Evidenz und veränderte Mehrheiten.",
  },
  en: {
    title: "50 core questions: a dynamic program",
    description:
      "50 topic anchors for eDebatte and VoiceOpenGov's dynamic program state, open to concrete subquestions, new evidence and changing majorities.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = locale === "de" ? COPY.de : COPY.en;
  const baseCanonical = `${VOICEOPENGOV_URL}/fragen`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);
  return {
    alternates: {
      canonical,
      languages: localeAlternates(baseCanonical, REQUIRED_LAUNCH_LOCALES),
    },
    openGraph: {
      title: `${copy.title} | VoiceOpenGov`,
      description: copy.description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${copy.title} | VoiceOpenGov`,
      description: copy.description,
    },
  };
}

export default function QuestionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
