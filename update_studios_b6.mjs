import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const updates = [
  [994, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-yelena-TXKYW7RuR4zrFBrW2esUrn.webp'],
  [995, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-bob-ATbtDvN53JwHFHU6Jdpxkz.webp'],
  [996, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-walker-mwHsFe97cYEVmbqKfCiFrY.webp'],
  [997, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-taskmaster-WHgyqsY2A9o9kat9zgkcrL.webp'],
  [998, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-ghost-6wN5RCTZ9TYEmroHK8bWMX.webp'],
  [999, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-red-guardian-9TLWRaTPHmip4PyGKn4A3a.webp'],
  [1000, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-congressman-gary-2uxrTCYY3UZurypvzzM33V.webp'],
  [1001, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-sentry-nWRgsKTMeXhG5GqdRzGKD5.webp'],
  [1002, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-loki-U9dFxqid4ZhirHDLowVhoP.webp'],
  [1003, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-valentina-gNWZmDYKpsGdrXGsvtzFhe.webp'],
];

const conn = await mysql.createConnection(process.env.DATABASE_URL);
for (const [id, url] of updates) {
  const [r] = await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [url, id]);
  console.log(`ID ${id}: ${r.affectedRows} updated`);
}
console.log('Batch 6 done! 60/203');
await conn.end();
