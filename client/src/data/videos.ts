/**
 * NLF Videos gallery catalog.
 * Add new YouTube listings here — /videos reads this file, and
 * /videos/:slug detail pages use `id` as the slug.
 */

export const SEO_DESCRIPTION_MIN = 750;
export const SEO_DESCRIPTION_MAX = 1000;

export const TEAM_FILTER_OPTIONS = [
  "Avengers",
  "X-Men",
  "Fantastic Four",
  "Guardians of the Galaxy",
  "Spider-Verse",
  "Street-Level Heroes",
  "Villains",
  "Doctor Doom",
  "Latveria",
  "Battleworld",
  "Secret Wars",
  "Midnight Sons",
  "Asgardians",
  "Wakanda",
  "Thunderbolts",
  "Eternals",
  "Inhumans",
] as const;

export type TeamFilter = (typeof TEAM_FILTER_OPTIONS)[number];

export interface VideoEntry {
  id: string;
  title: string;
  youtubeId: string;
  character: string;
  characterLetter: string;
  /** Playlist / short set label shown on the card */
  setLabel: string;
  /** Full set name used by the set filter (e.g. "2025 Topps Marvel Mint") */
  setFilter: string;
  /** Card-database set slug; when present the listing links to /cards/{setSlug} */
  setSlug: string | null;
  parallel: string;
  description: string;
  /** Marvel-accurate team / storyline affiliations (a video may have several). */
  teams: string[];
  /**
   * Real Marvel / Topps / NLF-hosted card or slab photo only.
   * Omit rather than inventing AI, stock, or lookalike art.
   */
  cardImageUrl?: string;
  /** Real custom thumbnail only. Omit rather than inventing a poster. */
  thumbnailUrl?: string;
  /**
   * Collector SEO body for the detail page (750–1000 characters).
   * Required for any entry that ships a /videos/:slug landing page.
   */
  seoDescription?: string;
  /** Serial / print-run mark shown on the card showcase (e.g. "1/1"). */
  printRun?: string;
  /** Collector-facing population line (e.g. "1/1 Comic Cut"). */
  populationLabel?: string;
  /** Reported checklist hobby odds (e.g. "1:61") — not a sealed Topps print-run claim. */
  hobbyOdds?: string;
  /** Reported checklist SDCC odds (e.g. "1:63") — not a sealed Topps print-run claim. */
  sdccOdds?: string;
  /** Product card number when known (e.g. "DD-CC"). */
  cardNumber?: string;
}

/** Verified NLF CloudFront asset used on Doom Comic Cuts content (same file as R2 image/webp). */
const DOOM_COMIC_CUTS_CARD_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-comic-cuts-history-g3QcNLGZc2WPzsXXUzE6mo.webp";

/**
 * Approved researcher brief for the first live detail page.
 * No specific issue/page for THIS cut. No Secret Wars / Battleworld / Doom 2099
 * claims about the panel. Odds phrased as reported checklist figures only.
 */
const DOOM_COMIC_CUT_SEO = `Northland Legendary Finds filmed this look at a Doctor Doom Comic Cut 1/1 from 2025 Topps Marvel Mint. Victor von Doom is Latveria's genius-monarch and the Fantastic Four's classic foil since the early 1960s — Fantastic Four #5 in 1962 frames that debut era. Iron armor and a green cloak are the visual through-line, with Latverian or Servo-Guard-style imagery from those Fantastic Four rivalries. Comic Cuts are a literal piece of published Marvel comic art sealed into the card. Each DD-CC is unique 1/1 art, not a repeated parallel photo. About 200 unique Doctor Doom Comic Cut cards sit in this Mint release, each an authentic comic panel in an encased, one-touch-style holder as Topps Ripped describes. They are a flagship chase in 2025 Topps Marvel Mint, distinct from the separate SDCC Chrome Doctor Doom cards. Reported checklist odds put the insert near 1:61 hobby and 1:63 SDCC. NLF walks the card as collectors do. Independent write-up — not an official Topps or Marvel statement.`;

