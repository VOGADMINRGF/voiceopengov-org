cat > vog_setup.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail

bold() { printf "\033[1m%s\033[0m\n" "$*"; }
ok()   { printf "✅ %s\n" "$*"; }
warn() { printf "⚠️  %s\n" "$*"; }
err()  { printf "❌ %s\n" "$*"; }

need() { command -v "$1" >/dev/null 2>&1 || { err "Missing: $1 (install it first)"; exit 1; }; }

backup_file() {
  local f="$1"
  if [ -f "$f" ]; then
    local ts
    ts="$(date +%Y%m%d_%H%M%S)"
    cp "$f" "${f}.bak_${ts}"
    warn "Backup: $f -> ${f}.bak_${ts}"
  fi
}

write_if_missing() {
  local f="$1"
  local content="$2"
  if [ -f "$f" ]; then
    warn "Exists, skip: $f"
  else
    mkdir -p "$(dirname "$f")"
    printf "%s" "$content" > "$f"
    ok "Created: $f"
  fi
}

replace_in_file() {
  local f="$1"
  local from="$2"
  local to="$3"
  if [ ! -f "$f" ]; then return 0; fi
  if rg -n "$from" "$f" >/dev/null 2>&1; then
    backup_file "$f"
    perl -0777 -i -pe "s/$from/$to/gm" "$f"
    ok "Patched: $f"
  fi
}

# --------------------------
# Preflight
# --------------------------
need rg
need node

bold "VoiceOpenGov setup (Membership + Globe)"
echo

if [ ! -f "package.json" ]; then
  err "Run this from repo root (package.json missing)."
  exit 1
fi

APP_DIR=""
if [ -d "apps/web" ]; then
  APP_DIR="apps/web"
elif [ -d "apps" ]; then
  # fallback: pick first Next app with src/app
  APP_DIR="$(find apps -maxdepth 3 -type d -path "*/src/app" | head -n1 | xargs -I{} dirname {})"
fi

if [ -z "$APP_DIR" ] || [ ! -d "$APP_DIR" ]; then
  err "Could not detect app directory. Expected apps/web."
  exit 1
fi

ok "App dir: $APP_DIR"
echo

# --------------------------
# 0) Report: old copy / routes
# --------------------------
bold "0) Scanning for old copy/routes (no destructive changes)…"
rg -n "eDebatte vorbestell|vorbestell|preorder|pre-order|mitglied-werden|Mitglied werden" . || true
echo

# --------------------------
# 1) Ensure deps (best effort)
# --------------------------
bold "1) Ensuring globe deps (best effort)…"
if command -v pnpm >/dev/null 2>&1; then
  # Install only in the app workspace
  ( pnpm --filter "./${APP_DIR}" add react-globe.gl three three-globe world-countries ) \
    && ok "Deps installed in ${APP_DIR}" \
    || warn "pnpm add failed (peer deps). If needed set .npmrc: strict-peer-dependencies=false then rerun."
else
  warn "pnpm not found. Install deps manually in ${APP_DIR}: react-globe.gl three three-globe world-countries"
fi
echo

# --------------------------
# 2) Types for world-countries
# --------------------------
bold "2) Adding TS declaration for world-countries (if missing)…"
write_if_missing "${APP_DIR}/src/types/world-countries.d.ts" \
'declare module "world-countries" {
  const countries: Array<{
    cca2: string;
    name: { common: string };
    latlng?: [number, number];
    capital?: string[];
  }>;
  export default countries;
}
'
echo

# --------------------------
# 3) Mongo helper + model
# --------------------------
bold "3) Creating Mongo helper for VoiceOpenGov (vog_public)…"
write_if_missing "${APP_DIR}/src/lib/vogMongo.ts" \
'import { MongoClient, Db, Collection } from "mongodb";

let _client: MongoClient | null = null;
let _db: Db | null = null;

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

/**
 * Use same Atlas cluster as eDebatte if you want,
 * but keep data logically separated by DB name.
 *
 * Required:
 *   MONGODB_URI
 * Optional:
 *   VOG_DB_NAME (default: vog_public)
 */
export async function vogDb(): Promise<Db> {
  if (_db) return _db;
  const uri = env("MONGODB_URI");
  const dbName = process.env.VOG_DB_NAME || "vog_public";
  _client = _client ?? new MongoClient(uri);
  await _client.connect();
  _db = _client.db(dbName);
  return _db;
}

