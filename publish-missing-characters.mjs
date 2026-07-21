import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const title = "Every Major Character Missing From the Avengers: Doomsday Trailer — And Why It Matters for Collectors";
const slug = "avengers-doomsday-trailer-missing-characters-collectors-guide";
const excerpt = "The Doomsday trailer showed us 25 heroes — but some of the biggest names in the MCU are nowhere to be found. Here's who's missing, why Marvel is hiding them, and what it means for the card market.";
const category = "movie_news";
const featuredImageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/missing-characters-doomsday-4MqgobAKorfr4dxDmmhRdL.webp";

const contentMarkdown = `# Every Major Character Missing From the Avengers: Doomsday Trailer — And Why It Matters for Collectors

The first full trailer for *Avengers: Doomsday* dropped and confirmed what we already knew — this is the biggest MCU event since Endgame. Twenty-five characters appeared on screen. Doctor Doom (Robert Downey Jr.) in full armor. The Fantastic Four assembled. X-Men standing alongside Avengers. Chris Evans back as Steve Rogers.

But here's the thing: some of the most powerful names in the MCU are conspicuously absent. And in Marvel's world, absence is never accidental. It's a strategy.

For collectors, every missing character represents a potential surprise reveal — and when those reveals hit, the card market moves fast.

## The Confirmed Cast Who Appeared in the Trailer

The Doomsday trailer gave us our first proper look at the assembled team. The confirmed heroes include Doctor Doom (Robert Downey Jr.), Charles Xavier (Patrick Stewart), the full Fantastic Four — Mister Fantastic (Pedro Pascal), Invisible Woman (Vanessa Kirby), Human Torch (Joseph Quinn), and The Thing (Ebon Moss-Bachrach) — alongside Thor (Chris Hemsworth), Sam Wilson/Captain America (Anthony Mackie), Bucky Barnes (Sebastian Stan), Ant-Man (Paul Rudd), Yelena Belova (Florence Pugh), Namor (Tenoch Huerta Mejía), Shuri (Letitia Wright), Cyclops (James Marsden), Shang-Chi (Simu Liu), Gambit (Channing Tatum), Loki (Tom Hiddleston), Magneto (Ian McKellen), Mystique (Rebecca Romijn), and Steve Rogers (Chris Evans).

That's a stacked roster. But the gaps are telling.

## Confirmed Characters Who Are Missing

These actors have been officially confirmed for Doomsday — announced during that infamous director's chair livestream — but don't appear in any trailer footage.

**Beast (Kelsey Grammer)** was one of the first legacy X-Men confirmed. He appeared as Beast in *The Marvels*, so we know he's MCU-active. His absence from all marketing material suggests either a limited role or scenes too spoiler-heavy to show.

**Nightcrawler (Alan Cumming)** is confirmed to return — and the fact that Marvel told us he's back but refuses to show him is telling. Cumming's Nightcrawler was a fan-favorite in X2, and his return likely ties into whatever the X-Men's role is in the multiverse conflict.

**Sentry (Lewis Pullman)** rounds out the confirmed-but-hidden group. Given that *Thunderbolts** established him as potentially the most powerful being in the MCU, hiding his role in Doomsday feels deliberate. His character "resumes his journey in unexpected ways," according to Pullman himself.

## The Rumored Names — And Why They're Being Hidden

This is where it gets interesting for collectors. These characters have never been officially confirmed, but the evidence is overwhelming.

**Doctor Strange (Benedict Cumberbatch)** is the most intriguing absence. *Multiverse of Madness* ended with Strange causing an incursion between universes — the exact event that drives Doomsday's plot. When asked why he wasn't in the cast reveal, Cumberbatch joked they "didn't have enough chairs." If Strange appears, it's in a pivotal, spoiler-heavy capacity. His cards are already climbing.

**Spider-Man (Tom Holland)** has never been confirmed despite being the MCU's most popular active character. With *Brand New Day* releasing later this month, Marvel may be saving his Doomsday connection for that film's post-credits. But make no mistake — Spider-Man will be in this story somewhere.

**Deadpool and Wolverine (Ryan Reynolds & Hugh Jackman)** are the wildcard. Trades went back and forth on Reynolds' involvement, and Jackman's Wolverine feels inevitable given the X-Men presence. If they appear, expect it to be limited but impactful — and expect the card market to react immediately.

**The Hulk (Mark Ruffalo)** is perhaps the most curious omission. Marvel is clearly trying to reunite the original Avengers — RDJ and Evans are back — but Ruffalo has suggested he won't appear in Doomsday. He may be saved for *Secret Wars* instead, with *Brand New Day* serving as his next chapter.

## What This Means for the Card Market

Here's the collector angle: every hidden character is a ticking time bomb for the market.

When Marvel finally reveals Doctor Strange in Doomsday footage — and they will — his Topps Chrome cards will spike overnight. The same goes for Spider-Man's Brand New Day cards the moment a Doomsday connection is confirmed. Wolverine and Deadpool cards from the *Deadpool & Wolverine* sets are already premium, but a Doomsday appearance would push them higher.

The smart play right now is watching the characters who are being deliberately hidden. Marvel doesn't hide characters unless they have something big planned. And "big" in the MCU means "big" in the card market.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to track values on all these characters, or check out our [full Doomsday trailer breakdown](https://northlandlegendaryfinds.com/mcu-news/avengers-doomsday-trailer-marvel-mint-sdcc-connection) for the cards that appeared in the trailer itself.

## Collector's Corner

The missing characters from the Doomsday trailer represent some of the biggest upside potential in the current Marvel card market. When reveals hit, prices move fast.

**Hot Cards to Watch:**
- **Doctor Strange Topps Chrome Marvel Base & Refractors** — Most undervalued Avenger in the set right now
- **Spider-Man Brand New Day Topps Chrome Parallels** — New set dropping with potential Doomsday tie-in
- **Wolverine Topps Finest X-Men '97 Refractors** — X-Men confirmed in Doomsday, Logan likely hidden
- **Hulk Topps Marvel Mint Medallion Cards** — Original Avenger, Secret Wars implications

Track real-time values on **[Card Ladder](https://www.cardladder.com/)** — the best tool for watching price movements on Marvel cards.

Find singles and deals on **[TCGPlayer](https://www.tcgplayer.com/)** — the largest Marvel card marketplace.

Check grading populations and authentication on **[PSA](https://www.psacard.com/)** — know exactly how rare your cards are.

*Avengers: Doomsday hits theaters December 18, 2026. The Russo Brothers are directing. SDCC 2026 is days away — expect more reveals.*`;

