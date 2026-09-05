/**
 * Inventory Bot Shopify metafield contract for the Break Run product.
 * Namespace: `nlf`
 *
 * Live Shopify Admin is not wired yet. Typed keys and loader stubs stay
 * aligned with this contract so Inventory can drop in values later.
 *
 * Two-file R2 feed (bucket-root objects):
 *   1. breaks/runs.json — run headers; each run includes checklist_url
 *   2. breaks/checklists/{run_slug}.json — remaining checklist
 *
 * Checklist card shape uses `id` (not card_id):
 *   { id, tier: chase|grail|super_grail, imageUrl, status: available|pulled }
 * Optional (ignore in UI if absent): name, number, parallel, pulled_at,
 * spot_or_order, whatnot_clip_url.
 *
 * Packs remaining: prefer the Shopify variant inventory quantity.
 * Optional override: nlf.packs_remaining
 *
 * Later (stubs only): nlf.odds_snapshot_url, nlf.whatnot_clip_url,
 * nlf.show_date, nlf.spot_or_order
 */

export const NLF_METAFIELD_NAMESPACE = "nlf" as const;

export const NLF_BREAK_RUN_KEYS = {
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
} as const;

export type NlfBreakStatus = "upcoming" | "live" | "sold_out";

export type PacksRemainingSource =
  | "variant_inventory_quantity"
  | "nlf.packs_remaining";

/** Exact metafield keys Inventory Bot writes on the Break Run product. */
export type NlfBreakRunMetafields = {
  "nlf.run_slug": string;
  "nlf.total_packs": number;
  "nlf.packs_remaining"?: number | null;
  "nlf.break_status": NlfBreakStatus;
  "nlf.whatnot_listing_url": string;
  "nlf.whatnot_show_url": string;
  "nlf.odds_snapshot_url"?: string | null;
  "nlf.whatnot_clip_url"?: string | null;
  "nlf.show_date"?: string | null;
  "nlf.spot_or_order"?: string | null;
};

/** Gallery tiers only — commons never appear in checklist cards[]. */
export const GALLERY_TIERS = ["chase", "grail", "super_grail"] as const;
export type ChecklistTier = (typeof GALLERY_TIERS)[number];
export type ChecklistCardStatus = "available" | "pulled";

/**
 * Inventory-confirmed UI checklist item. Required: id, tier, imageUrl, status.
 * Do not read `card_id`.
 */
export type InventoryChecklistCard = {
  id: string;
  tier: ChecklistTier;
  imageUrl: string;
  status: ChecklistCardStatus;
  name?: string;
  number?: string;
  parallel?: string;
  pulled_at?: string;
  spot_or_order?: string;
  whatnot_clip_url?: string;
};

export type InventoryChecklistFile = {
  updated_at: string;
  run_slug: string;
  skip_commons: true;
  example?: boolean;
  cards: InventoryChecklistCard[];
};

export const R2_PUBLIC_BASE = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev";
export const RUNS_R2_OBJECT = "breaks/runs.json";
export const CHECKLIST_R2_OBJECT = (slug: string) => `breaks/checklists/${slug}.json`;

export function runsR2Url(): string {
  return `${R2_PUBLIC_BASE}/${RUNS_R2_OBJECT}`;
}

export function checklistR2Url(slug: string): string {
  return `${R2_PUBLIC_BASE}/${CHECKLIST_R2_OBJECT(slug)}`;
}

export function checklistFallbackPath(slug: string): string {
  return `/data/breaks/checklists/${slug}.json`;
}

export function emptyChecklist(runSlug: string): InventoryChecklistFile {
  return {
    updated_at: "",
    run_slug: runSlug,
    skip_commons: true,
    cards: [],
  };
}

export function isGalleryTier(tier: string): tier is ChecklistTier {
  return (GALLERY_TIERS as readonly string[]).includes(tier);
}

export function hasCardArt(card: Pick<InventoryChecklistCard, "imageUrl">): boolean {
  return card.imageUrl.trim().length > 0;
}

export function parseChecklistCards(file: InventoryChecklistFile | null | undefined): InventoryChecklistCard[] {
  if (!file || !Array.isArray(file.cards)) return [];
  const cards: InventoryChecklistCard[] = [];
  for (const raw of file.cards) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    // Required Inventory UI shape — id, not card_id.
    if (typeof row.id !== "string" || !row.id) continue;
    if (typeof row.tier !== "string" || !isGalleryTier(row.tier)) continue;
    if (typeof row.imageUrl !== "string") continue;
    if (row.status !== "available" && row.status !== "pulled") continue;
    const card: InventoryChecklistCard = {
      id: row.id,
      tier: row.tier,
      imageUrl: row.imageUrl,
      status: row.status,
    };
    if (typeof row.name === "string") card.name = row.name;
    if (typeof row.number === "string") card.number = row.number;
    if (typeof row.parallel === "string") card.parallel = row.parallel;
    if (typeof row.pulled_at === "string") card.pulled_at = row.pulled_at;
    if (typeof row.spot_or_order === "string") card.spot_or_order = row.spot_or_order;
    if (typeof row.whatnot_clip_url === "string") card.whatnot_clip_url = row.whatnot_clip_url;
    cards.push(card);
  }
  return cards;
}

