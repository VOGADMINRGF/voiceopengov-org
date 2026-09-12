import { describe, expect, it } from "vitest";
import { buildNewsletterOutboxEntries, NEWSLETTER_OUTBOX_EXPORT_MODE } from "../src/lib/newsletterOutbox";

const CONFIRMED = {
  memberId: "member-123",
  locale: "fr",
  wantsNewsletter: true,
  wantsNewsletterEdDebatte: true,
  confirmedAt: new Date("2026-09-12T10:00:00.000Z"),
};

describe("consent-bound newsletter outbox", () => {
  it("queues only explicitly selected audiences after confirmed consent", () => {
    const entries = buildNewsletterOutboxEntries(CONFIRMED, new Date("2026-09-12T10:01:00.000Z"));
    expect(entries.map((entry) => entry.audience)).toEqual(["voiceopengov", "edebatte"]);
    expect(entries.every((entry) => entry.operation === "subscribe")).toBe(true);
    expect(entries.every((entry) => entry.status === "pending" && entry.consentConfirmedAt === CONFIRMED.confirmedAt)).toBe(true);
    expect(buildNewsletterOutboxEntries({ ...CONFIRMED, wantsNewsletter: false, wantsNewsletterEdDebatte: false })).toEqual([]);
  });

  it("keeps contact data out of the queue and external export disabled", () => {
    const entries = buildNewsletterOutboxEntries({ ...CONFIRMED, email: "person@example.org" } as typeof CONFIRMED);
    expect(JSON.stringify(entries)).not.toContain("person@example.org");
    expect(NEWSLETTER_OUTBOX_EXPORT_MODE).toBe("disabled");
  });

  it("falls back to a supported locale without changing consent evidence", () => {
    const [entry] = buildNewsletterOutboxEntries({ ...CONFIRMED, locale: "unsupported" });
    expect(entry.locale).toBe("de");
    expect(entry.consentVersion).toBe("membership-registration-v1");
    expect(entry.consentSource).toBe("membership_registration");
  });
});
