/**
 * Fix Day 1 article - update language about the Doom card being relisted
 * The card is back on eBay from the same seller at $150K
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Fix Day 1 article
  const [rows] = await conn.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = '2026-topps-chrome-marvel-day-1-streamers-doom-superfractor'"
  );
  if (rows.length) {
    let content = rows[0].contentMarkdown;
    const oldText = "The listing was briefly pulled and is now back within 24 hours — either sold privately or taken down to negotiate off-platform. Either way, the message was clear: Doom is king, and this set is the real deal.";
    const newText = "The listing was briefly pulled but is now back on eBay from the same seller at $150,000. The message is clear: Doom is king, and this set is the real deal.";
    
    if (content.includes(oldText)) {
      content = content.replace(oldText, newText);
      await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [content, rows[0].id]);
      console.log(`✅ Fixed Day 1 article (ID: ${rows[0].id})`);
    } else {
      console.log(`ℹ️ Day 1 article text doesn't match expected — checking current state...`);
      const lines = content.split('\n').filter(l => l.includes('pulled') || l.includes('149,999') || l.includes('150'));
      lines.forEach(l => console.log('  >', l.trim()));
    }
  }

  // Also verify the Doompendance article was fixed
  const [doom] = await conn.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = 'doompendance-day-doctor-doom-july-4th-marvel-cards'"
  );
  if (doom.length) {
    const content = doom[0].contentMarkdown;
    const lines = content.split('\n').filter(l => l.includes('150'));
    console.log('\nDoompendance Day article - $150K references:');
    lines.forEach(l => console.log('  >', l.trim()));
  }

  await conn.end();
  console.log('\nDone!');
}

main().catch(console.error);
