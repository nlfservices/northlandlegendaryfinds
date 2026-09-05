/**
 * Break-run loader.
 *
 * Live Shopify Admin is not wired yet. This stub reads static EXAMPLE JSON
 * that matches Super Grok Cosmic Surge copy until Inventory Bot feeds
 * namespace `nlf` metafields on the Break Run product.
 *
 * When Admin is wired, replace loadShopifyBreakRunRecords() with a product
 * + variant inventory + metafields(namespace: "nlf") fetch. Keep the same
 * exact keys: nlf.run_slug, nlf.total_packs, nlf.break_status,
 * nlf.whatnot_listing_url, nlf.whatnot_show_url, product_id, variant_id.
 * Resolve packs_remaining from variant inventory unless nlf.packs_remaining
 * is set. Later: nlf.odds_snapshot_url, nlf.whatnot_clip_url, nlf.show_date,
 * nlf.spot_or_order.
 */

import exampleFile from "./breakRuns.example.json";
import {
  NLF_BREAK_RUN_KEYS,
  NLF_METAFIELD_NAMESPACE,
  type BreakRun,
  type ShopifyBreakRunRecord,
  resolvePacksRemaining,
} from "./nlfBreakRunContract";

type ExampleFile = {
  shopify_admin_wired: boolean;
  namespace: string;
  runs: ShopifyBreakRunRecord[];
};

const EXAMPLE = exampleFile as ExampleFile;

export const SHOPIFY_ADMIN_WIRED = EXAMPLE.shopify_admin_wired;

export function loadShopifyBreakRunRecords(): ShopifyBreakRunRecord[] {
  if (EXAMPLE.namespace !== NLF_METAFIELD_NAMESPACE) {
    throw new Error(`Break-run EXAMPLE namespace must be "${NLF_METAFIELD_NAMESPACE}"`);
  }
  return EXAMPLE.runs;
}

export function mapRecordToBreakRun(record: ShopifyBreakRunRecord): BreakRun {
  const { packs_remaining, packs_remaining_source } = resolvePacksRemaining(record);
  const slug = record[NLF_BREAK_RUN_KEYS.run_slug];

  return {
    product_id: record.product_id,
    variant_id: record.variant_id,
    run_slug: slug,
    title: record.title,
    tier_label: record.tier_label,
    blurb: record.blurb,
    total_packs: record[NLF_BREAK_RUN_KEYS.total_packs],
    packs_remaining,
    packs_remaining_source,
    break_status: record[NLF_BREAK_RUN_KEYS.break_status],
    example: true,
    pack_art_url: record.pack_art_url,
    pack_art_alt: record.pack_art_url
      ? record.title
      : `Pack art pending — ${record.title} (EXAMPLE)`,
    whatnot_listing_url: record[NLF_BREAK_RUN_KEYS.whatnot_listing_url],
    whatnot_show_url: record[NLF_BREAK_RUN_KEYS.whatnot_show_url],
    odds_snapshot_url: record[NLF_BREAK_RUN_KEYS.odds_snapshot_url] ?? null,
    whatnot_clip_url: record[NLF_BREAK_RUN_KEYS.whatnot_clip_url] ?? null,
    show_date: record[NLF_BREAK_RUN_KEYS.show_date] ?? null,
    spot_or_order: record[NLF_BREAK_RUN_KEYS.spot_or_order] ?? null,
    odds: record.odds,
    checklist: record.checklist,
  };
}

export function loadBreakRuns(): BreakRun[] {
  return loadShopifyBreakRunRecords().map(mapRecordToBreakRun);
}
