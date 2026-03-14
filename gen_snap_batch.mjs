import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const BATCH_NUM = parseInt(process.argv[2] || '1');
const BATCH_SIZE = 10;

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all remaining snap cards that share base image
const [allSnaps] = await conn.execute(`
  SELECT s.id, s.cardNumber, s.characterName, s.imageUrl as snapUrl,
         b.imageUrl as baseUrl
  FROM marvel_cards s
  JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' 
    AND REPLACE(s.cardNumber, 'S-', '') = b.cardNumber
  WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION'
    AND s.imageUrl = b.imageUrl
  ORDER BY CAST(REPLACE(s.cardNumber, 'S-', '') AS UNSIGNED)
`);

const start = (BATCH_NUM - 1) * BATCH_SIZE;
const batch = allSnaps.slice(start, start + BATCH_SIZE);

if (batch.length === 0) {
  console.log('No more cards in this batch!');
  console.log(`Total remaining: ${allSnaps.length}`);
  await conn.end();
  process.exit(0);
}

console.log(`=== SNAP BATCH ${BATCH_NUM} (${batch.length} cards, ${allSnaps.length} total remaining) ===`);
console.log(`Cards ${start + 1} to ${start + batch.length} of ${allSnaps.length}\n`);

// Extract just the character name (remove movie/phase info)
function getCharName(fullName) {
  // Remove phase info and movie name
  const parts = fullName.split(' ');
  // Find where movie name starts (usually after character name)
  // Common patterns: "Iron Man Tony Stark Iron Man Phase One"
  // We want just the character identity
  const phaseIdx = fullName.indexOf(' Phase ');
  if (phaseIdx > 0) {
    let name = fullName.substring(0, phaseIdx);
    // Remove movie name from end if it repeats
    return name.trim();
  }
  return fullName;
}

for (const card of batch) {
  const charName = getCharName(card.characterName);
  console.log(`${card.cardNumber}: "${charName}" (id: ${card.id})`);
}

// Output as JSON for the generate_image tool
const output = batch.map(card => ({
  id: card.id,
  cardNumber: card.cardNumber,
  character: getCharName(card.characterName),
}));

console.log('\n=== JSON for image generation ===');
console.log(JSON.stringify(output, null, 2));

await conn.end();
