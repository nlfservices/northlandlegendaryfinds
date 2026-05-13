/**
 * Update community repack article with Rainbow Chase section
 * Run from project root: node update-rainbow-chase.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'help-us-build-your-dream-marvel-repack-community';

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

  const rainbowSection = `## Rainbow Chases: The Ultimate Parallel Hunt

Okay, this one might be our most exciting idea yet. Forget pulling a single numbered card and calling it a day. What if we built **rainbow chases** into our repacks?

Here's the concept: Take a single character — let's say Doctor Doom. Now imagine pulling the /50 version from one repack. Cool card, nice pull. But then you see that the /25 exists in another series. And the /10. And the /5. And somewhere out there... the /1.

**That's a rainbow chase.** One character, every numbered parallel, building toward the ultimate collection.

Think about what this does to the collecting experience:

You pull a Wolverine /50 from Series 1 and suddenly you're hooked. You NEED the /25. You're watching every stream, checking every drop, because that next piece of the rainbow could show up at any time. And when you finally land the /10? The adrenaline is unreal. You're three cards deep into a rainbow that only gets rarer from here.

**How it could work in NLF repacks:**

The **/50** — Your entry point. These show up more frequently across series. Affordable, accessible, and the card that starts the addiction. You pull this and think "okay, I could chase this rainbow."

The **/25** — Now it gets interesting. These appear less often, maybe every 2-3 series. You might have to compete for it on a live stream. The hunt is real.

The **/10** — Rare territory. Remember our scarcity system? A /10 might only appear once every few series. When it drops on stream, the chat is going to explode.

The **/5** — Ultra rare. These are the cards that make your hands shake. Five copies in existence, and NLF might only have one or two. When this hits the auction block, bring your wallet.

The **/1** — The holy grail. One of one. The card that completes the rainbow and makes you a legend in the NLF community. If we have it, it's going to be an EVENT when it drops. The kind of moment people talk about for months.

**Why rainbow chases change everything:**

It creates long-term engagement. You're not just buying one repack — you're investing in a chase that spans multiple series and multiple streams. Every drop becomes "is MY card in this one?" It turns passive buyers into dedicated community members.

It also creates natural trading opportunities. Maybe you pulled the Doom /25 but someone else has the /10. Now you're talking, negotiating, building relationships in the community. That's what collecting is supposed to be about.

**Characters we could build rainbow chases around:**
- **Doctor Doom** — The obvious choice with Doomsday hype. A Doom rainbow would be the crown jewel of any collection
- **Wolverine** — Fan favorite with massive demand across every set
- **Spider-Man** — The most iconic Marvel character, period
- **Gambit** — Beloved X-Men with surging MCU interest
- **Iron Man** — The card that started the MCU, the rainbow that ends collections

**Would you chase a rainbow?** Which character would you want to build a complete /50 through /1 rainbow for? Would you prefer we focus on a few characters with deep rainbow options, or spread it across many characters? This is YOUR collection — tell us what gets you excited.

`;

  // Insert before "The Scarcity System" section
  content = content.replace(
    "## The Scarcity System: Keeping Your Cards Valuable",
    rainbowSection + "## The Scarcity System: Keeping Your Cards Valuable"
  );

  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
    [content, id]
  );
  console.log(`Updated article: ${SLUG} (ID: ${id})`);

  const [verify] = await conn.execute(
    'SELECT LENGTH(contentMarkdown) as len FROM articles WHERE id = ?',
    [id]
  );
  console.log(`New content length: ${verify[0].len} characters`);

  await conn.end();
  console.log('Done!');
}

main().catch(console.error);
