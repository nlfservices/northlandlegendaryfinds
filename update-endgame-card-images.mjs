/**
 * Update Endgame Anniversary Article — Add real Thanos & Iron Man card images
 * Run from project root: node update-endgame-card-images.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Real card image CDN URLs
const CARD_IMAGES = {
  thanosMint77: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/oLfSrNeyDKsmtDuj.jpg",
  thanosChrome100: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/jsKiQkBTzMRcrkxb.jpg",
  thanosGambitH8: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/ZhMBpOdwaEwjyMuE.jpg",
  ironManChrome1: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/xRESJkdKfjxRlPTs.jpg",
  ironManDoomR5: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/RpZydtrLZaiZZehq.jpg",
};

// Keep the existing AI-generated images
const AI_IMAGES = {
  snapMoment: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/endgame-anniversary-snap-moment-NmWNmykSr9ELsbYXcWv9LA.webp",
  cardDisplay: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/endgame-anniversary-card-display-ga7agsQh4YkyPcqhjbaECA.webp",
};

const slug = "avengers-endgame-7th-anniversary-re-release-september-2026";

// Updated article content with real card images replacing the AI card display
const newContent = `Seven years ago today — April 26, 2019 — Avengers: Endgame opened in theaters and changed everything. It shattered the record for the biggest global opening weekend with $1.2 billion, went on to gross $2.799 billion worldwide, and for a brief, electric moment held the title of highest-grossing film of all time. More than a movie, Endgame was a cultural event — the culmination of 22 interconnected films spanning over a decade of storytelling that had never been attempted at that scale.

Now, seven years later, the Infinity Saga's final chapter is coming back. And this time, it's bringing something new.

## September 25: Endgame Returns with New Footage

Marvel Studios officially announced that Avengers: Endgame will return to theaters on **September 25, 2026** — exactly three months before Avengers: Doomsday hits screens on December 18. But this isn't a standard anniversary re-release. During Disney's CinemaCon presentation on April 16, directors Joe and Anthony Russo revealed that the re-release will include **brand-new footage** added to the already three-hour film.

<img src="${AI_IMAGES.snapMoment}" alt="The iconic Infinity Gauntlet snap moment from Avengers Endgame" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />

At the Sands Film Festival in Scotland on April 19, Joe Russo went further, explaining exactly what audiences can expect. "We'll be re-releasing the film with footage that is set in the Doomsday story that we have added to Avengers: Endgame," Russo told a packed crowd. He described the re-release as a **"critical companion story"** and a direct **"setup for what you're gonna watch in December when you see Avengers: Doomsday."**

The implication is significant: Endgame's re-release won't just be a nostalgia trip. It will function as a narrative bridge, connecting the end of the Infinity Saga to the beginning of whatever comes next with Doctor Doom.

## Infinity Vision: A New Premium Format

Both Endgame and Doomsday will be presented in **"Infinity Vision"** — a brand-new certification for premium large format theaters. Disney describes it as delivering "the biggest, brightest and most immersive cinematic experiences," with more than 75 domestic and 300 global premium screens meeting the technical standards for laser projection, maximum screen size, and premium audio formats.

The name itself — evoking both the Infinity Stones and the synthezoid hero Vision — feels intentional. Whether it becomes a lasting brand or a one-time marketing push, it signals that Disney is treating the Endgame re-release and Doomsday as prestige theatrical events, not just standard blockbuster rollouts.

## The Doomsday Connection: From Hero to Villain

The bridge between Endgame and Doomsday centers on one actor: **Robert Downey Jr.** His Tony Stark made the ultimate sacrifice in Endgame, snapping the Infinity Gauntlet to defeat Thanos and save the universe. Now, in a multiverse twist, Downey returns as **Doctor Doom** — the ultimate villain.

Joe Russo revealed that Downey "started contemplating his return about 2 to 2.5 years ago," and that the concept was straightforward: "He played the ultimate hero, and now he's going to play the ultimate villain." The Russos locked the story structure with longtime Marvel screenwriter Stephen McFeely, and the result is what Russo calls **"serialized storytelling"** inspired by the comics themselves.

For collectors, this narrative arc — from Iron Man's snap to Doom's rise — creates a direct through-line that makes both Endgame-era and Doomsday-era cards part of the same story.

## By the Numbers: Endgame's Record-Breaking Legacy

Avengers: Endgame didn't just succeed — it rewrote the record books. Here's where it still stands seven years later:

- **$2.799 billion** worldwide gross (second all-time behind Avatar's $2.924 billion)
- **$1.2 billion** global opening weekend (still the all-time record)
- **$1.94 billion** international gross (second-highest MPA film ever)
- **$858 million** domestic gross (fifth all-time)
- **22 films** of interconnected storytelling culminating in one three-hour finale

The film's cultural impact extended far beyond box office numbers. "I Love You 3000" became a global phrase. The portals scene became the gold standard for cinematic payoff moments. And Tony Stark's sacrifice became the emotional anchor of an entire generation's moviegoing experience.

## Thanos Cards: The Endgame Villain in 2025 Topps

For collectors, the Endgame anniversary puts a spotlight on one of Marvel's most iconic villains — and 2025 Topps has given Thanos some of the most collectible cards in recent memory across two major sets.

### Thanos #77 — 2025 Topps Marvel Mint Gold

<img src="${CARD_IMAGES.thanosMint77}" alt="Thanos #77 2025 Topps Marvel Mint Gold Base Card" style="width:100%;max-width:400px;border-radius:12px;margin:12px 0;" />

In **2025 Topps Marvel Mint**, Thanos appears as card **#77** in the Gold tier of the base set, with parallels running from base through /75, /50, /25, /10, /5, and the coveted /1 one-of-one. The ornate gold frame and stained-glass-style artwork make this one of the most visually striking base cards in the entire set.

### Thanos Hearts 8 — Gambit's Deck Chrome Playing Card

<img src="${CARD_IMAGES.thanosGambitH8}" alt="Thanos Hearts 8 Gambit's Deck Double Sided Chrome Playing Card from 2025 Topps Marvel Mint" style="width:100%;max-width:400px;border-radius:12px;margin:12px 0;" />

He also shows up as the **Hearts 8** in the Gambit's Deck Double Sided Chrome Playing Cards insert — a unique chrome playing card format that's become one of the set's most talked-about features. The encased chrome finish with the classic playing card design makes these some of the most unique Marvel cards ever produced.

### Thanos #100 — 2025 Topps Marvel Studios Chrome (The Final Card)

<img src="${CARD_IMAGES.thanosChrome100}" alt="Thanos #100 2025 Topps Marvel Studios Chrome Blue Ray Wave Refractor" style="width:100%;max-width:400px;border-radius:12px;margin:12px 0;" />

In **2025 Topps Marvel Studios Chrome**, Thanos holds a symbolically perfect position: **card #100** — the very last base card in the entire set. Labeled "Thanos Avengers: Endgame Phase Three," it's the capstone of the entire MCU base set journey from Iron Man #1 through the final Phase Three villain. The parallel lineup is deep: /199, /150, /99, /80, /76, /75, /50, /49, /25, and /1. There's also the **S-100 Snap Variation**, which reimagines the card with the set's signature Snap aesthetic — a fitting parallel for the character who started it all with a snap of his fingers.

### Iron Man #1 — 2025 Topps Marvel Studios Chrome (The First Card)

<img src="${CARD_IMAGES.ironManChrome1}" alt="Iron Man Tony Stark #1 2025 Topps Marvel Studios Chrome Base Card" style="width:100%;max-width:400px;border-radius:12px;margin:12px 0;" />

And don't overlook the Iron Man bookends. In Marvel Studios Chrome, **Iron Man #1** is the very first card in the set, while Thanos #100 is the last. That symmetry — hero to villain, beginning to end — mirrors the Endgame story itself.

### Iron Man & Doctor Doom R-5 — Reflections Insert

<img src="${CARD_IMAGES.ironManDoomR5}" alt="Iron Man and Doctor Doom R-5 Reflections Insert 2025 Topps Marvel Studios Chrome" style="width:100%;max-width:400px;border-radius:12px;margin:12px 0;" />

The **R-5 Reflections insert** pairs Iron Man with Doctor Doom in a stunning split-face chrome design, foreshadowing the Doomsday narrative. And the **AS-5 Avengers Shadowbox** insert features Iron Man in the original Avengers lineup.

Browse our [Card Database](https://northlandlegendaryfinds.com/cards) to explore every Thanos and Iron Man card across the 2025 Topps sets, or visit the [Characters section](https://northlandlegendaryfinds.com/characters) for full character profiles.

## What This Means for Collectors

The September re-release creates a clear catalyst window for Endgame-adjacent cards. When casual fans return to theaters and see new Doomsday footage spliced into Endgame, interest in both Thanos and Iron Man cards will spike — particularly the numbered parallels and insert cards that carry the most scarcity.

The Thanos #100 from Marvel Studios Chrome is especially well-positioned. As the literal final card in the base set, it carries symbolic weight that goes beyond just being a Thanos card — it represents the end of an era. Low-numbered parallels (/25 and below) of this card could see significant movement as September approaches.

For Iron Man collectors, the R-5 Reflections insert (Iron Man and Doctor Doom) is the card to watch. It directly connects the Endgame legacy to the Doomsday future, making it a narrative bridge card that mirrors what the re-release itself is doing on screen.

Check out our [MCU Spotlight](https://northlandlegendaryfinds.com/mcu-spotlight) for deeper dives into how the MCU timeline connects to the card market, and join our [Whatnot streams](https://northlandlegendaryfinds.com/whatnot) where we regularly break 2025 Topps Marvel products live.

## Collector's Corner

The Endgame anniversary and September re-release announcement have put Thanos and Iron Man cards squarely in the spotlight. With new Doomsday footage being added to the film, expect renewed demand for cards that connect these two eras of the MCU.

**Hot Cards to Watch:**
- **Thanos #100 2025 Topps Marvel Studios Chrome Base** — The last card in the entire set, labeled "Avengers: Endgame Phase Three." Low-numbered parallels (/25, /10, /5) are the ones to chase before September.
- **Thanos #77 2025 Topps Marvel Mint Gold** — The Mad Titan's Gold tier base card with parallels down to /1. Chrome finish makes the numbered versions pop.
- **Thanos S-100 2025 Topps Marvel Studios Chrome Snap Variation** — The Snap aesthetic on the Endgame capstone card. Thematic perfection for Endgame collectors.
- **Iron Man R-5 2025 Topps Marvel Studios Chrome Reflections** — Iron Man paired with Doctor Doom. This insert bridges Endgame to Doomsday and could be the sleeper hit of the year.

Track Thanos and Iron Man card values on **[Card Ladder](https://www.cardladder.com/)** — their market indices show real-time price movement heading into the re-release window. For graded copies, check population reports on **[CGC](https://www.cgccomics.com/)** to gauge scarcity. And for live deals on 2025 Topps Marvel products, browse the latest auctions on **[eBay](https://www.ebay.com/b/Marvel-Trading-Cards/183456/bn_16566768)**.

*Avengers: Endgame returns to theaters September 25, 2026 in Infinity Vision format, with Avengers: Doomsday following on December 18, 2026.*`;

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  try {
    const [result] = await conn.execute(
      `UPDATE articles SET contentMarkdown = ? WHERE slug = ?`,
      [newContent, slug]
    );
    console.log(`✅ Updated article content. Affected rows: ${result.affectedRows}`);

    // Verify
    const [rows] = await conn.execute(
      "SELECT id, title, LENGTH(contentMarkdown) as contentLen FROM articles WHERE slug = ?",
      [slug]
    );
    if (rows.length > 0) {
      console.log(`  Article ID: ${rows[0].id}`);
      console.log(`  Title: ${rows[0].title}`);
      console.log(`  Content length: ${rows[0].contentLen} chars`);
    }
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
  }

  await conn.end();
  console.log("\nDone! Article updated with real card images.");
}

main().catch(console.error);
