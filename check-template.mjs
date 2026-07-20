import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, slug, templateLayout FROM articles WHERE id = 5040001");
console.log(rows[0]);
await conn.end();
process.exit(0);
