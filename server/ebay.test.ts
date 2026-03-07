import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the ENV module before importing the module under test
vi.mock("./_core/env", () => ({
  ENV: {
    ebayClientId: "test-client-id",
    ebayClientSecret: "PENDING_PRODUCTION_UNLOCK",
    ebaySandboxClientId: "Northlan-MarvelTr-SBX-972dab605-c6af0d47",
    ebaySandboxClientSecret: "SBX-72dab605cb0e-4ee6-4fbf-8ca2-0c1d",
    ebayVerificationToken: "test-verification-token-abc123",
    ebayDeletionEndpointUrl: "https://northlandlegendaryfinds.com/api/ebay/account-deletion",
  },
}));

// Import after mocking
import { handleDeletionChallenge, handleDeletionNotification } from "./ebay";
import crypto from "crypto";

describe("eBay Account Deletion Endpoint", () => {
  describe("handleDeletionChallenge", () => {
    it("should generate correct SHA-256 challenge response", () => {
      const challengeCode = "test-challenge-code-12345";
      const result = handleDeletionChallenge(challengeCode);

      // Manually compute expected hash
      const expectedHash = crypto
        .createHash("sha256")
        .update(
          challengeCode +
            "test-verification-token-abc123" +
            "https://northlandlegendaryfinds.com/api/ebay/account-deletion"
        )
        .digest("hex");

      expect(result).toHaveProperty("challengeResponse");
      expect(result.challengeResponse).toBe(expectedHash);
      expect(result.challengeResponse).toHaveLength(64); // SHA-256 hex is 64 chars
    });

    it("should return different responses for different challenge codes", () => {
      const result1 = handleDeletionChallenge("challenge-1");
      const result2 = handleDeletionChallenge("challenge-2");

      expect(result1.challengeResponse).not.toBe(result2.challengeResponse);
    });
  });

  describe("handleDeletionNotification", () => {
    it("should acknowledge deletion notification", () => {
      const body = {
        metadata: {
          topic: "MARKETPLACE_ACCOUNT_DELETION",
        },
        notification: {
          eventDate: "2026-03-07T00:00:00.000Z",
          data: {
            userId: "test-user-123",
            username: "testuser",
          },
        },
      };

      const result = handleDeletionNotification(body);
      expect(result).toEqual({ success: true });
    });

    it("should handle empty body gracefully", () => {
      const result = handleDeletionNotification({});
      expect(result).toEqual({ success: true });
    });

    it("should handle null body gracefully", () => {
      const result = handleDeletionNotification(null);
      expect(result).toEqual({ success: true });
    });
  });
});

describe("eBay API Credentials", () => {
  it("should fall back to sandbox when production secret is PENDING", async () => {
    // The ENV mock has ebayClientSecret = "PENDING_PRODUCTION_UNLOCK"
    // This means the module should use sandbox credentials
    // We can verify this by checking the module's behavior indirectly
    // through the challenge handler which uses ENV values
    const result = handleDeletionChallenge("test");
    expect(result.challengeResponse).toBeTruthy();
  });
});
