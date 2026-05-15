/**
 * MCU Movies & Series Hub — Orange-branded listing page
 * Shows all MCU movies and series organized by Phase with Coming Soon badges
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Film, Tv, Star, TrendingUp, Calendar, Play, Clapperboard, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

type MediaItem = {
  id: number;
  title: string;
  slug: string;
  mediaType: "movie" | "series";
  phase: number | null;
  releaseOrder: number | null;
  releaseDate: string | null;
  imageUrl: string | null;
  tagline: string | null;
  verdict: "hit" | "miss" | "mixed" | null;
  rtCriticsScore: number | null;
  worldwideGrossMillions: number | null;
  episodeCount: number | null;
  seasonCount: number | null;
  status: string;
};

const PHASE_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: { title: "Phase One", subtitle: "Avengers Assembled (2008–2012)" },
  2: { title: "Phase Two", subtitle: "New World Order (2013–2015)" },
  3: { title: "Phase Three", subtitle: "Infinity Saga (2015–2019)" },
  4: { title: "Phase Four", subtitle: "Multiverse Saga (2021–2022)" },
  5: { title: "Phase Five", subtitle: "Multiverse Saga (2023–2024)" },
  6: { title: "Phase Six", subtitle: "Multiverse Saga (2025–2027)" },
};

function VerdictBadge({ verdict }: { verdict: "hit" | "miss" | "mixed" | null }) {
  if (!verdict) return null;
  const styles = {
    hit: "bg-green-500/20 text-green-400 border-green-500/30",
    miss: "bg-red-500/20 text-red-400 border-red-500/30",
    mixed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  const labels = { hit: "HIT", miss: "MISS", mixed: "MIXED" };
  return (
    <span className={`px-2 py-0.5 text-xs font-bold rounded border ${styles[verdict]}`}>
      {labels[verdict]}
    </span>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const isPublished = item.status === "published";
  
  const cardContent = (
    <div className={`group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 ${
      isPublished 
        ? "hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer" 
        : "opacity-70 cursor-default"
    }`}>
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isPublished ? "group-hover:scale-105" : "grayscale-[30%]"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900/30 to-black">
            {item.mediaType === "movie" ? (
              <Film className="w-12 h-12 text-orange-500/50" />
            ) : (
              <Tv className="w-12 h-12 text-orange-500/50" />
            )}
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Play button overlay - only for published */}
        {isPublished && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-orange-500/90 flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>
        )}
        
        {/* Coming Soon overlay for drafts */}
        {!isPublished && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4 py-2 rounded-lg bg-black/70 border border-orange-500/30 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-400 tracking-wide">COMING SOON</span>
            </div>
          </div>
        )}
        
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-bold rounded bg-orange-500/90 text-white uppercase tracking-wider">
            {item.mediaType}
          </span>
        </div>
        {/* Verdict badge */}
        {isPublished && (
          <div className="absolute top-3 right-3">
            <VerdictBadge verdict={item.verdict} />
          </div>
        )}
        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
          {item.tagline && isPublished && (
            <p className="text-sm text-gray-300 mt-1 line-clamp-1">{item.tagline}</p>
          )}
        </div>
      </div>
      {/* Stats bar */}
      <div className="px-4 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          {item.releaseDate && (
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.releaseDate}
            </span>
          )}
          {isPublished && item.rtCriticsScore && (
            <span className="text-orange-400 flex items-center gap-1 font-semibold">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              {item.rtCriticsScore}%
            </span>
          )}
        </div>
        {isPublished && item.mediaType === "movie" && item.worldwideGrossMillions && (
          <span className="text-green-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            ${item.worldwideGrossMillions}M
          </span>
        )}
        {isPublished && item.mediaType === "series" && item.episodeCount && (
          <span className="text-muted-foreground">
            {item.seasonCount && item.seasonCount > 1 ? `${item.seasonCount} Seasons · ` : ""}
            {item.episodeCount} Episodes
          </span>
        )}
      </div>
    </div>
  );

  if (isPublished) {
    return <Link href={`/movies-series/${item.slug}`}>{cardContent}</Link>;
  }
  return cardContent;
}

