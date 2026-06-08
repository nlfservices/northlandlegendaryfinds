import { describe, it, expect } from "vitest";
import { checkTokenHealth } from "./facebook-api";

describe("Facebook Page Access Token", () => {
  it("should be valid and not expired", async () => {
    const health = await checkTokenHealth();
    expect(health.valid).toBe(true);
    expect(health.error).toBeUndefined();
    // Should have at least some days remaining
    if (health.daysRemaining !== null && health.daysRemaining !== 9999) {
      expect(health.daysRemaining).toBeGreaterThan(0);
    }
  }, 15000);
});
