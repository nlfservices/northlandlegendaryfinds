/**
 * Retry failed image generations with adjusted prompts
 * Usage: node retry_failed.mjs
 */
import mysql from 'mysql2/promise';
import { execSync } from 'child_process';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

// Failed characters from batch 1 - adjusted prompts to avoid content policy issues
const RETRY_ITEMS = [
  { name: 'John F. Walker', prompt: 'Stylized comic book art portrait of a muscular superhero called US Agent wearing a dark blue and red patriotic uniform with a star on the chest and carrying a round shield, stern determined expression, dramatic lighting, bold Marvel comic art style, action pose' },
  { name: 'Valentina Allegra de Fontaine', prompt: 'Stylized comic book art portrait of a sophisticated spy handler woman with dark wavy hair in an elegant dark purple suit, confident knowing expression, dramatic lighting, bold Marvel comic art style, shadowy government office background' },
  { name: 'Rio Vidal', prompt: 'Stylized comic book art portrait of a mysterious witch woman with dark hair and an enigmatic smile, wearing dark flowing robes surrounded by green and purple mystical energy, dramatic lighting, bold Marvel comic art style, magical background' },
  { name: 'Erik Killmonger', prompt: 'Stylized comic book art portrait of a fierce warrior in a golden Black Panther variant suit with leopard patterns, ritual scarification marks visible, intense expression, dramatic lighting, bold Marvel comic art style, Wakandan throne room background' },
  { name: 'Rocket', prompt: 'Stylized comic book art portrait of Rocket Raccoon from Marvel, an anthropomorphic raccoon in tactical space gear holding a large blaster weapon, fierce determined expression, dramatic lighting, bold Marvel comic art style, spaceship interior background' },
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
    body: JSON.stringify({
      prompt: prompt,
      original_images: [],
    }),
  });
  
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Image generation failed (${response.status}): ${detail}`);
  }
  
  const result = await response.json();
  const base64Data = result.image.b64Json;
  return Buffer.from(base64Data, 'base64');
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  for (let i = 0; i < RETRY_ITEMS.length; i++) {
    const item = RETRY_ITEMS[i];
    console.log(`[${i + 1}/${RETRY_ITEMS.length}] Retrying: ${item.name}...`);
    
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
  console.log(`\nRemaining cards without images: ${remaining[0].cnt}`);
  
  await conn.end();
}

main().catch(console.error);
