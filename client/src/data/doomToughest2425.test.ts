import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  DOOM_CHARACTER_PATH,
  DOOM_HISTORY_PATH,
  DOOM_TOUGHEST_JSON_PATH,
  DOOM_TOUGHEST_PATH,
  DOOM_TOUGHEST_SEED,
  DOOM_TOUGHEST_SLUG,
  NLF_INVENTORY_CTA,
  NLF_INVENTORY_PATH,
  hasCardImage,
  nlfInventoryHref,
  rankLabel,
} from "./doomToughest2425";

const here = dirname(fileURLToPath(import.meta.url));
const page = readFileSync(resolve(here, "../pages/DoomToughest2425Page.tsx"), "utf8");
const loader = readFileSync(resolve(here, "./doomToughest2425.ts"), "utf8");
const app = readFileSync(resolve(here, "../App.tsx"), "utf8");
const siteMap = readFileSync(resolve(here, "../pages/SiteMap.tsx"), "utf8");
const xmlSitemap = readFileSync(resolve(here, "../../../server/sitemap.ts"), "utf8");
const jsonText = readFileSync(resolve(here, "../../public/data/doom/toughest-24-25.json"), "utf8");

const MARKET = {
  "mfq-dnsg": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+MFQ-DNSG+Doctor+Doom+Silver+Surfer+Galactus+Namor+Orange+Wave+%2F25&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+MFQ-DNSG+Doctor+Doom+Silver+Surfer+Galactus+Namor+Orange+Wave+%2F25&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2026+Topps+Chrome+Marvel+MFQ-DNSG+Doctor+Doom+Silver+Surfer+Galactus+Namor+Orange+Wave+%2F25",
  },
  "fy-05": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+FY-05+Doctor+Doom+65+Fantastic+Years+Orange+Wave+%2F25&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+FY-05+Doctor+Doom+65+Fantastic+Years+Orange+Wave+%2F25&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2026+Topps+Chrome+Marvel+FY-05+Doctor+Doom+65+Fantastic+Years+Orange+Wave+%2F25",
  },
  "cbh-4": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Topps+Marvel+Comic+Book+Heroes+%234+Doctor+Doom+1975+Gold+Flake+Shimmer+%2F24&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Topps+Marvel+Comic+Book+Heroes+%234+Doctor+Doom+1975+Gold+Flake+Shimmer+%2F24&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2025+Topps+Marvel+Comic+Book+Heroes+%234+Doctor+Doom+1975+Gold+Flake+Shimmer+%2F24",
  },
  "cbh-35": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Topps+Marvel+Comic+Book+Heroes+%2335+Doctor+Doom+1976+Gold+Flake+Shimmer+%2F24&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Topps+Marvel+Comic+Book+Heroes+%2335+Doctor+Doom+1976+Gold+Flake+Shimmer+%2F24&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2025+Topps+Marvel+Comic+Book+Heroes+%2335+Doctor+Doom+1976+Gold+Flake+Shimmer+%2F24",
  },
  "cbh-115": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Topps+Marvel+Comic+Book+Heroes+%23115+Doctor+Doom+2025+Gold+Flake+Shimmer+%2F24&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Topps+Marvel+Comic+Book+Heroes+%23115+Doctor+Doom+2025+Gold+Flake+Shimmer+%2F24&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2025+Topps+Marvel+Comic+Book+Heroes+%23115+Doctor+Doom+2025+Gold+Flake+Shimmer+%2F24",
  },
} as const;

function wordCount(text: string): number {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]+\}/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

