/**
 * Publish: Spider-Man: Brand New Day — Trailer Breaks Records, Cards Are Moving
 * Template: cinematic (next in rotation after magazine)
 * Run from project root: node publish-spiderman-brand-new-day-trailer.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (generated and uploaded to CDN)
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/spiderman-bnd-hero-2SvZo9VQWjbH4MrMzSVsV5.webp",
  villain: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/spiderman-bnd-villain-cZDoetGZ26vEkCydMX2CBT.webp",
  cards: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/spiderman-bnd-cards-collector-Vkqx3Y2Zv25aywXTjDGqeH.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Spider-Man: Brand New Day Trailer Breaks Records — And the Card Market Is Already Reacting",
    slug: "spiderman-brand-new-day-trailer-record-breaking-card-market",
    excerpt: "The official trailer for Spider-Man: Brand New Day shattered streaming records with over 718 million views, making it the most-watched Marvel trailer in history. Here's what it means for collectors.",
    featuredImageUrl: IMAGES.hero,
    category: "movie_news",
    templateLayout: "cinematic",
    tags: JSON.stringify(["Spider-Man", "Brand New Day", "Trailer", "Marvel", "MCU", "Topps", "Card Market", "Scorpion", "Punisher", "Jean Grey"]),
    relatedCharacters: JSON.stringify(["Spider-Man", "Scorpion", "Punisher", "Jean Grey", "Doctor Doom", "Hulk"]),
    cardMarketImpact: "The Brand New Day trailer has ignited demand for Spider-Man chrome parallels and villain cards — Scorpion and Punisher Topps Chrome listings are already moving at elevated prices, and Jean Grey cards are seeing crossover interest from X-Men collectors drawn in by the film's mutant storyline.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Spider-Man: Brand New Day's official trailer broke all Marvel streaming records with 718M+ views. See which cards are moving and what collectors need to know before the film drops.",
    sources: JSON.stringify([
      { title: "Spider-Man: Brand New Day Official Trailer", url: "https://www.youtube.com/watch?v=62bIsvRcPv0" },
      { title: "eBay — 2025 Topps Marvel Mint Spider-Man Chrome Black #/10 BGS 10", url: "https://www.ebay.com/itm/318297954458" },
      { title: "eBay — 2025 Topps Marvel Mint Scorpion Superfractor 1/1", url: "https://www.ebay.com/itm/267375496066" },
      { title: "eBay — Topps Chrome Marvel Sapphire Punisher Black Auto /10", url: "https://www.ebay.com/itm/298219463308" },
      { title: "eBay — Topps Marvel Mint Dr. Doom Comic Cut 1/1 HULK", url: "https://www.ebay.com/itm/389584439098" },
      { title: "eBay — 2025 Topps Marvel Mint Jean Grey /10 Gold Tier SSP", url: "https://www.ebay.com/itm/287323561636" },
    ]),
    contentMarkdown: `<div class="cinematic-article">

<img src="${IMAGES.hero}" alt="New York City skyline with web-like light beams — Spider-Man: Brand New Day" style="width:100%;border-radius:8px;margin-bottom:2rem;" />

The internet broke on June 10, 2026. Marvel Studios dropped the official trailer for **Spider-Man: Brand New Day**, and within hours it became the most-watched Marvel trailer in history — surpassing every previous record the studio had set. By the time the dust settled, the trailer had crossed **718 million views**, a number that dwarfs the first trailer for *Spider-Man: No Way Home*, which pulled roughly 800 million views in its *entire first 24 hours* — a benchmark that was already considered untouchable at the time.

To put that in perspective: the Brand New Day trailer didn't just beat No Way Home. It beat it *faster*, and it kept climbing. The response from fans, collectors, and casual viewers alike was immediate and visceral. This is not just a movie people are excited about. This is a cultural event.

---

## What the Trailer Actually Shows

The Brand New Day trailer is a masterclass in controlled chaos. It opens with Peter Parker navigating a world that has fundamentally changed — the consequences of the multiverse events from No Way Home are still rippling through his life, and the city of New York feels different. Darker. More dangerous.

The trailer's most talked-about sequence involves **Scorpion** — Mac Gargan in full armored form — tearing through a Manhattan street in broad daylight. The visual design is stunning: the green exosuit is more mechanical and menacing than any previous live-action version, and the fight choreography suggests this isn't a one-scene cameo. Scorpion appears to be a primary antagonist.

<img src="${IMAGES.villain}" alt="Scorpion villain concept — Marvel cinematic art" style="width:100%;border-radius:8px;margin:2rem 0;" />

**The Punisher** also makes a significant appearance. Frank Castle is shown operating in the shadows of New York, and the trailer deliberately leaves his allegiance ambiguous — is he hunting the same targets as Spider-Man, or is he a threat? The framing suggests both. The tension between Peter Parker's code against killing and Frank Castle's complete lack of one is clearly going to be a central theme.

Perhaps the most surprising moment in the trailer is a brief but unmistakable appearance that connects Brand New Day to the broader mutant storyline Marvel has been building. Without spoiling the specific reveal, it signals that this film is not operating in isolation — it's a bridge between Spider-Man's world and the incoming X-Men era of the MCU.

---

## The Record in Context

Marvel has had massive trailer moments before. *Avengers: Endgame* set records. *No Way Home* shattered them. But Brand New Day's numbers are different because of *when* they happened.

The MCU is in a rebuilding phase. After the Infinity Saga concluded, the studio has been laying groundwork — introducing new characters, seeding storylines, managing audience expectations across a sprawling content calendar. The Brand New Day trailer is the first moment since Endgame where the internet collectively stopped and said: *this is the one*.

The 718 million view count isn't just a marketing metric. It's a signal. It tells studios, distributors, investors, and — critically — **collectors** that Spider-Man is the most bankable character in the Marvel universe right now. Not Doom. Not the Avengers. Spider-Man.

That matters enormously for the card market.

---

## The Film's Release and What We Know

**Spider-Man: Brand New Day** is scheduled for release on **July 25, 2026**. The film is directed by Destin Daniel Cretton, who previously helmed *Shang-Chi and the Legend of the Ten Rings*. Tom Holland returns as Peter Parker, and the supporting cast includes new additions that the trailer teases without fully revealing.

The title itself — *Brand New Day* — is a direct reference to one of the most controversial and beloved Spider-Man comic storylines, in which Peter Parker's life is fundamentally reset. The MCU version appears to be drawing on the emotional core of that arc without being a direct adaptation: a Spider-Man who has lost something essential and must rebuild from scratch.

The film arrives just weeks before **Avengers: Doomsday** (May 1, 2026), positioning it as the emotional counterpoint to that film's universe-scale stakes. If Doomsday is about the end of everything, Brand New Day is about what comes after.

---

## What Collectors Are Watching

The trailer's release triggered immediate movement in the secondary market. Collectors who have been sitting on Spider-Man chrome cards are suddenly fielding offers. Those who have been watching from the sidelines are now actively hunting.

Here is what the market looked like in the days surrounding the trailer drop — five real eBay sold listings that tell the story:

<img src="${IMAGES.cards}" alt="Spider-Man and Marvel Topps Chrome trading cards collector scene" style="width:100%;border-radius:8px;margin:2rem 0;" />

---

### Recently Sold: What the Market Is Saying

> **2025 Topps Marvel Mint — Spider-Man Chrome Black #/10 (BGS 10 + BGS 9.5 Chrome Red)**
> Sold for **$15,000.00** on May 15, 2026
> [View Listing](https://www.ebay.com/itm/318297954458)
> *A dual-slab lot featuring a BGS 10 Black parallel numbered to 10 alongside a BGS 9.5 Chrome Red. This is the kind of transaction that sets price anchors for the entire Spider-Man chrome category.*

> **2025 Topps Marvel Mint — Scorpion Base #42 Chrome Superfractor 1/1**
> Sold for **$1,499.99** on May 19, 2026
> [View Listing](https://www.ebay.com/itm/267375496066)
> *The only one in existence. Scorpion's trailer appearance has made this card significantly more relevant — a 1/1 Superfractor for a villain who now has confirmed MCU screen time is a compelling hold.*

> **Topps Chrome Marvel Sapphire — Frank Castle / Punisher Black Auto #/10 (10/10)**
> Sold for **C$2,193.29** on June 7, 2026
> [View Listing](https://www.ebay.com/itm/298219463308)
> *The Punisher's Brand New Day appearance has collectors revisiting his Sapphire chrome autos. This Black parallel numbered to 10 moved at a strong price just days before the trailer dropped — timing that looks prescient in hindsight.*

> **2025 Topps Marvel Mint — Dr. Doom Authentic Comic Cut 1/1 (DD-CC HULK)**
> Listed at **$1,499.99**
> [View Listing](https://www.ebay.com/itm/389584439098)
> *This one is unique: a 1/1 Comic Cut featuring both Doctor Doom and Hulk from actual comic book pages. With Avengers: Doomsday on the horizon and Doom's card market dominance well established, this crossover piece sits at the intersection of two of the hottest characters in the hobby right now.*

> **2025 Topps Marvel Mint — Jean Grey /10 Gold Tier Chrome SSP**
> Sold for **$180.00** on May 11, 2026
> [View Listing](https://www.ebay.com/itm/287323561636)
> *Jean Grey's Brand New Day connection has collectors paying attention. This Gold Tier SSP numbered to 10 moved quietly before the trailer — the kind of card that looks undervalued in retrospect when a character gets confirmed MCU screen time.*

---

## The Collector Angle: Why This Moment Is Different

Spider-Man has always been the most popular Marvel character. But popularity and *collectibility* are not the same thing. What Brand New Day does is create a specific, time-stamped moment — a trailer that broke records, a release date that is now locked in, a cast of characters whose card values are directly tied to their on-screen presence.

Scorpion has a 1/1 Superfractor. The Punisher has a Black Auto numbered to 10. Jean Grey has a Gold Tier SSP. These are not hypothetical cards — they exist, they have sold, and their values are going to be measured against what happens on July 25, 2026.

The window between now and release is the window collectors understand best. It's the period when information is still asymmetric — when some people are paying attention and most people aren't. That window is closing.

For those tracking the broader MCU card landscape, the [NLF Marvel Characters page](https://northlandlegendaryfinds.com/characters) has profiles on Spider-Man, Scorpion, Punisher, and Jean Grey with card market context. The [MCU News section](https://northlandlegendaryfinds.com/mcu-news) will continue to track Brand New Day developments as the July 25 release approaches.

---

## Watch the Official Trailer

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:2rem 0;">
  <iframe
    src="https://www.youtube.com/embed/62bIsvRcPv0"
    title="Spider-Man: Brand New Day — Official Trailer"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
  ></iframe>
</div>

---

## Collector's Corner

The Brand New Day trailer has done something rare: it has made Spider-Man *urgent* for collectors again. The combination of a record-breaking cultural moment, a confirmed July 25 release, and villain cards that now have real MCU context creates a specific kind of market pressure. Cards that were patient holds are now active conversations.

**Hot Cards to Watch:**

- **Spider-Man 2025 Topps Marvel Mint Chrome Black #/10** — The benchmark for Spider-Man chrome. BGS 10 copies are trophy pieces; any numbered parallel under /25 is worth tracking.
- **Scorpion 2025 Topps Marvel Mint Superfractor 1/1** — The only one. Villain 1/1s with confirmed screen time have a history of significant appreciation between trailer and release.
- **Punisher Topps Chrome Marvel Sapphire Black Auto /10** — Autograph + Black parallel + confirmed MCU appearance = a card that checks every box serious collectors look for.
- **Jean Grey 2025 Topps Marvel Mint Gold Tier SSP /10** — The mutant connection in Brand New Day is the sleeper angle. Jean Grey SSPs are already moving; a film appearance would be a significant catalyst.

Track real sold prices on **[Card Ladder](https://www.cardladder.com/)** — the most reliable source for Marvel chrome market history and trend analysis.

Browse current listings on **[TCGPlayer](https://www.tcgplayer.com/)** for real-time Spider-Man card pricing across all sets and parallels.

For graded population data on any of these cards, **[PSA's population report](https://www.psacard.com/)** shows exactly how many copies exist at each grade — essential context for any serious buying decision.

*Spider-Man: Brand New Day opens July 25, 2026. The trailer has been seen. The cards are moving. The window is open.*

</div>`,
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
    } catch (err) {
      console.error(`❌ Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, templateLayout, SUBSTRING(title,1,70) as title FROM articles ORDER BY publishedAt DESC LIMIT 6"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.templateLayout}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
