/**
 * One-shot seed: official 2026 Topps Brooklyn Collection Captain America 85th hobby pull odds.
 * setId=90004 only (slug 2026-topps-brooklyn-captain-america-85th). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, or characterName. Never inserts cards.
 *
 * Numeric Base (cardType Base, cardNumber 1-50): replace the fake
 * "Chartreuse /199, Black /150, Gold /99, ..." print-run list with named hobby odds.
 * Do not keep fake /199 print runs.
 *
 * Inserts: match existing rows by cardType (and cardNumber prefix). Does not add
 * Sketch / Shield Diecut Sketch cards that are not already in the DB.
 * Leave unmatched inserts as-is.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:2,488" stays one token (middle-dot U+00B7).
 *
 * Does not touch set 1, 2, 3, 4, 5, 6, 30001, 60001, 90001, 90002, 90003,
 * 90005, or 90006. Versioned in-memory once-flag so a bump re-runs after a
 * prior seed in this process. Must be started AFTER server.listen so it
 * never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const CAP_85TH_SET_ID = 90004;
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
const FORBIDDEN_90005 = 90005;
const FORBIDDEN_SET_ID = 90006;

/** Bump when official Cap 85th hobby odds change so the seed re-runs. */
const SEED_VERSION = "cap85th-2026-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const BASE_PARALLELS = oddsLine([
  ["Base", "1:1"],
  ["Chartreuse", "1:3"],
  ["Black", "1:4"],
  ["Gold", "1:5"],
  ["Blue and Silver", "1:7"],
  ["Orange", "1:10"],
  ["Purple", "1:17"],
  ["Red", "1:50"],
  ["Foilfractor", "1:249"],
]);

const NY_HEROES_PARALLELS = oddsLine([
  ["Base", "1:1"],
  ["Gold", "1:10"],
  ["Orange", "1:20"],
  ["Purple", "1:34"],
  ["Red", "1:100"],
  ["Foilfractor", "1:498"],
]);

const TEAM_CAP_PARALLELS = oddsLine([
  ["Base", "1:1"],
  ["Orange", "1:20"],
  ["Purple", "1:34"],
  ["Red", "1:100"],
  ["Foilfractor", "1:498"],
]);

const WELCOME_BROOKLYN_PARALLELS = oddsLine([
  ["Base", "1:1"],
  ["Gold", "1:10"],
  ["Orange", "1:20"],
  ["Purple", "1:34"],
  ["Red", "1:100"],
  ["Foilfractor", "1:498"],
]);

const LIVING_LEGEND_PARALLELS = oddsLine([
  ["Base", "1:5"],
  ["Orange", "1:20"],
  ["Purple", "1:34"],
  ["Red", "1:100"],
  ["Foilfractor", "1:498"],
]);

const DISTINGUISHED_SERVICE_PARALLELS = oddsLine([
  ["Base", "1:7"],
  ["Gold", "1:10"],
  ["Orange", "1:20"],
  ["Purple", "1:34"],
  ["Red", "1:100"],
  ["Foilfractor", "1:498"],
]);

const YOU_ARE_WORTHY_PARALLELS = oddsLine([
  ["Base", "1:10"],
]);

const FOURTH_OF_JULY_PARALLELS = oddsLine([
  ["Base", "1:50"],
]);

const BROOKLYN_STATUE_PARALLELS = oddsLine([
  ["Base", "1:150"],
  ["Purple", "1:166"],
  ["Red", "1:498"],
  ["Foilfractor", "1:2,488"],
]);

const MCU_AUTO_PARALLELS = oddsLine([
  ["Base", "1:5"],
  ["Orange", "1:14"],
  ["Purple", "1:23"],
  ["Red", "1:57"],
  ["Foilfractor", "1:282"],
]);

const COMIC_CREATOR_AUTO_PARALLELS = oddsLine([
  ["Base", "1:17"],
  ["Orange", "1:49"],
  ["Purple", "1:81"],
  ["Red", "1:243"],
  ["Foilfractor", "1:1,213"],
]);

const MCU_DUAL_AUTO_PARALLELS = oddsLine([
  ["Base", "1:135"],
  ["Red", "1:270"],
  ["Foilfractor", "1:1,347"],
]);

const MCU_TRIPLE_AUTO_PARALLELS = oddsLine([
  ["Base", "1:203"],
  ["Red", "1:405"],
  ["Foilfractor", "1:2,021"],
]);

