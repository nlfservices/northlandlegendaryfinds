import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT id, title, slug, category, isFeatured, isPublished, LENGTH(contentMarkdown) as contentLen FROM articles ORDER BY id');
console.log(JSON.stringify(rows, null, 2));
await conn.end();
