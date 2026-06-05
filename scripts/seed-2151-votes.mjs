/**
 * Seed 2,151 votes for the Doomsday trailer poll
 * Realistic distribution across 5 options:
 * 0: ☕ SDCC — 612 votes (28%)
 * 1: 🕷️ Spider-Man — 387 votes (18%)
 * 2: 🎬 Endgame Re-Release — 538 votes (25%)
 * 3: 🚫 No trailer ever — 463 votes (22%)
 * 4: 🤷 Just want Doom espresso — 151 votes (7%)
 * Total: 2,151
 */
import dotenv from 'dotenv';
dotenv.config();
import { createConnection } from 'mysql2/promise';

const db = await createConnection(process.env.DATABASE_URL);

const POLL_ID = 1;
const distribution = [612, 387, 538, 463, 151]; // 2,151 total (minus 1 existing = 2,150 to add)
// We already have 1 vote for option 3, so subtract 1 from option 3
const toAdd = [612, 387, 538, 462, 151]; // 2,150 new votes

console.log('Seeding votes...');

let total = 0;
for (let optionIndex = 0; optionIndex < toAdd.length; optionIndex++) {
  const count = toAdd[optionIndex];
  const values = [];
  for (let i = 0; i < count; i++) {
    const fakeVisitorId = `seed_v${optionIndex}_${i}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)); // random within last 7 days
    values.push([POLL_ID, optionIndex, fakeVisitorId, createdAt]);
  }
  
  // Insert in batches of 100
  for (let b = 0; b < values.length; b += 100) {
    const batch = values.slice(b, b + 100);
    const placeholders = batch.map(() => '(?, ?, ?, ?)').join(', ');
    const flatValues = batch.flat();
    await db.execute(
      `INSERT INTO article_poll_votes (pollId, optionIndex, visitorId, createdAt) VALUES ${placeholders}`,
      flatValues
    );
  }
  
  total += count;
  console.log(`  Option ${optionIndex}: +${count} votes (${distribution[optionIndex]} total)`);
}

console.log(`\n✅ Done! Added ${total} votes. Total in DB: 2,151`);

// Verify
const [result] = await db.execute('SELECT COUNT(*) as total FROM article_poll_votes WHERE pollId = ?', [POLL_ID]);
console.log('DB count:', result[0].total);

await db.end();
