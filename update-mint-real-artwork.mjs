import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import { execSync } from 'child_process';

// Collectus CDN image URL pattern for Marvel Mint
// Formula: card_number * 2 - 1, padded to 4 digits
const BASE_IMAGE_URL = 'https://d268458inzf7p0.cloudfront.net/images/Collectus/MarvelDatabase/2025Mint/543500_BASE_';

function getImageUrl(cardNumber) {
  const imageId = String(cardNumber * 2 - 1).padStart(4, '0');
  return `${BASE_IMAGE_URL}${imageId}.jpg`;
}

function uploadToCDN(imageUrl, filename) {
  const tmpPath = `/tmp/${filename}`;
  try {
    execSync(`curl -sL "${imageUrl}" -o "${tmpPath}"`, { timeout: 30000 });
    
    const stats = fs.statSync(tmpPath);
    if (stats.size < 1000) {
      fs.unlinkSync(tmpPath);
      return null;
    }
    
    const result = execSync(`manus-upload-file --webdev "${tmpPath}"`, { 
      timeout: 30000,
      encoding: 'utf8'
    }).trim();
    
    fs.unlinkSync(tmpPath);
    
    // manus-upload-file returns: "Storage Path: /manus-storage/filename_hash.jpg"
    const pathMatch = result.match(/Storage Path:\s*(\/manus-storage\/[^\s]+)/);
    if (pathMatch) {
      return pathMatch[1]; // e.g. /manus-storage/mint-topps-001_abc123.jpg
    }
    
    // Fallback: check for https URL
    const urlMatch = result.match(/https?:\/\/[^\s]+/);
    if (urlMatch) return urlMatch[0];
    
    console.log(`  ⚠️ Could not parse output: ${result.substring(0, 100)}`);
    return null;
  } catch (err) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    console.log(`  ⚠️ Error: ${err.message.substring(0, 80)}`);
    return null;
  }
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get only BASE CARDS (Bronze, Silver, Gold) - these are cards 1-100 with numeric cardNumbers
  const [cards] = await conn.query(`
    SELECT id, cardNumber, characterName, imageUrl, cardType 
    FROM marvel_cards 
    WHERE setId = 3 
      AND cardType IN ('BASE CARDS – BRONZE', 'BASE CARDS – SILVER', 'BASE CARDS – GOLD', 'BASE CARDS – PLATINUM')
    ORDER BY CAST(cardNumber AS UNSIGNED)
  `);
  
  console.log(`Found ${cards.length} base/tier cards in Marvel Mint set`);
  
  // Group by card number to avoid duplicates
  const cardsByNumber = {};
  for (const card of cards) {
    const num = parseInt(card.cardNumber);
    if (isNaN(num)) continue;
    if (!cardsByNumber[num]) cardsByNumber[num] = [];
    cardsByNumber[num].push(card);
  }
  
  console.log(`Unique card numbers: ${Object.keys(cardsByNumber).length}`);
  console.log('');
  
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const [numStr, cardGroup] of Object.entries(cardsByNumber)) {
    const num = parseInt(numStr);
    
    // Only base cards 1-100 have images on Collectus CDN
    if (num > 100) {
      skipped += cardGroup.length;
      continue;
    }
    
    // Check if any card in this group already has a real graded photo (CDN URL)
    const hasRealPhoto = cardGroup.some(c => c.imageUrl && c.imageUrl.includes('d2xsxph8kpxj0f.cloudfront.net'));
    if (hasRealPhoto) {
      console.log(`  ✅ #${num} ${cardGroup[0].characterName} - has real graded photo, skipping`);
      skipped += cardGroup.length;
      continue;
    }
    
    const collectusUrl = getImageUrl(num);
    const filename = `mint-topps-${String(num).padStart(3, '0')}.jpg`;
    
    process.stdout.write(`📥 #${num} ${cardGroup[0].characterName}...`);
    
    const cdnUrl = uploadToCDN(collectusUrl, filename);
    
    if (cdnUrl) {
      // Update ALL tier variants of this card number with the same image
      for (const card of cardGroup) {
        await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [cdnUrl, card.id]);
      }
      console.log(` ✅ (${cardGroup.length} variants)`);
      updated += cardGroup.length;
    } else {
      console.log(` ❌ FAILED`);
      failed += cardGroup.length;
    }
    
    // Small delay
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('');
  console.log('=== SUMMARY ===');
  console.log(`Updated: ${updated} card records`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  
  await conn.end();
}

main().catch(console.error);
