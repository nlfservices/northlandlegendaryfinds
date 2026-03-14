import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [r] = await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-groot-KfAkt2MhLdktkzwtBW2Lqj.webp',
  1048
]);
console.log(`Groot (ID 1048): ${r.affectedRows} updated`);
console.log('Batch 8 fully complete! 80/203');
await conn.end();