describe("Doctor Doom toughest /24 & /25 seed", () => {
  it("keeps packet SEO, slug, and intro beats", () => {
    expect(DOOM_TOUGHEST_SEED.seo.slug).toBe(DOOM_TOUGHEST_SLUG);
    expect(DOOM_TOUGHEST_SEED.seo.title).toBe(
      "Toughest Doctor Doom /24 & /25 Topps Marvel Cards | NLF"
    );
    expect(DOOM_TOUGHEST_SEED.seo.meta).toBe(
      "Which Doctor Doom /24 and /25 Topps Marvel cards are hardest to pull? Compare serial populations, published pack odds, estimated specific-card odds, and current marketplace availability."
    );
    expect(DOOM_TOUGHEST_SEED.seo.h1).toBe(
      "The Toughest Doctor Doom /24 & /25 Topps Marvel Cards to Pull"
    );
    expect(DOOM_TOUGHEST_SEED.seo.chips).toEqual([
      "Doctor Doom",
      "Topps Marvel",
      "Card Research",
      "Rarity Research",
    ]);
    expect(DOOM_TOUGHEST_SEED.intro.beats.join(" ")).toMatch(/population ≠ pull difficulty/);
    expect(DOOM_TOUGHEST_SEED.intro.beats.join(" ")).toMatch(/Doom 2099 · Doomasaur · Victorious · Victor Timely/);
  });

  it("ranks MFQ #1 with Official Quad Facsimile family 1:28,784 Hobby", () => {
    const mfq = DOOM_TOUGHEST_SEED.cards.find((card) => card.id === "mfq-dnsg");
    const row = DOOM_TOUGHEST_SEED.rankings[0];
    expect(mfq).toMatchObject({
      rank: 1,
      year: 2026,
      set: "2026 Topps Chrome Marvel Comics",
      cardNumber: "MFQ-DNSG",
      name: "Doom/Surfer/Galactus/Namor Quad Facsimile",
      parallel: "Orange Wave Refractor",
      serial: "/25",
      pop: 25,
      publishedOdds: "1:28,784 Hobby",
      specificOdds: "≈1:57,568 Hobby",
      oddsType: "official-family",
      confidence: "Official",
      multiCharacter: true,
    });
    expect(mfq?.notes).toMatch(/Marvel Quad Facsimile Autographs family/);
    expect(mfq?.notes).toMatch(/1:28,784 × 2/);
    expect(mfq?.footnote).toBe(
      "Base Orange Wave Refractor /25 is Official 1:295 Hobby — different family; do not use 1:295 for MFQ."
    );
    expect(row.rank).toBe(1);
    expect(row.publishedOdds).toBe("1:28,784 Hobby");
    expect(row.confidence).toBe("Official");
    expect(row.specificOdds).toBe("≈1:57,568 Hobby");
  });

  it("does not call 1:28,784 Official Orange Wave or use 1:295 for MFQ ranking", () => {
    const mfq = DOOM_TOUGHEST_SEED.cards.find((card) => card.id === "mfq-dnsg");
    expect(mfq?.publishedOdds).not.toMatch(/Official Orange Wave/i);
    expect(jsonText).not.toMatch(/Official Orange Wave/i);
    expect(page).not.toMatch(/Official Orange Wave/i);
    expect(mfq?.publishedOdds).not.toContain("1:295");
    expect(DOOM_TOUGHEST_SEED.rankings[0].publishedOdds).not.toContain("1:295");
    expect(mfq?.footnote).toMatch(/1:295 Hobby — different family/);
  });

  it("keeps FY-05 and the three tied CBH Gold Flake /24 packet facts", () => {
    const fy = DOOM_TOUGHEST_SEED.cards.find((card) => card.id === "fy-05");
    const cbh = DOOM_TOUGHEST_SEED.cards.filter((card) => card.id.startsWith("cbh-"));
    expect(fy).toMatchObject({
      rank: 2,
      cardNumber: "FY-05",
      name: "Doctor Doom 65 Fantastic Years",
      parallel: "Orange Wave Refractor",
      serial: "/25",
      pop: 25,
      publishedOdds: "1:12,206 Value",
      confidence: "High subject to source verification",
      notes: "Insert solo.",
    });
    expect(cbh.map((card) => card.cardNumber)).toEqual(["#4", "#35", "#115"]);
    expect(cbh.map((card) => card.name)).toEqual([
      "Doctor Doom 1975",
      "Doctor Doom 1976",
      "Doctor Doom 2025",
    ]);
    for (const card of cbh) {
      expect(card.rank).toBe(3);
      expect(card.parallel).toBe("1975 Golden Anniversary Gold Flake Shimmer Refractor");
      expect(card.serial).toBe("/24");
      expect(card.pop).toBe(24);
      expect(card.publishedOdds).toBe("1:59 packs");
      expect(card.specificOdds).toBe("≈1:8,850");
      expect(card.oddsType).toBe("nlf-estimate");
      expect(card.notes).toMatch(/eligible subjects 150/);
      expect(card.notes).toMatch(/Do not call Official Topps Odds/);
    }
    expect(rankLabel(3, true)).toBe("Tied #3");
  });

  it("locks Inventory Bot: no images, no Shopify buy URLs, Check NLF Inventory only", () => {
    expect(DOOM_TOUGHEST_SEED.cards).toHaveLength(5);
    for (const card of DOOM_TOUGHEST_SEED.cards) {
      expect(card.imageUrl).toBeNull();
      expect(card.nlfBuyUrl).toBeNull();
      expect(hasCardImage(card.imageUrl)).toBe(false);
      expect(nlfInventoryHref(card)).toBe(NLF_INVENTORY_PATH);
      expect(card.market).toEqual(MARKET[card.id as keyof typeof MARKET]);
    }
    expect(NLF_INVENTORY_CTA).toBe("Check NLF Inventory");
    expect(page).toContain("NLF_INVENTORY_CTA");
    expect(page).toContain("hasCardImage");
    expect(page).not.toMatch(/Buy now|Buy button|Shop now|Add to cart/i);
    expect(loader).not.toMatch(/Buy now|Buy button/i);
    expect(jsonText).not.toMatch(/shopify/i);
  });

  it("has no research-conflict or provisional ranking language after Card Research resolve", () => {
    const banned = /RESEARCH CONFLICT|provisional until odds|pending Facsimile-sheet|CONFLICT \/ pending/i;
    expect(jsonText).not.toMatch(banned);
    expect(page).not.toMatch(banned);
    expect(loader).not.toMatch(banned);
  });
});

