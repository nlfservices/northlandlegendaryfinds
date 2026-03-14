import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 922, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s117-sersi-EwrduQ8oA8Pnnx2gsZfm3n.webp' },
  { id: 923, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s118-ikaris-jnjLD9v26ZdCwjtTFKQRUr.webp' },
  { id: 924, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s119-ajak-27daegrvTyLE4x7BasqhQQ.webp' },
  { id: 926, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s120-kingo-fHYgz5mbqPM6rh7da5eyyC.webp' },
  { id: 927, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s121-sprite-jLb6suThDQz2sB5Rxewpsp.webp' },
  { id: 928, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s122-phastos-ePQ5eGuQQ7GMxpiwP9s5xP.webp' },
  { id: 929, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s123-makkari-PD4SHRNmTRvg2BNY47GpSp.webp' },
  { id: 930, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s124-druig-SeULaBfEdK9nNDgnvreKRf.webp' },
  { id: 931, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s125-gilgamesh-WtN5qoma6BDxKfHyMNbgaM.webp' },
  { id: 932, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s126-dane-whitman-MPi5YtusEGmJ4Fbc8EwvmF.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 15: ${updated} rows updated`);

const [remaining] = await conn.execute(
  "SELECT COUNT(*) as cnt FROM marvel_cards s JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' AND CONCAT('S-', b.cardNumber) = s.cardNumber WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION' AND s.imageUrl = b.imageUrl"
);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);
await conn.end();
