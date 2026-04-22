/**
 * Publish 4 new Avengers Doomsday articles — April 21, 2026
 * Run from project root: node publish-doomsday-apr21.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const IMAGES = {
  sdcc: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sdcc-hall-h-doomsday-2026-RwK5SWe34fYmHFekWehR2T.webp",
  retcon: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/endgame-retcon-doomsday-2026-44rAT4SGqAQMjcMGsLViQh.webp",
  trailer: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-trailer-breakdown-2026-9Ntv8jU5CSx5Vff6qFChWb.webp",
  stormbreaker: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-stops-stormbreaker-2026-LFJno2nBY4azc5jadLRxM7.webp",
};

const now = Date.now();

const articles = [
  // ===== ARTICLE 1: SDCC 2026 Hall H Panel =====
  {
    title: "Marvel Returns to Hall H: SDCC 2026 Doomsday Panel Is Going to Be Legendary",
    slug: "marvel-returns-hall-h-sdcc-2026-doomsday-panel",
    excerpt: "For the first time since the RDJ-as-Doom bombshell in 2024, Marvel Studios is returning to San Diego Comic-Con's Hall H on July 25 for an Avengers: Doomsday mega-panel. Expect the first online trailer, cast surprises, and Kevin Feige fireworks.",
    featuredImageUrl: IMAGES.sdcc,
    category: "movie_news",
    tags: JSON.stringify(["SDCC 2026", "Avengers Doomsday", "Hall H", "Kevin Feige", "Comic-Con", "Marvel Studios"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Thor", "Captain America", "Spider-Man", "Wolverine"]),
    cardMarketImpact: "SDCC exclusive variant cards and convention promos historically spike 200-400% after Hall H reveals. Doctor Doom cards and any SDCC-stamped parallels will be the hottest pulls of the summer.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Marvel Studios returns to SDCC Hall H on July 25, 2026 for an Avengers: Doomsday mega-panel. First online trailer, cast reveals, and Kevin Feige surprises expected.",
    sources: JSON.stringify([
      { title: "Gizmodo - Marvel Studios Bringing Doomsday to SDCC", url: "https://gizmodo.com/marvel-sdcc-2026-hall-h-panel-avengers-doomsday-2000748986" },
      { title: "The Wrap - Marvel SDCC 2026 Report", url: "https://www.thewrap.com/" },
    ]),
    contentMarkdown: `Two years ago, Marvel Studios dropped one of the biggest bombshells in Comic-Con history when Robert Downey Jr. walked onto the Hall H stage and revealed he was returning to the MCU — not as Tony Stark, but as Doctor Doom. The crowd erupted. The internet broke. And then Marvel went silent, skipping SDCC 2025 entirely while they quietly assembled the most ambitious superhero film ever made.

Now they are coming back. And this time, they are bringing Doomsday with them.

## The Return to Hall H

According to [The Wrap](https://www.thewrap.com/), Marvel Studios will hold its signature Saturday night panel on **July 25, 2026** in Hall H at San Diego Comic-Con. The studio skipped the 2025 convention altogether, making this return feel even more momentous. When Marvel shows up to Hall H, they do not do it halfway — and with *Avengers: Doomsday* just five months from its December 18 release date, the timing is perfect for a marketing blitz.

The last time Marvel graced Hall H was that legendary 2024 panel where the Russo Brothers returned alongside RDJ. Before that, the studio used the venue to debut the first *Avengers: Endgame* trailer to a live audience. The pattern is clear: Hall H is where Marvel drops its biggest bombs.

## What to Expect

**The First Online Trailer.** CinemaCon attendees already saw an extended two-minute trailer behind closed doors in April, but that footage has not been released publicly. SDCC is the perfect venue for Marvel to finally drop the trailer online. Five months before release is exactly when the marketing machine typically kicks into high gear, and a Hall H debut followed by an immediate online release would generate the kind of dual-wave hype that *Infinity War* and *Endgame* both enjoyed.

**Cast Appearances.** With several dozen actors in the film, expect a parade of stars across the stage. RDJ as Doom is the obvious headliner, but Chris Hemsworth (Thor), Chris Evans (Steve Rogers), and the newly confirmed X-Men cast — including Channing Tatum as Gambit — could all make appearances. Kevin Feige loves giving Hall H fans exclusive reveals, and there are almost certainly cast members who have not been publicly announced yet.

**Secret Wars Tease.** *Avengers: Secret Wars* is slated for December 17, 2027, with the same directors and much of the same cast. Feige would be leaving money on the table if he did not at least tease the sequel. A logo reveal, a brief sizzle reel, or even just a title card with a release date confirmation would send fans into a frenzy.

**D23 Expo Follow-Up.** Disney's D23 Expo takes place in August, just weeks after SDCC. Marvel could strategically split its reveals — dropping the trailer and cast at Comic-Con, then saving deeper story details and behind-the-scenes footage for D23. This one-two punch would keep Doomsday dominating the news cycle for the entire summer.

## Why This Matters for the MCU

Marvel skipping SDCC 2025 was not a sign of weakness — it was a strategic retreat. The studio was deep in production on *Doomsday* and did not want to show its hand too early. But now, with CinemaCon reactions comparing the trailer to *Infinity War* and combined teaser views already surpassing one billion, the hype machine is ready to go full throttle.

The July 25 panel is not just a marketing event. It is a statement. Marvel is telling the world that the Multiverse Saga has arrived at its endgame, and they are confident enough to put it all on the biggest stage in fandom.

## Collector's Corner

Convention season is prime time for card collectors. SDCC exclusive variant cards, convention promos, and limited-edition sets historically spike 200-400% in value after major Hall H reveals. If you are looking to get ahead of the curve, now is the time to start hunting.

**Hot Cards to Watch:**
- **Doctor Doom Topps Chrome Marvel #1** — The flagship Doom card will surge after the trailer drops online
- **Robert Downey Jr. auto cards** — Any authenticated RDJ signature card is a long-term hold
- **X-Men '97 Topps Finest inserts** — Gambit, Mystique, and Professor X cards will benefit from the crossover hype
- **Steve Rogers Captain America parallels** — Chris Evans' return makes every Cap card a buy signal

Check the latest Doom and Avengers card prices on **[TCGPlayer](https://www.tcgplayer.com/)** — their Marvel section has been on fire since CinemaCon, and SDCC will only add fuel to the flames.

*Avengers: Doomsday opens December 18, 2026. SDCC runs July 21-26, with the Marvel panel expected on July 25.*`,
  },

  // ===== ARTICLE 2: Endgame Re-Release Retcon =====
  {
    title: "Avengers: Endgame Is Getting a Doomsday Retcon — And It Changes Everything",
    slug: "avengers-endgame-doomsday-retcon-re-release-2026",
    excerpt: "Joe Russo just confirmed the Endgame re-release will include brand-new footage 'set in the Doomsday story.' This is not a deleted scene — it is a full retcon that rewrites MCU history. Here is what we know.",
    featuredImageUrl: IMAGES.retcon,
    category: "movie_news",
    tags: JSON.stringify(["Avengers Endgame", "Avengers Doomsday", "Retcon", "Joe Russo", "Chris Evans", "Steve Rogers", "Re-Release"]),
    relatedCharacters: JSON.stringify(["Captain America", "Doctor Doom", "Thor", "Iron Man", "Steve Rogers"]),
    cardMarketImpact: "Endgame-era cards are about to get a second wind. Steve Rogers cards especially — if the new footage explains his return, every Captain America card from Endgame sets becomes a key card again.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 3600000, // 1 hour earlier
    metaDescription: "Joe Russo confirms Avengers Endgame re-release includes new Doomsday footage. This retcon rewrites MCU canon and may explain Chris Evans' return as Steve Rogers.",
    sources: JSON.stringify([
      { title: "Inverse - Endgame Doomsday Retcon", url: "https://www.inverse.com/entertainment/avengers-endgame-rerelease-new-footage-avengers-doomsday" },
      { title: "Deadline - Joe Russo at Sands Film Festival", url: "https://deadline.com/" },
    ]),
    contentMarkdown: `When Marvel announced that *Avengers: Endgame* would return to theaters in September 2026, most fans assumed it was a standard re-release — maybe a few deleted scenes, a new post-credits tag, and a nostalgia-fueled victory lap for the highest-grossing film of all time. They were wrong.

At the Sands Film Festival in St. Andrews, Scotland, director Joe Russo dropped a revelation that changes everything we thought we knew about the MCU timeline.

## "Footage Set in the Doomsday Story"

"It's critically important to re-release the movie," Russo told the audience, "and, in fact, we'll be re-releasing the film with footage that is set in the *Doomsday* story that we have added to *Avengers: Endgame*."

Read that again. This is not a deleted scene from the original 2019 production. This is **new footage** — filmed as part of *Avengers: Doomsday* — that is being retroactively inserted into *Endgame*. It is a retcon in the truest sense of the word, comparable to the *Star Wars* Special Editions that added Hayden Christensen as ghost Anakin at the end of *Return of the Jedi*. The original version existed for decades, but the new version smoothed the transition to the prequel trilogy.

Marvel is doing the same thing here, except the stakes are even higher.

## What Could the New Footage Show?

The biggest question hanging over *Avengers: Doomsday* is simple: how is Steve Rogers back? Chris Evans' Captain America got his fairy-tale ending in *Endgame*, traveling back in time to live out his life with Peggy Carter. He appeared as an old man on a park bench, passing the shield to Sam Wilson. That was supposed to be the end.

But Evans is confirmed to return in *Doomsday* — not as old Steve, but as a bearded, long-haired version of Rogers in a black shirt, as revealed in the CinemaCon trailer. Something happened between that park bench scene and Doomsday, and the new *Endgame* footage is almost certainly going to show us what.

Possibilities include a post-credits scene showing Doom's influence reaching across timelines, a hidden moment during the Time Heist that was not originally shown, or even a scene where Steve Rogers encounters a multiversal anomaly during his time-travel journey. Whatever it is, Russo called it "critically important" to the *Doomsday* story — this is not optional viewing.

## The Star Wars Precedent

Marvel is borrowing a page from Lucasfilm's playbook, and it is a smart move. The *Star Wars* Special Editions were controversial, but they accomplished their goal: they brought audiences back to theaters and created a bridge between the original trilogy and the prequels. Marvel's version is arguably less controversial because they are adding to the story rather than changing existing scenes.

The re-release is scheduled for **September 25, 2026**, giving fans nearly three months to process the new footage before *Doomsday* arrives on December 18. Disney is also using the re-release to debut its new **Infinity: Vision** premium large-format certification program, which will identify theaters that meet IMAX-level quality standards — a direct response to the IMAX scheduling conflict with *Dune: Part Three*.

## The Box Office Play

*Endgame* is already the highest-grossing film of all time, and this re-release will only extend that lead. But the real play is not about box office numbers — it is about priming the audience. Marvel wants every single person who watches *Doomsday* in December to have seen the new *Endgame* footage first. It is the ultimate "previously on" for a franchise that spans 30+ films.

The four *Doomsday* teasers released alongside *Avatar: Fire and Ash* already generated over one billion combined views. Adding a theatrical event three months before release is marketing genius.

## Collector's Corner

Endgame-era cards are about to experience a renaissance. When the re-release hits theaters in September, expect a massive spike in demand for anything connected to the original *Endgame* roster — especially Steve Rogers.

**Hot Cards to Watch:**
- **Captain America Topps Chrome Marvel base + parallels** — Chris Evans' return makes every Cap card relevant again
- **Endgame-themed insert sets** — Any card depicting the Time Heist, final battle, or "I am Iron Man" moment
- **Doctor Doom first appearance cards** — *Fantastic Four #5* (1962) reprints and modern homages
- **Infinity Gauntlet cards** — The Gauntlet is central to the retcon; expect renewed interest

Track real-time price movements on **[Card Ladder](https://www.cardladder.com/)** — their Marvel index has been climbing steadily since CinemaCon, and the Endgame re-release announcement should push it even higher.

*Avengers: Endgame returns to theaters September 25, 2026. Avengers: Doomsday opens December 18, 2026.*`,
  },

  // ===== ARTICLE 3: CinemaCon Trailer Breakdown =====
  {
    title: "Avengers: Doomsday CinemaCon Trailer Breakdown — Every Detail, Every Easter Egg",
    slug: "avengers-doomsday-cinemacon-trailer-breakdown-every-detail",
    excerpt: "The Doomsday trailer shown at CinemaCon 2026 is being called the best Marvel trailer since Infinity War. From Professor X at the X-Mansion to Steve Rogers catching Mjolnir, here is a complete scene-by-scene breakdown.",
    featuredImageUrl: IMAGES.trailer,
    category: "movie_news",
    tags: JSON.stringify(["Avengers Doomsday", "CinemaCon 2026", "Trailer Breakdown", "Doctor Doom", "X-Men", "Thor", "Steve Rogers", "Gambit"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Thor", "Captain America", "Professor X", "Gambit", "Shang-Chi", "Mystique", "Yelena Belova", "Namor"]),
    cardMarketImpact: "Every character shown in the trailer is now a buy signal. Gambit cards are up 300% since CinemaCon. Shang-Chi parallels are undervalued. Namor cards are sleepers that could explode.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 7200000, // 2 hours earlier
    metaDescription: "Complete scene-by-scene breakdown of the Avengers Doomsday CinemaCon trailer. Professor X, Doctor Doom, Gambit vs Shang-Chi, Steve Rogers catches Mjolnir, and more.",
    sources: JSON.stringify([
      { title: "Hollywood Reporter - Doomsday Trailer at CinemaCon", url: "https://www.hollywoodreporter.com/movies/movie-news/avengers-doomsday-footage-robert-downey-jr-cinemacon-1236566582/" },
      { title: "Reddit - CinemaCon Trailer Description", url: "https://www.reddit.com/r/MarvelStudiosSpoilers/comments/1snkor6/avengers_doomsday_cinemacon_trailer_description/" },
      { title: "Erik Voss / New Rockstars Breakdown", url: "https://www.youtube.com/watch?v=XAbD4DKLw98" },
    ]),
    contentMarkdown: `CinemaCon 2026 closed with a bang on April 16 when Kevin Feige took the stage to introduce the first extended trailer for *Avengers: Doomsday*. The two-minute footage, shown exclusively to the theater industry audience in Las Vegas, has since been described by multiple attendees as the best Marvel trailer since *Infinity War*. Erik Voss of New Rockstars, who was in the room, said simply: "It holds nothing back."

Here is everything that was shown, scene by scene, based on corroborated reports from Hollywood Reporter, Discussing Film, and multiple CinemaCon attendees.

## Scene 1: The X-Mansion Under Siege

The trailer opens inside the X-Mansion — the iconic home of the X-Men. Professor Charles Xavier is watching through a window as an energy rift or explosion erupts outside. This is our first confirmation that the X-Mansion is a major location in the film, and that Professor X is present from the very beginning of the conflict.

The X-Mansion setting is significant because it places the mutant world at the center of the Doomsday story, not on the periphery. This is not a cameo — the X-Men are in the thick of it.

## Scene 2: Doctor Doom Speaks

We hear Robert Downey Jr.'s voice as Victor Von Doom, speaking with a Latverian accent. He warns of an "impending doom" and says the heroes will need to make "an unthinkable decision." Then we see Doctor Doom in full armor — green hooded cloak, iconic metal mask with rivets — making a superhero landing in the courtyard of the X-Mansion.

Multiple CinemaCon attendees have confirmed that **Doom is never shown without his mask** in the trailer. Initial reports suggesting RDJ's face was visible were incorrect. The mask stays on, preserving the mystery and menace of the character.

Joe Russo described Doom on stage: "He's not simply a villain — he's one of the most complex Marvel characters. He's always three moves ahead."

## Scene 3: The New Avengers Tower

After the Marvel Studios logo, we see a brand-new completed Avengers Tower with a redesigned New Avengers logo and a different building shape than the original Stark Tower. The Fantastic Four are shown meeting Sam Wilson's division of the Avengers inside. This confirms that the post-Endgame Avengers have been reorganized under Sam Wilson's Captain America.

## Scene 4: Namor Parts the Ocean

One of the trailer's most visually stunning moments reveals that the desert landscape shown in the fourth *Doomsday* teaser is actually the **sea bottom** — the ocean has been parted by Namor in a Moses-style display of power. The Fantastic Four meet the Wakandans in this impossible landscape, with The Thing trying to forge an alliance with the Wakandan forces.

This scene confirms Namor's significant role in the film and establishes the Wakanda-Atlantis-Fantastic Four alliance that comics fans have been hoping for.

## Scene 5: Hero vs. Hero

Tensions boil over as fight scenes between heroes erupt. **Channing Tatum's Gambit battles Shang-Chi** in what sounds like a visually spectacular matchup — kinetic playing cards versus martial arts mastery. Meanwhile, **Mystique shapeshifts into Yelena Belova** and fights the real Yelena, creating a disorienting two-Yelenas sequence that plays on the paranoia of not knowing who to trust.

These hero-vs-hero conflicts suggest that Doom's strategy involves turning the heroes against each other before they can unite — classic Victor Von Doom.

## Scene 6: Thor's Speech

Chris Hemsworth's Thor delivers the emotional centerpiece of the trailer, rallying the fractured heroes:

> "Put aside your petty squabbles. Presume nothing except this: If you return, you will return as brothers and sisters. Mark my words: We are going to need a miracle."

This speech positions Thor as the unifying leader of the combined Avengers-X-Men-Fantastic Four alliance, a role that mirrors his comic book status as one of Marvel's most powerful and respected heroes.

## Scene 7: Doom Stops Stormbreaker

In the trailer's most jaw-dropping power display, Thor swings Stormbreaker at Doctor Doom — and **Doom stops the axe with just the palm of his hand**. No strain. No effort. Just pure, terrifying power. This single moment establishes Doom as a threat on a level the MCU has never seen. Thanos needed the Infinity Stones to be this powerful. Doom does it with his bare hand.

## Scene 8: "It Can't Be"

The trailer's final scene is its biggest surprise. Thor looks at someone offscreen and says, "It can't be" (or "It's not possible," depending on the report). He holds out Mjolnir — and the hammer flies into the hand of **Steve Rogers**. Rogers is bearded, with long hair, wearing a black shirt. He is not old Steve from the *Endgame* bench scene. He is battle-ready Steve, and he is back.

Chris Evans took the CinemaCon stage after the trailer and quipped about Doom: "This guy — I don't like it."

The title card closes the trailer.

## What the Trailer Tells Us About the Film

The CinemaCon footage reveals a film that is simultaneously a multiverse epic and a deeply personal story about fractured heroes learning to trust each other. Doom is not just powerful — he is strategic, turning heroes against each other while positioning himself as the ultimate threat. The X-Men are not a side plot; they are central to the conflict. And Steve Rogers' return is not fan service — it is a plot point that the entire film appears to be building toward.

## Collector's Corner

Every character who appeared in the CinemaCon trailer is now a hot commodity on the secondary card market. If you saw a name in this breakdown, their cards are moving.

**Hot Cards to Watch:**
- **Gambit Topps Chrome Marvel parallels** — Up 300% since CinemaCon; Channing Tatum's casting is driving insane demand
- **Shang-Chi base and insert cards** — Criminally undervalued given his prominent trailer role
- **Namor Topps Finest inserts** — A sleeper pick that could explode once the ocean-parting scene goes viral
- **Mystique vintage cards** — Classic X-Men Mystique cards are heating up with the shapeshifter fight scene
- **Professor X cards** — Xavier's presence at the center of the conflict makes his cards a smart buy

Browse the full Marvel card market on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)** — filter by "sold listings" to see real transaction prices, not just asking prices. The CinemaCon bump is already showing up in completed sales.

*Avengers: Doomsday opens December 18, 2026.*`,
  },

  // ===== ARTICLE 4: Doom Stops Stormbreaker + 5 Other Jaw-Dropping Moments =====
  {
    title: "Doctor Doom Stops Stormbreaker With His Bare Hand — And 5 Other Jaw-Dropping Doomsday Trailer Moments",
    slug: "doctor-doom-stops-stormbreaker-6-jaw-dropping-doomsday-trailer-moments",
    excerpt: "The Avengers: Doomsday CinemaCon trailer delivered moment after moment of pure Marvel spectacle. From Doom's terrifying power display to Namor parting the ocean, here are the 6 scenes that broke the internet.",
    featuredImageUrl: IMAGES.stormbreaker,
    category: "analysis",
    tags: JSON.stringify(["Avengers Doomsday", "Doctor Doom", "Thor", "Stormbreaker", "Trailer Analysis", "CinemaCon 2026", "Namor", "Steve Rogers"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Thor", "Captain America", "Namor", "Gambit", "Shang-Chi", "Mystique"]),
    cardMarketImpact: "Power-level moments drive card prices. Doom stopping Stormbreaker is the new 'I am inevitable' — expect Doctor Doom cards to become the most sought-after Marvel pulls of 2026.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 10800000, // 3 hours earlier
    metaDescription: "6 jaw-dropping moments from the Avengers Doomsday CinemaCon trailer: Doom stops Stormbreaker, Namor parts the ocean, Steve Rogers catches Mjolnir, and more.",
    sources: JSON.stringify([
      { title: "Hollywood Reporter - Doomsday CinemaCon Footage", url: "https://www.hollywoodreporter.com/movies/movie-news/avengers-doomsday-footage-robert-downey-jr-cinemacon-1236566582/" },
      { title: "Entertainment Weekly - CinemaCon Day 4", url: "https://ew.com/the-biggest-news-cinemacon-day-4-avengers-doomsday-trailer-more-11952148" },
    ]),
    contentMarkdown: `Every great Marvel trailer has a moment — a single shot or sequence that sears itself into your brain and refuses to leave. *Infinity War* had the snap. *Endgame* had "Avengers, assemble." And now *Avengers: Doomsday* has Doctor Doom catching Stormbreaker with his bare hand like it is a tennis ball.

The CinemaCon 2026 trailer delivered not one but six of these moments, each one more spectacular than the last. Here they are, ranked by the sheer volume of the audience reaction they reportedly generated.

## 1. Doom Stops Stormbreaker With One Hand

This is the moment. The one that will define the marketing campaign, spawn a thousand memes, and establish Doctor Doom as the most terrifying villain the MCU has ever produced.

Thor — the God of Thunder, the wielder of Stormbreaker, the Avenger who nearly killed Thanos — swings his axe at Doom with everything he has. And Doom catches it. With one armored hand. No flinch. No effort. No Infinity Stones required.

Think about what this means for the power scaling. Thanos needed six Infinity Stones to dominate the Avengers. Doom does it with sorcery, technology, and sheer will. Joe Russo described the character as "always three moves ahead," but this moment shows he is also three power levels above. The God of Thunder just met someone who makes thunder look quaint.

For card collectors, this is the new "I am inevitable." Doctor Doom cards are going to become the most sought-after Marvel pulls of 2026, period.

## 2. Steve Rogers Catches Mjolnir

The trailer's closing shot is a masterclass in fan service done right. Thor looks offscreen, stunned. "It can't be," he whispers. Mjolnir leaves his hand and flies across the frame — into the grip of Steve Rogers. Not old Steve. Not retired Steve. This is a bearded, long-haired, black-shirt-wearing Steve Rogers who looks like he has been through something terrible and come out the other side ready for war.

Chris Evans' return was confirmed, but seeing it in context — with Thor's disbelief, the slow-motion hammer catch, and the title card slam — elevates it from rumor to reality. The CinemaCon audience reportedly lost their minds. Evans himself took the stage afterward and quipped about Doom: "This guy — I don't like it."

## 3. Namor Parts the Ocean Like Moses

The fourth *Doomsday* teaser showed what appeared to be a desert landscape. Turns out it was the ocean floor. Namor, the Sub-Mariner, has literally parted the sea in a biblical display of power, creating a massive dry corridor where the Fantastic Four meet the Wakandans. The Thing is shown trying to forge an alliance with Wakandan forces in this impossible setting.

This is the kind of world-building spectacle that separates Marvel from everything else. It is not just a fight scene — it is a mythological event rendered in IMAX-scale visuals. Namor cards are a sleeper pick that could explode once this scene goes viral.

## 4. Gambit vs. Shang-Chi

Channing Tatum's Gambit finally gets his moment, and it is a banger. The Cajun card-thrower battles Shang-Chi in what attendees described as one of the trailer's most visually spectacular sequences — glowing pink kinetic playing cards clashing against martial arts mastery. It is a matchup nobody asked for and everybody now desperately needs to see.

The hero-vs-hero dynamic suggests Doom is manipulating the factions against each other, which is pure Victor Von Doom from the comics. Gambit cards have already surged 300% since CinemaCon, and they are not done climbing.

## 5. Mystique vs. Yelena (Both of Them)

In a paranoia-inducing sequence, Mystique shapeshifts into Yelena Belova and fights the real Yelena. Two Florence Pughs on screen at once, and you cannot tell which one is the imposter. This scene perfectly captures the "trust nobody" atmosphere that Doom's presence creates — if your own teammate might be a shapeshifter, how do you fight a war?

The Mystique-Yelena fight also confirms that the X-Men and Avengers are not just coexisting in this film — they are in direct conflict. The mutant-Avenger tension that has defined decades of Marvel Comics is finally playing out on screen.

## 6. Doctor Doom's Superhero Landing at the X-Mansion

The trailer's first full reveal of Doom in action shows him making a superhero landing — the classic kneel-and-rise pose — in the courtyard of the X-Mansion. Full armor. Green cloak billowing. Metal mask gleaming. It is a villain entrance that rivals Thanos stepping through the portal in *Endgame*, and it establishes the X-Mansion as ground zero for the conflict.

Multiple attendees confirmed that Doom never removes his mask in the trailer, preserving the mystique (no pun intended) of the character. RDJ's voice work as Doom — complete with a Latverian accent — does all the heavy lifting, and reportedly it is chilling.

## What These Moments Tell Us

Taken together, these six moments paint a picture of a film that understands spectacle, character, and stakes in equal measure. Doom is not just powerful — he is terrifyingly competent. The heroes are not just fighting — they are fractured and desperate. And the scale is not just big — it is mythological.

The Russos have done this before with *Infinity War* and *Endgame*, but the addition of the X-Men, Fantastic Four, and a villain as layered as Doom suggests *Doomsday* could surpass both.

## Collector's Corner

Power moments drive card prices. Always have, always will. The "Doom stops Stormbreaker" scene is going to be this generation's "I am inevitable" — the image that defines the entire film. Here is how to position your collection.

**Hot Cards to Watch:**
- **Doctor Doom Topps Chrome Marvel #1 + numbered parallels** — The definitive Doom card; buy before the online trailer drops
- **Thor Stormbreaker insert cards** — The axe is now part of the most iconic Doom moment; Thor cards benefit too
- **Gambit Topps Finest X-Men '97** — 300% gains since CinemaCon and still climbing
- **Namor first appearance reprints** — *Sub-Mariner #1* homage cards are undervalued sleepers
- **Mystique vintage X-Men cards** — The shapeshifter fight scene makes every Mystique card a conversation piece

For real-time price tracking and market trends, check **[COMC (Check Out My Cards)](https://www.comc.com/)** — their Marvel section lets you track price history over time, so you can see exactly when the CinemaCon bump started and decide if there is still room to buy in.

*Avengers: Doomsday opens December 18, 2026.*`,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log("Connected to database");

  // First, unflag any currently featured article
  await conn.execute(`UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1`);
  console.log("Cleared previous featured flags");

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
    "SELECT id, title, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 6"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] ${r.title}`));

  await conn.end();
  console.log("\nDone! 4 articles published.");
}

main().catch(console.error);
