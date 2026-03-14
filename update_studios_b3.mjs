import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const updates = [
  [933, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-arishem-R9vHdYdsM76CT3XCVBiqBA.webp'],
  [934, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-kate-bishop-SuHQdpTwkygJy3xnBJedUE.webp'],
  [935, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-moon-knight-Qjaizkaw7w55Uh9YGmJ479.webp'],
  [936, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-frigga-KjZqkF86ZzXXxs2QDbWzsV.webp'],
  [937, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-khonshu-AKMJbqzEZKHfxqC5WTrvCa.webp'],
  [938, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-america-chavez-QuJ5kZUHryphwEPcp7uofj.webp'],
  [939, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-clea-6THzfZEA4isgJ3v9wSVxLg.webp'],
  [940, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-captain-marvel-maria-UKNVfahTvruRvJyZHDvKrR.webp'],
  [941, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-thor-lt-aXAJ25VbvgXQTsVRhwTy47.webp'],
  [942, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-snap-mighty-thor-jqvB297wpR3YrvCo3Lbfwt.webp'],
];

const conn = await mysql.createConnection(process.env.DATABASE_URL);
for (const [id, url] of updates) {
  const [r] = await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [url, id]);
  console.log(`ID ${id}: ${r.affectedRows} updated`);
}
console.log('Batch 3 done! 30/203');
await conn.end();
