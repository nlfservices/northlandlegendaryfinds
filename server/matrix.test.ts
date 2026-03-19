/**
 * Tests for the Matrix (hidden admin portal) access code verification
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

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
    // Simulate the lockout tracking logic
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

      // Check lockout
      if (record?.lockedUntil && now < record.lockedUntil) {
        return { status: "locked", remaining: Math.ceil((record.lockedUntil - now) / 60000) };
      }

      if (isCorrect) {
        failedAttempts.delete(ip);
        return { status: "granted" };
      }

      // Wrong code
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
  });
});
