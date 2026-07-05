/**
 * Publish Doompendance Day Part 3: Doom 2099 — July 5, 2026
 * Run from project root: node publish-doompendance-day-part3.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (from manus-upload-file)
const IMAGES = {
  // Doom 2099 Topps Finest FF - Psychedelic stained glass base
  doom2099Base: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/hcSzGwMUsEWkDtus.webp",
  // Doom Derrick Chew Auto /99 Green
  doomChewAuto: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/WtNycFSRUMrsYFHb.webp",
  // Doom Sketch Card 1/1
  doomSketch: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/UmbFXmovzLWnMtxV.webp",
  // Doom 2099 Phenoms Gold /50
  doomPhenomsGold: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/KMyfttmgvCZohvTq.webp",
  // Doom 2099 Phenoms Blue /10
  doomPhenomsBlue: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/cbXiMxzcBzWXIljQ.webp",
  // Doom 2099 Topps Chrome Marvel Refractor
  doomChromeRefractor: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/eyGBPyhDInytJIxY.jpg",
  // Doom 2099: Rage of Doom #1 Comic
  doomRageComic: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/SFQdtWCfxNTmmhBG.jpg",
};

// July 5, 2026 at noon CDT (UTC-5)
const publishTime = new Date('2026-07-05T12:00:00-05:00').getTime();

const articles = [
  {
    title: "Doompendance Day, Part 3: Doom 2099 — The Time Doctor Doom Became President",
    slug: "doompendance-day-doom-2099-president",
    excerpt: "In 2099, Doctor Doom didn't conquer America with an army. He ran for office — and won. The cyberpunk Doom who became President of the United States is now getting his own comic series and some of the wildest cards in the hobby.",
    featuredImageUrl: IMAGES.doom2099Base,
    category: "analysis",
    tags: JSON.stringify(["Doom 2099", "Doompendance Day", "Doctor Doom", "Topps Finest", "Fantastic Four", "Marvel Comics", "Avengers Doomsday"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Doom 2099", "Spider-Man 2099", "Fantastic Four"]),
    cardMarketImpact: "Doom 2099 cards from the 2026 Topps Marvel Finest Fantastic Four set are already commanding attention with multiple parallel levels and artist autographs. The new Rage of Doom comic series adds fuel to the fire.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: publishTime,
    templateLayout: "listicle",
    metaDescription: "Doom 2099 became President of the United States in Marvel Comics. Now he has his own comic series and stunning cards in the 2026 Topps Finest Fantastic Four set. Part 3 of our Doompendance Day series.",
    sources: JSON.stringify([
      { title: "Marvel Comics - Doom 2099", url: "https://www.marvel.com/characters/doom-2099" },
      { title: "Doom 2099: Rage of Doom #1", url: "https://www.marvel.com/comics/issue/117118/doom_2099_rage_of_doom_2026_1" },
    ]),
    contentMarkdown: `We've spent the last two days talking about the original Doctor Doom — his debut in July 1962, his rivalry with Captain America, and his path to becoming the MCU's next big villain.

But there's another Doom. One who didn't just threaten America from across the ocean.

**He ran for President. And he won.**

---

## Welcome to 2099

In 1992, Marvel launched the "2099" imprint — a cyberpunk future where megacorporations had replaced governments, heroes were extinct, and the world had forgotten what it meant to fight back.

*Doom 2099* debuted in his own series that same year. The premise was simple but brilliant: Victor Von Doom wakes up in the year 2099 with no memory of how he got there. Latveria has been conquered. His name is forgotten. Everything he built is gone.

So he rebuilds. From nothing.

<img src="${IMAGES.doomChromeRefractor}" alt="Doom 2099 — 2026 Topps Chrome Marvel" style="max-width: 600px; width: 100%; border-radius: 8px; margin: 1.5rem auto; display: block;" />
<p style="text-align: center; font-style: italic; color: #888; margin-top: 0.5rem;">Doom 2099 — 2026 Topps Chrome Marvel</p>

---

## From Exile to the Oval Office

What makes Doom 2099 different from every other Marvel villain is the arc. He doesn't just punch his way back to power. He plays the long game.

First, he reclaims Latveria — overthrowing the corporate puppet state that replaced his kingdom. Then he turns his attention to America itself, which has become a dystopian wasteland run by a corporation called Alchemax.

In **Doom 2099 #29-33**, Victor Von Doom becomes the **President of the United States**. Not through invasion. Not through mind control. Through political maneuvering, public support, and the simple argument that he could run things better than the corporations destroying the country.

Sound familiar?

The day after Independence Day feels like the perfect time to talk about the villain who actually took the job.

<img src="${IMAGES.doomSketch}" alt="Doctor Doom Sketch Card — 2026 Topps Marvel Finest Fantastic Four" style="max-width: 500px; width: 100%; border-radius: 8px; margin: 1.5rem auto; display: block;" />
<p style="text-align: center; font-style: italic; color: #888; margin-top: 0.5rem;">Doctor Doom Sketch Card — 2026 Topps Marvel Finest Fantastic Four</p>

---

## President Doom's America

Once in office, Doom didn't play nice. He:

- Dissolved Congress
- Nationalized Alchemax's assets
- Declared war on the corporate oligarchy
- Actually improved living conditions for ordinary citizens

The writing was sharp because it forced readers to ask an uncomfortable question: **what if the dictator was actually better at the job?**

It's the same tension that makes the original Doom compelling — he genuinely believes he's saving the world. In 2099, he got the chance to prove it. And for a while, it worked.

Until it didn't.

<img src="${IMAGES.doomChewAuto}" alt="Doctor Doom Derrick Chew Auto /99 — 2026 Topps Marvel Finest Fantastic Four" style="max-width: 500px; width: 100%; border-radius: 8px; margin: 1.5rem auto; display: block;" />
<p style="text-align: center; font-style: italic; color: #888; margin-top: 0.5rem;">Doctor Doom Derrick Chew Auto /99 — 2026 Topps Marvel Finest Fantastic Four</p>

---

## The New Comic: Rage of Doom

Marvel clearly hasn't forgotten about 2099. A brand new series just hit shelves:

**Doom 2099: Rage of Doom #1** — written by Frank Tieri with art by Ron Randal and Andrew Dalhouse.

<img src="${IMAGES.doomRageComic}" alt="Doom 2099: Rage of Doom #1 — Marvel Comics 2026" style="max-width: 500px; width: 100%; border-radius: 8px; margin: 1.5rem auto; display: block;" />
<p style="text-align: center; font-style: italic; color: #888; margin-top: 0.5rem;">Doom 2099: Rage of Doom #1 — Marvel Comics 2026</p>

The timing isn't coincidental. With RDJ's Doctor Doom hitting the MCU in *Avengers: Doomsday* this December, Marvel is seeding every version of Doom across their publishing line. The 2099 version is the wildcard — a future Doom who already proved he could rule a nation.

If the multiverse is in play for Doomsday (and it is), Doom 2099 is exactly the kind of variant that could show up on screen.

---

## The Cards

The 2026 Topps Marvel Finest Fantastic Four set gave Doom 2099 the full treatment. Multiple parallels, artist autographs, and some of the most visually stunning inserts in the hobby right now.

<img src="${IMAGES.doomPhenomsGold}" alt="Doom 2099 Phenoms Gold /50 — 2026 Topps Marvel Finest Fantastic Four" style="max-width: 500px; width: 100%; border-radius: 8px; margin: 1.5rem auto; display: block;" />
<p style="text-align: center; font-style: italic; color: #888; margin-top: 0.5rem;">Doom 2099 Phenoms Gold /50 — 2026 Topps Marvel Finest Fantastic Four</p>

<img src="${IMAGES.doomPhenomsBlue}" alt="Doom 2099 Phenoms Blue /10 — 2026 Topps Marvel Finest Fantastic Four" style="max-width: 500px; width: 100%; border-radius: 8px; margin: 1.5rem auto; display: block;" />
<p style="text-align: center; font-style: italic; color: #888; margin-top: 0.5rem;">Doom 2099 Phenoms Blue /10 — 2026 Topps Marvel Finest Fantastic Four</p>

The "Phenoms" insert design is a direct callback to the original 1990s Topps Finest aesthetic — bold colors, holographic borders, and that unmistakable retro energy. The Gold /50 and Blue /10 are the chase pieces.

---

## Why 2099 Matters Now

Here's the thing about Doom 2099 that most collectors are sleeping on:

1. **The MCU multiverse makes every variant relevant.** If Secret Wars is coming, alternate Dooms are on the table.
2. **The new comic series means fresh content and fresh attention.** Rage of Doom just launched — that's new eyes on the character.
3. **The Finest FF set is premium.** These aren't base cards from a retail box. The Phenoms inserts, sketch cards, and artist autos are limited and visually incredible.

The original Doom cards are already commanding serious money. The 2099 variants are still relatively accessible — but probably not for long.

---

## The Doompendance Day Trilogy

This wraps up our three-part Doompendance Day series:

- **[Part 1: Doom vs. Captain America](https://northlandlegendaryfinds.com/mcu-news/doompendance-day-doom-vs-captain-america)** — The rivalry that Marvel just made official canon
- **[Part 2: The Villain Born in Independence Month](https://northlandlegendaryfinds.com/mcu-news/doompendance-day-doctor-doom-july-4th-marvel-cards)** — Doom's origin, his greatest stories, and why he's the hottest character in the hobby
- **Part 3: Doom 2099** — The time Doom became President (you're here)

Three days. Three versions of Doom. One message: this character is everywhere right now, and December is coming fast.

---

## Collector's Corner

Doom 2099 cards are the sleeper play heading into Avengers: Doomsday. The Finest Fantastic Four set offers multiple entry points from base refractors to premium numbered inserts.

**Hot Cards to Watch:**
- **Doom 2099 Phenoms Gold /50** — 2026 Topps Marvel Finest Fantastic Four. Retro 90s design, limited run.
- **Doom 2099 Phenoms Blue /10** — Same insert, ultra-low numbered. Chase piece.
- **Doctor Doom Derrick Chew Auto /99 Green** — 2026 Topps Marvel Finest FF. Artist auto with stunning artwork.
- **Doom 2099 Base Refractor** — 2026 Topps Marvel Finest FF. The psychedelic stained glass design is one of the best-looking base cards in the set.

Track Doom 2099 population reports on **[PSA](https://www.psacard.com/)** — early submissions are just starting to come back. Browse the full Finest FF checklist on **[Beckett](https://www.beckett.com/)** for parallel breakdowns. Find live auctions on **[Whatnot](https://www.whatnot.com/)** — Doom cards are moving fast in Marvel breaks right now.

Explore more Doom content in our **[Character Database](https://northlandlegendaryfinds.com/characters)** or browse the full **[Card Database](https://northlandlegendaryfinds.com/cards)** for set checklists.

*Doom 2099: Rage of Doom #1 is available now at your local comic shop and on Marvel Unlimited. Avengers: Doomsday hits theaters December 2026.*`,
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
    "SELECT id, title, publishedAt, isFeatured, templateLayout FROM articles ORDER BY publishedAt DESC LIMIT 10"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] [${r.templateLayout}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
