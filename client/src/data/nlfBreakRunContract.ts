/**
 * Inventory Bot Shopify metafield contract for the Break Run product.
 * Namespace: `nlf`
 *
 * Live Shopify Admin is not wired yet. Typed keys and loader stubs stay
 * aligned with this contract so Inventory can drop in values later.
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

/** Public Inventory Bot feed row — `/data/breaks/runs.json`. */
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
  odds: ShopifyBreakRunRecord["odds"];
  checklist: ShopifyBreakRunRecord["checklist"];
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
    checklist: row.checklist,
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
    checklist: Array<{ name: string; tier: "common" | "chase" | "grail" | "super_grail" }>;
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
  checklist: ShopifyBreakRunRecord["checklist"];
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