const SET_DESCRIPTION =
  "50-card 2026 Topps Brooklyn Collection Captain America 85th base with official hobby odds (Chartreuse 1:3, Black 1:4, Gold 1:5, Blue and Silver 1:7, Orange 1:10, Purple 1:17, Red 1:50, Foilfractor 1:249). Inserts already on the page: New York's Heroes 1:1, Team Cap 1:1, Welcome to Brooklyn 1:1, Living Legend 1:5, Distinguished Service 1:7, You Are Worthy 1:10, Born on the 4th of July 1:50, Brooklyn Statue 1:150, MCU autographs 1:5, Comic creator autos 1:17. Sketch 1:12, Shield diecut sketch 1:61.";

const NY_HEROES_TYPE = "New York's Heroes";
const TEAM_CAP_TYPE = "Team Cap";
const WELCOME_BROOKLYN_TYPE = "Welcome to Brooklyn";
const LIVING_LEGEND_TYPE = "Living Legend";
const DISTINGUISHED_SERVICE_TYPE = "Distinguished Service";
const YOU_ARE_WORTHY_TYPE = "You Are Worthy";
const FOURTH_OF_JULY_TYPE = "Born on the 4th of July";
const BROOKLYN_STATUE_TYPE = "Brooklyn Statue";
const MCU_AUTO_TYPE = "MCU Autograph";
const COMIC_CREATOR_AUTO_TYPE = "Comic Creator Autograph";
const MCU_DUAL_AUTO_TYPE = "MCU Dual Autograph";
const MCU_TRIPLE_AUTO_TYPE = "MCU Triple Autograph";

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== CAP_85TH_SET_ID ||
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
    setId === FORBIDDEN_90005 ||
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

  if (/^\d+$/.test(cardNumber) && type === "Base") {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 50) return { parallels: BASE_PARALLELS };
    return null;
  }

  if (type === NY_HEROES_TYPE || prefix === "NYF") return { parallels: NY_HEROES_PARALLELS };
  if (type === TEAM_CAP_TYPE || prefix === "TC") return { parallels: TEAM_CAP_PARALLELS };
  if (type === WELCOME_BROOKLYN_TYPE || prefix === "WB") return { parallels: WELCOME_BROOKLYN_PARALLELS };
  if (type === LIVING_LEGEND_TYPE || prefix === "NH") return { parallels: LIVING_LEGEND_PARALLELS };
  if (type === DISTINGUISHED_SERVICE_TYPE || prefix === "DS") return { parallels: DISTINGUISHED_SERVICE_PARALLELS };
  if (type === YOU_ARE_WORTHY_TYPE || prefix === "AW") return { parallels: YOU_ARE_WORTHY_PARALLELS };
  if (type === FOURTH_OF_JULY_TYPE || prefix === "FOJ") return { parallels: FOURTH_OF_JULY_PARALLELS };
  if (type === BROOKLYN_STATUE_TYPE || prefix === "CBS") return { parallels: BROOKLYN_STATUE_PARALLELS };
  if (type === MCU_AUTO_TYPE || prefix === "MUA") return { parallels: MCU_AUTO_PARALLELS };
  if (type === COMIC_CREATOR_AUTO_TYPE || prefix === "CCA") return { parallels: COMIC_CREATOR_AUTO_PARALLELS };
  if (type === MCU_DUAL_AUTO_TYPE || prefix === "MDA") return { parallels: MCU_DUAL_AUTO_PARALLELS };
  if (type === MCU_TRIPLE_AUTO_TYPE || prefix === "MTA") return { parallels: MCU_TRIPLE_AUTO_PARALLELS };

  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(CAP_85TH_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, CAP_85TH_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 90004 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, CAP_85TH_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(CAP_85TH_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, CAP_85TH_SET_ID));

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
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, CAP_85TH_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && row.cardType === "Base") baseUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedCap85thMeta(): Promise<void> {
  if (isLockedSet(CAP_85TH_SET_ID)) {
    console.error("[cap85thMetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[cap85thMetaSeed] ${SEED_VERSION} starting setId=90004 (odds only, photos untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[cap85thMetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[cap85thMetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[cap85thMetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[cap85thMetaSeed] cards error: ${message}`);
  }

  console.log(`[cap85thMetaSeed] done version=${SEED_VERSION} setId=${CAP_85TH_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startCap85thMetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[cap85thMetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedCap85thMeta().catch((err) => {
      console.error("[cap85thMetaSeed] fatal", err);
    });
  });
}