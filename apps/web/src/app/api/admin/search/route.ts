import { NextRequest, NextResponse } from "next/server";
import { coreCol, getCol } from "@core/db/triMongo";
import { evidenceItemsCol } from "@core/evidence/db";
import { findEvidenceClaims, type EvidenceClaimWithMeta } from "@core/evidence/query";
import type { EvidenceItemDoc } from "@core/evidence/types";
import { voteDraftsCol } from "@features/feeds/db";
import type { VoteDraftDoc } from "@features/feeds/types";
import { eventualitySnapshotsCol } from "@core/eventualities/db";
import type { EventualitySnapshotDoc } from "@core/eventualities/types";
import type { UserRole } from "@/types/user";
import { requireAdminOrResponse } from "@/lib/server/auth/admin";

type UserDoc = {
  _id: any;
  email: string;
  email_lc?: string | null;
  name?: string | null;
  roles?: UserRole[];
  role?: UserRole | null;
  settings?: { newsletterOptIn?: boolean | null };
  newsletterOptIn?: boolean | null;
  createdAt?: Date;
};

type SearchGroup =
  | "Nutzer"
  | "Newsletter"
  | "Research Tasks"
  | "Feed Drafts"
  | "Eventualitaeten"
  | "Evidence Claims"
  | "Evidence Items"
  | "Reports";

type SearchItem = {
  id: string;
  group: SearchGroup;
  label: string;
  description?: string | null;
  href: string;
  badge?: string | null;
};

const LIMIT_USERS = 6;
const LIMIT_NEWSLETTER = 5;
const LIMIT_TASKS = 5;
const LIMIT_DRAFTS = 5;
const LIMIT_EVENTUALITIES = 5;
const LIMIT_CLAIMS = 5;
const LIMIT_ITEMS = 5;

// Guardrails (avoid expensive regex / huge payload)
const MIN_QUERY_LEN = 2;
const MAX_QUERY_LEN = 80;

