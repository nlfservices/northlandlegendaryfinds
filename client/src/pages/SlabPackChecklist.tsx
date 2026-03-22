/**
 * SlabPackChecklist — Public page showing a slab pack's card checklist
 * Displays available and claimed cards organized by rarity tier
 * Route: /slab-packs/:slug
 */

import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Crown, Star, Layers, CheckCircle2, XCircle, Loader2, Package, Shield, Zap } from "lucide-react";
import { useMemo } from "react";

const TIER_CONFIG = {
  grail: {
    label: "GRAIL",
    subtitle: "Top Hits — The cards everyone is chasing",
    icon: Crown,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  chase: {
    label: "CHASE",
    subtitle: "Mid-Tier Hits — Strong pulls worth celebrating",
    icon: Star,
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/10",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  lineup: {
    label: "LINEUP",
    subtitle: "Base Cards — Every pack guaranteed",
    icon: Layers,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
};

const PACK_TIER_COLORS: Record<string, string> = {
  silver: "from-zinc-400 to-zinc-600",
  gold: "from-amber-400 to-amber-600",
  diamond: "from-cyan-300 to-blue-500",
  infinity: "from-purple-400 via-pink-500 to-amber-400",
};

export default function SlabPackChecklist() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: pack, isLoading: packLoading } = trpc.slabPacks.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const { data: checklist, isLoading: checklistLoading } = trpc.slabPacks.checklist.useQuery(
    { slabPackId: pack?.id ?? 0 },
    { enabled: !!pack?.id }
  );

  const { data: stats } = trpc.slabPacks.stats.useQuery(
    { slabPackId: pack?.id ?? 0 },
    { enabled: !!pack?.id }
  );

  // Group cards by tier
  const grouped = useMemo(() => {
    if (!checklist) return {};
    const groups: Record<string, typeof checklist> = {};
    for (const card of checklist) {
      if (!groups[card.tier]) groups[card.tier] = [];
      groups[card.tier].push(card);
    }
    return groups;
  }, [checklist]);

  const isLoading = packLoading || checklistLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Package className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Pack Not Found</h1>
        <p className="text-muted-foreground">This slab pack doesn't exist or isn't available yet.</p>
        <Link href="/shop">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const tierGradient = PACK_TIER_COLORS[pack.tier] ?? PACK_TIER_COLORS.silver;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background/80 to-background" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        </div>

        <div className="container relative z-10 py-12">
          <Link href="/shop">
            <Button variant="ghost" className="gap-2 mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Pack Image */}
            <div className="w-full md:w-64 shrink-0">
              {pack.imageUrl ? (
                <img src={pack.imageUrl} alt={pack.name} className="w-full rounded-xl shadow-2xl" />
              ) : (
                <div className={`w-full aspect-[3/4] rounded-xl bg-gradient-to-br ${tierGradient} flex items-center justify-center shadow-2xl`}>
                  <Package className="w-16 h-16 text-white/80" />
                </div>
              )}
            </div>

            {/* Pack Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className={`capitalize bg-gradient-to-r ${tierGradient} bg-clip-text text-transparent border-white/20`}>
                  {pack.tier}
                </Badge>
                <Badge variant="outline" className={
                  pack.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                  pack.status === "coming_soon" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                  "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                }>
                  {pack.status === "coming_soon" ? "COMING SOON" : pack.status.toUpperCase()}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{pack.name}</h1>
              
              {pack.description && (
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">{pack.description}</p>
              )}

              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <p className="text-3xl font-bold text-primary">${(pack.priceCents / 100).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">per pack</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{pack.slabsPerPack}</p>
                  <p className="text-xs text-muted-foreground">slab{pack.slabsPerPack > 1 ? "s" : ""} per pack</p>
                </div>
                {stats && (
                  <>
                    <div>
                      <p className="text-3xl font-bold text-green-400">{stats.available}</p>
                      <p className="text-xs text-muted-foreground">cards available</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-400">{stats.claimed}</p>
                      <p className="text-xs text-muted-foreground">cards claimed</p>
                    </div>
                  </>
                )}
              </div>

              {pack.status === "coming_soon" && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-semibold">
                    {pack.launchDate 
                      ? `Launching ${new Date(pack.launchDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                      : "Coming Soon — Stay Tuned!"
                    }
                  </span>
                </div>
              )}

              {pack.status === "active" && (
                <Button size="lg" className="gap-2" disabled>
                  <Shield className="w-5 h-5" /> Purchase Coming Soon
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Available Slabs</h2>
            <p className="text-muted-foreground">
              {stats ? `${stats.available} of ${stats.total} cards still available` : "Loading..."}
            </p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            Checklist
          </Badge>
        </div>

        {/* Tier Sections */}
        {(["grail", "chase", "lineup"] as const).map(tier => {
          const tierCards = grouped[tier];
          if (!tierCards?.length) return null;
          const config = TIER_CONFIG[tier];
          const TierIcon = config.icon;
          const available = tierCards.filter(c => c.status === "available").length;
          const claimed = tierCards.filter(c => c.status === "claimed").length;

          return (
            <div key={tier} className="mb-10">
              {/* Tier Header */}
              <div className={`flex items-center gap-4 p-4 rounded-t-xl ${config.bgColor} border ${config.borderColor} border-b-0`}>
                <TierIcon className={`w-6 h-6 ${config.color}`} />
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${config.color}`}>{config.label}</h3>
                  <p className="text-xs text-muted-foreground">{config.subtitle}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400">{available} available</span>
                  <span className="text-red-400">{claimed} claimed</span>
                </div>
              </div>

              {/* Card Grid */}
              <div className={`border ${config.borderColor} border-t-0 rounded-b-xl overflow-hidden`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border/30">
                  {tierCards.map(card => {
                    const isClaimed = card.status === "claimed";
                    return (
                      <div
                        key={card.id}
                        className={`p-4 bg-background ${isClaimed ? "opacity-50" : ""} transition-all`}
                      >
                        <div className="flex gap-3">
                          {/* Card Image */}
                          {card.frontImageUrl ? (
                            <img
                              src={card.frontImageUrl}
                              alt={card.cardName}
                              className={`w-16 h-22 object-cover rounded ${isClaimed ? "grayscale" : ""}`}
                            />
                          ) : (
                            <div className={`w-16 h-22 rounded flex items-center justify-center text-xs ${
                              isClaimed ? "bg-muted/30 text-muted-foreground/50" : "bg-muted text-muted-foreground"
                            }`}>
                              SLAB
                            </div>
                          )}

                          {/* Card Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`font-semibold text-sm truncate ${isClaimed ? "line-through" : ""}`}>
                                {card.cardName}
                              </p>
                              {isClaimed ? (
                                <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] shrink-0">
                                  CLAIMED
                                </Badge>
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            {card.cardSet && (
                              <p className="text-xs text-muted-foreground truncate">{card.cardSet}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              {card.parallel && <span>{card.parallel}</span>}
                              {card.serialNumber && <span>#{card.serialNumber}</span>}
                            </div>
                            {card.gradingCompany && card.grade && (
                              <p className="text-xs font-mono mt-1">
                                <span className="text-primary">{card.gradingCompany}</span> {card.grade}
                              </p>
                            )}
                            {card.estimatedValueCents && !isClaimed && (
                              <p className="text-xs text-green-400 mt-1">
                                Est. ${(card.estimatedValueCents / 100).toFixed(0)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Hit Rate Info */}
        {stats && stats.total > 0 && (
          <>
            <Separator className="my-8" />
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Hit Rates</h3>
              <div className="flex justify-center gap-8">
                {(["grail", "chase", "lineup"] as const).map(tier => {
                  const tierData = stats.byTier[tier];
                  if (!tierData) return null;
                  const config = TIER_CONFIG[tier];
                  const rate = ((tierData.total / stats.total) * 100).toFixed(1);
                  return (
                    <div key={tier} className="text-center">
                      <p className={`text-2xl font-bold ${config.color}`}>{rate}%</p>
                      <p className="text-xs text-muted-foreground">{config.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
