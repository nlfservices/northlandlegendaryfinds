import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get set info
const [sets] = await conn.execute("SELECT id, name, slug, totalCards FROM marvel_sets WHERE slug LIKE '%mint%'");
console.log("=== MARVEL MINT SET ===");
console.log(JSON.stringify(sets, null, 2));

// Get all cards in the set
const [cards] = await conn.execute(
  "SELECT id, cardNumber, characterName, cardType, imageUrl, back_image_url FROM marvel_cards WHERE setId = ? ORDER BY sortOrder",
  [sets[0].id]
);
console.log("\n=== ALL CARDS (" + cards.length + ") ===");
cards.forEach(c => {
  console.log(`ID:${c.id} | #${c.cardNumber} | ${c.characterName} | Type:${c.cardType} | img:${c.imageUrl ? 'YES' : 'NO'} | back:${c.back_image_url ? 'YES' : 'NO'}`);
});

await conn.end();
