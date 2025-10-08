// apps/worker/src/queues/factcheck.worker.ts

import { Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@db-core";
import { logger } from "@core/observability/logger";
import { splitIntoClaims } from "@core/factcheck/claimDecompose";
import { detectFrames, detectRhetoric, isFalsifiable } from "@core/factcheck/narrative";
import { runARI } from "@core/factcheck/providers/ari.provider";
import { runClaude } from "@core/factcheck/providers/claude.provider";
import { runMistral } from "@core/factcheck/providers/mistral.provider";
import { advancedConsensus } from "@core/factcheck/consensus";
import { getTrust } from "@core/factcheck/trust";
import {
  evaluateProviderChain,
  PROVIDER_ORDER,
  MAX_TOKENS_PER_JOB,
  UNLIMITED_TOKENS,
  MAX_CLAIMS_PER_JOB,
  MAX_FALLBACKS,
  WORKER_CONCURRENCY,
  estimateTokensFromText
} from "@core/factcheck/policy.factcheck";
import { CLAIMTRUST_VERSION } from "@core/factcheck/version";
import type { ProviderOutput } from "@core/factcheck/types";
import { canonicalKey } from "@/core/factcheck/canonical";

type EnqueueData = {
  contributionId?: string;
  text?: string;
  language?: string;
  topic?: string;
  scope?: string;       // optional: semantischer/geo/kontext Scope
  timeframe?: string;   // optional: z.B. "2020-2024" oder "last-12-months"
};

// --- Dedup: Claim per canonicalKey upserten ------------------------------

async function ensureClaim({
  text,
  scope,
  timeframe
}: {
  text: string;
  scope?: string;
  timeframe?: string;
}) {
  const ck = canonicalKey({ text, scope, timeframe });
  const claim = await prisma.factcheckClaim.upsert({
    where: { canonicalKey: ck },
    create: {
      canonicalKey: ck,
      text,         // Text beim ersten Anlegen mitspeichern
      scope: scope ?? null,
      timeframe: timeframe ?? null,
      status: "OPEN"
    },
    update: {
      updatedAt: new Date()
    }
  });
  return claim;
}

// -------------------------------------------------------------------------

export async function runFactcheckWorker() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error("REDIS_URL missing");

  // BullMQ Redis Connection (Pflicht: maxRetriesPerRequest: null)
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });

  const worker = new Worker(
    "factcheck",
    async (job: Job<EnqueueData>) => {
      const tJobStart = Date.now();
      logger.info({ jobId: job.id, data: job.data }, "FACTCHECK_JOB_START");

      let tokensUsed = 0;
      const { contributionId, text, language, topic, scope, timeframe } = job.data;
      if (!contributionId && !text) throw new Error("Either contributionId or text required");

      const sourceText =
        text ?? (() => {
          throw new Error("No text provided for factcheck job");
        })();

      const fcJob = await prisma.factcheckJob.create({
        data: {
          jobId: String(job.id),
          contributionId: contributionId ?? "n/a",
          status: "PROCESSING",
          tokensUsed: 0,
          durationMs: 0
        }
      });

      // Claim-Zerlegung (Cap)
      const allClaims = splitIntoClaims(sourceText);
      const claims = allClaims.slice(0, Math.max(1, MAX_CLAIMS_PER_JOB));
      if (claims.length === 0) {
        await prisma.factcheckJob.update({
          where: { id: fcJob.id },
          data: {
            status: "COMPLETED",
            tokensUsed: 0,
            durationMs: Date.now() - tJobStart
          }
        });
        logger.warn({ jobId: job.id }, "FACTCHECK_NO_CLAIMS_FALLBACK");
        return;
      }

      for (const claimText of claims) {
        const frames = detectFrames(claimText);
        const rhet = detectRhetoric(claimText);
        const falsifiable = isFalsifiable(claimText);

        // >>> NEU: Dedup + Zuweisung an bestehenden Claim mittels canonicalKey
        const claim = await ensureClaim({
          text: claimText,
          scope: scope ?? topic ?? undefined,   // bevorzugt explicit scope, sonst topic
          timeframe: timeframe ?? undefined
        });

        // Claim mit Job- & Analysefeldern aktualisieren (ohne text/canonicalKey anzutasten)
        await prisma.factcheckClaim.update({
          where: { id: claim.id },
          data: {
            jobId: fcJob.id, // letztes verarbeitendes Job-Ref (falls im Schema vorhanden)
            language: language ?? claim.language ?? null,
            topic: topic ?? claim.topic ?? null,
            falsifiable,
            frames,
            rhetoricalFlags: rhet.map(r => r.type),
            // status-Handling: bleibt "OPEN" bis Konsens gesetzt wird (kannst du anpassen)
          }
        });

        const outputs: ProviderOutput[] = [];
        let fallbacksTried = 0;

        // 1) ARI zuerst
        {
          const est = estimateTokensFromText(claimText);
          if (!UNLIMITED_TOKENS && tokensUsed + est > MAX_TOKENS_PER_JOB) {
            logger.warn(
              { jobId: job.id, claimId: claim.id, tokensUsed, MAX_TOKENS_PER_JOB },
              "BUDGET_EXCEEDED_BEFORE_ARI"
            );
          } else {
            const tStart = Date.now();
            try {
              const res = await runARI(claimText, language);
              const inc = res.costTokens && res.costTokens > 0 ? res.costTokens : est;
              tokensUsed += inc;
              outputs.push(res);

              await prisma.providerRun.create({
                data: {
                  claimId: claim.id,
                  provider: res.provider,
                  verdict: res.verdict,
                  confidence: res.confidence,
                  costTokens: inc,
                  latencyMs: Date.now() - tStart,
                  raw: res.raw
                }
              });
            } catch (e: any) {
              await prisma.providerRun.create({
                data: {
                  claimId: claim.id,
                  provider: "ARI",
                  verdict: "pending",
                  confidence: 0,
                  costTokens: 0,
                  latencyMs: Date.now() - tStart,
                  raw: { error: String(e?.message ?? e) }
                }
              });
            }
          }
        }

        // 2) Chain-Evaluation (prüft ob weitere Provider nötig/sinnvoll)
        let continueChain = evaluateProviderChain(outputs, claimText, {
          tokensUsed,
          maxTokens: MAX_TOKENS_PER_JOB
        });

        // 3) Fallbacks (Claude, Mistral)
        if (continueChain) {
          const nextProviders = PROVIDER_ORDER.filter(p => p !== "ARI");
          for (const provider of nextProviders) {
            if (fallbacksTried >= Math.max(0, MAX_FALLBACKS)) break;

            const est = estimateTokensFromText(claimText);
            if (!UNLIMITED_TOKENS && tokensUsed + est > MAX_TOKENS_PER_JOB) {
              logger.info(
                { claimId: claim.id, tokensUsed, MAX_TOKENS_PER_JOB },
                "FALLBACK_BUDGET_LIMIT_REACHED"
              );
              break;
            }

            fallbacksTried++;
            const tStart = Date.now();
            const call = provider === "CLAUDE" ? runClaude : runMistral;

            try {
              const res = await call(claimText, language);
              const inc = res.costTokens && res.costTokens > 0 ? res.costTokens : est;
              tokensUsed += inc;
              outputs.push(res);

              await prisma.providerRun.create({
                data: {
                  claimId: claim.id,
                  provider: res.provider,
                  verdict: res.verdict,
                  confidence: res.confidence,
                  costTokens: inc,
                  latencyMs: Date.now() - tStart,
                  raw: res.raw
                }
              });
            } catch (e: any) {
              await prisma.providerRun.create({
                data: {
                  claimId: claim.id,
                  provider,
                  verdict: "pending",
                  confidence: 0,
                  costTokens: 0,
                  latencyMs: Date.now() - tStart,
                  raw: { error: String(e?.message ?? e) }
                }
              });
            }

            continueChain = evaluateProviderChain(outputs, claimText, {
              tokensUsed,
              maxTokens: MAX_TOKENS_PER_JOB
            });
            if (!continueChain) break;
          }
        }

        // 4) Evidenz + Trust sammeln
        const allSources = outputs.flatMap(o => o.sources);
        const uniqDomains = Array.from(new Set(allSources.map(s => s.domain)));

        for (const src of allSources) {
          const t = await getTrust(src.domain);
          await prisma.evidence.create({
            data: {
              claimId: claim.id,
              url: src.url,
              domain: src.domain,
              stance: "NEUTRAL",
              trustScore: t.score
            }
          });
        }

        // Stats
        const evidenceFor = outputs
          .filter(o => o.verdict === "true")
          .reduce((n, o) => n + o.sources.length, 0);
        const evidenceAgainst = outputs
          .filter(o => o.verdict === "false")
          .reduce((n, o) => n + o.sources.length, 0);

        const providerTrusts: number[] = [];
        for (const o of outputs) {
          const trusts = await Promise.all(
            o.sources.map(async s => (await getTrust(s.domain)).score / 100)
          );
          providerTrusts.push(trusts.length ? trusts.reduce((a, b) => a + b, 0) / trusts.length : 0.8);
        }

        // 5) Konsens
        const consensus = advancedConsensus({
          outputs,
          providerTrusts,
          evidenceFor,
          evidenceAgainst,
          domains: uniqDomains
        });

        const cons = await prisma.consensusRun.create({
          data: {
            claimId: claim.id,
            method: outputs.length > 1 ? "multi-ki" : "ari",
            verdict: consensus.verdict,
            confidence: consensus.confidence,
            balanceScore: consensus.balanceScore,
            diversityIndex: consensus.diversityIndex,
            providers: outputs
          }
        });

        await prisma.verdictVersion.create({
          data: {
            claimId: claim.id,
            verdict: cons.verdict,
            confidence: cons.confidence
          }
        });

        // Claim-Status optional fortschreiben (z. B. auf "RESOLVED" o. ä.)
        await prisma.factcheckClaim.update({
          where: { id: claim.id },
          data: {
            status: "RESOLVED", // oder "REVIEWED" je nach gewünschter Semantik
            updatedAt: new Date()
          }
        });

        const exportObj = {
          claimId: claim.id,
          claimText,
          language,
          topic,
          scope: scope ?? topic ?? undefined,
          timeframe: timeframe ?? undefined,
          results: outputs.map(p => ({
            provider: p.provider,
            verdict: p.verdict,
            confidence: p.confidence,
            rawOutput: p.raw,
            costTokens: p.costTokens ?? estimateTokensFromText(claimText)
          })),
          consensus: {
            method: outputs.length > 1 ? "multi-ki" : "ari",
            verdict: consensus.verdict,
            confidence: consensus.confidence,
            explanation:
              "Advanced consensus: provider*confidence*trust, calibrated by diversity and evidence balance."
          },
          sources: allSources.map(s => ({
            url: s.url,
            domain: s.domain,
            trustScore: undefined,
            hash: undefined,
            timestamp: new Date().toISOString()
          })),
          audit: {
            createdAt: new Date().toISOString(),
            signatures: [],
            version: CLAIMTRUST_VERSION
          }
        };

        await prisma.factcheckResult.create({
          data: {
            jobId: fcJob.id,
            verdict: exportObj.consensus.verdict,
            rawOutput: exportObj
          }
        });

        await prisma.auditLog.create({
          data: {
            entityType: "FactcheckClaim",
            entityId: claim.id,
            action: "CONSENSUS",
            actor: "worker",
            meta: {
              jobId: fcJob.id,
              providers: outputs.map(o => o.provider),
              tokensUsed
            }
          }
        });
      }

      // Job fertig
      await prisma.factcheckJob.update({
        where: { id: fcJob.id },
        data: {
          status: "COMPLETED",
          tokensUsed,
          durationMs: Date.now() - tJobStart
        }
      });

      logger.info({ jobId: job.id }, "FACTCHECK_JOB_COMPLETED");
    },
    { connection, concurrency: WORKER_CONCURRENCY }
  );

  const events = new QueueEvents("factcheck", { connection });
  events.on("completed", ({ jobId }) => logger.info({ jobId }, "FACTCHECK_JOB_EVENT_COMPLETED"));
  events.on("failed", ({ jobId, failedReason }) =>
    logger.error({ jobId, failedReason }, "FACTCHECK_JOB_EVENT_FAILED")
  );

  return worker;
}
