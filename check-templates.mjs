import 'dotenv/config';
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.query('SELECT id, slug, templateLayout, publishedAt FROM articles ORDER BY id DESC LIMIT 10');
console.table(rows);
await conn.end();