export function galleryCards(cards: InventoryChecklistCard[]): InventoryChecklistCard[] {
  return cards.filter((card) => isGalleryTier(card.tier));
}

export function remainingByTier(cards: InventoryChecklistCard[]): Record<ChecklistTier, number> {
  const counts: Record<ChecklistTier, number> = {
    chase: 0,
    grail: 0,
    super_grail: 0,
  };
  for (const card of galleryCards(cards)) {
    if (card.status === "available") counts[card.tier] += 1;
  }
  return counts;
}

/** Public Inventory Bot feed row — `/data/breaks/runs.json` (and R2 breaks/runs.json). */
export type InventoryBreakRunRow = {
  run_slug: string;
  title: string;
  tier_label: string;
  blurb: string;
  total_packs: number;
  packs_remaining: number;
  status: NlfBreakStatus;
  whatnot_listing_url: string;
  whatnot_show_url: string;
  whatnot_clip_url?: string | null;
  odds_snapshot_url?: string | null;
  show_date?: string | null;
  spot_or_order?: string | null;
  product_id: string | null;
  variant_id: string | null;
  pack_art_url: string | null;
  checklist_url: string;
  odds: ShopifyBreakRunRecord["odds"];
};

export type InventoryBreaksFeed = {
  updated_at: string;
  example: boolean;
  shopify_admin_wired: boolean;
  runs: InventoryBreakRunRow[];
};

export const BREAKS_FEED_PATH = "/data/breaks/runs.json";

export function inventoryRowToMetafieldRecord(
  row: InventoryBreakRunRow
): ShopifyBreakRunRecord {
  return {
    product_id: row.product_id,
    variant_id: row.variant_id,
    variant_inventory_quantity: row.packs_remaining,
    "nlf.run_slug": row.run_slug,
    "nlf.total_packs": row.total_packs,
    "nlf.packs_remaining": null,
    "nlf.break_status": row.status,
    "nlf.whatnot_listing_url": row.whatnot_listing_url,
    "nlf.whatnot_show_url": row.whatnot_show_url,
    "nlf.odds_snapshot_url": row.odds_snapshot_url ?? null,
    "nlf.whatnot_clip_url": row.whatnot_clip_url ?? null,
    "nlf.show_date": row.show_date ?? null,
    "nlf.spot_or_order": row.spot_or_order ?? null,
    title: row.title,
    tier_label: row.tier_label,
    blurb: row.blurb,
    pack_art_url: row.pack_art_url,
    example: true,
    odds: row.odds,
    checklist_url: row.checklist_url,
    skip_commons: true,
    checklist: [],
  };
}

export function attachChecklist(
  record: ShopifyBreakRunRecord,
  file: InventoryChecklistFile | null | undefined
): ShopifyBreakRunRecord {
  return {
    ...record,
    skip_commons: true,
    checklist: parseChecklistCards(file),
  };
}

export type ShopifyNativeIds = {
  product_id: string | null;
  variant_id: string | null;
  variant_inventory_quantity: number | null;
};

export type ShopifyBreakRunRecord = ShopifyNativeIds &
  NlfBreakRunMetafields & {
    title: string;
    tier_label: string;
    blurb: string;
    pack_art_url: string | null;
    example: true;
    odds: Array<{
      id: "common" | "chase" | "grail" | "super_grail";
      label: string;
      qty: number;
      percent: number;
      value_band: string;
    }>;
    checklist_url: string;
    skip_commons: true;
    checklist: InventoryChecklistCard[];
  };

/** Page view model — metafield keys plus resolved packs remaining. */
export type BreakRun = {
  product_id: string | null;
  variant_id: string | null;
  run_slug: string;
  title: string;
  tier_label: string;
  blurb: string;
  total_packs: number;
  packs_remaining: number;
  packs_remaining_source: PacksRemainingSource;
  break_status: NlfBreakStatus;
  example: true;
  pack_art_url: string | null;
  pack_art_alt: string;
  whatnot_listing_url: string;
  whatnot_show_url: string;
  odds_snapshot_url: string | null;
  whatnot_clip_url: string | null;
  show_date: string | null;
  spot_or_order: string | null;
  odds: ShopifyBreakRunRecord["odds"];
  checklist_url: string;
  skip_commons: true;
  checklist: InventoryChecklistCard[];
};

export function resolvePacksRemaining(record: ShopifyBreakRunRecord): {
  packs_remaining: number;
  packs_remaining_source: PacksRemainingSource;
} {
  const override = record["nlf.packs_remaining"];
  if (override != null) {
    return { packs_remaining: override, packs_remaining_source: "nlf.packs_remaining" };
  }
  return {
    packs_remaining: record.variant_inventory_quantity ?? 0,
    packs_remaining_source: "variant_inventory_quantity",
  };
}
