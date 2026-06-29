/**
 * Upload 6 missing Marvel Mint card images to S3/CDN and update DB
 * Cards: #101 Spider-Man, #102 Wolverine, #104 Captain America,
 *        #107 Doctor Doom, #112 Storm, #113 Black Widow
 *
 * Note: The previous seed had incorrect character assignments for some of these cards.
 * Corrected data from photos:
 *   #101 = Spider-Man, CGC 8.5, Red Refractor
 *   #102 = Wolverine, CGC 9, Red Refractor
 *   #104 = Captain America, PSA 10, Chrome-Red Refractor
 *   #107 = Doctor Doom, CGC 8.5, Red Refractor
 *   #112 = Storm, PSA 10, Chrome-Red Refractor
 *   #113 = Black Widow, CGC 10 Pristine, Red Refractor
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error("Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

// Cards to upload — filename → card info
const CARDS = [
  {
    filename: "#101_front.webp",
    cdnKey: "cotd/mint-spiderman-101-red.webp",
    date: "2026-08-08", // This date was previously assigned to Iron Man #103 — need to check
    cardNumber: "#101",
    characterName: "Spider-Man",
    gradingCompany: "CGC",
    cgcGrade: "8.5",
    parallelType: "Red Refractor",
  },
  {
    filename: "#102_front.webp",
    cdnKey: "cotd/mint-wolverine-102-red.webp",
    date: null, // will look up by cardNumber
    cardNumber: "#102",
    characterName: "Wolverine",
    gradingCompany: "CGC",
    cgcGrade: "9",
    parallelType: "Red Refractor",
  },
  {
    filename: "#104_front.webp",
    cdnKey: "cotd/mint-captainamerica-104-red.webp",
    date: null,
    cardNumber: "#104",
    characterName: "Captain America",
    gradingCompany: "PSA",
    cgcGrade: "10",
    parallelType: "Chrome-Red Refractor",
  },
  {
    filename: "#107_front.webp",
    cdnKey: "cotd/mint-doom-107-red.webp",
    date: null,
    cardNumber: "#107",
    characterName: "Doctor Doom",
    gradingCompany: "CGC",
    cgcGrade: "8.5",
    parallelType: "Red Refractor",
  },
  {
    filename: "#112_front.webp",
    cdnKey: "cotd/mint-storm-112-red.webp",
    date: null,
    cardNumber: "#112",
    characterName: "Storm",
    gradingCompany: "PSA",
    cgcGrade: "10",
    parallelType: "Chrome-Red Refractor",
  },
  {
    filename: "#113_front.webp",
    cdnKey: "cotd/mint-blackwidow-113-red.webp",
    date: null,
    cardNumber: "#113",
    characterName: "Black Widow",
    gradingCompany: "CGC",
    cgcGrade: "10",
    parallelType: "Red Refractor",
  },
];

async function uploadToS3(localPath, key) {
  const fileBuffer = fs.readFileSync(localPath);
  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: "image/webp" });
  formData.append("file", blob, key);
  formData.append("key", key);

  const res = await fetch(`${FORGE_API_URL}/v1/storage/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json.url || json.data?.url || json.data?.cdnUrl;
}

async function updateDB(cardNumber, imageUrl, gradingCompany, cgcGrade, parallelType) {
  // Use mysql2 to update the DB
  const mysql = await import("mysql2/promise");
  const conn = await mysql.createConnection(DATABASE_URL);

  // Update by cardNumber and setName containing 'Mint'
  const [result] = await conn.execute(
    `UPDATE card_of_the_day_entries 
     SET front_image_url = ?, grading_company = ?, cgc_grade = ?, parallel_type = ?
     WHERE card_number = ? AND set_name LIKE '%Mint%'`,
    [imageUrl, gradingCompany, cgcGrade, parallelType, cardNumber]
  );

  await conn.end();
  return result.affectedRows;
}

async function main() {
  let uploaded = 0;
  let errors = 0;

  for (const card of CARDS) {
    const localPath = `/home/ubuntu/upload/${card.filename}`;

    if (!fs.existsSync(localPath)) {
      console.error(`✗ File not found: ${localPath}`);
      errors++;
      continue;
    }

    try {
      // Upload to S3
      const url = await uploadToS3(localPath, card.cdnKey);
      if (!url) throw new Error("No URL returned from upload");

      // Update DB
      const rows = await updateDB(
        card.cardNumber,
        url,
        card.gradingCompany,
        card.cgcGrade,
        card.parallelType
      );

      if (rows === 0) {
        console.warn(`⚠ ${card.cardNumber} ${card.characterName} — no DB row updated (check card_number/set_name)`);
      } else {
        console.log(`✓ ${card.cardNumber} ${card.characterName} → ${url.slice(-50)} (${card.gradingCompany} ${card.cgcGrade}, ${rows} row updated)`);
        uploaded++;
      }
    } catch (err) {
      console.error(`✗ ${card.cardNumber} ${card.characterName}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${uploaded} uploaded, ${errors} errors`);
}

main().catch(console.error);
