import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module but keep parseParallels real
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getCardBySetAndNumber: vi.fn(),
    getAdjacentCards: vi.fn(),
    getSameCharacterCardsInSet: vi.fn(),
    getCardDetailContentByCardId: vi.fn(),
    upsertCardDetailContent: vi.fn(),
    getAllCardDetailSlugs: vi.fn(),
  };
});

import {
  parseParallels,
  getCardBySetAndNumber,
  getAdjacentCards,
  getSameCharacterCardsInSet,
  getCardDetailContentByCardId,
  getAllCardDetailSlugs,
} from "./db";

const mockedGetCard = vi.mocked(getCardBySetAndNumber);
const mockedGetAdjacent = vi.mocked(getAdjacentCards);
const mockedGetSameChar = vi.mocked(getSameCharacterCardsInSet);
const mockedGetContent = vi.mocked(getCardDetailContentByCardId);
const mockedGetAllSlugs = vi.mocked(getAllCardDetailSlugs);

describe("parseParallels", () => {
  it("returns empty array for null input", () => {
    const result = parseParallels(null);
    expect(result).toEqual([]);
  });

  it("filters out plain Base and Base Cards", () => {
    const result = parseParallels("Base, /99, /25, /1");
    expect(result.find((p) => p.name === "Base")).toBeUndefined();
    expect(result.length).toBe(3);
  });

  it("parses numbered parallels correctly", () => {
    const result = parseParallels("Base, /399, /299, /199, /100, /99, /75, /25, /10, /5, /1");
    expect(result).toContainEqual({ name: "/399", printRun: 399, isNumbered: true });
    expect(result).toContainEqual({ name: "/99", printRun: 99, isNumbered: true });
    expect(result).toContainEqual({ name: "1/1", printRun: 1, isNumbered: true });
    expect(result).toContainEqual({ name: "/5", printRun: 5, isNumbered: true });
  });

  it("parses suffixed parallels (/25-2, /5-P)", () => {
    const result = parseParallels("/25-2, /5-P");
    expect(result).toContainEqual({ name: "/25-2", printRun: 25, isNumbered: true });
    expect(result).toContainEqual({ name: "/5-P", printRun: 5, isNumbered: true });
  });

  it("parses Gold variants (25-G, 10-G)", () => {
    const result = parseParallels("25-G, 10-G, 5-G");
    expect(result).toContainEqual({ name: "Gold /25", printRun: 25, isNumbered: true });
    expect(result).toContainEqual({ name: "Gold /10", printRun: 10, isNumbered: true });
    expect(result).toContainEqual({ name: "Gold /5", printRun: 5, isNumbered: true });
  });

  it("parses color-named parallels (The Collector style)", () => {
    const result = parseParallels("Base /274, Purple /455, Black /687, Red /1347, Gold /6732");
    expect(result).toContainEqual({ name: "Base /274", printRun: 274, isNumbered: true });
    expect(result).toContainEqual({ name: "Purple /455", printRun: 455, isNumbered: true });
    expect(result).toContainEqual({ name: "Gold /6732", printRun: 6732, isNumbered: true });
  });

  it("parses Printing Plate (PP)", () => {
    const result = parseParallels("Base, /25, /10, /5, PP");
    const pp = result.find((p) => p.name.includes("Printing Plate"));
    expect(pp).toBeDefined();
    expect(pp!.printRun).toBe(1);
    expect(pp!.isNumbered).toBe(true);
  });

  it("parses PP with suffix (PP-P)", () => {
    const result = parseParallels("Base Platinum, /1-P, /5-P, /10-P, /99, PP-P");
    const pp = result.find((p) => p.name.includes("Printing Plate"));
    expect(pp).toBeDefined();
    expect(pp!.printRun).toBe(1);
  });

  it("filters out unnumbered single-word insert names", () => {
    const result = parseParallels("Gambits Deck");
    expect(result.length).toBe(0);
  });

  it("keeps Base Platinum as a named variant", () => {
    const result = parseParallels("Base Platinum, /1-P, /5-P");
    expect(result.find((p) => p.name === "Base Platinum")).toBeDefined();
  });

  it("handles Chrome base set parallels correctly", () => {
    const result = parseParallels("Base, /399, /299, /199, /100, /99, /75, /62, /50, /40, /39, /25, /25-2, /10, /5, /5-2, /1");
    expect(result.find((p) => p.name === "Base")).toBeUndefined();
    expect(result.find((p) => p.name === "1/1")).toBeDefined();
    expect(result.find((p) => p.name === "/25-2")).toBeDefined();
  });

  it("handles Marvel Studios full parallel set", () => {
    const result = parseParallels("Base Cards, /199, /150, /99, /80, /76, /75, /50, /50-2, /49, 25-G, /25, /25-2, 10-G, /10, /10-2, /5, 5-G, /5-2, /1, PP");
    expect(result.find((p) => p.name === "Base Cards")).toBeUndefined();
    expect(result.find((p) => p.name === "Gold /25")).toBeDefined();
    expect(result.find((p) => p.name === "Gold /10")).toBeDefined();
    expect(result.find((p) => p.name === "Gold /5")).toBeDefined();
    expect(result.find((p) => p.name.includes("Printing Plate"))).toBeDefined();
  });

  it("parses named pull-odds (Comic Book Heroes)", () => {
    const result = parseParallels("Base 1:1, Refractor 1:1, Gold Mini Diamonds 1:8, Superfractor 1:1,412");
    expect(result).toContainEqual({ name: "Base", printRun: null, isNumbered: false, odds: "1:1" });
    expect(result).toContainEqual({ name: "Refractor", printRun: null, isNumbered: false, odds: "1:1" });
    expect(result).toContainEqual({ name: "Gold Mini Diamonds", printRun: null, isNumbered: false, odds: "1:8" });
    expect(result).toContainEqual({ name: "Superfractor", printRun: null, isNumbered: false, odds: "1:1,412" });
    expect(result.find((p) => p.name === "412")).toBeUndefined();
    expect(result.length).toBe(4);
  });
});

