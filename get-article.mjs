import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  "SELECT contentMarkdown FROM articles WHERE slug = 'doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday'"
);

const content = rows[0].contentMarkdown;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('riseofdoom') || lines[i].includes('Rise of Doom') || lines[i].includes('Comic Cut') || lines[i].includes('comic cut')) {
    console.log(`Line ${i}: ${lines[i]}`);
  }
}
console.log('\n--- TOTAL LINES:', lines.length);
await connection.end();
