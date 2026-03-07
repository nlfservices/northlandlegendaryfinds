import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Read Chrome CDN URLs
const urlLines = fs.readFileSync('/home/ubuntu/chrome_cdn_urls.txt', 'utf8').trim().split('\n');

// Parse: "[SUCCESS] CHROME-001_Iron_Man.webp -> https://..."
const urlMap = {};
urlLines.forEach(line => {
  const match = line.match(/CHROME-(\d+)_.*?\.webp -> (https:\/\/\S+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    urlMap[num] = match[2];
  }
});

console.log(`Parsed ${Object.keys(urlMap).length} Chrome CDN URLs`);
console.log(`Sample: #1 -> ${urlMap[1]?.substring(0, 60)}...`);

// Get all Chrome base cards (setId=1, cardType='Base')
const [baseCards] = await conn.execute(
  "SELECT id, cardNumber, characterName FROM marvel_cards WHERE setId = 1 AND cardType = 'Base' ORDER BY CAST(cardNumber AS UNSIGNED)"
);
console.log(`Found ${baseCards.length} Chrome base cards in DB`);

// Update each base card with its image URL
let updated = 0;
let missing = 0;
for (const card of baseCards) {
  const num = parseInt(card.cardNumber, 10);
  const url = urlMap[num];
  if (url) {
    await conn.execute(
      "UPDATE marvel_cards SET imageUrl = ? WHERE id = ?",
      [url, card.id]
    );
    updated++;
  } else {
    console.log(`  No image for card #${card.cardNumber} ${card.characterName}`);
    missing++;
  }
}

console.log(`\nUpdated ${updated} Chrome base cards with character images`);
if (missing > 0) console.log(`Missing images for ${missing} cards`);

// Verify
const [verify] = await conn.execute(
  "SELECT cardNumber, characterName, imageUrl FROM marvel_cards WHERE setId = 1 AND cardType = 'Base' AND imageUrl IS NOT NULL ORDER BY CAST(cardNumber AS UNSIGNED) LIMIT 5"
);
console.log('\nVerification (first 5):');
verify.forEach(c => console.log(`  #${c.cardNumber} ${c.characterName}: ${c.imageUrl.substring(0, 60)}...`));

// Count total with images
const [countResult] = await conn.execute(
  "SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 1 AND cardType = 'Base' AND imageUrl IS NOT NULL"
);
console.log(`\nTotal Chrome base cards with images: ${countResult[0].cnt}`);

await conn.end();
console.log('Done!');
