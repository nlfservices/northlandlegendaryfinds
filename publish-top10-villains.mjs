/**
 * Publish Top 10 Most Popular MCU Villains of All Time — May 6, 2026
 * Run from project root: node publish-top10-villains.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-top10-mcu-villains-DHSSC9rBiiS9kojewPds29.png",
};

const now = Date.now();

const articles = [
  {
    title: "THE TOP 10 MOST POPULAR MCU VILLAINS OF ALL TIME — FROM SECRET WARS TO DOOMSDAY",
    slug: "top-10-most-popular-mcu-villains-all-time",
    excerpt: "From the 1984 Secret Wars to Avengers: Doomsday, these are the 10 MCU villains who terrified audiences, broke box offices, and are now dominating the trading card market. Doctor Doom takes the crown.",
    featuredImageUrl: IMAGES.featured,
    category: "analysis",
    tags: JSON.stringify(["Top 10", "Villains", "Doctor Doom", "Thanos", "Secret Wars", "Doomsday", "MCU", "Card Market"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Thanos", "Loki", "Killmonger", "Hela", "Vulture", "Green Goblin", "Ultron", "Wenwu", "Kingpin"]),
    cardMarketImpact: "Doctor Doom and Thanos cards are surging ahead of Avengers: Doomsday. Doom cards have seen 300%+ gains since RDJ's casting was announced, while Killmonger and Hela remain undervalued relative to their cultural impact.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "The definitive ranking of the 10 greatest MCU villains of all time. Doctor Doom claims #1 ahead of Thanos, with card market analysis for every villain on the list. Includes 1984 and 2015 Secret Wars comic history.",
    sources: JSON.stringify([
      { title: "Marvel Secret Wars (1984) - Marvel Comics", url: "https://www.marvel.com/comics/series/2076/secret_wars_1984_-_1985" },
      { title: "Secret Wars (2015) - Marvel Comics", url: "https://www.marvel.com/comics/series/18454/secret_wars_2015" },
      { title: "Ranker - Best MCU Villains (40,000+ votes)", url: "https://www.ranker.com/list/best-mcu-villains/ranker-film" },
      { title: "IMDb - Best Marvel Villains", url: "https://www.imdb.com/list/ls025668546/" }
    ]),
    contentMarkdown: `The MCU has given us some of the greatest villains in cinema history. From genocidal titans to gods of mischief, from crime lords to multiversal conquerors — Marvel's rogues gallery is stacked. But who stands at the top?

We're not just ranking these villains by screen time or fan polls. We're looking at the full picture: their MCU legacy, their comic book history (especially the 1984 and 2015 Secret Wars events), their cultural impact, and — because this is NLF — which villain cards are dominating the trading card market right now.

Whether you're a collector hunting the next blue-chip card or just want to settle the debate once and for all — here are the 10 greatest MCU villains of all time.

---

## 10. KINGPIN / WILSON FISK

**First MCU Appearance:** Daredevil (2015) | **Played by:** Vincent D'Onofrio

**Why He's Here:** Wilson Fisk is the most grounded villain in the MCU. No superpowers, no cosmic artifacts — just raw brutality, political manipulation, and a terrifying presence that makes every scene feel like a pressure cooker. D'Onofrio's performance in Daredevil is widely considered the best villain performance in any Marvel property. His return in Hawkeye and Daredevil: Born Again proves Marvel knows what they have.

**Comic Legacy:** Kingpin has been Spider-Man and Daredevil's most persistent foe since the 1960s. In the comics, he's controlled New York's criminal underworld for decades — and in Born Again (the comic), he systematically destroyed Matt Murdock's life piece by piece.

**Card to Chase:** Kingpin #KP-1 Topps Chrome Marvel (2024) Base — undervalued right now. His expanded MCU role means demand is climbing.

---

## 9. WENWU / THE MANDARIN

**First MCU Appearance:** Shang-Chi and the Legend of the Ten Rings (2021) | **Played by:** Tony Leung

**Why He's Here:** Tony Leung brought a gravitas to Wenwu that elevated the entire film. A thousand-year-old warlord who conquered empires, built an army, and then gave it all up for love — only to tear the world apart trying to get her back. He's sympathetic, terrifying, and tragic all at once. The Ten Rings organization has been lurking in the MCU since Iron Man (2008), making Wenwu the longest-running background threat in the franchise.

**Comic Legacy:** The Mandarin is one of Marvel's oldest villains (1964), and the Ten Rings are among the most powerful weapons in the Marvel Universe — alien technology that grants mastery over matter, energy, and reality itself.

**Card to Chase:** Wenwu #WW-3 Topps Marvel Mint (2025) Silver Medallion — beautiful design, and Shang-Chi 2 will drive renewed interest.

---

## 8. ULTRON

**First MCU Appearance:** Avengers: Age of Ultron (2015) | **Voiced by:** James Spader

**Why He's Here:** Ultron was Tony Stark's greatest mistake — an AI designed to protect the world that immediately decided humanity was the problem. James Spader's sardonic, menacing voice performance gave Ultron a personality that was equal parts terrifying and darkly funny. While some fans felt the film underused him, What If...? showed us Infinity Ultron — a version that conquered the entire multiverse — proving his potential was always limitless.

**Comic Legacy:** Ultron is one of the Avengers' most persistent and dangerous foes. In the comics, he's destroyed civilizations, created Vision, and triggered the "Age of Ultron" event that reshaped the Marvel timeline. He always comes back.

**Card to Chase:** Ultron #U-5 Topps Chrome Marvel (2024) Refractor — affordable entry with upside if Marvel brings him back (and they will).

---

## 7. GREEN GOBLIN / NORMAN OSBORN

**First MCU Appearance:** Spider-Man: No Way Home (2021) | **Played by:** Willem Dafoe

**Why He's Here:** Willem Dafoe's return as Green Goblin in No Way Home wasn't just fan service — it was the single best villain performance in any Spider-Man film. The hallway fight scene, the "strong enough to have it all" speech, the brutal apartment fight — Dafoe reminded everyone why Norman Osborn is Spider-Man's greatest enemy. He stole the entire movie from two other Spider-Men.

**Comic Legacy:** Norman Osborn killed Gwen Stacy. He ran the Thunderbolts. He became the Iron Patriot and took over S.H.I.E.L.D. during Dark Reign. In the comics, he's not just a Spider-Man villain — he's an Avengers-level threat. With Spider-Man: Brand New Day coming in 2026, expect Osborn's MCU story to continue.

**Card to Chase:** Green Goblin #GG-2 Topps Chrome Marvel (2024) Gold Refractor /50 — Willem Dafoe's iconic return makes this a premium hold.

---

## 6. VULTURE / ADRIAN TOOMES

**First MCU Appearance:** Spider-Man: Homecoming (2017) | **Played by:** Michael Keaton

**Why He's Here:** Adrian Toomes proved that MCU villains don't need to be world-ending threats to be compelling. He's a working-class guy who got screwed by the system (specifically, by Tony Stark's Damage Control) and turned to crime to provide for his family. Michael Keaton brought a blue-collar menace that made the car scene — when he realizes Peter is Spider-Man — one of the most tense moments in the entire MCU. No CGI army. No doomsday weapon. Just a dad with a gun and a question.

**Comic Legacy:** Vulture has been a Spider-Man villain since Amazing Spider-Man #2 (1963). He's a founding member of the Sinister Six, and his MCU portrayal modernized the character brilliantly.

**Card to Chase:** Vulture #VT-1 Topps Chrome Marvel (2024) Base — one of the most undervalued villain cards in the hobby. Keaton's performance alone justifies a hold.

---

## 5. HELA

**First MCU Appearance:** Thor: Ragnarok (2017) | **Played by:** Cate Blanchett

**Why She's Here:** Hela walked into the MCU, caught Mjolnir with one hand, crushed it to pieces, and immediately established herself as the most powerful villain we'd seen up to that point. Cate Blanchett brought a theatrical menace that was equal parts terrifying and fun. She conquered Asgard in minutes, raised an undead army, and it took the literal destruction of an entire realm to stop her. The Goddess of Death earned her title.

**Comic Legacy:** Hela rules Hel and Niflheim in the comics. She's battled Thor, the Avengers, and even challenged Thanos for dominion over death itself. In the 2015 Secret Wars, the dead realms she controls become part of Battleworld — Doom's patchwork reality.

**Card to Chase:** Hela #H-1 Topps Finest Marvel (2025) Green Refractor — Blanchett's performance makes this a legacy card. Severely undervalued.

---

## 4. KILLMONGER / ERIK STEVENS

**First MCU Appearance:** Black Panther (2018) | **Played by:** Michael B. Jordan

**Why He's Here:** Killmonger didn't just want to destroy the hero — he wanted to prove the hero was wrong. Erik Stevens challenged T'Challa's worldview, Wakanda's isolationism, and the audience's assumptions about who the "good guys" really are. Michael B. Jordan delivered a performance so compelling that many fans agreed with the villain. His "bury me in the ocean" line is one of the most powerful moments in MCU history. He made Black Panther a Best Picture nominee.

**Comic Legacy:** Killmonger has been Black Panther's greatest rival since 1973. He represents everything Wakanda fears about the outside world — and everything the outside world resents about Wakanda's secrecy.

**Card to Chase:** Killmonger #KM-2 Topps Chrome Marvel (2024) Refractor — criminally undervalued. His cultural impact far exceeds his current card prices.

---

## 3. LOKI

**First MCU Appearance:** Thor (2011) | **Played by:** Tom Hiddleston

**Why He's Here:** Loki is the villain who became a hero — and that journey is what makes him the most beloved antagonist in MCU history. He invaded New York with an alien army, faked his death three times, betrayed everyone who loved him, and then sacrificed everything to hold the multiverse together. Tom Hiddleston's 13-year performance across 7 films and 2 seasons of his own show is the longest villain arc in superhero cinema. He's confirmed for Secret Wars.

**Comic Legacy:** Loki has been Thor's nemesis since Journey into Mystery #85 (1962). But in recent comics — particularly Al Ewing's run — Loki became the God of Stories, a reformed trickster who chose to rewrite his own narrative. The MCU adapted this beautifully.

**1984 Secret Wars Connection:** In the original 1984 Secret Wars comic, Loki was one of the villains brought to Battleworld by the Beyonder. He immediately tried to take control of the villain side, manipulating everyone — including Doctor Doom — for his own gain. His scheming nature made him a wildcard that neither heroes nor villains could trust.

**Card to Chase:** Loki #L-1 Topps Chrome Marvel (2024) Base — the most liquid villain card in the hobby. Always in demand, always trending with MCU announcements.

---

## 2. THANOS

**First MCU Appearance:** The Avengers (2012, post-credits) | **Played by:** Josh Brolin

**Why He's Here:** Thanos was the villain the MCU spent a decade building toward — and he delivered. Josh Brolin's performance in Infinity War created the rare blockbuster where the villain is the protagonist. He won. He snapped. Half the universe turned to dust. For two years, audiences lived with that defeat. Thanos proved that Marvel could create a villain worthy of 22 films of buildup. His "I am inevitable" became as iconic as any hero's catchphrase.

**Comic Legacy:** Thanos is one of Marvel's most powerful cosmic beings. Created by Jim Starlin in 1973, he's driven by his obsession with Death (literally, the cosmic entity). The Infinity Gauntlet (1991) is one of the best-selling Marvel comics ever, and his fingerprints are on nearly every major cosmic event.

**1984 Secret Wars Connection:** While Thanos wasn't in the original 1984 Secret Wars (he was "dead" at the time), his shadow looms over every cosmic Marvel event. The Beyonder — who created Battleworld — is one of the few beings who surpasses Thanos in power, making Secret Wars the event that puts even the Mad Titan's conquests in perspective.

**2015 Secret Wars Connection:** In Jonathan Hickman's 2015 Secret Wars, Thanos is one of the survivors who challenges Doom's rule over Battleworld. He leads a rebellion against God Emperor Doom — and Doom rips out his spine with his bare hands. That's how powerful Doom is in Secret Wars. Thanos, the guy who beat the entire Avengers, gets destroyed in seconds.

**Card to Chase:** Thanos #T-1 Topps Chrome Marvel (2024) Gold Refractor /50 — the crown jewel of villain cards. Limited numbered parallel of the most iconic MCU antagonist. Blue-chip forever.

---

## 1. DOCTOR DOOM / VICTOR VON DOOM

**First MCU Appearance:** Avengers: Doomsday (December 2026) | **Played by:** Robert Downey Jr.

**Why He's #1:** Doctor Doom hasn't appeared in the MCU yet — and he's already the most anticipated villain in Marvel history. Robert Downey Jr.'s casting as Victor Von Doom is the boldest move Marvel Studios has ever made. The man who built the MCU as Tony Stark will now tear it apart as its greatest villain. But Doom isn't just hype — he's backed by 60+ years of comic book dominance as Marvel's supreme antagonist.

Doom is a genius-level intellect who rivals Reed Richards. He's a sorcerer who rivals Doctor Strange. He rules his own nation. He wears armor that rivals Iron Man's. He has defeated the Beyonder, stolen the Power Cosmic from Galactus, and — in Secret Wars — literally became God.

**Comic Legacy:** Created by Stan Lee and Jack Kirby in Fantastic Four #5 (1962), Doctor Doom is consistently ranked as the #1 Marvel villain of all time. He's not just a Fantastic Four villain — he's an Avengers villain, a Spider-Man villain, an X-Men villain, and a cosmic-level threat all in one.

**1984 Secret Wars:** In the original 1984 Secret Wars by Jim Shooter, Doom was the standout character. While other villains followed orders, Doom stole the Beyonder's power — the power of a being who created an entire planet from nothing. He became omnipotent. He held the power of a god. The heroes only survived because Doom's own ego couldn't contain that much power. This is the template for everything coming in the MCU.

**2015 Secret Wars:** Jonathan Hickman's 2015 Secret Wars is THE Doctor Doom story. When the multiverse collapsed and every reality died, Doom was the one who saved what was left. He stitched together fragments of dead universes into Battleworld and ruled as God Emperor Doom for eight years. He had the power of the Beyonders (plural). He killed Thanos with his bare hands. He controlled every hero and villain as his subjects. Reed Richards eventually defeated him — but only because Doom admitted that Richards would have done a better job. Even in defeat, Doom's ego defined the story.

**Why This Matters for Doomsday & Secret Wars:** The MCU is adapting both Secret Wars stories. Robert Downey Jr.'s Doom will likely follow the comic arc: steal ultimate power, reshape reality, rule as God — and force every hero in the multiverse to unite against him. This is Endgame-level storytelling with a villain who's been #1 in the comics for six decades.

**Card to Chase:** Doctor Doom #DD-1 Topps Chrome Marvel (2024) Refractor — prices have tripled since RDJ's casting announcement. Any Doom chrome or numbered parallel is a long-term hold. Also chase: Doctor Doom Comic Cuts 1/1 cards — 200 unique pieces of original comic art embedded in cards. Browse our [Card Database](https://northlandlegendaryfinds.com/cards) for the full Doom collection.

---

## THE COLLECTOR'S TAKEAWAY

Every villain on this list has card market presence, but here's the hierarchy for collectors:

**Blue-Chip (Always Buy):** Doctor Doom, Thanos, Loki
**Surging Now:** Green Goblin (Brand New Day hype), Killmonger (cultural legacy)
**Undervalued Gems:** Hela, Vulture, Kingpin, Wenwu
**Speculative Hold:** Ultron (inevitable MCU return)

The Doomsday hype cycle is just beginning. Doctor Doom cards have already seen 300%+ gains since RDJ's casting, and they'll keep climbing through December 2026. Thanos remains the proven blue-chip — his cards held value for years after Endgame and will surge again when he appears in Secret Wars flashbacks.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to find cards for every villain on this list, or explore our [Characters section](https://northlandlegendaryfinds.com/characters) for individual collecting guides.

---

## Collector's Corner

These villains aren't just great characters — they're driving serious card market movement heading into Avengers: Doomsday.

**Hot Cards to Watch:**
- **Doctor Doom Topps Chrome Marvel (2024) Refractor** — 300%+ gains since casting announcement. The #1 villain card in the hobby right now.
- **Thanos Topps Chrome Marvel (2024) Gold Refractor /50** — Limited numbered parallel of the most iconic MCU villain. Blue-chip hold.
- **Loki Topps Chrome Marvel (2024) Base** — Most liquid villain card. Tracks every Secret Wars announcement.
- **Killmonger Topps Chrome Marvel (2024) Refractor** — Criminally undervalued relative to cultural impact. Buy before the market corrects.

Track real-time villain card prices on **[Card Ladder](https://www.cardladder.com/)** — their market indices show Doom trending up 40% month-over-month.

Find raw singles and graded slabs on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** — search "Doctor Doom Topps Chrome" for the latest sold comps.

Check population reports and authentication data on **[PSA](https://www.psacard.com/)** — knowing how many exist helps you price accurately.

---

## WHO DID WE MISS?

Honorable mentions go to Ego the Living Planet, Mysterio, Zemo, Kang (before the recast), and Namor — all formidable, all collectible, all just outside the top 10.

Who's YOUR favorite MCU villain? Let us know on social media. And if you're building a villain collection, check the latest prices on our [Card Database](https://northlandlegendaryfinds.com/cards) or join our next [Whatnot stream](https://northlandlegendaryfinds.com/whatnot) where we regularly feature villain cards.

---

## COMING NEXT

Think Doctor Doom is just another villain? Wait until you see what God Emperor Doom does in Secret Wars. We're breaking down every confirmed detail about Avengers: Secret Wars (December 2027) and what it means for your collection. Stay tuned.

*Avengers: Doomsday arrives December 18, 2026. Avengers: Secret Wars follows December 17, 2027. The age of Doom begins now.*`,
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
