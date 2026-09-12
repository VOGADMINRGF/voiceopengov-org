import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SUPPORTED_LOCALES } from "@/config/locales";
import { getMemberAccountStrings } from "@/app/memberAccountStrings";
import { getDoiCopy } from "@/lib/membershipDoi";
import { normalizeMemberEmail, validateMemberPassword } from "@/lib/memberAuth";
import { sendMail } from "@/lib/mail/sendMail";

function source(path: string) {
  return readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");
}

afterEach(() => vi.unstubAllEnvs());

describe("member account authentication", () => {
  it("normalizes email and enforces the password policy", () => {
    expect(normalizeMemberEmail(" Member@Example.ORG ")).toBe("member@example.org");
    expect(validateMemberPassword("short")).toEqual({ ok: false, error: "password_too_short" });
    expect(validateMemberPassword("abcdefghijkl!")).toEqual({ ok: false, error: "password_needs_number" });
    expect(validateMemberPassword("abcdefghijkl1")).toEqual({ ok: false, error: "password_needs_special" });
    expect(validateMemberPassword("secure-access-2026!")).toEqual({ ok: true });
  });

  it("keeps credentials in the PII database and stores only token hashes", () => {
    const auth = source("lib/memberAuth.ts");
    expect(auth).toContain('process.env.PII_MONGODB_URI');
    expect(auth).toContain('process.env.NODE_ENV === "production" ? undefined');
    expect(auth).toContain('crypto.createHash("sha256")');
    expect(auth).toContain('db.collection<MemberSessionDoc>("member_sessions")');
    expect(auth).not.toMatch(/insertOne\(\{\s*token:/);
    expect(auth).not.toMatch(/insertOne\(\{[\s\S]{0,400}setupToken\s*:/);
    expect(auth).not.toMatch(/insertOne\(\{[\s\S]{0,400}sessionToken\s*:/);
  });

  it("gates login and session data on an active membership", () => {
    expect(source("app/api/auth/login/route.ts")).toContain('status: "active"');
    expect(source("app/api/auth/session/route.ts")).toContain('status: "active"');
    const logout = source("app/api/auth/logout/route.ts");
    expect(logout).toContain("httpOnly: true");
    expect(logout).toContain('sameSite: "lax"');
    const start = source("app/api/auth/password/start/route.ts");
    expect(start).toContain("Always return the same public response");
    expect(source("app/api/members/confirm/route.ts")).toContain("/konto/passwort?lang=");
  });

  it("never logs email access links when production SMTP is unavailable", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("SMTP_USER", "");
    await expect(sendMail({ to: "member@example.org", subject: "Access", html: "secret-link" }))
      .rejects.toThrow("SMTP is required in production");
  });

  it.each(SUPPORTED_LOCALES)("provides a localized %s account continuation", (locale) => {
    const strings = getMemberAccountStrings(locale);
    expect(strings.login.title.length).toBeGreaterThan(1);
    expect(strings.account.title.length).toBeGreaterThan(1);
    expect(strings.password.setupTitle.length).toBeGreaterThan(1);
    expect(getDoiCopy(locale).accountAccess.length).toBeGreaterThan(1);
  });
});
