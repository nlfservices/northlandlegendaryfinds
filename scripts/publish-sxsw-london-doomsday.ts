import { getDb } from '../server/db';
import { articles } from '../drizzle/schema';
import { desc } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) { console.error('No DB connection'); process.exit(1); }
  
  // Check recent templates
  const recent = await db.select({ 
    slug: articles.slug, 
    templateLayout: articles.templateLayout 
  }).from(articles).orderBy(desc(articles.publishedAt)).limit(5);
  
  console.log("Recent templates:", recent.map(r => `${r.slug} → ${r.templateLayout}`));
  
  // Template rotation: spotlight → timeline → listicle → magazine → deep-dive → cinematic → editorial
  // Last articles: doomsday-weekly (spotlight), whos-your-pick (timeline), psa-pause (listicle)
  // Next should be: magazine
  
  const imageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sxsw-london-doomsday-latveria-RqfqhGVrVMzaP5YtvinTzX.webp";

  const contentMarkdown = `## The Latveria Flag Has Entered the Chat

The Russo Brothers have officially broken their silence on Avengers: Doomsday's connection to SXSW London — and they did it in the most Doctor Doom way possible. On May 30, the directing duo posted a cryptic image to Instagram featuring the **Latveria flag insignia** overlaid with the SXSW London logo. The post tagged Marvel Studios, Robert Downey Jr., the official Avengers account, and AGBO Films.

This follows their earlier post of a mysterious plain green square — now clearly identifiable as the base color of the Latverian flag. The message is unmistakable: **Doctor Doom's kingdom is coming to the MCU**, and SXSW London is where we'll get our first real taste.

## What's Happening June 2nd

The festival runs June 1-6 in Shoreditch, London, but **June 2nd is the day to watch**. The Russo Brothers have two confirmed panels:

| Event | Details |
|-------|---------|
| Deadline Live Studio: Close Up AGBO | Deep dive into the Russos' production company and upcoming projects |
| Building Artistic Universes Without Borders | World-building panel with Donald Mustard (Fortnite co-creator, AGBO partner) |
| Avengers: Infinity War Special Screening | Extended intro from the Russo Brothers + "special guests" |

The Infinity War screening is the most likely venue for a Doomsday reveal. Following a screening of their previous Avengers film with an extended introduction and mysterious "special guests" is the perfect setup for showing footage — potentially the same trailer that brought the house down at CinemaCon in April.

## The CinemaCon Trailer Everyone's Waiting For

For those who missed it, the CinemaCon footage reportedly featured **Thor battling Doctor Doom** in an epic confrontation, along with glimpses of the multiverse colliding. Attendees described it as one of the most electrifying Marvel reveals in years. That footage has never been released publicly — and SXSW London might be where it finally goes wide.

Fan theories are running wild about potential public release dates. Some decoded the hex color values from the green posts and arrived at June 18 or June 27. Others believe Marvel will hold the trailer for San Diego Comic-Con in July, where they've confirmed a Hall H panel. ComicBook.com notes that releasing a trailer in June and another in July would be unusual for a major blockbuster — but then again, nothing about this rollout has been typical.

## New Promo Art Drops: The Teams Are Assembling

Adding fuel to the fire, new promotional artwork surfaced on May 30-31 showing the full scope of Doomsday's roster:

**Confirmed in promo art:** Doctor Doom (Robert Downey Jr.) in a dark, menacing pose, Captain America (Sam Wilson/Anthony Mackie), Cyclops (James Marsden), Thor (Chris Hemsworth), The Thing (Ebon Moss-Bachrach), and Yelena Belova (Florence Pugh).

One piece shows the logos of the **Avengers, Fantastic Four, and X-Men colliding together** — strongly hinting at the Incursion event from the comics where multiple Earths crash into each other. Sources suggest Earth-616, Earth-828, and Earth-10005 will all be involved in a massive multiverse conflict that could lead to a Battleworld-style setting.

## The Full Cast We Know So Far

The scope of this film is unprecedented:

| Team | Cast |
|------|------|
| Avengers | Chris Hemsworth, Anthony Mackie, Sebastian Stan, Letitia Wright, Paul Rudd, Tom Hiddleston, Kathryn Newton |
| Fantastic Four | Pedro Pascal, Vanessa Kirby, Ebon Moss-Bachrach, Joseph Quinn |
| X-Men | Patrick Stewart, Ian McKellen, James Marsden, Rebecca Romijn, Kelsey Grammer, Alan Cumming |
| Wild Cards | Chris Evans, Simu Liu (Shang-Chi), Channing Tatum (Gambit) |
| The Villain | Robert Downey Jr. as Doctor Doom |

## Filming in London — Not LA

The Russo Brothers confirmed both Doomsday and Secret Wars are filming entirely in London at Pinewood Studios. "Not in LA, it's all in London. We're shooting them fairly back to back." Doomsday is currently in post-production, while Secret Wars begins filming later this year — also in the UK.

This means the SXSW London appearance isn't just promotional — the Russos are literally working down the road from the festival. The proximity makes a major reveal even more likely.

## What This Means for Collectors

Every piece of news that drops between now and December is going to move the market. We already documented over **$100K in Doctor Doom card sales on eBay last week alone** — and that was BEFORE the Latveria flag reveal and promo art leaks.

Key dates to watch:
- **June 2:** SXSW London panels + Infinity War screening (potential trailer)
- **July:** San Diego Comic-Con Hall H (confirmed Marvel panel)
- **December 18, 2026:** Avengers: Doomsday theatrical release
- **December 2027:** Avengers: Secret Wars

The supply of premium Doctor Doom cards is already drying up. If a trailer drops June 2nd, expect another massive spike in demand. We're tracking this daily — follow along for real-time updates.

## Joe Russo on the Hype Machine

Joe Russo recently addressed the unprecedented level of speculation surrounding the film:

> "On one hand, audiences want to be surprised, and that's part of what makes the theatrical experience exciting. On the other hand, [spoilers] can become a little over-policed, where people are anxious about engaging with anything."

He added: "We design these films to unfold in a certain way, and we want audiences to feel those moments as intended. But at the same time, you can't control everything. You have to focus on making something that holds up beyond the initial surprise."

Translation: they know exactly what they're doing with these teases. Every green square, every tagged post, every "special guest" mention is calculated to build maximum anticipation heading into June 2nd.

## Stay Tuned — We're Watching This Daily

This is a developing story. SXSW London runs June 1-6, and we'll be covering every reveal, every leak, and every market movement as it happens. The next 7 days could reshape the entire Doomsday conversation.

**Bookmark this page and follow Northland Legendary Finds for daily updates throughout SXSW London week.**`;

  const tags = ["Avengers Doomsday", "Russo Brothers", "SXSW London", "Doctor Doom", "Latveria", "Marvel Studios", "Robert Downey Jr", "trailer", "MCU"];
  const relatedCharacters = ["Doctor Doom", "Thor", "Captain America", "Cyclops", "The Thing", "Yelena Belova"];
  const sources = [
    { name: "Times Now News", url: "https://www.timesnownews.com/entertainment-news/hollywood/avengers-doomsday-anthony-joe-russo-confirm-marvel-sequel-will-be-part-of-sxsw-london-with-new-clue-article-154434582" },
    { name: "ComicBook.com", url: "https://comicbook.com/movies/news/avengers-doomsday-trailer-hype-heats-up-after-russos-tease/" },
    { name: "Netflix Junkie", url: "https://www.netflixjunkie.com/marvel-fans-get-new-avengers-doomsday-update-ahead-of-sxsw-london" },
    { name: "Comic Basics", url: "https://www.comicbasics.com/first-look-avengers-doomsday-promo-art-reveals-doom-and-the-heroes/" },
    { name: "Screen Rant", url: "https://screenrant.com/avengers-doomsday-russo-brothers-doctor-doom-latveria-flag/" }
  ];

  await db.insert(articles).values({
    title: "BREAKING: Russo Brothers Reveal Latveria Flag Ahead of SXSW London — Trailer Incoming?",
    slug: "russo-brothers-latveria-flag-sxsw-london-doomsday-trailer-june-2026",
    excerpt: "The Russo Brothers just posted Doctor Doom's Latveria flag insignia tagged with Marvel Studios and RDJ. SXSW London June 2nd could be the day everything changes. New promo art confirms the full roster.",
    contentMarkdown,
    featuredImage: imageUrl,
    category: "movie_news",
    templateLayout: "magazine",
    tags,
    relatedCharacters,
    sources,
    readTime: 7,
    publishedAt: BigInt(Date.now()),
    status: "published",
  });

  console.log("✅ Article published: russo-brothers-latveria-flag-sxsw-london-doomsday-trailer-june-2026");
  process.exit(0);
}

main().catch(console.error);
