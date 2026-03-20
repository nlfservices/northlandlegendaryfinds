import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
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
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createAnonContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

const sampleArticle = {
  title: "Test Article: Doomsday Update",
  slug: "test-article-doomsday-update",
  excerpt: "A test article about Doomsday",
  contentMarkdown: "## Test Content\n\nThis is test content for the article system.",
  category: "movie_news" as const,
  tags: ["Doomsday", "Test"],
  cardMarketImpact: "Test cards trending upward",
  relatedCharacters: ["Doctor Doom", "Iron Man"],
  sources: [{ title: "Test Source", url: "https://example.com" }],
  isFeatured: false,
  isPublished: true,
  authorName: "NLF Team",
};

describe("articles - admin procedures", () => {
  it("admin can create an article", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.adminArticles.create(sampleArticle);
    expect(result).toEqual({ success: true });
  });

  it("admin can list all articles", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const articles = await caller.adminArticles.list();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);
  });

  it("regular user cannot create articles", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.adminArticles.create(sampleArticle)).rejects.toThrow();
  });

  it("anonymous user cannot create articles", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    await expect(caller.adminArticles.create(sampleArticle)).rejects.toThrow();
  });

  it("regular user cannot list admin articles", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.adminArticles.list()).rejects.toThrow();
  });

  it("admin can toggle article featured status", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const articles = await caller.adminArticles.list();
    const article = articles.find((a: any) => a.slug === "test-article-doomsday-update") || articles[0];
    if (article) {
      const result = await caller.adminArticles.toggleFeatured({ id: article.id });
      expect(result).toEqual({ success: true });
    }
  });

  it("admin can toggle article published status", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const articles = await caller.adminArticles.list();
    const article = articles.find((a: any) => a.slug === "test-article-doomsday-update") || articles[0];
    if (article) {
      const result = await caller.adminArticles.togglePublished({ id: article.id });
      expect(result).toEqual({ success: true });
    }
  });

  it("admin can update an article", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const articles = await caller.adminArticles.list();
    const article = articles.find((a: any) => a.slug === "test-article-doomsday-update") || articles[0];
    if (article) {
      const result = await caller.adminArticles.update({
        id: article.id,
        data: { title: "Updated Test Article Title" },
      });
      expect(result).toEqual({ success: true });
    }
  });

  it("regular user cannot update articles", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.adminArticles.update({ id: 1, data: { title: "Hacked" } })
    ).rejects.toThrow();
  });

  it("regular user cannot delete articles", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.adminArticles.delete({ id: 1 })).rejects.toThrow();
  });

  it("regular user cannot toggle featured", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.adminArticles.toggleFeatured({ id: 1 })).rejects.toThrow();
  });

  it("regular user cannot toggle published", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.adminArticles.togglePublished({ id: 1 })).rejects.toThrow();
  });
});

describe("articles - public procedures", () => {
  it("anyone can list published articles", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    const articles = await caller.articles.list();
    expect(Array.isArray(articles)).toBe(true);
    // All returned articles should be published
    articles.forEach((a: any) => {
      expect(a.isPublished).toBe(true);
    });
  });

  it("anyone can list featured articles", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    const articles = await caller.articles.featured();
    expect(Array.isArray(articles)).toBe(true);
    articles.forEach((a: any) => {
      expect(a.isFeatured).toBe(true);
      expect(a.isPublished).toBe(true);
    });
  });

  it("anyone can filter articles by category", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    const articles = await caller.articles.list({ category: "movie_news" });
    expect(Array.isArray(articles)).toBe(true);
    articles.forEach((a: any) => {
      expect(a.category).toBe("movie_news");
      expect(a.isPublished).toBe(true);
    });
  });

  it("anyone can get an article by slug", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    // Use one of the seeded articles
    const articles = await caller.articles.list();
    if (articles.length > 0) {
      const article = await caller.articles.getBySlug({ slug: articles[0].slug });
      expect(article).toBeDefined();
      expect(article?.title).toBeTruthy();
      expect(article?.contentMarkdown).toBeTruthy();
    }
  });

  it("returns null for non-existent slug", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    const article = await caller.articles.getBySlug({ slug: "non-existent-article-slug-12345" });
    expect(article).toBeNull();
  });

  it("article list respects limit parameter", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    const articles = await caller.articles.list({ limit: 2 });
    expect(articles.length).toBeLessThanOrEqual(2);
  });
});

describe("articles - data integrity", () => {
  it("articles have required fields", async () => {
    const caller = appRouter.createCaller(createAnonContext());
    const articles = await caller.articles.list();
    articles.forEach((a: any) => {
      expect(a.title).toBeTruthy();
      expect(a.slug).toBeTruthy();
      expect(a.contentMarkdown).toBeTruthy();
      expect(a.category).toBeTruthy();
      expect(a.authorName).toBeTruthy();
    });
  });

  it("admin create requires title and content", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminArticles.create({
        ...sampleArticle,
        title: "",
      })
    ).rejects.toThrow();
    await expect(
      caller.adminArticles.create({
        ...sampleArticle,
        contentMarkdown: "",
      })
    ).rejects.toThrow();
  });

  it("admin create requires valid category", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminArticles.create({
        ...sampleArticle,
        category: "invalid_category" as any,
      })
    ).rejects.toThrow();
  });
});

describe("articles - cleanup", () => {
  it("admin can delete the test article", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const articles = await caller.adminArticles.list();
    const testArticle = articles.find((a: any) => a.slug === "test-article-doomsday-update");
    if (testArticle) {
      const result = await caller.adminArticles.delete({ id: testArticle.id });      expect(result).toEqual({ success: true });
    }
  });
});
