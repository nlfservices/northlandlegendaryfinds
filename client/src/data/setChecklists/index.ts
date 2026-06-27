// Index file mapping set slugs to their checklist data
import { chromeMarvel2025Data } from "./chromeMarvel2025";
import { sapphireMarvel2025Data } from "./sapphireMarvel2025";
import { marvelStudios2025Data } from "./marvelStudios2025";
import { marvelStudiosSapphire2025Data } from "./marvelStudiosSapphire2025";
import { collectorMarvel2025Data } from "./collectorMarvel2025";
import { chromeMarvel2026Data } from "./chromeMarvel2026";
import { finestFantasticFour2026Data } from "./finestFantasticFour2026";
import { chromeDeadpool2025Data } from "./chromeDeadpool2025";
import { brooklynCap2026Data } from "./brooklynCap2026";
import { comicBookHeroes2025Data } from "./comicBookHeroes2025";
import { starWarsGalaxyChrome2025Data } from "./starWarsGalaxyChrome2025";

export interface SetChecklistData {
  setName: string;
  releaseInfo: string;
  description: string;
  baseCardCount: number;
  baseCards: { num: number; name: string }[];
  tiers?: { name: string; count: number }[];
  sections?: { name: string; cards: { num: number; name: string }[] }[];
  parallels: { name: string; odds: string; sku: string }[];
  inserts: { name: string; cardCount: string; odds: string }[];
}

// Map set slugs to their data
export const setChecklistMap: Record<string, SetChecklistData> = {
  "2025-topps-chrome": chromeMarvel2025Data as unknown as SetChecklistData,
  "2025-topps-marvel-sapphire": sapphireMarvel2025Data as unknown as SetChecklistData,
  "2025-topps-marvel-studios": marvelStudios2025Data as unknown as SetChecklistData,
  "2025-topps-marvel-studios-sapphire": marvelStudiosSapphire2025Data as unknown as SetChecklistData,
  "2025-marvel-the-collector": collectorMarvel2025Data as unknown as SetChecklistData,
  "2026-topps-chrome-marvel-comics": chromeMarvel2026Data as unknown as SetChecklistData,
  "2026-topps-finest-fantastic-four": finestFantasticFour2026Data as unknown as SetChecklistData,
  "2025-topps-chrome-deadpool": chromeDeadpool2025Data as unknown as SetChecklistData,
  "2026-topps-brooklyn-captain-america-85th": brooklynCap2026Data as unknown as SetChecklistData,
  "2025-topps-comic-book-heroes": comicBookHeroes2025Data as unknown as SetChecklistData,
  "2025-topps-star-wars-galaxy-chrome": starWarsGalaxyChrome2025Data as unknown as SetChecklistData,
};

export function getSetChecklist(slug: string): SetChecklistData | null {
  return setChecklistMap[slug] || null;
}
