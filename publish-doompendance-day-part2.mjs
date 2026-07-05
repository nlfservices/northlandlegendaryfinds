/**
 * Publish Doompendance Day Part 2: Doctor Doom vs. Captain America
 * Run from project root: node publish-doompendance-day-part2.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fb-doompendance-day-split-PoYXCnpJVpGGNMQDgVJCrR.webp",
  capLatveria: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doompendance2-cap-latveria-6S6treiZJoyUiA9ooqqt3w.webp",
  hellAlliance: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doompendance2-hell-alliance-58QcSMBTRhuaV7RVD3BAmu.webp",
  vintageCards: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doompendance2-vintage-cards-Ntm42GjUh79ydf66fAiuSd.webp",
};

const now = Date.now();

const articleContent = `
*This is Part 2 of our Doompendance Day series. Read [Part 1: The Villain Who Was Born in Independence Month](https://northlandlegendaryfinds.com/mcu-news/doompendance-day-doctor-doom-july-4th-marvel-cards) first.*

---

If Doctor Doom is the anti-Independence Day villain, then Captain America is his perfect foil — a hero literally wrapped in the flag, standing against a European autocrat who believes freedom works better when he's the one running it.

On July 4th, that contrast couldn't be sharper. One character embodies the ideal the holiday celebrates. The other represents the version of "order" that ideal was built to reject.

And Marvel just made their rivalry official.

## An Old Rivalry Marvel Just Made Canon

Here's the thing most fans didn't realize: for over sixty years of comics, Doom and Cap had never had a proper origin story together. They'd crossed paths in team books, sure, but their personal rivalry was assumed rather than established.

That changed in 2025.

<img src="${IMAGES.capLatveria}" alt="A patriotic soldier infiltrating a dark medieval castle" style="width:100%;max-width:800px;border-radius:8px;margin:1.5rem 0;" />

Chip Zdarsky and Valerio Schiti's *Captain America* run went back to a period right after Steve Rogers thawed out of the ice — before he'd even rejoined the Avengers — and revealed his first, previously untold mission: **infiltrating Latveria to confront a young Victor von Doom who had just seized the throne.**

For a soldier still adjusting to the modern world, a power-hungry dictator crushing a civilian population was instantly familiar territory. Cap took the fight straight to Doom's castle.

That flashback arc wasn't just a fun "missing story." Writer Chip Zdarsky has said the earlier clash directly shapes Latveria's future once the series catches up to the present day — meaning this new rivalry isn't a one-off. It's foundational.

## From First Fight to Reluctant Allies

The dynamic escalated fast after that.

The *One World Under Doom* event saw Doom briefly rule the entire planet as Sorcerer Supreme before the Avengers took him down. But Doom resurfaced with his most audacious plan yet — one that required Captain America's help.

<img src="${IMAGES.hellAlliance}" alt="Two rivals forced into an uneasy alliance in a hellish landscape" style="width:100%;max-width:800px;border-radius:8px;margin:1.5rem 0;" />

Their story took an even stranger turn when **Steve Rogers ended up trapped in Hell alongside Doom himself**, forced to team up against a common enemy: Mephisto. Zdarsky has teased that this forced alliance will change both characters for a long time to come, feeding directly into the larger *Avengers: Armageddon* storyline.

It's a classic "enemy of my enemy" setup, and it's rare to see Marvel let a hero and a top-tier villain share this much narrative real estate without it being a one-issue truce. This is a multi-arc partnership that's reshaping both characters heading into the movies.

## Why This Rivalry Matters for Collectors

This isn't just a good comic book story. It's landing at the perfect moment for the trading card market:

**Movie timing.** With *Avengers: Doomsday* arriving in December 2026 and Robert Downey Jr. playing Doom opposite the Avengers (including whoever carries the shield next), any card featuring Doom facing off with Captain America carries extra weight for crossover collectors.

**Modern arc significance.** This isn't a throwaway skirmish — it's being built as a defining relationship for both characters going forward. Marvel is investing serious editorial real estate in making Doom and Cap's dynamic feel as important as Xavier and Magneto or Spider-Man and the Green Goblin.

**Insert potential.** "Hero vs. villain" dual-character cards and parallels tend to become chase pieces once a rivalry gets this much editorial spotlight. Keep an eye on future sets for Doom/Cap confrontation inserts.

## The Card to Chase: 2025 Topps Marvel Comic Book Heroes 1975 Golden Anniversary

This rivalry has a perfect home in a set built specifically around Marvel's history: **2025 Topps Marvel Comic Book Heroes 1975 Golden Anniversary** — a 150-card Chrome tribute to the original 1975 and 1976 Topps sticker sets.

<img src="${IMAGES.vintageCards}" alt="Vintage 1970s Marvel trading card stickers on a collector's desk" style="width:100%;max-width:800px;border-radius:8px;margin:1.5rem 0;" />

Both Doom and Captain America appear multiple times across the checklist's four eras:

- **1975 subset** — Captain America and Doctor Doom both appear as original sticker reprints, rendered in Chrome for the first time
- **1976 subset** — Captain America returns alongside Doom, letting collectors track how each character's sticker art evolved between the two original years
- **2000s and 2025 subsets** — modern comic art rounds out the 150-card base, bridging five decades of Marvel history in one release

Because the set literally combines 1975, 1976, and present-day depictions of both characters side by side, it's the single best product for building a "Doompendance Day" mini-collection — you can physically hold Doom and Cap's rivalry across 50 years of Topps history.

**Chase targets:** Gold Mini-Diamond (/199), Gold Atomic (/125), and the ultra-rare SuperFractor (1/1), along with Comic Book Artist Autograph cards recreated in the original sticker style.

## The Doompendance Day Angle

Cap represents the ideal the 4th of July celebrates. Doom represents the version of "order" that ideal was built to reject.

Watching them get forced into an alliance — and eventually back into rivalry — is basically Marvel restaging the American story with capes and armor. A soldier who believes in freedom fighting alongside a king who believes in control, both trapped in Hell, both needing each other to survive.

That's the kind of narrative hook that makes a card worth more than its gloss. When you hold a Doom/Cap card from the Comic Book Heroes set, you're holding fifty years of that tension in one chrome-coated piece of cardboard.

## Collector's Corner

The Doom vs. Captain America rivalry is officially canon now — and with both characters central to *Avengers: Doomsday*, any card featuring either character is positioned for a strong second half of 2026.

**Hot Cards to Watch:**
- **Captain America 1975 Chrome Sticker (Comic Book Heroes Golden Anniversary)** — original art, first-ever Chrome treatment of the classic sticker
- **Doctor Doom 1975 Chrome Sticker (Comic Book Heroes Golden Anniversary)** — same era, same set, the perfect rivalry pair
- **Captain America SuperFractor 1/1 (2025 Topps Marvel Mint)** — the ultimate Cap chase piece from this year's flagship
- **Doctor Doom Chrome Superfractor 1/1 (2025 Topps Marvel Mint)** — currently listed at $110K on Fanatics Collect

Track the Comic Book Heroes set and compare prices across sellers on **[COMC](https://www.comc.com/)** — great for finding singles from the 1975 and 1976 subsets.

Watch live breaks featuring both sets on **[Whatnot](https://www.whatnot.com/)** — NLF streams regularly feature Marvel Mint and Comic Book Heroes boxes.

Check population reports for both characters on **[MySlabs](https://www.myslabs.com/)** — track your graded Doom and Cap cards in one portfolio.

Explore our full [Captain America character page](https://northlandlegendaryfinds.com/characters/captain-america) and [Doctor Doom character page](https://northlandlegendaryfinds.com/characters/doctor-doom) for card database entries across every set, or browse the complete [card database](https://northlandlegendaryfinds.com/cards) to see what's available.

*Part 3 drops tomorrow: Doom 2099 — the wildcard variant that collectors are sleeping on.*

*Happy Independence Day. Cap would want you to celebrate it. Doom would want you to know it's irrelevant.*
`;

const article = {
  title: "Doompendance Day, Part 2: Doctor Doom vs. Captain America — The Ultimate Ideological Rematch",
  slug: "doompendance-day-doom-vs-captain-america",
  excerpt: "Captain America is the hero wrapped in the flag. Doctor Doom is the dictator who thinks freedom works better when he's running it. Marvel just made their rivalry official — and the cards that capture it are the perfect July 4th collector's piece.",
  featuredImageUrl: IMAGES.hero,
  category: "analysis",
  tags: JSON.stringify(["Doctor Doom", "Captain America", "July 4th", "Doompendance Day", "Chip Zdarsky", "One World Under Doom", "Avengers Doomsday", "2025 Topps Comic Book Heroes", "Golden Anniversary", "Rivalry", "Marvel Cards"]),
  relatedCharacters: JSON.stringify(["Doctor Doom", "Captain America", "Mephisto"]),
  cardMarketImpact: "The newly canonized Doom vs. Captain America rivalry positions dual-character cards and confrontation inserts as future chase pieces. The 2025 Comic Book Heroes Golden Anniversary set offers the cleanest way to collect both characters across 50 years of Topps history.",
  isFeatured: 1,
  isPublished: 1,
  authorName: "NLF Team",
  publishedAt: now,
  metaDescription: "Doctor Doom vs. Captain America: Marvel just made their rivalry official. Here's why the 2025 Topps Comic Book Heroes Golden Anniversary set is the perfect card to chase this July 4th.",
  sources: JSON.stringify([
    { title: "Captain America by Chip Zdarsky & Valerio Schiti (2025) — Marvel Comics", url: "https://www.marvel.com/comics/series/37180/captain_america_2024" },
    { title: "One World Under Doom — Marvel Comics Event", url: "https://www.marvel.com/comics/series/37498/one_world_under_doom_2025" },
    { title: "2025 Topps Marvel Comic Book Heroes 1975 Golden Anniversary", url: "https://www.topps.com/cards-collectibles/online-brands/marvel.html" }
  ]),
  contentMarkdown: articleContent.trim(),
  templateLayout: "listicle"  // Rotation: last was timeline, next is listicle
};

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  try {
    // Unfeature currently featured articles
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
