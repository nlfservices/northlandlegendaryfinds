/**
 * NLF Custom Backgrounds for Card Display
 * Maps teams and sets to branded background images.
 */

// ── Background URLs ─────────────────────────────────────────────────────────
export const NLF_BACKGROUNDS = {
  redBlue: "/manus-storage/NLFSpotlight-RedBlue_3d60f312.png",
  gold: "/manus-storage/NLFSpotlight-Gold_16fbb30b.png",
  blue: "/manus-storage/NLFSpotlight-Blue_79d53bf2.png",
  purple: "/manus-storage/NLFSpotlight-Purple_9020c281.png",
  maroon: "/manus-storage/NLFLightningBackground-maroon_0065f2cb.png",
  purpleGold: "/manus-storage/NLFLightningBackground-Purplegold_0b658024.png",
} as const;

// ── Team → Background Mapping ───────────────────────────────────────────────
export type TeamKey = "avengers" | "xmen" | "fantastic_four" | "guardians" | "villains" | "secret_wars";

export const TEAM_BACKGROUNDS: Record<TeamKey, string> = {
  avengers: NLF_BACKGROUNDS.redBlue,
  xmen: NLF_BACKGROUNDS.gold,
  fantastic_four: NLF_BACKGROUNDS.blue,
  guardians: NLF_BACKGROUNDS.purple,
  villains: NLF_BACKGROUNDS.maroon,
  secret_wars: NLF_BACKGROUNDS.purpleGold,
};

// Default background for characters not in a specific team
export const DEFAULT_CARD_BG = NLF_BACKGROUNDS.blue;

// ── Set → Background Mapping ────────────────────────────────────────────────
export const SET_BACKGROUNDS: Record<string, string> = {
  mint: NLF_BACKGROUNDS.gold,
  comic_book_heroes: NLF_BACKGROUNDS.blue,
  marvel_studios: NLF_BACKGROUNDS.purple,
  finest: NLF_BACKGROUNDS.redBlue,
  chrome: NLF_BACKGROUNDS.purpleGold,
};

// ── Team Members ────────────────────────────────────────────────────────────
const TEAM_MEMBERS: Record<TeamKey, string[]> = {
  avengers: [
    "iron man", "captain america", "thor", "hulk", "black widow", "hawkeye",
    "scarlet witch", "vision", "ant-man", "wasp", "falcon", "war machine",
    "black panther", "spider-man", "captain marvel", "she-hulk", "wonder man",
    "ms. marvel", "kate bishop", "shang-chi", "moon knight", "tony stark",
    "steve rogers", "natasha romanoff", "clint barton", "wanda maximoff",
    "sam wilson", "peter parker", "carol danvers", "bruce banner",
  ],
  xmen: [
    "wolverine", "storm", "cyclops", "jean grey", "rogue", "gambit",
    "beast", "nightcrawler", "colossus", "kitty pryde", "iceman", "angel",
    "magneto", "professor x", "psylocke", "cable", "bishop", "jubilee",
    "emma frost", "mystique", "deadpool", "x-23", "laura kinney",
    "logan", "ororo munroe", "scott summers",
  ],
  fantastic_four: [
    "mr. fantastic", "invisible woman", "human torch", "thing",
    "reed richards", "sue storm", "johnny storm", "ben grimm",
    "silver surfer", "galactus", "franklin richards", "valeria richards",
  ],
  guardians: [
    "star-lord", "gamora", "drax", "rocket raccoon", "groot", "mantis",
    "nebula", "adam warlock", "peter quill", "rocket",
  ],
  villains: [
    "doctor doom", "thanos", "loki", "venom", "green goblin", "kingpin",
    "ultron", "kang", "red skull", "carnage", "mephisto", "dormammu",
    "hela", "taskmaster", "baron zemo", "modok", "abomination",
    "doc ock", "doctor octopus", "vulture", "mysterio", "electro",
    "sandman", "rhino", "kraven", "scorpion", "hobgoblin",
    "norman osborn", "wilson fisk", "victor von doom",
  ],
  secret_wars: [
    "doctor doom", "beyonder", "molecule man", "spider-woman",
    "battleworld", "god emperor doom", "maker", "black swan",
    "namor", "black bolt", "medusa", "maximus",
  ],
};

/**
 * Get the primary team for a character name.
 * Returns the first matching team key, or null if no match.
 */
export function getCharacterTeam(characterName: string): TeamKey | null {
  const lower = characterName.toLowerCase();
  for (const [team, members] of Object.entries(TEAM_MEMBERS) as [TeamKey, string[]][]) {
    if (members.some((m) => lower.includes(m) || m.includes(lower))) {
      return team;
    }
  }
  return null;
}

/**
 * Get the background URL for a character (team-based).
 */
export function getCharacterBackground(characterName: string): string {
  const team = getCharacterTeam(characterName);
  if (team) return TEAM_BACKGROUNDS[team];
  return DEFAULT_CARD_BG;
}

/**
 * Get the background URL for a set (set-based).
 */
export function getSetBackground(setName: string): string {
  const lower = setName.toLowerCase().replace(/[_-]/g, " ");
  for (const [key, bg] of Object.entries(SET_BACKGROUNDS)) {
    const normalizedKey = key.replace(/[_-]/g, " ");
    if (lower.includes(normalizedKey)) return bg;
  }
  // Additional fuzzy matches for common set names
  if (lower.includes("mint")) return SET_BACKGROUNDS.mint;
  if (lower.includes("comic book") || lower.includes("heroes")) return SET_BACKGROUNDS.comic_book_heroes;
  if (lower.includes("studios") || lower.includes("chrome")) return SET_BACKGROUNDS.chrome;
  if (lower.includes("finest") || lower.includes("fantastic")) return SET_BACKGROUNDS.finest;
  if (lower.includes("collector")) return SET_BACKGROUNDS.marvel_studios;
  return DEFAULT_CARD_BG;
}
