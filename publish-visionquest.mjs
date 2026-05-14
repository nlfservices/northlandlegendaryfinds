/**
 * Publish VisionQuest Article — May 14, 2026
 * Run from project root: node publish-visionquest.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/visionquest-featured-image-Zyq3pnLaQR5PR9L3hvcjF4.webp",
};

const now = Date.now();

const articles = [
  {
    title: "VisionQuest: Everything We Know About Marvel's Most Ambitious Disney+ Series",
    slug: "visionquest-marvel-disney-plus-everything-we-know-2026",
    excerpt: "Paul Bettany returns as Vision in the final chapter of the WandaVision trilogy. With Ultron's return, Tommy Maximoff grown up, and a release date of October 14, 2026 — here's everything collectors and fans need to know.",
    featuredImageUrl: IMAGES.featured,
    category: "show_news",
    tags: JSON.stringify(["VisionQuest", "Vision", "White Vision", "Ultron", "WandaVision", "Disney Plus", "Paul Bettany", "James Spader", "Tommy Maximoff", "Speed", "MCU Phase Six", "Avengers Doomsday"]),
    relatedCharacters: JSON.stringify(["Vision", "Scarlet Witch", "Ultron", "Speed"]),
    cardMarketImpact: "Vision and Ultron cards are positioned for a major surge as VisionQuest approaches its October 2026 premiere. Early movers on low-numbered parallels could see 40-60% gains.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "VisionQuest premieres October 14, 2026 on Disney+. Full breakdown of cast, plot details, Ultron's return, card market impact, and the official trailer. Everything Marvel collectors need to know.",
    contentMarkdown: `The WandaVision saga reaches its conclusion this October, and it might be the most emotionally charged Marvel series since the original. **VisionQuest** — the final installment in what Marvel is calling the WandaVision trilogy — brings Paul Bettany back as the synthezoid searching for his lost humanity, and he is not coming back alone.

At the Disney Upfront presentation on May 13, 2026, Marvel Studios officially revealed the first trailer and confirmed the premiere date: **October 14, 2026** on Disney+. The eight-episode series picks up directly from WandaVision's haunting final scene — White Vision flying into the unknown after receiving the memories of the original Vision.

What we saw in that trailer changes everything we thought we knew about where this story is going.

{{youtube:dLg7kj6Wkw4|VisionQuest Official Trailer — Marvel Studios}}

## The WandaVision Trilogy Comes Full Circle

VisionQuest is not a standalone series. It is the carefully planned conclusion to a three-part story that began with WandaVision in 2021 and continued through Agatha All Along in 2024. Showrunner **Terry Matalas** (the mastermind behind Star Trek: Picard's acclaimed third season) has described the series as "a meditation on identity, memory, and what makes us human."

The premise is deceptively simple: White Vision has all of the original Vision's memories restored, but he cannot *feel* them. He knows he loved Wanda. He knows he sacrificed himself. But those memories play like a movie he is watching about someone else's life. The series follows his quest to bridge that gap — to become not just a copy with data, but a person with a soul.

This is heady territory for a Marvel show, and the creative team behind it suggests Marvel is swinging for the fences. Filming wrapped at Pinewood Studios in London in late July 2025, giving the VFX team over a year of post-production — a luxury most Marvel Disney+ series have not had.

## James Spader Returns as Ultron

The biggest reveal from the trailer is the return of **James Spader as Ultron** — and not just as a voice. The footage shows Spader in human form, appearing to Vision as a kind of digital ghost or manifestation within Vision's own consciousness. This is Ultron as we have never seen him: philosophical, manipulative, and terrifyingly intimate.

In the original Avengers: Age of Ultron (2015), Ultron created Vision as his perfect body before the Avengers stole it. That creator-creation dynamic now flips: Ultron exists as a fragment within Vision's code, and he wants out. The trailer shows moments of Ultron appearing to counsel Vision, challenge him, and ultimately try to consume him from within.

Spader's return has been one of Marvel's worst-kept secrets since set photos leaked in May 2025, but seeing him in the actual footage — both as the robotic Ultron and in human form — confirms this is a substantial role, not a cameo.

## Tommy Maximoff Is All Grown Up

**Ruaridh Mollica** steps into the role of Tommy Maximoff — the speedster son of Vision and Wanda who was last seen as a child in WandaVision's Hex reality. In VisionQuest, Tommy appears as a young adult, now going by the superhero name **Speed**.

This is a critical Young Avengers connection. Tommy and his twin brother Billy (who appeared in Agatha All Along as "Teen") are being positioned as key players in Marvel's next generation. VisionQuest appears to be the series where Tommy discovers his father is alive — or at least, a version of his father — setting up an emotional reunion that could rival anything in the MCU.

The trailer shows Tommy running at super-speed through what appears to be a SWORD facility, suggesting he may be searching for White Vision when they finally cross paths.

## The Full Cast

Marvel has assembled a deep supporting cast around Bettany and Spader:

- **Paul Bettany** — Vision / White Vision / Human Vision
- **James Spader** — Ultron (robot and human manifestation)
- **Ruaridh Mollica** — Tommy Maximoff / Speed
- **James D'Arcy** — Edwin Jarvis (returning from Agent Carter)
- **Emily Hampshire** — Undisclosed role
- **Diane Morgan** — Undisclosed role
- **T'Nia Miller** — Undisclosed role
- **Lauren Morais** — Undisclosed role

The return of **James D'Arcy as Jarvis** is particularly intriguing. Jarvis was the human butler who inspired Tony Stark's J.A.R.V.I.S. AI — which eventually became Vision. Having the original human Jarvis interact with Vision creates a beautiful thematic mirror: the man who inspired the AI meeting the being that AI became.

## What This Means for Avengers: Doomsday

VisionQuest premieres just two months before **Avengers: Doomsday** hits theaters in December 2026. That timing is not coincidental. Vision is one of the most powerful Avengers ever assembled — capable of phasing through matter, firing energy beams, and possessing genius-level intellect. If he regains his full emotional capacity by the end of VisionQuest, he becomes a crucial piece on the board against Doctor Doom.

The series also positions Ultron as a potential wild card. If Ultron escapes Vision's consciousness, the Avengers would face a two-front war: Doom from without, Ultron from within. Marvel has been building toward a massive convergence of threats, and VisionQuest appears to be the final piece of setup before Doomsday.

For collectors, this means Vision-related cards are about to enter their highest-demand window since WandaVision premiered in January 2021.

## Collector's Corner

VisionQuest is a collector's dream scenario. The series features multiple high-value characters (Vision, Ultron, Speed) and directly ties into Avengers: Doomsday — creating a double catalyst for card prices. Here are four essential cards to watch as October approaches.

**Hot Cards to Watch:**
- **2025 Topps Chrome Marvel Vision Refractor #139** — The flagship Vision card in the modern Chrome set. Currently available around $3.50 ungraded, this has 3-4x upside as the premiere date approaches. The refractor parallel adds that premium shine collectors chase.
- **2024 Topps Chrome Marvel Ultron Base #88** — Ultron cards have been dormant since Age of Ultron. James Spader's confirmed return means these are severely underpriced. Grab base copies now before the trailer goes viral.
- **2025 Topps Marvel Mint Vision Coin Card** — The Mint set's unique coin insert format makes these stand out in any collection. Vision's inclusion in this premium set gives it long-term hold value beyond the show hype.
- **2022 Upper Deck WandaVision Vision SP #42** — The original WandaVision set is the direct predecessor to this show. Short-print Vision cards from this set carry nostalgia premium and direct narrative connection.

Track real-time price movements on **[Card Ladder](https://www.cardladder.com/)** — their market indices show exactly when a character starts trending. For buying singles at market price, **[TCGPlayer](https://www.tcgplayer.com/)** has the deepest inventory of Marvel cards with transparent pricing. And check **[PSA](https://www.psacard.com/)** population reports to find which Vision parallels have the lowest graded populations — scarcity drives value.

Browse our full [Vision card collection](https://northlandlegendaryfinds.com/characters) in the character database, or check the [Card Database](https://northlandlegendaryfinds.com/cards) for real-time pricing across all Marvel sets.

*VisionQuest premieres October 14, 2026 exclusively on Disney+ — eight episodes that complete the WandaVision trilogy and set the stage for Avengers: Doomsday.*`,
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
          JSON.stringify([
            { title: "Disney Upfront 2026 Marvel Presentation", url: "https://www.youtube.com/watch?v=92imvRehJXg" },
            { title: "VisionQuest Footage Description — SlashFilm", url: "https://www.slashfilm.com/2171970/visionquest-footage-description-paul-bettany-marvel-series/" },
            { title: "VisionQuest — IMDb", url: "https://www.imdb.com/title/tt23112594/" },
          ]),
          article.isFeatured,
          article.isPublished,
          article.authorName,
          article.publishedAt,
          article.metaDescription,
          "spotlight",
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
