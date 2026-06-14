// Update script: swap 3rd inline image in the collector types article
// Replace Collector MCU Perfection Cap America with Chadwick Boseman Black Panther Topps Chrome 09/10
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const NEW_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/MesYgrkYODsgpHMe.webp";
// The 3rd inline image was the Collector MCU Perfection Cap America
const OLD_IMG_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/PbvJJSUmlpGXQMIr.jpg";

const [rows] = await conn.execute(
  'SELECT id, contentMarkdown FROM articles WHERE slug = ?',
  ['comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

if (!rows.length) {
  console.error('❌ Article not found');
  await conn.end();
  process.exit(1);
}

let content = rows[0].contentMarkdown;

const oldHtml = `<div style="text-align:center;margin:2rem 0;">
  <img src="${OLD_IMG_URL}" alt="Topps Marvel Collector — Captain America MCU Perfection /100" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Captain America (Sam Wilson) — Topps Marvel Collector MCU Perfection /100 — from the NLF collection</p>
</div>`;

const newHtml = `<div style="text-align:center;margin:2rem 0;">
  <img src="${NEW_IMG}" alt="Chadwick Boseman as T'Challa — Topps Marvel Chrome Black Panther 09/10" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">T'Challa / Black Panther (Chadwick Boseman) — Topps Marvel Chrome 09/10 — from the NLF collection</p>
</div>`;

content = content.replace(oldHtml, newHtml);

// Also update the caption text in the article body that references this card
const [result] = await conn.execute(
  'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
  [content, 'comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

console.log('✅ Updated! Rows affected:', result.affectedRows);
console.log('   3rd image → Chadwick Boseman Black Panther Topps Chrome 09/10');

await conn.end();
process.exit(0);
