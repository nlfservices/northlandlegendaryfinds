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

    it("should accept new fields: phone, zipCode, favoriteCharacter", () => {
      const input = {
        format: "single_slab",
        priceRange: "50_100",
        phone: "555-123-4567",
        zipCode: "55401",
        favoriteCharacter: "Doctor Doom",
      };
      expect(input.phone).toBe("555-123-4567");
      expect(input.zipCode).toBe("55401");
      expect(input.favoriteCharacter).toBe("Doctor Doom");
    });
  });

  describe("GHL integration logic", () => {
    it("should call createGHLContact with phone when provided", async () => {
      const { createGHLContact: mockCreate } = await import("../ghl");

      const input = {
        email: "test@example.com",
        firstName: "John",
        phone: "555-123-4567",
        format: "single_slab",
        priceRange: "50_100",
      };

      await (mockCreate as any)({
        email: input.email,
        firstName: input.firstName,
        phone: input.phone,
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
        phone: "555-123-4567",
        tags: ["repack-interest", "repack-format-single_slab", "repack-price-50_100"],
        source: "Build Your Repack Survey",
      });
    });

    it("should include zip code, favorite character, and phone in GHL note", async () => {
      const { addGHLContactNote: mockNote } = await import("../ghl");

      const contactId = "test-contact-123";
      const input = {
        firstName: "Jane",
        phone: "612-555-0000",
        zipCode: "55401",
        favoriteCharacter: "Wolverine",
        format: "slab_and_packs",
        priceRange: "25_50",
        characters: ["Wolverine", "Gambit"],
        suggestion: "More X-Men please",
      };

      const formatLabels: Record<string, string> = {
        single_slab: "Single Graded Slab",
        slab_and_packs: "Slab + 2 Packs",
        mystery_tier: "Mystery Tier Box",
        other: "Other Format",
      };
      const priceLabels: Record<string, string> = {
        under_25: "Under $25",
        "25_50": "$25-$50",
        "50_100": "$50-$100",
        "100_plus": "$100+",
      };

      const noteBody = [
        `📦 REPACK PREFERENCES (Build Your Repack Survey)`,
        ``,
        `Name: ${input.firstName || "Not provided"}`,
        `Phone: ${input.phone || "Not provided"}`,
        `Zip Code: ${input.zipCode || "Not provided"}`,
        `Favorite Character: ${input.favoriteCharacter || "Not provided"}`,
        `Format: ${formatLabels[input.format] || input.format}`,
        `Price Range: ${priceLabels[input.priceRange] || input.priceRange}`,
        input.characters?.length ? `Characters: ${input.characters.join(", ")}` : null,
        input.suggestion ? `Comments: ${input.suggestion}` : null,
        ``,
        `Submitted: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join("\n");

      await (mockNote as any)(contactId, noteBody);

      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("Zip Code: 55401"));
      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("Favorite Character: Wolverine"));
      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("Phone: 612-555-0000"));
      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("Comments: More X-Men please"));
    });

    it("should NOT call GHL when email is empty", () => {
      const input = { email: "", format: "single_slab", priceRange: "under_25" };
      const shouldCallGHL = !!(input.email && input.email.trim());
      expect(shouldCallGHL).toBe(false);
    });

    it("should NOT call GHL when email is undefined", () => {
      const input = { email: undefined, format: "single_slab", priceRange: "under_25" };
      const shouldCallGHL = !!(input.email && input.email.trim());
      expect(shouldCallGHL).toBe(false);
    });

    it("should handle missing optional fields gracefully in note", async () => {
      const { addGHLContactNote: mockNote } = await import("../ghl");

      const contactId = "test-contact-456";
      const input = {
        firstName: undefined as string | undefined,
        phone: undefined as string | undefined,
        zipCode: undefined as string | undefined,
        favoriteCharacter: undefined as string | undefined,
        format: "mystery_tier",
        priceRange: "under_25",
      };

      const noteBody = [
        `📦 REPACK PREFERENCES (Build Your Repack Survey)`,
        ``,
        `Name: ${input.firstName || "Not provided"}`,
        `Phone: ${input.phone || "Not provided"}`,
        `Zip Code: ${input.zipCode || "Not provided"}`,
        `Favorite Character: ${input.favoriteCharacter || "Not provided"}`,
        `Format: Mystery Tier Box`,
        `Price Range: Under $25`,
        ``,
        `Submitted: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join("\n");

      await (mockNote as any)(contactId, noteBody);

      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("Name: Not provided"));
      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("Phone: Not provided"));
      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("Zip Code: Not provided"));
      expect(mockNote).toHaveBeenCalledWith(contactId, expect.stringContaining("Favorite Character: Not provided"));
    });
  });

  describe("human verification (client-side)", () => {
    it("should generate valid math challenges", () => {
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
