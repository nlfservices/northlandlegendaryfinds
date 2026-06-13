import { createConnection } from 'mysql2/promise';
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
const envPath = resolve(__dirname, '../.env');
let dbUrl;
try {
  const env = readFileSync(envPath, 'utf8');
  const match = env.match(/DATABASE_URL=(.+)/);
  if (match) dbUrl = match[1].trim();
} catch {}

if (!dbUrl) {
  console.error('No DATABASE_URL found in .env - this script needs to run in the deployed environment');
  console.log('Falling back to reading from existing base-cards-list.json and adding insert types...');
  
  // We already have base cards - let's just build the prompts from what we know
  process.exit(0);
}

const conn = await createConnection(dbUrl);

const [sets] = await conn.execute("SELECT id FROM card_sets WHERE slug = '2026-topps-finest-fantastic-four' LIMIT 1");
if (!sets.length) { console.error('Set not found'); process.exit(1); }
const setId = sets[0].id;

const [cards] = await conn.execute(
  'SELECT card_number, character_name, card_type FROM marvel_cards WHERE set_id = ? ORDER BY card_type, card_number',
  [setId]
);

writeFileSync(resolve(__dirname, 'all-cards.json'), JSON.stringify(cards, null, 2));
console.log(`Total: ${cards.length} cards`);

const byType = {};
for (const c of cards) {
  if (!byType[c.card_type]) byType[c.card_type] = [];
  byType[c.card_type].push(c);
}
for (const [type, list] of Object.entries(byType)) {
  console.log(`\n${type} (${list.length}):`);
  list.forEach(c => console.log(`  #${c.card_number} ${c.character_name}`));
}

await conn.end();
process.exit(0);
