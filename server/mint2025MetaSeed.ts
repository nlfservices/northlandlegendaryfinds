/**
 * One-shot seed: official 2025 Topps Marvel Mint cardType + hobby odds.
 * setId=3 only (slug 2025-topps-marvel-mint). Numeric cardNumber 1-120 only
 * for metal cardType / parallels. Never writes imageUrl or backImageUrl.
 *
 * Official metal subsets (en-dash, not mojibake ÔÇô):
 *   1-50   BASE CARDS – BRONZE
 *   51-75  BASE CARDS – SILVER
 *   76-100 BASE CARDS – GOLD
 *   101-120 BASE CARDS – PLATINUM
 *
 * Parallels are hobby/ecomm pull odds for the existing CBH-style parser
 * (name + 1:odds, thousands commas kept tight so "1:1,016" stays one token).
 * These are odds, never prices. Replaces fake "Base, /1, /5, /10, /25, /50, /75, PP".
 *
 * Gambit's Deck / Autograph / SDCC cardTypes stay as-is unless they contain
 * a garbled em-dash. Does not insert cards. Does not touch set 2, 4, or 90006.
 *
 * Versioned in-memory once-flag so a bump re-runs after a prior seed in this
 * process. Must be started AFTER server.listen so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const MINT_2025_SET_ID = 3;
const CBH_SET_ID = 2;
const SAPPHIRE_SET_ID = 4;
const FORBIDDEN_SET_ID = 90006;
const FIRST_CARD = 1;
const LAST_CARD = 120;

/** Bump when official Mint meta/odds change so the seed re-runs. */
const SEED_VERSION = "mint-2025-official-meta-odds-v1";

const EN_DASH = "\u2013";

/** ÔÇô (CP850 of UTF-8 en-dash) and â€“ (CP1252 of UTF-8 en-dash). */
const MOJIBAKE_DASH = /\u00D4\u00C7\u00F4|\u00E2\u20AC\u201C|\u00E2\u20AC\u201D/g;

const CARD_TYPE = {
  bronze: `BASE CARDS ${EN_DASH} BRONZE`,
  silver: `BASE CARDS ${EN_DASH} SILVER`,
  gold: `BASE CARDS ${EN_DASH} GOLD`,
  platinum: `BASE CARDS ${EN_DASH} PLATINUM`,
} as const;

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const BRONZE_PARALLELS = oddsLine([
  ["Bronze", "1:1"],
  ["Green Mint Foil", "1:5"],
  ["Gold Foil", "1:8"],
  ["Orange Foil", "1:15"],
  ["Black Foil", "1:36"],
  ["Red Foil", "1:72"],
  ["Printing Plates", "1:91"],
  ["Foilfractor", "1:368"],
  ["Chrome Variation", "1:4"],
  ["Chrome Black Refractor", "1:36"],
  ["Chrome Red Refractor", "1:72"],
  ["Chrome Superfractor", "1:368"],
]);

const SILVER_PARALLELS = oddsLine([
  ["Silver", "1:1"],
  ["Green Mint Foil", "1:10"],
  ["Gold Foil", "1:15"],
  ["Orange Foil", "1:29"],
  ["Black Foil", "1:72"],
  ["Red Foil", "1:146"],
  ["Printing Plates", "1:181"],
  ["Foilfractor", "1:785"],
  ["Chrome Variation", "1:10"],
  ["Chrome Black Refractor", "1:72"],
  ["Chrome Red Refractor", "1:146"],
  ["Chrome Superfractor", "1:785"],
]);

const GOLD_PARALLELS = oddsLine([
  ["Gold", "1:1"],
  ["Green Mint Foil", "1:10"],
  ["Gold Foil", "1:15"],
  ["Orange Foil", "1:29"],
  ["Black Foil", "1:72"],
  ["Red Foil", "1:146"],
  ["Printing Plates", "1:181"],
  ["Foilfractor", "1:785"],
  ["Chrome Variation", "1:15"],
  ["Chrome Black Refractor", "1:72"],
  ["Chrome Red Refractor", "1:146"],
  ["Chrome Superfractor", "1:785"],
]);

const PLATINUM_PARALLELS = oddsLine([
  ["Platinum", "1:10"],
  ["Black Shimmer Foil", "1:83"],
  ["Red Foil", "1:180"],
  ["Printing Plates", "1:225"],
  ["Foilfractor", "1:1,016"],
  ["Chrome Variation", "1:36"],
  ["Chrome Black Refractor", "1:90"],
  ["Chrome Red Refractor", "1:180"],
  ["Chrome Superfractor", "1:1,016"],
]);

const SET_DESCRIPTION =
  "120-card 2025 Topps Marvel Mint base (Bronze 1-50, Silver 51-75, Gold 76-100, Platinum 101-120), plus Gambit's Deck chrome playing cards, Doctor Doom comic cuts, chrome autographs, and sketches. Official hobby pull odds — Gambit's Deck 1:4, Doom comic cuts 1:61, Chrome autographs 1:24, Sketch 1:26, Stan Lee cut 1:15,701.";

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== MINT_2025_SET_ID ||
    setId === FORBIDDEN_SET_ID ||
    setId === CBH_SET_ID ||
    setId === SAPPHIRE_SET_ID
  );
}

