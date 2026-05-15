/**
 * Publish Knull Villain Comparison Article — May 2026
 * Run from project root: node publish-knull-villain-comparison.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/knull-villain-comparison-featured-ZmzhaiCwie3rW54GVghVa5.webp",
  symbioteArmy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/knull-symbiote-army-inline-5cY5YZevmXmebCNfppXe3g.webp",
  necrosword: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/knull-all-black-necrosword-inline-GLwjVjFvypRqPQgUsRxXhY.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Knull vs. Marvel's Greatest Villains: How the God of Symbiotes Stacks Up Against Thanos, Doom, Kang, and More",
    slug: "knull-vs-marvel-greatest-villains-comparison-thanos-doom-kang",
    excerpt: "From the primordial void to the King in Black — how does Knull, the God of Symbiotes, compare to Thanos, Doctor Doom, Kang the Conqueror, Galactus, and Marvel's other cosmic-level threats? We break down every matchup and what it means for collectors.",
    featuredImageUrl: IMAGES.featured,
    category: "analysis",
    tags: JSON.stringify(["Knull", "Thanos", "Doctor Doom", "Kang", "Galactus", "Villains", "King in Black", "Symbiotes", "Venom", "Marvel Villains", "Power Rankings", "Cosmic Villains"]),
    relatedCharacters: JSON.stringify(["Knull", "Thanos", "Doctor Doom", "Kang the Conqueror", "Galactus", "Venom", "Carnage", "Gorr", "Dormammu", "Silver Surfer", "Eddie Brock"]),
    cardMarketImpact: "Knull's rising profile across comics, film (Venom: The Last Dance), and the Queen in Black event is driving demand for symbiote-related cards. Venom and Carnage parallels from Topps Chrome Marvel continue to climb, while Knull's own card appearances remain relatively scarce — making early pulls potential long-term holds.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "How does Knull compare to Thanos, Doctor Doom, Kang, and Galactus? We rank Marvel's greatest villains by power, threat level, and trading card market impact.",
    sources: JSON.stringify([
      { title: "Marvel.com — Meet Knull, the God of Symbiotes", url: "https://www.marvel.com/articles/comics/knull-god-symbiotes-klyntar-history-explained" },
      { title: "CBR — 10 Strongest Cosmic Powered Marvel Villains, Ranked", url: "https://www.cbr.com/most-powerful-cosmic-powered-marvel-villains/" },
      { title: "ComicBook.com — Marvel's 10 Most Iconic Cosmic Villains of All Time", url: "https://comicbook.com/comics/list/marvels-10-most-iconic-cosmic-villains-of-all-time-ranked-by-threat-level/" },
      { title: "Screen Rant — Thanos' Death Crowns A New Ultimate Villain", url: "https://screenrant.com/thanos-dead-knull-king-black-winner/" },
    ]),
    contentMarkdown: `Marvel has never been short on world-ending threats, but few villains have reshaped the cosmic hierarchy quite like **Knull, the God of Symbiotes**. The primordial deity who created every symbiote in existence — from Venom to Carnage to an army of living darkness — has rapidly ascended from a relatively new character (first fully appearing in *Venom* #4 in 2018) to one of the most feared beings in Marvel lore. With the *Queen in Black* event currently unfolding in comics and Andy Serkis's live-action portrayal in *Venom: The Last Dance* still fresh in fans' minds, Knull's stock has never been higher.

But how does the King in Black actually measure up against Marvel's other legendary villains? We're breaking down every major matchup — from the Mad Titan to the Devourer of Worlds — and what each comparison means for the trading card market.

## Who Is Knull?

Before we get into the comparisons, let's establish what makes Knull so terrifying. Unlike most Marvel villains who rose to power through technology, mutation, or cosmic accidents, Knull's existence **predates the current Marvel Multiverse itself**. He was born from the primordial void that existed between the Sixth and Seventh Cosmos — making him older than the Celestials, older than Galactus, and older than the concept of light itself.

When the Celestials created the Seventh Cosmos and flooded reality with light, Knull was furious. He rejected their offer to serve as "King in Black" and instead **beheaded a Celestial** with a weapon he forged from living darkness — the legendary **All-Black the Necrosword**. That severed Celestial head? It eventually became **Knowhere**, the cosmic outpost familiar to Guardians of the Galaxy fans.

<img src="${IMAGES.necrosword}" alt="The All-Black Necrosword, Knull's god-killing weapon forged from living darkness" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

From there, Knull created the entire symbiote race as weapons of war, building an army of symbiote dragons to wage an eternal crusade against the light. He was eventually imprisoned by his own creations when the symbiotes rebelled, trapped inside a planet made of billions of Klyntar for eons — until Carnage's rampage in *Absolute Carnage* accidentally freed him.

## Knull vs. Thanos: The Mad Titan

**Thanos** is arguably Marvel's most iconic villain, especially after Josh Brolin's portrayal across the MCU's Infinity Saga. But in terms of raw power, the comparison is more lopsided than many fans realize.

Without the Infinity Gauntlet, Thanos is an Eternal with a Deviant mutation — extraordinarily powerful, but still fundamentally mortal. Knull is a **primordial god** who existed before the universe. In recent 2025 comics, Thanos directly confronted Knull and was decisively outmatched. Screen Rant noted that "Thanos survives his fight with Knull longer than he should" — a backhanded compliment that underscores the power gap.

Where Thanos excels is **intelligence and strategy**. The Mad Titan is one of the most brilliant minds in Marvel, capable of manipulating cosmic forces and entire civilizations to achieve his goals. Knull, by contrast, is more of a primal force — overwhelming and relentless, but less calculating. With the Infinity Gauntlet, Thanos could theoretically match or exceed Knull, but that's a conditional power-up rather than an inherent ability.

**Card Market Take:** Thanos cards remain the gold standard for Marvel villain collecting. His *Topps Chrome Marvel* base cards and parallels are consistently among the most traded. Knull cards are scarcer but climbing — his appearances in *2024 Upper Deck Marvel Renditions* and *Topps Marvel Collect 2025* are worth watching as his profile grows.

## Knull vs. Doctor Doom: The Next MCU Big Bad

**Doctor Doom** is the villain on everyone's mind right now, with Robert Downey Jr. set to portray Victor Von Doom in *Avengers: Doomsday* (May 2026). But comparing Doom to Knull reveals two fundamentally different types of threat.

At his base level, Doom is a mortal man — enhanced by sorcery and encased in advanced technology, but still human. In a straight fight, base-level Doom would be overwhelmed by Knull. However, Doom's genius is his true superpower. As **God Emperor Doom** during *Secret Wars* (2015), he wielded the power of the Beyonders and reshaped reality itself — a feat that would put him on par with or above Knull.

The key difference is **consistency**. Knull is *always* at cosmic-threat level. Doom fluctuates between "brilliant dictator of a small European nation" and "literal god," depending on what he's managed to steal, build, or scheme his way into. In the MCU, Doom's role in *Doomsday* and *Secret Wars* suggests he'll be operating at the higher end of that spectrum.

**Card Market Take:** Doctor Doom cards are experiencing a massive surge ahead of *Doomsday*'s release. The RDJ casting announcement sent Doom parallels skyrocketing. If you're holding Doom cards from *Topps Chrome Marvel* or *Topps Brooklyn Collection*, the next 12 months could be very rewarding.

## Knull vs. Kang the Conqueror: The Time Lord

**Kang the Conqueror** was supposed to be the MCU's next Thanos-level threat, but Jonathan Majors' departure reshuffled those plans. In the comics, Kang is a time-traveling human from the 31st century — brilliant and dangerous, but nowhere near Knull's cosmic weight class.

Kang's power comes from **temporal manipulation** and advanced technology, not inherent cosmic ability. He can rewrite timelines, deploy armies from across history, and create infinite variants of himself. But in a direct confrontation, Knull would overwhelm him. The comparison is less about who wins in a fight and more about the *nature* of their threat — Kang threatens the timeline, while Knull threatens existence itself.

**Card Market Take:** Kang cards have cooled significantly since the MCU pivot away from the character. His *Topps Chrome* parallels that were once commanding premium prices have come back to earth. This could represent a buying opportunity for long-term collectors, as Kang remains a major comics character regardless of MCU status.

## Knull vs. Galactus: The Devourer of Worlds

This is the matchup that generates the most debate among Marvel fans, because **Galactus** and Knull occupy a similar tier of cosmic power. Both can dispatch a single Celestial. Both have been overwhelmed by groups of Celestials. Both are fundamental forces of the Marvel Universe.

Galactus is the last survivor of the universe that existed before the current one, transformed into the Devourer of Worlds by the cosmic entity known as the Sentience of the Sixth Cosmos. He consumes planets to sustain himself and maintain the cosmic balance. Knull, meanwhile, is primordial darkness given form — he doesn't consume worlds, he **corrupts and assimilates** all life.

The key distinction is that Galactus serves a cosmic purpose (maintaining balance), while Knull's only goal is the annihilation of light. A fully-fed Galactus is likely Knull's equal or superior, but a weakened Galactus would fall. In the comics, both have been depicted as universe-level threats that require the combined might of Marvel's heroes to stop.

**Card Market Take:** Galactus cards carry decades of collector nostalgia and remain premium pulls in any set. With *Fantastic Four: First Steps* (July 2025) introducing Galactus to the MCU, his card values are trending upward. Knull vs. Galactus is essentially a battle of "established icon" vs. "rising star" in the card market.

<img src="${IMAGES.symbioteArmy}" alt="Knull's symbiote dragon army descending upon a city" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

## Knull vs. Dormammu: Lord of the Dark Dimension

**Dormammu** rules the Dark Dimension and is one of Marvel's most powerful mystical entities. Both he and Knull deal in darkness, but their domains are fundamentally different. Dormammu's power is magical and dimensional — he's essentially a god within his own realm and immensely powerful outside it. Knull's darkness is more primal and physical, manifesting through symbiotes rather than spells.

In a direct confrontation, this would likely be a stalemate or depend heavily on the battlefield. Dormammu in the Dark Dimension is nearly unbeatable. Knull with his full symbiote army in normal space is equally overwhelming. The MCU's Doctor Strange bargained with Dormammu rather than fighting him — a testament to the entity's power level.

## Knull vs. Gorr the God-Butcher: Student and Master

This comparison is unique because **Gorr** was essentially Knull's unwitting servant. When Gorr discovered the wounded Knull on an alien world, he bonded with a fragment of Knull's symbiote armor and forged it into a weapon — unknowingly wielding a piece of the All-Black Necrosword. Gorr then spent centuries hunting and killing gods across the cosmos, all while channeling Knull's power without realizing it.

Christian Bale portrayed Gorr in *Thor: Love and Thunder* (2022), giving the character mainstream recognition. But without the All-Black, Gorr is simply a grief-stricken alien with no inherent powers. He's a cautionary tale about what happens when Knull's darkness finds a willing host.

**Card Market Take:** Gorr cards spiked around *Love and Thunder*'s release but have since settled. They remain an interesting hold for collectors who believe the character could return in future MCU projects.

## The Full Villain Power Rankings

Here's how Marvel's greatest villains stack up, ranked by raw cosmic power level:

**Tier 1 — Cosmic/Primordial:**
- **Knull** — Primordial god of darkness, creator of symbiotes, can kill Celestials
- **Galactus** — Devourer of Worlds, cosmic balance entity, planet-level power
- **Dormammu** — Ruler of the Dark Dimension, near-omnipotent in his realm

**Tier 2 — Universe-Level Threats (Conditional):**
- **Thanos (with Infinity Gauntlet)** — Reality-warping, omnipotent with all six stones
- **Doctor Doom (as God Emperor)** — Wielded Beyonder power, reshaped reality
- **Gorr (with All-Black)** — God-killing power borrowed from Knull

**Tier 3 — Major Cosmic Threats:**
- **Thanos (base)** — Eternal/Deviant hybrid, genius-level intellect, immense strength
- **Kang the Conqueror** — Time manipulation, infinite variants, advanced tech
- **Doctor Doom (base)** — Sorcery + technology, Latverian resources, genius intellect

**Tier 4 — Knull's Legacy:**
- **Carnage** — Knull's most devoted symbiote, chaos incarnate
- **Gorr (without All-Black)** — Mortal alien, no inherent powers

## What This Means for Collectors

The villain hierarchy directly impacts the trading card market. Characters at the top of the power rankings tend to command premium prices, especially when they're featured in active MCU projects. Right now, the convergence of *Avengers: Doomsday* (Doctor Doom), *Queen in Black* (Knull), and *Fantastic Four: First Steps* (Galactus) means **villain cards are having a moment**.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to find Knull, Venom, and symbiote-related cards, or explore villain pages in our [Characters section](https://northlandlegendaryfinds.com/characters). For the latest MCU villain news, check our [MCU Spotlight](https://northlandlegendaryfinds.com/mcu-spotlight).

## Collector's Corner

With Knull's profile surging across comics and film, symbiote-related cards are among the hottest pulls in the Marvel trading card market right now. The *Queen in Black* event is keeping Knull in the spotlight, and any future MCU appearance would send his card values through the roof.

**Hot Cards to Watch:**
- **Knull #10 2024 Upper Deck Marvel Renditions** — One of Knull's earliest trading card appearances; scarce and climbing
- **Venom Base Topps Chrome Marvel (2024) Refractor Parallels** — The symbiote king benefits directly from Knull hype
- **Doctor Doom Topps Brooklyn Collection Marvel (2025) Numbered Parallels** — Doomsday anticipation is driving premium Doom cards
- **Carnage Topps Chrome Marvel (2024) SuperFractor** — Knull's most devoted symbiote; always in demand among villain collectors

Check the latest prices on **[Card Ladder](https://www.cardladder.com/)** — their price tracking tools are essential for monitoring symbiote card trends.

Track real sold prices on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** to see what Knull and villain cards are actually selling for.

Browse singles on **[COMC](https://www.comc.com/)** for hard-to-find Knull and symbiote cards at competitive prices.

*The Queen in Black event continues through summer 2026, with Avengers: Doomsday arriving May 1, 2026 — two massive catalysts for Marvel villain card values.*`,
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
    "SELECT id, title, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 10"
  );
  console.log("\\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log(`\\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
