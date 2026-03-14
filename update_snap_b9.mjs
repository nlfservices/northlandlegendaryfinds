import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 902, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s1-iron-man-ik66k4wDZhYMZBWyBv8N6y.webp' },
  { id: 1013, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s2-happy-hogan-Xf2n3BKbnZQuiDENDuNoSe.webp' },
  { id: 1025, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s3-iron-monger-4cQvYaFhienS9Qfm8SoYgG.webp' },
  { id: 1058, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s6-justin-hammer-5MZWtAmVYgcWj7oqAeQ47R.webp' },
  { id: 1080, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s8-whiplash-P55D5degMu4QQEjWfZSJY4.webp' },
  { id: 947, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s14-erik-selvig-kySfZEFXuMioTAU4Qxz2Mb.webp' },
  { id: 969, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s16-darcy-lewis-7z3Bmipxf4HtMELFvVFi4g.webp' },
  { id: 1030, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s34-ellen-brandt-V74JyaMivDpSCxaqRkLYKk.webp' },
  { id: 1033, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s37-malekith-HkeDXHsVzNmXwQiTuyzGCA.webp' },
  { id: 1034, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s38-winter-soldier-BBsptxMP79Lc86RnZSGWdy.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 9: ${updated} rows updated`);
await conn.end();
