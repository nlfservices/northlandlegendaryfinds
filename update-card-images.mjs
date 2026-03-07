import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// First, add description and backImageUrl columns if they don't exist
try {
  await conn.execute("ALTER TABLE marvel_cards ADD COLUMN description TEXT");
  console.log("Added description column");
} catch (e) {
  if (e.code === 'ER_DUP_FIELDNAME') console.log("description column already exists");
  else throw e;
}

try {
  await conn.execute("ALTER TABLE marvel_cards ADD COLUMN back_image_url VARCHAR(512)");
  console.log("Added back_image_url column");
} catch (e) {
  if (e.code === 'ER_DUP_FIELDNAME') console.log("back_image_url column already exists");
  else throw e;
}

// Parse CDN URL files
function parseCdnUrls(filePath) {
  const lines = readFileSync(filePath, 'utf-8').trim().split('\n');
  const mapping = {};
  for (const line of lines) {
    // Format: [SUCCESS] 001-black-widow-front.webp -> https://...
    const match = line.match(/\[SUCCESS\] (\d+)-.*?\.webp -> (https:\/\/\S+)/);
    if (match) {
      const num = match[1];
      const url = match[2];
      mapping[num] = url;
    }
  }
  return mapping;
}

const frontUrls = parseCdnUrls('/home/ubuntu/cbh-cdn-urls.txt');
const backUrls = parseCdnUrls('/home/ubuntu/cbh-cdn-urls-back.txt');

console.log(`Front URLs: ${Object.keys(frontUrls).length}`);
console.log(`Back URLs: ${Object.keys(backUrls).length}`);

// Get Comic Book Heroes set ID
const [sets] = await conn.execute("SELECT id FROM marvel_sets WHERE slug = '2025-topps-comic-book-heroes'");
const cbhSetId = sets[0].id;
console.log(`CBH set ID: ${cbhSetId}`);

// Get all CBH cards from database
const [cards] = await conn.execute("SELECT id, cardNumber, characterName FROM marvel_cards WHERE setId = ?", [cbhSetId]);
console.log(`CBH cards in DB: ${cards.length}`);

// Update each card with CDN URLs
let updated = 0;
for (const card of cards) {
  const num = card.cardNumber.padStart(3, '0');
  const frontUrl = frontUrls[num];
  const backUrl = backUrls[num];
  
  if (frontUrl) {
    await conn.execute(
      "UPDATE marvel_cards SET imageUrl = ?, back_image_url = ? WHERE id = ?",
      [frontUrl, backUrl || null, card.id]
    );
    updated++;
  }
}

console.log(`Updated ${updated} cards with CDN image URLs`);

// Also upload the user's Hulk image as a generic placeholder
// Save the CDN base URL pattern for later use
console.log("\nCDN base: https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/");

await conn.end();
console.log("Done!");
