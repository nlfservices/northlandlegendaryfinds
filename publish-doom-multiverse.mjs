/**
 * Publish Doctor Doom Multiverse Collapse Article — May 2026
 * Run from project root: node publish-doom-multiverse.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  article1: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-multiverse-collapse-WTFxK3BnCQtTZsYiPS2SsG.webp",
};

const now = Date.now();

const articles = [
  {
    title: "How Doctor Doom Accidentally Destroyed the Multiverse — The Secret Wars Lore Behind Avengers: Doomsday",
    slug: "doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday",
    excerpt: "Doctor Doom didn't set out to destroy the multiverse — he was trying to save it. Understanding the closed time loop that defines Doom's greatest story is essential for collectors preparing for Avengers: Doomsday.",
    featuredImageUrl: IMAGES.article1,
    category: "analysis",
    tags: JSON.stringify(["Doctor Doom", "Secret Wars", "Avengers Doomsday", "Multiverse", "Marvel Mint", "Comic Book Heroes", "Beyonders", "Molecule Man"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Doctor Strange", "Molecule Man", "Reed Richards", "Black Panther"]),
    cardMarketImpact: "Doctor Doom cards are surging as collectors realize the MCU is adapting this exact storyline. Platinum tier Doom (#107) and Comic Book Heroes Doom cards are seeing 30-50% price increases.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Doctor Doom accidentally destroyed the multiverse trying to save it from the Beyonders. Learn the Secret Wars lore behind Avengers: Doomsday and which Marvel Mint and Comic Book Heroes cards to collect.",
    sources: JSON.stringify([
      { title: "Secret Wars Lore Breakdown (YouTube)", url: "https://youtu.be/mx3uWcjGR2o" },
      { title: "Rise of Doom - Card #56", url: "https://riseofdoom.com/cards/56" },
      { title: "Topps Marvel Mint", url: "https://mintcomiccards.com/" },
      { title: "Topps Comic Book Heroes", url: "https://comicbookcard.com/" },
    ]),
    contentMarkdown: `The most common misconception about Doctor Doom in Jonathan Hickman's legendary *Avengers* and *New Avengers* run is that he intentionally destroyed the multiverse. The truth is far more tragic, far more complex, and far more relevant to what the MCU is building toward with *Avengers: Doomsday*. Understanding this storyline is not just essential for Marvel fans — it is critical for collectors who want to position themselves ahead of what may be the biggest card market catalyst since *Avengers: Endgame*.

## The Closed Time Loop: Doom's Paradox

Here is the core revelation that changes everything about how we understand Doctor Doom's role in the multiverse collapse: **his actions form a closed time loop**. Doom discovered that universes were colliding — events known as "incursions" — and traveled back in time to stop the entities responsible. In doing so, he inadvertently *caused* the very incursions he set out to investigate.

This is not a story about a villain destroying everything for power. This is a story about a man who believed he was the only one smart enough and ruthless enough to save reality — and whose methods created the catastrophe he was trying to prevent.

## The Beyonders and the Molecule Man Bombs

The true villains of this saga are **the Beyonders** — cosmic entities who exist outside the multiverse and treat all of existence as a grand experiment. Their plan was elegant in its horror: they placed a "bomb" in every single universe in the form of **Molecule Man (Owen Reece)**. Every version of Owen Reece across the infinite multiverse was designed to detonate simultaneously, destroying all of reality in a single instant.

When Doom discovered this plan, he did what Doom always does — he took matters into his own hands. Alongside the original Molecule Man, Doom traveled across the multiverse killing alternate versions of Owen Reece, defusing the bombs one by one. Each time they killed a Molecule Man, that universe was destroyed — but it was destroyed *early*, before the Beyonders' synchronized detonation could occur.

## How Saving the Multiverse Destroyed It

Here is where the tragedy becomes a paradox. Every universe Doom destroyed by killing its Molecule Man caused the remaining multiverse to *contract*. As the total number of universes shrank, the surviving ones were pulled closer together. When universes get too close, they collide — and those collisions are the incursions.

**Doom traveled back in time to stop the incursions. His method of stopping the Beyonders created the incursions.** The loop is closed. There is no beginning and no end — only Doom, trapped in a cycle of his own making, convinced that his way is the only way.

## The Final Miscalculation and Battleworld

When Doom finally confronted the Beyonders directly — accompanied by Doctor Strange and Molecule Man — he used the countless Molecule Men he had collected as a weapon. The resulting explosion destroyed the Beyonders, but Doom miscalculated the force. The blast reduced the remaining multiverse from hundreds of thousands of universes to fewer than two dozen in an instant.

With reality crumbling around him, Doom did the only thing left: he salvaged fragments of the dying universes and stitched them together into **Battleworld** — a patchwork planet where he ruled as God Emperor Doom. This is the setting of the 2015 *Secret Wars* event, and it is almost certainly the endgame of the MCU's Multiverse Saga.

## Why This Matters for Avengers: Doomsday

The MCU has been laying the groundwork for this exact storyline:

- **Incursions** were introduced in *Doctor Strange in the Multiverse of Madness* and expanded in *Loki*
- **Robert Downey Jr. as Doctor Doom** was announced at SDCC 2024, confirming Doom as the central figure
- **The Beyonders** are rumored to be the ultimate threat behind the scenes
- **Battleworld** is the expected setting for *Avengers: Secret Wars* (December 2027)

The moral complexity of Doom — a villain who genuinely believes he is saving reality — is exactly what makes this character so compelling and why RDJ was cast in the role. This is not a simple "bad guy wants to conquer the world" story. This is a man who destroyed everything trying to save it.

## The Card Market Connection

Understanding this lore gives collectors a massive advantage. The characters central to this storyline are the ones whose cards will see the biggest spikes as the MCU reveals more details:

**Doctor Doom** is the obvious centerpiece. In [2025 Topps Marvel Mint](https://mintcomiccards.com/cards/107), Doom sits at **card #107 in the Platinum tier** — meaning only 320 total numbered cards exist across all parallels (Encased /25, Silver Foil /99, Gold Foil /50, Black Foil /10, Red Foil /5, Foilfractor /1, B&Y Electric Dots /10, Black Chrome /10, Red Chrome /5, Chrome Superfractor /1, plus 4 Printing Plates). In [Topps Comic Book Heroes](https://comicbookcard.com/card/4), Doom appears on **three separate cards** (#4, #35, #115) — giving collectors multiple entry points.

The [Rise of Doom card #56](https://riseofdoom.com/cards/56) — a 1/1 Comic Cut showing **God Emperor Doom killing Thanos** from Secret Wars #8 — is the ultimate representation of where this storyline ends. That single card captures the moment Doom stood atop Battleworld as a god.

**Doctor Strange** ([Marvel Mint #110](https://mintcomiccards.com/cards/110), Platinum tier) accompanied Doom in the final battle against the Beyonders. His role in Doomsday is confirmed, and his 320 numbered cards are increasingly scarce.

**Reed Richards / Mister Fantastic** ([Marvel Mint #106](https://mintcomiccards.com/cards/106), Platinum tier) is Doom's eternal rival and the one who ultimately defeats God Emperor Doom in the comics. With Pedro Pascal cast as Reed in the MCU, these cards are heating up fast.

## Total Numbered Card Breakdown

For the key characters in this storyline, here is what exists in the entire 2025 Topps Marvel Mint set:

| Character | Card # | Tier | Total Numbered Cards |
|-----------|--------|------|---------------------|
| Doctor Doom | #107 | Platinum | 320 |
| Doctor Strange | #110 | Platinum | 320 |
| Mister Fantastic | #106 | Platinum | 320 |
| Black Panther | #120 | Platinum | 320 |

Across the entire Marvel Mint set, there are only **20,100 total foil cards** and **8,625 total encased cards**. For Platinum characters specifically, the scarcity is extreme — and these are the characters at the center of the Doomsday storyline.

On [eBay](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+doctor+doom), you can still find affordable Doctor Doom base cards and lower-tier parallels. The window for budget entry is closing as more collectors connect the dots between this lore and the upcoming film.

## Collector's Corner

The Secret Wars storyline is the single most important piece of source material for understanding where the MCU is headed. Collectors who understand the lore have a significant edge in identifying which characters and cards will spike next. Doctor Doom is not just a villain in Doomsday — he is the architect of everything, and his cards reflect that importance.

**Hot Cards to Watch:**
- **Doctor Doom Platinum #107 (Marvel Mint)** — Only 320 numbered cards exist for the central character of Doomsday and Secret Wars
- **Rise of Doom Comic Cut #56 (God Emperor Doom Kills Thanos)** — The 1/1 that captures the climax of this entire storyline
- **Doctor Strange Platinum #110 (Marvel Mint)** — Strange accompanies Doom against the Beyonders; his role in Doomsday is confirmed
- **Doctor Doom #4, #35, #115 (Comic Book Heroes)** — Three separate cards across different eras, all with 13 parallel tiers each

Check the latest prices on **[Card Ladder](https://www.cardladder.com)**, **[eBay](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+doctor+doom)**, and **[Whatnot](https://www.whatnot.com)** — the market is moving fast as Doomsday hype builds toward the December 2026 release.

*Avengers: Doomsday arrives December 18, 2026. The lore is set. The cards are limited. The time to build your collection is now.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  for (const article of articles) {
    try {
      await conn.execute(
        `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.title,
          article.slug,
          article.excerpt,
          article.contentMarkdown,
          article.featuredImageUrl,
          article.category,
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
    } catch (err) {
      console.error(`❌ Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, slug, publishedAt FROM articles ORDER BY publishedAt DESC LIMIT 5"
  );
  console.log("\\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: ${r.title} (/mcu-news/${r.slug})`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
