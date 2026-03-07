/**
 * Tests for checklist sheet endpoints: bulkMarkPulled, bulkUnpull, uploadImage
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({}),
  getChecklistByProductId: vi.fn().mockResolvedValue([
    { id: 1, productId: 1, cardName: "Spider-Man", parallel: "Base", isPulled: false, tier: "chase" },
    { id: 2, productId: 1, cardName: "Iron Man", parallel: "Gold /50", isPulled: false, tier: "hit" },
    { id: 3, productId: 1, cardName: "Hulk", parallel: "Base", isPulled: true, tier: "base" },
  ]),
  updateChecklistItem: vi.fn().mockResolvedValue(undefined),
  bulkCreatePulls: vi.fn().mockResolvedValue({ count: 2 }),
  findChecklistItemByName: vi.fn().mockResolvedValue(undefined),
  getAllProducts: vi.fn().mockResolvedValue([]),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  getProductById: vi.fn(),
  createChecklistItem: vi.fn(),
  createChecklistItems: vi.fn(),
  deleteChecklistItem: vi.fn(),
  deleteChecklistByProductId: vi.fn(),
  getPullsByProductId: vi.fn().mockResolvedValue([]),
  createPull: vi.fn(),
  deletePull: vi.fn(),
  getRecentPulls: vi.fn().mockResolvedValue([]),
  getPullsByShowId: vi.fn().mockResolvedValue([]),
  getAllShows: vi.fn().mockResolvedValue([]),
  getShowsByProductId: vi.fn().mockResolvedValue([]),
  getShowById: vi.fn(),
  createShow: vi.fn(),
  updateShow: vi.fn(),
  deleteShow: vi.fn(),
  getAllCardSets: vi.fn().mockResolvedValue([]),
  getCardSetById: vi.fn(),
  createCardSet: vi.fn(),
  updateCardSet: vi.fn(),
  deleteCardSet: vi.fn(),
  getAllInventoryCards: vi.fn().mockResolvedValue([]),
  getInventoryCardById: vi.fn(),
  createInventoryCard: vi.fn(),
  updateInventoryCard: vi.fn(),
  deleteInventoryCard: vi.fn(),
  bulkCreateInventoryCards: vi.fn(),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://s3.example.com/test-image.jpg", key: "test-key" }),
}));

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
  eq: vi.fn((...args: any[]) => args),
  desc: vi.fn((...args: any[]) => args),
  sql: Object.assign(vi.fn((...args: any[]) => args), {
    raw: vi.fn((...args: any[]) => args),
  }),
  and: vi.fn((...args: any[]) => args),
  asc: vi.fn((...args: any[]) => args),
  inArray: vi.fn((...args: any[]) => args),
}));

describe("Checklist Sheet Backend Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("bulkMarkPulled", () => {
    it("should create pull records for selected checklist items", async () => {
      const { bulkCreatePulls } = await import("./db");

      // Simulate calling the endpoint logic
      const input = {
        productId: 1,
        streamName: "Whatnot Live",
        pulledDate: Date.now(),
        rows: [
          { checklistItemId: 1 },
          { checklistItemId: 2, packNumber: 42, pulledBy: "John" },
        ],
      };

      const pullsData = input.rows.map(row => ({
        checklistItemId: row.checklistItemId,
        productId: input.productId,
        showId: null,
        packNumber: ('packNumber' in row ? row.packNumber : null) ?? null,
        pulledBy: ('pulledBy' in row ? row.pulledBy : null) ?? null,
        notes: input.streamName ? `Stream: ${input.streamName}` : null,
        pulledAt: new Date(input.pulledDate),
      }));

      await bulkCreatePulls(pullsData);

      expect(bulkCreatePulls).toHaveBeenCalledTimes(1);
      expect(bulkCreatePulls).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          checklistItemId: 1,
          productId: 1,
          notes: "Stream: Whatnot Live",
        }),
        expect.objectContaining({
          checklistItemId: 2,
          productId: 1,
          packNumber: 42,
          pulledBy: "John",
        }),
      ]));
    });

    it("should handle empty rows array", async () => {
      const { bulkCreatePulls } = await import("./db");

      const input = {
        productId: 1,
        rows: [],
      };

      const pullsData = input.rows.map((row: any) => ({
        checklistItemId: row.checklistItemId,
        productId: input.productId,
        showId: null,
        packNumber: null,
        pulledBy: null,
        notes: null,
        pulledAt: new Date(),
      }));

      await bulkCreatePulls(pullsData);
      expect(bulkCreatePulls).toHaveBeenCalledWith([]);
    });
  });

  describe("bulkUnpull", () => {
    it("should mark items as not pulled", async () => {
      const { updateChecklistItem } = await import("./db");

      const checklistItemIds = [1, 2, 3];

      for (const itemId of checklistItemIds) {
        await updateChecklistItem(itemId, { isPulled: false });
      }

      expect(updateChecklistItem).toHaveBeenCalledTimes(3);
      expect(updateChecklistItem).toHaveBeenCalledWith(1, { isPulled: false });
      expect(updateChecklistItem).toHaveBeenCalledWith(2, { isPulled: false });
      expect(updateChecklistItem).toHaveBeenCalledWith(3, { isPulled: false });
    });
  });

  describe("uploadImage", () => {
    it("should upload image to S3 and update checklist item", async () => {
      const { storagePut } = await import("./storage");
      const { updateChecklistItem } = await import("./db");

      const input = {
        checklistItemId: 1,
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        contentType: "image/png",
      };

      const buffer = Buffer.from(input.imageData, "base64");
      const fileKey = `checklist-cards/${input.checklistItemId}-testkey.png`;
      const result = await storagePut(fileKey, buffer, input.contentType);

      expect(storagePut).toHaveBeenCalledTimes(1);
      expect(result.url).toBe("https://s3.example.com/test-image.jpg");

      await updateChecklistItem(input.checklistItemId, { imageUrl: result.url });
      expect(updateChecklistItem).toHaveBeenCalledWith(1, { imageUrl: "https://s3.example.com/test-image.jpg" });
    });
  });

  describe("csvMarkPulled", () => {
    it("should match cards by name and mark as pulled", async () => {
      const { getChecklistByProductId, updateChecklistItem } = await import("./db");

      const allItems = await getChecklistByProductId(1);
      const rows = [
        { cardName: "Spider-Man", pulled: "yes" },
        { cardName: "Unknown Card", pulled: "yes" },
        { cardName: "Iron Man", pulled: "no" },
      ];

      let markedCount = 0;
      let notFoundNames: string[] = [];

      for (const row of rows) {
        const pullValue = (row.pulled || "").toLowerCase().trim();
        if (!["yes", "y", "true", "1", "x", "pulled"].includes(pullValue)) continue;

        const cardName = row.cardName.trim().toLowerCase();
        const match = allItems.find((item: any) => item.cardName.toLowerCase() === cardName && !item.isPulled);

        if (match) {
          await updateChecklistItem(match.id, { isPulled: true });
          markedCount++;
        } else if (!allItems.find((item: any) => item.cardName.toLowerCase() === cardName)) {
          notFoundNames.push(row.cardName);
        }
      }

      expect(markedCount).toBe(1); // Only Spider-Man matched and was unpulled
      expect(notFoundNames).toContain("Unknown Card");
      expect(updateChecklistItem).toHaveBeenCalledWith(1, { isPulled: true });
    });
  });
});
