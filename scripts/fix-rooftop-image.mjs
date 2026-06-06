import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

const conn = await createConnection(process.env.DATABASE_URL);

const OLD_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-rooftop-duo-hnujUpPeJJ7RrAnob5FpBE.webp';
const NEW_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-rooftop-correct-26WV8qKZ4bBug2v6kvNAbG.webp';

const [rows] = await conn.execute(
  'SELECT id, contentMarkdown FROM articles WHERE id = 1890002'
);

const article = rows[0];
let content = article.contentMarkdown;

if (content.includes(OLD_URL)) {
  content = content.replace(OLD_URL, NEW_URL);
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
    [content, article.id]
  );
  console.log('✅ Replaced wrong rooftop image with correct Spider-Man + Wolverine image!');
} else {
  console.log('⚠️ Old URL not found in content. Current image URLs:');
  const urls = [...content.matchAll(/https:\/\/d2xsxph8kpxj0f[^\s)]+/g)].map(m => m[0]);
  urls.forEach(u => console.log(' -', u));
}

await conn.end();
process.exit(0);
