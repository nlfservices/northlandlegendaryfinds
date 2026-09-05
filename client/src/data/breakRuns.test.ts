import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import feedFile from "../../public/data/breaks/runs.json";
import exampleChecklist from "../../public/data/breaks/checklists/example-cosmic-surge.json";
import {
  BREAKS_FEED_PATH,
  BREAKS_FEED_UPDATED_AT,
  BREAK_RUNS,
  CHECKLIST_COMING_SOON,
  CHECKLIST_R2_OBJECT,
  EXAMPLE_COSMIC_SURGE_SLUG,
  EXAMPLE_ODDS_COSMIC_SURGE,
  EXAMPLE_ODDS_LINE,
  GALLERY_TIERS,
  INDEX_HEADER_CHIP,
  NLF_BREAK_RUN_KEYS,
  NLF_METAFIELD_NAMESPACE,
  R2_PUBLIC_BASE,
  SHOPIFY_ADMIN_WIRED,
  WHATNOT_INVITE_URL,
  checklistFallbackPath,
  checklistR2Url,
  ctaForRun,
  galleryCards,
  getBreakRun,
  getBreakRunSitemapPaths,
  hasCardArt,
  listBreakRuns,
  loadShopifyBreakRunRecords,
  packsLeftLabel,
  parseChecklistCards,
  remainingByTier,
  resolvePacksRemaining,
  combinedGrailPercent,
  runsR2Url,
} from "./breakRuns";

const here = dirname(fileURLToPath(import.meta.url));
const pages = [
  readFileSync(resolve(here, "../pages/Breaks.tsx"), "utf8"),
  readFileSync(resolve(here, "../pages/BreakRun.tsx"), "utf8"),
  readFileSync(resolve(here, "../components/BreakRunShopCard.tsx"), "utf8"),
  readFileSync(resolve(here, "./breakRuns.ts"), "utf8"),
  readFileSync(resolve(here, "./breakRunLoader.ts"), "utf8"),
  readFileSync(resolve(here, "./useBreaksFeed.ts"), "utf8"),
  readFileSync(resolve(here, "./nlfBreakRunContract.ts"), "utf8"),
].join("\n");
const app = readFileSync(resolve(here, "../App.tsx"), "utf8");
const feedJson = readFileSync(resolve(here, "../../public/data/breaks/runs.json"), "utf8");
const exampleChecklistJson = readFileSync(
  resolve(here, "../../public/data/breaks/checklists/example-cosmic-surge.json"),
  "utf8"
);

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

const FEED_KEYS = [
  "run_slug",
  "total_packs",
  "packs_remaining",
  "status",
  "whatnot_listing_url",
  "whatnot_show_url",
  "whatnot_clip_url",
  "odds_snapshot_url",
  "show_date",
  "spot_or_order",
  "product_id",
  "variant_id",
  "checklist_url",
] as const;

