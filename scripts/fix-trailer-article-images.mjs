/**
 * Fix trailer prediction article:
 * 1. Replace the two bad images (Orpheum/Superman and old post-credits)
 * 2. Fix IGN text - they said SDCC not London event
 */
import dotenv from 'dotenv';
dotenv.config();
import { createConnection } from 'mysql2/promise';

const db = await createConnection(process.env.DATABASE_URL);

// Old image URLs to replace
const OLD_ENDGAME = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trailer-prediction-endgame-return-42asCJUCYG9GKMqCC68W3M.webp';
const OLD_POSTCREDITS = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trailer-prediction-postcredits-8H4Q8c87Ae27yQ8mbzfWTT.webp';

// New image URLs
const NEW_ENDGAME = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trailer-endgame-return-v2-KLPAN9xKhgaDbbthisxRk5.webp';
const NEW_POSTCREDITS = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trailer-postcredits-v2-cUP6p6sgBbuXdabaLGMN6Z.webp';

const [rows] = await db.execute(
  'SELECT id, contentMarkdown FROM articles WHERE slug = ? LIMIT 1',
  ['doomsday-trailer-prediction-why-everyone-is-wrong-june-2026']
);

if (!rows[0]) {
  console.error('Article not found!');
  process.exit(1);
}

let content = rows[0].contentMarkdown;

// Replace old images with new ones
content = content.replaceAll(OLD_ENDGAME, NEW_ENDGAME);
content = content.replaceAll(OLD_POSTCREDITS, NEW_POSTCREDITS);

// Fix IGN text - they predicted SDCC (which is correct), but the article framing 
// should be clear: IGN and others predicted the trailer at SDCC. 
// The article already says "IGN says SDCC" which is accurate — keep that.
// But also clarify that IGN previously said the SXSW London event would have a trailer reveal.
// Update the intro to reference both wrong predictions.
content = content.replace(
  'Every outlet is predicting when the trailer drops. IGN says SDCC. Others say it\'ll be attached to Spider-Man: Brand New Day.',
  'Every outlet is predicting when the trailer drops. IGN said the SXSW London event would have a major reveal — we got a coffee shop. Now they\'re saying SDCC. Others say it\'ll be attached to Spider-Man: Brand New Day.'
);

await db.execute(
  'UPDATE articles SET contentMarkdown = ?, updatedAt = ? WHERE id = ?',
  [content, new Date(), rows[0].id]
);

console.log('✅ Article updated successfully!');
console.log('  - Replaced Orpheum/Superman image with Cinema Arcade green-sky version');
console.log('  - Replaced old post-credits image with "DOOM RISES" version');
console.log('  - Updated IGN text to mention both SXSW London AND SDCC predictions');

await db.end();
