/**
 * Publish Doompendance Day Part 1: The Villain Who Was Born in Independence Month
 * Run from project root: node publish-doompendance-day-part1.mjs
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
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fb-doompendance-day-fireworks-nEyJERJtJGpegdJQqciWMa.png",
  debut: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doompendance-doom-debut-oV8U5M6MeBCM8isSjSrCR4.webp",
  latveria: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doompendance-latveria-castle-XR6spbaHxUU5a8W54hzLtC.webp",
  cards: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doompendance-mint-cards-92pqhpnpP5tPUDYnuyc9pK.webp",
};

const now = Date.now();

const articleContent = `
Happy Doompendance Day.

If you're ripping packs or scrolling eBay listings this holiday weekend, here's a piece of Marvel trivia that makes Doctor Doom feel oddly appropriate for the season: his very first appearance hit newsstands with a **July 1962** cover date, in *Fantastic Four #5*. Marvel's most iconic villain and America's birthday month have been quietly linked since the Silver Age.

That's right — Doctor Doom was born the same month as the nation he's spent sixty years trying to conquer.

<img src="${IMAGES.debut}" alt="Doctor Doom's dramatic first appearance in the Silver Age of comics" style="width:100%;max-width:800px;border-radius:8px;margin:1.5rem 0;" />

## The Anti-Independence Day Villain

There's no comic where Doom literally battles fireworks or throws a Latverian coup on the 4th of July. But the timing of his debut invites a contrast that's hard to ignore: Victor von Doom is, in almost every sense, the anti-Independence Day figure.

Where the holiday celebrates self-governance and liberty, Doom's entire arc — from seizing the throne of Latveria to declaring himself ruler of the whole planet as "United Latveria" in the recent *One World Under Doom* event — is about one man deciding he knows better than everyone else what freedom should look like.

<img src="${IMAGES.latveria}" alt="Castle Doom looming over the village of Latveria at twilight" style="width:100%;max-width:800px;border-radius:8px;margin:1.5rem 0;" />

That tension is part of why he's endured as Marvel's greatest villain for over sixty years. He's not chaos for chaos's sake. He's order, imposed by force, dressed up as benevolence. A European dictator in a metal mask who genuinely believes his subjects are better off under his rule — and the terrifying part is, in some storylines, he might actually be right.

## Why July 2026 Is Doom's Biggest Month Yet

Doom has always been a major character, but right now the convergence of factors is unprecedented:

**The movie is coming.** *Avengers: Doomsday* arrives in theaters December 2026, with Robert Downey Jr. stepping into the role of Victor von Doom. Every piece of Doom content — comics, cards, collectibles — is building toward that moment.

**The comics just crowned him.** The *One World Under Doom* event saw Doom become Sorcerer Supreme and briefly rule the entire planet before the Avengers took him down. That storyline is feeding directly into *Avengers: Armageddon* and reshaping Doom's status in Marvel continuity.

**The cards are moving.** The 2026 Topps Chrome Marvel set dropped on July 1st — just days ago — and Doom is already the most chased character in the release. A Doom Superfractor 1/1 hit eBay at $150,000 and got pulled almost immediately. Streamers ripped cases on day one hunting Doom parallels.

And now, sitting on Fanatics Collect right now: the **2025 Topps Chrome Mint Marvel Superfractor Doctor Doom 1/1 #107, PSA 9 MINT** — listed at **$110,000**. PSA Population 1 of 1. None graded higher. The single rarest graded Doom card from the Mint set, vaulted by Fanatics for security.

That's a six-figure trading card for a character who debuted in a twelve-cent comic book sixty-four years ago this month.

<img src="${IMAGES.cards}" alt="Premium holographic chrome trading cards with PSA grading slab" style="width:100%;max-width:800px;border-radius:8px;margin:1.5rem 0;" />

## The Card to Chase: 2025 Topps Marvel Mint

If you want to put this trivia into your collection rather than just your head, **2025 Topps Marvel Mint** is the set built for it. Doctor Doom isn't just a base card here — he's the anchor of the entire release. Hobby boxes feature him alongside Captain America and Wolverine on the box art, and the SDCC-exclusive version puts Doom front and center all by himself.

The chase pieces worth knowing:

- **Doctor Doom Chrome Superfractor 1/1 #107** — the card currently listed at $110,000 on Fanatics Collect, PSA 9 MINT, population 1 of 1
- **Doctor Doom Chrome card (SDCC exclusive)** — base copies numbered to 99, with Black Lava (/10), Green Lava (/5), and a true 1/1 Superfractor at the top of the ladder
- **Doctor Doom Comic Cuts** — a 200-card insert set using actual panels cut from original comic books featuring Doom; since no two panels are alike, every single card is a 1/1
- **Playing Card insert (Gambit's Deck)** — Doom appears as the King of Clubs, double-sided Chrome, numbered to 99

Given his July 1962 debut and his outsized presence in this set's box art and inserts, a graded Doom Mint card is about as clean a "Doompendance Day" collectible as exists right now — first-appearance trivia backing up a genuinely chaseable modern card.

## What This Means for Collectors

For anyone chasing Doctor Doom cards this summer, that history is what makes the character worth collecting beyond just "cool villain in metal armor":

**First-appearance energy.** Doom's July 1962 debut gives any Doom rookie-era reprint or tribute card a built-in anniversary story. Every July, there's a reason to talk about this character.

**Depth of storyline.** Recent event books have pushed Doom from villain to global ruler to reluctant ally, which means modern sets increasingly treat him as a marquee character rather than a background baddie.

**Crossover appeal.** With *Avengers: Doomsday* on the way and RDJ attached, Doom cards — especially chase inserts and 1/1s — are only going to get more attention from both comic readers and set collectors between now and December.

The $110,000 Mint Superfractor isn't just a price tag. It's a signal. The market is telling you that Doctor Doom is no longer a supporting character in the trading card hobby — he's the main event.

## Collector's Corner

Doom's July debut makes this the perfect weekend to start (or expand) a Doom collection. The character has never had more momentum across comics, film, and cards simultaneously.

**Hot Cards to Watch:**
- **Doctor Doom Chrome Superfractor 1/1 (2025 Topps Marvel Mint)** — $110K on Fanatics Collect, PSA 9, population 1/1
- **Doctor Doom Superfractor 1/1 (2026 Topps Chrome Marvel)** — hit eBay at $150K and got pulled immediately
- **Doctor Doom Comic Cuts (2025 Topps Marvel Mint)** — every card is a 1/1, original comic panels
- **Doctor Doom King of Clubs (Gambit's Deck, 2025 Topps Marvel Mint)** — Chrome, /99, iconic insert design

Track Doom card values and population data on **[PSA](https://www.psacard.com/)** — check the pop reports to see how rare your specific parallel really is.

Browse current Doom listings and recent sold prices on **[Fanatics Collect](https://www.fanaticscollect.com/)** — the Mint Superfractor is live there right now.

Explore our full [Doctor Doom character page](https://northlandlegendaryfinds.com/characters/doctor-doom) for card database entries across every set, or browse the complete [card database](https://northlandlegendaryfinds.com/cards) to see what's available.

*This is Part 1 of our Doompendance Day series. Part 2 drops tomorrow: Doom vs. Captain America — the ultimate ideological rematch, and the cards that capture it.*

*Happy Independence Day. Doom would want you to know he doesn't celebrate it.*
`;

const article = {
  title: "Doompendance Day: The Villain Who Was Born in Independence Month",
  slug: "doompendance-day-doctor-doom-july-4th-marvel-cards",
  excerpt: "Doctor Doom first appeared in July 1962 — born the same month as America's birthday. With a $110K Superfractor on Fanatics Collect and Avengers: Doomsday on the horizon, here's why the anti-Independence Day villain is the hottest character in the hobby right now.",
  featuredImageUrl: IMAGES.hero,
  category: "analysis",
  tags: JSON.stringify(["Doctor Doom", "July 4th", "Doompendance Day", "2025 Topps Marvel Mint", "Superfractor", "PSA 9", "Fanatics Collect", "Avengers Doomsday", "Robert Downey Jr", "Latveria", "Independence Day", "Marvel Cards"]),
  relatedCharacters: JSON.stringify(["Doctor Doom", "Captain America", "Wolverine", "Iron Man"]),
  cardMarketImpact: "The $110,000 Mint Superfractor listing and $150K Chrome Superfractor that got pulled from eBay signal that Doom cards have entered a new pricing tier. With Avengers: Doomsday in December, every Doom parallel and insert is positioned to appreciate through the end of 2026.",
  isFeatured: 1,
  isPublished: 1,
  authorName: "NLF Team",
  publishedAt: now,
  metaDescription: "Doctor Doom debuted in July 1962 — the same month as America's birthday. With a $110K Superfractor on Fanatics Collect and Avengers: Doomsday coming in December, here's why Doom is the hottest character in Marvel cards right now.",
  sources: JSON.stringify([
    { title: "Fantastic Four #5 (July 1962) — First Appearance of Doctor Doom", url: "https://www.marvel.com/comics/issue/12894/fantastic_four_1961_5" },
    { title: "2025 Topps Chrome Mint Marvel Superfractor Doctor Doom 1/1 PSA 9 — Fanatics Collect", url: "https://www.fanaticscollect.com/buy-now/f8ae711a-ca84-4db8-95b0-297fc0a041ec" },
    { title: "One World Under Doom — Marvel Comics Event", url: "https://www.marvel.com/comics/series/37498/one_world_under_doom_2025" }
  ]),
  contentMarkdown: articleContent.trim(),
  templateLayout: "timeline"  // Last was 'spotlight', next in rotation is 'timeline'
};

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  try {
    // Unfeature any currently featured article
    await conn.execute(`UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1`);

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
    console.log(`   Slug: ${article.slug}`);
    console.log(`   Template: ${article.templateLayout}`);
    console.log(`   Featured: YES`);

    // Verify
    const [rows] = await conn.execute(
      `SELECT id, title, slug, templateLayout FROM articles WHERE isPublished = 1 ORDER BY publishedAt DESC LIMIT 5`
    );
    console.log("\n📰 Latest Articles:");
    rows.forEach((r, i) => console.log(`   ${i + 1}. [${r.templateLayout}] ${r.title}`));

  } catch (err) {
    console.error("❌ Error:", err.message);
  }

  await conn.end();
  console.log("\nDone!");
}

main().catch(console.error);
