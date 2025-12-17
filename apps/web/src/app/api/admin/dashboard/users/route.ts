import { NextRequest, NextResponse } from "next/server";
import { ObjectId, getCol } from "@core/db/triMongo";
import { requireAdminOrResponse, userIsSuperadmin } from "@/lib/server/auth/admin";
import type { UserRole } from "@/types/user";
import { deriveAccessTierFromPlanCode } from "@core/access/accessTiers";

type UserDoc = {
  _id: ObjectId;
  email: string;
  name?: string | null;
  roles?: UserRole[];
  role?: UserRole | null;
  createdAt?: Date;
  lastLoginAt?: Date;
  accessTier?: string | null;
  b2cPlanId?: string | null;
  tier?: string | null;
  stats?: { lastSeenAt?: Date };
  membership?: any;
  settings?: { newsletterOptIn?: boolean | null };
  newsletterOptIn?: boolean | null;
};

function mapUser(doc: UserDoc) {
  const roles = Array.isArray(doc.roles)
    ? doc.roles
    : doc.role
    ? [doc.role]
    : [];
  const pkg = doc.membership?.edebatte?.planKey ?? null;
  const membershipStatus = doc.membership?.status ?? null;
  const lastSeen = doc.stats?.lastSeenAt ?? doc.lastLoginAt ?? null;
  const newsletterOptIn = Boolean(doc.settings?.newsletterOptIn ?? doc.newsletterOptIn);
  const planCode = doc.membership?.planCode ?? null;
  const accessTier = doc.accessTier ?? doc.b2cPlanId ?? doc.tier ?? null;

  return {
    id: String(doc._id),
    email: doc.email,
    name: doc.name ?? null,
    roles,
    packageCode: pkg,
    membershipStatus,
    newsletterOptIn,
    accessTier,
    planCode,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    lastSeenAt: lastSeen ? new Date(lastSeen).toISOString() : null,
  };
}

export async function GET(req: NextRequest) {
  const gate = await requireAdminOrResponse(req);
  if (gate instanceof Response) return gate;

  const users = await getCol<UserDoc>("users");
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim();
  const role = searchParams.get("role");
  const pkg = searchParams.get("package");
  const newsletter = searchParams.get("newsletter");
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 25);
  const activeDays = Number(searchParams.get("activeDays") ?? NaN);
  const createdDays = Number(searchParams.get("createdDays") ?? NaN);

  const filter: any = {};
  if (q) {
    filter.$or = [
      { email: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
    ];
  }
  if (role) {
    filter.$or = filter.$or || [];
    filter.$or.push({ roles: role }, { role });
  }
  if (pkg) {
    filter["membership.edebatte.planKey"] = pkg;
  }
  if (newsletter === "true") {
    filter.$or = filter.$or || [];
    filter.$or.push({ "settings.newsletterOptIn": true }, { newsletterOptIn: true });
  } else if (newsletter === "false") {
    filter.$or = filter.$or || [];
    filter.$or.push({ "settings.newsletterOptIn": { $ne: true } }, { newsletterOptIn: { $ne: true } });
  }
  if (!Number.isNaN(activeDays) && activeDays > 0) {
    const since = new Date();
    since.setDate(since.getDate() - activeDays);
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [{ "stats.lastSeenAt": { $gte: since } }, { lastLoginAt: { $gte: since } }],
    });
  }
  if (!Number.isNaN(createdDays) && createdDays > 0) {
    const since = new Date();
    since.setDate(since.getDate() - createdDays);
    filter.$and = filter.$and || [];
    filter.$and.push({ createdAt: { $gte: since } });
  }

  const total = await users.countDocuments(filter);
  const docs = await users
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  return NextResponse.json({
    items: docs.map(mapUser),
    total,
    page,
    pageSize,
  });
}

export async function PATCH(req: NextRequest) {
  const actor = await requireAdminOrResponse(req);
  if (actor instanceof Response) return actor;

  const body = (await req.json().catch(() => ({}))) as {
    userId?: string;
    roles?: UserRole[];
    packageCode?: string | null;
    membershipStatus?: string | null;
    newsletterOptIn?: boolean;
    planCode?: string | null;
    accessTier?: string | null;
  };

  if (!body.userId || !ObjectId.isValid(body.userId)) {
    return NextResponse.json({ ok: false, error: "missing_user" }, { status: 400 });
  }

  const users = await getCol<UserDoc>("users");
  const target = await users.findOne({ _id: new ObjectId(body.userId) }, { projection: { roles: 1, role: 1 } });
  if (!target) return NextResponse.json({ ok: false, error: "user_not_found" }, { status: 404 });

  // safety: only superadmin can edit superadmin roles
  const actorIsSuper = userIsSuperadmin(actor as any);
  const targetRoles = Array.isArray(target.roles)
    ? target.roles
    : target.role
    ? [target.role]
    : [];

  if (targetRoles.includes("superadmin") && !actorIsSuper) {
    return NextResponse.json({ ok: false, error: "forbidden_superadmin" }, { status: 403 });
  }

  const update: any = {};
  if (Array.isArray(body.roles)) {
    if (body.roles.includes("superadmin") && !actorIsSuper) {
      return NextResponse.json({ ok: false, error: "forbidden_superadmin" }, { status: 403 });
    }
    update.roles = body.roles;
  }
  if (body.packageCode !== undefined) {
    update["membership.edebatte.planKey"] = body.packageCode;
  }
  if (body.membershipStatus !== undefined) {
    update["membership.status"] = body.membershipStatus;
  }
  const incomingPlan = typeof body.planCode === "string" ? body.planCode : typeof body.accessTier === "string" ? body.accessTier : null;
  if (incomingPlan) {
    const derived = deriveAccessTierFromPlanCode(incomingPlan);
    update["membership.planCode"] = incomingPlan;
    update.accessTier = derived;
    update.b2cPlanId = derived;
    update.tier = derived;
  }
  if (body.newsletterOptIn !== undefined) {
    update["settings.newsletterOptIn"] = !!body.newsletterOptIn;
    update.newsletterOptIn = !!body.newsletterOptIn;
  }

  if (!Object.keys(update).length) {
    return NextResponse.json({ ok: false, error: "nothing_to_update" }, { status: 400 });
  }

  await users.updateOne({ _id: new ObjectId(body.userId) }, { $set: update, $currentDate: { updatedAt: true } });
  const updated = await users.findOne({ _id: new ObjectId(body.userId) });
  return NextResponse.json({ ok: true, user: updated ? mapUser(updated as UserDoc) : null });
}
