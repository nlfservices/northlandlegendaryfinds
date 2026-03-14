import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all Marvel Studios cards (setId=5)
const [all] = await conn.query(`
  SELECT id, cardNumber, characterName, cardType, imageUrl 
  FROM marvel_cards WHERE setId = 5
  ORDER BY cardNumber
`);
console.log('Total Marvel Studios cards:', all.length);

// Count unique images
const uniqueImages = new Set(all.map(c => c.imageUrl));
console.log('Unique image URLs:', uniqueImages.size);

// Find duplicate images (same URL used by multiple cards)
const urlCount = {};
for (const c of all) {
  const url = c.imageUrl || 'NULL';
  if (!urlCount[url]) urlCount[url] = [];
  urlCount[url].push(c);
}

const needsNewImage = [];
let diffCharGroups = 0;
let sameCharDiffSubset = 0;

for (const [url, cards] of Object.entries(urlCount)) {
  if (cards.length > 1) {
    const charNames = new Set(cards.map(c => c.characterName));
    if (charNames.size > 1) {
      // Different characters sharing same image
      diffCharGroups++;
      console.log(`\nDIFF CHARS sharing image (${cards.length} cards):`);
      for (const c of cards) {
        console.log(`  ${c.id} | ${c.cardNumber} | ${c.characterName} | ${c.cardType}`);
        needsNewImage.push(c);
      }
    } else {
      // Same character in different subsets
      const cardTypes = new Set(cards.map(c => c.cardType));
      if (cardTypes.size > 1) {
        sameCharDiffSubset++;
        // Keep first, mark rest for new image
        for (let i = 1; i < cards.length; i++) {
          needsNewImage.push(cards[i]);
        }
      }
    }
  }
}

console.log('\n=== SUMMARY ===');
console.log('Total cards:', all.length);
console.log('Unique images:', uniqueImages.size);
console.log('Groups with different characters sharing image:', diffCharGroups);
console.log('Groups with same char in different subsets:', sameCharDiffSubset);
console.log('Cards needing new unique images:', needsNewImage.length);

const uniqueChars = new Set(needsNewImage.map(c => c.characterName));
console.log('Unique characters needing images:', uniqueChars.size);

// Break down by cardType
const byType = {};
for (const c of needsNewImage) {
  if (!byType[c.cardType]) byType[c.cardType] = 0;
  byType[c.cardType]++;
}
console.log('\nBreakdown by card type:');
for (const [type, count] of Object.entries(byType).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${type}: ${count}`);
}

// List all unique characters needing images
console.log('\nAll unique characters needing new images:');
const charList = [...uniqueChars].sort();
for (const ch of charList) {
  const cards = needsNewImage.filter(c => c.characterName === ch);
  console.log(`  ${ch} (${cards.length} cards): ${cards.map(c => c.cardType).join(', ')}`);
}

await conn.end();
