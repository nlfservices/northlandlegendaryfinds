import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 1035, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s39-agent13-fyhDKsxV3s6etofCckEKWs.webp' },
  { id: 1037, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s40-rumlow-GBPzaKKrqVB5bNFULE8mrf.webp' },
  { id: 1038, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s41-falcon-Gv2zcHpYMNihBULt8M4dzo.webp' },
  { id: 1050, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s52-wanda-ZQUiWrQCMFbhPJStURnkvd.webp' },
  { id: 1051, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s53-pietro-RnxGRD68ZWDEG6GRHKcaSU.webp' },
  { id: 1053, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s55-vision-Mgf9n3Rmq7adbnGYucumSw.webp' },
  { id: 1054, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s56-strucker-PoAqmDgGEH6oz7vzvVt3NU.webp' },
  { id: 1055, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s57-antman-dPmDBiqJ2dp998adjvccBs.webp' },
  { id: 1057, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s59-hope-ahAy2EpgSnARL5Ar9Es9jA.webp' },
  { id: 1059, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s60-yellowjacket-AsXFRZVqviPhBAHWyow3YC.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 10: ${updated} rows updated`);

// Check remaining
const [remaining] = await conn.execute(`
  SELECT COUNT(*) as cnt FROM marvel_cards s
  JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' 
    AND REPLACE(s.cardNumber, 'S-', '') = b.cardNumber
  WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION'
    AND s.imageUrl = b.imageUrl
`);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);
await conn.end();
