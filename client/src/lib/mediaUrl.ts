const CLOUDFRONT = /^https?:\/\/[^/]*cloudfront\.net/i;
const MANUS_FILE = /(?:https?:\/\/[^/]+)?\/manus-storage\/(.+)$/i;
const LOCAL_CARD = /^\/(studios|mcs|mint2026|mint-backs|cbh)\//i;
const DEFAULT_BASE = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev";
const R2_PREFIX = "310419663027009739/SGHqXeh8PZJcCDnFiAMuFi";
const CF_BASE = "https://d2xsxph8kpxj0f.cloudfront.net";

/** Filenames that 404 on R2 but are still live on CloudFront. */
const CF_FALLBACK = new Set([
  "C-10_front_0ebad520.webp",
  "C-A_front_175ac9e0.webp",
  "C-J_front_513c0568.webp",
  "C-9_front_4bbe8bc3.webp",
  "C-Q_front_0d8f0dcd.webp",
  "C-K_front_e6aa9dc5.webp",
  "CBH-002_Captain_America_9fb636d3.webp",
  "CBH-010_Hulk_5021737a.webp",
  "CBH-013_Iron_Man_185446b3.webp",
  "CBH-011_Human_Torch_63626d10.webp",
  "CBH-021_Namor_083abd08.webp",
  "CBH-024_The_Thing_b6ab8fe6.webp",
  "CBH-025_Thor_e699fbe8.webp",
  "CBH-036_Doctor_Strange_d7ffaca0.webp",
  "CBH-148_Wolverine_6575e9cd.webp",
  "CBH-142_Spider-Man_1b89e31c.webp",
  "CBH-117_Gambit_8bcc2f45.webp",
  "CHROME-159_Shang-Chi_40d93a82.webp",
  "CBH-078_Loki_37e7f6a0.webp",
  "professor-x_fa6a6e7a.png",
]);

/** Missing article files whose recovered stand-ins were not Marvel-accurate. Hide; do not substitute. */
const HIDE_BROKEN = new Set([
  "secret-wars-1984-battleworld-kVKCjJvVkMQxpBz2YzjGKa.webp",
  "wolv-spidey-split-poster-v2_c6c00c2e.jpg",
  "events-wccs-7fUNnxDMYRVLQmYLhJLqQV.webp",
]);

function fileName(path) {
  return String(path || "").split("?")[0].split("/").pop() || "";
}

/** Resolve a card/media URL. Pass width for set-grid thumbs of local scans. */
export function mediaUrl(url, width) {
  if (!url) return "";
  if (HIDE_BROKEN.has(fileName(url))) return "";
  const base = String(import.meta.env.VITE_MEDIA_PUBLIC_BASE || DEFAULT_BASE).replace(/\/$/, "");
  const clean = String(url).split("?")[0];
  const manus = clean.match(MANUS_FILE);
  let out = clean;
  if (manus) {
    const file = manus[1];
    const name = fileName(file);
    out = CF_FALLBACK.has(name)
      ? `${CF_BASE}/${R2_PREFIX}/${file}`
      : `${base}/${R2_PREFIX}/${file}`;
  } else if (CLOUDFRONT.test(clean)) {
    const name = fileName(clean);
    out = CF_FALLBACK.has(name) ? clean : clean.replace(CLOUDFRONT, base);
  } else if (CF_FALLBACK.has(fileName(clean)) && clean.includes(R2_PREFIX)) {
    out = `${CF_BASE}/${R2_PREFIX}/${fileName(clean)}`;
  }
  const w = Number(width);
  if (w && LOCAL_CARD.test(out) && w >= 80 && w <= 800) {
    out = `${out}?w=${Math.round(w)}`;
  }
  return out;
}
