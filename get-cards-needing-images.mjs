import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const wrongNums = ['130','166','167','168','169','170','171','172','173','175','176','177','178','179','180','181','182','183','184','185','186','187','189','190','191','192','193','194','195','196','197','198','199','200'];
const [rows] = await conn.execute(`
  SELECT c.id, c.cardNumber, c.characterName, c.cardType, c.imageUrl, s.name as setName
  FROM marvel_cards c JOIN marvel_sets s ON c.setId = s.id
  WHERE s.slug = '2025-topps-chrome' AND c.cardNumber IN (${wrongNums.map(()=>'?').join(',')})
  ORDER BY CAST(c.cardNumber AS UNSIGNED)
`, wrongNums);
const needFix = rows.filter(r => {
  const safeName = r.characterName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return !(r.imageUrl || '').toLowerCase().includes(safeName);
});
console.log(`Chrome cards needing fix: ${needFix.length}`);
needFix.forEach(r => console.log(`${r.id}|${r.cardNumber}|${r.characterName}|${r.cardType}`));
await conn.end();
