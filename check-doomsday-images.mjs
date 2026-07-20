import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, slug, contentMarkdown FROM articles WHERE slug LIKE '%doomsday-trailer%'");

if (rows.length > 0) {
  const content = rows[0].contentMarkdown;
  console.log('Article:', rows[0].slug);
  console.log('ID:', rows[0].id);
  console.log('\n--- All img tags ---');
  const imgRegex = /<img[^>]+>/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    console.log('\nPosition:', match.index);
    console.log(match[0]);
  }
  
  // Also check for markdown images
  console.log('\n--- Markdown images ---');
  const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  while ((match = mdImgRegex.exec(content)) !== null) {
    console.log('\nPosition:', match.index);
    console.log(match[0]);
  }
}

await conn.end();