export async function GET(req: NextRequest) {
  const gate = await requireAdminOrResponse(req);
  if (gate instanceof Response) return gate;

  const raw = req.nextUrl.searchParams.get("q") ?? "";
  const query = raw.trim();

  if (!query) return NextResponse.json({ ok: true, items: [] as SearchItem[] });

  // Hard limit to avoid pathological regex strings
  const safeQuery = query.slice(0, MAX_QUERY_LEN);

  // If you want to allow single-char searches for users only, you can tweak this.
  if (safeQuery.length < 1) return NextResponse.json({ ok: true, items: [] as SearchItem[] });

  const regex = buildSafeRegex(safeQuery);

  // Run in parallel but fail-safe (one loader error shouldn't 500 the whole endpoint)
  const [users, newsletter, tasks, drafts, eventualities, claims, items] = await Promise.all([
    safeCall(() => loadUsers(regex), [] as UserDoc[]),
    safeCall(() => loadNewsletter(regex), [] as UserDoc[]),
    safeCall(() => loadResearchTasks(regex), [] as ResearchTaskHit[]),
    safeCall(() => loadFeedDrafts(regex), [] as FeedDraftHit[]),
    safeCall(() => loadEventualitySnapshots(regex), [] as EventualitySnapshotDoc[]),
    safeCall(() => loadEvidenceClaims(safeQuery), [] as EvidenceClaimWithMeta[]),
    safeCall(() => loadEvidenceItems(safeQuery, regex), [] as EvidenceItemDoc[]),
  ]);

  const results: SearchItem[] = [];

  // Users
  for (const doc of users) {
    const roles = Array.isArray(doc.roles) ? doc.roles : doc.role ? [doc.role] : [];
    const name = doc.name?.trim() || null;
    const label = name || doc.email || "Unbekannter Nutzer";
    const descriptionParts: string[] = [];
    if (name) descriptionParts.push(doc.email);
    if (roles.length) descriptionParts.push(roles.join(", "));
    if (doc.settings?.newsletterOptIn || doc.newsletterOptIn) descriptionParts.push("Newsletter");
    const description = descriptionParts.filter(Boolean).join(" · ");
    const hrefQuery = doc.email || name || safeQuery;

    results.push({
      id: `user:${String(doc._id)}`,
      group: "Nutzer",
      label,
      description,
      href: `/admin/users?q=${encodeURIComponent(hrefQuery)}`,
      badge: roles[0] ?? null,
    });
  }

  // Newsletter (subset of users)
  for (const doc of newsletter) {
    const name = doc.name?.trim() || null;
    results.push({
      id: `newsletter:${String(doc._id)}`,
      group: "Newsletter",
      label: doc.email || "Newsletter Abo",
      description: name ? name : null,
      href: `/admin/newsletter?q=${encodeURIComponent(doc.email)}`,
    });
  }

  // Research Tasks
  for (const task of tasks) {
    const label = task.title?.trim() || "Research Task";
    const meta = [task.kind, task.level, task.status].filter(Boolean).join(" · ");
    const tags = task.tags?.length ? `Tags: ${task.tags.slice(0, 3).join(", ")}` : null;
    const description = [meta, tags].filter(Boolean).join(" · ");

    results.push({
      id: `task:${task.id}`,
      group: "Research Tasks",
      label,
      description,
      href: `/admin/research/tasks?taskId=${encodeURIComponent(task.id)}`,
      badge: task.status ?? null,
    });
  }

  // Feed Drafts
  for (const draft of drafts) {
    const label = draft.title?.trim() || "Feed Draft";
    const descParts = [
      draft.status ? `Status: ${draft.status}` : null,
      draft.regionCode ?? null,
      draft.pipeline ?? null,
    ].filter(Boolean);

    results.push({
      id: `draft:${draft.id}`,
      group: "Feed Drafts",
      label,
      description: descParts.join(" · "),
      href: `/admin/feeds/drafts/${encodeURIComponent(draft.id)}`,
      badge: draft.status ?? null,
    });
  }

  // Eventualities
  for (const snapshot of eventualities) {
    const descParts = [
      snapshot.locale ?? null,
      snapshot.reviewed ? "Review ok" : "Offen",
      `${snapshot.nodesCount ?? 0} Nodes`,
      `${snapshot.treesCount ?? 0} Trees`,
    ].filter(Boolean);

    results.push({
      id: `eventuality:${snapshot.contributionId}`,
      group: "Eventualitaeten",
      label: snapshot.contributionId,
      description: descParts.join(" · "),
      href: `/admin/eventualities/${encodeURIComponent(snapshot.contributionId)}`,
      badge: snapshot.reviewed ? "reviewed" : "open",
    });
  }

  // Evidence Claims
  for (const entry of claims) {
    const claim = entry.claim;
    const rawLabel = claim.text?.trim() || "Claim";
    const descParts = [claim.locale ?? null, claim.regionCode ?? "global", claim.meta?.pipeline ?? null].filter(Boolean);

    results.push({
      id: `claim:${claim._id.toString()}`,
      group: "Evidence Claims",
      label: rawLabel.length > 140 ? `${rawLabel.slice(0, 140)}…` : rawLabel,
      description: descParts.join(" · "),
      href: `/admin/evidence/claims/${claim._id.toString()}`,
    });
  }

  // Evidence Items
  for (const doc of items) {
    const label = doc.shortTitle?.trim() || doc.publisher || doc.url;
    const descParts = [doc.publisher, doc.sourceKind].filter(Boolean);

    results.push({
      id: `evidence:${doc._id.toString()}`,
      group: "Evidence Items",
      label,
      description: descParts.join(" · "),
      href: `/admin/evidence/items/${doc._id.toString()}`,
    });
  }

  // Reports (synthetic)
  if (safeQuery.length >= MIN_QUERY_LEN) {
    results.push(
      {
        id: `report-topic:${safeQuery}`,
        group: "Reports",
        label: `Topic Report: ${safeQuery}`,
        description: "Oeffnet den Topic-Report",
        href: `/admin/reports/topic/${encodeURIComponent(safeQuery)}`,
      },
      {
        id: `report-region:${safeQuery}`,
        group: "Reports",
        label: `Region Report: ${safeQuery}`,
        description: "Oeffnet den Region-Report",
        href: `/admin/reports/region/${encodeURIComponent(safeQuery)}`,
      },
    );
  }

  // Dedupe (by id) + stable sort (group then label)
  const deduped = dedupeById(results).sort((a, b) => {
    if (a.group !== b.group) return a.group.localeCompare(b.group, "de");
    return a.label.localeCompare(b.label, "de");
  });

  return NextResponse.json({ ok: true, items: deduped });
}

/* --------------------------------- loaders -------------------------------- */

async function loadUsers(regex: RegExp): Promise<UserDoc[]> {
  const users = await getCol<UserDoc>("users");
  return users
    .find({
      $or: [{ email: { $regex: regex } }, { email_lc: { $regex: regex } }, { name: { $regex: regex } }],
    })
    .sort({ createdAt: -1 })
    .limit(LIMIT_USERS)
    .toArray();
}

