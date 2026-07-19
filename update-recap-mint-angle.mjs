/**
 * Update weekly recap article — Add Marvel Mint SDCC angle
 * All featured cards are from the 2025 Topps Marvel Mint SDCC exclusive set
 * Run from project root: node update-recap-mint-angle.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'marvel-week-recap-july-14-18-sdcc-countdown-2026';

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Fetch current article
  const [rows] = await conn.execute(
    'SELECT id, contentMarkdown, title FROM articles WHERE slug = ?',
    [SLUG]
  );
  if (!rows.length) {
    console.error('Article not found!');
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;
  const id = rows[0].id;
  console.log(`Found article: "${rows[0].title}" (ID: ${id})`);

  // Add Marvel Mint context to the intro paragraph
  const mintIntro = `**Every card featured in this countdown is from the 2025 Topps Marvel Mint set** — the SDCC-exclusive release that debuted at San Diego Comic-Con 2025 and immediately became one of the most sought-after Marvel card products in the hobby. With 120 encased medallion cards across four tiers, Doctor Doom Comic Cuts containing actual vintage comic panels, and a Stan Lee Cut Signature at 1:15,701 odds, Marvel Mint redefined what a premium Marvel set could be.

And here is the kicker — **history is repeating itself.** Topps just announced that 2026 Topps Marvel Mint will debut at SDCC 2026 next week at Booth #2934, this time with a Spider-Man theme. The 2025 set focused on Doctor Doom. The 2026 set focuses on Spider-Man. Same exclusive format, same limited SDCC availability, same collector frenzy. If you missed the 2025 release, next week is your second chance.

These are our personal graded hits from the 2025 set — Platinum tier cards featuring the biggest names in Marvel, pulled from SDCC exclusive boxes and graded by CGC and PSA. This is what the hunt looks like when it pays off.`;

  // Insert the Marvel Mint context after the first paragraph (before the first ## heading)
  const firstH2Index = content.indexOf('\n## ');
  if (firstH2Index > -1) {
    const beforeFirstH2 = content.substring(0, firstH2Index);
    const afterFirstH2 = content.substring(firstH2Index);
    content = beforeFirstH2 + '\n\n' + mintIntro + '\n' + afterFirstH2;
  }

  // Update the article
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
    [content, id]
  );
  console.log(`✅ Updated article with Marvel Mint SDCC angle`);

  // Also update the excerpt and metaDescription to reflect the new angle
  const newExcerpt = "Every card in this countdown is from the 2025 Topps Marvel Mint SDCC exclusive set — and Topps just announced the 2026 edition returns to Comic-Con next week. Here are 7 stories that matter heading into the biggest Marvel week of the year.";
  const newMeta = "Weekly Marvel recap July 14-18: All featured cards from the 2025 Topps Marvel Mint SDCC exclusive set. Plus: Topps announces 2026 Marvel Mint returns to SDCC. Doctor Doom, Spider-Man, X-Men, Wolverine and more.";
  
  await conn.execute(
    'UPDATE articles SET excerpt = ?, metaDescription = ? WHERE id = ?',
    [newExcerpt, newMeta, id]
  );
  console.log(`✅ Updated excerpt and meta description`);

  await conn.end();
  console.log('\nDone!');
}

main().catch(console.error);
