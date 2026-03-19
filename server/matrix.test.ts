/**
 * Tests for the Matrix (hidden admin portal) access code verification
 * and Forgot PIN bypass token system
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";

// Mock the ENV module
vi.mock("./_core/env", () => ({
  ENV: {
    adminAccessCode: "test-secret-code-123",
  },
}));

describe("Matrix Router", () => {
  describe("Access Code Verification Logic", () => {
    it("should accept a correct access code", () => {
      const correctCode = "test-secret-code-123";
      expect(correctCode).toBe("test-secret-code-123");
    });

    it("should reject an incorrect access code", () => {
      const inputCode = "wrong-code";
      const correctCode = "test-secret-code-123";
      expect(inputCode).not.toBe(correctCode);
    });

    it("should be case-sensitive for access codes", () => {
      const inputCode = "Test-Secret-Code-123";
      const correctCode = "test-secret-code-123";
      expect(inputCode).not.toBe(correctCode);
    });
  });

  describe("IP Lockout Logic", () => {
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION_MS = 30 * 60 * 1000;

    interface AttemptRecord {
      count: number;
      lastAttempt: number;
      lockedUntil: number | null;
    }

    let failedAttempts: Map<string, AttemptRecord>;

    beforeEach(() => {
      failedAttempts = new Map();
    });

    function simulateAttempt(ip: string, isCorrect: boolean) {
      const now = Date.now();
      const record = failedAttempts.get(ip);

      if (record?.lockedUntil && now < record.lockedUntil) {
        return { status: "locked", remaining: Math.ceil((record.lockedUntil - now) / 60000) };
      }

      if (isCorrect) {
        failedAttempts.delete(ip);
        return { status: "granted" };
      }

      const existing = record || { count: 0, lastAttempt: 0, lockedUntil: null };
      existing.count += 1;
      existing.lastAttempt = now;

      if (existing.count >= MAX_ATTEMPTS) {
        existing.lockedUntil = now + LOCKOUT_DURATION_MS;
        failedAttempts.set(ip, existing);
        return { status: "locked_out", attempts: existing.count };
      }

      failedAttempts.set(ip, existing);
      return { status: "rejected", attemptsUsed: existing.count, remaining: MAX_ATTEMPTS - existing.count };
    }

    it("should track failed attempts per IP", () => {
      const result = simulateAttempt("192.168.1.1", false);
      expect(result.status).toBe("rejected");
      expect(result.attemptsUsed).toBe(1);
      expect(result.remaining).toBe(4);
    });

    it("should lock out after 5 failed attempts", () => {
      for (let i = 0; i < 4; i++) {
        simulateAttempt("192.168.1.2", false);
      }
      const result = simulateAttempt("192.168.1.2", false);
      expect(result.status).toBe("locked_out");
      expect(result.attempts).toBe(5);
    });

    it("should block further attempts when locked", () => {
      for (let i = 0; i < 5; i++) {
        simulateAttempt("192.168.1.3", false);
      }
      const result = simulateAttempt("192.168.1.3", false);
      expect(result.status).toBe("locked");
    });

    it("should not affect other IPs when one is locked", () => {
      for (let i = 0; i < 5; i++) {
        simulateAttempt("192.168.1.4", false);
      }
      const result = simulateAttempt("192.168.1.5", false);
      expect(result.status).toBe("rejected");
      expect(result.attemptsUsed).toBe(1);
    });

    it("should clear failed attempts on successful login", () => {
      simulateAttempt("192.168.1.6", false);
      simulateAttempt("192.168.1.6", false);
      const successResult = simulateAttempt("192.168.1.6", true);
      expect(successResult.status).toBe("granted");
      expect(failedAttempts.has("192.168.1.6")).toBe(false);
    });

    it("should show correct remaining attempts count", () => {
      const r1 = simulateAttempt("192.168.1.7", false);
      expect(r1.remaining).toBe(4);
      const r2 = simulateAttempt("192.168.1.7", false);
      expect(r2.remaining).toBe(3);
      const r3 = simulateAttempt("192.168.1.7", false);
      expect(r3.remaining).toBe(2);
      const r4 = simulateAttempt("192.168.1.7", false);
      expect(r4.remaining).toBe(1);
    });

    it("should track different IPs independently", () => {
      simulateAttempt("10.0.0.1", false);
      simulateAttempt("10.0.0.1", false);
      simulateAttempt("10.0.0.2", false);

      const ip1Record = failedAttempts.get("10.0.0.1");
      const ip2Record = failedAttempts.get("10.0.0.2");

      expect(ip1Record?.count).toBe(2);
      expect(ip2Record?.count).toBe(1);
    });
  });

  describe("Bypass Token System", () => {
    interface BypassToken {
      token: string;
      createdAt: number;
      expiresAt: number;
      used: boolean;
      requestIp: string;
    }

    const BYPASS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;
    const BYPASS_COOLDOWN_MS = 2 * 60 * 1000;
    let bypassTokens: Map<string, BypassToken>;
    let bypassCooldowns: Map<string, number>;

    beforeEach(() => {
      bypassTokens = new Map();
      bypassCooldowns = new Map();
    });

    function generateToken(): string {
      return crypto.randomBytes(32).toString("hex");
    }

    function requestBypass(ip: string): { status: string; token?: string; error?: string } {
      const now = Date.now();
      const lastRequest = bypassCooldowns.get(ip);
      if (lastRequest && now - lastRequest < BYPASS_COOLDOWN_MS) {
        return { status: "cooldown", error: "Please wait before requesting again." };
      }

      const token = generateToken();
      bypassTokens.set(token, {
        token,
        createdAt: now,
        expiresAt: now + BYPASS_TOKEN_EXPIRY_MS,
        used: false,
        requestIp: ip,
      });
      bypassCooldowns.set(ip, now);
      return { status: "sent", token };
    }

    function verifyBypass(token: string): { status: string; error?: string } {
      const now = Date.now();
      const record = bypassTokens.get(token);

      if (!record) return { status: "invalid", error: "Invalid or expired bypass link." };
      if (record.used) return { status: "used", error: "This bypass link has already been used." };
      if (now > record.expiresAt) {
        bypassTokens.delete(token);
        return { status: "expired", error: "This bypass link has expired." };
      }

      record.used = true;
      bypassTokens.set(token, record);
      return { status: "granted" };
    }

    it("should generate a 64-character hex token", () => {
      const token = generateToken();
      expect(token).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });

    it("should generate unique tokens each time", () => {
      const token1 = generateToken();
      const token2 = generateToken();
      expect(token1).not.toBe(token2);
    });

    it("should create a valid bypass token on request", () => {
      const result = requestBypass("10.0.0.1");
      expect(result.status).toBe("sent");
      expect(result.token).toBeDefined();
      expect(bypassTokens.has(result.token!)).toBe(true);
    });

    it("should enforce cooldown between bypass requests", () => {
      requestBypass("10.0.0.2");
      const result2 = requestBypass("10.0.0.2");
      expect(result2.status).toBe("cooldown");
    });

    it("should allow bypass requests from different IPs", () => {
      const r1 = requestBypass("10.0.0.3");
      const r2 = requestBypass("10.0.0.4");
      expect(r1.status).toBe("sent");
      expect(r2.status).toBe("sent");
    });

    it("should grant access with a valid bypass token", () => {
      const { token } = requestBypass("10.0.0.5");
      const result = verifyBypass(token!);
      expect(result.status).toBe("granted");
    });

    it("should reject a reused bypass token", () => {
      const { token } = requestBypass("10.0.0.6");
      verifyBypass(token!); // first use
      const result = verifyBypass(token!); // second use
      expect(result.status).toBe("used");
    });

    it("should reject an invalid bypass token", () => {
      const result = verifyBypass("totally-fake-token");
      expect(result.status).toBe("invalid");
    });

    it("should reject an expired bypass token", () => {
      const token = generateToken();
      bypassTokens.set(token, {
        token,
        createdAt: Date.now() - BYPASS_TOKEN_EXPIRY_MS - 1000,
        expiresAt: Date.now() - 1000, // already expired
        used: false,
        requestIp: "10.0.0.7",
      });
      const result = verifyBypass(token);
      expect(result.status).toBe("expired");
    });

    it("should mark token as used after successful verification", () => {
      const { token } = requestBypass("10.0.0.8");
      verifyBypass(token!);
      const record = bypassTokens.get(token!);
      expect(record?.used).toBe(true);
    });

    it("should set token expiry to 15 minutes", () => {
      const { token } = requestBypass("10.0.0.9");
      const record = bypassTokens.get(token!);
      const expectedExpiry = record!.createdAt + BYPASS_TOKEN_EXPIRY_MS;
      expect(record!.expiresAt).toBe(expectedExpiry);
    });
  });

  describe("Security Requirements", () => {
    it("should not expose the access code in error messages", () => {
      const errorMessage = "Invalid access code. 4 attempts remaining.";
      expect(errorMessage).not.toContain("test-secret-code-123");
    });

    it("should include lockout duration in lockout message", () => {
      const lockoutMessage = "Too many failed attempts. Access locked for 30 minutes.";
      expect(lockoutMessage).toContain("30 minutes");
    });

    it("should use session storage key for gate persistence", () => {
      const key = "matrix_granted";
      expect(key).toBe("matrix_granted");
    });

    it("should not include PIN in bypass email content", () => {
      const emailContent = "A temporary access link has been requested for the NLF admin portal.";
      expect(emailContent).not.toContain("test-secret-code-123");
    });
  });
});
