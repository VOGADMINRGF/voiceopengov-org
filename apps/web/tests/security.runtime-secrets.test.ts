import { describe, expect, it } from "vitest";
import { readSecret, requireSecret } from "../src/lib/runtimeSecrets";

describe("production runtime secrets", () => {
  it("never invents or reuses a fallback secret", () => {
    const environment = {
      JWT_SECRET: "generic-jwt-secret",
      EDITOR_TOKEN: "editor-token",
    };

    expect(readSecret("VOG_PAYMENTS_SESSION_SECRET", environment)).toBeUndefined();
    expect(readSecret("VOG_SUPPORT_SESSION_SECRET", environment)).toBeUndefined();
    expect(() => requireSecret("REVIEW_TOKEN_SECRET", environment)).toThrow(
      "Missing required secret: REVIEW_TOKEN_SECRET",
    );
  });

  it("accepts only the explicitly requested configured secret", () => {
    const environment = { REVIEW_TOKEN_SECRET: "dedicated-review-secret" };
    expect(requireSecret("REVIEW_TOKEN_SECRET", environment)).toBe("dedicated-review-secret");
  });
});
