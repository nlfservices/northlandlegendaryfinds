import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 943, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s136-msmarvel-gB3ijBo2YDYLauvTZnhk9N.webp' },
  { id: 944, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s137-shehulk-YDkJYKp4mpkhMS3nj3gw2u.webp' },
  { id: 945, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s138-jack-russell-n3nxGrgWPUjXqChNo4Tmks.webp' },
  { id: 946, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s139-elsa-bloodstone-VXdcG8JjUPKrRzRAxaQ4qw.webp' },
  { id: 948, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s140-bp-shuri-ShAqR8LScNpe8FWjvswrNx.webp' },
  { id: 949, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s141-namor-P45j3ZR7EM25ARs759TG54.webp' },
  { id: 950, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s142-ironheart-P5E3rbKXxwQJzWd4guqgtM.webp' },
  { id: 951, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s141-namor-P45j3ZR7EM25ARs759TG54.webp' }, // Namora - use Namor for now, will fix
  { id: 952, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s141-namor-P45j3ZR7EM25ARs759TG54.webp' }, // Attuma - use Namor for now, will fix
  { id: 963, url: null }, // Pagon - next batch
];

let updated = 0;
for (const u of updates) {
  if (!u.url) continue;
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 16: ${updated} rows updated`);

const [remaining] = await conn.execute(
  "SELECT COUNT(*) as cnt FROM marvel_cards s JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' AND CONCAT('S-', b.cardNumber) = s.cardNumber WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION' AND s.imageUrl = b.imageUrl"
);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);
await conn.end();
