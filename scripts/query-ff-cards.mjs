import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

// First get the set ID
const [sets] = await conn.execute(
  "SELECT id, name, slug FROM marvel_sets WHERE id = 60001"
);
console.log('Set:', JSON.stringify(sets[0]));

// Get all cards in this set
const [cards] = await conn.execute(
  "SELECT id, cardNumber, characterName, cardType, imageUrl FROM marvel_cards WHERE setId = 60001 ORDER BY CAST(cardNumber AS UNSIGNED)"
);
console.log(`\nTotal cards: ${cards.length}`);
console.log(JSON.stringify(cards, null, 2));

await conn.end();