export type MemberType = "person" | "organisation";
export type MemberStatus = "pending" | "active";

export type MemberDoc = {
  _id?: any;

  type: MemberType;
  email: string;

  firstName?: string;
  lastName?: string;
  orgName?: string;

  city?: string;
  country?: string;
  lat?: number;
  lng?: number;

  isPublic: boolean;
  avatarUrl?: string; // optional logo/photo url

  wantsNewsletterEdDebatte: boolean;

  status: MemberStatus;
  doiToken?: string;
  doiExpiresAt?: Date;
  confirmedAt?: Date;

  createdAt: Date;
};

export async function membersCol(): Promise<Collection<MemberDoc>> {
  const db = await vogDb();
  const col = db.collection<MemberDoc>("members");

  // indexes (best-effort)
  await col.createIndex(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $type: "string" } } }
  ).catch(() => {});

  await col.createIndex({ status: 1 }).catch(() => {});
  await col.createIndex({ isPublic: 1 }).catch(() => {});
  await col.createIndex({ city: 1 }).catch(() => {});
  await col.createIndex({ lat: 1, lng: 1 }).catch(() => {});

  return col;
}
'
echo

# --------------------------
# 4) API routes: register, confirm, public-locations
# --------------------------
bold "4) Creating API routes for membership + globe…"
API_BASE="${APP_DIR}/src/app/api"

write_if_missing "${API_BASE}/members/public-register/route.ts" \
'import { NextResponse } from "next/server";
import crypto from "crypto";
import { membersCol, type MemberDoc } from "@/lib/vogMongo";

type Body = {
  type: "person" | "organisation";
  email: string;

  firstName?: string;
  lastName?: string;
  orgName?: string;

  city?: string;
  country?: string;
  lat?: number;
  lng?: number;

  isPublic?: boolean;
  avatarUrl?: string; // optional (upload comes later)
  wantsNewsletterEdDebatte?: boolean;

  // Optional donation intent: min 5 EUR (500 cents). Not charged here.
  donationCents?: number;
};

const MIN_DONATION_CENTS = 500;

function normEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.email) return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });

  const email = normEmail(body.email);
  const type = body.type === "organisation" ? "organisation" : "person";
  const isPublic = Boolean(body.isPublic);
  const wantsNewsletterEdDebatte = Boolean(body.wantsNewsletterEdDebatte);

  const donationCents = typeof body.donationCents === "number" ? body.donationCents : 0;
  if (donationCents > 0 && donationCents < MIN_DONATION_CENTS) {
    return NextResponse.json({ ok: false, error: "donation_min_5_eur" }, { status: 400 });
  }

  // Double Opt-In: token (48h)
  const token = crypto.randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const doc: MemberDoc = {
    type,
    email,

    firstName: body.firstName?.trim() || undefined,
    lastName: body.lastName?.trim() || undefined,
    orgName: body.orgName?.trim() || undefined,

    city: body.city?.trim() || undefined,
    country: body.country?.trim() || undefined,
    lat: typeof body.lat === "number" ? body.lat : undefined,
    lng: typeof body.lng === "number" ? body.lng : undefined,

    isPublic,
    avatarUrl: isPublic ? (body.avatarUrl?.trim() || undefined) : undefined,

    wantsNewsletterEdDebatte,
    status: "pending",

    doiToken: token,
    doiExpiresAt: expires,

    createdAt: new Date(),
  };

  const col = await membersCol();

  await col.updateOne(
    { email },
    {
      $set: doc,
      $setOnInsert: { createdAt: doc.createdAt },
    },
    { upsert: true }
  );

  // TODO: Send DOI email here (Resend/SMTP/Postmark).
  // Confirmation link:
  //   `${process.env.PUBLIC_BASE_URL}/api/members/confirm?token=${token}`
  //
  // For dev convenience, we return token only in non-production:
  const isDev = process.env.NODE_ENV !== "production";
  return NextResponse.json({ ok: true, devToken: isDev ? token : undefined });
}
'

