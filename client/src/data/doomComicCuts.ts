/**
 * Shared facts for the Doctor Doom Comic Cuts HISTORY companion
 * and the 2026 Chrome One World Under Doom insert-family stub.
 *
 * Official Topps checklist / odds are primary. Do not invent box print runs.
 * Doctor Doom (Victor von Doom) ≠ Doom 2099.
 */

export const DOOM_HISTORY_PATH = "/comic-cuts/doctor-doom-history";
export const DOOM_GALLERY_PATH = "/comic-cuts/doom";
export const DOOM_GALLERY_CATALOG_PATH = "/comic-cuts/doom/catalog.json";
export const DOOM_GALLERY_HASH = "research-inventory";
export const OWUD_PATH = "/chrome/one-world-under-doom";
export const MINT_2025_SET_PATH = "/cards/2025-topps-marvel-mint";
export const CHROME_2026_SET_PATH = "/cards/2026-topps-chrome-marvel-comics";
export const DOOM_VIDEO_ID = "doctor-doom-comic-cut-1-1-2025-topps-marvel-mint";
export const DOOM_VIDEO_PATH = `/videos/${DOOM_VIDEO_ID}`;
export const DOOM_CHARACTER_PATH = "/characters/doctor-doom";
export const VIDEOS_PATH = "/videos";
export const CARD_DATABASE_PATH = "/cards";

/** Real NLF photo of the filmed 1/1 Comic Cut. Never use CloudFront doom-comic-cuts-history. */
export const DOOM_CARD_IMAGE = "/videos/doom-comic-cut-1of1-black.jpg?v=2";
export const DOOM_YOUTUBE_ID = "GK7TpveroyU";

export const MINT_COMIC_CUT_FACTS = {
  set: "2025 Topps Marvel Mint",
  setSlug: "2025-topps-marvel-mint",
  insertFamily: "Authentic Comic Cuts",
  cardNumber: "DD-CC",
  uniquePanels: "~200",
  hobbyOdds: "1:61",
  sdccOdds: "1:63",
} as const;

/**
 * Official 2026 Chrome Marvel Comics hobby sheet (recorded in chrome2026MetaSeed):
 * Fanfare / Icons / Future Stars / Meanwhile / One World Under Doom / The Beyond · 1:6
 * 60 Years of Black Panther · 1:12
 * Full OWUD card-by-card checklist is not ingested into the Chrome 2026 catalog yet.
 */
export const OWUD_FACTS = {
  set: "2026 Topps Chrome Marvel Comics",
  setSlug: "2026-topps-chrome-marvel-comics",
  insertFamily: "One World Under Doom",
  shortCode: "OWUD",
  hobbyOdds: "1:6",
  checklistStatus: "research" as const,
  siblingInsertsAtSameHobbyOdds: [
    "Fanfare",
    "Marvel Icons",
    "Future Stars",
    "Meanwhile",
    "The Beyond",
  ],
  otherHobbyInsertsOnSheet: [{ name: "60 Years of Black Panther", hobbyOdds: "1:12" }],
} as const;

export function loreCompanionForVideo(videoId: string): { href: string; label: string } | null {
  if (videoId === DOOM_VIDEO_ID) {
    return { href: DOOM_HISTORY_PATH, label: "Doctor Doom history" };
  }
  return null;
}

export type DoomComicCut = {
  num: number;
  file: string;
  thumb: string;
  full?: string;
  clues?: string;
  status?: string;
  ruled_out?: string;
  next?: string;
};

export type DoomComicCutCatalog = {
  title: string;
  set: string;
  insert: string;
  odds: string;
  count_unique: string;
  inventory_here: number;
  gaps: number[];
  rename_pattern?: string;
  updated?: string;
  note?: string;
  cuts: DoomComicCut[];
};

export function padCutNum(num: number): string {
  return String(num).padStart(3, "0");
}

/** Hide gap numbers and cuts with no public thumb. Do not invent missing files. */
export function visibleDoomCuts(catalog: DoomComicCutCatalog): DoomComicCut[] {
  const gaps = new Set(catalog.gaps ?? []);
  return (catalog.cuts ?? []).filter((cut) => {
    if (!Number.isFinite(cut.num)) return false;
    if (gaps.has(cut.num)) return false;
    if (!cut.thumb) return false;
    return true;
  });
}

export function isDoomComicCutCatalog(value: unknown): value is DoomComicCutCatalog {
  if (!value || typeof value !== "object") return false;
  const catalog = value as DoomComicCutCatalog;
  return Array.isArray(catalog.cuts) && Array.isArray(catalog.gaps);
}

/**
 * Light research leads for the HISTORY gallery. Never treat these as locked
 * comic + page identifications unless a later catalog status says confirmed.
 */
export type DoomHotLead = {
  num: number;
  relatedNums?: number[];
  label: string;
  note: string;
};

export const DOOM_HOT_LEADS: readonly DoomHotLead[] = [
  {
    num: 52,
    label: "Footnote lead",
    note: "Card footnote reads *SEE GIANT-SIZE SUPER-VILLAIN TEAM-UP #1. Research note only — not a locked comic + page ID.",
  },
  {
    num: 60,
    relatedNums: [19],
    label: "Visual twin",
    note: "Visual twin of Cut 019 (Doom + Thing rocky shoulder, yellow background, black top triangles). Research pairing only — not a locked issue ID.",
  },
];

export function hotLeadsForCut(num: number): DoomHotLead[] {
  return DOOM_HOT_LEADS.filter(
    (lead) => lead.num === num || (lead.relatedNums ?? []).includes(num)
  );
}
