import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5100001");

let content = rows[0].contentMarkdown;

// Replace the SDCC Exclusive CGC 10 image (white border slab) with the Jack Kirby first appearance Comic Cut
// This is the image in Section 1 "The Beginning: Jack Kirby and Stan Lee"
const oldImg = '/manus-storage/1000043826_c2ad3c69.jpg';
const newImg = '/manus-storage/1000010381_7fcc29ad.png';

const count = (content.match(new RegExp(oldImg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log(`Found ${count} occurrence(s) of the SDCC CGC slab image`);

content = content.replaceAll(oldImg, newImg);
console.log('✓ Replaced all occurrences with Jack Kirby first appearance Comic Cut');

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 5100001', [content]);
console.log('✅ Done - article updated');

await conn.end();
process.exit(0);
