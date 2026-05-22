import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT contentMarkdown FROM articles WHERE slug = ?', ['pedro-pascal-mandalorian-reed-richards-fantastic-four-doomsday']);
let content = rows[0].contentMarkdown;

// The old image URL we want to replace
const oldImageUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/pedro-pascal-cards-collection-Wk8eiwfcVtW8Q99rkSVhLP.webp';
const newImageUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/pedro-pascal-cards-glass-case-K36HyE6nh88r448TMuxyY4.webp';

if (content.includes(oldImageUrl)) {
  content = content.replace(oldImageUrl, newImageUrl);
  await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE slug = ?', [content, 'pedro-pascal-mandalorian-reed-richards-fantastic-four-doomsday']);
  console.log('SUCCESS: Replaced collector image with glass case image');
} else {
  console.log('Old image URL not found, searching for alternatives...');
  // Find any image near "What This Means for Collectors"
  const idx = content.indexOf('What This Means for Collectors');
  if (idx > -1) {
    const section = content.substring(idx, idx + 500);
    console.log('Section content:', section.substring(0, 300));
    // Try to find any image in this section
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
    const match = section.match(imgRegex);
    if (match) {
      console.log('Found image:', match[2]);
      content = content.replace(match[2], newImageUrl);
      await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE slug = ?', [content, 'pedro-pascal-mandalorian-reed-richards-fantastic-four-doomsday']);
      console.log('SUCCESS: Replaced image');
    } else {
      console.log('No image found in section');
    }
  } else {
    console.log('Section heading not found');
  }
}

await conn.end();
process.exit(0);
