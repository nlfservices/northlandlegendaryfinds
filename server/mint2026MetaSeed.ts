/**
 * One-shot seed: official 2026 Topps Marvel Mint hobby pull odds.
 * setId=90006 only (slug 2026-topps-marvel-mint). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, or characterName. Never inserts cards.
 * Leaves cardType as-is ("Base - Bronze", "Cerebro", ...) so grouping stays.
 *
 * Numeric base 1-125: replace the fake generic parallel list
 * ("Chrome, Green Mint Foil, Orange Foil /25, Black & Yellow Electric Dots /10 (SDCC),
 * Foilfractor 1/1, SuperFractor 1/1") with official hobby 1:x per metal.
 * Chrome Variation lines ride on the matching metal (like 2025 Mint).
 * Diamante lines are hobby (SDCC blank) — include on hobby base.
 * Electric Dots is SDCC-only — description only, not on hobby Platinum parallels.
 *
 * Inserts: match existing rows by cardType (and cardNumber prefix). Does not add
 * Spider-Man Comic Cuts if that cardType is not already present (live rows are
 * typed Cut Signature). Cut Signature sheet is "-" — leave parallels unchanged.
 * SDCC Exclusive (Ian McDonald Art) cards exist and use the SDCC SKU column.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:1,316" stays one token (middle-dot U+00B7). Hobby SKU column only.
 *
 * Does not touch set 1, 2, 3 (2025 Mint), 4, 5, 6, 30001, 60001, 90001-90005,
 * or 90007 (Vault). Versioned in-memory once-flag so a bump re-runs after a
 * prior seed in this process. Must be started AFTER server.listen so it
 * never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const MINT_2026_SET_ID = 90006;
const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const COLLECTOR_SET_ID = 30001;
const FORBIDDEN_60001 = 60001;
const FORBIDDEN_90001 = 90001;
const FORBIDDEN_90002 = 90002;
const FORBIDDEN_90003 = 90003;
const FORBIDDEN_90004 = 90004;
const FORBIDDEN_90005 = 90005;
const VAULT_SET_ID = 90007;

/** Bump when official 2026 Marvel Mint hobby odds change so the seed re-runs. */
const SEED_VERSION = "mint-2026-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const BRONZE_PARALLELS = oddsLine([
  ["Bronze", "1:1"],
  ["Green Mint Foil", "1:10"],
  ["Sky Blue Foil", "1:7"],
  ["Gold Foil", "1:14"],
  ["Orange Foil", "1:28"],
  ["Orange Diamante Foil", "1:26"],
  ["Black Foil", "1:68"],
  ["Red Foil", "1:135"],
  ["Red Diamante Foil", "1:127"],
  ["Foilfractor", "1:673"],
  ["Printing Plates", "1:168"],
  ["Chrome Variation", "1:7"],
  ["Chrome Black Refractor", "1:67"],
  ["Chrome Red Refractor", "1:134"],
  ["Chrome Superfractor", "1:673"],
]);

const SILVER_PARALLELS = oddsLine([
  ["Silver", "1:1"],
  ["Green Mint Foil", "1:18"],
  ["Sky Blue Foil", "1:14"],
  ["Gold Foil", "1:28"],
  ["Orange Foil", "1:54"],
  ["Orange Diamante Foil", "1:51"],
  ["Black Foil", "1:135"],
  ["Red Foil", "1:272"],
  ["Red Diamante Foil", "1:255"],
  ["Foilfractor", "1:1,316"],
  ["Printing Plates", "1:333"],
  ["Chrome Variation", "1:18"],
  ["Chrome Black Refractor", "1:134"],
  ["Chrome Red Refractor", "1:266"],
  ["Chrome Superfractor", "1:1,316"],
]);

const GOLD_PARALLELS = oddsLine([
  ["Gold", "1:1"],
  ["Green Mint Foil", "1:18"],
  ["Sky Blue Foil", "1:14"],
  ["Gold Foil", "1:28"],
  ["Orange Foil", "1:54"],
  ["Orange Diamante Foil", "1:51"],
  ["Black Foil", "1:135"],
  ["Red Foil", "1:272"],
  ["Red Diamante Foil", "1:255"],
  ["Foilfractor", "1:1,316"],
  ["Printing Plates", "1:337"],
  ["Chrome Variation", "1:27"],
  ["Chrome Black Refractor", "1:134"],
  ["Chrome Red Refractor", "1:266"],
  ["Chrome Superfractor", "1:1,316"],
]);

const PLATINUM_PARALLELS = oddsLine([
  ["Platinum", "1:14"],
  ["Black Shimmer Foil", "1:127"],
  ["Red Foil", "1:272"],
  ["Foilfractor", "1:1,316"],
  ["Printing Plates", "1:333"],
  ["Chrome Variation", "1:53"],
  ["Chrome Black Refractor", "1:134"],
  ["Chrome Red Refractor", "1:265"],
  ["Chrome Superfractor", "1:1,316"],
]);

