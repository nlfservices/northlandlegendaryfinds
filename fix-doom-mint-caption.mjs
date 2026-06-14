import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await conn.execute(
  'SELECT id, contentMarkdown FROM articles WHERE slug = ?',
  ['comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

let content = rows[0].contentMarkdown;

// Fix the caption — 01/68 → 10/10
content = content.replace(
  'Doctor Doom #107 — 2025 Topps Marvel Mint Black Foil 01/68, CGC Mint 9 — from the NLF collection',
  'Doctor Doom #107 — 2025 Topps Marvel Mint Black Foil 10/10, CGC Mint 9 — from the NLF collection'
);

// Also fix the alt text
content = content.replace(
  'alt="Doctor Doom 2025 Topps Marvel Mint Black Foil 01/68 CGC 9"',
  'alt="Doctor Doom 2025 Topps Marvel Mint Black Foil 10/10 CGC 9"'
);

const [result] = await conn.execute(
  'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
  [content, 'comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

console.log('✅ Caption fixed! Rows affected:', result.affectedRows);
console.log('   Doctor Doom Mint → Black Foil 10/10 CGC 9');

await conn.end();
process.exit(0);
