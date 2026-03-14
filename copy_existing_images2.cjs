const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get all Collector cards without images
  const [cards] = await conn.query(
    "SELECT id, characterName, cardType FROM marvel_cards WHERE setId = 30001 AND (imageUrl IS NULL OR imageUrl = '')"
  );
  console.log(`Cards needing images: ${cards.length}`);
  
  // Get all existing images from other sets
  const [existing] = await conn.query(
    "SELECT DISTINCT characterName, imageUrl FROM marvel_cards WHERE imageUrl IS NOT NULL AND imageUrl != '' AND setId != 30001"
  );
  
  // Build a lookup map
  const imageMap = {};
  for (const e of existing) {
    const key = e.characterName.toLowerCase().trim();
    if (!imageMap[key]) imageMap[key] = e.imageUrl;
  }
  
  console.log(`Existing unique character images: ${Object.keys(imageMap).length}`);
  
  // Normalize character names for matching
  function normalize(name) {
    // Remove actor names in parentheses
    let n = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
    // Lowercase
    return n.toLowerCase().trim();
  }
  
  let copied = 0;
  let needNew = [];
  
  for (const card of cards) {
    const norm = normalize(card.characterName);
    
    // Try exact match first
    let url = imageMap[norm];
    
    // Try with "The " prefix removed
    if (!url && norm.startsWith('the ')) {
      url = imageMap[norm.substring(4)];
    }
    
    // Try adding "The " prefix
    if (!url) {
      url = imageMap['the ' + norm];
    }
    
    // Try common aliases
    const aliases = {
      'the mighty thor': 'mighty thor',
      'mighty thor': 'the mighty thor',
      'dr. christine palmer': 'christine palmer',
      'dr. jane foster': 'jane foster',
      'dr. erik selvig': 'erik selvig',
      'iron monger': 'obadiah stane',
      'the vision': 'vision',
      'hope van dyne': 'the wasp',
      'riri williams': 'ironheart',
      'cassie lang': 'stature',
      'wanda maximoff': 'scarlet witch',
      'peggy carter': 'captain carter',
      'aldrich killian': 'killian',
      'captain america & hawkeye': null,
      'the thing & human torch': null,
      'thanos & wanda maximoff': null,
      'ant-man & the wasp': null,
      'mister fantastic & invisible woman': null,
    };
    
    if (!url && aliases[norm] !== undefined) {
      url = imageMap[aliases[norm]];
    }
    
    if (url) {
      await conn.query("UPDATE marvel_cards SET imageUrl = ? WHERE id = ?", [url, card.id]);
      copied++;
      console.log(`  COPIED: ${card.characterName} -> found match`);
    } else {
      needNew.push({ id: card.id, name: card.characterName, type: card.cardType });
    }
  }
  
  console.log(`\nCopied existing images: ${copied}`);
  console.log(`Still need new images: ${needNew.length}`);
  
  // Group by type
  const byType = {};
  for (const c of needNew) {
    if (!byType[c.type]) byType[c.type] = [];
    byType[c.type].push(c);
  }
  
  console.log('\nCards needing new images by type:');
  for (const [type, cards] of Object.entries(byType)) {
    console.log(`\n  ${type} (${cards.length}):`);
    for (const c of cards) {
      console.log(`    ${c.id} | ${c.name}`);
    }
  }
  
  await conn.end();
})();
