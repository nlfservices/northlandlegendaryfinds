/**
 * Diagnostic: see what images are in the Comic Cuts article
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Check both possible articles
const [rows] = await conn.execute(
  "SELECT id, slug, featured_image, content_markdown FROM articles WHERE slug LIKE '%comic-cut%' OR slug LIKE '%history-lesson%'"
);

for (const row of rows) {
  console.log(`\n=== Article: ${row.slug} (id: ${row.id}) ===`);
  console.log(`Featured image: ${row.featured_image}`);
  
  // Find all image-like references
  const allImgs = row.content_markdown.match(/(https?:\/\/[^\s"')<]+\.(jpg|jpeg|png|webp|gif))/gi);
  const manusImgs = row.content_markdown.match(/\/manus-storage\/[^\s"')<]+/g);
  const cdnImgs = row.content_markdown.match(/d2xsxph8kpxj0f\.cloudfront\.net[^\s"')<]+/g);
  
  console.log('\nManus storage refs:', manusImgs || 'none');
  console.log('CDN refs:', cdnImgs || 'none');
  console.log('Full URL image refs:', allImgs || 'none');
  
  // Show first 500 chars of content
  console.log('\nFirst 1000 chars of content:');
  console.log(row.content_markdown.substring(0, 1000));
  console.log('\n... (truncated)');
  
  // Search for img tags
  const imgTags = row.content_markdown.match(/<img[^>]+>/g);
  console.log('\nImg tags:', imgTags || 'none');
  
  // Search for background-image
  const bgImgs = row.content_markdown.match(/background-image[^;]+/g);
  console.log('Background-image styles:', bgImgs || 'none');
}

await conn.end();
process.exit(0);
