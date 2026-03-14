import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const updates = [
  [1039, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-starlord-nHUSga8fXdPjSTGDH6xNBL.webp'],
  [1040, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-rocket-DgXijNGffKBMkbijiUWBDo.webp'],
  [1041, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-drax-eY6j4wf9RZHQ39JzCoHuzb.webp'],
  [1042, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-nebula-4X3vbjNN4erPqc2nQF3nv5.webp'],
  [1043, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-ronan-5K82Xohjd3wLSbUTZW5Rvf.webp'],
  [1044, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-yondu-EmPEmRej7E9JrxbadeTCqA.webp'],
  [1045, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-gamora-fDjXgsePFaCHyydau34TUD.webp'],
  [1046, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-collector-iBhqp9bLvZjqbSwfM9atke.webp'],
  [1047, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-pepper-gJWQiXzaF3R6CBqjSgygmw.webp'],
  [1048, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-groot-placeholder.webp'],
];

const conn = await mysql.createConnection(process.env.DATABASE_URL);
// First update the 9 we have images for
for (const [id, url] of updates.slice(0, 9)) {
  const [r] = await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [url, id]);
  console.log(`ID ${id}: ${r.affectedRows} updated`);
}

// For Groot (ID 1048), we need to generate separately
console.log('ID 1048 (Groot) needs separate generation');
console.log('Batch 8 done! 79/203 (Groot pending)');
await conn.end();
