import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await conn.execute(
    "SELECT id, title, slug, category, publishedAt FROM articles ORDER BY publishedAt DESC"
  );
  
  console.log(`\nTotal articles: ${rows.length}\n`);
  rows.forEach((r, i) => {
    const date = r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : 'N/A';
    console.log(`${i+1}. ${r.title}`);
    console.log(`   Slug: ${r.slug}`);
    console.log(`   Category: ${r.category} | Published: ${date}`);
    console.log(`   URL: https://northlandlegendaryfinds.com/mcu-news/${r.slug}`);
    console.log('');
  });
  
  await conn.end();
}

main().catch(console.error);
