import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  CHROME_2026_SET_PATH,
  DOOM_CARD_IMAGE,
  DOOM_CHARACTER_PATH,
  DOOM_CUT_FIRST_LOCK,
  DOOM_GALLERY_CATALOG_PATH,
  DOOM_GALLERY_HASH,
  DOOM_GALLERY_PATH,
  DOOM_HOT_LEADS,
  DOOM_HISTORY_PATH,
  DOOM_VIDEO_ID,
  DOOM_VIDEO_PATH,
  DOOM_YOUTUBE_ID,
  MINT_2025_SET_PATH,
  MINT_COMIC_CUT_FACTS,
  OWUD_FACTS,
  OWUD_PATH,
  hotLeadsForCut,
  isDoctorDoomCharacter,
  isDoomComicCutCatalog,
  isLockedDoomCut,
  lockedBadgeLabel,
  loreCompanionForVideo,
  padCutNum,
  visibleDoomCuts,
} from "./doomComicCuts";
import { chromeMarvel2026Data } from "./setChecklists/chromeMarvel2026";
import { finestFantasticFour2026Data } from "./setChecklists/finestFantasticFour2026";
import { chromeDeadpool2025Data } from "./setChecklists/chromeDeadpool2025";

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
    expect(historyPage).toMatch(/print run unknown/i);
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
    expect(historyPage).not.toMatch(/youtube\.com\/embed\/(?!\$\{)/);
    expect((historyPage.match(/DOOM_YOUTUBE_ID/g) || []).length).toBeGreaterThan(0);
  });

  it("is a scannable collector hub, not an SEO essay", () => {
    expect(wordCount(historyPage)).toBeLessThan(500);
    expect(historyPage).not.toMatch(/Why these Comic Cuts matter/);
    expect(historyPage).not.toMatch(/prose prose-invert/);
    expect(historyPage).toMatch(/Quick timeline/);
    expect(historyPage).toMatch(/Fantastic Four #5/);
    expect(historyPage).toMatch(/Latveria/);
    expect(historyPage).toMatch(/Secret Wars/);
    expect(historyPage).toMatch(/First Steps/);
    expect(historyPage).toMatch(/Doomsday/);
    expect(historyPage).toMatch(/Comic Cuts/);
    expect(historyPage).toMatch(/Not Doom 2099/);
    expect(historyPage).toMatch(/Independent NLF write-up/);
    expect(historyPage).toMatch(/does not assign a\s+specific issue or page/i);
    expect(historyPage).toMatch(/Mint 2025/);
    expect(historyPage).toMatch(/Hobby/);
    expect(historyPage).toMatch(/SDCC/);
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
    expect(historyPage.indexOf("DoomComicCutGallery")).toBeLessThan(
      historyPage.indexOf('id="watch"')
    );
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
    expect(visible.filter((cut) => cut.status === "locked").map((cut) => cut.num)).toEqual([52]);
    expect(visible.filter((cut) => cut.num !== 52).every((cut) => cut.status === "unidentified")).toBe(true);
    expect(visible.every((cut) => (cut.clues ?? "").trim().length > 0)).toBe(true);
    expect(padCutNum(18)).toBe("018");
  });

  it("badges locked Cut 052 as FF #156 and keeps Cut 060 as a research lead", () => {
    expect(DOOM_HOT_LEADS.map((lead) => lead.num)).toEqual([60]);
    expect(hotLeadsForCut(52)).toEqual([]);
    expect(hotLeadsForCut(60)[0]?.note).toMatch(/Cut 019/);
    expect(hotLeadsForCut(19).some((lead) => lead.num === 60)).toBe(true);
    expect(hotLeadsForCut(18)).toEqual([]);
    expect(gallery).toContain("HotLeadsStrip");
    expect(gallery).toContain("hotLeadsForCut");
    expect(gallery).toContain("lockedBadgeLabel");
    expect(gallery).toContain("isLockedDoomCut");
    const cut52 = catalog.cuts.find((cut: { num: number }) => cut.num === 52);
    expect(cut52?.clues).toMatch(/GIANT-SIZE SUPER-VILLAIN TEAM-UP #1/);
    expect(cut52?.status).toBe("locked");
    expect(cut52?.locked_issue).toMatch(/Fantastic Four \(1961\) #156/);
    expect(isLockedDoomCut(cut52)).toBe(true);
    expect(lockedBadgeLabel(cut52)).toBe("FF #156");
    expect(DOOM_CUT_FIRST_LOCK.num).toBe(52);
    expect(DOOM_CUT_FIRST_LOCK.issue).toMatch(/#156/);
  });

  it("does not invent locked issue/page IDs or commerce copy", () => {
    const raw = JSON.stringify(catalog);
    expect(raw).not.toMatch(/checkout|buy now|add to cart/i);
    expect(raw).not.toMatch(/2099/);
    expect(visibleDoomCuts(catalog).every((cut) => !cut.file.match(/2099/i))).toBe(true);
  });
});

describe("Doctor Doom Card Database character match", () => {
  it("includes Doctor Doom / Doom variants and excludes 2099 plus lookalikes", () => {
    expect(isDoctorDoomCharacter("Doctor Doom")).toBe(true);
    expect(isDoctorDoomCharacter("doctor doom — Refractor")).toBe(true);
    expect(isDoctorDoomCharacter("DOOM")).toBe(true);
    expect(isDoctorDoomCharacter("Dr. Doom")).toBe(true);
    expect(isDoctorDoomCharacter("God Emperor Doom")).toBe(true);
    expect(isDoctorDoomCharacter("Iron Man / Doctor Doom")).toBe(true);
    expect(isDoctorDoomCharacter("Doom 2099")).toBe(false);
    expect(isDoctorDoomCharacter("Doctor Doom 2099")).toBe(false);
    expect(isDoctorDoomCharacter("Doomasaur")).toBe(false);
    expect(isDoctorDoomCharacter("DOOMASAUR")).toBe(false);
    expect(isDoctorDoomCharacter("Doomasaur — Refractor")).toBe(false);
    expect(isDoctorDoomCharacter("Doctor Doom / Doomasaur")).toBe(false);
    expect(isDoctorDoomCharacter("Doomsday")).toBe(false);
    expect(isDoctorDoomCharacter("Doctor Octopus")).toBe(false);
    expect(isDoctorDoomCharacter("Doctor Strange")).toBe(false);
    expect(isDoctorDoomCharacter("")).toBe(false);
    expect(isDoctorDoomCharacter(null)).toBe(false);
  });

  it("deny-first hard lock: 2099 or Doomasaur never match even if Doom is in the name", () => {
    expect(isDoctorDoomCharacter("Doctor Doom 2099")).toBe(false);
    expect(isDoctorDoomCharacter("Doom 2099 — Clawed Chrome")).toBe(false);
    expect(isDoctorDoomCharacter("Doctor Doom / Doomasaur")).toBe(false);
    expect(isDoctorDoomCharacter("Doomasaur vs Doctor Doom")).toBe(false);
  });

  it("wires a distinctive Doom filter into CardDatabase set detail, not a clone of subset chips", () => {
    const cardDatabase = readFileSync(resolve(here, "../pages/CardDatabase.tsx"), "utf8");
    expect(cardDatabase).toContain("isDoctorDoomCharacter");
    expect(cardDatabase).toContain("doomOnly");
    expect(cardDatabase).toContain("filterType");
    expect(cardDatabase).toContain("DOOM_HISTORY_PATH");
    expect(cardDatabase).toContain("DOOM_VIDEO_PATH");
    expect(cardDatabase).toContain("Doctor Doom cards in this set");
    expect(cardDatabase).toContain("No Doctor Doom cards in this set");
    expect(cardDatabase).toMatch(/amber-400/);
    expect(cardDatabase).toMatch(/emerald-9/);
    expect(cardDatabase).not.toMatch(/checkout|add to cart|buy now|shop now/i);
    expect(cardDatabase).not.toMatch(/youtube\.com\/embed/);
    expect(cardDatabase).toContain("thin banner only — no essay panel");
    expect(cardDatabase).toContain("filter existing set cards only — do not invent cards or photos");
    expect(cardDatabase).not.toMatch(/Victor von Doom/);
    expect(cardDatabase).not.toMatch(/Why these/);
    expect(cardDatabase).not.toMatch(/prose prose-invert/);
    expect(cardDatabase).not.toMatch(/const doom(Cards|Roster|Gallery)\s*=\s*\[/);
  });

  it("would show the Doom control on 2026 Chrome Marvel Comics and hide 2099 / Doomasaur", () => {
    const matches = chromeMarvel2026Data.baseCards.filter((c) => isDoctorDoomCharacter(c.name));
    expect(matches.map((c) => c.name)).toEqual(["Doctor Doom"]);
    expect(matches).toHaveLength(1);
  });

  it("would show the Doom control on 2026 Finest Fantastic Four and hide 2099 / Doomasaur", () => {
    const matches = finestFantasticFour2026Data.baseCards.filter((c) =>
      isDoctorDoomCharacter(c.name)
    );
    expect(matches.map((c) => c.name)).toEqual(["Doctor Doom"]);
  });

  it("would hide the Doom control on sets with no Doctor Doom cards", () => {
    const matches = chromeDeadpool2025Data.baseCards.filter((c) => isDoctorDoomCharacter(c.name));
    expect(matches).toHaveLength(0);
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
