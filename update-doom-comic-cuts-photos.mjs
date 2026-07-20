/**
 * Update Doctor Doom Comic Cuts article — Add real card photos
 * Adds front and back photos of an actual Comic Cut card
 * Run from project root: node update-doom-comic-cuts-photos.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'doctor-doom-comic-cuts-history-lesson-2025-topps-marvel-mint';

const COMIC_CUT_FRONT = '/manus-storage/DoomComicCut-Front_efe55fd7.webp';
const COMIC_CUT_BACK = '/manus-storage/DoomComicCut-Back_f65a87f3.webp';

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Get current article
  const [rows] = await conn.execute(
    'SELECT id, contentMarkdown FROM articles WHERE slug = ?',
    [SLUG]
  );

  if (rows.length === 0) {
    console.error('Article not found!');
    await conn.end();
    return;
  }

  let content = rows[0].contentMarkdown;

  // Replace the section "What Makes These Cards Different" to add the real card photos
  const oldSection = `## What Makes These Cards Different

Let's be clear about what a Comic Cut card actually is. Topps physically cut panels from real, printed Doctor Doom comic books — spanning the character's entire publication history — and embedded them into trading cards. Each card is sealed in a one-touch case. Each is numbered DD-CC. Each is a true 1/1 because no two panels are identical.`;

  const newSection = `## What Makes These Cards Different

Let's be clear about what a Comic Cut card actually is. Topps physically cut panels from real, printed Doctor Doom comic books — spanning the character's entire publication history — and embedded them into trading cards. Each card is sealed in a one-touch case. Each is numbered DD-CC. Each is a true 1/1 because no two panels are identical.

<img src="${COMIC_CUT_FRONT}" alt="Doctor Doom Comic Cut 1/1 - Front - Authentic comic panel embedded in card, showing classic Kirby-era Doctor Doom artwork" style="width:100%;max-width:450px;border-radius:12px;margin:24px auto;display:block;" />

<img src="${COMIC_CUT_BACK}" alt="Doctor Doom Comic Cut 1/1 - Back - DD-CC numbering, reads: A Comic Cut featuring Dr. Doom from 2025 Marvel Mint. This card contains an authentic piece of Marvel comic panel." style="width:100%;max-width:450px;border-radius:12px;margin:24px auto;display:block;" />

That's what you're looking at above — an actual Doctor Doom Comic Cut from our collection. The front shows a genuine Kirby-era panel physically embedded into the card, marked 1/1 in the bottom left corner with "AUTHENTIC COMIC CUT" running down the right side. The back confirms it: "A Comic Cut featuring Dr. Doom from 2025 Marvel Mint. This card contains an authentic piece of Marvel comic panel."`;

  content = content.replace(oldSection, newSection);

  // Update the article
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
    [content, SLUG]
  );

  console.log('✅ Article updated with real Comic Cut card photos!');
  console.log(`   Front: ${COMIC_CUT_FRONT}`);
  console.log(`   Back: ${COMIC_CUT_BACK}`);

  await conn.end();
}

main().catch(console.error);
