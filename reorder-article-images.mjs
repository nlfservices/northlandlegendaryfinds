import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);
const slug = "comic-art-vs-actor-portrayal-marvel-card-collector-types-2025";

const [rows] = await conn.execute(
  "SELECT id, contentMarkdown FROM articles WHERE slug = ?",
  [slug]
);

if (!rows.length) {
  console.error("Article not found!");
  process.exit(1);
}

const article = rows[0];
let content = article.contentMarkdown;

// The 4 correct CDN URLs in the desired order:
// 1. Captain America CBH SuperFractor 1/1 CGC 9
// 2. Chadwick Boseman Black Panther Chrome 09/10
// 3. Michael B. Jordan Killmonger Perfection Auto 15/15
// 4. Doctor Doom Mint #107 Black Foil 10/10 CGC 9
const CAP_URL = "/manus-storage/card-collector-cbh-cap-superfractor_78bd651e.webp";
const PANTHER_URL = "/manus-storage/card-collector-chrome-black-panther_231924bf.webp";
const KILLMONGER_URL = "/manus-storage/card-collector-killmonger-auto-mbj_1b9dfedd.jpg";
const DOOM_MINT_URL = "/manus-storage/card-collector-mint-doom-black-foil_63615682.webp";

// Build the 4 image HTML blocks in order
const imgBlock = (url, caption) => `<div style="text-align:center;margin:2rem 0;">
  <img src="${url}" alt="${caption}" style="max-width:480px;width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.1);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">${caption}</p>
</div>`;

const block1 = imgBlock(CAP_URL, "Captain America — Comic Book Heroes SuperFractor 1/1 CGC 9");
const block2 = imgBlock(PANTHER_URL, "T'Challa — Topps Marvel Chrome 09/10 (Chadwick Boseman)");
const block3 = imgBlock(KILLMONGER_URL, "Erik Killmonger — Topps Marvel Collector Perfection Auto 15/15 (Michael B. Jordan)");
const block4 = imgBlock(DOOM_MINT_URL, "Doctor Doom — 2025 Marvel Mint Black Foil 10/10 CGC 9");

// Remove ALL existing inline image blocks (any <div style="text-align:center..."> containing an <img>)
// Strategy: replace all 4 existing image blocks with placeholders, then reinsert in correct order

// Find all img src URLs currently in the article
const imgMatches = [...content.matchAll(/src="([^"]+)"/g)];
console.log("Current images found:");
imgMatches.forEach((m, i) => console.log(`  ${i+1}: ${m[1]}`));

// Remove all existing centered image div blocks
content = content.replace(/<div style="text-align:center[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g, "IMAGE_PLACEHOLDER");
// Also handle single-div image blocks
content = content.replace(/<div style="text-align:center[^>]*>[\s\S]*?<\/div>/g, "IMAGE_PLACEHOLDER");

// Count placeholders
const placeholderCount = (content.match(/IMAGE_PLACEHOLDER/g) || []).length;
console.log(`Found ${placeholderCount} image placeholders`);

// Replace placeholders in order
const newImages = [block1, block2, block3, block4];
let idx = 0;
content = content.replace(/IMAGE_PLACEHOLDER/g, () => {
  const block = newImages[idx] || "";
  idx++;
  return block;
});

// Verify result
const newImgMatches = [...content.matchAll(/src="([^"]+)"/g)];
console.log("\nNew image order:");
newImgMatches.forEach((m, i) => console.log(`  ${i+1}: ${m[1]}`));

await conn.execute(
  "UPDATE articles SET contentMarkdown = ?, updatedAt = NOW() WHERE id = ?",
  [content, article.id]
);
console.log("\n✅ Article images reordered successfully!");
await conn.end();
