/**
 * One-shot seed: official 2025 Topps Chrome Deadpool hobby pull odds.
 * setId=90003 only (slug 2025-topps-chrome-deadpool). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, characterName, or cardType. Never inserts cards.
 *
 * Numeric 1-100 (COMIC ACCURATE / CHARACTERS / MULTIVERSE AND MORE): official
 * hobby 1:x rainbow. Skip value-only Mini Diamonds / Purple Mini Diamonds /
 * Blue Mini Diamonds (hobby blank).
 *
 * Inserts: match live cardType names case-insensitively against the hobby sheet.
 * COMIC BOOK GOLD, COVER STARS, FUTURE STARS, TOPPS ORIGINALS (TO-* only),
 * Mouth, Best Bubs, Looking for Logan, Indestructible, Deadpool Reflections,
 * Hidden Gems, The Void, and named autograph groups. FO-* cards are typed
 * Topps Originals in this database but are 10005-Fire on the sheet — leave
 * parallels None. DEADPOOL ICONS is value exclusive (hobby blank) — leave None.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:3,710" stays one token (middle-dot U+00B7). Hobby column only.
 *
 * Does not touch set 1, 2, 3, 4, 5, 6, 30001, 60001, 90001, 90002, 90004,
 * 90005, 90006, or 90007. Versioned in-memory once-flag so a bump re-runs
 * after a prior seed in this process. Must be started AFTER server.listen
 * so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const DEADPOOL_2025_SET_ID = 90003;
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
const FORBIDDEN_90004 = 90004;
const CHROME_2026_SET_ID = 90005;
const MINT_2026_SET_ID = 90006;
const VAULT_SET_ID = 90007;

/** Bump when official 2025 Chrome Deadpool hobby odds change so the seed re-runs. */
const SEED_VERSION = "deadpool-2025-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

