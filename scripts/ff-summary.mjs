import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

// Get summary by card type
const [types] = await conn.execute(
  `SELECT cardType, COUNT(*) as count, 
   SUM(CASE WHEN imageUrl IS NULL THEN 1 ELSE 0 END) as missing_images
   FROM marvel_cards WHERE setId = 60001 
   GROUP BY cardType ORDER BY count DESC`
);
console.log('Card types summary:');
console.table(types);

// Get base cards specifically (most important to fix)
const [baseCards] = await conn.execute(
  `SELECT id, cardNumber, characterName, cardType, 
   CASE WHEN imageUrl IS NULL THEN 'MISSING' ELSE 'HAS IMAGE' END as imageStatus
   FROM marvel_cards WHERE setId = 60001 AND cardType LIKE 'Base%'
   ORDER BY CAST(cardNumber AS UNSIGNED)`
);
console.log(`\nBase cards (${baseCards.length} total):`);
console.table(baseCards);

await conn.end();
