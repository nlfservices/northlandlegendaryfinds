/**
 * Fix eBay link in Doctor Doom Comic Cuts article to use user's exact URL
 * Run from project root: node fix-ebay-link.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'doctor-doom-comic-cuts-history-lesson-2025-topps-marvel-mint';
const CORRECT_EBAY_LINK = 'https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+doctor+doom+comic+cut&_sacat=0&_from=R40&_sop=16';
const OLD_EBAY_LINK = 'https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+comic+cut+doom&_sacat=0&LH_TitleDesc=0';

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

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

  // Replace all instances of the old eBay link with the correct one
  content = content.replaceAll(OLD_EBAY_LINK, CORRECT_EBAY_LINK);

  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
    [content, SLUG]
  );

  console.log('✅ eBay links updated to correct URL!');
  console.log(`   New link: ${CORRECT_EBAY_LINK}`);
  await conn.end();
}

main().catch(console.error);
