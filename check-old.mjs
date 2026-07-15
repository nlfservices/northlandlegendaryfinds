import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute(
  "SELECT id, slug, templateLayout, LEFT(contentMarkdown, 300) as content_start FROM articles WHERE isPublished = 1 AND slug LIKE '%chasing-doom%' OR slug LIKE '%victor-vs-victor%' LIMIT 2"
);
rows.forEach(r => {
  console.log(`\n=== ${r.slug} (template: ${r.templateLayout}) ===`);
  console.log(r.content_start);
});
await conn.end();
