import type { Metadata } from "next";
import MitmachenClient from "./MitmachenClient";
import { getRequestLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Mitmachen | VoiceOpenGov",
  description:
    "Als Aktivmitglied oder Mitglied einsteigen oder VoiceOpenGov vor Ort mit Raum, Kontakten, Expertise und Organisation unterstützen.",
};

export default async function MitmachenPage() {
  const locale = await getRequestLocale();
  return <MitmachenClient initialLocale={locale} />;
}
