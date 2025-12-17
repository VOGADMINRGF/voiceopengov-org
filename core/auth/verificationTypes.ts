export type VerificationLevel = "none" | "email" | "soft" | "strong";

export type IdentityMethod =
  | "email_link"
  | "email_code"
  | "sms_tan"
  | "otb_app"
  | "otp_app"
  | "eid_scan"
  | "id_upload"
  | "offline_code";

export type UserTwoFactorState = {
  enabled?: boolean;
  method?: string | null;
  secret?: string | null;
  temp?: string | null;
  updatedAt?: Date | string | null;
};

export type UserVerification = {
  level: VerificationLevel;
  methods: IdentityMethod[];
  lastVerifiedAt?: Date | null;
  preferredRegionCode?: string | null;
  twoFA?: UserTwoFactorState;
};

const LEVEL_ORDER: VerificationLevel[] = ["none", "email", "soft", "strong"];

export function ensureVerificationDefaults(input?: Partial<UserVerification> | null): UserVerification {
  const twoFA = (input as any)?.twoFA;
  return {
    level: input?.level ?? "none",
    methods: Array.isArray(input?.methods) ? [...input!.methods] : [],
    lastVerifiedAt: input?.lastVerifiedAt ?? null,
    preferredRegionCode: input?.preferredRegionCode ?? null,
    ...(twoFA ? { twoFA } : {}),
  };
}

export function upgradeVerificationLevel(
  current: VerificationLevel,
  candidate: VerificationLevel,
): VerificationLevel {
  const currentIdx = LEVEL_ORDER.indexOf(current);
  const candidateIdx = LEVEL_ORDER.indexOf(candidate);
  if (candidateIdx > currentIdx) return candidate;
  return current;
}
