/**
 * Publish "Tony Stark vs. Doctor Doom" comparison article — May 5, 2026
 * Run from project root: node publish-stark-vs-doom.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs
const IMAGES = {
  featured: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-stark-vs-doom-featured-bY3ZR9iMwUwZS6UcMrmeTE.webp",
  doomVsKang: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-doom-vs-kang-council-YcuQxGjSBpBtunoYLECRKR.webp",
  parallels: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-stark-doom-parallels-W2NsXEyeoYnoe4sxzNthVi.webp",
  godEmperor: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-god-emperor-doom-QcrTL2A9weanPjyT3iwFo5.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Same Face, Different Fate: Why Robert Downey Jr. Playing Both Tony Stark and Doctor Doom Is Marvel's Greatest Storytelling Gamble",
    slug: "tony-stark-vs-doctor-doom-rdj-marvel-duality",
    excerpt: "Robert Downey Jr. returns to the MCU not as the hero who saved the universe, but as the villain who will try to destroy it. Here's why the Tony Stark and Doctor Doom duality is Marvel's most brilliant — and most dangerous — creative decision.",
    featuredImageUrl: IMAGES.featured,
    category: "analysis",
    tags: JSON.stringify(["Doctor Doom", "Tony Stark", "Iron Man", "Robert Downey Jr", "Avengers Doomsday", "Secret Wars", "MCU", "Multiverse", "God Emperor Doom", "Kang"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Iron Man", "Kang the Conqueror", "Loki", "Thanos"]),
    cardMarketImpact: "Doctor Doom cards from 2025 Topps Marvel Mint and Topps Chrome Marvel Studios are seeing massive demand ahead of Avengers: Doomsday. Iron Man cards with RDJ likeness are also climbing as collectors recognize the meta-narrative value of owning both sides of the same face.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Robert Downey Jr. plays both Tony Stark and Doctor Doom in the MCU. Explore the parallels between Marvel's greatest hero and villain, from comic book history to Avengers: Doomsday.",
    sources: JSON.stringify([
      { title: "Kevin Feige on RDJ as Doctor Doom — IGN/Yahoo", url: "https://www.ign.com/articles/kevin-feige-robert-downey-jr-doctor-doom" },
      { title: "Tony Stark and Doctor Doom Parallels — Den of Geek", url: "https://www.denofgeek.com/movies/mcu-iron-man-doctor-doom-parallels/" },
      { title: "RDJ's Eyes Behind the Mask — ComicBook.com", url: "https://comicbook.com/marvel/news/robert-downey-jr-doctor-doom-eyes/" },
      { title: "Secret Wars (2015) — Marvel Comics", url: "https://www.marvel.com/comics/series/19379/secret_wars_2015_-_2016" },
    ]),
    contentMarkdown: `When Marvel Studios announced at San Diego Comic-Con that Robert Downey Jr. would return to the MCU — not as Tony Stark, but as Victor Von Doom — the internet broke in half. Some called it genius. Others called it a gimmick. But the deeper you look at the parallels between these two characters, the more you realize this might be the most thematically perfect casting decision in superhero movie history. The man who saved the universe in *Avengers: Endgame* is coming back as the man who will try to destroy it in *Avengers: Secret Wars*. Same face. Different fate.

## The Cosmic Irony: Builder vs. Breaker

Kevin Feige has been characteristically blunt about the decision. "He played the most iconic hero," Feige told reporters. "Let's have him play the most iconic villain." The idea was born roughly three and a half years before the SDCC reveal, with Feige himself pitching it directly to Downey. The question that drove the conversation: *How do we not go backwards? How do we not disappoint?*

The answer was elegant in its audacity. Rather than bringing Tony Stark back from the dead — which would cheapen the sacrifice of Endgame — Marvel chose to weaponize the audience's emotional connection to RDJ's face. Every time Doctor Doom appears on screen, viewers will see the man who snapped his fingers to save half the universe. That cognitive dissonance is the point. It transforms every scene into a psychological battlefield before a single punch is thrown.

<img src="${IMAGES.parallels}" alt="Split comparison of Tony Stark's workshop and Doctor Doom's Latverian laboratory" style="width:100%;max-width:800px;border-radius:12px;margin:24px 0;" />

## Two Geniuses, Two Armors, Two Philosophies

On paper, Tony Stark and Victor Von Doom are almost the same person. Both are genius-level intellects who build armored suits. Both lost their parents in traumatic circumstances that shaped their entire worldview. Both possess egos that fill every room they enter. Both believe — with absolute conviction — that they alone can save the world.

The difference is in the method. Tony Stark extends his hand as a shield. Victor Von Doom extends his hand as a fist.

| Tony Stark | Victor Von Doom |
|---|---|
| Genius inventor | Genius inventor + sorcerer |
| Armored suit (Iron Man) | Armored suit (Doom armor) |
| American billionaire | Latverian monarch |
| Lost parents tragically | Lost parents tragically |
| Ego drives him to protect | Ego drives him to dominate |
| Created Ultron (overreach) | Created Battleworld (ultimate overreach) |
| "I am Iron Man" | "I am God" |
| Sacrificed himself to save reality | Steals godhood to rewrite reality |

Den of Geek's analysis of the *What If? Iron Man: Demon in an Armor* comic is particularly revealing. In that story, Tony Stark and Victor Von Doom are college roommates who accidentally switch minds. Stark-in-Doom's-body goes to Latveria and becomes a benevolent ruler. Doom-in-Stark's-body becomes an authoritarian Iron Man. The comic proves that the difference between hero and tyrant isn't intelligence or resources — it's philosophy. And sometimes, the line between "protecting the world" and "controlling the world" is thinner than vibranium.

## "New Mask, Same Task"

At SDCC, the reveal came with a catchphrase that tells you everything: **"New mask, same task."** It's a line that works on multiple levels. On the surface, it acknowledges that RDJ is wearing a different mask. But underneath, it suggests something more unsettling — that Tony Stark's mission and Doctor Doom's mission might not be as different as we think.

Consider Tony's arc across the MCU. After the Battle of New York, he was haunted by visions of cosmic threats. That fear drove him to create Ultron — a "suit of armor around the world" that nearly destroyed it instead. After the Sokovia disaster, Tony championed the Accords, willing to sacrifice personal freedom for collective safety. His entire journey was defined by the tension between protection and control.

Victor Von Doom takes that same impulse to its logical extreme. Where Tony built a suit, Doom builds a kingdom. Where Tony wanted oversight, Doom wants absolute authority. Where Tony sacrificed himself to save reality, Doom will steal the power of gods to *rewrite* reality according to his own design. As one analyst put it: "Victor is a man defined by an extended hand that eventually turns into a fist."

## Why Doom Replaced Kang — And Why It Matters

<img src="${IMAGES.doomVsKang}" alt="Doctor Doom destroying the Council of Kangs with green mystical energy" style="width:100%;max-width:800px;border-radius:12px;margin:24px 0;" />

The MCU's pivot from Kang the Conqueror to Doctor Doom wasn't just a casting necessity — it was a narrative upgrade. Kang manipulates timelines. He's a bureaucrat of the temporal, managing variants and pruning branches. Doom operates on an entirely different level. He doesn't rule a timeline. He rules *all of reality*.

Fan-made concept videos have already imagined what this transition looks like: Doom walking into the Council of Kangs, an army of variants charging at him, and Doom standing motionless as green mystical energy disintegrates every single one of them. When asked what he's done, Doom's answer is chilling in its simplicity: **"I removed the noise."**

That single line captures why Doom is the superior villain. Kang was a threat because of quantity — infinite variants, infinite schemes. Doom is a threat because of *quality*. One Doom is worth a thousand Kangs. He doesn't need variants. He doesn't need an army. He needs only himself, his intellect, his sorcery, and his absolute certainty that he is right.

## God Emperor Doom: The Endgame of Endgames

<img src="${IMAGES.godEmperor}" alt="God Emperor Doom on his cosmic throne above Battleworld" style="width:100%;max-width:800px;border-radius:12px;margin:24px 0;" />

In Jonathan Hickman's 2015 *Secret Wars* comic — widely considered the source material for the MCU's upcoming films — Doom achieves something no other Marvel villain has accomplished. He steals the power of the Beyonders, the omnipotent beings who exist beyond the multiverse itself, and uses that power to stitch the shattered remains of every dead universe into a single patchwork planet called **Battleworld**.

On Battleworld, Doom is God. Not metaphorically. Literally. He rewrites history so that no one remembers a time before his rule. He controls life, death, and the laws of physics. Heroes who challenge him aren't just defeated — they're *unmade*. The only person who eventually topples God Emperor Doom is Reed Richards, and even then, it requires Doom admitting that Richards would have done a better job. That admission — from the most egotistical man in Marvel Comics — is what finally breaks the spell.

If the MCU follows this template, *Avengers: Doomsday* will show Doom's rise to power, and *Avengers: Secret Wars* will show the heroes fighting to survive in a world where the villain has already won. It's the inverse of Endgame. In that film, the heroes lost first (Infinity War) and then fought back. In Secret Wars, the villain wins first — completely, utterly, cosmically — and the heroes must find a way to exist in his world long enough to challenge him.

## The Eyes Behind the Mask

There's a practical genius to this casting that goes beyond thematic resonance. Doctor Doom wears a mask. For the entire film, only RDJ's eyes will be visible. And as ComicBook.com noted, those eyes are precisely what made Tony Stark so compelling across eleven years of MCU films.

Think about the moments that defined Iron Man: the sadness in Tony's eyes when watching footage of his father Howard. The regret when he realized Ultron was his fault. The cold fury when he learned Bucky killed his parents. The quiet acceptance when he reached for the Infinity Stones one last time. All of those moments lived in RDJ's eyes — and now Marvel is betting that those same eyes, framed by Doom's metallic mask, can convey an entirely different character's pain, ambition, and madness.

It's a performance challenge unlike anything attempted in the superhero genre. And if anyone can pull it off, it's the actor who turned a B-list comic book character into the foundation of a $30 billion franchise.

## What This Means for Collectors

The Stark-Doom duality has created a unique situation in the trading card market. Doctor Doom cards from **2025 Topps Marvel Mint** — particularly the Gold Parallel and Gambit's Deck inserts — are commanding premium prices as collectors anticipate the character's MCU dominance. Meanwhile, Iron Man cards featuring RDJ's likeness have gained a new layer of collectibility: they now represent one half of a historic dual performance.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to find Doctor Doom and Iron Man cards across every Topps set, or explore their pages in our [Characters section](https://northlandlegendaryfinds.com/characters). For live breaks featuring these cards, check our [Whatnot streams](https://northlandlegendaryfinds.com/whatnot).

## Collector's Corner

With *Avengers: Doomsday* arriving in 2026, the window to collect key Doom and Iron Man cards at current prices is closing fast. The RDJ factor adds unprecedented crossover appeal between hero and villain cards.

**Hot Cards to Watch:**
- **Doctor Doom #77 2025 Topps Marvel Mint Gold Parallel** — The flagship Doom card in the newest premium set, demand surging ahead of Doomsday
- **Iron Man #1 2025 Topps Marvel Studios Chrome** — RDJ's definitive MCU card, now carries dual significance as both hero and villain actor
- **Doctor Doom Gambit's Deck Insert 2025 Topps Marvel Mint** — Limited insert with stunning card art, connecting Doom to the premium chase tier
- **Iron Man R-5 Reflections Insert 2025 Topps Marvel Mint** — Features Iron Man alongside Doom imagery, perfect thematic pairing for this era

Track real-time price movements on **[Card Ladder](https://www.cardladder.com/)** — their market indices show Doom cards trending upward since the SDCC announcement.

Compare graded population reports on **[PSA](https://www.psacard.com/)** to find undervalued parallels before the Doomsday trailer drops.

Browse sold listings on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** for the latest transaction prices on key Doom and Iron Man pulls.

*Avengers: Doomsday arrives in theaters in 2026. Same face. Different fate. The cards you collect today will tell both sides of the story.*`,
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
