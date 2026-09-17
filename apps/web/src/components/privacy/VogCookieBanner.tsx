"use client";
// E200: Client-side consent banner without third-party CMPs.

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PrivacyStrings } from "@/app/privacyStrings";
import {
  CONSENT_COOKIE_NAME,
  buildConsentCookie,
  parseConsentCookie,
  type VogConsent,
} from "@/lib/privacy/consent";

interface VogCookieBannerProps {
  strings: PrivacyStrings;
  initialConsent?: VogConsent | null;
}

function readConsentFromDocument(): VogConsent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split("=")[1];
  return parseConsentCookie(raw);
}

export function VogCookieBanner({ strings, initialConsent }: VogCookieBannerProps) {
  const [consent, setConsent] = useState<VogConsent | null>(initialConsent ?? null);
  const [show, setShow] = useState(!initialConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState<boolean>(false);

  useEffect(() => {
    if (initialConsent) return;
    const existing = readConsentFromDocument();
    if (existing) {
      setConsent(existing);
      setAnalyticsOptIn(existing.analytics);
      setShow(false);
    }
  }, [initialConsent]);

  useEffect(() => {
    if (consent) {
      setAnalyticsOptIn(consent.analytics);
    }
  }, [consent]);

  const persistConsent = (value: VogConsent) => {
    if (typeof document === "undefined") return;
    const cookie = buildConsentCookie(value);
    document.cookie = cookie;
    setConsent(value);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-50 flex justify-center px-3">
      <div className="pointer-events-auto w-full max-w-4xl rounded-3xl border border-[#f4f1e8]/12 bg-[#07110f]/96 text-[#f4f1e8] shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="grid gap-4 p-4 md:grid-cols-[1.4fr_1fr] md:p-6">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full bg-[#d6ff65]/10 px-3 py-1 text-xs font-bold text-[#d6ff65]">
              {strings.banner.title}
            </div>
            <p className="text-sm text-[#f4f1e8]/62">{strings.banner.lead}</p>
            <div className="flex flex-wrap gap-4 text-xs text-[#f4f1e8]/45">
              <Link href="/datenschutz" className="font-semibold text-[#d6ff65] underline underline-offset-2">
                {strings.banner.links.privacy}
              </Link>
              <Link href="/impressum" className="font-semibold text-[#d6ff65] underline underline-offset-2">
                {strings.banner.links.imprint}
              </Link>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#f4f1e8]/10 bg-[#0b1714] p-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#f4f1e8]">{strings.banner.essentialTitle}</p>
              <p className="text-xs text-[#f4f1e8]/58">{strings.banner.essentialBody}</p>
            </div>
            <div className="space-y-2 rounded-xl border border-[#f4f1e8]/10 bg-[#07110f]/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#f4f1e8]">{strings.banner.analyticsTitle}</p>
                  <p className="text-[11px] text-[#f4f1e8]/58">{strings.banner.analyticsBody}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    aria-label={strings.banner.analyticsTitle}
                    checked={analyticsOptIn}
                    onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                  />
                  <div className="h-6 w-11 rounded-full bg-[#f4f1e8]/20 transition peer-checked:bg-[#d6ff65]" />
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-[#f4f1e8] shadow transition peer-checked:translate-x-5 peer-checked:bg-[#07110f]" />
                </label>
              </div>
              {settingsOpen && (
                <p className="text-[11px] text-[#f4f1e8]/58">
                  {strings.dialog.intro}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                className="flex-1 rounded-full bg-[#d6ff65] px-4 py-2 font-black text-[#07110f] shadow transition hover:-translate-y-0.5"
                onClick={() => persistConsent({ essential: true, analytics: true })}
              >
                {strings.banner.buttons.acceptAll}
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-[#f4f1e8]/18 bg-[#07110f]/60 px-4 py-2 text-[#f4f1e8] transition hover:border-[#d6ff65]/50 hover:text-[#d6ff65]"
                onClick={() => persistConsent({ essential: true, analytics: false })}
              >
                {strings.banner.buttons.onlyEssential}
              </button>
              <button
                type="button"
                className="rounded-full border border-transparent px-3 py-2 text-[#d6ff65] underline underline-offset-2"
                onClick={() => setSettingsOpen((prev) => !prev)}
              >
                {strings.banner.buttons.settings}
              </button>
            </div>
            {settingsOpen && (
              <div className="space-y-1 rounded-xl bg-[#07110f]/60 p-3 text-[11px] text-[#f4f1e8]/58">
                <p className="font-semibold">{strings.dialog.title}</p>
                <p>{strings.dialog.intro}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
