// Update script: swap 2nd inline image in the collector types article
// Replace Studios Queen Ramonda with Captain America CBH SuperFractor 1/1
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const NEW_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/EFfjBCVQQjZAjCQk.webp";
const OLD_IMG_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/LVaewFZzsWjlBcrV.jpg";

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
  <img src="${OLD_IMG_URL}" alt="2025 Topps Marvel Studios — Queen Ramonda Green Refractor 147/199" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Queen Ramonda — 2025 Topps Marvel Studios Green Refractor 147/199 — from the NLF collection</p>
</div>`;

const newHtml = `<div style="text-align:center;margin:2rem 0;">
  <img src="${NEW_IMG}" alt="Captain America Comic Book Heroes 50th SuperFractor 1/1 CGC 9" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Captain America #2 — Comic Book Heroes 50th SuperFractor 1/1, CGC Mint 9 — from the NLF collection</p>
</div>`;

content = content.replace(oldHtml, newHtml);

const [result] = await conn.execute(
  'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
  [content, 'comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

console.log('✅ Updated! Rows affected:', result.affectedRows);
console.log('   2nd image → Captain America CBH SuperFractor 1/1 CGC 9');

await conn.end();
process.exit(0);
