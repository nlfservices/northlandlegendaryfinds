/**
 * Publish "The Notorious Doctor Doom" — July 11, 2026
 * Run from project root: node publish-mcgregor-doom.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  featured: "/manus-storage/mcgregor-holloway-faceoff_2f2ed5af.jpg",
  mcgregorWalk: "/manus-storage/mcgregor-notorious-walk_a14e608c.png",
  mcgregorStrut: "/manus-storage/mcgregor-strut_a6797fc8.jpg",
};

const now = Date.now();

const articles = [
  {
    title: "The Notorious Doctor Doom: Why McGregor and Von Doom Are the Same Fighter",
    slug: "notorious-doctor-doom-mcgregor-von-doom-same-fighter",
    excerpt: "One rules Latveria. The other rules the Octagon. Both are foreign-born conquerors with unshakeable egos, devastating comebacks, and one nemesis they can never seem to beat. Tonight, as McGregor steps back into the cage after five years, the parallels to Doctor Doom have never been clearer.",
    featuredImageUrl: IMAGES.featured,
    category: "analysis",
    templateLayout: "magazine",
    tags: JSON.stringify(["Doctor Doom", "Conor McGregor", "UFC 329", "Trading Cards", "Card Market", "Topps Chrome", "Collector Crossover", "Max Holloway"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Reed Richards"]),
    cardMarketImpact: "McGregor's 2021 Panini Prizm Gold PSA 10 sits at $27,060. Doom's 2024 Chrome Refractors are climbing toward $5,000. Both Victors — er, both conquerors — dominate their respective card markets with the same theatrical energy they bring to their arenas.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Conor McGregor and Doctor Doom are the same character in different universes. Foreign-born conquerors, theatrical showmen, devastating comebacks, and one nemesis they can never beat. We break down the parallels as UFC 329 goes live tonight.",
    sources: JSON.stringify([
      { title: "UFC 329: McGregor vs Holloway 2 - UFC.com", url: "https://www.ufc.com/news/fight-fight-preview-ufc-329-mcgregor-vs-holloway-2" },
      { title: "McGregor Career Stats - UFC Stats", url: "http://ufcstats.com/fighter-details/f4c49976c75c5ab2" },
      { title: "Al Jazeera - McGregor vs Holloway 2 Preview", url: "https://www.aljazeera.com/sports/2026/7/10/conor-mcgregor-vs-max-holloway-2-at-ufc-329-all-you-need-to-know" },
      { title: "McGregor Card Prices - Sports Card Investor", url: "https://www.sportscardinvestor.com/subjects/conor-mcgregor-mma" },
    ]),
    contentMarkdown: `One rules Latveria with an iron fist. The other rules the Octagon with a left hand from hell. Both are foreign-born conquerors who arrived in their respective worlds and declared — without a shred of doubt — that they were the greatest to ever do it.

Tonight, as Conor McGregor steps back into the cage for the first time in **five years** at UFC 329, the parallels between "The Notorious" and Doctor Victor Von Doom have never been more obvious.

And honestly? They might be the same person in different universes.

![McGregor's iconic walk — the same energy Doom brings to every entrance](/manus-storage/mcgregor-notorious-walk_a14e608c.png)

## The Foreign-Born Conquerors

McGregor arrived from Dublin, Ireland — a plumber's apprentice who told the world he'd be champion before he ever won a fight. Doom was born in the fictional nation of Latveria — a Romani orphan who declared himself ruler before anyone gave him permission.

Both conquered through sheer force of will:

- **McGregor:** First simultaneous two-division UFC champion. Knocked out Jose Aldo in 13 seconds. Became the biggest PPV draw in combat sports history.
- **Doom:** Conquered the multiverse in Secret Wars. Became God Emperor of Battleworld. Held reality itself in his armored hands.

Neither asked for permission. Neither waited their turn. They both walked in and *took* it.

## The Theatrical Showmen

"I'm not here to take part. I'm here to take over."

That's McGregor. But it could just as easily be Doom addressing the Fantastic Four.

Both understand that **presence** is a weapon:

| Trait | McGregor | Doctor Doom |
|-------|----------|-------------|
| Entrance | Custom suits, billionaire strut, Irish flag draped | Full armor, green cloak, Doombots announcing arrival |
| Trash Talk | "I'll change your bum life" | "Doom does not negotiate. Doom commands." |
| Self-Reference | Speaks in third person ("The Notorious") | Always speaks in third person ("Doom") |
| Wardrobe | $10,000 suits, fur coats, gold watches | Titanium armor, mystical cloak, iron mask |
| Signature Move | Left hand KO | Armored backhand across Reed Richards' face |

They don't just fight. They *perform*. Every entrance is a coronation. Every victory is a declaration.

![The strut that launched a thousand memes — Doom would approve](/manus-storage/mcgregor-strut_a6797fc8.jpg)

## The Nemesis They Can't Beat

Here's where it gets painful.

**McGregor's Khabib:** Khabib Nurmagomedov went 29-0, mauled McGregor on the ground at UFC 229, and retired undefeated. McGregor never got the rematch. The one opponent who exposed every weakness — the wrestling, the cardio, the ego that leaves openings.

**Doom's Reed Richards:** The smartest man in the Marvel Universe. Every time Doom builds a perfect plan, Richards finds the flaw. Every time Doom conquers the world, the Fantastic Four take it back. In Secret Wars, even as God Emperor, Doom admitted Richards could have done it better.

Both conquerors have beaten everyone else. But there's always ONE person who sees through the armor.

## The Five-Year Absence

McGregor hasn't fought since January 2021. Five years of whiskey empires, yacht parties, and controversies. At his UFC 329 media day, he admitted he "got lost" in the fame.

Doom disappears too. After every defeat, he retreats to Latveria. Rebuilds. Plots. Returns stronger — or at least more dangerous.

Tonight's fight against Max Holloway isn't just a comeback. It's a **resurrection**. The same energy as Doom returning in Avengers: Doomsday after years of absence from the MCU.

And the kicker? McGregor beat Holloway 13 years ago in 2013 — back when neither was a champion. Now they're both legends meeting again. Just like Doom facing old enemies in new forms.

## The Ego: Strength AND Weakness

Both men's greatest asset is their unshakeable self-belief. McGregor manifested two world titles through pure confidence. Doom held Battleworld together through sheer will.

But that same ego blinds them:

- McGregor's ego led him to a boxing match with Floyd Mayweather he couldn't win, a bar fight that cost him years, and a lifestyle that dulled his edge.
- Doom's ego prevents him from ever admitting Richards is his equal, leading to the same defeat over and over.

The question tonight: Has five years of reflection humbled McGregor enough to evolve? Or will the ego show up one more time?

## The Card Market Connection

Here's where it gets real for collectors. Both McGregor and Doom are **monsters** in the card market:

**McGregor's Card Kingdom:**
- 2021 Panini Prizm UFC Gold PSA 10: **$27,060**
- 2023 Panini Prizm UFC Black /1: **$8,450**
- 2026 Topps Chrome UFC #5 (brand new): Refractors already moving
- 2026 Topps Chrome UFC "Immortal Force" Case Hit SSP: Chase card of the set

**Doom's Card Empire:**
- 2024 Topps Chrome Marvel Refractors: Climbing toward **$5,000** for numbered parallels
- 2026 Topps Chrome Marvel "One World Under Doom" Insert: The hottest Marvel insert of the year
- Kevin Eastman Auto Variant: **$500+**
- Black /10 parallels: **$2,500+**

Both are under the Topps/Fanatics umbrella now. McGregor's 2026 Topps Chrome UFC cards sit in the same product line as Doom's 2026 Topps Chrome Marvel cards. Same company. Same chrome technology. Same collector obsession.

## Tonight's Verdict

At UFC 329, McGregor faces Holloway at T-Mobile Arena in Las Vegas. Five rounds. Welterweight. The whole world watching.

If he wins? The comeback narrative explodes. Card prices spike. The Notorious proves that kings don't stay down.

If he loses? It's another chapter in the "almost conquered everything" story. Just like Doom losing Battleworld to the Fantastic Four.

Either way, the parallels are undeniable. Two foreign-born conquerors. Two theatrical showmen. Two devastating comebacks. One nemesis each that haunts them forever.

There's only one Notorious. And there's only one Doom.

Tonight, we find out if the Notorious still has it.

## Collector's Corner

The crossover between UFC and Marvel collectors has never been stronger — both markets are driven by the same energy: iconic characters, limited parallels, and the thrill of the chase.

**Hot Cards to Watch:**

- **[2026 Topps Chrome UFC Conor McGregor #5 Refractor](https://www.ebay.com/itm/358557734432)** — Fight night always spikes McGregor card prices. If he wins, expect 2-3x overnight.
- **[2026 Topps Chrome UFC McGregor "Immortal Force" Case Hit SSP](https://www.ebay.com/itm/800113832940)** — The chase card of the entire UFC Chrome set. Limited and climbing.
- **[Doctor Doom 2024 Topps Chrome Marvel Refractor](https://www.ebay.com/itm/236798047109)** — The flagship Doom chrome card that benefits from every movie reveal.
- **[Doctor Doom 2026 "One World Under Doom" Insert](https://www.ebay.com/itm/227414209507)** — The hottest Marvel insert of 2026, directly tied to the Doomsday storyline.

Check the latest prices on **[Card Ladder](https://www.cardladder.com)** and **[Sports Card Investor](https://www.sportscardinvestor.com)** — both McGregor and Doom cards move fast on fight nights and movie announcements.

*UFC 329 is LIVE tonight, July 11, 2026 from T-Mobile Arena in Las Vegas. Avengers: Doomsday hits theaters December 18, 2026.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

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
      console.log(`   Template: ${article.templateLayout}`);
      console.log(`   URL: /mcu-news/${article.slug}`);
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
