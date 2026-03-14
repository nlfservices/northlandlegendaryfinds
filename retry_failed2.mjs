import mysql from 'mysql2/promise';
import { execSync } from 'child_process';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const RETRY_ITEMS = [
  { name: 'John F. Walker', prompt: 'Digital painting of a comic book superhero called US Agent, wearing dark navy blue tactical armor with a white star emblem on the chest and red accents, holding a vibranium shield, strong jaw, short hair, heroic stance, dramatic comic book lighting, vibrant colors, detailed Marvel-style illustration' },
  { name: 'Erik Killmonger', prompt: 'Digital painting of a Marvel comic book villain called Killmonger, wearing a golden and black vibranium suit with panther-like design, tribal scarification marks on his chest, intense warrior expression, dramatic comic book lighting, vibrant colors, detailed Marvel-style illustration, Wakandan throne room' },
  { name: 'Rocket', prompt: 'Digital painting of Rocket Raccoon from Marvel Comics, a small anthropomorphic raccoon wearing tactical space armor and holding a large sci-fi blaster, standing on a spaceship deck, fierce determined expression, dramatic comic book lighting, vibrant colors, detailed Marvel-style illustration' },
];

async function generateImage(prompt) {
  const baseUrl = FORGE_URL.endsWith('/') ? FORGE_URL : `${FORGE_URL}/`;
  const fullUrl = new URL('images.v1.ImageService/GenerateImage', baseUrl).toString();
  
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'connect-protocol-version': '1',
      'authorization': `Bearer ${FORGE_KEY}`,
    },
    body: JSON.stringify({ prompt, original_images: [] }),
  });
  
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Failed (${response.status}): ${detail.substring(0, 200)}`);
  }
  
  const result = await response.json();
  return Buffer.from(result.image.b64Json, 'base64');
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  for (const item of RETRY_ITEMS) {
    console.log(`Generating: ${item.name}...`);
    try {
      const filename = `collector-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}.webp`;
      const localPath = `/home/ubuntu/webdev-static-assets/${filename}`;
      const buffer = await generateImage(item.prompt);
      fs.writeFileSync(localPath, buffer);
      const cdnUrl = execSync(`manus-upload-file --webdev ${localPath}`, { encoding: 'utf-8' }).trim();
      console.log(`  ✓ Uploaded: ${cdnUrl.substring(0, 80)}...`);
      const [result] = await conn.query(
        "UPDATE marvel_cards SET imageUrl = ? WHERE setId = 30001 AND (characterName = ? OR characterName LIKE ?)",
        [cdnUrl, item.name, `${item.name} (%`]
      );
      console.log(`  ✓ Updated ${result.affectedRows} card(s)`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }
  
  const [remaining] = await conn.query(
    "SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 30001 AND (imageUrl IS NULL OR imageUrl = '')"
  );
  console.log(`\nRemaining: ${remaining[0].cnt}`);
  await conn.end();
}

main().catch(console.error);
