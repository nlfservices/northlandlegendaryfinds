import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5100001");

let content = rows[0].contentMarkdown;

// Find the end of Section 3 (God Emperor Doom: Jonathan Hickman's Secret Wars)
// We need to add a paragraph about the specific Comic Cut card + the image after the section text

// The section currently ends before the "## What Makes These Cards Different" heading
// Let's add a paragraph about the Hickman Comic Cut and insert the image

const hickmanSectionEnd = content.indexOf('## What Makes These Cards Different');
if (hickmanSectionEnd === -1) {
  console.error('Could not find "What Makes These Cards Different" heading');
  await conn.end();
  process.exit(1);
}

// Find the paragraph just before that heading - we'll insert our new content before it
// Let's add a closing paragraph to Section 3 about the specific card + the image
const insertPoint = hickmanSectionEnd;

const newParagraph = `The Comic Cut card shown below is from this exact era — a panel from Secret Wars (2015) where God Emperor Doom confronts and kills Thanos with his bare hands, snapping his spine like it was nothing. One of the most iconic moments in modern Marvel comics, now preserved as a 1/1 trading card artifact.

<img src="/manus-storage/1000010372_11a04f00.jpg" alt="Doctor Doom Comic Cut - Secret Wars 2015 - Doom ends Thanos" style="max-width: 400px; margin: 1.5rem auto; display: block; border-radius: 12px;" />

<p style="text-align: center; font-style: italic; color: #888; margin-top: 0.5rem;">Doctor Doom — 2015 Secret Wars Comic Cut (1/1) | The moment God Emperor Doom ended Thanos</p>

`;

content = content.slice(0, insertPoint) + newParagraph + content.slice(insertPoint);

console.log('✓ Added Hickman Secret Wars paragraph + Comic Cut image to Section 3');

// Also update the alt text on Section 1's image to be more accurate
content = content.replace(
  'Doctor Doom 2025 Topps Marvel Mint SDCC Exclusive CGC 10',
  'Doctor Doom Comic Cut - Fantastic Four #5 First Appearance (1962) - Jack Kirby 1/1'
);
console.log('✓ Updated Section 1 image alt text');

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 5100001', [content]);
console.log('✅ Done - article updated with Hickman Secret Wars content');

await conn.end();
process.exit(0);
