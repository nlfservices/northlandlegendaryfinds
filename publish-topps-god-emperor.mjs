/**
 * Publish "God Emperor Topps" article — July 11, 2026
 * Angle: Topps as God Emperor Doom of the card world, Fleer/Upper Deck/Panini as fallen realms
 * Run from project root: node publish-topps-god-emperor.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (from manus-upload-file --webdev)
const IMAGES = {
  featured: "/manus-storage/topps-chrome-marvel-2026-box_897f9698.png",
  godEmperorDoom: "/manus-storage/god-emperor-doom-throne_55f28c69.jpg",
  sheriffStrange: "/manus-storage/sheriff-strange-doom_452dca54.jpg",
  fleer1994: "/manus-storage/fleer-marvel-1994_825d0352.jpg",
  paniniUnlicensed: "/manus-storage/panini-unlicensed-era_c219e40d.jpg",
};

const now = Date.now();

const articles = [
  {
    title: "God Emperor Topps: How One Company Conquered the Marvel Card Multiverse",
    slug: "god-emperor-topps-marvel-card-licensing-history",
    excerpt: "Just like Doom rebuilt Battleworld from the ashes of dead universes, Topps has unified the entire Marvel card landscape under one throne. Fleer, Upper Deck, Panini — all remnants of the old world.",
    featuredImageUrl: IMAGES.featured,
    category: "card_market",
    templateLayout: "timeline",
    tags: JSON.stringify(["Topps", "Marvel Cards", "Card Market", "Licensing", "Doctor Doom", "Secret Wars", "Fleer", "Upper Deck", "Panini", "2026 Topps Chrome Marvel", "Collecting"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Doctor Strange", "Wolverine", "Spider-Man", "Fantastic Four"]),
    cardMarketImpact: "The consolidation of Marvel card licensing under Topps/Fanatics means one company controls supply, rarity, and distribution — making their products the only officially licensed game in town. Older Fleer and Upper Deck sets may gain nostalgic value as relics of a dead era.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "How Topps became the God Emperor Doom of Marvel trading cards. The complete history of Fleer, Upper Deck, and Panini's fall — and why 2026 Topps Chrome Marvel is the crown jewel of a new era.",
    sources: JSON.stringify([
      { title: "Topps Expands Disney Deal to Include Marvel", url: "https://www.fanaticsinc.com/press-releases/topps-expands-existing-trading-card-deal-with-disney-consumer-products-to-include-global-disney-pixar-and-marvel-card-rights-continues-existing-global-star-wars-collaboration" },
      { title: "2026 Topps Chrome Marvel Comics Collector Guide", url: "https://ripped.topps.com/2026-topps-chrome-marvel-comics-collector-guide-cards/" },
      { title: "25 Years Later: The Hobby Dominoes of Marvel's Bankruptcy", url: "https://www.sportscollectorsdaily.com/25-years-later-the-hobby-dominoes-of-marvels-bankruptcy/" },
    ]),
    contentMarkdown: `In Jonathan Hickman's *Secret Wars*, Doctor Doom didn't just conquer the multiverse — he **rebuilt it**. When the incursions destroyed every universe, Doom stole the power of the Beyonders and forged Battleworld from the fragments. The old realities ceased to exist. There was only Doom's world now.

Sound familiar? Because that's exactly what happened to the Marvel trading card industry.

<img src="${IMAGES.godEmperorDoom}" alt="God Emperor Doom on his throne in Secret Wars" style="width:100%;max-width:600px;border-radius:8px;margin:1.5rem auto;display:block;" />

## The Old Multiverse: When Everyone Had a Piece

Before Battleworld, there were many universes. Before Topps, there were many card companies.

<img src="${IMAGES.fleer1994}" alt="1994 Fleer Marvel Universe trading cards pack" style="width:100%;max-width:400px;border-radius:8px;margin:1.5rem auto;display:block;" />

**Impel Marketing** fired the first shot in 1990 with Marvel Universe Series 1 — the set that launched a billion-dollar hobby. Then came **SkyBox** (which absorbed Impel), producing some of the most iconic Marvel sets of the early '90s. **Fleer** entered the arena with their own Marvel lines. And **Upper Deck** waited in the wings.

The '90s were the golden age. Multiple companies, multiple licenses, cards everywhere. It was the multiverse of Marvel cardboard — chaotic, beautiful, and ultimately unsustainable.

Then came the incursion.

## The Incursion: Marvel's Bankruptcy Destroys Everything

In 1996, Marvel filed for bankruptcy. The domino effect was catastrophic:

- Marvel had purchased **Fleer** for $265 million in 1992
- Fleer then acquired **SkyBox** for $150 million, creating Fleer/SkyBox International
- When Marvel collapsed, it dragged Fleer/SkyBox down with it
- The entire card division was gutted, restructured, and eventually sold off
- **Upper Deck** bought the Fleer name at auction in 2005 for just $6.1 million — a fraction of what Marvel originally paid

The old universes were dying. One by one, the card companies that defined the '90s either went bankrupt, got absorbed, or faded into irrelevance. Just like the incursions in Hickman's story — reality after reality winking out of existence.

## Sheriff Strange: Serving the Only One Who Could Save It

<img src="${IMAGES.sheriffStrange}" alt="Sheriff Strange serving Doctor Doom in Secret Wars" style="width:100%;max-width:500px;border-radius:8px;margin:1.5rem auto;display:block;" />

Here's where the parallel gets eerie.

In *Secret Wars*, Doctor Strange becomes **Sheriff Strange** — Doom's right-hand man, his enforcer, his voice of law across Battleworld. Strange doesn't serve Doom because he's weak. He serves Doom because he recognizes a hard truth: **Doom is the only one who could hold reality together.**

> "I serve as the right hand of Doom — his irrevocable voice — and the arbiter of this proceeding. Unless there is divine intervention, my judgment will be final. I am the law."

That's the hobby right now. After decades of chaos — companies rising and falling, licenses changing hands, quality inconsistency — the industry needed someone to hold it all together. Enter **Fanatics**, who acquired Topps in 2022 and proceeded to do what Doom did: **absorb everything.**

- MLB license? Topps. (Panini lost it July 2023)
- NBA license? Fanatics. (Panini lost it October 2025)
- NFL license? Fanatics. (Panini lost it March 2026)
- **Marvel, Pixar, Disney?** Topps. (Announced September 2024)

The hobby didn't choose Topps because they loved them. The hobby serves Topps because **they're the only ones left with the power to make it work.**

## Panini: The Unlicensed Rebels Nobody's Buying

<img src="${IMAGES.paniniUnlicensed}" alt="Panini enters the unlicensed era" style="width:100%;max-width:500px;border-radius:8px;margin:1.5rem auto;display:block;" />

And then there's Panini. Still making cards. Still printing product. But without logos. Without league branding. Without the thing that makes a card *official*.

It's like the rebels on Battleworld who refused to acknowledge Doom's rule — they exist, technically, but nobody's paying attention. Nobody's buying the unlicensed products. The market has spoken: if it doesn't have the official stamp, it doesn't have value.

Things change for good, bad, and the ugly... just like Sheriff Strange learned. You can fight the new reality, or you can accept that the old world is gone.

## The Crown Jewel: 2026 Topps Chrome Marvel Comics

So what does God Emperor Topps do with absolute power? They make **2026 Topps Chrome Marvel Comics** — and it's a statement piece.

Released July 1, 2026, this set is Topps flexing every muscle:

- **200-card base set** spanning the entire Marvel Comics universe
- **Clawed Chrome Variation** — Wolverine claw marks slashed across cards (because of course)
- **One World Under Doom** insert set — literally named after Doom's rule
- **Comic Excerpts** — actual page relics from Spider-Man comics dating back to 1967
- **Artist Originals** — 1/1 sketch cards by Kevin Eastman and Adi Granov
- **The One & Only** — Stan Lee and Steve Ditko cut signatures (1/1 die-cut cards)
- **Cordially Invited Autographs** — Kevin Feige, Aaron Judge, Seth Meyers, Steve Aoki
- **Fantastic Four 65th Anniversary** exclusive inserts (Mega Box only)

This isn't just a card set. It's a **coronation**. Topps is showing the hobby what happens when one company has the license, the artists, the budget, and the vision. No more splitting the pie. No more competing products diluting the market. One throne. One ruler.

## What This Means for Collectors

Here's the reality check for anyone building a Marvel card collection in 2026:

**The good:** Quality is up. When one company controls the license, they can invest more per product. Better artists, better technology, better inserts. The 2026 Chrome set proves it.

**The bad:** Competition is dead. No more choosing between Fleer's art style and Upper Deck's premium feel. You get what Topps gives you.

**The ugly:** Prices reflect monopoly power. With no alternative licensed product, Topps sets the market. Hobby boxes aren't getting cheaper.

But here's the thing — this is exactly what happened on Battleworld. Doom's rule was authoritarian, but it *worked*. The trains ran on time. Reality held together. And the people who thrived were the ones who understood the new rules early.

## Collector's Corner

The licensing landscape has fundamentally shifted. Topps Chrome Marvel is now the **only** officially licensed chrome Marvel card product on the market. That exclusivity drives value — both for the new sets and for the nostalgic relics of the old world.

**Hot Cards to Watch:**
- **2026 Topps Chrome Marvel "One World Under Doom" Insert** — The insert set literally named after Doom's reign. Symbolic and highly collectible.
- **1992 Marvel Masterpieces (Upper Deck reprint)** — Nostalgia for the old multiverse is real. Joe Jusko originals are climbing.
- **2026 Topps Chrome Marvel Kevin Eastman Artist Original 1/1** — TMNT creator drawing Marvel characters? Grail-tier.
- **1994 Fleer Marvel Universe Sealed Packs** — Sealed product from dead companies gains value as time capsules of the old world.

Track real-time prices on **[Card Ladder](https://www.cardladder.com/)** — their market indices show exactly how Topps Chrome is performing against historical sets.

Browse the full [NLF Card Database](https://northlandlegendaryfinds.com/cards) to see which Doom and Marvel cards are in our collection, and check **[PSA](https://www.psacard.com/)** population reports to understand how rare your graded cards really are.

Find sealed vintage Fleer and Upper Deck product on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** — these time capsules from the old multiverse aren't getting any more common.

*2026 Topps Chrome Marvel Comics is available now. The old world is gone. Long live God Emperor Topps.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  for (const article of articles) {
    try {
      await conn.execute(
        `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, templateLayout, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.title,
          article.slug,
          article.excerpt,
          article.contentMarkdown,
          article.featuredImageUrl,
          article.category,
          article.templateLayout,
          article.tags,
          article.cardMarketImpact,
          article.relatedCharacters,
          article.sources,
          article.isFeatured,
          article.isPublished,
          article.authorName,
          article.publishedAt,
          article.metaDescription,
        ]
      );
      console.log(`✅ Published: "${article.title}"`);
      console.log(`   Template: ${article.templateLayout}`);
    } catch (err) {
      console.error(`❌ Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Unfeatured previous featured articles
  const [featured] = await conn.execute(
    "SELECT id, title FROM articles WHERE isFeatured = 1 AND slug != ? ORDER BY publishedAt DESC",
    [articles[0].slug]
  );
  for (const f of featured) {
    await conn.execute("UPDATE articles SET isFeatured = 0 WHERE id = ?", [f.id]);
    console.log(`   Unfeatured: "${f.title}"`);
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, templateLayout, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 8"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] (${r.templateLayout}) ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
