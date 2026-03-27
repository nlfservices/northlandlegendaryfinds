/**
 * YouTube RSS Feed Router
 * Fetches latest videos from curated YouTube channels via RSS feeds
 * Caches results server-side for 1 hour to avoid excessive requests
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

// ─── Channel Configuration ───────────────────────────────────────────────────

export interface YouTubeChannel {
  id: string;
  channelId: string;
  name: string;
  handle: string;
  description: string;
  subscribers: string;
  url: string;
  focus: string;
}

export const YOUTUBE_CHANNELS: YouTubeChannel[] = [
  {
    id: "spidey-hits",
    channelId: "UCh79Ta-YblVGE5btbHVZTXg",
    name: "Spidey Hits | Marvel Cards & Collectibles",
    handle: "@SpideyHits",
    description:
      "Collector of Marvel Cards, Marvel Legends, and more. One of the best resources for Marvel card box breaks from 1987 to now — from your favorite 1990s products to modern releases.",
    subscribers: "14K",
    url: "https://www.youtube.com/@SpideyHits",
    focus: "Box Breaks & Reviews",
  },
  {
    id: "marvel-madness",
    channelId: "UCeaZJp-olwdfV0LQkhpgnqw",
    name: "Marvel Madness MCU",
    handle: "@marvelmadness",
    description:
      "Focuses on a wide range of Marvel and non-sport collectibles, including frequent box breaks of Marvel and DC trading cards by Upper Deck and Topps (Masterpieces, Metal Universe, Chrome, and more).",
    subscribers: "53K",
    url: "https://www.youtube.com/@marvelmadness",
    focus: "Live Breaks & Community",
  },
  {
    id: "gem-mint",
    channelId: "UC31fEeAOTnfRgvGFwYJsFUA",
    name: "Gem Mint Collectibles",
    handle: "@GemMintCollectibles",
    description:
      "Comic books, statues, omnibus reviews, and Marvel collectibles. Covers everything from trading card box breaks to premium statue unboxings and comic book deep dives.",
    subscribers: "171K",
    url: "https://www.youtube.com/@GemMintCollectibles",
    focus: "Comics & Collectibles",
  },
  {
    id: "that-cc-pod",
    channelId: "UCJx2Ddsda7tRKBzWW1OMCrA",
    name: "That Card Collectors Podcast",
    handle: "@ThatCCPod",
    description:
      "Hosted by Ian Taylor — talking cards & collecting; non-sports, the hobby, and community. Established in 2019 as the Marvel Card Collectors Podcast, now covering all non-sport cards.",
    subscribers: "832",
    url: "https://www.youtube.com/@ThatCCPod",
    focus: "Podcast & Discussion",
  },
  {
    id: "gingieman",
    channelId: "UC5RqEO1AcV3dB9wSDNJItfg",
    name: "Gingieman",
    handle: "@gingiemancards",
    description:
      "Sharing a love for Marvel cards, collecting and investing. Regular Top 10 Marvel Card Sales videos, market analysis, and thoughts on the Marvel card hobby.",
    subscribers: "2.9K",
    url: "https://www.youtube.com/@gingiemancards",
    focus: "Market & Investing",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface VideoEntry {
  videoId: string;
  title: string;
  published: string;
  thumbnailUrl: string;
  channelName: string;
  channelId: string;
}

interface ChannelVideos {
  channel: YouTubeChannel;
  latestVideo: VideoEntry | null;
  fetchedAt: number;
}

// ─── Cache ───────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let videoCache: Map<string, ChannelVideos> = new Map();
let lastFetchAll = 0;

// ─── RSS Parser ──────────────────────────────────────────────────────────────

function parseVideoFromRSS(xml: string, channel: YouTubeChannel): VideoEntry | null {
  try {
    // Extract first <entry> block
    const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
    if (!entryMatch) return null;

    const entry = entryMatch[1];

    // Extract video ID
    const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    if (!videoIdMatch) return null;

    // Extract title
    const titleMatch = entry.match(/<title>(.*?)<\/title>/);

    // Extract published date
    const publishedMatch = entry.match(/<published>(.*?)<\/published>/);

    const videoId = videoIdMatch[1].trim();

    return {
      videoId,
      title: titleMatch ? decodeXmlEntities(titleMatch[1].trim()) : "Untitled",
      published: publishedMatch ? publishedMatch[1].trim() : new Date().toISOString(),
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      channelName: channel.name,
      channelId: channel.channelId,
    };
  } catch {
    return null;
  }
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

async function fetchChannelLatestVideo(channel: YouTubeChannel): Promise<VideoEntry | null> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`;
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NLF-Bot/1.0)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`[YouTube RSS] Failed to fetch ${channel.name}: ${response.status}`);
      return null;
    }

    const xml = await response.text();
    return parseVideoFromRSS(xml, channel);
  } catch (err) {
    console.error(`[YouTube RSS] Error fetching ${channel.name}:`, err);
    return null;
  }
}

async function fetchAllChannelVideos(): Promise<ChannelVideos[]> {
  const now = Date.now();

  // Return cache if still valid
  if (now - lastFetchAll < CACHE_TTL_MS && videoCache.size === YOUTUBE_CHANNELS.length) {
    return Array.from(videoCache.values());
  }

  // Fetch all channels in parallel
  const results = await Promise.allSettled(
    YOUTUBE_CHANNELS.map(async (channel) => {
      // Check individual channel cache
      const cached = videoCache.get(channel.channelId);
      if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
        return cached;
      }

      const latestVideo = await fetchChannelLatestVideo(channel);
      const channelVideos: ChannelVideos = {
        channel,
        latestVideo,
        fetchedAt: now,
      };

      videoCache.set(channel.channelId, channelVideos);
      return channelVideos;
    })
  );

  lastFetchAll = now;

  return results
    .filter((r): r is PromiseFulfilledResult<ChannelVideos> => r.status === "fulfilled")
    .map((r) => r.value);
}

// ─── tRPC Router ─────────────────────────────────────────────────────────────

export const youtubeRouter = router({
  /**
   * Get latest videos from all curated YouTube channels
   * Returns channel info + latest video for each channel
   * Results are cached server-side for 1 hour
   */
  getLatestVideos: publicProcedure.query(async () => {
    const channelVideos = await fetchAllChannelVideos();

    return channelVideos.map((cv) => ({
      channel: {
        id: cv.channel.id,
        name: cv.channel.name,
        handle: cv.channel.handle,
        description: cv.channel.description,
        subscribers: cv.channel.subscribers,
        url: cv.channel.url,
        focus: cv.channel.focus,
      },
      latestVideo: cv.latestVideo
        ? {
            videoId: cv.latestVideo.videoId,
            title: cv.latestVideo.title,
            published: cv.latestVideo.published,
            thumbnailUrl: cv.latestVideo.thumbnailUrl,
            embedUrl: `https://www.youtube.com/embed/${cv.latestVideo.videoId}`,
          }
        : null,
    }));
  }),

  /**
   * Get channel list (static data, no RSS fetch needed)
   */
  getChannels: publicProcedure.query(() => {
    return YOUTUBE_CHANNELS.map((ch) => ({
      id: ch.id,
      name: ch.name,
      handle: ch.handle,
      description: ch.description,
      subscribers: ch.subscribers,
      url: ch.url,
      focus: ch.focus,
    }));
  }),
});
