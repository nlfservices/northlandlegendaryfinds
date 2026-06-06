import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

const conn = await createConnection(process.env.DATABASE_URL);

const OLD_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-split-poster-9yxKGS3CWwY3YA5Y5kM849.webp';
const NEW_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-split-poster-v2_c6c00c2e.jpg';

const [rows] = await conn.execute('SELECT id, contentMarkdown FROM articles WHERE id = 1890002');
const article = rows[0];
let content = article.contentMarkdown;

if (content.includes(OLD_URL)) {
  content = content.replace(OLD_URL, NEW_URL);
  await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [content, article.id]);
  console.log('✅ Replaced caped Wolverine split-poster with correct no-cape version!');
} else {
  // Try partial match
  const match = content.match(/https:\/\/[^\s)"]+wolv-spidey-split-poster[^\s)"]+/);
  if (match) {
    content = content.replace(match[0], NEW_URL);
    await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [content, article.id]);
    console.log('✅ Fixed via partial match! Replaced:', match[0]);
  } else {
    console.log('❌ Could not find split-poster URL. Current image URLs:');
    const urls = [...content.matchAll(/https:\/\/d2xsxph8kpxj0f[^\s)"]+/g)].map(m => m[0]);
    urls.forEach((u, i) => console.log(i+1, u));
  }
}

await conn.end();
process.exit(0);
