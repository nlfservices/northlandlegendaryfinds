/**
 * Seed script: Populate card_of_the_day_entries for the 11 cards
 * that have actual Black Refractor images uploaded.
 * Run: node seed-cotd.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Map card number → S3 image URL (from manus-upload-file --webdev output)
const CARD_IMAGES = {
  "#103": "/manus-storage/#103a_0b730bf7.webp",
  "#105": "/manus-storage/#105c_980041c6.webp",
  "#108": "/manus-storage/#108_703573c1.webp",
  "#109": "/manus-storage/#109a_8b4968a5.webp",
  "#110": "/manus-storage/#110a_d0ff4d51.webp",
  "#111": "/manus-storage/#111_d7152afa.webp",
  "#112": "/manus-storage/#112_1450636d.webp",
  "#114": "/manus-storage/#114_8306c856.webp",
  "#115": "/manus-storage/#115_f12fcc1c.webp",
  "#116": "/manus-storage/#116_48785bae.webp",
  "#117": "/manus-storage/#117b_42b49559.webp",
};

// CGC grades for display
const CGC_GRADES = {
  "#103": "CGC 10 Gem Mint",
  "#105": "CGC 8 NM/Mint",
  "#108": "CGC 10 Gem Mint",
  "#109": "CGC 10 Gem Mint",
  "#110": "CGC 10 Gem Mint",
  "#111": "CGC 7.5 Near Mint+",
  "#112": "CGC 9 Mint",
  "#114": "CGC 8 NM/Mint",
  "#115": "CGC 10 Gem Mint",
  "#116": "CGC 10 Gem Mint",
  "#117": "CGC 9.5 Mint+",
};

// Build the connection from DATABASE_URL
// Format: mysql://user:pass@host:port/dbname
const url = new URL(DB_URL);
const conn = await mysql.createConnection({
  host: url.hostname,
  port: parseInt(url.port || "3306"),
  user: url.username,
  password: url.password,
  database: url.pathname.replace(/^\//, ""),
  ssl: { rejectUnauthorized: false },
});

// Update existing rows that have card images available
const updates = Object.entries(CARD_IMAGES);
let updated = 0;
let skipped = 0;

for (const [cardNum, imgPath] of updates) {
  const grade = CGC_GRADES[cardNum];
  const buzzSuffix = grade ? ` (NLF Collection: ${grade} Black Refractor /10)` : "";
  
  // Update the frontImageUrl for any row matching this cardNumber
  const [result] = await conn.execute(
    `UPDATE card_of_the_day_entries 
     SET frontImageUrl = ?, updatedAt = NOW()
     WHERE cardNumber = ? AND (frontImageUrl IS NULL OR frontImageUrl = '')`,
    [imgPath, cardNum]
  );
  
  if (result.affectedRows > 0) {
    console.log(`✓ Updated ${cardNum} with image`);
    updated++;
  } else {
    // Check if row exists but already has image
    const [rows] = await conn.execute(
      `SELECT id, frontImageUrl FROM card_of_the_day_entries WHERE cardNumber = ?`,
      [cardNum]
    );
    if (rows.length > 0) {
      console.log(`  Skipped ${cardNum} (already has image: ${rows[0].frontImageUrl?.substring(0, 50)})`);
      skipped++;
    } else {
      console.log(`  No row found for ${cardNum} yet (will be created on rotation day)`);
    }
  }
}

await conn.end();
console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
