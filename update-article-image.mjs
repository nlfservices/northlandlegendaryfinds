import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const NEW_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/article-doom-cinemacon-v2-ar6fgppzhZAvc8Sfb9wJ5q.webp";
const SLUG = "rdj-unveils-trailer-of-doom-cinemacon-2026";

async function main() {
  const url = new URL(DATABASE_URL);
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
  });

  const [result] = await connection.execute(
    `UPDATE articles SET featuredImageUrl = ? WHERE slug = ?`,
    [NEW_IMAGE, SLUG]
  );
  console.log(`Updated ${result.affectedRows} row(s) for slug: ${SLUG}`);
  console.log(`New image: ${NEW_IMAGE}`);
  
  await connection.end();
}

main().catch(console.error);
