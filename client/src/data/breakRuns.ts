/**
 * Whatnot-only break-run catalog.
 *
 * Editable sample data so Inventory metafields can replace this later.
 * Field names match the planned metafield keys:
 *   run_slug, total_packs, packs_remaining, status,
 *   whatnot_* URLs, odds, checklist.
 *
 * No .com commerce — CTAs deep-link to Whatnot only.
 */

export const WHATNOT_INVITE_URL = "https://whatnot.com/invite/northlandfinds";
export const WHATNOT_PROFILE_URL = "https://www.whatnot.com/user/northlandfinds";

/** Placeholder livestream URL until a real Whatnot show id is wired. */
export const WHATNOT_SHOW_PLACEHOLDER_URL = "https://www.whatnot.com/user/northlandfinds";

export type BreakRunStatus = "upcoming" | "live" | "sold_out";

export type OddsTierId = "common" | "chase" | "grail" | "super_grail";

export type BreakOddsTier = {
  id: OddsTierId;
  label: string;
  qty: number;
  percent: number;
  /** Sample collector value band — replace with Inventory metafields later. */
  value_band: string;
};

export type BreakChecklistItem = {
  name: string;
  tier: OddsTierId;
  /** Placeholder names must stay marked SAMPLE until official lists land. */
  sample: true;
};

export type BreakRun = {
  run_slug: string;
  title: string;
  blurb: string;
  total_packs: number;
  packs_remaining: number;
  status: BreakRunStatus;
  /** Null hides art — never invent card photos. */
  pack_art_url: string | null;
  pack_art_alt: string;
  whatnot_invite_url: string;
  whatnot_profile_url: string;
  whatnot_show_url: string;
  hit_proof_url: string;
  odds: BreakOddsTier[];
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

/** Blez Marvel Plus-style sample table (77.78 / 15 / 5 / 2.22). */
export const SAMPLE_ODDS_BLEZ: BreakOddsTier[] = [
  { id: "common", label: "Common", qty: 233, percent: 77.78, value_band: "$5–$20" },
  { id: "chase", label: "Chase", qty: 45, percent: 15, value_band: "$25–$80" },
  { id: "grail", label: "Grail", qty: 15, percent: 5, value_band: "$100–$250" },
  { id: "super_grail", label: "Super Grail", qty: 7, percent: 2.22, value_band: "$400+" },
];

const SAMPLE_CHECKLIST: BreakChecklistItem[] = [
  { name: "SAMPLE — Spider-Man Chrome Base", tier: "common", sample: true },
  { name: "SAMPLE — Storm Cosmic Refractor", tier: "chase", sample: true },
  { name: "SAMPLE — Wolverine Gold /50", tier: "grail", sample: true },
  { name: "SAMPLE — Doctor Doom Superfractor 1/1", tier: "super_grail", sample: true },
];

export const BREAK_RUNS: BreakRun[] = [
  {
    run_slug: "cosmic-surge",
    title: "Cosmic Surge",
    blurb: "Marvel Topps mix. 300 packs. Spots on Whatnot only.",
    total_packs: 300,
    packs_remaining: 300,
    status: "upcoming",
    pack_art_url: null,
    pack_art_alt: "Pack art pending — Cosmic Surge",
    whatnot_invite_url: WHATNOT_INVITE_URL,
    whatnot_profile_url: WHATNOT_PROFILE_URL,
    whatnot_show_url: WHATNOT_SHOW_PLACEHOLDER_URL,
    hit_proof_url: WHATNOT_PROFILE_URL,
    odds: SAMPLE_ODDS_BLEZ,
    checklist: SAMPLE_CHECKLIST,
  },
  {
    run_slug: "nebula-vault",
    title: "Nebula Vault",
    blurb: "SAMPLE live table. Auction on Whatnot — not on this site.",
    total_packs: 300,
    packs_remaining: 184,
    status: "live",
    pack_art_url: null,
    pack_art_alt: "Pack art pending — Nebula Vault",
    whatnot_invite_url: WHATNOT_INVITE_URL,
    whatnot_profile_url: WHATNOT_PROFILE_URL,
    whatnot_show_url: WHATNOT_SHOW_PLACEHOLDER_URL,
    hit_proof_url: WHATNOT_PROFILE_URL,
    odds: SAMPLE_ODDS_BLEZ,
    checklist: SAMPLE_CHECKLIST,
  },
  {
    run_slug: "afterglow-case",
    title: "Afterglow Case",
    blurb: "SAMPLE sold-out run. Hit proof lives on Whatnot.",
    total_packs: 300,
    packs_remaining: 0,
    status: "sold_out",
    pack_art_url: null,
    pack_art_alt: "Pack art pending — Afterglow Case",
    whatnot_invite_url: WHATNOT_INVITE_URL,
    whatnot_profile_url: WHATNOT_PROFILE_URL,
    whatnot_show_url: WHATNOT_SHOW_PLACEHOLDER_URL,
    hit_proof_url: WHATNOT_PROFILE_URL,
    odds: SAMPLE_ODDS_BLEZ,
    checklist: SAMPLE_CHECKLIST,
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
