/**
 * NLF Infinity Series #1 - Live Checklist Page
 * Pulls real-time data from the database — shows pulled/remaining status live
 * Available exclusively on Whatnot — no purchase option on this page
 */
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import {
  CheckCircle2, Circle, Search, ExternalLink, Loader2,
  Trophy, Zap, Package, Star, ChevronDown, ChevronUp, Flame
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";

const PRODUCT_SLUG = "nlf-infinity-series-1";

const TIER_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  badgeClass: string;
}> = {
  chase: {
    label: "Chase Cards",
    icon: <Trophy className="w-4 h-4" />,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    badgeClass: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
  },
  hit: {
    label: "Hit Cards",
    icon: <Flame className="w-4 h-4" />,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/30",
    badgeClass: "bg-orange-400/20 text-orange-300 border-orange-400/40",
  },
  base: {
    label: "Base Cards",
    icon: <Package className="w-4 h-4" />,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
    badgeClass: "bg-blue-400/20 text-blue-300 border-blue-400/40",
  },
  bonus: {
    label: "Bonus Cards",
    icon: <Star className="w-4 h-4" />,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/30",
    badgeClass: "bg-purple-400/20 text-purple-300 border-purple-400/40",
  },
};

const TIER_ORDER = ["chase", "hit", "base", "bonus"];

type ChecklistItem = {
  id: number;
  sortOrder: number;
  isPulled: boolean;
  cardName: string;
  cardSet?: string | null;
  cardNumber?: string | null;
  parallel?: string | null;
  cardCondition?: string | null;
  cardYear?: string | null;
  tier?: string | null;
};

type PullRecord = {
  checklistItemId: number;
};

