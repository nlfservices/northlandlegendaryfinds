import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 963, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s154-pagon-KyrcvQrjgDk6Rwg3ANPRyr.webp' },
  { id: 964, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s155-ob-9F6ctCXgwVnpikzaQbe34J.webp' },
  { id: 965, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s156-monica-Tu6QzUfq2rDHTsQuwZ4pu3.webp' },
  { id: 966, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s157-darbenn-jEBxXfYw98EbQa6juQm8Cc.webp' },
  { id: 967, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s158-droge-eHJKxmLFU9qCyqbeVwpQzm.webp' },
  { id: 968, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s159-prince-yan-UxzQS8wJU9dtsKZb2FfWrA.webp' },
  { id: 970, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s160-echo-WyRxAfFnHCYMQu5soXwisn.webp' },
  { id: 971, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s161-death-rio-br5rZa94fcc4UX2wAheKyw.webp' },
  { id: 972, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s162-agatha-oXMDfrnGSYSYvriq5Y8G47.webp' },
  { id: 984, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s173-leader-TFymjDYpqHxeXbfuAycLVb.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 17: ${updated} rows updated`);

const [remaining] = await conn.execute(
  "SELECT COUNT(*) as cnt FROM marvel_cards s JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' AND CONCAT('S-', b.cardNumber) = s.cardNumber WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION' AND s.imageUrl = b.imageUrl"
);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);
await conn.end();
