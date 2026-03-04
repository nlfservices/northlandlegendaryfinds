import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db functions
vi.mock("./db", () => ({
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  // Card set mocks
  getAllCardSets: vi.fn().mockResolvedValue([
    { id: 1, name: "2025 Topps Chrome", brand: "Topps", year: "2025", sport: "non-sport", totalCards: 200, createdAt: new Date() },
    { id: 2, name: "2025 Topps Sapphire", brand: "Topps", year: "2025", sport: "non-sport", totalCards: 150, createdAt: new Date() },
  ]),
  getCardSetById: vi.fn().mockResolvedValue({ id: 1, name: "2025 Topps Chrome", brand: "Topps", year: "2025" }),
  createCardSet: vi.fn().mockResolvedValue({ insertId: 1 }),
  updateCardSet: vi.fn().mockResolvedValue(undefined),
  deleteCardSet: vi.fn().mockResolvedValue(undefined),
  // Inventory mocks
  getAllInventoryCards: vi.fn().mockResolvedValue([
    { id: 1, cardSetId: 1, cardName: "Spider-Man", cardNumber: "1", parallel: "Base", status: "in_stock", quantity: 1, estimatedValueCents: 500 },
    { id: 2, cardSetId: 1, cardName: "Iron Man", cardNumber: "2", parallel: "Gold Refractor", status: "allocated", quantity: 1, estimatedValueCents: 5000, allocatedToProductId: 1 },
  ]),
  getInventoryCardById: vi.fn().mockResolvedValue({ id: 1, cardSetId: 1, cardName: "Spider-Man", status: "in_stock" }),
  createInventoryCard: vi.fn().mockResolvedValue({ insertId: 1 }),
  bulkCreateInventoryCards: vi.fn().mockResolvedValue({ count: 5 }),
  updateInventoryCard: vi.fn().mockResolvedValue(undefined),
  deleteInventoryCard: vi.fn().mockResolvedValue(undefined),
  allocateCardsToRepack: vi.fn().mockResolvedValue([{ id: 1 }]),
  deallocateCardsFromRepack: vi.fn().mockResolvedValue(undefined),
  getInventoryStats: vi.fn().mockResolvedValue({
    totalCards: 100, inStock: 60, allocated: 35, pulled: 5, sold: 0, totalValue: 250000, totalCost: 150000,
  }),
}));

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@nlf.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@test.com",
      name: "User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("Inventory Management", () => {
  describe("Card Sets", () => {
    it("lists all card sets for admin", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.cardSets.list();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("2025 Topps Chrome");
    });

    it("creates a card set", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.cardSets.create({
        name: "2025 Topps Mint",
        slug: "2025-topps-mint",
        brand: "Topps",
        year: "2025",
        sport: "non-sport",
      });
      expect(result.success).toBe(true);
    });

    it("rejects non-admin users", async () => {
      const caller = appRouter.createCaller(createUserContext());
      await expect(caller.admin.cardSets.list()).rejects.toThrow();
    });
  });

  describe("Inventory Cards", () => {
    it("lists all inventory cards", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.inventory.list();
      expect(result).toHaveLength(2);
    });

    it("lists inventory cards with filters", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.inventory.list({ status: "in_stock" });
      expect(result).toBeDefined();
    });

    it("creates a single inventory card", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.inventory.create({
        cardSetId: 1,
        cardName: "Wolverine",
        cardNumber: "50",
        parallel: "Base",
        condition: "raw",
        quantity: 1,
      });
      expect(result.success).toBe(true);
    });

    it("bulk imports inventory cards via CSV", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.inventory.csvImport({
        cardSetId: 1,
        rows: [
          { cardName: "Spider-Man", cardNumber: "1", parallel: "Base", estimatedValue: 5 },
          { cardName: "Iron Man", cardNumber: "2", parallel: "Gold", estimatedValue: 50 },
          { cardName: "Thor", cardNumber: "3", parallel: "Base", estimatedValue: 3 },
          { cardName: "Captain America", cardNumber: "4", parallel: "Silver", estimatedValue: 15 },
          { cardName: "Black Panther", cardNumber: "5", parallel: "Base", estimatedValue: 4 },
        ],
      });
      expect(result.success).toBe(true);
      expect(result.count).toBe(5);
    });

    it("gets inventory stats", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.inventory.stats();
      expect(result.totalCards).toBe(100);
      expect(result.inStock).toBe(60);
      expect(result.allocated).toBe(35);
      expect(result.pulled).toBe(5);
      expect(result.totalValue).toBe(250000);
    });
  });

  describe("Repack Builder", () => {
    it("allocates cards to a repack", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.inventory.allocateToRepack({
        cardIds: [1, 2, 3],
        productId: 1,
        tier: "chase",
      });
      expect(result.success).toBe(true);
      expect(result.allocated).toBe(1);
    });

    it("deallocates cards from a repack", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.inventory.deallocateFromRepack({
        cardIds: [1],
      });
      expect(result.success).toBe(true);
    });
  });
});
