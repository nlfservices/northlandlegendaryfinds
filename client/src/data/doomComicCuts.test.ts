import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  CHROME_2026_SET_PATH,
  DOOM_CARD_IMAGE,
  DOOM_CHARACTER_PATH,
  DOOM_GALLERY_CATALOG_PATH,
  DOOM_GALLERY_HASH,
  DOOM_GALLERY_PATH,
  DOOM_HISTORY_PATH,
  DOOM_VIDEO_ID,
  DOOM_VIDEO_PATH,
  DOOM_YOUTUBE_ID,
  MINT_2025_SET_PATH,
  MINT_COMIC_CUT_FACTS,
  OWUD_FACTS,
  OWUD_PATH,
  isDoomComicCutCatalog,
  loreCompanionForVideo,
  padCutNum,
  visibleDoomCuts,
} from "./doomComicCuts";

const here = dirname(fileURLToPath(import.meta.url));
const historyPage = readFileSync(resolve(here, "../pages/DoomComicCutHistory.tsx"), "utf8");
const owudPage = readFileSync(resolve(here, "../pages/OneWorldUnderDoom.tsx"), "utf8");
const gallery = readFileSync(resolve(here, "../components/DoomComicCutGallery.tsx"), "utf8");
const app = readFileSync(resolve(here, "../App.tsx"), "utf8");

function wordCount(text: string): number {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]+\}/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

