import { describe, expect, it } from "vitest";
import {
  SEO_DESCRIPTION_MAX,
  SEO_DESCRIPTION_MIN,
  VIDEOS,
  filterAndSortVideos,
  getCharacterLetters,
  getSetFilterOptions,
  getTeamFilterOptions,
  getTeamsWithVideos,
  getVideoById,
  getVideoSitemapPaths,
  hasVideoDetailPage,
  videoDetailPath,
  videoMatchesSet,
  videoMatchesTeam,
  youtubeEmbedUrl,
} from "./videos";
import {
  VIDEO_TEMPLATE_COUNT,
  VIDEO_TEMPLATE_IDS,
  templateIdForVideoId,
  templateIndexForVideoId,
} from "./videoTemplates";

describe("videos catalog", () => {
  it("lists the Doctor Doom Comic Cut with the live YouTube id", () => {
    expect(VIDEOS.length).toBeGreaterThan(0);
    const doom = VIDEOS.find((v) => v.youtubeId === "GK7TpveroyU");
    expect(doom).toBeTruthy();
    expect(doom?.id).toBe("doctor-doom-comic-cut-1-1-2025-topps-marvel-mint");
    expect(doom?.character).toBe("Doctor Doom");
    expect(doom?.characterLetter).toBe("D");
    expect(doom?.setFilter).toBe("2025 Topps Marvel Mint");
    expect(doom?.setLabel).toBe("Topps Marvel Mint");
    expect(doom?.setSlug).toBe("2025-topps-marvel-mint");
    expect(doom?.parallel).toBe("Comic Cut 1/1");
    expect(doom?.description).toBe("Doctor Doom Comic Cut 1/1 from 2025 Topps Marvel Mint");
    expect(doom?.thumbnailUrl).toBeUndefined();
    expect(doom?.cardImageUrl).toMatch(/^https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\//);
    expect(doom?.cardImageUrl).toContain("doom-comic-cuts-history");
    expect(doom?.printRun).toBe("1/1");
    expect(doom?.populationLabel).toContain("1/1");
    expect(doom?.populationLabel).toContain("200");
    expect(doom?.cardNumber).toBe("DD-CC");
    expect(doom?.hobbyOdds).toBe("1:61");
    expect(doom?.sdccOdds).toBe("1:63");
  });

  it("assigns approved team chips and skips Battleworld / Secret Wars / Doom 2099", () => {
    const doom = VIDEOS[0];
    expect(doom.teams).toEqual(["Villains", "Fantastic Four", "Latveria", "Doctor Doom"]);
    expect(doom.teams).not.toContain("Battleworld");
    expect(doom.teams).not.toContain("Secret Wars");
    expect(doom.teams).not.toContain("Doom 2099");
  });

  it("ships a 750–1000 character SEO body for the Doom detail page", () => {
    const doom = VIDEOS[0];
    const len = doom.seoDescription?.length ?? 0;
    expect(len).toBeGreaterThanOrEqual(SEO_DESCRIPTION_MIN);
    expect(len).toBeLessThanOrEqual(SEO_DESCRIPTION_MAX);
    expect(hasVideoDetailPage(doom)).toBe(true);
    expect(doom.seoDescription).toContain("Latveria");
    expect(doom.seoDescription).toContain("Fantastic Four");
    expect(doom.seoDescription).toContain("DD-CC");
    expect(doom.seoDescription).toContain("200 unique");
    expect(doom.seoDescription).toContain("SDCC Chrome");
    expect(doom.seoDescription).toContain("Reported checklist odds");
    expect(doom.seoDescription).not.toMatch(/Battleworld/i);
    expect(doom.seoDescription).not.toMatch(/Secret Wars/i);
    expect(doom.seoDescription).not.toMatch(/2099/);
    expect(doom.seoDescription).not.toMatch(/\$\d/);
  });

  it("exposes D, Mint set labels, and educational team chips", () => {
    expect(getCharacterLetters(VIDEOS)).toContain("D");
    const sets = getSetFilterOptions(VIDEOS);
    expect(sets).toContain("2025 Topps Marvel Mint");
    expect(sets).toContain("Topps Marvel Mint");
    const teams = getTeamFilterOptions();
    expect(teams).toContain("Villains");
    expect(teams).toContain("Fantastic Four");
    expect(teams).toContain("Latveria");
    expect(teams).toContain("Avengers");
    expect(getTeamsWithVideos(VIDEOS)).toEqual([
      "Fantastic Four",
      "Villains",
      "Doctor Doom",
      "Latveria",
    ]);
  });

  it("filters Doctor Doom under D, Mint set names, and team chips", () => {
    const byLetter = filterAndSortVideos(VIDEOS, { letter: "D" });
    expect(byLetter.some((v) => v.youtubeId === "GK7TpveroyU")).toBe(true);

    const byFullSet = filterAndSortVideos(VIDEOS, { set: "2025 Topps Marvel Mint" });
    const byShortSet = filterAndSortVideos(VIDEOS, { set: "Topps Marvel Mint" });
    expect(byFullSet).toHaveLength(1);
    expect(byShortSet).toHaveLength(1);

    expect(filterAndSortVideos(VIDEOS, { team: "Villains" })).toHaveLength(1);
    expect(filterAndSortVideos(VIDEOS, { team: "Latveria" })).toHaveLength(1);
    expect(filterAndSortVideos(VIDEOS, { team: "Fantastic Four" })).toHaveLength(1);
    expect(filterAndSortVideos(VIDEOS, { team: "Avengers" })).toHaveLength(0);
    expect(filterAndSortVideos(VIDEOS, { letter: "D", team: "Villains", set: "2025 Topps Marvel Mint" })).toHaveLength(1);
    expect(filterAndSortVideos(VIDEOS, { letter: "D", team: "Avengers" })).toHaveLength(0);

    const empty = filterAndSortVideos(VIDEOS, { letter: "A" });
    expect(empty).toHaveLength(0);
  });

  it("builds embed, detail, and sitemap paths", () => {
    expect(youtubeEmbedUrl("GK7TpveroyU")).toBe("https://www.youtube.com/embed/GK7TpveroyU");
    expect(videoDetailPath("doctor-doom-comic-cut-1-1-2025-topps-marvel-mint")).toBe(
      "/videos/doctor-doom-comic-cut-1-1-2025-topps-marvel-mint"
    );
    expect(getVideoSitemapPaths()).toEqual([
      "/videos/doctor-doom-comic-cut-1-1-2025-topps-marvel-mint",
    ]);
    expect(getVideoById("doctor-doom-comic-cut-1-1-2025-topps-marvel-mint")?.youtubeId).toBe(
      "GK7TpveroyU"
    );
  });

  it("matches either set label or a listed team on a listing", () => {
    const doom = VIDEOS[0];
    expect(videoMatchesSet(doom, "2025 Topps Marvel Mint")).toBe(true);
    expect(videoMatchesSet(doom, "Topps Marvel Mint")).toBe(true);
    expect(videoMatchesSet(doom, "Chrome")).toBe(false);
    expect(videoMatchesTeam(doom, "Villains")).toBe(true);
    expect(videoMatchesTeam(doom, "Avengers")).toBe(false);
    expect(videoMatchesTeam(doom, null)).toBe(true);
  });
});

describe("video detail templates", () => {
  it("ships at least 12 distinct named layouts", () => {
    expect(VIDEO_TEMPLATE_COUNT).toBeGreaterThanOrEqual(12);
    expect(new Set(VIDEO_TEMPLATE_IDS).size).toBe(VIDEO_TEMPLATE_COUNT);
  });

  it("round-robins catalog order and keeps a slug stable", () => {
    const doomId = "doctor-doom-comic-cut-1-1-2025-topps-marvel-mint";
    expect(templateIndexForVideoId(doomId)).toBe(0);
    expect(templateIdForVideoId(doomId)).toBe("videoTopCardUnder");
    expect(templateIdForVideoId(doomId)).toBe(templateIdForVideoId(doomId));

    const fakeCatalog = [
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ] as typeof VIDEOS;
    expect(templateIndexForVideoId("a", fakeCatalog)).toBe(0);
    expect(templateIndexForVideoId("b", fakeCatalog)).toBe(1);
    expect(templateIndexForVideoId("c", fakeCatalog)).toBe(2);
  });
});
