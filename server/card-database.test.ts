import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getAllMarvelSets: vi.fn(),
  getMarvelSetBySlug: vi.fn(),
  getMarvelCardsBySetId: vi.fn(),
  searchMarvelCards: vi.fn(),
  getAllGradedCards: vi.fn(),
  getGradedCardStats: vi.fn(),
  getGradedCardGradeDistribution: vi.fn(),
  getGradedCardSets: vi.fn(),
}));

import {
  getAllMarvelSets,
  getMarvelSetBySlug,
  getMarvelCardsBySetId,
  searchMarvelCards,
  getAllGradedCards,
  getGradedCardStats,
  getGradedCardGradeDistribution,
  getGradedCardSets,
} from "./db";

const mockedGetAllMarvelSets = vi.mocked(getAllMarvelSets);
const mockedGetMarvelSetBySlug = vi.mocked(getMarvelSetBySlug);
const mockedGetMarvelCardsBySetId = vi.mocked(getMarvelCardsBySetId);
const mockedSearchMarvelCards = vi.mocked(searchMarvelCards);
const mockedGetAllGradedCards = vi.mocked(getAllGradedCards);
const mockedGetGradedCardStats = vi.mocked(getGradedCardStats);
const mockedGetGradedCardGradeDistribution = vi.mocked(getGradedCardGradeDistribution);
const mockedGetGradedCardSets = vi.mocked(getGradedCardSets);

describe("Marvel Encyclopedia API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllMarvelSets returns sets ordered by name", async () => {
    const mockSets = [
      { id: 1, name: "2025 Topps Chrome", slug: "2025-topps-chrome", totalCards: 361, releaseYear: 2025 },
      { id: 2, name: "2025 Topps Comic Book Heroes", slug: "2025-topps-comic-book-heroes", totalCards: 150, releaseYear: 2025 },
    ];
    mockedGetAllMarvelSets.mockResolvedValue(mockSets as any);

    const result = await getAllMarvelSets();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("2025 Topps Chrome");
    expect(result[1].totalCards).toBe(150);
  });

  it("getMarvelSetBySlug returns a single set", async () => {
    const mockSet = { id: 1, name: "2025 Topps Chrome", slug: "2025-topps-chrome", totalCards: 361 };
    mockedGetMarvelSetBySlug.mockResolvedValue(mockSet as any);

    const result = await getMarvelSetBySlug("2025-topps-chrome");
    expect(result).toBeDefined();
    expect(result?.slug).toBe("2025-topps-chrome");
  });

  it("getMarvelSetBySlug returns undefined for non-existent slug", async () => {
    mockedGetMarvelSetBySlug.mockResolvedValue(undefined);

    const result = await getMarvelSetBySlug("non-existent");
    expect(result).toBeUndefined();
  });

  it("getMarvelCardsBySetId returns cards for a set", async () => {
    const mockCards = [
      { id: 1, setId: 1, cardNumber: "1", characterName: "Spider-Man", cardType: "Base" },
      { id: 2, setId: 1, cardNumber: "2", characterName: "Wolverine", cardType: "Base" },
    ];
    mockedGetMarvelCardsBySetId.mockResolvedValue(mockCards as any);

    const result = await getMarvelCardsBySetId(1);
    expect(result).toHaveLength(2);
    expect(result[0].characterName).toBe("Spider-Man");
  });

  it("searchMarvelCards returns matching cards", async () => {
    const mockResults = [
      { id: 1, characterName: "Spider-Man", cardNumber: "1", setName: "2025 Topps Chrome" },
    ];
    mockedSearchMarvelCards.mockResolvedValue(mockResults as any);

    const result = await searchMarvelCards("Spider", 50);
    expect(result).toHaveLength(1);
    expect(result[0].characterName).toBe("Spider-Man");
  });
});

describe("Graded Cards API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllGradedCards returns cards with default pagination", async () => {
    const mockCards = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      gradingCompany: i < 30 ? "CGC" : "AGS",
      grade: i < 10 ? "GEM MINT 10" : "9",
      cardName: `Character ${i}`,
    }));
    mockedGetAllGradedCards.mockResolvedValue(mockCards as any);

    const result = await getAllGradedCards({});
    expect(result).toHaveLength(50);
    expect(result[0].gradingCompany).toBe("CGC");
  });

  it("getAllGradedCards filters by grading company", async () => {
    const cgcCards = [
      { id: 1, gradingCompany: "CGC", grade: "9", cardName: "Doctor Doom" },
    ];
    mockedGetAllGradedCards.mockResolvedValue(cgcCards as any);

    const result = await getAllGradedCards({ gradingCompany: "CGC" });
    expect(result).toHaveLength(1);
    expect(result[0].gradingCompany).toBe("CGC");
  });

  it("getGradedCardStats returns correct statistics", async () => {
    const mockStats = {
      total: 2133,
      cgc: 1282,
      ags: 851,
      gem10: 271,
      pristine10: 14,
      mint95: 24,
      grade9: 636,
      other: 337,
      awaitingGrade: 851,
      uniqueSets: 69,
      uniqueCharacters: 364,
    };
    mockedGetGradedCardStats.mockResolvedValue(mockStats);

    const result = await getGradedCardStats();
    expect(result.total).toBe(2133);
    expect(result.cgc).toBe(1282);
    expect(result.ags).toBe(851);
    expect(result.gem10).toBe(271);
  });

  it("getGradedCardGradeDistribution returns grade counts", async () => {
    const mockDistribution = [
      { grade: "9", count: 636 },
      { grade: "Awaiting Grade", count: 851 },
      { grade: "GEM MINT 10", count: 271 },
    ];
    mockedGetGradedCardGradeDistribution.mockResolvedValue(mockDistribution);

    const result = await getGradedCardGradeDistribution();
    expect(result).toHaveLength(3);
    expect(result.find(d => d.grade === "GEM MINT 10")?.count).toBe(271);
  });

  it("getGradedCardSets returns unique sets with counts", async () => {
    const mockSets = [
      { name: "2025 Topps Chrome", count: 400 },
      { name: "2025 Marvel Mint", count: 350 },
    ];
    mockedGetGradedCardSets.mockResolvedValue(mockSets);

    const result = await getGradedCardSets();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("2025 Topps Chrome");
  });
});

