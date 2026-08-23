const CLOUDFRONT = /^https?:\/\/[^/]*cloudfront\.net/i;

export function mediaUrl(url) {
  if (!url) return '';
  const base = String(import.meta.env.VITE_MEDIA_PUBLIC_BASE || '').replace(/\/$/, '');
  const clean = url.split('?')[0];
  if (!base || !CLOUDFRONT.test(clean)) return clean;
  return clean.replace(CLOUDFRONT, base);
}
