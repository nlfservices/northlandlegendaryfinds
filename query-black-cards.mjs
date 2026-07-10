// Query existing Black Refractor cards in the Marvel Mint set
import 'dotenv/config';
import mysql from 'mysql2/promise';
import { writeFileSync } from 'fs';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get card types in set 3
const [types] = await conn.execute("SELECT cardType, COUNT(*) as cnt FROM marvel_cards WHERE setId = 3 GROUP BY cardType");
console.log('Card types in Marvel Mint set:', JSON.stringify(types));

// Get base cards numbered 1-120
const [base] = await conn.execute("SELECT id, cardNumber, characterName, cardType, parallels, imageUrl, back_image_url FROM marvel_cards WHERE setId = 3 AND cardNumber REGEXP '^[0-9]+$' AND CAST(cardNumber AS UNSIGNED) BETWEEN 1 AND 120 ORDER BY CAST(cardNumber AS UNSIGNED)");
console.log(`\nBase cards (numbered 1-120): ${base.length}`);
if (base.length > 0) {
  console.log('First 5:', JSON.stringify(base.slice(0, 5), null, 2));
}

// Check for existing Black Refractor parallel entries
const [black] = await conn.execute("SELECT id, cardNumber, characterName, cardType, parallels FROM marvel_cards WHERE setId = 3 AND (cardType LIKE '%Black%' OR parallels LIKE '%Black%' OR cardType LIKE '%Refractor%')");
console.log(`\nBlack Refractor entries: ${black.length}`);
if (black.length > 0) {
  console.log('Sample:', JSON.stringify(black.slice(0, 3), null, 2));
}

writeFileSync('/home/ubuntu/existing-base-cards.json', JSON.stringify(base, null, 2));

await conn.end();
process.exit(0);
