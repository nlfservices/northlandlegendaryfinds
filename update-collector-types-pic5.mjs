// Update script: swap the Mint section image in the collector types article
// Replace Nick Fury Mint Gold Refractor with Doctor Doom Marvel Mint Black Foil 01/68 CGC 9
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const NEW_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/KLeLvNDnWwHUABWd.webp";
// The Mint section image was the Nick Fury Gold Refractor (now replaced by the Killmonger auto in pic4 update)
// But the Mint section image is the one in the "Best of Both Worlds" section
// Let's fetch the current content and find the correct image to replace
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

// The Nick Fury Mint image URL (original, not yet replaced)
const OLD_IMG_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/gsIbTNyHLSqkVAZS.jpg";

const oldHtml = `<div style="text-align:center;margin:2rem 0;">
  <img src="${OLD_IMG_URL}" alt="2025 Topps Marvel Mint — Nick Fury Gold Gold Refractor 30/50, AGS 9" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Nick Fury #76 — 2025 Topps Marvel Mint Gold Refractor 30/50, AGS Mint 9 — from the NLF collection</p>
</div>`;

const newHtml = `<div style="text-align:center;margin:2rem 0;">
  <img src="${NEW_IMG}" alt="Doctor Doom 2025 Topps Marvel Mint Black Foil 01/68 CGC 9" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Doctor Doom #107 — 2025 Topps Marvel Mint Black Foil 01/68, CGC Mint 9 — from the NLF collection</p>
</div>`;

if (content.includes(OLD_IMG_URL)) {
  content = content.replace(oldHtml, newHtml);
  console.log('✅ Found and replaced Nick Fury Mint image');
} else {
  // Try a looser match on just the URL
  content = content.replace(OLD_IMG_URL, NEW_IMG);
  // Also update the alt text and caption
  content = content.replace(
    /alt="2025 Topps Marvel Mint — Nick Fury Gold Gold Refractor 30\/50, AGS 9"/,
    'alt="Doctor Doom 2025 Topps Marvel Mint Black Foil 01/68 CGC 9"'
  );
  content = content.replace(
    /Nick Fury #76 — 2025 Topps Marvel Mint Gold Refractor 30\/50, AGS Mint 9 — from the NLF collection/,
    'Doctor Doom #107 — 2025 Topps Marvel Mint Black Foil 01/68, CGC Mint 9 — from the NLF collection'
  );
  console.log('✅ Replaced via URL substitution');
}

const [result] = await conn.execute(
  'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
  [content, 'comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

console.log('✅ Updated! Rows affected:', result.affectedRows);
console.log('   Mint section image → Doctor Doom Marvel Mint Black Foil 01/68 CGC 9');

await conn.end();
process.exit(0);
