import 'dotenv/config';
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT id, templateLayout, SUBSTRING(title,1,60) as title FROM articles ORDER BY publishedAt DESC LIMIT 8');
rows.forEach(r => console.log(r.id, '|', r.templateLayout, '|', r.title));
await conn.end();