describe("Doctor Doom Comic Cuts HISTORY companion", () => {
  it("uses the dedicated lore path that does not clash with /cards/:setSlug/:cardNumber", () => {
    expect(DOOM_HISTORY_PATH).toBe("/comic-cuts/doctor-doom-history");
    expect(DOOM_HISTORY_PATH.startsWith("/cards/")).toBe(false);
    expect(OWUD_PATH).toBe("/chrome/one-world-under-doom");
    expect(OWUD_PATH.startsWith("/cards/")).toBe(false);
  });

  it("cites reported Mint Comic Cut checklist facts without a box print run", () => {
    expect(MINT_COMIC_CUT_FACTS.set).toBe("2025 Topps Marvel Mint");
    expect(MINT_COMIC_CUT_FACTS.insertFamily).toBe("Authentic Comic Cuts");
    expect(MINT_COMIC_CUT_FACTS.cardNumber).toBe("DD-CC");
    expect(MINT_COMIC_CUT_FACTS.uniquePanels).toBe("~200");
    expect(MINT_COMIC_CUT_FACTS.hobbyOdds).toBe("1:61");
    expect(MINT_COMIC_CUT_FACTS.sdccOdds).toBe("1:63");
    expect(MINT_2025_SET_PATH).toBe("/cards/2025-topps-marvel-mint");
    expect(historyPage).not.toMatch(/print run of/i);
    expect(historyPage).toMatch(/Total box print run[\s\S]*unknown/);
  });

  it("uses the real card photo and the live YouTube companion", () => {
    expect(DOOM_CARD_IMAGE).toBe("/videos/doom-comic-cut-1of1-black.jpg?v=2");
    expect(DOOM_CARD_IMAGE).not.toContain("doom-comic-cuts-history");
    expect(DOOM_CARD_IMAGE).not.toMatch(/cloudfront/i);
    expect(DOOM_YOUTUBE_ID).toBe("GK7TpveroyU");
    expect(DOOM_VIDEO_PATH).toBe("/videos/doctor-doom-comic-cut-1-1-2025-topps-marvel-mint");
    expect(historyPage).toContain("DOOM_CARD_IMAGE");
    expect(historyPage).toContain("DOOM_YOUTUBE_ID");
    expect(historyPage).toContain("DOOM_VIDEO_PATH");
  });

  it("ships substantial curated lore covering the required arc", () => {
    expect(wordCount(historyPage)).toBeGreaterThan(1200);
    expect(historyPage).toMatch(/Why these Comic Cuts matter/);
    expect(historyPage).toMatch(/Fantastic Four #5/);
    expect(historyPage).toMatch(/Latveria/);
    expect(historyPage).toMatch(/Servo-Guard/);
    expect(historyPage).toMatch(/Secret Wars/);
    expect(historyPage).toMatch(/First Steps/);
    expect(historyPage).toMatch(/Doomsday/);
    expect(historyPage).toMatch(/Not Doom 2099/);
    expect(historyPage).toMatch(/Independent NLF write-up/);
    expect(historyPage).toMatch(/does not assign a\s+specific issue or page/i);
  });

  it("keeps Doctor Doom distinct from Doom 2099 and skips commerce", () => {
    expect(historyPage).toMatch(/Not Doom 2099/);
    expect(historyPage).toMatch(/Do not conflate/);
    expect(historyPage).not.toMatch(/checkout|add to cart|buy now|shop now/i);
    expect(owudPage).not.toMatch(/checkout|add to cart|buy now|shop now/i);
    expect(historyPage).not.toMatch(/box office/i);
  });

  it("links the Doom video to the HISTORY page", () => {
    expect(DOOM_VIDEO_ID).toBe("doctor-doom-comic-cut-1-1-2025-topps-marvel-mint");
    expect(loreCompanionForVideo(DOOM_VIDEO_ID)).toEqual({
      href: DOOM_HISTORY_PATH,
      label: "Doctor Doom history",
    });
    expect(loreCompanionForVideo("someone-else")).toBeNull();
    expect(DOOM_CHARACTER_PATH).toBe("/characters/doctor-doom");
  });

  it("lazy-loads both companions in App.tsx", () => {
    expect(app).toContain('lazy(() => import("./pages/DoomComicCutHistory"))');
    expect(app).toContain('lazy(() => import("./pages/OneWorldUnderDoom"))');
    expect(app).toContain('path="/comic-cuts/doctor-doom-history"');
    expect(app).toContain('path="/comic-cuts/doom"');
    expect(app).toContain("DOOM_GALLERY_HASH");
    expect(app).toContain('path="/chrome/one-world-under-doom"');
  });

  it("embeds the research inventory gallery on the HISTORY page", () => {
    expect(historyPage).toContain("DoomComicCutGallery");
    expect(historyPage).toContain("DOOM_GALLERY_HASH");
    expect(gallery).toMatch(/not a sales catalog/i);
    expect(gallery).toContain("DOOM_GALLERY_CATALOG_PATH");
    expect(gallery).toContain("MINT_2025_SET_PATH");
    expect(gallery).toContain("DOOM_VIDEO_PATH");
    expect(gallery).not.toMatch(/checkout|add to cart|buy now|shop now/i);
    expect(DOOM_GALLERY_PATH).toBe("/comic-cuts/doom");
    expect(DOOM_GALLERY_CATALOG_PATH).toBe("/comic-cuts/doom/catalog.json");
    expect(DOOM_GALLERY_HASH).toBe("research-inventory");
  });
});

describe("Doom Comic Cuts research catalog", () => {
  const catalog = JSON.parse(
    readFileSync(resolve(here, "../../public/comic-cuts/doom/catalog.json"), "utf8")
  );

  it("matches the public catalog shape and hides gap numbers", () => {
    expect(isDoomComicCutCatalog(catalog)).toBe(true);
    expect(catalog.set).toBe("2025 Topps Marvel Mint");
    expect(catalog.insert).toMatch(/DD-CC/);
    expect(catalog.inventory_here).toBe(42);
    expect(catalog.gaps).toEqual([21, 22, 32, 58]);
    expect(catalog.note).toMatch(/Not a sales catalog/i);
    expect(catalog.note).toMatch(/Marvel Mint/);

    const visible = visibleDoomCuts(catalog);
    expect(visible).toHaveLength(42);
    expect(visible.map((cut) => cut.num)).not.toEqual(expect.arrayContaining(catalog.gaps));
    expect(visible.every((cut) => cut.thumb.startsWith("/comic-cuts/doom/thumbs/cut_"))).toBe(true);
    expect(visible.every((cut) => cut.status === "unidentified")).toBe(true);
    expect(visible.some((cut) => (cut.clues ?? "").length > 0)).toBe(true);
    expect(padCutNum(18)).toBe("018");
  });

  it("does not invent locked issue/page IDs or commerce copy", () => {
    const raw = JSON.stringify(catalog);
    expect(raw).not.toMatch(/checkout|buy now|add to cart/i);
    expect(raw).not.toMatch(/2099/);
    expect(visibleDoomCuts(catalog).every((cut) => !cut.file.match(/2099/i))).toBe(true);
  });
});

describe("One World Under Doom Chrome 2026 stub", () => {
  it("nests OWUD under the Chrome 2026 set with reported hobby odds only", () => {
    expect(OWUD_FACTS.set).toBe("2026 Topps Chrome Marvel Comics");
    expect(OWUD_FACTS.insertFamily).toBe("One World Under Doom");
    expect(OWUD_FACTS.hobbyOdds).toBe("1:6");
    expect(OWUD_FACTS.checklistStatus).toBe("research");
    expect(CHROME_2026_SET_PATH).toBe("/cards/2026-topps-chrome-marvel-comics");
    expect(owudPage).toMatch(/Coming \/ research/);
    expect(owudPage).toMatch(/Not yet ingested/);
    expect(owudPage).toContain("CHROME_2026_SET_PATH");
    expect(owudPage).toContain("DOOM_HISTORY_PATH");
    expect(owudPage).toMatch(/Doom 2099 remains its own checklist line/);
  });
});
