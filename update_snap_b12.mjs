import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 1077, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s77-korg-jvBo5Toivx6Gi7HynCYnWf.webp' },
  { id: 1078, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s78-miek-5CMFtuHrpE3dhjmBSfncpr.webp' },
  { id: 1081, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s80-shuri-GMcJSpmQPBkaxbC69o3sCV.webp' },
  { id: 1082, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s81-nakia-HACqnxUJKL3ZN33Ftco8aB.webp' },
  { id: 1083, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s82-okoye-dEDh5iAHsps3JprxtVc4Sq.webp' },
  { id: 1084, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s83-mbaku-GFMzPtg3thv5gVQFJ3JGir.webp' },
  { id: 1085, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s84-klaue-bmBPUR5b6AwRJp7nJsg3Yk.webp' },
  { id: 1086, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s85-killmonger-bVRRgJzagU5ybFheKVeGfK.webp' },
  { id: 1087, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s86-ramonda-6LGvApYPtc2LmQM9aeoJyF.webp' },
  { id: 1088, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s87-cull-obsidian-BccUzrpyNGymonAeWDCA58.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 12: ${updated} rows updated`);

const [remaining] = await conn.execute(`
  SELECT COUNT(*) as cnt FROM marvel_cards s
  JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' 
    AND CONCAT('S-', b.cardNumber) = s.cardNumber
  WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION'
    AND s.imageUrl = b.imageUrl
`);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);
await conn.end();
