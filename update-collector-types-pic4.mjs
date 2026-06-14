// Update script: swap 4th inline image in the collector types article
// Replace Mint Nick Fury Gold Refractor with Michael B. Jordan Erik Killmonger Topps Perfection Auto 15/15
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const NEW_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/cnaVOsrOezraXYuO.jpg";
// The 4th inline image was the Mint Nick Fury Gold Refractor
const OLD_IMG_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/gsIbTNyHLSqkVAZS.jpg";

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
  <img src="${OLD_IMG_URL}" alt="2025 Topps Marvel Mint — Nick Fury Gold Gold Refractor 30/50, AGS 9" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Nick Fury #76 — 2025 Topps Marvel Mint Gold Refractor 30/50, AGS Mint 9 — from the NLF collection</p>
</div>`;

const newHtml = `<div style="text-align:center;margin:2rem 0;">
  <img src="${NEW_IMG}" alt="Michael B. Jordan as Erik Killmonger — Topps Marvel Collector Perfection Auto 15/15" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Erik Killmonger (Michael B. Jordan) — Topps Marvel Collector Perfection Auto 15/15 — from the NLF collection</p>
</div>`;

content = content.replace(oldHtml, newHtml);

const [result] = await conn.execute(
  'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
  [content, 'comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

console.log('✅ Updated! Rows affected:', result.affectedRows);
console.log('   4th image → Michael B. Jordan Killmonger Topps Perfection Auto 15/15');

await conn.end();
process.exit(0);
