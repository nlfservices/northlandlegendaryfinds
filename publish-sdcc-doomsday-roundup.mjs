/**
 * Publish SDCC 2026 Doomsday News Roundup — July 24, 2026
 * Template: disney_experience (next in rotation after character_profile)
 * Run from project root: node publish-sdcc-doomsday-roundup.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const FEATURED_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sdcc-doomsday-roundup-featured-csBor93DiRn2pPpnGGtJmv.png";

const now = Date.now();

const articles = [
  {
    title: "SDCC 2026 Is a Doomsday Takeover: Trailer Records, Ticket Sales, Topps Exclusives, and Everything Collectors Need to Know",
    slug: "sdcc-2026-avengers-doomsday-roundup-trailer-tickets-topps-marvel-mint-exclusive",
    excerpt: "From a record-shattering trailer to $16.5M in first-day ticket sales, a mysterious Latverian Witch costume, and the 2026 Topps Marvel Mint SDCC Exclusive Box — here's everything happening at San Diego Comic-Con that matters for collectors.",
    featuredImageUrl: FEATURED_IMAGE,
    category: "movie_news",
    templateLayout: "disney_experience",
    tags: JSON.stringify(["SDCC 2026", "Avengers Doomsday", "Trailer", "Topps Marvel Mint", "Doctor Doom", "Comic-Con", "Ticket Sales", "Latverian Witch", "Marvel Legends", "Collector News"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Thor", "Steve Rogers", "Cyclops", "Gambit", "Invisible Woman", "Professor X", "Magneto", "Shang-Chi", "Yelena Belova", "Loki", "Namor"]),
    cardMarketImpact: "The Doomsday trailer confirmation of 30+ characters, combined with the SDCC-exclusive Topps Marvel Mint box and massive ticket pre-sales, is driving demand across every confirmed character's card portfolio. Expect Fox X-Men cards (Cyclops, Gambit, Magneto) and Steve Rogers cards to see the biggest short-term spikes.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Complete SDCC 2026 Avengers Doomsday roundup: trailer breaks Disney records with 503M views, $16.5M ticket sales, Latverian Witch reveal, 2026 Topps Marvel Mint SDCC Exclusive Box, and what it all means for collectors.",
    sources: JSON.stringify([
      { title: "Gizmodo — Doomsday Trailer Breakdown", url: "https://gizmodo.com/avengers-doomsday-trailer-breakdown-easter-eggs-secrets-plot-2000787741" },
      { title: "JoBlo — Doomsday Ticket Sales", url: "https://www.joblo.com/avengers-doomsday-ticket-sales/" },
      { title: "The Direct — Latverian Witch Reveal", url: "https://thedirect.com/article/avengers-doomsday-latverian-witch-elizabeth-olsen-scarlet-witch-return" },
      { title: "MouseInfo — SDCC Marvel Booth", url: "https://mouseinfo.com/2026/07/sdcc-2026-avengers-doomsday-takes-over-marvel-booth-with-costumes-photo-ops-wolverine/" },
      { title: "Steel City Collectibles — Topps Marvel Mint SDCC Box", url: "https://www.steelcitycollectibles.com/i/2026-topps-marvel-mint-sdcc-exclusive-box" },
      { title: "Polygon — SDCC 2026 Roundup", url: "https://www.polygon.com/san-diego-comic-con-2026-sdcc-news-reveals-trailers/" }
    ]),
    contentMarkdown: `San Diego Comic-Con 2026 hasn't even reached its Saturday Hall H crescendo yet, and it's already the most consequential convention for Marvel collectors in years. The Avengers: Doomsday marketing machine shifted into overdrive this week with a trailer that shattered Disney records, ticket pre-sales that doubled the last Marvel blockbuster, a mysterious new character reveal on the show floor, and — most importantly for us — the 2026 Topps Marvel Mint SDCC Exclusive Box hitting the lottery winners' hands. Let's break down everything that happened and what it means for your collection.

## The Trailer That Broke the Internet (503 Million Views)

Marvel dropped the first full Avengers: Doomsday trailer on July 20, and the internet responded accordingly. The trailer racked up 503 million views in its first 24 hours, making it Disney's most-viewed trailer of all time — surpassing the Deadpool & Wolverine Super Bowl teaser (365 million views). For context, only Sony's Spider-Man: Brand New Day trailer has ever launched bigger at 719 million views.

The trailer opens at a battered Xavier's School for Gifted Youngsters with Professor X (Patrick Stewart) shielding his eyes from an unnatural light. Robert Downey Jr.'s Doctor Doom narrates the ominous warning: "Something's coming. Something we may not be able to deter. Before this day is done, we shall be faced with an unthinkable decision."

From there, it's a greatest-hits assembly: Thor (Chris Hemsworth) escorts the Fantastic Four into Avengers Tower to meet Sam Wilson's Captain America, Bucky, and Ant-Man. The Thunderbolts line up alongside the Fantastic Four. Wakandans face off against Namor in Talokan. Cyclops (James Marsden) watches Xavier's School explode. Gambit (Channing Tatum) fights Shang-Chi (Simu Liu). Loki twirls his TVA card. Mystique shapeshifts into Yelena. And Professor X and Magneto clasp hands in what might be the most emotionally loaded shot in the trailer.

The money moment: Thor brings Stormbreaker down on Doctor Doom in a devastating blow — and Doom deflects it with two fingers. Then the button: Steve Rogers (Chris Evans) strolls in, summons Mjolnir, and says "Hey, pal." Thor whispers "It's not possible." Neither can we, Thor. Neither can we.

## Ticket Sales Doubled Deadpool & Wolverine ($16.5 Million Day One)

When tickets went on sale alongside the trailer drop, Avengers: Doomsday generated $16.5 million in advance ticket sales on its first day alone. That's double what Deadpool & Wolverine pulled on its first day — and D&W went on to gross over $1.3 billion worldwide.

Here's what makes that number even more impressive: Deadpool & Wolverine tickets were available across all formats and screens. Doomsday tickets were initially limited to premium formats at just 1,000 domestic theaters. Premium-format showtimes for December 17 and 18 are already largely sold out, and exhibitors are scrambling to add Christmas Day screenings.

The official runtime has been confirmed at 166 minutes (2 hours, 46 minutes), making it longer than Infinity War but shorter than Endgame. The film hits theaters December 18, 2026.

## The SDCC Booth Takeover: Costumes, Sentinels, and a Mystery

Marvel's Booth #2329 at SDCC is a full Doomsday experience this year. On display are screen-used costumes for Cyclops, Sue Storm (Invisible Woman), Thor, Captain America (Sam Wilson), Yelena Belova, and Gambit. There's a giant Sentinel head photo-op, an X-Men door, a Xavier's School-themed wall, and a Wolverine station where fans get free comics and claw props.

But the real conversation starter is a costume labeled "Latverian Witch." This brand-new character wears long green robes resembling Doctor Doom's, a silver mask similar to Doom's but with more defined lips, a hooded green cloak, and silver metal gloves. The internet immediately erupted with theories that this could be Elizabeth Olsen returning as a Latverian variant of Wanda Maximoff — especially given the comic history between Doom and Scarlet Witch in the Children's Crusade storyline (2010-11), where a memory-wiped Wanda lived willingly in Latveria with Doom.

A recent Marvel Legends Doctor Doom figure also shipped with red magic-colored plastic attachments, further fueling the Scarlet Witch connection. Whether this is Olsen or an entirely new character, the Latverian Witch just became one of the most intriguing mysteries heading into December.

## 2026 Topps Marvel Mint SDCC Exclusive Box: The Collector's Holy Grail

This is the one that matters most for our community. The 2026 Topps Marvel Mint SDCC Exclusive Box dropped on July 22 — available only to lottery winners at the convention. Here's what's inside:

Each box contains 11 cards with 1 encased card and 1 numbered parallel on average. The SDCC-exclusive chase includes Black & Yellow Electric Dots Foil Parallels numbered to just 10, plus three exclusive original art cards by Ian McDonald featuring Spider-Man, Hulk, and The Punisher.

The 2026 set expands to a 125-card base set printed on thick foil stock, divided into four collectible tiers: Bronze (4 per pack), Silver (3 per pack), Gold (2 per pack), and Platinum (numbered to 99 or less). New inserts include the Cerebro set — a 55-card Chrome collection numbered to 99 or less featuring Professor X tracking mutants across the globe — and the Symbiote Takeover insert (30 cards spotlighting characters bonded with symbiotes).

The premium hits include Chrome Autographs of comic artists and MCU actors, a Stan Lee cut signature, and Comic Cut relics of Spider-Man — all one-of-ones from the webslinger's most iconic issues. Topps presales for the general release are expected July 28.

If you're at the con and hit the lottery, you're holding what could be the most sought-after Marvel Mint product of the year. Those Ian McDonald original art cards are going to be grails.

## Hall H Saturday: Kevin Feige's MCU Through 2042

The biggest panel hasn't even happened yet. Marvel Studios takes over Hall H on Saturday, July 25 from 5:30-6:30 PM PT, with Kevin Feige leading what promises to be a massive presentation. Feige has already teased that Marvel has plans for the MCU through 2042 — yes, sixteen more years of content.

He's also confirmed that Avengers: Secret Wars (the follow-up to Doomsday) will NOT be a full MCU reboot, instead following Jonathan Hickman's Secret Wars comic roadmap from 2015. That's significant for collectors: continuity means your existing character cards retain their relevance across the entire saga.

Expect exclusive footage, potential cast appearances (Robert Downey Jr. in Hall H would break the building), and possibly announcements about the post-Secret Wars slate. We'll be watching closely for any trading card or collectible tie-ins announced during the panel.

## Marvel Legends and Hot Toys: The Figure Reveals

Hasbro unveiled the Avengers: Doomsday Marvel Legends wave at SDCC, featuring figures for Shang-Chi, Thor, Gambit, Invisible Woman, The Thing, Human Torch, and Mr. Fantastic. They also revealed a Vision & Scarlet Witch two-pack, an SDCC-exclusive Professor X with hoverchair, and a 1967 Spider-Man cartoon 3-pack.

Hot Toys announced they'll reveal their premium Avengers: Doomsday figures on July 26 at SDCC, with preorders already live at around the $250 price point. When Hot Toys commits to a character lineup, it often signals which characters will have the most screen time — worth watching for card speculation purposes.

## What This All Means for Your Collection

Let's connect the dots between SDCC and your card portfolio. The trailer confirmed 30+ characters with significant screen time, and every single one of them has cards in existing Topps sets. Here's the collector calculus:

The Fox X-Men cast — Patrick Stewart (Professor X), Ian McKellen (Magneto), James Marsden (Cyclops), Channing Tatum (Gambit), Rebecca Romijn (Mystique), Kelsey Grammer (Beast), Alan Cumming (Nightcrawler) — are now officially in the MCU. Vintage X-Men cards featuring these actors just gained a massive new relevance layer. Gambit cards in particular are surging given Channing Tatum's prominent trailer placement.

Steve Rogers' return with Mjolnir means Chris Evans cards are heating up fast. The "Hey, pal" moment is already iconic, and we're still five months from release.

The Latverian Witch mystery creates a speculative opportunity. If this IS Elizabeth Olsen's Scarlet Witch returning, Wanda Maximoff cards — especially the 2025 Topps Marvel Mint Scarlet Witch — could see significant movement once confirmed.

And the 2026 Topps Marvel Mint SDCC Exclusive with its /10 Electric Dots parallels and Ian McDonald original art cards? Those are instant grails that will only appreciate as the Doomsday hype cycle intensifies through December.

## Collector's Corner

SDCC 2026 is delivering on every front for Marvel collectors. Between the trailer confirmation of the full cast, the exclusive Topps product, and five months of hype still ahead, this is the window to position your collection before mainstream demand peaks at release.

**Hot Cards to Watch:**
- **Gambit 2026 Topps Marvel Mint Chrome** — Channing Tatum's prominent trailer role just validated every Gambit card in existence
- **Cyclops 2025 Topps Marvel Mint Base/Parallels** — James Marsden's return plus the SDCC costume display signals major screen time
- **Steve Rogers 2025 Topps Chrome Marvel** — The Mjolnir return moment is already the most talked-about scene; Chris Evans cards are moving
- **Doctor Doom 2025 Topps Marvel Mint SDCC Chrome /25** — The two-finger Stormbreaker deflection cemented Doom as the ultimate MCU villain; his SDCC parallels are the trophy cards

Track real-time price movements on **[Card Ladder](https://www.cardladder.com/)** to see which characters are spiking post-trailer. Browse the full confirmed Doomsday roster in our **[character database](https://northlandlegendaryfinds.com/characters)** to identify cards you might be missing. And check sold listings on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** to see what's actually moving right now.

*Avengers: Doomsday hits theaters December 18, 2026. Hall H panel drops Saturday, July 25 at 5:30 PM PT. Topps Marvel Mint presales expected July 28.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Unfeature previous featured article
  await conn.execute("UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1");

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

  // Advance template rotation
  await conn.execute(
    "UPDATE site_settings SET value = 'disney_experience', updatedAt = NOW() WHERE `key` = 'last_rotation_template'"
  );
  console.log("✅ Template rotation advanced to: disney_experience");

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, publishedAt, isFeatured, templateLayout FROM articles ORDER BY publishedAt DESC LIMIT 5"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.templateLayout}] [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
