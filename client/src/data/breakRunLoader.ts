/**
 * Break-run loader.
 *
 * Two-file Inventory feed:
 *   1. Try R2 breaks/runs.json, then repo fallback /data/breaks/runs.json
 *   2. For each run, fetch checklist_url, then /data/breaks/checklists/{slug}.json,
 *      then the R2 checklist object
 *
 * Live Shopify Admin is not wired yet — static EXAMPLE Cosmic Surge copy
 * until Inventory feeds values. Checklist cards use id (not card_id).
 *
 * When Admin is wired, keep the same Inventory feed shape and map through
 * nlf metafield keys: nlf.run_slug, nlf.total_packs, nlf.break_status,
 * nlf.whatnot_listing_url, nlf.whatnot_show_url, product_id, variant_id.
 * Packs remaining prefer variant inventory unless nlf.packs_remaining is set.
 */

import feedFile from "../../public/data/breaks/runs.json";
import exampleCosmicSurgeChecklist from "../../public/data/breaks/checklists/example-cosmic-surge.json";
import nebulaVaultChecklist from "../../public/data/breaks/checklists/nebula-vault.json";
import afterglowCaseChecklist from "../../public/data/breaks/checklists/afterglow-case.json";
import {
  BREAKS_FEED_PATH,
  attachChecklist,
  checklistFallbackPath,
  checklistR2Url,
  inventoryRowToMetafieldRecord,
  runsR2Url,
  type BreakRun,
  type InventoryBreaksFeed,
  type InventoryBreakRunRow,
  type InventoryChecklistFile,
  type ShopifyBreakRunRecord,
} from "./nlfBreakRunContract";
import { mapRecordToBreakRun } from "./breakRunMap";

const FEED = feedFile as InventoryBreaksFeed;

const LOCAL_CHECKLISTS: Record<string, InventoryChecklistFile> = {
  "example-cosmic-surge": exampleCosmicSurgeChecklist as InventoryChecklistFile,
  "nebula-vault": nebulaVaultChecklist as InventoryChecklistFile,
  "afterglow-case": afterglowCaseChecklist as InventoryChecklistFile,
};

export const SHOPIFY_ADMIN_WIRED = FEED.shopify_admin_wired;
export const BREAKS_FEED_UPDATED_AT = FEED.updated_at;

export function loadInventoryBreaksFeed(): InventoryBreaksFeed {
  if (!FEED.updated_at || !Array.isArray(FEED.runs)) {
    throw new Error("Inventory breaks feed must include updated_at and runs");
  }
  return FEED;
}

function recordWithLocalChecklist(row: InventoryBreakRunRow): ShopifyBreakRunRecord {
  return attachChecklist(
    inventoryRowToMetafieldRecord(row),
    LOCAL_CHECKLISTS[row.run_slug] ?? null
  );
}

export function loadShopifyBreakRunRecords(): ShopifyBreakRunRecord[] {
  return loadInventoryBreaksFeed().runs.map(recordWithLocalChecklist);
}

export function loadBreakRuns(): BreakRun[] {
  return loadShopifyBreakRunRecords().map(mapRecordToBreakRun);
}

async function fetchFirstJson<T>(urls: string[]): Promise<T | null> {
  const seen = new Set<string>();
  for (const url of urls) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      return (await res.json()) as T;
    } catch {
      // R2 may 404 or CORS-fail until Inventory publishes — try the next URL.
    }
  }
  return null;
}

export async function fetchChecklistFile(
  row: Pick<InventoryBreakRunRow, "run_slug" | "checklist_url">
): Promise<InventoryChecklistFile | null> {
  return fetchFirstJson<InventoryChecklistFile>([
    row.checklist_url,
    checklistFallbackPath(row.run_slug),
    checklistR2Url(row.run_slug),
  ]);
}

export async function fetchBreaksFeed(): Promise<{
  updated_at: string;
  runs: BreakRun[];
}> {
  const data =
    (await fetchFirstJson<InventoryBreaksFeed>([runsR2Url(), BREAKS_FEED_PATH])) ??
    loadInventoryBreaksFeed();
  if (!data.updated_at || !Array.isArray(data.runs)) {
    throw new Error(`Failed to load ${BREAKS_FEED_PATH}`);
  }
  const runs = await Promise.all(
    data.runs.map(async (row) => {
      const checklist = await fetchChecklistFile(row);
      return mapRecordToBreakRun(
        attachChecklist(inventoryRowToMetafieldRecord(row), checklist)
      );
    })
  );
  return { updated_at: data.updated_at, runs };
}