describe("Card Detail DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCardBySetAndNumber returns card with set info", async () => {
    const mockCard = {
      id: 1,
      setId: 1,
      cardNumber: "1",
      characterName: "Iron Man",
      cardType: "Base",
      parallels: "Base, /399, /299, /199, /1",
      rarity: null,
      imageUrl: "https://example.com/iron-man.webp",
      description: null,
      sortOrder: 1,
      sourceId: null,
      createdAt: new Date(),
      setName: "2025 Topps Chrome",
      setSlug: "2025-topps-chrome",
      setYear: 2025,
      setDescription: "Chrome set",
    };
    mockedGetCard.mockResolvedValue(mockCard);

    const result = await getCardBySetAndNumber("2025-topps-chrome", "1");
    expect(result).toBeDefined();
    expect(result!.characterName).toBe("Iron Man");
    expect(result!.setSlug).toBe("2025-topps-chrome");
  });

  it("getCardBySetAndNumber returns undefined for non-existent card", async () => {
    mockedGetCard.mockResolvedValue(undefined);
    const result = await getCardBySetAndNumber("fake-set", "999");
    expect(result).toBeUndefined();
  });

  it("getAdjacentCards returns prev and next", async () => {
    mockedGetAdjacent.mockResolvedValue({
      prev: { cardNumber: "1", characterName: "Iron Man", imageUrl: null, cardType: "Base" },
      next: { cardNumber: "3", characterName: "Thor", imageUrl: null, cardType: "Base" },
    });

    const result = await getAdjacentCards(1, 2);
    expect(result.prev).toBeDefined();
    expect(result.next).toBeDefined();
    expect(result.prev!.cardNumber).toBe("1");
    expect(result.next!.cardNumber).toBe("3");
  });

  it("getSameCharacterCardsInSet returns other cards of same character", async () => {
    mockedGetSameChar.mockResolvedValue([
      { id: 227, cardNumber: "AV-9", characterName: "Iron Man", cardType: "NEW AVENGERS", imageUrl: null, parallels: null },
      { id: 276, cardNumber: "IM-1", characterName: "Iron Man", cardType: "IRON MAN GOLD", imageUrl: null, parallels: null },
    ]);

    const result = await getSameCharacterCardsInSet(1, "Iron Man", 1);
    expect(result.length).toBe(2);
    expect(result[0].cardNumber).toBe("AV-9");
  });

  it("getCardDetailContentByCardId returns undefined for no content", async () => {
    mockedGetContent.mockResolvedValue(undefined);
    const result = await getCardDetailContentByCardId(999);
    expect(result).toBeUndefined();
  });

  it("getAllCardDetailSlugs returns card/set pairs", async () => {
    mockedGetAllSlugs.mockResolvedValue([
      { cardNumber: "1", setSlug: "2025-topps-chrome" },
      { cardNumber: "2", setSlug: "2025-topps-chrome" },
      { cardNumber: "1", setSlug: "2025-topps-marvel-mint" },
    ]);

    const result = await getAllCardDetailSlugs();
    expect(result.length).toBe(3);
    expect(result[0].setSlug).toBe("2025-topps-chrome");
  });
});
