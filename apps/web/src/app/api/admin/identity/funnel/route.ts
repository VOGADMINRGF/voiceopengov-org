// apps/web/src/app/api/admin/identity/funnel/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCol } from "@core/db/triMongo";

export const runtime = "nodejs";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("u_role")?.value === "admin";
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const Users = await getCol("users");

  const [
    totalAccounts,
    emailVerified,
    onboardingComplete,
    twoFactorEnabled,
  ] = await Promise.all([
    Users.countDocuments({}),
    Users.countDocuments({
      $or: [{ verifiedEmail: true }, { emailVerified: true }],
    }),
    Users.countDocuments({
      $or: [
        { "profile.displayName": { $exists: true, $nin: [null, ""] } },
        { "profile.locale": { $exists: true, $nin: [null, ""] } },
        { city: { $exists: true, $nin: [null, ""] } },
        { region: { $exists: true, $nin: [null, ""] } },
      ],
    }),
    Users.countDocuments({
      $or: [
        { "verification.twoFA.enabled": true },
        { "verification.methods": { $elemMatch: { $in: ["totp", "webauthn"] } } },
        { "mfa.enabled": true },
      ],
    }),
  ]);

  const pendingEmail = Math.max(totalAccounts - emailVerified, 0);
  const pendingOnboarding = Math.max(emailVerified - onboardingComplete, 0);
  const pending2FA = Math.max(onboardingComplete - twoFactorEnabled, 0);

  const stages = [
    { stage: "Registriert", value: totalAccounts },
    { stage: "E-Mail bestätigt", value: emailVerified },
    { stage: "Profil gepflegt", value: onboardingComplete },
    { stage: "2FA aktiv", value: twoFactorEnabled },
  ];

  const dropOff = [
    { label: "E-Mail offen", value: pendingEmail },
    { label: "Onboarding offen", value: pendingOnboarding },
    { label: "2FA offen", value: pending2FA },
  ];

  return NextResponse.json({
    ok: true,
    totals: {
      totalAccounts,
      emailVerified,
      onboardingComplete,
      twoFactorEnabled,
      pendingEmail,
      pendingOnboarding,
      pending2FA,
    },
    stages,
    dropOff,
  });
}
