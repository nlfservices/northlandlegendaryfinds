import {
  NLF_BREAK_RUN_KEYS,
  type BreakRun,
  type ShopifyBreakRunRecord,
  resolvePacksRemaining,
} from "./nlfBreakRunContract";

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
