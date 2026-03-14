import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Batch 1 updates - IDs from gen_studios_batch.mjs output
const updates = [
  [664, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-red-hulk-base2-YNisx38oWKSFhMjsPkCQNj.webp'],
  [745, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-war-machine-base2-nho97sYbFkgiCGqHPZ9FiJ.webp'],
  [746, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-dr-strange-base2-BJpvtzxzFGUYuZ3UhdEjKj.webp'],
  [773, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-nick-fury-base2-6gLb8NQXzYK6UaU6NHWHwd.webp'],
  [803, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-dr-strange-shadowbox-C5QVjaqDCxNaFgfDPSWcvh.webp'],
  [804, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-nick-fury-shadowbox-e2AdULKjRGi3QQsyfaeBHB.webp'],
  [809, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-war-machine-shadowbox-msa4dJYgP3tYRVxQTJuwAX.webp'],
  [811, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-cap-bnw-1-YANLNDFteAmRsCZya8uzB9.webp'],
  [812, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-cap-bnw-2-CVFYtVa7r7N5vQaLWLforB.webp'],
  [832, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/studios-red-hulk-bnw-PeVSnaWyKua8YGMFVvzYsj.webp'],
];

const conn = await mysql.createConnection(process.env.DATABASE_URL);

for (const [id, url] of updates) {
  const [r] = await conn.query('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [url, id]);
  console.log(`ID ${id}: ${r.affectedRows} updated`);
}

// Check remaining
const [remaining] = await conn.query(`
  SELECT COUNT(*) as total FROM marvel_cards WHERE setId = 5
`);
const [withImages] = await conn.query(`
  SELECT COUNT(DISTINCT imageUrl) as unique_images FROM marvel_cards WHERE setId = 5
`);
console.log(`\nTotal Studios cards: ${remaining[0].total}`);
console.log(`Unique images: ${withImages[0].unique_images}`);

await conn.end();
console.log('Batch 1 complete! 10/203 done.');
