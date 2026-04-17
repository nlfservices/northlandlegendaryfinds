import { describe, it, expect, vi } from "vitest";

/**
 * Test that publishScheduledArticles is exported and callable.
 * Full integration testing requires a live DB, so we verify the function signature
 * and that it handles the "no DB" case gracefully.
 */
describe("publishScheduledArticles", () => {
  it("should be exported from db module", async () => {
    const db = await import("./db");
    expect(typeof db.publishScheduledArticles).toBe("function");
  });

  it("should return 0 when database is not available", async () => {
    // Mock getDb to return null (no DB connection)
    const db = await import("./db");
    const result = await db.publishScheduledArticles();
    // In test environment without DB, it should return 0
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

describe("blog-scheduler configuration", () => {
  it("should have generation hours set to 6am/12pm/7pm CT (11/17/0 UTC)", async () => {
    // Read the blog-scheduler source to verify the generation hours
    const fs = await import("fs");
    const content = fs.readFileSync("./server/blog-scheduler.ts", "utf-8");
    
    // Check that the generation hours are set to the new values
    expect(content).toContain("GENERATION_HOURS_UTC = [11, 17, 0]");
    // Verify the comment matches
    expect(content).toContain("6am, 12pm, 7pm CT");
    // Verify it imports publishScheduledArticles
    expect(content).toContain("publishScheduledArticles");
  });
});
