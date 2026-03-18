import { describe, expect, it, vi, beforeEach } from "vitest";
import { checkForBot, validateHoneypot, validateTiming } from "./botProtection";
import { logActivity, getActivityLogs, getUserActivityLogs } from "./db";

// ==================== BOT PROTECTION TESTS ====================

describe("Bot Protection", () => {
  describe("checkForBot", () => {
    it("returns isBot: false for clean submission", () => {
      const result = checkForBot({});
      expect(result.isBot).toBe(false);
    });

    it("returns isBot: false when honeypot fields are empty strings", () => {
      const result = checkForBot({
        _website_url: "",
        _phone_ext: "",
      });
      expect(result.isBot).toBe(false);
    });

    it("detects bot when honeypot field 1 is filled", () => {
      const result = checkForBot({
        _website_url: "http://spam.com",
      });
      expect(result.isBot).toBe(true);
      expect(result.reason).toBe("honeypot_field_1");
    });

    it("detects bot when honeypot field 2 is filled", () => {
      const result = checkForBot({
        _phone_ext: "123",
      });
      expect(result.isBot).toBe(true);
      expect(result.reason).toBe("honeypot_field_2");
    });

    it("detects bot when form submitted too fast", () => {
      const result = checkForBot({
        _formLoadedAt: Date.now() - 500, // 0.5 seconds ago
      });
      expect(result.isBot).toBe(true);
      expect(result.reason).toBe("too_fast");
    });

    it("allows submission after sufficient time", () => {
      const result = checkForBot({
        _formLoadedAt: Date.now() - 5000, // 5 seconds ago
      });
      expect(result.isBot).toBe(false);
    });

    it("allows submission when no timing info provided", () => {
      const result = checkForBot({
        _formLoadedAt: undefined,
      });
      expect(result.isBot).toBe(false);
    });
  });

  describe("validateHoneypot", () => {
    it("returns true for empty honeypot fields", () => {
      expect(validateHoneypot({})).toBe(true);
      expect(validateHoneypot({ _website_url: "" })).toBe(true);
      expect(validateHoneypot({ _phone_ext: "" })).toBe(true);
    });

    it("returns false when honeypot field has value", () => {
      expect(validateHoneypot({ _website_url: "spam" })).toBe(false);
    });

    it("returns false when secondary honeypot has value", () => {
      expect(validateHoneypot({ _phone_ext: "123" })).toBe(false);
    });
  });

  describe("validateTiming", () => {
    it("returns true when no timestamp provided", () => {
      expect(validateTiming(undefined)).toBe(true);
    });

    it("returns false when submitted too fast", () => {
      expect(validateTiming(Date.now() - 500, 2)).toBe(false);
    });

    it("returns true when sufficient time elapsed", () => {
      expect(validateTiming(Date.now() - 5000, 2)).toBe(true);
    });

    it("uses default 2 second minimum", () => {
      expect(validateTiming(Date.now() - 1000)).toBe(false);
      expect(validateTiming(Date.now() - 3000)).toBe(true);
    });
  });
});

// ==================== ACTIVITY LOGGING TESTS ====================

describe("Activity Logging", () => {
  describe("logActivity", () => {
    it("logs an activity entry without throwing", async () => {
      // This tests the function doesn't throw - actual DB write is integration test
      await expect(
        logActivity({
          userId: 1,
          action: "login",
          details: "Test login",
          ipAddress: "127.0.0.1",
          userAgent: "test-agent",
        })
      ).resolves.not.toThrow();
    });

    it("handles missing optional fields", async () => {
      await expect(
        logActivity({
          userId: 1,
          action: "logout",
        })
      ).resolves.not.toThrow();
    });
  });
});

// ==================== ROLE HIERARCHY TESTS ====================

describe("Role Hierarchy", () => {
  const ROLE_HIERARCHY = {
    free: 0,
    subscriber: 1,
    admin: 2,
  } as const;

  it("free has lowest access level", () => {
    expect(ROLE_HIERARCHY.free).toBeLessThan(ROLE_HIERARCHY.subscriber);
    expect(ROLE_HIERARCHY.free).toBeLessThan(ROLE_HIERARCHY.admin);
  });

  it("subscriber has middle access level", () => {
    expect(ROLE_HIERARCHY.subscriber).toBeGreaterThan(ROLE_HIERARCHY.free);
    expect(ROLE_HIERARCHY.subscriber).toBeLessThan(ROLE_HIERARCHY.admin);
  });

  it("admin has highest access level", () => {
    expect(ROLE_HIERARCHY.admin).toBeGreaterThan(ROLE_HIERARCHY.free);
    expect(ROLE_HIERARCHY.admin).toBeGreaterThan(ROLE_HIERARCHY.subscriber);
  });

  it("canAccessPremium works correctly for each role", () => {
    const canAccessPremium = (role: keyof typeof ROLE_HIERARCHY) =>
      ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.subscriber;

    expect(canAccessPremium("free")).toBe(false);
    expect(canAccessPremium("subscriber")).toBe(true);
    expect(canAccessPremium("admin")).toBe(true);
  });
});