function normType(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const BASE_PARALLELS = oddsLine([
  ["Base", "1:1"],
  ["Refractor", "1:2"],
  ["Prism Refractor", "1:3"],
  ["Green Lava", "1:32"],
  ["Yellow Wave", "1:16"],
  ["Pink Shimmer", "1:20"],
  ["Purple Wave", "1:22"],
  ["Aqua Refractor", "1:26"],
  ["Green/Aqua RayWave Refractor", "1:33"],
  ["Green Refractor", "1:60"],
  ["Dogpool Refractor", "1:50"],
  ["Gold Raywave", "1:75"],
  ["TVA Takeover Refractor", "1:78"],
  ["Gold Lava", "1:63"],
  ["Human Torch Lava (Red & Orange)", "1:99"],
  ["Orange Shimmer", "1:149"],
  ["Wolverine Yellow & Blue X-Fractor", "1:270"],
  ["Black Lava", "1:311"],
  ["Black Refractor", "1:371"],
  ["Deadpool Red & Black Wave", "1:660"],
  ["Red Refractor", "1:660"],
  ["Superfractor", "1:3,710"],
]);

const COMIC_BOOK_GOLD_PARALLELS = oddsLine([
  ["Base", "1:3"],
  ["Gold Refractor", "1:264"],
  ["Orange Shimmer", "1:528"],
  ["Wolverine Yellow & Blue X-Fractor", "1:990"],
  ["Black Refractor", "1:1,319"],
  ["Deadpool Red & Black Wave", "1:3,166"],
  ["Red Refractor", "1:3,166"],
  ["Superfractor", "1:13,190"],
]);

const COVER_STARS_PARALLELS = COMIC_BOOK_GOLD_PARALLELS;

const FUTURE_STARS_PARALLELS = oddsLine([
  ["Base", "1:8"],
  ["Gold Refractor", "1:792"],
  ["Orange Shimmer", "1:1,583"],
  ["Wolverine Yellow & Blue X-Fractor", "1:2,968"],
  ["Black Refractor", "1:3,957"],
  ["Deadpool Red & Black Wave", "1:9,497"],
  ["Red Refractor", "1:9,497"],
  ["Superfractor", "1:39,568"],
]);

const MOUTH_PARALLELS = FUTURE_STARS_PARALLELS;

const TOPPS_ORIGINALS_PARALLELS = oddsLine([
  ["Base", "1:475"],
  ["Orange Shimmer", "1:1,349"],
  ["Wolverine Yellow & Blue X-Fractor", "1:2,283"],
  ["Black Refractor", "1:3,710"],
  ["Deadpool Red & Black Wave", "1:7,810"],
  ["Red Refractor", "1:8,021"],
  ["Superfractor", "1:37,095"],
]);

const BEST_BUBS_PARALLELS = oddsLine([
  ["Unnumbered Refractor", "1:1,017"],
  ["Wolverine Yellow & Blue X-Fractor", "1:2,723"],
  ["Black Refractor", "1:3,905"],
  ["Deadpool Red & Black Wave", "1:7,610"],
  ["Red Refractor", "1:7,610"],
  ["Superfractor", "1:37,095"],
]);

const LOOKING_FOR_LOGAN_PARALLELS = oddsLine([
  ["Unnumbered Refractor", "1:5,936"],
  ["Wolverine Yellow & Blue X-Fractor", "1:4,430"],
  ["Black Refractor", "1:6,745"],
  ["Deadpool Red & Black Wave", "1:13,490"],
  ["Red Refractor", "1:13,490"],
  ["Superfractor", "1:74,190"],
]);

const INDESTRUCTIBLE_PARALLELS = oddsLine([
  ["Black Lazer", "1:6,183"],
  ["Red Lazer", "1:12,365"],
  ["Superfractor", "1:59,352"],
]);

const DEADPOOL_REFLECTIONS_PARALLELS = oddsLine([
  ["Unnumbered Refractor", "1:1,188"],
  ["Kaleidoscope", "1:2,494"],
  ["Shimmer", "1:6,183"],
  ["RayWave", "1:12,365"],
  ["Superfractor", "1:59,352"],
]);

const HIDDEN_GEMS_PARALLELS = oddsLine([
  ["Emerald", "1:1,484"],
  ["Alexandrite", "1:14,838"],
  ["Citrine", "1:6,902"],
  ["Painite", "1:74,190"],
]);

const THE_VOID_PARALLELS = oddsLine([
  ["Lava Refractor", "1:1,484"],
  ["Wolverine Yellow & Blue X-Fractor", "1:2,076"],
  ["Black Refractor", "1:3,124"],
  ["Deadpool Red & Black Wave", "1:6,183"],
  ["Red Refractor", "1:6,183"],
  ["Superfractor", "1:29,676"],
]);

const CHROME_AUTO_PARALLELS = oddsLine([
  ["Refractor", "1:46"],
  ["Aqua Refractor", "1:130"],
  ["Green/Aqua RayWave Refractor", "1:138"],
  ["Green Refractor", "1:184"],
  ["Dogpool Refractor", "1:243"],
  ["Gold Raywave", "1:322"],
  ["Human Torch Lava (Red & Orange)", "1:416"],
  ["Orange Shimmer", "1:586"],
  ["Wolverine Yellow & Blue X-Fractor", "1:983"],
  ["Black Refractor", "1:1,470"],
  ["Deadpool Red & Black Wave", "1:2,968"],
  ["Red Refractor", "1:2,939"],
  ["Superfractor", "1:15,619"],
]);

const BEST_BUBS_AUTO_PARALLELS = oddsLine([
  ["Refractor", "1:171"],
  ["Orange Shimmer", "1:1,331"],
  ["Wolverine Yellow & Blue X-Fractor", "1:1,879"],
  ["Black Refractor", "1:2,800"],
  ["Deadpool Red & Black Wave", "1:5,936"],
  ["Red Refractor", "1:5,936"],
  ["Superfractor", "1:26,979"],
]);

const DUAL_AUTO_PARALLELS = oddsLine([
  ["Refractor", "1:2,283"],
  ["Gold Raywave", "1:1,492"],
  ["Human Torch Lava (Red & Orange)", "1:931"],
  ["Orange Shimmer", "1:1,515"],
  ["Wolverine Yellow & Blue X-Fractor", "1:2,413"],
  ["Black Refractor", "1:3,576"],
  ["Deadpool Red & Black Wave", "1:7,419"],
  ["Red Refractor", "1:7,419"],
  ["Superfractor", "1:32,974"],
]);

const ARTIST_AUTO_PARALLELS = oddsLine([
  ["Refractor", "1:201"],
  ["Green Refractor", "1:592"],
  ["Gold Raywave", "1:1,202"],
  ["Human Torch Lava (Red & Orange)", "1:1,448"],
  ["Orange Shimmer", "1:2,394"],
  ["Wolverine Yellow & Blue X-Fractor", "1:3,710"],
  ["Black Refractor", "1:5,496"],
  ["Deadpool Red & Black Wave", "1:11,871"],
  ["Red Refractor", "1:11,871"],
  ["Superfractor", "1:49,460"],
]);

const ON_CARD_DUAL_PARALLELS = oddsLine([
  ["Refractor", "1:17,457"],
  ["Black \"Takeover\"", "1:32,974"],
  ["Red \"Takeover\"", "1:74,190"],
  ["Superfractor", "1:296,760"],
]);

const DEADPOOL_AUTO_PARALLELS = oddsLine([
  ["Base", "1:990"],
  ["Gold", "1:7,419"],
  ["Orange", "1:14,838"],
  ["Black", "1:32,974"],
  ["Red", "1:74,190"],
]);

const SET_DESCRIPTION =
  "2025 Topps Chrome Deadpool (100-card base: Comic Accurate / Characters / Multiverse and More) with official hobby odds (Refractor 1:2, Prism 1:3, Dogpool 1:50, TVA Takeover 1:78, Superfractor 1:3,710). Inserts on the page: Comic Book Gold 1:3, Cover Stars 1:3, Future Stars 1:8. Nearby hobby rates not mapped onto a live cardType: 10005-Fire unnumbered 1:1,017 (FO cards sit under Topps Originals here). Deadpool Icons is value exclusive (hobby blank). Sketch 1:75. Odds only, never prices.";

const BASE_TYPES = new Set(["comic accurate", "characters", "multiverse and more"]);

const TYPE_PARALLELS: Record<string, string> = {
  "comic book gold": COMIC_BOOK_GOLD_PARALLELS,
  "cover stars": COVER_STARS_PARALLELS,
  "future stars": FUTURE_STARS_PARALLELS,
  "well you got nothing to say mouth": MOUTH_PARALLELS,
  "best bubs": BEST_BUBS_PARALLELS,
  "looking for logan": LOOKING_FOR_LOGAN_PARALLELS,
  "indestructible": INDESTRUCTIBLE_PARALLELS,
  "deadpool reflections": DEADPOOL_REFLECTIONS_PARALLELS,
  "hidden gems": HIDDEN_GEMS_PARALLELS,
  "the void": THE_VOID_PARALLELS,
  "topps chrome autograph cards": CHROME_AUTO_PARALLELS,
  "topps chrome autographs": CHROME_AUTO_PARALLELS,
  "best bubs autograph cards": BEST_BUBS_AUTO_PARALLELS,
  "best bubs autograph": BEST_BUBS_AUTO_PARALLELS,
  "topps chrome dual autographs": DUAL_AUTO_PARALLELS,
  "dual autographs": DUAL_AUTO_PARALLELS,
  "marvel comic book artist autographs": ARTIST_AUTO_PARALLELS,
  "on card dual inscriptions book card": ON_CARD_DUAL_PARALLELS,
  "deadpool autographs": DEADPOOL_AUTO_PARALLELS,
};

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== DEADPOOL_2025_SET_ID ||
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
    setId === FORBIDDEN_90004 ||
    setId === CHROME_2026_SET_ID ||
    setId === MINT_2026_SET_ID ||
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
  const type = normType(cardType);
  const prefix = numberPrefix(cardNumber);

  if (/^\d+$/.test(cardNumber) && BASE_TYPES.has(type)) {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 100) return { parallels: BASE_PARALLELS };
    return null;
  }

  if (type === "topps originals") {
    if (prefix === "TO") return { parallels: TOPPS_ORIGINALS_PARALLELS };
    return null;
  }

  const mapped = TYPE_PARALLELS[type];
  if (mapped) return { parallels: mapped };

  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(DEADPOOL_2025_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, DEADPOOL_2025_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 90003 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, DEADPOOL_2025_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(DEADPOOL_2025_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, DEADPOOL_2025_SET_ID));

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
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, DEADPOOL_2025_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && BASE_TYPES.has(normType(row.cardType))) baseUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedDeadpool2025Meta(): Promise<void> {
  if (isLockedSet(DEADPOOL_2025_SET_ID)) {
    console.error("[deadpool2025MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[deadpool2025MetaSeed] ${SEED_VERSION} starting setId=90003 (odds only, photos/cardType/characterName untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[deadpool2025MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[deadpool2025MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[deadpool2025MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[deadpool2025MetaSeed] cards error: ${message}`);
  }

  console.log(`[deadpool2025MetaSeed] done version=${SEED_VERSION} setId=${DEADPOOL_2025_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startDeadpool2025MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[deadpool2025MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedDeadpool2025Meta().catch((err) => {
      console.error("[deadpool2025MetaSeed] fatal", err);
    });
  });
}
