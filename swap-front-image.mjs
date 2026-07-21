import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5100001");

let content = rows[0].contentMarkdown;

// Replace the current front image with the new one
content = content.replace(
  '/manus-storage/1000044282_396ce3a7.jpg',
  '/manus-storage/1000010372_11a04f00.jpg'
);
console.log('✓ Replaced front image with new Hickman-era Doom Comic Cut');

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 5100001', [content]);
console.log('✅ Done - article updated');

await conn.end();
process.exit(0);
