import type { Metadata } from "next";
import MitmachenClient from "./MitmachenClient";
import { getRequestLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Mitmachen | VoiceOpenGov",
  description:
    "Mitglied werden, an öffentlichen Fragen mitarbeiten oder regional aktiv werden: die Einstiege in VoiceOpenGov.",
};

export default async function MitmachenPage() {
  const locale = await getRequestLocale();
  return <MitmachenClient initialLocale={locale} />;
}
