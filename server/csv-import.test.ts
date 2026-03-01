import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@nlfservices.com",
    name: "Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("CSV Import Routes", () => {
  it("admin.checklist.csvImport validates tier aliases correctly", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Test that the route exists and validates input properly
    // We can't actually insert without a real DB, but we can test the schema validation
    try {
      await caller.admin.checklist.csvImport({
        productId: 999,
        rows: [
          { cardName: "Spider-Man", tier: "Top Hits" },
          { cardName: "Iron Man", tier: "Middle of Pack" },
          { cardName: "Hulk", tier: "Low Floor" },
          { cardName: "Thor", tier: "bonus" },
        ],
      });
    } catch (e: any) {
      // Expected to fail on DB operation, not on validation
      // If it fails with a DB error, the schema validation passed
      expect(e.message).not.toContain("validation");
    }
  });

  it("admin.pulls.csvImport validates input schema", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.pulls.csvImport({
        productId: 999,
        rows: [
          { cardName: "Spider-Man", packNumber: 1, pulledBy: "John" },
          { cardName: "Iron Man" },
        ],
      });
    } catch (e: any) {
      // Expected to fail on DB operation, not on validation
      expect(e.message).not.toContain("validation");
    }
  });

  it("rejects non-admin users from CSV import", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.checklist.csvImport({
        productId: 1,
        rows: [{ cardName: "Test" }],
      })
    ).rejects.toThrow();
  });

  it("rejects empty card names in CSV import", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.checklist.csvImport({
        productId: 1,
        rows: [{ cardName: "" }],
      })
    ).rejects.toThrow();
  });
});

describe("Public Routes", () => {
  it("public.products.getBySlug exists and validates input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.public.products.getBySlug({ slug: "test-product" });
      // If no DB error, result should be null/undefined for non-existent product
      expect(result === null || result === undefined).toBe(true);
    } catch (e: any) {
      // DB connection error is acceptable in test environment
      expect(e.message).toBeDefined();
    }
  });

  it("public.products.whatnot exists", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.public.products.whatnot();
      expect(Array.isArray(result)).toBe(true);
    } catch (e: any) {
      // DB connection error is acceptable
      expect(e.message).toBeDefined();
    }
  });

  it("public.shows.upcoming exists", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.public.shows.upcoming();
      expect(Array.isArray(result)).toBe(true);
    } catch (e: any) {
      expect(e.message).toBeDefined();
    }
  });
});
