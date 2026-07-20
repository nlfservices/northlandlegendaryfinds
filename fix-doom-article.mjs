import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// First, let's find the article
const [articles] = await conn.execute(
  `SELECT id, title, slug, contentMarkdown FROM articles WHERE slug = ?`,
  ['doctor-doom-sdcc-exclusive-750-card-2025-topps-marvel-mint']
);

if (articles.length === 0) {
  console.log('Article not found!');
  await conn.end();
  process.exit(1);
}

const article = articles[0];
console.log('Found article:', article.title);
console.log('Slug:', article.slug);

// New title - remove $750
const newTitle = "Doctor Doom's SDCC Exclusive: The Card That's About to Go Parabolic";

// New slug
const newSlug = "doctor-doom-sdcc-exclusive-card-about-to-go-parabolic-2025-topps-marvel-mint";

// Rewrite the content - remove all prices and numbers, replace with hype language
const newContent = `## The SDCC-Only Doctor Doom Chrome Card

In July 2025, Topps released something unprecedented at San Diego Comic-Con: a limited-edition Doctor Doom Chrome card available **only** in Marvel Mint boxes sold at the convention. You couldn't buy it online. You couldn't find it at your local card shop. You had to be there.

Fast forward to today — the Doomsday trailer just dropped, RDJ is confirmed as Doom, and these cards are about to go absolutely **parabolic**.

## Why This Card Is Different

The 2025 Topps Marvel Mint SDCC Exclusive Doctor Doom isn't just rare — it's historically significant:

- **Convention exclusive** — only available in boxes sold at SDCC 2025
- **Chrome finish** with Black Lava Refractor and Green Lava Refractor parallels
- **Superfractor 1/1** exists somewhere out there
- **One of the only modern Doom cards** in a premium chrome set
- **The movie connection** — Avengers: Doomsday (December 18, 2026) features RDJ as Doctor Doom

This isn't speculation anymore. The trailer confirmed everything. Every collector who grabbed these boxes at SDCC last year is sitting on something special.

## The Reddit Effect

Someone recently listed their SDCC Doom exclusive on Reddit — and the comments went wild. Collectors who passed on boxes last year are kicking themselves. People who bought multiple boxes are holding tight.

The demand is real. The supply is fixed forever. And the movie hasn't even come out yet.

## Why Prices Are About to Explode

Here's what's happening simultaneously:

1. **The Doomsday trailer just dropped** — confirming RDJ as Doom and generating massive hype
2. **SDCC 2026 is THIS WEEK** — Topps is releasing the 2026 Marvel Mint (Spider-Man themed), reminding everyone about last year's Doom exclusive
3. **No reprint possible** — these were convention exclusives, period
4. **The movie releases December 18, 2026** — five months of building anticipation ahead

Every single catalyst is lining up at once. The cards that were already hard to find are about to become nearly impossible.

## The Parallel Breakdown

The SDCC Doom Chrome card comes in several tiers of rarity:

| Parallel | Rarity | Status |
|----------|--------|--------|
| Base Chrome | SDCC boxes only | Scarce |
| Black Lava Refractor | Extremely limited | Almost gone from market |
| Green Lava Refractor | Ultra rare | Barely surfaces |
| Superfractor | 1/1 | Unknown location |

Each tier represents a different level of collector commitment. But even the base chrome version is becoming difficult to source.

## What This Means for Collectors

If you have one — hold it. The movie hasn't released yet. SDCC hasn't even started. Every week between now and December 18 is another catalyst.

If you're looking for one — move fast. The trailer just put a spotlight on every Doctor Doom card in existence, and this is the rarest modern one available.

The 2025 Topps Marvel Mint SDCC Exclusive Doctor Doom Chrome card isn't just a collectible. It's a piece of MCU history that was minted before the world knew what was coming.

And now everyone knows.

## The 2026 Connection

History is literally repeating itself. Topps just announced the 2026 Marvel Mint will be available at SDCC this week — Spider-Man themed this time. Last year it was Doom. The pattern is set.

Collectors who missed the Doom exclusive last year have a second chance at a different character. But the Doom? That window closed in July 2025. Forever.`;

// Update the article
await conn.execute(
  `UPDATE articles SET title = ?, slug = ?, contentMarkdown = ? WHERE id = ?`,
  [newTitle, newSlug, newContent, article.id]
);

console.log('✅ Article updated successfully!');
console.log('New title:', newTitle);
console.log('New slug:', newSlug);

await conn.end();
