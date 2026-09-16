function withoutTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function canonicalVoiceOpenGovUrl(value?: string) {
  const normalized = withoutTrailingSlash(
    value || "https://www.voiceopengov.org",
  );
  return normalized.replace(
    "https://voiceopengov.org",
    "https://www.voiceopengov.org",
  );
}

export const VOICEOPENGOV_URL = canonicalVoiceOpenGovUrl(
  process.env.NEXT_PUBLIC_VOG_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL,
);

export const EDEBATTE_CANONICAL_URL = "https://www.edebatte.org";
export const VOTE4GOV_CANONICAL_URL = "https://vote4gov.eu";

// Public links intentionally use the local bridge. The bridge preserves the
// validated locale context without sending identity or membership data.
export const EDEBATTE_URL = "/go/edebatte";
export const VOTE4GOV_URL = "/go/vote4gov";

export const VOG_JOIN_PATH = "/mitmachen";
export const VOG_SUPPORT_PATH = "/unterstuetzen";
export const VOG_QUESTIONS_PATH = "/fragen";
export const VOG_TRANSPARENCY_PATH = "/transparenz";
// Legacy semantic alias: public participation is now consolidated under /mitmachen.
export const VOG_ROLES_PATH = VOG_JOIN_PATH;

export const VOG_SUPPORT_URL = `${VOICEOPENGOV_URL}${VOG_SUPPORT_PATH}`;
export const EDEBATTE_SIGNUP_URL = `${EDEBATTE_URL}?destination=home`;
export const EDEBATTE_PREORDER_URL = `${EDEBATTE_URL}?destination=pricing`;
