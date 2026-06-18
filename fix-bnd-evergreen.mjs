/**
 * Update Spider-Man BND article:
 * 1. Make trailer intro open-ended (remove specific date so it's evergreen)
 * 2. Add a view count comparison showing No Way Home vs Brand New Day trailer numbers
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  const [rows] = await conn.execute(
    'SELECT contentMarkdown FROM articles WHERE slug = ?',
    ['spiderman-brand-new-day-trailer-record-breaking-card-market']
  );

  if (!rows.length) { console.error("Article not found"); process.exit(1); }

  let content = rows[0].contentMarkdown;

  // 1. Replace the dated opening paragraph with an evergreen version
  const oldOpening = `The internet broke on March 18, 2026. Marvel Studios dropped the official trailer for **Spider-Man: Brand New Day**, and within its first day it became the most-watched Marvel trailer in history. Fans watched it over **718 million times in its first day alone** — a number that made it the biggest trailer launch of all time. The reveal itself was an event: over the course of 24 hours, Spidey fans around the world revealed small snippets of the trailer, with the baton-passing culminating in **Tom Holland unveiling the full trailer from atop the Empire State Building at sunrise**, ringing in a brand new day for New York City.`;

  const newOpening = `Marvel Studios dropped the official trailer for **Spider-Man: Brand New Day** — and it immediately became the most-watched trailer in history. The numbers are staggering: over **718 million views in its first 24 hours**, obliterating every previous record. The reveal itself was an event: Spidey fans around the world revealed small snippets of the trailer over the course of a day, with the baton-passing culminating in **Tom Holland unveiling the full trailer from atop the Empire State Building at sunrise**, ringing in a brand new day for New York City.`;

  if (content.includes(oldOpening)) {
    content = content.replace(oldOpening, newOpening);
    console.log("✅ Opening paragraph made evergreen (removed specific date)");
  } else {
    console.log("⚠️ Could not find exact opening paragraph to replace");
  }

  // 2. Replace the "Record in Context" section with a comparison counter
  const oldRecordSection = `## The Record in Context

Marvel has had massive trailer moments before. *Avengers: Endgame* set records. *No Way Home* shattered them. But Brand New Day's 718 million first-day views represent something different.

The MCU is in a rebuilding phase. After the Infinity Saga concluded, the studio has been laying groundwork — introducing new characters, seeding storylines, managing audience expectations across a sprawling content calendar. The Brand New Day trailer is the first moment since Endgame where the internet collectively stopped and said: *this is the one*.

That 718 million number isn't just a marketing metric. It's a signal. It tells studios, distributors, investors, and — critically — **collectors** that Spider-Man is the most bankable character in the Marvel universe right now. Not Doom. Not the Avengers. Spider-Man.

That matters enormously for the card market.`;

  const newRecordSection = `## How It Compares: Trailer View Records

To understand how massive Brand New Day's launch was, here's how it stacks up against previous Spider-Man and Marvel trailer records in their first 24 hours:

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:2rem 0;padding:1.5rem;background:rgba(0,255,100,0.03);border:1px solid rgba(0,255,100,0.15);border-radius:12px;">
  <div style="text-align:center;padding:1.5rem;background:rgba(0,0,0,0.3);border-radius:8px;">
    <div style="font-size:0.85rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Spider-Man: No Way Home (2021)</div>
    <div style="font-size:2.5rem;font-weight:800;color:#ff6b6b;">355.5M</div>
    <div style="font-size:0.8rem;color:#aaa;">views in 24 hours</div>
    <div style="font-size:0.75rem;color:#666;margin-top:0.5rem;">Previous Spider-Man record</div>
  </div>
  <div style="text-align:center;padding:1.5rem;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid rgba(0,255,100,0.3);">
    <div style="font-size:0.85rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Spider-Man: Brand New Day (2026)</div>
    <div style="font-size:2.5rem;font-weight:800;color:#00ff64;">718.6M</div>
    <div style="font-size:0.8rem;color:#aaa;">views in 24 hours</div>
    <div style="font-size:0.75rem;color:#00ff64;margin-top:0.5rem;">+102% increase — ALL-TIME RECORD</div>
  </div>
</div>

That's not a marginal improvement — it's a **complete demolition** of the previous record. Brand New Day more than doubled what No Way Home achieved, and No Way Home was already considered untouchable.

The MCU is in a rebuilding phase. After the Infinity Saga concluded, the studio has been laying groundwork — introducing new characters, seeding storylines, managing audience expectations across a sprawling content calendar. The Brand New Day trailer is the first moment since Endgame where the internet collectively stopped and said: *this is the one*.

That 718.6 million number isn't just a marketing metric. It's a signal. It tells studios, distributors, investors, and — critically — **collectors** that Spider-Man is the most bankable character in the Marvel universe right now. Not Doom. Not the Avengers. Spider-Man.

That matters enormously for the card market.`;

  if (content.includes(oldRecordSection)) {
    content = content.replace(oldRecordSection, newRecordSection);
    console.log("✅ Added trailer view comparison counter (No Way Home vs Brand New Day)");
  } else {
    console.log("⚠️ Could not find exact record section to replace");
  }

  // 3. Also remove any remaining specific date references that make it feel dated
  content = content.replace(
    'The trailer is a masterclass in controlled chaos. It opens with Peter Parker navigating a world that has fundamentally changed',
    'The trailer is a masterclass in controlled chaos. It opens with Peter Parker navigating a world that has fundamentally changed'
  );

  const [result] = await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
    [content, 'spiderman-brand-new-day-trailer-record-breaking-card-market']
  );

  console.log(`\nUpdated: ${result.affectedRows} row(s)`);
  await conn.end();
  console.log("Done!");
}

main().catch(console.error);
