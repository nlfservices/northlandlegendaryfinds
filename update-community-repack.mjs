/**
 * Update community repack article with scarcity system, live-only exclusivity, and pre-auction sales
 * Run from project root: node update-community-repack.mjs
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

  // Fetch current article
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

  // Insert new sections before "What This Means for the NLF Community"
  const newSections = `## The Scarcity System: Keeping Your Cards Valuable

Here's something we've been thinking about a lot, and we want to be transparent about it: **how do we keep the cards in our repacks valuable after you buy them?**

The answer is controlled allocation.

Let's say we have a Wolverine Chrome Refractor numbered /10 — meaning only 10 exist in the world. And let's say NLF owns 3 of those 10. We're NOT going to dump all 3 into the same repack series. That would flood the market and tank the value for everyone who pulls one.

Instead, here's our approach: **limited cards get spread across series.** If we have 3 copies of a /10 card, we might put one in Series 1, skip Series 2 entirely, and put the next one in Series 3. Every other series. Maybe even every third series depending on the card.

**Why does this matter to you?**
- The card you pull maintains its value because the market isn't flooded
- Each series feels genuinely scarce — you know that /10 parallel might not appear again for months
- Collectors who buy early don't get burned by the same card showing up in every single release
- It creates real urgency: if a /10 Doom card is in THIS series, it might not come back for 2-3 drops

This isn't about being stingy. It's about respecting the cards and respecting the collectors who invest in them. We want you to pull a numbered parallel and KNOW it's going to hold value — because we're not about to undercut you by releasing the same card next week.

**What do you think about this approach?** Would you rather we load up each series with every rare card we have, or do you prefer the controlled scarcity model where each drop feels special?

## Live Stream Exclusive: You Have to Show Up

Here's the big one: **our custom sets and premium repacks will ONLY be available through live streams.**

No website "Add to Cart" button. No pre-orders sitting in a queue. No bots scooping up inventory at 3am. If you want the exclusive NLF sets — the Doctor Doom Collection, the Gambit Deck, the team packs — you have to be in the Whatnot stream when they drop.

**Why live-only?**
- It rewards the community members who actually show up and engage
- It creates a real event atmosphere — everyone's watching, chatting, and competing for the same cards
- It eliminates reseller bots and automated purchasing
- It makes every stream feel like something you don't want to miss
- The energy of a live audience when a /10 parallel gets pulled? You can't replicate that with a checkout page

**Pre-Auction Access** — For collectors who join the stream early, we're considering pre-auction sales. Before the main auction starts, early birds get first crack at select items at set prices. Think of it like a VIP early access window. Show up 15 minutes before the stream officially kicks off, and you might snag something before it ever hits the auction block.

This could include:
- **Fixed-price graded slabs** — First come, first served for stream regulars
- **Bundle deals** — Complete insert sets or team lots at a set price before individual cards go to auction
- **Loyalty rewards** — Returning stream viewers get priority access to limited items

The live-only model means our community IS the market. No outside interference. No algorithms deciding who sees what. Just collectors, cards, and the thrill of the chase — live and in real time.

**Would you show up for live-exclusive drops?** Does the pre-auction concept excite you, or would you prefer everything goes straight to auction? Let us know.

`;

  content = content.replace(
    "## What This Means for the NLF Community",
    newSections + "## What This Means for the NLF Community"
  );

  // Update the article
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
    [content, id]
  );
  console.log(`Updated article: ${SLUG} (ID: ${id})`);

  // Verify
  const [verify] = await conn.execute(
    'SELECT LENGTH(contentMarkdown) as len FROM articles WHERE id = ?',
    [id]
  );
  console.log(`New content length: ${verify[0].len} characters`);

  await conn.end();
  console.log('Done!');
}

main().catch(console.error);