write_if_missing "${API_BASE}/members/confirm/route.ts" \
'import { NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });

  const col = await membersCol();
  const now = new Date();

  const member = await col.findOne({ doiToken: token });
  if (!member) return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });

  if (member.doiExpiresAt && member.doiExpiresAt < now) {
    return NextResponse.json({ ok: false, error: "token_expired" }, { status: 400 });
  }

  await col.updateOne(
    { _id: member._id },
    { $set: { status: "active", confirmedAt: now }, $unset: { doiToken: "", doiExpiresAt: "" } }
  );

  const base = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
  return NextResponse.redirect(`${base}/?confirmed=1`);
}
'

write_if_missing "${API_BASE}/members/public-locations/route.ts" \
'import { NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";

export async function GET() {
  const col = await membersCol();

  // Active members with a city + coordinates. Aggregated by (city, lat, lng).
  const pipeline = [
    { $match: { status: "active", city: { $type: "string" }, lat: { $type: "number" }, lng: { $type: "number" } } },
    { $group: { _id: { city: "$city", lat: "$lat", lng: "$lng" }, count: { $sum: 1 } } },
    { $project: { _id: 0, city: "$_id.city", lat: "$_id.lat", lng: "$_id.lng", count: 1 } },
    { $sort: { count: -1, city: 1 } },
    { $limit: 500 }
  ];

  const points = await col.aggregate(pipeline).toArray();
  return NextResponse.json({ ok: true, points });
}
'
echo

# --------------------------
# 5) Seed Berlin/Weimar
# --------------------------
bold "5) Creating seed script (Berlin + Weimar)…"
mkdir -p "${APP_DIR}/scripts"

write_if_missing "${APP_DIR}/scripts/seed_vog_members.ts" \
'import { membersCol } from "../src/lib/vogMongo";

