import type { Metadata } from "next";
import MitmachenClient from "./MitmachenClient";
import { getRequestLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Mitmachen | VoiceOpenGov",
  description:
    "Kostenfrei bei VoiceOpenGov dabei sein, sich aktiv einbringen oder gemeinsam mit Nachbarn regionale eDebatte × VoiceOpenGov-Präsenz aufbauen.",
};

export default async function MitmachenPage() {
  const locale = await getRequestLocale();
  return <MitmachenClient initialLocale={locale} />;
}
