import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

const conn = await createConnection(process.env.DATABASE_URL);

// Get the current article content
const [rows] = await conn.execute(
  'SELECT id, contentMarkdown FROM articles WHERE id = 1890002'
);

if (!rows.length) {
  console.error('Article not found!');
  process.exit(1);
}

const article = rows[0];
console.log('Article ID:', article.id);

// Image URLs (CDN compressed webp)
const SPLIT_POSTER = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-split-poster-9yxKGS3CWwY3YA5Y5kM849.webp';
const ROOFTOP_DUO = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-rooftop-duo-hnujUpPeJJ7RrAnob5FpBE.webp';
const MULTIVERSE = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wolv-spidey-multiverse2-8jdWCKsZia88r35Wy229ma.webp';

// Markdown image blocks to inject
const splitPosterBlock = `\n\n![Wolverine stands in his stormy industrial world while Spider-Man perches over a golden New York sunset — two heroes, two universes](${SPLIT_POSTER})\n*Two worlds. Two heroes. One catastrophic collision. Wolverine's cold industrial universe vs Spider-Man's warm New York.*\n\n`;

const rooftopDuoBlock = `\n\n![Spider-Man and Wolverine standing back to back on a New York rooftop at sunset](${ROOFTOP_DUO})\n*Before the incursion, before the collision — two of Marvel's greatest heroes, two very different worlds.*\n\n`;

const multiverseBlock = `\n\n![Spider-Man watches as the multiverse cracks apart above New York City](${MULTIVERSE})\n*The incursion begins. Spider-Man's Earth faces destruction as another universe tears through the sky.*\n\n`;

let content = article.contentMarkdown;

// Inject split poster BEFORE "The Setup" section
const setupMarker = '## The Setup: Two Worlds, One Catastrophic Collision';
const setupIdx = content.indexOf(setupMarker);
if (setupIdx !== -1) {
  content = content.slice(0, setupIdx) + splitPosterBlock + content.slice(setupIdx);
  console.log('✅ Injected split poster before The Setup section');
} else {
  console.log('⚠️ Could not find The Setup section');
}

// Inject rooftop duo BEFORE "Why This Would Work Brilliantly"
const whyMarker = '## Why This Would Work Brilliantly';
const whyIdx = content.indexOf(whyMarker);
if (whyIdx !== -1) {
  content = content.slice(0, whyIdx) + rooftopDuoBlock + content.slice(whyIdx);
  console.log('✅ Injected rooftop duo before Why This Would Work section');
} else {
  console.log('⚠️ Could not find Why This Would Work section');
}

// Inject multiverse scene BEFORE "The Card Market Angle"
const cardMarker = '## The Card Market Angle';
const cardIdx = content.indexOf(cardMarker);
if (cardIdx !== -1) {
  content = content.slice(0, cardIdx) + multiverseBlock + content.slice(cardIdx);
  console.log('✅ Injected multiverse scene before The Card Market Angle section');
} else {
  console.log('⚠️ Could not find The Card Market Angle section');
}

// Update the article
await conn.execute(
  'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
  [content, article.id]
);

console.log('✅ Article updated with 3 new images!');
await conn.end();
process.exit(0);
