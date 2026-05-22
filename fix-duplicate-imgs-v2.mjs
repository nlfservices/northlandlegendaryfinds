import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// The issue: the page template renders the featuredImageUrl as a hero banner,
// AND the contentMarkdown also contains the same image as the first image.
// We need to replace that first image in contentMarkdown with a unique one.

const FIXES = [
  {
    slug: 'fallen-son-part-1-denial-anger-wolverine-avengers-captain-america',
    newImg: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-wolverine-denial-GihmgCoD8ncmue6EKMYuXV.webp',
    newAlt: 'Wolverine in a dark helicarrier corridor, fists clenched in denial'
  },
  {
    slug: 'fallen-son-part-2-bargaining-depression-hawkeye-spider-man',
    newImg: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-hawkeye-shield-kQoiYxY3Z4hPQoiqvugNjv.webp',
    newAlt: 'Hawkeye holding Captain America shield in a dimly lit bunker'
  },
  {
    slug: 'fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man',
    newImg: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-sam-wilson-eulogy-es6oJc4KvrDhsmGnGXjCCS.webp',
    newAlt: 'Sam Wilson delivering Captain America eulogy at Arlington National Cemetery'
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
    
    // Find the first markdown image that uses the featured image URL
    // Pattern: ![alt text](URL)
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
    const match = content.match(imgRegex);
    
    if (match) {
      const oldImgMarkdown = match[0];
      const oldUrl = match[2];
      
      // Check if the first image in content matches the featured image
      if (oldUrl === featured) {
        const newImgMarkdown = `![${fix.newAlt}](${fix.newImg})`;
        const newContent = content.replace(oldImgMarkdown, newImgMarkdown);
        
        await conn.execute(
          "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
          [newContent, article.id]
        );
        
        console.log(`FIXED: ${fix.slug}`);
        console.log(`  Old: ${oldImgMarkdown.substring(0, 80)}...`);
        console.log(`  New: ${newImgMarkdown.substring(0, 80)}...`);
      } else {
        console.log(`SKIP: ${fix.slug} - first image doesn't match featured`);
        console.log(`  Featured: ${featured.substring(0, 60)}...`);
        console.log(`  First img: ${oldUrl.substring(0, 60)}...`);
      }
    } else {
      console.log(`NO IMAGE FOUND: ${fix.slug}`);
    }
  }
  
  await conn.end();
  console.log('\nDone!');
}

main().catch(console.error);
