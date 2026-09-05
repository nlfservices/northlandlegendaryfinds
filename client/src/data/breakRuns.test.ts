import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  BREAK_RUNS,
  SAMPLE_ODDS_BLEZ,
  WHATNOT_INVITE_URL,
  WHATNOT_PROFILE_URL,
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
];

describe("break-run catalog", () => {
  it("ships cosmic-surge as the featured sample with 300 / 300 packs", () => {
    const run = getBreakRun("cosmic-surge");
    expect(run).toBeTruthy();
    expect(run?.title).toBe("Cosmic Surge");
    expect(run?.status).toBe("upcoming");
    expect(run?.total_packs).toBe(300);
    expect(run?.packs_remaining).toBe(300);
    expect(packsLeftLabel(run!)).toBe("300 / 300");
    expect(run?.pack_art_url).toBeNull();
  });

  it("uses Blez Marvel Plus-style odds with qty and value bands", () => {
    const byId = Object.fromEntries(SAMPLE_ODDS_BLEZ.map((tier) => [tier.id, tier]));
    expect(byId.common.percent).toBe(77.78);
    expect(byId.chase.percent).toBe(15);
    expect(byId.grail.percent).toBe(5);
    expect(byId.super_grail.percent).toBe(2.22);
    expect(SAMPLE_ODDS_BLEZ.reduce((sum, tier) => sum + tier.qty, 0)).toBe(300);
    expect(SAMPLE_ODDS_BLEZ.every((tier) => tier.value_band.length > 0)).toBe(true);
  });

  it("covers upcoming, live, and sold out sample runs", () => {
    const statuses = new Set(BREAK_RUNS.map((run) => run.status));
    expect(statuses).toEqual(new Set(["upcoming", "live", "sold_out"]));
    expect(listBreakRuns().map((run) => run.status)).toEqual([
      "live",
      "upcoming",
      "sold_out",
    ]);
  });

  it("marks checklist names as SAMPLE placeholders", () => {
    for (const run of BREAK_RUNS) {
      expect(run.checklist.length).toBeGreaterThan(0);
      expect(run.checklist.every((item) => item.sample && item.name.includes("SAMPLE"))).toBe(true);
    }
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

  it("wires /breaks routes and keeps commerce off the break pages", () => {
    expect(app).toContain('path="/breaks"');
    expect(app).toContain('path="/breaks/:slug"');
    for (const leak of COMMERCE_LEAKS) {
      expect(pages).not.toMatch(leak);
    }
  });

  it("uses a real em dash in live and sold-out CTA copy", () => {
    expect(pages).toContain("Live now \u2014 auction");
    expect(pages).toContain("Sold out \u2014 see hit proof");
    expect(pages).not.toContain("\u00E2\u20AC\u201D");
  });
});
