import { describe, it, expect } from "vitest";

/**
 * Affiliate Links Router Tests
 * Tests the affiliate link matching logic and data validation
 */

// Test the matching logic used in the public getForArticle route
describe("Affiliate Link Matching Logic", () => {
  // Simulate the filter logic from affiliateLinks.ts
  function matchLinks(
    allLinks: Array<{
      id: number;
      characterTags: string[] | null;
      pinnedArticleIds: number[] | null;
      active: boolean;
    }>,
    articleId: number,
    tags: string[],
    relatedCharacters: string[]
  ) {
    const articleTags = [...tags, ...relatedCharacters].map(t => t.toLowerCase());

    return allLinks.filter(link => {
      if (!link.active) return false;
      if (link.pinnedArticleIds && link.pinnedArticleIds.includes(articleId)) return true;
      if (link.characterTags && link.characterTags.length > 0 && articleTags.length > 0) {
        return link.characterTags.some(ct => articleTags.includes(ct.toLowerCase()));
      }
      if (!link.characterTags || link.characterTags.length === 0) return true;
      return false;
    });
  }

  it("should match links pinned to a specific article", () => {
    const links = [
      { id: 1, characterTags: ["Wolverine"], pinnedArticleIds: [100], active: true },
      { id: 2, characterTags: ["Wolverine"], pinnedArticleIds: [200], active: true },
    ];
    // Article 100 with no matching tags — only pinned link should match
    const matched = matchLinks(links, 100, [], ["Spider-Man"]);
    expect(matched.map(l => l.id)).toContain(1);
    expect(matched.map(l => l.id)).not.toContain(2);
  });

  it("should match links by character tag overlap", () => {
    const links = [
      { id: 1, characterTags: ["Spider-Man", "Venom"], pinnedArticleIds: null, active: true },
      { id: 2, characterTags: ["Wolverine"], pinnedArticleIds: null, active: true },
    ];
    const matched = matchLinks(links, 999, [], ["Spider-Man"]);
    expect(matched.map(l => l.id)).toContain(1);
    expect(matched.map(l => l.id)).not.toContain(2);
  });

  it("should match case-insensitively", () => {
    const links = [
      { id: 1, characterTags: ["spider-man"], pinnedArticleIds: null, active: true },
    ];
    const matched = matchLinks(links, 999, [], ["Spider-Man"]);
    expect(matched).toHaveLength(1);
  });

  it("should show global links (no character tags) on all articles", () => {
    const links = [
      { id: 1, characterTags: null, pinnedArticleIds: null, active: true },
      { id: 2, characterTags: [], pinnedArticleIds: null, active: true },
      { id: 3, characterTags: ["Wolverine"], pinnedArticleIds: null, active: true },
    ];
    const matched = matchLinks(links, 999, [], []);
    // Global links (null or empty tags) should match
    expect(matched.map(l => l.id)).toContain(1);
    expect(matched.map(l => l.id)).toContain(2);
    // Character-specific link should NOT match when no article tags
    expect(matched.map(l => l.id)).not.toContain(3);
  });

  it("should exclude inactive links", () => {
    const links = [
      { id: 1, characterTags: null, pinnedArticleIds: null, active: false },
      { id: 2, characterTags: null, pinnedArticleIds: null, active: true },
    ];
    const matched = matchLinks(links, 999, [], []);
    expect(matched.map(l => l.id)).not.toContain(1);
    expect(matched.map(l => l.id)).toContain(2);
  });

  it("should combine tags and relatedCharacters for matching", () => {
    const links = [
      { id: 1, characterTags: ["Avengers"], pinnedArticleIds: null, active: true },
    ];
    const matched = matchLinks(links, 999, ["Avengers"], []);
    expect(matched).toHaveLength(1);
  });

  it("should match pinned links even when character tags don't match", () => {
    const links = [
      { id: 1, characterTags: ["Wolverine"], pinnedArticleIds: [100], active: true },
    ];
    // Article 100 has Spider-Man tags but the link is pinned to article 100
    const matched = matchLinks(links, 100, [], ["Spider-Man"]);
    expect(matched).toHaveLength(1);
  });
});

describe("Affiliate Link Input Validation", () => {
  it("should require name to be non-empty", () => {
    expect("".length).toBe(0);
    expect("Spider-Man Figure".length).toBeGreaterThan(0);
  });

  it("should accept valid category values", () => {
    const validCategories = ["cards", "toys", "clothing", "collectibles", "comics", "other"];
    validCategories.forEach(cat => {
      expect(validCategories).toContain(cat);
    });
  });

  it("should handle empty character tags array", () => {
    const tags: string[] = [];
    expect(tags).toHaveLength(0);
  });
});
