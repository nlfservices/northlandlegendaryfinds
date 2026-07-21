/**
 * Replace old Comic Cut card images with new ones in article id 5100001
 * Old front: /manus-storage/DoomComicCut-Front_efe55fd7.webp
 * Old back: /manus-storage/DoomComicCut-Back_f65a87f3.webp
 * New front: /manus-storage/1000044282_396ce3a7.jpg (colorful Doom with Thing, "GUARDS!")
 * New back: /manus-storage/1000044287_fe2936a1.jpg (DD-CC back)
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5100001");

let content = rows[0].contentMarkdown;

// Replace front image
content = content.replace(
  '/manus-storage/DoomComicCut-Front_efe55fd7.webp',
  '/manus-storage/1000044282_396ce3a7.jpg'
);
console.log('✓ Replaced front image');

// Replace back image
content = content.replace(
  '/manus-storage/DoomComicCut-Back_f65a87f3.webp',
  '/manus-storage/1000044287_fe2936a1.jpg'
);
console.log('✓ Replaced back image');

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 5100001', [content]);
console.log('✅ Done - article updated with new Comic Cut card photos');

await conn.end();
process.exit(0);
