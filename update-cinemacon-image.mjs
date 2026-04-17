import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const NEW_IMAGE_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cinemacon-doomsday-article-2026-gTEErQD64JsqVyC6TXs8uu.png";
const SLUG = "cinemacon-2026-avengers-doomsday-first-look";

async function updateImage() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  await connection.execute(
    `UPDATE articles SET featuredImageUrl = ? WHERE slug = ?`,
    [NEW_IMAGE_URL, SLUG]
  );
  
  const [rows] = await connection.execute(
    'SELECT id, title, featuredImageUrl FROM articles WHERE slug = ?',
    [SLUG]
  );
  
  if (rows.length > 0) {
    console.log(`✅ Updated image for: "${rows[0].title}"`);
    console.log(`   New image: ${rows[0].featuredImageUrl}`);
  } else {
    console.log(`❌ Article not found: ${SLUG}`);
  }
  
  await connection.end();
}

updateImage().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
