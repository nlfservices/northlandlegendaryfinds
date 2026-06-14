// Update script: swap hero image and first inline image in the collector types article
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const NEW_HERO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/vtUXqkYKRAFHqBHN.webp";
const OLD_HERO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/itSqYEpoCnJtDTal.jpg";
const OLD_INLINE_CBH = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/bYeIMRxoLiODpjnh.jpg";

// Get current article content
const [rows] = await conn.execute(
  'SELECT id, contentMarkdown FROM articles WHERE slug = ?',
  ['comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

if (!rows.length) {
  console.error('❌ Article not found');
  await conn.end();
  process.exit(1);
}

const article = rows[0];
let content = article.contentMarkdown;

// Replace the first inline image (CBH Hawkeye) with the new Doom 1/1 image
// The first inline img in the article is the CBH Hawkeye card
const newInlineHtml = `<div style="text-align:center;margin:2rem 0;">
  <img src="${NEW_HERO}" alt="Doctor Doom 1975 Topps Marvel Comic Book Heroes 1/1 — NLF Collection" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Doctor Doom — Comic Book Heroes 1975 Gold Refractor 1/1 — from the NLF collection</p>
</div>`;

const oldInlineHtml = `<div style="text-align:center;margin:2rem 0;">
  <img src="${OLD_INLINE_CBH}" alt="Topps Marvel Comic Book Heroes — Hawkeye 'The 2000s' Rose Gold Refractor CGC 9" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Hawkeye #70 — Comic Book Heroes "The 2000s" Rose Gold Refractor, CGC 9 — from the NLF collection</p>
</div>`;

content = content.replace(oldInlineHtml, newInlineHtml);

// Update both the featuredImageUrl and the contentMarkdown
const [result] = await conn.execute(
  'UPDATE articles SET featuredImageUrl = ?, contentMarkdown = ? WHERE slug = ?',
  [NEW_HERO, content, 'comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

console.log('✅ Updated! Rows affected:', result.affectedRows);
console.log('   New hero image: Doctor Doom 1975 CBH 1/1');

await conn.end();
process.exit(0);
