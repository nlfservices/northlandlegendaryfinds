/**
 * NLF Videos gallery catalog.
 * Add new YouTube listings here — the /videos page reads this file.
 */

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
  /** Real custom thumbnail only. Omit rather than inventing a poster. */
  thumbnailUrl?: string;
}

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
  },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}`;
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://youtu.be/${youtubeId}`;
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

export function videoMatchesSet(video: VideoEntry, selectedSet: string | null): boolean {
  if (!selectedSet) return true;
  return video.setFilter === selectedSet || video.setLabel === selectedSet;
}

export function filterAndSortVideos(
  videos: VideoEntry[],
  opts: { letter?: string | null; set?: string | null } = {}
): VideoEntry[] {
  const letter = opts.letter?.toUpperCase() || null;
  const set = opts.set || null;

  return videos
    .filter((video) => {
      if (letter && video.characterLetter.toUpperCase() !== letter) return false;
      if (!videoMatchesSet(video, set)) return false;
      return true;
    })
    .slice()
    .sort((a, b) => {
      const byCharacter = a.character.localeCompare(b.character);
      if (byCharacter !== 0) return byCharacter;
      return a.title.localeCompare(b.title);
    });
}
