import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await conn.execute('SELECT contentMarkdown FROM articles WHERE slug = ?', ['memorial-day-marvel-fallen-son-captain-america']);
  let content = rows[0].contentMarkdown;
  
  // Remove [Image blocked:...] text
  content = content.replace(/\[Image blocked:[^\]]*\]\n*/g, '');
  
  // Fix the blockquote - the Collector's Corner card name got pulled as a quote
  content = content.replace(
    '> "Captain America Topps Chrome Marvel 2024 Base Chrome"',
    '> "It is not about how he died. It is about how he lived."'
  );
  
  // Move the Fallen Son cover image to be the first section image (for side-by-side layout)
  // Keep it where it is - it's already in the right spot as the section image
  
  // Clean up any double newlines that got left behind
  content = content.replace(/\n{3,}/g, '\n\n');
  
  await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE slug = ?', [content, 'memorial-day-marvel-fallen-son-captain-america']);
  console.log('Article content cleaned up successfully');
  console.log('Removed: [Image blocked] references');
  console.log('Fixed: blockquote text');
  await conn.end();
}

main().catch(e => { console.error(e); process.exit(1); });
