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
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-50 flex justify-center overflow-x-clip px-3">
      <div className="pointer-events-auto w-full max-w-4xl rounded-3xl border border-white/12 bg-[#020617]/96 text-[#f8fafc] shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="grid min-w-0 gap-4 p-4 md:grid-cols-[1.4fr_1fr] md:p-6">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center rounded-full bg-[#18cfc8]/10 px-3 py-1 text-xs font-bold text-[#18cfc8]">
              {strings.banner.title}
            </div>
            <p className="text-sm text-slate-300">{strings.banner.lead}</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              <Link href="/datenschutz" className="font-semibold text-[#18cfc8] underline underline-offset-2">
                {strings.banner.links.privacy}
              </Link>
              <Link href="/impressum" className="font-semibold text-[#18cfc8] underline underline-offset-2">
                {strings.banner.links.imprint}
              </Link>
            </div>
          </div>

          <div className="min-w-0 space-y-3 rounded-2xl border border-white/10 bg-[#0b1220] p-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#f8fafc]">{strings.banner.essentialTitle}</p>
              <p className="text-xs text-[#f8fafc]/58">{strings.banner.essentialBody}</p>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-[#020617]/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#f8fafc]">{strings.banner.analyticsTitle}</p>
                  <p className="text-[11px] text-[#f8fafc]/58">{strings.banner.analyticsBody}</p>
                </div>
                <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    aria-label={strings.banner.analyticsTitle}
                    checked={analyticsOptIn}
                    onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                  />
                  <div className="h-6 w-11 rounded-full bg-white/20 transition peer-checked:bg-[#18cfc8]" />
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-[#f8fafc] shadow transition peer-checked:translate-x-5 peer-checked:bg-[#071727]" />
                </label>
              </div>
              {settingsOpen && (
                <p className="text-[11px] text-[#f8fafc]/58">
                  {strings.dialog.intro}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                className="flex-1 rounded-full bg-[#18cfc8] px-4 py-2 font-black text-[#071727] shadow transition hover:-translate-y-0.5"
                onClick={() => persistConsent({ essential: true, analytics: true })}
              >
                {strings.banner.buttons.acceptAll}
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-white/20 bg-[#020617]/60 px-4 py-2 text-[#f8fafc] transition hover:border-[#18cfc8]/60 hover:text-[#18cfc8]"
                onClick={() => persistConsent({ essential: true, analytics: false })}
              >
                {strings.banner.buttons.onlyEssential}
              </button>
              <button
                type="button"
                className="rounded-full border border-transparent px-3 py-2 text-[#18cfc8] underline underline-offset-2"
                onClick={() => setSettingsOpen((prev) => !prev)}
              >
                {strings.banner.buttons.settings}
              </button>
            </div>
            {settingsOpen && (
              <div className="space-y-1 rounded-xl bg-[#020617]/60 p-3 text-[11px] text-[#f8fafc]/58">
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
