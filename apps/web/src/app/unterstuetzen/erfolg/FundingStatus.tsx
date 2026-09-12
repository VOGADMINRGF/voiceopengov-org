"use client";

import { useEffect, useState } from "react";
import type { SupportedLocale } from "@/config/locales";
import type { FundingStrings } from "../fundingStrings";

type Status = "checking" | "pending" | "succeeded" | "failed";

export default function FundingStatus({ sessionId, locale, strings }: { sessionId?: string; locale: SupportedLocale; strings: FundingStrings }) {
  const [status, setStatus] = useState<Status>(sessionId ? "checking" : "failed");
  const [manageToken, setManageToken] = useState<string>();
  const [portalPending, setPortalPending] = useState(false);
  const [portalError, setPortalError] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    async function check() {
      try {
        const response = await fetch(`/api/funding/status?session_id=${encodeURIComponent(sessionId!)}`, { cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (stopped) return;
        if (!response.ok || !data?.status) throw new Error("status_failed");
        setStatus(data.status === "succeeded" ? "succeeded" : data.status === "failed" ? "failed" : "pending");
        setManageToken(typeof data.manageToken === "string" ? data.manageToken : undefined);
        attempts += 1;
        if (data.status === "pending" && attempts < 20) timer = setTimeout(check, 3000);
      } catch {
        if (!stopped) setStatus("pending");
      }
    }
    void check();
    return () => { stopped = true; if (timer) clearTimeout(timer); };
  }, [sessionId]);

  async function openPortal() {
    if (!manageToken) return;
    setPortalPending(true); setPortalError(false);
    try {
      const response = await fetch("/api/funding/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: manageToken, locale }) });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.url !== "string") throw new Error("portal_failed");
      window.location.assign(data.url);
    } catch {
      setPortalError(true); setPortalPending(false);
    }
  }

  const message = status === "checking" ? strings.statusChecking : status === "succeeded" ? strings.statusSucceeded : status === "failed" ? strings.statusFailed : strings.statusPending;
  return <div className="mt-6" aria-live="polite">
    <p className={`rounded-xl p-4 font-semibold ${status === "succeeded" ? "bg-cyan-400/10 text-cyan-100" : status === "failed" ? "bg-red-950/60 text-red-200" : "bg-slate-800 text-slate-200"}`}>{message}</p>
    {manageToken && <button type="button" onClick={openPortal} disabled={portalPending} className="mt-5 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 px-6 py-3 font-extrabold text-slate-950 disabled:opacity-60">{strings.manage}</button>}
    {portalError && <p role="alert" className="mt-4 text-sm text-red-200">{strings.manageError}</p>}
  </div>;
}
