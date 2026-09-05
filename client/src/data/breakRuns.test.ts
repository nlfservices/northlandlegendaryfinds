import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  BREAK_RUNS,
  CHECKLIST_COMING_SOON,
  EXAMPLE_ODDS_COSMIC_SURGE,
  EXAMPLE_ODDS_LINE,
  INDEX_HEADER_CHIP,
  WHATNOT_INVITE_URL,
  WHATNOT_PROFILE_URL,
  combinedGrailPercent,
  ctaForRun,
  getBreakRun,
  getBreakRunSitemapPaths,
  listBreakRuns,
  packsLeftLabel,
} from "./breakRuns";

const here = dirname(fileURLToPath(import.meta.url));
const pages = [
  readFileSync(resolve(here, "../pages/Breaks.tsx"), "utf8"),
  readFileSync(resolve(here, "../pages/BreakRun.tsx"), "utf8"),
  readFileSync(resolve(here, "../components/BreakRunShopCard.tsx"), "utf8"),
  readFileSync(resolve(here, "./breakRuns.ts"), "utf8"),
].join("\n");
const app = readFileSync(resolve(here, "../App.tsx"), "utf8");

const COMMERCE_LEAKS = [
  /open pack/i,
  /\bwallet\b/i,
  /collection checkout/i,
  /add to cart/i,
  /buy now/i,
  /stripe/i,
  /\$15 free/i,
  /free credit/i,
  /\bcredits?\b/i,
];

const INVENTED_CARD_NAMES = [
  /Spider-Man Chrome Base/i,
  /Storm Cosmic Refractor/i,
  /Wolverine Gold/i,
  /Doctor Doom Superfractor/i,
];

describe("break-run catalog", () => {
  it("ships Cosmic Surge as the Super Grok EXAMPLE shell (400 / 400, Entry, upcoming)", () => {
    const run = getBreakRun("cosmic-surge");
    expect(run).toBeTruthy();
    expect(run?.title).toBe("Cosmic Surge");
    expect(run?.tier_label).toBe("Entry");
    expect(run?.blurb).toBe("Entry Infinity Pack run — Guardians, street heat, and solid floors.");
    expect(run?.status).toBe("upcoming");
    expect(run?.example).toBe(true);
    expect(run?.total_packs).toBe(400);
    expect(run?.packs_remaining).toBe(400);
    expect(packsLeftLabel(run!)).toBe("400 / 400");
    expect(run?.pack_art_url).toBeNull();
    expect(run?.checklist).toEqual([]);
  });

  it("uses Super Grok EXAMPLE odds with qty, percents, and value bands", () => {
    const byId = Object.fromEntries(EXAMPLE_ODDS_COSMIC_SURGE.map((tier) => [tier.id, tier]));
    expect(byId.common).toMatchObject({ qty: 311, percent: 77.78, value_band: "$15–33" });
    expect(byId.chase).toMatchObject({ qty: 60, percent: 15, value_band: "$45–88" });
    expect(byId.grail).toMatchObject({ qty: 20, percent: 5, value_band: "$90–129" });
    expect(byId.super_grail).toMatchObject({ qty: 9, percent: 2.22, value_band: "$150–520" });
    expect(EXAMPLE_ODDS_COSMIC_SURGE.reduce((sum, tier) => sum + tier.qty, 0)).toBe(400);
    expect(combinedGrailPercent(EXAMPLE_ODDS_COSMIC_SURGE)).toBeCloseTo(7.22);
  });

  it("covers upcoming, live, and sold out EXAMPLE shells", () => {
    expect(BREAK_RUNS.every((run) => run.example)).toBe(true);
    const statuses = new Set(BREAK_RUNS.map((run) => run.status));
    expect(statuses).toEqual(new Set(["upcoming", "live", "sold_out"]));
    expect(listBreakRuns().map((run) => run.status)).toEqual([
      "live",
      "upcoming",
      "sold_out",
    ]);
  });

  it("does not invent checklist card names — coming soon only", () => {
    expect(CHECKLIST_COMING_SOON).toBe("Checklist (coming soon)");
    expect(pages).toContain("Checklist (coming soon)");
    expect(pages).toContain("Coming soon.");
    for (const run of BREAK_RUNS) {
      expect(run.checklist).toEqual([]);
    }
    for (const leak of INVENTED_CARD_NAMES) {
      expect(pages).not.toMatch(leak);
    }
  });

  it("shows the Infinity Packs index chip and EXAMPLE odds line", () => {
    expect(INDEX_HEADER_CHIP).toBe("INFINITY PACKS / break runs — Whatnot only.");
    expect(EXAMPLE_ODDS_LINE).toBe(
      "Super Grail 2.22% · Grail 5% · Chase 15% · Common 77.78% (combined grail 7.22%) — EXAMPLE."
    );
    expect(pages).toContain(INDEX_HEADER_CHIP);
    expect(pages).toContain(EXAMPLE_ODDS_LINE);
  });

  it("renders sold-out hit proof as a real Whatnot link, not a dead button", () => {
    const card = readFileSync(resolve(here, "../components/BreakRunShopCard.tsx"), "utf8");
    expect(card).toContain("asChild");
    expect(card).toContain("cta.href");
    expect(card).toContain('target="_blank"');
  });

  it("deep-links CTAs to Whatnot only", () => {
    const upcoming = ctaForRun(getBreakRun("cosmic-surge")!);
    const live = ctaForRun(getBreakRun("nebula-vault")!);
    const sold = ctaForRun(getBreakRun("afterglow-case")!);

    expect(upcoming.label).toBe("Get spot on Whatnot");
    expect(upcoming.href).toBe(WHATNOT_INVITE_URL);
    expect(live.label).toBe("Live now — auction");
    expect(live.href).toContain("whatnot.com");
    expect(sold.label).toBe("Sold out — see hit proof");
    expect(sold.href).toBe(WHATNOT_PROFILE_URL);

    for (const run of BREAK_RUNS) {
      expect(run.whatnot_invite_url).toContain("whatnot.com/invite/northlandfinds");
      expect(run.whatnot_profile_url).toContain("whatnot.com/user/northlandfinds");
    }
  });

  it("exposes sitemap paths for the index and each run", () => {
    expect(getBreakRunSitemapPaths()).toEqual([
      "/breaks",
      "/breaks/cosmic-surge",
      "/breaks/nebula-vault",
      "/breaks/afterglow-case",
    ]);
  });

  it("wires /breaks routes and keeps commerce and credits off the break pages", () => {
    expect(app).toContain('path="/breaks"');
    expect(app).toContain('path="/breaks/:slug"');
    for (const leak of COMMERCE_LEAKS) {
      expect(pages).not.toMatch(leak);
    }
  });

  it("uses real UTF-8 dashes and dots in EXAMPLE copy", () => {
    expect(pages).toContain("Live now \u2014 auction");
    expect(pages).toContain("Sold out \u2014 see hit proof");
    expect(pages).toContain("Entry Infinity Pack run \u2014 Guardians");
    expect(pages).toContain("$15\u201333");
    expect(pages).toContain("2.22% \u00B7 Grail 5%");
    expect(pages).not.toContain("\u00E2\u20AC\u201D");
  });
});
