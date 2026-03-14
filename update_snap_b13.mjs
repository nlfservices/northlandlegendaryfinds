import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 1089, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s88-ebony-maw-K3UuYBm6Yq9FeSnw2RLk7D.webp' },
  { id: 1090, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s89-proxima-idX6hfapXiyhVvS2NmmLHD.webp' },
  { id: 1092, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s90-corvus-QAkcM7Kz5pHksWgTvALejj.webp' },
  { id: 1093, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s91-wasp-hope-kJg8tgomYxME3scB2Ta7gN.webp' },
  { id: 1094, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s92-janet-KCBPUTUpuiSJ72WnJxca6Y.webp' },
  { id: 1095, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s93-maggie-joGjPpPHaNiCsikghedjCw.webp' },
  { id: 1096, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s94-jimmy-woo-fTCfeshzyZZEACKE7wyhix.webp' },
  { id: 1097, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s95-bill-foster-7B2NBCCtrMQzf7pF4gecZM.webp' },
  { id: 1099, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s97-yon-rogg-TW3Q5PKxQxnMXsVLLT2czq.webp' },
  { id: 1100, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s98-talos-Q5bem8ZUgLdgzWhYQkj43L.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 13: ${updated} rows updated`);

const [remaining] = await conn.execute(`
  SELECT COUNT(*) as cnt FROM marvel_cards s
  JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' 
    AND CONCAT('S-', b.cardNumber) = s.cardNumber
  WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION'
    AND s.imageUrl = b.imageUrl
`);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);
await conn.end();
