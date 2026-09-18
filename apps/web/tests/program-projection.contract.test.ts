import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  EDEBATTE_VOG_MANDATE_FEED_CONTRACT_VERSION,
  EDEBATTE_VOG_MANDATE_FEED_URL,
  loadProgrammeProjection,
  projectEDebatteMandates,
} from "@/lib/programProjection";

function mandate(overrides: Record<string, unknown> = {}) {
  const base = {
    id: "decision-mandate-001",
    title: "Beispielmandat",
    subject: "Beispielgegenstand",
    publicSummary: "Öffentlich dokumentiertes gültiges Entscheidungsmandat.",
    status: "in_umsetzung",
    visibility: "public_readonly",
    decision: {
      status: "valid",
      snapshotId: "decision-snapshot-001",
      ruleId: "simple-majority",
      scopeLevel: "regional",
      scopeKey: "berlin",
      question: "Soll Maßnahme X umgesetzt werden?",
      majorityPosition: "Ja",
      majorityShare: 0.62,
      minorityPositions: ["Nein"],
      legitimacy: {
        eligibilityRuleId: "verified-residents-v1",
        electorateDescription: "Verifizierte abstimmungsberechtigte Personen im definierten Gebiet.",
        eligiblePopulation: 1000,
        ballotsCast: 400,
        validBallots: 390,
        quorumRuleId: "ten-percent-v1",
        quorumMet: true,
        integrityStatus: "verified",
      },
      decidedAt: "2026-09-01T18:00:00.000+02:00",
      supersedesMandateId: null,
    },
    provenance: {
      registerLabel: "eDebatte Entscheidungsmandat",
      origin: "dossier_round_outcome",
      sourceLabel: "Gültig abgeschlossene Dossier/Runde",
    },
    sourceDossierId: "dossier-001",
    sourceRoundId: "round-001",
    sourceAnlassraumId: null,
    validFrom: "2026-09-01",
    validUntil: null,
    lastUpdatedAt: "2026-09-02",
    isReadOnlyPublic: true,
  };

  return { ...base, ...overrides };
}

