import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT contentMarkdown FROM articles WHERE id = 5040001");

if (rows.length > 0) {
  const content = rows[0].contentMarkdown;
  
  // Get context around the Doom card image
  const doomIdx = content.indexOf('1000043826');
  console.log('=== DOOM CARD CONTEXT (200 chars before, 200 after) ===');
  console.log(content.substring(doomIdx - 200, doomIdx + 250));
  
  console.log('\n\n=== SPIDER-MAN CARD CONTEXT ===');
  const spiderIdx = content.indexOf('Spider-Man-Front');
  console.log(content.substring(spiderIdx - 200, spiderIdx + 250));
}

await conn.end();
