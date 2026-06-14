import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);
const slug = "comic-art-vs-actor-portrayal-marvel-card-collector-types-2025";

const [rows] = await conn.execute(
  "SELECT id, contentMarkdown, featuredImageUrl FROM articles WHERE slug = ?",
  [slug]
);

if (!rows.length) {
  console.error("Article not found!");
  process.exit(1);
}

const article = rows[0];
let content = article.contentMarkdown;

// ── Helper to build a fully SEO-optimised image block ──────────────────────
const imgBlock = (url, alt, caption, figureId) => `<figure id="${figureId}" style="text-align:center;margin:2rem 0;">
  <img
    src="${url}"
    alt="${alt}"
    title="${alt}"
    loading="lazy"
    style="max-width:480px;width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.1);"
  />
  <figcaption style="font-size:0.85rem;color:#888;margin-top:0.5rem;">${caption}</figcaption>
</figure>`;

// ── New SEO-rich image blocks ───────────────────────────────────────────────
const CAP_URL       = "/manus-storage/card-collector-cbh-cap-superfractor_78bd651e.webp";
const PANTHER_URL   = "/manus-storage/card-collector-chrome-black-panther_231924bf.webp";
const KILLMONGER_URL= "/manus-storage/card-collector-killmonger-auto-mbj_1b9dfedd.jpg";
const DOOM_MINT_URL = "/manus-storage/card-collector-mint-doom-black-foil_63615682.webp";

// Hero (featuredImageUrl) alt text is handled separately via the DB field — update below.
// Inline images 1–4:
const block1 = imgBlock(
  CAP_URL,
  "Captain America 2025 Topps Marvel Comic Book Heroes SuperFractor 1/1 CGC Mint 9 — rare comic-art trading card",
  "Captain America — 2025 Topps Marvel Comic Book Heroes SuperFractor 1/1 | CGC Mint 9 | The rarest parallel in the set, capturing the classic comic-book art style collectors love.",
  "fig-cap-cbh-superfractor"
);

const block2 = imgBlock(
  PANTHER_URL,
  "Chadwick Boseman as T'Challa Black Panther Topps Marvel Chrome trading card 09/10 — actor portrayal MCU card",
  "T'Challa / Black Panther — Topps Marvel Chrome 09/10 | Chadwick Boseman's iconic portrayal immortalised on a short-printed Chrome parallel — a must-have for MCU actor-portrayal collectors.",
  "fig-black-panther-chrome"
);

const block3 = imgBlock(
  KILLMONGER_URL,
  "Michael B. Jordan as Erik Killmonger Topps Marvel Collector MCU Perfection certified autograph card 15/15",
  "Erik Killmonger — Topps Marvel Collector MCU Perfection Auto 15/15 | Signed by Michael B. Jordan | The autograph chase card that defines the actor-portrayal collecting experience.",
  "fig-killmonger-auto"
);

const block4 = imgBlock(
  DOOM_MINT_URL,
  "Doctor Doom 2025 Topps Marvel Mint Black Foil trading card 10/10 CGC Mint 9 — best of comic art and MCU design",
  "Doctor Doom — 2025 Topps Marvel Mint Black Foil 10/10 | CGC Mint 9 | Marvel Mint bridges the gap between comic art and MCU aesthetics — and this Doom Black Foil is the perfect example.",
  "fig-doom-mint-black-foil"
);

// ── Strip all existing inline image blocks and replace in order ─────────────
// Remove <figure ...>...</figure> blocks (from previous SEO update attempts)
content = content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, "IMAGE_PLACEHOLDER");
// Also remove legacy <div style="text-align:center..."> image blocks
content = content.replace(/<div style="text-align:center[^>]*>[\s\S]*?<\/div>/g, "IMAGE_PLACEHOLDER");
// Collapse consecutive placeholders into one
content = content.replace(/(IMAGE_PLACEHOLDER\s*)+/g, "IMAGE_PLACEHOLDER");

const placeholderCount = (content.match(/IMAGE_PLACEHOLDER/g) || []).length;
console.log(`Found ${placeholderCount} image placeholder(s)`);

const newImages = [block1, block2, block3, block4];
let idx = 0;
content = content.replace(/IMAGE_PLACEHOLDER/g, () => {
  const block = newImages[idx] || "";
  idx++;
  return block;
});

// ── Update the article ──────────────────────────────────────────────────────
await conn.execute(
  "UPDATE articles SET contentMarkdown = ?, updatedAt = NOW() WHERE id = ?",
  [content, article.id]
);

console.log("✅ Alt text and captions updated on all 4 inline images.");
await conn.end();