function feed(mandates: unknown[], overrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    source: "runtime",
    contractVersion: EDEBATTE_VOG_MANDATE_FEED_CONTRACT_VERSION,
    generatedAt: "2026-09-18T10:00:00.000Z",
    mandates,
    ...overrides,
  };
}

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("VOG programme projection", () => {
  it("projects only a valid, public, quorate and integrity-verified eDebatte mandate", () => {
    const result = projectEDebatteMandates([mandate()]);
    expect(result.rejected).toEqual([]);
    expect(result.positions).toHaveLength(1);
    expect(result.positions[0]).toMatchObject({
      mandateId: "decision-mandate-001",
      decisionSnapshotId: "decision-snapshot-001",
      versionRef: "decision-snapshot-001",
      sourceAuthority: "eDebatte",
      scopeLevel: "regional",
      scopeKey: "berlin",
      quorumMet: true,
      integrityStatus: "verified",
    });
    expect(result.positions[0]?.sourceMandateUrl).toBe(
      "https://www.edebatte.org/mandat/decision-mandate-001",
    );
  });

  it.each([
    ["draft decision", { decision: { ...mandate().decision, status: "draft" } }, "decision_not_valid"],
    ["missing quorum", { decision: { ...mandate().decision, legitimacy: { ...mandate().decision.legitimacy, quorumMet: false } } }, "quorum_not_met"],
    ["pending integrity", { decision: { ...mandate().decision, legitimacy: { ...mandate().decision.legitimacy, integrityStatus: "pending" } } }, "integrity_not_verified"],
    ["manual register entry", { provenance: { ...mandate().provenance, origin: "manual_register_entry" } }, "not_dossier_round_outcome"],
    ["restricted visibility", { visibility: "restricted" }, "not_public_readonly"],
  ])("fails closed for %s", (_label, override, reason) => {
    const result = projectEDebatteMandates([mandate(override)]);
    expect(result.positions).toEqual([]);
    expect(result.rejected).toEqual([{ mandateId: "decision-mandate-001", reason }]);
  });

  it("preserves majority, minority, electorate, source ids and supersession without inventing a local political truth", () => {
    const source = mandate({
      decision: {
        ...mandate().decision,
        snapshotId: "snapshot-v2",
        minorityPositions: ["Nein", "Alternative Y"],
        supersedesMandateId: "decision-mandate-000",
      },
    });
    const result = projectEDebatteMandates([source]);
    const position = result.positions[0];
    expect(position?.versionRef).toBe("snapshot-v2");
    expect(position?.minorityPositions).toEqual(["Nein", "Alternative Y"]);
    expect(position?.supersedesMandateId).toBe("decision-mandate-000");
    expect(position?.sourceDossierId).toBe("dossier-001");
    expect(position?.sourceRoundId).toBe("round-001");
    expect(position?.eligiblePopulation).toBe(1000);
    expect(position?.validBallots).toBe(390);
  });

  it("does not silently treat malformed mandate material as programme truth", () => {
    const malformed = mandate({
      decision: {
        ...mandate().decision,
        snapshotId: "",
      },
    });
    const result = projectEDebatteMandates([malformed]);
    expect(result.positions).toEqual([]);
    expect(result.rejected).toEqual([]);
  });

  it("reads the canonical runtime feed with no cache and accepts an honest empty state", async () => {
    let requestedUrl = "";
    let requestedInit: RequestInit | undefined;
    const state = await loadProgrammeProjection({
      fetchImpl: async (input, init) => {
        requestedUrl = String(input);
        requestedInit = init;
        return response(feed([]));
      },
    });

    expect(requestedUrl).toBe(EDEBATTE_VOG_MANDATE_FEED_URL);
    expect(requestedInit?.method).toBe("GET");
    expect(requestedInit?.cache).toBe("no-store");
    expect(state).toEqual({
      status: "ready",
      positions: [],
      sourceGeneratedAt: "2026-09-18T10:00:00.000Z",
    });
  });

  it("revalidates valid runtime mandates locally before projection", async () => {
    const state = await loadProgrammeProjection({
      fetchImpl: async () => response(feed([mandate()])),
    });
    expect(state.status).toBe("ready");
    if (state.status !== "ready") return;
    expect(state.positions).toHaveLength(1);
    expect(state.positions[0]?.decisionSnapshotId).toBe("decision-snapshot-001");
  });

  it("fails closed when the canonical source is unavailable", async () => {
    const state = await loadProgrammeProjection({
      fetchImpl: async () => response({ ok: false }, 503),
    });
    expect(state).toEqual({
      status: "source_unavailable",
      positions: [],
      reason: "http_error",
      httpStatus: 503,
    });
  });

  it("fails closed on contract-version drift", async () => {
    const state = await loadProgrammeProjection({
      fetchImpl: async () =>
        response(feed([], { contractVersion: "vog-programme-mandate-v2" })),
    });
    expect(state).toMatchObject({
      status: "source_unavailable",
      reason: "contract_mismatch",
      positions: [],
    });
  });

  it("fails the whole feed if any mandate is malformed or non-binding", async () => {
    const malformed = mandate({
      decision: { ...mandate().decision, snapshotId: "" },
    });
    const draft = mandate({
      id: "draft-mandate",
      decision: {
        ...mandate().decision,
        snapshotId: "draft-snapshot",
        status: "draft",
      },
    });

    for (const invalid of [malformed, draft]) {
      const state = await loadProgrammeProjection({
        fetchImpl: async () => response(feed([mandate(), invalid])),
      });
      expect(state).toMatchObject({
        status: "source_unavailable",
        reason: "invalid_mandates",
        positions: [],
      });
    }
  });

  it("fails closed on duplicate mandate or snapshot identity", async () => {
    const duplicateSnapshot = mandate({
      id: "decision-mandate-002",
      decision: {
        ...mandate().decision,
        snapshotId: "decision-snapshot-001",
      },
    });
    const state = await loadProgrammeProjection({
      fetchImpl: async () => response(feed([mandate(), duplicateSnapshot])),
    });
    expect(state).toMatchObject({
      status: "source_unavailable",
      reason: "invalid_mandates",
      positions: [],
    });
  });

  it("fails closed on network and timeout errors", async () => {
    const network = await loadProgrammeProjection({
      fetchImpl: async () => {
        throw new Error("network_down");
      },
    });
    expect(network).toMatchObject({
      status: "source_unavailable",
      reason: "network_error",
    });

    const timeout = await loadProgrammeProjection({
      fetchImpl: async () => {
        throw new DOMException("aborted", "AbortError");
      },
    });
    expect(timeout).toMatchObject({
      status: "source_unavailable",
      reason: "timeout",
    });
  });

  it("keeps the public programme surface dynamic, noindex and fail-honest", () => {
    const page = readFileSync(new URL("../src/app/programm/page.tsx", import.meta.url), "utf8");
    expect(page).toContain('export const dynamic = "force-dynamic"');
    expect(page).toContain("index: false");
    expect(page).toContain("kanonische Entscheidungsquelle ist derzeit nicht verifizierbar");
    expect(page).toContain("Mandatsfeed ist verbunden");
    expect(page).toContain("keine Demo- oder Fixture-Daten");
    expect(page).not.toContain("source_unconfigured");
  });
});
