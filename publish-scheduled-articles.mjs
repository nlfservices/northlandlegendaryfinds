import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Publish a single article by slug
async function publishArticle(slug) {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  const now = Date.now();
  await connection.execute(
    `UPDATE articles SET isPublished = true, publishedAt = ? WHERE slug = ? AND isPublished = false`,
    [now, slug]
  );
  
  const [rows] = await connection.execute(
    'SELECT id, title, isPublished FROM articles WHERE slug = ?',
    [slug]
  );
  
  if (rows.length > 0) {
    console.log(`✅ Published: "${rows[0].title}" (ID: ${rows[0].id})`);
  } else {
    console.log(`❌ Article not found: ${slug}`);
  }
  
  await connection.end();
}

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node publish-scheduled-articles.mjs <article-slug>");
  process.exit(1);
}

publishArticle(slug).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
