const CLOUDFRONT = /^https?:\/\/[^/]*cloudfront\.net/i;
const MANUS_FILE = /(?:https?:\/\/[^/]+)?\/manus-storage\/(.+)$/i;
const DEFAULT_BASE = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev";
const R2_PREFIX = "310419663027009739/SGHqXeh8PZJcCDnFiAMuFi";

export function mediaUrl(url) {
  if (!url) return "";
  const base = String(import.meta.env.VITE_MEDIA_PUBLIC_BASE || DEFAULT_BASE).replace(/\/$/, "");
  const clean = url.split("?")[0];
  const manus = clean.match(MANUS_FILE);
  if (manus) return `${base}/${R2_PREFIX}/${manus[1]}`;
  if (!CLOUDFRONT.test(clean)) return clean;
  return clean.replace(CLOUDFRONT, base);
}
