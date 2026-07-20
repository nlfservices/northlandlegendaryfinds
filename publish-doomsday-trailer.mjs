/**
 * Publish Doomsday Trailer Breaking News Article — July 20, 2026
 * Ties in 2025/2026 Topps Marvel Mint SDCC throughout
 * Template: cinematic (next in rotation after comic_strip)
 * Run from project root: node publish-doomsday-trailer.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Poster uploaded to CDN
const DOOM_POSTER = '/manus-storage/doomposter_38785c5a.jpg';
// Reuse existing card photos
const CARDS = {
  doom: '/manus-storage/1000043826_c2ad3c69.jpg',
  wolverine: '/manus-storage/Wolverine-Front_41835aa1.JPG',
  gambit: '/manus-storage/Gambit-front_97d1d245.jpg',
  magneto: '/manus-storage/1000043854_34ddb7b7.jpg',
  captainAmerica: '/manus-storage/CaptainAMerica-Front_2fd2e4ac.JPG',
  spiderman: '/manus-storage/Spider-Man-Front_504aec2f.JPG',
  ironman: '/manus-storage/OrinMan-Front_18a3ad57.JPG',
};

const now = Date.now();

const articles = [
  {
    title: "The Doomsday Trailer Just Dropped — And Every Character Is in the 2025 Marvel Mint Set",
    slug: "avengers-doomsday-trailer-marvel-mint-sdcc-connection",
    excerpt: "Marvel released the first Avengers: Doomsday trailer today — days before SDCC 2026. Doctor Doom, Thor, Gambit, Magneto, Captain America, and Professor Xavier are all confirmed. Every single one of them is in the 2025 Topps Marvel Mint SDCC exclusive set. And this week, Topps drops the 2026 follow-up at Comic-Con.",
    featuredImageUrl: DOOM_POSTER,
    category: "movie_news",
    templateLayout: "cinematic",
    tags: JSON.stringify(["Avengers Doomsday", "Trailer", "Topps Marvel Mint", "SDCC 2026", "Doctor Doom", "Robert Downey Jr", "Trading Cards", "Marvel", "Collector", "X-Men"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Thor", "Captain America", "Gambit", "Magneto", "Professor Xavier", "Spider-Man", "Wolverine", "Iron Man", "Shang-Chi"]),
    cardMarketImpact: "The Doomsday trailer confirms every major character from the 2025 Topps Marvel Mint set appears in the film. With the 2026 Marvel Mint dropping at SDCC this same week, demand for both sets is about to spike hard.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "The Avengers: Doomsday trailer just dropped before SDCC 2026. Every confirmed character appears in the 2025 Topps Marvel Mint SDCC exclusive set — and the 2026 follow-up releases this week at Comic-Con.",
    sources: JSON.stringify([
      { title: "Avengers: Doomsday Official Trailer - YouTube", url: "https://www.youtube.com/watch?v=irVNGjRFZGk" },
      { title: "Deadline - Russo Brothers Enlist The Entire Marvel Universe", url: "https://deadline.com/2026/07/avengers-doomsday-trailer-mcu-doctor-doom-1236998304/" },
      { title: "SDCC Blog - Topps 2026 Exclusives", url: "https://sdccblog.com/2026/07/topps-san-diego-comic-con-2026-exclusives-debuts/" },
      { title: "Marvel.com - SDCC 2026 Schedule", url: "https://www.marvel.com/articles/live-events/sdcc-san-diego-comic-con-2026-marvel-panels-booth-schedule" },
    ]),
    contentMarkdown: `Marvel just dropped the first official Avengers: Doomsday trailer — and they did it *before* San Diego Comic-Con. That alone tells you how confident they are. But for collectors, the real story isn't just the trailer. It's what's happening at SDCC this week.

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1.5rem 0;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/irVNGjRFZGk?rel=0&modestbranding=1" title="Avengers: Doomsday Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## The Trailer Breakdown

The two-and-a-half minute trailer confirms what we've been waiting for. Robert Downey Jr.'s Doctor Doom is front and center — not as a cameo, not as a tease, but as the driving force of the entire film.

Patrick Stewart's Professor Xavier opens with: *"Something's coming, something we may not be able to deter. Before this day is done, we will be faced with an unthinkable decision."*

Chris Hemsworth's Thor responds: *"We're going to need a miracle."*

That miracle? Steve Rogers. Chris Evans returns as Captain America for the first time since Endgame in 2019. The trailer confirms the biggest roster in Avengers history:

- **Doctor Doom** (Robert Downey Jr.)
- **Thor** (Chris Hemsworth)
- **Steve Rogers / Captain America** (Chris Evans)
- **Professor Xavier** (Patrick Stewart)
- **Gambit** (Channing Tatum)
- **Magneto** (Ian McKellen)
- **Shang-Chi** (Simu Liu)
- **Yelena Belova** (Florence Pugh) + Thunderbolts
- **Namor** (Tenoch Huerta)
- **The Fantastic Four** (Pedro Pascal, Vanessa Kirby, Joseph Quinn, Ebon Moss-Bachrach)
- **Nightcrawler** (Alan Cumming), **Mystique** (Rebecca Romijn), **Cyclops** (James Marsden), **Beast** (Kelsey Grammer)
- **Sam Wilson / Captain America** (Anthony Mackie)
- **Loki** (Tom Hiddleston)
- **Ant-Man** (Paul Rudd)

The Russo Brothers are back directing. December 18, 2026. Tickets already on sale for Infinity screenings.

## The Marvel Mint Connection Nobody's Talking About

Here's what makes this week insane for collectors: **every single major character confirmed in this trailer appears in the 2025 Topps Marvel Mint set.**

<img src="${CARDS.doom}" alt="Doctor Doom - 2025 Topps Marvel Mint PSA 10" style="max-width:300px;margin:1rem auto;display:block;border-radius:8px;" />

Last year at SDCC 2025, Topps released Marvel Mint as a **Comic-Con exclusive**. Limited boxes. You could only get them at the convention or through the SDCC Exclusives Portal. The set featured:

- **120 base cards** across Bronze, Silver, Gold, and Platinum tiers
- **Doctor Doom Chrome Exclusive** — only available in SDCC boxes
- **Doctor Doom Comic Cuts** — actual comic book pieces embedded in cards
- **Chrome Refractors** — Black (/10), Red (/5), and Superfractor (/1)
- **Gambit's Deck** — a 52-card chrome playing card insert set
- **Stan Lee Cut Signature** — 1:15,701 odds

The Doctor Doom SDCC exclusive alone has been selling for **$750+** on the secondary market. Someone on Reddit just posted they're selling theirs to fund their SDCC 2026 trip.

## History Repeats: 2026 Marvel Mint Drops This Week

And here's the kicker — **Topps just announced the 2026 Marvel Mint at SDCC this week.** Same format. Same exclusive boxes. This year's theme? **Spider-Man.**

<img src="${CARDS.spiderman}" alt="Spider-Man - 2025 Topps Marvel Mint Red Refractor /5 CGC 8.5" style="max-width:300px;margin:1rem auto;display:block;border-radius:8px;" />

The 2026 set will be available at Topps Booth #2934 in limited quantities. Pre-release went live June 16 through the SDCC Exclusives Portal. If last year is any indication, these boxes will sell out fast and immediately command a premium on the secondary market.

Think about the timing: the Doomsday trailer drops the same week as the new Marvel Mint release. Every character people just saw in that trailer — they can now chase in card form at Comic-Con. That's not a coincidence. That's marketing synergy.

## What This Means for Your Collection

<img src="${CARDS.gambit}" alt="Gambit - 2025 Topps Marvel Mint" style="max-width:300px;margin:1rem auto;display:block;border-radius:8px;" />

The trailer just validated every card in the 2025 Marvel Mint set. Here's why:

**Gambit** — Channing Tatum confirmed in the trailer. The Gambit Chrome cards and the entire Gambit's Deck insert set just became movie-relevant.

**Magneto** — Ian McKellen is back. The Fox-era X-Men are officially MCU canon now. Every Magneto card from Marvel Mint just got a boost.

**Captain America** — Chris Evans returning means vintage Cap cards and the Marvel Mint Platinum Cap are in play.

**Doctor Doom** — Already the chase of the set. Now he's the confirmed big bad of the biggest movie of 2026. The SDCC exclusive and Comic Cuts are only going up.

<img src="${CARDS.magneto}" alt="Magneto - 2025 Topps Marvel Mint PSA 10" style="max-width:300px;margin:1rem auto;display:block;border-radius:8px;" />

## Collector's Corner

The convergence of the Doomsday trailer and the 2026 Marvel Mint SDCC release creates a perfect storm for collectors. If you have 2025 Marvel Mint cards, hold them. If you're at SDCC this week, grab the 2026 boxes.

**Hot Cards to Watch:**
- **Doctor Doom Chrome SDCC Exclusive (2025 Marvel Mint)** — The $750 card that's about to become a $1,000 card after this trailer
- **Gambit Chrome Black Refractor /10 (2025 Marvel Mint)** — Channing Tatum confirmed in Doomsday = instant demand
- **Captain America Platinum (2025 Marvel Mint)** — Chris Evans is BACK. Enough said.
- **Any 2026 Marvel Mint SDCC Box** — If you can get one at booth #2934, you're sitting on gold

Track real-time prices on **[Card Ladder](https://www.cardladder.com/)** — their Marvel indices are about to move. Check sold listings on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** for what 2025 Marvel Mint cards are actually selling for right now. And browse our **[Card Database](https://northlandlegendaryfinds.com/cards)** to see the full Marvel Mint checklist.

*Avengers: Doomsday hits theaters December 18, 2026. The 2026 Topps Marvel Mint drops at SDCC Booth #2934 this week. The clock is ticking.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Unfeature previous featured article
  await conn.execute("UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1");
  console.log("✅ Unfeatured previous article");

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
