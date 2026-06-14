/**
 * Publish Phase 8: The Mutant Saga — MCU Phases 6, 7 & 8 Overview Article
 * Run from project root: node publish-phase8-mutant-saga.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/phase8-hero-mutant-saga-8MCDWVvgiXEvLNDLSvU2wV.webp",
  midnightSons: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/phase8-midnight-sons-7QthVnSaikTDg3TELGcHQz.webp",
  xmenTeam: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/phase8-xmen-team-LZDKNygvc4GcL28JRHphqN.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Phase 8: The Mutant Saga — Everything We Know About the MCU's Next Chapter",
    slug: "mcu-phase-8-mutant-saga-everything-we-know-2026",
    excerpt: "After Avengers: Secret Wars closes the Multiverse Saga in December 2027, Marvel Studios is expected to launch Phase 8 — The Mutant Saga. Here's a full breakdown of every rumored title, what we know about Phase 6 and 7 first, and what it all means for your collection.",
    featuredImageUrl: IMAGES.hero,
    category: "movie_news",
    tags: JSON.stringify(["Phase 8", "Mutant Saga", "X-Men", "Wolverine", "Scarlet Witch", "Young Avengers", "Midnight Sons", "Spider-Man", "Avengers vs X-Men", "MCU Future", "Phase 6", "Phase 7"]),
    relatedCharacters: JSON.stringify(["Wolverine", "Scarlet Witch", "Spider-Man", "Miles Morales", "Moon Knight", "Blade", "Ghost Rider", "Cyclops", "Storm", "Captain America", "Kate Bishop", "Kamala Khan"]),
    cardMarketImpact: "Phase 8 speculation is already moving X-Men, Wolverine, and Scarlet Witch cards. Once Marvel officially confirms any of these titles, expect immediate price spikes across the board — especially for first appearances and key variant cards.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "MCU Phase 8: The Mutant Saga breakdown — all 8 rumored titles including Wolverine, Scarlet Witch, Young Avengers, Midnight Sons, Spider-Man Miles Morales, and Avengers vs X-Men. Plus Phase 6 and 7 confirmed dates.",
    sources: JSON.stringify([
      { title: "Marvel Studios Sets Historic MCU Lineup For Phase 6 & 7 Movie Slate", url: "https://thedirect.com/article/marvel-studios-mcu-phase-6-7-movie-slate-lineup" },
      { title: "Every Marvel Movie and TV Show Coming in 2026 and Beyond", url: "https://www.polygon.com/marvel-movies-tv-release-calendar-upcoming-mcu/" },
      { title: "Marvel Phase 6 — All the MCU Release Dates You Need", url: "https://www.digitalspy.com/movies/a40742778/marvel-phase-6-movies-tv-shows-mcu/" },
    ]),
    contentMarkdown: `The Marvel Cinematic Universe is about to undergo its most dramatic transformation since Iron Man stepped out of that cave in 2008. With Phase 6 locked in through December 2027 and Phase 7 beginning to take shape, the fan community has been buzzing about what comes next — and a circulating slate of eight titles under the banner **"Phase 8: The Mutant Saga"** has collectors and fans alike paying very close attention.

Before we dive into the Phase 8 speculation, let's get grounded in what Marvel Studios has actually confirmed, because the road to the Mutant Saga runs directly through some of the biggest films in MCU history.

---

## Phase 6: The Multiverse Saga Comes to a Close

Phase 6 is fully confirmed and already underway. Marvel Studios has mapped out a dense slate that will bring the Multiverse Saga to its conclusion by the end of 2027.

<img src="${IMAGES.hero}" alt="The MCU's Mutant Saga era — a new chapter begins after Secret Wars" style="width:100%;border-radius:12px;margin:1.5rem 0;" />

The phase kicked off with **Daredevil: Born Again Season 2** on March 4, 2026 (Disney+), followed by **The Punisher: One Last Kill** on May 12, 2026. The theatrical centerpiece of the summer is **Spider-Man: Brand New Day** on July 31, 2026, directed by Destin Daniel Cretton — the same filmmaker who helmed *Shang-Chi and the Legend of the Ten Rings*. Tom Holland has been openly discussing his MCU future, hinting that Brand New Day may be setting the stage for a new generation of Spider-Man, with Miles Morales increasingly positioned as his successor.

The Phase 6 calendar then builds toward its two biggest events: **Avengers: Doomsday** on December 18, 2026, and **Avengers: Secret Wars** on December 17, 2027. Both films are directed by Joe and Anthony Russo — the team behind *Infinity War* and *Endgame* — and both will feature Robert Downey Jr. in his return to the MCU as the villainous Doctor Doom. Secret Wars is confirmed as the 40th MCU film and the definitive conclusion to the Multiverse Saga.

| Film / Show | Date | Platform |
|---|---|---|
| Daredevil: Born Again S2 | March 4, 2026 | Disney+ |
| The Punisher: One Last Kill | May 12, 2026 | Disney+ |
| Spider-Man: Brand New Day | July 31, 2026 | Theaters |
| X-Men '97 Season 2 | Summer 2026 | Disney+ |
| Avengers: Doomsday | December 18, 2026 | Theaters |
| VisionQuest | TBA 2026 | Disney+ |
| Spider-Man: Beyond the Spider-Verse | June 18, 2027 | Theaters |
| Avengers: Secret Wars | December 17, 2027 | Theaters |

---

## Phase 7: The X-Men Arrive

Phase 7 is where the MCU's mutant era officially begins. Marvel has five confirmed release dates for 2028 and 2029 but has not yet attached specific titles to them — a deliberate strategy to build anticipation heading out of Secret Wars.

What is widely expected is that **Black Panther 3**, directed by Ryan Coogler, will arrive early in Phase 7. Coogler directed both previous Black Panther films and is set to become only the fourth director in MCU history to complete a trilogy.

More significantly, the **MCU X-Men reboot** — directed by Jake Schreier, who helmed the critically acclaimed *Thunderbolts\** — is expected to be one of the first Phase 7 films. No official title or cast has been announced, but the project is real and in development. This will be the moment mutants are formally introduced into the main MCU timeline, setting the stage for everything that follows.

<img src="${IMAGES.xmenTeam}" alt="The X-Men are coming to the MCU in Phase 7 — directed by Jake Schreier" style="width:100%;border-radius:12px;margin:1.5rem 0;" />

For collectors, the X-Men's arrival in the MCU is a watershed moment. Browse the [NLF card database](https://northlandlegendaryfinds.com/cards) and you'll find X-Men characters already well-represented in sets like **Topps Finest X-Men '97 (2025)** and **Topps Chrome Marvel (2024)**. Once casting is confirmed and a trailer drops, those cards will move fast.

---

## Phase 8: The Mutant Saga — The Rumored Slate

Now for the part that has the internet buzzing. A widely-shared image has been circulating that lays out eight titles under the "Phase 8: The Mutant Saga" banner. It's important to note that **this is not an official Marvel Studios announcement** — it's a fan-compiled slate based on industry rumors, credible leaks, and logical storytelling progression. But the individual titles align closely enough with what insiders have been reporting that it's worth breaking down each one.

### Scarlet Witch

Elizabeth Olsen has been vocal about wanting to return to the MCU, and a solo Scarlet Witch film has been rumored for the 2027–2028 window. Wanda Maximoff's story ended ambiguously in *Doctor Strange in the Multiverse of Madness*, and her connection to the mutant gene — she is canonically a mutant in the comics — makes her a natural bridge character between the Avengers era and the Mutant Saga.

### Captain America: Serpent Society

Sam Wilson (Anthony Mackie) has already encountered the Serpent Society as a criminal mercenary organization in *Captain America: Brave New World*. A dedicated Serpent Society film would give Sam his own villain-focused story and deepen the post-Steve Rogers Captain America mythology.

### Young Avengers

The groundwork for a Young Avengers team has been laid across multiple MCU projects. Kate Bishop (Hawkeye), Kamala Khan (Ms. Marvel), Cassie Lang (Ant-Man and the Wasp: Quantumania), America Chavez (Doctor Strange in the Multiverse of Madness), and Billy and Tommy Maximoff are all established in the MCU. A Young Avengers film would be the natural next step for this generation of heroes. Explore the [Marvel Characters section](https://northlandlegendaryfinds.com/characters) to see how many of these characters already have significant card presence.

### Spider-Man: One Last Day

Tom Holland has been openly discussing his MCU exit, and the title "One Last Day" is a direct nod to the controversial *One More Day* comic arc. This would likely be Holland's farewell film while simultaneously setting up Miles Morales as the new Spider-Man — a passing-of-the-torch moment that Marvel has been building toward since *Brand New Day*.

### Midnight Sons

<img src="${IMAGES.midnightSons}" alt="The Midnight Sons — Moon Knight, Blade, and Ghost Rider form Marvel's supernatural team" style="width:100%;border-radius:12px;margin:1.5rem 0;" />

Reports from early 2026 indicated that Marvel's Midnight Sons film would feature eight supernatural heroes: Doctor Strange, Ghost Rider, Moon Knight, Wong, Blade, Black Knight, Werewolf by Night, and Scarlet Scarab. This is Marvel's answer to the supernatural corner of its universe — a team built around characters who deal with magic, monsters, and the occult. Moon Knight and Blade cards have been quietly appreciating in anticipation of this project.

### Wolverine: Enemy of the State

"Enemy of the State" is one of the most celebrated Wolverine comic arcs, in which Logan is brainwashed by HYDRA and the Hand and turned into an assassin targeting his own allies. With Hugh Jackman's Wolverine now firmly in the MCU following *Deadpool & Wolverine*, a solo film built around this arc would be a massive event. Wolverine cards — particularly from **Topps Chrome Marvel (2024)** and the Deadpool & Wolverine insert sets — are already among the most sought-after in the modern Marvel card market.

### Spider-Man: Miles Morales

Kevin Feige has confirmed that Miles Morales is coming to the MCU in live-action. With Tom Holland setting up Miles in *Brand New Day* and the animated *Spider-Man: Beyond the Spider-Verse* arriving in June 2027, the timing for a live-action Miles Morales solo film in Phase 8 makes perfect sense. This will be one of the most significant card market events of the decade — first-appearance Miles Morales cards will be in extreme demand once casting is announced.

### Avengers vs. X-Men

The Phase 8 closer, if this slate is accurate, would be the MCU's adaptation of the landmark *Avengers vs. X-Men* comic event — a conflict centered on the Phoenix Force and the question of whether mutants or Avengers should control it. This would be the culminating event of the Mutant Saga, bringing together the established Avengers roster and the new MCU X-Men in a conflict that reshapes the entire universe.

---

## What This Means for Your Collection

Phase 8 speculation is already creating movement in the card market. The key principle here is simple: **buy before the announcement, not after**. By the time Marvel officially confirms these titles, prices will have already moved.

The characters with the most upside right now are those who are rumored but not yet confirmed in their own projects: Wolverine in a solo context, Miles Morales in live-action, and the Midnight Sons roster. Check the latest market data on **[Card Ladder](https://www.cardladder.com/)** for price trend tracking, and browse **[TCGPlayer](https://www.tcgplayer.com/)** for real-time marketplace pricing on key Marvel singles.

## Collector's Corner

The Mutant Saga era represents the single biggest expansion of the MCU since the Infinity Saga began. Every character on this Phase 8 slate has existing card representation — and every one of them stands to appreciate significantly as Marvel makes official announcements.

**Hot Cards to Watch:**

- **Wolverine Topps Chrome Marvel (2024) Refractor Auto** — The most in-demand Wolverine card in the modern era; any solo film announcement will push this to new highs
- **Miles Morales Topps Marvel Studios Chrome (2024) Base PSA 10** — Live-action confirmation will be a watershed moment for this card
- **Moon Knight Topps Chrome Marvel (2024) Superfractor** — Midnight Sons speculation is already driving interest in this ultra-rare
- **Scarlet Witch Topps Brooklyn Collection Marvel (2025) Base** — Elizabeth Olsen's return will reignite demand for her premium cards

Track sold comps and price history on **[MySlabs](https://www.myslabs.com/)** for portfolio management, and check **[eBay sold listings](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** for real transaction prices on these key cards.

*Avengers: Secret Wars hits theaters December 17, 2027 — after that, the Mutant Saga begins.*`,
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
    "SELECT id, title, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 5"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : '      '}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
