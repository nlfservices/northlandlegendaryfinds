/**
 * Publish 2025 Topps Marvel Mint — "The Hidden Gem of 2025" — April 25, 2026
 * Run from project root: node publish-marvel-mint-apr25.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/marvel-mint-hero-v2-YpVVtBK2vhq8DUDSe7SoJw.webp",
  vault: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/marvel-mint-doom-cuts-5JJo35qPN7h94wbZRTucPy.webp",
  gambit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/marvel-mint-gambit-deck-4niVA8rVtAXZduDvHytXNN.webp",
  medallion: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/marvel-mint-medallion-v2-kxFUn4UnaRmPtoj8uYgjuS.webp",
};

// Publish date: April 25, 2026 at 8:00 AM CDT
const publishDate = new Date('2026-04-25T08:00:00-05:00').getTime();

const articles = [
  {
    title: "2025 Topps Marvel Mint: The Hidden Gem of 2025 That Collectors Are Sleeping On",
    slug: "2025-topps-marvel-mint-hidden-gem-collectors-guide",
    excerpt: "While everyone chased Chrome and Brooklyn, Topps quietly released the most innovative Marvel card set in decades. 120 encased medallion cards, 200 Doctor Doom Comic Cuts, a Stan Lee Cut Signature, and Gambit's Deck — here's why Marvel Mint is the hidden gem of 2025.",
    featuredImageUrl: IMAGES.hero,
    category: "card_market",
    tags: JSON.stringify(["Topps Marvel Mint", "Trading Cards", "Doctor Doom", "Comic Cuts", "Stan Lee", "Gambit", "Card Market", "Set Review", "2025 Releases", "Hidden Gem"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Spider-Man", "Wolverine", "Iron Man", "Gambit", "Stan Lee", "Storm", "Black Panther", "Magneto", "Captain America"]),
    cardMarketImpact: "Marvel Mint introduced a completely new format to Marvel collecting with encased medallion cards, and the Doctor Doom Comic Cuts are positioned to surge as Avengers: Doomsday approaches in December 2026.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: publishDate,
    metaDescription: "Complete guide to 2025 Topps Marvel Mint — the hidden gem of 2025. 120 encased medallion cards, 200 Doctor Doom Comic Cuts, Stan Lee Cut Signature, Gambit's Deck, and why this set is undervalued heading into Avengers: Doomsday.",
    sources: JSON.stringify([
      { title: "Screen Rant — Marvel Topps Mint SDCC 2025 Details", url: "https://screenrant.com/marvel-topps-mint-cards-sdcc-2025-details/" },
      { title: "Topps Ripped — 2025 Topps Mint Marvel Sketch Cards Guide", url: "https://ripped.topps.com/2025-topps-mint-marvel-sketch-cards-collector-guide/" },
      { title: "Mint Comic Cards", url: "https://mintcomiccards.com/" },
      { title: "Rise of Doom — Doctor Doom Comic Cuts Archive", url: "https://riseofdoom.com/" },
    ]),
    contentMarkdown: `Every year in the trading card world, there is a set that flies under the radar while collectors chase the obvious choices. In 2025, that set is **2025 Topps Marvel Mint** — and the collectors who recognized it early are already sitting on something special.

While the hobby world fixated on Chrome refractors and Brooklyn Collection hits, Topps quietly launched what might be the most innovative Marvel card product in decades. Marvel Mint does not look like anything else in the market. It does not feel like anything else. And with Avengers: Doomsday arriving in December 2026, the timing could not be more perfect.

This is the set that serious collectors are going to wish they had paid attention to.

## A New Format for a New Era

<div style="float:right;margin:0 0 1rem 1.5rem;max-width:420px"><img src="${IMAGES.medallion}" alt="Marvel Mint tiered medallion display — Bronze, Silver, Gold, and Platinum tiers" style="width:100%;border-radius:8px;" /><em style="display:block;text-align:center;font-size:0.85rem;color:#888;margin-top:0.25rem">The four-tier medallion system: Bronze, Silver, Gold, and Platinum</em></div>

When Topps took over the Marvel license from Upper Deck, the question was whether they would simply replicate their sports card playbook or bring something genuinely new to the table. Marvel Mint is the answer, and it is emphatic.

Every card in this set is **encased** — sealed in a protective holder straight from the factory. That alone sets it apart from every other Marvel product on the market. But the real innovation is the **four-tier medallion system** that gives the base set a structure unlike anything collectors have seen before.

The 120-card base set is divided into four tiers based on character significance. **Bronze** (cards 1-50) features the deep roster — characters like Hercules, Cosmo the Spacedog, Killmonger, and Howard the Duck. **Silver** (cards 51-75) steps up to fan favorites including Beast, Nightcrawler, Silver Surfer, and Black Cat. **Gold** (cards 76-100) brings the heavy hitters — Thanos, Moon Knight, Loki, Scarlet Witch, and Captain Marvel. And at the top, **Platinum** (cards 101-120) reserves the icons: Spider-Man, Wolverine, Iron Man, Doctor Doom, Gambit, Storm, and Black Panther.

Each card has the look and feel of a minted coin in a traditional trading card size. The back of every card reads "Minted in 2025." It is a premium product that feels premium in your hands.

## The Doctor Doom Comic Cuts: History You Can Hold

<div style="float:left;margin:0 1.5rem 1rem 0;max-width:420px"><img src="${IMAGES.vault}" alt="The Lost Panel — vintage comic vault with Doctor Doom Comic Cuts" style="width:100%;border-radius:8px;" /><em style="display:block;text-align:center;font-size:0.85rem;color:#888;margin-top:0.25rem">200 unique 1/1 cards — actual comic panels cut from original first print editions</em></div>

The crown jewel of Marvel Mint is the **Doctor Doom Comic Cuts** subset, and it is not an exaggeration to call it one of the most significant insert sets in trading card history. Topps took original first print editions of Marvel comics spanning from Fantastic Four #5 in 1962 to Jonathan Hickman's Secret Wars in 2015 and **physically cut panels from those pages** to create 200 unique trading cards.

Every single one is a true 1/1. Every single one is irreplaceable. These are not reprints or facsimiles — they are actual pieces of Marvel history embedded in trading cards.

The odds of pulling a Doctor Doom Comic Cut are approximately **1:61 packs** in hobby boxes, which means roughly one per two to three boxes at current configurations. For a 1/1 card containing a piece of a comic that Stan Lee and Jack Kirby created with their own hands, those odds are remarkably accessible.

With Robert Downey Jr. set to portray Doctor Doom in Avengers: Doomsday on December 18, 2026, these cards sit at the exact intersection of comic book history and the biggest movie franchise on Earth. The dedicated research archive at **[Rise of Doom](https://riseofdoom.com/)** has documented 73 of the 200 cards so far, tracking every panel from its original comic source to its card form.

## Gambit's Deck: 52 Cards of X-Men Excellence

<div style="float:right;margin:0 0 1rem 1.5rem;max-width:420px"><img src="${IMAGES.gambit}" alt="Gambit's Deck — 52 double-sided chrome playing cards charged with kinetic energy" style="width:100%;border-radius:8px;" /><em style="display:block;text-align:center;font-size:0.85rem;color:#888;margin-top:0.25rem">Gambit's Deck: 52 double-sided chrome playing cards featuring Marvel's finest</em></div>

If the Comic Cuts are the set's crown jewel, **Gambit's Deck** is its most creative insert. Topps designed a complete 52-card playing card set — Ace through Two in all four suits — with each card featuring a different Marvel character in double-sided chrome.

The character assignments read like a who's who of Marvel royalty. The Aces go to Wolverine (Clubs), Magneto (Diamonds), Spider-Man (Hearts), and Gambit himself (Spades). The Kings feature Doctor Doom, Cyclops, Professor X, and Black Panther. The Queens showcase Storm, Emma Frost, Rogue, and Jean Grey. Even the lower-numbered cards carry weight — Sabretooth, Captain Marvel, Jubilee, and X-23 fill out the Twos.

At **1:4 pack odds**, Gambit's Deck cards are the most accessible insert in the set. Collectors can realistically build the complete 52-card deck through box purchases, and the Superfractor parallels at 1:360 offer a chase for the high-end collector.

## The Stan Lee Cut Signature

There is one card in this entire set that transcends everything else. The **Stan Lee Cut Signature** (CS-SL) is exactly what it sounds like — an authentic Stan Lee autograph cut and embedded into a trading card.

The odds? **1:15,701 packs.** Available only in Ecomm hobby boxes. This is one of the rarest cards in the entire 2025 Topps Marvel lineup, and given that Stan Lee passed away in November 2018, the supply of authentic signatures is permanently fixed. Every Stan Lee autograph that enters the hobby from this point forward is one less available for future products.

For context, at current box prices of $520-900 and approximately 24 packs per box, you would need to open roughly 654 boxes to hit the statistical average for pulling this card. That is not a card you chase through volume — it is a card you chase through patience, luck, or the secondary market.

## The Numbers That Matter

Understanding the odds structure reveals why Marvel Mint rewards patient collectors. Here are the key pull rates that define the set:

| Insert / Parallel | Pack Odds | What It Means |
|---|---|---|
| Gambit's Deck Chrome | 1:4 | One every 4 packs — very hittable |
| Platinum Base Cards | 1:10 | Not guaranteed per pack |
| Chrome Autographs | 1:24 | Roughly one per box |
| Sketch Cards | 1:26 | About one per box |
| Doctor Doom Comic Cuts | 1:61 | One per 2-3 boxes |
| Chrome Auto Superfractor | 1:1,439 | Ultra-rare chase |
| Stan Lee Cut Signature | 1:15,701 | Legendary rarity (Ecomm only) |

The Chrome Autograph checklist features 15 signers including **Frank Miller** (the legend behind Daredevil: Born Again), **Jonathan Hickman** (the architect of Secret Wars and the current Avengers run), **Ryan Stegman**, **Mark Brooks**, and **Adam Kubert**. At 1:24 odds with Black Refractor (/10), Red Refractor (/5), and Superfractor (1/1) parallels, the autograph chase has real depth.

## Why Marvel Mint Is Undervalued

The market has not fully priced in what Marvel Mint represents, and there are several reasons why.

First, the **format is unfamiliar**. Sports card collectors understand encased products from Topps Dynasty and Topps Sterling, but the Marvel collecting community is still adjusting to the concept. Encased cards eliminate the need for immediate grading — the card arrives protected. That alone changes the value proposition for collectors who factor grading costs into their purchasing decisions.

Second, the **Avengers: Doomsday catalyst has not hit yet**. Doctor Doom is the central villain of the next two Avengers films, and every Doctor Doom card in this set — from the base Platinum to the Comic Cuts to the SDCC Chrome exclusives — is positioned to benefit from the marketing wave that begins in late 2026. The dedicated tracking at **[Mint Comic Cards](https://mintcomiccards.com/)** provides real-time intel on the set's market movement.

Third, the **Chrome and Brooklyn products absorbed all the attention**. When collectors had to choose where to allocate their budgets in 2025, the familiar Chrome format won out. That created an opportunity for collectors who recognized Marvel Mint's unique position.

## The SDCC Connection

Marvel Mint debuted at San Diego Comic-Con 2025 with exclusive products that immediately became some of the most sought-after cards in the hobby. The SDCC Preview Box featured Doctor Doom solo on the front and contained one pack with 10 cards plus one encased card.

The SDCC-exclusive Doctor Doom Chrome Card has a base numbered to /99, with a Black Lava Refractor, Green Lava Refractor (/4), and a 1/1 Superfractor. The SDCC boxes also included an exclusive Black & Yellow Electric Dots Foil parallel for Platinum cards — a parallel that does not exist in standard hobby boxes.

For collectors who attended SDCC or purchased through authorized channels, these exclusives represent some of the most limited Doctor Doom cards ever produced by Topps.

## Collector's Corner

The 2025 Topps Marvel Mint market is still developing, and that is precisely what makes it interesting. The set combines innovation, historical significance, and MCU catalyst timing in a way that no other 2025 product matches.

**Hot Cards to Watch:**
- **Doctor Doom Comic Cuts (any card)** — 200 unique 1/1s with actual comic panels from FF #5 through Secret Wars. Avengers: Doomsday will drive unprecedented demand for Doom collectibles
- **Spider-Man Platinum #101 Foilfractor** — The most iconic character in the highest tier with the rarest parallel. Chase card of the base set
- **Gambit Ace of Spades Chrome Superfractor** — The signature card of Gambit's Deck as a 1/1. With X-Men '97 Season 2 coming, Gambit demand is surging
- **Frank Miller Chrome Autograph** — The man who defined Daredevil signing Marvel cards. With Born Again dominating Disney+, this auto carries cultural weight
- **Stan Lee Cut Signature CS-SL** — The holy grail at 1:15,701 odds. Finite supply, infinite legacy

Track real sold prices on **[eBay Marvel Trading Cards](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** to see where the market is heading. For portfolio tracking and graded card management, **[MySlabs](https://www.myslabs.com/)** helps you monitor your Marvel Mint collection value over time. And for live breaks where you might pull your own Comic Cut, check out our **[Whatnot streams](https://northlandlegendaryfinds.com/whatnot)**.

Browse our **[card database](https://northlandlegendaryfinds.com/cards)** for the latest Marvel card data, and explore **[character pages](https://northlandlegendaryfinds.com/characters)** to see which heroes and villains are trending across all Topps Marvel sets.

*2025 Topps Marvel Mint — minted in 2025, destined to define the era. The hidden gem is not hidden for long.*`,
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
