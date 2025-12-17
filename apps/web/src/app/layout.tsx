// E200: Public root layout with locale bootstrap and consent banner.
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import type { Collection } from "mongodb";
import { ObjectId, getCol } from "@core/db/triMongo";
import type { AuthUser } from "@/hooks/auth";
import "./globals.css";
import { LocaleProvider } from "@/context/LocaleContext";
import { DEFAULT_LOCALE, type SupportedLocale, isSupportedLocale } from "@/config/locales";
import { SiteHeader } from "./(components)/SiteHeader";
import { getPrivacyStrings } from "./privacyStrings";
import { VogCookieBanner } from "@/components/privacy/VogCookieBanner";
import { CONSENT_COOKIE_NAME, parseConsentCookie } from "@/lib/privacy/consent";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "VoiceOpenGov",
  description: "eDebatte – Anliegen analysieren, sauber & transparent.",
};
export const viewport = {
  themeColor: "#06b6d4",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialLocale = await detectInitialLocale(cookieStore);
  const initialConsent = parseConsentCookie(cookieStore.get(CONSENT_COOKIE_NAME)?.value);
  const privacyStrings = getPrivacyStrings(initialLocale);
  const initialUser = await loadServerUser(cookieStore);

  return (
    <html lang={initialLocale} className="h-full">
      <body className="min-h-screen bg-gradient-to-b from-[var(--brand-from)] via-white to-white text-neutral-900 antialiased">
        <LocaleProvider initialLocale={initialLocale}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader initialUser={initialUser} />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <div className="h-[env(safe-area-inset-bottom)]" />
            <VogCookieBanner strings={privacyStrings} initialConsent={initialConsent} />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}

async function detectInitialLocale(cookieStore: Awaited<ReturnType<typeof cookies>>): Promise<SupportedLocale> {
  const cookieLocale = cookieStore.get("lang")?.value;
  if (isSupportedLocale(cookieLocale)) return cookieLocale;

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");
  if (acceptLanguage) {
    const primary = acceptLanguage.split(",")[0]?.split(";")[0]?.trim();
    if (primary) {
      const short = primary.slice(0, 2).toLowerCase();
      if (isSupportedLocale(short)) return short;
    }
  }

  return DEFAULT_LOCALE;
}

async function loadServerUser(cookieStore: Awaited<ReturnType<typeof cookies>>): Promise<AuthUser | null> {
  try {
    const uid = cookieStore.get("u_id")?.value;
    if (!uid || !ObjectId.isValid(uid)) return null;
    const users = (await getCol("users")) as Collection<any>;
    const doc = await users.findOne(
      { _id: new ObjectId(uid) },
      { projection: { email: 1, name: 1, roles: 1, accessTier: 1, b2cPlanId: 1, profile: 1 } },
    );
    if (!doc) return null;
    const roles = Array.isArray(doc.roles) ? doc.roles : [];
    return {
      id: String(doc._id),
      email: doc.email ?? null,
      name: doc.name ?? null,
      roles: roles.length ? roles : ["user"],
      accessTier: doc.accessTier ?? null,
      b2cPlanId: doc.b2cPlanId ?? null,
      engagementXp: null,
      engagementLevel: null,
      contributionCredits: null,
      planSlug: doc.b2cPlanId ?? null,
      vogMembershipStatus: null,
      avatarUrl: doc.profile?.avatarUrl ?? null,
      avatarStyle: doc.profile?.avatarStyle ?? null,
    };
  } catch {
    return null;
  }
}
