import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const newExcerpt = "The 2025 Topps Marvel Mint SDCC Exclusive Doctor Doom Chrome Card is one of the most sought-after modern Marvel cards — and with the Doomsday trailer just dropping, collectors are holding tight. Here is why this card matters more than ever with Avengers: Doomsday five months away.";

await conn.execute(
  `UPDATE articles SET excerpt = ? WHERE slug = ?`,
  [newExcerpt, 'doctor-doom-sdcc-exclusive-card-about-to-go-parabolic-2025-topps-marvel-mint']
);

console.log('✅ Excerpt updated - no more $750 reference');
await conn.end();
