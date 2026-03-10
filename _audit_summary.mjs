import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Summary by set
const [summary] = await conn.execute(`
  SELECT ms.id as setId, ms.name as setName, ms.slug,
    COUNT(*) as total,
    SUM(CASE WHEN c.imageUrl LIKE '%hulk%' OR c.imageUrl LIKE '%Hulk%' THEN 1 ELSE 0 END) as hulkCount,
    SUM(CASE WHEN c.imageUrl IS NULL OR c.imageUrl = '' THEN 1 ELSE 0 END) as noImageCount,
    SUM(CASE WHEN c.imageUrl IS NOT NULL AND c.imageUrl != '' AND c.imageUrl NOT LIKE '%hulk%' AND c.imageUrl NOT LIKE '%Hulk%' THEN 1 ELSE 0 END) as hasRealImage
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  GROUP BY ms.id, ms.name, ms.slug
  ORDER BY ms.id
`);

console.log('=== IMAGE STATUS BY SET ===');
console.log('Set | Total | Has Image | No Image | Hulk Placeholder');
for (const s of summary) {
  console.log(`${s.setName} (${s.slug}) | ${s.total} | ${s.hasRealImage} | ${s.noImageCount} | ${s.hulkCount}`);
}

// For each set, get card types with no images
console.log('\n=== NO-IMAGE BREAKDOWN BY SET AND TYPE ===');
const [typeBreakdown] = await conn.execute(`
  SELECT ms.name as setName, c.cardType,
    COUNT(*) as total,
    SUM(CASE WHEN c.imageUrl IS NULL OR c.imageUrl = '' THEN 1 ELSE 0 END) as noImageCount
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  WHERE c.imageUrl IS NULL OR c.imageUrl = ''
  GROUP BY ms.name, c.cardType
  ORDER BY ms.name, c.cardType
`);
for (const t of typeBreakdown) {
  console.log(`  ${t.setName} | ${t.cardType} | ${t.noImageCount} cards need images`);
}

// Get unique characters that need images (for AI generation)
console.log('\n=== UNIQUE CHARACTERS NEEDING IMAGES ===');
const [uniqueChars] = await conn.execute(`
  SELECT DISTINCT c.characterName
  FROM marvel_cards c 
  WHERE c.imageUrl IS NULL OR c.imageUrl = ''
  ORDER BY c.characterName
`);
console.log(`Total unique characters needing images: ${uniqueChars.length}`);

// Check which of those characters already have an image in another card
console.log('\n=== CHARACTERS WITH EXISTING IMAGES (can reuse) ===');
const [reusable] = await conn.execute(`
  SELECT DISTINCT noimg.characterName, hasimg.imageUrl, ms.name as fromSet
  FROM (
    SELECT DISTINCT characterName 
    FROM marvel_cards 
    WHERE imageUrl IS NULL OR imageUrl = ''
  ) noimg
  JOIN marvel_cards hasimg ON noimg.characterName = hasimg.characterName 
    AND hasimg.imageUrl IS NOT NULL AND hasimg.imageUrl != ''
    AND hasimg.imageUrl NOT LIKE '%hulk%'
  JOIN marvel_sets ms ON hasimg.setId = ms.id
  GROUP BY noimg.characterName, hasimg.imageUrl, ms.name
  ORDER BY noimg.characterName
`);
console.log(`Characters with reusable images: ${reusable.length}`);
const reusableNames = new Set();
for (const r of reusable) {
  reusableNames.add(r.characterName);
}

// Characters that truly need AI generation
const needsAI = uniqueChars.filter(c => !reusableNames.has(c.characterName));
console.log(`\nCharacters truly needing AI generation: ${needsAI.length}`);
for (const c of needsAI) {
  console.log(`  - ${c.characterName}`);
}

await conn.end();
