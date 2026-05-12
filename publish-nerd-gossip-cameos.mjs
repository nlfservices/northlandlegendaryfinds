/**
 * Publish Nerd Gossip: Doomsday Cameos Article — May 2026
 * Run from project root: node publish-nerd-gossip-cameos.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const FEATURED_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nerd-gossip-cameos-BXV7JTLWWzbqBBCkAtK2Mu.webp";

const now = Date.now();

const articles = [
  {
    title: "Every Rumored Cameo in Avengers: Doomsday — The Complete Nerd Gossip Breakdown",
    slug: "every-rumored-cameo-avengers-doomsday-complete-nerd-gossip-breakdown",
    excerpt: "From Ben Affleck's Daredevil to Cosmic Ghost Rider, we break down every rumored cameo in Avengers: Doomsday and what each one means for your Marvel card collection.",
    featuredImageUrl: FEATURED_IMAGE,
    category: "nerd_gossip",
    tags: JSON.stringify(["Avengers Doomsday", "Cameos", "Rumors", "Doctor Doom", "Daredevil", "Spider-Gwen", "Cosmic Ghost Rider", "Rune King Thor", "Maestro Hulk", "Nerd Gossip"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Spider-Man", "Wolverine", "Daredevil", "Ghost Rider", "Hulk", "Thor", "Scarlet Witch", "Doctor Strange", "Blade"]),
    cardMarketImpact: "If even half of these cameos materialize, demand for variant character cards in both Marvel Mint and Comic Book Heroes will surge dramatically. Characters like Ghost Rider, Blade, and Daredevil could see 200-400% price increases on numbered parallels.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Complete breakdown of every rumored cameo in Avengers: Doomsday including Ben Affleck Daredevil, Cosmic Ghost Rider, Rune King Thor, and more. Plus card market impact for Marvel Mint and Comic Book Heroes collectors.",
    sources: JSON.stringify([
      { title: "YouTube MCU Cameo Breakdown", url: "https://www.youtube.com/watch?v=bD9zkzcQgt0" },
      { title: "Inside the Magic - Doomsday Report", url: "https://insidethemagic.net/2026/05/marvel-reportedly-scraps-current-avengers-for-hugh-jackman-and-tobey-maguire-replacement-in-doomsday-sb1/" },
      { title: "Rise of Doom - Card #56", url: "https://riseofdoom.com/cards/56" }
    ]),
    contentMarkdown: `The rumor mill is spinning at full speed, and Avengers: Doomsday is shaping up to be the most cameo-packed Marvel film ever made. We dug through every leak, insider report, and "trust me bro" source circulating right now to bring you the definitive breakdown of who might be stepping through the multiverse portal this December.

**Important disclaimer:** Everything below is unconfirmed rumor and speculation. Marvel Studios has not officially confirmed any of these appearances. But where there is smoke, there is usually fire — and the smoke signals on this one are enormous.

## The Production Lockdown

Before we get into the cameos, it is worth noting just how seriously the Russo Brothers are taking leak prevention this time around. According to multiple sources, the production is using **fake code names** in scripts to throw off anyone who gets their hands on pages:

- Tobey Maguire is listed as **"Venom"** in scripts
- Wolverine is coded as **"X-23"**
- Captain America goes by **"Luke Cage"**

Body doubles are being used extensively on set, and different actors are reportedly receiving different versions of scenes. This level of secrecy has not been seen since Avengers: Endgame — which tells you everything about the scale of what they are hiding.

## The Golden Masks

One of the most intriguing leaks involves a faction of characters wearing **golden masks** throughout the film. At a key moment, they reportedly remove the masks to reveal their identities to the audience. This could be the mechanism Marvel uses for its biggest cameo reveals — imagine a lineup of masked figures, and one by one, the masks come off to show faces the audience never expected to see in the MCU.

## Tier 1: The Heavy Hitters

These are the cameos that multiple independent sources have corroborated. If you are betting on any appearances, these are the safest bets.

### Ben Affleck as Daredevil

This is one of the most persistent and widely believed rumors. Ben Affleck returning as a multiverse variant of Matt Murdock would be an absolute showstopper. One specific leak describes a scene where a **telepath — either Psylocke or Emma Frost — attempts to attack Daredevil's mind** but completely fails because his heightened extra-sensory perception is so overwhelming that it causes the telepath physical pain.

That scene alone would break the internet.

**Card Watch:** Daredevil sits at **#116 in the Platinum tier** of 2025 Topps Marvel Mint — only **220 total numbered cards** exist for this character. In Comic Book Heroes, Daredevil appears at **#3 (1975 era), #33 (1976 era), and #112 (2025 era)** — three different artistic interpretations across the decades. If Affleck shows up, these cards are going to move fast.

Browse Daredevil cards: [mintcomiccards.com/cards/116](https://mintcomiccards.com/cards/116) | [comicbookcard.com/card/112](https://comicbookcard.com/card/112)

[Search eBay for Daredevil Marvel Mint cards](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+daredevil)

### Emma Stone as Spider-Gwen

The rumor here is that Emma Stone would play Spider-Gwen — a multiverse variant of Gwen Stacy who got bitten by the spider instead of Peter Parker. The twist? She may be fighting against an **evil Andrew Garfield Spider-Man** who is working for Doom. The idea of two Amazing Spider-Man universe actors facing off on opposite sides is the kind of storytelling only the multiverse can deliver.

**Card Watch:** Ghost-Spider (Spider-Gwen) is **#91 in the Gold tier** of Marvel Mint with **236 total numbered cards**. In Comic Book Heroes, Ghost-Spider appears at **#118 in the 2025 era**. These are currently undervalued compared to the main Spider-Man cards.

Browse Ghost-Spider cards: [mintcomiccards.com/cards/91](https://mintcomiccards.com/cards/91) | [comicbookcard.com/card/118](https://comicbookcard.com/card/118)

[Search eBay for Ghost-Spider Marvel Mint cards](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+ghost+spider)

### Wesley Snipes as Blade

The original Blade. The man who kicked off the modern superhero movie era before anyone else. Wesley Snipes returning as a multiverse variant of Blade would be a massive nostalgia play. One source specifically hopes for a fight scene between Blade and either Gambit or Nightcrawler — which would be visually spectacular.

**Card Watch:** Blade holds the **#111 Platinum tier** spot in Marvel Mint — only **220 total numbered cards**. In Comic Book Heroes, Blade appears at **#29 in the 1976 era**. The Platinum tier placement means Blade has the exclusive Silver Foil /99 and SDCC Black & Yellow Electric Dots /10 parallels that lower-tier characters do not get.

Browse Blade cards: [mintcomiccards.com/cards/111](https://mintcomiccards.com/cards/111) | [comicbookcard.com/card/29](https://comicbookcard.com/card/29)

[Search eBay for Blade Marvel Mint cards](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+blade)

## Tier 2: The Multiverse Variants

These are the wild card appearances — alternate universe versions of characters we already know. If Marvel goes full Battleworld, these variants could steal the entire film.

### Dark Beast (Evil Beast)

This is not your friendly neighborhood Hank McCoy. Dark Beast is an evil version of Beast who, according to the leak, has been **creating bombs that blow up entire universes** and may be working directly for Doom. Think of him as Doom's chief scientist — the one doing the dirty work of collapsing realities.

**Card Watch:** Beast is **#51 in the Silver tier** of Marvel Mint with **261 total numbered cards**. In Comic Book Heroes, Beast appears at **#104 in the 2025 era**. A Dark Beast appearance would spike interest in all Beast cards across both sets.

Browse Beast cards: [mintcomiccards.com/cards/51](https://mintcomiccards.com/cards/51) | [comicbookcard.com/card/104](https://comicbookcard.com/card/104)

### Rune King Thor

This is Thor at his absolute most powerful — a version who has gained the Odinforce AND the knowledge of the ancient runes. Rune King Thor is essentially omnipotent. If Marvel puts this version on screen, it would be the most powerful character ever depicted in the MCU.

**Card Watch:** Thor sits at **#105 in the Platinum tier** of Marvel Mint — only **220 total numbered cards**. In Comic Book Heroes, Thor appears at **#25 (1975 era), #54 (1976 era), and #97 (2000s era)** — three cards across the decades. A Rune King Thor appearance would make every Thor card a must-have.

Browse Thor cards: [mintcomiccards.com/cards/105](https://mintcomiccards.com/cards/105) | [comicbookcard.com/card/25](https://comicbookcard.com/card/25)

[Search eBay for Thor Marvel Mint Platinum cards](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+thor+platinum)

### Cosmic Ghost Rider

Frank Castle — the Punisher — but as a Ghost Rider who also became a Herald of Galactus. Cosmic Ghost Rider has the Spirit of Vengeance AND the Power Cosmic. He is one of the most visually stunning characters in all of Marvel Comics, and putting him on screen would be an instant fan-favorite moment.

**Card Watch:** Ghost Rider is **#83 in the Gold tier** of Marvel Mint with **236 total numbered cards**. In Comic Book Heroes, Ghost Rider appears at **#8 in the 1975 era**. The Cosmic Ghost Rider variant would drive demand for all Ghost Rider cards since there is no separate Cosmic version in either set.

Browse Ghost Rider cards: [mintcomiccards.com/cards/83](https://mintcomiccards.com/cards/83) | [comicbookcard.com/card/8](https://comicbookcard.com/card/8)

[Search eBay for Ghost Rider Marvel Mint cards](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+ghost+rider)

### Old Man Phoenix (Wolverine as Phoenix Force Host)

In the comics, there is a reality where Wolverine is the last living person. The Phoenix Force — having no other host — bonds with Logan, creating Old Man Phoenix. A version of Hugh Jackman's Wolverine wielding the Phoenix Force would be one of the most jaw-dropping visuals in MCU history.

**Card Watch:** Wolverine is **#102 in the Platinum tier** of Marvel Mint — only **220 total numbered cards**. Jean Grey / Phoenix appears at **#97 in the Gold tier** and **#130 in Comic Book Heroes (2025 era)**. An Old Man Phoenix appearance would spike both Wolverine AND Phoenix cards simultaneously.

Browse Wolverine cards: [mintcomiccards.com/cards/102](https://mintcomiccards.com/cards/102) | [comicbookcard.com/card/99](https://comicbookcard.com/card/99)

### Maestro Hulk

An evil, world-conquering version of the Hulk from a dystopian future. Maestro has Banner's intelligence combined with Hulk's strength, and he has already conquered his entire Earth. The rumor suggests Doom might recruit Maestro as one of his generals for Battleworld.

**Card Watch:** Hulk is **#109 in the Platinum tier** of Marvel Mint — only **220 total numbered cards**. In Comic Book Heroes, Hulk appears at **#10 (1975 era), #41 (1976 era), #71 (2000s era), and #121 (2025 era)** — four cards across the entire set. A Maestro appearance would make Hulk one of the most sought-after characters in both sets.

Browse Hulk cards: [mintcomiccards.com/cards/109](https://mintcomiccards.com/cards/109) | [comicbookcard.com/card/121](https://comicbookcard.com/card/121)

[Search eBay for Hulk Marvel Mint Platinum cards](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+hulk+platinum)

## Tier 3: The Dream Picks

These are the cameos that would absolutely break the internet if they happened, but have less sourcing behind them.

### Nicolas Cage as Ghost Rider

Cage has been rumored for every major Marvel crossover event for years. He has reportedly passed on opportunities before, but the scale of Doomsday might be enough to bring him back. A Nicolas Cage Ghost Rider riding through Battleworld would be pure cinema.

### Japanese Spider-Man (Supaidaman)

The 1978 Japanese live-action Spider-Man who pilots a giant robot called Leopardon. If Marvel puts Supaidaman on screen — even for 30 seconds — the reaction would be nuclear. This is the deep cut that would prove Marvel truly understands its fanbase.

**Card Watch:** Spider-Man is **#101 in the Platinum tier** of Marvel Mint — the number one Platinum card with only **220 total numbered cards**. In Comic Book Heroes, Spider-Man appears at **#22 (1975), #51 (1976), #93 (2000s), and #142 (2025)** — four cards across the entire set. Any Spider-Man variant appearance drives demand for ALL Spider-Man cards.

Browse Spider-Man cards: [mintcomiccards.com/cards/101](https://mintcomiccards.com/cards/101) | [comicbookcard.com/card/142](https://comicbookcard.com/card/142)

### Tobey Maguire as Cosmic Spider-Man

Beyond the rumored opening fight scene with Wolverine, there is speculation that Tobey's Spider-Man could return later in the film as **Cosmic Spider-Man** — a version empowered by the Uni-Power, making him one of the most powerful beings in the multiverse. Going from getting beaten by Wolverine in the opening to returning as a cosmic-level threat would be incredible storytelling.

## The Doom Factor

At the center of all of this sits **Doctor Doom** — played by Robert Downey Jr. The leaks suggest Doom is making deals with characters across the multiverse, offering them land and power in his new kingdom. He is recruiting an army of variants, and the characters who refuse his offer become his enemies.

This is straight out of Jonathan Hickman's Secret Wars, where Doom salvaged fragments of dying universes to create Battleworld — a patchwork planet where he ruled as God Emperor.

**Card Watch:** Doctor Doom is **#107 in the Platinum tier** of Marvel Mint — only **220 total numbered cards**. Plus there are **200 Comic Cut cards** featuring actual panels cut from Doctor Doom comic books, each one a 1/1. In Comic Book Heroes, Doom appears at **#4 (1975 era), #35 (1976 era), and #115 (2025 era)** — three cards across the set.

See the actual Comic Cut where Doom kills Thanos: [riseofdoom.com/cards/56](https://riseofdoom.com/cards/56)

Browse Doom cards: [mintcomiccards.com/cards/107](https://mintcomiccards.com/cards/107) | [comicbookcard.com/card/115](https://comicbookcard.com/card/115)

[Search eBay for Doctor Doom Marvel Mint cards](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+doctor+doom)

## The Numbers That Matter

For collectors, here is why these cameos matter in hard numbers:

**2025 Topps Marvel Mint:**
- Total Foil Cards in the entire set: **20,100**
- Total Encased Cards: **8,625**
- Platinum tier characters (101-120) have only **220 numbered cards each**
- Gold tier characters (76-100) have only **236 numbered cards each**
- Every character has exactly **1 Chrome Superfractor** and **1 Foilfractor** — true 1/1 cards

**2025 Topps Comic Book Heroes:**
- 150 base cards across 4 eras (1975, 1976, 2000s, 2025)
- 13 parallel types from base Refractor (1:1) up to Superfractor (1:1,412 odds)
- Autograph Superfractors at 1:20,185 odds — some of the rarest cards in any modern set

The window to acquire these cards at current prices is closing. Every confirmed cameo announcement will create an immediate price spike for that character's cards. Smart collectors are positioning now, before the first public trailer drops.

## Collector's Corner

The sheer volume of rumored cameos in Avengers: Doomsday means the card market is about to get very interesting. Characters who have been sitting quietly in binders could suddenly become the hottest pulls in the hobby.

**Hot Cards to Watch:**
- **Daredevil #116 Marvel Mint Platinum Encased /25** — Ben Affleck rumors are the strongest of any cameo leak
- **Ghost Rider #83 Marvel Mint Gold Foilfractor 1/1** — Cosmic Ghost Rider would make this the most wanted 1/1 in the set
- **Blade #111 Marvel Mint Platinum Silver Foil /99** — Wesley Snipes returning would be a nostalgia explosion
- **Doctor Doom #107 Marvel Mint Platinum Red Chrome /5** — The villain at the center of everything, only 5 exist

Track real-time prices on **[Card Ladder](https://www.cardladder.com/)** and find affordable singles on **[eBay](https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint)**. Join our **[Whatnot streams](https://northlandlegendaryfinds.com/whatnot)** for live Marvel Mint breaks where you can pull these cards yourself.

Browse our full **[Card Database](https://northlandlegendaryfinds.com/cards)** to track every character mentioned in this article, and check **[eBay Comps](https://northlandlegendaryfinds.com/ebay-comps)** for real sold prices.

*Avengers: Doomsday hits theaters December 2026. The rumors will only get louder from here.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // First, unfeatured any currently featured articles
  await conn.execute("UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1");
  console.log("Unfeatured all existing articles.");

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
      console.log(`Published: "${article.title}"`);
    } catch (err) {
      console.error(`Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, category, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 5"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.category}] [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
