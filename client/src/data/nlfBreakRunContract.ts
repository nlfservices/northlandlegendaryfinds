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
