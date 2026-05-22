/**
 * Publish Pedro Pascal Article — "This Is The Way... To The Baxter Building"
 * Run from project root: node publish-pedro-pascal.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (from webdev static assets)
const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/pedro-pascal-dual-roles-featured-QQhkBCmkmtrVBMK2WUv9hq.webp",
  fantasticar: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fantasticar-baxter-building-GpvjBWjXqtAbzoHW2sJQ9p.webp",
  razorCrest: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/razor-crest-space-auyrKk2HJ2yQhpSKuw4jdx.webp",
  doomThrone: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doctor-doom-throne-doomsday-CLDh7PRvLuoe4MiKb2b6n3.webp",
  cardsCollection: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/pedro-pascal-cards-collection-Wk8eiwfcVtW8Q99rkSVhLP.webp",
};

const now = Date.now();

const articles = [
  {
    title: "This Is The Way... To The Baxter Building: Pedro Pascal's Journey From Mando to Reed Richards",
    slug: "pedro-pascal-mandalorian-reed-richards-fantastic-four-doomsday",
    excerpt: "Pedro Pascal is the only actor simultaneously headlining both Star Wars and Marvel franchises. With The Mandalorian & Grogu hitting theaters today and Avengers: Doomsday filming wrapped, here's why his cards are the hottest chase in collecting.",
    featuredImageUrl: IMAGES.featured,
    category: "movie_news",
    tags: JSON.stringify(["Pedro Pascal", "Mandalorian", "Reed Richards", "Fantastic Four", "Avengers Doomsday", "Doctor Doom", "Star Wars", "Trading Cards", "Grogu", "MCU"]),
    relatedCharacters: JSON.stringify(["Reed Richards", "Doctor Doom", "Mister Fantastic", "Galactus"]),
    cardMarketImpact: "Pedro Pascal cards spanning both Star Wars and Marvel franchises are experiencing unprecedented demand. Mandalorian autograph cards already command $800+ for BAS-slabbed examples, while the new 2026 Topps Finest Fantastic Four set introduces fresh Reed Richards chase cards into the market.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Pedro Pascal stars in The Mandalorian & Grogu (May 22, 2026) and Avengers: Doomsday as Reed Richards. Explore his dual franchise dominance, the Reed Richards vs Doctor Doom rivalry, and why his trading cards are exploding in value.",
    sources: JSON.stringify([
      { title: "Rotten Tomatoes - Everything We Know About The Mandalorian and Grogu", url: "https://editorial.rottentomatoes.com/article/everything-we-know-about-star-wars-the-mandalorian-and-grogu/" },
      { title: "GeekTyrant - Pedro Pascal Teases Reed Richards and Doctor Doom Conflict", url: "https://geektyrant.com/news/pedro-pascal-teases-big-reed-richards-and-doctor-doom-conflict-in-avengers-doomsday" },
      { title: "Deadline - Pedro Pascal on The Fantastic Four: First Steps", url: "https://deadline.com/2025/04/pedro-pascal-the-fantastic-four-first-steps-reed-richards-1236367284/" },
      { title: "StarWars.com - Meet the Cast of The Mandalorian and Grogu", url: "https://www.starwars.com/news/star-wars-the-mandalorian-and-grogu-cast" }
    ]),
    contentMarkdown: `Pedro Pascal just accomplished something no other actor in Hollywood can claim: he's simultaneously the lead of a Star Wars theatrical film and a core member of the Marvel Cinematic Universe's biggest upcoming event. As *The Mandalorian & Grogu* hits theaters today — May 22, 2026 — and *Avengers: Doomsday* wraps filming for its December release, Pascal stands at the intersection of two of entertainment's most powerful franchises. For collectors, this dual-franchise dominance makes his cards some of the most sought-after pieces in the hobby.

## The Mandalorian Returns to the Big Screen

<img src="${IMAGES.razorCrest}" alt="The Razor Crest spacecraft flying through deep space" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

Today marks a historic moment for Star Wars: the first theatrical release in seven years. *The Mandalorian & Grogu* brings Din Djarin and his foundling back to the big screen after three seasons of Disney+ dominance. Directed by Jon Favreau and filmed for IMAX, the film sees Pascal return in both voice and body — a relative rarity, given that stunt performers Lateef Crowder and Brendan Wayne often wear the beskar armor during the series.

The film picks up after Season 3, with Djarin and Grogu operating as independent bounty hunters while maintaining ties to the New Republic. The Razor Crest makes its return (how it's rebuilt is one of the film's early reveals), and the Clan of Two faces new threats from both the Imperial Remnant and the Hutt cartel. Joining the cast are Sigourney Weaver as Colonel Ward and Jeremy Allen White — fresh off *The Bear* — in an undisclosed role.

Pascal himself attended the world premiere "straight off the Razor Crest," as Star Wars' official Instagram put it, and used the red carpet to tease what's coming next in his Marvel career.

## From Beskar to the Baxter Building

<img src="${IMAGES.fantasticar}" alt="The Fantasticar flying above the Baxter Building in New York City" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

Pascal's portrayal of Reed Richards in *The Fantastic Four: First Steps* (2025) silenced early skeptics who questioned his casting. Directed by Matt Shakman, the film introduced Marvel's First Family to the MCU with Pascal delivering what fans called a "goofy 60s dad" energy while maintaining the intellectual gravitas the character demands. He admitted in a Deadline interview that the role was "really intimidating" and that he was "more aware of disgruntlement around my casting" than fans might realize — but his performance won universal praise.

Now, with *Avengers: Doomsday* filmed and set for December 18, 2026, Pascal's Reed Richards is about to face his greatest challenge: Victor Von Doom.

## Reed Richards vs. Doctor Doom: Marvel's Greatest Rivalry Comes to the MCU

<img src="${IMAGES.doomThrone}" alt="Doctor Doom on his throne in Latveria" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

At the *Mandalorian & Grogu* premiere, Pascal was asked about sharing "big moments" with Robert Downey Jr.'s Doctor Doom in *Avengers: Doomsday*. His response sent the internet into overdrive:

> "There is so much to expect that I wouldn't even know where to begin."

In the comics, Reed Richards and Victor Von Doom share one of Marvel's most complex rivalries. They're intellectual equals — college roommates turned bitter enemies — with Doom's obsession, ego, and resentment toward Richards fueling decades of conflict. It's not just physical battles; it's a war of ideologies between a man who believes in collaborative science and one who demands absolute control.

The MCU is tapping into this relationship "on a huge scale," according to insiders. While early reports positioned Pascal as a lead alongside Chris Hemsworth, more recent reporting from Variety suggests Reed Richards will share significant screen time with Doom without being the film's primary protagonist. Either way, the Richards-Doom dynamic is confirmed as a central pillar of the story.

## The Only Actor in Both Galaxies

What makes Pedro Pascal's 2026 truly unprecedented is the scheduling overlap. He wrapped filming on *Avengers: Doomsday* and went directly into the *Mandalorian & Grogu* press tour. At the Entertainment Tonight premiere interview, he called the Doomsday filming experience "extraordinary" — a word that carries weight from an actor known for understated praise.

Consider the scope: Pascal is currently the face of Star Wars' theatrical return AND a key player in the MCU's biggest crossover event since *Endgame*. No other actor in history has simultaneously headlined active projects in both franchises. This isn't a cameo situation — he's a series lead in Star Wars and a founding member of the Fantastic Four in Marvel.

For the trading card market, this dual-franchise status creates a unique phenomenon: demand for Pascal's cards comes from TWO massive collector bases simultaneously.

## What This Means for Collectors

<img src="${IMAGES.cardsCollection}" alt="Premium holographic trading card collection display" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

Pedro Pascal's cards are experiencing what market analysts call "convergent demand" — collectors from both the Star Wars and Marvel hobbies are chasing the same cards. Mandalorian autograph cards (Topps Star Wars Signature Series) already command $800+ for BAS Beckett-slabbed examples. Meanwhile, the brand-new **2026 Topps Finest Fantastic Four** set is introducing fresh Reed Richards autograph and relic cards into the market at premium prices.

The timing couldn't be better for collectors who got in early. With *The Mandalorian & Grogu* releasing today and *Avengers: Doomsday* building hype through December, Pascal's card values have nowhere to go but up through the end of 2026.

Browse our <a href="https://northlandlegendaryfinds.com/cards" target="_blank">Card Database</a> to explore Fantastic Four cards, or check out our <a href="https://northlandlegendaryfinds.com/shop" target="_blank">repack boxes</a> for a chance at pulling something extraordinary.

## NLF Exclusive: 1/1 Pedro Pascal Auto in Our Repacks

We're putting our money where our mouth is. Northland Legendary Finds has secured a **1/1 Pedro Pascal Autograph card** that's going directly into our upcoming repack boxes. This is a true one-of-one — there is no other card like it in existence.

<!-- PLACEHOLDER: User's 1/1 Pedro Pascal Auto card photo will be inserted here -->
<!-- When user provides card photos, replace this section with actual images -->

**This card is available in NLF repacks.** One lucky collector will pull a piece of history — an autograph from the only actor simultaneously starring in Star Wars and Marvel theatrical releases. Check our <a href="https://northlandlegendaryfinds.com/shop" target="_blank">Shop</a> or catch our next <a href="https://northlandlegendaryfinds.com/whatnot" target="_blank">Whatnot stream</a> for your shot at this card.

## Collector's Corner

Pedro Pascal's dual-franchise dominance makes his cards the most versatile investment in the hobby right now. Whether you collect Star Wars, Marvel, or both, his autographs and inserts are trending upward with two major theatrical releases in 2026.

**Hot Cards to Watch:**
- **Pedro Pascal Topps Star Wars Signature Series Auto** — BAS-slabbed examples selling for $800+. Movie release day will spike demand further.
- **2026 Topps Finest Fantastic Four Reed Richards Auto** — Brand new set with premium chrome finish. First Reed Richards autos in the MCU era.
- **2025 Marvel Topps NOW Fantastic Four: First Steps** — Movie tie-in cards with Chrome and Opal Chrome parallels. Limited print runs.
- **Pedro Pascal Mandalorian Custom Cut Auto BAS Beckett Slabbed** — Authenticated signatures on custom cards. Scarce supply meets massive demand.

Track Pedro Pascal card values on <a href="https://www.cardladder.com/" target="_blank">**Card Ladder**</a> — their price indices show the trajectory of dual-franchise demand in real time.

Find authenticated Pedro Pascal autos and Fantastic Four cards on <a href="https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768" target="_blank">**eBay**</a> — check sold listings for real transaction prices.

Explore the full 2026 Topps Finest Fantastic Four checklist on <a href="https://www.beckett.com/" target="_blank">**Beckett**</a> — the definitive source for new release checklists and price guides.

*The Mandalorian & Grogu is in theaters and IMAX now (May 22, 2026). Avengers: Doomsday arrives December 18, 2026.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Unfeature previous featured article
  await conn.execute("UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1");

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
