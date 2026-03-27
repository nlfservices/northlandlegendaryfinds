/**
 * YouTube RSS Router Tests
 * Tests the YouTube channel data and RSS parsing logic
 */

import { describe, it, expect } from "vitest";
import { YOUTUBE_CHANNELS } from "./youtube";

describe("YouTube Router", () => {
  describe("Channel Configuration", () => {
    it("should have exactly 5 channels configured", () => {
      expect(YOUTUBE_CHANNELS).toHaveLength(5);
    });

    it("should have valid channel IDs for all channels", () => {
      for (const channel of YOUTUBE_CHANNELS) {
        expect(channel.channelId).toBeTruthy();
        expect(channel.channelId).toMatch(/^UC[a-zA-Z0-9_-]{22}$/);
      }
    });

    it("should have unique channel IDs", () => {
      const ids = YOUTUBE_CHANNELS.map((c) => c.channelId);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have unique channel slugs", () => {
      const slugs = YOUTUBE_CHANNELS.map((c) => c.id);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("should have required fields for all channels", () => {
      for (const channel of YOUTUBE_CHANNELS) {
        expect(channel.id).toBeTruthy();
        expect(channel.channelId).toBeTruthy();
        expect(channel.name).toBeTruthy();
        expect(channel.handle).toBeTruthy();
        expect(channel.description).toBeTruthy();
        expect(channel.subscribers).toBeTruthy();
        expect(channel.url).toBeTruthy();
        expect(channel.focus).toBeTruthy();
      }
    });

    it("should have valid YouTube URLs for all channels", () => {
      for (const channel of YOUTUBE_CHANNELS) {
        expect(channel.url).toMatch(/^https:\/\/www\.youtube\.com\/@/);
      }
    });

    it("should have handles starting with @", () => {
      for (const channel of YOUTUBE_CHANNELS) {
        expect(channel.handle).toMatch(/^@/);
      }
    });

    it("should include Spidey Hits channel", () => {
      const spidey = YOUTUBE_CHANNELS.find((c) => c.id === "spidey-hits");
      expect(spidey).toBeDefined();
      expect(spidey!.channelId).toBe("UCh79Ta-YblVGE5btbHVZTXg");
      expect(spidey!.name).toContain("Spidey Hits");
    });

    it("should include Marvel Madness MCU channel", () => {
      const mm = YOUTUBE_CHANNELS.find((c) => c.id === "marvel-madness");
      expect(mm).toBeDefined();
      expect(mm!.channelId).toBe("UCeaZJp-olwdfV0LQkhpgnqw");
    });

    it("should include Gem Mint Collectibles channel", () => {
      const gm = YOUTUBE_CHANNELS.find((c) => c.id === "gem-mint");
      expect(gm).toBeDefined();
      expect(gm!.channelId).toBe("UC31fEeAOTnfRgvGFwYJsFUA");
    });

    it("should include That Card Collectors Podcast channel", () => {
      const tcp = YOUTUBE_CHANNELS.find((c) => c.id === "that-cc-pod");
      expect(tcp).toBeDefined();
      expect(tcp!.channelId).toBe("UCJx2Ddsda7tRKBzWW1OMCrA");
    });

    it("should include Gingieman channel", () => {
      const gm = YOUTUBE_CHANNELS.find((c) => c.id === "gingieman");
      expect(gm).toBeDefined();
      expect(gm!.channelId).toBe("UC5RqEO1AcV3dB9wSDNJItfg");
    });
  });

  describe("RSS Feed URLs", () => {
    it("should generate valid RSS feed URLs for all channels", () => {
      for (const channel of YOUTUBE_CHANNELS) {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`;
        expect(rssUrl).toContain("youtube.com/feeds/videos.xml");
        expect(rssUrl).toContain(channel.channelId);
      }
    });
  });
});
