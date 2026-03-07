import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { LAUNCH_DATE_UTC, LAUNCH_NOT_YET_MSG } from "../shared/const";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {
        origin: "https://northlandlegendaryfinds.com",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://northlandlegendaryfinds.com",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

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
      headers: {
        origin: "https://northlandlegendaryfinds.com",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("checkout.createSession", () => {
  it("rejects invalid product slugs", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.checkout.createSession({
        productSlug: "nonexistent-product",
        quantity: 1,
      })
    ).rejects.toThrow("Product not found");
  });

  it("rejects quantity above 5", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.checkout.createSession({
        productSlug: "nlf-variant",
        quantity: 10,
      })
    ).rejects.toThrow();
  });

  it("rejects quantity below 1", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.checkout.createSession({
        productSlug: "nlf-variant",
        quantity: 0,
      })
    ).rejects.toThrow();
  });

  it("rejects nlf-variant purchase before launch date", async () => {
    // Mock Date.now to return a date before launch
    const beforeLaunch = new Date("2026-03-12T12:00:00Z").getTime();
    vi.useFakeTimers();
    vi.setSystemTime(beforeLaunch);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.checkout.createSession({
        productSlug: "nlf-variant",
        quantity: 1,
      })
    ).rejects.toThrow(LAUNCH_NOT_YET_MSG);

    vi.useRealTimers();
  });
});

describe("checkout.getOrderBySession", () => {
  it("returns null for non-existent session", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.checkout.getOrderBySession({
      sessionId: "cs_test_nonexistent",
    });

    // Should return null (no order found)
    expect(result === null || result === undefined).toBe(true);
  });
});

describe("checkout.myOrders", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.checkout.myOrders()).rejects.toThrow();
  });

  it("returns empty array for new user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.checkout.myOrders();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("checkout.allOrders", () => {
  it("requires admin role", async () => {
    const ctx = createAuthContext(); // regular user
    const caller = appRouter.createCaller(ctx);

    await expect(caller.checkout.allOrders()).rejects.toThrow();
  });

  it("returns orders for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.checkout.allOrders();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("checkout.updateOrderStatus", () => {
  it("requires admin role", async () => {
    const ctx = createAuthContext(); // regular user
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.checkout.updateOrderStatus({
        orderId: 1,
        status: "shipped",
        trackingNumber: "1Z999AA10123456784",
      })
    ).rejects.toThrow();
  });
});
