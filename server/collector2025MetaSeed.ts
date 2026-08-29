/**
 * One-shot seed: official 2025 Topps Marvel Studios The Collector hobby pull odds.
 * setId=30001 only (slug 2025-marvel-the-collector). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, or characterName. Never inserts cards.
 *
 * Numeric MCU Perfection (cardType MCU Perfection, cardNumber 1-85): replace the
 * fake "Base, Orange /17, Purple /28, ..." print-run list with named hobby odds.
 * Official sheet has no unnumbered 1:1 — do not invent one. No /99 print runs.
 *
 * Inserts: match existing rows by cardType (and cardNumber prefix). Does not add
 * sketch cards that are not already in the DB. Leave unmatched inserts as-is.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:1,347" stays one token (middle-dot U+00B7).
 *
 * Does not touch set 1 (Chrome), 2 (CBH), 3 (Mint 2025), 4 (Sapphire),
 * 5 (Chrome Studios), 6 (Studios Sapphire), or 90006. Versioned in-memory
 * once-flag so a bump re-runs after a prior seed in this process. Must be
 * started AFTER server.listen so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const COLLECTOR_SET_ID = 30001;
const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const FORBIDDEN_SET_ID = 90006;

/** Bump when official Collector hobby odds change so the seed re-runs. */
const SEED_VERSION = "collector-2025-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const MCU_PERFECTION_PARALLELS = oddsLine([
  ["Orange", "1:17"],
  ["Purple", "1:28"],
  ["Black", "1:42"],
  ["Red", "1:83"],
  ["Gold", "1:406"],
]);

const INSERT_LADDER_PARALLELS = oddsLine([
  ["Base", "1:15"],
  ["Orange", "1:57"],
  ["Purple", "1:94"],
  ["Black", "1:141"],
  ["Red", "1:279"],
  ["Gold", "1:1,347"],
]);

const MCU_PERFECTION_AUTO_PARALLELS = oddsLine([
  ["Base", "1:9"],
  ["Orange", "1:35"],
  ["Purple", "1:58"],
  ["Black", "1:87"],
  ["Red", "1:172"],
  ["Gold", "1:842"],
]);

const COLLECTORS_MUSEUM_PARALLELS = oddsLine([
  ["Base", "1:12"],
  ["Orange", "1:46"],
  ["Purple", "1:77"],
  ["Black", "1:119"],
  ["Red", "1:229"],
  ["Gold", "1:1,122"],
]);

const DUAL_AUTO_PARALLELS = oddsLine([
  ["Base", "1:274"],
  ["Purple", "1:455"],
  ["Black", "1:687"],
  ["Red", "1:1,347"],
  ["Gold", "1:6,732"],
]);

const TREASURES_OF_ASGARD_PARALLELS = oddsLine([
  ["Base", "1:138"],
  ["Purple", "1:229"],
  ["Black", "1:344"],
  ["Red", "1:687"],
  ["Gold", "1:3,366"],
]);

const INFINITY_GAUNTLET_PARALLELS = oddsLine([
  ["Purple", "1:5,610"],
  ["Blue", "1:6,732"],
  ["Red", "1:8,415"],
  ["Orange", "1:11,220"],
  ["Green", "1:16,830"],
  ["Yellow", "1:33,660"],
]);

const SET_DESCRIPTION =
  "85-card MCU Perfection base (Mister Fantastic through Thanos) with official hobby odds Orange 1:17, Purple 1:28, Black 1:42, Red 1:83, Gold 1:406. Inserts already on the page: Marvel Tomorrow / Villainy / Show Stoppers 1:15, MCU Perfection autograph 1:9, Collector's Museum 1:12, Dual autographs 1:274, Treasures of Asgard 1:138, Infinity Gauntlet Purple 1:5,610 through Yellow 1:33,660. Sketch Marvel Arthouse 1:70, Miller Magnificence 1:1,683.";

const MCU_PERFECTION_TYPE = "MCU Perfection";
const MARVEL_TOMORROW_TYPE = "Marvel Tomorrow";
const VILLAINY_TYPE = "Villainy";
const SHOW_STOPPERS_TYPE = "Show Stoppers";
const MCU_PERFECTION_AUTO_TYPE = "MCU Perfection Autograph";
const COLLECTORS_MUSEUM_TYPE = "The Collector's Museum";
const DUAL_AUTO_TYPE = "Dual Autographs";
const TREASURES_TYPE = "Treasures of Asgard";
const INFINITY_GAUNTLET_TYPE = "Infinity Gauntlet";
const INFINITY_GAUNTLET_AUTO_TYPE = "Infinity Gauntlet Autograph";

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== COLLECTOR_SET_ID ||
    setId === CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID ||
    setId === FORBIDDEN_SET_ID
  );
}

function numberPrefix(cardNumber: string): string | null {
  const match = cardNumber.match(/^([A-Za-z]+)-/);
  return match ? match[1].toUpperCase() : null;
}

function metaForCard(
  cardNumber: string,
  cardType: string | null | undefined
): { parallels: string } | null {
  const type = (cardType ?? "").trim();
  const prefix = numberPrefix(cardNumber);

  if (/^\d+$/.test(cardNumber) && type === MCU_PERFECTION_TYPE) {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 85) return { parallels: MCU_PERFECTION_PARALLELS };
    return null;
  }

  if (type === MARVEL_TOMORROW_TYPE || prefix === "MT") return { parallels: INSERT_LADDER_PARALLELS };
  if (type === VILLAINY_TYPE || prefix === "V") return { parallels: INSERT_LADDER_PARALLELS };
  if (type === SHOW_STOPPERS_TYPE || prefix === "ST") return { parallels: INSERT_LADDER_PARALLELS };
  if (type === MCU_PERFECTION_AUTO_TYPE || prefix === "MP") return { parallels: MCU_PERFECTION_AUTO_PARALLELS };
  if (type === COLLECTORS_MUSEUM_TYPE || prefix === "TM") return { parallels: COLLECTORS_MUSEUM_PARALLELS };
  if (type === DUAL_AUTO_TYPE || prefix === "DA") return { parallels: DUAL_AUTO_PARALLELS };
  if (type === TREASURES_TYPE || prefix === "TA") return { parallels: TREASURES_OF_ASGARD_PARALLELS };
  if (type === INFINITY_GAUNTLET_AUTO_TYPE) return { parallels: INFINITY_GAUNTLET_PARALLELS };
  if (type === INFINITY_GAUNTLET_TYPE || prefix === "IG") return { parallels: INFINITY_GAUNTLET_PARALLELS };

  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(COLLECTOR_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, COLLECTOR_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 30001 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, COLLECTOR_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(COLLECTOR_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, COLLECTOR_SET_ID));

  let updated = 0;
  let skipped = 0;
  let baseUpdated = 0;
  let insertUpdated = 0;

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
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, COLLECTOR_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && row.cardType === MCU_PERFECTION_TYPE) baseUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (mcu perfection ${baseUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedCollector2025Meta(): Promise<void> {
  if (isLockedSet(COLLECTOR_SET_ID)) {
    console.error("[collector2025MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[collector2025MetaSeed] ${SEED_VERSION} starting setId=30001 (odds only, photos untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[collector2025MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[collector2025MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[collector2025MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[collector2025MetaSeed] cards error: ${message}`);
  }

  console.log(`[collector2025MetaSeed] done version=${SEED_VERSION} setId=${COLLECTOR_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startCollector2025MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[collector2025MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedCollector2025Meta().catch((err) => {
      console.error("[collector2025MetaSeed] fatal", err);
    });
  });
}