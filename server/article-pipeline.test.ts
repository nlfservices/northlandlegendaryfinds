import { describe, it, expect } from "vitest";
import {
  ROTATION, SPECIALS, CONTRACTS,
  resolveNextTemplate, parseDocument, validateArticle,
  getContractSummary,
} from "./article-pipeline";

describe("article-pipeline", () => {
  describe("ROTATION", () => {
    it("has exactly 10 templates in order", () => {
      expect(ROTATION).toHaveLength(10);
      expect(ROTATION[0]).toBe("classic");
      expect(ROTATION[9]).toBe("comic_strip");
    });

    it("every rotation template has a contract", () => {
      for (const t of ROTATION) {
        expect(CONTRACTS[t]).toBeDefined();
        expect(CONTRACTS[t].h2Range).toHaveLength(2);
      }
    });
  });

  describe("SPECIALS", () => {
    it("has patriotic and collector_spotlight", () => {
      expect(SPECIALS).toContain("patriotic");
      expect(SPECIALS).toContain("collector_spotlight");
    });

    it("specials are NOT in the rotation array", () => {
      for (const s of SPECIALS) {
        expect(ROTATION).not.toContain(s);
      }
    });
  });

  describe("resolveNextTemplate", () => {
    it("returns classic when last is null (fresh start)", () => {
      const { name } = resolveNextTemplate(null);
      expect(name).toBe("classic");
    });

    it("returns magazine after classic", () => {
      const { name } = resolveNextTemplate("classic");
      expect(name).toBe("magazine");
    });

    it("wraps from comic_strip back to classic", () => {
      const { name } = resolveNextTemplate("comic_strip");
      expect(name).toBe("classic");
    });

    it("returns classic for unknown last template", () => {
      const { name } = resolveNextTemplate("nonexistent_template");
      expect(name).toBe("classic");
    });

    it("follows full rotation order", () => {
      let last: string | null = null;
      const sequence: string[] = [];
      for (let i = 0; i < 10; i++) {
        const { name } = resolveNextTemplate(last);
        sequence.push(name);
        last = name;
      }
      expect(sequence).toEqual([...ROTATION]);
    });

    it("cycles correctly after full rotation", () => {
      const { name } = resolveNextTemplate("comic_strip");
      expect(name).toBe("classic");
      const { name: second } = resolveNextTemplate("classic");
      expect(second).toBe("magazine");
    });
  });

  describe("parseDocument", () => {
    it("parses intro and H2 sections", () => {
      const md = `Intro paragraph here.

## Section One

Body of section one.

## Section Two

Body of section two.
`;
      const { intro, sections } = parseDocument(md);
      expect(intro.join("\n")).toContain("Intro paragraph");
      expect(sections).toHaveLength(2);
      expect(sections[0].heading).toBe("Section One");
      expect(sections[1].heading).toBe("Section Two");
    });

    it("detects inline images in sections", () => {
      const md = `## Hero Section

![Alt text](https://example.com/image.png)

Some text here.

## No Image Section

Just text.
`;
      const { sections } = parseDocument(md);
      expect(sections[0].images).toHaveLength(1);
      expect(sections[0].images[0]).toBe("https://example.com/image.png");
      expect(sections[1].images).toHaveLength(0);
    });

    it("counts blockquotes", () => {
      const md = `## Quotes Section

> This is a pull quote.

Normal text.

> Another pull quote.

## No Quotes

Just text.
`;
      const { sections } = parseDocument(md);
      expect(sections[0].blockquotes).toBe(2);
      expect(sections[1].blockquotes).toBe(0);
    });
  });

  describe("validateArticle", () => {
    const makeArticle = (sections: number, opts: {
      featuredImage?: string;
      imagesPerSection?: boolean;
      blockquotes?: number;
    } = {}) => {
      let md = "";
      for (let i = 0; i < sections; i++) {
        md += `## Section ${i + 1}\n\n`;
        if (opts.imagesPerSection) {
          md += `![img](https://example.com/img-${i}.png)\n\n`;
        }
        if (opts.blockquotes && i < opts.blockquotes) {
          md += `> Pull quote ${i + 1}\n\n`;
        }
        md += `Body text for section ${i + 1}.\n\n`;
      }
      return {
        contentMarkdown: md,
        featuredImageUrl: opts.featuredImage || null,
      };
    };

    it("passes a valid classic article", () => {
      const article = makeArticle(5, { featuredImage: "https://example.com/hero.png" });
      const result = validateArticle(article, "classic");
      expect(result.ok).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("fails classic without featured image", () => {
      const article = makeArticle(5);
      const result = validateArticle(article, "classic");
      expect(result.ok).toBe(false);
      expect(result.errors.some(e => e.includes("featured image"))).toBe(true);
    });

    it("fails when H2 count is below minimum", () => {
      const article = makeArticle(2, { featuredImage: "https://example.com/hero.png" });
      const result = validateArticle(article, "classic");
      expect(result.ok).toBe(false);
      expect(result.errors.some(e => e.includes("H2 count"))).toBe(true);
    });

    it("fails when H2 count is above maximum", () => {
      const article = makeArticle(12, { featuredImage: "https://example.com/hero.png" });
      const result = validateArticle(article, "listicle");
      expect(result.ok).toBe(false);
      expect(result.errors.some(e => e.includes("H2 count"))).toBe(true);
    });

    it("fails timeline without inline images per section", () => {
      const article = makeArticle(5);
      const result = validateArticle(article, "timeline");
      expect(result.ok).toBe(false);
      expect(result.errors.some(e => e.includes("inline image"))).toBe(true);
    });

    it("passes timeline with inline images per section", () => {
      const article = makeArticle(5, { imagesPerSection: true });
      const result = validateArticle(article, "timeline");
      expect(result.ok).toBe(true);
    });

    it("warns when timeline has featured image (stripped)", () => {
      const article = makeArticle(5, { imagesPerSection: true, featuredImage: "https://example.com/hero.png" });
      const result = validateArticle(article, "timeline");
      expect(result.ok).toBe(true);
      expect(result.warnings.some(w => w.includes("strips the hero image"))).toBe(true);
    });

    it("fails magazine without enough blockquotes", () => {
      const article = makeArticle(5, { featuredImage: "https://example.com/hero.png" });
      const result = validateArticle(article, "magazine");
      expect(result.ok).toBe(false);
      expect(result.errors.some(e => e.includes("blockquote"))).toBe(true);
    });

    it("passes magazine with enough blockquotes", () => {
      const article = makeArticle(5, { featuredImage: "https://example.com/hero.png", blockquotes: 2 });
      const result = validateArticle(article, "magazine");
      expect(result.ok).toBe(true);
    });

    it("detects duplicate images", () => {
      const md = `## Section 1

![img](https://example.com/same.png)

Text.

## Section 2

![img](https://example.com/same.png)

Text.

## Section 3

![img](https://example.com/unique.png)

Text.

## Section 4

![img](https://example.com/unique2.png)

Text.

## Section 5

![img](https://example.com/unique3.png)

Text.
`;
      const article = { contentMarkdown: md, featuredImageUrl: null };
      const result = validateArticle(article, "listicle");
      expect(result.ok).toBe(false);
      expect(result.errors.some(e => e.includes("Duplicate image"))).toBe(true);
    });

    it("fails for unknown template", () => {
      const article = makeArticle(5);
      const result = validateArticle(article, "nonexistent" as any);
      expect(result.ok).toBe(false);
      expect(result.errors[0]).toContain("Unknown template");
    });
  });

  describe("getContractSummary", () => {
    it("returns a human-readable summary for classic", () => {
      const summary = getContractSummary("classic");
      expect(summary).toContain("classic");
      expect(summary).toContain("Featured image: required");
      expect(summary).toContain("3–8");
    });

    it("returns unknown for invalid template", () => {
      const summary = getContractSummary("fake" as any);
      expect(summary).toContain("Unknown");
    });
  });
});
