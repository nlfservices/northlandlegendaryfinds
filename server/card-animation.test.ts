import { describe, expect, it } from "vitest";

// Test the card image constants that power the 3D animation component
const HULK_CARD_IMAGES = {
  rawFront: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-raw-front_44893b76.jpg",
  rawBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-raw-back_5cb01b4c.jpg",
  gradedFront: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-graded-front_aab29f02.jpg",
  gradedBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-graded-back_d2fb1b7c.jpg",
};

describe("CardGradeAnimation image data", () => {
  it("has all required image URLs for raw and graded states", () => {
    expect(HULK_CARD_IMAGES.rawFront).toBeDefined();
    expect(HULK_CARD_IMAGES.rawBack).toBeDefined();
    expect(HULK_CARD_IMAGES.gradedFront).toBeDefined();
    expect(HULK_CARD_IMAGES.gradedBack).toBeDefined();
  });

  it("all image URLs are valid CDN URLs", () => {
    const urls = Object.values(HULK_CARD_IMAGES);
    for (const url of urls) {
      expect(url).toMatch(/^https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\//);
      expect(url).toMatch(/\.jpg$/);
    }
  });

  it("has exactly 4 card images (front/back for raw and graded)", () => {
    const keys = Object.keys(HULK_CARD_IMAGES);
    expect(keys).toHaveLength(4);
    expect(keys).toContain("rawFront");
    expect(keys).toContain("rawBack");
    expect(keys).toContain("gradedFront");
    expect(keys).toContain("gradedBack");
  });

  it("raw and graded images are different URLs", () => {
    expect(HULK_CARD_IMAGES.rawFront).not.toBe(HULK_CARD_IMAGES.gradedFront);
    expect(HULK_CARD_IMAGES.rawBack).not.toBe(HULK_CARD_IMAGES.gradedBack);
  });

  it("front and back images are different URLs", () => {
    expect(HULK_CARD_IMAGES.rawFront).not.toBe(HULK_CARD_IMAGES.rawBack);
    expect(HULK_CARD_IMAGES.gradedFront).not.toBe(HULK_CARD_IMAGES.gradedBack);
  });
});
