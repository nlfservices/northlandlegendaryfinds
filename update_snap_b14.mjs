import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 1101, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s99-lawson-7wMzz4CSBHV8sY4w3KUCvy.webp' },
  { id: 904, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s100-thanos-NsTNZgZqRW4xsA4GpTqysy.webp' },
  { id: 905, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s101-ralph-bohner-HhY5SSAFNJrbfF9HiQVk9x.webp' },
  { id: 906, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s102-karli-Y4ZTDiCjzEkU27t2Xdv2Fk.webp' },
  { id: 907, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s103-mobius-4BbKrhqqNJFRRhimAM4HLL.webp' },
  { id: 908, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s104-sylvie-YS5jA6vr7tQhzfrwB2kMqW.webp' },
  { id: 909, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s105-classic-loki-4yvp7ni5gxEVe3C4MV8g8C.webp' },
  { id: 910, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s106-ravonna-dBpG4TFn4otkUwpbLKSjQA.webp' },
  { id: 911, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s107-b15-7M7RxGohFxkbNHzh37V5Qs.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 14: ${updated} rows updated`);

const [remaining] = await conn.execute(
  "SELECT COUNT(*) as cnt FROM marvel_cards s JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' AND CONCAT('S-', b.cardNumber) = s.cardNumber WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION' AND s.imageUrl = b.imageUrl"
);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);
await conn.end();
