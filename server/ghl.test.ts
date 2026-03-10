import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the ENV module
vi.mock("./_core/env", () => ({
  ENV: {
    ghlApiKey: "test-ghl-api-key",
    ghlLocationId: "test-location-id",
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { createGHLContact, searchGHLContact } from "./ghl";

describe("GoHighLevel API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createGHLContact", () => {
    it("should create a contact successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          contact: {
            id: "ghl-contact-123",
            locationId: "test-location-id",
            email: "test@example.com",
          },
        }),
      });

      const result = await createGHLContact({
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      });

      expect(result.success).toBe(true);
      expect(result.contactId).toBe("ghl-contact-123");
      expect(result.isDuplicate).toBeUndefined();

      // Verify the fetch call
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://services.leadconnectorhq.com/contacts/");
      expect(options.method).toBe("POST");
      expect(options.headers["Authorization"]).toBe("Bearer test-ghl-api-key");
      expect(options.headers["Version"]).toBe("2021-07-28");

      const body = JSON.parse(options.body);
      expect(body.email).toBe("test@example.com");
      expect(body.firstName).toBe("Test");
      expect(body.lastName).toBe("User");
      expect(body.locationId).toBe("test-location-id");
      expect(body.tags).toEqual(["website-subscriber"]);
      expect(body.source).toBe("NLF Website");
    });

    it("should handle duplicate contacts (422 status)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        text: async () => "Duplicate contact",
      });

      const result = await createGHLContact({
        email: "existing@example.com",
      });

      expect(result.success).toBe(true);
      expect(result.isDuplicate).toBe(true);
    });

    it("should handle API errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => "Server error",
      });

      const result = await createGHLContact({
        email: "test@example.com",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("500");
    });

    it("should handle network errors gracefully", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network timeout"));

      const result = await createGHLContact({
        email: "test@example.com",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network timeout");
    });

    it("should use custom tags and source when provided", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          contact: { id: "ghl-456", locationId: "test-location-id", email: "test@example.com" },
        }),
      });

      await createGHLContact({
        email: "test@example.com",
        tags: ["vip", "early-access"],
        source: "NLF Website - subscribe-page",
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.tags).toEqual(["vip", "early-access"]);
      expect(body.source).toBe("NLF Website - subscribe-page");
    });
  });

  describe("searchGHLContact", () => {
    it("should find an existing contact", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          contact: { id: "found-contact-123" },
        }),
      });

      const result = await searchGHLContact("existing@example.com");

      expect(result.found).toBe(true);
      expect(result.contactId).toBe("found-contact-123");
    });

    it("should return not found for non-existing contact", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          contact: null,
        }),
      });

      const result = await searchGHLContact("new@example.com");

      expect(result.found).toBe(false);
    });

    it("should handle search errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await searchGHLContact("test@example.com");

      expect(result.found).toBe(false);
      expect(result.error).toContain("400");
    });
  });

  describe("Missing credentials", () => {
    it("should fail gracefully when API key is missing", async () => {
      // Temporarily override ENV
      const envModule = await import("./_core/env");
      const originalKey = envModule.ENV.ghlApiKey;
      (envModule.ENV as any).ghlApiKey = "";

      const result = await createGHLContact({ email: "test@example.com" });
      expect(result.success).toBe(false);
      expect(result.error).toContain("not configured");

      // Restore
      (envModule.ENV as any).ghlApiKey = originalKey;
    });
  });
});
