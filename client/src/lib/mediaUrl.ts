const CLOUDFRONT = /^https?:\/\/[^/]*cloudfront\.net/i;
const MANUS_FILE = /(?:https?:\/\/[^/]+)?\/manus-storage\/(.+)$/i;
const LOCAL_CARD = /^\/(studios|mcs|mint2026|mint-backs|cbh)\//i;
const DEFAULT_BASE = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev";
const R2_PREFIX = "310419663027009739/SGHqXeh8PZJcCDnFiAMuFi";

/** Resolve a card/media URL. Pass width for set-grid thumbs of local scans. */
export function mediaUrl(url, width) {
  if (!url) return "";
  const base = String(import.meta.env.VITE_MEDIA_PUBLIC_BASE || DEFAULT_BASE).replace(/\/$/, "");
  const clean = String(url).split("?")[0];
  const manus = clean.match(MANUS_FILE);
  let out = clean;
  if (manus) out = `${base}/${R2_PREFIX}/${manus[1]}`;
  else if (CLOUDFRONT.test(clean)) out = clean.replace(CLOUDFRONT, base);
  const w = Number(width);
  if (w && LOCAL_CARD.test(out) && w >= 80 && w <= 800) {
    out = `${out}?w=${Math.round(w)}`;
  }
  return out;
}