function isNumericBaseNumber(cardNumber: string, n: number): boolean {
  if (!/^\d+$/.test(cardNumber)) return false;
  return parseInt(cardNumber, 10) === n;
}

function metalForCard(n: number): { cardType: string; parallels: string } | null {
  if (n >= 1 && n <= 50) return { cardType: CARD_TYPE.bronze, parallels: BRONZE_PARALLELS };
  if (n >= 51 && n <= 75) return { cardType: CARD_TYPE.silver, parallels: SILVER_PARALLELS };
  if (n >= 76 && n <= 100) return { cardType: CARD_TYPE.gold, parallels: GOLD_PARALLELS };
  if (n >= 101 && n <= 120) return { cardType: CARD_TYPE.platinum, parallels: PLATINUM_PARALLELS };
  return null;
}

function repairGarbledDash(value: string | null | undefined): string | null {
  if (typeof value !== "string" || !value) return null;
  if (!MOJIBAKE_DASH.test(value)) return null;
  MOJIBAKE_DASH.lastIndex = 0;
  return value.replace(MOJIBAKE_DASH, EN_DASH);
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(MINT_2025_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, MINT_2025_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 3 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, MINT_2025_SET_ID));
  return "attached set description";
}

async function seedOne(n: number): Promise<string> {
  if (n < FIRST_CARD || n > LAST_CARD) return `refuse: card ${n} outside 1-120`;
  if (isLockedSet(MINT_2025_SET_ID)) return "refuse: forbidden set";

  const metal = metalForCard(n);
  if (!metal) return `refuse: card ${n} has no metal mapping`;

  const db = await getDb();
  if (!db) return "skip: database unavailable";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(and(eq(marvelCards.setId, MINT_2025_SET_ID), eq(marvelCards.cardNumber, String(n))));

  const allowed = rows.filter(
    (row) => !isLockedSet(row.setId) && isNumericBaseNumber(row.cardNumber, n)
  );
  if (!allowed.length) return `skip: no setId=${MINT_2025_SET_ID} numeric card ${n}`;

  let updated = 0;
  for (const row of allowed) {
    if (isLockedSet(row.setId)) continue;
    if (!isNumericBaseNumber(row.cardNumber, n)) continue;

    const patch: { cardType?: string; parallels?: string } = {};
    if (row.cardType !== metal.cardType) patch.cardType = metal.cardType;
    if (row.parallels !== metal.parallels) patch.parallels = metal.parallels;
    if (Object.keys(patch).length === 0) continue;

    await db
      .update(marvelCards)
      .set(patch)
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, MINT_2025_SET_ID)));
    updated += 1;
  }

  if (updated === 0) return "skip: already current";
  return `updated ${updated} (${metal.cardType})`;
}

async function repairInsertCardTypes(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(MINT_2025_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, MINT_2025_SET_ID));

  let repaired = 0;
  for (const row of rows) {
    if (isLockedSet(row.setId)) continue;
    if (/^\d+$/.test(row.cardNumber)) continue;
    const next = repairGarbledDash(row.cardType);
    if (!next || next === row.cardType) continue;
    await db
      .update(marvelCards)
      .set({ cardType: next })
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, MINT_2025_SET_ID)));
    repaired += 1;
  }
  return repaired === 0 ? "skip: insert cardTypes clean" : `repaired ${repaired} insert cardTypes`;
}

async function seedMint2025Meta(): Promise<void> {
  if (isLockedSet(MINT_2025_SET_ID)) {
    console.error("[mint2025MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[mint2025MetaSeed] ${SEED_VERSION} starting setId=3 numeric 1-120 (cardType + odds only, photos untouched)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[mint2025MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[mint2025MetaSeed] set description error: ${message}`);
  }

  let attached = 0;
  let skipped = 0;

  for (let n = FIRST_CARD; n <= LAST_CARD; n++) {
    try {
      const result = await seedOne(n);
      if (result.startsWith("updated")) {
        attached += 1;
      } else {
        skipped += 1;
      }
      console.log(`[mint2025MetaSeed] #${n}: ${result}`);
    } catch (err) {
      skipped += 1;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[mint2025MetaSeed] #${n} error: ${message}`);
    }
  }

  try {
    const inserts = await repairInsertCardTypes();
    console.log(`[mint2025MetaSeed] inserts: ${inserts}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[mint2025MetaSeed] insert cardType repair error: ${message}`);
  }

  console.log(
    `[mint2025MetaSeed] done version=${SEED_VERSION} setId=${MINT_2025_SET_ID} updated=${attached} skipped=${skipped}`
  );
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startMint2025MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[mint2025MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedMint2025Meta().catch((err) => {
      console.error("[mint2025MetaSeed] fatal", err);
    });
  });
}
