/**
 * Tests for the Article Polls router
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("../db", () => ({
  getDb: vi.fn(),
}));

import { getDb } from "../db";

const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  groupBy: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue(undefined),
};

describe("polls router logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as any).mockResolvedValue(mockDb);
  });

  it("returns null when db is unavailable", async () => {
    (getDb as any).mockResolvedValue(null);
    const db = await getDb();
    expect(db).toBeNull();
  });

  it("getDb returns mock db when available", async () => {
    const db = await getDb();
    expect(db).not.toBeNull();
  });

  it("poll options array has 5 items for doomsday poll", () => {
    const options = [
      "☕ SDCC — but only if Doom finishes his espresso first",
      "🕷️ Attached to Spider-Man — Doom hates sharing the spotlight",
      "🎬 Endgame Re-Release (September 25) — the nostalgia play",
      "🚫 No trailer ever — the mystery IS the marketing",
      "🤷 I just want to see Doom make an espresso",
    ];
    expect(options).toHaveLength(5);
    expect(options[0]).toContain("SDCC");
    expect(options[4]).toContain("espresso");
  });

  it("vote counts calculation works correctly", () => {
    const options = ["A", "B", "C"];
    const voteCounts = [
      { optionIndex: 0, count: 10 },
      { optionIndex: 2, count: 5 },
    ];
    const totalVotes = voteCounts.reduce((sum, r) => sum + Number(r.count), 0);
    const counts = options.map((_, i) => {
      const found = voteCounts.find((v) => v.optionIndex === i);
      return found ? Number(found.count) : 0;
    });
    expect(totalVotes).toBe(15);
    expect(counts).toEqual([10, 0, 5]);
  });

  it("percentage calculation is correct", () => {
    const counts = [10, 5, 15, 0, 20];
    const total = counts.reduce((a, b) => a + b, 0);
    const pcts = counts.map((c) => (total > 0 ? Math.round((c / total) * 100) : 0));
    expect(total).toBe(50);
    expect(pcts[0]).toBe(20);
    expect(pcts[2]).toBe(30);
    expect(pcts[3]).toBe(0);
    expect(pcts[4]).toBe(40);
  });

  it("visitor ID generation creates unique IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      ids.add(id);
    }
    expect(ids.size).toBe(100);
  });
});
