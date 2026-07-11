import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT contentMarkdown FROM articles WHERE slug = 'notorious-doctor-doom-mcgregor-von-doom-same-fighter'");
console.log(rows[0].contentMarkdown);
await conn.end();
