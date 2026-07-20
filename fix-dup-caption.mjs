/**
 * Find and remove duplicate caption text for Doctor Doom card
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5040001");

let content = rows[0].contentMarkdown;

// Find all occurrences of the caption text with surrounding context
const regex = /Doctor Doom — 2025 Topps Marvel Mint PSA 10/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const start = Math.max(0, match.index - 80);
  const end = Math.min(content.length, match.index + match[0].length + 80);
  const context = content.substring(start, end);
  console.log(`\nOccurrence at position ${match.index}:`);
  console.log(`Context: "${context}"`);
  console.log('---');
}

await conn.end();
process.exit(0);
