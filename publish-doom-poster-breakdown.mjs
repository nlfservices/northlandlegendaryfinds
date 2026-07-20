/**
 * Publish Doomsday Poster Breakdown Article — July 20, 2026
 * Analyzes the symbolism of the official Avengers: Doomsday poster
 * Ties back to the Mother's Day Cynthia Von Doom article
 * Template: dossier (next in rotation after cinematic)
 * Run from project root: node publish-doom-poster-breakdown.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const DOOM_POSTER = '/manus-storage/doomposter_38785c5a.jpg';
const CARDS = {
  doom: '/manus-storage/1000043826_c2ad3c69.jpg',
  ironman: '/manus-storage/OrinMan-Front_18a3ad57.JPG',
};

const now = Date.now() - 1800000; // 30 min before the trailer article

const articles = [
  {
    title: "Decoding the Doomsday Poster: Victor's Mother, a Dying World, and the Mask He Carries",
    slug: "avengers-doomsday-poster-breakdown-cynthia-von-doom-symbolism",
    excerpt: "The official Avengers: Doomsday poster tells a story before the trailer even plays. A hooded figure bows before a mural of a mother and child. The world crumbles behind them. And the mask in his hand says everything about who Victor von Doom really is.",
    featuredImageUrl: DOOM_POSTER,
    category: "movie_news",
    templateLayout: "dossier",
    tags: JSON.stringify(["Avengers Doomsday", "Doctor Doom", "Poster Analysis", "Cynthia Von Doom", "Robert Downey Jr", "MCU", "Marvel", "Secret Wars", "Topps Marvel Mint"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Cynthia Von Doom", "Scarlet Witch", "Iron Man"]),
    cardMarketImpact: "Doctor Doom cards are the most sought-after in the 2025 Topps Marvel Mint SDCC exclusive set. The poster confirms Doom's emotional depth in the film — this isn't a one-note villain. That narrative complexity drives long-term collector interest.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Breaking down the Avengers: Doomsday poster symbolism — from Cynthia Von Doom's mural to Victor's unmasked grief. What the poster tells us about the film and why it matters for collectors.",
    sources: JSON.stringify([
      { title: "Avengers: Doomsday Official Trailer - YouTube", url: "https://www.youtube.com/watch?v=irVNGjRFZGk" },
      { title: "NLF - This Mother's Day, Remember Cynthia Von Doom", url: "https://northlandlegendaryfinds.com/mcu-news/mothers-day-cynthia-von-doom-sacrifice-doctor-doom" },
      { title: "NLF - Triumph and Torment: Doom's Betrayal", url: "https://northlandlegendaryfinds.com/mcu-news/triumph-and-torment-doom-betrayal-mothers-rejection" },
      { title: "Marvel.com - SDCC 2026 Schedule", url: "https://www.marvel.com/articles/live-events/sdcc-san-diego-comic-con-2026-marvel-panels-booth-schedule" },
    ]),
    contentMarkdown: `Marvel just released the official poster for Avengers: Doomsday — and it's not an action shot. It's not an ensemble lineup. It's one man, alone, kneeling before a painting of his mother.

If you've been following our coverage since Mother's Day, you already know why this matters.

## The Mural: Cynthia and Young Victor

The centerpiece of the poster is a massive Renaissance-style mural depicting a woman embracing a child. Based on everything we know about Doctor Doom's origin, this is almost certainly **Cynthia Von Doom** holding a young Victor.

We wrote about Cynthia's story [back in May](/mcu-news/mothers-day-cynthia-von-doom-sacrifice-doctor-doom). The short version: Cynthia was a Romani sorceress who made a deal with Mephisto to protect her people. The deal went wrong. She died. Her soul was trapped in Hell. Victor spent his entire life — every invention, every conquest, every act of apparent villainy — trying to get her back.

The heavenly light surrounding the figures in the mural isn't random. It's Victor's memory of his mother. It's the version of her he's been fighting to restore for decades.

![Doctor Doom - 2025 Topps Marvel Mint SDCC Exclusive](/mcu-news/../${CARDS.doom})

## The Posture: A Pilgrim, Not a Conqueror

Look at how Doom is positioned. He's not standing triumphantly on a throne. He's not raising his fist. He's **bowing**. Head down. Shoulders forward. Like a mourner at a shrine.

This tells us everything about the film's version of Doom. Whatever Victor does in Avengers: Doomsday — however many worlds he breaks, however many heroes he fights — it's motivated by **personal loss**. He genuinely believes he is the only person capable of saving reality. Even if saving it means remaking it in his image.

We explored this exact dynamic in our [Triumph and Torment breakdown](/mcu-news/triumph-and-torment-doom-betrayal-mothers-rejection). In the comics, Doctor Strange helps Doom descend into Hell to rescue Cynthia's soul. She rejects him. Calls him a monster. It's the most devastating moment in Doom's history — and it only makes him more dangerous.

If the Russos are pulling from that storyline, this film is going to hit different.

## The World: Earth, Multiverse, or Battleworld?

The enormous sphere beneath the mother and child resembles a planet engulfed in clouds. Three interpretations:

1. **Earth** — the world Doom believes he must rule to save
2. **The collapsing multiverse** — realities dying around the last survivors
3. **Battleworld** — the single reality Doom constructs from the fragments of destroyed universes in Secret Wars

The darker, monstrous figures around the edges of the mural represent destruction encroaching on creation. Heaven versus Hell. The last surviving world surrounded by dying realities. This is Doom's justification: without him, everything falls.

## The Mask: Victor Beneath the Armor

Here's the detail that changes everything: Doom appears to be **carrying his mask in one hand** rather than wearing it.

He's not approaching this mural as Doctor Doom, ruler of Latveria. He's approaching it as **Victor** — the grieving son beneath the armor. The mask is a tool, a persona, a weapon. But in this moment, he doesn't need it.

This could foreshadow a major unmasked reveal in the film. Given Robert Downey Jr.'s casting, the moment where the mask comes off will be one of the most talked-about scenes in MCU history.

The fact that Doom looks so small beneath the enormous mural reinforces the idea that his vast ambition began with childhood trauma and a feeling of powerlessness. He became the most dangerous man in the multiverse because once, he was a boy who couldn't save his mother.

## The Collector's Connection

Every version of Doctor Doom that appears in this film is represented in the **2025 Topps Marvel Mint** set — the SDCC-exclusive release from last year. The Doom Chrome Exclusive, the Comic Cuts with actual comic book pieces, the Black Refractor /10 — these cards capture the character at the exact moment Marvel is making him the center of their universe.

![Iron Man - 2025 Topps Marvel Mint Black Refractor /10 CGC 10](${CARDS.ironman})

And this week at SDCC 2026, Topps drops the follow-up: **2026 Marvel Mint**, Spider-Man themed. History repeating. The same exclusive format, the same limited boxes, the same frenzy.

If you're holding Doom cards from the 2025 set, this poster just validated your position. The film isn't treating Doom as a generic villain. It's treating him as the most complex character in the MCU. That kind of narrative depth drives long-term collector interest.

---

### Collector's Corner — 4 Hot Cards to Watch

| Card | Why It's Moving |
|------|----------------|
| Doctor Doom #107 — SDCC Chrome Exclusive | The poster confirms Doom's emotional depth. This isn't a one-movie villain. |
| Doctor Doom Comic Cuts | Actual comic pieces from Doom stories — including potential Cynthia panels |
| Iron Man #103 — Black Refractor /10 | RDJ connection. The man behind the mask, literally. |
| Any Doom Superfractor /1 | One-of-one from the SDCC set. If the film delivers, these are grails. |

**Find these cards:**
- [Card Ladder](https://www.cardladder.com) — Track Doom price trends
- [eBay](https://www.ebay.com) — Hunt for Marvel Mint singles
- [COMC](https://www.comc.com) — Check Out My Cards for raw singles

**More from NLF:**
- [Full 2025 Marvel Mint Guide](/mcu-news/2025-topps-marvel-mint-complete-guide-bronze-to-platinum)
- [Doctor Doom SDCC Exclusive Deep Dive](/mcu-news/doctor-doom-sdcc-exclusive-750-card-2025-topps-marvel-mint)
- [Browse Doom Cards in Our Database](/cards)

---

*Avengers: Doomsday arrives December 18, 2026. The 2026 Topps Marvel Mint drops at SDCC this week — Booth #2934.*`,
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
    } catch (err) {
      console.error(`❌ Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Update rotation
  await conn.execute(
    `UPDATE site_settings SET value = 'dossier' WHERE \`key\` = 'last_rotation_template'`
  );
  console.log("✅ Rotation advanced to: dossier");

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 5"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
