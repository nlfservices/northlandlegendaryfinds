import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role?: "user" | "subscriber" | "admin"): TrpcContext {
  if (!role) {
    // Anonymous user
    return {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
    };
  }

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("Subscriber Hub", () => {
  describe("hubOverview (public)", () => {
    it("returns overview data for anonymous users", async () => {
      const caller = appRouter.createCaller(createContext());
      const result = await caller.subscriber.hubOverview();

      expect(result.isSubscriber).toBe(false);
      expect(result.isAuthenticated).toBe(false);
      expect(result.earlyAccessCount).toBeGreaterThan(0);
      expect(result.exclusiveChecklistCount).toBeGreaterThan(0);
      expect(result.earlyAccessPreview).toBeDefined();
      expect(result.checklistPreview).toBeDefined();
    });

    it("returns overview data for free users", async () => {
      const caller = appRouter.createCaller(createContext("user"));
      const result = await caller.subscriber.hubOverview();

      expect(result.isSubscriber).toBe(false);
      expect(result.isAuthenticated).toBe(true);
    });

    it("identifies subscribers correctly", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      const result = await caller.subscriber.hubOverview();

      expect(result.isSubscriber).toBe(true);
      expect(result.isAuthenticated).toBe(true);
    });

    it("identifies admins as subscribers", async () => {
      const caller = appRouter.createCaller(createContext("admin"));
      const result = await caller.subscriber.hubOverview();

      expect(result.isSubscriber).toBe(true);
      expect(result.isAuthenticated).toBe(true);
    });

    it("preview data does not expose subscriber pricing", async () => {
      const caller = appRouter.createCaller(createContext());
      const result = await caller.subscriber.hubOverview();

      result.earlyAccessPreview.forEach((product) => {
        expect(product).not.toHaveProperty("subscriberPrice");
        expect(product).not.toHaveProperty("price");
        expect(product).not.toHaveProperty("savings");
        expect(product).not.toHaveProperty("features");
      });
    });

    it("checklist preview does not expose detailed tier info", async () => {
      const caller = appRouter.createCaller(createContext());
      const result = await caller.subscriber.hubOverview();

      result.checklistPreview.forEach((checklist) => {
        expect(checklist).not.toHaveProperty("tiers");
        expect(checklist).not.toHaveProperty("estimatedValueRange");
        expect(checklist).not.toHaveProperty("hitRatio");
        expect(checklist).not.toHaveProperty("description");
      });
    });
  });

  describe("earlyAccessProducts (subscriber-gated)", () => {
    it("returns full product data for subscribers", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      const result = await caller.subscriber.earlyAccessProducts();

      expect(result.length).toBeGreaterThan(0);
      result.forEach((product) => {
        expect(product).toHaveProperty("subscriberPrice");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("savings");
        expect(product).toHaveProperty("features");
        expect(product).toHaveProperty("subscriberLaunchDate");
        expect(product).toHaveProperty("publicLaunchDate");
        expect(product.subscriberPrice).toBeLessThan(product.price);
      });
    });

    it("returns full product data for admins", async () => {
      const caller = appRouter.createCaller(createContext("admin"));
      const result = await caller.subscriber.earlyAccessProducts();

      expect(result.length).toBeGreaterThan(0);
    });

    it("rejects anonymous users", async () => {
      const caller = appRouter.createCaller(createContext());
      await expect(caller.subscriber.earlyAccessProducts()).rejects.toThrow();
    });

    it("rejects free users", async () => {
      const caller = appRouter.createCaller(createContext("user"));
      await expect(caller.subscriber.earlyAccessProducts()).rejects.toThrow(
        /Subscriber access required/
      );
    });
  });

  describe("exclusiveChecklists (subscriber-gated)", () => {
    it("returns full checklist data for subscribers", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      const result = await caller.subscriber.exclusiveChecklists();

      expect(result.length).toBeGreaterThan(0);
      result.forEach((checklist) => {
        expect(checklist).toHaveProperty("tiers");
        expect(checklist).toHaveProperty("estimatedValueRange");
        expect(checklist).toHaveProperty("hitRatio");
        expect(checklist).toHaveProperty("description");
        expect(checklist).toHaveProperty("releaseDate");
        expect(checklist.tiers.length).toBeGreaterThan(0);
      });
    });

    it("rejects free users", async () => {
      const caller = appRouter.createCaller(createContext("user"));
      await expect(caller.subscriber.exclusiveChecklists()).rejects.toThrow(
        /Subscriber access required/
      );
    });

    it("rejects anonymous users", async () => {
      const caller = appRouter.createCaller(createContext());
      await expect(caller.subscriber.exclusiveChecklists()).rejects.toThrow();
    });
  });

  describe("checklistDetail (subscriber-gated)", () => {
    it("returns a specific checklist by ID for subscribers", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      const result = await caller.subscriber.checklistDetail({
        id: "snap-collection-preview",
      });

      expect(result).not.toBeNull();
      expect(result!.title).toContain("Snap Collection");
      expect(result!.cardCount).toBe(150);
      expect(result!.tiers.length).toBe(5);
    });

    it("returns null for non-existent checklist ID", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      const result = await caller.subscriber.checklistDetail({
        id: "non-existent-id",
      });

      expect(result).toBeNull();
    });

    it("rejects free users", async () => {
      const caller = appRouter.createCaller(createContext("user"));
      await expect(
        caller.subscriber.checklistDetail({ id: "snap-collection-preview" })
      ).rejects.toThrow(/Subscriber access required/);
    });
  });

  describe("benefits (public)", () => {
    it("returns benefits list for anonymous users", async () => {
      const caller = appRouter.createCaller(createContext());
      const result = await caller.subscriber.benefits();

      expect(result.benefits.length).toBe(6);
      result.benefits.forEach((benefit) => {
        expect(benefit).toHaveProperty("icon");
        expect(benefit).toHaveProperty("title");
        expect(benefit).toHaveProperty("description");
        expect(benefit.title.length).toBeGreaterThan(0);
        expect(benefit.description.length).toBeGreaterThan(0);
      });
    });

    it("includes expected benefit types", async () => {
      const caller = appRouter.createCaller(createContext());
      const result = await caller.subscriber.benefits();

      const titles = result.benefits.map((b) => b.title);
      expect(titles).toContain("48-Hour Early Access");
      expect(titles).toContain("Exclusive Pricing");
      expect(titles).toContain("Exclusive Checklists");
      expect(titles).toContain("Priority Drop Alerts");
    });
  });

  describe("subscriberProcedure middleware", () => {
    it("allows subscriber role through", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      // If this doesn't throw, the middleware passed
      const result = await caller.subscriber.earlyAccessProducts();
      expect(result).toBeDefined();
    });

    it("allows admin role through", async () => {
      const caller = appRouter.createCaller(createContext("admin"));
      const result = await caller.subscriber.earlyAccessProducts();
      expect(result).toBeDefined();
    });

    it("blocks free user role", async () => {
      const caller = appRouter.createCaller(createContext("user"));
      await expect(caller.subscriber.earlyAccessProducts()).rejects.toThrow(
        /Subscriber access required/
      );
    });

    it("blocks anonymous (no user)", async () => {
      const caller = appRouter.createCaller(createContext());
      await expect(caller.subscriber.earlyAccessProducts()).rejects.toThrow(
        /Subscriber access required/
      );
    });
  });

  describe("Data integrity", () => {
    it("subscriber prices are always less than regular prices", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      const products = await caller.subscriber.earlyAccessProducts();

      products.forEach((product) => {
        expect(product.subscriberPrice).toBeLessThan(product.price);
        expect(product.savings).toBe(product.price - product.subscriberPrice);
      });
    });

    it("subscriber launch dates are before public launch dates", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      const products = await caller.subscriber.earlyAccessProducts();

      products.forEach((product) => {
        const subDate = new Date(product.subscriberLaunchDate);
        const pubDate = new Date(product.publicLaunchDate);
        expect(subDate.getTime()).toBeLessThan(pubDate.getTime());
      });
    });

    it("all checklists have valid tier breakdowns", async () => {
      const caller = appRouter.createCaller(createContext("subscriber"));
      const checklists = await caller.subscriber.exclusiveChecklists();

      checklists.forEach((checklist) => {
        const tierTotal = checklist.tiers.reduce((sum, t) => sum + t.count, 0);
        expect(tierTotal).toBe(checklist.cardCount);
      });
    });
  });
});
