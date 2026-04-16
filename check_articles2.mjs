import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SHOW TABLES LIKE "%article%"');
console.log("Tables:", rows);
const [rows2] = await conn.execute('SELECT COUNT(*) as cnt FROM articles');
console.log("Article count:", rows2);
// Check blogPosts too
const [rows3] = await conn.execute('SHOW TABLES LIKE "%blog%"');
console.log("Blog tables:", rows3);
await conn.end();
