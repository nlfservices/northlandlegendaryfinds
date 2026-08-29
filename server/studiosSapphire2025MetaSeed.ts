/**
 * One-shot seed: official 2025 Topps Marvel Studios Sapphire pack-rate pull odds.
 * setId=6 only (slug 2025-topps-marvel-studios-sapphire). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, or characterName. Never inserts cards.
 *
 * Numeric Base (cardType Base, cardNumber 1-200): replace the fake
 * "Base Cards, /99, /50, ..." list with named sapphire pack-rate odds.
 * Official sheet has NO print-run numbers — do not invent /99.
 *
 * Sapphire Selections (SS-1..SS-10 or cardType SAPPHIRE SELECTIONS): named pack odds.
 * Does not add autos / sketches that are not already in the DB (live has none).
 * Leave unmatched existing inserts as-is.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:1,706" stays one token (middle-dot U+00B7). Names + pack 1:x only;
 * do not invent print runs. Spell Padparadscha (not Padpradascha).
 *
 * This is NOT 2025 Chrome Sapphire (set 4, Green /99 1:5 Aqua /75 1:7).
 *
 * Does not touch set 1 (Chrome hobby), 2 (CBH), 3 (Mint 2025), 4 (Chrome Sapphire),
 * 5 (Chrome Studios), 30001, 60001, or 90001-90006. Versioned in-memory once-flag
 * so a bump re-runs after a prior seed in this process. Must be started AFTER
 * server.listen so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const STUDIOS_SAPPHIRE_SET_ID = 6;
const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const COLLECTOR_SET_ID = 30001;
const FORBIDDEN_60001 = 60001;
const FORBIDDEN_90001 = 90001;
const FORBIDDEN_90002 = 90002;
const FORBIDDEN_90003 = 90003;
const FORBIDDEN_90004 = 90004;
const FORBIDDEN_90005 = 90005;
const FORBIDDEN_SET_ID = 90006;

/** Bump when official Studios Sapphire pack odds change so the seed re-runs. */
const SEED_VERSION = "studios-sapphire-2025-official-pack-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const BASE_PARALLELS = oddsLine([
  ["Blue Sapphire", "1:1"],
  ["Green Sapphire", "1:5"],
  ["Gold Sapphire", "1:9"],
  ["Orange Sapphire", "1:17"],
  ["Purple Sapphire", "1:28"],
  ["Black Sapphire", "1:42"],
  ["Red Sapphire", "1:84"],
  ["Padparadscha Sapphire", "1:420"],
]);

const SS_PARALLELS = oddsLine([
  ["Sapphire Selections", "1:80"],
  ["Gold Sapphire", "1:169"],
  ["Orange Sapphire", "1:334"],
  ["Purple Sapphire", "1:557"],
  ["Black Sapphire", "1:835"],
  ["Red Sapphire", "1:1,706"],
  ["Padparadscha Sapphire", "1:11,452"],
]);

const SET_DESCRIPTION =
  "200-card 2025 Topps Marvel Chrome Studios Sapphire MCU-phase base with official sapphire pack odds (Blue 1:1, Green 1:5, Gold 1:9, Orange 1:17, Purple 1:28, Black 1:42, Red 1:84, Padparadscha 1:420). Sapphire Selections 1:80. Single autos Blue 1:32 (not on this page). Dual autos Blue 1:407, Trio Blue 1:1,163. Sketch gold foil 1:161, black foil 1:1,956. Odds only, never prices. Do not mix with 2025 Chrome Sapphire (set 4).";

const SS_CARD_TYPE = "SAPPHIRE SELECTIONS";

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== STUDIOS_SAPPHIRE_SET_ID ||
    setId === CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === COLLECTOR_SET_ID ||
    setId === FORBIDDEN_60001 ||
    setId === FORBIDDEN_90001 ||
    setId === FORBIDDEN_90002 ||
    setId === FORBIDDEN_90003 ||
    setId === FORBIDDEN_90004 ||
    setId === FORBIDDEN_90005 ||
    setId === FORBIDDEN_SET_ID
  );
}

function numberPrefix(cardNumber: string): string | null {
  const match = cardNumber.match(/^([A-Za-z]+)-\d+$/);
  return match ? match[1].toUpperCase() : null;
}

function metaForCard(
  cardNumber: string,
  cardType: string | null | undefined
): { parallels: string } | null {
  if (/^\d+$/.test(cardNumber) && cardType === "Base") {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 200) return { parallels: BASE_PARALLELS };
    return null;
  }

  if (cardType === SS_CARD_TYPE || numberPrefix(cardNumber) === "SS") {
    return { parallels: SS_PARALLELS };
  }

  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(STUDIOS_SAPPHIRE_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, STUDIOS_SAPPHIRE_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 6 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, STUDIOS_SAPPHIRE_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(STUDIOS_SAPPHIRE_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, STUDIOS_SAPPHIRE_SET_ID));

  let updated = 0;
  let skipped = 0;
  let baseUpdated = 0;
  let ssUpdated = 0;

  for (const row of rows) {
    if (isLockedSet(row.setId)) {
      skipped += 1;
      continue;
    }
    const meta = metaForCard(row.cardNumber, row.cardType);
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
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, STUDIOS_SAPPHIRE_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && row.cardType === "Base") baseUpdated += 1;
    else ssUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, sapphire selections ${ssUpdated}) skipped ${skipped}`;
}

async function seedStudiosSapphire2025Meta(): Promise<void> {
  if (isLockedSet(STUDIOS_SAPPHIRE_SET_ID)) {
    console.error("[studiosSapphire2025MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[studiosSapphire2025MetaSeed] ${SEED_VERSION} starting setId=6 (odds only, photos untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[studiosSapphire2025MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[studiosSapphire2025MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[studiosSapphire2025MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[studiosSapphire2025MetaSeed] cards error: ${message}`);
  }

  console.log(`[studiosSapphire2025MetaSeed] done version=${SEED_VERSION} setId=${STUDIOS_SAPPHIRE_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startStudiosSapphire2025MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[studiosSapphire2025MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedStudiosSapphire2025Meta().catch((err) => {
      console.error("[studiosSapphire2025MetaSeed] fatal", err);
    });
  });
}