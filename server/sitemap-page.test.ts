import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

describe("Site Map page support", () => {
  describe("blog.list (public articles for site map)", () => {
    it("returns an array of published blog posts", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const articles = await caller.blog.list({});

      expect(Array.isArray(articles)).toBe(true);
    });

    it("returns articles with required fields for site map display", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const articles = await caller.blog.list({});

      if (articles.length > 0) {
        const article = articles[0];
        // Every article should have these fields for the site map to render
        expect(article).toHaveProperty("id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("slug");
        expect(article).toHaveProperty("category");
      }
    });

    it("accepts optional category filter", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Should not throw when filtering by category
      const articles = await caller.blog.list({ category: "market_trends" });
      expect(Array.isArray(articles)).toBe(true);
    });

    it("accepts optional limit parameter", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const articles = await caller.blog.list({ limit: 5 });
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeLessThanOrEqual(5);
    });
  });
});
