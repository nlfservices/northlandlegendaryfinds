/**
 * Whatnot 500-Pack Marvel Checklist Page
 * Stunning visual design with Top Hits / Middle of Pack / Low Floor tiers
 * Shows pull dates, show info, and real-time progress
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, CheckCircle2, Circle, Loader2,
  Radio, Zap, Package, Calendar, TrendingUp, Eye,
  Crown, Target, Layers, Flame, Star, Trophy,
  ExternalLink, Clock
} from "lucide-react";
import { useMemo } from "react";

const WHATNOT_STORE_URL = "https://www.whatnot.com/user/northlandfinds";
const CARD_PLACEHOLDER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/card-placeholder-AFtdwioDcmq6GHzFUFUpif.webp";

// Tier configuration with new naming
const tierConfig = {
  chase: {
    label: "TOP HITS",
    subtitle: "The chase cards everyone is hunting for",
    icon: Crown,
    gradient: "from-amber-500 to-yellow-600",
    bgGlow: "bg-amber-500/5",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    badgeBg: "bg-amber-500/10",
    iconBg: "bg-gradient-to-br from-amber-500/20 to-yellow-500/20",
    pulledBg: "bg-amber-500/5 border-amber-500/20",
    ringColor: "ring-amber-500/20",
    emoji: "🏆",
  },
  hit: {
    label: "MIDDLE OF THE PACK",
    subtitle: "Solid hits — autos, relics, and numbered parallels",
    icon: Target,
    gradient: "from-purple-500 to-violet-600",
    bgGlow: "bg-purple-500/5",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-400",
    badgeBg: "bg-purple-500/10",
    iconBg: "bg-gradient-to-br from-purple-500/20 to-violet-500/20",
    pulledBg: "bg-purple-500/5 border-purple-500/20",
    ringColor: "ring-purple-500/20",
    emoji: "🎯",
  },
  base: {
    label: "LOW FLOOR",
    subtitle: "Base cards with solid value — every pack has these",
    icon: Layers,
    gradient: "from-blue-500 to-cyan-600",
    bgGlow: "bg-blue-500/5",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    badgeBg: "bg-blue-500/10",
    iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
    pulledBg: "bg-blue-500/5 border-blue-500/20",
    ringColor: "ring-blue-500/20",
    emoji: "📦",
  },
  bonus: {
    label: "BONUS INSERTS",
    subtitle: "Surprise bonus cards and special inserts",
    icon: Star,
    gradient: "from-green-500 to-emerald-600",
    bgGlow: "bg-green-500/5",
    borderColor: "border-green-500/30",
    textColor: "text-green-400",
    badgeBg: "bg-green-500/10",
    iconBg: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
    pulledBg: "bg-green-500/5 border-green-500/20",
    ringColor: "ring-green-500/20",
    emoji: "⭐",
  },
};

function formatPullDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WhatnotChecklist() {
  const params = useParams<{ slug: string }>();

  // Fetch product by slug
  const { data: product, isLoading: productLoading } = trpc.public.products.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  // Fetch checklist, pulls, stats, shows
  const { data: checklist, isLoading: checklistLoading } = trpc.public.checklist.getByProduct.useQuery(
    { productId: product?.id! },
    { enabled: !!product?.id }
  );
  const { data: pulls } = trpc.public.pulls.getByProduct.useQuery(
    { productId: product?.id! },
    { enabled: !!product?.id }
  );
  const { data: stats } = trpc.public.products.stats.useQuery(
    { id: product?.id! },
    { enabled: !!product?.id }
  );
  const { data: productShows } = trpc.public.shows.getByProduct.useQuery(
    { productId: product?.id! },
    { enabled: !!product?.id }
  );

  // Build a map of checklistItemId -> pull data (for showing pull dates)
  const pullMap = useMemo(() => {
    const map = new Map<number, { pulledAt: Date | string; packNumber: number | null; pulledBy: string | null; showId: number | null }>();
    if (pulls) {
      for (const pull of pulls) {
        map.set(pull.checklistItemId, {
          pulledAt: pull.pulledAt,
          packNumber: pull.packNumber,
          pulledBy: pull.pulledBy,
          showId: pull.showId,
        });
      }
    }
    return map;
  }, [pulls]);

  // Build show map for display
  const showMap = useMemo(() => {
    const map = new Map<number, { title: string; showDate: number }>();
    if (productShows) {
      for (const show of productShows) {
        map.set(show.id, { title: show.title, showDate: Number(show.showDate) });
      }
    }
    return map;
  }, [productShows]);

  // Group checklist by tier
  const grouped = useMemo(() => {
    if (!checklist) return {};
    const groups: Record<string, typeof checklist> = {};
    for (const item of checklist) {
      if (!groups[item.tier]) groups[item.tier] = [];
      groups[item.tier].push(item);
    }
    return groups;
  }, [checklist]);

  const tierOrder = ["chase", "hit", "base", "bonus"] as const;

  // Stats
  const totalCards = checklist?.length || 0;
  const pulledCards = checklist?.filter(c => c.isPulled).length || 0;
  const progressPercent = stats?.totalPacks ? Math.round((((stats.totalPacks ?? 0) - stats.packsRemaining) / (stats.totalPacks ?? 1)) * 100) : 0;
  const packsOpened = stats?.totalPacks ? (stats.totalPacks ?? 0) - stats.packsRemaining : 0;

  if (productLoading || checklistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">This checklist doesn't exist yet.</p>
          <Link href="/whatnot">
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Whatnot</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-purple-900/10 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-500/8 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="container relative z-10">
          <Link href="/whatnot">
            <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Whatnot
            </Button>
          </Link>

          {/* Title Area */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" /> LIVE ON WHATNOT
                </Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
                  EXCLUSIVE
                </Badge>
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                  {product.category.toUpperCase()}
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 leading-tight" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-red-400">500-PACK</span>{" "}
                <span className="text-primary">MARVEL</span>
                <br />
                <span className="text-foreground">{product.name}</span>
              </h1>

              {product.description && (
                <p className="text-lg text-muted-foreground max-w-xl mb-4">{product.description}</p>
              )}

              <p className="text-sm text-muted-foreground">
                {product.packsPerShow || 50} packs per show · {product.totalPacks} total packs · Whatnot exclusive
              </p>
            </div>

            {/* Stats Panel */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 text-center min-w-[110px]">
                <div className="text-3xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {totalCards}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Total Cards</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 text-center min-w-[110px]">
                <div className="text-3xl font-bold text-green-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {pulledCards}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Pulled</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4 text-center min-w-[110px]">
                <div className="text-3xl font-bold text-cyan-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {stats?.packsRemaining || product.packsRemaining || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Packs Left</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm border border-amber-500/20 rounded-xl p-4 text-center min-w-[110px]">
                <div className="text-3xl font-bold text-amber-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {packsOpened}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Opened</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-2xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" /> Series Progress
              </span>
              <span className="font-bold text-primary">{progressPercent}% complete</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-4 overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-primary to-green-400 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${Math.max(progressPercent, 2)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 packs</span>
              <span>{product.totalPacks} packs</span>
            </div>
          </div>

          {/* Whatnot CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-red-500 hover:bg-red-600 text-white font-bold">
                <Radio className="w-4 h-4 mr-2" /> Follow on Whatnot
              </Button>
            </a>
            <Link href="/checklists">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                View All Checklists
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="py-8 lg:py-12">
        <div className="container">
          <Tabs defaultValue="checklist" className="space-y-8">
            <TabsList className="bg-card/80 backdrop-blur-sm border border-border p-1">
              <TabsTrigger value="checklist" className="flex items-center gap-2 font-bold">
                <Trophy className="w-4 h-4" /> Full Checklist
              </TabsTrigger>
              <TabsTrigger value="pulls" className="flex items-center gap-2 font-bold">
                <Zap className="w-4 h-4" /> Recent Pulls
              </TabsTrigger>
              {productShows && productShows.length > 0 && (
                <TabsTrigger value="shows" className="flex items-center gap-2 font-bold">
                  <Calendar className="w-4 h-4" /> Shows
                </TabsTrigger>
              )}
            </TabsList>

            {/* ===== CHECKLIST TAB ===== */}
            <TabsContent value="checklist" className="space-y-10">
              {checklist && checklist.length === 0 && (
                <Card className="border-dashed border-2 border-primary/20">
                  <CardContent className="py-16 text-center">
                    <Trophy className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Checklist Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      The full card checklist will be published before the first show. 
                      Follow us on Whatnot to get notified!
                    </p>
                  </CardContent>
                </Card>
              )}

              {tierOrder.map(tier => {
                const items = grouped[tier];
                if (!items || items.length === 0) return null;
                const config = tierConfig[tier];
                const TierIcon = config.icon;
                const pulledCount = items.filter(i => i.isPulled).length;
                const tierPercent = Math.round((pulledCount / items.length) * 100);

                return (
                  <div key={tier} className="space-y-4">
                    {/* Tier Header */}
                    <div className={`relative rounded-xl border ${config.borderColor} ${config.bgGlow} p-6 overflow-hidden`}>
                      <div className={`absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b ${config.gradient}`} />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 ${config.iconBg} rounded-xl flex items-center justify-center border ${config.borderColor}`}>
                            <TierIcon className={`w-7 h-7 ${config.textColor}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                                {config.emoji} {config.label}
                              </h2>
                            </div>
                            <p className="text-sm text-muted-foreground">{config.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${config.textColor}`}>
                              {pulledCount}/{items.length}
                            </div>
                            <div className="text-xs text-muted-foreground">pulled</div>
                          </div>
                          {/* Mini progress */}
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-500`}
                              style={{ width: `${tierPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card List */}
                    <div className="grid gap-2">
                      {items.map(item => {
                        const pullData = pullMap.get(item.id);
                        const showInfo = pullData?.showId ? showMap.get(pullData.showId) : null;

                        return (
                          <div
                            key={item.id}
                            className={`group relative flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                              item.isPulled
                                ? `${config.pulledBg} ring-1 ${config.ringColor}`
                                : 'bg-card/50 border-border hover:border-primary/20 hover:bg-card'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {/* Card Image */}
                              <div className="relative shrink-0">
                                <img
                                  src={item.imageUrl || CARD_PLACEHOLDER}
                                  alt={item.cardName}
                                  className={`w-12 h-16 object-cover rounded-md border ${
                                    item.isPulled ? `${config.borderColor} opacity-60` : 'border-border'
                                  }`}
                                  loading="lazy"
                                />
                                {item.isPulled ? (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <CheckCircle2 className={`w-5 h-5 ${config.textColor} drop-shadow-lg`} />
                                  </div>
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium flex items-center gap-2 flex-wrap">
                                  <span className={item.isPulled ? config.textColor : ""}>
                                    {item.cardName}
                                  </span>
                                  {item.parallel && (
                                    <span className="text-primary text-sm font-normal">({item.parallel})</span>
                                  )}
                                  {item.cardNumber && (
                                    <span className="text-muted-foreground text-xs">#{item.cardNumber}</span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
                                  {[item.cardSet, item.cardYear].filter(Boolean).join(' · ')}
                                  {/* Show pull date and info */}
                                  {item.isPulled && pullData && (
                                    <>
                                      <span className="mx-1">·</span>
                                      <Clock className="w-3 h-3 inline" />
                                      <span className={config.textColor}>
                                        Pulled {formatPullDate(pullData.pulledAt)}
                                      </span>
                                      {pullData.packNumber && (
                                        <span className="text-muted-foreground"> · Pack #{pullData.packNumber}</span>
                                      )}
                                      {showInfo && (
                                        <span className="text-muted-foreground"> · {showInfo.title}</span>
                                      )}
                                      {pullData.pulledBy && (
                                        <span className="text-muted-foreground"> · {pullData.pulledBy}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 ml-2">
                              {item.estimatedValue && (
                                <span className={`text-sm font-bold ${item.isPulled ? config.textColor : 'text-green-400'}`}>
                                  {item.estimatedValue}
                                </span>
                              )}
                              {item.isPulled ? (
                                <Badge className={`${config.badgeBg} ${config.textColor} ${config.borderColor} text-xs font-bold`}>
                                  PULLED
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs text-muted-foreground border-muted">
                                  AVAILABLE
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            {/* ===== RECENT PULLS TAB ===== */}
            <TabsContent value="pulls" className="space-y-4">
              {!pulls || pulls.length === 0 ? (
                <Card className="border-dashed border-2 border-primary/20">
                  <CardContent className="py-16 text-center">
                    <Zap className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Pulls Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Pulls will appear here in real-time during live Whatnot shows. Follow us to catch the next one!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pulls.map((pull, index) => {
                    const item = checklist?.find(c => c.id === pull.checklistItemId);
                    const tier = item?.tier || "base";
                    const config = tierConfig[tier as keyof typeof tierConfig];
                    const showInfo = pull.showId ? showMap.get(pull.showId) : null;

                    return (
                      <Card key={pull.id} className={`${config.pulledBg} hover:ring-1 ${config.ringColor} transition-all`}>
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center border ${config.borderColor}`}>
                                  <Zap className={`w-6 h-6 ${config.textColor}`} />
                                </div>
                                {index === 0 && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold flex items-center gap-2 flex-wrap">
                                  <span>{item?.cardName || 'Unknown Card'}</span>
                                  {item?.parallel && (
                                    <span className="text-primary font-normal text-sm">({item.parallel})</span>
                                  )}
                                  <Badge className={`${config.badgeBg} ${config.textColor} ${config.borderColor} text-xs`}>
                                    {config.label}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap mt-0.5">
                                  {item?.cardSet && <span>{item.cardSet}</span>}
                                  {pull.packNumber && <span> · Pack #{pull.packNumber}</span>}
                                  {pull.pulledBy && <span> · {pull.pulledBy}</span>}
                                  {showInfo && <span> · {showInfo.title}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              {item?.estimatedValue && (
                                <div className={`font-bold ${config.textColor}`}>{item.estimatedValue}</div>
                              )}
                              <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                <Clock className="w-3 h-3" />
                                {formatPullDate(pull.pulledAt)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* ===== SHOWS TAB ===== */}
            {productShows && productShows.length > 0 && (
              <TabsContent value="shows" className="space-y-4">
                {productShows.map(show => {
                  const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
                    scheduled: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
                    live: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
                    completed: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
                    cancelled: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/30" },
                  };
                  const sc = statusConfig[show.status] || statusConfig.scheduled;

                  return (
                    <Card key={show.id} className="hover:border-primary/20 transition-colors">
                      <CardContent className="py-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${sc.bg} rounded-xl flex items-center justify-center border ${sc.border}`}>
                              <Radio className={`w-6 h-6 ${sc.text} ${show.status === 'live' ? 'animate-pulse' : ''}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold">{show.title}</h3>
                                <Badge className={`${sc.bg} ${sc.text} ${sc.border} text-xs`}>
                                  {show.status === 'live' ? '🔴 LIVE NOW' : show.status.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mt-0.5">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {new Date(Number(show.showDate)).toLocaleString()}
                                {show.packsOpened > 0 && <span> · {show.packsOpened} packs opened</span>}
                                {show.startingPackNumber && <span> · Starting pack #{show.startingPackNumber}</span>}
                              </div>
                            </div>
                          </div>
                          {show.whatnotUrl && (
                            <a href={show.whatnotUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                <ExternalLink className="w-4 h-4 mr-1" /> Watch
                              </Button>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-12 border-t border-border">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            DON'T MISS THE NEXT <span className="text-red-400">LIVE SHOW</span>
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Follow us on Whatnot to get notified when we go live. Every show features {product.packsPerShow || 50} packs 
            from this {product.totalPacks}-pack series.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-bold">
                <Radio className="w-5 h-5 mr-2" /> Follow on Whatnot
              </Button>
            </a>
            <Link href="/whatnot">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                All Whatnot Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
