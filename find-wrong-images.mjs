import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get ALL Chrome base set cards
const [all] = await conn.query(`
  SELECT id, cardNumber, characterName, imageUrl 
  FROM marvel_cards 
  WHERE setId = 1
  ORDER BY id
`);

let wrong = [];
let correct = 0;
for (const c of all) {
  // Check if URL contains our new fixed pattern (chrome_ lowercase)
  const hasNewPattern = c.imageUrl.indexOf('chrome_') !== -1 && c.imageUrl.indexOf('CHROME-') === -1;
  if (hasNewPattern) {
    correct++;
    continue;
  }
  // Check old pattern - extract character name from URL
  const m = c.imageUrl.match(/CHROME-\d+_([^_]+)/);
  const urlChar = m ? m[1] : '';
  const slug = c.characterName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const urlSlug = urlChar.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isMatch = slug.indexOf(urlSlug) !== -1 || urlSlug.indexOf(slug) !== -1;
  if (isMatch && urlChar) {
    correct++;
  } else {
    wrong.push({ id: c.id, num: c.cardNumber, char: c.characterName, urlChar: urlChar || 'unknown' });
  }
}

console.log(`Chrome base set: ${correct} correct, ${wrong.length} wrong`);
console.log('\nWrong images needing generation:');
wrong.forEach(w => console.log(`  id:${w.id} #${w.num} ${w.char} (URL shows: ${w.urlChar})`));

// Also check insert subsets
const [inserts] = await conn.query(`
  SELECT id, cardNumber, characterName, imageUrl, cardType
  FROM marvel_cards 
  WHERE setId = 1 AND cardType != 'Base'
  ORDER BY id
`);
console.log(`\nChrome insert cards: ${inserts.length} total`);

// Check other sets for placeholder/shared images
for (const setId of [2, 3, 4, 5, 6, 30001]) {
  const [cards] = await conn.query(`SELECT id, imageUrl FROM marvel_cards WHERE setId = ?`, [setId]);
  const urls = new Set();
  let dupes = 0;
  cards.forEach(c => {
    if (urls.has(c.imageUrl)) dupes++;
    urls.add(c.imageUrl);
  });
  console.log(`Set ${setId}: ${cards.length} cards, ${urls.size} unique images, ${dupes} duplicates`);
}

await conn.end();
