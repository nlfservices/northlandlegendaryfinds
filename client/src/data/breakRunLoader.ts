/**
 * Break-run loader.
 *
 * Pages load the Inventory Bot placeholder feed at /data/breaks/runs.json
 * (`updated_at` + `runs`). Live Shopify Admin is not wired yet — this file
 * is static EXAMPLE Cosmic Surge copy until Inventory feeds values.
 *
 * When Admin is wired, keep the same Inventory feed shape and map through
 * nlf metafield keys: nlf.run_slug, nlf.total_packs, nlf.break_status,
 * nlf.whatnot_listing_url, nlf.whatnot_show_url, product_id, variant_id.
 * Packs remaining prefer variant inventory unless nlf.packs_remaining is set.
 */

import feedFile from "../../public/data/breaks/runs.json";
import {
  BREAKS_FEED_PATH,
  inventoryRowToMetafieldRecord,
  type BreakRun,
  type InventoryBreaksFeed,
  type ShopifyBreakRunRecord,
} from "./nlfBreakRunContract";
import { mapRecordToBreakRun } from "./breakRunMap";

const FEED = feedFile as InventoryBreaksFeed;

export const SHOPIFY_ADMIN_WIRED = FEED.shopify_admin_wired;
export const BREAKS_FEED_UPDATED_AT = FEED.updated_at;

export function loadInventoryBreaksFeed(): InventoryBreaksFeed {
  if (!FEED.updated_at || !Array.isArray(FEED.runs)) {
    throw new Error("Inventory breaks feed must include updated_at and runs");
  }
  return FEED;
}

export function loadShopifyBreakRunRecords(): ShopifyBreakRunRecord[] {
  return loadInventoryBreaksFeed().runs.map(inventoryRowToMetafieldRecord);
}

export function loadBreakRuns(): BreakRun[] {
  return loadShopifyBreakRunRecords().map(mapRecordToBreakRun);
}

export async function fetchBreaksFeed(): Promise<{
  updated_at: string;
  runs: BreakRun[];
}> {
  const res = await fetch(BREAKS_FEED_PATH);
  if (!res.ok) {
    throw new Error(`Failed to load ${BREAKS_FEED_PATH}`);
  }
  const data = (await res.json()) as InventoryBreaksFeed;
  return {
    updated_at: data.updated_at,
    runs: data.runs.map((row) => mapRecordToBreakRun(inventoryRowToMetafieldRecord(row))),
  };
}
