/**
 * Publish Memorial Day Marvel Article — May 2026
 * Run from project root: node publish-memorial-day.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (from manus-upload-file --webdev)
const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/memorial-day-cap-shield-featured-XHbievkuEnQaoPn8hPjujH.webp",
  inline: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/memorial-day-remembrance-inline-3rwVXxkG424SZWWeLaCDn2.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Memorial Day and Marvel: Remembering What the Holiday Actually Means",
    slug: "memorial-day-marvel-fallen-son-captain-america",
    excerpt: "Memorial Day is not about sales and BBQs. Through Marvel's Fallen Son: The Death of Captain America, we explore what remembrance truly looks like — and why sixty seconds of silence matters more than any mattress deal.",
    featuredImageUrl: IMAGES.featured,
    category: "analysis",
    tags: JSON.stringify(["Memorial Day", "Captain America", "Fallen Son", "Jeph Loeb", "Marvel Comics", "Military", "Remembrance"]),
    relatedCharacters: JSON.stringify(["Captain America", "Iron Man", "Wolverine", "Spider-Man", "Hawkeye", "Sam Wilson"]),
    cardMarketImpact: "Captain America cards historically see increased interest around patriotic holidays. Fallen Son variant covers and Captain America memorial-themed cards tend to spike in searches during Memorial Day weekend.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Memorial Day is about the fallen, not the sales. Marvel's Fallen Son: The Death of Captain America captures the grief and remembrance the holiday demands. A must-read for Memorial Day weekend.",
    sources: JSON.stringify([
      { title: "Marvel Comics - Fallen Son: The Death of Captain America (2007)", url: "https://www.marvel.com/comics/series/2476/fallen_son_the_death_of_captain_america_2007" },
      { title: "U.S. Department of Veterans Affairs - Memorial Day History", url: "https://www.va.gov/opa/speceven/memday/" },
    ]),
    contentMarkdown: `Every year, Memorial Day weekend arrives with the smell of charcoal, the sound of coolers cracking open, and advertisements promising the lowest prices of the season. There is nothing wrong with gathering your family, firing up the grill, and enjoying a long weekend. But somewhere between the third burger and the clearance emails, the actual meaning of the day disappears.

Memorial Day is not Veterans Day. It is not Armed Forces Day. It is the one day set aside to honor the men and women who did not come home — the ones who gave everything so the rest of us could have weekends like this in the first place. That distinction matters, and it gets lost more often than it should.

## What Marvel Got Right About Grief and Sacrifice

In 2007, Marvel Comics published a five-issue limited series called *Fallen Son: The Death of Captain America*, written by Jeph Loeb. The premise is simple and devastating: Captain America — the living symbol of American service and sacrifice — is dead, and the entire Marvel Universe has to reckon with what that loss means.

The series is structured around the five stages of grief. Wolverine refuses to believe it. The Avengers rage against it. Hawkeye tries to bargain his way around it. Spider-Man sits at a graveside in silence. And in the final issue, Iron Man and Sam Wilson stand at a full military funeral and accept that their friend, their soldier, is gone.

<img src="${IMAGES.inline}" alt="Rows of white military headstones at golden hour with American flags, Captain America shield silhouette reflected in rain puddle" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

That final issue is the one that should be required reading on Memorial Day. Captain America receives a state funeral with full military honors — a ceremony normally reserved for presidents. Sam Wilson delivers a eulogy that does not glorify war or wave a flag for the sake of it. He simply asks everyone present to stand as a testament to what Steve Rogers lived and died for.

## Why This Story Hits Different

Writer Jeph Loeb was not writing from imagination alone. He had lost his own son to cancer just a few years earlier. The grief in *Fallen Son* is not performative — it is the real thing filtered through superhero mythology. Every issue carries the weight of someone who knows exactly what it feels like when a person you love is simply no longer there.

That authenticity is what separates this story from every other patriotic comic ever printed. It is not about punching Nazis or saving the world. It is about what happens after the hero falls, and how a community finds the strength to carry forward the values that person embodied. That is precisely what Memorial Day asks of us every single year.

## Take a Moment This Weekend

Enjoy your weekend. Grill your steaks. Spend time with the people you love. But at some point between the potato salad and the fireworks, take sixty seconds of silence. Think about the ones who are not at anyone's table this weekend — and the families who will never stop noticing that empty chair.

If you want a story that captures that feeling better than any speech or ceremony, pick up *Fallen Son: The Death of Captain America*. Five issues. Five stages of grief. One reminder that the holiday exists because real people made a sacrifice that most of us will never fully understand.

That is what Memorial Day is. Everything else is just a long weekend.

## Collector's Corner

Captain America remains one of the most collected characters in the Marvel trading card hobby, and patriotic-themed cards see renewed interest every Memorial Day weekend. If you're building a Cap collection, this is the time to hunt.

**Hot Cards to Watch:**
- **Captain America Topps Chrome Marvel 2024 Base Chrome** — The flagship Cap card from last year's set, always in demand
- **Captain America Topps Marvel Mint 2025 Gold Foil /50** — Premium numbered parallel with the iconic shield design
- **Sam Wilson / Falcon Topps Chrome Marvel Refractor** — The man who delivered Cap's eulogy and carried the shield forward
- **Captain America Topps Brooklyn Collection 2025 Auto** — Ultra-premium autograph card for serious Cap collectors

Track real-time Captain America card values on **[Card Ladder](https://www.cardladder.com/)** — their price indices show exactly how patriotic holidays move the market. Browse sold listings on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** for actual transaction prices, and check **[PSA](https://www.psacard.com/)** population reports to see how rare your graded Cap cards really are.

Explore our full [Captain America card collection](https://northlandlegendaryfinds.com/characters) or browse the [NLF Card Database](https://northlandlegendaryfinds.com/cards) to find your next pickup.

*Fallen Son: The Death of Captain America — 5 issues, June–August 2007. Written by Jeph Loeb. Art by Leinil Yu, Ed McGuinness, John Romita Jr., David Finch, and John Cassaday.*`,
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
      console.log(`✅ Published: "\${article.title}"`);
    } catch (err) {
      console.error(`❌ Failed: "\${article.title}" — \${err.message}`);
    }
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 10"
  );
  console.log("\\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  \${r.id}: [\${r.isFeatured ? 'FEATURED' : ''}] \${r.title}`));

  await conn.end();
  console.log(`\\nDone! \${articles.length} article(s) published.`);
}

main().catch(console.error);
