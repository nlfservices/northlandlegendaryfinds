import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// For each duplicate group, keep the lowest ID (original) and count the rest as needing new images
const [dupeGroups] = await conn.execute(`
  SELECT imageUrl, MIN(id) as keepId, COUNT(*) as cnt
  FROM marvel_cards 
  WHERE imageUrl IS NOT NULL AND imageUrl != ''
  GROUP BY imageUrl HAVING COUNT(*) > 1
  ORDER BY cnt DESC
`);

const keepIds = new Set(dupeGroups.map(g => g.keepId));
let totalNeeding = 0;
for (const g of dupeGroups) {
  totalNeeding += (g.cnt - 1);
}
console.log('Duplicate groups:', dupeGroups.length);
console.log('Cards needing new unique images (calculated):', totalNeeding);

// Get ALL cards that share duplicate images - use marvel_sets not card_sets
const [allDupeCards] = await conn.execute(`
  SELECT mc.id, mc.cardNumber, mc.characterName, mc.cardType, ms.name as setName, mc.imageUrl
  FROM marvel_cards mc
  JOIN marvel_sets ms ON mc.setId = ms.id
  WHERE mc.imageUrl IN (
    SELECT imageUrl FROM marvel_cards 
    WHERE imageUrl IS NOT NULL AND imageUrl != ''
    GROUP BY imageUrl HAVING COUNT(*) > 1
  )
  ORDER BY ms.name, mc.id
`);

console.log('Total cards in duplicate groups:', allDupeCards.length);

// Filter out the "keep" IDs (lowest in each group)
const needNew = allDupeCards.filter(c => !keepIds.has(c.id));
console.log('Cards that need new images (excluding originals):', needNew.length);

// Group by set
const bySet = {};
for (const c of needNew) {
  const key = c.setName;
  bySet[key] = (bySet[key] || 0) + 1;
}
console.log('\nBreakdown by set:');
const sorted = Object.entries(bySet).sort((a,b) => b[1] - a[1]);
for (const [set, count] of sorted) {
  console.log(`  ${count} - ${set}`);
}

// Show first 20 cards needing images
console.log('\nFirst 20 cards needing new images:');
for (const c of needNew.slice(0, 20)) {
  console.log(`  ID ${c.id}: ${c.characterName} (${c.cardNumber}) - ${c.setName} [${c.cardType}]`);
}

await conn.end();
