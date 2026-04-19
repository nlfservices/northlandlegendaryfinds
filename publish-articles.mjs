/**
 * Publish MCU News Articles directly to database
 * Run from project root: node publish-articles.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs
const IMAGES = {
  cinemacon: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/article-doomsday-cinemacon-LqwBHzJ8iNxwX4oGcpRUCU.webp",
  screening: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/article-doomsday-screening-UYc5GZ5WRcfujXNCXQQDAh.webp",
  spiderman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/article-spiderman-brandnewday-XARg96heB3CW7exaHV5yXa.webp",
  f4: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/article-fantastic-four-boxoffice-FfpiRAvHsvnaJ4CmocxnkJ.webp",
  phase6: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/article-phase6-roadmap-hMuWuzJfcZZZvvUfQdPLeo.webp",
};

const now = Date.now();

const articles = [
  {
    title: "RDJ Unveils 'Trailer of Doom' at CinemaCon 2026 — Everything We Know About Avengers: Doomsday",
    slug: "rdj-unveils-trailer-of-doom-cinemacon-2026",
    excerpt: "Robert Downey Jr. took the CinemaCon stage to debut the first Avengers: Doomsday trailer, revealing Doctor Doom's terrifying multiverse entrance, mutant crossovers, and a December 18 release date.",
    featuredImageUrl: IMAGES.cinemacon,
    category: "movie_news",
    tags: JSON.stringify(["Avengers Doomsday", "CinemaCon", "Doctor Doom", "Robert Downey Jr", "MCU", "Russo Brothers"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Iron Man", "Mystique", "Yelena Belova", "Steve Rogers"]),
    cardMarketImpact: "Doctor Doom and Iron Man cards are surging on the secondary market. Expect Topps Chrome Doom variants and any RDJ-related inserts to spike as trailer hype builds toward December.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "RDJ debuts the Avengers Doomsday trailer at CinemaCon 2026. Doctor Doom emerges from the multiverse, mutants confirmed, and the MCU will never be the same.",
    sources: JSON.stringify([
      { title: "Rotten Tomatoes - RDJ at CinemaCon", url: "https://www.facebook.com/rottentomatoes/videos/1058435843690213/" },
      { title: "Fandango - Kevin Feige Confirms Timeline", url: "https://www.instagram.com/reel/DXNgyqdGc6H/" },
    ]),
    contentMarkdown: `The moment Marvel fans have been waiting for finally arrived on April 17, 2026, when Robert Downey Jr. walked onto the CinemaCon stage in Las Vegas to personally introduce the first trailer for *Avengers: Doomsday*. Dubbed the "Trailer of Doom," the footage sent shockwaves through the packed auditorium and immediately became the most talked-about reveal of the entire convention.

## What the Trailer Showed

According to multiple attendees and industry reporters, the trailer opens with a collapsing multiverse rift — a visual spectacle that dwarfs anything we have seen in previous MCU entries. From within the chaos emerges Doctor Doom, fully armored in his iconic green cloak and metallic mask, portrayed by Robert Downey Jr. in what is being described as a "terrifying and commanding" performance. The footage reportedly shows Doom's scarred face beneath the mask in a brief but haunting close-up that left the audience stunned.

The trailer also features Steve Rogers wielding Mjolnir once again, rubble from what appears to be the Xavier Institute, and a jaw-dropping sequence where Mystique shapeshifts into Yelena Belova — directly linking the mutant world to the established MCU. Kevin Feige confirmed on stage that the film takes place post-Endgame but dives deep into X-Men timelines and the multiverse, making this the most ambitious crossover event since *Infinity War*.

## 30 to 35 Actors on Set

During the CinemaCon panel, Feige revealed that production days sometimes featured "30 to 35 actors on set" simultaneously. Joe and Anthony Russo, who are directing the film, spoke about the challenge of balancing so many characters while maintaining emotional stakes. "This isn't just a team-up movie," Joe Russo told the audience. "This is the culmination of everything the multiverse saga has been building toward."

The film is set for a **December 18, 2026** theatrical release, positioning it as the holiday blockbuster of the year.

## What This Means for the MCU

*Avengers: Doomsday* represents Marvel Studios' biggest gamble since *Endgame*. After a stretch of underperforming films — including *Thunderbolts** and *Captain America: Brave New World* — the studio is betting everything on the Russo Brothers and RDJ's return to reignite audience enthusiasm. The CinemaCon presentation suggests they are pulling out all the stops.

---

## Collector's Corner

The CinemaCon reveal has already sent ripples through the trading card market. Doctor Doom cards from the 2025 Topps Marvel Chrome set are seeing increased demand on [eBay](https://www.ebay.com), with numbered refractors climbing 15-20% in the past week alone. If you are holding any Doom inserts from Topps Marvel Mint or Chrome, now is the time to get them graded through [PSA](https://www.psacard.com) or [CGC](https://www.cgccomics.com) before the December release drives prices even higher.

For collectors looking to track real-time price movements, [Card Ladder](https://www.cardladder.com) is an excellent resource for monitoring pop reports and recent sales data on Marvel trading cards. With the Doomsday hype cycle just beginning, early movers on Doom and RDJ-related cards could see significant returns by year's end.

**Hot Cards to Watch:** Doctor Doom Topps Chrome refractors, RDJ/Iron Man base and parallel cards from any Topps Marvel set, and Mystique inserts that tie into the mutant crossover reveal.`,
  },
  {
    title: "Avengers: Doomsday Test Screening Reactions Compare It to Infinity War — Is This the MCU's Comeback?",
    slug: "avengers-doomsday-test-screening-infinity-war-level",
    excerpt: "Early test screening reactions for Avengers: Doomsday are calling it the Russo Brothers' best Marvel movie yet, testing at the same level as Infinity War.",
    featuredImageUrl: IMAGES.screening,
    category: "movie_news",
    tags: JSON.stringify(["Avengers Doomsday", "Test Screening", "Russo Brothers", "Infinity War", "MCU"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Avengers"]),
    cardMarketImpact: "Positive test screening buzz is lifting the entire Marvel card market. Avengers team-up cards and Infinity War-era inserts are seeing renewed interest.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 3600000,
    metaDescription: "Avengers Doomsday test screening reactions are overwhelmingly positive, with attendees comparing it to Infinity War.",
    sources: JSON.stringify([
      { title: "Looper - Test Screening Reactions", url: "https://www.looper.com/2149833/avengers-doomsday-test-screening-reactions/" },
    ]),
    contentMarkdown: `Marvel Studios held a private test screening for *Avengers: Doomsday* in early April, and the reactions leaking out of that room are nothing short of extraordinary. According to multiple industry insiders, the film tested at approximately the same level as *Avengers: Infinity War* — a benchmark that should make every Marvel fan sit up and take notice.

## "The Russo Brothers' Best Marvel Movie Yet"

That is the phrase being repeated by several attendees who were fortunate enough to see an early cut of the film. Film journalist Robert Meyer Burnett went on record saying he had heard the screening "went Infinity War well," which is remarkable praise considering that *Infinity War* remains one of the highest-rated and most commercially successful superhero films ever made.

Marvel representatives in attendance were reportedly "very pleased" with the audience feedback. While test screenings are not always predictive of final quality — studios frequently make significant changes based on audience reactions — the overwhelmingly positive response suggests that the core story, performances, and spectacle are landing exactly as intended.

## Why the MCU Desperately Needs This Win

The Marvel Cinematic Universe has been in a difficult stretch. Films like *Thunderbolts** and *Captain America: Brave New World* underperformed at the box office, ranking among the lowest-grossing MCU entries. The proliferation of Disney+ shows has arguably diluted the brand, making it difficult for casual viewers to follow the overarching narrative without watching dozens of hours of television content.

Phase 6 of the MCU represents a deliberate course correction. Marvel has scaled back to fewer than a dozen total projects — just four feature films and six television series. Quality over quantity is the new mandate, and if the test screening reactions are any indication, *Doomsday* may be the film that proves the strategy is working.

## The Road to December

With the CinemaCon trailer reveal generating massive buzz and test screening reactions comparing the film to the best of the MCU, *Avengers: Doomsday* is shaping up to be the most anticipated film of 2026. The December 18 release date puts it squarely in the holiday blockbuster window.

---

## Collector's Corner

When *Infinity War* released in 2018, Marvel trading card values saw a significant spike across the board. If *Doomsday* delivers on the promise of these test screening reactions, we could see a similar market-wide lift. Now is the time to be building your collection.

For tracking which cards are moving and at what prices, [Beckett](https://www.beckett.com) remains the gold standard for price guides and population reports. Their Marvel card database is comprehensive and regularly updated, making it an essential tool for any serious collector.

**Hot Cards to Watch:** Any Avengers team-up cards from Topps Marvel Chrome or Marvel Mint, Infinity War-era inserts, and Doctor Doom first appearance cards that could see a major premium once the trailer drops publicly.`,
  },
  {
    title: "Spider-Man: Brand New Day Drops New CinemaCon Footage — Boomerang, Tarantula, and Daredevil Hints",
    slug: "spider-man-brand-new-day-cinemacon-footage-villains",
    excerpt: "New footage from Spider-Man: Brand New Day revealed at CinemaCon introduces Boomerang and Tarantula as villains, with tantalizing hints at a Daredevil crossover.",
    featuredImageUrl: IMAGES.spiderman,
    category: "movie_news",
    tags: JSON.stringify(["Spider-Man", "Brand New Day", "CinemaCon", "Boomerang", "Tarantula", "Daredevil"]),
    relatedCharacters: JSON.stringify(["Spider-Man", "Daredevil", "Boomerang", "Tarantula"]),
    cardMarketImpact: "Spider-Man cards remain the blue-chip investment of the Marvel card market. Brand New Day villain reveals could drive interest in lesser-known character cards.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 7200000,
    metaDescription: "Spider-Man Brand New Day reveals new CinemaCon footage with Boomerang and Tarantula as villains plus Daredevil hints.",
    sources: JSON.stringify([
      { title: "YouTube - Spider-Man Brand New Day CinemaCon", url: "https://www.youtube.com/watch?v=GikHFmoF28I" },
    ]),
    contentMarkdown: `While *Avengers: Doomsday* dominated the CinemaCon headlines, Marvel Studios also gave attendees a substantial look at *Spider-Man: Brand New Day*, the next solo outing for everyone's favorite wall-crawler. The new footage introduced two villains that comic book fans will recognize — Boomerang and Tarantula — while dropping tantalizing hints at a crossover with Daredevil.

## New Villains, New Threats

The CinemaCon footage showcased Boomerang and Tarantula as the primary antagonists. Boomerang (Fred Myers) is a former baseball pitcher turned mercenary who uses specialized boomerangs as weapons. Tarantula (Anton Miguel Rodriguez) is a martial arts expert with poisoned boot spikes who has been a thorn in Spider-Man's side since the 1970s.

The choice of these B-list villains is notable because it suggests Marvel is taking a street-level approach, keeping the stakes personal rather than cosmic. After the multiverse madness of *No Way Home*, a more grounded story could be exactly what the franchise needs.

## Daredevil Connection

Perhaps the most exciting element was a series of subtle hints pointing toward a Daredevil appearance. The footage reportedly included a Hell's Kitchen establishing shot and a brief glimpse of a red silhouette on a rooftop. Given the success of *Daredevil: Born Again* on Disney+, integrating the character into a Spider-Man film would be a natural and crowd-pleasing move.

## Could Peter Parker Actually Die?

One of the more provocative theories circulating is whether *Brand New Day* could feature the death of Peter Parker. The film's title — borrowed from a controversial 2008 comic storyline — has fueled speculation that Marvel may be planning something dramatic. In the comics, "Brand New Day" followed the dissolution of Peter and Mary Jane's marriage through a deal with Mephisto. While the MCU is unlikely to follow that exact plot, the title suggests a major status quo change is coming.

---

## Collector's Corner

Spider-Man has always been the king of the Marvel trading card market, and *Brand New Day* is only going to amplify that. Keep an eye on lesser-known villain cards that could see a spike once the trailer drops publicly.

For buying and selling individual Marvel cards, [COMC (Check Out My Cards)](https://www.comc.com) is a fantastic marketplace. They offer consignment services, grading integration, and a massive inventory spanning decades of sets. It is an especially good place to hunt for older Boomerang and Tarantula cards from vintage Marvel sets.

**Hot Cards to Watch:** Spider-Man base and parallel cards from 2025 Topps Marvel Chrome and Marvel Mint, Daredevil inserts from any recent Topps set, and deep-cut villain cards featuring Boomerang or Tarantula from older Marvel Universe or Fleer sets.`,
  },
  {
    title: "Fantastic Four: First Steps Passes $521 Million but Falls Short of MCU Expectations — What Went Wrong?",
    slug: "fantastic-four-first-steps-521-million-box-office-analysis",
    excerpt: "The Fantastic Four: First Steps earned $521 million worldwide but is now being overtaken by Project Hail Mary. We break down what the numbers mean for Marvel's future.",
    featuredImageUrl: IMAGES.f4,
    category: "analysis",
    tags: JSON.stringify(["Fantastic Four", "Box Office", "MCU", "Project Hail Mary", "Pedro Pascal"]),
    relatedCharacters: JSON.stringify(["Mr. Fantastic", "Invisible Woman", "Human Torch", "The Thing"]),
    cardMarketImpact: "Fantastic Four card values have stabilized after an initial post-release dip. With the cast confirmed for Doomsday, expect a second wave of interest closer to December.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 10800000,
    metaDescription: "Fantastic Four First Steps earned $521M worldwide but fell short of MCU expectations. Analysis of what went wrong.",
    sources: JSON.stringify([
      { title: "Collider - Project Hail Mary Overtakes F4", url: "https://collider.com/new-sci-fi-movie-project-hail-mary-overtakes-marvel-fantastic-four-box-office-520-million/" },
    ]),
    contentMarkdown: `*The Fantastic Four: First Steps* was supposed to be the film that reignited the Marvel Cinematic Universe. Directed by Matt Shakman and starring Pedro Pascal, Vanessa Kirby, Joseph Quinn, and Ebon Moss-Bachrach as Marvel's First Family, the film carried enormous expectations. It delivered a respectable $521 million worldwide — but in the context of MCU history, that number tells a complicated story.

## The Numbers in Context

A $521 million worldwide gross is, by any normal standard, a successful theatrical run. But the MCU does not operate by normal standards. For comparison, *Avengers: Endgame* earned $2.8 billion, *Spider-Man: No Way Home* crossed $1.9 billion, and even *Eternals* managed $402 million. When you factor in the massive production and marketing budget — estimated at over $250 million before marketing — the profit margins narrow considerably.

The film opened to approximately $123.5 million domestically, a solid debut. However, the drop-off in subsequent weekends was steeper than hoped, suggesting the film struggled to generate repeat viewings and word-of-mouth momentum.

## Overtaken by Project Hail Mary

*Project Hail Mary*, the Ryan Gosling-led sci-fi film directed by Phil Lord and Christopher Miller, has earned over $600 million worldwide and is projected to reach $700 million. The film holds a 94% Certified Fresh score on Rotten Tomatoes and has been re-released in IMAX venues.

The contrast is stark: a beloved Marvel property with four A-list stars was outperformed by an original sci-fi film based on a novel. It underscores the challenge Marvel faces in a post-*Endgame* landscape where brand recognition alone is no longer sufficient.

## What This Means for Doomsday

The silver lining is that all four *Fantastic Four* cast members are confirmed for *Avengers: Doomsday*. If *Doomsday* delivers on its test screening promise, it could retroactively boost interest in *First Steps* as audiences catch up on the characters.

---

## Collector's Corner

Fantastic Four trading cards present an interesting value proposition right now. The initial hype has cooled, which means card prices have come down from pre-release peaks. For patient collectors, this dip represents a buying opportunity.

For researching card values and finding deals, [TCGPlayer](https://www.tcgplayer.com) is a marketplace worth bookmarking. Their Marvel section has been growing, and the competitive marketplace format often produces better prices than eBay. Combine that with [Card Ladder](https://www.cardladder.com) for price trend analysis.

**Hot Cards to Watch:** Pedro Pascal/Mr. Fantastic cards from Topps Marvel Chrome (buy the dip), Vanessa Kirby/Invisible Woman inserts, and any Fantastic Four team cards that could see renewed demand as Doomsday marketing ramps up.`,
  },
  {
    title: "Marvel Phase 6 Roadmap: Only 4 Films and 6 Shows — Why Less Could Finally Mean More for the MCU",
    slug: "marvel-phase-6-roadmap-fewer-projects-quality-over-quantity",
    excerpt: "Marvel is scaling back to fewer than a dozen Phase 6 projects. With only 4 films and 6 TV shows planned, the studio is betting that quality over quantity will bring audiences back.",
    featuredImageUrl: IMAGES.phase6,
    category: "analysis",
    tags: JSON.stringify(["Phase 6", "MCU", "Marvel Studios", "Avengers Doomsday", "Secret Wars", "Mutant Saga"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Spider-Man", "Fantastic Four", "X-Men"]),
    cardMarketImpact: "A leaner Phase 6 slate means each project carries more weight — and more card market impact. Focus on characters confirmed for the four films.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 14400000,
    metaDescription: "Marvel Phase 6 features only 4 films and 6 TV shows. Breaking down why the MCU's quality-over-quantity approach could be what the franchise needs.",
    sources: JSON.stringify([
      { title: "Looper - Phase 6 Details", url: "https://www.looper.com/2149833/avengers-doomsday-test-screening-reactions/" },
    ]),
    contentMarkdown: `For the first time in over a decade, Marvel Studios is deliberately pumping the brakes. Phase 6 of the Marvel Cinematic Universe will consist of fewer than a dozen total projects — a dramatic reduction from the content avalanche that defined Phases 4 and 5.

## The Phase 6 Film Slate

Marvel has confirmed exactly four feature films for Phase 6:

**The Fantastic Four: First Steps** has already been released, earning $521 million worldwide and introducing Pedro Pascal, Vanessa Kirby, Joseph Quinn, and Ebon Moss-Bachrach as Marvel's First Family.

**Avengers: Doomsday** arrives December 18, 2026, directed by the Russo Brothers and starring Robert Downey Jr. as Doctor Doom. Test screening reactions have compared it to *Infinity War*.

**Spider-Man: Brand New Day** is expected in 2027, with new CinemaCon footage revealing Boomerang and Tarantula as villains and hinting at a Daredevil crossover.

**Avengers: Secret Wars** will cap off the Multiverse Saga. If *Doomsday* is the MCU's *Infinity War*, then *Secret Wars* is its *Endgame*.

## Why the Scaling Back Matters

The MCU's recent struggles can be traced directly to content oversaturation. Between 2021 and 2025, Marvel released dozens of films and Disney+ series, many of which interconnected in ways that made casual viewing nearly impossible. By limiting Phase 6 to four films and six television shows, Marvel is making a clear statement: every project matters.

## The Mutant Saga Begins

Perhaps the most exciting aspect of Phase 6 is the formal introduction of mutants into the MCU. The CinemaCon *Doomsday* trailer featured Xavier Institute rubble and Mystique shapeshifting into Yelena Belova, confirming that the X-Men are not just coming — they are already here. The six Phase 6 television shows are expected to include at least one mutant-focused series, laying the groundwork for "The Mutant Saga" in Phase 7 and beyond.

---

## Collector's Corner

A leaner Phase 6 slate is actually great news for card collectors, because it means each project will generate more concentrated market attention. Instead of spreading your collecting budget across a dozen releases, you can focus on the four films that matter most.

For staying on top of which cards are trending, [Whatnot](https://www.whatnot.com/invite/northlandfinds) is becoming an increasingly important platform for Marvel card collectors. Live auctions create real-time price discovery, and the community aspect means you are always plugged into what other collectors are chasing. Plus, if you sign up through our link, you get $15 in free credit to start building your collection.

**Hot Cards to Watch:** X-Men and mutant cards from any Topps Marvel set (the Mutant Saga is coming), Doctor Doom cards ahead of Doomsday, Spider-Man cards for Brand New Day speculation, and Fantastic Four cards at their current dip prices.`,
  },
];

async function main() {
  const url = new URL(DATABASE_URL);
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
  });

  console.log("Connected to database");

  for (const article of articles) {
    try {
      await connection.execute(
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
      if (err.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️  Already exists (skipped): "${article.title}"`);
      } else {
        console.error(`❌ Failed: "${article.title}" - ${err.message}`);
      }
    }
  }

  await connection.end();
  console.log("\nDone! All articles published.");
}

main().catch(console.error);
