/**
 * One-shot seed: official 2024 Topps Chrome Marvel hobby pull odds.
 * setId=90001 only (slug 2024-topps-chrome-marvel). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, characterName, or cardType. Never inserts cards.
 *
 * Numeric Base (cardType Base, cardNumber 1-150): official hobby 1:x rainbow.
 * Do not invent Clawed Chrome or 2025-only parallels.
 *
 * Inserts: exact live cardType vs sheet group only (case-insensitive, punctuation
 * stripped). MI-* is shared by Marvel Icons and Character Autograph (Facsimile) —
 * match cardType only; never apply Icons 1:12 to facsimile autos.
 *
 * Giant-Sized 50th Box Topper: Base 1 per hobby box. Sheet lists Gold/Orange/
 * Black Wave/Red/Superfractor print runs with no per-pack rates — do not invent
 * them (print runs go in the set description).
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:3,033" stays one token (middle-dot U+00B7). Hobby / per-pack only.
 * Print-run belongs in the parallel NAME ("Spider Web /399"), never in the
 * odds field as if it were a pull rate.
 *
 * Does not touch set 1, 2, 3, 4, 5, 6, 30001, 60001, 90002, 90003, 90004,
 * 90005, 90006, or 90007. Versioned in-memory once-flag so a bump re-runs
 * after a prior seed in this process. Must be started AFTER server.listen
 * so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const CHROME_2024_SET_ID = 90001;
const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const COLLECTOR_SET_ID = 30001;
const FORBIDDEN_60001 = 60001;
const FORBIDDEN_90002 = 90002;
const DEADPOOL_2025_SET_ID = 90003;
const FORBIDDEN_90004 = 90004;
const CHROME_2026_SET_ID = 90005;
const MINT_2026_SET_ID = 90006;
const VAULT_SET_ID = 90007;

/** Bump when official 2024 Chrome Marvel hobby odds change so the seed re-runs. */
const SEED_VERSION = "chrome-2024-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

function normType(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201B'`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const BASE_PARALLELS = oddsLine([
  ["Refractor", "1:2"],
  ["Spider Web /399", "1:8"],
  ["Blue Wave /150", "1:20"],
  ["Green /99", "1:31"],
  ["Green Gamma Ray Wave /99", "1:31"],
  ["Purple /75", "1:40"],
  ["Gold /50", "1:61"],
  ["Gold Wave /50", "1:61"],
  ["Human Torch /39", "1:78"],
  ["Orange /25", "1:121"],
  ["Black Wave /10", "1:303"],
  ["Red /5", "1:606"],
  ["Red Wave /5", "1:606"],
  ["Superfractor", "1:3,033"],
]);

const INSERT_1_12_PARALLELS = oddsLine([
  ["Base", "1:12"],
  ["Gold /50", "1:909"],
  ["Orange /25", "1:1,815"],
  ["Black Wave /10", "1:4,566"],
  ["Red /5", "1:9,036"],
  ["Superfractor", "1:43,373"],
]);

const SPIDER_MAN_GOLD_PARALLELS = oddsLine([
  ["Base", "1:72"],
  ["Gold /50", "1:909"],
  ["Orange /25", "1:1,815"],
  ["Black Wave /10", "1:4,566"],
  ["Red /5", "1:9,036"],
  ["Superfractor", "1:43,373"],
]);

const BOX_TOPPER_PARALLELS = oddsLine([["Base", "1 per box"]]);

const INDESTRUCTIBLE_PARALLELS = oddsLine([
  ["Black Lazer /10", "1:4,566"],
  ["Red Lazer /5", "1:9,036"],
  ["Superfractor", "1:43,373"],
]);

const MASK_ON_MASK_OFF_PARALLELS = oddsLine([
  ["Black Wave /10", "1:5,043"],
  ["Red /5", "1:9,857"],
  ["Superfractor", "1:48,192"],
]);

const SCARCE_AI_WC_PARALLELS = oddsLine([
  ["Black Wave /10", "1:9,036"],
  ["Red /5", "1:18,072"],
  ["Superfractor", "1:86,746"],
]);

