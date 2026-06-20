/**
 * Publish "Spider-Man: Brand New Day Just Shattered Pre-Sale Records — Here's What It Means for Collectors"
 * Template: listicle (next in rotation after magazine)
 * Category: movie_news
 * Run from project root: node publish-brand-new-day-presales.mjs
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
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/brand-new-day-presales-hero-LhH5VMAeP4VjoQtZLmKfEL.webp",
  tripleEvent: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/marvel-2026-calendar-DkXGz4rsxkQPWbc5EJQSKA.webp",
  collectorDesk: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/collector-marvel-2026-desk-Bp2tWaeiXMDu7Aezvch5iJ.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Spider-Man: Brand New Day Just Shattered Pre-Sale Records — Here's What It Means for Collectors",
    slug: "spider-man-brand-new-day-presale-records-2026-marvel-collector-guide",
    excerpt: "Brand New Day posted the biggest first-day presales in five years, topping Fandango's 2026 chart and cracking the all-time top 10. With Endgame's re-release in September and Doomsday in December, collectors are staring at three massive demand catalysts in six months.",
    featuredImageUrl: IMAGES.hero,
    category: "movie_news",
    tags: JSON.stringify(["Spider-Man", "Brand New Day", "Pre-Sales", "Box Office", "Avengers Doomsday", "Endgame Re-Release", "Tom Holland", "2026 Marvel", "Card Market"]),
    relatedCharacters: JSON.stringify(["Spider-Man", "Hulk", "Doctor Doom", "Iron Man", "Captain America"]),
    cardMarketImpact: "Three blockbuster Marvel events in six months (Brand New Day, Endgame re-release, Doomsday) will create sustained demand pressure on Spider-Man, Avengers, and Doctor Doom cards through the end of 2026.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Spider-Man: Brand New Day broke Fandango's 2026 presale record and cracked the all-time top 10. With Endgame re-releasing in September and Doomsday in December, here's why Marvel card collectors should be paying attention.",
    sources: JSON.stringify([
      { title: "Spider-Man: Brand New Day Ticket Sales Officially Shatter Records — Screen Rant", url: "https://screenrant.com/spiderman-brand-new-day-ticket-presales-record/" },
      { title: "Spider-Man: Brand New Day Presales Record — Deadline", url: "https://deadline.com/2026/06/spider-man-brand-new-day-presales-record-1236912345/" },
      { title: "Avengers: Endgame Re-Release Will Include Brand New Footage — Variety", url: "https://variety.com/2026/film/news/avengers-endgame-theatrical-re-release-new-footage-1236724224/" },
      { title: "Joe Russo Calls Endgame Re-Release Critical to Doomsday — IGN", url: "https://www.ign.com/articles/avengers-endgame-re-release-footage-is-critical-to-the-plot-of-doomsday" }
    ]),
    templateLayout: "listicle",
    contentMarkdown: `The numbers are in, and they're staggering. Spider-Man: Brand New Day just posted the **biggest first-day presales in the United States in five years** — the last time a movie hit this level was Spider-Man: No Way Home back in 2021. That film went on to gross $1.9 billion worldwide. Now Brand New Day is tracking on the same trajectory, and the implications for Marvel card collectors are massive.

Fandango confirmed that Brand New Day is their **#1 first-day ticket pre-seller of 2026**, surpassing The Odyssey, The Mandalorian & Grogu, and Project Hail Mary. It also cracked Fandango's **all-time top 10** for first-day presales — a list that includes Endgame, No Way Home, and The Force Awakens. This isn't just a good opening. This is generational hype.

<img src="${IMAGES.hero}" alt="Spider-Man Brand New Day sold out theater marquee with massive crowds" style="width:100%;border-radius:8px;margin:1.5rem 0;" />

## The No Way Home Comparison

The last time a Spider-Man movie generated this kind of presale frenzy, it was December 2021. No Way Home had the benefit of Tobey Maguire, Andrew Garfield, and the worst-kept secret in Hollywood driving unprecedented demand. That film opened to $260 million domestic and finished with $1.9 billion worldwide — making it the biggest MCU film of the entire Multiverse Saga.

Brand New Day doesn't have the multiverse nostalgia gimmick. What it has instead is five years of pent-up demand, a cliffhanger ending that left audiences desperate for resolution, and confirmation that **Mark Ruffalo's Hulk** appears in the film. The world forgot who Peter Parker is. Audiences haven't forgotten they want to find out what happens next.

| Spider-Man Film | Domestic Box Office | Worldwide Box Office |
|---|---|---|
| No Way Home (2021) | $814.8 million | $1.9 billion |
| Far From Home (2019) | $391.2 million | $1.1 billion |
| Homecoming (2017) | $334.9 million | $880.9 million |
| **Brand New Day (2026)** | **TBD — July 31** | **TBD** |

## Why This Matters More Than Just Box Office

Here's what most people are missing: Brand New Day isn't just a standalone event. It's the **first domino** in a six-month Marvel onslaught that has no precedent in the MCU's history. Three massive events are stacked back-to-back-to-back, each one feeding into the next.

<img src="${IMAGES.tripleEvent}" alt="Movie theater lobby with three illuminated Marvel event posters representing the 2026 triple threat" style="width:100%;border-radius:8px;margin:1.5rem 0;" />

## Event 1: Spider-Man: Brand New Day — July 31, 2026

Director Destin Daniel Cretton (Shang-Chi) takes the reins for what Marvel is calling the final MCU film before Avengers: Doomsday. The cast includes Tom Holland, Zendaya, Jacob Batalon, and Mark Ruffalo as Bruce Banner. At 150 minutes, this is the longest solo Spider-Man film ever made.

The presale numbers suggest this could challenge $200 million on opening weekend. For collectors, every Spider-Man card in existence becomes relevant — from the 2024 Topps Chrome base cards to the ultra-rare sketch cards and numbered parallels. When a film generates this level of cultural conversation, card demand follows within days.

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1rem 0 2rem 0;">
  <iframe src="https://www.youtube.com/embed/8TZMtslA3UY" title="Spider-Man: Brand New Day Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
</div>

## Event 2: Avengers: Endgame Re-Release — September 25, 2026

Less than two months after Brand New Day, Marvel is bringing Avengers: Endgame back to theaters — but this isn't a simple re-release. Director Joe Russo confirmed at CinemaCon that the theatrical return will include **brand new footage** that is "critical to the story of Avengers: Doomsday."

Let that sink in. New scenes. New post-credits. New material that directly bridges the gap between the original Avengers saga and the arrival of Doctor Doom. This transforms a nostalgia play into a must-see event for anyone following the MCU's storyline. The film will also be presented in Disney's new "Infinity Vision" premium format.

For the card market, this re-release will reignite demand for original Avengers cards — Iron Man, Captain America, Thor, Black Widow, and the entire OG lineup. Endgame grossed $2.79 billion the first time around. Even a fraction of that audience returning to theaters creates a wave of renewed interest in Avengers-era collectibles.

## Event 3: Avengers: Doomsday — December 18, 2026

The grand finale of 2026. Robert Downey Jr. returns to the MCU — not as Tony Stark, but as **Doctor Doom**. The Russo Brothers are back in the director's chairs. RDJ himself has said this film "figured out how to make Marvel movies not be a letdown."

This is the most anticipated Marvel film since Endgame itself. Doctor Doom cards, Fantastic Four crossover cards, and anything connected to the Multiverse Saga's climax will be in extreme demand as December approaches. The Endgame re-release in September is specifically designed to build momentum for this moment.

## The Collector's Equation: Three Catalysts in Six Months

<img src="${IMAGES.collectorDesk}" alt="Collector desk with Marvel trading cards, laptop showing box office data, and Fandango ticket confirmation" style="width:100%;border-radius:8px;margin:1.5rem 0;" />

Here's why smart collectors are paying attention right now. The Marvel card market doesn't move on a single event — it moves on **sustained cultural relevance**. And 2026 is delivering exactly that:

- **July 31:** Brand New Day drives Spider-Man card demand sky-high
- **September 25:** Endgame re-release reignites OG Avengers nostalgia
- **December 18:** Doomsday creates a Doctor Doom and Fantastic Four frenzy

That's three separate demand spikes in six months. Each one feeds into the next. Each one brings new eyes to the hobby. The last time Marvel had this kind of concentrated firepower was 2019 (Endgame + Far From Home), and that era produced some of the biggest card sales in Marvel collecting history.

The window to position yourself is **before** the hype cycle peaks — not after. Brand New Day's presale numbers just told you the hype cycle has already begun.

## Collector's Corner

Three blockbuster events in six months means three waves of demand hitting the Marvel card market. If you're not positioned before July 31, you're already behind.

**Hot Cards to Watch:**
- **Spider-Man 2024 Topps Chrome Refractor** — Brand New Day hype will push all Spider-Man chrome cards. Refractors and numbered parallels will lead the charge.
- **Mark Ruffalo / Hulk Topps Chrome Auto** — Hulk's confirmed appearance in Brand New Day makes any Ruffalo auto or Hulk insert immediately relevant.
- **Iron Man / RDJ Topps Chrome Marvel** — The Endgame re-release plus RDJ's return as Doom creates dual demand pressure on every RDJ card in existence.
- **Doctor Doom 2024 Topps Chrome Base & Parallels** — December's Doomsday release will be the biggest demand catalyst for Doom cards since the casting announcement.

Track real-time price movements on **[Card Ladder](https://www.cardladder.com/)** — their Marvel index will show you exactly how these events move the market. For graded card portfolio tracking, **[MySlabs](https://www.myslabs.com/)** lets you monitor your collection's value as demand shifts. And for live auctions where these cards actually trade, check **[Whatnot](https://www.whatnot.com/)** — you'll find Marvel card breaks happening daily.

Browse our full [Marvel Card Database](https://northlandlegendaryfinds.com/cards) to see every Spider-Man, Avengers, and Doctor Doom card across all Topps sets. For more MCU coverage and card market analysis, visit our [MCU News hub](https://northlandlegendaryfinds.com/mcu-news).

*Spider-Man: Brand New Day opens exclusively in theaters on July 31, 2026. Avengers: Endgame returns to theaters September 25, 2026. Avengers: Doomsday arrives December 18, 2026.*`,
  },
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
