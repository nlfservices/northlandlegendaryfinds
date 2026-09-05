import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  DOOM_CHARACTER_PATH,
  DOOM_TOUGHEST5_JSON_PATH,
  DOOM_TOUGHEST5_PATH,
  DOOM_TOUGHEST5_SEED,
  DOOM_TOUGHEST5_SLUG,
  DOOM_TOUGHEST_2425_PATH,
  allListedCards,
  countdownCards,
  hasCardImage,
  hmLabel,
  rankLabel,
  rankingTableCards,
} from "./doomToughest5";

const here = dirname(fileURLToPath(import.meta.url));
const page = readFileSync(resolve(here, "../pages/DoomToughest5Page.tsx"), "utf8");
const loader = readFileSync(resolve(here, "./doomToughest5.ts"), "utf8");
const app = readFileSync(resolve(here, "../App.tsx"), "utf8");
const siteMap = readFileSync(resolve(here, "../pages/SiteMap.tsx"), "utf8");
const xmlSitemap = readFileSync(resolve(here, "../../../server/sitemap.ts"), "utf8");
const jsonText = readFileSync(resolve(here, "../../public/data/doom/toughest-5.json"), "utf8");
const home = readFileSync(resolve(here, "../pages/Home.tsx"), "utf8");
const cardDatabase = readFileSync(resolve(here, "../pages/CardDatabase.tsx"), "utf8");

const MARKET = {
  "ow-20": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+OW-20+One+World+Under+Doom+Red+Refractor+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+OW-20+One+World+Under+Doom+Red+Refractor+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2026+Topps+Chrome+Marvel+OW-20+One+World+Under+Doom+Red+Refractor+%2F5",
  },
  "tb-12": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+TB-12+Doctor+Doom+The+Beyond+Red+Refractor+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+TB-12+Doctor+Doom+The+Beyond+Red+Refractor+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2026+Topps+Chrome+Marvel+TB-12+Doctor+Doom+The+Beyond+Red+Refractor+%2F5",
  },
  "mr-1": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Marvel+Comics+Chrome+MR-1+Doctor+Doom+Marvel+Reflections+RayWave+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Marvel+Comics+Chrome+MR-1+Doctor+Doom+Marvel+Reflections+RayWave+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2025+Marvel+Comics+Chrome+MR-1+Doctor+Doom+Marvel+Reflections+RayWave+%2F5",
  },
  "fd-ds": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Marvel+Comics+Chrome+FD-DS+Silver+Surfer+Doctor+Doom+Dual+Facsimile+Red+Wave+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Marvel+Comics+Chrome+FD-DS+Silver+Surfer+Doctor+Doom+Dual+Facsimile+Red+Wave+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2025+Marvel+Comics+Chrome+FD-DS+Silver+Surfer+Doctor+Doom+Dual+Facsimile+Red+Wave+%2F5",
  },
  "fy-05": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+FY-05+Doctor+Doom+65+Fantastic+Years+Red+Wave+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+FY-05+Doctor+Doom+65+Fantastic+Years+Red+Wave+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2026+Topps+Chrome+Marvel+FY-05+Doctor+Doom+65+Fantastic+Years+Red+Wave+%2F5",
  },
  "mfq-dnsg": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+MFQ-DNSG+Doctor+Doom+Silver+Surfer+Galactus+Namor+Red+Wave+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Chrome+Marvel+MFQ-DNSG+Doctor+Doom+Silver+Surfer+Galactus+Namor+Red+Wave+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2026+Topps+Chrome+Marvel+MFQ-DNSG+Doctor+Doom+Silver+Surfer+Galactus+Namor+Red+Wave+%2F5",
  },
  "mi-1": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Marvel+Comics+Chrome+MI-1+Doctor+Doom+Marvel+Icons+Red+Wave+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2025+Marvel+Comics+Chrome+MI-1+Doctor+Doom+Marvel+Icons+Red+Wave+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2025+Marvel+Comics+Chrome+MI-1+Doctor+Doom+Marvel+Icons+Red+Wave+%2F5",
  },
  "tl-05": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Finest+Fantastic+Four+TL-05+Doctor+Doom+Wields+the+Power+Cosmic+Red+Refractor+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Finest+Fantastic+Four+TL-05+Doctor+Doom+Wields+the+Power+Cosmic+Red+Refractor+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2026+Topps+Finest+Fantastic+Four+TL-05+Doctor+Doom+Wields+the+Power+Cosmic+Red+Refractor+%2F5",
  },
  "to-01": {
    ebayLive:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Finest+Fantastic+Four+TO-01+Doctor+Doom+Topps+Originals+Adi+Granov+Red+Refractor+%2F5&_sacat=0",
    ebaySold:
      "https://www.ebay.com/sch/i.html?_nkw=2026+Topps+Finest+Fantastic+Four+TO-01+Doctor+Doom+Topps+Originals+Adi+Granov+Red+Refractor+%2F5&_sacat=0&LH_Sold=1&LH_Complete=1",
    comc: "https://www.comc.com/Cards?q=2026+Topps+Finest+Fantastic+Four+TO-01+Doctor+Doom+Topps+Originals+Adi+Granov+Red+Refractor+%2F5",
  },
} as const;

