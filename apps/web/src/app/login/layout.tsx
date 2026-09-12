import type { Metadata } from "next";
import { getMemberAccountStrings } from "@/app/memberAccountStrings";
import { getRequestLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const strings = getMemberAccountStrings(locale);
  return {
    title: strings.login.title,
    description: strings.login.intro,
    robots: { index: false, follow: false },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