const SYMBIOTE_PARALLELS = oddsLine([
  ["Base", "1:5"],
  ["Orange Foil", "1:45"],
  ["Black and Gold Foil", "1:112"],
  ["Red Carnage Foil", "1:224"],
  ["Foilfractor", "1:1,121"],
]);

const CEREBRO_PARALLELS = oddsLine([
  ["Base", "1:7"],
  ["Orange Refractor", "1:25"],
  ["Black Refractor", "1:61"],
  ["Red Refractor", "1:121"],
  ["Superfractor", "1:605"],
]);

const CHROME_AUTO_PARALLELS = oddsLine([
  ["Base", "1:3"],
  ["Black Refractor", "1:97"],
  ["Red Refractor", "1:192"],
  ["Superfractor", "1:976"],
]);

const SKETCH_PARALLELS = oddsLine([["Base", "1:13"]]);

const SKETCH_VILLAIN_PARALLELS = oddsLine([["Base", "1:91"]]);

const SDCC_EXCLUSIVE_PARALLELS = oddsLine([
  ["Base", "1:14"],
  ["Black Refractor", "1:75"],
  ["Red Refractor", "1:167"],
  ["Superfractor", "1:667"],
]);

const SET_DESCRIPTION =
  "125-card 2026 Topps Marvel Mint base (Bronze 1-50, Silver 51-75, Gold 76-100, Platinum 101-125). Official hobby odds — Bronze Green Mint Foil 1:10, Sky Blue 1:7, Foilfractor 1:673; Platinum 1:14, Black Shimmer 1:127. Inserts on the page: Mass Symbiote Takeover 1:5, Cerebro 1:7, Chrome autographs 1:3, Sketch 1:13. Spider-Man comic cuts 1:67. SDCC exclusive Electric Dots on Platinum and SDCC Exclusive cards. Odds only, never prices.";

const SYMBIOTE_TYPE = "Mass Symbiote Takeover";
const CEREBRO_TYPE = "Cerebro";
const STUDIOS_AUTO_TYPE = "Chrome Autograph - Marvel Studios";
const CREATOR_AUTO_TYPE = "Chrome Autograph - Comic Creator";
const SKETCH_TYPE = "Sketch Card";
const SKETCH_VILLAIN_TYPE = "Sketch Card - Spider-Man Villain Edition";
const SDCC_TYPE = "SDCC Exclusive (Ian McDonald Art)";

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== MINT_2026_SET_ID ||
    setId === CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID ||
    setId === COLLECTOR_SET_ID ||
    setId === FORBIDDEN_60001 ||
    setId === FORBIDDEN_90001 ||
    setId === FORBIDDEN_90002 ||
    setId === FORBIDDEN_90003 ||
    setId === FORBIDDEN_90004 ||
    setId === FORBIDDEN_90005 ||
    setId === VAULT_SET_ID
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
  const upper = cardNumber.toUpperCase();

  if (/^\d+$/.test(cardNumber)) {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 50) return { parallels: BRONZE_PARALLELS };
    if (n >= 51 && n <= 75) return { parallels: SILVER_PARALLELS };
    if (n >= 76 && n <= 100) return { parallels: GOLD_PARALLELS };
    if (n >= 101 && n <= 125) return { parallels: PLATINUM_PARALLELS };
    return null;
  }

  if (type === SYMBIOTE_TYPE || prefix === "ST") return { parallels: SYMBIOTE_PARALLELS };
  if (type === CEREBRO_TYPE || prefix === "CB") return { parallels: CEREBRO_PARALLELS };
  if (type === STUDIOS_AUTO_TYPE || prefix === "MSA") return { parallels: CHROME_AUTO_PARALLELS };
  if (type === CREATOR_AUTO_TYPE || prefix === "CCA") return { parallels: CHROME_AUTO_PARALLELS };
  if (type === SKETCH_VILLAIN_TYPE || upper.startsWith("SK-SV")) {
    return { parallels: SKETCH_VILLAIN_PARALLELS };
  }
  if (type === SKETCH_TYPE || upper === "SK") return { parallels: SKETCH_PARALLELS };
  if (type === SDCC_TYPE || prefix === "SDCC") return { parallels: SDCC_EXCLUSIVE_PARALLELS };

  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(MINT_2026_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, MINT_2026_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 90006 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, MINT_2026_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(MINT_2026_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, MINT_2026_SET_ID));

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
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, MINT_2026_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber)) baseUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedMint2026Meta(): Promise<void> {
  if (isLockedSet(MINT_2026_SET_ID)) {
    console.error("[mint2026MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[mint2026MetaSeed] ${SEED_VERSION} starting setId=90006 (odds only, photos/cardType/characterName untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[mint2026MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[mint2026MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[mint2026MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[mint2026MetaSeed] cards error: ${message}`);
  }

  console.log(`[mint2026MetaSeed] done version=${SEED_VERSION} setId=${MINT_2026_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startMint2026MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[mint2026MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedMint2026Meta().catch((err) => {
      console.error("[mint2026MetaSeed] fatal", err);
    });
  });
}
