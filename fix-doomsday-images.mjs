/**
 * Fix Doomsday Trailer article images:
 * 1. Remove the duplicate markdown image ![The Trailer Breakdown](...) that causes CineStill cropping
 * 2. Add centered captions below each card HTML img tag
 * 3. Ensure cards display properly with captions
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5040001");

if (rows.length === 0) {
  console.error('Article not found!');
  await conn.end();
  process.exit(1);
}

let content = rows[0].contentMarkdown;

// 1. Remove the duplicate markdown image that causes CineStill to show a cropped card
// This is: ![The Trailer Breakdown](/manus-storage/1000043826_c2ad3c69.jpg)
const beforeLen = content.length;
content = content.replace(/!\[The Trailer Breakdown\]\(\/manus-storage\/1000043826_c2ad3c69\.jpg\)\n*/g, '');
console.log(`Removed markdown Doom image: ${beforeLen - content.length} chars removed`);

// 2. Replace the Doctor Doom HTML img with a properly styled version + caption
content = content.replace(
  /<img src="\/manus-storage\/1000043826_c2ad3c69\.jpg" alt="Doctor Doom - 2025 Topps Marvel Mint PSA 10" style="max-width:300px;margin:1rem auto;display:block;border-radius:8px;" \/>/,
  `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<img src="/manus-storage/1000043826_c2ad3c69.jpg" alt="Doctor Doom - 2025 Topps Marvel Mint PSA 10" style="max-width:300px;width:100%;margin:0 auto;display:block;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);" />
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Doctor Doom — 2025 Topps Marvel Mint PSA 10. The SDCC exclusive everyone's chasing.</p>
</div>`
);

// 3. Replace the Spider-Man HTML img with a properly styled version + caption
content = content.replace(
  /<img src="\/manus-storage\/Spider-Man-Front_504aec2f\.JPG" alt="Spider-Man - 2025 Topps Marvel Mint Red Refractor \/5 CGC 8\.5" style="max-width:300px;margin:1rem auto;display:block;border-radius:8px;" \/>/,
  `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<img src="/manus-storage/Spider-Man-Front_504aec2f.JPG" alt="Spider-Man - 2025 Topps Marvel Mint Red Refractor /5 CGC 8.5" style="max-width:300px;width:100%;margin:0 auto;display:block;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);" />
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Spider-Man Red Refractor /5 — CGC 8.5. The 2026 set theme revealed at SDCC.</p>
</div>`
);

// 4. Replace the Gambit HTML img with a properly styled version + caption
content = content.replace(
  /<img src="\/manus-storage\/Gambit-front_97d1d245\.jpg" alt="Gambit - 2025 Topps Marvel Mint" style="max-width:300px;margin:1rem auto;display:block;border-radius:8px;" \/>/,
  `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<img src="/manus-storage/Gambit-front_97d1d245.jpg" alt="Gambit - 2025 Topps Marvel Mint" style="max-width:300px;width:100%;margin:0 auto;display:block;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);" />
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Gambit — 2025 Topps Marvel Mint. Channing Tatum confirmed for Doomsday.</p>
</div>`
);

// 5. Replace the Magneto HTML img with a properly styled version + caption
content = content.replace(
  /<img src="\/manus-storage\/1000043854_34ddb7b7\.jpg" alt="Magneto - 2025 Topps Marvel Mint PSA 10" style="max-width:300px;margin:1rem auto;display:block;border-radius:8px;" \/>/,
  `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<img src="/manus-storage/1000043854_34ddb7b7.jpg" alt="Magneto - 2025 Topps Marvel Mint PSA 10" style="max-width:300px;width:100%;margin:0 auto;display:block;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);" />
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Magneto — 2025 Topps Marvel Mint PSA 10. Ian McKellen returns for Doomsday.</p>
</div>`
);

await conn.execute(
  'UPDATE articles SET contentMarkdown = ? WHERE id = 5040001',
  [content]
);

console.log('✅ Doomsday article images fixed!');
console.log('   - Removed duplicate markdown Doom image (no more CineStill crop)');
console.log('   - Added centered captions to all 4 card images');
await conn.end();
process.exit(0);
