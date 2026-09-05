/**
 * Doctor Doom toughest /24 & /25 research seed.
 * Packet facts from ChatGPT/NLF Card Research 2026-09-05, plus Card Research
 * resolve: MFQ-DNSG Orange Wave /25 Official family odds are 1:28,784 Hobby
 * (Marvel Quad Facsimile Autographs). Base Orange Wave 1:295 is a different family.
 */
import seed from "../../public/data/doom/toughest-24-25.json";
import { DOOM_CHARACTER_PATH, DOOM_HISTORY_PATH } from "./doomComicCuts";

export const DOOM_TOUGHEST_SLUG = "doctor-doom-toughest-24-25-topps-marvel-cards";
export const DOOM_TOUGHEST_PATH = `/research/${DOOM_TOUGHEST_SLUG}`;
export const DOOM_TOUGHEST_JSON_PATH = "/data/doom/toughest-24-25.json";
export const NLF_INVENTORY_PATH = "/shop";
export const NLF_INVENTORY_CTA = "Check NLF Inventory";

export { DOOM_CHARACTER_PATH, DOOM_HISTORY_PATH };

export type DoomToughestOddsType = "official-family" | "published" | "nlf-estimate";

export interface DoomToughestMarket {
  ebayLive: string;
  ebaySold: string;
  comc: string;
}

export interface DoomToughestCard {
  id: string;
  rank: number;
  year: number;
  set: string;
  cardNumber: string;
  name: string;
  parallel: string;
  serial: string;
  pop: number;
  publishedOdds: string;
  specificOdds: string;
  oddsType: DoomToughestOddsType;
  confidence: string;
  notes: string;
  footnote: string | null;
  multiCharacter: boolean;
  imageUrl: string | null;
  market: DoomToughestMarket;
  nlfBuyUrl: string | null;
}

export interface DoomToughestRanking {
  rank: number;
  tie: boolean;
  cardIds: string[];
  headline: string;
  publishedOdds: string;
  specificOdds: string;
  oddsType: DoomToughestOddsType;
  confidence: string;
}

export interface DoomToughestFaq {
  q: string;
  a: string;
}

export interface DoomToughestSeed {
  seo: {
    slug: string;
    title: string;
    meta: string;
    h1: string;
    chips: string[];
  };
  intro: {
    beats: string[];
  };
  rankings: DoomToughestRanking[];
  cards: DoomToughestCard[];
  faq: DoomToughestFaq[];
}

export const DOOM_TOUGHEST_SEED = seed as DoomToughestSeed;

export const MEASURE_CHIPS = [
  "Serial population",
  "Official published odds",
  "NLF Estimated Specific-Card Odds (≈)",
] as const;

export function hasCardImage(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim().length > 0;
}

export function nlfInventoryHref(_card: DoomToughestCard): string {
  return NLF_INVENTORY_PATH;
}

export function rankLabel(rank: number, tie: boolean): string {
  return tie ? `Tied #${rank}` : `#${rank}`;
}

export function cardById(id: string): DoomToughestCard | undefined {
  return DOOM_TOUGHEST_SEED.cards.find((card) => card.id === id);
}

export function cardsForRanking(row: DoomToughestRanking): DoomToughestCard[] {
  return row.cardIds
    .map((id) => cardById(id))
    .filter((card): card is DoomToughestCard => Boolean(card));
}

export function isEstimatedOdds(oddsType: DoomToughestOddsType): boolean {
  return oddsType === "nlf-estimate";
}

export function specificOddsCaption(card: DoomToughestCard): string {
  if (card.oddsType === "nlf-estimate" || card.specificOdds.includes("≈")) {
    return "NLF Estimated Specific-Card Odds";
  }
  return "Specific-card odds";
}
