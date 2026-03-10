import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Step 1: Get all cards that need images (excluding Mint set)
const [needsImage] = await conn.execute(`
  SELECT c.id, c.characterName, c.cardNumber, c.cardType, c.setId, ms.name as setName, ms.slug as setSlug
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  WHERE (c.imageUrl IS NULL OR c.imageUrl = '')
    AND ms.slug != '2025-topps-marvel-mint'
  ORDER BY ms.id, c.cardType, c.sortOrder
`);

// Step 2: Get all existing real images (character -> imageUrl mapping)
const [existingImages] = await conn.execute(`
  SELECT c.characterName, c.imageUrl, ms.name as setName
  FROM marvel_cards c 
  JOIN marvel_sets ms ON c.setId = ms.id
  WHERE c.imageUrl IS NOT NULL AND c.imageUrl != '' 
    AND c.imageUrl NOT LIKE '%hulk%' AND c.imageUrl NOT LIKE '%Hulk%'
  ORDER BY c.characterName
`);

// Build character -> best image URL map
const charImageMap = {};
for (const r of existingImages) {
  if (!charImageMap[r.characterName]) {
    charImageMap[r.characterName] = r.imageUrl;
  }
}

// Step 3: Also check for partial name matches (e.g., "Iron Man" matches "Iron Man Tony Stark Iron Man Phase One")
// Build a simpler name -> image map for fuzzy matching
const simpleNameMap = {};
for (const r of existingImages) {
  // Extract the core character name (first part before any movie/phase info)
  const parts = r.characterName.split(' ');
  // Try progressively shorter name prefixes
  for (let i = parts.length; i >= 1; i--) {
    const key = parts.slice(0, i).join(' ').toLowerCase();
    if (!simpleNameMap[key]) {
      simpleNameMap[key] = r.imageUrl;
    }
  }
}

// Step 4: Categorize cards
const reusable = []; // Can copy image from another card
const needsAI = []; // Needs AI generation

for (const card of needsImage) {
  // Exact match first
  if (charImageMap[card.characterName]) {
    reusable.push({
      ...card,
      sourceUrl: charImageMap[card.characterName],
      matchType: 'exact'
    });
    continue;
  }
  
  // Try fuzzy match - check if character name starts with a known character
  const nameLower = card.characterName.toLowerCase();
  let found = false;
  
  // Try matching core name (e.g., "Iron Man" from "Iron Man Tony Stark...")
  const words = card.characterName.split(' ');
  for (let i = Math.min(words.length, 4); i >= 2; i--) {
    const key = words.slice(0, i).join(' ').toLowerCase();
    if (simpleNameMap[key] && key.length > 3) {
      reusable.push({
        ...card,
        sourceUrl: simpleNameMap[key],
        matchType: `fuzzy:${key}`
      });
      found = true;
      break;
    }
  }
  
  if (!found) {
    needsAI.push(card);
  }
}

console.log(`\n=== RESULTS ===`);
console.log(`Total cards needing images (excl Mint): ${needsImage.length}`);
console.log(`Can reuse existing images: ${reusable.length}`);
console.log(`Need AI generation: ${needsAI.length}`);

// Save reusable mapping to JSON
const reusableData = reusable.map(r => ({
  id: r.id,
  characterName: r.characterName,
  cardNumber: r.cardNumber,
  cardType: r.cardType,
  setName: r.setName,
  sourceUrl: r.sourceUrl,
  matchType: r.matchType
}));
fs.writeFileSync('/tmp/reusable_images.json', JSON.stringify(reusableData, null, 2));
console.log(`\nSaved ${reusableData.length} reusable mappings to /tmp/reusable_images.json`);

// Save needs-AI list to JSON
const needsAIData = needsAI.map(r => ({
  id: r.id,
  characterName: r.characterName,
  cardNumber: r.cardNumber,
  cardType: r.cardType,
  setName: r.setName,
  setSlug: r.setSlug
}));
fs.writeFileSync('/tmp/needs_ai_images.json', JSON.stringify(needsAIData, null, 2));
console.log(`Saved ${needsAIData.length} AI generation needs to /tmp/needs_ai_images.json`);

// Get unique character names for AI generation
const uniqueAIChars = [...new Set(needsAI.map(c => c.characterName))].sort();
fs.writeFileSync('/tmp/unique_ai_characters.json', JSON.stringify(uniqueAIChars, null, 2));
console.log(`\nUnique characters needing AI art: ${uniqueAIChars.length}`);

// Print them for review
console.log('\n=== UNIQUE CHARACTERS FOR AI GENERATION ===');
for (const c of uniqueAIChars) {
  console.log(`  - ${c}`);
}

await conn.end();
