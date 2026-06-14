import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

// SEO upgrades keyed by slug
// Strategy:
//  - metaDescription: 150-160 chars, includes primary keyword + year + NLF brand signal
//  - tags: 8-12 comma-separated, mix of broad + long-tail + collector-specific
//  - excerpt: 2-3 sentences, hooks the reader, includes primary keyword naturally
const upgrades = [
  {
    slug: "comic-art-vs-actor-portrayal-marvel-card-collector-types-2025",
    metaDescription: "Comic art vs. actor portrayal — which Marvel trading card style is right for you? Explore Topps Comic Book Heroes, Marvel Studios, Collector, Chrome, and Mint sets. Northland Legendary Finds.",
    tags: JSON.stringify(["Marvel Trading Cards","Topps Comic Book Heroes","Topps Marvel Studios","Topps Marvel Collector","Topps Marvel Chrome","2025 Topps Marvel Mint","Actor Autograph Cards","Comic Art Cards","Card Collecting Guide","MCU Cards","Graded Cards","CGC"]),
    excerpt: "Topps has been making Marvel trading cards since 1975, and two distinct collector philosophies have emerged: comic-art purists and MCU actor-portrayal fans. From Comic Book Heroes SuperFractors to signed Perfection autos, we break down every major set and help you find your collecting style.",
  },
  {
    slug: "mcu-phase-8-mutant-saga-everything-we-know-2026",
    metaDescription: "MCU Phase 8: The Mutant Saga — every confirmed title including Wolverine, Avengers vs. X-Men, Young Avengers, Midnight Sons, and Spider-Man: Miles Morales. Full breakdown for collectors.",
    tags: JSON.stringify(["MCU Phase 8","Mutant Saga","X-Men MCU","Wolverine Enemy of the State","Avengers vs X-Men","Young Avengers","Midnight Sons","Spider-Man Miles Morales","Scarlet Witch","Captain America Serpent Society","Marvel Trading Cards","Phase 8 Cards"]),
    excerpt: "Marvel Studios has mapped out Phase 8: The Mutant Saga — eight films that will redefine the MCU for a generation. From Wolverine: Enemy of the State to Avengers vs. X-Men, here's everything confirmed and what it means for the trading card market.",
  },
  {
    slug: "avengers-doomsday-trailer-breakdown-cinemacon-2026",
    metaDescription: "Full scene-by-scene breakdown of the Avengers: Doomsday trailer from CinemaCon 2026. Doctor Doom, Steve Rogers, X-Men, Fantastic Four — every detail analyzed for MCU fans and card collectors.",
    tags: JSON.stringify(["Avengers Doomsday Trailer","CinemaCon 2026","Doctor Doom","Steve Rogers","X-Men MCU","Fantastic Four MCU","Robert Downey Jr","Russo Brothers","MCU Phase 6","Marvel Trailer Breakdown","Avengers Doomsday Cards","December 2026"]),
    excerpt: "Kevin Feige debuted the first full Avengers: Doomsday trailer at CinemaCon 2026 — and it delivered. Doctor Doom's opening narration, Steve Rogers' return, X-Men and Fantastic Four side by side. We break down every frame and what it means for the card market.",
  },
  {
    slug: "dune-3-vs-doomsday-december-box-office-war-cinemacon",
    metaDescription: "Dune 3 vs. Avengers: Doomsday — both open December 18, 2026. Disney's Infinity Vision vs. IMAX's Dune deal. The biggest box office showdown since Endgame, explained for Marvel fans.",
    tags: JSON.stringify(["Avengers Doomsday","Dune 3","Box Office 2026","December 2026","Infinity Vision","IMAX","Disney","CinemaCon","MCU Phase 6","Marvel vs DC Box Office","Doomsday Release Date","Dune Messiah"]),
    excerpt: "Disney launched Infinity Vision. Warner Bros. locked IMAX for Dune 3. Both films open December 18, 2026 — and theater owners are caught in the middle. Here's the full story of the biggest box office war since Endgame.",
  },
  {
    slug: "infinity-vision-disney-premium-theater-format-doomsday",
    metaDescription: "Disney's Infinity Vision explained: a new premium theater format built to counter IMAX's Dune 3 exclusivity and ensure Avengers: Doomsday gets the biggest screens for December 2026.",
    tags: JSON.stringify(["Infinity Vision","Disney","IMAX","Avengers Doomsday","Premium Format","Dune 3","CinemaCon 2026","Theater Technology","MCU Phase 6","December 2026","Box Office","Premium Large Format"]),
    excerpt: "Disney unveiled Infinity Vision at CinemaCon 2026 — a new premium theater certification designed to give Avengers: Doomsday the biggest screens possible after IMAX locked an exclusive deal with Dune 3. Here's what it means for fans and exhibitors.",
  },
  {
    slug: "cinemacon-2026-avengers-doomsday-first-look",
    metaDescription: "CinemaCon 2026: Avengers Doomsday first look — confirmed cast, Doctor Doom reveal, Infinity Vision announcement, and what it means for Marvel trading card collectors.",
    tags: JSON.stringify(["CinemaCon 2026","Avengers Doomsday","Doctor Doom","MCU Phase 6","Robert Downey Jr","X-Men","Fantastic Four","Infinity Vision","Marvel First Look","MCU Trailer","Doomsday Cast","Marvel Cards 2026"]),
    excerpt: "CinemaCon 2026 was Marvel's biggest stage moment since Endgame — Avengers: Doomsday took center stage with a first look, Doctor Doom confirmed, and Disney's Infinity Vision announced. Here's everything revealed and what collectors should watch.",
  },
  {
    slug: "avengers-doomsday-everything-we-know-2026",
    metaDescription: "Avengers: Doomsday — complete guide: cast, plot, Doctor Doom, release date December 18 2026, trailers, and the best Marvel trading cards to collect before it hits theaters.",
    tags: JSON.stringify(["Avengers Doomsday","Doctor Doom","Robert Downey Jr","Russo Brothers","MCU Phase 6","December 18 2026","Multiverse Saga","X-Men MCU","Fantastic Four MCU","Marvel Cards","Doomsday Trading Cards","Secret Wars"]),
    excerpt: "Robert Downey Jr. returns as Doctor Doom. The Russo Brothers are back. Avengers: Doomsday opens December 18, 2026 — and it's shaping up to be the biggest MCU event since Endgame. Here's every confirmed detail, plus the cards worth collecting right now.",
  },
  {
    slug: "avengers-doomsday-vs-dune-3-december-showdown",
    metaDescription: "Avengers: Doomsday vs. Dune 3 on December 18, 2026 — the box office showdown that has theater owners worried. What it means for Marvel fans and trading card collectors.",
    tags: JSON.stringify(["Avengers Doomsday","Dune 3","December 2026","Box Office","MCU Phase 6","Doctor Doom","Marvel vs Dune","Theater Release","Card Market","Marvel Trading Cards","December Showdown","Robert Downey Jr"]),
    excerpt: "Both Marvel's Avengers: Doomsday and Legendary's Dune 3 are locked in for December 18, 2026. Theater owners are worried, fans are picking sides, and the card market is already reacting. Here's the full breakdown.",
  },
  {
    slug: "spider-man-brand-new-day-trailer-card-market",
    metaDescription: "Spider-Man: Brand New Day trailer breakdown — Tom Holland returns, new villain revealed, and Marvel trading card prices react. What collectors need to know before July 2026.",
    tags: JSON.stringify(["Spider-Man Brand New Day","Tom Holland","Spider-Man 4","Marvel Trailer","MCU Phase 6","Spider-Man Cards","Topps Spider-Man","Card Market","July 2026","Marvel Trading Cards","Spider-Man Collector","MCU Spider-Man"]),
    excerpt: "The first full trailer for Spider-Man: Brand New Day is here — Tom Holland's return, a new villain, and a fresh chapter for the MCU's most popular hero. Here's what the trailer reveals and why Spider-Man cards are moving right now.",
  },
  {
    slug: "daredevil-born-again-season-2-card-surge",
    metaDescription: "Daredevil: Born Again Season 2 on Disney+ — Matt Murdock, Punisher, Kingpin return. How the premiere is driving street-level Marvel trading card prices in 2026.",
    tags: JSON.stringify(["Daredevil Born Again","Season 2","Disney Plus","Matt Murdock","Charlie Cox","Punisher","Kingpin","Vincent D'Onofrio","Street Level Marvel","Marvel Cards","Daredevil Cards","MCU Disney Plus 2026"]),
    excerpt: "Daredevil: Born Again Season 2 just hit Disney+ and the street-level Marvel card market is responding. Matt Murdock, Punisher, and Kingpin are back — and collectors are chasing their cards. Here's what's moving and why.",
  },
  {
    slug: "collectibles-market-602-billion-2026",
    metaDescription: "The global collectibles market hit $602.4 billion in 2026 — growing at 6.4% CAGR. What this means for Marvel trading card collectors and the long-term value of your collection.",
    tags: JSON.stringify(["Collectibles Market 2026","Marvel Cards Investment","Trading Card Market","Collectibles Growth","Card Values","Topps Marvel","Graded Cards Value","CGC Cards","PSA Cards","Card Investing","Market Analysis","Collectibles Industry"]),
    excerpt: "New industry data shows the global collectibles market reaching $602.4 billion in 2026, growing at 6.4% CAGR. Marvel trading cards are a key driver — and the data suggests the best years for collectors are still ahead.",
  },
  {
    slug: "secret-wars-production-begins-card-collecting",
    metaDescription: "Avengers: Secret Wars enters production at Pinewood Studios — 18 months of card market opportunity ahead. The complete collector's guide to building your Secret Wars portfolio now.",
    tags: JSON.stringify(["Avengers Secret Wars","Secret Wars Production","MCU Phase 7","Multiverse Saga","Marvel Cards","Secret Wars Cards","Card Investment","Pinewood Studios","Marvel Production","Topps Marvel","Graded Cards","Card Portfolio"]),
    excerpt: "Avengers: Secret Wars is officially entering production — and that means 18 months of growing collector interest before the film hits theaters. Here's how to build your Secret Wars card portfolio while prices are still reasonable.",
  },
  {
    slug: "mcu-phase-6-complete-release-calendar-2026",
    metaDescription: "Complete MCU Phase 6 release calendar 2026 — every movie and Disney+ show with dates, cast, and the Marvel trading cards worth collecting for each release.",
    tags: JSON.stringify(["MCU Phase 6","Release Calendar 2026","MCU Schedule","Avengers Doomsday","Spider-Man Brand New Day","Daredevil","Disney Plus 2026","Marvel Movies 2026","MCU Cards","Phase 6 Cards","Topps Marvel 2026","Marvel Collector Guide"]),
    excerpt: "From Daredevil: Born Again Season 2 to Avengers: Doomsday, here's every confirmed MCU release for 2026 with dates, cast details, and the trading cards worth watching for each title.",
  },
];

let updated = 0;
let skipped = 0;

for (const u of upgrades) {
  const [rows] = await conn.execute(
    "SELECT id FROM articles WHERE slug = ?",
    [u.slug]
  );
  if (!rows.length) {
    console.log(`⚠️  Not found: ${u.slug}`);
    skipped++;
    continue;
  }
  await conn.execute(
    "UPDATE articles SET metaDescription = ?, tags = ?, excerpt = ?, updatedAt = NOW() WHERE slug = ?",
    [u.metaDescription, u.tags, u.excerpt, u.slug]
  );
  console.log(`✅ Updated: ${u.slug}`);
  updated++;
}

console.log(`\n📊 Done — ${updated} updated, ${skipped} not found.`);
await conn.end();
