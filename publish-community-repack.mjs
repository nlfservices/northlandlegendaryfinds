/**
 * Publish Community Engagement Article — "Help Us Build Your Dream Marvel Repack"
 * Run from project root: node publish-community-repack.mjs
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
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/community-repack-hero-QyC8XTKwD7YZobrnUpC8aZ.webp",
  completeSets: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/community-repack-complete-sets-7xVNPW9Bp2QFS5ppuSCvYg.webp",
  budgetPremium: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/community-repack-budget-premium-ESvGaQSdyiTGT6HdDyjXhe.webp",
};

const now = Date.now();

const articles = [
  {
    title: "Help Us Build Your Dream Marvel Repack: We Want to Hear From YOU",
    slug: "help-us-build-your-dream-marvel-repack-community",
    excerpt: "We're asking the NLF community to help shape our next generation of Marvel repacks. From 100-card starter packs to complete encased sets, team lots to exclusive Doctor Doom inserts — tell us what you want.",
    featuredImageUrl: IMAGES.hero,
    category: "card_market",
    tags: JSON.stringify(["Community", "Repacks", "Marvel Cards", "NLF", "Trading Cards", "Collecting", "Complete Sets", "Doctor Doom", "Gambit", "Budget Friendly", "Premium Cards"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Gambit", "Spider-Man", "Wolverine", "Iron Man", "Captain America"]),
    cardMarketImpact: "Community-driven repack design could reshape how collectors access Marvel cards at every price point, from budget-friendly starter packs to premium graded collections.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "Patrick — NLF Team",
    publishedAt: now,
    metaDescription: "Northland Legendary Finds wants YOUR input on our next Marvel repacks. Complete sets, team lots, exclusive inserts, budget to premium — help us build what collectors actually want.",
    sources: JSON.stringify([
      { title: "Northland Legendary Finds", url: "https://northlandlegendaryfinds.com" },
      { title: "NLF Card Database", url: "https://northlandlegendaryfinds.com/cards" },
      { title: "NLF Shop", url: "https://northlandlegendaryfinds.com/shop" }
    ]),
    contentMarkdown: `We started Northland Legendary Finds with one goal: build something collectors actually want. Not what some corporate boardroom thinks you want. Not what looks good on a spreadsheet. What real collectors — people who rip packs, chase parallels, and protect their slabs like family — actually get excited about.

So here we are, asking the most important question we can ask: **What do YOU want in a Marvel repack?**

We have ideas. A lot of them. But before we lock anything in, we want to hear from the community that makes this whole thing worth doing. Every single idea below came from conversations with collectors, Whatnot chat, and late-night brainstorming sessions. Some of these might be incredible. Some might be terrible. That's why we need you.

## The Big Question: How Many Cards?

<img src="${IMAGES.budgetPremium}" alt="Budget friendly cards alongside premium graded slabs showing the range of collecting tiers" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

Right now, our flagship NLF Variant repack runs at a solid card count with graded hits mixed in. But we're thinking bigger — and smaller.

**100-Card Starter Packs** — Perfect for new collectors or someone who wants to dip their toes into Marvel cards without breaking the bank. A curated mix of base cards, a few inserts, maybe a guaranteed parallel. The kind of pack you'd grab for your kid or for yourself when you just want that rip-and-sort feeling on a Tuesday night.

**500-Card Monster Boxes** — Our current sweet spot. Enough volume to build toward set completion, guaranteed graded cards, and enough variety across sets that you're always finding something new. This is where the serious fun happens.

**1,000-Card Mega Boxes** — For the collector who wants it all. Imagine cracking open a box and spending an entire weekend sorting, organizing, and discovering. Multiple graded cards, insert sets, parallels across every Topps Marvel release. This is the "clear the dining room table" experience.

Here's what we want to know: **Which size gets you most excited?** Would you rather have more smaller packs or fewer massive ones? Is there a sweet spot we're missing — maybe 250 cards?

## Complete Sets: Why Not?

<img src="${IMAGES.completeSets}" alt="Complete Marvel trading card set displayed in a premium binder with protective sleeves" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

This is the idea that keeps us up at night. What if instead of just random cards, we offered **complete encased sets**?

Picture this: **A complete Topps Comic Book Heroes base set — all 120 cards — sleeved, organized, and encased in a premium display.** No hunting. No trading. No "I'm missing card #47 and it's driving me insane." Just the complete set, ready to display or store.

We could do this across multiple sets:

**Topps Comic Book Heroes (2024)** — 120 cards of classic comic art. The set that started the modern Marvel card renaissance. Every card sleeved and numbered in order, encased in a premium holder. Imagine having this on your shelf.

**Topps Marvel Mint (2025)** — The coin and medallion insert set that's been turning heads. A complete base run would be something special.

**Topps Chrome Marvel (2024)** — The flagship chrome set with that iconic refractor finish. A complete base set of these is genuinely beautiful.

The question is: **Would you pay a premium for a guaranteed complete set?** Or do you prefer the hunt — buying packs and trading your way to completion? There's no wrong answer here. Some collectors live for the chase. Others just want the set done and done right.

## Exclusive Insert Sets: The NLF Originals

Now here's where it gets really interesting. What if we created **exclusive insert sets** that you can only get through NLF repacks?

**The Doctor Doom Collection** — With Avengers: Doomsday dropping May 1, 2027, Doom is the hottest character in Marvel right now. What if we built an exclusive 10-card Doctor Doom insert set? Every card featuring a different iconic Doom moment — from his first appearance in Fantastic Four #5 to Secret Wars to the MCU. Numbered, limited, and only available in NLF packs.

**The Gambit Deck** — Gambit is one of the most beloved X-Men of all time, and with Channing Tatum's version finally getting screen time, the demand is real. A playing-card-themed insert set where each card mirrors a card from a standard deck — Gambit as the King of Hearts, Rogue as the Queen, and so on. Tell us that wouldn't be incredible.

**Villain Spotlight Series** — Thanos. Magneto. Green Goblin. Kingpin. Galactus. A rotating villain insert set that changes with each repack release. Collect them all across multiple purchases.

**What exclusive sets would YOU want to see?** We're completely open here. If you've got a character, a theme, or a concept that would make you immediately add to cart — we want to hear it.

## Team Packs: Assemble Your Favorites

Another idea we keep coming back to: **team-based packs.** Instead of random cards from random sets, what if you could buy a pack built around your favorite Marvel team?

**Avengers Pack** — Cards featuring Iron Man, Captain America, Thor, Black Widow, Hulk, Hawkeye, and the full roster across multiple sets. Base cards, inserts, and parallels — all Avengers, all the time.

**X-Men Pack** — Wolverine, Cyclops, Jean Grey, Storm, Gambit, Rogue, Beast, Nightcrawler. With X-Men finally joining the MCU, this could be massive. Every card in the pack tied to mutant-kind.

**Spider-Verse Pack** — Peter Parker, Miles Morales, Spider-Gwen, Venom, Green Goblin, Doc Ock. The web-slinger universe in one pack.

**Fantastic Four Pack** — Reed Richards, Sue Storm, Johnny Storm, Ben Grimm — plus Doctor Doom, Silver Surfer, and Galactus. Perfect timing with the Fantastic Four: First Steps movie fresh in everyone's minds.

**Villains Only Pack** — No heroes allowed. Just the baddest of the bad across every set. Doctor Doom, Thanos, Magneto, Loki, Kingpin, Ultron, Kang. Pure evil, pure value.

Would team packs interest you? **Which teams would you want first?** Maybe there's a team we haven't thought of — Thunderbolts? Midnight Sons? Young Avengers?

## Budget Friendly to High-End: Something for Everyone

This is important to us. We don't want NLF to be a place where only big spenders feel welcome. We want **every collector** to find something they can afford and get excited about.

**Budget Tier ($15-$30)** — Starter packs, team lots, base card bundles. Great for kids, new collectors, or anyone who just wants to add some Marvel to their collection without overthinking it. No graded cards at this level, but solid card counts and guaranteed inserts.

**Mid Tier ($50-$100)** — Our bread and butter. This is where you get graded cards, parallel hits, and enough volume to make it feel like Christmas morning. The NLF Variant repack lives here, and we think this is where most collectors want to be.

**Premium Tier ($150-$300)** — Multiple graded cards, guaranteed numbered parallels, and the kind of hits that make you post on social media. Complete insert sets included. This is for the collector who wants the best and is willing to invest.

**Ultra Premium ($500+)** — The whale tier. High-grade slabs (CGC 9.5+), rare parallels (/25, /10, /5, /1), and exclusive NLF insert sets. Limited quantities. The kind of box that makes your hands shake when you open it.

**Which price tier fits your collecting style?** Do you want us to focus on making the budget options amazing, or go all-in on premium experiences? Maybe both?

## What This Means for the NLF Community

Here's the thing — we're not a massive corporation with focus groups and market research departments. We're a family operation that started because we love Marvel cards and wanted to share that with other collectors. Patrick's been building this with his son, embarrassing his wife at card shows, and staying up way too late sorting cards.

That means when you tell us what you want, **we actually listen.** We don't have shareholders to answer to. We don't have a board of directors overriding community feedback. If the community says "we want 250-card team packs with a guaranteed graded card for under $50," then that's what we're going to figure out how to build.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to see the 1,709+ cards we're already tracking across every major Topps Marvel set. Check out our current [NLF Variant repack](https://northlandlegendaryfinds.com/shop) to see where we're starting. And if you want to see cards ripped live, join us on [Whatnot](https://northlandlegendaryfinds.com/whatnot) where we break packs every week.

## How to Tell Us What You Want

We want to make this as easy as possible. Here's how you can share your ideas:

**Drop a comment on our Facebook page** — Tell us which ideas above excite you, or pitch something completely new. Tag a collecting buddy who needs to weigh in.

**Email us directly** — Reach out through our [About page](https://northlandlegendaryfinds.com/about) contact info. We read every single message.

**Join a Whatnot stream** — Our live streams aren't just about ripping packs. They're about talking cards, hearing what collectors want, and building this thing together. Hit us up in the chat.

**Share this article** — The more collectors who see this, the better our repacks will be. Simple as that.

## Collector's Corner

The Marvel card market is evolving fast, and repack builders who listen to their community are the ones who survive. With Avengers: Doomsday on the horizon and X-Men integration ramping up, the demand for curated Marvel card products has never been higher.

**Hot Cards to Watch:**
- **Doctor Doom Topps Chrome Marvel Refractor** — Doom cards are climbing steadily as Doomsday hype builds through 2026
- **Gambit Topps Finest X-Men '97 Base** — Channing Tatum's Gambit appearance has collectors hunting every Gambit card
- **Spider-Man Topps Comic Book Heroes #1** — The flagship card of the CBH set, always in demand
- **Wolverine Topps Marvel Mint Coin Card** — Unique format cards are holding value as collectors seek variety

Track real-time prices on **[Card Ladder](https://www.cardladder.com/)** to see which characters are trending. Build your want list on **[COMC](https://www.comc.com/)** for singles you need. And check **[MySlabs](https://www.myslabs.com/)** to manage your graded collection portfolio.

*This is YOUR community. YOUR repacks. Help us build something legendary.*

---

**Facebook Post:**

We need your help, Marvel collectors.

We're building the next generation of NLF repacks and we want to know: what do YOU actually want? 100-card starter packs? 500-card monster boxes? Complete encased sets? Exclusive Doctor Doom inserts? Team packs? Budget-friendly options?

We laid out every idea we've been brainstorming and we want the community to tell us what to build first.

Read the full breakdown and tell us what gets you excited:
https://northlandlegendaryfinds.com/mcu-news/help-us-build-your-dream-marvel-repack-community

Drop your ideas in the comments. Tag a collecting buddy. Let's build this together.

#Marvel #MarvelCards #TradingCards #Repacks #NorthlandLegendaryFinds #NLF #DoctorDoom #Gambit #SpiderMan #Wolverine #Avengers #XMen #CardCollecting #CommunityFirst`,
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
      console.log(`Published: "${article.title}"`);
    } catch (err) {
      console.error(`Failed: "${article.title}" -- ${err.message}`);
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
