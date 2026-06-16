/**
 * Publish: "There Aren't Enough for Everyone. Especially Doctor Doom."
 * Inspired by: @jeremypadawer Instagram reel — Action Comics #1 found 52 years later
 * Template: magazine (next in rotation after collector_spotlight)
 * Run: node publish-doom-not-enough-for-everyone.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-scarcity-hero-CWu5UDyabtcpXHgNb6ZCi7.webp",
  vintage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/vintage-comic-value-split-ScV6aeFscXRTMQmzGjeJd5.webp",
  doom: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-iron-throne-armor-VmFQPA35FiBFR9zZfwmGCF.webp",
};

const now = Date.now();

const article = {
  title: "There Aren't Enough for Everyone. Especially Doctor Doom.",
  slug: "marvel-cards-not-enough-for-everyone-doctor-doom-scarcity",
  excerpt: "A collector bought Action Comics #1 at the 1973 San Diego Comic Con. He held it for over 50 years. The value exploded. Nobody printed more copies. That same math applies to every numbered Topps Marvel card — and right now, no character has more demand pointed at fewer cards than Doctor Doom.",
  featuredImageUrl: IMAGES.hero,
  category: "card_market",
  templateLayout: "magazine",
  tags: JSON.stringify(["Doctor Doom", "Scarcity", "Topps Marvel", "Card Market", "Avengers Doomsday", "Robert Downey Jr", "Collecting", "Action Comics", "Comic Books", "Numbered Cards"]),
  relatedCharacters: JSON.stringify(["Doctor Doom", "Iron Man", "Kang", "Thanos", "Galactus"]),
  cardMarketImpact: "Doctor Doom numbered Topps Marvel cards represent one of the most significant collector opportunities in the hobby right now. With Robert Downey Jr. confirmed as Doom in Avengers: Doomsday, demand is building against a fixed, finite supply. The print run is already set — there is no mechanism to create more.",
  isFeatured: 1,
  isPublished: 1,
  authorName: "NLF Team",
  publishedAt: now,
  metaDescription: "A collector held Action Comics #1 for 50+ years and watched it become worth millions. Nobody printed more. That's the same math behind every numbered Topps Marvel card — and Doctor Doom has the most demand pointed at the fewest cards in the hobby right now.",
  sources: JSON.stringify([
    { title: "@jeremypadawer — 1973 San Diego Comic Con: Action Comics #1 Found 52 Years Later", url: "https://www.instagram.com/reel/DZGv45eAOnB/" },
    { title: "Avengers: Doomsday — Marvel Studios", url: "https://www.marvel.com/movies/avengers-doomsday" },
    { title: "Doctor Doom First Appearance — Fantastic Four #5 (1962)", url: "https://marvel.com/comics/issue/fantastic-four-1961-5" },
  ]),
  contentMarkdown: `In 1973, a young man walked into the San Diego Comic Con and bought a copy of **Action Comics #1** — the first appearance of Superman, published in 1938. He paid what comics cost back then. He brought it home. He kept it.

Over fifty years later, a collector named **Jeremy Padawer** tracked him down. The man's name is Mitchell Mehdy. He still had the book. A CGC 8.5 copy of Action Comics #1 is now worth over eight million dollars.

Nobody printed more copies of Action Comics #1. The number that existed in 1938 is the number that exists today, minus every copy that was lost, damaged, or destroyed in the decades since. That's it. That's the whole supply.

<img src="${IMAGES.hero}" alt="A single graded trading card glowing on dark velvet — the embodiment of scarcity and collector value" style="width:100%;border-radius:12px;margin:16px 0;" />

## The Math That Doesn't Change

Here's the thing about scarcity: it doesn't require a story. It doesn't require hype. It doesn't require a movie announcement or a cultural moment. It just requires math.

When something exists in a fixed, finite quantity and demand for it increases — the math does the rest. Mitchell Mehdy didn't do anything special after 1973. He just held the book. The world changed around it. The supply didn't.

That same math applies to every numbered Topps Marvel card ever printed.

When Topps prints a parallel numbered to a specific run, that number is stamped on the card. It's not a suggestion. It's not a marketing claim. It's the actual count. The number of copies that exist in the world is the number on the card. No factory expansion changes it. No reprint order changes it. No amount of demand changes it.

<img src="${IMAGES.vintage}" alt="A vintage comic book on a worn table versus the same book displayed in a museum case — the same object, decades apart, transformed by time and scarcity" style="width:100%;border-radius:12px;margin:16px 0;" />

## There Aren't Enough for Everyone

This is the part of the hobby that doesn't get talked about enough.

When a character becomes culturally significant — when a movie drops, when a casting announcement lands, when a storyline captures the attention of millions of people who weren't paying attention before — the demand for cards featuring that character increases. Sometimes dramatically. Sometimes overnight.

The supply doesn't move.

There are collectors who will want a Doctor Doom card and simply won't be able to find one. Not because they didn't try. Not because they weren't willing to pay. Because the cards that exist are already in someone else's hands, and those people aren't selling.

That's not speculation. That's how every major character in the hobby has played out when their cultural moment arrived.

## Doctor Doom and the Moment That's Coming

**Robert Downey Jr.** is playing Doctor Doom in *Avengers: Doomsday*. This isn't a rumor. This isn't a leak. This is confirmed, announced, and building toward one of the most anticipated Marvel films in years.

For collectors, the question isn't whether Doom's cultural moment is coming. It's already here, and it's still building. The question is whether the cards you want will still be available when the full weight of that moment lands.

<img src="${IMAGES.doom}" alt="An armored figure in iron and green sits on a throne of stone — commanding, immovable, inevitable" style="width:100%;border-radius:12px;margin:16px 0;" />

Doctor Doom has appeared in Topps Marvel sets across multiple years. His numbered parallels — the cards with a print run stamped directly on the face — exist in quantities that were set at the time of printing. Some of those runs are genuinely small. Some of the autograph versions are among the rarest cards in the entire Topps Marvel catalog.

The people who hold those cards know what they have. They're not in a hurry.

## The Characters Where This Math Matters Most

Doctor Doom is the most obvious example right now, but the same principle applies across the roster of characters whose MCU moments are still ahead of them:

**Galactus** — The World Devourer is confirmed for *Fantastic Four: First Steps* (July 2025). His Topps card presence is limited. His cultural footprint is about to get significantly larger.

**Kang the Conqueror** — Already in the MCU, central to the Multiverse Saga, and featured in the current Avengers comic run. Numbered Kang cards have been actively traded for years. The supply is what it is.

**Storm** — Her expanded role in recent Marvel content and her Avengers presence in the current comic run has been building collector interest steadily. Topps Storm numbered parallels are not easy to find.

**Scarlet Witch** — One of the most powerful characters in the MCU, and one of the two Avengers who accidentally created the Multiverse in the current comic run. Her numbered cards from premium Topps sets are genuinely scarce.

**Thanos** — The original Infinity Saga villain. His cultural moment has already happened, and his numbered cards have reflected that for years. The lesson Thanos teaches collectors is simple: by the time everyone knows the name, the cards are already gone.

## What Mitchell Mehdy Understood (Even If He Didn't Know It)

Mitchell Mehdy didn't buy Action Comics #1 as an investment. He bought it because he loved Superman. He kept it because it mattered to him. And fifty years later, the world caught up to what he already had.

The collectors who hold numbered Topps Marvel cards featuring Doctor Doom, Galactus, Kang, and Scarlet Witch aren't holding them because they ran a spreadsheet. They're holding them because these characters matter to them — and they understood, at some level, that the number on the card is the number on the card.

There aren't enough for everyone.

That's not a warning. That's just the math.

---

*Browse the [NLF Marvel Characters section](https://northlandlegendaryfinds.com/marvel-characters) for deeper dives on the characters shaping the MCU's next chapter. For the latest on Avengers: Doomsday and the Topps Marvel sets featuring these characters, follow [Northland Legendary Finds on Facebook](https://www.facebook.com/northlandlegendaryfinds).*

*Original inspiration: [@jeremypadawer](https://www.instagram.com/jeremypadawer/) — who tracked down Mitchell Mehdy 52 years after the 1973 San Diego Comic Con. A lifetime of collecting, and a story worth telling.*`,
};

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  try {
    await conn.execute(
      `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, templateLayout, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        article.title, article.slug, article.excerpt, article.contentMarkdown,
        article.featuredImageUrl, article.category, article.templateLayout,
        article.tags, article.cardMarketImpact, article.relatedCharacters,
        article.sources, article.isFeatured, article.isPublished,
        article.authorName, article.publishedAt, article.metaDescription,
      ]
    );
    console.log(`✅ Published: "${article.title}"`);
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
  }

  const [rows] = await conn.execute(
    "SELECT id, templateLayout, SUBSTRING(title,1,70) as title FROM articles ORDER BY publishedAt DESC LIMIT 5"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach(r => console.log(`  ${r.id}: [${r.templateLayout}] ${r.title}`));
  await conn.end();
}

main().catch(console.error);
