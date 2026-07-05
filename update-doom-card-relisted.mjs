/**
 * Update articles: Fix references to the $150K Doom Superfractor being "pulled" from eBay
 * The card is back on eBay from the same seller — update language accordingly
 * Run from project root: node update-doom-card-relisted.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Articles that reference the card being pulled
const SLUGS = [
  '2026-topps-chrome-marvel-day-1-streamers-doom-superfractor',
  'doompendance-day-doctor-doom-july-4th-marvel-cards',
];

// Replacements to make
const REPLACEMENTS = [
  {
    old: 'hit eBay at $150,000 and got pulled almost immediately',
    new: 'hit eBay at $150,000, was briefly pulled, and is now back from the same seller'
  },
  {
    old: 'hit eBay at $150K and got pulled almost immediately',
    new: 'hit eBay at $150K, was briefly pulled, and is now back from the same seller'
  },
  {
    old: 'hit eBay at $150K and got pulled immediately',
    new: 'hit eBay at $150K, was briefly pulled, and is now back from the same seller'
  },
  {
    old: 'got pulled almost immediately',
    new: 'was briefly pulled and is now relisted by the same seller'
  },
  {
    old: 'hit eBay at $150K and got pulled',
    new: 'hit eBay at $150K, was briefly pulled, and is now relisted by the same seller'
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  for (const slug of SLUGS) {
    const [rows] = await conn.execute(
      'SELECT id, contentMarkdown, cardMarketImpact FROM articles WHERE slug = ?',
      [slug]
    );
    if (!rows.length) {
      console.log(`⚠️ Not found: ${slug}`);
      continue;
    }

    let content = rows[0].contentMarkdown;
    let cardMarketImpact = rows[0].cardMarketImpact;
    const id = rows[0].id;
    let changed = false;

    for (const r of REPLACEMENTS) {
      if (content.includes(r.old)) {
        content = content.replaceAll(r.old, r.new);
        changed = true;
      }
      if (cardMarketImpact && cardMarketImpact.includes(r.old)) {
        cardMarketImpact = cardMarketImpact.replaceAll(r.old, r.new);
        changed = true;
      }
    }

    if (changed) {
      await conn.execute(
        'UPDATE articles SET contentMarkdown = ?, cardMarketImpact = ? WHERE id = ?',
        [content, cardMarketImpact, id]
      );
      console.log(`✅ Updated: "${slug}" (ID: ${id})`);
    } else {
      console.log(`ℹ️ No matching text found in: ${slug}`);
    }
  }

  // Also check the Day 1 article for specific "pulled" references about the Doom card
  const [day1] = await conn.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = '2026-topps-chrome-marvel-day-1-streamers-doom-superfractor'"
  );
  if (day1.length) {
    let content = day1[0].contentMarkdown;
    // Check for other variations
    const variations = [
      { old: 'was pulled from eBay', new: 'was briefly pulled from eBay and is now relisted by the same seller' },
      { old: 'got pulled from eBay', new: 'was briefly pulled from eBay and is now relisted by the same seller' },
      { old: 'listing was pulled', new: 'listing was briefly pulled and is now back' },
    ];
    let extraChanged = false;
    for (const v of variations) {
      if (content.includes(v.old)) {
        content = content.replaceAll(v.old, v.new);
        extraChanged = true;
      }
    }
    if (extraChanged) {
      await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [content, day1[0].id]);
      console.log(`✅ Additional fixes applied to Day 1 article (ID: ${day1[0].id})`);
    }
  }

  await conn.end();
  console.log("\nDone! All articles updated to reflect the card being relisted.");
}

main().catch(console.error);
