import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 1061, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s62-zemo-F96Qr3L5w7pRsY64kyCnHV.webp' },
  { id: 1062, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s63-tchaka-5KXToTmJMkEDzJ4k3J8p2d.webp' },
  { id: 1065, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s66-palmer-Mk5tKvhEtsFVBMymVtjEjL.webp' },
  { id: 1066, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s67-wong-gobgvAvjAyRtKkyaoXrUey.webp' },
  { id: 1067, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s68-ancient-one-dNvRaCM7oiWo3Q3pD2h4Hn.webp' },
  { id: 1068, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s69-mordo-eMANPd8GkRSeh9SWgY5rsu.webp' },
  { id: 1070, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s70-kaecilius-jaMLeFFq96a5rDNFxriC4S.webp' },
  { id: 1074, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s74-valkyrie-Pk8JmFrPieaE8ZztpyGU9N.webp' },
  { id: 1075, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s75-grandmaster-93FLNNQdRbDw7xdpfzCFE4.webp' },
  { id: 1076, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s76-hela-QL7PuM4qgPeLg9wyiZzuWU.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 11: ${updated} rows updated`);

// Check remaining
const [remaining] = await conn.execute(`
  SELECT COUNT(*) as cnt FROM marvel_cards 
  WHERE setId = 5 AND cardType = 'THE SNAP VARIATION'
    AND imageUrl IN (
      SELECT imageUrl FROM marvel_cards WHERE setId = 5 AND cardType = 'Base'
    )
`);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);
await conn.end();
