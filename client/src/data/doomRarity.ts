/**
 * Doctor Doom Card Research v1 — rarity hub types + live set links.
 * Numbers live only in /data/doom/rarity-index.json. Do not invent totals.
 */

export const DOOM_RARITY_INDEX_PATH = "/data/doom/rarity-index.json";

export type ConfidenceLevel = "Official" | "Calculated" | "Estimated";

export type DoomRarityChip = {
  label: string;
  value: string;
  confidence: ConfidenceLevel;
};

export type DoomRarityTier = {
  id: string;
  label: string;
  confidence: ConfidenceLevel;
  distinct: number;
  physical: number | null;
  pct_of_benchmark?: number;
  notes?: string;
};

export type DoomRarityFamily = {
  id: string;
  label: string;
  rule: string;
  confidence: ConfidenceLevel;
  owner?: string;
  catalog?: string;
  approx_unique?: number;
  exact_count_aug26?: number;
  notes?: string;
};

export type DoomSapphireOdd = {
  parallel: string;
  serial: string;
  pack_odds: string;
  confidence: ConfidenceLevel;
  odds_scope?: string;
};

export type DoomCardEstimate = {
  card: string;
  formula: string;
  estimate: string;
  confidence: ConfidenceLevel;
};

export type DoomKeyPull = {
  set: string;
  card: string;
  parallel: string;
  print_or_odds: string;
  confidence: ConfidenceLevel;
  notes?: string;
};

export type DoomRarityIndex = {
  updated_at: string;
  source: {
    primary: string;
    ingest: string;
    status: string;
    publish_surface: string;
    master_set_layer: boolean;
    forced_complete: boolean;
    comic_cuts_lane: string;
  };
  identity_rules: {
    include: string[];
    exclude: string[];
    notes: string;
  };
  benchmark: {
    physical_total: number;
    accounted: number;
    accounted_pct: number;
    gap: number;
    research_progress_note: string;
    confidence: ConfidenceLevel;
    physical_total_confidence: ConfidenceLevel;
  };
  confidence_defs: Record<ConfidenceLevel, string>;
  families: DoomRarityFamily[];
  tiers: DoomRarityTier[];
  open_tiers: {
    notes: string;
    blockers: string[];
  };
  sapphire_2026_odds: DoomSapphireOdd[];
  specific_card_estimates: DoomCardEstimate[];
  key_pulls: DoomKeyPull[];
  ui_chips: DoomRarityChip[];
  provisional_banner: string;
  links: {
    character_page: string;
    comic_cuts_history: string;
    comic_cuts_catalog: string;
    set_pages: string[];
    exclude_character_slugs: string[];
  };
};

const CONFIDENCE: ReadonlySet<string> = new Set(["Official", "Calculated", "Estimated"]);

export function isDoomRarityIndex(value: unknown): value is DoomRarityIndex {
  if (!value || typeof value !== "object") return false;
  const index = value as DoomRarityIndex;
  return (
    typeof index.updated_at === "string" &&
    typeof index.provisional_banner === "string" &&
    Array.isArray(index.ui_chips) &&
    Array.isArray(index.tiers) &&
    Array.isArray(index.families) &&
    Array.isArray(index.sapphire_2026_odds) &&
    Array.isArray(index.key_pulls) &&
    !!index.links &&
    Array.isArray(index.links.set_pages) &&
    typeof index.links.comic_cuts_history === "string" &&
    typeof index.links.comic_cuts_catalog === "string" &&
    !!index.source &&
    index.source.publish_surface === "/characters/doctor-doom" &&
    index.source.forced_complete === false
  );
}

export function isMethodExamplePull(pull: DoomKeyPull): boolean {
  return /^example method/i.test(pull.set) || /method example/i.test(pull.notes ?? "");
}

export function formatPhysical(physical: number | null | undefined): string {
  if (physical == null) return "pending";
  return String(physical);
}

/** Display label from a live /cards/:slug path — no invented census numbers. */
export function setPageLabel(href: string): string {
  const slug = href.replace(/^\/cards\//, "");
  const labels: Record<string, string> = {
    "2026-topps-marvel-mint": "2026 Marvel Mint",
    "2026-topps-chrome-marvel-comics": "2026 Chrome Marvel",
    "2025-topps-chrome": "2025 Chrome",
    "2025-topps-marvel-mint": "2025 Marvel Mint",
    "2025-topps-marvel-sapphire": "2025 Sapphire",
    "2024-topps-chrome-sapphire-marvel": "2024 Chrome Sapphire",
    "2024-topps-chrome-marvel": "2024 Chrome Marvel",
  };
  return labels[slug] ?? slug.replace(/-/g, " ");
}

export function chipHref(
  chip: DoomRarityChip,
  links: DoomRarityIndex["links"]
): string | null {
  const label = chip.label.toLowerCase();
  if (label.includes("comic cut")) return links.comic_cuts_history;
  if (label.includes("sapphire")) {
    return (
      links.set_pages.find((href) => href.includes("2026-topps-chrome-marvel-comics")) ??
      null
    );
  }
  return null;
}

export function identityPageHref(name: string): string | null {
  const slug = name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (slug === "doom-2099" || slug === "doomasaur") return `/characters/${slug}`;
  return null;
}

export function isConfidenceLevel(value: string): value is ConfidenceLevel {
  return CONFIDENCE.has(value);
}
