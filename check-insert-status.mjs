import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [inserts] = await conn.execute(`
  SELECT m.id, m.cardNumber, m.characterName, m.cardType, m.imageUrl
  FROM marvel_cards m
  WHERE m.setId = 1 AND m.cardNumber REGEXP '^[A-Z]+-'
  ORDER BY m.cardNumber
`);
inserts.forEach(r => {
  const url = r.imageUrl || '';
  const status = url.includes('hulk-placeholder') ? 'PLACEHOLDER' : 'HAS_IMG';
  console.log(r.id, r.cardNumber, r.characterName, r.cardType, status);
});
console.log('---');
console.log('Total Chrome insert cards:', inserts.length);
await conn.end();
