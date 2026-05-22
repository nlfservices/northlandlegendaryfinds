import mysql from 'mysql2/promise';
import 'dotenv/config';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.query(
  "SELECT id, title, slug, featuredImageUrl, templateLayout FROM articles WHERE slug LIKE '%fallen-son%' OR slug LIKE '%memorial-day%' ORDER BY id DESC"
);
console.log(JSON.stringify(rows, null, 2));
await conn.end();
process.exit(0);
