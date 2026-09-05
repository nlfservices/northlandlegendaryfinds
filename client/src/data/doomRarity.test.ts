import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  DOOM_RARITY_INDEX_PATH,
  chipHref,
  formatPhysical,
  identityPageHref,
  isDoomRarityIndex,
  isMethodExamplePull,
  setPageLabel,
} from "./doomRarity";

const here = dirname(fileURLToPath(import.meta.url));
const indexJson = readFileSync(resolve(here, "../../public/data/doom/rarity-index.json"), "utf8");
const index = JSON.parse(indexJson);
const hub = readFileSync(resolve(here, "../components/DoomRarityHub.tsx"), "utf8");
const characterPage = readFileSync(resolve(here, "../pages/CharacterPage.tsx"), "utf8");
const historyPage = readFileSync(resolve(here, "../pages/DoomComicCutHistory.tsx"), "utf8");
const home = readFileSync(resolve(here, "../pages/Home.tsx"), "utf8");
const cardDatabase = readFileSync(resolve(here, "../pages/CardDatabase.tsx"), "utf8");

function wordCount(text: string): number {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]+\}/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

describe("Doctor Doom rarity-index seed", () => {
  it("keeps the Card Research seed numbers and publish surface", () => {
    expect(isDoomRarityIndex(index)).toBe(true);
    expect(index.source.publish_surface).toBe("/characters/doctor-doom");
    expect(index.source.forced_complete).toBe(false);
    expect(index.benchmark.physical_total).toBe(16799);
    expect(index.benchmark.accounted).toBe(13663);
    expect(index.benchmark.accounted_pct).toBe(81.33);
    expect(index.benchmark.gap).toBe(3136);
    expect(index.provisional_banner).toContain("Ledger ~81% accounted");
    expect(index.provisional_banner).toContain("\u2014");
    expect(index.identity_rules.exclude).toEqual([
      "Doom 2099",
      "Doomasaur",
      "Victorious",
      "Victor Timely",
    ]);
  });

  it("wires live set pages plus Comic Cut history and catalog", () => {
    expect(index.links.character_page).toBe("/characters/doctor-doom");
    expect(index.links.comic_cuts_history).toBe("/comic-cuts/doctor-doom-history");
    expect(index.links.comic_cuts_catalog).toBe("/comic-cuts/doom/catalog.json");
    expect(index.links.set_pages).toEqual([
      "/cards/2026-topps-marvel-mint",
      "/cards/2026-topps-chrome-marvel-comics",
      "/cards/2025-topps-chrome",
      "/cards/2025-topps-marvel-mint",
      "/cards/2025-topps-marvel-sapphire",
      "/cards/2024-topps-chrome-sapphire-marvel",
      "/cards/2024-topps-chrome-marvel",
    ]);
    expect(index.links.exclude_character_slugs).toEqual([
      "doomasaur",
      "doom-2099",
      "victor-von-doom",
    ]);
  });

  it("shows pending physicals instead of inventing serial sums", () => {
    const fifty = index.tiers.find((tier: { id: string }) => tier.id === "serial-50");
    const ninetyNine = index.tiers.find((tier: { id: string }) => tier.id === "serial-99");
    const five = index.tiers.find((tier: { id: string }) => tier.id === "serial-5");
    expect(fifty.physical).toBeNull();
    expect(ninetyNine.physical).toBeNull();
    expect(five.physical).toBe(305);
    expect(five.distinct).toBe(61);
    expect(formatPhysical(null)).toBe("pending");
    expect(formatPhysical(305)).toBe("305");
  });
});

describe("DoomRarityHub", () => {
  it("renders the seed as a scannable hub, not an SEO essay", () => {
    expect(DOOM_RARITY_INDEX_PATH).toBe("/data/doom/rarity-index.json");
    expect(hub).toContain("DOOM_RARITY_INDEX_PATH");
    expect(hub).toContain("ui_chips");
    expect(hub).toContain("provisional_banner");
    expect(hub).toContain("links.set_pages");
    expect(hub).toContain("comic_cuts_history");
    expect(hub).toContain("comic_cuts_catalog");
    expect(hub).toContain("formatPhysical");
    expect(hub).toContain("Method example");
    expect(hub).not.toMatch(/prose prose-invert/);
    expect(hub).not.toMatch(/checkout|add to cart|buy now|shop now/i);
    expect(wordCount(hub)).toBeLessThan(700);
    expect(hub).toContain("\u2014");
    expect(hub).not.toContain("\u00E2\u20AC\u201D");
  });

  it("links identity excludes and known set routes only", () => {
    expect(identityPageHref("Doom 2099")).toBe("/characters/doom-2099");
    expect(identityPageHref("Doomasaur")).toBe("/characters/doomasaur");
    expect(identityPageHref("Victorious")).toBeNull();
    expect(identityPageHref("Victor Timely")).toBeNull();
    expect(identityPageHref("Victor von Doom")).toBeNull();
    expect(setPageLabel("/cards/2026-topps-marvel-mint")).toBe("2026 Marvel Mint");
    expect(
      chipHref({ label: "Comic Cuts", value: "~200", confidence: "Estimated" }, index.links)
    ).toBe("/comic-cuts/doctor-doom-history");
    expect(
      chipHref({ label: "Sapphire base", value: "#28", confidence: "Official" }, index.links)
    ).toBe("/cards/2026-topps-chrome-marvel-comics");
    expect(isMethodExamplePull(index.key_pulls[5])).toBe(true);
    expect(isMethodExamplePull(index.key_pulls[0])).toBe(false);
  });
});

describe("Doctor Doom rarity hub surface lock", () => {
  it("mounts the hub on CharacterPage only for doctor-doom", () => {
    expect(characterPage).toContain("import DoomRarityHub from \"@/components/DoomRarityHub\"");
    expect(characterPage).toContain("slug === \"doctor-doom\" && <DoomRarityHub");
    expect(characterPage.indexOf("DoomRarityHub")).toBeLessThan(
      characterPage.indexOf("historyMarkdown")
    );
  });

  it("does not dump the census into HISTORY, Home, or Card Database", () => {
    expect(historyPage).not.toContain("DoomRarityHub");
    expect(historyPage).not.toMatch(/16,799|13663|13,663/);
    expect(historyPage).not.toContain("rarity-index");
    expect(home).not.toContain("DoomRarityHub");
    expect(cardDatabase).not.toContain("DoomRarityHub");
    expect(cardDatabase).not.toContain("rarity-index");
  });
});
