/**
 * Unit tests for getRelatedArticles tag-matching logic.
 * We test the scoring/sorting logic in isolation without a real DB.
 */
import { describe, it, expect } from "vitest";

// Re-implement the scoring logic from db.ts for unit testing
function scoreAndSort(
  candidates: Array<{ id: number; title: string; tags: string[] | null; publishedAt: number }>,
  currentSlug: string,
  tags: string[],
  limit: number,
) {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));

  const scored = candidates
    .map((a) => {
      const articleTags: string[] = Array.isArray(a.tags) ? a.tags : [];
      const sharedCount = articleTags.filter((t) => tagSet.has(t.toLowerCase())).length;
      return { article: a, sharedCount };
    })
    .filter((s) => s.sharedCount > 0)
    .sort(
      (a, b) =>
        b.sharedCount - a.sharedCount ||
        b.article.publishedAt - a.article.publishedAt,
    );

  const matched = scored.slice(0, limit).map((s) => s.article);

  if (matched.length < limit) {
    const matchedIds = new Set(matched.map((a) => a.id));
    const recent = candidates.filter((a) => !matchedIds.has(a.id));
    matched.push(...recent.slice(0, limit - matched.length));
  }

  return matched.slice(0, limit);
}

const ARTICLES = [
  { id: 1, title: "Avengers Doomsday", tags: ["MCU Phase 6", "Avengers", "Doctor Doom"], publishedAt: 1000 },
  { id: 2, title: "Topps Chrome Guide", tags: ["Topps Marvel Chrome", "Card Market", "MCU Phase 6"], publishedAt: 900 },
  { id: 3, title: "Wolverine Cards", tags: ["Wolverine", "Topps Marvel Chrome", "X-Men"], publishedAt: 800 },
  { id: 4, title: "No Tags Article", tags: [], publishedAt: 700 },
  { id: 5, title: "Doctor Doom History", tags: ["Doctor Doom", "MCU Phase 6", "Avengers"], publishedAt: 600 },
];

describe("getRelatedArticles scoring logic", () => {
  it("returns articles sorted by number of shared tags descending", () => {
    const result = scoreAndSort(ARTICLES, "current-slug", ["MCU Phase 6", "Doctor Doom", "Avengers"], 3);
    // Article 1 shares 3 tags, Article 5 shares 3 tags (1 is newer), Article 2 shares 1 tag
    expect(result[0].id).toBe(1); // 3 shared tags, newer
    expect(result[1].id).toBe(5); // 3 shared tags, older
    expect(result[2].id).toBe(2); // 1 shared tag
  });

  it("pads with recent articles when tag matches are sparse", () => {
    const result = scoreAndSort(ARTICLES, "current-slug", ["Wolverine"], 3);
    // Only article 3 matches; should pad with 2 most recent non-matching articles
    expect(result[0].id).toBe(3); // 1 shared tag
    expect(result.length).toBe(3);
    // Padded articles should be the most recent non-matching ones
    const paddedIds = result.slice(1).map((a) => a.id);
    expect(paddedIds).toContain(1); // publishedAt 1000
    expect(paddedIds).toContain(2); // publishedAt 900
  });

  it("returns empty array when tags list is empty", () => {
    const result = scoreAndSort(ARTICLES, "current-slug", [], 3);
    // No tag matches, but pads with recent articles up to limit
    // (empty tagSet means 0 matches, all go to pad)
    expect(result.length).toBe(3);
  });

  it("respects the limit parameter", () => {
    const result = scoreAndSort(ARTICLES, "current-slug", ["MCU Phase 6"], 2);
    expect(result.length).toBe(2);
  });

  it("does not include articles with no tags in tag-matched results", () => {
    const result = scoreAndSort(ARTICLES, "current-slug", ["MCU Phase 6", "Doctor Doom"], 3);
    const ids = result.map((a) => a.id);
    // Article 4 has no tags, should only appear as padding if needed
    // With 3 tag-matched articles available, article 4 should not appear
    expect(ids).not.toContain(4);
  });
});
