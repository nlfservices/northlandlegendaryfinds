import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const now = Date.now();

const article = {
  title: 'The Notebook Cast Is Taking Over the MCU — Time to Get Your Partner to Watch Marvel',
  slug: 'notebook-cast-mcu-ghost-rider-cyclops-doctor-strange',
  excerpt: 'Ryan Gosling is Ghost Rider. Rachel McAdams is Christine Palmer. James Marsden is Cyclops. The Notebook cast is officially running the MCU — and that might be the best argument you have for movie night.',
  featuredImageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/notebook-mcu-crossover-featured-LpYd7NQqsqDw4PWsZCDfEX.png',
  category: 'casting',
  tags: JSON.stringify(['Ryan Gosling', 'Ghost Rider', 'Rachel McAdams', 'Doctor Strange', 'James Marsden', 'Cyclops', 'The Notebook', 'Avengers Doomsday', 'SDCC 2026', 'MCU']),
  cardMarketImpact: 'Ghost Rider cards are about to explode with Ryan Gosling confirmed. Cyclops cards are already climbing with Doomsday hype. Christine Palmer cards from Doctor Strange sets are undervalued sleepers.',
  relatedCharacters: JSON.stringify(['Ghost Rider', 'Cyclops', 'Doctor Strange', 'Christine Palmer', 'Hulk', 'Wolverine']),
  sources: JSON.stringify([
    { title: 'Variety - Ryan Gosling Cast as Ghost Rider', url: 'https://variety.com/2026/film/news/ryan-gosling-ghost-rider-marvel-movie-1236821206/' },
    { title: 'Variety - James Marsden Cyclops Return in Doomsday', url: 'https://variety.com/2025/film/news/james-marsden-cyclops-avengers-doomsday-homecoming-1236482443/' }
  ]),
  isFeatured: 0,
  isPublished: 1,
  authorName: 'NLF Team',
  publishedAt: now,
  metaDescription: 'Ryan Gosling is Ghost Rider, Rachel McAdams is Christine Palmer, James Marsden is Cyclops. The Notebook cast has taken over the MCU. Here is why that matters for collectors and your relationship.',
  contentMarkdown: `<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/notebook-mcu-hulk-date-comic-Qv8qbHHQCMXqLWBVXJtLhP.png" alt="Comic book style couple on a movie date watching The Incredible Hulk" />

True story: my first date with my wife was on Friday the 13th, 2008. The movie? Edward Norton's *The Incredible Hulk*. She didn't know what she was getting into. Eighteen years later, she's watched every MCU movie with me — and honestly, Marvel might be the reason we're still together.

So when I realized that three stars from *The Notebook* — the ultimate "her movie" — are now major players in the MCU, I knew this was the article that needed to exist. Fellas, this is your cheat code. The next time your wife, girlfriend, or partner says "I don't want to watch another superhero movie," you hit them with this:

**"Babe, Ryan Gosling is in it now."**

Game over. You win. Let's break it down.

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/notebook-mcu-ghostrider-comic-UDa2BEszpSWdTXdN42b4wZ.png" alt="Ghost Rider comic book panel - Hellfire on the Streets" />

## Ryan Gosling — Ghost Rider (2028)

Just confirmed at SDCC 2026 Hall H — Ryan Gosling is officially playing **Johnny Blaze / Ghost Rider** in a standalone MCU film arriving in 2028. The man who wrote love letters in the rain is now going to have a flaming skull and ride a hellfire motorcycle through the Marvel Cinematic Universe.

This is Noah Calhoun saying "It wasn't over. It still isn't over" — except now he's saying it to Mephisto while engulfed in supernatural flames.

Gosling reportedly wanted this role specifically, turning down Nova rumors to hold out for the Spirit of Vengeance. And honestly? The guy who did *Drive*, *Blade Runner 2049*, and *The Fall Guy* was born to play a brooding antihero on a motorcycle. The MCU just got its coolest character.

**Release:** 2028 (exact date TBA)

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/notebook-mcu-christine-comic-oJhRmo3xcCAYDSuKDDNQj2.png" alt="Multiverse M.D. comic book panel - Christine Palmer in the multiverse" />

## Rachel McAdams — Christine Palmer (Doctor Strange)

Rachel McAdams has been in the MCU since 2016, playing **Dr. Christine Palmer** — Stephen Strange's former love interest and fellow surgeon. She appeared in both *Doctor Strange* (2016) and *Doctor Strange in the Multiverse of Madness* (2022), where she got to play multiple variants across the multiverse.

She's the Allie Hamilton of the MCU — the one who got away. Except instead of a summer romance in 1940s South Carolina, it's a neurosurgeon who chose stability over a man who talks to his cape.

McAdams brought real emotional weight to a role that could've been forgettable. Her scene in *Multiverse of Madness* where she tells Strange "Are you happy?" is genuinely one of the most human moments in the entire MCU.

**Appeared in:** Doctor Strange (2016), Doctor Strange in the Multiverse of Madness (2022)

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/notebook-mcu-cyclops-comic-D48pJ9jFBFrou4mboB6hrJ.png" alt="Cyclops comic book panel - optic blast with X-Men team" />

## James Marsden — Cyclops (X-Men / Avengers: Doomsday)

James Marsden played **Lon Hammond** in The Notebook — the "other guy," the safe choice, the one Allie's parents approved of. In the Marvel universe, he's been **Scott Summers / Cyclops** since the original *X-Men* (2000).

After being unceremoniously killed off in *X-Men: The Last Stand* (2006), Marsden is BACK as Cyclops in *Avengers: Doomsday* (December 2026). He told Variety it's been "a blast" returning after 20 years of fans asking "When are you coming back?"

He even joked about whether he'd still fit in the costume after two decades. Spoiler: he does. And the comic-accurate visor he's finally wearing? Chef's kiss.

**Appeared in:** X-Men (2000), X2 (2003), X-Men: The Last Stand (2006), returning in Avengers: Doomsday (2026)

<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/notebook-mcu-romance-comic-jvxGy5TSLoxjVKVpA2ZHrw.png" alt="Romance comic book panel - couple kissing in the rain" />

## The "Convince Your Partner" Viewing Guide

Here's your strategic Marvel movie night plan using The Notebook connection:

| Movie Night | Film | The Hook |
|-------------|------|----------|
| Night 1 | Doctor Strange (2016) | "Rachel McAdams is in this one" |
| Night 2 | Doctor Strange: Multiverse of Madness (2022) | "She's back and it gets wild" |
| Night 3 | X-Men (2000) | "James Marsden — the guy from The Notebook" |
| Night 4 | X2: X-Men United (2003) | "This one's actually amazing" |
| Night 5 | Avengers: Doomsday (Dec 2026) | "All of them are in this one" |
| Night 6 | Ghost Rider (2028) | "RYAN GOSLING" |

By Night 3, they'll be hooked. By Night 5, they'll be asking YOU when the next one comes out. Trust the process.

## From The Notebook to the MCU: A Love Story

Think about it — *The Notebook* came out in 2004. Twenty-two years later, its three biggest stars are all active in the Marvel Cinematic Universe at the same time. Noah is Ghost Rider. Allie is a multiverse-hopping surgeon. And Lon — the guy who lost the girl — is leading the X-Men into battle against Doctor Doom.

If that's not a sign that the MCU is for everyone, I don't know what is.

And look — I get it. Not everyone's partner is going to suddenly love superhero movies. But Marvel has always been about more than capes and punching. It's about relationships, sacrifice, identity, and finding your people. Sound familiar? That's literally The Notebook.

## Collector's Corner

With Ryan Gosling confirmed as Ghost Rider, the card market is about to shift hard. Ghost Rider has historically been underrepresented in modern Topps sets, which means existing cards are scarce and about to spike.

**Hot Cards to Watch:**
- **Ghost Rider Chrome Base (2024 Topps Chrome Marvel)** — Scarce in high grade, about to be the most wanted card in the set now that Gosling is confirmed
- **Cyclops Refractor (2024 Topps Chrome Marvel)** — Already climbing with Doomsday trailer hype, Marsden's return adds fuel
- **Christine Palmer Base (2024 Topps Marvel Studios Chrome)** — Massively undervalued. McAdams cards are cheap right now but won't stay that way
- **Ghost Rider Cerebro Insert /99 (2026 Topps Marvel Mint)** — Brand new set, Ghost Rider is card CB-33. Get these before the Gosling news fully hits the market

Check current Ghost Rider prices on **[Card Ladder](https://www.cardladder.com/)** — you'll want to track the price movement over the next 48 hours. Browse the full 2026 Marvel Mint checklist in our **[Card Database](https://northlandlegendaryfinds.com/cards)** to find every Ghost Rider and Cyclops card available. And keep an eye on **[eBay sold listings](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** to see what these cards are actually selling for right now.

*Ghost Rider standalone film expected 2028. Avengers: Doomsday hits theaters December 18, 2026.*`
};

// Insert the article
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

// Show latest articles
const [latest] = await conn.execute('SELECT title, slug FROM articles ORDER BY publishedAt DESC LIMIT 5');
console.log('\n📰 Latest Articles:');
latest.forEach((a, i) => console.log(`   ${i+1}. ${a.title}`));

await conn.end();
console.log('\n✅ Done!');
