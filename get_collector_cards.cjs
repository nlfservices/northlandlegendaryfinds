const mysql = require('mysql2/promise');
require('dotenv').config();
(async () => {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await conn.query(
    "SELECT id, cardNumber, characterName, cardType FROM marvel_cards WHERE setId = 30001 AND cardType IN ('MCU Perfection', 'Marvel Tomorrow', 'Villainy', 'Show Stoppers', 'Infinity Gauntlet') ORDER BY sortOrder"
  );
  console.log('Total non-auto cards:', rows.length);
  const groups = {};
  for (const r of rows) {
    const t = r.cardType;
    if (!groups[t]) groups[t] = [];
    groups[t].push({id: r.id, num: r.cardNumber, name: r.characterName});
  }
  for (const [type, cards] of Object.entries(groups)) {
    console.log(`\n=== ${type} (${cards.length}) ===`);
    for (const c of cards) {
      console.log(`  ${c.id} | ${c.num} | ${c.name}`);
    }
  }
  
  // Also check which characters already have images in other sets
  const charNames = [...new Set(rows.map(r => r.characterName))];
  console.log(`\n=== Unique characters: ${charNames.length} ===`);
  
  // Find existing images for these characters
  const [existing] = await conn.query(
    "SELECT DISTINCT characterName, imageUrl FROM marvel_cards WHERE imageUrl IS NOT NULL AND imageUrl != '' AND characterName IN (" + charNames.map(() => '?').join(',') + ") LIMIT 200",
    charNames
  );
  const existingMap = {};
  for (const e of existing) {
    if (!existingMap[e.characterName]) existingMap[e.characterName] = e.imageUrl;
  }
  console.log(`\nCharacters with existing images in other sets: ${Object.keys(existingMap).length}`);
  for (const [name, url] of Object.entries(existingMap)) {
    console.log(`  ${name}: ${url.substring(0, 80)}...`);
  }
  
  // Characters needing new images
  const needNew = charNames.filter(n => !existingMap[n]);
  console.log(`\nCharacters needing NEW images: ${needNew.length}`);
  for (const n of needNew) console.log(`  ${n}`);
  
  await conn.end();
})();
