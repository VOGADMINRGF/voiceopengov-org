import { NextResponse } from "next/server";
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
  publicSupporter?: boolean;
  supporterImageUrl?: string;
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
  const publicSupporter = Boolean(body.publicSupporter);
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

    publicSupporter,
    supporterImageUrl: publicSupporter ? (body.supporterImageUrl?.trim() || undefined) : undefined,

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
