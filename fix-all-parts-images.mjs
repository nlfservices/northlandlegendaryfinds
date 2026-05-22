import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FIXES = [
  {
    slug: 'fallen-son-part-1-denial-anger-wolverine-avengers-captain-america',
    newImg: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-wolverine-denial-GihmgCoD8ncmue6EKMYuXV.webp'
  },
  {
    slug: 'fallen-son-part-2-bargaining-depression-hawkeye-spider-man',
    newImg: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-hawkeye-shield-kQoiYxY3Z4hPQoiqvugNjv.webp'
  },
  {
    slug: 'fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man',
    newImg: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-sam-wilson-eulogy-es6oJc4KvrDhsmGnGXjCCS.webp'
  }
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (const fix of FIXES) {
    const [rows] = await conn.execute(
      "SELECT id, featuredImageUrl, contentMarkdown FROM articles WHERE slug = ?",
      [fix.slug]
    );
    
    if (!rows.length) {
      console.log(`NOT FOUND: ${fix.slug}`);
      continue;
    }
    
    const article = rows[0];
    const featured = article.featuredImageUrl;
    const content = article.contentMarkdown;
    
    // Find all occurrences of the featured image in content
    const regex = new RegExp(featured.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = [...content.matchAll(regex)];
    
    if (matches.length <= 1) {
      console.log(`NO DUPLICATE: ${fix.slug} (featured image appears ${matches.length} time(s) in content)`);
      continue;
    }
    
    // Replace only the SECOND occurrence (first one after the featured image at top)
    const firstIdx = content.indexOf(featured);
    const secondIdx = content.indexOf(featured, firstIdx + 1);
    
    const newContent = content.substring(0, secondIdx) + fix.newImg + content.substring(secondIdx + featured.length);
    
    await conn.execute(
      "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
      [newContent, article.id]
    );
    
    console.log(`FIXED: ${fix.slug}`);
    console.log(`  Replaced 2nd occurrence of featured image with new unique image`);
  }
  
  await conn.end();
  console.log('\nDone! All duplicate images fixed.');
}

main().catch(console.error);
