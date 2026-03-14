import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const updates = [
  [1015, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-galactus-4n43zM9GmPUKrH6aCQgcJn.webp'],
  [1016, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-howard-stark-5p2hNVduVdayy6xWH6NfMG.webp'],
  [1017, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-red-skull-5N6EYGFi6vZ9q37aMXpeCW.webp'],
  [1018, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-erskine-k6n8cznVypfRLWuqc5uznV.webp'],
  [1019, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-peggy-carter-PhEZUQRwXs3kXyBk8jmway.webp'],
  [1020, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-arnim-zola-4rbW8jrUtFev22dd4edhWg.webp'],
  [1021, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-bucky-3EoKr8E8V49xe4yBAxcbjP.webp'],
  [1022, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-hulk-cXpaAh2jvqTy3rTLsQzPhc.webp'],
  [1023, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-hawkeye-hdryXRhgqnSRbs9uhMMPwx.webp'],
  [1024, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-coulson-6VNnZcLWMhQWKL7GwP7vjW.webp'],
];

const conn = await mysql.createConnection(process.env.DATABASE_URL);
for (const [id, url] of updates) {
  const [r] = await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [url, id]);
  console.log(`ID ${id}: ${r.affectedRows} updated`);
}
console.log('Batch 7 done! 70/203');
await conn.end();
