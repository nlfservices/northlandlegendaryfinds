/**
 * Whatnot-only break-run catalog.
 *
 * Super Grok SAMPLE COPY for the Cosmic Surge shell.
 * Everything is EXAMPLE until Pat / Inventory confirm.
 *
 * Data keys follow Inventory Bot’s Shopify metafield contract
 * (namespace `nlf` on the Break Run product). Live Shopify Admin
 * is not wired yet — static EXAMPLE JSON feeds this catalog.
 *
 * .com adaptation: rundown pages only. CTAs deep-link to Whatnot.
 */

import { loadBreakRuns } from "./breakRunLoader";
import type { BreakRun, NlfBreakStatus } from "./nlfBreakRunContract";

export type { BreakRun, NlfBreakStatus as BreakRunStatus } from "./nlfBreakRunContract";
export {
  NLF_BREAK_RUN_KEYS,
  NLF_METAFIELD_NAMESPACE,
  resolvePacksRemaining,
} from "./nlfBreakRunContract";
export { SHOPIFY_ADMIN_WIRED, loadShopifyBreakRunRecords } from "./breakRunLoader";

export const WHATNOT_INVITE_URL = "https://whatnot.com/invite/northlandfinds";
export const WHATNOT_PROFILE_URL = "https://www.whatnot.com/user/northlandfinds";

/** Placeholder livestream URL until a real Whatnot show id is wired. */
export const WHATNOT_SHOW_PLACEHOLDER_URL = "https://www.whatnot.com/user/northlandfinds";

export const INDEX_HEADER_CHIP = "INFINITY PACKS / break runs — Whatnot only.";

/** Scannable odds beat — EXAMPLE until Inventory confirms. */
export const EXAMPLE_ODDS_LINE =
  "Super Grail 2.22% · Grail 5% · Chase 15% · Common 77.78% (combined grail 7.22%) — EXAMPLE.";

export const CHECKLIST_COMING_SOON = "Checklist (coming soon)";

export type OddsTierId = "common" | "chase" | "grail" | "super_grail";

export type BreakOddsTier = BreakRun["odds"][number];
export type BreakChecklistItem = BreakRun["checklist"][number];

export const BREAK_STATUS_CHIPS: ReadonlyArray<{
  id: NlfBreakStatus;
  label: string;
}> = [
  { id: "upcoming", label: "upcoming" },
  { id: "live", label: "live" },
  { id: "sold_out", label: "sold out" },
];

export const BREAK_RUNS: BreakRun[] = loadBreakRuns();

export const EXAMPLE_ODDS_COSMIC_SURGE: BreakOddsTier[] =
  BREAK_RUNS.find((run) => run.run_slug === "cosmic-surge")?.odds ?? [];

export function getBreakRun(slug: string | undefined): BreakRun | undefined {
  if (!slug) return undefined;
  return BREAK_RUNS.find((run) => run.run_slug === slug);
}

const STATUS_ORDER: Record<NlfBreakStatus, number> = {
  live: 0,
  upcoming: 1,
  sold_out: 2,
};

export function listBreakRuns(): BreakRun[] {
  return [...BREAK_RUNS].sort((a, b) => STATUS_ORDER[a.break_status] - STATUS_ORDER[b.break_status]);
}

export function getBreakRunSitemapPaths(): string[] {
  return ["/breaks", ...BREAK_RUNS.map((run) => `/breaks/${run.run_slug}`)];
}

export function packsLeftLabel(run: BreakRun): string {
  return `${run.packs_remaining} / ${run.total_packs}`;
}

export function packsLeftPercent(run: BreakRun): number {
  if (run.total_packs <= 0) return 0;
  return Math.max(0, Math.min(100, (run.packs_remaining / run.total_packs) * 100));
}

export function combinedGrailPercent(odds: BreakOddsTier[]): number {
  return odds
    .filter((tier) => tier.id === "grail" || tier.id === "super_grail")
    .reduce((sum, tier) => sum + tier.percent, 0);
}

export type BreakCta = {
  label: string;
  href: string | null;
  kind: NlfBreakStatus;
};

export function ctaForRun(run: BreakRun): BreakCta {
  if (run.break_status === "live") {
    return {
      label: "Live now — auction",
      href: run.whatnot_show_url || run.whatnot_listing_url,
      kind: "live",
    };
  }
  if (run.break_status === "sold_out") {
    return {
      label: "Sold out — see hit proof",
      href: run.whatnot_clip_url || run.whatnot_listing_url,
      kind: "sold_out",
    };
  }
  return {
    label: "Get spot on Whatnot",
    href: run.whatnot_listing_url || WHATNOT_INVITE_URL,
    kind: "upcoming",
  };
}

export function statusChipLabel(status: NlfBreakStatus): string {
  return BREAK_STATUS_CHIPS.find((chip) => chip.id === status)?.label ?? status;
}
