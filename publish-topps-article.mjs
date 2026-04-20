/**
 * Publish Topps Marvel License Article
 * Run from project root: node publish-topps-article.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGE_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/article-topps-marvel-return-DVEHEBboiXxVqmjt4QT7Ta.webp";

const now = Date.now();

const article = {
  title: "Topps Reclaims the Marvel Trading Card License in 2025 — A New Era for Collectors",
  slug: "topps-reclaims-marvel-trading-card-license-2025",
  excerpt: "After decades away, Topps has officially reclaimed the Marvel trading card license from Upper Deck. 2025 marks the beginning of a new golden age for Marvel card collectors, with Topps Finest X-Men '97, Chrome Marvel, Marvel Mint, and Chrome Sapphire already hitting shelves.",
  featuredImageUrl: IMAGE_URL,
  category: "analysis",
  tags: JSON.stringify(["Topps", "Marvel", "Trading Cards", "Upper Deck", "Fanatics", "Chrome", "Marvel Mint", "X-Men 97", "Sapphire"]),
  relatedCharacters: JSON.stringify(["Spider-Man", "Wolverine", "Iron Man", "Captain America", "X-Men"]),
  cardMarketImpact: "The Topps Marvel license shift is the biggest shakeup in the hobby since Fanatics acquired Topps. Early Topps Marvel products are already commanding premiums as collectors recognize these as the first cards of a new era.",
  isFeatured: 1,
  isPublished: 1,
  authorName: "NLF Team",
  publishedAt: now,
  metaDescription: "Topps officially reclaimed the Marvel trading card license in 2025 after Upper Deck lost the rights. Here is the full story of how it happened and every product released so far.",
  sources: JSON.stringify([
    { title: "Fanatics Press Release - Topps Expands Disney Deal", url: "https://www.fanaticsinc.com/press-releases/topps-expands-existing-trading-card-deal-with-disney-consumer-products-to-include-global-disney-pixar-and-marvel-card-rights-continues-existing-global-star-wars-collaboration" },
    { title: "Beckett - Disney and Marvel Trading Cards Coming from Topps", url: "https://www.beckett.com/news/disney-and-marvel-trading-cards-coming-from-topps/" },
    { title: "Den of Geek - Definitive Guide to Marvel Trading Cards", url: "https://www.denofgeek.com/culture/the-definitive-collectors-guide-to-marvel-trading-cards-through-the-years/" },
  ]),
  contentMarkdown: `In September 2024, Topps — now owned by Fanatics — announced a seismic expansion of their existing deal with Disney Consumer Products. The agreement brought global Disney, Pixar, and Marvel trading card rights under the Topps umbrella for the first time. By Q1 2025, the first physical Topps Marvel cards hit retail shelves, ending Upper Deck's long reign as the Marvel card licensee and ushering in what many collectors are calling a new golden age for the hobby.

This is the story of how it happened, what Topps has released so far, and why it matters for every Marvel card collector.

## A Brief History of Marvel Trading Cards

The Marvel trading card story stretches back more than three decades. The first major Marvel card set was the 1990 Impel Marvel Universe series — a groundbreaking release that brought comic book characters into the sports card format. Each card featured stunning artwork on the front and made-up character statistics on the back, sparking countless schoolyard debates about who was stronger: Hulk or Galactus.

Throughout the 1990s, the license changed hands multiple times. Skybox produced several beloved sets before Fleer took over, delivering iconic products like Marvel Masterpieces, Flair, and Ultra. The 90s card boom was fueled by holographic inserts, chase cards, and the same speculative mania that drove the comic book market to dizzying heights — and its eventual crash.

When the dust settled, Upper Deck emerged as the dominant force in Marvel trading cards. From the early 2000s through 2024, Upper Deck produced a steady stream of Marvel products, including their popular Marvel Premier and Marvel Beginnings lines. Their cards were known for quality artwork and premium inserts, but the hobby was about to undergo its biggest shakeup in decades.

## Enter Fanatics — and the License Shift

In 2022, Fanatics completed its acquisition of Topps, bringing one of the most iconic names in trading cards under the umbrella of the world's largest sports merchandise company. Fanatics had already been aggressively acquiring trading card licenses across sports, and the Disney deal represented their biggest entertainment card play yet.

On September 12, 2024, Topps officially announced the expansion. Paul Gitter, Executive Vice President of Global Brand Commercialization at Disney Consumer Products, called Topps "a long-standing collaborator" and expressed excitement about bringing "storytelling from across our brands to card collecting enthusiasts around the world." David Leiner, President of Trading Cards at Fanatics Collectibles, emphasized the company's "relentless focus on enhancing the fan experience."

The deal was comprehensive: physical and digital trading cards for Disney, Pixar, Marvel, and Star Wars — globally. While Topps had previously sold Disney and Marvel cards in Europe, the Middle East, and Africa, this was the first time they would develop and distribute physical Marvel trading cards in the United States and worldwide.

## The 2025 Topps Marvel Product Lineup

Topps wasted no time. The first wave of Marvel products arrived in early 2025, and the lineup has been nothing short of impressive:

### Topps Finest X-Men '97 (February 26, 2025)
The very first Topps Marvel product was a love letter to the animated series that captivated a generation. Featuring 12 packs per box with 5 cards per pack, the set included 11 different Voice Actor Autographs — landing at a rate of 1 in 76 packs. The chrome technology and refractor parallels brought a premium sports card feel to the X-Men universe.

### Topps Chrome Marvel Comics (May/June 2025)
The flagship release. A massive 200-card base set covering the full breadth of the Marvel Comics universe, from Iron Man and Spider-Man to deep cuts like Solarus (a first Topps appearance). The chrome finish, numbered refractors, and autograph inserts made this the set that established Topps as a serious player in the Marvel card space.

### Topps Marvel Mint (July 25, 2025 — SDCC Exclusive)
Released as a San Diego Comic-Con exclusive, Marvel Mint brought the popular Topps Mint format to Marvel characters. The limited distribution and convention exclusivity made this one of the most sought-after products of the year.

### Topps Chrome Marvel Sapphire Edition (August 2025)
The full 200-card Chrome checklist reimagined in Topps' iconic Sapphire chrome technology. At a retail price of approximately $900 per hobby box, this was positioned as the ultra-premium offering for serious collectors. The Sapphire finish gives every card a distinctive blue-tinted chrome look that photographs beautifully and commands strong secondary market prices.

### Topps Marvel Studios Chrome (Late 2025)
A historic release — the first-ever Topps product to feature the Marvel Cinematic Universe. While previous Topps Marvel sets focused on comic book artwork, this set drew directly from the MCU films, bridging the gap between movie fans and card collectors.

### Topps Marvel Studios Chrome Sapphire (January 16, 2026)
The Sapphire treatment applied to the MCU-focused Chrome set. Another ultra-premium release that continued to push the boundaries of what Marvel trading cards could look and feel like.

### Topps Marvel The Collector (February 2026)
The most recent release features three main insert sets — Show Stoppers, Marvel Tomorrow, and Villainy — all numbered to 100 with parallels mirroring the base set structure. The set name itself is a playful nod to the Marvel character who hoards rare artifacts across the galaxy.

## What This Means for the Hobby

The Topps takeover of the Marvel license represents more than just a corporate reshuffling. It signals a fundamental shift in how Marvel trading cards are produced, marketed, and collected.

**Premium Sports Card Technology:** Topps is bringing the same chrome, refractor, and Sapphire technology that made their baseball and football cards iconic to the Marvel universe. The production quality is a noticeable step up from what collectors were accustomed to under Upper Deck.

**Fanatics Distribution Network:** With Fanatics' massive retail and online distribution infrastructure, Topps Marvel products are reaching more collectors than ever before. Products are available through Topps.com, major retailers, hobby shops, and platforms like Whatnot.

**Digital Integration:** Topps already operated the Disney Collect! and Marvel Collect! apps for digital collectibles. The physical card license allows them to create seamless physical-digital experiences that could reshape how collectors interact with their cards.

**Investment Potential:** First-year Topps Marvel cards are already being treated as significant collectibles. The 2025 Topps Finest X-Men '97 and Chrome Marvel sets are the "Year One" cards of a new era — similar to how the first Topps baseball cards from the 1950s became foundational collectibles.

---

## Collector's Corner

If you are building a Marvel card collection in 2025-2026, understanding the Topps product hierarchy is essential. For budget-friendly entry points, look for Topps Chrome Marvel blaster boxes and value packs at major retailers. For premium collecting, the Sapphire editions offer the highest production quality and strongest secondary market values.

For tracking prices and population reports across all Topps Marvel products, [Card Ladder](https://www.cardladder.com) provides real-time sales data and trend analysis. Their Marvel card tracking has expanded significantly since the Topps license began. For grading, both [PSA](https://www.psacard.com) and [CGC](https://www.cgccomics.com) accept trading cards, and a PSA 10 or CGC 10 on an early Topps Marvel card could become extremely valuable as the hobby matures.

You can find Topps Marvel products being ripped live on [Whatnot](https://whatnot.com/invite/northlandfinds) — sign up through our link for $15 in free credit and watch us break boxes of Chrome, Sapphire, and Marvel Mint on our live shows.

**Hot Cards to Watch:** 2025 Topps Finest X-Men '97 Voice Actor Autographs, Topps Chrome Marvel numbered refractors (/199, /99, /50, /25), Marvel Mint SDCC exclusives, and any Sapphire Edition parallels. These are the foundational cards of the Topps Marvel era — the earlier you collect them, the better positioned you will be as the hobby grows.`,
};

async function publishArticle() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  try {
    const sql = `INSERT INTO articles (title, slug, excerpt, featuredImageUrl, category, tags, relatedCharacters, cardMarketImpact, isFeatured, isPublished, authorName, publishedAt, metaDescription, sources, contentMarkdown, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
      article.title,
      article.slug,
      article.excerpt,
      article.featuredImageUrl,
      article.category,
      article.tags,
      article.relatedCharacters,
      article.cardMarketImpact,
      article.isFeatured,
      article.isPublished,
      article.authorName,
      article.publishedAt,
      article.metaDescription,
      article.sources,
      article.contentMarkdown,
      new Date(now),
      new Date(now),
    ];
    
    const [result] = await conn.execute(sql, values);
    console.log(`Published: "${article.title}" (ID: ${result.insertId})`);
  } catch (err) {
    console.error(`Failed to publish: ${err.message}`);
  } finally {
    await conn.end();
  }
}

publishArticle();
