import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute(
  "SELECT id, slug, featuredImageUrl, contentMarkdown FROM articles WHERE slug LIKE '%comic-cut%' OR slug LIKE '%history-lesson%'"
);

for (const row of rows) {
  console.log(`\n=== ${row.slug} (id: ${row.id}) ===`);
  console.log(`Featured image: ${row.featuredImageUrl}`);
  
  const allImgs = row.contentMarkdown.match(/(https?:\/\/[^\s"')<]+\.(jpg|jpeg|png|webp|gif))/gi);
  const manusImgs = row.contentMarkdown.match(/\/manus-storage\/[^\s"')<]+/g);
  const cdnImgs = row.contentMarkdown.match(/d2xsxph8kpxj0f\.cloudfront\.net[^\s"')<]+/g);
  
  console.log('Manus storage refs:', manusImgs || 'none');
  console.log('CDN refs:', cdnImgs || 'none');
  console.log('Full URL refs:', allImgs || 'none');
  
  const imgTags = row.contentMarkdown.match(/<img[^>]+>/g);
  console.log('Img tags:', imgTags || 'none');
  
  const bgImgs = row.contentMarkdown.match(/background-image[^;]+/g);
  console.log('BG image styles:', bgImgs || 'none');
}

await conn.end();
process.exit(0);
