/**
 * Publish Doctor Doom Comic Cuts Article — July 20, 2026
 * "A History Lesson in Doctor Doom" — 200 Comic Cut 1/1 cards
 * Template: character_profile (next in rotation after dossier)
 * Run from project root: node publish-doom-comic-cuts.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const FEATURED_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-comic-cuts-history-g3QcNLGZc2WPzsXXUzE6mo.webp';
const DOOM_CARD = '/manus-storage/1000043826_c2ad3c69.jpg';

const now = Date.now();

const articles = [
  {
    title: "A History Lesson in Doctor Doom: The 200 Comic Cut Cards That Hold 60 Years of Villainy",
    slug: "doctor-doom-comic-cuts-history-lesson-2025-topps-marvel-mint",
    excerpt: "Inside the 2025 Topps Marvel Mint set are 200 one-of-one Comic Cut cards — each containing an actual piece of a Doctor Doom comic book page. From Jack Kirby and Stan Lee's 1962 creation to Jonathan Hickman's 2015 Secret Wars, these cards are physical fragments of Marvel history.",
    featuredImageUrl: FEATURED_IMAGE,
    category: "card_market",
    templateLayout: "character_profile",
    tags: JSON.stringify(["Doctor Doom", "Comic Cuts", "Topps Marvel Mint", "1/1", "Jack Kirby", "Stan Lee", "Jonathan Hickman", "Secret Wars", "SDCC", "Relic Cards", "2025"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Fantastic Four", "Reed Richards", "Cynthia Von Doom"]),
    cardMarketImpact: "The 200 Doctor Doom Comic Cut cards are all true 1/1 relics with embedded comic panels spanning 60+ years. With the Doomsday trailer confirming RDJ as Doom, these cards represent irreplaceable pieces of the character's printed legacy — and the market knows it.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "The 200 Doctor Doom Comic Cut cards in 2025 Topps Marvel Mint are 1/1 relics containing actual comic book panels. A history lesson from Jack Kirby to Jonathan Hickman's Secret Wars.",
    sources: JSON.stringify([
      { title: "Topps Ripped - How to Collect 2025 Topps Mint Marvel", url: "https://ripped.topps.com/how-to-collect-2025-topps-mint-marvel/" },
      { title: "Checklist Insider - 2025 Topps Marvel Mint", url: "https://www.checklistinsider.com/2025-topps-marvel-mint" },
      { title: "Marvel.com - Fantastic Four #5 (1962)", url: "https://www.marvel.com/comics/issue/13255/fantastic_four_1961_5" },
      { title: "NLF - Doctor Doom SDCC Exclusive Rarity Breakdown", url: "https://northlandlegendaryfinds.com/mcu-news/doctor-doom-sdcc-exclusive-rarest-card-2025-topps-marvel-mint" },
      { title: "NLF - Mother's Day: Cynthia Von Doom", url: "https://northlandlegendaryfinds.com/mcu-news/mothers-day-cynthia-von-doom-sacrifice-doctor-doom" },
    ]),
    contentMarkdown: `There are exactly 200 of them. Each one is a 1/1. And each one contains an actual piece of a Doctor Doom comic book page — physically cut from the printed page and embedded into the card.

The 2025 Topps Marvel Mint set did something that no modern trading card product has attempted at this scale: it took 60 years of Doctor Doom's comic book history and turned it into 200 individual artifacts. Not reprints. Not scans. The actual ink-on-paper panels that were printed decades ago, sealed inside one-touch cases, numbered DD-CC, and scattered across hobby and SDCC boxes at roughly 1:61 odds.

This isn't just a card. It's a history lesson.

## The Beginning: Jack Kirby and Stan Lee (1962)

Doctor Doom first appeared in **Fantastic Four #5**, cover-dated July 1962. Created by Stan Lee and Jack Kirby, Victor Von Doom was unlike anything Marvel had produced before — a villain who wasn't just powerful, but brilliant, tragic, and regal. He didn't rob banks. He ruled a country.

Kirby's original design — the iron mask, the green cloak, the medieval armor fused with futuristic technology — has barely changed in 60 years. That's how perfect it was from day one. Lee gave him the voice: the third-person self-reference, the theatrical grandeur, the absolute certainty that he was the hero of his own story.

By **Fantastic Four Annual #2** (1964), Lee and Kirby delivered Doom's origin: the Romani boy from Latveria whose mother, Cynthia, was taken by Mephisto. The scarred face. The mask forged before the metal cooled. Every Doctor Doom story since has been built on that foundation.

The Comic Cut cards that pull from this era contain panels drawn by Jack Kirby himself — the King of Comics. These are fragments of the same pages that defined Marvel's Silver Age.

<img src="${DOOM_CARD}" alt="Doctor Doom 2025 Topps Marvel Mint SDCC Exclusive CGC 10" style="width:100%;max-width:500px;border-radius:12px;margin:24px auto;display:block;" />

## The Evolution: Byrne, Mignola, and Waid (1980s–2000s)

John Byrne's legendary Fantastic Four run in the 1980s elevated Doom from recurring villain to Marvel's greatest antagonist. Byrne understood that Doom wasn't evil — he was *certain*. Certain that only he could save the world, if Reed Richards would simply get out of the way.

Then came **Triumph and Torment** (1989) — the Roger Stern and Mike Mignola graphic novel where Doom allies with Doctor Strange to rescue his mother's soul from Mephisto. It remains one of the most celebrated Marvel stories ever published. The tragedy of Victor Von Doom crystallized in a single story: a man who can conquer the world but cannot save the one person he loves.

Mark Waid's "Unthinkable" arc (Fantastic Four #500, 2003) showed Doom at his most terrifying — sacrificing his childhood love Valeria to gain demonic power, then trapping Franklin Richards in Hell. Ed Brubaker's **Books of Doom** (2006) retold Victor's origin with modern sensibility, tracing the path from orphan to emperor.

Every era added layers. Every writer found new dimensions. And somewhere in those 200 Comic Cut cards, panels from these exact stories exist — physical pieces of Byrne's pencils, Mignola's shadows, Waid's horror.

## God Emperor Doom: Jonathan Hickman's Secret Wars (2015)

Jonathan Hickman spent years building toward **Secret Wars** (2015) — and when it arrived, he did something no writer had dared: he made Doctor Doom *God*.

When the multiverse collapsed, Doom salvaged what he could and forged Battleworld — a patchwork planet where he ruled as God Emperor Doom. He had the power of the Beyonders. He had Sue Storm as his wife. He had everything Reed Richards ever wanted. And it still wasn't enough, because deep down, Victor Von Doom knows he's not the hero. He just can't admit it.

The final confrontation between Doom and Reed Richards in Secret Wars #9 is one of the most powerful moments in Marvel history. Reed asks Victor a simple question: could you have done better? And Doom — God Emperor Doom, who holds the universe in his hands — admits the truth. "Yes. You could have done better."

Hickman's Secret Wars is the culmination of everything Lee, Kirby, Byrne, Stern, Waid, and Brubaker built. It's the definitive Doctor Doom story. And panels from this run are embedded in the 2025 Marvel Mint Comic Cut cards.

## What Makes These Cards Different

Let's be clear about what a Comic Cut card actually is. Topps physically cut panels from real, printed Doctor Doom comic books — spanning the character's entire publication history — and embedded them into trading cards. Each card is sealed in a one-touch case. Each is numbered DD-CC. Each is a true 1/1 because no two panels are identical.

There are 200 of them in the entire set. That's it. 200 unique pieces of Doctor Doom's printed legacy, distributed at 1:61 odds in Hobby boxes and 1:63 in SDCC boxes.

Some of these cards contain Kirby panels from the 1960s. Some contain Byrne art from the 1980s. Some contain Hickman-era pages from 2015. The collector who pulls one isn't just getting a trading card — they're getting a piece of the actual comic book that told that story.

This is unprecedented at this scale for a single character in a modern Topps product.

## Why This Matters Now

The Avengers: Doomsday trailer just confirmed Robert Downey Jr. as Doctor Doom. The 2025 Topps Marvel Mint SDCC exclusive is the only modern premium set with a dedicated Doctor Doom Chrome card — numbered to just 25, 10, 5, and 1. And the 200 Comic Cut cards are the only relic cards in existence that contain actual Doctor Doom comic panels.

The 2026 Marvel Mint at SDCC this week is Spider-Man themed. That means the 2025 set is the *only* Marvel Mint release with Doctor Doom as the featured villain. These Comic Cut cards will never be reprinted. The panels inside them are gone from those comics forever.

From Kirby's first pencil strokes in 1962 to Hickman's cosmic finale in 2015, these 200 cards tell the complete story of Marvel's greatest villain — one panel at a time.

Browse Doctor Doom's full card history in our [Card Database](https://northlandlegendaryfinds.com/cards), or read our deep dive into [the rarity breakdown of the SDCC exclusive Doom Chrome](https://northlandlegendaryfinds.com/mcu-news/doctor-doom-sdcc-exclusive-rarest-card-2025-topps-marvel-mint).

## Collector's Corner

The Doctor Doom Comic Cut cards represent something the hobby has never seen at this scale — 200 unique 1/1 relics from a single character's 60-year history, released at the exact moment that character becomes the MCU's next big villain.

**Hot Cards to Watch:**
- **Doctor Doom Comic Cut (any) 2025 Marvel Mint 1/1** — Irreplaceable artifact. Every single one is unique. The earlier the era, the more historically significant.
- **Doctor Doom Chrome SDCC Exclusive /25** — The only numbered Doom Chrome in a modern Topps Marvel set. Only 25 exist.
- **Doctor Doom Chrome Superfractor 1/1** — The ultimate Doom card. One copy on Earth.
- **Doctor Doom #107 Base Silver Foil /99** — The most accessible numbered Doom in the set. Still under 100 copies.

Track real-time values on **[Card Ladder](https://www.cardladder.com/)** — their market indices show exactly where Doom cards are trending.

Find singles and sealed product on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** — search "2025 Topps Marvel Mint Comic Cut Doom" for the latest pulls.

Monitor graded populations on **[PSA](https://www.psacard.com/)** — early submissions are already hitting the census.

*The 200 Doctor Doom Comic Cut cards span from Fantastic Four #5 (1962) to Secret Wars (2015). Each one is a 1/1. Each one is a piece of history. And they're never making more.*`,
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

  // Update rotation
  await conn.execute(
    `UPDATE site_settings SET value = 'character_profile' WHERE \`key\` = 'last_rotation_template'`
  );
  console.log("✅ Rotation advanced to: character_profile");

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, slug, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 5"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