describe("Doctor Doom toughest /24 & /25 page shell", () => {
  it("uses the dedicated research route and is scannable", () => {
    expect(DOOM_TOUGHEST_PATH).toBe("/research/doctor-doom-toughest-24-25-topps-marvel-cards");
    expect(DOOM_TOUGHEST_PATH.startsWith("/mcu-news")).toBe(false);
    expect(DOOM_TOUGHEST_JSON_PATH).toBe("/data/doom/toughest-24-25.json");
    expect(wordCount(page)).toBeLessThan(700);
    expect(page).not.toMatch(/prose prose-invert/);
    expect(page).toMatch(/How we measure/);
    expect(page).toMatch(/Find this card/);
    expect(page).toMatch(/Independent NLF write-up/);
    expect(page).toContain("DOOM_CHARACTER_PATH");
    expect(page).toContain("DOOM_HISTORY_PATH");
    expect(DOOM_CHARACTER_PATH).toBe("/characters/doctor-doom");
    expect(DOOM_HISTORY_PATH).toBe("/comic-cuts/doctor-doom-history");
  });

  it("wires the research route and lists the page with other research hubs", () => {
    expect(app).toContain('lazy(() => import("./pages/DoomToughest2425Page"))');
    expect(app).toContain('path="/research/doctor-doom-toughest-24-25-topps-marvel-cards"');
    expect(siteMap).toContain(DOOM_TOUGHEST_PATH);
    expect(xmlSitemap).toContain(DOOM_TOUGHEST_PATH);
  });
});