describe("break-run catalog", () => {
  it("ships Cosmic Surge as the Super Grok EXAMPLE shell (400 / 400, Entry, upcoming)", () => {
    const run = getBreakRun(EXAMPLE_COSMIC_SURGE_SLUG);
    expect(run).toBeTruthy();
    expect(run?.title).toBe("Cosmic Surge");
    expect(run?.tier_label).toBe("Entry");
    expect(run?.blurb).toBe("Entry Infinity Pack run — Guardians, street heat, and solid floors.");
    expect(run?.break_status).toBe("upcoming");
    expect(run?.example).toBe(true);
    expect(run?.total_packs).toBe(400);
    expect(run?.packs_remaining).toBe(400);
    expect(run?.packs_remaining_source).toBe("variant_inventory_quantity");
    expect(packsLeftLabel(run!)).toBe("400 / 400");
    expect(run?.pack_art_url).toBeNull();
    expect(run?.product_id).toBeNull();
    expect(run?.variant_id).toBeNull();
    expect(run?.run_slug).toBe("example-cosmic-surge");
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
    const statuses = new Set(BREAK_RUNS.map((run) => run.break_status));
    expect(statuses).toEqual(new Set(["upcoming", "live", "sold_out"]));
    expect(listBreakRuns().map((run) => run.break_status)).toEqual([
      "live",
      "upcoming",
      "sold_out",
    ]);
  });

  it("does not invent official checklist card names or photos", () => {
    expect(CHECKLIST_COMING_SOON).toBe("Checklist (coming soon)");
    expect(pages).toContain("Checklist (coming soon)");
    expect(pages).toContain("Coming soon.");
    expect(pages).toContain("Art hidden");
    expect(pages).toContain("hasCardArt");
    for (const leak of INVENTED_CARD_NAMES) {
      expect(pages).not.toMatch(leak);
      expect(feedJson).not.toMatch(leak);
      expect(exampleChecklistJson).not.toMatch(leak);
    }
    expect(exampleChecklist.cards.every((card) => card.imageUrl === "")).toBe(true);
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

  it("deep-links CTAs to Whatnot listing / show URLs", () => {
    const upcoming = ctaForRun(getBreakRun(EXAMPLE_COSMIC_SURGE_SLUG)!);
    const live = ctaForRun(getBreakRun("nebula-vault")!);
    const sold = ctaForRun(getBreakRun("afterglow-case")!);

    expect(upcoming.label).toBe("Get spot on Whatnot");
    expect(upcoming.href).toBe(WHATNOT_INVITE_URL);
    expect(live.label).toBe("Live now — auction");
    expect(live.href).toContain("whatnot.com");
    expect(sold.label).toBe("Sold out — see hit proof");
    expect(sold.href).toBe(WHATNOT_INVITE_URL);

    for (const run of BREAK_RUNS) {
      expect(run.whatnot_listing_url).toContain("whatnot.com/invite/northlandfinds");
      expect(run.whatnot_show_url).toContain("whatnot.com/user/northlandfinds");
    }
  });

  it("exposes sitemap paths for the index and each run", () => {
    expect(getBreakRunSitemapPaths()).toEqual([
      "/breaks",
      "/breaks/example-cosmic-surge",
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

  it("uses real UTF-8 dashes and dots in EXAMPLE copy", () => {
    expect(pages).toContain("Live now \u2014 auction");
    expect(pages).toContain("Sold out \u2014 see hit proof");
    expect(feedJson).toContain("Entry Infinity Pack run \u2014 Guardians");
    expect(feedJson).toContain("$15\u201333");
    expect(pages).toContain("2.22% \u00B7 Grail 5%");
    expect(pages).not.toContain("\u00E2\u20AC\u201D");
    expect(feedJson).not.toContain("\u00E2\u20AC\u201D");
  });
});

describe("Inventory Bot public feed + nlf metafield contract", () => {
  it("publishes /data/breaks/runs.json with updated_at and Inventory run keys", () => {
    expect(BREAKS_FEED_PATH).toBe("/data/breaks/runs.json");
    expect(pages).toContain("BREAKS_FEED_PATH");
    expect(pages).toContain("useBreaksFeed");
    expect(feedFile.updated_at).toBe("2026-09-05T16:00:00Z");
    expect(BREAKS_FEED_UPDATED_AT).toBe(feedFile.updated_at);
    expect(feedFile.example).toBe(true);
    expect(feedFile.shopify_admin_wired).toBe(false);
    expect(Array.isArray(feedFile.runs)).toBe(true);
    for (const key of FEED_KEYS) {
      expect(feedJson).toContain(`"${key}"`);
    }
    const cosmic = feedFile.runs.find((run) => run.run_slug === EXAMPLE_COSMIC_SURGE_SLUG);
    expect(cosmic).toMatchObject({
      run_slug: "example-cosmic-surge",
      total_packs: 400,
      packs_remaining: 400,
      status: "upcoming",
      whatnot_listing_url: "https://whatnot.com/invite/northlandfinds",
      whatnot_show_url: "https://www.whatnot.com/user/northlandfinds",
      product_id: null,
      variant_id: null,
      checklist_url: checklistR2Url("example-cosmic-surge"),
    });
    expect(cosmic).not.toHaveProperty("checklist");
  });

  it("documents the nlf namespace and exact keys", () => {
    expect(NLF_METAFIELD_NAMESPACE).toBe("nlf");
    expect(NLF_BREAK_RUN_KEYS).toEqual({
      run_slug: "nlf.run_slug",
      total_packs: "nlf.total_packs",
      packs_remaining: "nlf.packs_remaining",
      break_status: "nlf.break_status",
      whatnot_listing_url: "nlf.whatnot_listing_url",
      whatnot_show_url: "nlf.whatnot_show_url",
      odds_snapshot_url: "nlf.odds_snapshot_url",
      whatnot_clip_url: "nlf.whatnot_clip_url",
      show_date: "nlf.show_date",
      spot_or_order: "nlf.spot_or_order",
    });
    expect(SHOPIFY_ADMIN_WIRED).toBe(false);
    expect(pages).toContain("Live Shopify Admin is not wired yet");
  });

  it("maps the public feed through nlf metafield keys", () => {
    const records = loadShopifyBreakRunRecords();
    const cosmic = records.find((run) => run["nlf.run_slug"] === EXAMPLE_COSMIC_SURGE_SLUG);
    expect(cosmic).toMatchObject({
      product_id: null,
      variant_id: null,
      variant_inventory_quantity: 400,
      "nlf.run_slug": "example-cosmic-surge",
      "nlf.total_packs": 400,
      "nlf.packs_remaining": null,
      "nlf.break_status": "upcoming",
      "nlf.whatnot_listing_url": "https://whatnot.com/invite/northlandfinds",
      "nlf.whatnot_show_url": "https://www.whatnot.com/user/northlandfinds",
    });
  });

  it("prefers variant inventory quantity unless nlf.packs_remaining overrides", () => {
    const records = loadShopifyBreakRunRecords();
    const cosmic = records.find((run) => run["nlf.run_slug"] === EXAMPLE_COSMIC_SURGE_SLUG)!;
    expect(resolvePacksRemaining(cosmic)).toEqual({
      packs_remaining: 400,
      packs_remaining_source: "variant_inventory_quantity",
    });

    const overridden = {
      ...cosmic,
      variant_inventory_quantity: 400,
      "nlf.packs_remaining": 12,
    };
    expect(resolvePacksRemaining(overridden)).toEqual({
      packs_remaining: 12,
      packs_remaining_source: "nlf.packs_remaining",
    });

    const live = getBreakRun("nebula-vault");
    expect(live?.packs_remaining).toBe(184);
    expect(live?.packs_remaining_source).toBe("variant_inventory_quantity");
    expect(getBreakRun("afterglow-case")?.packs_remaining).toBe(0);
  });
});

describe("Inventory checklist UI shape (id, not card_id)", () => {
  it("publishes the EXAMPLE Cosmic Surge stub at the aligned run_slug", () => {
    expect(exampleChecklist).toEqual({
      updated_at: "2026-09-05T16:00:00Z",
      run_slug: "example-cosmic-surge",
      skip_commons: true,
      cards: [
        { id: "example-chase-1", tier: "chase", imageUrl: "", status: "available", name: "EXAMPLE Chase" },
        { id: "example-grail-1", tier: "grail", imageUrl: "", status: "available", name: "EXAMPLE Grail" },
        {
          id: "example-super-grail-1",
          tier: "super_grail",
          imageUrl: "",
          status: "pulled",
          name: "EXAMPLE Super Grail",
          pulled_at: "2026-09-05T16:00:00Z",
        },
      ],
    });
    expect(exampleChecklistJson).not.toContain("card_id");
    expect(feedJson).not.toContain("card_id");
    expect(exampleChecklist.cards.every((card) => "id" in card && !("card_id" in card))).toBe(true);
  });

  it("attaches the stub cards onto the EXAMPLE run via the two-file feed", () => {
    const run = getBreakRun(EXAMPLE_COSMIC_SURGE_SLUG)!;
    expect(run.skip_commons).toBe(true);
    expect(run.checklist_url).toBe(checklistR2Url("example-cosmic-surge"));
    expect(run.checklist.map((card) => card.id)).toEqual([
      "example-chase-1",
      "example-grail-1",
      "example-super-grail-1",
    ]);
    expect(run.checklist.every((card) => GALLERY_TIERS.includes(card.tier))).toBe(true);
    expect(run.checklist.some((card) => card.status === "pulled")).toBe(true);
    expect(run.checklist.every((card) => !hasCardArt(card))).toBe(true);
    expect(remainingByTier(run.checklist)).toEqual({
      chase: 1,
      grail: 1,
      super_grail: 0,
    });
  });

  it("gives every run a checklist_url and skip_commons checklists", () => {
    for (const run of feedFile.runs) {
      expect(run.checklist_url).toBe(checklistR2Url(run.run_slug));
    }
    expect(BREAK_RUNS.every((run) => run.skip_commons)).toBe(true);
    expect(getBreakRun("nebula-vault")?.checklist).toEqual([]);
    expect(getBreakRun("afterglow-case")?.checklist).toEqual([]);
  });

  it("uses the R2 bucket-root two-file object paths", () => {
    expect(R2_PUBLIC_BASE).toBe("https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev");
    expect(runsR2Url()).toBe(`${R2_PUBLIC_BASE}/breaks/runs.json`);
    expect(CHECKLIST_R2_OBJECT("example-cosmic-surge")).toBe(
      "breaks/checklists/example-cosmic-surge.json"
    );
    expect(checklistR2Url("example-cosmic-surge")).toBe(
      `${R2_PUBLIC_BASE}/breaks/checklists/example-cosmic-surge.json`
    );
    expect(checklistFallbackPath("example-cosmic-surge")).toBe(
      "/data/breaks/checklists/example-cosmic-surge.json"
    );
    expect(pages).toContain("checklist_url");
    expect(pages).toContain("checklistFallbackPath");
  });

  it("parses required id/tier/imageUrl/status and ignores card_id plus commons", () => {
    const parsed = parseChecklistCards({
      updated_at: "2026-09-05T16:00:00Z",
      run_slug: "example-cosmic-surge",
      skip_commons: true,
      cards: [
        { id: "ok", tier: "chase", imageUrl: "", status: "available" },
        { id: "common-no", tier: "common" as never, imageUrl: "", status: "available" },
        { card_id: "legacy", tier: "grail", imageUrl: "", status: "available" } as never,
        { id: "no-status", tier: "grail", imageUrl: "" } as never,
        { id: "pulled", tier: "super_grail", imageUrl: "https://cdn.example/x.webp", status: "pulled" },
      ],
    });
    expect(parsed.map((card) => card.id)).toEqual(["ok", "pulled"]);
    expect(galleryCards(parsed).every((card) => card.tier !== "common")).toBe(true);
    expect(hasCardArt(parsed[0])).toBe(false);
    expect(hasCardArt(parsed[1])).toBe(true);
  });

  it("marks pulled cards in the gallery and hides empty imageUrl", () => {
    const card = readFileSync(resolve(here, "../components/BreakRunShopCard.tsx"), "utf8");
    expect(card).toContain("ChecklistGallery");
    expect(card).toContain("Hits remaining");
    expect(card).toContain("Pulled");
    expect(card).toContain("hasCardArt");
    expect(card).toContain("Art hidden");
    expect(card).toContain("line-through");
    expect(card).not.toContain("card_id");
  });
});
