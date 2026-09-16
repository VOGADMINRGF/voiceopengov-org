import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateProductionEnvironment } from "../scripts/check-membership-funding-env.mjs";

function source(path: string) {
  return readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");
}

const READY_ENV = {
  PUBLIC_BASE_URL: "https://www.voiceopengov.org",
  MONGODB_URI: "mongodb+srv://service:secret@cluster.example/vog",
  VOG_DB_NAME: "vog_public",
  CORE_MONGODB_URI: "mongodb+srv://service:secret@cluster.example/core",
  CORE_DB_NAME: "core_prod",
  PII_MONGODB_URI: "mongodb+srv://service:secret@cluster.example/pii",
  PII_DB_NAME: "pii_prod",
  SMTP_HOST: "smtp.example.org",
  SMTP_USER: "mailer",
  SMTP_PASS: "smtp-secret",
  MAIL_FROM: "VoiceOpenGov <no-reply@voiceopengov.org>",
  VOG_ADMIN_USER: "operations",
  VOG_ADMIN_PASSWORD: "a-unique-admin-password-of-32-chars",
  STRIPE_SECRET_KEY: "sk_test_contract_only",
  STRIPE_WEBHOOK_SECRET: "whsec_contract_only",
  VOG_SUPPORT_SESSION_SECRET: "a-unique-support-session-secret-32",
  VOG_PAYMENT_BANK_RECIPIENT: "VoiceOpenGov",
  VOG_PAYMENT_BANK_IBAN: "DE00000000000000000000",
};

describe("membership and funding production readiness", () => {
  it("accepts a complete environment without exposing secret values", () => {
    expect(validateProductionEnvironment(READY_ENV)).toEqual({ ok: true, errors: [] });
  });

  it("fails closed for placeholders, insecure URLs and shared public/PII databases", () => {
    const result = validateProductionEnvironment({
      ...READY_ENV,
      PUBLIC_BASE_URL: "http://localhost:3000",
      PII_DB_NAME: "vog_public",
      STRIPE_SECRET_KEY: "__set_in_secret_manager__",
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Missing production value: STRIPE_SECRET_KEY");
    expect(result.errors).toContain("PUBLIC_BASE_URL must be an HTTPS URL");
    expect(result.errors).toContain("VOG_DB_NAME and PII_DB_NAME must be different databases");
    expect(result.errors.join(" ")).not.toContain(READY_ENV.SMTP_PASS);
  });

  it("keeps critical form feedback and the membership API contract on /mitmachen", () => {
    const join = source("app/mitmachen/MitmachenClient.tsx");
    const register = source("app/api/members/public-register/route.ts");
    const funding = source("app/unterstuetzen/FundingCheckoutForm.tsx");
    const password = source("app/konto/passwort/page.tsx");
    expect(join).toContain('role={notice.ok ? "status" : "alert"}');
    expect(join).toContain('aria-live="polite"');
    expect(join).toContain('type="checkbox"');
    expect(join).toContain('checked={privacy}');
    expect(join).toContain('type="date"');
    expect(join).toContain('aria-label={copy.birthDate}');
    expect(join).toContain("birthDate,");
    expect(join).toContain("participationMode,");
    expect(join).toContain('aria-pressed={participationMode === "active"}');
    expect(join).toContain('fetch("/api/members/public-register"');
    expect(register).toContain('type ParticipationMode = "active" | "member"');
    expect(register).toContain("participationMode,");
    expect(funding).toContain("aria-pressed={cadence === value}");
    expect(funding).toContain("aria-pressed={amount === value}");
    expect(password).toContain('role="status" aria-live="polite"');
  });

  it("keeps /mitmachen focused on membership and local enabling", () => {
    const join = source("app/mitmachen/MitmachenClient.tsx");
    const regionalRedirect = source("app/vor-ort/page.tsx");
    expect(join).toContain('id="vor-ort"');
    expect(join).toContain("<RegionalInterestForm strings={regional} />");
    expect(join).toContain("EDEBATTE_URL");
    expect(join).toContain("VOG_SUPPORT_PATH");
    expect(join).not.toContain("VOG_QUESTIONS_PATH");
    expect(regionalRedirect).toContain('redirect("/mitmachen#vor-ort")');
  });

  it("keeps the post-registration DOI journey explicit", () => {
    const join = source("app/mitmachen/MitmachenClient.tsx");
    expect(join).toContain("registrationComplete");
    expect(join).toContain("copy.successTitle");
    expect(join).toContain("copy.successActiveNext");
    expect(join).toContain("copy.successMemberNext");
  });

  it("keeps RTL, privacy retention and no-political-weight gates executable in CI", () => {
    expect(source("app/layout.tsx")).toContain("dir={getTextDirection(initialLocale)}");
    expect(source("lib/funnelEvents.ts")).toContain("const RETENTION_DAYS = 90");
    expect(source("lib/newsletterOutbox.ts")).toContain('NEWSLETTER_OUTBOX_EXPORT_MODE = "disabled"');
    expect(source("lib/fundingStore.ts")).toContain('politicalVoiceWeight: "none"');
  });
});
