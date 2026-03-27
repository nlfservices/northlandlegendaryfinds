/**
 * Marvel Card Hub — Community Resources
 * Curated links to top Marvel news sites and auto-updating YouTube video embeds
 * from the best Marvel card collecting channels.
 */

import { useState } from "react";
import {
  ExternalLink,
  Play,
  Newspaper,
  Youtube,
  Globe,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// ─── Marvel News Sites ───────────────────────────────────────────────────────

interface NewsSite {
  name: string;
  url: string;
  description: string;
  category: string;
}

const MARVEL_NEWS_SITES: NewsSite[] = [
  {
    name: "Marvel.com",
    url: "https://www.marvel.com/articles",
    description:
      "The official Marvel website — breaking news, trailers, comic announcements, and first looks at upcoming Marvel projects straight from the source.",
    category: "Official",
  },
  {
    name: "CBR (Comic Book Resources)",
    url: "https://www.cbr.com/tag/marvel/",
    description:
      "One of the longest-running comic book news sites on the web. In-depth coverage of Marvel comics, MCU films, TV shows, and collectibles.",
    category: "News & Reviews",
  },
  {
    name: "ComicBook.com",
    url: "https://comicbook.com/marvel/",
    description:
      "Fast-breaking Marvel news, exclusive interviews, and comprehensive coverage of everything from comic releases to MCU casting announcements.",
    category: "Breaking News",
  },
  {
    name: "Screen Rant",
    url: "https://screenrant.com/tag/marvel/",
    description:
      "Deep-dive MCU analysis, fan theories, movie and TV reviews, and behind-the-scenes coverage of Marvel Studios productions.",
    category: "MCU Analysis",
  },
  {
    name: "Bleeding Cool",
    url: "https://bleedingcool.com/comics/marvel-comics/",
    description:
      "Industry insider news, comic market analysis, and coverage of Marvel collectibles including trading cards, graded comics, and convention exclusives.",
    category: "Industry & Collectibles",
  },
];

// ─── Video Embed Component ───────────────────────────────────────────────────

function VideoEmbed({
  channel,
  latestVideo,
}: {
  channel: {
    id: string;
    name: string;
    handle: string;
    description: string;
    subscribers: string;
    url: string;
    focus: string;
  };
  latestVideo: {
    videoId: string;
    title: string;
    published: string;
    thumbnailUrl: string;
    embedUrl: string;
  } | null;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const publishedDate = latestVideo?.published
    ? new Date(latestVideo.published).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300">
      {/* Video Area */}
      <div className="relative aspect-video bg-black">
        {latestVideo ? (
          isPlaying ? (
            <iframe
              src={`${latestVideo.embedUrl}?autoplay=1&rel=0`}
              title={latestVideo.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full cursor-pointer group/play"
            >
              <img
                src={latestVideo.thumbnailUrl}
                alt={latestVideo.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/play:bg-black/20 transition-colors">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-white ml-1" fill="white" />
                </div>
              </div>
            </button>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <Youtube className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Video unavailable</p>
            </div>
          </div>
        )}
      </div>

      {/* Channel Info */}
      <div className="p-4 space-y-3">
        {/* Video Title */}
        {latestVideo && (
          <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-2">
            {latestVideo.title}
          </h3>
        )}

        {/* Channel Name & Meta */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold text-sm hover:underline flex items-center gap-1.5"
            >
              {channel.name}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">{channel.handle}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{channel.subscribers} subscribers</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70 bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            {channel.focus}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {channel.description}
        </p>

        {/* Published Date */}
        {publishedDate && (
          <p className="text-[11px] text-muted-foreground/60">
            Latest video: {publishedDate}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── News Site Card ──────────────────────────────────────────────────────────

function NewsSiteCard({ site }: { site: NewsSite }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-primary flex-shrink-0" />
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
              {site.name}
            </h3>
          </div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full mb-2">
            {site.category}
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {site.description}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>
    </a>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function MarvelCardHub() {
  const {
    data: channelVideos,
    isLoading,
    error,
    refetch,
    isFetching,
  } = trpc.youtube.getLatestVideos.useQuery(undefined, {
    staleTime: 30 * 60 * 1000, // 30 min client-side stale time
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Hero Section ─── */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">
                COMMUNITY RESOURCES
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              MARVEL CARD HUB
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your go-to resource for Marvel card collecting. Stay up to date with the latest news,
              watch box breaks from top creators, and connect with the community.
            </p>
          </div>
        </div>
      </section>

      {/* ─── YouTube Channels Section ─── */}
      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Youtube className="w-6 h-6 text-red-500" />
                <h2
                  className="text-2xl sm:text-3xl font-bold text-foreground"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  TOP MARVEL CARD CHANNELS
                </h2>
              </div>
              <p className="text-muted-foreground">
                Latest videos from the best Marvel card collecting channels — auto-updated daily.
              </p>
            </div>
            {channelVideos && (
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                title="Refresh videos"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <p className="text-foreground font-bold mb-1">Unable to load videos</p>
              <p className="text-sm text-muted-foreground mb-4">
                YouTube feeds are temporarily unavailable. Please try again later.
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Video Grid */}
          {channelVideos && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channelVideos.map((cv) => (
                <VideoEmbed
                  key={cv.channel.id}
                  channel={cv.channel}
                  latestVideo={cv.latestVideo}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Marvel News Sites Section ─── */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Newspaper className="w-6 h-6 text-primary" />
              <h2
                className="text-2xl sm:text-3xl font-bold text-foreground"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                TOP MARVEL NEWS SITES
              </h2>
            </div>
            <p className="text-muted-foreground">
              Stay informed with the best sources for Marvel comics, MCU, and collectibles news.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MARVEL_NEWS_SITES.map((site) => (
              <NewsSiteCard key={site.name} site={site} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Disclaimer ─── */}
      <section className="py-8 border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              <strong>Disclaimer:</strong> Northland Legendary Finds is not affiliated with, endorsed by, or
              sponsored by any of the websites, YouTube channels, or creators listed on this page. All
              links are provided as community resources for informational purposes only. All trademarks,
              channel names, and content belong to their respective owners.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
