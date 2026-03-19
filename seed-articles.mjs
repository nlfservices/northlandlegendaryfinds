import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';

const db = drizzle(process.env.DATABASE_URL);

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-hero-VcDNx3cvdPSwJjVGxWMfTo.webp";
const CARD_MARKET_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-card-market-Lt56dsta4y7Hzfj6pzAysR.webp";

const articles = [
  {
    title: "Avengers: Doomsday vs. Dune 3 — The December Box Office Showdown",
    slug: "avengers-doomsday-vs-dune-3-december-showdown",
    excerpt: "Both Marvel's Avengers: Doomsday and Legendary's Dune 3 are locked in for December 18, 2026. Theater owners are worried about cannibalization, but collectors see opportunity.",
    contentMarkdown: `## The December 18 Collision

Two of the most anticipated films of 2026 are set to collide on the same release date: **Avengers: Doomsday** and **Dune: Part Three**. According to [The Hollywood Reporter](https://www.hollywoodreporter.com/movies/movie-news/dune-3-avengers-doomsday-dec-18-date-1236540250/), theater owners are increasingly concerned about the two tentpoles cannibalizing each other's box office.

## What This Means for Marvel

Avengers: Doomsday was originally slated for May 1, 2026, but was pushed to December 18 — a move that signals Marvel's confidence in the project. With Robert Downey Jr. returning as Doctor Doom and the Russo Brothers back in the director's chairs, Marvel is betting big on this being a cultural event on par with Endgame.

## The Card Market Angle

For collectors, this date shift is significant. The extended runway means more time for hype to build, which historically drives card prices up. When Endgame was announced, key character cards saw 30-50% price increases in the months leading up to release.

**Key cards to watch:**
- Doctor Doom variants across all 2025 Topps sets
- Iron Man cards (the RDJ connection)
- Any Fantastic Four crossover cards

## Our Take

The December date actually benefits collectors. Holiday season + massive movie release = peak demand for Marvel merchandise, including trading cards. If you're holding Doomsday-adjacent cards, the next 9 months could see steady appreciation.

> "Every major MCU event creates a ripple effect in the card market. Doomsday won't be different — it'll be bigger." — NLF Team`,
    featuredImageUrl: HERO_IMG,
    category: "movie_news",
    tags: JSON.stringify(["Avengers", "Doomsday", "Doctor Doom", "Box Office"]),
    cardMarketImpact: "Doctor Doom and Avengers character cards trending upward ahead of December release",
    relatedCharacters: JSON.stringify(["Doctor Doom", "Iron Man", "Captain America", "Spider-Man"]),
    sources: JSON.stringify([
      { title: "Hollywood Reporter — Dune 3 and Doomsday Date Standoff", url: "https://www.hollywoodreporter.com/movies/movie-news/dune-3-avengers-doomsday-dec-18-date-1236540250/" },
      { title: "ComicBook.com — Doomsday Setting Up Darkest Secret Wars Twist", url: "https://comicbook.com/movies/feature/marvels-avengers-doomsday-is-setting-up-the-darkest-secret-wars-twist/" },
    ]),
    isFeatured: true,
    isPublished: true,
    authorName: "NLF Team",
    publishedAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    metaDescription: "Avengers Doomsday and Dune 3 compete for December 18, 2026. What the box office showdown means for Marvel trading card collectors.",
  },
  {
    title: "Spider-Man: Brand New Day Trailer Drops — Card Market Reacts",
    slug: "spider-man-brand-new-day-trailer-card-market",
    excerpt: "The first full trailer for Spider-Man: Brand New Day hit this week, revealing Tom Holland's return four years after No Way Home. Here's what it means for your Spider-Man cards.",
    contentMarkdown: `## The Trailer Everyone Was Waiting For

Sony and Marvel Studios dropped the first full trailer for **Spider-Man: Brand New Day** on March 14, 2026, and the internet broke. Directed by Destin Daniel Cretton (Shang-Chi), the film picks up four years after the devastating ending of No Way Home and is set for a **July 31, 2026** theatrical release.

## What We Know

The trailer reveals several key plot points:
- Peter Parker is rebuilding his life, still anonymous after Doctor Strange's spell
- A new villain threat emerges (heavily rumored to be connected to the multiverse)
- The film is described as "inspired by the Brand New Day comic storyline"
- This is Phase Six of the MCU, setting up threads for Doomsday

## Spider-Man Card Market Impact

Spider-Man has always been the most collected Marvel character in the trading card space. The trailer drop created immediate market movement:

**Immediate reactions:**
- 2025 Topps Chrome Spider-Man base cards saw a 15% uptick in sales volume
- Spider-Man insert cards from Marvel Sapphire are commanding premium prices
- Numbered parallels (/99, /50, /25) are being snapped up by speculators

**Cards to watch:**
- Any Spider-Man cards from 2025 Topps Chrome (the flagship set)
- Spider-Man Sapphire Edition cards
- Variant covers and special inserts featuring Spider-Man

## The NLF Connection

Our repack checklists include multiple Spider-Man cards across all tiers. With the movie hype building, these cards represent strong value in every pack.

> Spider-Man cards are the blue-chip stocks of Marvel collecting. A new movie trailer is like an earnings beat — expect upward momentum.`,
    featuredImageUrl: CARD_MARKET_IMG,
    category: "movie_news",
    tags: JSON.stringify(["Spider-Man", "Brand New Day", "Tom Holland", "Trailer", "Card Market"]),
    cardMarketImpact: "Spider-Man card prices up 15% in sales volume following trailer release",
    relatedCharacters: JSON.stringify(["Spider-Man"]),
    sources: JSON.stringify([
      { title: "Sony Pictures — Spider-Man: Brand New Day Official Trailer", url: "https://www.youtube.com/watch?v=vXGNDjiTB48" },
      { title: "Digital Spy — Marvel Phase 6 Release Dates", url: "https://www.digitalspy.com/movies/a40742778/marvel-phase-6-movies-tv-shows-mcu/" },
    ]),
    isFeatured: true,
    isPublished: true,
    authorName: "NLF Team",
    publishedAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    metaDescription: "Spider-Man Brand New Day trailer analysis and its impact on Marvel trading card prices. What collectors need to know.",
  },
  {
    title: "Daredevil: Born Again Season 2 Premieres — The Street-Level Card Surge",
    slug: "daredevil-born-again-season-2-card-surge",
    excerpt: "Daredevil: Born Again Season 2 just hit Disney+ on March 24. Here's why street-level Marvel character cards are seeing renewed collector interest.",
    contentMarkdown: `## Hell's Kitchen Returns

**Daredevil: Born Again Season 2** premiered on Disney+ on March 24, 2026, continuing the critically acclaimed return of Charlie Cox as Matt Murdock. The second season expands the street-level corner of the MCU and has been generating significant buzz among both viewers and collectors.

## Why Street-Level Characters Matter for Cards

The MCU's street-level heroes — Daredevil, Punisher, Kingpin, Elektra — have historically been undervalued in the trading card market compared to cosmic-level characters. But Born Again is changing that calculus.

**Market observations:**
- Daredevil cards from 2025 Topps Chrome have seen steady demand increases
- Kingpin (Wilson Fisk) cards are gaining traction as his MCU role expands
- The Punisher Special (coming later in 2026) is creating anticipation for Punisher cards

## The Punisher Special Connection

Marvel has confirmed a **Punisher One-Shot Special** for Disney+ later in 2026. This means Jon Bernthal's Frank Castle is getting his own spotlight, which historically drives card prices for the featured character.

## Cards to Watch

- Daredevil base and insert cards across all 2025 sets
- Kingpin/Wilson Fisk cards (increasingly important MCU villain)
- Punisher cards (ahead of the special)
- Elektra and Bullseye cards (key Born Again characters)

## Our Take

Street-level Marvel cards are the sleeper picks of 2026. While everyone is focused on Doomsday and cosmic characters, the Born Again franchise is quietly building a dedicated collector base. Smart money is accumulating these cards now.`,
    featuredImageUrl: HERO_IMG,
    category: "show_news",
    tags: JSON.stringify(["Daredevil", "Born Again", "Disney+", "Punisher", "Kingpin"]),
    cardMarketImpact: "Street-level character cards (Daredevil, Kingpin, Punisher) seeing 10-20% demand increase",
    relatedCharacters: JSON.stringify(["Daredevil"]),
    sources: JSON.stringify([
      { title: "Disney+ — New Releases March 2026", url: "https://www.disneyplus.com/explore/articles/new-to-disney-plus" },
      { title: "GamesRadar — Marvel Phase 6 Release Dates", url: "https://www.gamesradar.com/marvel-phase-6-movies-shows/" },
    ]),
    isFeatured: false,
    isPublished: true,
    authorName: "NLF Team",
    publishedAt: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    metaDescription: "Daredevil Born Again Season 2 premiere drives interest in street-level Marvel character trading cards.",
  },
  {
    title: "Collectibles Market Hits $602.4 Billion — What It Means for Marvel Cards",
    slug: "collectibles-market-602-billion-2026",
    excerpt: "New industry data shows the global collectibles market reaching $602.4 billion in 2026, growing at 6.4% CAGR. Marvel trading cards are riding the wave.",
    contentMarkdown: `## The Numbers Don't Lie

According to a new report from [Market Decipher](https://www.prnewswire.com/news-releases/collectibles-market-size-to-jump-at-6-4-cagr-reaching-602-4-billion-market-size-in-2026-market-decipher-302715918.html), the global collectibles market is projected to reach **$602.4 billion in 2026**, growing at a compound annual growth rate of 6.4%.

## Trading Cards Leading the Charge

Within the broader collectibles space, trading cards continue to be one of the fastest-growing segments. The combination of nostalgia, investment potential, and new product innovation is driving unprecedented interest.

**Key market drivers:**
- **MCU content pipeline**: With 7+ Marvel releases in 2026 alone, there's constant fuel for collector interest
- **Topps product innovation**: The 2025 Marvel sets (Chrome, Sapphire, Comic Book Heroes, Mint, Brooklyn Collection, Cosmic) introduced new parallel types and chase cards
- **Digital-physical convergence**: Platforms like Whatnot are making live card breaking more accessible than ever
- **Generational shift**: Millennials and Gen Z are entering the hobby with fresh capital and digital-native buying habits

## Marvel's Position in the Market

Marvel trading cards occupy a unique position in the market. Unlike sports cards, which are tied to player performance, Marvel cards are driven by:

1. **Content releases** — Every new movie or show creates demand spikes
2. **Character popularity** — Evergreen characters like Spider-Man and Iron Man maintain baseline demand
3. **Scarcity mechanics** — Numbered parallels and limited inserts create natural price floors
4. **Cross-collector appeal** — Comic fans, MCU fans, and pure investors all participate

## What This Means for NLF Collectors

The rising tide lifts all boats. A growing collectibles market means:
- More buyers competing for the same limited supply of premium cards
- Higher baseline values for quality cards in our repacks
- Stronger long-term appreciation potential for chase and hit-tier cards

> The collectibles market isn't just growing — it's maturing. And mature markets reward quality over quantity. That's exactly what NLF delivers.`,
    featuredImageUrl: CARD_MARKET_IMG,
    category: "card_market",
    tags: JSON.stringify(["Market Analysis", "Collectibles", "Industry Data", "Investment"]),
    cardMarketImpact: "Collectibles market at $602.4B with 6.4% growth — strong tailwind for Marvel card values",
    relatedCharacters: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "Market Decipher — Collectibles Market Size Report 2026", url: "https://www.prnewswire.com/news-releases/collectibles-market-size-to-jump-at-6-4-cagr-reaching-602-4-billion-market-size-in-2026-market-decipher-302715918.html" },
    ]),
    isFeatured: true,
    isPublished: true,
    authorName: "NLF Team",
    publishedAt: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    metaDescription: "Global collectibles market reaches $602.4 billion in 2026. Analysis of what this means for Marvel trading card collectors and investors.",
  },
  {
    title: "Secret Wars Production Begins — The Endgame of Card Collecting",
    slug: "secret-wars-production-begins-card-collecting",
    excerpt: "Avengers: Secret Wars is officially entering production at Pinewood Studios in the UK, filming from April to September 2026. This is the biggest MCU event since Endgame.",
    contentMarkdown: `## The Final Chapter Begins

**Avengers: Secret Wars** is officially entering production. According to multiple industry sources, filming is set to begin at Pinewood Studios in the UK from **April 2026 through September 2026**, with the film slated for a **December 17, 2027** release.

## Why Secret Wars Is the Endgame of This Era

Secret Wars isn't just another Avengers movie — it's being positioned as the culmination of the entire Multiverse Saga, similar to how Endgame wrapped up the Infinity Saga. The film is expected to:

- Bring together characters from across the multiverse
- Feature the largest ensemble cast in MCU history
- Potentially introduce the X-Men and Fantastic Four into the main MCU timeline
- Serve as a soft reboot point for the franchise

## The Card Market Implications Are Massive

If Endgame taught us anything, it's that the final chapter of a saga creates the biggest market movement. During the Endgame era:

- Key character cards appreciated 50-100% in the 6 months before release
- Limited edition cards saw even larger gains
- Post-release, cards featuring characters who had significant moments held their value

**For Secret Wars, watch these categories:**
- Any card featuring characters confirmed for both Doomsday and Secret Wars
- Multiverse variant cards (thematically relevant)
- First appearance cards for characters making their MCU debut
- Doctor Doom cards (the central villain of the saga)

## The Two-Year Runway

With Secret Wars not releasing until December 2027, collectors have a unique opportunity. The two-year runway from now means:

1. **Accumulation phase** (now through mid-2026): Smart money is building positions
2. **Hype phase** (late 2026 through mid-2027): Doomsday release drives awareness
3. **Peak phase** (late 2027): Maximum demand as Secret Wars approaches

## Our Recommendation

This is the time to be building your collection. The cards in NLF repacks are positioned perfectly for the Secret Wars wave — we've loaded our checklists with characters who are confirmed or rumored for the film.`,
    featuredImageUrl: HERO_IMG,
    category: "movie_news",
    tags: JSON.stringify(["Secret Wars", "Avengers", "Production", "Multiverse", "Investment"]),
    cardMarketImpact: "Secret Wars production start signals 18-month appreciation window for key character cards",
    relatedCharacters: JSON.stringify(["Doctor Doom", "Spider-Man", "Iron Man", "Captain America", "Wolverine"]),
    sources: JSON.stringify([
      { title: "Reddit — Secret Wars Starting Production at Pinewood Studios", url: "https://www.reddit.com/r/MarvelStudiosSpoilers/comments/1r9vbpw/filmbase_uk_avengers_secret_wars_is_starting/" },
      { title: "Wikipedia — Production of Doomsday and Secret Wars", url: "https://en.wikipedia.org/wiki/Production_of_Avengers:_Doomsday_and_Avengers:_Secret_Wars" },
      { title: "LA Times — Doomsday and Secret Wars Release Dates Pushed Back", url: "https://www.latimes.com/entertainment-arts/movies/story/2025-05-23/avengers-doomsday-avengers-secret-wars-new-release-dates" },
    ]),
    isFeatured: false,
    isPublished: true,
    authorName: "NLF Team",
    publishedAt: Date.now() - 1000 * 60 * 60 * 96, // 4 days ago
    metaDescription: "Avengers Secret Wars enters production. Analysis of the 18-month card market opportunity for Marvel collectors.",
  },
  {
    title: "MCU Phase 6 Complete Release Calendar — Every Movie & Show in 2026",
    slug: "mcu-phase-6-complete-release-calendar-2026",
    excerpt: "From Daredevil: Born Again Season 2 to Avengers: Doomsday, here's every confirmed MCU release for 2026 and what each means for the card market.",
    contentMarkdown: `## Your 2026 MCU Calendar

2026 is shaping up to be one of the biggest years in MCU history. Here's every confirmed release and what collectors should know about each.

---

### Already Released

**Wonder Man** — January 27, 2026 (Disney+)
The newest Disney+ series introduced Simon Williams to the MCU. While not a major card mover on its own, Wonder Man cards from 2025 sets saw modest gains.

**Daredevil: Born Again Season 2** — March 24, 2026 (Disney+)
Just premiered. Street-level character cards are trending upward (see our separate analysis).

---

### Upcoming Releases

**The Punisher Special** — 2026 (Disney+)
Jon Bernthal returns for a one-shot special. Punisher cards are undervalued right now — this could be the catalyst.

**Spider-Man: Brand New Day** — July 31, 2026
Tom Holland's fourth solo film. Spider-Man cards are always in demand, but expect a significant spike around the July release window.

**X-Men '97 Season 2** — 2026 (Disney+)
The beloved animated series returns. X-Men cards have a dedicated collector base that's separate from (but overlapping with) the MCU card market.

**Avengers: Doomsday** — December 18, 2026
The main event. Doctor Doom, the Avengers, and the beginning of the end of the Multiverse Saga. This will be the single biggest card market catalyst of the year.

**VisionQuest** — Late 2026 (Disney+)
Vision's solo series. Could create movement for Vision and Scarlet Witch cards.

---

## The Collector's Strategy

With this many releases, the key is timing your acquisitions:

1. **Q1-Q2**: Accumulate Doomsday character cards while attention is on Daredevil and Spider-Man
2. **Q3**: Spider-Man release drives overall Marvel card interest — ride the wave
3. **Q4**: Doomsday release creates peak demand — this is when your earlier acquisitions pay off

## NLF's Role

Our repacks are designed to give you exposure to all these characters. Every pack includes cards that span the full MCU roster, so you're naturally diversified across the 2026 release calendar.`,
    featuredImageUrl: HERO_IMG,
    category: "release_dates",
    tags: JSON.stringify(["Phase 6", "Release Calendar", "2026", "MCU Schedule"]),
    cardMarketImpact: "7 MCU releases in 2026 create sustained demand for Marvel cards throughout the year",
    relatedCharacters: JSON.stringify(["Spider-Man", "Daredevil", "Doctor Doom"]),
    sources: JSON.stringify([
      { title: "GamesRadar — Marvel Phase 6 Release Dates", url: "https://www.gamesradar.com/marvel-phase-6-movies-shows/" },
      { title: "Digital Spy — MCU Phase 6 Complete Guide", url: "https://www.digitalspy.com/movies/a40742778/marvel-phase-6-movies-tv-shows-mcu/" },
      { title: "IMDb — Marvel Series Coming to Disney+ in 2026", url: "https://www.imdb.com/news/ni65518113/" },
    ]),
    isFeatured: false,
    isPublished: true,
    authorName: "NLF Team",
    publishedAt: Date.now() - 1000 * 60 * 60 * 120, // 5 days ago
    metaDescription: "Complete MCU Phase 6 release calendar for 2026. Every movie, show, and their impact on Marvel trading card prices.",
  },
];

async function seed() {
  console.log("Seeding articles...");
  for (const article of articles) {
    try {
      await db.execute({
        sql: `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        params: [
          article.title, article.slug, article.excerpt, article.contentMarkdown,
          article.featuredImageUrl, article.category, article.tags,
          article.cardMarketImpact, article.relatedCharacters, article.sources,
          article.isFeatured ? 1 : 0, article.isPublished ? 1 : 0,
          article.authorName, article.publishedAt, article.metaDescription,
        ],
      });
      console.log(`  ✓ ${article.title}`);
    } catch (err) {
      console.error(`  ✗ ${article.title}:`, err.message);
    }
  }
  console.log("Done!");
  process.exit(0);
}

seed();
