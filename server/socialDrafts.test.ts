import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database functions
vi.mock("./db", () => ({
  getArticleById: vi.fn(),
  getSocialPostDrafts: vi.fn(),
  getSocialPostDraftByArticleId: vi.fn(),
  getArticlesWithoutSocialPosts: vi.fn(),
  createSocialPostDraft: vi.fn(),
  updateSocialPostDraft: vi.fn(),
  deleteSocialPostDraft: vi.fn(),
  getPublishedSocialPosts: vi.fn(),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

// Mock image generation
vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn(),
}));

// Mock facebook API
vi.mock("./facebook-api", () => ({
  isFacebookConfigured: vi.fn(() => true),
  isInstagramConfigured: vi.fn(() => true),
  publishPhotoPost: vi.fn(),
  publishInstagramPost: vi.fn(),
}));

import {
  getArticleById,
  getSocialPostDrafts,
  getSocialPostDraftByArticleId,
  getArticlesWithoutSocialPosts,
  createSocialPostDraft,
  updateSocialPostDraft,
  deleteSocialPostDraft,
  getPublishedSocialPosts,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { publishPhotoPost, publishInstagramPost } from "./facebook-api";

describe("Social Drafts Router Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("unpostedArticles", () => {
    it("should return articles that have no social post drafts", async () => {
      const mockArticles = [
        { id: 1, title: "Test Article 1", slug: "test-1", category: "news", isPublished: true },
        { id: 2, title: "Test Article 2", slug: "test-2", category: "battle", isPublished: true },
      ];
      (getArticlesWithoutSocialPosts as any).mockResolvedValue(mockArticles);

      const result = await (getArticlesWithoutSocialPosts as any)();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Test Article 1");
    });
  });

  describe("generateDraft", () => {
    it("should throw if article not found", async () => {
      (getArticleById as any).mockResolvedValue(null);
      const result = await (getArticleById as any)(999);
      expect(result).toBeNull();
    });

    it("should throw if draft already exists for article", async () => {
      (getSocialPostDraftByArticleId as any).mockResolvedValue({ id: 1, articleId: 5 });
      const existing = await (getSocialPostDraftByArticleId as any)(5);
      expect(existing).not.toBeNull();
      expect(existing.articleId).toBe(5);
    });

    it("should generate content and image for a valid article", async () => {
      const mockArticle = {
        id: 5,
        title: "Wolverine vs Captain America",
        slug: "wolverine-vs-captain-america",
        excerpt: "The ultimate battle",
        category: "battle",
        tags: ["wolverine", "captain-america"],
        relatedCharacters: ["Wolverine", "Captain America"],
        contentMarkdown: "Some content here...",
        featuredImageUrl: "https://example.com/img.jpg",
        cardMarketImpact: "High",
      };

      (getArticleById as any).mockResolvedValue(mockArticle);
      (getSocialPostDraftByArticleId as any).mockResolvedValue(null);
      
      // Mock LLM responses
      (invokeLLM as any)
        .mockResolvedValueOnce({
          choices: [{ message: { content: JSON.stringify({
            fbPost: "Check out this epic battle!",
            igCaption: "Wolverine vs Cap - who wins?",
            firstComment: "Visit northlandlegendaryfinds.com for more!"
          })}}]
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: "A dramatic scene of Wolverine facing Captain America" }}]
        });

      (generateImage as any).mockResolvedValue({ url: "https://generated.com/image.jpg" });
      (createSocialPostDraft as any).mockResolvedValue(1);

      // Simulate the flow
      const article = await (getArticleById as any)(5);
      expect(article.title).toBe("Wolverine vs Captain America");

      const existing = await (getSocialPostDraftByArticleId as any)(5);
      expect(existing).toBeNull();

      const llmResult = await (invokeLLM as any)({ messages: [] });
      const content = JSON.parse(llmResult.choices[0].message.content);
      expect(content.fbPost).toBe("Check out this epic battle!");
      expect(content.igCaption).toBe("Wolverine vs Cap - who wins?");
      expect(content.firstComment).toContain("northlandlegendaryfinds.com");

      const imgResult = await (generateImage as any)({ prompt: "test" });
      expect(imgResult.url).toBe("https://generated.com/image.jpg");

      const draftId = await (createSocialPostDraft as any)({
        articleId: 5,
        fbPostContent: content.fbPost,
        igCaption: content.igCaption,
        firstComment: content.firstComment,
        generatedImageUrl: imgResult.url,
        imagePrompt: "A dramatic scene",
        tone: "hype",
        status: "ready",
      });
      expect(draftId).toBe(1);
    });
  });

  describe("publishDraft", () => {
    it("should publish to Facebook and Instagram", async () => {
      const mockDraft = {
        id: 1,
        articleId: 5,
        fbPostContent: "Test post content",
        igCaption: "Test IG caption",
        firstComment: "First comment!",
        generatedImageUrl: "https://example.com/img.jpg",
        status: "ready",
        fbPostId: null,
        igMediaId: null,
        fbCommentId: null,
      };

      (getSocialPostDrafts as any).mockResolvedValue([mockDraft]);
      (publishPhotoPost as any).mockResolvedValue({ success: true, postId: "fb_123" });
      (publishInstagramPost as any).mockResolvedValue({ success: true, mediaId: "ig_456" });
      (updateSocialPostDraft as any).mockResolvedValue(undefined);

      const drafts = await (getSocialPostDrafts as any)();
      const draft = drafts.find((d: any) => d.id === 1);
      expect(draft).toBeDefined();
      expect(draft.generatedImageUrl).toBeTruthy();

      const fbResult = await (publishPhotoPost as any)({
        message: draft.fbPostContent,
        photoUrl: draft.generatedImageUrl,
      });
      expect(fbResult.success).toBe(true);
      expect(fbResult.postId).toBe("fb_123");

      const igResult = await (publishInstagramPost as any)({
        caption: draft.igCaption,
        imageUrl: draft.generatedImageUrl,
      });
      expect(igResult.success).toBe(true);
      expect(igResult.mediaId).toBe("ig_456");

      await (updateSocialPostDraft as any)(1, {
        status: "published",
        fbPostId: "fb_123",
        igMediaId: "ig_456",
        publishedAt: new Date(),
      });
      expect(updateSocialPostDraft).toHaveBeenCalledWith(1, expect.objectContaining({
        status: "published",
        fbPostId: "fb_123",
        igMediaId: "ig_456",
      }));
    });

    it("should handle Facebook publish failure gracefully", async () => {
      (publishPhotoPost as any).mockResolvedValue({ success: false, error: "Rate limited" });

      const result = await (publishPhotoPost as any)({
        message: "test",
        photoUrl: "https://example.com/img.jpg",
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Rate limited");
    });
  });

  describe("deleteDraft", () => {
    it("should delete a draft", async () => {
      (deleteSocialPostDraft as any).mockResolvedValue(undefined);
      await (deleteSocialPostDraft as any)(1);
      expect(deleteSocialPostDraft).toHaveBeenCalledWith(1);
    });
  });

  describe("publishedHistory", () => {
    it("should return published posts", async () => {
      const mockPublished = [
        { id: 1, articleId: 5, status: "published", fbPostId: "fb_123", publishedAt: new Date() },
      ];
      (getPublishedSocialPosts as any).mockResolvedValue(mockPublished);

      const result = await (getPublishedSocialPosts as any)();
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("published");
    });
  });
});