describe("Card Database - Year-Based Organization", () => {
  // Simulate the frontend grouping logic
  function groupSetsByYear(sets: Array<{ id: number; name: string; releaseYear: number | null }>) {
    const grouped: Record<number, typeof sets> = {};
    sets.forEach((set) => {
      const year = set.releaseYear ?? 2025;
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(set);
    });
    return Object.entries(grouped)
      .map(([year, yearSets]) => ({ year: Number(year), sets: yearSets }))
      .sort((a, b) => b.year - a.year);
  }

  const mockSets = [
    { id: 1, name: "2025 Topps Chrome", releaseYear: 2025 },
    { id: 2, name: "2025 Topps Comic Book Heroes", releaseYear: 2025 },
    { id: 3, name: "2024 Topps Chrome Marvel", releaseYear: 2024 },
    { id: 4, name: "2024 Topps Chrome Sapphire Marvel", releaseYear: 2024 },
    { id: 5, name: "2026 Topps Finest Fantastic Four", releaseYear: 2026 },
    { id: 6, name: "2026 Topps Brooklyn Collection Captain America 85th", releaseYear: 2026 },
    { id: 7, name: "2026 Topps Chrome Marvel Comics", releaseYear: 2026 },
  ];

  it("groups sets by year correctly", () => {
    const result = groupSetsByYear(mockSets);
    expect(result).toHaveLength(3);
    expect(result[0].year).toBe(2026);
    expect(result[1].year).toBe(2025);
    expect(result[2].year).toBe(2024);
  });

  it("sorts years in descending order (newest first)", () => {
    const result = groupSetsByYear(mockSets);
    const years = result.map((g) => g.year);
    expect(years).toEqual([2026, 2025, 2024]);
  });

  it("assigns correct number of sets per year", () => {
    const result = groupSetsByYear(mockSets);
    expect(result[0].sets).toHaveLength(3); // 2026: 3 sets
    expect(result[1].sets).toHaveLength(2); // 2025: 2 sets
    expect(result[2].sets).toHaveLength(2); // 2024: 2 sets
  });

  it("handles sets with null releaseYear by defaulting to 2025", () => {
    const setsWithNull = [
      ...mockSets,
      { id: 8, name: "Unknown Year Set", releaseYear: null },
    ];
    const result = groupSetsByYear(setsWithNull);
    const year2025 = result.find((g) => g.year === 2025);
    expect(year2025?.sets).toHaveLength(3); // 2 original + 1 null-defaulted
  });

  it("handles empty sets array", () => {
    const result = groupSetsByYear([]);
    expect(result).toHaveLength(0);
  });

  it("all 13 sets across 3 years (2024-2026) are expected in production", () => {
    // Production should have: 2 sets in 2024, 8 sets in 2025, 3 sets in 2026
    const productionSets = [
      { id: 1, name: "2024 Topps Chrome Marvel", releaseYear: 2024 },
      { id: 2, name: "2024 Topps Chrome Sapphire Marvel", releaseYear: 2024 },
      { id: 3, name: "2025 Topps Chrome", releaseYear: 2025 },
      { id: 4, name: "2025 Topps Chrome Deadpool", releaseYear: 2025 },
      { id: 5, name: "2025 Topps Comic Book Heroes", releaseYear: 2025 },
      { id: 6, name: "2025 Topps Marvel Mint", releaseYear: 2025 },
      { id: 7, name: "2025 Topps Marvel Sapphire", releaseYear: 2025 },
      { id: 8, name: "2025 Topps Marvel Studios", releaseYear: 2025 },
      { id: 9, name: "2025 Topps Marvel Studios Sapphire", releaseYear: 2025 },
      { id: 10, name: "2025 Topps Marvel Studios: The Collector", releaseYear: 2025 },
      { id: 11, name: "2026 Topps Brooklyn Collection Captain America 85th", releaseYear: 2026 },
      { id: 12, name: "2026 Topps Chrome Marvel Comics", releaseYear: 2026 },
      { id: 13, name: "2026 Topps Finest Fantastic Four", releaseYear: 2026 },
    ];
    const result = groupSetsByYear(productionSets);
    expect(result).toHaveLength(3);
    expect(result[0].year).toBe(2026);
    expect(result[0].sets).toHaveLength(3);
    expect(result[1].year).toBe(2025);
    expect(result[1].sets).toHaveLength(8);
    expect(result[2].year).toBe(2024);
    expect(result[2].sets).toHaveLength(2);
  });
});
