import { NextRequest, NextResponse } from "next/server";
import {
  EDEBATTE_CANONICAL_URL,
  VOTE4GOV_CANONICAL_URL,
} from "@/config/links";
import {
  buildLocaleHandoffUrl,
  resolveLocaleDimensions,
} from "@/lib/i18n/localeContract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TARGETS = {
  edebatte: EDEBATTE_CANONICAL_URL,
  vote4gov: VOTE4GOV_CANONICAL_URL,
} as const;

type Target = keyof typeof TARGETS;

const EDEBATTE_DESTINATIONS: Record<string, string> = {
  home: "/",
  pricing: "/pricing",
  create: "/create",
  runden: "/runden",
};

const CANONICAL_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,159}$/;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ target: string }> },
) {
  const { target: rawTarget } = await context.params;
  if (!isTarget(rawTarget)) {
    return NextResponse.json({ ok: false, error: "unknown_target" }, { status: 404 });
  }

  const query = request.nextUrl.searchParams;
  const cookieLocale = request.cookies.get("lang")?.value;
  const dimensions = resolveLocaleDimensions({
    originalLocale: query.get("originalLocale") || "de",
    readingLocale: query.get("readingLocale") || query.get("lang") || cookieLocale,
    uiLocale: query.get("uiLocale") || query.get("lang") || cookieLocale,
    outputLocale: query.get("outputLocale") || query.get("lang") || cookieLocale,
  });

  const targetUrl = new URL(TARGETS[rawTarget]);
  if (rawTarget === "edebatte") {
    const destination = query.get("destination") || "home";
    const canonicalId = query.get("canonicalId")?.trim() || "";

    if (destination === "vog-question" && CANONICAL_ID_PATTERN.test(canonicalId)) {
      targetUrl.pathname = `/runden/vog/${encodeURIComponent(canonicalId)}`;
      const sourceTitle = query.get("sourceTitle")?.trim();
      if (sourceTitle) {
        targetUrl.searchParams.set("sourceTitle", sourceTitle.slice(0, 300));
      }
    } else {
      targetUrl.pathname = EDEBATTE_DESTINATIONS[destination] || "/";
    }
  }

  const redirectUrl = buildLocaleHandoffUrl(targetUrl.toString(), dimensions, {
    canonicalId: query.get("canonicalId") || undefined,
  });

  const response = NextResponse.redirect(redirectUrl, 307);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

function isTarget(value: string): value is Target {
  return Object.prototype.hasOwnProperty.call(TARGETS, value);
}
