import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const reusable = JSON.parse(fs.readFileSync('/tmp/reusable_images.json', 'utf-8'));

console.log(`Applying ${reusable.length} reusable images...`);

let updated = 0;
let errors = 0;

for (const card of reusable) {
  try {
    await conn.execute(
      'UPDATE marvel_cards SET imageUrl = ? WHERE id = ?',
      [card.sourceUrl, card.id]
    );
    updated++;
  } catch (e) {
    console.error(`Error updating card ${card.id} (${card.characterName}): ${e.message}`);
    errors++;
  }
}

console.log(`\nDone! Updated: ${updated}, Errors: ${errors}`);

// Verify the update
const [remaining] = await conn.execute(`
  SELECT ms.name as setName, 
    COUNT(*) as total,
    SUM(CASE WHEN c.imageUrl IS NULL OR c.imageUrl = '' THEN 1 ELSE 0 END) as noImage
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  WHERE ms.slug != '2025-topps-marvel-mint'
  GROUP BY ms.id, ms.name
  ORDER BY ms.id
`);

console.log('\n=== REMAINING AFTER REUSE ===');
for (const r of remaining) {
  console.log(`${r.setName}: ${r.noImage} still need images (of ${r.total} total)`);
}

await conn.end();
