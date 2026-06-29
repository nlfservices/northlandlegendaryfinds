/**
 * Upload all card images to the project's S3 storage using the Forge API
 * and update the DB entries with the correct CDN URLs.
 */
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const DB_URL = process.env.DATABASE_URL;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY');
  process.exit(1);
}

async function storagePut(relKey, fileBuffer, contentType = 'image/webp') {
  const baseUrl = FORGE_API_URL.endsWith('/') ? FORGE_API_URL : FORGE_API_URL + '/';
  const uploadUrl = new URL('v1/storage/upload', baseUrl);
  const normalizedKey = relKey.replace(/^\/+/, '');
  uploadUrl.searchParams.set('path', normalizedKey);
  // Use FormData POST (same as server/storage.ts)
  const fileName = normalizedKey.split('/').pop() || normalizedKey;
  const blob = new Blob([fileBuffer], { type: contentType });
  const form = new FormData();
  form.append('file', blob, fileName);
  const res = await fetch(uploadUrl.toString(), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FORGE_API_KEY}`,
    },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${relKey}: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json.url;
}

// Map: filename in upload_renamed -> { date, description }
const CARD_FILES = [
  // CBH50 cards
  { file: 'card13.webp',    date: '2026-06-29', key: 'cotd/cbh50-ironman-13-black-gold.webp' },
  { file: 'card10.webp',    date: '2026-06-30', key: 'cotd/cbh50-hulk-10-black-gold.webp' },
  { file: 'card31.webp',    date: '2026-07-01', key: 'cotd/cbh50-captainamerica-31-black-gold.webp' },
  { file: 'card32.webp',    date: '2026-07-02', key: 'cotd/cbh50-cyclops-32-black-gold.webp' },
  { file: 'card37.webp',    date: '2026-07-03', key: 'cotd/cbh50-galactus-37-black-gold.webp' },
  { file: 'card51.webp',    date: '2026-07-04', key: 'cotd/cbh50-spiderman-51-black-gold.webp' },
  { file: 'card93.webp',    date: '2026-07-05', key: 'cotd/cbh50-spiderman-93-black-gold.webp' },
  { file: 'card108b.webp',  date: '2026-07-06', key: 'cotd/cbh50-captainamerica-108-black-gold.webp' },
  { file: 'img_cbh_doom_purple.webp',  date: '2026-07-07', key: 'cotd/cbh50-doom-4-purple-gold.webp' },
  { file: 'img_cbh_doom_green.webp',   date: '2026-07-08', key: 'cotd/cbh50-doom-green-refractor.webp' },
  { file: 'img_cbh_doom_red.webp',     date: '2026-07-09', key: 'cotd/cbh50-doom-115-red-gold.webp' },
  { file: 'img_cbh_spiderman_nlf.webp',date: '2026-07-10', key: 'cotd/cbh50-spiderman-nlf-stand.webp' },
  // Studios Chrome cards
  { file: 'card1.webp',     date: '2026-07-11', key: 'cotd/studios-ironman-1-black.webp' },
  { file: 'card3b.webp',    date: '2026-07-12', key: 'cotd/studios-captainamerica-3-black.webp' },
  { file: 'card6.webp',     date: '2026-07-13', key: 'cotd/studios-thor-6-black.webp' },
  { file: 'card22a.webp',   date: '2026-07-14', key: 'cotd/studios-antman-22-black.webp' },
  { file: 'card25b.webp',   date: '2026-07-15', key: 'cotd/studios-doctorstrange-25-black.webp' },
  { file: 'card29.webp',    date: '2026-07-16', key: 'cotd/studios-spiderman-29-black.webp' },
  { file: 'card44.webp',    date: '2026-07-17', key: 'cotd/studios-scarletwitch-44-black.webp' },
  { file: 'card45a.webp',   date: '2026-07-18', key: 'cotd/studios-falcon-45-black.webp' },
  { file: 'card51c.webp',   date: '2026-07-19', key: 'cotd/studios-shangchi-51-black.webp' },
  { file: 'card54b.webp',   date: '2026-07-20', key: 'cotd/studios-msmarvel-54-black.webp' },
  { file: 'card71.webp',    date: '2026-07-21', key: 'cotd/studios-wolverine-71-black.webp' },
  { file: 'card73.webp',    date: '2026-07-22', key: 'cotd/studios-storm-73-black.webp' },
  { file: 'card81.webp',    date: '2026-07-23', key: 'cotd/studios-mrfantastic-81-black.webp' },
  { file: 'card97a.webp',   date: '2026-07-24', key: 'cotd/studios-blackpanther-97-black.webp' },
  { file: 'card99.webp',    date: '2026-07-25', key: 'cotd/studios-daredevil-99-black.webp' },
  { file: 'card121b.webp',  date: '2026-07-26', key: 'cotd/studios-doom-121-black.webp' },
  { file: 'card148a.webp',  date: '2026-07-27', key: 'cotd/studios-magneto-148-black.webp' },
  // Studios Chrome Gold/Orange/Red
  { file: 'img_studios_blackpanther_gold.webp',      date: '2026-07-28', key: 'cotd/studios-blackpanther-79-gold.webp' },
  { file: 'img_studios_mrfantastic_goldwave.webp',   date: '2026-07-29', key: 'cotd/studios-mrfantastic-194-goldwave.webp' },
  { file: 'img_studios_spiderman_gold.webp',         date: '2026-07-30', key: 'cotd/studios-spiderman-gold.webp' },
  { file: 'img_studios_mrfantastic_orange.webp',     date: '2026-07-31', key: 'cotd/studios-mrfantastic-orange.webp' },
  { file: 'img_studios_invisiblewoman_goldwave.webp',date: '2026-08-01', key: 'cotd/studios-invisiblewoman-goldwave.webp' },
  { file: 'img_studios_blackpanther_orange.webp',    date: '2026-08-02', key: 'cotd/studios-blackpanther-orange.webp' },
  { file: 'img_studios_thor_red.webp',               date: '2026-08-03', key: 'cotd/studios-thor-red.webp' },
  { file: 'img_studios_blackwidow_gold.webp',        date: '2026-08-04', key: 'cotd/studios-blackwidow-gold.webp' },
  { file: 'img_studios_hulk_gold.webp',              date: '2026-08-05', key: 'cotd/studios-hulk-gold.webp' },
  { file: 'img_studios_spiderman_gold.webp',         date: '2026-08-06', key: 'cotd/studios-spiderman-gold-2.webp' },
  { file: 'img_studios_invisiblewoman_orange.webp',  date: '2026-08-07', key: 'cotd/studios-invisiblewoman-orange.webp' },
  // Marvel Mint cards
  { file: 'card103a.webp',  date: '2026-08-08', key: 'cotd/mint-ironman-103-black.webp' },
  { file: 'card105c.webp',  date: '2026-08-09', key: 'cotd/mint-thor-105-black.webp' },
  { file: 'card106.webp',   date: '2026-08-10', key: 'cotd/mint-mrfantastic-106-red.webp' },
  { file: 'card108.webp',   date: '2026-08-11', key: 'cotd/mint-rogue-108-black.webp' },
  { file: 'card109a.webp',  date: '2026-08-12', key: 'cotd/mint-hulk-109-black.webp' },
  { file: 'card110a.webp',  date: '2026-08-13', key: 'cotd/mint-doctorstrange-110-black.webp' },
  { file: 'card111.webp',   date: '2026-08-14', key: 'cotd/mint-blade-111-black.webp' },
  { file: 'card112.webp',   date: '2026-08-15', key: 'cotd/mint-storm-112-black.webp' },
  { file: 'card113.webp',   date: '2026-08-16', key: 'cotd/mint-blackwidow-113-red.webp' },
  { file: 'card114.webp',   date: '2026-08-17', key: 'cotd/mint-venom-114-black.webp' },
  { file: 'card115.webp',   date: '2026-08-18', key: 'cotd/mint-magneto-115-black.webp' },
  { file: 'card116.webp',   date: '2026-08-19', key: 'cotd/mint-daredevil-116-black.webp' },
  { file: 'card117b.webp',  date: '2026-08-20', key: 'cotd/mint-professorx-117-black.webp' },
  { file: 'card119_front.webp', date: '2026-08-21', key: 'cotd/mint-gambit-119-red.webp' },
];

const UPLOAD_DIR = '/home/ubuntu/upload_renamed';

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  let uploaded = 0, skipped = 0, errors = 0;

  for (const card of CARD_FILES) {
    const filePath = path.join(UPLOAD_DIR, card.file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ File not found: ${card.file} (skipping ${card.date})`);
      skipped++;
      continue;
    }
    try {
      const buffer = fs.readFileSync(filePath);
      const url = await storagePut(card.key, buffer, 'image/webp');
      // Update the DB entry for this date
      const [result] = await conn.execute(
        'UPDATE card_of_the_day_entries SET frontImageUrl = ? WHERE date = ?',
        [url, card.date]
      );
      if (result.affectedRows > 0) {
        console.log(`✓ ${card.date} -> ${url.slice(-40)}`);
        uploaded++;
      } else {
        console.log(`⚠ No DB row for ${card.date}`);
        skipped++;
      }
    } catch (err) {
      console.error(`✗ ${card.date} (${card.file}): ${err.message}`);
      errors++;
    }
  }

  await conn.end();
  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped, ${errors} errors`);
}

main().catch(console.error);
