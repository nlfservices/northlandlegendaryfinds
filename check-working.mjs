import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute(
  "SELECT id, slug, templateLayout, LEFT(contentMarkdown, 500) as content_start FROM articles WHERE isPublished = 1 AND templateLayout IS NOT NULL ORDER BY publishedAt DESC LIMIT 3"
);
rows.forEach(r => {
  console.log(`\n=== ${r.slug} (template: ${r.templateLayout}) ===`);
  console.log(r.content_start);
});
await conn.end();
