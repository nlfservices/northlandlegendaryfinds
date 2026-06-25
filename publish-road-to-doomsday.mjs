/**
 * Publish "The Road to Doomsday: Every MCU Event Building Toward December 2026"
 * Template: timeline (next in rotation after spotlight)
 * Category: analysis
 * Run from project root: node publish-road-to-doomsday.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (from webdev static assets CDN)
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/road-to-doomsday-hero-3xRpoThKeFjZt8NTJ2LtWc.webp",
  spidermanMutants: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/road-to-doomsday-spiderman-mutants-ed3UuG8WXXYhLTZJeznYdW.webp",
  hawkeye: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/road-to-doomsday-hawkeye-nq2i48mPnY8k5qrxJiyM4V.webp",
};

const now = Date.now();

const articles = [
  {
    title: "The Road to Doomsday: Every MCU Event Building Toward December 2026",
    slug: "road-to-doomsday-mcu-events-timeline-2026-collectors",
    excerpt: "From Brand New Day's X-Men introduction in July to the Endgame re-release in September to the three-universe collision in December — here's the complete timeline of how every MCU event in 2026 is building toward Avengers: Doomsday.",
    featuredImageUrl: IMAGES.hero,
    category: "analysis",
    tags: JSON.stringify(["Avengers Doomsday", "Spider-Man Brand New Day", "X-Men", "Fantastic Four", "Endgame Re-Release", "Doctor Doom", "Hawkeye", "MCU Timeline", "2026 Marvel", "Card Market", "Robert Downey Jr"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Spider-Man", "Wolverine", "Hawkeye", "Mister Fantastic", "Scarlet Witch", "Hulk"]),
    cardMarketImpact: "The six-month buildup from Brand New Day through Doomsday creates three distinct demand waves for Marvel cards — Spider-Man and X-Men cards surge in July, Avengers nostalgia drives demand in September, and Doctor Doom cards hit peak value in December when RDJ debuts as Doom.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Complete timeline of every MCU event building toward Avengers: Doomsday in December 2026. From Brand New Day's X-Men introduction to the Endgame re-release to the three-universe collision — here's what collectors need to know.",
    sources: JSON.stringify([
      { title: "Marvel Studios' MCU Will Officially Enter Its X-Men Era In 2026 — The Direct", url: "https://thedirect.com/article/marvel-studios-mcu-enter-x-men-era-2026" },
      { title: "Avengers: Doomsday Official Synopsis Confirms X-Men, Fantastic Four, and Avengers — The Direct", url: "https://thedirect.com/article/avengers-doomsday-synopsis-x-men-fantastic-four-avengers" },
      { title: "Jeremy Renner Will Reportedly Return as Hawkeye in Avengers: Doomsday — SuperHeroHype", url: "https://www.facebook.com/superherohype/videos/968911149448755/" },
      { title: "Famke Janssen Says Marvel Made a Mistake Not Bringing Her Back — Variety", url: "https://variety.com/2026/film/news/famke-janssen-marvel-mistake-jean-grey-avengers-doomsday-1236786151/" }
    ]),
    templateLayout: "timeline",
    contentMarkdown: `We are 176 days away from the biggest Marvel event since Endgame. But Avengers: Doomsday isn't arriving in a vacuum — Marvel Studios has spent all of 2026 laying the groundwork for a multiverse collision that will bring together the Avengers, the Fantastic Four, and the X-Men on screen for the first time. Every movie, every re-release, and every casting announcement this year is a domino falling toward December 18. Here's the complete timeline of how it all connects — and what it means for collectors watching the card market.

## July 31: Brand New Day Launches the X-Men Era

Spider-Man: Brand New Day isn't just the next Tom Holland blockbuster — it's quietly the most important setup film for Doomsday. The second trailer confirmed that Tramell Tillman is playing **William Metzger**, a character whose entire identity in the comics revolves around his hatred of mutants. In the film, Metzger appears to lead the Department of Damage Control, the government agency that's been hunting enhanced individuals since No Way Home.

According to The Direct, Tillman signed a **multi-picture deal**, meaning Metzger's anti-mutant crusade extends well beyond this film and connects directly to the 2028 X-Men reboot. The DODC is hunting a young mutant in Brand New Day, and Spider-Man is caught in the middle — officially making this the MCU's first mutant storyline on the big screen.

The cast is stacked: Tom Holland, Zendaya, Jacob Batalon, Sadie Sink, Jon Bernthal, Mark Ruffalo (returning as a rumored **Grey Hulk** transformation), Michael Mando, and Eman Esfandi. The film also reportedly features a post-credits scene that connects directly to Doomsday.

<img src="${IMAGES.spidermanMutants}" alt="Spider-Man overlooking New York City as government forces patrol below" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

## September 25: Endgame Returns with New Footage

Marvel Studios confirmed that Avengers: Endgame will return to theaters worldwide on September 25, 2026 — but this isn't a standard anniversary re-release. The film will include **brand new footage** that Joe Russo has called "critical to the plot of Doomsday." That's not marketing fluff. The Russo Brothers are directing Doomsday, and they're using the Endgame re-release to plant story seeds that pay off three months later.

This is unprecedented. Marvel has never used a theatrical re-release to deliver new narrative content that bridges directly into an upcoming film. The implication is clear: something happens in the new Endgame footage — possibly an incursion event, a Doom tease, or a multiverse crack — that audiences need to see before December.

For the card market, this creates a nostalgia wave. Every original Avenger gets a spotlight. Iron Man, Captain America, Thor, Black Widow, Hawkeye, and Hulk cards will see renewed demand as millions of fans revisit the theater that made them fall in love with the MCU.

## October–November: The Calm Before the Storm

Between the Endgame re-release and Doomsday's December premiere, Marvel enters a strategic quiet period — but the marketing machine will be running at full speed. This is when the Doomsday trailer drops wide, the full cast gets confirmed, and merchandise reveals start showing character designs.

We already know from CinemaCon 2026 that the trailer features **Thor vs. Doctor Doom** and showcases heroes from all three universes assembling. Promotional art has leaked showing the logos of the Avengers, Fantastic Four, and X-Men colliding — and merchandise reveals have given us our best look at 28 character costumes.

This window is also when collector speculation peaks. Smart collectors who positioned early on Doctor Doom, Wolverine, and Fantastic Four cards will see their holdings appreciate as mainstream hype builds. The last time this happened was the Endgame run-up in early 2019, when Thanos cards tripled in value between trailer drop and premiere.

## December 18: Three Universes Collide

The official Doomsday synopsis confirms what fans expected: **heroes from three distinct universes will be set on a deadly collision course**. Those three universes are the main MCU timeline (Avengers), Earth-828 (Fantastic Four from First Steps), and the Fox X-Men universe. This is the first time Disney has stated in plain terms that the Fox X-Men films are canon to the MCU multiverse.

The roster runs past **30 announced actors**. The Russo Brothers are directing. Robert Downey Jr. stars as Doctor Doom. The returning Fox X-Men cast includes Patrick Stewart (Professor X), Ian McKellen (Magneto), James Marsden (Cyclops), Kelsey Grammer (Beast), Alan Cumming (Nightcrawler), and Rebecca Romijn (Mystique). Notably absent: Famke Janssen as Jean Grey, who publicly stated Marvel "made a mistake" not bringing her back.

The mechanism driving the collision is **incursions** — catastrophic events where the barrier between universes erodes until realities crash together. Doctor Strange in the Multiverse of Madness introduced this concept, and the post-credits scene of Fantastic Four: First Steps placed Doom on Earth-828 standing over Franklin Richards, a child who can reshape reality itself.

## Hawkeye Returns: A Founding Avenger Rejoins the Fight

According to insider James Mack, Jeremy Renner will reprise his role as **Clint Barton/Hawkeye** in Doomsday — marking the return of a founding MCU hero after a five-year absence. Renner last appeared in the Hawkeye Disney+ series in 2021, and his return signals that Marvel is pulling out every stop for this film.

The significance for collectors: Hawkeye cards have been undervalued for years relative to other original Avengers. A confirmed Doomsday appearance — especially if Clint gets a major moment — could trigger a correction in the market. Early Topps Chrome Marvel Hawkeye cards and Avengers sketch cards featuring Renner are worth watching.

<img src="${IMAGES.hawkeye}" alt="Hawkeye with bow drawn on a battlefield with heroes assembling behind him" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

## What This Means for Collectors

The six-month runway from July to December creates **three distinct demand waves** in the Marvel card market. Wave one hits in July when Brand New Day introduces mutants and Spider-Man cards surge alongside new X-Men speculation. Wave two arrives in September when the Endgame re-release triggers nostalgia buying across all original Avenger cards. Wave three — the big one — lands in December when Doomsday premieres and Doctor Doom, Wolverine, and Fantastic Four cards hit peak demand.

Collectors who position now, before the mainstream hype cycle kicks in, are buying at the floor. Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to find Doctor Doom, Wolverine, and Spider-Man cards across every Topps set, or explore the [Characters section](https://northlandlegendaryfinds.com/characters) to track which heroes are confirmed for Doomsday.

## Collector's Corner

Every major MCU event creates a card market wave — and 2026 has three of them stacked back-to-back. The collectors who win are the ones who position before the trailers drop.

**Hot Cards to Watch:**
- **Doctor Doom Topps Chrome Marvel Base** — Floor prices will look cheap by December when RDJ debuts as Doom
- **Wolverine Topps Finest X-Men '97 Refractor** — Fox X-Men confirmation in Doomsday makes every Wolverine card a buy
- **Spider-Man Topps Marvel Mint Autograph** — Brand New Day hype plus mutant storyline equals peak Spider-Man demand
- **Hawkeye Topps Chrome Marvel Numbered Parallel** — Undervalued founding Avenger with confirmed Doomsday return

Track real-time price movements on **[Card Ladder](https://www.cardladder.com/)** — their market indices show exactly when collector demand starts moving. For graded card tracking and portfolio management, check **[MySlabs](https://www.myslabs.com/)**. And for live auction action on Marvel cards, join us on **[Whatnot](https://www.whatnot.com/)** where NLF streams weekly.

*Avengers: Doomsday arrives in theaters December 18, 2026. The countdown is on — 176 days and closing.*`
  }
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Unfeature previous featured article
  await conn.execute("UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1");
  console.log("✅ Unfeatured previous articles");

  for (const article of articles) {
    try {
      await conn.execute(
        `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription, templateLayout)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          article.templateLayout
        ]
      );
      console.log(`✅ Published: "${article.title}"`);
      console.log(`   URL: https://northlandlegendaryfinds.com/mcu-news/${article.slug}`);
      console.log(`   Template: ${article.templateLayout}`);
    } catch (err) {
      console.error(`❌ Failed: "${article.title}" — ${err.message}`);
    }
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
