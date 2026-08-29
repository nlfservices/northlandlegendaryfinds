/**
 * One-shot seed: official 2025 Topps Marvel Chrome Studios hobby pull odds.
 * setId=5 only (slug 2025-topps-marvel-studios). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, or characterName. Never inserts cards.
 *
 * Numeric Base (cardType Base, cardNumber 1-200): replace the fake
 * "Base Cards, /199, /150, ..." list with named hobby odds.
 *
 * The Snap Variation (S-* or cardType THE SNAP VARIATION): named hobby odds.
 *
 * Other inserts: match existing rows by cardType (and cardNumber prefix).
 * Does not add Thunderbolts / autos / sketches that are not already in the DB.
 * Leave unmatched existing inserts as-is.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:2,887" stays one token (middle-dot U+00B7). Names + hobby 1:x only;
 * do not invent print runs.
 *
 * Hobby column only. Skip breaker-SKU-only Geometric and value-box-only
 * Sky Blue Raywave on hobby base; those are named in the set description.
 *
 * Does not touch set 1 (Chrome hobby), 2 (CBH), 3 (Mint 2025), 4 (Sapphire),
 * 6 (Studios Sapphire), or 90006. Versioned in-memory once-flag so a bump
 * re-runs after a prior seed in this process. Must be started AFTER
 * server.listen so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const STUDIOS_SET_ID = 5;
const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const FORBIDDEN_SET_ID = 90006;

/** Bump when official Studios hobby odds change so the seed re-runs. */
const SEED_VERSION = "studios-2025-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const BASE_PARALLELS = oddsLine([
  ["Base", "1:1"],
  ["Rainbow Refractor", "1:2"],
  ["Prism Refractor", "1:6"],
  ["Shimmer Refractor", "1:96"],
  ["Green Refractor", "1:15"],
  ["Agatha Refractor", "1:20"],
  ["Thor's Lightning Refractor", "1:27"],
  ["Marvel Red and Black Lava Refractor", "1:40"],
  ["Captain America Refractor", "1:39"],
  ["Loki Refractor", "1:39"],
  ["Gold Refractor", "1:58"],
  ["Gold Wave Refractor", "1:58"],
  ["Ms. Marvel", "1:60"],
  ["Orange Refractor", "1:116"],
  ["Wave Orange Refractor", "1:116"],
  ["Black Refractor", "1:290"],
  ["Black Wave Refractor", "1:290"],
  ["Red Refractor", "1:579"],
  ["Red Wave Refractor", "1:579"],
  ["Superfractor", "1:2,887"],
  ["Printing Plates", "1:723"],
]);

const SNAP_PARALLELS = oddsLine([
  ["The Snap Variation", "1:30"],
  ["Gold Refractor", "1:58"],
  ["Orange Refractor", "1:116"],
  ["Black Refractor", "1:290"],
  ["Red Refractor", "1:579"],
  ["Superfractor", "1:2,887"],
]);

const BNW_PARALLELS = oddsLine([
  ["Base", "1:3"],
  ["Gold Refractor", "1:463"],
  ["Orange Refractor", "1:924"],
  ["Black Refractor", "1:2,315"],
  ["Red Refractor", "1:4,654"],
]);

const DD_PARALLELS = oddsLine([
  ["Base", "1:6"],
  ["Gold Refractor", "1:463"],
  ["Orange Refractor", "1:924"],
  ["Black Refractor", "1:2,315"],
  ["Red Refractor", "1:4,654"],
]);

const MG_PARALLELS = oddsLine([["Base", "1:80"]]);

const TVA_PARALLELS = oddsLine([
  ["Base", "1:226"],
  ["Gold Shimmer", "1:446"],
  ["Orange Shimmer", "1:891"],
  ["Black Shimmer", "1:2,225"],
  ["Red Shimmer", "1:4,471"],
]);

const AS_PARALLELS = oddsLine([
  ["Base", "1:160"],
  ["Black Refractor", "1:2,413"],
  ["Red Refractor", "1:4,904"],
]);

const AA_PARALLELS = oddsLine([
  ["Base", "1:939"],
  ["Black Refractor", "1:9,307"],
]);

const AA_AUTO_PARALLELS = oddsLine([
  ["Auto", "1:2,203"],
  ["Auto Black Refractor", "1:11,122"],
]);

const CA_PARALLELS = oddsLine([["Base", "1:240"]]);

const R_PARALLELS = oddsLine([
  ["Base", "1:400"],
  ["Superfractor", "1:114,001"],
]);

const FF_PARALLELS = oddsLine([
  ["Base", "1:10"],
  ["Black Refractor", "1:4,302"],
  ["Light Blue Refractor", "1:10,364"],
  ["Superfractor", "1:45,600"],
]);

const FF_AUTO_PARALLELS = oddsLine([
  ["Auto", "1:1,520"],
  ["Auto Black", "1:8,000"],
  ["Auto Light Blue", "1:19,827"],
  ["Auto Superfractor", "1:76,000"],
]);

