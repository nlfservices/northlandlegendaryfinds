import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  const [rows] = await connection.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = 'memorial-day-marvel-fallen-son-captain-america'"
  );
  
  let content = rows[0].contentMarkdown;
  
  // Fix image paths to use the new CDN uploads
  content = content.replace(
    '/manus-storage/fallen_son_cover_a03150c4.jpeg',
    '/manus-storage/fallen_son_cover_68f6d05c.jpeg'
  );
  content = content.replace(
    '/manus-storage/fallen_son_tpb_12a0b345.jpg',
    '/manus-storage/fallen_son_tpb_f8fc418e.jpg'
  );
  
  // Add a proper blockquote before "That final issue" paragraph for the pull quote to pick up
  content = content.replace(
    'That final issue is the one that should be required reading on Memorial Day.',
    '> "It is not about how he died. It is about how he lived."\n\nThat final issue is the one that should be required reading on Memorial Day.'
  );
  
  await connection.execute(
    "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
    [content, rows[0].id]
  );
  
  console.log("Content fixed - images updated, blockquote added");
  await connection.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
