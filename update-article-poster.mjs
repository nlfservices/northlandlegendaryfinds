/**
 * Replace the theater lobby image in Brand New Day article with the new triple-panel poster
 * using real card art (Spider-Man, Iron Man, Doctor Doom)
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'spider-man-brand-new-day-presale-records-2026-marvel-collector-guide';
const NEW_POSTER_URL = '/manus-storage/marvel-2026-triple-poster_999fcf8a.png';

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  const [rows] = await conn.execute(
    'SELECT id, contentMarkdown FROM articles WHERE slug = ?',
    [SLUG]
  );
  if (!rows.length) {
    console.error('Article not found!');
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;
  const id = rows[0].id;

  // Find the old theater lobby image (the second image - marvel-2026-calendar)
  const oldImgRegex = /<img[^>]*marvel-2026-calendar[^>]*\/>/;
  if (oldImgRegex.test(content)) {
    content = content.replace(
      oldImgRegex,
      `<img src="${NEW_POSTER_URL}" alt="2026 Marvel Movie Timeline: Spider-Man Brand New Day, Avengers Endgame Re-Release, and Avengers Doomsday" style="width:100%;border-radius:8px;margin:1.5rem 0;" />`
    );
    console.log('✅ Replaced theater lobby image with new triple-panel poster');
  } else {
    console.log('⚠️ Theater lobby image not found, checking for other patterns...');
    // Try to find any image with "calendar" or "lobby" in it
    const altRegex = /<img[^>]*(calendar|lobby|triple)[^>]*\/>/;
    if (altRegex.test(content)) {
      content = content.replace(
        altRegex,
        `<img src="${NEW_POSTER_URL}" alt="2026 Marvel Movie Timeline: Spider-Man Brand New Day, Avengers Endgame Re-Release, and Avengers Doomsday" style="width:100%;border-radius:8px;margin:1.5rem 0;" />`
      );
      console.log('✅ Replaced image (alt pattern match)');
    } else {
      console.log('Listing all img tags in content:');
      const allImgs = content.match(/<img[^>]*>/g);
      if (allImgs) {
        allImgs.forEach((img, i) => console.log(`  [${i}] ${img.substring(0, 100)}...`));
      }
    }
  }

  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
    [content, id]
  );
  console.log(`✅ Article updated (ID: ${id})`);

  await conn.end();
}

main().catch(console.error);