export default function MCUMediaHub() {
  const [filter, setFilter] = useState<"all" | "movie" | "series">("all");
  const { data: items = [], isLoading } = trpc.mcuMedia.list.useQuery({ type: filter });

  // Group by phase
  const groupedByPhase = useMemo(() => {
    const groups: Record<number, MediaItem[]> = {};
    items.forEach((item: MediaItem) => {
      const phase = item.phase ?? 0;
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(item);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([phase, items]) => ({ phase: Number(phase), items }));
  }, [items]);

  // Stats
  const totalCount = items.length;
  const publishedCount = items.filter((i: MediaItem) => i.status === "published").length;
  const movieCount = items.filter((i: MediaItem) => i.mediaType === "movie").length;
  const seriesCount = items.filter((i: MediaItem) => i.mediaType === "series").length;

  return (
    <>
      <SEO
        title="MCU Movies & Series Timeline | Every Marvel Movie & Show by Phase"
        description="Complete MCU timeline organized by Phase — 77 movies and Disney+ series with trailers, box office numbers, cast spotlights, and trading card market analysis."
      />

      <div className="min-h-screen">
        {/* Hero Section with Orange Branding */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-950/30 via-background to-background" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-orange-600 rounded-full blur-[100px]" />
          </div>

          <div className="container relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Clapperboard className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="text-orange-400">MCU</span> Movies & Series
                </h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mt-2">
              The complete Marvel Cinematic Universe timeline — {totalCount} movies and series organized by Phase. 
              Trailers, box office breakdowns, cast spotlights, and trading card market analysis.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-orange-400" />
                <span className="text-muted-foreground">{movieCount} Movies</span>
              </div>
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-orange-400" />
                <span className="text-muted-foreground">{seriesCount} Series</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-green-400" />
                <span className="text-muted-foreground">{publishedCount} Full Guides Published</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mt-8">
              {(["all", "movie", "series"] as const).map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "outline"}
                  className={filter === type 
                    ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500" 
                    : "border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                  }
                  onClick={() => setFilter(type)}
                >
                  {type === "all" && <Clapperboard className="w-4 h-4 mr-1.5" />}
                  {type === "movie" && <Film className="w-4 h-4 mr-1.5" />}
                  {type === "series" && <Tv className="w-4 h-4 mr-1.5" />}
                  {type === "all" ? "All" : type === "movie" ? "Movies" : "Series"}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container pb-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <Clapperboard className="w-16 h-16 text-orange-500/30 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-muted-foreground mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">
                We're building out the complete MCU catalog. Check back soon for trailers, 
                box office breakdowns, and card market analysis for every Marvel movie and series.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {groupedByPhase.map(({ phase, items }) => {
                const phaseInfo = PHASE_LABELS[phase];
                const publishedInPhase = items.filter((i: MediaItem) => i.status === "published").length;
                return (
                  <div key={phase} id={`phase-${phase}`}>
                    {/* Phase Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center font-bold text-orange-400">
                          {phase}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {phaseInfo?.title ?? `Phase ${phase}`}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {phaseInfo?.subtitle ?? ""} · {items.length} titles
                            {publishedInPhase > 0 && (
                              <span className="text-green-400 ml-2">· {publishedInPhase} guide{publishedInPhase > 1 ? "s" : ""} live</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="h-px bg-gradient-to-r from-orange-500/50 via-orange-500/20 to-transparent" />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item: MediaItem) => (
                        <MediaCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Phase Quick Nav (sticky bottom) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex gap-1 px-4 py-2 rounded-full bg-card/90 backdrop-blur-md border border-orange-500/30 shadow-xl shadow-black/30">
            {[1, 2, 3, 4, 5, 6].map((phase) => (
              <a
                key={phase}
                href={`#phase-${phase}`}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-orange-400 hover:bg-orange-500/20 transition-colors"
                title={PHASE_LABELS[phase]?.title}
              >
                {phase}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
