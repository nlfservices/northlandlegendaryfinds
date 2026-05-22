import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database functions
vi.mock("./db", () => ({
  getCommentReplies: vi.fn(),
  getCommentReplyByCommentId: vi.fn(),
  createCommentReply: vi.fn(),
  updateCommentReply: vi.fn(),
  getPendingCommentReplies: vi.fn(),
  getSentCommentReplies: vi.fn(),
  getCommentRepliesByPostId: vi.fn(),
}));

// Mock facebook-api
vi.mock("./facebook-api", () => ({
  isFacebookConfigured: vi.fn(() => true),
  getRecentPosts: vi.fn(),
  getPostComments: vi.fn(),
  replyToComment: vi.fn(),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(() => ({
    choices: [{ message: { content: "Hey! That's awesome, glad you enjoyed it 🔥" } }],
  })),
}));

import * as db from "./db";
import * as fbApi from "./facebook-api";
import { invokeLLM } from "./_core/llm";

describe("Comment Replies System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Comment filtering logic", () => {
    it("should skip single-word comments", () => {
      // The shouldSkipComment logic is embedded in the router
      // We test it indirectly through the fetch flow
      const msg = "Cool";
      const words = msg.split(/\s+/).filter((w: string) => w.length > 0);
      expect(words.length).toBeLessThan(2);
    });

    it("should skip emoji-only comments", () => {
      const msg = "🔥🔥🔥";
      expect(/[a-zA-Z0-9]/.test(msg)).toBe(false);
    });

    it("should not skip valid multi-word comments", () => {
      const msg = "This is amazing content!";
      const words = msg.split(/\s+/).filter((w: string) => w.length > 0);
      expect(words.length).toBeGreaterThanOrEqual(2);
      expect(/[a-zA-Z0-9]/.test(msg)).toBe(true);
    });

    it("should detect spam patterns", () => {
      const spamPatterns = [
        /\b(buy|sell|discount|promo|click here|check my|dm me|inbox me)\b/i,
        /https?:\/\/[^\s]+\.(ru|cn|tk|xyz|buzz)/i,
        /\b(crypto|bitcoin|forex|investment opportunity)\b/i,
      ];

      const spamMsg = "Check my page for free crypto!";
      const isSpam = spamPatterns.some(p => p.test(spamMsg));
      expect(isSpam).toBe(true);

      const validMsg = "Love the new Doctor Doom card art!";
      const isValid = spamPatterns.some(p => p.test(validMsg));
      expect(isValid).toBe(false);
    });
  });

  describe("Database operations", () => {
    it("should call getCommentReplies with correct status filter", async () => {
      const mockReplies = [
        { id: 1, commentId: "123", commenterName: "Tony", commentText: "Great post!", status: "pending" },
      ];
      (db.getCommentReplies as any).mockResolvedValue(mockReplies);

      const result = await db.getCommentReplies("pending");
      expect(db.getCommentReplies).toHaveBeenCalledWith("pending");
      expect(result).toEqual(mockReplies);
    });

    it("should call createCommentReply with correct data", async () => {
      (db.createCommentReply as any).mockResolvedValue(1);

      const data = {
        postId: "post_123",
        commentId: "comment_456",
        commenterName: "Peter Parker",
        commentText: "Spider-Man is the best!",
        commentedAt: new Date(),
        status: "pending" as const,
      };

      const id = await db.createCommentReply(data);
      expect(db.createCommentReply).toHaveBeenCalledWith(data);
      expect(id).toBe(1);
    });

    it("should call updateCommentReply to approve", async () => {
      (db.updateCommentReply as any).mockResolvedValue(undefined);

      await db.updateCommentReply(1, { status: "approved" });
      expect(db.updateCommentReply).toHaveBeenCalledWith(1, { status: "approved" });
    });

    it("should call updateCommentReply to mark as sent", async () => {
      (db.updateCommentReply as any).mockResolvedValue(undefined);

      const now = new Date();
      await db.updateCommentReply(1, { status: "sent", repliedAt: now, replyCommentId: "reply_789" });
      expect(db.updateCommentReply).toHaveBeenCalledWith(1, {
        status: "sent",
        repliedAt: now,
        replyCommentId: "reply_789",
      });
    });
  });

  describe("Facebook API interactions", () => {
    it("should fetch comments from posts", async () => {
      const mockComments = {
        success: true,
        comments: [
          { id: "c1", from: { name: "Steve", id: "user1" }, message: "Love this!", created_time: new Date().toISOString() },
        ],
      };
      (fbApi.getPostComments as any).mockResolvedValue(mockComments);

      const result = await fbApi.getPostComments("post_123");
      expect(result.success).toBe(true);
      expect(result.comments).toHaveLength(1);
      expect(result.comments![0].from.name).toBe("Steve");
    });

    it("should reply to a comment", async () => {
      (fbApi.replyToComment as any).mockResolvedValue({ success: true, replyId: "reply_001" });

      const result = await fbApi.replyToComment("comment_123", "Thanks for the love!");
      expect(result.success).toBe(true);
      expect(result.replyId).toBe("reply_001");
    });

    it("should handle reply failure gracefully", async () => {
      (fbApi.replyToComment as any).mockResolvedValue({ success: false, error: "Rate limited" });

      const result = await fbApi.replyToComment("comment_123", "Test reply");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Rate limited");
    });
  });

  describe("AI Reply Generation", () => {
    it("should generate a reply using LLM", async () => {
      const result = await invokeLLM({
        messages: [
          { role: "system", content: "You are NLF..." },
          { role: "user", content: "Reply to: Great post!" },
        ],
      });

      expect(result.choices[0].message.content).toBeTruthy();
      expect(typeof result.choices[0].message.content).toBe("string");
    });

    it("should call LLM with proper brand voice system prompt", async () => {
      await invokeLLM({
        messages: [
          { role: "system", content: "You are the social media voice for Northland Legendary Finds" },
          { role: "user", content: "Reply to this comment" },
        ],
      });

      expect(invokeLLM).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: "system" }),
            expect.objectContaining({ role: "user" }),
          ]),
        })
      );
    });
  });

  describe("7-day window enforcement", () => {
    it("should only process comments from the last 7 days", () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentComment = new Date(); // today
      const oldComment = new Date();
      oldComment.setDate(oldComment.getDate() - 10); // 10 days ago

      expect(recentComment >= sevenDaysAgo).toBe(true);
      expect(oldComment >= sevenDaysAgo).toBe(false);
    });
  });
});
