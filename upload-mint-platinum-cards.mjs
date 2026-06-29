/**
 * Upload 6 Marvel Mint Platinum card images and update/insert DB records.
 *
 * Cards #112 and #113 already exist in the rotation — update their image + grade data.
 * Cards #101, #102, #104, #107 are new — insert them extending rotation to Aug 22–25.
 *
 * Confirmed from photos:
 *   #101 Spider-Man    — CGC 8.5, Red Refractor
 *   #102 Wolverine     — CGC 9,   Red Refractor
 *   #104 Captain America — PSA 10, Chrome-Red Refractor
 *   #107 Doctor Doom   — CGC 8.5, Red Refractor
 *   #112 Storm         — PSA 10,  Chrome-Red Refractor  (was CGC 9 Black Chrome)
 *   #113 Black Widow   — CGC 10 Pristine, Red Refractor (was CGC 9 Red Chrome)
 */

import "dotenv/config";
import fs from "fs";

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

async function uploadToS3(localPath, key) {
  const fileBuffer = fs.readFileSync(localPath);
  const baseUrl = FORGE_API_URL.replace(/\/+$/, '');
  const normalizedKey = key.replace(/^\/+/, '');
  const uploadUrl = `${baseUrl}/v1/storage/upload?path=${encodeURIComponent(normalizedKey)}`;
  const fileName = normalizedKey.split('/').pop() || normalizedKey;
  const blob = new Blob([fileBuffer], { type: 'image/webp' });
  const form = new FormData();
  form.append('file', blob, fileName);

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json.url;
}

// Character bio data for the new inserts
const CHARACTER_DATA = {
  "#101": {
    characterName: "Spider-Man",
    characterRealName: "Peter Parker",
    characterTagline: "Friendly Neighborhood Spider-Man",
    characterBio: "Bitten by a radioactive spider as a teenager, Peter Parker became New York City's most beloved wall-crawler. Armed with his web-shooters and spider-sense, he balances life as a student, photographer, and hero — driven by the lesson that with great power comes great responsibility.",
    characterFacts: JSON.stringify([
      { k: "First Appearance", v: "Amazing Fantasy #15 (1962)" },
      { k: "Affiliation", v: "Avengers · Fantastic Four" },
      { k: "Alias", v: "Spider-Man, Spidey, Webhead" },
      { k: "Superpower", v: "Wall-crawling, web-slinging, spider-sense" },
    ]),
    buzzNote: "Spider-Man remains the top-selling Marvel card character across all 2025 Topps sets. His Mint Red Refractor is one of the most-watched in the entire set.",
    estimatedPrice: "~$80–140",
  },
  "#102": {
    characterName: "Wolverine",
    characterRealName: "James 'Logan' Howlett",
    characterTagline: "The Best There Is At What He Does",
    characterBio: "With an adamantium skeleton, retractable claws, and a healing factor that borders on immortality, Logan is the best there is at what he does. A century of war, loss, and redemption has forged one of Marvel's most complex heroes.",
    characterFacts: JSON.stringify([
      { k: "First Appearance", v: "Incredible Hulk #181 (1974)" },
      { k: "Affiliation", v: "X-Men · Avengers" },
      { k: "Alias", v: "Wolverine, Logan, Weapon X" },
      { k: "Superpower", v: "Adamantium claws, healing factor, enhanced senses" },
    ]),
    buzzNote: "Wolverine's MCU debut is imminent — his Mint Red Refractor CGC 9 is one of the most-watched in the entire set.",
    estimatedPrice: "~$80–130",
  },
  "#104": {
    characterName: "Captain America",
    characterRealName: "Steve Rogers",
    characterTagline: "The First Avenger",
    characterBio: "A scrawny kid from Brooklyn transformed by the Super-Soldier Serum into the ultimate symbol of courage and justice. Steve Rogers carried his shield through World War II and into the modern era, proving that heroism is a choice, not a superpower.",
    characterFacts: JSON.stringify([
      { k: "First Appearance", v: "Captain America Comics #1 (1941)" },
      { k: "Affiliation", v: "Avengers · S.H.I.E.L.D." },
      { k: "Alias", v: "Cap, Steve Rogers, The First Avenger" },
      { k: "Superpower", v: "Super-Soldier Serum, vibranium shield, peak human strength" },
    ]),
    buzzNote: "Captain America's Mint Chrome-Red Refractor PSA 10 is a gem — one of the cleanest slabs in the entire collection.",
    estimatedPrice: "~$120–200",
  },
  "#107": {
    characterName: "Doctor Doom",
    characterRealName: "Victor Von Doom",
    characterTagline: "Monarch of Latveria",
    characterBio: "Brilliant scientist, sorcerer supreme of Latveria, and self-proclaimed ruler of the world — Victor Von Doom is Marvel's greatest villain and, in his own mind, its greatest hero. His iron mask conceals a face scarred by pride, and a mind that has defeated gods.",
    characterFacts: JSON.stringify([
      { k: "First Appearance", v: "Fantastic Four #5 (1962)" },
      { k: "Affiliation", v: "Latveria · Cabal" },
      { k: "Alias", v: "Doctor Doom, Victor Von Doom, Iron Doom" },
      { k: "Superpower", v: "Genius intellect, sorcery, Doom armor" },
    ]),
    buzzNote: "Doctor Doom is the hottest card character of 2025–2026 with RDJ confirmed as Doom in the MCU. His Mint Red Refractor CGC 8.5 is a strong pickup.",
    estimatedPrice: "~$100–160",
  },
};

