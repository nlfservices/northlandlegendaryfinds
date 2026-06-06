import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

const conn = await createConnection(process.env.DATABASE_URL);

// The current rooftop image (cinematic photorealistic) to replace
const OLD_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-rooftop-correct-26WV8qKZ4bBug2v6kvNAbG.webp';

// The user's animated comic-style image (uploaded to webdev CDN)
// manus-upload-file returned: /manus-storage/wolv-spidey-animated-user_d2938be5.jpg
// The webdev CDN serves files from /manus-storage/ at the project's asset base URL
const NEW_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-animated-user_d2938be5.jpg';

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
  console.log('✅ Replaced rooftop image with user animated comic-style image!');
} else {
  console.log('⚠️ Old URL not found. Trying partial match...');
  if (content.includes('wolv-spidey-rooftop-correct')) {
    const fixed = content.replace(/https:\/\/[^\s)\"]+wolv-spidey-rooftop-correct[^\s)\"]+/g, NEW_URL);
    await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [fixed, article.id]);
    console.log('✅ Fixed via partial match!');
  } else {
    console.log('❌ Could not find rooftop image URL to replace.');
  }
}

await conn.end();
process.exit(0);
