/**
 * Swap old Comic Cut card images with new ones in the Doctor Doom Comic Cuts article
 * New front: /manus-storage/1000044282_396ce3a7.jpg (colorful Doom with Thing)
 * New back: /manus-storage/1000044287_fe2936a1.jpg (DD-CC back)
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Find the Comic Cuts article
const [rows] = await conn.execute(
  "SELECT id, slug, contentMarkdown FROM articles WHERE slug LIKE '%comic-cuts%'"
);

if (rows.length === 0) {
  console.log('Article not found!');
  await conn.end();
  process.exit(1);
}

const article = rows[0];
console.log(`Found article: ${article.slug} (id: ${article.id})`);

let content = article.contentMarkdown;

// Find old image URLs - these were uploaded earlier
// Old front: DoomComicCut-Front.webp -> some CDN path
// Old back: DoomComicCut-Back.webp -> some CDN path

// Search for existing image references
const imgMatches = content.match(/\/manus-storage\/[^"'\s)]+/g);
console.log('\nCurrent image references in article:');
imgMatches?.forEach(m => console.log('  ', m));

// Replace the old front image with new front
// The old front was the green-tinted one (DoomComicCut-Front)
const oldFrontPattern = /\/manus-storage\/DoomComicCut-Front[^"'\s)]*/g;
const oldBackPattern = /\/manus-storage\/DoomComicCut-Back[^"'\s)]*/g;

const newFront = '/manus-storage/1000044282_396ce3a7.jpg';
const newBack = '/manus-storage/1000044287_fe2936a1.jpg';

let replacements = 0;

if (oldFrontPattern.test(content)) {
  content = content.replace(oldFrontPattern, newFront);
  replacements++;
  console.log('\n✓ Replaced old front image');
}

// Reset regex
content = content.replace(/\/manus-storage\/DoomComicCut-Back[^"'\s)]+/g, newBack);
if (content !== article.contentMarkdown) {
  replacements++;
  console.log('✓ Replaced old back image');
}

// If the old patterns didn't match, try finding them by other means
if (replacements === 0) {
  console.log('\nOld patterns not found. Trying alternative search...');
  // Look for any webp references that might be the old cards
  const webpMatches = content.match(/\/manus-storage\/[^"'\s)]*\.(webp|jpg|png)[^"'\s)]*/g);
  console.log('All image refs:', webpMatches);
}

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [content, article.id]);
console.log('\n✅ Article updated');

// Verify
const [verify] = await conn.execute("SELECT contentMarkdown FROM articles WHERE id = ?", [article.id]);
const newImgs = verify[0].contentMarkdown.match(/\/manus-storage\/[^"'\s)]+/g);
console.log('\nNew image references:');
newImgs?.forEach(m => console.log('  ', m));

await conn.end();
process.exit(0);
