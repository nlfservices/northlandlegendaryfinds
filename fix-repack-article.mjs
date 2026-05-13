import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const ARTICLE_ID = 1140008;

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get current content
  const [rows] = await conn.execute(
    'SELECT contentMarkdown FROM articles WHERE id = ?',
    [ARTICLE_ID]
  );
  
  let content = rows[0].contentMarkdown;
  console.log('Original content length:', content.length);
  
  // Fix 1: Rewrite the "Complete Sets: Why Not?" section
  // Replace the old complete sets intro
  content = content.replace(
    `This is the idea that keeps us up at night. What if instead of just random cards, we offered **complete encased sets**?\n\nPicture this: **A complete Topps Comic Book Heroes base set — all 120 cards — sleeved, organized, and encased in a premium display.** No hunting. No trading. No "I'm missing card #47 and it's driving me insane." Just the complete set, ready to display or store.\n\nWe could do this across multiple sets:\n\n**Topps Comic Book Heroes (2024)** — 120 cards of classic comic art. The set that started the modern Marvel card renaissance. Every card sleeved and numbered in order, encased in a premium holder. Imagine having this on your shelf.\n\n**Topps Marvel Mint (2025)** — The coin and medallion insert set that's been turning heads. A complete base run would be something special.\n\n**Topps Chrome Marvel (2024)** — The flagship chrome set with that iconic refractor finish. A complete base set of these is genuinely beautiful.\n\nThe question is: **Would you pay a premium for a guaranteed complete set?** Or do you prefer the hunt — buying packs and trading your way to completion? There's no wrong answer here. Some collectors live for the chase. Others just want the set done and done right.`,
    `This is the idea that keeps us up at night. What if instead of just random cards, we offered **complete numbered parallel sets**?

Let's be clear about something: **when we say "sets" in NLF repacks, we mean NUMBERED cards. Never base cards. Never refractors.** If it's going into one of our curated sets, it's got a number on it — /99, /50, /25, /10, /5, or /1. That's the standard. Period.

Picture this: **A complete numbered run of a single character across every parallel tier — all sleeved, organized, and encased in a premium display.** Not 120 base cards anyone can pull from a hobby box. We're talking the cards that MATTER. The ones with print runs. The ones that hold value.

Here's what complete numbered sets could look like:

**Character Numbered Run** — Every numbered parallel of Doctor Doom from a single set. The /99, the /50, the /25, the /10, the /5 — all encased together. Imagine owning the complete Doom numbered rainbow from Topps Chrome Marvel, displayed in one premium holder. That's a centerpiece collection.

**Topps Marvel Mint Numbered Parallels (2025)** — Not the base coins everyone has. The NUMBERED versions — /75, /50, /25, /10, /5, /1. A complete numbered parallel set of your favorite character's Mint coin cards. These are the ones people are hunting.

**Topps Chrome Marvel Numbered Set (2024)** — Forget the base chrome and the standard refractors. We're talking the numbered Gold (/50), Green (/99), Orange (/25), Red (/5), and Superfractor (/1) parallels. A complete numbered chrome parallel run of a top character, encased and ready to display.

**Insert Set Numbered Runs** — Complete numbered parallel runs of specific insert sets. Every /99 from the Topps Finest "Firsts" insert? Every /50 from the Chrome "Cosmic" subset? These are the sets that collectors actually flex.

The question is: **Would you pay a premium for a guaranteed complete numbered set?** Or do you prefer the hunt — chasing each numbered parallel individually across streams and drops? There's no wrong answer here. Some collectors live for the chase. Others just want the numbered run complete and done right.`
  );
  
  // Fix 2: Fix the budget tier to remove "base card bundles"
  content = content.replace(
    `**Budget Tier ($15-$30)** — Starter packs, team lots, base card bundles. Great for kids, new collectors, or anyone who just wants to add some Marvel to their collection without overthinking it. No graded cards at this level, but solid card counts and guaranteed inserts.`,
    `**Budget Tier ($15-$30)** — Starter packs, team lots, and curated character bundles. Great for kids, new collectors, or anyone who just wants to add some Marvel to their collection without overthinking it. No graded cards at this level, but solid card counts, guaranteed inserts, and quality cards throughout. Even at budget level, you're getting cards worth having.`
  );
  
  // Fix 3: In the scarcity section, the example mentions "Chrome Refractor" which is fine as an example
  // but let's make sure it's clear these are numbered cards
  content = content.replace(
    `Let's say we have a Wolverine Chrome Refractor numbered /10 — meaning only 10 exist in the world.`,
    `Let's say we have a Wolverine Chrome numbered /10 — meaning only 10 exist in the world.`
  );
  
  // Update the article
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
    [content, ARTICLE_ID]
  );
  
  console.log('Updated content length:', content.length);
  console.log('Article updated successfully!');
  
  // Also update the excerpt to reflect the numbered-only focus
  await conn.execute(
    `UPDATE articles SET excerpt = ? WHERE id = ?`,
    [
      "We're asking the NLF community to help shape our next generation of Marvel repacks. From 100-card starter packs to complete numbered parallel sets, team lots to exclusive Doctor Doom inserts — tell us what you want. One rule: sets mean NUMBERED cards only. Never base. Never refractors.",
      ARTICLE_ID
    ]
  );
  
  console.log('Excerpt updated!');
  await conn.end();
}

main().catch(e => { console.error(e); process.exit(1); });
