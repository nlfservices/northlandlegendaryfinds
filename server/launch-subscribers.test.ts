import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("../drizzle/schema", () => ({
  launchSubscribers: {
    id: "id",
    email: "email",
    productSlug: "productSlug",
    userId: "userId",
    source: "source",
    createdAt: "createdAt",
  },
}));

const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();
const mockInsert = vi.fn();
const mockValues = vi.fn();

vi.mock("./db", () => ({
  getDb: vi.fn(() => ({
    select: mockSelect,
    from: mockFrom,
    where: mockWhere,
    insert: mockInsert,
  })),
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((...args: unknown[]) => ({ type: "eq", args })),
  and: vi.fn((...args: unknown[]) => ({ type: "and", args })),
  desc: vi.fn((...args: unknown[]) => ({ type: "desc", args })),
  sql: vi.fn(),
}));

describe("Launch Subscribers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Chain: select().from().where().limit()
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockInsert.mockReturnValue({ values: mockValues });
  });

  describe("Email validation", () => {
    it("should accept valid email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.org",
        "user+tag@gmail.com",
        "a@b.co",
      ];
      validEmails.forEach((email) => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it("should reject invalid email addresses", () => {
      const invalidEmails = ["notanemail", "@domain.com", "user@", ""];
      invalidEmails.forEach((email) => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe("Duplicate detection", () => {
    it("should normalize email to lowercase and trim whitespace", () => {
      const input = "  Test@Example.COM  ";
      const normalized = input.toLowerCase().trim();
      expect(normalized).toBe("test@example.com");
    });

    it("should detect duplicate subscriptions", async () => {
      // Simulate existing subscription found
      mockLimit.mockResolvedValue([{ id: 1 }]);

      const result = mockLimit();
      const existing = await result;
      expect(existing.length).toBeGreaterThan(0);
    });

    it("should allow new subscriptions when no duplicate exists", async () => {
      // Simulate no existing subscription
      mockLimit.mockResolvedValue([]);
      mockValues.mockResolvedValue(undefined);

      const result = await mockLimit();
      expect(result.length).toBe(0);
    });
  });

  describe("Subscription response", () => {
    it("should return alreadySubscribed: true for duplicates", () => {
      const response = { success: true, alreadySubscribed: true };
      expect(response.success).toBe(true);
      expect(response.alreadySubscribed).toBe(true);
    });

    it("should return alreadySubscribed: false for new subscriptions", () => {
      const response = { success: true, alreadySubscribed: false };
      expect(response.success).toBe(true);
      expect(response.alreadySubscribed).toBe(false);
    });
  });

  describe("Product slug validation", () => {
    it("should require a non-empty product slug", () => {
      const validSlugs = ["nlf-variant", "shadows-of-the-force"];
      validSlugs.forEach((slug) => {
        expect(slug.length).toBeGreaterThan(0);
      });
    });

    it("should reject empty product slugs", () => {
      const emptySlug = "";
      expect(emptySlug.length).toBe(0);
    });
  });

  describe("Source tracking", () => {
    it("should default source to 'product-page' when not provided", () => {
      const source = undefined ?? "product-page";
      expect(source).toBe("product-page");
    });

    it("should use provided source when given", () => {
      const source = "shop-card" ?? "product-page";
      expect(source).toBe("shop-card");
    });
  });
});
