/**
 * Find and remove the markdown image that's causing the CineStill crop
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5040001");

let content = rows[0].contentMarkdown;

// Find all markdown images
const mdRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
let match;
let count = 0;
while ((match = mdRegex.exec(content)) !== null) {
  count++;
  console.log(`Image ${count}: alt="${match[1]}" src="${match[2]}"`);
  console.log(`  Position: ${match.index}`);
  console.log(`  Context: ...${content.substring(Math.max(0, match.index - 50), match.index)}[IMAGE]${content.substring(match.index + match[0].length, match.index + match[0].length + 50)}...`);
  console.log('');
}

await conn.end();
process.exit(0);
