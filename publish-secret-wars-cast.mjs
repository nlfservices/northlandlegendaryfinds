/**
 * Publish Secret Wars Cast Speculation Article — May 2026
 * Run from project root: node publish-secret-wars-cast.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/secret-wars-cast-featured-anUrA6BV9nsCjf7YuCFhjp.webp",
  multiverse: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/secret-wars-multiverse-portals-Cft66nE9LQMzfY6Rot3TDr.webp",
  throne: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/secret-wars-cosmic-throne-JYiRe79VrDCzb2GZJbdusP.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Who's In Avengers: Secret Wars? Every Confirmed and Rumored Cast Member So Far",
    slug: "avengers-secret-wars-cast-confirmed-rumored-2027",
    excerpt: "Filming begins this August and the cast list keeps growing. From Robert Downey Jr.'s Doctor Doom to three Spider-Men and returning X-Men, here's every actor confirmed and rumored for Marvel's Secret Wars.",
    featuredImageUrl: IMAGES.featured,
    category: "rumors",
    tags: JSON.stringify(["Secret Wars", "Avengers", "MCU", "Casting", "Doctor Doom", "Spider-Man", "X-Men", "Multiverse Saga", "2027", "Russo Brothers"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Spider-Man", "Wolverine", "Captain America", "Doctor Strange", "Iron Man", "Black Widow", "Deadpool", "Magneto", "Jean Grey", "Venom", "Reed Richards", "Loki", "Captain Marvel", "Nightcrawler"]),
    cardMarketImpact: "Secret Wars casting rumors are already moving the market. Doctor Doom cards continue climbing with RDJ attached, Wolverine and Spider-Man variants remain hot, and any confirmation of returning X-Men actors could spike older Fox-era character cards overnight.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Complete breakdown of every confirmed and rumored actor for Avengers: Secret Wars (2027). From Robert Downey Jr. as Doctor Doom to three Spider-Men, returning X-Men, and wild card picks like Sydney Sweeney.",
    sources: JSON.stringify([
      { title: "MyTimeToShineHello Cast List (X/Twitter)", url: "https://x.com/MyTimeToShineH" },
      { title: "Yahoo Entertainment - Secret Wars Cast List", url: "https://www.yahoo.com/entertainment/movies/articles/entire-secret-wars-cast-list-063131606.html" },
      { title: "AOL - Sydney Sweeney & Key Cast Revealed", url: "https://www.aol.com/articles/sydney-sweeney-key-avengers-secret-052418883.html" },
      { title: "Reddit - Ebon Moss-Bachrach Filming Confirmation", url: "https://www.reddit.com/r/MarvelStudiosSpoilers/comments/1te3f5c/ebon_mossbachrach_confirms_that_avengers_secret/" },
      { title: "ComicBookMovie - Extras Casting Call", url: "https://comicbookmovie.com/avengers/avengers-secret-wars/avengers-secret-wars-seeking-extras-to-play-enhanced-beings-as-new-rumor-points-to-venoms-mcu-debut-a227848" },
    ]),
    contentMarkdown: `With **Avengers: Doomsday** set to shatter theaters this December, Marvel Studios is already gearing up for the grand finale of the Multiverse Saga. **Avengers: Secret Wars** officially begins filming in August 2026 — confirmed just days ago by Ebon Moss-Bachrach himself — and the rumored cast list reads like the most ambitious superhero ensemble ever assembled. Directed once again by Anthony and Joe Russo with a script from Michael Waldron and Stephen McFeely, this December 2027 release is shaping up to be the MCU's true Endgame-level event. Here's every actor confirmed and rumored so far, and what it all means.

## The Confirmed Heavy Hitters

Let's start with what we actually know. **Robert Downey Jr.** returns as **Doctor Doom** — not Tony Stark, but the armored tyrant who will presumably carry over from Doomsday as the saga's ultimate threat. **Benedict Cumberbatch** is back as **Doctor Strange**, and **Anthony Mackie** has personally confirmed he'll suit up as **Captain America** once more. **Ebon Moss-Bachrach**, who plays **Ben Grimm / The Thing** in The Fantastic Four: First Steps, confirmed his Secret Wars involvement during an interview with Dog Day Afternoon, noting that filming starts in August.

**Pedro Pascal** is expected to reprise **Reed Richards / Mister Fantastic** following his debut in the Fantastic Four film. And **Sadie Sink** has been officially confirmed as part of the cast, though Marvel has kept her specific role under wraps — more on that below.

<img src="${IMAGES.throne}" alt="Cosmic throne made of shattered reality fragments floating in space" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

## Three Spider-Men, One Movie

According to prominent scooper DanielRPK, **Tom Holland**, **Tobey Maguire**, and **Andrew Garfield** will all have **major roles** in Secret Wars. This isn't a quick cameo situation like No Way Home's final act — these three are reportedly central to the story. DanielRPK also places **Ryan Reynolds' Deadpool** and **Hugh Jackman's Wolverine** in the "major role" category, suggesting the Deadpool & Wolverine duo will carry significant weight in the multiverse conflict.

The Cosmic Circus' Alex Perez went further, sharing what he calls an 11-hero "Resistance" lineup: Wolverine, Deadpool, both variant Spider-Men (Maguire and Garfield alongside Holland), **America Chavez**, **Wiccan**, **Speed**, **Ms. Marvel**, **Kate Bishop**, **Cassie Lang**, and **Jean Grey**. If accurate, this suggests a younger generation of heroes will fight alongside the multiverse veterans in a resistance force against Doom's forces.

## The X-Men Are Coming Home

This is where it gets really exciting for longtime Marvel fans. Insider MyTimeToShineHello posted that **"some of the First Class actors will return for Secret Wars"** and specifically named **Michael Fassbender** as Erik Lehnsherr (the younger Magneto). Follow-up reports added **Rebecca Romijn** as Mystique and **Alan Cumming** as Nightcrawler — with Cumming reportedly already on the call sheet, though Marvel used "secret names" in the script to hide his return.

<img src="${IMAGES.multiverse}" alt="Dimensional portals opening across a cosmic battlefield with heroic silhouettes" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

The older X-Men guard may also show up. **Patrick Stewart** and **Ian McKellen** are both named in the rumored cast list as Professor X and Magneto respectively. If Marvel pulls this off — two different versions of Magneto from two different timelines fighting in the same movie — it would be a multiverse moment for the ages.

And then there's **Sadie Sink**. While Marvel hasn't disclosed her role, the overwhelming speculation points to **Jean Grey**. She appeared in the Cosmic Circus resistance lineup, and her casting aligns perfectly with Marvel's push to introduce the X-Men properly into the MCU.

## Legacy Avengers: Who's Coming Back?

The original Avengers may not be done yet. **Scarlett Johansson** is rumored to return as **Black Widow** in both Doomsday and Secret Wars, according to LiveWarrior insider reports. Yes, Natasha Romanoff died in Endgame — but the multiverse makes everything possible. A variant Black Widow fighting alongside the resistance would be a massive crowd-pleaser.

**Chris Hemsworth** as Thor and **Sebastian Stan** as the Winter Soldier are both confirmed for Doomsday and widely expected to carry over. **Tom Hiddleston** as Loki has been specifically called out by MyTimeToShineHello for Secret Wars. **Brie Larson** reportedly has a "big role" as Captain Marvel. And **Florence Pugh** (Yelena Belova), **Letitia Wright** (Shuri), and **Simu Liu** (Shang-Chi) are all expected to reprise their established MCU roles.

One notable caveat: **Chris Evans** as Steve Rogers reportedly will **not** be the lead of Secret Wars despite leading Doomsday. Multiple insiders suggest his role may be "drastically reduced" in the sequel.

## The Wild Cards

Every great ensemble needs surprises, and the rumor mill has delivered some jaw-droppers. **Sydney Sweeney** is listed as playing **The One Above All** — the supreme cosmic entity in Marvel Comics who exists above even the Living Tribunal. If true, this would be one of the most unexpected casting choices in MCU history. **Dwayne Johnson** also appears on the list in an undisclosed role, and **Channing Tatum** is rumored as **Gambit** — a role he famously almost played in the Fox X-Men universe.

**Lewis Pullman** is named as **Sentry**, and the latest bombshell: Kevin Feige reportedly wants **Tom Hardy's Venom** in Secret Wars. Andrew Garfield's Spider-Man may even face off against Hardy's symbiote in a multiverse showdown, with Garfield potentially wearing the black suit. **Elliot Page** is also reportedly on the call sheet, though the studio has fiercely guarded details about the role.

## What the Extras Casting Tells Us

Marvel's extras casting call, which opened this week, provides fascinating clues about the film's scope. They're seeking: **military veterans and hero types**, **Caribbean soldiers**, **Brokk and Sindri** (short-statured actors — likely the dwarf characters from Thor's realm), **Elder Warriors** (described as gritty and wise), **Viking and combat types**, **enhanced beings**, **scientists**, and **civilians/survivors**. The sheer variety suggests Secret Wars will span multiple realms and realities, with massive battle sequences involving armies from different corners of the multiverse.

## What This Means for Collectors

The Secret Wars casting rumors are already sending shockwaves through the Marvel trading card market. Every confirmed or rumored actor translates directly to character card demand. **Doctor Doom** cards featuring RDJ's version will continue their upward trajectory. **Wolverine** and **Spider-Man** variants across Topps Chrome Marvel and Topps Marvel Mint remain some of the hottest pulls in the hobby. If the X-Men First Class actors are officially confirmed, expect older Fox-era character cards — particularly Magneto, Mystique, and Nightcrawler — to see renewed interest overnight.

The Sadie Sink as Jean Grey speculation alone could move the needle on any Jean Grey card in the [Card Database](https://northlandlegendaryfinds.com/cards). And if Tom Hardy's Venom gets the green light, Venom cards across every set will spike. Browse our [Characters section](https://northlandlegendaryfinds.com/characters) to track all the heroes rumored for Secret Wars, and keep an eye on our [MCU News](https://northlandlegendaryfinds.com/mcu-news) for the latest casting confirmations.

## Collector's Corner

Secret Wars is shaping up to be the biggest Marvel event in history, and the card market is already reacting. Here are the cards to watch as casting confirmations roll in.

**Hot Cards to Watch:**
- **Doctor Doom Topps Chrome Marvel Base & Refractors** — RDJ's involvement keeps Doom cards climbing; expect another spike when the first Secret Wars trailer drops
- **Wolverine Topps Marvel Mint Gold Medallion** — Hugh Jackman confirmed for a major role means Wolverine premium cards stay red-hot
- **Spider-Man Topps Finest X-Men '97 Variant** — Three Spider-Men in one movie is unprecedented; any Spidey card with multiverse appeal is a buy
- **Jean Grey Topps Comic Book Heroes Insert** — If Sadie Sink is confirmed as Jean Grey, these cards will move fast before the mainstream catches on

Track real-time prices on **[Card Ladder](https://www.cardladder.com/)** — their market indices will show you exactly when Secret Wars hype starts moving specific characters.

Browse sold listings on **[eBay Marvel Cards](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** to see what collectors are actually paying right now.

Check grading population reports on **[PSA](https://www.psacard.com/)** to find low-pop cards that could explode once casting is officially confirmed.

*Avengers: Secret Wars begins filming August 2026 and releases December 17, 2027. Stay tuned to [NLF MCU News](https://northlandlegendaryfinds.com/mcu-news) for every casting update as it breaks.*`,
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
