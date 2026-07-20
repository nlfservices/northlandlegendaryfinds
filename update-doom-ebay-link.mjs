/**
 * Update Doctor Doom Comic Cuts article — Add eBay link for active listings
 * Run from project root: node update-doom-ebay-link.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'doctor-doom-comic-cuts-history-lesson-2025-topps-marvel-mint';
const EBAY_LINK = 'https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+comic+cut+doom&_sacat=0&LH_TitleDesc=0';

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

  // Add eBay link after the description of what the cards are, before "There are 200 of them in the entire set."
  const oldText = `There are 200 of them in the entire set. That's it. 200 unique pieces of Doctor Doom's printed legacy, distributed at 1:61 odds in Hobby boxes and 1:63 in SDCC boxes.`;

  const newText = `There are 200 of them in the entire set. That's it. 200 unique pieces of Doctor Doom's printed legacy, distributed at 1:61 odds in Hobby boxes and 1:63 in SDCC boxes.

**Want to see what's available right now?** [Browse Doctor Doom Comic Cut listings on eBay](${EBAY_LINK}) — new pulls hit the market every week.`;

  content = content.replace(oldText, newText);

  // Also update the Collector's Corner eBay reference to be more specific
  const oldEbay = `Find singles and sealed product on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** — search "2025 Topps Marvel Mint Comic Cut Doom" for the latest pulls.`;

  const newEbay = `Find Comic Cut singles on **[eBay — Doctor Doom Comic Cuts](${EBAY_LINK})** — new 1/1 pulls hit the market every week as collectors rip boxes.`;

  content = content.replace(oldEbay, newEbay);

  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
    [content, SLUG]
  );

  console.log('✅ Article updated with eBay links for active Comic Cut listings!');
  await conn.end();
}

main().catch(console.error);
