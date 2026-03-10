import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all marvel sets
const [sets] = await conn.execute('SELECT id, name, slug FROM marvel_sets ORDER BY id');
console.log('=== MARVEL SETS ===');
for (const s of sets) {
  console.log(`Set ID: ${s.id} | ${s.name} (${s.slug})`);
}

console.log('\n=== CARDS WITH HULK PLACEHOLDER IMAGES ===');
const [hulkCards] = await conn.execute(`
  SELECT c.id, c.characterName, c.cardNumber, c.cardType, c.imageUrl, ms.name as setName, ms.slug as setSlug
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  WHERE c.imageUrl LIKE '%hulk%' OR c.imageUrl LIKE '%Hulk%'
  ORDER BY ms.id, c.cardType, c.sortOrder
`);
console.log(`Total cards with Hulk images: ${hulkCards.length}`);
for (const c of hulkCards) {
  console.log(`  [${c.setName}] ${c.cardType} #${c.cardNumber} - ${c.characterName}`);
}

console.log('\n=== CARDS WITHOUT ANY IMAGE ===');
const [noImageCards] = await conn.execute(`
  SELECT c.id, c.characterName, c.cardNumber, c.cardType, ms.name as setName, ms.slug as setSlug
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  WHERE c.imageUrl IS NULL OR c.imageUrl = ''
  ORDER BY ms.id, c.cardType, c.sortOrder
`);
console.log(`Total cards without images: ${noImageCards.length}`);
for (const c of noImageCards) {
  console.log(`  [${c.setName}] ${c.cardType} #${c.cardNumber} - ${c.characterName}`);
}

console.log('\n=== IMAGE SUMMARY BY SET AND TYPE ===');
const [summary] = await conn.execute(`
  SELECT ms.name as setName, c.cardType, 
    COUNT(*) as total,
    SUM(CASE WHEN c.imageUrl LIKE '%hulk%' OR c.imageUrl LIKE '%Hulk%' THEN 1 ELSE 0 END) as hulkCount,
    SUM(CASE WHEN c.imageUrl IS NULL OR c.imageUrl = '' THEN 1 ELSE 0 END) as noImageCount,
    SUM(CASE WHEN c.imageUrl IS NOT NULL AND c.imageUrl != '' AND c.imageUrl NOT LIKE '%hulk%' AND c.imageUrl NOT LIKE '%Hulk%' THEN 1 ELSE 0 END) as hasRealImage
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  GROUP BY ms.name, c.cardType
  ORDER BY ms.id, c.cardType
`);
console.log('Set | Type | Total | Hulk | No Image | Real');
console.log('---|---|---|---|---|---');
for (const s of summary) {
  console.log(`${s.setName} | ${s.cardType} | ${s.total} | ${s.hulkCount} | ${s.noImageCount} | ${s.hasRealImage}`);
}

// Check for any character that has a real image in one set but hulk/missing in another
console.log('\n=== CHARACTERS WITH REAL IMAGES (for reuse) ===');
const [realImages] = await conn.execute(`
  SELECT DISTINCT c.characterName, c.imageUrl, ms.name as setName
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  WHERE c.imageUrl IS NOT NULL AND c.imageUrl != '' 
    AND c.imageUrl NOT LIKE '%hulk%' AND c.imageUrl NOT LIKE '%Hulk%'
  ORDER BY c.characterName
`);
console.log(`Total characters with real images: ${realImages.length}`);

// Build a map of character -> image URL
const charImageMap = {};
for (const r of realImages) {
  if (!charImageMap[r.characterName]) {
    charImageMap[r.characterName] = [];
  }
  charImageMap[r.characterName].push({ url: r.imageUrl, set: r.setName });
}

// Now check which hulk/missing cards could be fixed with existing images
console.log('\n=== FIXABLE WITH EXISTING IMAGES ===');
const allBadCards = [...hulkCards, ...noImageCards.map(c => ({...c, imageUrl: null}))];
let fixable = 0;
let needsGeneration = 0;
const needsGenerationList = [];
for (const c of allBadCards) {
  if (charImageMap[c.characterName]) {
    fixable++;
  } else {
    needsGeneration++;
    needsGenerationList.push(`[${c.setName}] ${c.cardType} #${c.cardNumber} - ${c.characterName}`);
  }
}
console.log(`Fixable with existing images: ${fixable}`);
console.log(`Needs AI generation: ${needsGeneration}`);
if (needsGenerationList.length > 0) {
  console.log('\nCards needing AI generation:');
  for (const n of needsGenerationList) {
    console.log(`  ${n}`);
  }
}

await conn.end();