const ARTIST_AUTO_PARALLELS = oddsLine([
  ["Green Gamma /99", "1:562"],
  ["Purple /75", "1:743"],
  ["Gold Wave /50", "1:1,112"],
  ["Human Torch /39", "1:1,427"],
  ["Orange /25", "1:2,236"],
  ["Black Wave /10", "1:5,561"],
  ["Red /5", "1:11,121"],
  ["Superfractor", "1:54,216"],
]);

const DUAL_AUTO_PARALLELS = oddsLine([
  ["Base /25", "1:5,941"],
  ["Black Wave /10", "1:14,956"],
  ["Red /5", "1:28,915"],
  ["Superfractor", "1:144,576"],
]);

const QUAD_AUTO_PARALLELS = oddsLine([
  ["Base /10", "1:43,373"],
  ["Red /5", "1:86,746"],
  ["Superfractor", "1:433,728"],
]);

const SKETCH_PARALLELS = oddsLine([["Sketch", "1:14,457"]]);

const SET_DESCRIPTION =
  "First Topps Chrome Marvel (2024). 150-card base with official hobby pack odds (Refractor 1:2, Spider Web /399 1:8, Superfractor 1:3,033). Inserts already on the page include Daredevil 60th 1:12, Marvel 90s 1:12, Giant-Sized 50th 1:12, Marvel Icons 1:12, Spider-Man Gold 1:72. Giant-Sized 50th box topper is 1 per hobby box (print runs listed without pack odds: Gold /50, Orange /25, Black Wave /10, Red /5, Superfractor 1/1). Odds only, never prices.";

const TYPE_PARALLELS: Record<string, string> = {
  "daredevil 60th anniversary": INSERT_1_12_PARALLELS,
  "marvel 90s": INSERT_1_12_PARALLELS,
  "giant sized 50th anniversary": INSERT_1_12_PARALLELS,
  "giant sized 50th box topper": BOX_TOPPER_PARALLELS,
  "marvel icons": INSERT_1_12_PARALLELS,
  "spider man gold": SPIDER_MAN_GOLD_PARALLELS,
  "indestructible": INDESTRUCTIBLE_PARALLELS,
  "mask on mask off": MASK_ON_MASK_OFF_PARALLELS,
  "avengers infinity": SCARCE_AI_WC_PARALLELS,
  "wolverine 50th anniversary": SCARCE_AI_WC_PARALLELS,
  "comic artist autograph": ARTIST_AUTO_PARALLELS,
  "character autograph facsimile": ARTIST_AUTO_PARALLELS,
  "dual autograph": DUAL_AUTO_PARALLELS,
  "quad autograph": QUAD_AUTO_PARALLELS,
  "sketch card": SKETCH_PARALLELS,
};

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== CHROME_2024_SET_ID ||
    setId === CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID ||
    setId === COLLECTOR_SET_ID ||
    setId === FORBIDDEN_60001 ||
    setId === FORBIDDEN_90002 ||
    setId === DEADPOOL_2025_SET_ID ||
    setId === FORBIDDEN_90004 ||
    setId === CHROME_2026_SET_ID ||
    setId === MINT_2026_SET_ID ||
    setId === VAULT_SET_ID
  );
}

function metaForCard(
  cardNumber: string,
  cardType: string | null | undefined
): { parallels: string } | null {
  const type = normType(cardType);

  if (/^\d+$/.test(cardNumber) && type === "base") {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 150) return { parallels: BASE_PARALLELS };
    return null;
  }

  const mapped = TYPE_PARALLELS[type];
  if (mapped) return { parallels: mapped };

  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(CHROME_2024_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, CHROME_2024_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 90001 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, CHROME_2024_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(CHROME_2024_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, CHROME_2024_SET_ID));

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
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, CHROME_2024_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && normType(row.cardType) === "base") baseUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedChrome2024Meta(): Promise<void> {
  if (isLockedSet(CHROME_2024_SET_ID)) {
    console.error("[chrome2024MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[chrome2024MetaSeed] ${SEED_VERSION} starting setId=90001 (odds only, photos/cardType/characterName untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[chrome2024MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[chrome2024MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[chrome2024MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[chrome2024MetaSeed] cards error: ${message}`);
  }

  console.log(`[chrome2024MetaSeed] done version=${SEED_VERSION} setId=${CHROME_2024_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startChrome2024MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[chrome2024MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedChrome2024Meta().catch((err) => {
      console.error("[chrome2024MetaSeed] fatal", err);
    });
  });
}
