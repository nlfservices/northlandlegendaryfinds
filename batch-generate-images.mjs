/**
 * Batch image generation script with retry logic.
 * Generates AI character art, uploads to S3, updates DB.
 * Skips cards that already have correct images (checks DB before generating).
 * 
 * Usage: node batch-generate-images.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5s between retries
const REQUEST_DELAY_MS = 2000; // 2s between requests to avoid rate limiting

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function generateImage(prompt, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${FORGE_API_URL}/images.v1.ImageService/GenerateImage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'connect-protocol-version': '1',
          'authorization': `Bearer ${FORGE_API_KEY}`,
        },
        body: JSON.stringify({ prompt, original_images: [] }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        if (attempt < retries) {
          console.log(`    Attempt ${attempt}/${retries} failed (${res.status}), retrying in ${RETRY_DELAY_MS/1000}s...`);
          await sleep(RETRY_DELAY_MS * attempt); // exponential backoff
          continue;
        }
        throw new Error(`Image gen failed after ${retries} attempts (${res.status}): ${detail.substring(0, 200)}`);
      }
      const result = await res.json();
      return { b64: result.image.b64Json, mime: result.image.mimeType };
    } catch (err) {
      if (attempt < retries && err.message.includes('fetch')) {
        console.log(`    Attempt ${attempt}/${retries} network error, retrying...`);
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }
      throw err;
    }
  }
}

async function uploadToS3(key, b64Data, mimeType) {
  const url = new URL('v1/storage/upload', FORGE_API_URL + '/');
  url.searchParams.set('path', key);
  const buffer = Buffer.from(b64Data, 'base64');
  const blob = new Blob([buffer], { type: mimeType });
  const form = new FormData();
  form.append('file', blob, key.split('/').pop());
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${FORGE_API_KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  return (await res.json()).url;
}

function buildPrompt(characterName, setName, cardType) {
  if (setName.includes('Chrome')) {
    return `Comic book style illustration of Marvel character ${characterName}. Bold ink outlines, dynamic pose, vibrant colors, dramatic lighting. The character should be instantly recognizable with their signature costume and powers. Clean white background fading to transparent. Professional trading card art quality, detailed and heroic composition. Full body or upper body shot.`;
  } else if (setName.includes('Studios') && setName.includes('Collector')) {
    return `Stylized digital portrait of Marvel character ${characterName} as they appear in the Marvel Cinematic Universe (MCU). Cinematic lighting, photorealistic style with artistic enhancement. Dark cinematic background with subtle lighting effects. Professional trading card art quality. ${cardType} subset style.`;
  } else if (setName.includes('Studios') && setName.includes('Sapphire')) {
    return `Stylized digital portrait of Marvel character ${characterName} in MCU style. Sapphire blue tones, crystalline effects, cinematic lighting. Dark blue background. Professional trading card art, premium quality.`;
  } else if (setName.includes('Studios')) {
    return `Stylized digital portrait of Marvel character ${characterName} as they appear in the Marvel Cinematic Universe. Cinematic lighting, photorealistic with artistic flair. Dark cinematic background. Professional trading card art quality.`;
  } else if (setName.includes('Sapphire')) {
    return `Elegant illustration of Marvel character ${characterName}. Sapphire blue tones and crystalline effects. Powerful pose with blue energy aura. Professional trading card art, premium quality.`;
  } else if (setName.includes('Mint')) {
    return `Clean, modern illustration of Marvel character ${characterName}. Minimalist but detailed style, metallic accents. Iconic pose. Professional trading card art quality with premium feel. ${cardType} variant style.`;
  }
  return `Professional illustration of Marvel character ${characterName}. Dynamic pose, vibrant colors, detailed rendering. Trading card art quality.`;
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  // Phase 1: Chrome wrong-character base cards
  const wrongCardNumbers = ['117','130','166','167','168','169','170','171','172','173','175','176','177','178','179','180','181','182','183','184','185','186','187','189','190','191','192','193','194','195','196','197','198','199','200'];
  
  const [chromeWrong] = await conn.execute(`
    SELECT c.id, c.cardNumber, c.characterName, c.cardType, c.imageUrl, s.name as setName
    FROM marvel_cards c
    JOIN marvel_sets s ON c.setId = s.id
    WHERE s.slug = '2025-topps-chrome'
    AND c.cardNumber IN (${wrongCardNumbers.map(() => '?').join(',')})
    ORDER BY CAST(c.cardNumber AS UNSIGNED)
  `, wrongCardNumbers);
  
  // Check which Chrome cards already got fixed (from the partial run)
  const chromeToFix = chromeWrong.filter(c => {
    const safeName = c.characterName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const urlLower = (c.imageUrl || '').toLowerCase();
    // If the URL already contains the character name, it's been fixed
    return !urlLower.includes(safeName);
  });
  
  // Phase 2: Duplicate images across subsets
  const [dupeCards] = await conn.execute(`
    SELECT c.id, c.cardNumber, c.characterName, c.cardType, c.imageUrl, s.name as setName, s.slug as setSlug
    FROM marvel_cards c
    JOIN marvel_sets s ON c.setId = s.id
    WHERE c.imageUrl IN (
      SELECT c2.imageUrl 
      FROM marvel_cards c2 
      WHERE c2.setId = c.setId AND c2.characterName = c.characterName
      GROUP BY c2.setId, c2.imageUrl, c2.characterName
      HAVING COUNT(DISTINCT c2.cardType) > 1
    )
    ORDER BY s.slug, c.characterName, c.cardType
  `);
  
  // Group by set+character+imageUrl, keep first, regenerate rest
  const dupeGroups = {};
  for (const card of dupeCards) {
    const key = `${card.setSlug}:${card.characterName}:${card.imageUrl}`;
    if (!dupeGroups[key]) dupeGroups[key] = [];
    dupeGroups[key].push(card);
  }
  
  const dupeNeedingImages = [];
  for (const cards of Object.values(dupeGroups)) {
    for (let i = 1; i < cards.length; i++) {
      dupeNeedingImages.push(cards[i]);
    }
  }
  
  const allCards = [...chromeToFix, ...dupeNeedingImages];
  console.log(`=== IMAGE GENERATION PLAN ===`);
  console.log(`Chrome wrong-character (still needing fix): ${chromeToFix.length}`);
  console.log(`Duplicate images to regenerate: ${dupeNeedingImages.length}`);
  console.log(`Total: ${allCards.length}`);
  console.log(`Retries: ${MAX_RETRIES}, Delay: ${REQUEST_DELAY_MS}ms\n`);
  
  let processed = 0;
  let errors = 0;
  const failed = [];
  const startTime = Date.now();
  
  for (let i = 0; i < allCards.length; i++) {
    const card = allCards[i];
    try {
      const prompt = buildPrompt(card.characterName, card.setName, card.cardType);
      console.log(`[${i+1}/${allCards.length}] ${card.characterName} (${card.cardNumber}, ${card.cardType}, ${card.setName})...`);
      
      const { b64, mime } = await generateImage(prompt);
      const ext = mime.includes('png') ? 'png' : 'webp';
      const safeName = card.characterName.replace(/[^a-zA-Z0-9]/g, '_');
      const safeSet = card.setName.replace(/[^a-zA-Z0-9]/g, '_');
      const safeType = card.cardType.replace(/[^a-zA-Z0-9]/g, '_');
      const key = `cards/${safeSet}/${safeType}_${card.cardNumber}_${safeName}_${Date.now().toString(36)}.${ext}`;
      
      const cdnUrl = await uploadToS3(key, b64, mime);
      await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [cdnUrl, card.id]);
      
      processed++;
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const rate = processed / elapsed;
      const remaining = (allCards.length - i - 1) / rate;
      console.log(`  ✓ Done [${processed} ok, ${errors} err, ${rate.toFixed(1)}/min, ~${remaining.toFixed(0)}min left]`);
      
      // Checkpoint marker every 10
      if (processed % 10 === 0) {
        console.log(`\n>>> CHECKPOINT: ${processed} images generated, ${errors} errors <<<\n`);
      }
      
      await sleep(REQUEST_DELAY_MS);
    } catch (err) {
      errors++;
      failed.push({ id: card.id, num: card.cardNumber, char: card.characterName, set: card.setName, err: err.message.substring(0, 100) });
      console.error(`  ✗ FAILED: ${err.message.substring(0, 150)}`);
      await sleep(REQUEST_DELAY_MS);
    }
  }
  
  const totalTime = (Date.now() - startTime) / 1000 / 60;
  console.log(`\n=== COMPLETE ===`);
  console.log(`Processed: ${processed}, Errors: ${errors}, Time: ${totalTime.toFixed(1)} min`);
  if (failed.length > 0) {
    console.log(`\nFailed cards:`);
    failed.forEach(f => console.log(`  ${f.char} (${f.num}, ${f.set}): ${f.err}`));
  }
  
  await conn.end();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
