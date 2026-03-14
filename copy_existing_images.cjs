const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get all Collector cards without images
  const [cards] = await conn.query(
    "SELECT id, characterName, cardType FROM marvel_cards WHERE setId = 30001 AND (imageUrl IS NULL OR imageUrl = '')"
  );
  console.log(`Cards needing images: ${cards.length}`);
  
  // For each card, try to find an existing image from other sets
  let copied = 0;
  let needNew = [];
  
  for (const card of cards) {
    const [existing] = await conn.query(
      "SELECT imageUrl FROM marvel_cards WHERE characterName = ? AND imageUrl IS NOT NULL AND imageUrl != '' AND setId != 30001 LIMIT 1",
      [card.characterName]
    );
    
    if (existing.length > 0) {
      await conn.query("UPDATE marvel_cards SET imageUrl = ? WHERE id = ?", [existing[0].imageUrl, card.id]);
      copied++;
    } else {
      needNew.push({ id: card.id, name: card.characterName, type: card.cardType });
    }
  }
  
  console.log(`Copied existing images: ${copied}`);
  console.log(`Still need new images: ${needNew.length}`);
  console.log('\nCards needing new images:');
  for (const c of needNew) {
    console.log(`  ${c.id} | ${c.type} | ${c.name}`);
  }
  
  await conn.end();
})();
