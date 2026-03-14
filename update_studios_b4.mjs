import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const updates = [
  [953, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-aneka-9PhGgNPVCbsZuV5U5r4fL2.webp'],
  [954, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-cassie-lang-9yRf58TNHtBfFy5r9N28ZA.webp'],
  [955, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-modok-j6kAc24yfN5d8SwANWkip2.webp'],
  [956, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-high-evolutionary-cXvPwTuQFNpd7Q4wcBK57z.webp'],
  [957, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-adam-warlock-S7eyqPffNU7mgPxKRLBceY.webp'],
  [958, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-jane-foster-HJv8KP3gqbnD2aVPgU9rDZ.webp'],
  [959, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-cosmo-i6WazdSBBGtWDCGCEUQyNh.webp'],
  [960, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-recorder-vim-iXL5aR3iqpmfb5fb5EXmgh.webp'],
  [961, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-recorder-theel-5tehCM9GsiBYV6t9BNBvQ9.webp'],
  [962, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-gravik-Hpzgx4bQQiLiMJLJszcBcU.webp'],
];

const conn = await mysql.createConnection(process.env.DATABASE_URL);
for (const [id, url] of updates) {
  const [r] = await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [url, id]);
  console.log(`ID ${id}: ${r.affectedRows} updated`);
}
console.log('Batch 4 done! 40/203');
await conn.end();
