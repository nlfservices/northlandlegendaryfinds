import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const updates = [
  [973, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-lilia-a2Z8wwCVzXcY56dxgsCpiK.webp'],
  [974, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-alice-eCz6R7AxoRtpZ4uVm7PDdS.webp'],
  [975, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-wiccan-WDemuayLTaofoM3joEar75.webp'],
  [976, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-jennifer-kale-8nwHjkeEN5NFvU3trsTJiV.webp'],
  [977, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-cap-sam-VY5QVopA6A4w6Mx2M7q5pj.webp'],
  [978, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-falcon-joaquin-aBKhxyq3fgdyPgJLAme6Da.webp'],
  [979, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-ruth-Me792mymSxS9nTWXYnsFrP.webp'],
  [980, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-laufey-9UPWwaWsoLFbCUm8ZoZBa5.webp'],
  [981, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-isaiah-bradley-Rq65FhjqpVe9RWUqm3tgdM.webp'],
  [983, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-sidewinder-aKxKzaFcjk5PLgpXfNwbmv.webp'],
];

const conn = await mysql.createConnection(process.env.DATABASE_URL);
for (const [id, url] of updates) {
  const [r] = await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [url, id]);
  console.log(`ID ${id}: ${r.affectedRows} updated`);
}
console.log('Batch 5 done! 50/203');
await conn.end();
