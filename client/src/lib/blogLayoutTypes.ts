/**
 * ORDER 66 — Blog Layout Engine v1.5
 * Type definitions for the 12-template rotation system
 */

export type LayoutTemplate = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const TEMPLATE_NAMES: Record<LayoutTemplate, string> = {
  1: "Field Report",
  2: "Personnel Dossier",
  3: "Data Brief",
  4: "Intercepted Transmission",
  5: "Situation Room",
  6: "Asset Gallery",
  7: "Strategic Analysis",
  8: "Flash Alert",
  9: "After-Action Report",
  10: "Technical Schematic",
  11: "Surveillance Log",
  12: "Command Briefing",
};

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  color?: "green" | "teal" | "gold" | "purple";
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface ComparisonRow {
  label: string;
  col1: string;
  col2: string;
}

export interface ComparisonTable {
  title: string;
  headers: [string, string];
  rows: ComparisonRow[];
}

export interface PersonProfile {
  name: string;
  title: string;
  imageUrl?: string;
  stats: { label: string; value: string }[];
  bio: string;
  status?: string;
}

export type HeatLevel = "blazing" | "hot" | "rising" | "new";
export type AlertLevel = "low" | "medium" | "high" | "critical";

export interface LayoutData {
  pullQuote?: string;
  factBox?: string;
  stats?: StatItem[];
  timeline?: TimelineEntry[];
  gallery?: GalleryImage[];
  toc?: TableOfContentsItem[];
  comparison?: ComparisonTable;
  profile?: PersonProfile;
  alertLevel?: AlertLevel;
  heatLevel?: HeatLevel;
  contentImage?: string;
  subtitle?: string;
}

/** Heat badge colors */
export const HEAT_COLORS: Record<HeatLevel, string> = {
  blazing: "bg-red-500/90 text-white animate-pulse",
  hot: "bg-orange-500/90 text-white",
  rising: "bg-[#00ff41]/90 text-black",
  new: "bg-[#00a0b0]/90 text-white",
};

/** Stat counter accent colors */
export const STAT_COLORS: Record<string, string> = {
  green: "#00ff41",
  teal: "#00a0b0",
  gold: "#c0a030",
  purple: "#a060d0",
};

/** Default stat color cycle */
export const STAT_COLOR_CYCLE: Array<"green" | "teal" | "gold" | "purple"> = [
  "green", "teal", "gold", "purple",
];
