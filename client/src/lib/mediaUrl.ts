const CLOUDFRONT = /^https?:\/\/[^/]*cloudfront\.net/i;
const DEFAULT_BASE = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev";

export function mediaUrl(url) {
  if (!url) return "";
  const base = String(import.meta.env.VITE_MEDIA_PUBLIC_BASE || DEFAULT_BASE).replace(/\/$/, "");
  const clean = url.split("?")[0];
  if (!CLOUDFRONT.test(clean)) return clean;
  return clean.replace(CLOUDFRONT, base);
}
