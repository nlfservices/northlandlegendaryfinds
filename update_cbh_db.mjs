import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Read CBH CDN URLs
const urlLines = fs.readFileSync('/home/ubuntu/cbh_cdn_urls.txt', 'utf8').trim().split('\n');

// Parse: "[SUCCESS] CBH-001_Black_Widow.webp -> https://..."
const urlMap = {};
urlLines.forEach(line => {
  const match = line.match(/CBH-(\d+)_.*?\.webp -> (https:\/\/\S+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    urlMap[num] = match[2];
  }
});

console.log(`Parsed ${Object.keys(urlMap).length} CBH CDN URLs`);

// Check which numbers are missing (should be 4 and 99)
const allNums = Array.from({length: 150}, (_, i) => i + 1);
const missingNums = allNums.filter(n => !urlMap[n]);
console.log(`Missing image numbers: ${missingNums.join(', ')}`);

// Get all CBH cards (setId=2)
const [cbhCards] = await conn.execute(
  "SELECT id, cardNumber, characterName, imageUrl FROM marvel_cards WHERE setId = 2 ORDER BY CAST(cardNumber AS UNSIGNED)"
);
console.log(`Found ${cbhCards.length} CBH cards in DB`);

// Update each card with its new character-specific image URL
let updated = 0;
let missing = 0;
for (const card of cbhCards) {
  const num = parseInt(card.cardNumber, 10);
  const url = urlMap[num];
  if (url) {
    await conn.execute(
      "UPDATE marvel_cards SET imageUrl = ? WHERE id = ?",
      [url, card.id]
    );
    updated++;
  } else {
    console.log(`  No new image for card #${card.cardNumber} ${card.characterName} (keeping existing: ${card.imageUrl ? 'yes' : 'no'})`);
    missing++;
  }
}

console.log(`\nUpdated ${updated} CBH cards with new character-specific images`);
if (missing > 0) console.log(`${missing} cards kept existing images (missing new artwork)`);

// Verify
const [verify] = await conn.execute(
  "SELECT cardNumber, characterName, imageUrl FROM marvel_cards WHERE setId = 2 ORDER BY CAST(cardNumber AS UNSIGNED) LIMIT 5"
);
console.log('\nVerification (first 5):');
verify.forEach(c => console.log(`  #${c.cardNumber} ${c.characterName}: ${c.imageUrl?.substring(0, 60)}...`));

// Count total with images
const [countResult] = await conn.execute(
  "SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 2 AND imageUrl IS NOT NULL"
);
console.log(`\nTotal CBH cards with images: ${countResult[0].cnt}`);

await conn.end();
console.log('Done!');
