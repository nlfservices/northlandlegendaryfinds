/**
 * Round-robin video detail layouts.
 *
 * Mapping (stable):
 *   1. Prefer the video's index in VIDEOS (catalog order). Consecutive
 *      catalog entries therefore get consecutive templates.
 *   2. If the id is not in the catalog, fall back to a djb2-style hash of
 *      the id so a given slug always lands on the same layout.
 *
 * Shared chrome (SEO, breadcrumbs, back-to-gallery, set link) is the same
 * on every page. Only component order, density, and emphasis change.
 */

import { VIDEOS } from "./videos";

export const VIDEO_TEMPLATE_IDS = [
  "videoTopCardUnder",
  "cardHeroFirst",
  "twoColumnSplit",
  "cardLeftStrip",
  "videoFullBleed",
  "bodyIntroFirst",
  "galleryTheater",
  "stickyCardSidebar",
  "videoQuoteCard",
  "minimalBadge",
  "stackedDossier",
  "cinemaMarquee",
  "archiveCase",
  "collectorSpread",
  "invertedStack",
  "framedRelic",
] as const;

export type VideoTemplateId = (typeof VIDEO_TEMPLATE_IDS)[number];

export const VIDEO_TEMPLATE_COUNT = VIDEO_TEMPLATE_IDS.length;

/** Human-readable notes so future videos stay mapped without guessing. */
export const VIDEO_TEMPLATE_NOTES: Record<VideoTemplateId, string> = {
  videoTopCardUnder: "Video on top → card showcase under → SEO body",
  cardHeroFirst: "Card hero first → video → SEO body",
  twoColumnSplit: "Two-column (video | card) on desktop → stacked mobile → body",
  cardLeftStrip: "Card left strip + video right → body full width",
  videoFullBleed: "Video full-bleed → slim card row → long body",
  bodyIntroFirst: "Body intro blurb first → video → card specs panel",
  galleryTheater: "Card gallery-style frame → video in theater panel → stats chips → body",
  stickyCardSidebar: "Sticky card sidebar (desktop) + scrolling video/body",
  videoQuoteCard: "Video → pull-quote/highlight stats → card → body",
  minimalBadge: "Minimal header → card + print-run badge → video → dense SEO article",
  stackedDossier: "Specs banner → video → card showcase → body",
  cinemaMarquee: "Title marquee → video theater → card filmstrip → body",
  archiveCase: "Card in relic case → meta chips → video → body",
  collectorSpread: "Asymmetric card+stats left, video right → body",
  invertedStack: "Print-run hero → body lead → card → video",
  framedRelic: "Narrow relic card column, video mid, magazine body",
};

function hashVideoId(id: string): number {
  let hash = 5381;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) + hash + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function templateIndexForVideoId(id: string, catalog = VIDEOS): number {
  const catalogIndex = catalog.findIndex((video) => video.id === id);
  if (catalogIndex >= 0) {
    return catalogIndex % VIDEO_TEMPLATE_COUNT;
  }
  return hashVideoId(id) % VIDEO_TEMPLATE_COUNT;
}

export function templateIdForVideoId(id: string, catalog = VIDEOS): VideoTemplateId {
  return VIDEO_TEMPLATE_IDS[templateIndexForVideoId(id, catalog)];
}
