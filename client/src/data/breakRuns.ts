/**
 * Whatnot-only break-run catalog.
 *
 * Super Grok SAMPLE COPY for the Cosmic Surge shell.
 * Everything is EXAMPLE until Pat / Inventory confirm.
 *
 * Field names match planned Inventory metafields:
 *   run_slug, total_packs, packs_remaining, status,
 *   tier_label, whatnot_* URLs, odds, checklist.
 *
 * .com adaptation: rundown pages only. CTAs deep-link to Whatnot.
 */

export const WHATNOT_INVITE_URL = "https://whatnot.com/invite/northlandfinds";
export const WHATNOT_PROFILE_URL = "https://www.whatnot.com/user/northlandfinds";

/** Placeholder livestream URL until a real Whatnot show id is wired. */
export const WHATNOT_SHOW_PLACEHOLDER_URL = "https://www.whatnot.com/user/northlandfinds";

export const INDEX_HEADER_CHIP = "INFINITY PACKS / break runs — Whatnot only.";

/** Scannable odds beat — EXAMPLE until Inventory confirms. */
export const EXAMPLE_ODDS_LINE =
  "Super Grail 2.22% · Grail 5% · Chase 15% · Common 77.78% (combined grail 7.22%) — EXAMPLE.";

export const CHECKLIST_COMING_SOON = "Checklist (coming soon)";

export type BreakRunStatus = "upcoming" | "live" | "sold_out";

export type OddsTierId = "common" | "chase" | "grail" | "super_grail";

export type BreakOddsTier = {
  id: OddsTierId;
  label: string;
  qty: number;
  percent: number;
  /** EXAMPLE value band — replace with Inventory metafields later. */
  value_band: string;
};

export type BreakChecklistItem = {
  name: string;
  tier: OddsTierId;
};

export type BreakRun = {
  run_slug: string;
  title: string;
  tier_label: string;
  blurb: string;
  total_packs: number;
  packs_remaining: number;
  status: BreakRunStatus;
  /** True until Pat / Inventory confirm live numbers. */
  example: true;
  /** Null hides art — never invent card photos. */
  pack_art_url: string | null;
  pack_art_alt: string;
  whatnot_invite_url: string;
  whatnot_profile_url: string;
  whatnot_show_url: string;
  hit_proof_url: string;
  odds: BreakOddsTier[];
  /** Empty until official lists land — do not invent card names. */
  checklist: BreakChecklistItem[];
};

export const BREAK_STATUS_CHIPS: ReadonlyArray<{
  id: BreakRunStatus;
  label: string;
}> = [
  { id: "upcoming", label: "upcoming" },
  { id: "live", label: "live" },
  { id: "sold_out", label: "sold out" },
];

/** Super Grok Cosmic Surge odds table — EXAMPLE (400 packs). */
export const EXAMPLE_ODDS_COSMIC_SURGE: BreakOddsTier[] = [
  { id: "common", label: "Common", qty: 311, percent: 77.78, value_band: "$15–33" },
  { id: "chase", label: "Chase", qty: 60, percent: 15, value_band: "$45–88" },
  { id: "grail", label: "Grail", qty: 20, percent: 5, value_band: "$90–129" },
  { id: "super_grail", label: "Super Grail", qty: 9, percent: 2.22, value_band: "$150–520" },
];

export const BREAK_RUNS: BreakRun[] = [
  {
    run_slug: "cosmic-surge",
    title: "Cosmic Surge",
    tier_label: "Entry",
    blurb: "Entry Infinity Pack run — Guardians, street heat, and solid floors.",
    total_packs: 400,
    packs_remaining: 400,
    status: "upcoming",
    example: true,
    pack_art_url: null,
    pack_art_alt: "Pack art pending — Cosmic Surge (EXAMPLE)",
    whatnot_invite_url: WHATNOT_INVITE_URL,
    whatnot_profile_url: WHATNOT_PROFILE_URL,
    whatnot_show_url: WHATNOT_SHOW_PLACEHOLDER_URL,
    hit_proof_url: WHATNOT_PROFILE_URL,
    odds: EXAMPLE_ODDS_COSMIC_SURGE,
    checklist: [],
  },
  {
    run_slug: "nebula-vault",
    title: "Nebula Vault",
    tier_label: "Entry",
    blurb: "EXAMPLE live shell. Auction on Whatnot — not on this site.",
    total_packs: 400,
    packs_remaining: 184,
    status: "live",
    example: true,
    pack_art_url: null,
    pack_art_alt: "Pack art pending — Nebula Vault (EXAMPLE)",
    whatnot_invite_url: WHATNOT_INVITE_URL,
    whatnot_profile_url: WHATNOT_PROFILE_URL,
    whatnot_show_url: WHATNOT_SHOW_PLACEHOLDER_URL,
    hit_proof_url: WHATNOT_PROFILE_URL,
    odds: EXAMPLE_ODDS_COSMIC_SURGE,
    checklist: [],
  },
  {
    run_slug: "afterglow-case",
    title: "Afterglow Case",
    tier_label: "Entry",
    blurb: "EXAMPLE sold-out shell. Hit proof lives on Whatnot.",
    total_packs: 400,
    packs_remaining: 0,
    status: "sold_out",
    example: true,
    pack_art_url: null,
    pack_art_alt: "Pack art pending — Afterglow Case (EXAMPLE)",
    whatnot_invite_url: WHATNOT_INVITE_URL,
    whatnot_profile_url: WHATNOT_PROFILE_URL,
    whatnot_show_url: WHATNOT_SHOW_PLACEHOLDER_URL,
    hit_proof_url: WHATNOT_PROFILE_URL,
    odds: EXAMPLE_ODDS_COSMIC_SURGE,
    checklist: [],
  },
];

export function getBreakRun(slug: string | undefined): BreakRun | undefined {
  if (!slug) return undefined;
  return BREAK_RUNS.find((run) => run.run_slug === slug);
}

const STATUS_ORDER: Record<BreakRunStatus, number> = {
  live: 0,
  upcoming: 1,
  sold_out: 2,
};

export function listBreakRuns(): BreakRun[] {
  return [...BREAK_RUNS].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
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
  kind: "upcoming" | "live" | "sold_out";
};

export function ctaForRun(run: BreakRun): BreakCta {
  if (run.status === "live") {
    return {
      label: "Live now — auction",
      href: run.whatnot_show_url || run.whatnot_profile_url,
      kind: "live",
    };
  }
  if (run.status === "sold_out") {
    return {
      label: "Sold out — see hit proof",
      href: run.hit_proof_url || run.whatnot_profile_url,
      kind: "sold_out",
    };
  }
  return {
    label: "Get spot on Whatnot",
    href: run.whatnot_invite_url || WHATNOT_INVITE_URL,
    kind: "upcoming",
  };
}

export function statusChipLabel(status: BreakRunStatus): string {
  return BREAK_STATUS_CHIPS.find((chip) => chip.id === status)?.label ?? status;
}
