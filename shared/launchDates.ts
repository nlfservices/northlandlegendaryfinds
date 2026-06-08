/**
 * Product launch dates — shared between server and frontend
 * Keyed by product slug (dbSlug or checklistSlug)
 * Checklist data is only served after the launch date
 */
export const PRODUCT_LAUNCH_DATES: Record<string, string> = {
  // Gambit's Deck — April 24, 2026
  "nlf-marvel-52-singles": "2026-04-24T00:00:00Z",
  // Variant Series: Cosmic Drop — April 28, 2026
  "nlf-marvel-500-whatnot": "2026-04-28T00:00:00Z",
  // Variant Series: Chrome Edition — April 28, 2026
  "nlf-marvel-100-series": "2026-04-28T00:00:00Z",
  // NLF Infinity Series #1 — May 27, 2026 (finalized/sealed)
  "nlf-infinity-series-1": "2026-05-27T00:00:00Z",
};

/** Check if a product's checklist should be visible based on its launch date */
export function isChecklistReleaseDatePassed(productSlug: string): boolean {
  const launchDateStr = PRODUCT_LAUNCH_DATES[productSlug];
  if (!launchDateStr) return false; // No launch date = hidden
  return new Date() >= new Date(launchDateStr);
}
