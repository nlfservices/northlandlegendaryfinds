/**
 * Publish the Topps Marvel Repack community article
 */
import { getDb } from "../server/db";
import { articles } from "../drizzle/schema";

const article = {
  title: "We're Building Our First Topps Marvel Repacks — What Do YOU Want to Pull?",
  slug: "topps-marvel-repacks-community-input-what-collectors-want",
  excerpt: "NLF is launching our first modern Topps Marvel repack series and we want the community to help shape what goes in them. Autos? Doom cards? Numbered parallels? Tell us what you want to rip.",
  contentMarkdown: `# We're Building Our First Topps Marvel Repacks — What Do YOU Want to Pull?

This is it. We've been talking about it, planning it, and now it's happening — **Northland Legendary Finds is building our first official Topps Marvel repack series.**

And we're not doing this behind closed doors. We want YOU — the collectors, the rippers, the people who actually crack packs — to tell us what makes a repack worth buying.

---

## Why Topps Marvel?

We're starting with modern Topps Marvel products because that's where the heat is right now. Between Avengers: Doomsday hype, the X-Men resurgence, and Doctor Doom becoming the most talked-about villain in the MCU, Marvel cards are on fire.

Topps has been putting out some incredible products:
- **Topps Chrome Marvel** — refractors, autos, and some of the cleanest card designs in the hobby
- **Topps Finest Marvel** — premium feel with numbered parallels and sketch cards
- **Topps Marvel Collect** — digital crossover hits that bridge physical and digital collecting
- **Topps Stadium Club Marvel** — photography-style cards with a unique artistic approach

We're pulling from these product lines (and more) to build something collectors actually want to open.

---

## What We're Considering

Here's what's on the table for NLF Series #1. But we need your input on what matters most:

### 🔥 Autographs
Should every pack guarantee an auto? Or would you rather have a chance at a higher-end auto vs. guaranteed base-level signatures? We're talking:
- Actor autographs (MCU cast)
- Artist autographs (card illustrators)
- Creator autographs (writers, directors)

### 💎 Numbered Parallels
How deep do you want us to go?
- /99 parallels as a standard hit?
- /25 or /10 for premium packs?
- 1/1 chase cards?

### 🦹 Character Focus
Which characters NEED to be in the set?
- **Doctor Doom** — the hottest card in Marvel right now
- **Wolverine** — always a collector favorite
- **Spider-Man** — the OG
- **Scarlet Witch** — massive demand since Multiverse of Madness
- **Deadpool** — fan favorite with movie momentum

### 📦 Pack Structure
What format works best for you?
- Single premium pack (5-10 cards, guaranteed hits)
- Multi-pack box (20-30 cards, tiered hits)
- Mystery box (surprise count, surprise value)

---

## What Makes NLF Different

We're not just throwing random cards in a sleeve and calling it a repack. Here's our promise:

1. **Every card is hand-selected** — no junk filler, no damaged cards, no commons you'd throw in a box
2. **Full transparency** — we publish our checklists so you know exactly what's possible in every pack
3. **Community-driven** — this article exists because YOUR opinion matters more than ours
4. **Quality packaging** — professionally sealed by our packaging partners
5. **Fair value** — the card value in every pack will exceed what you pay. Period.

---

## Tell Us What You Want

This is your chance to shape what NLF Series #1 looks like. Drop your thoughts:

**Comment on our Facebook post or reach out directly:**
- What characters are must-haves?
- Autos or parallels — what matters more to you?
- What's your ideal price point for a premium Marvel repack?
- Any specific Topps products you want us to pull from?
- Would you rather have guaranteed hits or a chance at something massive?

We're reading every single comment and DM. This isn't a marketing gimmick — we genuinely want to build something the community is hyped to rip.

---

## What's Next

Once we've gathered enough feedback (give us a week or two), we'll publish a follow-up article with:
- The final NLF Series #1 checklist
- Pack structure and pricing
- Pre-order information
- Behind-the-scenes look at our card selection process

**This is YOUR repack. Help us build it right.**

---

*Have thoughts? Drop them in the comments on our Facebook page or DM us directly. Every suggestion gets read.*`,
  featuredImageUrl: "", // Will be updated after image generation
  category: "card_collectors" as const,
  tags: JSON.stringify(["Topps", "Marvel", "Repacks", "Doctor Doom", "Wolverine", "Spider-Man", "NLF Series 1", "Community"]),
  cardMarketImpact: "NLF launching first Topps Marvel repack series — community input phase. Expect demand for Doom, Wolverine, and Spider-Man cards to increase as collectors anticipate the product.",
  relatedCharacters: JSON.stringify(["Doctor Doom", "Wolverine", "Spider-Man", "Scarlet Witch", "Deadpool"]),
  sources: JSON.stringify([]),
  isFeatured: true,
  isPublished: true,
  authorName: "NLF Team",
  publishedAt: Date.now(),
  metaDescription: "NLF is building our first Topps Marvel repack series and we want collector input. Tell us what characters, autos, parallels, and pack formats you want to see in NLF Series #1.",
  templateLayout: "magazine" as const, // Next in rotation after classic
};

async function main() {
  const db = await getDb();
  
  // Clear other featured articles
  const { eq } = await import("drizzle-orm");
  await db.update(articles).set({ isFeatured: false }).where(eq(articles.isFeatured, true));
  
  // Insert the article
  const [result] = await db.insert(articles).values(article);
  console.log("✅ Article published! ID:", result.insertId);
  console.log(`URL: https://northlandlegendaryfinds.com/mcu-news/${article.slug}`);
  process.exit(0);
}

main();
