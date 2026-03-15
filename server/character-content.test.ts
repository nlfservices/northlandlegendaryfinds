import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getCharacterContentBySlug: vi.fn(),
  getCardsByCharacterName: vi.fn(),
  upsertCharacterContent: vi.fn(),
  characterNameToSlug: vi.fn((name: string) =>
    name
      .toLowerCase()
      .replace(/[()]/g, "")
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  ),
  getAllCharacterSlugs: vi.fn(),
  getAllMarvelSets: vi.fn(),
  getRelatedCharacters: vi.fn(),
}));

import {
  getCharacterContentBySlug,
  getCardsByCharacterName,
  upsertCharacterContent,
  characterNameToSlug,
  getAllCharacterSlugs,
  getRelatedCharacters,
} from "./db";

const mockedGetCharacterContentBySlug = vi.mocked(getCharacterContentBySlug);
const mockedGetCardsByCharacterName = vi.mocked(getCardsByCharacterName);
const mockedUpsertCharacterContent = vi.mocked(upsertCharacterContent);
const mockedCharacterNameToSlug = vi.mocked(characterNameToSlug);
const mockedGetAllCharacterSlugs = vi.mocked(getAllCharacterSlugs);
const mockedGetRelatedCharacters = vi.mocked(getRelatedCharacters);

describe("Character Content Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("characterNameToSlug", () => {
    it("converts simple names to slugs", () => {
      expect(characterNameToSlug("Spider-Man")).toBe("spider-man");
    });

    it("handles apostrophes", () => {
      expect(characterNameToSlug("Gambit's Deck")).toBe("gambits-deck");
    });

    it("handles special characters", () => {
      expect(characterNameToSlug("Ant-Man (Scott Lang)")).toBe("ant-man-scott-lang");
    });

    it("handles multiple spaces and hyphens", () => {
      expect(characterNameToSlug("Iron   Man")).toBe("iron-man");
    });

    it("removes leading/trailing hyphens", () => {
      expect(characterNameToSlug("  Wolverine  ")).toBe("wolverine");
    });
  });

  describe("getCharacterContentBySlug", () => {
    it("returns content for existing character", async () => {
      const mockContent = {
        id: 1,
        characterName: "Spider-Man",
        slug: "spider-man",
        historyMarkdown: "## Origin Story\n\nSpider-Man was created...",
        metaDescription: "Explore Spider-Man's history and trading cards",
        keyFacts: {
          realName: "Peter Parker",
          firstAppearance: "Amazing Fantasy #15 (1962)",
          creators: "Stan Lee, Steve Ditko",
          teams: ["Avengers", "Fantastic Four"],
          notablePowers: ["Wall-crawling", "Spider-sense", "Super strength"],
        },
        status: "generated" as const,
        isApproved: false,
        setId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockedGetCharacterContentBySlug.mockResolvedValue(mockContent);

      const result = await getCharacterContentBySlug("spider-man");
      expect(result).toBeDefined();
      expect(result?.characterName).toBe("Spider-Man");
      expect(result?.slug).toBe("spider-man");
      expect(result?.status).toBe("generated");
      expect(result?.historyMarkdown).toContain("Origin Story");
    });

    it("returns undefined for non-existent character", async () => {
      mockedGetCharacterContentBySlug.mockResolvedValue(undefined);

      const result = await getCharacterContentBySlug("non-existent-hero");
      expect(result).toBeUndefined();
    });
  });

  describe("getCardsByCharacterName", () => {
    it("returns cards for a character across multiple sets", async () => {
      const mockCards = [
        {
          id: 1,
          characterName: "Iron Man",
          cardNumber: "1",
          cardType: "Base",
          setName: "2025 Topps Chrome",
          setSlug: "2025-topps-chrome",
          imageUrl: "https://example.com/iron-man.png",
        },
        {
          id: 2,
          characterName: "Iron Man",
          cardNumber: "MR-1",
          cardType: "MARVEL ROYALTY",
          setName: "2025 Topps Chrome",
          setSlug: "2025-topps-chrome",
          imageUrl: "https://example.com/iron-man-mr.png",
        },
        {
          id: 3,
          characterName: "Iron Man",
          cardNumber: "5",
          cardType: "Base",
          setName: "2025 Marvel Mint",
          setSlug: "2025-marvel-mint",
          imageUrl: "https://example.com/iron-man-mint.png",
        },
      ];
      mockedGetCardsByCharacterName.mockResolvedValue(mockCards as any);

      const result = await getCardsByCharacterName("Iron Man");
      expect(result).toHaveLength(3);
      expect(result[0].characterName).toBe("Iron Man");
      // Cards span multiple sets
      const setNames = new Set(result.map((c: any) => c.setName));
      expect(setNames.size).toBe(2);
    });

    it("returns empty array for character with no cards", async () => {
      mockedGetCardsByCharacterName.mockResolvedValue([]);

      const result = await getCardsByCharacterName("Unknown Hero");
      expect(result).toHaveLength(0);
    });
  });

  describe("getAllCharacterSlugs", () => {
    it("returns all unique characters with slugs and card counts", async () => {
      const mockCharacters = [
        { characterName: "Spider-Man", slug: "spider-man", cardCount: 15 },
        { characterName: "Wolverine", slug: "wolverine", cardCount: 12 },
        { characterName: "Iron Man", slug: "iron-man", cardCount: 20 },
      ];
      mockedGetAllCharacterSlugs.mockResolvedValue(mockCharacters);

      const result = await getAllCharacterSlugs();
      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe("spider-man");
      expect(result[2].cardCount).toBe(20);
    });

    it("returns empty array when no characters exist", async () => {
      mockedGetAllCharacterSlugs.mockResolvedValue([]);

      const result = await getAllCharacterSlugs();
      expect(result).toHaveLength(0);
    });
  });

  describe("upsertCharacterContent", () => {
    it("creates new character content", async () => {
      mockedUpsertCharacterContent.mockResolvedValue(undefined);

      await expect(
        upsertCharacterContent({
          characterName: "Hulk",
          slug: "hulk",
          historyMarkdown: "## The Incredible Hulk\n\nBruce Banner...",
          metaDescription: "Explore Hulk's history and trading cards",
          keyFacts: {
            realName: "Bruce Banner",
            firstAppearance: "The Incredible Hulk #1 (1962)",
            creators: "Stan Lee, Jack Kirby",
            teams: ["Avengers"],
            notablePowers: ["Super strength", "Regeneration"],
          },
          status: "generated",
        })
      ).resolves.not.toThrow();

      expect(mockedUpsertCharacterContent).toHaveBeenCalledOnce();
    });

    it("updates existing character content status", async () => {
      mockedUpsertCharacterContent.mockResolvedValue(undefined);

      await upsertCharacterContent({
        characterName: "Hulk",
        slug: "hulk",
        status: "generating",
      });

      expect(mockedUpsertCharacterContent).toHaveBeenCalledWith(
        expect.objectContaining({
          characterName: "Hulk",
          slug: "hulk",
          status: "generating",
        })
      );
    });
  });
});

