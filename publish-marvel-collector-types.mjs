// Publish script: Marvel Collector Types article
// "Comic Art vs. Actor Portrayal: What Kind of Marvel Card Collector Are You?"
// Template rotation: last was "classic" → next is "magazine"

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Image CDN URLs (uploaded from Google Drive card photos)
const HERO_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/itSqYEpoCnJtDTal.jpg"; // CBH Killraven Rose Gold Refractor
const IMG_CBH_HAWKEYE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/bYeIMRxoLiODpjnh.jpg"; // CBH Hawkeye 2000s comic
const IMG_MINT_NICK_FURY = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/gsIbTNyHLSqkVAZS.jpg"; // Mint Gold Nick Fury
const IMG_COLLECTOR_CAP = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/PbvJJSUmlpGXQMIr.jpg"; // Collector MCU Perfection Cap America
const IMG_STUDIOS_RAMONDA = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/LVaewFZzsWjlBcrV.jpg"; // Studios Green Refractor Queen Ramonda

const contentMarkdown = `
Marvel has been making trading cards since the 1970s, and in that time two very distinct collector philosophies have emerged. On one side you have the purists — collectors who want their cards to look exactly like the comic panels they grew up reading. On the other, you have the MCU faithful — collectors who want to hold a piece of the films they love, with the actual actors staring back at them from the cardboard. Neither camp is wrong. Both are chasing the same feeling: that rush of cracking a pack and pulling something that genuinely matters to you.

The good news is that Topps has spent years building sets that serve both tribes — and a few that try to bridge the gap entirely.

---

## The Comic-Art Collector: Topps Marvel Comic Book Heroes

If your Marvel collection started with a stack of actual comics, there is a strong chance that **Topps Marvel Comic Book Heroes** is your set. Launched in 2025 to celebrate 50 years of Marvel comics, the product leans hard into the original source material. Characters are rendered in the art styles of their era — the 1970s cards look like 1970s comics, the 2000s cards look like 2000s comics, and so on.

<div style="text-align:center;margin:2rem 0;">
  <img src="${IMG_CBH_HAWKEYE}" alt="Topps Marvel Comic Book Heroes — Hawkeye 'The 2000s' Rose Gold Refractor CGC 9" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Hawkeye #70 — Comic Book Heroes "The 2000s" Rose Gold Refractor, CGC 9 — from the NLF collection</p>
</div>

What makes this set special is that it does not try to be anything other than what it is. There are no actor photos, no movie stills, no MCU branding. It is pure comic book DNA. The parallels — including the Rose Gold Refractors numbered to just 2 — are some of the most visually striking cards Topps has produced in the Marvel space. The die-cut silhouette design on the base cards gives each character a unique shape, which makes the refractor parallels shimmer in a way that feels genuinely different from a standard chrome card.

For the comic-art collector, this is the definitive modern set. The character selection runs deep — you are not just getting the Avengers A-listers. Killraven, Hawkeye in his classic suit, deep-cut villains — this is a set built by people who actually read the books.

---

## The Actor-Portrayal Collector: Topps Marvel Studios and Topps Marvel Collector

If your entry point into Marvel was the movies, then the cards you want are the ones that look like the movies. Two sets own this space more than any other.

**2025 Topps Marvel Studios** is the flagship actor-portrayal product. Every card is built around film photography and on-screen likenesses. The base design uses a chrome-style treatment with a cosmic blue background, and the character name appears at the bottom in clean, modern typography. The refractor parallels — Green /199, Orange /25, Black /10 — are numbered and carry real secondary market value, especially for characters who have not had many card appearances before.

<div style="text-align:center;margin:2rem 0;">
  <img src="${IMG_STUDIOS_RAMONDA}" alt="2025 Topps Marvel Studios — Queen Ramonda Green Refractor 147/199" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Queen Ramonda — 2025 Topps Marvel Studios Green Refractor 147/199 — from the NLF collection</p>
</div>

The bigger draw for actor-portrayal collectors, though, is **Topps Marvel Collector**. This is where you find actual autographs from the cast — Hugh Jackman as Wolverine, Anthony Mackie as Captain America, and dozens of others who have signed directly for Topps. The MCU Perfection insert set, numbered to /100, features on-screen photography in an ornate frame design that looks genuinely premium in hand. These are the cards that feel like owning a piece of the film itself.

<div style="text-align:center;margin:2rem 0;">
  <img src="${IMG_COLLECTOR_CAP}" alt="Topps Marvel Collector — Captain America MCU Perfection /100" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Captain America (Sam Wilson) — Topps Marvel Collector MCU Perfection /100 — from the NLF collection</p>
</div>

The autograph chase in Collector is what separates it from everything else in the Marvel card space. When you pull a Hugh Jackman Wolverine auto, you are not just holding a card — you are holding something that exists at the intersection of 50 years of comic history and one of the most beloved casting choices in movie history. That is a very specific kind of magic, and actor-portrayal collectors understand it completely.

---

## The Best of Both Worlds: 2025 Topps Marvel Mint

For collectors who refuse to choose, **2025 Topps Marvel Mint** is the answer. Released in 2025, this set takes a hybrid approach that no other Marvel product has quite managed to pull off. The majority of the base set leans comic-accurate — characters rendered in a clean, illustrated style with a coin-inspired circular frame that gives the whole product a premium, collectible feel. But scattered throughout the set are cards that draw from MCU photography, giving actor-portrayal collectors something to chase without abandoning the comic-first identity of the product.

<div style="text-align:center;margin:2rem 0;">
  <img src="${IMG_MINT_NICK_FURY}" alt="2025 Topps Marvel Mint — Nick Fury Gold Gold Refractor 30/50, AGS 9" style="max-width:480px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />
  <p style="font-size:0.85rem;color:#888;margin-top:0.5rem;">Nick Fury #76 — 2025 Topps Marvel Mint Gold Refractor 30/50, AGS Mint 9 — from the NLF collection</p>
</div>

The Gold Refractor parallels, numbered to /50, are where Mint really shines. The gold foil treatment on the coin-frame design catches light in a way that makes the cards feel almost like actual minted coins. Nick Fury in the Gold tier is a perfect example — the illustrated style gives him a timeless quality that neither a straight comic card nor a straight movie card could achieve on its own.

Mint is the set that proves the debate between comic-art and actor-portrayal does not have to be a debate at all. You can appreciate both aesthetics. You can collect both. The hobby is big enough for everyone.

---

## Which Collector Are You?

There is no right answer here, and that is the point. The comic-art collector and the actor-portrayal collector are both chasing authenticity — they just define it differently. One wants the character as the artist imagined them. The other wants the character as the actor brought them to life.

What makes the current Marvel card market so interesting is that Topps has gotten genuinely good at serving both. Whether you are building a CGC-graded run of Comic Book Heroes refractors, hunting for a Hugh Jackman auto from Collector, or chasing Gold Mint parallels that split the difference, there has never been a better time to be a Marvel card collector.

You can explore the full Marvel card database at [northlandlegendaryfinds.com/cards](https://northlandlegendaryfinds.com/cards) and browse character-specific card histories on our [Characters page](https://northlandlegendaryfinds.com/characters).

---

## Collector's Corner

The sets featured in this article represent some of the strongest value propositions in the current Marvel card market. Comic Book Heroes refractors — especially the Rose Gold /2 — are trading at significant premiums because the print runs are genuinely low and the visual impact is hard to match. On the actor-portrayal side, any numbered Topps Marvel Studios parallel of a character making their MCU debut is worth tracking closely as Phase 6 approaches.

**Hot Cards to Watch:**

- **Killraven Comic Book Heroes Rose Gold Refractor /2** — One of the rarest parallels in the entire CBH set; a true low-pop graded specimen
- **Hugh Jackman Wolverine Topps Marvel Collector Auto** — The definitive actor-portrayal card for the most anticipated MCU debut of the decade
- **Nick Fury 2025 Topps Marvel Mint Gold Refractor /50** — Strong hybrid appeal; comic-accurate art with premium parallel treatment
- **Captain America (Sam Wilson) MCU Perfection /100** — Anthony Mackie's first numbered card as the new Cap; strong long-term hold

Check recent sold listings on **[Card Ladder](https://www.cardladder.com/)** for price trend data, browse singles on **[COMC](https://www.comc.com/)**, and track graded population reports on **[CGC](https://www.cgccomics.com/)**.

---

*Whether you are a comic-art purist or an MCU faithful — or somewhere in between — the Marvel card market in 2025 and 2026 has something built specifically for you.*
`;

