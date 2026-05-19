/**
 * Publish PSA Grading News Article — May 2026
 * Covers: $200M investment, #NoPSAMay boycott, GemRate.com, new label design
 * Run from project root: node publish-psa-grading-news.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/psa-grading-news-featured-v2-ftHMAparjzNLtxNvYtqttD.png",
  boycott: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/psa-grading-boycott-inline-Dsdk3iicZmayQhRr3rFCy4.png",
  gemrate: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/psa-grading-gemrate-inline-HT2eEwBmy4Tc4owzQyVD3C.png",
};

const now = Date.now();

const contentMarkdown = `The card grading industry is at a crossroads. In the span of one week in May 2026, PSA announced the largest financial commitment in hobby history — a $200 million infrastructure investment — while thousands of collectors simultaneously organized the #NoPSAMay boycott to protest rising fees, inconsistent standards, and alleged shady practices. Meanwhile, a free tool called GemRate.com is quietly revolutionizing how collectors track grading data across every major company.

Whether you're sitting on raw Marvel cards waiting to submit, holding PSA slabs wondering if premiums will hold, or just trying to figure out which grading company deserves your money right now — this is the article you need to read.

## PSA's $200 Million Bet on the Future

On May 14, 2026, PSA dropped a bombshell: a **$200 million infrastructure investment** over the next 18 months, the largest single financial commitment in the history of card grading. This comes on top of the $100 million they've already invested since 2021, which opened new facilities in New Jersey, Tokyo, Florida, and Texas while tripling their staff.

The numbers tell the story of why this investment is necessary. In 2020, PSA graded 2 million cards. In 2025, that number exploded to **19 million**. Through the first four months of 2026, output is up 39% year-over-year, putting them on pace to shatter records again. PSA is currently processing roughly **90,000 cards per day** — and it still isn't enough.

<img src="${IMAGES.boycott}" alt="Collectors standing together demanding change from the grading industry" style="width:100%; border-radius:8px; margin:24px 0;" />

The investment focuses on three pillars: **Infrastructure** (doubling their physical footprint), **Technology** (proprietary logistics and tracking systems), and **Expertise** (1,000 new jobs, with 370 positions currently open and 700 more coming by end of 2026).

### The New PSA Label

Part of this investment includes a completely redesigned label featuring a larger final grade on the front, holographic security elements, microprinting, and UV-reactive features. This is PSA's direct response to the rise in sophisticated counterfeiting that has plagued the hobby.

### Updated Turnaround Times (May 14, 2026)

Here's what collectors are looking at for new submissions:

| Service Level | Turnaround (Business Days) | Notable Changes |
|---|---|---|
| Value Bulk | 140–160 | Minimum raised to 50 cards |
| Value | 100–120 | — |
| Value Plus | 60–80 | — |
| Value Max | 40–50 | — |
| Regular | 30–40 | — |
| Express | 20–30 | — |
| Super Express | 7–10 | Price up from $299 to $349/card |
| Walk-Through | 5–7 | — |

The minimum for Value Bulk submissions jumped from 20 cards to 50 cards — a move that directly impacts smaller collectors who were using bulk pricing to grade their personal collections affordably.

## The #NoPSAMay Boycott: Collectors Fight Back

While PSA was announcing billions in investment, collectors were organizing the largest boycott in hobby history. The **#NoPSAMay** movement launched in late April 2026 and gained massive traction across social media, with collectors pledging to send zero submissions to PSA for the entire month of May.

### Why Collectors Are Angry

The grievances run deep and have been building for years:

**The "Success Tax" (Upcharging):** PSA increases your grading fee if a card's market value rises while it's being processed. You submit at one price tier, and weeks later get hit with a higher bill because your card turned out to be valuable. Collectors call this punishing people for submitting quality cards.

**The December 2025 Buyback Scandal:** The most damaging allegation — PSA allegedly upgraded card grades internally after purchasing cards back from collectors, significantly inflating their resale value. This created a perceived conflict of interest where PSA's parent company, Collectors Holdings, profits from the very grades they assign.

**Inconsistent Standards:** Collectors report sudden "pop control" on certain modern sets, where PSA appears to tighten grading standards without announcement. Cards that would have received a 10 six months ago are now coming back as 9s.

**Fee Increases:** Bulk rates jumped from $21.99 to $24.99 per card in February 2026. Combined with the new 50-card minimum for Value Bulk, the barrier to entry for casual collectors keeps rising.

**Poor Accountability:** Limited compensation for cards damaged or lost in PSA's care, with some collectors reporting months-long disputes over missing submissions.

### What Collectors Are Demanding

The movement isn't just about anger — it's organized around specific demands:

1. End value-based upcharging in favor of flat-rate service tiers
2. Implement Grader Notes for all service levels, not just premium tiers
3. Ban conflicts of interest — Collectors Holdings should not own and sell graded inventory
4. Provide real-time tracking and faster dispute resolution

### Did the Boycott Work?

Here's the thing — despite #NoPSAMay, PSA still processed over **2.2 million cards** in a single month, setting yet another record. The hobby is simply too large and PSA's market dominance too entrenched for a single month's boycott to crater their volume. However, the movement has successfully raised awareness and put pressure on PSA to address transparency concerns — the $200 million investment and new turnaround time transparency may be a direct response.

## The Rise of Alternatives: SGC, TAG, and CGC

The boycott has accelerated interest in PSA alternatives. According to [GemRate.com](https://www.gemrate.com/) tracking data from the week of May 18, 2026:

| Grading Company | Weekly Volume | Trend |
|---|---|---|
| PSA | 545,500 | +15% |
| CGC | 174,200 | +23% |
| Beckett | 27,900 | +12% |
| SGC | 10,300 | -43% |
| TAG | 7,700 | +16% |

**CGC** is the biggest winner, posting 23% weekly growth as collectors look for alternatives with faster turnaround and more consistent standards. **TAG** (a newer grading company) is also gaining traction with collectors who want to support smaller operations.

The SGC dip is notable — while they've been a popular alternative, their weekly volume dropped 43%, possibly due to capacity constraints or collectors consolidating around fewer alternatives.

## GemRate.com: The Free Tool Every Collector Needs

<img src="${IMAGES.gemrate}" alt="Data visualization showing grading trends and population reports" style="width:100%; border-radius:8px; margin:24px 0;" />

If you're not using [GemRate.com](https://www.gemrate.com/), you're flying blind. This free platform tracks **daily grading trends** across PSA, Beckett, SGC, and CGC, giving collectors unprecedented visibility into the grading industry.

### What GemRate Offers

**Universal Pop Report:** Instead of checking PSA's pop report, then Beckett's, then SGC's separately, GemRate combines population data across all major grading companies into one searchable database. Want to know the total graded population of a specific Marvel card across ALL companies? GemRate has it.

**Daily Grading Volume:** See exactly how many cards each company is processing daily, weekly, and monthly. This data reveals trends before they hit mainstream hobby news.

**Gem Rate Percentages:** What percentage of submissions are getting PSA 10s? GemRate tracks this by set, category, and time period. If PSA is tightening standards on a specific set, you'll see the gem rate drop in real-time.

**Category Breakdowns:** The data shows TCG (Pokemon, etc.) dominates at 373,000+ cards graded in the past week, followed by Baseball (57,000), Basketball (43,500), and Football (32,800). Non-Sport cards (which includes Marvel) account for about 13,500 per week.

### Why This Matters for Marvel Collectors

With non-sport cards representing a smaller slice of PSA's volume, Marvel card submissions face less competition in the queue — but also less attention from PSA's quality control. Understanding these volume patterns helps you time your submissions strategically.

## What This Means for Your Marvel Collection

If you're holding raw Marvel cards and wondering whether to submit right now, here's the honest assessment:

**Consider waiting if:** You're price-sensitive and would use Value Bulk. The 50-card minimum and 140-160 day turnaround make this a long-term commitment. The new label design also means cards graded now will have the "old" label, which could affect resale perception once the new labels hit.

**Consider submitting now if:** You have high-value cards that benefit from the PSA premium. Despite the boycott, PSA 10s still command the highest prices on the secondary market. The temporary softening of PSA 10 premiums could reverse once the boycott energy fades.

**Consider alternatives if:** You want faster turnaround and are open to CGC or SGC slabs. CGC's 23% growth suggests the market is increasingly accepting non-PSA grades, especially for modern cards.

Browse our [card database](https://northlandlegendaryfinds.com/cards) to check which of your Marvel cards have the highest graded populations — low-pop cards in PSA 10 will always command premiums regardless of industry drama.

## Collector's Corner

The grading landscape is shifting, and smart collectors are using data to make better decisions. Whether you're timing submissions, buying graded cards at a discount during boycott panic, or exploring new grading companies, information is your edge.

**Hot Cards to Watch:**
- **Spider-Man Topps Chrome Marvel PSA 10** — PSA 10 premiums softening during boycott; potential buying opportunity
- **Wolverine Topps Finest X-Men '97 CGC 9.8** — CGC gaining acceptance; early high-grade copies could appreciate
- **Doctor Doom 2025 Topps Marvel Studios Chrome Raw** — Hold raw until new PSA label launches for maximum presentation value
- **Iron Man Topps Brooklyn Collection /25** — Low pop cards unaffected by grading drama; scarcity drives value regardless

Track real-time grading volumes and gem rates on **[GemRate.com](https://www.gemrate.com/)** — the free tool that shows you exactly what's happening across PSA, CGC, SGC, and Beckett daily.

Check current PSA population reports and authentication details at **[PSA](https://www.psacard.com/)** — despite the controversy, their pop report data remains the industry standard.

Compare graded card prices and recent sales on **[Card Ladder](https://www.cardladder.com/)** — essential for tracking whether PSA 10 premiums are holding or softening during the boycott.

*PSA's $200 million investment rolls out over the next 18 months. The new label design and updated turnaround times are effective immediately for new submissions as of May 14, 2026.*`;

const articles = [
  {
    title: "PSA Drops $200 Million, Collectors Fight Back, and GemRate Changes the Game: The State of Card Grading in 2026",
    slug: "psa-grading-2026-200-million-nopsamay-gemrate",
    excerpt: "PSA announces a massive $200 million infrastructure investment while collectors launch the #NoPSAMay boycott over rising fees and shady practices. Plus, how GemRate.com is giving collectors the data edge.",
    featuredImageUrl: IMAGES.featured,
    category: "card_market",
    tags: JSON.stringify(["PSA", "Grading", "NoPSAMay", "GemRate", "Card Market", "Boycott", "SGC", "Beckett", "CGC", "Trading Cards"]),
    relatedCharacters: JSON.stringify(["Spider-Man", "Wolverine", "Iron Man", "Doctor Doom"]),
    cardMarketImpact: "PSA 10 premiums are softening as collectors explore alternatives like SGC and TAG. The boycott and longer turnaround times may create buying opportunities for graded Marvel cards as some collectors dump PSA slabs.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "PSA announces $200M investment and 1000 new jobs while #NoPSAMay boycott rages. New label design, longer wait times, and how GemRate.com helps collectors track grading trends across PSA, CGC, SGC, and Beckett.",
    sources: JSON.stringify([
      { title: "PSA Announces $200 Million Infrastructure Investment", url: "https://www.psacard.com/articles/articleview/15715/200-million-investment-grading-experience" },
      { title: "NoPSAMay: Why Collectors Are Boycotting PSA", url: "https://sports.yahoo.com/articles/nopsamay-why-collectors-boycotting-psa-005737607.html" },
      { title: "GemRate - Daily Grading Trends", url: "https://www.gemrate.com/" },
    ]),
    contentMarkdown: contentMarkdown,
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
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
