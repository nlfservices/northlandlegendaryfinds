import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  const slugs = [
    'fallen-son-part-1-denial-anger-wolverine-avengers-captain-america',
    'fallen-son-part-2-bargaining-depression-hawkeye-spider-man',
    'fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man'
  ];
  
  for (const slug of slugs) {
    const [rows] = await conn.execute(
      "SELECT featuredImageUrl, contentMarkdown FROM articles WHERE slug = ?",
      [slug]
    );
    
    if (!rows.length) { console.log('NOT FOUND:', slug); continue; }
    
    const content = rows[0].contentMarkdown;
    const featured = rows[0].featuredImageUrl;
    
    console.log('\n===', slug.substring(0, 50), '===');
    console.log('Featured:', featured ? featured.substring(0, 80) : 'NONE');
    
    // Check for markdown images
    const mdImgs = content.match(/!\[[^\]]*\]\([^)]+\)/g) || [];
    console.log('Markdown images found:', mdImgs.length);
    mdImgs.forEach((m, i) => console.log('  MD', i, ':', m.substring(0, 100)));
    
    // Check for HTML images
    const htmlImgs = content.match(/<img[^>]+>/g) || [];
    console.log('HTML images found:', htmlImgs.length);
    htmlImgs.forEach((m, i) => console.log('  HTML', i, ':', m.substring(0, 100)));
    
    // Check for raw image URLs on their own line
    const rawUrls = content.match(/https:\/\/[^\s)]+\.(png|jpg|webp|jpeg)/g) || [];
    console.log('Raw image URLs found:', rawUrls.length);
    rawUrls.forEach((u, i) => console.log('  RAW', i, ':', u.substring(0, 80)));
    
    // Check if featured image appears in content at all
    if (featured && content.includes(featured)) {
      console.log('*** FEATURED IMAGE IS IN CONTENT ***');
    }
  }
  
  await conn.end();
}

main().catch(console.error);
