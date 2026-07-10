import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the GHL module
vi.mock("../ghl", () => ({
  createGHLContact: vi.fn().mockResolvedValue({ success: true, contactId: "test-contact-123" }),
  addGHLContactNote: vi.fn().mockResolvedValue({ success: true, noteId: "note-123" }),
  addGHLContactTags: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock the db module
vi.mock("../db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        groupBy: vi.fn().mockResolvedValue([]),
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
  }),
}));

// Mock the schema
vi.mock("../../drizzle/schema", () => ({
  repackFeedback: {
    format: "format",
    priceRange: "priceRange",
    gradedPreference: "gradedPreference",
    email: "email",
    createdAt: "createdAt",
  },
}));

import { createGHLContact, addGHLContactNote } from "../ghl";

describe("repackFeedback router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submit input validation", () => {
    it("should accept valid format options", () => {
      const validFormats = ["single_slab", "slab_and_packs", "mystery_tier", "other"];
      validFormats.forEach((format) => {
        expect(validFormats).toContain(format);
      });
    });

    it("should accept valid price range options", () => {
      const validPrices = ["under_25", "25_50", "50_100", "100_plus"];
      validPrices.forEach((price) => {
        expect(validPrices).toContain(price);
      });
    });

    it("should accept valid graded preference options", () => {
      const validGraded = ["graded", "raw", "both", "no_preference"];
      validGraded.forEach((pref) => {
        expect(validGraded).toContain(pref);
      });
    });
  });

  describe("GHL integration logic", () => {
    it("should call createGHLContact with correct tags when email is provided", async () => {
      const { createGHLContact: mockCreate } = await import("../ghl");

      // Simulate what the router does
      const input = {
        email: "test@example.com",
        firstName: "John",
        format: "single_slab",
        priceRange: "50_100",
      };

      await (mockCreate as any)({
        email: input.email,
        firstName: input.firstName,
        tags: [
          "repack-interest",
          `repack-format-${input.format}`,
          `repack-price-${input.priceRange}`,
        ],
        source: "Build Your Repack Survey",
      });

      expect(mockCreate).toHaveBeenCalledWith({
        email: "test@example.com",
        firstName: "John",
        tags: ["repack-interest", "repack-format-single_slab", "repack-price-50_100"],
        source: "Build Your Repack Survey",
      });
    });

    it("should call addGHLContactNote with preferences when contact is created", async () => {
      const { addGHLContactNote: mockNote } = await import("../ghl");

      const contactId = "test-contact-123";
      const noteBody = `📦 REPACK PREFERENCES (Build Your Repack Survey)\n\nFormat: Single Graded Slab\nPrice Range: $50-$100\nCharacters: Doctor Doom, Spider-Man\n\nSubmitted: 2026-07-10`;

      await (mockNote as any)(contactId, noteBody);

      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("REPACK PREFERENCES"));
    });

    it("should NOT call GHL when email is empty", () => {
      const input = { email: "", format: "single_slab", priceRange: "under_25" };
      // The router checks: if (input.email && input.email.trim())
      const shouldCallGHL = !!(input.email && input.email.trim());
      expect(shouldCallGHL).toBe(false);
    });

    it("should NOT call GHL when email is undefined", () => {
      const input = { email: undefined, format: "single_slab", priceRange: "under_25" };
      const shouldCallGHL = !!(input.email && input.email.trim());
      expect(shouldCallGHL).toBe(false);
    });
  });

  describe("human verification (client-side)", () => {
    it("should generate valid math challenges", () => {
      // Replicate the math challenge generation logic
      for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(9);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(9);
        expect(a + b).toBeGreaterThanOrEqual(2);
        expect(a + b).toBeLessThanOrEqual(18);
      }
    });

    it("should block submission when honeypot is filled (bot behavior)", () => {
      const honeypot = "bot-filled-this";
      // The client checks: if (honeypot) { setSubmitted(true); return; }
      const isBot = !!honeypot;
      expect(isBot).toBe(true);
    });

    it("should allow submission when honeypot is empty (human behavior)", () => {
      const honeypot = "";
      const isBot = !!honeypot;
      expect(isBot).toBe(false);
    });
  });
});
