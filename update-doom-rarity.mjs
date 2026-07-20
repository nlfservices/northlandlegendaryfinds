import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const DOOM_CARD_URL = "https://manus-storage.s3.us-east-1.amazonaws.com/1000043826_c2ad3c69.jpg";

const newTitle = "Doctor Doom Chrome SDCC Exclusive (2025 Marvel Mint) — The Rarest Card in the Set Just Got a Trailer";
const newSlug = "doctor-doom-sdcc-exclusive-rarest-card-2025-topps-marvel-mint";
const newExcerpt = "Only available at San Diego Comic-Con. Numbered to 25, 10, 5, and 1. The Doomsday trailer just confirmed RDJ as Doom. These cards are about to go parabolic.";

const newContent = `The Avengers: Doomsday trailer just dropped. RDJ is confirmed as Doctor Doom. The movie releases December 18, 2026. And there is exactly ONE set that has a dedicated Doctor Doom chrome card — the 2025 Topps Marvel Mint SDCC Exclusive.

This card was **only available in boxes sold at San Diego Comic-Con 2025**. You couldn't buy it online. You couldn't find it at Target. You had to be there.

And the numbered parallels? Let's break down just how rare we're talking.

## The SDCC Exclusive Chrome Doctor Doom

The SDCC Exclusive Doctor Doom is a chrome-encased card that only appeared in Comic-Con exclusive boxes. Here are the variations:

| Parallel | Print Run | Rarity |
|----------|-----------|--------|
| Base Chrome | /25 | Only 25 exist in the world |
| Black Lava Refractor | /10 | Ten. That's it. |
| Red Lava Refractor | /5 | Five people on Earth have this |
| Superfractor | /1 | ONE. The holy grail. |

Twenty-five base chromes. Ten black lavas. Five red lavas. One superfractor. That's **41 total cards across all parallels** for the SDCC exclusive Doom.

The Doomsday trailer just confirmed this character is the centerpiece of the biggest Marvel movie since Endgame. Do the math.

## Regular Set — Card #107 Doctor Doom

![Doctor Doom Card](${DOOM_CARD_URL})

Even in the regular 2025 Marvel Mint set, Doctor Doom (#107) is incredibly scarce in its premium parallels:

| Parallel | Print Run | Rarity |
|----------|-----------|--------|
| Silver Foil | /99 | The "accessible" version — still under 100 |
| Black Foil | /10 | Single digits territory |
| Red Foil | /5 | Five in existence |
| Foil Superfractor | /1 | The one-of-one |

That's **115 total numbered Doom cards** from the regular set across all foil parallels. Combined with the SDCC exclusive chrome variations, you're looking at roughly **156 numbered Doctor Doom cards in the entire 2025 Marvel Mint release**.

For context: there are millions of Marvel fans who just watched that trailer. Millions who are about to become obsessed with this character. And fewer than 200 premium numbered cards exist.

## Why This Matters Right Now

Three things are happening simultaneously:

**The trailer dropped.** RDJ as Doom is no longer a rumor or a casting announcement. It's real. The footage exists. The hype machine is fully activated.

**SDCC 2026 is THIS WEEK.** Topps just announced the 2026 Marvel Mint follow-up set will be available at Comic-Con. History is literally repeating — same set, same exclusive boxes, same location. Anyone who missed 2025 is about to get a second chance with the new set... but the 2025 Doom cards? Those are locked in. No more will ever be made.

**December 18 is five months away.** Every piece of marketing, every new trailer, every character poster between now and release day is going to drive more attention to anything Doom-related. These cards are about to go parabolic.

## The Collector's Equation

Here's what collectors are looking at:

- Fewer than 200 premium numbered Doom cards exist total
- The character just got confirmed as the lead villain in a $300M+ movie
- No additional supply will ever enter the market
- Demand is about to spike with every new trailer and SDCC reveal
- The 2026 set drops this week but it's Spider-Man themed — making the 2025 Doom cards even MORE unique

If you pulled one of these at SDCC last year, you're sitting on something special. If you're hunting one now... good luck. The window is closing fast.

Read more about the full 2025 Marvel Mint set in our [Complete Guide to 2025 Topps Marvel Mint](/mcu-news/2025-topps-marvel-mint-complete-guide-bronze-to-platinum).

And if you want to understand WHY Doctor Doom is about to become the most important character in the MCU, read our breakdown of [the Doomsday poster symbolism](/mcu-news/avengers-doomsday-poster-breakdown-cynthia-von-doom-symbolism) and [Cynthia Von Doom's sacrifice](/mcu-news/mothers-day-cynthia-von-doom-sacrifice-doctor-doom).`;

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Update the article
  await conn.execute(
    `UPDATE articles SET title = ?, slug = ?, excerpt = ?, contentMarkdown = ? WHERE slug IN (?, ?)`,
    [newTitle, newSlug, newExcerpt, newContent, 
     'doctor-doom-sdcc-exclusive-card-about-to-go-parabolic-2025-topps-marvel-mint',
     'doctor-doom-sdcc-exclusive-750-card-2025-topps-marvel-mint']
  );
  
  console.log('✅ Doctor Doom article updated with rarity breakdown!');
  console.log('New slug:', newSlug);
  
  await conn.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