const now = Date.now();

const article = {
  title: "Comic Art vs. Actor Portrayal: What Kind of Marvel Card Collector Are You?",
  slug: "comic-art-vs-actor-portrayal-marvel-card-collector-types-2025",
  excerpt: "From Topps Comic Book Heroes to Marvel Studios to Mint — there are two distinct collector philosophies in the Marvel card hobby. Here's how to figure out which one you are, and which sets are built for you.",
  contentMarkdown: contentMarkdown.trim(),
  featuredImageUrl: HERO_IMG,
  category: "analysis",
  tags: JSON.stringify(["Topps Marvel", "Comic Book Heroes", "Marvel Studios", "Topps Marvel Mint", "Topps Marvel Collector", "Collecting Guide", "Card Types"]),
  cardMarketImpact: "Comic Book Heroes refractors and Collector autographs are both seeing strong demand heading into Phase 6. The hybrid appeal of Marvel Mint is attracting collectors from both camps, driving parallel prices higher.",
  relatedCharacters: JSON.stringify(["Killraven", "Hawkeye", "Nick Fury", "Captain America", "Queen Ramonda", "Wolverine"]),
  sources: JSON.stringify([
    { title: "Topps Marvel Comic Book Heroes 50th Anniversary", url: "https://www.topps.com/" },
    { title: "2025 Topps Marvel Studios Checklist", url: "https://www.topps.com/" },
    { title: "Topps Marvel Collector Autographs", url: "https://www.topps.com/" },
    { title: "2025 Topps Marvel Mint Product Info", url: "https://www.topps.com/" }
  ]),
  isFeatured: 0,
  isPublished: 1,
  authorName: "NLF Team",
  publishedAt: now,
  metaDescription: "Comic art or actor portrayal — which Marvel card collector are you? We break down Topps Comic Book Heroes, Marvel Studios, Collector, and Mint to help you find your perfect set.",
  templateLayout: "magazine"
};

try {
  const [result] = await conn.execute(
    `INSERT INTO articles 
      (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription, templateLayout)
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
  console.log('✅ Article published! ID:', result.insertId);
  console.log('   Title:', article.title);
  console.log('   Slug:', article.slug);
  console.log('   Template:', article.templateLayout);
  console.log('   URL: https://northlandlegendaryfinds.com/mcu-news/' + article.slug);
} catch (err) {
  console.error('❌ Error publishing article:', err.message);
} finally {
  await conn.end();
  process.exit(0);
}
