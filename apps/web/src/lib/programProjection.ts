import { z } from "zod";
import { EDEBATTE_CANONICAL_URL } from "@/config/links";

const SCOPE_LEVELS = ["municipal", "regional", "national", "european", "international"] as const;
const IMPLEMENTATION_STATUSES = ["entwurf", "in_pruefung", "aktiv", "in_umsetzung", "abgeschlossen", "ausgesetzt"] as const;
const DECISION_STATUSES = ["draft", "in_review", "valid", "superseded", "revoked"] as const;
const INTEGRITY_STATUSES = ["pending", "verified", "failed"] as const;

const LegitimacySchema = z.object({
  eligibilityRuleId: z.string().trim().min(1),
  electorateDescription: z.string().trim().min(1),
  eligiblePopulation: z.number().int().positive().nullable(),
  ballotsCast: z.number().int().positive(),
  validBallots: z.number().int().positive(),
  quorumRuleId: z.string().trim().min(1),
  quorumMet: z.boolean(),
  integrityStatus: z.enum(INTEGRITY_STATUSES),
}).strict().superRefine((value, ctx) => {
  if (value.validBallots > value.ballotsCast) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["validBallots"],
      message: "valid_ballots_must_not_exceed_ballots_cast",
    });
  }
  if (value.eligiblePopulation !== null && value.ballotsCast > value.eligiblePopulation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["ballotsCast"],
      message: "ballots_cast_must_not_exceed_known_eligible_population",
    });
  }
});

export const EDebatteMandateProjectionInputSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  publicSummary: z.string().trim().min(1),
  status: z.enum(IMPLEMENTATION_STATUSES),
  visibility: z.enum(["public_readonly", "restricted", "internal"]),
  decision: z.object({
    status: z.enum(DECISION_STATUSES),
    snapshotId: z.string().trim().min(1),
    ruleId: z.string().trim().min(1),
    scopeLevel: z.enum(SCOPE_LEVELS),
    scopeKey: z.string().trim().min(1),
    question: z.string().trim().min(1),
    majorityPosition: z.string().trim().min(1),
    majorityShare: z.number().gt(0).lte(1),
    minorityPositions: z.array(z.string().trim().min(1)),
    legitimacy: LegitimacySchema,
    decidedAt: z.string().datetime({ offset: true }).nullable(),
    supersedesMandateId: z.string().trim().min(1).nullable(),
  }).strict(),
  provenance: z.object({
    registerLabel: z.literal("eDebatte Entscheidungsmandat"),
    origin: z.enum(["dossier_round_outcome", "manual_register_entry", "hosted_room_followup"]),
    sourceLabel: z.string().trim().min(1),
  }).strict(),
  sourceDossierId: z.string().trim().min(1).nullable(),
  sourceRoundId: z.string().trim().min(1).nullable(),
  sourceAnlassraumId: z.string().trim().min(1).nullable(),
  validFrom: z.string().date(),
  validUntil: z.string().date().nullable(),
  lastUpdatedAt: z.string().date(),
  isReadOnlyPublic: z.literal(true),
}).strict();

export type EDebatteMandateProjectionInput = z.infer<typeof EDebatteMandateProjectionInputSchema>;

export type ProgrammePosition = Readonly<{
  mandateId: string;
  decisionSnapshotId: string;
  versionRef: string;
  sourceAuthority: "eDebatte";
  sourceMandateUrl: string;
  title: string;
  subject: string;
  question: string;
  scopeLevel: (typeof SCOPE_LEVELS)[number];
  scopeKey: string;
  decisionRuleId: string;
  majorityPosition: string;
  majorityShare: number;
  minorityPositions: readonly string[];
  electorateDescription: string;
  eligibilityRuleId: string;
  eligiblePopulation: number | null;
  ballotsCast: number;
  validBallots: number;
  quorumRuleId: string;
  quorumMet: true;
  integrityStatus: "verified";
  decidedAt: string;
  supersedesMandateId: string | null;
  implementationStatus: (typeof IMPLEMENTATION_STATUSES)[number];
  validFrom: string;
  validUntil: string | null;
  lastUpdatedAt: string;
  sourceDossierId: string | null;
  sourceRoundId: string | null;
  sourceAnlassraumId: string | null;
}>;

export type ProjectionRejectionReason =
  | "not_public_readonly"
  | "decision_not_valid"
  | "not_dossier_round_outcome"
  | "quorum_not_met"
  | "integrity_not_verified"
  | "decision_not_finalized";

export type ProgrammeProjectionResult = Readonly<{
  positions: readonly ProgrammePosition[];
  rejected: readonly Readonly<{ mandateId: string; reason: ProjectionRejectionReason }>[];
}>;

export const EDEBATTE_VOG_MANDATE_FEED_CONTRACT_VERSION =
  "vog-programme-mandate-v1" as const;

export const EDEBATTE_VOG_MANDATE_FEED_URL =
  `${EDEBATTE_CANONICAL_URL}/api/public/mandates/voiceopengov`;

export type ProgrammeSourceUnavailableReason =
  | "network_error"
  | "timeout"
  | "http_error"
  | "invalid_response"
  | "contract_mismatch"
  | "invalid_mandates";

export type ProgrammeSourceState =
  | Readonly<{
      status: "source_unavailable";
      positions: readonly ProgrammePosition[];
      reason: ProgrammeSourceUnavailableReason;
      httpStatus?: number;
    }>
  | Readonly<{
      status: "ready";
      positions: readonly ProgrammePosition[];
      sourceGeneratedAt: string;
    }>;

type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type LoadProgrammeProjectionOptions = Readonly<{
  fetchImpl?: FetchLike;
  sourceUrl?: string;
  timeoutMs?: number;
}>;