async function loadNewsletter(regex: RegExp): Promise<UserDoc[]> {
  const users = await getCol<UserDoc>("users");
  return users
    .find({
      $and: [
        {
          $or: [{ email: { $regex: regex } }, { email_lc: { $regex: regex } }, { name: { $regex: regex } }],
        },
        { $or: [{ "settings.newsletterOptIn": true }, { newsletterOptIn: true }] },
      ],
    })
    .sort({ createdAt: -1 })
    .limit(LIMIT_NEWSLETTER)
    .toArray();
}

type ResearchTaskDoc = {
  _id: any;
  title?: string;
  description?: string;
  kind?: string;
  level?: string;
  status?: string;
  tags?: string[];
  createdAt?: Date;
};

type ResearchTaskHit = {
  id: string;
  title: string;
  description?: string;
  kind?: string;
  level?: string;
  status?: string;
  tags?: string[];
};

async function loadResearchTasks(regex: RegExp): Promise<ResearchTaskHit[]> {
  if (regex.source.length < MIN_QUERY_LEN) return [];

  // IMPORTANT: coreCol(...) is async in your setup => await it
  const col = await coreCol<ResearchTaskDoc>("researchTasks");

  const docs = await col
    .find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }, { tags: { $regex: regex } }],
    })
    .sort({ createdAt: -1 })
    .limit(LIMIT_TASKS)
    .toArray();

  return docs.map((doc) => ({
    id: toId(doc._id),
    title: doc.title ?? "Research Task",
    description: doc.description ?? undefined,
    kind: doc.kind ?? undefined,
    level: doc.level ?? undefined,
    status: doc.status ?? undefined,
    tags: doc.tags ?? undefined,
  }));
}

type FeedDraftHit = {
  id: string;
  title: string;
  status?: VoteDraftDoc["status"];
  regionCode?: VoteDraftDoc["regionCode"];
  pipeline?: VoteDraftDoc["pipeline"];
};

async function loadFeedDrafts(regex: RegExp): Promise<FeedDraftHit[]> {
  if (regex.source.length < MIN_QUERY_LEN) return [];

  const drafts = await voteDraftsCol();
  const docs = await drafts
    .find({ $or: [{ title: { $regex: regex } }, { sourceUrl: { $regex: regex } }] })
    .sort({ createdAt: -1 })
    .limit(LIMIT_DRAFTS)
    .toArray();

  return docs.map((doc) => ({
    id: toId(doc._id),
    title: doc.title ?? "Feed Draft",
    status: doc.status,
    regionCode: doc.regionCode ?? undefined,
    pipeline: doc.pipeline ?? undefined,
  }));
}

async function loadEventualitySnapshots(regex: RegExp): Promise<EventualitySnapshotDoc[]> {
  if (regex.source.length < MIN_QUERY_LEN) return [];
  const col = await eventualitySnapshotsCol();
  return col
    .find({ $or: [{ contributionId: { $regex: regex } }, { userIdMasked: { $regex: regex } }] })
    .sort({ updatedAt: -1 })
    .limit(LIMIT_EVENTUALITIES)
    .toArray();
}

async function loadEvidenceClaims(query: string): Promise<EvidenceClaimWithMeta[]> {
  if (query.length < MIN_QUERY_LEN) return [];
  const result = await findEvidenceClaims({ textQuery: query, limit: LIMIT_CLAIMS, offset: 0 });
  return result.items ?? [];
}

async function loadEvidenceItems(query: string, regex: RegExp): Promise<EvidenceItemDoc[]> {
  if (query.length < MIN_QUERY_LEN) return [];
  const col = await evidenceItemsCol();
  return col
    .find({
      $and: [
        {
          $or: [{ shortTitle: { $regex: regex } }, { publisher: { $regex: regex } }, { url: { $regex: regex } }],
        },
        { $or: [{ isActive: { $ne: false } }, { isActive: { $exists: false } }] },
      ],
    })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(LIMIT_ITEMS)
    .toArray();
}

/* --------------------------------- helpers -------------------------------- */

function buildSafeRegex(input: string): RegExp {
  // Escape to prevent regex injection; keep "i" for UX
  return new RegExp(escapeRegExp(input), "i");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toId(v: any): string {
  return v?.toString?.() ?? String(v);
}

function dedupeById(items: SearchItem[]): SearchItem[] {
  const seen = new Set<string>();
  const out: SearchItem[] = [];
  for (const it of items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  return out;
}

async function safeCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}
