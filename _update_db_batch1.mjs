import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';

// Read the batch1 successes (character name -> local file path)
const successes = JSON.parse(fs.readFileSync('/tmp/batch1_successes.json', 'utf8'));

// Read the CDN URLs (local filename -> CDN URL)
const cdnLines = fs.readFileSync('/tmp/cdn_urls_batch1.txt', 'utf8').trim().split('\n');
const cdnMap = {};
for (const line of cdnLines) {
  const [filename, url] = line.split('|');
  cdnMap[filename] = url;
}

// Build character name -> CDN URL mapping
const charToCdn = {};
for (const s of successes) {
  const localFile = s.file;
  const filename = localFile.split('/').pop();
  const cdnUrl = cdnMap[filename];
  if (cdnUrl) {
    charToCdn[s.name] = cdnUrl;
  } else {
    console.log(`WARNING: No CDN URL for ${s.name} (file: ${filename})`);
  }
}

console.log(`Mapped ${Object.keys(charToCdn).length} characters to CDN URLs`);

// Connect to database
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// For each character, update ALL matching cards (across all sets except Mint)
let totalUpdated = 0;
for (const [charName, cdnUrl] of Object.entries(charToCdn)) {
  // Find cards with this exact characterName that have no image
  const [rows] = await conn.execute(
    `SELECT mc.id, mc.characterName, ms.name as set_name 
     FROM marvel_cards mc 
     JOIN marvel_sets ms ON mc.setId = ms.id 
     WHERE mc.characterName = ? 
     AND (mc.imageUrl IS NULL OR mc.imageUrl = '')
     AND ms.name NOT LIKE '%Mint%'`,
    [charName]
  );
  
  if (rows.length > 0) {
    const [result] = await conn.execute(
      `UPDATE marvel_cards SET imageUrl = ? 
       WHERE characterName = ? 
       AND (imageUrl IS NULL OR imageUrl = '')
       AND setId IN (SELECT id FROM marvel_sets WHERE name NOT LIKE '%Mint%')`,
      [cdnUrl, charName]
    );
    totalUpdated += result.affectedRows;
    console.log(`Updated ${result.affectedRows} cards for: ${charName}`);
  } else {
    console.log(`No match for: ${charName}`);
  }
}

console.log(`\nTotal cards updated: ${totalUpdated}`);

// Check remaining cards without images
const [remaining] = await conn.execute(
  `SELECT ms.name, COUNT(*) as cnt 
   FROM marvel_cards mc 
   JOIN marvel_sets ms ON mc.setId = ms.id 
   WHERE (mc.imageUrl IS NULL OR mc.imageUrl = '') 
   AND ms.name NOT LIKE '%Mint%'
   GROUP BY ms.name`
);
console.log('\n=== REMAINING CARDS WITHOUT IMAGES ===');
let totalRemaining = 0;
for (const r of remaining) {
  console.log(`${r.name}: ${r.cnt} cards`);
  totalRemaining += Number(r.cnt);
}
console.log(`Total remaining: ${totalRemaining}`);

await conn.end();
