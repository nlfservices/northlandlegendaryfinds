import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

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
    
    if (!rows.length) { console.log('NOT FOUND:', fix.slug); continue; }
    
    const article = rows[0];
    const featured = article.featuredImageUrl;
    const content = article.contentMarkdown;
    
    // Find the first <img> tag that contains the featured image URL
    const imgTagRegex = /<img[^>]*src="[^"]*"[^>]*>/g;
    let match;
    let replaced = false;
    
    while ((match = imgTagRegex.exec(content)) !== null) {
      const imgTag = match[0];
      if (imgTag.includes(featured)) {
        // Replace this img tag with the new one
        const newImgTag = `<img src="${fix.newImg}" alt="${fix.newAlt}" style="width:100%;border-radius:8px;margin:1rem 0;" />`;
        const newContent = content.replace(imgTag, newImgTag);
        
        await conn.execute(
          "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
          [newContent, article.id]
        );
        
        console.log('FIXED:', fix.slug);
        console.log('  Replaced first <img> matching featured image');
        replaced = true;
        break;
      }
    }
    
    if (!replaced) {
      console.log('NO MATCH:', fix.slug, '- no <img> tag matches featured image');
    }
  }
  
  await conn.end();
  console.log('\nDone! All duplicate images fixed.');
}

main().catch(console.error);