export default function NLFInfinitySeries1Checklist() {
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    chase: true,
    hit: true,
    base: false,
    bonus: false,
  });

  // Fetch product by slug
  const { data: product, isLoading: productLoading } = trpc.public.products.getBySlug.useQuery(
    { slug: PRODUCT_SLUG },
    { refetchInterval: 30000 }
  );

  // Fetch checklist items
  const { data: checklist, isLoading: checklistLoading } = trpc.public.checklist.getByProduct.useQuery(
    { productId: product?.id ?? 0 },
    { enabled: !!product?.id, refetchInterval: 30000 }
  );

  // Fetch pull records
  const { data: pulls } = trpc.public.pulls.getByProduct.useQuery(
    { productId: product?.id ?? 0 },
    { enabled: !!product?.id, refetchInterval: 15000 }
  );

  const isLoading = productLoading || checklistLoading;

  // Build a set of pulled checklist item IDs
  const pulledIds = useMemo(() => {
    if (!pulls) return new Set<number>();
    return new Set((pulls as PullRecord[]).map((p) => p.checklistItemId));
  }, [pulls]);

  // Merge isPulled from live pulls data
  const enrichedChecklist = useMemo<ChecklistItem[]>(() => {
    if (!checklist) return [];
    return (checklist as ChecklistItem[]).map((item) => ({
      ...item,
      isPulled: item.isPulled || pulledIds.has(item.id),
    }));
  }, [checklist, pulledIds]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return enrichedChecklist;
    const q = search.toLowerCase();
    return enrichedChecklist.filter((item) =>
      item.cardName.toLowerCase().includes(q) ||
      (item.cardSet ?? "").toLowerCase().includes(q) ||
      (item.cardNumber ?? "").toLowerCase().includes(q) ||
      (item.parallel ?? "").toLowerCase().includes(q) ||
      (item.cardCondition ?? "").toLowerCase().includes(q)
    );
  }, [enrichedChecklist, search]);

  // Group by tier
  const grouped = useMemo(() => {
    const groups: Record<string, ChecklistItem[]> = {};
    for (const item of filtered) {
      const tier = item.tier || "base";
      if (!groups[tier]) groups[tier] = [];
      groups[tier].push(item);
    }
    return groups;
  }, [filtered]);

  // Stats
  const totalCards = enrichedChecklist.length;
  const pulledCount = enrichedChecklist.filter((i) => i.isPulled).length;
  const remainingCount = totalCards - pulledCount;
  const chaseCount = enrichedChecklist.filter((i) => i.tier === "chase").length;
  const oneOfOnes = enrichedChecklist.filter((i) => i.parallel === "1/1").length;

  const toggleSection = (tier: string) => {
    setOpenSections(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="NLF Infinity Series #1 Checklist | 165 Cards | Northland Legendary Finds"
        description="Full 165-card checklist for NLF Infinity Series #1. Featuring Topps Marvel Mint Encased, The Collector, and graded slabs. Available exclusively on Whatnot."
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/40 via-background to-background" />
        <div className="relative container py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground">NLF Infinity Series #1</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              {/* Whatnot-only badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold tracking-wide mb-3">
                <Zap className="w-3 h-3" />
                AVAILABLE ONLY ON WHATNOT
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                NLF Infinity Series <span className="text-primary">#1</span>
              </h1>
              <p className="text-muted-foreground max-w-xl">
                165-card sealed set featuring Topps Marvel Mint Encased, The Collector, and graded slabs.
                Finalized 5/27/2026 — sealed and will not be changed.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-500 text-white font-bold gap-2"
                onClick={() => window.open("https://www.whatnot.com/user/northlandlegendaryfinds", "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
                Watch Live on Whatnot
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          {isLoading ? (
            <div className="flex items-center gap-2 mt-6 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading checklist...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
              {[
                { label: "Total Cards", value: totalCards, color: "text-foreground" },
                { label: "Pulled", value: pulledCount, color: "text-green-400" },
                { label: "Remaining", value: remainingCount, color: "text-blue-400" },
                { label: "Chase Cards", value: chaseCount, color: "text-yellow-400" },
                { label: "1/1 Cards", value: oneOfOnes, color: "text-red-400" },
              ].map(stat => (
                <div key={stat.label} className="bg-card border border-border rounded-lg px-4 py-3 text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Pull Progress Bar */}
          {!isLoading && totalCards > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{pulledCount} pulled</span>
                <span>{Math.round((pulledCount / totalCards) * 100)}% complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(pulledCount / totalCards) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="container py-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cards, characters, grades..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {search && (
          <p className="text-sm text-muted-foreground mt-2">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {/* Checklist Sections */}
      <div className="container pb-12 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : totalCards === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Checklist not yet available.</p>
          </div>
        ) : (
          TIER_ORDER.map(tier => {
            const items = grouped[tier];
            if (!items || items.length === 0) return null;
            const config = TIER_CONFIG[tier];
            const pulledInTier = items.filter((i) => i.isPulled).length;
            const isOpen = openSections[tier] ?? true;

            return (
              <div key={tier} className={`border rounded-xl overflow-hidden ${config.bg}`}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(tier)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={config.color}>{config.icon}</span>
                    <span className={`font-bold text-lg ${config.color}`}>{config.label}</span>
                    <Badge variant="outline" className={`text-xs ${config.badgeClass}`}>
                      {items.length} cards
                    </Badge>
                    {pulledInTier > 0 && (
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/40">
                        {pulledInTier} pulled
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {items.length - pulledInTier} remaining
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Card List */}
                {isOpen && (
                  <div className="border-t border-white/10">
                    <div className="divide-y divide-white/5">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                            item.isPulled ? "opacity-50" : "hover:bg-white/5"
                          }`}
                        >
                          {/* Pull status icon */}
                          <div className="flex-shrink-0">
                            {item.isPulled ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground/40" />
                            )}
                          </div>

                          {/* Card number */}
                          <div className="flex-shrink-0 w-8 text-right text-xs text-muted-foreground font-mono">
                            {item.sortOrder}
                          </div>

                          {/* Card info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-medium text-sm ${item.isPulled ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {item.cardName}
                              </span>
                              {item.parallel && (
                                <Badge variant="outline" className={`text-xs ${config.badgeClass}`}>
                                  {item.parallel}
                                </Badge>
                              )}
                              {item.isPulled && (
                                <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                                  PULLED
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 truncate">
                              {item.cardSet}
                              {item.cardNumber && ` · #${item.cardNumber}`}
                              {item.cardCondition && item.cardCondition !== "RAW" && ` · ${item.cardCondition}`}
                              {item.cardCondition === "RAW" && " · Raw"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border bg-card/50">
        <div className="container py-8 text-center">
          <p className="text-muted-foreground mb-4">
            NLF Infinity Series #1 is available exclusively on Whatnot. Watch live to see cards pulled in real time.
          </p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-500 text-white font-bold gap-2"
            onClick={() => window.open("https://www.whatnot.com/user/northlandlegendaryfinds", "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            Follow Us on Whatnot
          </Button>
        </div>
      </div>
    </div>
  );
}