async function main() {
  const mysql = await import("mysql2/promise");
  const conn = await mysql.createConnection(DATABASE_URL);

  const CARDS = [
    // UPDATE existing entries
    {
      filename: "#112_front.webp",
      cdnKey: "cotd/mint-storm-112-red-psa10.webp",
      cardNumber: "#112",
      action: "update",
      gradingCompany: "PSA",
      cgcGrade: "10",
      parallelType: "Chrome-Red Refractor",
      printRun: 5,
      buzzNote: "Marvel Mint Chrome-Red Refractor #112 — Storm PSA 10 Gem Mint. One of only FIVE ever made.",
      estimatedPrice: "~$150–250",
    },
    {
      filename: "#113_front.webp",
      cdnKey: "cotd/mint-blackwidow-113-red-cgc10.webp",
      cardNumber: "#113",
      action: "update",
      gradingCompany: "CGC",
      cgcGrade: "10",
      parallelType: "Red Refractor",
      printRun: 5,
      buzzNote: "Marvel Mint Red Refractor #113 — Black Widow CGC 10 Pristine. One of only FIVE ever made.",
      estimatedPrice: "~$200–350",
    },
    // INSERT new entries (extend rotation Aug 22–25)
    {
      filename: "#101_front.webp",
      cdnKey: "cotd/mint-spiderman-101-red-cgc85.webp",
      cardNumber: "#101",
      action: "insert",
      date: "2026-08-22",
      gradingCompany: "CGC",
      cgcGrade: "8.5",
      parallelType: "Red Refractor",
      printRun: 5,
      ...CHARACTER_DATA["#101"],
    },
    {
      filename: "#102_front.webp",
      cdnKey: "cotd/mint-wolverine-102-red-cgc9.webp",
      cardNumber: "#102",
      action: "insert",
      date: "2026-08-23",
      gradingCompany: "CGC",
      cgcGrade: "9",
      parallelType: "Red Refractor",
      printRun: 5,
      ...CHARACTER_DATA["#102"],
    },
    {
      filename: "#104_front.webp",
      cdnKey: "cotd/mint-captainamerica-104-red-psa10.webp",
      cardNumber: "#104",
      action: "insert",
      date: "2026-08-24",
      gradingCompany: "PSA",
      cgcGrade: "10",
      parallelType: "Chrome-Red Refractor",
      printRun: 5,
      ...CHARACTER_DATA["#104"],
    },
    {
      filename: "#107_front.webp",
      cdnKey: "cotd/mint-doom-107-red-cgc85.webp",
      cardNumber: "#107",
      action: "insert",
      date: "2026-08-25",
      gradingCompany: "CGC",
      cgcGrade: "8.5",
      parallelType: "Red Refractor",
      printRun: 5,
      ...CHARACTER_DATA["#107"],
    },
  ];

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

      if (card.action === "update") {
        // Update existing DB row
        const [result] = await conn.execute(
          `UPDATE card_of_the_day_entries 
           SET frontImageUrl = ?, gradingCompany = ?, cgcGrade = ?, parallelType = ?,
               printRun = ?, buzzNote = ?, estimatedPrice = ?
           WHERE cardNumber = ? AND setName = 'mint'`,
          [url, card.gradingCompany, card.cgcGrade, card.parallelType,
           card.printRun, card.buzzNote, card.estimatedPrice, card.cardNumber]
        );
        const rows = result.affectedRows;
        console.log(`✓ UPDATE ${card.cardNumber} → ${url.slice(-55)} (${card.gradingCompany} ${card.cgcGrade}, ${rows} row)`);
        uploaded++;
      } else {
        // Insert new DB row
        const [result] = await conn.execute(
          `INSERT INTO card_of_the_day_entries 
           (date, characterName, characterRealName, characterTagline, characterBio, characterFacts,
            cardNumber, setName, setLabel, frontImageUrl, estimatedPrice, buzzNote, isActive,
            parallelType, printRun, cgcGrade, gradingCompany)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'mint', '2025 Topps Marvel Mint', ?, ?, ?, 1, ?, ?, ?, ?)`,
          [
            card.date,
            card.characterName,
            card.characterRealName,
            card.characterTagline,
            card.characterBio,
            card.characterFacts,
            card.cardNumber,
            url,
            card.estimatedPrice,
            card.buzzNote,
            card.parallelType,
            card.printRun,
            card.cgcGrade,
            card.gradingCompany,
          ]
        );
        console.log(`✓ INSERT ${card.date} ${card.cardNumber} ${card.characterName} → ${url.slice(-55)} (${card.gradingCompany} ${card.cgcGrade})`);
        uploaded++;
      }
    } catch (err) {
      console.error(`✗ ${card.cardNumber}: ${err.message}`);
      errors++;
    }
  }

  await conn.end();
  console.log(`\nDone: ${uploaded} processed, ${errors} errors`);
  process.exit(0);
}

main().catch(console.error);
