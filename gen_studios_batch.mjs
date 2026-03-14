import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Get batch number from command line args
const batchNum = parseInt(process.argv[2] || '1');
const BATCH_SIZE = 10;

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all Marvel Studios cards
const [all] = await conn.query(`
  SELECT id, cardNumber, characterName, cardType, imageUrl 
  FROM marvel_cards WHERE setId = 5
  ORDER BY cardNumber
`);

// Build URL -> cards map
const urlCount = {};
for (const c of all) {
  const url = c.imageUrl || 'NULL';
  if (!urlCount[url]) urlCount[url] = [];
  urlCount[url].push(c);
}

// Find cards needing new images
const needsNewImage = [];
for (const [url, cards] of Object.entries(urlCount)) {
  if (cards.length > 1) {
    const charNames = new Set(cards.map(c => c.characterName));
    if (charNames.size > 1) {
      // Different characters sharing same image - all need new
      for (const c of cards) needsNewImage.push(c);
    } else {
      const cardTypes = new Set(cards.map(c => c.cardType));
      if (cardTypes.size > 1) {
        // Same char, different subsets - keep first, rest need new
        for (let i = 1; i < cards.length; i++) needsNewImage.push(cards[i]);
      }
    }
  }
}

// Sort by id for consistent ordering
needsNewImage.sort((a, b) => a.id - b.id);

const start = (batchNum - 1) * BATCH_SIZE;
const batch = needsNewImage.slice(start, start + BATCH_SIZE);

if (batch.length === 0) {
  console.log('No more cards to process. All done!');
  console.log('Total needing images:', needsNewImage.length);
  await conn.end();
  process.exit(0);
}

console.log(`\nBatch ${batchNum}: cards ${start + 1}-${start + batch.length} of ${needsNewImage.length}`);
console.log('Cards in this batch:');
for (const c of batch) {
  console.log(`  ID ${c.id} | ${c.cardNumber} | ${c.characterName} | ${c.cardType}`);
}

// Output JSON for image generation
const prompts = batch.map(c => {
  // Extract just the character name (before the movie title)
  const charName = c.characterName.split(/\s+(Iron Man|Thor|Captain|Avengers|Guardians|Spider|Ant-Man|Doctor|Black|Shang|Eternals|She-Hulk|Loki|WandaVision|Daredevil|Agatha|Fantastic|Thunderbolts|Moon|Hawkeye|Falcon|What If|Ms\.|Echo|Secret|The Marvels)/)[0] || c.characterName;
  
  const isSnap = c.cardType === 'THE SNAP VARIATION';
  const isBNW = c.cardType === 'CAPTAIN AMERICA: BRAVE NEW WORLD';
  const isShadowbox = c.cardType === 'AVENGERS SHADOWBOX';
  
  let style = '';
  if (isSnap) {
    style = 'with a dramatic disintegration/snap effect, particles dissolving from one side of the figure, Thanos snap aesthetic, ';
  } else if (isShadowbox) {
    style = 'in a dramatic layered shadowbox composition with depth and dimension, ';
  } else if (isBNW) {
    style = 'in a modern tactical military setting, ';
  }
  
  return {
    id: c.id,
    cardNumber: c.cardNumber,
    characterName: c.characterName,
    cardType: c.cardType,
    prompt: `Cinematic digital painting portrait of ${c.characterName} from the Marvel Cinematic Universe, ${style}detailed MCU-inspired character art, dramatic cinematic lighting, high quality illustration`
  };
});

// Write prompts to file for the generate_image tool
const outputPath = `/home/ubuntu/studios_batch_${batchNum}.json`;
const fs = await import('fs');
fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2));
console.log(`\nPrompts written to ${outputPath}`);

await conn.end();
