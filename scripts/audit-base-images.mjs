import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const conn = await createConnection(process.env.DATABASE_URL);

const [rows] = await conn.execute(`
  SELECT id, cardNumber, characterName, cardType, imageUrl
  FROM marvel_cards
  WHERE setId = (SELECT id FROM card_sets WHERE slug = '2026-topps-finest-fantastic-four')
  AND cardType IN ('Base - Common', 'Base - Uncommon', 'Base - Rare')
  ORDER BY CAST(cardNumber AS UNSIGNED)
`);

const base = rows;
console.log('TOTAL BASE CARDS:', base.length);

// Find duplicates
const urlMap = {};
for (const c of base) {
  if (c.imageUrl) {
    if (!urlMap[c.imageUrl]) urlMap[c.imageUrl] = [];
    urlMap[c.imageUrl].push(`#${c.cardNumber} ${c.characterName}`);
  }
}
const dups = Object.entries(urlMap).filter(([, v]) => v.length > 1);
console.log('DUPLICATE URLs:', dups.length);
for (const [url, cards] of dups) {
  console.log('  DUP:', url.split('/').pop()?.slice(0, 70));
  for (const c of cards) console.log('    ->', c);
}

// Print full list
console.log('\nFULL LIST:');
for (const c of base) {
  const tail = c.imageUrl ? c.imageUrl.split('/').pop()?.slice(0, 65) : 'NO IMAGE';
  console.log(`${c.cardNumber}\t${c.characterName}\t${tail}`);
}

await conn.end();
