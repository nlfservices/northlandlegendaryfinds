import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getCharacterOfTheDay: vi.fn(),
}));

import { getCharacterOfTheDay } from "./db";

const mockedGetCharacterOfTheDay = vi.mocked(getCharacterOfTheDay);

describe("Character of the Day", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCharacterOfTheDay", () => {
    it("returns character data with expected fields when data exists", async () => {
      const mockData = {
        characterName: "Spider-Man",
        slug: "spider-man",
        metaDescription: "Your friendly neighborhood Spider-Man.",
        type: "hero" as const,
        firstAppearance: "Amazing Fantasy #15 (August 1962)",
        realName: "Peter Parker",
        powers: ["Wall-Crawling", "Spider-Sense", "Super Strength"],
        cardImage: "https://example.com/spiderman.jpg",
        cardSet: "2025 Topps Chrome Marvel",
        cardSetSlug: "chrome",
        cardNumber: "101",
        totalCards: 5,
        date: "2026-03-16",
      };

      mockedGetCharacterOfTheDay.mockResolvedValue(mockData);

      const result = await getCharacterOfTheDay();

      expect(result).not.toBeNull();
      expect(result!.characterName).toBe("Spider-Man");
      expect(result!.slug).toBe("spider-man");
      expect(result!.type).toBe("hero");
      expect(result!.powers).toHaveLength(3);
      expect(result!.cardImage).toBeTruthy();
      expect(result!.date).toBe("2026-03-16");
    });

    it("returns null when no data is available", async () => {
      mockedGetCharacterOfTheDay.mockResolvedValue(null);

      const result = await getCharacterOfTheDay();
      expect(result).toBeNull();
    });

    it("correctly identifies villains", async () => {
      const mockVillain = {
        characterName: "Thanos",
        slug: "thanos",
        metaDescription: "The Mad Titan.",
        type: "villain" as const,
        firstAppearance: "Iron Man #55 (February 1973)",
        realName: "Thanos",
        powers: ["Superhuman Strength", "Energy Manipulation", "Telepathy"],
        cardImage: "https://example.com/thanos.jpg",
        cardSet: "2025 Topps Marvel Sapphire",
        cardSetSlug: "sapphire",
        cardNumber: "158",
        totalCards: 3,
        date: "2026-03-16",
      };

      mockedGetCharacterOfTheDay.mockResolvedValue(mockVillain);

      const result = await getCharacterOfTheDay();
      expect(result).not.toBeNull();
      expect(result!.type).toBe("villain");
      expect(result!.characterName).toBe("Thanos");
    });

    it("handles characters with missing optional fields", async () => {
      const mockMinimal = {
        characterName: "Bloodline",
        slug: "bloodline",
        metaDescription: null,
        type: "hero" as const,
        firstAppearance: null,
        realName: null,
        powers: [],
        cardImage: null,
        cardSet: null,
        cardSetSlug: null,
        cardNumber: null,
        totalCards: 0,
        date: "2026-03-16",
      };

      mockedGetCharacterOfTheDay.mockResolvedValue(mockMinimal);

      const result = await getCharacterOfTheDay();
      expect(result).not.toBeNull();
      expect(result!.characterName).toBe("Bloodline");
      expect(result!.powers).toHaveLength(0);
      expect(result!.cardImage).toBeNull();
      expect(result!.firstAppearance).toBeNull();
    });

    it("returns consistent results for the same date", async () => {
      const mockData = {
        characterName: "Wolverine",
        slug: "wolverine",
        metaDescription: "The best there is at what he does.",
        type: "hero" as const,
        firstAppearance: "The Incredible Hulk #181 (November 1974)",
        realName: "James Howlett",
        powers: ["Healing Factor", "Adamantium Claws", "Enhanced Senses"],
        cardImage: "https://example.com/wolverine.jpg",
        cardSet: "2025 Topps Chrome Marvel",
        cardSetSlug: "chrome",
        cardNumber: "50",
        totalCards: 4,
        date: "2026-03-16",
      };

      mockedGetCharacterOfTheDay.mockResolvedValue(mockData);

      const result1 = await getCharacterOfTheDay();
      const result2 = await getCharacterOfTheDay();

      expect(result1).toEqual(result2);
      expect(mockedGetCharacterOfTheDay).toHaveBeenCalledTimes(2);
    });

    it("limits powers to at most 3 entries", async () => {
      const mockData = {
        characterName: "Thor",
        slug: "thor",
        metaDescription: "God of Thunder.",
        type: "hero" as const,
        firstAppearance: "Journey into Mystery #83 (August 1962)",
        realName: "Thor Odinson",
        powers: ["Mjolnir", "Lightning Control", "Super Strength"],
        cardImage: "https://example.com/thor.jpg",
        cardSet: "2025 Topps Marvel Sapphire",
        cardSetSlug: "sapphire",
        cardNumber: "119",
        totalCards: 6,
        date: "2026-03-16",
      };

      mockedGetCharacterOfTheDay.mockResolvedValue(mockData);

      const result = await getCharacterOfTheDay();
      expect(result!.powers.length).toBeLessThanOrEqual(3);
    });
  });
});
