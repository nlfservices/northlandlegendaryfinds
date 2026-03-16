import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const updates = JSON.parse(process.argv[2] || '[]');
if (!updates.length) { console.log('No updates provided'); process.exit(0); }

const conn = await mysql.createConnection(process.env.DATABASE_URL);
for (const {id, url} of updates) {
  await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [url, id]);
  console.log(`Updated card ${id} -> ${url.substring(0, 80)}...`);
}
console.log(`Done: ${updates.length} cards updated`);
await conn.end();
