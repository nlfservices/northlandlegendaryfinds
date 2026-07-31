/**
 * Publish "Know Your Villain: Doctor Doom" — July 2026
 * First in the "Know Your Villain" recurring series
 * Template: comic_strip (position 9 in rotation)
 * Run from project root: node publish-know-your-villain-doom.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const article = {
  title: "Know Your Villain: Doctor Doom — Origin, Rivalries, and the Road to Secret Wars",
  slug: 'know-your-villain-doctor-doom-origin-rivalries-secret-wars',
  excerpt: "He's conquered gods, outsmarted the Fantastic Four, and now RDJ is wearing his mask. Before Avengers: Doomsday drops, here's everything you need to know about Marvel's greatest villain — from a Latverian orphan to God Emperor of Battleworld.",
  featuredImageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/know-your-villain-doom-portrait-o5F6qgEfG7HevsiAWjedrW.webp',
  category: 'comics_spotlight',
  templateLayout: 'comic_strip',
  tags: JSON.stringify(['Doctor Doom', 'Know Your Villain', 'Secret Wars', 'Avengers Doomsday', 'MCU', 'Fantastic Four', 'Mephisto', 'Namor', 'God Emperor Doom', 'RDJ', 'Marvel Villains', 'Latveria']),
  cardMarketImpact: "Doctor Doom cards across every Topps set are heating up fast ahead of Avengers: Doomsday. First appearance homages, Secret Wars variants, and any numbered Doom parallel are climbing. The 2026 Topps Marvel Mint Doom cards with low print runs could be this generation's chase pieces.",
  relatedCharacters: JSON.stringify(['Doctor Doom', 'Reed Richards', 'Namor', 'Black Panther', 'Mephisto', 'Iron Man', 'Valeria Richards', 'Fantastic Four', 'Avengers']),
  sources: JSON.stringify([
    { title: 'Doctor Doom Complete Marvel History', url: 'https://youtu.be/Y1mP5ZNRXQI' },
    { title: 'Marvel Comics - Fantastic Four #5 (1962)', url: 'https://www.marvel.com/comics/issue/12894/fantastic_four_1961_5' },
    { title: 'Secret Wars (2015) by Jonathan Hickman', url: 'https://www.marvel.com/comics/series/19379/secret_wars_2015_-_2016' }
  ]),
  isFeatured: true,
  isPublished: true,
  authorName: 'NLF Team',
  publishedAt: Date.now(),
  metaDescription: "The ultimate Doctor Doom deep dive: origin story, key rivalries with Namor, Black Panther, and Mephisto, the God Emperor Doom saga, and why RDJ's MCU Doom could change everything for collectors.",
  contentMarkdown: `<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/know-your-villain-doom-portrait-o5F6qgEfG7HevsiAWjedrW.webp" alt="Know Your Villain: Doctor Doom" />

## Welcome to Know Your Villain

This is the first installment of our **Know Your Villain** series — where we break down Marvel's most iconic bad guys so you're fully prepared when they hit the big screen. And who better to start with than the man behind the iron mask himself?

With *Avengers: Doomsday* arriving December 18th and Robert Downey Jr. trading the red and gold for a green cloak and metal face, Doctor Doom is about to become the most talked-about character in the MCU. But here's the thing — most casual fans have no idea just how deep this character goes.

So let's fix that. Buckle up. This one's a ride.

---

## The Origin: A Boy, A Demon, and a Mother's Soul

Victor Von Doom wasn't born evil. He was born desperate.

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-origin-latveria-comic-59XBX3p4WyThCGPCN4gh5N.webp" alt="Young Victor Von Doom watches as Mephisto claims his mother's soul" />

In the fictional Eastern European nation of **Latveria**, young Victor grew up among the Romani people. His father Werner was a healer. His mother Cynthia was a sorceress. And one night, the demon **Mephisto** came to collect her soul.

Werner fled with Victor into the frozen mountains, but died from exposure trying to protect his son. Victor survived — barely — and inherited two things: his mother's mystical artifacts and an all-consuming rage.

From that moment, Victor Von Doom had one mission: **master both science and sorcery** to become powerful enough to free his mother's soul from Hell itself.

He earned a scholarship to Empire State University in New York, where he met a certain Reed Richards. Victor built a machine to contact the netherworld — to reach his mother. Reed noticed a flaw in the calculations and tried to warn him. Victor, too proud to listen, activated the device.

It exploded. It scarred his face. And in Victor's mind, it was all Reed Richards' fault.

He traveled to Tibet, where monks forged him the iconic armor and mask. The moment that white-hot metal touched his scarred face — before it had even cooled — Victor Von Doom was born.

---

## The Rivalries: Everyone Has a Reason to Fear Doom

What makes Doom fascinating isn't just his power — it's his *relationships*. This isn't a one-note villain. He's got beef with basically everyone in the Marvel Universe, and every single rivalry tells you something different about who he is.

### Doom vs. Namor: Two Kings, One Uneasy Alliance

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-vs-namor-rivalry-comic-hfd9C7so4SXUXeuL5fzdKM.webp" alt="Doctor Doom faces Namor the Sub-Mariner in an underwater confrontation" />

The Doom-Namor dynamic is one of the most complex in all of Marvel. They're both kings. They're both arrogant. They both believe they're the smartest person in any room. And they've been allies, enemies, and everything in between — sometimes in the same issue.

Their alliance is always transactional. Namor respects Doom's intellect. Doom respects Namor's power. But neither trusts the other for a second. They've teamed up against the Fantastic Four, betrayed each other mid-battle, and somehow always end up back at the negotiating table.

It's like watching two chess grandmasters who'd rather flip the board than lose.

### Doom vs. Black Panther: The Doomwar

When Doom decided he needed vibranium — the rarest metal on Earth — he didn't ask nicely. He invaded Wakanda.

The *Doomwar* storyline is one of the best Doom stories ever written. T'Challa had to literally destroy Wakanda's entire vibranium supply to keep it out of Doom's hands. Think about that. The king of the most advanced nation on Earth looked at Doctor Doom and said: "I'd rather burn it all than let you have it."

That's how dangerous Doom is. He doesn't just want to win. He wants to win so completely that his enemies have to destroy themselves to stop him.

### Doom vs. Mephisto: The Annual Battle for Mom's Soul

Every single year, Doctor Doom descends into Hell to fight Mephisto for his mother's soul. Every. Single. Year.

The greatest version of this story is *Doctor Strange & Doctor Doom: Triumph and Torment* — where Doom actually wins. With Strange's help, he frees Cynthia's soul. But the cost? She has to reject him. She has to see what her son has become and choose to leave rather than stay with a monster.

It's the most heartbreaking moment in Doom's history. He saved her — and lost her in the same breath.

### Doom vs. The Fantastic Four: It's Personal

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-science-sorcery-comic-cPTnM4PRLFyKeynds9CKbm.webp" alt="Doctor Doom in his laboratory wielding both science and sorcery" />

This is the original rivalry. Doom vs. Reed Richards is Marvel's greatest intellectual grudge match. Two of the smartest humans alive, and one of them can't accept that the other might be smarter.

But here's what people miss: Doom doesn't just hate Reed. He's *obsessed* with proving Reed wrong. Every scheme, every world-conquering plot — deep down, it's all about showing Reed Richards that Victor Von Doom was right all along.

And the scariest part? Sometimes he IS right. Doom has literally seen the future. He's calculated every possible timeline. And in most of them, the only way humanity survives is under his rule. He's not lying when he says he's trying to save the world. He just believes he's the only one qualified to do it.

### Doom vs. Iron Man: The Tech Rivalry

Before RDJ made this literal, Doom and Tony Stark were already mirror images. Both are genius-level engineers. Both wear powered armor. Both have egos the size of planets.

But where Tony uses his tech to protect, Doom uses his to *control*. Their battles are legendary — they've fought across time (literally traveling to Camelot together), across dimensions, and across ideologies. Tony represents the idea that technology should free people. Doom represents the idea that technology should perfect them — whether they like it or not.

Now that RDJ is playing Doom in the MCU? This rivalry just became *very* meta.

---

## God Emperor Doom: When He Actually Won

Here's where it gets cosmic.

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-god-emperor-secret-wars-comic-AMhV588fbworsXcwpBfdQ4.webp" alt="God Emperor Doom holds the multiverse in his hands after stealing the Beyonders' power" />

In Jonathan Hickman's 2015 *Secret Wars*, the multiverse was dying. Every universe was colliding and being destroyed. The Beyonders — omnipotent beings who created reality itself — were behind it all.

And Doctor Doom? He killed them. He stole their power. And he used it to rebuild reality in his own image.

He became **God Emperor Doom** — the supreme ruler of Battleworld, a patchwork planet made from the fragments of dead universes. He rewrote history so that everyone believed he had always been God. He took Reed Richards' wife Sue as his own. He raised Reed's children as his own.

For all intents and purposes, **Doom won**. He beat everyone. He became everything he ever wanted to be.

And then Reed Richards showed up and asked him one question: *"Do you think you could have done better?"*

And Doom — God Emperor Doom, ruler of all reality — admitted: *"Yes. Richards could have done it better."*

That single moment of honesty cost him everything. Because even with the power of God, Victor Von Doom couldn't escape the truth: his ego is both his greatest strength and his fatal flaw.

This is almost certainly the storyline *Avengers: Doomsday* and *Secret Wars* are building toward. If you haven't read Hickman's run, now is the time.

---

## Valeria Richards: The Child He'd Die For

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-valeria-protector-comic-RtV2BWvSwgnf4SPnXgcbiN.webp" alt="Doctor Doom watches protectively over young Valeria Richards in his castle library" />

Here's the detail that separates Doom from every other Marvel villain: **he delivered Reed Richards' daughter.**

When Sue Storm had a complicated pregnancy, Reed couldn't save her. Doom could. He used his mastery of both science and sorcery to deliver the baby safely — and in return, the child was named **Valeria**.

From that day forward, Doom considered Valeria under his protection. He's her godfather in all but name. He teaches her. He protects her. He genuinely *cares* about her in a way he cares about almost no one else.

It's this relationship that makes Doom so compelling. He's not a mindless destroyer. He's a man who believes love and conquest can coexist — that you can rule the world with an iron fist and still read bedtime stories.

---

## Why RDJ as Doom Changes Everything

Let's talk about the elephant in the room. Robert Downey Jr. — the man who *was* Tony Stark for over a decade — is now playing Doctor Doom in the MCU.

This isn't just stunt casting. This is Marvel telling us something: **the line between hero and villain is thinner than you think.**

RDJ described Doom as someone whose trauma turned him into "the exact opposite" of Tony Stark. Same intelligence. Same ego. Same drive. But where Tony's pain made him want to protect the world, Doom's pain made him want to *own* it.

Oh yeah — RDJ is evil now. Haha. Try explaining THAT to your kids.

My 8-year-old Landon still can't process it. "But Dad... he's IRON MAN." Sorry buddy. Welcome to the multiverse.

---

## What This Means for Collectors

If you're reading this and you collect Marvel cards, listen up. Doctor Doom is about to have his biggest moment in pop culture history. The character is going from "comic book fans know him" to "everyone on Earth knows him."

That means Doom cards are moving. Fast.

## Collector's Corner

With *Avengers: Doomsday* making Doom a household name, his cards are entering a new era of demand. The smart money is getting in now — before the casual collectors flood the market after the trailer drops.

**Hot Cards to Watch:**
- **Doctor Doom 2026 Topps Marvel Mint Base (Gold /25)** — Low print run Doom in the newest set. These won't stay quiet.
- **Doctor Doom Topps Chrome Marvel Refractor** — The flagship chrome Doom. Refractors are always the move.
- **God Emperor Doom Secret Wars Variants** — Any card depicting the Battleworld arc. Storyline relevance is everything.
- **Doctor Doom Topps Comic Book Heroes Insert** — Classic comic art Doom. Affordable entry point that could pop.

Track real-time Doom card values on **[Card Ladder](https://www.cardladder.com/)** — their price indices show exactly when a character starts trending.

Looking for specific Doom singles? **[COMC](https://www.comc.com/)** has one of the deepest inventories for Marvel card singles at every price point.

And for graded Doom slabs, check population reports on **[PSA](https://www.psacard.com/)** to find which parallels have the lowest pop counts.

Browse our full [Doctor Doom card database](https://northlandlegendaryfinds.com/cards) to see every Doom card across all Topps sets, or explore the [character page](https://northlandlegendaryfinds.com/characters) for more on Marvel's greatest villain.

---

*Avengers: Doomsday hits theaters December 18, 2026. Know your villain before you see him on screen.*`
};

const columns = Object.keys(article);
const placeholders = columns.map(() => '?').join(', ');
const values = columns.map(col => article[col]);

await conn.execute(
  `INSERT INTO articles (${columns.join(', ')}) VALUES (${placeholders})`,
  values
);

console.log(`✅ Published: "${article.title}"`);
console.log(`   Slug: ${article.slug}`);
console.log(`   URL: https://northlandlegendaryfinds.com/mcu-news/${article.slug}`);

const [latest] = await conn.execute('SELECT title FROM articles WHERE isPublished = true ORDER BY publishedAt DESC LIMIT 5');
console.log('📰 Latest Articles:');
latest.forEach((a, i) => console.log(`   ${i+1}. ${a.title}`));

await conn.end();
console.log('✅ Done!');
