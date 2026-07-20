/**
 * Diagnostic: check what images are in the article now
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5040001");

let content = rows[0].contentMarkdown;
console.log('Content length:', content.length);

// Check for markdown images
const mdMatches = content.match(/!\[[^\]]*\]\([^)]+\)/g);
console.log('\nMarkdown images found:', mdMatches ? mdMatches.length : 0);
if (mdMatches) mdMatches.forEach((m, i) => console.log(`  ${i}: ${m.substring(0, 100)}`));

// Check for HTML img tags
const htmlMatches = content.match(/<img[^>]+>/g);
console.log('\nHTML img tags found:', htmlMatches ? htmlMatches.length : 0);
if (htmlMatches) htmlMatches.forEach((m, i) => console.log(`  ${i}: ${m.substring(0, 120)}`));

// Check for the specific doom card URL
const doomCount = (content.match(/1000043826/g) || []).length;
console.log('\nDoom card URL occurrences:', doomCount);

// Check for "The Trailer Breakdown" text near an image
const trailerIdx = content.indexOf('The Trailer Breakdown');
if (trailerIdx >= 0) {
  console.log('\n"The Trailer Breakdown" found at:', trailerIdx);
  console.log('Context:', content.substring(trailerIdx - 20, trailerIdx + 80));
}

await conn.end();
process.exit(0);
