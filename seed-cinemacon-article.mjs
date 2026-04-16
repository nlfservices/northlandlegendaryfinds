import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const article = {
  title: "CinemaCon 2026: Avengers Doomsday Takes Center Stage — What We Know So Far",
  slug: "cinemacon-2026-avengers-doomsday-first-look",
  excerpt: "Disney's CinemaCon 2026 panel is set to deliver the first major look at Avengers: Doomsday. Here's everything we know about what Marvel is revealing today in Las Vegas.",
  contentMarkdown: `The biggest event in the Marvel Cinematic Universe since Endgame is finally getting its moment in the spotlight. Today, April 16, 2026, Disney's Walt Disney Studios presentation at CinemaCon in Las Vegas is expected to deliver the first substantial look at **Avengers: Doomsday** — and the anticipation could not be higher.

## The Panel: When and Where

Disney's presentation kicks off at **4:30 PM CT (2:30 PM PT / 5:30 PM ET)** at Caesar's Palace in Las Vegas. It's the final panel of CinemaCon 2026, and Marvel Studios is expected to close out the show — meaning the Doomsday reveal will likely land in the last 30 minutes of the two-hour presentation. Disney saved the best for last.

## What's Expected

Multiple industry insiders and entertainment reporters are pointing to the same conclusion: Marvel is ready to show the **first official full-length trailer** for Avengers: Doomsday. This wouldn't be another brief teaser clip — reports suggest we could see **three or more minutes** of actual footage.

John Campea, a well-known film industry pundit, has stated that **"all signs point to yes"** for a trailer drop, citing consistent whispers from multiple sources throughout the week. BamSmackPow's reporting goes even further, arguing there's **"no point debuting the trailer at CinemaCon and not releasing it online"** since every reporter in the room will be posting about it immediately.

The most exciting possibility? **Robert Downey Jr. himself** may appear in person at the panel to unveil the **first look at Doctor Doom** on screen. If this happens, it would mark the first time audiences see RDJ in the iconic green and silver Doom armor — a moment fans have been waiting for since the stunning announcement at San Diego Comic-Con 2024.

## What We Already Know

Marvel has been carefully building anticipation through a series of brief teaser clips released over the past several months:

- **Teaser 1:** Confirmed Steve Rogers' return to the MCU
- **Teaser 2:** Spotlighted Thor in a major role
- **Teaser 3:** Confirmed X-Men involvement in the film
- **Teaser 4:** Revealed Black Panther, M'Baku, Namor, and The Thing in a crossover sequence

What's notably absent from all of these teasers? **Doctor Doom.** Marvel has kept RDJ's portrayal of Victor Von Doom completely under wraps. Not a single frame of footage showing Doom has been released publicly. Today could change everything.

## The Cast Is Massive

Avengers: Doomsday features what may be the largest ensemble cast in MCU history. Beyond the core Avengers roster, confirmed and reported cast members include:

- **The Fantastic Four** (from the upcoming First Steps film)
- **Patrick Stewart** returning as Professor X
- **Ian McKellen** returning as Magneto
- **Kelsey Grammer** returning as Beast
- **Channing Tatum** as Gambit
- **Ryan Reynolds** rumored to appear as Deadpool

The X-Men integration alone makes this a historic crossover event. Add in the Fantastic Four, and Doomsday is shaping up to be the ultimate Marvel team-up film.

## Will the Trailer Go Public?

This is the big question. CinemaCon footage is traditionally shown exclusively to theater owners and industry attendees — but the landscape has changed. Most major studios now release their CinemaCon trailers online simultaneously or within hours.

The most likely scenarios:

1. **Trailer shown at CinemaCon AND released online** at the same time or shortly after (most likely)
2. **CinemaCon exclusive** with a public release on **April 20** (Monday)
3. **CinemaCon exclusive** with the full public trailer saved for **San Diego Comic-Con** this summer (least likely given the hype)

## Other CinemaCon Reveals This Week

It's been a massive week for movie news in Las Vegas:

- New **Spider-Man: Brand New Day** posters revealed
- First-look photos from **Spider-Man: Beyond the Spider-Verse**
- **Superman: Man of Tomorrow** production updates
- **Game of Thrones movie** confirmed on Warner Bros. slate
- New **Lord of the Rings** casting news
- **The Mandalorian and Grogu** new footage expected during Disney's panel
- **Toy Story 5** updates expected

## What This Means for Card Collectors

For Marvel card collectors, Doomsday is the biggest event on the horizon. Every trailer drop and casting confirmation moves the market. Here's what to watch:

**Doctor Doom cards** have been steadily climbing since the RDJ casting announcement. A full trailer showing Doom in action could send prices even higher — especially for 2025 Topps Chrome and Comic Book Heroes inserts featuring Victor Von Doom.

**X-Men crossover cards** featuring Professor X, Magneto, Wolverine, and other mutants are also worth watching. The confirmed involvement of legacy X-Men actors makes any card featuring these characters a potential mover.

**Fantastic Four cards** — particularly Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm — could see increased interest as the Doomsday trailer reveals how the FF fits into the larger story.

The bottom line: if you're collecting Marvel cards, today's CinemaCon panel could be a market-moving event. Keep your eyes on social media for the latest reveals.

## Release Date

Avengers: Doomsday is currently scheduled for release in **December 2026**. Filming for the sequel, **Avengers: Secret Wars**, is reportedly set to begin in **June 2026**.

---

*This article will be updated as news breaks from the CinemaCon panel. Check back for the latest reveals.*`,
  featuredImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cinemacon-doomsday-article-2T9NyFiFxisquZq7PVFwPC.webp",
  category: "movie_news",
  tags: JSON.stringify(["Avengers", "Doomsday", "Doctor Doom", "CinemaCon", "MCU", "Robert Downey Jr", "X-Men", "Fantastic Four", "Trailer"]),
  cardMarketImpact: "Doctor Doom cards climbing since RDJ casting — a full trailer could push prices higher. X-Men and Fantastic Four cards also worth watching as crossover details emerge.",
  relatedCharacters: JSON.stringify(["Doctor Doom", "Iron Man", "Captain America", "Thor", "Spider-Man", "Wolverine", "Professor X", "Magneto", "Black Panther", "Namor"]),
  sources: JSON.stringify([
    { title: "BamSmackPow — Avengers Doomsday Trailer Update", url: "https://bamsmackpow.com/avengers-doomsday-trailer-update-marvel-cinemacon-report-rumor" },
    { title: "ComicBookMovie — Doomsday First Full Trailer", url: "https://comicbookmovie.com/avengers/avengers-doomsday/avengers-doomsdays-first-full-trailer-could-be-coming-sooner-than-expected-a227233" },
    { title: "BamSmackPow — CinemaCon 2026 Disney Presentation", url: "https://bamsmackpow.com/cinemacon-2026-disney-presentation-start-time-time-zone-preview" },
    { title: "Gold Derby — CinemaCon 2026 Disney Preview", url: "https://www.goldderby.com/film/2026/cinemacon-2026-disney-star-wars-avengers-toy-story/" }
  ]),
  isFeatured: true,
  isPublished: true,
  authorName: "NLF Team",
  publishedAt: Date.now(),
  metaDescription: "CinemaCon 2026 is set to deliver the first major look at Avengers: Doomsday. Everything we know about Marvel's biggest reveal, the cast, and what it means for card collectors."
};

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // Check if article already exists
  const [existing] = await connection.execute(
    'SELECT id FROM articles WHERE slug = ?',
    [article.slug]
  );
  
  if (existing.length > 0) {
    console.log("Article already exists, updating...");
    await connection.execute(
      `UPDATE articles SET title=?, excerpt=?, contentMarkdown=?, featuredImageUrl=?, category=?, tags=?, cardMarketImpact=?, relatedCharacters=?, sources=?, isFeatured=?, isPublished=?, authorName=?, publishedAt=?, metaDescription=? WHERE slug=?`,
      [article.title, article.excerpt, article.contentMarkdown, article.featuredImageUrl, article.category, article.tags, article.cardMarketImpact, article.relatedCharacters, article.sources, article.isFeatured, article.isPublished, article.authorName, article.publishedAt, article.metaDescription, article.slug]
    );
    console.log("Article updated successfully!");
  } else {
    console.log("Creating new article...");
    await connection.execute(
      `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [article.title, article.slug, article.excerpt, article.contentMarkdown, article.featuredImageUrl, article.category, article.tags, article.cardMarketImpact, article.relatedCharacters, article.sources, article.isFeatured, article.isPublished, article.authorName, article.publishedAt, article.metaDescription]
    );
    console.log("Article created successfully!");
  }
  
  // Verify
  const [rows] = await connection.execute(
    'SELECT id, title, slug, isPublished, isFeatured FROM articles WHERE slug = ?',
    [article.slug]
  );
  console.log("Verification:", rows[0]);
  
  await connection.end();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