const tags = JSON.stringify(["Avengers Doomsday", "Missing Characters", "Doctor Strange", "Spider-Man", "Wolverine", "Deadpool", "Hulk", "MCU Trailer", "Card Market"]);
const relatedCharacters = JSON.stringify(["Doctor Strange", "Spider-Man", "Wolverine", "Deadpool", "Hulk", "Beast", "Nightcrawler", "Sentry"]);
const sources = JSON.stringify([
  { title: "Reactor - Every Major Character Missing From the Avengers: Doomsday Trailer", url: "https://reactormag.com/characters-missing-avengers-doomsday-trailer/" },
  { title: "NLF - The Doomsday Trailer Just Dropped", url: "https://northlandlegendaryfinds.com/mcu-news/avengers-doomsday-trailer-marvel-mint-sdcc-connection" }
]);
const cardMarketImpact = "Hidden characters represent the biggest upside in the current Marvel card market. When Doctor Strange, Spider-Man, or Wolverine are confirmed for Doomsday, their cards will spike immediately.";
const metaDescription = "The Avengers: Doomsday trailer showed 25 heroes but is hiding some of the biggest names in the MCU. Here's who's missing, why, and what it means for Marvel card collectors.";
const templateLayout = "timeline";

const now = Date.now();

await conn.execute(
  `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription, templateLayout)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, 1, 1, "NLF Team", now, metaDescription, templateLayout]
);

console.log('✅ Published: ' + title);
console.log('   Slug: ' + slug);
console.log('   Template: ' + templateLayout);
console.log('   URL: https://northlandlegendaryfinds.com/mcu-news/' + slug);

// Unfeatured previous featured articles
await conn.execute('UPDATE articles SET isFeatured = 0 WHERE slug != ? AND isFeatured = 1', [slug]);
console.log('✅ Unfeatured previous articles');

await conn.end();
process.exit(0);
