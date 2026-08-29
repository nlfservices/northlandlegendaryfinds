/**
 * One-shot seed: official 2024 Topps Chrome Sapphire Marvel print runs.
 * setId=90002 only (slug 2024-topps-chrome-sapphire-marvel). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, characterName, or cardType. Never inserts cards.
 *
 * Numeric Base (cardType Base, cardNumber 1-150): official numbered Sapphire
 * print-run ladder only. Topps did not publish per-pack 1:x for this set —
 * never invent pack rates, never copy 2025 Sapphire 1:5/1:7/1:10/1:20, and
 * never add Blue Sapphire 1:1. Print run is the value after the middle-dot
 * ("Green Sapphire · /99"), not a fake 1:99 odds field.
 *
 * Inserts: exact live cardType vs official sheet group only (case-insensitive,
 * punctuation stripped). Do not add missing groups. Leave unmatched rows as-is.
 *
 * Print runs only, never prices. Parser keeps thousands commas tight
 * (middle-dot U+00B7). Hobby print-run sheet only — no pack odds.
 *
 * Does not touch set 1, 2, 3, 4, 5, 6, 30001, 60001, 90001, 90003, 90004,
 * 90005, 90006, or 90007. Versioned in-memory once-flag so a bump re-runs
 * after a prior seed in this process. Must be started AFTER server.listen
 * so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const SAPPHIRE_2024_SET_ID = 90002;
const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const COLLECTOR_SET_ID = 30001;
const FORBIDDEN_60001 = 60001;
const CHROME_2024_SET_ID = 90001;
const DEADPOOL_2025_SET_ID = 90003;
const FORBIDDEN_90004 = 90004;
const CHROME_2026_SET_ID = 90005;
const MINT_2026_SET_ID = 90006;
const VAULT_SET_ID = 90007;

/** Bump when official 2024 Chrome Sapphire Marvel print runs change so the seed re-runs. */
const SEED_VERSION = "sapphire-2024-official-print-runs-v1";

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
  ["Green Sapphire", "/99"],
  ["Yellow Sapphire", "/75"],
  ["Gold Sapphire", "/50"],
  ["Orange Sapphire", "/25"],
  ["Purple Sapphire", "/15"],
  ["Black Sapphire", "/10"],
  ["Red Sapphire", "/5"],
  ["Padparadscha Sapphire", "1/1"],
]);

const SS_PARALLELS = oddsLine([
  ["Orange Sapphire", "/25"],
  ["Purple Sapphire", "/15"],
  ["Black Sapphire", "/10"],
  ["Red Sapphire", "/5"],
  ["Padparadscha Sapphire", "1/1"],
]);

const WOLVERINE_PARALLELS = oddsLine([
  ["Black Sapphire", "/10"],
  ["Red Sapphire", "/5"],
  ["Padparadscha Sapphire", "1/1"],
]);

const ARTIST_AUTO_PARALLELS = oddsLine([
  ["Gold Sapphire", "/50"],
  ["Orange Sapphire", "/25"],
  ["Purple Sapphire", "/15"],
  ["Black Sapphire", "/10"],
  ["Red Sapphire", "/5"],
  ["Padparadscha Sapphire", "1/1"],
]);

const FACSIMILE_AUTO_PARALLELS = oddsLine([
  ["Black Sapphire", "/10"],
  ["Red Sapphire", "/5"],
  ["Padparadscha Sapphire", "1/1"],
]);

const DUAL_QUAD_AUTO_PARALLELS = oddsLine([
  ["Red Sapphire", "/5"],
  ["Padparadscha Sapphire", "1/1"],
]);

const SET_DESCRIPTION =
  "2024 Topps Chrome Sapphire Marvel \u2013 same 150-character base as 2024 Chrome with cracked-ice Sapphire treatment. Official print runs (Green Sapphire /99 through Padparadscha Sapphire 1/1). Four numbered parallels per hobby box. Pack odds were not published. Inserts already on the page: Sapphire Selections, Wolverine 50th Anniversary, Comic Artist Autograph, Character Autograph (Facsimile), Dual Autograph, Quad Autograph. Print runs only, never prices.";

const TYPE_PARALLELS: Record<string, string> = {
  "sapphire selections": SS_PARALLELS,
  "wolverine 50th anniversary": WOLVERINE_PARALLELS,
  "comic artist autograph": ARTIST_AUTO_PARALLELS,
  "character autograph facsimile": FACSIMILE_AUTO_PARALLELS,
  "dual autograph": DUAL_QUAD_AUTO_PARALLELS,
  "quad autograph": DUAL_QUAD_AUTO_PARALLELS,
};

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== SAPPHIRE_2024_SET_ID ||
    setId === CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID ||
    setId === COLLECTOR_SET_ID ||
    setId === FORBIDDEN_60001 ||
    setId === CHROME_2024_SET_ID ||
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
  if (isLockedSet(SAPPHIRE_2024_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, SAPPHIRE_2024_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 90002 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, SAPPHIRE_2024_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(SAPPHIRE_2024_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, SAPPHIRE_2024_SET_ID));

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
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, SAPPHIRE_2024_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && normType(row.cardType) === "base") baseUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedSapphire2024Meta(): Promise<void> {
  if (isLockedSet(SAPPHIRE_2024_SET_ID)) {
    console.error("[sapphire2024MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[sapphire2024MetaSeed] ${SEED_VERSION} starting setId=90002 (print runs only, photos/cardType/characterName untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[sapphire2024MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sapphire2024MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[sapphire2024MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sapphire2024MetaSeed] cards error: ${message}`);
  }

  console.log(`[sapphire2024MetaSeed] done version=${SEED_VERSION} setId=${SAPPHIRE_2024_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startSapphire2024MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[sapphire2024MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedSapphire2024Meta().catch((err) => {
      console.error("[sapphire2024MetaSeed] fatal", err);
    });
  });
}
