import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

const [cards] = await conn.execute(
  `SELECT id, cardNumber, characterName, cardType, imageUrl
   FROM marvel_cards 
   WHERE setId = 60001 AND cardType IN ('Base - Common', 'Base - Uncommon', 'Base - Rare')
   ORDER BY CAST(cardNumber AS UNSIGNED)`
);

console.log(`Total base cards: ${cards.length}`);
fs.writeFileSync('/home/ubuntu/northland-legendary-finds/scripts/base-cards-list.json', JSON.stringify(cards, null, 2));
console.log('Saved to base-cards-list.json');

// Print just names for reference
cards.forEach(c => console.log(`${c.cardNumber}: ${c.characterName} [${c.cardType}] - ${c.imageUrl ? 'HAS IMG' : 'MISSING'}`));

await conn.end();
