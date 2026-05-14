/**
 * MCU Movie/Series Detail Page — Comprehensive template with:
 * 1. Hero with trailer embed
 * 2. Box Office Breakdown (Opening Weekend → 1 Month → Overall)
 * 3. Top Stars cast spotlight
 * 4. Card Collector's Corner
 * 5. Kids & Family Favorites (merch/toy angle)
 * 6. Related MCU Movies ("Watch Next")
 * 7. Must-See Viewing Order
 * 8. Fun Facts / Legacy
 */

import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";
import {
  Film, Tv, Star, TrendingUp, Calendar, ChevronLeft, Play, DollarSign,
  Trophy, Users, Heart, ShoppingBag, ArrowRight, Clapperboard, Sparkles,
  Target, Award, Popcorn, Clock, BarChart3, Gem, Baby, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import RichContent from "@/components/RichContent";

function BoxOfficeBar({ label, amount, maxAmount, color }: { label: string; amount: number; maxAmount: number; color: string }) {
  const width = Math.min((amount / maxAmount) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <span className="text-lg font-bold text-white">${amount}M</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext, color = "text-orange-400" }: {
  icon: any; label: string; value: string; subtext?: string; color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      {subtext && <div className="text-xs text-muted-foreground mt-0.5">{subtext}</div>}
    </div>
  );
}

function VerdictBanner({ verdict }: { verdict: "hit" | "miss" | "mixed" | null }) {
  if (!verdict) return null;
  const config = {
    hit: { bg: "from-green-500/20 to-green-900/10", border: "border-green-500/30", text: "text-green-400", icon: Trophy, label: "BOX OFFICE HIT", desc: "This one delivered for Marvel Studios" },
    miss: { bg: "from-red-500/20 to-red-900/10", border: "border-red-500/30", text: "text-red-400", icon: Target, label: "BOX OFFICE MISS", desc: "Didn't hit the numbers Marvel expected" },
    mixed: { bg: "from-yellow-500/20 to-yellow-900/10", border: "border-yellow-500/30", text: "text-yellow-400", icon: BarChart3, label: "MIXED RESULTS", desc: "Some wins, some losses — a divisive entry" },
  };
  const c = config[verdict];
  return (
    <div className={`bg-gradient-to-r ${c.bg} border ${c.border} rounded-xl p-4 flex items-center gap-4`}>
      <c.icon className={`w-8 h-8 ${c.text} shrink-0`} />
      <div>
        <div className={`text-sm font-bold ${c.text} uppercase tracking-wider`}>{c.label}</div>
        <div className="text-sm text-muted-foreground">{c.desc}</div>
      </div>
    </div>
  );
}

export default function MCUMediaDetail() {
  const [, params] = useRoute("/movies-series/:slug");
  const slug = params?.slug ?? "";
  const { data: item, isLoading } = trpc.mcuMedia.getBySlug.useQuery({ slug }, { enabled: !!slug });
  const { data: allItems = [] } = trpc.mcuMedia.list.useQuery({ type: "all" });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Clapperboard className="w-16 h-16 text-orange-500/30" />
        <h1 className="text-2xl font-bold">Not Found</h1>
        <Link href="/movies-series">
          <Button variant="outline" className="border-orange-500/30 text-orange-400">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Movies & Series
          </Button>
        </Link>
      </div>
    );
  }

  const isMovie = item.mediaType === "movie";
  const maxGross = Math.max(item.worldwideGrossMillions ?? 0, 1);

  // Parse cast into array
  const castList = item.cast
    ? item.cast.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  // Related movies (same phase, excluding current)
  const relatedItems = allItems
    .filter((m: any) => m.id !== item.id && m.phase === item.phase)
    .slice(0, 4);

  // Must-see viewing order (items with lower releaseOrder)
  const mustSeeFirst = allItems
    .filter((m: any) => m.releaseOrder && item.releaseOrder && m.releaseOrder < item.releaseOrder)
    .slice(-3);

  // What to watch next
  const watchNext = allItems
    .filter((m: any) => m.releaseOrder && item.releaseOrder && m.releaseOrder > item.releaseOrder)
    .slice(0, 3);

  return (
    <>
      <SEO
        title={`${item.title} | MCU ${isMovie ? "Movie" : "Series"} Guide`}
        description={item.metaDescription ?? `Everything you need to know about ${item.title} — trailer, ${isMovie ? "box office numbers" : "streaming data"}, cast, and trading card market analysis.`}
      />

      <div className="min-h-screen">
        {/* ===== HERO SECTION ===== */}
        <section className="relative">
          {/* Background image */}
          <div className="absolute inset-0">
            {item.imageUrl && (
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          </div>

          <div className="container relative z-10 pt-8 pb-12">
            {/* Back link */}
            <Link href="/movies-series">
              <Button variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 mb-6 -ml-2">
                <ChevronLeft className="w-4 h-4 mr-1" /> Movies & Series
              </Button>
            </Link>

            <div className="grid lg:grid-cols-2 gap-8 items-end">
              {/* Left: Title & Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded bg-orange-500 text-white uppercase tracking-wider">
                    {item.mediaType}
                  </span>
                  {item.phase && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      Phase {item.phase}
                    </span>
                  )}
                  {item.releaseOrder && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
                      MCU #{item.releaseOrder}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">
                  <span className="text-orange-400">{item.title}</span>
                </h1>

                {item.tagline && (
                  <p className="text-xl text-muted-foreground mb-4">{item.tagline}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  {item.releaseDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-orange-400" /> {item.releaseDate}
                    </span>
                  )}
                  {item.director && (
                    <span className="flex items-center gap-1.5">
                      <Clapperboard className="w-4 h-4 text-orange-400" /> {item.director}
                    </span>
                  )}
                  {isMovie && item.worldwideGrossMillions && (
                    <span className="flex items-center gap-1.5 text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" /> ${item.worldwideGrossMillions}M Worldwide
                    </span>
                  )}
                  {!isMovie && item.episodeCount && (
                    <span className="flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-orange-400" /> {item.episodeCount} Episodes
                    </span>
                  )}
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {item.rtCriticsScore && (
                    <StatCard icon={Star} label="Critics" value={`${item.rtCriticsScore}%`} subtext="Rotten Tomatoes" />
                  )}
                  {item.rtAudienceScore && (
                    <StatCard icon={Users} label="Audience" value={`${item.rtAudienceScore}%`} subtext="Audience Score" />
                  )}
                  {isMovie && item.openingWeekendMillions && (
                    <StatCard icon={Popcorn} label="Opening" value={`$${item.openingWeekendMillions}M`} subtext="Opening Weekend" color="text-green-400" />
                  )}
                  {isMovie && item.budgetMillions && (
                    <StatCard icon={DollarSign} label="Budget" value={`$${item.budgetMillions}M`} subtext="Production" color="text-yellow-400" />
                  )}
                  {!isMovie && item.seasonCount && (
                    <StatCard icon={Tv} label="Seasons" value={`${item.seasonCount}`} subtext={item.platform ?? "Disney+"} />
                  )}
                  {!isMovie && item.episodeCount && (
                    <StatCard icon={Clock} label="Episodes" value={`${item.episodeCount}`} subtext="Total Episodes" />
                  )}
                </div>
              </div>

              {/* Right: Trailer Embed */}
              <div>
                {item.youtubeTrailerId ? (
                  <div className="rounded-xl overflow-hidden border-2 border-orange-500/30 shadow-lg shadow-orange-500/10">
                    <div className="relative aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${item.youtubeTrailerId}?rel=0`}
                        title={`${item.title} - Official Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    <div className="bg-card px-4 py-2.5 flex items-center gap-2">
                      <Play className="w-4 h-4 text-orange-400" fill="currentColor" />
                      <span className="text-sm font-medium text-orange-400">Official Trailer</span>
                    </div>
                  </div>
                ) : item.imageUrl ? (
                  <div className="rounded-xl overflow-hidden border border-border">
                    <img src={item.imageUrl} alt={item.title} className="w-full aspect-video object-cover" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* ===== VERDICT BANNER ===== */}
        <section className="container py-4">
          <VerdictBanner verdict={item.verdict} />
        </section>

        {/* ===== MAIN CONTENT AREA ===== */}
        <div className="container pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column (2/3) */}
            <div className="lg:col-span-2 space-y-10">

              {/* === SECTION 1: OVERVIEW / DESCRIPTION === */}
              {item.description && (
                <section>
                  <h2 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <Film className="w-6 h-6" /> Overview
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <RichContent>{item.description}</RichContent>
                  </div>
                </section>
              )}

              {/* === SECTION 2: BOX OFFICE BREAKDOWN (Movies Only) === */}
              {isMovie && (item.openingWeekendMillions || item.domesticGrossMillions || item.worldwideGrossMillions) && (
                <section>
                  <h2 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6" /> Box Office Breakdown
                  </h2>
                  <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                    {item.budgetMillions && (
                      <div className="flex items-center justify-between pb-4 border-b border-border">
                        <span className="text-muted-foreground">Production Budget</span>
                        <span className="text-xl font-bold text-yellow-400">${item.budgetMillions}M</span>
                      </div>
                    )}
                    {item.openingWeekendMillions && (
                      <BoxOfficeBar
                        label="Opening Weekend (Domestic)"
                        amount={item.openingWeekendMillions}
                        maxAmount={maxGross}
                        color="bg-orange-500"
                      />
                    )}
                    {item.domesticGrossMillions && (
                      <BoxOfficeBar
                        label="Domestic Total"
                        amount={item.domesticGrossMillions}
                        maxAmount={maxGross}
                        color="bg-orange-400"
                      />
                    )}
                    {item.worldwideGrossMillions && (
                      <BoxOfficeBar
                        label="Worldwide Total"
                        amount={item.worldwideGrossMillions}
                        maxAmount={maxGross}
                        color="bg-gradient-to-r from-orange-500 to-green-500"
                      />
                    )}
                    {item.budgetMillions && item.worldwideGrossMillions && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Return on Investment</span>
                          <span className={`text-xl font-bold ${item.worldwideGrossMillions > item.budgetMillions * 2 ? "text-green-400" : item.worldwideGrossMillions > item.budgetMillions ? "text-yellow-400" : "text-red-400"}`}>
                            {((item.worldwideGrossMillions / item.budgetMillions) * 100 - 100).toFixed(0)}% {item.worldwideGrossMillions > item.budgetMillions * 2 ? "🔥" : ""}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.worldwideGrossMillions > item.budgetMillions * 2.5
                            ? "Massive hit — earned back its budget multiple times over."
                            : item.worldwideGrossMillions > item.budgetMillions * 2
                            ? "Solid performer — comfortably profitable for the studio."
                            : item.worldwideGrossMillions > item.budgetMillions
                            ? "Modest return — marketing costs may have eaten into profits."
                            : "Below budget — this one lost money for the studio."}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* === SECTION 3: TOP STARS === */}
              {castList.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" /> Top Stars
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {castList.map((actor: string, i: number) => {
                      // Parse "Actor Name as Character Name" format
                      const parts = actor.split(" as ");
                      const actorName = parts[0]?.trim();
                      const charName = parts[1]?.trim();
                      return (
                        <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-orange-500/30 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                            <Star className="w-5 h-5 text-orange-400" />
                          </div>
                          <div className="font-semibold text-white text-sm">{actorName}</div>
                          {charName && (
                            <div className="text-xs text-orange-400 mt-0.5">as {charName}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* === SECTION 4: FULL ARTICLE CONTENT === */}
              {item.content && (
                <section>
                  <div className="prose prose-invert max-w-none">
                    <RichContent>{item.content}</RichContent>
                  </div>
                </section>
              )}

              {/* === SECTION 5: CARD COLLECTOR'S CORNER === */}
              {(item.cardMarketContent || item.keyCards) && (
                <section>
                  <h2 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <Gem className="w-6 h-6" /> Card Collector's Corner
                  </h2>
                  <div className="bg-gradient-to-br from-orange-950/30 to-card border border-orange-500/20 rounded-xl p-6 space-y-4">
                    {item.cardMarketContent && (
                      <div className="prose prose-invert max-w-none">
                        <RichContent>{item.cardMarketContent}</RichContent>
                      </div>
                    )}
                    {item.keyCards && (
                      <div>
                        <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" /> Key Cards to Collect
                        </h3>
                        <div className="prose prose-invert max-w-none">
                          <RichContent>{item.keyCards}</RichContent>
                        </div>
                      </div>
                    )}
                    <div className="pt-3 border-t border-orange-500/20">
                      <Link href="/card-database">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                          Browse Card Database <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              {/* === SECTION 6: KIDS & FAMILY FAVORITES === */}
              <section>
                <h2 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6" /> Kids & Family Favorites
                </h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0">
                      <Baby className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Who's the Fan Favorite?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.title} introduced characters that kids absolutely love. From action figures to Halloween costumes,
                        these characters drive massive merchandise sales every year.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <Gift className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                      <div className="text-xs text-muted-foreground">Action Figures</div>
                      <div className="text-sm font-semibold text-white">Top Sellers</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <ShoppingBag className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                      <div className="text-xs text-muted-foreground">Merchandise</div>
                      <div className="text-sm font-semibold text-white">High Demand</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    Product recommendations coming soon — follow us for updates when our merch picks go live.
                  </p>
                </div>
              </section>
            </div>

            {/* ===== SIDEBAR (1/3) ===== */}
            <div className="space-y-6">
              {/* Rotten Tomatoes Card */}
              {(item.rtCriticsScore || item.rtAudienceScore) && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" /> Ratings
                  </h3>
                  {item.rtCriticsScore && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Critics Score</span>
                        <span className={`font-bold ${item.rtCriticsScore >= 60 ? "text-green-400" : "text-red-400"}`}>
                          {item.rtCriticsScore}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.rtCriticsScore >= 60 ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${item.rtCriticsScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {item.rtAudienceScore && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Audience Score</span>
                        <span className={`font-bold ${item.rtAudienceScore >= 60 ? "text-green-400" : "text-red-400"}`}>
                          {item.rtAudienceScore}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.rtAudienceScore >= 60 ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${item.rtAudienceScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Must-See Before This */}
              {mustSeeFirst.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Watch Before This
                  </h3>
                  <div className="space-y-3">
                    {mustSeeFirst.map((m: any) => (
                      <Link key={m.id} href={`/movies-series/${m.slug}`}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-orange-400">#{m.releaseOrder}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{m.title}</div>
                            <div className="text-xs text-muted-foreground">{m.releaseDate}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Watch Next */}
              {watchNext.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" /> Watch Next
                  </h3>
                  <div className="space-y-3">
                    {watchNext.map((m: any) => (
                      <Link key={m.id} href={`/movies-series/${m.slug}`}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-orange-400">#{m.releaseOrder}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{m.title}</div>
                            <div className="text-xs text-muted-foreground">{m.releaseDate}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related in Same Phase */}
              {relatedItems.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <Film className="w-5 h-5" /> Same Phase
                  </h3>
                  <div className="space-y-3">
                    {relatedItems.map((m: any) => (
                      <Link key={m.id} href={`/movies-series/${m.slug}`}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          {m.imageUrl ? (
                            <img src={m.imageUrl} alt={m.title} className="w-12 h-8 rounded object-cover shrink-0" />
                          ) : (
                            <div className="w-12 h-8 rounded bg-muted shrink-0" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-white">{m.title}</div>
                            <div className="text-xs text-muted-foreground">{m.releaseDate}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Database CTA */}
              <div className="bg-gradient-to-br from-orange-950/40 to-card border border-orange-500/20 rounded-xl p-5 text-center">
                <Gem className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Explore Cards</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Browse our database of 1,700+ Marvel trading cards
                </p>
                <Link href="/card-database">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full" size="sm">
                    Card Database <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
