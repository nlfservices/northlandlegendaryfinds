/**
 * Update Spider-Man BND article featured image to the new SpidermanPoster.jpg
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  const newImageUrl = '/manus-storage/spiderman-bnd-hero-poster_ff1491c3.jpg';

  const [result] = await conn.execute(
    'UPDATE articles SET featuredImageUrl = ? WHERE slug = ?',
    [newImageUrl, 'spiderman-brand-new-day-trailer-record-breaking-card-market']
  );

  console.log(`Updated featuredImageUrl: ${result.affectedRows} row(s)`);
  console.log(`New image: ${newImageUrl}`);
  await conn.end();
  console.log("Done!");
}

main().catch(console.error);