const ProgrammeFeedEnvelopeSchema = z
  .object({
    ok: z.literal(true),
    source: z.literal("runtime"),
    contractVersion: z.string().trim().min(1),
    generatedAt: z.string().datetime({ offset: true }),
    mandates: z.array(z.unknown()),
  })
  .strict();

function rejectionReason(mandate: EDebatteMandateProjectionInput): ProjectionRejectionReason | null {
  if (mandate.visibility !== "public_readonly" || !mandate.isReadOnlyPublic) return "not_public_readonly";
  if (mandate.decision.status !== "valid") return "decision_not_valid";
  if (mandate.provenance.origin !== "dossier_round_outcome") return "not_dossier_round_outcome";
  if (!mandate.decision.legitimacy.quorumMet) return "quorum_not_met";
  if (mandate.decision.legitimacy.integrityStatus !== "verified") return "integrity_not_verified";
  if (!mandate.decision.decidedAt) return "decision_not_finalized";
  return null;
}

export function projectEDebatteMandates(input: readonly unknown[]): ProgrammeProjectionResult {
  const positions: ProgrammePosition[] = [];
  const rejected: Array<{ mandateId: string; reason: ProjectionRejectionReason }> = [];

  for (const raw of input) {
    const parsed = EDebatteMandateProjectionInputSchema.safeParse(raw);
    if (!parsed.success) {
      continue;
    }

    const mandate = parsed.data;
    const reason = rejectionReason(mandate);
    if (reason) {
      rejected.push({ mandateId: mandate.id, reason });
      continue;
    }

    const legitimacy = mandate.decision.legitimacy;
    positions.push({
      mandateId: mandate.id,
      decisionSnapshotId: mandate.decision.snapshotId,
      versionRef: mandate.decision.snapshotId,
      sourceAuthority: "eDebatte",
      sourceMandateUrl: `${EDEBATTE_CANONICAL_URL}/mandat/${encodeURIComponent(mandate.id)}`,
      title: mandate.title,
      subject: mandate.subject,
      question: mandate.decision.question,
      scopeLevel: mandate.decision.scopeLevel,
      scopeKey: mandate.decision.scopeKey,
      decisionRuleId: mandate.decision.ruleId,
      majorityPosition: mandate.decision.majorityPosition,
      majorityShare: mandate.decision.majorityShare,
      minorityPositions: [...mandate.decision.minorityPositions],
      electorateDescription: legitimacy.electorateDescription,
      eligibilityRuleId: legitimacy.eligibilityRuleId,
      eligiblePopulation: legitimacy.eligiblePopulation,
      ballotsCast: legitimacy.ballotsCast,
      validBallots: legitimacy.validBallots,
      quorumRuleId: legitimacy.quorumRuleId,
      quorumMet: true,
      integrityStatus: "verified",
      decidedAt: mandate.decision.decidedAt!,
      supersedesMandateId: mandate.decision.supersedesMandateId,
      implementationStatus: mandate.status,
      validFrom: mandate.validFrom,
      validUntil: mandate.validUntil,
      lastUpdatedAt: mandate.lastUpdatedAt,
      sourceDossierId: mandate.sourceDossierId,
      sourceRoundId: mandate.sourceRoundId,
      sourceAnlassraumId: mandate.sourceAnlassraumId,
    });
  }

  positions.sort((a, b) => b.decidedAt.localeCompare(a.decidedAt));

  return { positions, rejected };
}


function hasDuplicateProjectionIdentity(
  positions: readonly ProgrammePosition[],
): boolean {
  const mandateIds = new Set<string>();
  const snapshots = new Set<string>();

  for (const position of positions) {
    if (
      mandateIds.has(position.mandateId) ||
      snapshots.has(position.decisionSnapshotId)
    ) {
      return true;
    }
    mandateIds.add(position.mandateId);
    snapshots.add(position.decisionSnapshotId);
  }

  return false;
}

function unavailable(
  reason: ProgrammeSourceUnavailableReason,
  httpStatus?: number,
): ProgrammeSourceState {
  return {
    status: "source_unavailable",
    positions: [],
    reason,
    ...(typeof httpStatus === "number" ? { httpStatus } : {}),
  };
}

export async function loadProgrammeProjection(
  options: LoadProgrammeProjectionOptions = {},
): Promise<ProgrammeSourceState> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const sourceUrl = options.sourceUrl ?? EDEBATTE_VOG_MANDATE_FEED_URL;
  const timeoutMs = Math.max(250, options.timeoutMs ?? 4_000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetchImpl(sourceUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    const name =
      error && typeof error === "object" && "name" in error
        ? String((error as { name?: unknown }).name ?? "")
        : "";
    return unavailable(
      name === "AbortError" || name === "TimeoutError"
        ? "timeout"
        : "network_error",
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    return unavailable("http_error", response.status);
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    return unavailable("invalid_response", response.status);
  }

  const envelope = ProgrammeFeedEnvelopeSchema.safeParse(raw);
  if (!envelope.success) {
    return unavailable("invalid_response", response.status);
  }

  if (
    envelope.data.contractVersion !==
    EDEBATTE_VOG_MANDATE_FEED_CONTRACT_VERSION
  ) {
    return unavailable("contract_mismatch", response.status);
  }

  const projection = projectEDebatteMandates(envelope.data.mandates);
  const accountedFor =
    projection.positions.length + projection.rejected.length ===
    envelope.data.mandates.length;

  if (
    !accountedFor ||
    projection.rejected.length > 0 ||
    hasDuplicateProjectionIdentity(projection.positions)
  ) {
    return unavailable("invalid_mandates", response.status);
  }

  return {
    status: "ready",
    positions: projection.positions,
    sourceGeneratedAt: envelope.data.generatedAt,
  };
}
