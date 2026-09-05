/**
 * Doctor Doom toughest /5 research seed.
 * Packet facts from NLF Card Research 2026-09-05: Red Wave /5 countdown
 * (sister to Orange Wave /25). Published Hobby vs Value labels stay as printed.
 */
import seed from "../../public/data/doom/toughest-5.json";
import { DOOM_CHARACTER_PATH } from "./doomComicCuts";
import { DOOM_TOUGHEST_PATH as DOOM_TOUGHEST_2425_PATH } from "./doomToughest2425";

export const DOOM_TOUGHEST5_SLUG = "toughest-doctor-doom-5-topps-marvel-cards";
export const DOOM_TOUGHEST5_PATH = `/research/${DOOM_TOUGHEST5_SLUG}`;
export const DOOM_TOUGHEST5_JSON_PATH = "/data/doom/toughest-5.json";

export { DOOM_CHARACTER_PATH, DOOM_TOUGHEST_2425_PATH };

export type DoomToughest5Type = "MULTI" | "Solo" | "Insert";

export interface DoomToughest5Market {
  ebayLive: string;
  ebaySold: string;
  comc: string;
}

interface DoomToughest5CardBase {
  id: string;
  year: number;
  set: string;
  cardNumber: string;
  name: string;
  type: DoomToughest5Type;
  parallel: string;
  serial: string;
  pop: number;
  publishedOdds: string;
  notes: string;
  tied: boolean;
  multiCharacter: boolean;
  imageUrl: string | null;
  market: DoomToughest5Market;
  nlfBuyUrl: string | null;
}

export interface DoomToughest5Card extends DoomToughest5CardBase {
  rank: number;
}

export interface DoomToughest5HonorableMention extends DoomToughest5CardBase {
  hm: number;
}

export interface DoomToughest5Faq {
  q: string;
  a: string;
}

export interface DoomToughest5Section {
  id: string;
  title: string;
  body: string;
}

export interface DoomToughest5Seed {
  seo: {
    slug: string;
    title: string;
    meta: string;
    h1: string;
    subtitle: string;
    chips: string[];
  };
  census: {
    issues: number;
    physical: number;
    exclude: string[];
  };
  intro: {
    beats: string[];
    researchNote: string;
  };
  sister: {
    path: string;
    label: string;
    body: string;
  };
  editorialNote: string;
  cards: DoomToughest5Card[];
  honorableMentions: DoomToughest5HonorableMention[];
  sections: DoomToughest5Section[];
  faq: DoomToughest5Faq[];
}

export const DOOM_TOUGHEST5_SEED = seed as DoomToughest5Seed;

export const RANK_CHIPS = [
  "Published pack odds first",
  "Same /5 ≠ same pull",
  "Hobby vs Value as printed",
  "Ties are editorial",
] as const;

export function hasCardImage(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim().length > 0;
}

export function rankLabel(rank: number, tied: boolean): string {
  return tied ? `Tied #${rank}` : `#${rank}`;
}

export function hmLabel(hm: number): string {
  return `HM${hm}`;
}

export function countdownCards(): DoomToughest5Card[] {
  return [...DOOM_TOUGHEST5_SEED.cards].sort((a, b) => b.rank - a.rank);
}

export function rankingTableCards(): DoomToughest5Card[] {
  return [...DOOM_TOUGHEST5_SEED.cards].sort((a, b) => a.rank - b.rank);
}

export function allListedCards(): DoomToughest5CardBase[] {
  return [...DOOM_TOUGHEST5_SEED.cards, ...DOOM_TOUGHEST5_SEED.honorableMentions];
}
