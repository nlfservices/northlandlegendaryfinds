/**
 * Publish "6 Months Until Avengers: Doomsday" article — June 18, 2026
 * Template: collector_spotlight (next in rotation after cinematic)
 * Run from project root: node publish-doomsday-6months.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (from webdev-static-assets CDN)
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-6months-hero-4VEdkLzFNXKCxDYYAEnf7j.webp",
  rdjDoom: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-6months-rdj-doom-mGzYNTZKo57dEsGsxjpD9N.webp",
};

const now = Date.now();

const articles = [
  {
    title: "6 Months Until Avengers: Doomsday — Why Collectors Are Loading Up Now",
    slug: "avengers-doomsday-6-months-collector-guide-doctor-doom-rdj",
    excerpt: "Avengers: Doomsday arrives December 18, 2026. Robert Downey Jr. returns as Doctor Doom, the Russo Brothers are directing, and the card market is already pricing in what could be the biggest MCU event since Endgame.",
    featuredImageUrl: IMAGES.hero,
    category: "analysis",
    tags: JSON.stringify(["Avengers Doomsday", "Doctor Doom", "Robert Downey Jr", "Russo Brothers", "MCU Phase 6", "Card Market", "Topps Chrome Marvel", "Iron Man"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Iron Man", "Spider-Man", "Hulk", "Wolverine"]),
    cardMarketImpact: "Doctor Doom cards have seen significant price increases since the RDJ casting announcement. 1/1 sketch cards are listed at $2,500-$3,500 and numbered parallels are climbing steadily as the release approaches.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Avengers: Doomsday releases December 18, 2026. Robert Downey Jr. plays Doctor Doom. Here's what collectors need to know about the card market 6 months out.",
    sources: JSON.stringify([
      { title: "Marvel.com — Avengers: Doomsday Official Page", url: "https://www.marvel.com/movies/avengers-doomsday" },
      { title: "Marvel.com — Spider-Man: Brand New Day Trailer", url: "https://www.marvel.com/articles/movies/spider-man-brand-new-day-full-official-trailer-july-2026" },
      { title: "eBay — Doctor Doom 1/1 Sketch Card Listing", url: "https://www.ebay.com/itm/287300033082" },
    ]),
    contentMarkdown: `The countdown is running. In six months, the MCU changes forever.

Avengers: Doomsday arrives in theaters on **December 18, 2026** — and everything Marvel has built since Endgame has been leading to this moment. Robert Downey Jr. returns to the MCU, but not as Tony Stark. This time, he's behind the mask of **Doctor Doom**. The Russo Brothers are back in the director's chair. Stephen McFeely wrote the script. And the card market is already reacting.

If you're a collector, the window between now and December is the window that matters most.

---

## The Road to Doomsday

The MCU's 2026 slate isn't random — it's a carefully constructed runway:

**Spider-Man: Brand New Day** drops July 31 and kicks off the new era. [We broke down that trailer here](https://northlandlegendaryfinds.com/mcu-news/spiderman-brand-new-day-trailer-record-breaking-card-market) — it already shattered the all-time record with over 718 million views in 24 hours. That film introduces the "physical evolution" that connects directly to the multiverse fractures Doomsday will exploit.

**Avengers: Endgame** returns to theaters in September with a re-release targeting the all-time box office record (currently held by Avatar at $2.92 billion). Marvel isn't just building hype — they're reminding audiences exactly what's at stake before Doom arrives.

Then in December, **Doomsday** finishes the job.

Three films. Six months. One trajectory: the biggest Marvel event since 2019.

---

## RDJ as Doctor Doom — What We Know

<img src="${IMAGES.rdjDoom}" alt="The transformation from hero to villain — RDJ's dual role in the MCU" style="width:100%;border-radius:8px;margin:1.5rem 0;" />

Robert Downey Jr. has described the preparation as a "very intense process." He's reportedly writing extensive backstory for Victor Von Doom — approaching the role with the same obsessive detail he brought to Tony Stark across a decade of films.

The Russo Brothers have called the Doctor Doom costume their "favorite in the MCU" — and they've directed four Marvel films including Infinity War and Endgame. When they say something is their favorite, the bar is already impossibly high.

Here's what makes this unprecedented: **the same actor who defined the MCU's greatest hero is now playing its greatest villain.** That's never happened in superhero cinema. The emotional weight of seeing RDJ behind Doom's mask — knowing what Tony Stark sacrificed — adds a layer that no other casting could achieve.

Marvel has also confirmed that the first four trailers intentionally avoided showing RDJ in the Doom costume. They're saving the reveal. When it drops, expect another record-breaking moment.

---

## Why 6 Months Out Is the Collector's Window

Every major MCU event follows the same pattern for card prices:

1. **Announcement spike** — prices jump when casting/directors are confirmed (already happened)
2. **Trailer spike** — another jump when footage drops (coming soon)
3. **Release week peak** — maximum hype, maximum prices
4. **Post-release correction** — prices settle unless the film overperforms

We're currently between stages 1 and 2. The announcement spike has already priced in the basic hype — but the trailer hasn't dropped yet. That means collectors who position now are ahead of the second wave.

Once that first Doomsday trailer hits (and shows RDJ in the mask), expect Doctor Doom cards to move fast.

---

## What the Market Is Saying Right Now

The Doctor Doom card market is already active. Here's what sellers are asking for premium pieces:

> **2026 Topps Chrome Marvel — Doctor Doom 1/1 Sketch Card (LaRocca Homage)**
> Listed at $3,495.95 (Best Offer) — 3 watchers
> [eBay](https://www.ebay.com/itm/287300033082)

> **1/1 Doctor Doom Sketch — 2026 Topps Marvel Brooklyn Die Cut Shield Card Auto**
> Listed at $2,500

> **Doctor Doom Comic Cut 1/1 — Hulk Variant**
> Listed at $1,499.99
> [eBay](https://www.ebay.com/itm/389584439098)

> **2025 Topps Chrome Marvel — Doctor Doom Refractor**
> Listed at $149.99 — 8 watchers
> [eBay](https://www.ebay.com/itm/306354843911)

The 1/1 market is already in the thousands. Numbered parallels are climbing. And this is all *before* a single frame of trailer footage has been released.

For context: when the RDJ-as-Doom casting was first announced at San Diego Comic-Con 2024, Doctor Doom base cards doubled overnight. Chrome refractors tripled. The market remembers what happened with Thanos cards before Infinity War — and Doom is being positioned as an even bigger threat.

---

## Cards to Watch Before December

The smart money is looking at these categories:

**Doctor Doom flagship cards** — Any Topps Chrome Marvel Doctor Doom, especially numbered parallels (/99, /50, /25, /10). The Reflections insert (#MR-1) is a case hit SSP that's already hard to find.

**Iron Man / RDJ crossover cards** — Cards that feature both Iron Man and Doctor Doom, or RDJ-specific autographs. The "Iron Man & Doctor Doom /100" dual card is particularly interesting given the actor connection.

**Russo Brothers-directed film cards** — Infinity War and Endgame cards tend to rise when the Russos are in the news. Their track record adds confidence to the market.

**Variant covers and sketch cards** — 1/1 pieces are already listed at $2,500-$3,500. If the trailer lands well, these could push significantly higher.

---

## The Bigger Picture

Doomsday isn't just another Marvel movie. It's the culmination of everything since Endgame — the film that's supposed to justify four years of Phase 4-5 setup. With the Russo Brothers back, RDJ returning as the villain, and Secret Wars confirmed as the follow-up, this is Marvel's biggest bet since 2019.

For collectors, that means one thing: **the cards connected to this film have the highest ceiling of anything in the current Marvel card market.**

The question isn't whether Doom cards will spike. It's whether you're positioned before the trailer drops or after.

---

## Collector's Corner

Doomsday is the event that every Marvel collector has been waiting for since the Multiverse Saga began. The combination of RDJ, the Russo Brothers, and Doctor Doom creates a perfect storm for the card market — and we're still six months out.

**Hot Cards to Watch:**
- **Doctor Doom 2026 Topps Chrome Marvel Refractor** — The flagship Doom card in the current set. Numbered parallels are climbing weekly.
- **Doctor Doom Reflections #MR-1 Case Hit SSP** — Extremely limited pull. One of the hardest Doom cards to find in the wild.
- **Iron Man & Doctor Doom Dual Card /100** — The RDJ connection makes this uniquely positioned for Doomsday hype.
- **Doctor Doom 1/1 Sketch Cards (any set)** — Already listed at $2,500-$3,500. Ceiling is much higher if the film delivers.

Track Doctor Doom price history on **[eBay sold listings](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** — real transaction data beats asking prices every time.

Browse current Doom inventory on **[COMC](https://www.comc.com/)** for singles at every price point — great for building a position across multiple parallels.

Check population reports on **[Beckett](https://www.beckett.com/)** to understand exactly how many copies exist at each grade before making graded purchases.

Explore our [Card Database](https://northlandlegendaryfinds.com/cards) for the full Doctor Doom checklist, or check the [Doomsday Countdown page](https://northlandlegendaryfinds.com/doomsday) for daily updates as we approach December 18.

*Six months. One villain. The biggest MCU event since Endgame. The countdown is live.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Un-feature any currently featured article
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
