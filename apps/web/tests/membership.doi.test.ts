import { describe, expect, it } from "vitest";
import { REQUIRED_LAUNCH_LOCALES } from "@/config/locales";
import { buildDoiMail, createDoiToken, getDoiCopy, hashDoiToken } from "@/lib/membershipDoi";

describe("membership double opt-in", () => {
  it.each(REQUIRED_LAUNCH_LOCALES)("renders a complete %s confirmation mail", (locale) => {
    const mail = buildDoiMail(locale, `https://voiceopengov.org/api/members/confirm?token=secret&lang=${locale}`);
    expect(mail.subject.length).toBeGreaterThan(10);
    expect(mail.html).toContain(`lang="${locale}"`);
    expect(mail.html).toContain(getDoiCopy(locale).noInfluence);
    expect(mail.text).toContain("https://voiceopengov.org/api/members/confirm");
  });

  it("stores a one-way token hash and a 48-hour expiry", () => {
    const before = Date.now();
    const result = createDoiToken();
    expect(result.token).not.toBe(result.tokenHash);
    expect(result.tokenHash).toBe(hashDoiToken(result.token));
    expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(before + 48 * 60 * 60 * 1000 - 1000);
  });
});
