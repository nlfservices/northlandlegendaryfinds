import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@nlfservices.com",
    name: "Admin User",
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

function createNonAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
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
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Admin routes - access control", () => {
  it("rejects unauthenticated users from admin product list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.products.list()).rejects.toThrow();
  });

  it("rejects non-admin users from admin product list", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.products.list()).rejects.toThrow();
  });

  it("rejects unauthenticated users from admin checklist routes", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.checklist.getByProduct({ productId: 1 })).rejects.toThrow();
  });

  it("rejects non-admin users from admin pull routes", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.pulls.recent()).rejects.toThrow();
  });

  it("rejects unauthenticated users from admin show routes", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.shows.list()).rejects.toThrow();
  });
});

describe("Public routes - access", () => {
  it("allows unauthenticated users to list products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // This should not throw - public route
    const result = await caller.public.products.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated users to get checklist by product", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.public.checklist.getByProduct({ productId: 999 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated users to get recent pulls", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.public.pulls.recent();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated users to list shows", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.public.shows.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated users to get upcoming shows", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.public.shows.upcoming();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns undefined for non-existent product slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.public.products.getBySlug({ slug: "non-existent-product" });
    expect(result).toBeNull();
  });
});

describe("Router structure", () => {
  it("has admin router with products, checklist, pulls, shows", () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.admin.products).toBeDefined();
    expect(caller.admin.checklist).toBeDefined();
    expect(caller.admin.pulls).toBeDefined();
    expect(caller.admin.shows).toBeDefined();
  });

  it("has public router with products, checklist, pulls, shows", () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.public.products).toBeDefined();
    expect(caller.public.checklist).toBeDefined();
    expect(caller.public.pulls).toBeDefined();
    expect(caller.public.shows).toBeDefined();
  });
});