const ODDS = {
  "mfq-dnsg": "1:132,404 Hobby",
  "fy-05": "1:60,774 Value",
  "fd-ds": "1:40,070 Hobby · Value 1:282,450",
  "mr-1": "1:25,044 Hobby",
  "tb-12": "1:14,712 Hobby",
  "ow-01": "1:14,712 Hobby",
  "ow-05": "1:14,712 Hobby",
  "ow-10": "1:14,712 Hobby",
  "ow-15": "1:14,712 Hobby",
  "ow-20": "1:14,712 Hobby",
  "mi-1": "1:13,357 Hobby · Secondary 1:376,600 Value",
  "tl-05": "1:7,542 Hobby",
  "to-01": "1:7,542 Hobby",
} as const;

describe("Doctor Doom toughest /5 seed", () => {
  it("keeps packet SEO, subtitle, chips, and census", () => {
    expect(DOOM_TOUGHEST5_SEED.seo.slug).toBe(DOOM_TOUGHEST5_SLUG);
    expect(DOOM_TOUGHEST5_SEED.seo.title).toBe(
      "10 Toughest Doctor Doom /5 Topps Marvel Cards to Pull | NLF"
    );
    expect(DOOM_TOUGHEST5_SEED.seo.meta).toBe(
      "Only five copies exist of each Doctor Doom /5 card, but their pack odds can be dramatically different. NLF counts down 10 of the toughest Doctor Doom /5 Topps Marvel pulls, plus three honorable mentions."
    );
    expect(DOOM_TOUGHEST5_SEED.seo.h1).toBe(
      "The 10 Toughest Doctor Doom /5 Topps Marvel Cards to Pull"
    );
    expect(DOOM_TOUGHEST5_SEED.seo.subtitle).toBe(
      "Only Five Copies Exist — But Some Are Far Harder to Pull Than Others"
    );
    expect(DOOM_TOUGHEST5_SEED.seo.chips).toEqual([
      "Doctor Doom",
      "Topps Marvel",
      "/5",
      "Card Research",
      "Rarity Research",
    ]);
    expect(DOOM_TOUGHEST5_SEED.census).toEqual({
      issues: 61,
      physical: 305,
      exclude: ["Doom 2099", "Doomasaur", "Victorious", "Victor Timely"],
    });
    expect(DOOM_TOUGHEST5_SEED.sister.path).toBe(DOOM_TOUGHEST_2425_PATH);
    expect(DOOM_TOUGHEST5_SEED.editorialNote).toMatch(/1:14,712 Hobby/);
    expect(DOOM_TOUGHEST5_SEED.editorialNote).toMatch(/OW-01 starts/);
    expect(DOOM_TOUGHEST5_SEED.editorialNote).toMatch(/TB-12 is the editorial transition/);
  });

  it("locks the top 10 published odds and card identities", () => {
    const byId = Object.fromEntries(DOOM_TOUGHEST5_SEED.cards.map((card) => [card.id, card]));
    expect(DOOM_TOUGHEST5_SEED.cards).toHaveLength(10);
    expect(byId["mfq-dnsg"]).toMatchObject({
      rank: 1,
      cardNumber: "MFQ-DNSG",
      type: "MULTI",
      parallel: "Red Wave Refractor",
      serial: "/5",
      pop: 5,
      publishedOdds: ODDS["mfq-dnsg"],
      notes: "Hardest overall",
      multiCharacter: true,
    });
    expect(byId["fy-05"]).toMatchObject({
      rank: 2,
      type: "Solo",
      publishedOdds: ODDS["fy-05"],
      notes: "Hardest solo",
    });
    expect(byId["fd-ds"]).toMatchObject({
      rank: 3,
      type: "MULTI",
      publishedOdds: ODDS["fd-ds"],
    });
    expect(byId["mr-1"]).toMatchObject({
      rank: 4,
      parallel: "RayWave",
      publishedOdds: ODDS["mr-1"],
    });
    expect(byId["tb-12"]).toMatchObject({
      rank: 5,
      publishedOdds: ODDS["tb-12"],
      notes: "Tied editorial transition",
      tied: true,
    });
    expect(["ow-01", "ow-05", "ow-10", "ow-15", "ow-20"].map((id) => byId[id].publishedOdds)).toEqual([
      ODDS["ow-01"],
      ODDS["ow-05"],
      ODDS["ow-10"],
      ODDS["ow-15"],
      ODDS["ow-20"],
    ]);
    expect(countdownCards().map((card) => card.rank)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    expect(rankingTableCards().map((card) => card.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(rankLabel(5, true)).toBe("Tied #5");
  });

  it("includes all three honorable mentions with published odds", () => {
    const hms = DOOM_TOUGHEST5_SEED.honorableMentions;
    expect(hms).toHaveLength(3);
    expect(hms.map((card) => card.cardNumber)).toEqual(["MI-1", "TL-05", "TO-01"]);
    expect(hms[0]).toMatchObject({
      hm: 1,
      set: "2025 Marvel Comics Chrome",
      name: "Doctor Doom - Marvel Icons",
      type: "Solo",
      parallel: "Red Wave",
      publishedOdds: ODDS["mi-1"],
    });
    expect(hms[1]).toMatchObject({
      hm: 2,
      set: "2026 Topps Finest Fantastic Four: 65th Anniversary",
      name: "Doom Wields the Power Cosmic",
      parallel: "Red Refractor",
      publishedOdds: ODDS["tl-05"],
    });
    expect(hms[2]).toMatchObject({
      hm: 3,
      name: "Doctor Doom - Topps Originals (Adi Granov)",
      publishedOdds: ODDS["to-01"],
      notes: "Tied with other Finest inserts at this figure",
    });
    expect(hmLabel(1)).toBe("HM1");
  });

  it("hides images and omits NLF Buy / AVAILABLE FROM NLF on all 13 cards", () => {
    const listed = allListedCards();
    expect(listed).toHaveLength(13);
    for (const card of listed) {
      expect(card.imageUrl).toBeNull();
      expect(card.nlfBuyUrl).toBeNull();
      expect(hasCardImage(card.imageUrl)).toBe(false);
      expect(card.serial).toBe("/5");
      expect(card.pop).toBe(5);
      expect(card.market.ebaySold).toContain("LH_Sold=1");
      expect(card.market.ebaySold).toContain("LH_Complete=1");
    }
    expect(DOOM_TOUGHEST5_SEED.cards.find((card) => card.id === "mfq-dnsg")?.market).toEqual(
      MARKET["mfq-dnsg"]
    );
    expect(DOOM_TOUGHEST5_SEED.cards.find((card) => card.id === "fy-05")?.market).toEqual(
      MARKET["fy-05"]
    );
    expect(DOOM_TOUGHEST5_SEED.cards.find((card) => card.id === "fd-ds")?.market).toEqual(
      MARKET["fd-ds"]
    );
    expect(DOOM_TOUGHEST5_SEED.cards.find((card) => card.id === "mr-1")?.market).toEqual(
      MARKET["mr-1"]
    );
    expect(DOOM_TOUGHEST5_SEED.cards.find((card) => card.id === "tb-12")?.market).toEqual(
      MARKET["tb-12"]
    );
    expect(DOOM_TOUGHEST5_SEED.honorableMentions[0].market).toEqual(MARKET["mi-1"]);
    expect(DOOM_TOUGHEST5_SEED.honorableMentions[1].market).toEqual(MARKET["tl-05"]);
    expect(DOOM_TOUGHEST5_SEED.honorableMentions[2].market).toEqual(MARKET["to-01"]);
    expect(page).not.toMatch(/Buy now|AVAILABLE FROM NLF|NLF Buy|Check NLF Inventory/i);
    expect(loader).not.toMatch(/Buy now|AVAILABLE FROM NLF|NLF Buy/i);
    expect(jsonText).not.toMatch(/shopify|AVAILABLE FROM NLF/i);
  });

  it("uses UTF-8 dashes and preserves Hobby vs Value labels", () => {
    expect(jsonText).toContain("\u2014");
    expect(jsonText).not.toContain("\u00E2\u20AC\u201D");
    expect(page).toContain("\u2014");
    expect(page).not.toContain("\u00E2\u20AC\u201D");
    expect(jsonText).toContain("1:60,774 Value");
    expect(jsonText).toContain("1:40,070 Hobby · Value 1:282,450");
    expect(jsonText).toContain("1:13,357 Hobby · Secondary 1:376,600 Value");
    expect(jsonText).not.toMatch(/1:132,404 Value/);
  });
});

describe("Doctor Doom toughest /5 page shell", () => {
  it("uses the dedicated research route and required layout order", () => {
    expect(DOOM_TOUGHEST5_PATH).toBe("/research/toughest-doctor-doom-5-topps-marvel-cards");
    expect(DOOM_TOUGHEST5_JSON_PATH).toBe("/data/doom/toughest-5.json");
    expect(page).not.toMatch(/prose prose-invert/);
    expect(page.indexOf("How we rank")).toBeLessThan(page.indexOf("Sister countdown"));
    expect(page.indexOf("Sister countdown")).toBeLessThan(page.indexOf("Editorial note"));
    expect(page.indexOf("Editorial note")).toBeLessThan(page.indexOf("Countdown"));
    expect(page.indexOf("Countdown")).toBeLessThan(page.indexOf("Full ranking"));
    expect(page.indexOf("Full ranking")).toBeLessThan(page.indexOf("Honorable mentions"));
    expect(page).toContain("countdownCards()");
    expect(page).toContain("rankingTableCards()");
    expect(page).toContain("Find this card");
    expect(page).toContain("DOOM_CHARACTER_PATH");
    expect(page).toContain("DOOM_TOUGHEST_2425_PATH");
    expect(DOOM_CHARACTER_PATH).toBe("/characters/doctor-doom");
    expect(DOOM_TOUGHEST_2425_PATH).toBe(
      "/research/doctor-doom-toughest-24-25-topps-marvel-cards"
    );
  });

  it("wires the research route and lists the page with other research hubs", () => {
    expect(app).toContain('lazy(() => import("./pages/DoomToughest5Page"))');
    expect(app).toContain('path="/research/toughest-doctor-doom-5-topps-marvel-cards"');
    expect(siteMap).toContain(DOOM_TOUGHEST5_PATH);
    expect(xmlSitemap).toContain(DOOM_TOUGHEST5_PATH);
    expect(home).not.toContain("DoomToughest5Page");
    expect(cardDatabase).not.toContain("DoomToughest5Page");
    expect(cardDatabase).not.toContain("toughest-5");
  });
});
