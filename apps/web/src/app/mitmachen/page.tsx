import type { Metadata } from "next";
import MitmachenClient from "./MitmachenClient";
import { REQUIRED_LAUNCH_LOCALES, type SupportedLocale } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";
import { getRequestLocale } from "@/lib/locale";
import {
  localeAlternates,
  localizedCanonicalUrl,
} from "@/lib/i18n/localeContract";

const META: Partial<Record<SupportedLocale, { title: string; description: string }>> = {
  de: {
    title: "Mitmachen: regional etwas bewegen",
    description:
      "Bei VoiceOpenGov kostenfrei dabei sein, Nachbarn verbinden, regionale Anliegen sichtbar machen und eDebatte × VoiceOpenGov vor Ort mit aufbauen.",
  },
  en: {
    title: "Get involved locally",
    description:
      "Join VoiceOpenGov for free, connect neighbours, make local issues visible and help build regional eDebatte × VoiceOpenGov presence.",
  },
  fr: {
    title: "Participer dans votre région",
    description:
      "Rejoignez VoiceOpenGov gratuitement, reliez vos voisins, rendez visibles les enjeux locaux et contribuez à une présence eDebatte × VoiceOpenGov régionale.",
  },
  es: {
    title: "Participar en tu región",
    description:
      "Únete gratis a VoiceOpenGov, conecta a tus vecinos, haz visibles los temas locales y ayuda a construir presencia regional de eDebatte × VoiceOpenGov.",
  },
  tr: {
    title: "Bölgenizde katılın",
    description:
      "VoiceOpenGov'a ücretsiz katılın, komşuları buluşturun, yerel konuları görünür kılın ve bölgesel eDebatte × VoiceOpenGov varlığını birlikte kurun.",
  },
  ar: {
    title: "شارك في منطقتك",
    description:
      "انضم إلى VoiceOpenGov مجانًا، واربط الجيران، وأظهر القضايا المحلية، وساهم في بناء حضور إقليمي لـ eDebatte × VoiceOpenGov.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = META[locale] ?? META.en!;
  const baseCanonical = `${VOICEOPENGOV_URL}/mitmachen`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: localeAlternates(baseCanonical, REQUIRED_LAUNCH_LOCALES),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: copy.title,
      description: copy.description,
    },
  };
}

export default async function MitmachenPage() {
  const locale = await getRequestLocale();
  return <MitmachenClient initialLocale={locale} />;
}
