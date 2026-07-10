/**
 * Publish "Doom's Throne Revealed" article — July 10, 2026
 * Run from project root: node publish-doom-throne-revealed.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-throne-shanghai-featured-nm52VBT68wMji4mrLt6bPG.webp",
  xmansion: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-throne-inline-xmansion-EFnabWGNkDM4tHkeNzVAy4.webp",
  sentinels: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-throne-inline-sentinels-oX36vFxQLxANjU4DJ8zNCt.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Doom's Throne Revealed at Shanghai Expo — And It Confirms Everything",
    slug: "doom-throne-revealed-shanghai-expo-avengers-doomsday",
    excerpt: "Marvel's Bilibili World booth leaks give us our first official look at Doctor Doom's throne room, the X-Mansion interior, and Kevin Feige takes the stage tomorrow to showcase Avengers: Doomsday.",
    featuredImageUrl: IMAGES.featured,
    category: "movie_news",
    tags: JSON.stringify(["Doctor Doom", "Avengers Doomsday", "Shanghai Expo", "Bilibili World", "Kevin Feige", "X-Men", "SDCC", "Trailer", "Leaked Footage", "Marvel 2026"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Professor X", "Magneto", "Thor", "Captain America", "Wolverine", "Cyclops", "Mister Fantastic"]),
    cardMarketImpact: "Every new Doomsday reveal drives Doom card prices higher. The 2026 Topps Chrome Marvel 'One World Under Doom' insert set is already commanding premium prices, and the SDCC trailer drop on July 25 will likely trigger another spike across all Doom-related cards.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Marvel reveals Doctor Doom's throne room and X-Mansion at Shanghai Expo. Kevin Feige presents Avengers: Doomsday tomorrow. Leaked footage confirmed real. SDCC trailer July 25. Full breakdown.",
    templateLayout: "spotlight",
    sources: JSON.stringify([
      { title: "Cosmic Book News — Doom Throne and X-Mansion Booth Leak", url: "https://cosmicbook.news/avengers-doomsday-shanghai-booth-leak-doom-throne-x-mansion" },
      { title: "The Direct — Disney First Look at Doctor Doom's Throne", url: "https://thedirect.com/article/disney-first-look-doctor-doom-throne-avengers-doomsday" },
      { title: "CBR — All 5 Superhero Teams Confirmed for Doomsday", url: "https://www.cbr.com/every-superhero-team-confirmed-avengers-doomsday-list/" },
      { title: "Bam Smack Pow — Doomsday Trailer Release Date Revealed", url: "https://bamsmackpow.com/marvel-avengers-doomsday-trailer-release-date-time-reportedly-revealed" },
      { title: "Comic Basics — First Leaked Look at Doctor Doom", url: "https://www.comicbasics.com/first-leaked-look-at-doctor-doom-in-avengers-doomsday-has-marvel-fans-talking/" }
    ]),
    contentMarkdown: `Marvel Studios just showed its hand — and it's holding a throne. Photos leaked from the Avengers: Doomsday promotional booth at Bilibili World 2026 in Shanghai have given fans their first official look at Doctor Doom's throne room, and the implications are massive. With Kevin Feige confirmed to take the main stage tomorrow on July 11 to officially showcase the film, and the first full trailer reportedly dropping at SDCC on July 25, the Doomsday marketing machine has finally kicked into high gear.

## The Throne That Changes Everything

The centerpiece of Marvel's Shanghai booth is a pale white stone throne sitting on a stepped dais, with a giant black Avengers "A" suspended directly above it. The symbolism could not be more deliberate — Doom doesn't just defeat the Avengers, he conquers them and sits above their legacy.

The throne itself represents a major departure from the comics. Rather than the medieval, castle-bound aesthetic fans know from decades of Doctor Doom stories, this version is sleek, futuristic, and almost alien in its design. It's flanked by Doom-green stained-glass panels depicting his masked face, the Avengers headquarters, and the Fantastic Four's Baxter Building — every team that will try and fail to stop him.

A countdown clock mounted beside the display ticks down to December 18, 2026. Release day.

<img src="${IMAGES.featured}" alt="Doctor Doom throne room concept with green energy and Avengers logo" style="width:100%;border-radius:12px;margin:16px 0;" />

## The X-Mansion Lives (For Now)

The second major set piece recreates Charles Xavier's study in stunning detail. A brushed-steel X emblem hangs over the fireplace, walls of antique books line the room, a chandelier casts warm light across the space, and a chrome wheelchair sits parked by the coffee table. The fireplace is even running.

This is significant because the December teaser wave showed the Xavier mansion in ruins — the aftermath of incursions tearing through the X-Men's reality. The booth builds it whole. This is the "before" picture, and knowing what comes next makes it haunting.

<img src="${IMAGES.xmansion}" alt="X-Mansion study interior with wheelchair and X emblem" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

With Patrick Stewart, Ian McKellen, James Marsden, Kelsey Grammer, Alan Cumming, Rebecca Romijn, and Channing Tatum all confirmed to return as the original Fox X-Men, Marvel putting the mansion on the show floor tells you exactly how central the mutants are to this story.

## Kevin Feige Takes the Stage Tomorrow

Marvel Studios president Kevin Feige is officially confirmed to present Avengers: Doomsday at Bilibili World on Saturday, July 11. Industry insiders anticipate that Feige will use the Shanghai stage to outline the narrative mechanics behind Doom's multiversal origins and potentially show exclusive footage to the crowd.

This follows a pattern Marvel has used throughout 2026 — showing footage at live events (CinemaCon in April, CineEurope in June) while withholding it from online release. The difference this time is that SDCC is only two weeks away, and the dam is about to break.

## The Leaked Footage That Keeps Getting Confirmed

In mid-June, a 72-second clip surfaced showing Doctor Doom activating a force of Sentinels while Thor calls Stormbreaker to his hand and Steve Rogers summons Mjolnir. Members of the Fox X-Men fight alongside the Avengers, with Cyclops firing optic blasts before the Sentinels launch their counterstrike.

<img src="${IMAGES.sentinels}" alt="Massive Sentinels marching across a devastated battlefield" style="width:100%;border-radius:12px;margin:16px 0;" />

Prominent industry scooper Daniel Richtman called the leaked material "100% real," and every subsequent reveal — from the Shanghai booth to the LEGO set leaks — has validated what the footage showed. Robert Downey Jr. himself told CBR the team is doing "something different" with the character, while co-director Joe Russo described Doom as someone who "is not simply a villain" but "one of the most complex Marvel characters" who is "always three moves ahead."

## Five Teams, One Enemy

Kevin Feige has confirmed that five superhero teams will unite against Doctor Doom in Avengers: Doomsday:

**Sam Wilson's Avengers** — Led by Anthony Mackie's Captain America, with Falcon, Ant-Man, Shang-Chi, Thor, and Loki.

**The New Avengers** — Yelena Belova, Bucky Barnes, Red Guardian, Ghost, US Agent, and the Sentry, fresh from Thunderbolts.

**The Wakandans** — Shuri's Black Panther alongside M'Baku, the Dora Milaje, Namor, and Namora.

**The Fantastic Four** — Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm crossing universes from Earth 828.

**The Original X-Men** — Professor X, Magneto, Cyclops, Mystique, Beast, Nightcrawler, and Gambit — finally in comic-accurate costumes after 26 years.

That is the largest ensemble cast in MCU history, and they are all fighting one man. The throne makes sense now.

## LEGO Leaks Hint at Dark Avengers

As if five hero teams weren't enough, LEGO set leaks from earlier this week suggest an even bigger twist. A set titled "Dark Avengers Quinjet" reportedly includes a HYDRA Captain America minifigure — pointing to a villainous team of Dark Avengers led by an evil Steve Rogers variant loyal to HYDRA.

A separate "Sentinel Battle" set includes Doom, Thor, Mystique, Mister Fantastic, Nightcrawler, and Magneto alongside a Sentinel replica and the X-Mansion sign, directly mirroring the leaked footage. When LEGO validates your leaks, they're real.

## The SDCC Trailer Countdown

According to industry insider The Beyond Reporter, the first full Avengers: Doomsday trailer will release online on Saturday, July 25 at 9:30 PM ET, approximately one hour after Marvel's Hall H panel at San Diego Comic-Con. This is Marvel's first return to Hall H in two years — they skipped 2025 entirely to prioritize filming Doomsday.

The studio has deliberately skipped every major marketing opportunity this year: the Super Bowl (first time in 16 years), CinemaCon (shown in-room only), The Mandalorian and Grogu theatrical release, SXSW London (which turned out to be a Doom coffee shop pop-up), and CineEurope. They saved everything for the grandest stage possible.

Fifteen days. That's all that stands between us and the first official Doomsday trailer.

## What This Means for Collectors

Every single reveal — the throne, the leaked footage, the LEGO sets, the Shanghai booth — drives demand for Doom-related cards higher. The 2026 Topps Chrome Marvel set dropped on July 1 with a dedicated "One World Under Doom" insert set, and those cards are already commanding serious premiums. Kevin Eastman autograph variants and Black /10 parallels are moving at top-tier prices on the secondary market.

The SDCC trailer will be the biggest catalyst yet. When casual fans see Doom commanding Sentinels and sitting on that throne for the first time, the card market will feel it immediately. Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to find Doctor Doom cards across every set, or explore the full [Characters section](https://northlandlegendaryfinds.com/characters) to track which heroes are confirmed for the film.

## Collector's Corner

With Doomsday marketing finally in full swing and the trailer two weeks away, Doom cards are the hottest chase in the Marvel collecting space right now. Every reveal validates the hype.

**Hot Cards to Watch:**
- **Doctor Doom 2026 Topps Chrome Marvel "One World Under Doom" Insert** — The newest Doom cards on the market, directly tied to current storylines
- **Doctor Doom 2024 Topps Chrome Marvel Refractor** — The flagship chrome Doom that benefits from every movie reveal
- **Wolverine Topps Finest X-Men '97 Refractor** — Fox X-Men confirmation in Doomsday makes every Wolverine card a buy
- **Professor X Topps Marvel Mint Base** — Patrick Stewart's return as Xavier puts this card in play for the first time in years

Track real-time price movements on **[TCGPlayer](https://www.tcgplayer.com/)** — their Marvel marketplace shows exactly where demand is heading. For historical price data and market indices, check **[Card Ladder](https://www.cardladder.com/)**. And browse sold listings on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** to see what collectors are actually paying right now.

*Avengers: Doomsday arrives in theaters December 18, 2026. Kevin Feige presents at Shanghai Expo tomorrow, July 11. The first trailer drops at SDCC on July 25. The countdown is on.*`
  }
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Unfeature previous featured article
  await conn.execute("UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1");
  console.log("✅ Unfeatured previous articles");

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
          article.templateLayout
        ]
      );
      console.log(`✅ Published: "${article.title}"`);
      console.log(`   URL: https://northlandlegendaryfinds.com/mcu-news/${article.slug}`);
      console.log(`   Template: ${article.templateLayout}`);
    } catch (err) {
      console.error(`❌ Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, templateLayout, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 8"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] (${r.templateLayout}) ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