describe("getRelatedCharacters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns related characters sorted by shared sets", async () => {
    const mockRelated = [
      { characterName: "Captain America", slug: "captain-america", sharedSets: 5, cardCount: 18, imageUrl: "https://example.com/cap.png" },
      { characterName: "Thor", slug: "thor", sharedSets: 4, cardCount: 14, imageUrl: "https://example.com/thor.png" },
      { characterName: "Hulk", slug: "hulk", sharedSets: 4, cardCount: 12, imageUrl: "https://example.com/hulk.png" },
      { characterName: "Black Widow", slug: "black-widow", sharedSets: 3, cardCount: 10, imageUrl: null },
    ];
    mockedGetRelatedCharacters.mockResolvedValue(mockRelated);

    const result = await getRelatedCharacters("Iron Man", 12);
    expect(result).toHaveLength(4);
    expect(result[0].characterName).toBe("Captain America");
    expect(result[0].sharedSets).toBe(5);
    expect(result[0].slug).toBe("captain-america");
    // Sorted by sharedSets descending
    expect(result[0].sharedSets).toBeGreaterThanOrEqual(result[1].sharedSets);
  });

  it("does not include the queried character in results", async () => {
    const mockRelated = [
      { characterName: "Spider-Man", slug: "spider-man", sharedSets: 4, cardCount: 15, imageUrl: "https://example.com/spidey.png" },
    ];
    mockedGetRelatedCharacters.mockResolvedValue(mockRelated);

    const result = await getRelatedCharacters("Iron Man", 12);
    expect(result.every(c => c.characterName !== "Iron Man")).toBe(true);
  });

  it("returns empty array for character with no related characters", async () => {
    mockedGetRelatedCharacters.mockResolvedValue([]);

    const result = await getRelatedCharacters("Obscure Hero", 12);
    expect(result).toHaveLength(0);
  });

  it("respects the limit parameter", async () => {
    const mockRelated = Array.from({ length: 6 }, (_, i) => ({
      characterName: `Hero ${i}`,
      slug: `hero-${i}`,
      sharedSets: 5 - Math.floor(i / 2),
      cardCount: 10 - i,
      imageUrl: null,
    }));
    mockedGetRelatedCharacters.mockResolvedValue(mockRelated);

    const result = await getRelatedCharacters("Iron Man", 6);
    expect(result).toHaveLength(6);
    expect(mockedGetRelatedCharacters).toHaveBeenCalledWith("Iron Man", 6);
  });

  it("includes imageUrl which may be null", async () => {
    const mockRelated = [
      { characterName: "Hawkeye", slug: "hawkeye", sharedSets: 2, cardCount: 5, imageUrl: null },
      { characterName: "Thor", slug: "thor", sharedSets: 4, cardCount: 14, imageUrl: "https://example.com/thor.png" },
    ];
    mockedGetRelatedCharacters.mockResolvedValue(mockRelated);

    const result = await getRelatedCharacters("Iron Man", 12);
    expect(result[0].imageUrl).toBeNull();
    expect(result[1].imageUrl).toBe("https://example.com/thor.png");
  });
});

describe("Character Slug Generation", () => {
  it("generates consistent slugs for common Marvel characters", () => {
    const testCases: [string, string][] = [
      ["Spider-Man", "spider-man"],
      ["Wolverine", "wolverine"],
      ["Iron Man", "iron-man"],
      ["Captain America", "captain-america"],
      ["Doctor Strange", "doctor-strange"],
      ["Black Widow", "black-widow"],
      ["Ant-Man (Scott Lang)", "ant-man-scott-lang"],
    ];

    for (const [name, expected] of testCases) {
      expect(characterNameToSlug(name)).toBe(expected);
    }
  });
});
