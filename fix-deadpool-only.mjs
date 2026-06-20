import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const DEADPOOL_ID = 90003;

// Clear any existing
await conn.execute('DELETE FROM marvel_cards WHERE setId = ?', [DEADPOOL_ID]);
console.log('Cleared Deadpool set (90003)');

// Read extracted data - keys are: number, name, subset
const data = JSON.parse(readFileSync('/home/ubuntu/dp-checklist.json', 'utf-8'));
console.log(`Loaded ${data.length} Deadpool cards`);

// Insert in batches
const BATCH_SIZE = 50;
let inserted = 0;
for (let i = 0; i < data.length; i += BATCH_SIZE) {
  const batch = data.slice(i, i + BATCH_SIZE);
  const values = batch.map(c => [
    DEADPOOL_ID,
    c.number || 'N/A',
    c.name || 'Unknown',
    c.subset || 'Base',
    'Base',
    null
  ]);
  const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
  const flat = values.flat();
  await conn.execute(
    `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, rarity, imageUrl) VALUES ${placeholders}`,
    flat
  );
  inserted += batch.length;
  console.log(`  Inserted ${inserted}/${data.length}`);
}

await conn.execute('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [data.length, DEADPOOL_ID]);

// Final verification
const [v1] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 90001');
const [v2] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 90002');
const [v3] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 90003');
console.log(`\n📊 Final card counts:`);
console.log(`   90001 (Chrome Marvel): ${v1[0].cnt}`);
console.log(`   90002 (Sapphire): ${v2[0].cnt}`);
console.log(`   90003 (Deadpool): ${v3[0].cnt}`);

await conn.end();
console.log('\n✅ Done!');
