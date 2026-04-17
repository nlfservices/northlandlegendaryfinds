import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const articles = [
  // ===== ARTICLE 1: Infinity Vision (PUBLISH NOW) =====
  {
    title: "Infinity Vision: Disney Launches Its Own Premium Theater Format to Counter IMAX's Dune 3 Lockout",
    slug: "infinity-vision-disney-premium-theater-format-doomsday",
    excerpt: "Disney just unveiled Infinity Vision at CinemaCon 2026 — a new premium theater certification designed to give Avengers: Doomsday the biggest screens possible after IMAX locked in an exclusive deal with Dune: Part Three.",
    contentMarkdown: `In one of the most significant theatrical distribution moves in recent memory, The Walt Disney Studios announced the launch of **Infinity Vision** at CinemaCon 2026 today — a brand-new certification for premium large format (PLF) theaters that sets rigorous technical standards for screen size, laser projection, and immersive audio.

The timing is no coincidence. Infinity Vision is Disney's direct response to a problem that has been looming over Avengers: Doomsday for months: **IMAX has locked in a three-week exclusive run with Dune: Part Three**, starting December 18, 2026 — the exact same day Doomsday hits theaters.

## What Is Infinity Vision?

According to [Disney's official press release](https://thewaltdisneycompany.com/news/infinity-vision-movie-theaters/), Infinity Vision is a new certification label for premium large format theaters. A theater earns the Infinity Vision badge by meeting Disney's rigorous technical standards in three key areas:

- **The largest screens** for maximum scale
- **Laser projection** for superior brightness and clarity
- **Premium audio formats** for fully immersive sound

There are currently **75 Infinity Vision-certified theaters in the United States** and **300 internationally**, bringing the global total to approximately 375 locations. These are likely existing premium auditoriums — Dolby Cinema, RPX, and other PLF screens — that Disney has certified under its new brand.

## Why Disney Built This: The IMAX Problem

The backstory is straightforward. Warner Bros. secured an exclusive three-week IMAX deal for Dune: Part Three as far back as June 2024 — before Doomsday even had its release date locked in. IMAX has confirmed they are honoring that deal and will not give screens to Doomsday during those crucial first three weeks of release.

According to a [Forbes analysis citing Cinelytics data](https://www.forbes.com/sites/dbloom/2026/04/11/avengers-biggest-battle-taking-on-dune-part-three-at-christmas/), losing IMAX means Doomsday will receive only a **3.5% "true" IMAX boost** instead of the much larger premium format bump that blockbusters typically enjoy. For a film expected to gross over a billion dollars worldwide, that difference translates to tens of millions in lost revenue.

Rather than move the release date — which Marvel Studios has [publicly confirmed they will not do](https://thedirect.com/article/marvel-studios-record-straight-avengers-doomsday-release-change) — Disney chose to build its own premium format. If IMAX won't give them screens, they'll certify their own.

## The Rollout Strategy

Disney's rollout plan is deliberate and strategic:

**September 2026:** Avengers: Endgame will receive a theatrical re-release in Infinity Vision-certified theaters. This serves as both a test run for the new format and a marketing vehicle to familiarize audiences with the Infinity Vision brand before Doomsday arrives.

**December 18, 2026:** Avengers: Doomsday launches in Infinity Vision theaters nationwide, giving audiences a premium viewing experience that rivals IMAX — even though IMAX screens will be showing Dune.

The Endgame re-release is a smart play. It gives Disney three months to iron out any technical issues, build brand awareness, and create a direct association between "Infinity Vision" and "the best way to see Marvel movies."

## How Does It Compare to IMAX?

| Feature | IMAX | Infinity Vision |
|---------|------|-----------------|
| Screen Size | Up to 100+ feet | "Largest screens" — PLF-sized |
| Projection | Dual laser | Laser projection certified |
| Audio | IMAX 12-channel | Premium immersive formats |
| US Locations | 400+ | 75 certified |
| Global Locations | 1,700+ | 300 international |
| Who Controls It | IMAX Corporation | Disney |

The honest assessment: Infinity Vision is not a new theater format built from scratch. It's a certification program that puts Disney's stamp of approval on the best existing PLF auditoriums. But that's exactly what it needs to be — a way to tell audiences "this is the best screen in your area for Doomsday" when IMAX isn't an option.

## What This Means for Collectors

For Marvel card collectors tracking the Doomsday release, Infinity Vision is a bullish signal. Disney is investing significant resources into ensuring Doomsday has the biggest possible theatrical footprint — even creating an entirely new theater brand to make it happen. That level of corporate commitment suggests Disney expects Doomsday to be a massive cultural event, which historically drives card market activity.

For the latest card market data and pricing trends, resources like [ComicBookCard.com](https://comicbookcard.com/) provide valuable tracking tools for collectors monitoring the Doomsday effect on Marvel card values.

The Endgame re-release in September could also create a secondary wave of Marvel nostalgia that benefits card collectors — particularly for Endgame-era characters like the original six Avengers.

## The Bigger Picture

Infinity Vision represents something larger than a single film's distribution strategy. It's Disney asserting control over the premium theatrical experience in a way that no studio has attempted before. If Infinity Vision succeeds with Doomsday, expect Disney to expand the program to future releases — potentially creating a permanent alternative to IMAX for Disney's biggest films.

The December 2026 box office showdown between Dune: Part Three and Avengers: Doomsday just got even more interesting. One film has IMAX. The other has Infinity Vision. Audiences will decide which premium experience they prefer.

---

*Sources: [The Walt Disney Company](https://thewaltdisneycompany.com/news/infinity-vision-movie-theaters/), [Forbes](https://www.forbes.com/sites/dbloom/2026/04/11/avengers-biggest-battle-taking-on-dune-part-three-at-christmas/), [The Direct](https://thedirect.com/article/marvel-studios-record-straight-avengers-doomsday-release-change)*`,
    featuredImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/infinity-vision-article-7Sn7bHZ3dvatqH6cjes7SW.webp",
    category: "movie_news",
    tags: JSON.stringify(["Avengers", "Doomsday", "Infinity Vision", "IMAX", "Dune", "CinemaCon", "Disney", "Theaters"]),
    cardMarketImpact: "Disney creating a new premium theater format for Doomsday signals massive corporate confidence — bullish for Marvel card values. Endgame re-release in September could create secondary nostalgia wave.",
    relatedCharacters: JSON.stringify(["Doctor Doom", "Iron Man", "Captain America", "Thor", "Hulk", "Black Widow"]),
    sources: JSON.stringify([
      { title: "The Walt Disney Company — Infinity Vision Launch", url: "https://thewaltdisneycompany.com/news/infinity-vision-movie-theaters/" },
      { title: "Forbes — Avengers' Biggest Battle: Taking On Dune", url: "https://www.forbes.com/sites/dbloom/2026/04/11/avengers-biggest-battle-taking-on-dune-part-three-at-christmas/" },
      { title: "The Direct — Marvel Sets Record Straight on Release Date", url: "https://thedirect.com/article/marvel-studios-record-straight-avengers-doomsday-release-change" },
      { title: "Deadline — Disney Infinity Vision Premium Experience", url: "https://deadline.com/2026/04/disney-infinity-vision-premium-theatrical-experience-1236863864/" }
    ]),
    isFeatured: true,
    isPublished: true,
    authorName: "NLF Team",
    publishedAt: Date.now(),
    metaDescription: "Disney launches Infinity Vision, a new premium theater certification, to counter IMAX's exclusive Dune 3 deal and ensure Avengers: Doomsday gets the biggest screens possible."
  },

  // ===== ARTICLE 2: Doomsday Trailer Breakdown (6am tomorrow) =====
  {
    title: "Avengers: Doomsday CinemaCon Trailer Breakdown — Every Scene, Every Character, Every Detail",
    slug: "avengers-doomsday-cinemacon-trailer-breakdown-every-scene",
    excerpt: "Kevin Feige debuted the first full Avengers: Doomsday trailer at CinemaCon 2026. From Doom's opening narration to Steve Rogers summoning Mjolnir, here's a complete scene-by-scene breakdown.",
    contentMarkdown: `The moment Marvel fans have been waiting for since San Diego Comic-Con 2024 finally arrived. On April 16, 2026, Kevin Feige took the stage at CinemaCon in Las Vegas and debuted the **first full trailer for Avengers: Doomsday** — and it did not disappoint. The trailer played twice for the packed auditorium, with **Robert Downey Jr.** and **Chris Evans** appearing in person alongside directors **Anthony and Joe Russo**.

The trailer has not been released online yet — reports suggest it may debut publicly alongside The Mandalorian and Grogu in late May — but multiple entertainment outlets have provided detailed descriptions. Here is a complete scene-by-scene breakdown based on reports from [Variety](https://variety.com/2026/film/news/avengers-doomsday-trailer-robert-downey-jr-doctor-doom-1236719804/), [IGN](https://www.ign.com/articles/disney-debuts-new-avengers-doomsday-trailer-at-cinemacon-2026), and [Deadline](https://deadline.com/2026/04/avengers-doomsday-drop-new-trailer-cinemacon-1236863482/).

## Scene-by-Scene Breakdown

**Scene 1 — The Xavier Institute.** The trailer opens with a shot of the Xavier Institute sign. This is our first confirmation that the X-Men's home base exists in the MCU timeline.

**Scene 2 — Doom's Narration.** Doctor Doom speaks for the first time, delivering a chilling monologue: *"Something is coming, something we might not be able to deter. Before this day is done, we shall be faced with an unthinkable decision."* Robert Downey Jr. delivers the line in a **vaguely Eastern European accent** — a clear departure from Tony Stark and a signal that this is a completely different character.

**Scene 3 — Professor Xavier.** Patrick Stewart's Professor Xavier looks up at a bright light in the sky. The return of Stewart as Xavier confirms this is the legacy version of the character, not a recast.

**Scene 4 — Doctor Doom Revealed.** We see Doom in profile for the first time — **green hood, metal face mask**. This is the moment fans have been waiting for: RDJ as Victor Von Doom, fully suited in the iconic armor.

**Scene 5 — Avengers Tower.** A shot of Avengers Tower, but it looks different from its previous appearances. Something has changed in the MCU's New York.

**Scene 6 — The Summit.** The Fantastic Four meet with the Avengers and the Thunderbolts. Three teams, one room. This is the crossover event fans have dreamed about.

**Scene 7 — Wakanda Meets Atlantis.** Letitia Wright's Shuri meets with Tenoch Huerta's Namor. After their conflict in Wakanda Forever, seeing these two characters working together signals the scale of the threat Doom represents.

**Scene 8 — Cyclops Arrives.** James Marsden's Cyclops walks into a room wearing a **comics-accurate suit**. The confirmation that Marsden is back as Cyclops — and in a proper X-Men uniform — drew massive cheers from the CinemaCon audience.

**Scene 9 — Thor's Warning.** Thor delivers a sobering line: he's fought many allies who all died facing threats that scare him far less than what's coming. Chris Hemsworth's delivery reportedly set a serious, almost mournful tone.

**Scene 10 — Shang-Chi vs. Gambit.** Simu Liu's Shang-Chi fights Channing Tatum's Gambit inside the X-Mansion. This suggests early tension between the established MCU heroes and the newly integrated mutants.

**Scene 11 — Wakandans Meet the FF.** The Wakandan delegation meets with the Fantastic Four, further establishing the unprecedented alliance forming against Doom.

**Scene 12 — Mystique's Trick.** Rebecca Romijn's Mystique transforms into Florence Pugh's Yelena Belova, creating a **Pugh vs. Pugh fight sequence**. This is classic Mystique infiltration tactics from the original X-Men films.

**Scene 13 — The Storm Siblings.** Joseph Quinn's Johnny Storm holds Vanessa Kirby's Sue Storm in what appears to be an emotional moment. The Fantastic Four's family dynamic is clearly central to the story.

**Scene 14 — Namor in Flight.** A shot of Namor flying — a visual showcase of the Sub-Mariner's power.

**Scene 15 — Ant-Man and Cassie.** Paul Rudd's Ant-Man kisses Kathryn Newton's Cassie Lang on the forehead. This is the **first confirmation that Cassie is in the film**, and it suggests a father-daughter emotional arc.

**Scene 16 — Thor's Rally.** Thor delivers the trailer's rallying cry: *"Put aside your petty squabbles. Presume nothing except this — if you return, we will return as brothers and sisters."* This is Thor stepping into a leadership role, uniting the fractured hero teams.

**Scene 17 — Doom Catches Stormbreaker.** Thor leaps at Doom with Stormbreaker — and **Doom catches it with his bare hands**. This single moment establishes Doom as a threat on par with Thanos. The CinemaCon audience reportedly erupted.

**Scene 18 — "We're Going to Need a Miracle."** Thor, stunned by Doom's power, delivers the line that sets up the trailer's climax.

**Scene 19 — Steve Rogers Returns.** Chris Evans appears as Steve Rogers with a simple **"Hey pal."** He's long-haired and scraggly — more rugged than we've ever seen him, even more than his Infinity War look.

**Scene 20 — Thor's Disbelief.** Thor says *"It's not possible"* — reflecting the audience's own shock.

**Scene 21 — Mjolnir Summoned.** Steve Rogers **summons Mjolnir directly from Thor's hand**. The hammer flies from Thor to Steve, confirming that Rogers is still worthy — and possibly more powerful than ever.

## The Full Confirmed Cast

Based on the trailer and CinemaCon reports, here is every character confirmed to appear:

| Character | Actor | Team |
|-----------|-------|------|
| Doctor Doom | Robert Downey Jr. | Villain |
| Steve Rogers | Chris Evans | Avengers |
| Thor | Chris Hemsworth | Avengers |
| Shang-Chi | Simu Liu | Avengers |
| Ant-Man | Paul Rudd | Avengers |
| Yelena Belova | Florence Pugh | Thunderbolts |
| Sam Wilson | Anthony Mackie | Avengers |
| Bucky Barnes | Sebastian Stan | Thunderbolts |
| Ghost | Hannah John-Kamen | Thunderbolts |
| John Walker | Wyatt Russell | Thunderbolts |
| Professor Xavier | Patrick Stewart | X-Men |
| Cyclops | James Marsden | X-Men |
| Gambit | Channing Tatum | X-Men |
| Mystique | Rebecca Romijn | X-Men |
| Magneto | Ian McKellen | X-Men |
| Nightcrawler | Alan Cumming | X-Men |
| Beast | Kelsey Grammer | X-Men |
| Reed Richards | Pedro Pascal | Fantastic Four |
| Sue Storm | Vanessa Kirby | Fantastic Four |
| Johnny Storm | Joseph Quinn | Fantastic Four |
| Ben Grimm | Ebon Moss-Bachrach | Fantastic Four |
| Shuri | Letitia Wright | Wakanda |
| Namor | Tenoch Huerta | Atlantis |
| Cassie Lang | Kathryn Newton | Avengers |
| Loki | Tom Hiddleston | Wild Card |

Additional cast members spotted include Lewis Pullman, Danny Ramirez, David Harbour, and Winston Duke.

## What This Means for Card Collectors

Every character confirmed in this trailer is now a verified Doomsday card target. For collectors tracking the [Rise of Doom](https://riseofdoom.com/) and its impact on the Marvel card market, the key takeaways are:

**Doctor Doom cards** are about to enter a new tier. Doom catching Stormbreaker with bare hands is the kind of iconic moment that drives card values — similar to Thanos snapping in Infinity War.

**Steve Rogers / Captain America cards** just became significantly more valuable. His return was the trailer's biggest surprise, and summoning Mjolnir from Thor's hand is an instant-classic MCU moment.

**X-Men cards** — particularly Cyclops, Gambit, and Mystique — are now confirmed MCU characters. Legacy X-Men actors in MCU costumes will drive collector demand.

**Cassie Lang cards** are a sleeper pick. Her first confirmation in Doomsday could make early Cassie cards a value play.

---

*The trailer has not been released online. It may debut publicly with The Mandalorian and Grogu in late May 2026. Sources: [Variety](https://variety.com/2026/film/news/avengers-doomsday-trailer-robert-downey-jr-doctor-doom-1236719804/), [IGN](https://www.ign.com/articles/disney-debuts-new-avengers-doomsday-trailer-at-cinemacon-2026), [Deadline](https://deadline.com/2026/04/avengers-doomsday-drop-new-trailer-cinemacon-1236863482/)*`,
    featuredImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-trailer-breakdown-2jrj58Xf9cirsiMi2ZuHk9.webp",
    category: "movie_news",
    tags: JSON.stringify(["Avengers", "Doomsday", "Trailer", "CinemaCon", "Doctor Doom", "Steve Rogers", "Thor", "X-Men", "Fantastic Four"]),
    cardMarketImpact: "Every character in the trailer is now a verified Doomsday card target. Doom catching Stormbreaker and Steve Rogers summoning Mjolnir are instant-classic moments that will drive card values.",
    relatedCharacters: JSON.stringify(["Doctor Doom", "Captain America", "Thor", "Shang-Chi", "Cyclops", "Gambit", "Mystique", "Professor X", "Namor", "Ant-Man"]),
    sources: JSON.stringify([
      { title: "Variety — Avengers Doomsday Trailer", url: "https://variety.com/2026/film/news/avengers-doomsday-trailer-robert-downey-jr-doctor-doom-1236719804/" },
      { title: "IGN — Disney Debuts New Doomsday Trailer", url: "https://www.ign.com/articles/disney-debuts-new-avengers-doomsday-trailer-at-cinemacon-2026" },
      { title: "Deadline — Avengers Doomsday New Trailer CinemaCon", url: "https://deadline.com/2026/04/avengers-doomsday-drop-new-trailer-cinemacon-1236863482/" }
    ]),
    isFeatured: false,
    isPublished: false,
    authorName: "NLF Team",
    publishedAt: null,
    metaDescription: "Complete scene-by-scene breakdown of the Avengers: Doomsday trailer debuted at CinemaCon 2026. Every character, every detail, every moment analyzed."
  },

  // ===== ARTICLE 3: Steve Rogers Returns (11am tomorrow) =====
  {
    title: "Steve Rogers Is Back: How Chris Evans Returns to the MCU and Why It Changes Everything",
    slug: "steve-rogers-returns-chris-evans-mcu-doomsday",
    excerpt: "The CinemaCon Doomsday trailer ended with the biggest surprise in MCU history since 'I am Iron Man.' Chris Evans is back as Steve Rogers — and he's wielding Mjolnir.",
    contentMarkdown: `When Chris Evans walked on stage at CinemaCon alongside Robert Downey Jr., the audience already knew something special was happening. But nothing could have prepared them for what the trailer revealed: **Steve Rogers is back in the MCU**, and he's more powerful than ever.

The final moments of the Avengers: Doomsday CinemaCon trailer delivered what may be the single most crowd-pleasing moment in MCU trailer history. After Thor's Stormbreaker is caught by Doom's bare hands — establishing the villain as an unprecedented threat — Thor utters the line *"We're going to need a miracle."*

Then Steve Rogers appears. Long-haired. Scraggly. Battle-worn. He delivers two words: **"Hey pal."**

And then he summons Mjolnir. Not from the ground. Not from across the room. **From Thor's own hand.** The hammer flies from the God of Thunder to the First Avenger, and the message is clear: Steve Rogers isn't just back — he may be the most powerful hero on the field.

## How Is This Possible?

The last time we saw Steve Rogers in the MCU, he was an old man sitting on a bench in Avengers: Endgame, having lived a full life with Peggy Carter after returning the Infinity Stones. He passed his shield to Sam Wilson and seemingly retired from heroics forever.

So how is he back — young, strong, and apparently more powerful than before?

The MCU hasn't explained this yet, but the trailer provides clues. Rogers' appearance is notably different from any previous film. He's long-haired and rugged — more so than even his Infinity War look when he was a fugitive. This suggests he's been through something significant between Endgame and Doomsday. The multiverse is the most likely explanation, given that Doomsday deals directly with multiversal threats.

## The Mjolnir Moment

Steve Rogers lifting Mjolnir in Endgame was already one of the most celebrated moments in MCU history. But summoning it **from Thor's hand** takes the concept to an entirely new level.

In Endgame, Rogers picked up Mjolnir during the final battle — proving he was worthy. But the hammer still responded to Thor as its primary wielder. In the Doomsday trailer, Mjolnir actively leaves Thor and goes to Steve, suggesting that Rogers' worthiness now **supersedes** Thor's claim to the weapon.

This has massive implications for the power dynamics in Doomsday. If Doom can catch Stormbreaker but Rogers can command Mjolnir at will, the film may be setting up Steve Rogers — not Thor, not Iron Man's successor — as the key to defeating Doctor Doom.

## What Chris Evans Said

Evans and Downey Jr. appeared together on the CinemaCon stage, marking the first time both actors have been at the same Marvel event since Endgame's premiere in 2019. While specific quotes from the stage presentation are limited, the pairing itself is significant — it signals that the Rogers/Stark dynamic (now Rogers/Doom) will be central to the film's emotional core.

The fact that Evans kept his return secret for this long is remarkable in an era of constant leaks and spoilers. While previous teasers had hinted at Steve Rogers' involvement, the CinemaCon trailer is the first time we've seen Evans in character as the young, active Captain America since Endgame.

## Card Market Impact

For collectors, Steve Rogers' confirmed return is a seismic event. Here's what to watch:

**Captain America / Steve Rogers cards** across all sets are now premium targets. Cards featuring Rogers wielding Mjolnir — particularly from the Endgame era — could see significant price movement as the Doomsday hype builds.

**Chris Evans autograph cards** are among the most sought-after in the Marvel card hobby. His confirmed return to the MCU adds a new layer of relevance to every Evans auto in circulation.

The 2025 Topps Chrome and Comic Book Heroes sets both feature multiple Captain America cards. For collectors looking to track values and find deals, sites like [MintComicCards.com](https://mintcomiccards.com/) offer comprehensive card listings and market data.

**Mjolnir-themed cards** — any card depicting Thor's hammer or the "worthy" moment from Endgame — could become crossover collectibles as the Doomsday marketing ramps up.

## The Bigger Question

Steve Rogers' return raises a fundamental question about Avengers: Doomsday's story: **why does the universe need Steve Rogers back?**

The MCU currently has Sam Wilson as Captain America, a full roster of Avengers, the Thunderbolts, the Fantastic Four, and now the X-Men. That's more firepower than the heroes have ever had. If they still need Steve Rogers — if the situation is so dire that the original Captain America must return from retirement — then Doctor Doom represents a threat unlike anything the MCU has faced.

That's exactly the kind of stakes that make a movie feel like an event. And it's exactly the kind of stakes that drive collector markets.

---

*Avengers: Doomsday releases December 18, 2026. The CinemaCon trailer has not been released online yet.*`,
    featuredImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/steve-rogers-returns-MuZwxfbEUnKphSB7qoejup.webp",
    category: "movie_news",
    tags: JSON.stringify(["Steve Rogers", "Captain America", "Chris Evans", "Mjolnir", "Avengers", "Doomsday", "CinemaCon", "MCU"]),
    cardMarketImpact: "Steve Rogers' return is a seismic event for collectors. Captain America cards, Chris Evans autos, and Mjolnir-themed cards are all premium targets as Doomsday hype builds.",
    relatedCharacters: JSON.stringify(["Captain America", "Thor", "Doctor Doom", "Sam Wilson"]),
    sources: JSON.stringify([
      { title: "Variety — Avengers Doomsday Trailer", url: "https://variety.com/2026/film/news/avengers-doomsday-trailer-robert-downey-jr-doctor-doom-1236719804/" },
      { title: "IGN — Disney Debuts New Doomsday Trailer", url: "https://www.ign.com/articles/disney-debuts-new-avengers-doomsday-trailer-at-cinemacon-2026" }
    ]),
    isFeatured: false,
    isPublished: false,
    authorName: "NLF Team",
    publishedAt: null,
    metaDescription: "Chris Evans returns as Steve Rogers in Avengers: Doomsday. The CinemaCon trailer shows him summoning Mjolnir from Thor's hand. Here's what it means for the MCU and card collectors."
  },

  // ===== ARTICLE 4: X-Men Meet the Avengers (3pm tomorrow) =====
  {
    title: "X-Men Meet the Avengers: Every Mutant Confirmed for Doomsday and What It Means",
    slug: "xmen-meet-avengers-every-mutant-confirmed-doomsday",
    excerpt: "The CinemaCon trailer confirmed what fans have dreamed about for decades: the X-Men are in the MCU. Here's every mutant confirmed for Avengers: Doomsday and how they fit into the story.",
    contentMarkdown: `For over twenty years, Marvel fans have imagined what it would look like to see the X-Men and the Avengers share the screen. Rights issues between Fox and Marvel Studios made it seem impossible. Then Disney acquired Fox in 2019, and the countdown began. Seven years later, the Avengers: Doomsday CinemaCon trailer made it official: **the X-Men are in the MCU**.

And they didn't bring just one or two mutants. They brought the entire legacy roster.

## Every Confirmed Mutant

The CinemaCon trailer and accompanying reports confirm the following X-Men characters in Avengers: Doomsday:

| Character | Actor | First X-Men Film |
|-----------|-------|-------------------|
| Professor Xavier | Patrick Stewart | X-Men (2000) |
| Magneto | Ian McKellen | X-Men (2000) |
| Cyclops | James Marsden | X-Men (2000) |
| Mystique | Rebecca Romijn | X-Men (2000) |
| Nightcrawler | Alan Cumming | X2 (2003) |
| Beast | Kelsey Grammer | X-Men: The Last Stand (2006) |
| Gambit | Channing Tatum | Deadpool & Wolverine (2024) |

This is not a reboot. These are the **original Fox X-Men actors** reprising their roles — the same versions of these characters that audiences have known since 2000. Patrick Stewart first played Professor Xavier twenty-six years ago. Ian McKellen first played Magneto in the same film. Bringing them back for Doomsday is a love letter to the entire history of Marvel on screen.

## How They Fit Into the Story

The trailer opens at the **Xavier Institute**, immediately establishing that the X-Men's world exists within the Doomsday timeline. Professor Xavier is shown looking up at a bright light in the sky — likely the same multiversal threat that brings Doom into the picture.

The most telling scene is **Shang-Chi fighting Gambit inside the X-Mansion**. This suggests that the initial meeting between the MCU heroes and the X-Men is not entirely friendly. There's tension. Distrust. Different teams from different worlds being forced to work together against a common enemy — classic Marvel storytelling.

James Marsden's Cyclops appears in a **comics-accurate suit**, which drew massive cheers from the CinemaCon audience. Cyclops was famously underutilized in the original Fox films, often sidelined in favor of Wolverine. Doomsday appears to be giving him the spotlight he deserves.

Rebecca Romijn's Mystique pulls off one of her signature moves — **transforming into Florence Pugh's Yelena Belova** and creating a Pugh-vs-Pugh fight sequence. This is exactly the kind of creative action scene that the X-Men/Avengers crossover makes possible.

## The Wolverine Question

The most notable absence from the confirmed cast is **Wolverine**. Hugh Jackman is not listed among the CinemaCon reveals, and no Wolverine footage was described in the trailer. However, this doesn't necessarily mean Logan won't appear — Marvel may be saving his reveal for the public trailer or for the film itself.

Given that Jackman appeared in Deadpool and Wolverine just two years ago, his absence from Doomsday would be surprising. The smart money says Marvel is holding Wolverine as a surprise — potentially the film's biggest reveal.

## What This Means for Card Collectors

The X-Men integration into the MCU is the single biggest event for Marvel card collectors since the Infinity Saga. Here's why:

**Legacy X-Men cards** just became MCU cards. Every card featuring Patrick Stewart's Xavier, Ian McKellen's Magneto, or James Marsden's Cyclops now has dual relevance — they're both Fox X-Men collectibles AND MCU collectibles. That crossover appeal drives demand.

**Gambit cards** are particularly interesting. Channing Tatum's Gambit debuted in Deadpool and Wolverine and was an instant fan favorite. His confirmed role in Doomsday validates the character's staying power and makes early Gambit cards a strong hold.

**Cyclops cards** could be sleeper picks. If Doomsday gives Cyclops the spotlight the Fox films never did, his cards could see significant movement — especially comics-accurate versions that match his new MCU suit.

For collectors tracking X-Men card values and availability, [MintComicCards.com](https://mintcomiccards.com/) maintains comprehensive listings across multiple Marvel card sets including X-Men inserts and character cards.

## The Dream Realized

There's something profound about seeing Patrick Stewart and Ian McKellen — actors who defined these characters a generation ago — sharing the screen with Robert Downey Jr., Chris Evans, and Chris Hemsworth. It's the culmination of everything Marvel has built since 2008. Two separate cinematic universes, twenty-six years of storytelling, finally united against a single threat.

Doctor Doom isn't just fighting the Avengers. He's fighting the entire history of Marvel on film. And that's what makes Doomsday feel like the biggest event since Endgame.

---

*Avengers: Doomsday releases December 18, 2026.*`,
    featuredImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/xmen-meet-avengers-cHuYJmTtT2HT3TtDkEfa4W.webp",
    category: "movie_news",
    tags: JSON.stringify(["X-Men", "Avengers", "Doomsday", "Professor Xavier", "Magneto", "Cyclops", "Gambit", "Mystique", "MCU", "CinemaCon"]),
    cardMarketImpact: "Legacy X-Men cards are now MCU cards with dual relevance. Gambit, Cyclops, and Professor Xavier cards are all strong targets. Wolverine's absence may be a strategic hold for a bigger reveal.",
    relatedCharacters: JSON.stringify(["Professor X", "Magneto", "Cyclops", "Gambit", "Mystique", "Nightcrawler", "Beast", "Wolverine"]),
    sources: JSON.stringify([
      { title: "Variety — Avengers Doomsday Trailer", url: "https://variety.com/2026/film/news/avengers-doomsday-trailer-robert-downey-jr-doctor-doom-1236719804/" },
      { title: "IGN — Disney Debuts New Doomsday Trailer", url: "https://www.ign.com/articles/disney-debuts-new-avengers-doomsday-trailer-at-cinemacon-2026" },
      { title: "Deadline — Avengers Doomsday New Trailer CinemaCon", url: "https://deadline.com/2026/04/avengers-doomsday-drop-new-trailer-cinemacon-1236863482/" }
    ]),
    isFeatured: false,
    isPublished: false,
    authorName: "NLF Team",
    publishedAt: null,
    metaDescription: "Every X-Men mutant confirmed for Avengers: Doomsday. Patrick Stewart, Ian McKellen, James Marsden, and more legacy actors return. What it means for the MCU and card collectors."
  },

  // ===== ARTICLE 5: Doom Catches Mjolnir (6pm tomorrow) =====
  {
    title: "Doom Catches Stormbreaker: Why Doctor Doom Is Already the Most Powerful MCU Villain",
    slug: "doom-catches-stormbreaker-most-powerful-mcu-villain",
    excerpt: "In one moment, the CinemaCon trailer established Doctor Doom as a threat beyond Thanos. Catching Thor's Stormbreaker with bare hands is just the beginning.",
    contentMarkdown: `Every great MCU phase is defined by its villain. Phase 1 had Loki. The Infinity Saga had Thanos. And now, the Multiverse Saga has **Doctor Doom** — and the CinemaCon trailer just established him as the most terrifying threat the MCU has ever seen.

The moment that defined the entire Doomsday trailer wasn't a hero shot. It wasn't a team assembly. It was a single, devastating display of power: **Thor leaps at Doom with Stormbreaker, and Doom catches it with his bare hands.**

Let that sink in. Stormbreaker — the weapon that was forged in a dying star, the axe that cut through a full Infinity Gauntlet blast from Thanos, the weapon that nearly killed the most powerful being in the universe — was stopped cold by Doctor Doom's armored fist.

## The Power Scale Just Changed

To understand why this moment is so significant, consider what Stormbreaker has done in the MCU:

| Stormbreaker Feat | Film | Result |
|-------------------|------|--------|
| Cut through Infinity Gauntlet beam | Infinity War | Nearly killed Thanos |
| Summoned the Bifrost | Multiple films | Transported armies across space |
| Wielded by Thor against Hela's forces | Various | Devastating battlefield weapon |
| Caught by Doctor Doom | Doomsday trailer | Stopped with bare hands |

Thanos with all six Infinity Stones couldn't stop Stormbreaker. Doom caught it like it was nothing. The implication is clear: **Doctor Doom is more powerful than Thanos.**

## How Is Doom This Powerful?

In the comics, Doctor Doom is simultaneously one of the greatest scientific minds and one of the most powerful sorcerers on Earth. He's a polymath who rivals Reed Richards in intellect and Doctor Strange in mystical ability. His armor is a masterpiece of technology enhanced by dark magic.

But even by comic standards, catching Stormbreaker suggests the MCU's version of Doom has access to power beyond what we've seen before. The most likely explanation ties into the Multiverse Saga's overarching narrative — Doom may have harnessed multiversal energy or the power of the Beyonders, entities from Marvel comics who exist beyond the multiverse itself.

Robert Downey Jr.'s portrayal adds another layer. His Doom speaks with an Eastern European accent and carries himself with absolute authority. This isn't a villain who monologues about his plan — this is a villain who demonstrates his superiority through action. Catching Stormbreaker isn't a boast. It's a statement of fact.

## The RDJ Factor

Casting Robert Downey Jr. as Doctor Doom was the most audacious move in MCU history. The man who defined Tony Stark for over a decade is now playing the MCU's greatest villain. And based on the CinemaCon trailer, it's working.

Reports from attendees describe RDJ's Doom as completely distinct from Stark. The voice is different — that Eastern European accent creates immediate separation. The body language is different — where Stark was loose and quippy, Doom is rigid and commanding. The energy is different — Stark was a hero who struggled with his demons, while Doom is a force of nature who has already conquered his.

The Russos clearly understand that the key to making Doom work is making audiences forget they're watching the same actor who played Iron Man. Based on CinemaCon reactions, they've succeeded.

## Doom vs. Thanos: The Villain Comparison

| Category | Thanos | Doctor Doom |
|----------|--------|-------------|
| Power Source | Infinity Stones (external) | Technology + Sorcery (internal) |
| Motivation | "Balance" the universe | Absolute dominion |
| Threat Level | Universal | Multiversal |
| Stormbreaker | Nearly killed by it | Caught it bare-handed |
| Actor | Josh Brolin | Robert Downey Jr. |
| Films | 2 Avengers films | 2 Avengers films (Doomsday + Secret Wars) |

The critical difference is that Thanos needed the Infinity Stones to reach his peak power. Doom appears to be operating at peak power through his own abilities. That makes him a fundamentally different kind of threat — one that can't be defeated by simply removing a weapon or destroying a gauntlet.

## What This Means for Card Collectors

Doctor Doom cards have been climbing steadily since the RDJ casting announcement at SDCC 2024. The CinemaCon trailer — specifically the Stormbreaker catch — is the kind of iconic moment that creates permanent value in the card market.

For collectors tracking Doom's rise, [ComicBookCard.com](https://comicbookcard.com/) offers comprehensive listings of Doctor Doom cards across multiple sets, including the 2025 Topps Chrome and Comic Book Heroes inserts that feature Victor Von Doom prominently.

**Key cards to watch:**
- Any Doctor Doom card from 2025 Topps Chrome (especially refractors and numbered parallels)
- Comic Book Heroes insert cards featuring Doom
- Marvel Mint Doom cards
- Any future Doomsday movie tie-in cards (expected to release closer to December)

The Stormbreaker catch will almost certainly be immortalized in future card sets. When those cards drop, the first-print versions will be highly sought after.

## The Villain We Deserve

After years of MCU villains who were defeated in a single film, Doctor Doom represents something different. He's a two-film villain — Doomsday and Secret Wars — which gives him the same narrative weight that Thanos had across Infinity War and Endgame. He's played by the MCU's most iconic actor. And he just demonstrated power that exceeds anything we've seen before.

Doom doesn't just catch Stormbreaker. He catches the audience's attention. And he's not letting go.

---

*Avengers: Doomsday releases December 18, 2026.*`,
    featuredImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-catches-mjolnir-D7AxWg9SwKaGZft6vSJmLK.webp",
    category: "analysis",
    tags: JSON.stringify(["Doctor Doom", "Stormbreaker", "Thor", "Thanos", "Robert Downey Jr", "Avengers", "Doomsday", "MCU", "Villain"]),
    cardMarketImpact: "Doctor Doom cards climbing since SDCC 2024 casting. The Stormbreaker catch is an iconic moment that creates permanent card value. Chrome refractors and numbered parallels are key targets.",
    relatedCharacters: JSON.stringify(["Doctor Doom", "Thor", "Thanos", "Iron Man"]),
    sources: JSON.stringify([
      { title: "Variety — Avengers Doomsday Trailer", url: "https://variety.com/2026/film/news/avengers-doomsday-trailer-robert-downey-jr-doctor-doom-1236719804/" },
      { title: "IGN — Disney Debuts New Doomsday Trailer", url: "https://www.ign.com/articles/disney-debuts-new-avengers-doomsday-trailer-at-cinemacon-2026" },
      { title: "Deadline — Avengers Doomsday New Trailer CinemaCon", url: "https://deadline.com/2026/04/avengers-doomsday-drop-new-trailer-cinemacon-1236863482/" }
    ]),
    isFeatured: false,
    isPublished: false,
    authorName: "NLF Team",
    publishedAt: null,
    metaDescription: "Doctor Doom catches Thor's Stormbreaker with bare hands in the Doomsday trailer. Analysis of why Doom is already the most powerful MCU villain and what it means for card collectors."
  },

  // ===== ARTICLE 6: Dune 3 vs Doomsday Box Office (bonus - 6pm or later) =====
  {
    title: "Dune 3 vs. Doomsday: The December Box Office War Just Escalated at CinemaCon",
    slug: "dune-3-vs-doomsday-december-box-office-war-cinemacon",
    excerpt: "Disney launched Infinity Vision. Warner Bros. has IMAX locked. Both films open December 18. CinemaCon just turned the biggest box office showdown of 2026 into an all-out war.",
    contentMarkdown: `December 18, 2026 is shaping up to be the most consequential day in modern box office history. Two of the biggest franchises in cinema — **Avengers: Doomsday** and **Dune: Part Three** — will go head-to-head on the same release date, competing for the same audiences, the same screens, and the same holiday dollars.

CinemaCon 2026 just made this showdown even more intense. In the span of a single day, Disney launched an entirely new premium theater format (Infinity Vision) specifically to counter Warner Bros.' IMAX exclusivity deal with Dune 3. The battle lines are drawn, and neither studio is backing down.

## The IMAX Lockout

The core issue is straightforward: **Warner Bros. secured a three-week exclusive IMAX deal for Dune: Part Three** back in June 2024. IMAX has confirmed they are honoring this deal. That means for the first three weeks of release — the most critical window for any blockbuster — **Avengers: Doomsday will not play on a single IMAX screen in the world.**

According to [Forbes citing Cinelytics data](https://www.forbes.com/sites/dbloom/2026/04/11/avengers-biggest-battle-taking-on-dune-part-three-at-christmas/), this translates to a significant financial hit. IMAX screens typically generate a disproportionate share of a blockbuster's revenue. Losing them means Doomsday will receive only a 3.5% "true" IMAX boost instead of the much larger premium format premium that films like Infinity War and Endgame enjoyed.

For a film projected to gross over $1 billion worldwide, that difference could mean **$30-50 million in lost revenue** during the opening weeks alone.

## Disney's Counter-Move: Infinity Vision

Rather than move Doomsday's release date — which Marvel Studios has publicly refused to do — Disney chose to fight. Infinity Vision, announced today at CinemaCon, certifies 75 domestic and 300 international premium large format theaters as the best alternative to IMAX.

The strategy is clear: if audiences can't see Doomsday in IMAX, Disney wants them to see it in the next best thing — and they want a brand name attached to that experience. Infinity Vision is that brand.

The Avengers: Endgame re-release in September serves as both a test run and a marketing campaign. By the time Doomsday opens in December, Disney wants "Infinity Vision" to be a recognized premium brand that audiences actively seek out.

## The Numbers Game

Early projections paint a fascinating picture of the December showdown:

| Metric | Avengers: Doomsday | Dune: Part Three |
|--------|-------------------|------------------|
| Release Date | December 18, 2026 | December 18, 2026 |
| IMAX Access | None (first 3 weeks) | Exclusive 3-week run |
| Premium Format | Infinity Vision (375 screens) | IMAX (1,700+ screens) |
| Projected Opening Weekend | $250-350M domestic | $80-120M domestic |
| Franchise Track Record | Endgame: $357M opening | Dune 2: $82M opening |
| Trailer Views (first 36 hours) | TBD (not public yet) | 36M+ (per Collider) |

The raw numbers favor Doomsday — the Avengers franchise has a much larger built-in audience than Dune. But Dune 3 has the IMAX advantage, and IMAX audiences tend to be the most dedicated, highest-spending moviegoers. Dune's IMAX 70mm showings are already selling tickets months in advance.

[Collider reports](https://collider.com/dune-3-overtakes-avengers-doomsday-trailer-views-36-million/) that Dune 3's trailer has already surpassed Doomsday in views — though this comparison is somewhat unfair since Doomsday's full trailer hasn't been released publicly yet.

## Why Neither Studio Will Blink

The question everyone asks is: why don't they just move one of the films? The answer comes down to strategy and pride.

**Disney won't move Doomsday** because December is the optimal release window for a massive event film. The holiday season provides extended legs at the box office — families see movies multiple times over winter break. Moving to another date risks losing that extended run. Marvel Studios has also publicly stated they're keeping the December 18 date, making any change now a public admission of weakness.

**Warner Bros. won't move Dune 3** because they have the IMAX advantage and no incentive to give it up. Denis Villeneuve's Dune films are IMAX showcases — the expanded aspect ratio and immersive sound are central to the experience. Moving Dune away from IMAX's prime holiday window would undermine the film's core appeal.

The result is a genuine standoff — two studios, two franchises, one date, and neither willing to yield.

## What This Means for Collectors

The Doomsday vs. Dune 3 battle is more than a box office story — it's a cultural moment that will generate massive media coverage throughout the fall. Every article comparing the two films, every social media debate, every ticket sales update will keep Doomsday in the news cycle for months.

For Marvel card collectors, sustained media attention translates directly to sustained market interest. The longer Doomsday stays in the cultural conversation, the more demand there is for Doomsday-related cards.

For collectors following both the MCU and broader pop culture trends, [Rise of Doom](https://riseofdoom.com/) tracks the cultural impact of Doctor Doom across media, providing context for how the character's growing prominence affects collectible values.

The December showdown also creates a unique marketing dynamic: Disney will be promoting Doomsday more aggressively than any previous MCU film specifically because they need to overcome the IMAX disadvantage. More marketing means more character reveals, more trailer moments, and more card-market-moving events between now and December.

## The Verdict

CinemaCon 2026 didn't resolve the Dune 3 vs. Doomsday battle — it escalated it. Disney is building an entirely new theater brand to compete. Warner Bros. has IMAX locked down. Both films will open on the same day, and both will be massive.

The real winner? Audiences. December 2026 is going to be the best month for moviegoing in years.

---

*Avengers: Doomsday and Dune: Part Three both release December 18, 2026.*`,
    featuredImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/dune-vs-doomsday-boxoffice-TGHdyE7Wg3bpyaNZESy8Mj.webp",
    category: "analysis",
    tags: JSON.stringify(["Dune", "Avengers", "Doomsday", "Box Office", "IMAX", "Infinity Vision", "December 2026", "CinemaCon"]),
    cardMarketImpact: "Sustained media coverage of the Doomsday vs Dune battle keeps Marvel cards in the cultural conversation. More Disney marketing means more character reveals and card-market-moving events.",
    relatedCharacters: JSON.stringify(["Doctor Doom", "Iron Man", "Captain America", "Thor"]),
    sources: JSON.stringify([
      { title: "Forbes — Avengers' Biggest Battle: Taking On Dune", url: "https://www.forbes.com/sites/dbloom/2026/04/11/avengers-biggest-battle-taking-on-dune-part-three-at-christmas/" },
      { title: "Collider — Dune 3 Overtakes Doomsday Trailer Views", url: "https://collider.com/dune-3-overtakes-avengers-doomsday-trailer-views-36-million/" },
      { title: "The Direct — Marvel Sets Record Straight on Release Date", url: "https://thedirect.com/article/marvel-studios-record-straight-avengers-doomsday-release-change" },
      { title: "Disney — Infinity Vision Launch", url: "https://thewaltdisneycompany.com/news/infinity-vision-movie-theaters/" }
    ]),
    isFeatured: false,
    isPublished: false,
    authorName: "NLF Team",
    publishedAt: null,
    metaDescription: "Dune 3 vs Avengers Doomsday: both open December 18, 2026. Disney launched Infinity Vision to counter IMAX's Dune deal. Full analysis of the biggest box office showdown of the year."
  }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  for (const article of articles) {
    const [existing] = await connection.execute(
      'SELECT id FROM articles WHERE slug = ?',
      [article.slug]
    );
    
    if (existing.length > 0) {
      console.log(`Article "${article.slug}" already exists, updating...`);
      await connection.execute(
        `UPDATE articles SET title=?, excerpt=?, contentMarkdown=?, featuredImageUrl=?, category=?, tags=?, cardMarketImpact=?, relatedCharacters=?, sources=?, isFeatured=?, isPublished=?, authorName=?, publishedAt=?, metaDescription=? WHERE slug=?`,
        [article.title, article.excerpt, article.contentMarkdown, article.featuredImageUrl, article.category, article.tags, article.cardMarketImpact, article.relatedCharacters, article.sources, article.isFeatured, article.isPublished, article.authorName, article.publishedAt, article.metaDescription, article.slug]
      );
      console.log(`  ✅ Updated`);
    } else {
      console.log(`Creating article: "${article.slug}"...`);
      await connection.execute(
        `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [article.title, article.slug, article.excerpt, article.contentMarkdown, article.featuredImageUrl, article.category, article.tags, article.cardMarketImpact, article.relatedCharacters, article.sources, article.isFeatured, article.isPublished, article.authorName, article.publishedAt, article.metaDescription]
      );
      console.log(`  ✅ Created`);
    }
  }
  
  // Verify all articles
  const [rows] = await connection.execute(
    'SELECT id, title, slug, isPublished, isFeatured FROM articles ORDER BY id DESC LIMIT 10'
  );
  console.log("\n=== Recent Articles ===");
  rows.forEach(r => console.log(`  [${r.isPublished ? 'PUBLISHED' : 'DRAFT'}] ${r.title}`));
  
  await connection.end();
  console.log("\nDone! 1 published, 5 drafts ready for scheduled publishing.");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