async function main() {
  const col = await membersCol();

  const seed = [
    {
      type: "person",
      email: "seed-berlin@voiceopengov.local",
      firstName: "Seed",
      lastName: "Berlin",
      city: "Berlin",
      country: "Germany",
      lat: 52.52,
      lng: 13.405,
      isPublic: true,
      wantsNewsletterEdDebatte: false,
      status: "active",
      createdAt: new Date(),
      confirmedAt: new Date(),
    },
    {
      type: "person",
      email: "seed-weimar@voiceopengov.local",
      firstName: "Seed",
      lastName: "Weimar",
      city: "Weimar",
      country: "Germany",
      lat: 50.9795,
      lng: 11.3290,
      isPublic: true,
      wantsNewsletterEdDebatte: false,
      status: "active",
      createdAt: new Date(),
      confirmedAt: new Date(),
    },
  ] as const;

  for (const m of seed) {
    await col.updateOne({ email: m.email }, { $set: m }, { upsert: true });
  }

  console.log("Seeded:", seed.map(s => s.email).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
'
echo

# --------------------------
# 6) Globe component (draggable, no borders)
# --------------------------
bold "6) Creating/patching globe component (draggable, no borders)…"

GLOBE_COMP="${APP_DIR}/src/components/home/GlobeSupporters.tsx"

# If file doesn't exist, create it.
write_if_missing "$GLOBE_COMP" \
'"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type GlobePoint = { city: string; lat: number; lng: number; count: number };

export function GlobeSupporters() {
  const ref = useRef<any>(null);
  const [points, setPoints] = useState<GlobePoint[]>([]);
  const [loading, setLoading] = useState(true);

  const globeImageUrl =
    // neutral earth texture (no political borders)
    "https://unpkg.com/three-globe/example/img/earth-night.jpg";

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/members/public-locations", { cache: "no-store" });
        const json = await res.json();
        if (!mounted) return;
        setPoints(Array.isArray(json?.points) ? json.points : []);
      } catch {
        if (!mounted) return;
        setPoints([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Configure controls: auto-rotate but user can drag/zoom
  useEffect(() => {
    const g = ref.current;
    if (!g) return;

    const controls = g.controls?.();
    if (!controls) return;

    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // Start view (Europe-ish)
    g.pointOfView({ lat: 51, lng: 10, altitude: 2.2 }, 0);
  }, [ref.current]);

  const sizeByCount = (c: number) => {
    // keep it subtle
    if (c >= 50) return 0.7;
    if (c >= 10) return 0.5;
    return 0.35;
  };

  const pointsData = useMemo(() => {
    return points.map(p => ({ ...p, size: sizeByCount(p.count) }));
  }, [points]);

  return (
    <div className="w-full rounded-2xl border bg-white/60 backdrop-blur p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-600">GLOBUS (AGGREGIERT)</div>
          <div className="text-xs text-slate-500">Keine Einzelprofile, nur Orts-Summen.</div>
        </div>
        <div className="text-xs text-slate-500">{loading ? "lädt…" : `${points.length} Orte`}</div>
      </div>

      <div className="h-[320px] w-full overflow-hidden rounded-xl bg-slate-950/5">
        <Globe
          ref={ref}
          globeImageUrl={globeImageUrl}
          backgroundColor="rgba(0,0,0,0)"
          // IMPORTANT: no polygons / no borders: we render only points.
          pointsData={pointsData}
          pointLat={(d: any) => d.lat}
          pointLng={(d: any) => d.lng}
          pointAltitude={(d: any) => d.size}
          pointRadius={(d: any) => 0.18}
          pointLabel={(d: any) => `${d.city}: ${d.count}`}
          // interactivity
          onPointClick={(d: any) => {
            // optional: jump to point
            ref.current?.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.8 }, 700);
          }}
        />
      </div>

      <div className="mt-2 text-xs text-slate-500">
        Der Globus zeigt aggregierte Ortszählungen. Keine Einzelprofile, keine Rohdaten.
      </div>
    </div>
  );
}
'
# If file existed, patch is manual; we don’t auto-rewrite large components safely.
if [ -f "$GLOBE_COMP" ]; then
  ok "Globe component present: $GLOBE_COMP"
  warn "If you already had a GlobeSupporters.tsx, ensure it renders only points (no polygons) and uses a neutral texture."
fi

echo

# --------------------------
# 7) Replace "eDebatte vorbestellen" copy (safe)
# --------------------------
bold "7) Replacing 'eDebatte vorbestellen' copy (safe patches)…"
# Try to patch in likely files. If they don't exist, nothing happens.
CANDIDATES=(
  "${APP_DIR}/src/components/home/HomeClient.tsx"
  "${APP_DIR}/src/components/home/Hero.tsx"
  "${APP_DIR}/src/components/home/LandingHero.tsx"
  "${APP_DIR}/src/features/landing/landingCopy.ts"
  "${APP_DIR}/src/features/landing/landingCopy.de.ts"
  "${APP_DIR}/src/features/landing/copy.ts"
)

for f in "${CANDIDATES[@]}"; do
  replace_in_file "$f" "eDebatte vorbestellen" "Mehr über eDebatte erfahren"
done

echo
warn "If the CTA is generated elsewhere, run:"
echo "  rg -n \"eDebatte vorbestellen|vorbestell\" ${APP_DIR}/src"
echo "and replace remaining occurrences."
echo

# --------------------------
# 8) Create env sample + guidance
# --------------------------
bold "8) Creating .env.local template (won't overwrite)…"
write_if_missing "${APP_DIR}/.env.local.example" \
'MONGODB_URI="mongodb+srv://vog_db_api:<PASSWORD>@<CLUSTER>/?retryWrites=true&w=majority"
VOG_DB_NAME="vog_public"
PUBLIC_BASE_URL="http://localhost:3000"
'
echo

# --------------------------
# 9) Run instructions
# --------------------------
bold "DONE. Next commands:"
cat <<'TXT'

1) Copy env template:
   cp apps/web/.env.local.example apps/web/.env.local
   # Then edit apps/web/.env.local and set MONGODB_URI + PUBLIC_BASE_URL

2) Seed Berlin/Weimar (recommended via tsx):
   pnpm --filter ./apps/web add -D tsx
   pnpm --filter ./apps/web tsx scripts/seed_vog_members.ts

3) Start dev:
   pnpm --filter ./apps/web dev

4) Test globe endpoint:
   curl -s http://localhost:3000/api/members/public-locations | jq

Globe requirements satisfied by default in GlobeSupporters.tsx:
- draggable (OrbitControls)
- auto-rotates but user can drag
- NO borders (only points, no polygon layers)
- neutral earth texture (no political borders)

TXT

ok "Setup completed (no destructive deletes)."
BASH

chmod +x vog_setup.sh
./vog_setup.sh
