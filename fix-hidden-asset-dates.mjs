/**
 * Fix incorrect release dates in the "Marvel Cards Hidden Asset" article
 * Corrections:
 * - Avengers: Doomsday: May 2026 → December 18, 2026
 * - Avengers: Secret Wars: May 2027 → December 17, 2027
 * - Spider-Man Noir: "upcoming" → already premiered May 27, 2026
 * - Fantastic Four: "coming" → already released July 25, 2025
 * - Reframe content pipeline to reflect current reality (June 2026)
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Get current article content
  const [rows] = await conn.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = ?",
    ["marvel-cards-hidden-asset-celebrity-collectors-topps-fanatics-2026"]
  );

  if (!rows.length) {
    console.error("Article not found!");
    await conn.end();
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;
  const articleId = rows[0].id;

  // Fix the content pipeline section - replace the entire "Look at what's coming" block
  const oldPipeline = `Look at what's coming in the next two years:

- **Fantastic Four: First Steps** (July 2025)
- **Avengers: Doomsday** (May 2026) — Robert Downey Jr. returns as Doctor Doom
- **Spider-Man: Brand New Day** (July 2026)
- **Avengers: Secret Wars** (May 2027)
- **X-Men reboot** (in development)
- **Spider-Man Noir** — Nicolas Cage as the lead`;

  const newPipeline = `Look at what's already driving collector demand — and what's still coming:

- **Fantastic Four: First Steps** (released July 2025) — Already generating chase card demand
- **Spider-Noir** (premiered May 2026) — Nicolas Cage's live-action series is now streaming on Prime Video
- **Spider-Man: Brand New Day** (July 31, 2026) — Tom Holland returns in just weeks
- **Avengers: Doomsday** (December 18, 2026) — Robert Downey Jr. returns as Doctor Doom
- **Avengers: Secret Wars** (December 17, 2027) — The culmination of the Multiverse Saga
- **X-Men reboot** (in development) — The next franchise wave`;

  content = content.replace(oldPipeline, newPipeline);

  // Fix the Nicolas Cage section - he's no longer "upcoming", the show is out
  const oldCage = `Nicolas Cage deserves his own section here. Unlike most celebrity collectors who pick up cards as a side hobby, Cage is a genuine, lifelong comic book enthusiast. He named himself after Luke Cage. He sold a rare Action Comics #1 for over two million dollars. His love for comics is authentic in a way that can't be manufactured.

Now he's starring in Spider-Man Noir for Amazon. When Cage inevitably shows interest in Spider-Man Noir trading cards — and given his history, he will — it won't feel like a marketing stunt. It'll feel real. And authenticity is what drives lasting collector engagement.`;

  const newCage = `Nicolas Cage deserves his own section here. Unlike most celebrity collectors who pick up cards as a side hobby, Cage is a genuine, lifelong comic book enthusiast. He named himself after Luke Cage. He sold a rare Action Comics #1 for over two million dollars. His love for comics is authentic in a way that can't be manufactured.

His Spider-Noir series just premiered on Prime Video in May 2026 — and it's already generating buzz for Spider-Man Noir collectibles. When Cage inevitably shows off Spider-Man Noir trading cards — and given his history as a real collector, he will — it won't feel like a marketing stunt. It'll feel real. And authenticity is what drives lasting collector engagement.`;

  content = content.replace(oldCage, newCage);

  // Fix the closing paragraph - correct the dates
  const oldClosing = `*Marvel's next phase begins with Fantastic Four: First Steps in July 2025, followed by Avengers: Doomsday in May 2026 and Spider-Man: Brand New Day in July 2026. The content machine is running. The celebrity collectors are already here. The only question is whether you'll be positioned before the rest of the world catches on.*`;

  const newClosing = `*Spider-Man: Brand New Day hits theaters July 31, 2026. Avengers: Doomsday arrives December 18, 2026. Secret Wars closes the saga December 17, 2027. The content machine is running at full speed. The celebrity collectors are already here. The only question is whether you'll be positioned before the rest of the world catches on.*`;

  content = content.replace(oldClosing, newClosing);

  // Update the database
  await conn.execute(
    "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
    [content, articleId]
  );

  console.log(`✅ Article ${articleId} updated with correct release dates.`);
  console.log("   - Avengers: Doomsday → December 18, 2026");
  console.log("   - Avengers: Secret Wars → December 17, 2027");
  console.log("   - Spider-Noir → already premiered May 2026");
  console.log("   - Fantastic Four → already released July 2025");
  console.log("   - Closing paragraph updated");

  // Verify the fix
  const [verify] = await conn.execute(
    "SELECT contentMarkdown FROM articles WHERE id = ?",
    [articleId]
  );
  
  if (verify[0].contentMarkdown.includes("May 2026") && verify[0].contentMarkdown.includes("Doomsday")) {
    // Check if it's the old wrong reference or the new "premiered May 2026" for Spider-Noir
    if (verify[0].contentMarkdown.includes("Avengers: Doomsday** (May 2026)")) {
      console.error("❌ OLD WRONG DATE STILL PRESENT!");
    } else {
      console.log("✅ Verified: No incorrect Doomsday May 2026 reference remains.");
    }
  } else {
    console.log("✅ Verified: Content updated successfully.");
  }

  await conn.end();
}

main().catch(console.error);
