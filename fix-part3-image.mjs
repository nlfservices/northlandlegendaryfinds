import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const OLD_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-acceptance-74zR2XgVWd6nQv2UF9WRWu.png';
const NEW_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fallen-son-sam-wilson-eulogy-es6oJc4KvrDhsmGnGXjCCS.webp';

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get the article
  const [rows] = await conn.execute(
    "SELECT id, content_markdown FROM articles WHERE slug = 'fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man'"
  );
  
  if (!rows.length) {
    console.log('Article not found!');
    await conn.end();
    return;
  }
  
  const article = rows[0];
  const content = article.content_markdown;
  
  // The featured image is the same as the in-article image
  // We only want to replace the SECOND occurrence (the in-article one)
  // Find the first occurrence and skip it, replace the second
  const firstIdx = content.indexOf(OLD_IMG);
  if (firstIdx === -1) {
    console.log('Image URL not found in content!');
    await conn.end();
    return;
  }
  
  const secondIdx = content.indexOf(OLD_IMG, firstIdx + 1);
  if (secondIdx === -1) {
    console.log('Only one occurrence found - no duplicate to fix');
    await conn.end();
    return;
  }
  
  // Replace only the second occurrence
  const newContent = content.substring(0, secondIdx) + NEW_IMG + content.substring(secondIdx + OLD_IMG.length);
  
  await conn.execute(
    "UPDATE articles SET content_markdown = ? WHERE id = ?",
    [newContent, article.id]
  );
  
  console.log('SUCCESS: Replaced duplicate image in Part 3 article');
  console.log('Old (2nd occurrence):', OLD_IMG);
  console.log('New:', NEW_IMG);
  
  await conn.end();
}

main().catch(console.error);
