import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';
import { desc } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  
  // Check recent templates for rotation
  const recent = await db.select({ 
    title: articles.title, 
    template: articles.templateLayout 
  }).from(articles).orderBy(desc(articles.publishedAt)).limit(5);
  
  console.log("Recent templates:", recent.map(r => r.template));
  
  // Template rotation: classic -> magazine -> spotlight -> timeline -> listicle -> patriotic -> cinematic -> dossier
  // Based on recent: need to determine next in rotation
  const templates = ['classic', 'magazine', 'spotlight', 'timeline', 'listicle', 'patriotic', 'cinematic', 'dossier'];
  const lastTemplate = recent[0]?.template || 'listicle';
  const lastIdx = templates.indexOf(lastTemplate);
  const nextTemplate = templates[(lastIdx + 1) % templates.length];
  console.log("Next template:", nextTemplate);

  const slug = 'sxsw-london-tease-topps-chrome-doom-sdcc-trailer-june-2026';
  const imageUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sxsw-sdcc-doom-chrome-KdiS4Rbtk3NTEAriaMRJWt.webp';

  const contentMarkdown = `## The Russo Brothers Just Lit the Fuse in London

The wait is almost over — but not quite yet.

On June 2, 2026, the Russo Brothers pulled off one of the most calculated marketing moves in MCU history. After weeks of cryptic green-tinted Instagram posts, decoded hex values, and fan theories running wild, they revealed the **Latveria flag symbol** at a surprise event near SXSW London — complete with an exact address (4B Holywell Ln, London EC2A 3ET) and a "surprise at 2pm BST" that had the entire Marvel fandom holding its breath.

What did fans get? Not the full trailer — but something arguably more powerful: **confirmation that Doctor Doom's Latveria is real, it's coming, and the Russos are in full control of the narrative.**

---

## What Actually Happened at SXSW London

The Russo Brothers' SXSW London appearance wasn't a standard panel. It was a **guerrilla marketing event** designed to generate maximum buzz with minimum reveal. Here's what we know:

The brothers posted a series of Instagram images over the preceding days — each one a green-tinted tease featuring different Avengers characters (Captain America, Thor, X-Men, Shuri with Sub-Mariner and The Thing). The final post gave an exact London address and time.

At the event, attendees were shown the **official Latveria flag and national symbol** — the first piece of in-universe world-building for Avengers: Doomsday to be publicly revealed. The symbol features a distinctive cross-like design that fans are already dissecting for hidden meaning.

RDJ was reportedly nearby — he's been filming at Pinewood Studios — though his physical appearance at the event remains unconfirmed.

---

## Why This ISN'T the Trailer (And Why SDCC Is)

Let's be real: Marvel doesn't drop their biggest trailer at a coffee shop in Shoreditch. Here's the timeline that makes sense:

**SXSW London (June 2)** — Tease, world-building, generate conversation. Mission accomplished.

**San Diego Comic-Con (July 24-27)** — This is where the full Avengers: Doomsday trailer drops. It's the Marvel playbook. They did it with Infinity War. They did it with Endgame. Hall H is where trailers are born.

The Russos themselves have called Doomsday a "complete reinvention" of the MCU. Joe Russo told audiences that this film will "surprise even the most dedicated fans." That's not the kind of promise you deliver at a pop-up event — that's Hall H energy.

**The math:** Doomsday releases January 2027. A July 2026 SDCC trailer gives them exactly 6 months of marketing runway. That's the sweet spot.

---

## 2026 Topps Chrome Marvel: "One World Under Doom"

And here's where it gets interesting for collectors.

Topps just revealed their **2026 Chrome Marvel Comics** product — and buried in the insert set lineup is a collection called **"One World Under Doom."** That's not subtle. That's the current Marvel Comics storyline where Doctor Doom literally conquers the entire planet.

This is the same storyline that Avengers: Doomsday is partially adapted from.

### What's in the box:

| Feature | Details |
|---------|---------|
| Base Set | 200 cards — heroes, villains, fan-favorites |
| Key Insert | **One World Under Doom** — Doom-themed storyline cards |
| Returning Insert | **Reflections** — the same set that produced the $7,358 Iron Man & Doom SSP |
| Art Inserts | Fanfare, Varied Visage: Age of Apocalypse, Topps Originals |
| Autographs | Stanley "Artgerm" Lau, Adi Granov sketch cards, Kevin Eastman |
| Chase Cards | **1/1 Stan Lee & Steve Ditko cut signatures** |
| Celebrity | Cordially Invited — Aaron Judge, Steve Aoki, Seth Meyers |

The timing here is not coincidental. Topps is releasing a Doom-heavy Chrome product right as Marvel Studios ramps up Doomsday marketing. When that SDCC trailer drops in July and casual fans start searching for Doctor Doom cards, this product will be the freshest supply on the market.

---

## What This Means for the Card Market

Let's connect the dots:

1. **SXSW London** confirms Doom/Latveria is central to the film
2. **SDCC in July** will likely deliver the full trailer
3. **Topps Chrome Marvel** drops with "One World Under Doom" insert set
4. **Existing Doom card supply** is already shrinking (over $100K sold on eBay last week alone)

The window between NOW and SDCC is the calm before the storm. Once that trailer hits and 200 million people see RDJ as Doctor Doom for the first time, every Doom card on the market gets repriced overnight.

And here's the kicker: even the NEW Topps Chrome Doom cards will have limited print runs. Chrome refractors, numbered parallels, 1/1 sketch cards — these aren't unlimited. The "One World Under Doom" inserts will be the first cards specifically tied to the Doomsday movie era, making them historically significant for the hobby.

---

## The Collector's Playbook: Now Through SDCC

**Right now (June):** Accumulation phase. Prices are elevated but not parabolic. Existing Doom cards from Marvel Mint, Chrome Studios, and earlier Chrome sets are still findable.

**July (SDCC):** Explosion. The trailer drops, mainstream media covers it for weeks, and casual buyers flood the market. If you're not positioned before this, you're paying a premium.

**Fall 2026:** Sustained demand. Marketing ramps up, more trailers, TV spots, merchandise. Card prices plateau at new highs.

**January 2027 (Movie Release):** Peak demand. Then either continued growth into Secret Wars (December 2027) or a sell-the-news dip for flippers.

The Russo Brothers aren't just marketing a movie — they're creating a cultural event. And the card market is the canary in the coal mine. It's already singing.

---

## Stay Tuned

We're tracking this weekly. As SDCC approaches, we'll be breaking down:
- Which specific Doom cards have the most upside
- New Topps Chrome Marvel product details as they emerge  
- Any additional reveals from the Russo Brothers' marketing campaign
- Real-time market data from eBay, Whatnot, and private sales

The next 60 days are going to be wild. Follow along.

---

*Related: [Over $100K in Doctor Doom Cards Sold This Week](/mcu-news/avengers-doomsday-weekly-russo-brothers-sxsw-doom-card-market-may-2026) | [Who's Your Pick for 2026?](/mcu-news/whos-your-pick-2026-marvel-cards-to-watch-before-avengers-doomsday)*`;

  const result = await db.insert(articles).values({
    title: "SXSW London Tease, Topps Chrome 'One World Under Doom,' and Why SDCC Will Break the Internet",
    slug,
    excerpt: "The Russo Brothers revealed the Latveria flag at SXSW London, Topps announces a Doom-themed Chrome insert set, and all signs point to SDCC for the full trailer. Here's what collectors need to know.",
    contentMarkdown,
    featuredImage: imageUrl,
    category: 'movie_news',
    tags: ['Avengers Doomsday', 'Doctor Doom', 'SXSW London', 'SDCC', 'Topps Chrome Marvel', 'Russo Brothers', 'Latveria', 'Trading Cards', 'Card Market'],
    relatedCharacters: ['Doctor Doom', 'Iron Man', 'Captain America', 'Thor'],
    author: 'NLF Staff',
    status: 'published',
    templateLayout: nextTemplate,
    readTime: 8,
    sources: [
      { name: 'Screen Rant', url: 'https://screenrant.com/avengers-doomsday-russo-brothers-doctor-doom-latveria-flag/' },
      { name: 'ComicBook.com', url: 'https://comicbook.com/movies/news/avengers-doomsday-trailer-hype-heats-up-after-russos-tease/' },
      { name: 'Topps', url: 'https://www.topps.com/pages/topps-chrome-marvel' },
      { name: 'Comic Basics', url: 'https://www.comicbasics.com/first-look-avengers-doomsday-promo-art-reveals-doom-and-the-heroes/' }
    ],
    publishedAt: BigInt(Date.now()),
  });

  console.log("Article published successfully!");
  console.log("Slug:", slug);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
