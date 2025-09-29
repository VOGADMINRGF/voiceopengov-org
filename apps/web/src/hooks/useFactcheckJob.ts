
// apps/web/src/lib/hooks/useFactcheckJob.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type EnqueueBody = {
  text?: string;
  contributionId?: string;
  language?: string;
  topic?: string;
  priority?: number; // 1–10, default 5
};

type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;

type ProviderRun = {
  provider: string;
  verdict: string;
  confidence: number;
  costTokens?: number;
  raw?: unknown;
};

type Evidence = {
  url: string;
  domain: string;
  trustScore?: number;
};

type Claim = {
  id: string;
  text: string;
  falsifiable: boolean;
  frames: string[];
  rhetoricalFlags: string[];
  consensus?: {
    verdict: string;
    confidence: number;
  } | null;
  evidences?: Evidence[];
  providerRuns?: ProviderRun[];
};

type StatusResponse = {
  ok: boolean;
  job: {
    id: string;
    jobId: string;
    status: JobStatus;
    tokensUsed?: number | null;
    durationMs?: number | null;
    createdAt?: string;
    updatedAt?: string;
  };
  claims: Claim[];
};

type State = {
  jobId?: string;
  status?: JobStatus;
  claims?: Claim[];
  jobMeta?: StatusResponse["job"];
  error?: string;
  loading: boolean;
};

type Options = {
  /** poll-Intervall in ms (Basis). Backoff verdoppelt bis maxPollInterval. */
  pollInterval?: number;
  maxPollInterval?: number;
  /** Auto-Start: erst enqueue, dann poll */
  autoStart?: boolean;
  /** Bei Tab-Hidden pausieren (default true) */
  pauseWhenHidden?: boolean;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useFactcheckJob(initialJobId?: string, opts: Options = {}) {
  const {
    pollInterval = 1500,
    maxPollInterval = 8000,
    autoStart = false,
    pauseWhenHidden = true,
  } = opts;

  const [state, setState] = useState<State>({ loading: !!initialJobId || autoStart });
  const jobIdRef = useRef<string | undefined>(initialJobId);
  const abortRef = useRef<AbortController | null>(null);
  const activeRef = useRef<boolean>(false);

  const setError = (msg: string) =>
    setState((s) => ({ ...s, loading: false, error: msg }));

  const fetchStatus = useCallback(async (jobId: string) => {
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch(`/api/factcheck/status/${encodeURIComponent(jobId)}`, {
       method: "GET",
       cache: "no-store",
       signal: ac.signal,
       });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as StatusResponse;
      setState((s) => ({
        ...s,
        jobId,
        status: data.job?.status,
        claims: data.claims,
        jobMeta: data.job,
        loading: false,
        error: undefined,
      }));
      return data.job?.status as JobStatus;
    } finally {
      abortRef.current = null;
    }
  }, []);

  const pollUntilDone = useCallback(async () => {
    if (!jobIdRef.current) return;
    activeRef.current = true;
    let delay = pollInterval;

    // eslint-disable-next-line no-constant-condition
    while (activeRef.current) {
      if (pauseWhenHidden && typeof document !== "undefined" && document.hidden) {
        await sleep(500);
        continue;
      }

      const status = await fetchStatus(jobIdRef.current);
      if (status === "COMPLETED" || status === "FAILED") {
        activeRef.current = false;
        break;
      }

      await sleep(delay);
      delay = Math.min(delay * 2, maxPollInterval);
    }
  }, [fetchStatus, pollInterval, maxPollInterval, pauseWhenHidden]);

  const enqueue = useCallback(
    async (body: EnqueueBody) => {
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        setState((s) => ({ ...s, loading: true, error: undefined }));
        const res = await fetch("/api/factcheck/enqueue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: ac.signal,
          });
        
        const json = await res.json();
        if (!res.ok || !json?.jobId) {
          throw new Error(json?.message || "enqueue failed");
        }
        jobIdRef.current = json.jobId as string;
        setState((s) => ({
          ...s,
          jobId: jobIdRef.current,
          status: "PENDING",
          loading: true,
          error: undefined,
        }));
        pollUntilDone(); // fire and forget
        return jobIdRef.current;
      } catch (e: any) {
        setError(e?.message ?? String(e));
        throw e;
      } finally {
        abortRef.current = null;
      }
    },
    [pollUntilDone]
  );

  const start = useCallback(
    async (body?: EnqueueBody) => {
      if (body) return enqueue(body);
      if (!jobIdRef.current) throw new Error("No jobId set");
      setState((s) => ({ ...s, loading: true, error: undefined }));
      pollUntilDone();
      return jobIdRef.current;
    },
    [enqueue, pollUntilDone]
  );

  const cancel = useCallback(() => {
    activeRef.current = false;
    abortRef.current?.abort();
    setState((s) => ({ ...s, loading: false }));
  }, []);

  useEffect(() => {
    if (autoStart && !initialJobId) return; // needs body to enqueue
    if (initialJobId) {
      jobIdRef.current = initialJobId;
      pollUntilDone();
    }
    return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialJobId]);

  // Optional: Pause/Resume on visibility change
  useEffect(() => {
    if (!pauseWhenHidden) return;
    const onVis = () => {
      if (!jobIdRef.current) return;
      if (!document.hidden && activeRef.current === false && (state.status && state.status !== "COMPLETED" && state.status !== "FAILED")) {
        pollUntilDone();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseWhenHidden, state.status]);

  const done = useMemo(
    () => state.status === "COMPLETED" || state.status === "FAILED",
    [state.status]
  );

  return {
    ...state,
    done,
    start,     // pollt bestehenden Job weiter ODER enqueued+pollt (wenn body übergeben wird)
    enqueue,   // enqueued und startet Polling
    cancel,    // stoppt Polling
  };
}