const SET_DESCRIPTION =
  "200-card 2025 Topps Marvel Chrome Studios MCU-phase base with official hobby odds (Rainbow Refractor 1:2, Prism 1:6, Agatha 1:20, Thor's Lightning 1:27, Superfractor 1:2,887, Printing Plates 1:723) plus The Snap variation 1:30. Inserts already on the page: Brave New World 1:3, Born Again 1:6, Marvel Gods 1:80, TVA Pruning 1:226, Shadowbox 1:160, Agatha All Along 1:939, FF First Steps 1:10, Celestial Arrival 1:240, Reflections 1:400. Thunderbolts 1:6 and singles autos 1:25 are hobby rates even though those cards are not listed on this page. Value-box exclusive: Sky Blue Raywave. Breaker exclusive: Geometric parallels.";

const SNAP_CARD_TYPE = "THE SNAP VARIATION";
const BNW_CARD_TYPE = "CAPTAIN AMERICA: BRAVE NEW WORLD";
const DD_CARD_TYPE = "DAREDEVIL: BORN AGAIN";
const MG_CARD_TYPE = "MARVEL GODS";
const TVA_CARD_TYPE = "THE TVA PRUNING";
const AS_CARD_TYPE = "AVENGERS SHADOWBOX";
const AA_CARD_TYPE = "AGATHA ALL ALONG";
const CA_CARD_TYPE = "CELESTIAL ARRIVAL";
const R_CARD_TYPE = "REFLECTIONS";
const FF_CARD_TYPE = "THE FANTASTIC FOUR: FIRST STEPS";
const FF_HERBIE_CARD_TYPE = "FF-5 H.E.R.B.I.E.";

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== STUDIOS_SET_ID ||
    setId === CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID ||
    setId === FORBIDDEN_SET_ID
  );
}

function numberPrefix(cardNumber: string): string | null {
  const match = cardNumber.match(/^([A-Za-z]+)-\d+$/);
  return match ? match[1].toUpperCase() : null;
}

function looksLikeAuto(characterName: string | null | undefined, cardType: string | null | undefined): boolean {
  const hay = `${characterName ?? ""} ${cardType ?? ""}`;
  return /\bauto(?:graph)?s?\b/i.test(hay);
}

function metaForCard(
  cardNumber: string,
  cardType: string | null | undefined,
  characterName: string | null | undefined
): { parallels: string } | null {
  if (/^\d+$/.test(cardNumber) && cardType === "Base") {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 200) return { parallels: BASE_PARALLELS };
    return null;
  }

  if (cardType === SNAP_CARD_TYPE || numberPrefix(cardNumber) === "S") {
    return { parallels: SNAP_PARALLELS };
  }

  const type = (cardType ?? "").trim();
  const prefix = numberPrefix(cardNumber);
  const clearlyAuto = looksLikeAuto(characterName, cardType);

  if (type === BNW_CARD_TYPE || prefix === "BNW") return { parallels: BNW_PARALLELS };
  if (type === DD_CARD_TYPE || prefix === "DD") return { parallels: DD_PARALLELS };
  if (type === MG_CARD_TYPE || prefix === "MG") return { parallels: MG_PARALLELS };
  if (type === TVA_CARD_TYPE || prefix === "TVA") return { parallels: TVA_PARALLELS };
  if (type === AS_CARD_TYPE || prefix === "AS") return { parallels: AS_PARALLELS };
  if (type === AA_CARD_TYPE || prefix === "AA") {
    return { parallels: clearlyAuto ? AA_AUTO_PARALLELS : AA_PARALLELS };
  }
  if (type === CA_CARD_TYPE || prefix === "CA") return { parallels: CA_PARALLELS };
  if (type === R_CARD_TYPE || prefix === "R") return { parallels: R_PARALLELS };
  if (type === FF_CARD_TYPE || type === FF_HERBIE_CARD_TYPE || prefix === "FF") {
    return { parallels: clearlyAuto ? FF_AUTO_PARALLELS : FF_PARALLELS };
  }

  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(STUDIOS_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, STUDIOS_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 5 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, STUDIOS_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(STUDIOS_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      characterName: marvelCards.characterName,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, STUDIOS_SET_ID));

  let updated = 0;
  let skipped = 0;
  let baseUpdated = 0;
  let snapUpdated = 0;
  let insertUpdated = 0;

  for (const row of rows) {
    if (isLockedSet(row.setId)) {
      skipped += 1;
      continue;
    }
    const meta = metaForCard(row.cardNumber, row.cardType, row.characterName);
    if (!meta) {
      skipped += 1;
      continue;
    }

    if (row.parallels === meta.parallels) {
      skipped += 1;
      continue;
    }

    await db
      .update(marvelCards)
      .set({ parallels: meta.parallels })
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, STUDIOS_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && row.cardType === "Base") baseUpdated += 1;
    else if (row.cardType === SNAP_CARD_TYPE || numberPrefix(row.cardNumber) === "S") snapUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, snap ${snapUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedStudios2025Meta(): Promise<void> {
  if (isLockedSet(STUDIOS_SET_ID)) {
    console.error("[studios2025MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[studios2025MetaSeed] ${SEED_VERSION} starting setId=5 (odds only, photos untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[studios2025MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[studios2025MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[studios2025MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[studios2025MetaSeed] cards error: ${message}`);
  }

  console.log(`[studios2025MetaSeed] done version=${SEED_VERSION} setId=${STUDIOS_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startStudios2025MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[studios2025MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedStudios2025Meta().catch((err) => {
      console.error("[studios2025MetaSeed] fatal", err);
    });
  });
}