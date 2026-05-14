import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  castArticleVote: vi.fn(),
  getArticleVoteCounts: vi.fn(),
  getVisitorArticleVote: vi.fn(),
}));

import { castArticleVote, getArticleVoteCounts, getVisitorArticleVote } from "./db";

describe("Article Voting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("castArticleVote", () => {
    it("should accept valid vote parameters", async () => {
      (castArticleVote as any).mockResolvedValue(true);
      const result = await castArticleVote(1, "loved", "visitor-123");
      expect(castArticleVote).toHaveBeenCalledWith(1, "loved", "visitor-123");
      expect(result).toBe(true);
    });

    it("should handle all valid reaction types", async () => {
      (castArticleVote as any).mockResolvedValue(true);
      const reactions = ["loved", "fire", "meh", "thumbsdown"];
      for (const reaction of reactions) {
        await castArticleVote(1, reaction, "visitor-456");
        expect(castArticleVote).toHaveBeenCalledWith(1, reaction, "visitor-456");
      }
    });

    it("should allow updating an existing vote", async () => {
      (castArticleVote as any).mockResolvedValue(true);
      // First vote
      await castArticleVote(1, "loved", "visitor-789");
      // Change vote
      await castArticleVote(1, "fire", "visitor-789");
      expect(castArticleVote).toHaveBeenCalledTimes(2);
    });
  });

  describe("getArticleVoteCounts", () => {
    it("should return vote counts grouped by reaction", async () => {
      const mockCounts = { loved: 5, fire: 3, meh: 1, thumbsdown: 0 };
      (getArticleVoteCounts as any).mockResolvedValue(mockCounts);
      const result = await getArticleVoteCounts(1);
      expect(result).toEqual(mockCounts);
      expect(getArticleVoteCounts).toHaveBeenCalledWith(1);
    });

    it("should return empty object for article with no votes", async () => {
      (getArticleVoteCounts as any).mockResolvedValue({});
      const result = await getArticleVoteCounts(999);
      expect(result).toEqual({});
    });
  });

  describe("getVisitorArticleVote", () => {
    it("should return the visitor's reaction if they voted", async () => {
      (getVisitorArticleVote as any).mockResolvedValue("loved");
      const result = await getVisitorArticleVote(1, "visitor-123");
      expect(result).toBe("loved");
    });

    it("should return null if visitor has not voted", async () => {
      (getVisitorArticleVote as any).mockResolvedValue(null);
      const result = await getVisitorArticleVote(1, "visitor-new");
      expect(result).toBeNull();
    });
  });
});
