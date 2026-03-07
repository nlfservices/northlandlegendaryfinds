import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

function parseCdnUrls(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const urls = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/CDN URL: (https:\/\/[^\s]+)/);
    if (match) {
      const url = match[1];
      const filename = url.split('/').pop();
      urls[filename] = url;
    }
  }
  return urls;
}

function extractCardNumber(filename) {
  // CBH: "001-black-widow-front_hash.webp" -> 1
  // Mint: "mint-001-front_hash.webp" -> 1
  const match = filename.match(/(?:mint-)?(\d+)-/);
  return match ? parseInt(match[1]) : null;
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Parsing CDN URLs...');
  const cbhFronts = parseCdnUrls('/home/ubuntu/cbh-cropped-front-urls.txt');
  const cbhBacks = parseCdnUrls('/home/ubuntu/cbh-cropped-back-urls.txt');
  const mintFronts = parseCdnUrls('/home/ubuntu/mint-cropped-front-urls.txt');
  
  console.log(`CBH fronts: ${Object.keys(cbhFronts).length}, backs: ${Object.keys(cbhBacks).length}`);
  console.log(`Mint fronts: ${Object.keys(mintFronts).length}`);
  
  // CBH set = 2, cards have cardNumber = "1", "2", ... "150"
  let cbhUpdated = 0;
  for (const [filename, url] of Object.entries(cbhFronts)) {
    const num = extractCardNumber(filename);
    if (!num) continue;
    
    // Find matching back
    const backEntry = Object.entries(cbhBacks).find(([fn]) => {
      const backNum = extractCardNumber(fn);
      return backNum === num && fn.includes('back');
    });
    const backUrl = backEntry ? backEntry[1] : null;
    
    const cardNum = String(num);
    
    if (backUrl) {
      const [result] = await conn.query(
        'UPDATE marvel_cards SET imageUrl = ?, back_image_url = ? WHERE setId = 2 AND cardNumber = ?',
        [url, backUrl, cardNum]
      );
      if (result.affectedRows > 0) cbhUpdated++;
    } else {
      const [result] = await conn.query(
        'UPDATE marvel_cards SET imageUrl = ? WHERE setId = 2 AND cardNumber = ?',
        [url, cardNum]
      );
      if (result.affectedRows > 0) cbhUpdated++;
    }
  }
  console.log(`Updated ${cbhUpdated} CBH cards`);
  
  // Mint set = 3, cards have cardNumber = "1", "2", ... "120"
  // Images: mint-001 = card #1 (Hercules, Bronze), mint-066 = card #66, mint-101 = card #101
  let mintUpdated = 0;
  for (const [filename, url] of Object.entries(mintFronts)) {
    const num = extractCardNumber(filename);
    if (!num) continue;
    
    const cardNum = String(num);
    const [result] = await conn.query(
      'UPDATE marvel_cards SET imageUrl = ? WHERE setId = 3 AND cardNumber = ?',
      [url, cardNum]
    );
    if (result.affectedRows > 0) mintUpdated++;
  }
  console.log(`Updated ${mintUpdated} Mint cards`);
  
  // Summary
  const [imgCount] = await conn.query('SELECT COUNT(*) as c FROM marvel_cards WHERE imageUrl IS NOT NULL');
  const [backCount] = await conn.query('SELECT COUNT(*) as c FROM marvel_cards WHERE back_image_url IS NOT NULL');
  console.log(`\nTotal cards with front images: ${imgCount[0].c}`);
  console.log(`Total cards with back images: ${backCount[0].c}`);
  
  await conn.end();
}

main().catch(console.error);