export const VIDEOS: VideoEntry[] = [
  {
    id: "doctor-doom-comic-cut-1-1-2025-topps-marvel-mint",
    title: "Doctor Doom | Comic Cut 1/1 | 2025 Topps Marvel Mint | NLF",
    youtubeId: "GK7TpveroyU",
    character: "Doctor Doom",
    characterLetter: "D",
    setLabel: "Topps Marvel Mint",
    setFilter: "2025 Topps Marvel Mint",
    setSlug: "2025-topps-marvel-mint",
    parallel: "Comic Cut 1/1",
    description: "Doctor Doom Comic Cut 1/1 from 2025 Topps Marvel Mint",
    teams: ["Villains", "Fantastic Four", "Latveria", "Doctor Doom"],
    cardImageUrl: DOOM_COMIC_CUTS_CARD_IMAGE,
    seoDescription: DOOM_COMIC_CUT_SEO,
    printRun: "1/1",
    populationLabel: "1/1 · ~200 unique DD-CC panels in set",
    hobbyOdds: "1:61",
    sdccOdds: "1:63",
    cardNumber: "DD-CC",
  },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}`;
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://youtu.be/${youtubeId}`;
}

export function videoDetailPath(id: string): string {
  return `/videos/${id}`;
}

export function getVideoById(id: string, videos: VideoEntry[] = VIDEOS): VideoEntry | undefined {
  return videos.find((video) => video.id === id);
}

/** Detail pages ship only when seoDescription is present and in range. */
export function hasVideoDetailPage(video: VideoEntry): boolean {
  const len = video.seoDescription?.length ?? 0;
  return len >= SEO_DESCRIPTION_MIN && len <= SEO_DESCRIPTION_MAX;
}

export function getVideoSitemapPaths(videos: VideoEntry[] = VIDEOS): string[] {
  return videos.filter(hasVideoDetailPage).map((video) => videoDetailPath(video.id));
}

export function getCharacterLetters(videos: VideoEntry[] = VIDEOS): string[] {
  const present = new Set(
    videos
      .map((v) => v.characterLetter.toUpperCase())
      .filter((letter) => ALPHABET.includes(letter))
  );
  return ALPHABET.filter((letter) => present.has(letter));
}

/** Unique set-filter labels, plus short set labels so either name works as a chip. */
export function getSetFilterOptions(videos: VideoEntry[] = VIDEOS): string[] {
  const labels = new Set<string>();
  for (const video of videos) {
    if (video.setFilter) labels.add(video.setFilter);
    if (video.setLabel) labels.add(video.setLabel);
  }
  return Array.from(labels).sort((a, b) => a.localeCompare(b));
}

/** Educational team chips: curated Marvel roster, not just teams that already have videos. */
export function getTeamFilterOptions(): readonly string[] {
  return TEAM_FILTER_OPTIONS;
}

export function getTeamsWithVideos(videos: VideoEntry[] = VIDEOS): string[] {
  const present = new Set<string>();
  for (const video of videos) {
    for (const team of video.teams) {
      present.add(team);
    }
  }
  return TEAM_FILTER_OPTIONS.filter((team) => present.has(team));
}

export function videoMatchesSet(video: VideoEntry, selectedSet: string | null): boolean {
  if (!selectedSet) return true;
  return video.setFilter === selectedSet || video.setLabel === selectedSet;
}

export function videoMatchesTeam(video: VideoEntry, selectedTeam: string | null): boolean {
  if (!selectedTeam) return true;
  return video.teams.includes(selectedTeam);
}

export function filterAndSortVideos(
  videos: VideoEntry[],
  opts: { letter?: string | null; set?: string | null; team?: string | null } = {}
): VideoEntry[] {
  const letter = opts.letter?.toUpperCase() || null;
  const set = opts.set || null;
  const team = opts.team || null;

  return videos
    .filter((video) => {
      if (letter && video.characterLetter.toUpperCase() !== letter) return false;
      if (!videoMatchesSet(video, set)) return false;
      if (!videoMatchesTeam(video, team)) return false;
      return true;
    })
    .slice()
    .sort((a, b) => {
      const byCharacter = a.character.localeCompare(b.character);
      if (byCharacter !== 0) return byCharacter;
      return a.title.localeCompare(b.title);
    });
}
