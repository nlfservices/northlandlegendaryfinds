import { describe, expect, it } from "vitest";
import {
  VIDEOS,
  filterAndSortVideos,
  getCharacterLetters,
  getSetFilterOptions,
  videoMatchesSet,
  youtubeEmbedUrl,
} from "./videos";

describe("videos catalog", () => {
  it("lists the Doctor Doom Comic Cut with the live YouTube id", () => {
    expect(VIDEOS.length).toBeGreaterThan(0);
    const doom = VIDEOS.find((v) => v.youtubeId === "GK7TpveroyU");
    expect(doom).toBeTruthy();
    expect(doom?.character).toBe("Doctor Doom");
    expect(doom?.characterLetter).toBe("D");
    expect(doom?.setFilter).toBe("2025 Topps Marvel Mint");
    expect(doom?.setLabel).toBe("Topps Marvel Mint");
    expect(doom?.setSlug).toBe("2025-topps-marvel-mint");
    expect(doom?.parallel).toBe("Comic Cut 1/1");
    expect(doom?.description).toBe("Doctor Doom Comic Cut 1/1 from 2025 Topps Marvel Mint");
    expect(doom?.thumbnailUrl).toBeUndefined();
  });

  it("exposes D and both Mint set filter labels", () => {
    expect(getCharacterLetters(VIDEOS)).toContain("D");
    const sets = getSetFilterOptions(VIDEOS);
    expect(sets).toContain("2025 Topps Marvel Mint");
    expect(sets).toContain("Topps Marvel Mint");
  });

  it("filters Doctor Doom under D and either Mint set name", () => {
    const byLetter = filterAndSortVideos(VIDEOS, { letter: "D" });
    expect(byLetter.some((v) => v.youtubeId === "GK7TpveroyU")).toBe(true);

    const byFullSet = filterAndSortVideos(VIDEOS, { set: "2025 Topps Marvel Mint" });
    const byShortSet = filterAndSortVideos(VIDEOS, { set: "Topps Marvel Mint" });
    expect(byFullSet).toHaveLength(1);
    expect(byShortSet).toHaveLength(1);

    const empty = filterAndSortVideos(VIDEOS, { letter: "A" });
    expect(empty).toHaveLength(0);
  });

  it("builds the official embed URL", () => {
    expect(youtubeEmbedUrl("GK7TpveroyU")).toBe("https://www.youtube.com/embed/GK7TpveroyU");
  });

  it("matches either set label on a listing", () => {
    const doom = VIDEOS[0];
    expect(videoMatchesSet(doom, "2025 Topps Marvel Mint")).toBe(true);
    expect(videoMatchesSet(doom, "Topps Marvel Mint")).toBe(true);
    expect(videoMatchesSet(doom, "Chrome")).toBe(false);
  });
});
