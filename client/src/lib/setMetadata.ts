/**
 * Rich set metadata for the Card Database page
 * Descriptions, release info, box types, and upcoming sets
 */

import { Calendar, Package, Sparkles, Crown, Gem, Palette, Film, Star, Zap, Clock } from "lucide-react";

export interface SetMetadata {
  slug: string;
  description: string;
  releaseDate: string;       // e.g., "January 2025"
  boxTypes: string[];        // e.g., ["Hobby Box", "Value Box"]
  highlights: string[];      // 2-3 key selling points
  tier: "standard" | "premium" | "ultra-premium";
  icon: string;              // icon identifier
}

export interface UpcomingSet {
  name: string;
  shortName: string;
  releaseDate: string;       // e.g., "June 2025" or "Q3 2025"
  description: string;
  status: "announced" | "pre-order" | "coming-soon";
  year: number;
}

/**
 * Metadata for existing sets in the database
 * Keyed by slug for easy lookup
 */
export const SET_METADATA: Record<string, SetMetadata> = {
  "2025-topps-chrome": {
    slug: "2025-topps-chrome",
    description: "The flagship Topps Chrome Marvel set featuring chromium technology cards with stunning refractor parallels. Includes base cards, autographs, sketch cards, and multiple insert sets.",
    releaseDate: "January 2025",
    boxTypes: ["Hobby Box", "Value Box"],
    highlights: ["Refractor parallels", "On-card autographs", "Sketch cards"],
    tier: "standard",
    icon: "sparkles",
  },
  "2025-topps-comic-book-heroes": {
    slug: "2025-topps-comic-book-heroes",
    description: "Golden Anniversary edition celebrating 50 years of Marvel trading cards. Features three distinct eras — 1975, 1976, and 2025 — honoring the legacy of Marvel's greatest heroes through the decades.",
    releaseDate: "February 2025",
    boxTypes: ["Hobby Box"],
    highlights: ["Three era designs (1975/1976/2025)", "Golden Anniversary inserts", "Gambit's Deck playing cards"],
    tier: "standard",
    icon: "palette",
  },
  "2025-topps-marvel-mint": {
    slug: "2025-topps-marvel-mint",
    description: "Premium coin and medal-style cards with a unique metallic finish. Features four tiers — Bronze, Silver, Gold, and Platinum — each with distinct designs and increasing rarity.",
    releaseDate: "February 2025",
    boxTypes: ["Hobby Box"],
    highlights: ["4-tier metal design", "Platinum 1-of-1 cards", "Die-cut parallels"],
    tier: "premium",
    icon: "crown",
  },
  "2025-topps-marvel-sapphire": {
    slug: "2025-topps-marvel-sapphire",
    description: "Limited-edition premium Chrome variant featuring exclusive Sapphire blue parallels. A collector's must-have with lower print runs and stunning blue-tinted chromium finish.",
    releaseDate: "March 2025",
    boxTypes: ["Hobby Box"],
    highlights: ["Exclusive Sapphire parallels", "Limited production", "Premium chromium finish"],
    tier: "premium",
    icon: "gem",
  },
  "2025-topps-marvel-studios": {
    slug: "2025-topps-marvel-studios",
    description: "The definitive MCU trading card set with 200 base cards covering every phase of the Marvel Cinematic Universe. From Iron Man to the Multiverse Saga, every iconic moment captured on cardboard.",
    releaseDate: "March 2025",
    boxTypes: ["Hobby Box", "Value Box"],
    highlights: ["200-card MCU base set", "Phase-by-phase coverage", "Actor autographs"],
    tier: "standard",
    icon: "film",
  },
  "2025-topps-marvel-studios-sapphire": {
    slug: "2025-topps-marvel-studios-sapphire",
    description: "The premium Sapphire variant of the Marvel Studios set. Features the same MCU content with exclusive blue Sapphire parallels and limited production for serious collectors.",
    releaseDate: "March 2025",
    boxTypes: ["Hobby Box"],
    highlights: ["Sapphire-exclusive parallels", "MCU content", "Limited print run"],
    tier: "premium",
    icon: "gem",
  },
  "2025-marvel-the-collector": {
    slug: "2025-marvel-the-collector",
    description: "Ultra-premium MCU set featuring MCU Perfection base cards, Marvel Tomorrow inserts, Villainy villains, Show Stoppers action scenes, and Infinity Gauntlet Thanos cards. Includes autographs from top MCU actors plus Treasures of Asgard and The Collector's Museum relic cards.",
    releaseDate: "March 2025",
    boxTypes: ["Hobby Box (3 packs, 1 card per pack)"],
    highlights: ["Ultra-premium relic cards", "MCU actor autographs", "Museum-quality inserts"],
    tier: "ultra-premium",
    icon: "star",
  },
};

/**
 * Upcoming sets not yet in the database
 * Shown as "Coming Soon" placeholders
 */
export const UPCOMING_SETS: UpcomingSet[] = [
  {
    name: "2025 Topps Chrome Deadpool",
    shortName: "Chrome Deadpool",
    releaseDate: "June 2025",
    description: "Dedicated Chrome set for the Merc with a Mouth. Features Deadpool & Wolverine movie content, Reflections inserts, and exclusive Deadpool-themed parallels.",
    status: "announced",
    year: 2025,
  },
  {
    name: "2025 Topps Marvel Studios Chrome",
    shortName: "Studios Chrome",
    releaseDate: "2025",
    description: "The first-ever Topps Chrome set featuring the Marvel Cinematic Universe. Combines MCU content with premium chromium technology.",
    status: "announced",
    year: 2025,
  },
  {
    name: "2026 Topps Brooklyn Collection: Captain America 85th Anniversary",
    shortName: "Brooklyn Collection",
    releaseDate: "March 2026",
    description: "Premium Brooklyn Collection celebrating 85 years of Captain America. Features sketch cards, autographs, and artistic interpretations of the First Avenger.",
    status: "pre-order",
    year: 2026,
  },
  {
    name: "2026 Topps Finest: Fantastic Four 65th Anniversary",
    shortName: "Finest Fantastic Four",
    releaseDate: "March 2026",
    description: "Celebrating 65 years of Marvel's First Family with Topps Finest technology. Premium cards featuring the Fantastic Four's greatest moments.",
    status: "pre-order",
    year: 2026,
  },
];

/**
 * Get metadata for a set by slug
 */
export function getSetMetadata(slug: string): SetMetadata | null {
  return SET_METADATA[slug] || null;
}

/**
 * Get tier badge styling
 */
export function getTierStyle(tier: SetMetadata["tier"]): { bg: string; text: string; label: string } {
  switch (tier) {
    case "ultra-premium":
      return { bg: "bg-amber-500/15 border-amber-500/30", text: "text-amber-400", label: "Ultra Premium" };
    case "premium":
      return { bg: "bg-purple-500/15 border-purple-500/30", text: "text-purple-400", label: "Premium" };
    default:
      return { bg: "bg-primary/15 border-primary/30", text: "text-primary", label: "Standard" };
  }
}
