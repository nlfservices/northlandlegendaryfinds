/**
 * Publish "From Upper Deck to Doomsday: How Topps Built the New Marvel Card Era"
 * Template: listicle (next in rotation after timeline)
 * Run from project root: node publish-topps-era.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/topps-era-hero-HEJ43NGRzcQhzNY9cFWehn.webp",
  sdccBooth: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/topps-era-sdcc-booth-MUq4f5hXncby2sT7HU7s6d.webp",
  future: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/topps-era-future-LEFmVf2QrHzjCaLQ7C23Mh.webp",
  doomFront: "/manus-storage/1000042456_764f753f.jpg",
  doomBack: "/manus-storage/1000042457_a73522a3.jpg",
};

const now = Date.now();

const articles = [
  {
    title: "From Upper Deck to Doomsday: How Topps Built the New Marvel Card Era",
    slug: "topps-marvel-era-upper-deck-to-doomsday-2025-2026",
    templateLayout: "listicle",
    excerpt: "Topps made their first Marvel card in 1975 — a sticker with a stick of gum. Fifty years later, they're embedding actual comic panels into one-of-one Doctor Doom cards. From the license transfer to six premium 2025 releases to SDCC 2026, here's the complete story of how the new era was built.",
    featuredImageUrl: IMAGES.hero,
    category: "card_market",
    tags: JSON.stringify(["Topps Marvel", "Upper Deck", "Trading Card License", "SDCC 2025", "Marvel Mint", "Doctor Doom", "Chrome", "Card Market", "Avengers Doomsday", "SDCC 2026", "1975 Topps Marvel", "Golden Anniversary", "Collecting History"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Spider-Man", "Wolverine", "Iron Man", "Gambit", "Storm", "Captain America", "Fantastic Four", "X-Men", "Galactus"]),
    cardMarketImpact: "The Topps Marvel era has fundamentally reset the market. Chrome refractors, encased medallion cards, convention exclusives, and the 50th anniversary connection to 1975 have created entirely new collecting categories that position Topps Marvel cards as both modern innovation and nostalgic legacy.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "The complete story of Topps and Marvel — from the first sticker cards in 1975 through the Upper Deck years, the 2024 license transfer, six premium 2025 releases, SDCC Doctor Doom exclusives, and the road to Avengers: Doomsday in 2026.",
    sources: JSON.stringify([
      { title: "Tom Brevoort — The 1975/1976 Topps Marvel Super Hero Stickers", url: "https://tombrevoort.com/2024/11/02/the-1975-1976-topps-marvel-super-hero-stickers/" },
      { title: "The Athletic — Topps adds Disney, Pixar and Marvel trading card rights", url: "https://www.nytimes.com/athletic/5761692/2024/09/12/topps-disney-pixar-marvel-cards/" },
      { title: "Topps Official — Marvel Comic Book Heroes 1975 Golden Anniversary", url: "https://www.topps.com/pages/marvel-comic-book-heroes-1975-anniversary" },
      { title: "Topps Official — Marvel Mint Product Page", url: "https://www.topps.com/pages/topps-mint-marvel" },
      { title: "Comic-Con International — SDCC 2026 Dates", url: "https://www.comic-con.org/cc/" },
    ]),
    contentMarkdown: `In 1975, Topps released a pack of Marvel Super Heroes stickers. Five stickers per pack, one stick of chewing gum, and characters like Spider-Man, Captain America, and Doctor Doom printed on peel-off paper for kids to slap on their notebooks. It was the first time Topps and Marvel ever appeared on the same product.

Fifty years later, Topps is embedding actual panels cut from original 1962 Fantastic Four comics into one-of-one Doctor Doom trading cards, encased in chrome holders, and debuting them at San Diego Comic-Con.

The journey between those two points is the story of how the modern Marvel card era was built — and why everything happening right now was fifty years in the making.

## 1975: Where It All Started

Before Upper Deck. Before Fleer. Before SkyBox or Impel or any of the names collectors associate with Marvel cards — there was Topps.

In 1975, Topps launched the **Marvel Comic Book Heroes** sticker set. It was simple by today's standards: character artwork on the front, blank backs, sold alongside bubble gum at corner stores and gas stations. The set featured the Marvel roster of the era — Spider-Man, Hulk, Captain America, Thor, and yes, **Doctor Doom**. A second series followed in 1976 with expanded characters including Iceman, Daredevil, Human Torch, and Galactus.

These were not premium collectibles. They were made for kids. They cost pennies. Most of them ended up stuck to lunchboxes and school binders, destroyed by the very children who loved them. The ones that survived in clean condition are now genuine vintage pieces — fifty years old and counting.

What matters is this: **Topps was the original Marvel card company.** Everything that came after — the painted Masterpieces, the hologram chase cards, the refractors and parallels — all of it traces back to a pack of stickers with a stick of gum in 1975.

## The Middle Years: Other Companies Take the Torch

<img src="${IMAGES.sdccBooth}" alt="Convention booth showcasing premium Marvel trading cards in illuminated glass cases with excited collectors" style="width:100%;max-width:700px;border-radius:12px;margin:1.5rem 0;" />

After those original sticker sets, the Marvel trading card license moved through several hands over the decades. Impel launched the iconic 1990 Marvel Universe set that ignited the modern hobby. SkyBox and Fleer produced some of the most visually stunning sets of the 1990s. And eventually, Upper Deck secured the license and held it for years, producing sets like Marvel Masterpieces with its hand-painted artwork by artists like Joe Jusko and Dan dos Santos.

Upper Deck's tenure gave collectors beautiful products. But by 2024, the industry landscape had shifted dramatically. Fanatics had been consolidating sports and entertainment licenses across the collectibles world, and Topps — now under the Fanatics umbrella — was positioned to bring Marvel back home.

On September 12, 2024, it became official: Topps would produce Disney, Pixar, and Marvel trading cards globally starting in 2025. Upper Deck's Marvel license expired at the end of 2024. The era was over. And the original Marvel card company was back.

## The Collector Anxiety

When the license transfer became public, collector forums lit up with concern. The worry was simple and understandable: would Topps treat Marvel cards like sports cards? Would the hand-painted artwork be replaced by character cutouts on colored backdrops? Would the soul of Marvel card collecting survive?

These were legitimate questions. Topps had built its modern reputation on sports — baseball, football, basketball. Their design language, print run philosophy, and product tiers were rooted in that world. Marvel cards had always been different. Art-first. Story-driven. Character-focused in a way that sports cards could never replicate.

Some collectors sold their Upper Deck holdings. Some held. Everyone waited to see what Topps would deliver.

## 2024: The Transition Year

Topps did not wait until January 2025 to start. Through their UK and European distribution channels, they released **2024 Topps Marvel Chrome** — the first official Topps Marvel product of the modern era.

It was a deliberate soft launch. A Europe-focused release that gave Topps time to refine their approach before the full global rollout. For collectors paying attention, it was a signal: Topps was not rushing this. They were building infrastructure.

The 2024 Chrome set introduced refractor technology — perfected over decades of sports cards — to the Marvel universe for the first time. Spider-Man and Wolverine suddenly existed in the same chromium format that had made sports rookie cards worth thousands. It was a bridge between two worlds, and it worked.

## 2025: The True First Year — Six Products Deep

If 2024 was the transition, 2025 was the statement. Topps did not release one Marvel product. They released six.

**1. Topps Finest X-Men '97** — A love letter to the animated series that captivated a new generation on Disney+. Finest-quality chrome with character art pulled directly from the show's visual language.

**2. Topps Chrome Marvel** — The flagship. A 200-card base set covering the full Marvel Comics universe with refractor parallels, autographs, and insert sets that established the new design vocabulary for the entire era.

**3. Topps Marvel Studios Chrome** — The first-ever trading card product dedicated exclusively to the Marvel Cinematic Universe. Not comic art. Not illustrations. The actual films and shows. This is something no previous license holder could produce.

**4. Topps Marvel Mint** — The innovation play. Encased medallion cards with a four-tier rarity system (Bronze, Silver, Gold, Platinum), 200 one-of-one Doctor Doom Comic Cuts with authentic vintage panels embedded in the cards, Gambit's Deck (a 52-card chrome playing card set), and a Stan Lee Cut Signature.

**5. Topps Marvel: The Collector** — A comic art-focused set proving Topps understood the artistic heritage that made Marvel cards special in the first place.

**6. Topps Comic Book Heroes: 1975 Golden Anniversary** — And here is where the story comes full circle. Topps took the original 1975 and 1976 sticker artwork — the very first Marvel cards they ever made — and reimagined them with modern Chrome technology. The marble borders. The vintage character poses. Doctor Doom from 1975, now rendered in chromium refractor. Fifty years of history in a single card.

Six products in one year. Each one different. Each one serving a different segment of the collecting community. And one of them literally celebrating the fact that Topps started all of this half a century ago.

## The SDCC Statement: Doctor Doom Comes Home

<div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin:1.5rem 0;">
<img src="${IMAGES.doomFront}" alt="2025 Topps Marvel Mint SDCC Exclusive Chrome Doctor Doom 67/99 — front showing green chrome refractor with Castle Doom" style="max-width:300px;border-radius:12px;" />
<img src="${IMAGES.doomBack}" alt="2025 Topps Marvel Mint SDCC Exclusive Chrome Doctor Doom — back showing San Diego Comic-Con Exclusive Card designation from 2025 Marvel Mint" style="max-width:300px;border-radius:12px;" />
</div>

At San Diego Comic-Con 2025 (July 23-26), Topps made a statement that echoed across the entire hobby.

**2025 Topps Marvel Mint** debuted as an SDCC exclusive — $100 per box, 10 cards plus one encased Chrome card. Doctor Doom on the box cover. Inside, collectors could pull the **SDCC Exclusive Chrome Doctor Doom** numbered to just 99 copies, with parallels at /10, /4, and a 1/1 Superfractor.

The crown jewel: **200 unique one-of-one Doctor Doom Comic Cuts.** Topps took original first-print Marvel comics spanning from Fantastic Four #5 (1962) through Jonathan Hickman's Secret Wars (2015) and physically cut panels from those pages to create trading cards. Actual pieces of Marvel history that can never be reproduced.

Think about the arc. Doctor Doom appeared on a Topps sticker in 1975. Fifty years later, he is the centerpiece of their most innovative product, with panels from his earliest comic appearances literally embedded into cards. And in six months, Robert Downey Jr. will portray him in the biggest movie of 2026.

The SDCC Chrome Doctor Doom /99 shown above has sold for over $600 on the secondary market. That is not hype. That is the market confirming what Topps built.

## The MCU Advantage: Something Nobody Else Ever Had

<img src="${IMAGES.future}" alt="Futuristic collector vault with premium Marvel trading cards displayed in illuminated cases with multiverse portal in background" style="width:100%;max-width:700px;border-radius:12px;margin:1.5rem 0;" />

Here is the advantage that makes this era fundamentally different from everything before it: **Topps has direct access to the MCU.**

2025 Topps Marvel Studios Chrome is the first trading card product in history built entirely around the Marvel Cinematic Universe. Not comic interpretations of movie characters. The actual films. The actual actors. The actual moments that billions of people experienced in theaters.

No previous Marvel card manufacturer had this capability. Their products were comic-focused by necessity. Topps, operating under the Fanatics and Disney umbrella, can produce cards featuring the real MCU imagery — and with Spider-Man: Brand New Day introducing mutants on July 31 and Avengers: Doomsday uniting every corner of the Marvel universe on December 18, the content pipeline is unprecedented.

Every MCU release from now forward is a potential card product. Every actor confirmation is a potential autograph card. Every trailer frame is a potential insert set. That is an advantage that compounds with every Marvel release, and it did not exist before 2025.

## SDCC 2026: What Comes Next (July 23-26)

San Diego Comic-Con 2026 runs July 23-26 — exactly one year after Topps debuted Marvel Mint. The question every collector should be asking: what does Topps bring this time?

Consider what has happened since SDCC 2025:

- Spider-Man: Brand New Day confirmed as the MCU's mutant introduction (releases July 31 — eight days after SDCC)
- Avengers: Doomsday roster revealed at 30+ characters across three universes
- The Fantastic Four: First Steps delivered massive box office
- X-Men confirmed as part of the Doomsday storyline
- The 1975 Golden Anniversary set proved Topps is willing to mine their own history

If Topps follows the Doctor Doom playbook from 2025, SDCC 2026 could feature a Brand New Day exclusive (perfect timing with the film releasing days later), a Doomsday preview product, a continuation of the Golden Anniversary line, or an entirely new format nobody has seen yet.

One thing is certain: Topps proved at SDCC 2025 that they understand convention exclusives. They will not waste that stage in 2026.

## Fifty Years of Doom

Step back and trace the Doctor Doom thread through this entire story:

- **1975** — Doctor Doom appears on a Topps Marvel sticker. Kids peel it off and stick it on their Trapper Keepers.
- **1976** — Doom returns in the second Topps sticker series. Still a kids product. Still sold with gum.
- **2025** — Topps releases the Golden Anniversary Chrome set reimagining those original stickers. Doom's 1975 artwork now exists in chromium refractor form.
- **2025** — Topps Marvel Mint debuts at SDCC with Doom on the box, a Chrome exclusive /99, and 200 one-of-one Comic Cuts pulling panels from his earliest appearances.
- **2026** — Robert Downey Jr. will portray Doctor Doom in Avengers: Doomsday, the biggest Marvel event in a decade.

One character. One card company. Fifty years. And the biggest moment is still ahead.

That is not a coincidence. That is Topps understanding exactly what they have and building toward the moment when comic history, card history, and cinematic history all converge on the same character at the same time.

## What This Means for Collectors

The Topps Marvel era is not a temporary experiment. It is a long-term infrastructure play backed by Fanatics, Disney, and the most successful film franchise in history. Every MCU release from now until the end of the Multiverse Saga is a potential card product. Every convention is a potential exclusive debut. And the 1975 connection gives everything a nostalgic foundation that no competitor can replicate.

For collectors who remember the Upper Deck years, the transition preserved what mattered — original art, character focus, premium tiers — while adding capabilities that never existed before. For new collectors entering through the MCU, Topps has created accessible entry points alongside ultra-premium chase cards. And for the collectors who remember those original 1975 stickers, the Golden Anniversary set is proof that Topps knows exactly where this story started.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to explore the full Topps Marvel lineup, or check out the [MCU Spotlight](https://northlandlegendaryfinds.com/mcu-spotlight) to see how films and shows connect to the cards. For character deep dives, visit our [Characters section](https://northlandlegendaryfinds.com/characters) — Doctor Doom's page tracks every card across every era.

## Collector's Corner

The Topps Marvel era has created entirely new categories of collectible cards. With SDCC 2026 less than a month away and Doomsday on the December horizon, these are the cards positioned at the center of the action.

**Hot Cards to Watch:**
- **Doctor Doom Chrome SDCC Exclusive /99 (2025 Marvel Mint)** — The card that launched the modern era. Secondary market consistently above $500 with Doomsday demand building every week
- **Doctor Doom 1975 Golden Anniversary Chrome Refractor (2025 Comic Book Heroes)** — Fifty years of history in one card. The original 1975 sticker artwork in modern chromium
- **Spider-Man Platinum Base (2025 Marvel Mint)** — Top-tier encased card from the set that redefined Marvel collecting formats entirely
- **Wolverine Gambit's Deck Chrome /99 (2025 Marvel Mint)** — Double-sided chrome in the most creative insert design Topps has ever produced for any brand

Track real-time values on **[Card Ladder](https://www.cardladder.com/)** — their Marvel index has been climbing since the Doomsday roster reveal.

Compare sold prices across the full Topps Marvel lineup on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** — transaction data tells the real story of where demand is heading.

For graded population reports and authentication, check **[PSA](https://www.psacard.com/)** — early Topps Marvel submissions are establishing the grading baseline for the entire era.

*Topps made their first Marvel card in 1975. Fifty years later, they are building the future. SDCC 2026 runs July 23-26. Avengers: Doomsday arrives December 18. The homecoming is just getting started.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  for (const article of articles) {
    try {
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
          article.templateLayout,
        ]
      );
      console.log(`✅ Published: "${article.title}"`);
    } catch (err) {
      console.error(`❌ Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, templateLayout, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 10"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.templateLayout}] [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
