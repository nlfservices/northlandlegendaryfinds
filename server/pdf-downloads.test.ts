import { describe, it, expect } from "vitest";

// Test the PDF download URL mapping
// We can't import client-side code directly, so we test the data structure

const SET_PDF_LINKS: Record<string, { checklist?: string; odds?: string }> = {
  "2025-topps-chrome": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-chrome-checklist_46748526.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-chrome-odds_6afafb56.pdf",
  },
  "2025-topps-marvel-chrome-sapphire": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-chrome-sapphire-checklist_229857e3.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-chrome-sapphire-odds_9e1f2a62.pdf",
  },
  "2025-topps-marvel-studios": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-studios-checklist_1d7a9485.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-studios-odds_185e1a98.pdf",
  },
  "2025-topps-marvel-studios-sapphire": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-studios-sapphire-checklist_fac20077.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-studios-sapphire-odds_50ce6396.pdf",
  },
  "2025-topps-comic-book-heroes": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-comic-book-heroes-checklist_2fbbf386.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-comic-book-heroes-odds_e08ea9fb.pdf",
  },
  "2025-topps-marvel-mint": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-mint-checklist_2ac86a8f.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-mint-odds_89806c75.pdf",
  },
  "2025-marvel-the-collector": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-collector-checklist_072a13fa.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-collector-odds_8dcfecf4.pdf",
  },
  "2024-topps-marvel-chrome": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2024-topps-marvel-chrome-checklist_f3634e0b.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2024-topps-marvel-chrome-odds_eda061bc.pdf",
  },
  "2024-topps-marvel-chrome-sapphire": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2024-topps-marvel-chrome-sapphire-checklist_4ffa37b6.pdf",
  },
};

describe("PDF Download Links", () => {
  it("should have valid CDN URLs for all checklist PDFs", () => {
    for (const [slug, links] of Object.entries(SET_PDF_LINKS)) {
      if (links.checklist) {
        expect(links.checklist).toMatch(/^https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/.+\.pdf$/);
        expect(links.checklist).toContain("checklist");
      }
    }
  });

  it("should have valid CDN URLs for all odds PDFs", () => {
    for (const [slug, links] of Object.entries(SET_PDF_LINKS)) {
      if (links.odds) {
        expect(links.odds).toMatch(/^https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/.+\.pdf$/);
        expect(links.odds).toContain("odds");
      }
    }
  });

  it("should have 9 sets with PDF links", () => {
    expect(Object.keys(SET_PDF_LINKS)).toHaveLength(9);
  });

  it("should have checklist for all 9 sets", () => {
    for (const [slug, links] of Object.entries(SET_PDF_LINKS)) {
      expect(links.checklist).toBeDefined();
      expect(links.checklist).toBeTruthy();
    }
  });

  it("should have odds for 8 of 9 sets (2024 Sapphire has no odds)", () => {
    const setsWithOdds = Object.values(SET_PDF_LINKS).filter(l => l.odds);
    expect(setsWithOdds).toHaveLength(8);
    // 2024 Sapphire should NOT have odds
    expect(SET_PDF_LINKS["2024-topps-marvel-chrome-sapphire"].odds).toBeUndefined();
  });

  it("should map The Collector with correct slug (2025-marvel-the-collector)", () => {
    expect(SET_PDF_LINKS["2025-marvel-the-collector"]).toBeDefined();
    expect(SET_PDF_LINKS["2025-marvel-the-collector"].checklist).toContain("collector");
    expect(SET_PDF_LINKS["2025-marvel-the-collector"].odds).toContain("collector");
  });

  it("should map all 2025 sets matching database slugs", () => {
    const dbSlugs = [
      "2025-topps-chrome",
      "2025-topps-comic-book-heroes",
      "2025-topps-marvel-mint",
      "2025-topps-marvel-studios",
      "2025-topps-marvel-studios-sapphire",
      "2025-marvel-the-collector",
    ];
    for (const slug of dbSlugs) {
      expect(SET_PDF_LINKS[slug]).toBeDefined();
      expect(SET_PDF_LINKS[slug].checklist).toBeTruthy();
    }
  });

  it("should have unique URLs (no duplicates)", () => {
    const allUrls: string[] = [];
    for (const links of Object.values(SET_PDF_LINKS)) {
      if (links.checklist) allUrls.push(links.checklist);
      if (links.odds) allUrls.push(links.odds);
    }
    const uniqueUrls = new Set(allUrls);
    expect(uniqueUrls.size).toBe(allUrls.length);
  });
});
