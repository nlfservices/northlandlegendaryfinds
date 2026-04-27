/**
 * Publish Avengers: Endgame 7th Anniversary Article — April 27, 2026
 * Run from project root: node publish-endgame-anniversary.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (from webdev asset generation)
const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/endgame-anniversary-featured-cDDDJS8BQEZoAPpPTZq5BL.webp",
  snapMoment: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/endgame-anniversary-snap-moment-NmWNmykSr9ELsbYXcWv9LA.webp",
  cardDisplay: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/endgame-anniversary-card-display-ga7agsQh4YkyPcqhjbaECA.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Avengers: Endgame Turns 7 — And It's Coming Back to Theaters with New Footage",
    slug: "avengers-endgame-7th-anniversary-re-release-september-2026",
    excerpt: "Seven years after shattering every box office record, Avengers: Endgame returns to theaters on September 25 with brand-new footage bridging directly into Avengers: Doomsday. Here's what collectors need to know.",
    featuredImageUrl: IMAGES.featured,
    category: "movie_news",
    tags: JSON.stringify(["Avengers Endgame", "MCU Anniversary", "Endgame Re-Release", "Avengers Doomsday", "Thanos", "Iron Man", "Infinity Gauntlet", "Marvel Studios", "Topps Marvel Mint", "Topps Marvel Studios Chrome", "Trading Cards"]),
    relatedCharacters: JSON.stringify(["Thanos", "Iron Man", "Captain America", "Thor", "Black Widow", "Hulk", "Doctor Doom", "Hawkeye", "Nebula", "Captain Marvel"]),
    cardMarketImpact: "The Endgame re-release and Doomsday connection are driving renewed interest in Thanos and Iron Man cards. Thanos #100 from 2025 Topps Marvel Studios — the final base card in the entire set — is positioned as a key chase card heading into September.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Avengers: Endgame turns 7 today and returns to theaters September 25, 2026 with new footage bridging to Doomsday. Plus: Thanos cards from 2025 Topps Marvel Mint and Marvel Studios to watch.",
    sources: JSON.stringify([
      { title: "Variety — Endgame Re-Release Will Include Brand New Footage", url: "https://variety.com/2026/film/news/avengers-endgame-theatrical-re-release-new-footage-1236724224/" },
      { title: "Deadline — Joe Russo Teases Endgame Re-Release at Sands", url: "https://deadline.com/2026/04/joe-russo-avengers-endgame-doomsday-sands-1236865209/" },
    ]),
    contentMarkdown: `Seven years ago today — April 26, 2019 — Avengers: Endgame opened in theaters and changed everything. It shattered the record for the biggest global opening weekend with $1.2 billion, went on to gross $2.799 billion worldwide, and for a brief, electric moment held the title of highest-grossing film of all time. More than a movie, Endgame was a cultural event — the culmination of 22 interconnected films spanning over a decade of storytelling that had never been attempted at that scale.

Now, seven years later, the Infinity Saga's final chapter is coming back. And this time, it's bringing something new.

## September 25: Endgame Returns with New Footage

Marvel Studios officially announced that Avengers: Endgame will return to theaters on **September 25, 2026** — exactly three months before Avengers: Doomsday hits screens on December 18. But this isn't a standard anniversary re-release. During Disney's CinemaCon presentation on April 16, directors Joe and Anthony Russo revealed that the re-release will include **brand-new footage** added to the already three-hour film.

<img src="${IMAGES.snapMoment}" alt="The iconic Infinity Gauntlet snap moment from Avengers Endgame" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

At the Sands Film Festival in Scotland on April 19, Joe Russo went further, explaining exactly what audiences can expect. "We'll be re-releasing the film with footage that is set in the Doomsday story that we have added to Avengers: Endgame," Russo told a packed crowd. He described the re-release as a **"critical companion story"** and a direct **"setup for what you're gonna watch in December when you see Avengers: Doomsday."**

The implication is significant: Endgame's re-release won't just be a nostalgia trip. It will function as a narrative bridge, connecting the end of the Infinity Saga to the beginning of whatever comes next with Doctor Doom.

## Infinity Vision: A New Premium Format

Both Endgame and Doomsday will be presented in **"Infinity Vision"** — a brand-new certification for premium large format theaters. Disney describes it as delivering "the biggest, brightest and most immersive cinematic experiences," with more than 75 domestic and 300 global premium screens meeting the technical standards for laser projection, maximum screen size, and premium audio formats.

The name itself — evoking both the Infinity Stones and the synthezoid hero Vision — feels intentional. Whether it becomes a lasting brand or a one-time marketing push, it signals that Disney is treating the Endgame re-release and Doomsday as prestige theatrical events, not just standard blockbuster rollouts.

## The Doomsday Connection: From Hero to Villain

The bridge between Endgame and Doomsday centers on one actor: **Robert Downey Jr.** His Tony Stark made the ultimate sacrifice in Endgame, snapping the Infinity Gauntlet to defeat Thanos and save the universe. Now, in a multiverse twist, Downey returns as **Doctor Doom** — the ultimate villain.

Joe Russo revealed that Downey "started contemplating his return about 2 to 2.5 years ago," and that the concept was straightforward: "He played the ultimate hero, and now he's going to play the ultimate villain." The Russos locked the story structure with longtime Marvel screenwriter Stephen McFeely, and the result is what Russo calls **"serialized storytelling"** inspired by the comics themselves.

For collectors, this narrative arc — from Iron Man's snap to Doom's rise — creates a direct through-line that makes both Endgame-era and Doomsday-era cards part of the same story.

## By the Numbers: Endgame's Record-Breaking Legacy

Avengers: Endgame didn't just succeed — it rewrote the record books. Here's where it still stands seven years later:

- **$2.799 billion** worldwide gross (second all-time behind Avatar's $2.924 billion)
- **$1.2 billion** global opening weekend (still the all-time record)
- **$1.94 billion** international gross (second-highest MPA film ever)
- **$858 million** domestic gross (fifth all-time)
- **22 films** of interconnected storytelling culminating in one three-hour finale

The film's cultural impact extended far beyond box office numbers. "I Love You 3000" became a global phrase. The portals scene became the gold standard for cinematic payoff moments. And Tony Stark's sacrifice became the emotional anchor of an entire generation's moviegoing experience.

## Thanos Cards: The Endgame Villain in 2025 Topps

For collectors, the Endgame anniversary puts a spotlight on one of Marvel's most iconic villains — and 2025 Topps has given Thanos some of the most collectible cards in recent memory across two major sets.

<img src="${IMAGES.cardDisplay}" alt="Premium holographic Marvel trading cards display" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

In **2025 Topps Marvel Mint**, Thanos appears as card **#77** in the Gold tier of the base set, with parallels running from base through /75, /50, /25, /10, /5, and the coveted /1 one-of-one. He also shows up as the **Hearts 8** in the Gambit's Deck Double Sided Chrome Playing Cards insert — a unique chrome playing card format that's become one of the set's most talked-about features.

In **2025 Topps Marvel Studios Chrome**, Thanos holds a symbolically perfect position: **card #100** — the very last base card in the entire set. Labeled "Thanos Avengers: Endgame Phase Three," it's the capstone of the entire MCU base set journey from Iron Man #1 through the final Phase Three villain. The parallel lineup is deep: /199, /150, /99, /80, /76, /75, /50, /49, /25, and /1. There's also the **S-100 Snap Variation**, which reimagines the card with the set's signature Snap aesthetic — a fitting parallel for the character who started it all with a snap of his fingers.

And don't overlook the Iron Man bookends. In Marvel Studios Chrome, **Iron Man #1** is the very first card in the set, while Thanos #100 is the last. That symmetry — hero to villain, beginning to end — mirrors the Endgame story itself. The **R-5 Reflections insert** pairs Iron Man with Doctor Doom, foreshadowing the Doomsday narrative. And the **AS-5 Avengers Shadowbox** insert features Iron Man in the original Avengers lineup.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to explore every Thanos and Iron Man card across the 2025 Topps sets, or visit the [Characters section](https://northlandlegendaryfinds.com/characters) for full character profiles.

## What This Means for Collectors

The September re-release creates a clear catalyst window for Endgame-adjacent cards. When casual fans return to theaters and see new Doomsday footage spliced into Endgame, interest in both Thanos and Iron Man cards will spike — particularly the numbered parallels and insert cards that carry the most scarcity.

The Thanos #100 from Marvel Studios Chrome is especially well-positioned. As the literal final card in the base set, it carries symbolic weight that goes beyond just being a Thanos card — it represents the end of an era. Low-numbered parallels (/25 and below) of this card could see significant movement as September approaches.

For Iron Man collectors, the R-5 Reflections insert (Iron Man and Doctor Doom) is the card to watch. It directly connects the Endgame legacy to the Doomsday future, making it a narrative bridge card that mirrors what the re-release itself is doing on screen.

Check out our [MCU Spotlight](https://northlandlegendaryfinds.com/mcu-spotlight) for deeper dives into how the MCU timeline connects to the card market, and join our [Whatnot streams](https://northlandlegendaryfinds.com/whatnot) where we regularly break 2025 Topps Marvel products live.

## Collector's Corner

The Endgame anniversary and September re-release announcement have put Thanos and Iron Man cards squarely in the spotlight. With new Doomsday footage being added to the film, expect renewed demand for cards that connect these two eras of the MCU.

**Hot Cards to Watch:**
- **Thanos #100 2025 Topps Marvel Studios Chrome Base** — The last card in the entire set, labeled "Avengers: Endgame Phase Three." Low-numbered parallels (/25, /10, /5) are the ones to chase before September.
- **Thanos #77 2025 Topps Marvel Mint Gold** — The Mad Titan's Gold tier base card with parallels down to /1. Chrome finish makes the numbered versions pop.
- **Thanos S-100 2025 Topps Marvel Studios Chrome Snap Variation** — The Snap aesthetic on the Endgame capstone card. Thematic perfection for Endgame collectors.
- **Iron Man R-5 2025 Topps Marvel Studios Chrome Reflections** — Iron Man paired with Doctor Doom. This insert bridges Endgame to Doomsday and could be the sleeper hit of the year.

Track Thanos and Iron Man card values on **[Card Ladder](https://www.cardladder.com/)** — their market indices show real-time price movement heading into the re-release window. For graded copies, check population reports on **[CGC](https://www.cgccomics.com/)** to gauge scarcity. And for live deals on 2025 Topps Marvel products, browse the latest auctions on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)**.

*Avengers: Endgame returns to theaters September 25, 2026 in Infinity Vision format, with Avengers: Doomsday following on December 18, 2026.*`,
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
    "SELECT id, title, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 10"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
