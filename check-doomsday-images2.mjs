import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, slug, contentMarkdown FROM articles WHERE slug LIKE '%doomsday%sdcc%' OR slug LIKE '%sdcc%connection%'");

if (rows.length === 0) {
  // Try broader search
  const [rows2] = await conn.execute("SELECT id, slug FROM articles WHERE slug LIKE '%doomsday%'");
  console.log('All doomsday articles:', rows2.map(r => r.slug));
} else {
  for (const row of rows) {
    const content = row.contentMarkdown;
    console.log('Article:', row.slug);
    console.log('ID:', row.id);
    console.log('\n--- All img tags ---');
    const imgRegex = /<img[^>]+>/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      console.log('\nPosition:', match.index);
      console.log(match[0].substring(0, 200));
    }
    console.log('\n--- Markdown images ---');
    const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    while ((match = mdImgRegex.exec(content)) !== null) {
      console.log('\nPosition:', match.index);
      console.log(match[0].substring(0, 200));
    }
  }
}

await conn.end();
