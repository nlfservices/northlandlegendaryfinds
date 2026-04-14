/**
 * Checklist Detail Page - Full checklist for a single product
 * Shows all cards grouped by tier, with pull status and real-time tracking
 * 
 * WHATNOT COMPLIANCE:
 * - Estimated values are HIDDEN from public view (only MSRP allowed per Whatnot rules)
 * - Finalization statement displayed when checklist is finalized
 * - All required fields shown: card year, player/card name, variation, condition
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "wouter";
import {
  ListChecks, ArrowLeft, CheckCircle2, Loader2,
  Radio, Zap, Package, Calendar, TrendingUp, Eye,
  ShieldCheck, FileCheck, Info, X as XIcon, Lock, Clock
} from "lucide-react";
import { useMemo, useState } from "react";

import { products as frontendProducts } from "@/lib/products";

// Slugs that are exempt from pre-launch hide (checklist already revealed)
const REVEALED_SLUGS: string[] = [];

/** Check if a product's checklist is still pre-launch (hidden) based on its own launch date */
const isPreLaunch = (slug?: string) => {
  if (!slug) return true;
  if (REVEALED_SLUGS.includes(slug)) return false;
  // Find the product in frontend data to get its launch date
  const product = frontendProducts.find(
    p => p.dbSlug === slug || p.checklistSlug === slug || p.slug === slug
  );
  if (!product?.launchDate) return true; // No launch date = hidden
  return new Date() < new Date(product.launchDate);
};

const CARD_PLACEHOLDER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/card-placeholder-AFtdwioDcmq6GHzFUFUpif.webp";

export default function ChecklistDetail() {
  const params = useParams<{ slug: string }>();
  const { data: product, isLoading: productLoading } = trpc.public.products.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );
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

  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);

  const tierOrder = ["chase", "hit", "base", "bonus"];
  const tierLabels: Record<string, string> = {
    chase: "Chase Cards",
    hit: "Hit Cards",
    base: "Base Cards",
    bonus: "Bonus Cards",
  };
  const tierDescriptions: Record<string, string> = {
    chase: "The top-tier cards — the ones everyone is chasing",
    hit: "Premium cards — autos, relics, and numbered parallels",
    base: "Quality base cards from authentic Topps releases",
    bonus: "Bonus inserts and surprises",
  };
  const tierColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    chase: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", icon: "text-amber-400" },
    hit: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", icon: "text-purple-400" },
    base: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: "text-blue-400" },
    bonus: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", icon: "text-green-400" },
  };

  const categoryColors: Record<string, string> = {
    marvel: "from-red-600 to-red-800",
    starwars: "from-cyan-600 to-blue-800",
    sports: "from-green-600 to-green-800",
    pokemon: "from-yellow-600 to-amber-800",
    other: "from-purple-600 to-purple-800",
  };

  if (productLoading || checklistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <Link href="/checklists">
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Checklists</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = stats?.totalPacks ? Math.round(((stats.totalPacks - stats.packsRemaining) / stats.totalPacks) * 100) : 0;

  // Build the finalization statement
  const finalizedDate = product.checklistFinalizedAt
    ? new Date(product.checklistFinalizedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const defaultFinalizationStatement = finalizedDate
    ? `As of ${finalizedDate}, the ${product.name} series has been finalized. The number of professionally sealed surprise products and individual items in this series will not be changed.`
    : null;

  const finalizationStatement = product.checklistStatement || defaultFinalizationStatement;

  return (
    <div className="min-h-screen">
      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
            onClick={() => setLightboxImage(null)}
          >
            <XIcon className="w-8 h-8" />
          </button>
          <div className="relative max-w-2xl max-h-[80vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.name}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white/80 text-sm mt-3 text-center font-medium">{lightboxImage.name}</p>
          </div>
        </div>
      )}
      {/* Hero */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${categoryColors[product.category] || categoryColors.other} opacity-10`} />
        <div className="container relative z-10">
          <Link href="/checklists">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> All Checklists
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{product.category}</Badge>
                {product.isWhatnotExclusive && (
                  <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                    <Radio className="w-3 h-3 mr-1" /> Whatnot Live
                  </Badge>
                )}
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {product.status}
                </Badge>
                {finalizationStatement && (
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified Checklist
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span className="font-medium text-foreground">Manufacturer:</span> Northland Legendary Finds
              </div>
              {product.whatnotSeriesName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">Series:</span> {product.whatnotSeriesName}
                </div>
              )}
              {product.description && (
                <p className="text-muted-foreground text-lg max-w-2xl mt-2">{product.description}</p>
              )}
            </div>

            {/* Stats Cards — hide card count pre-launch */}
            <div className="flex gap-4">
              <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {isPreLaunch(params.slug) ? (
                    <Lock className="w-6 h-6 mx-auto text-primary/60" />
                  ) : (
                    stats?.totalChecklist || 0
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{isPreLaunch(params.slug) ? "Hidden" : "Total Cards"}</div>
              </div>
              {/* Pulled stats hidden pre-launch */}
              <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {isPreLaunch(params.slug) ? (
                    <Clock className="w-6 h-6 mx-auto text-cyan-400/60" />
                  ) : (
                    stats?.packsRemaining || 0
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{isPreLaunch(params.slug) ? "At Launch" : "Packs Left"}</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Series Progress</span>
              <span className="font-bold">{progressPercent}% opened</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Finalization Statement Banner */}
      {finalizationStatement && (
        <section className="border-y border-green-500/20 bg-green-500/5">
          <div className="container py-4">
            <div className="flex items-start gap-3">
              <FileCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-300 font-medium mb-1">Finalized Checklist Statement</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{finalizationStatement}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Compliance Info Bar */}
      <section className="border-b border-border bg-card/50">
        <div className="container py-3">
          <div className="flex items-center gap-6 text-xs text-muted-foreground overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              <span>Platform Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>{isPreLaunch(params.slug) ? "Checklist reveals at launch — no hidden cards" : "Full checklist published — no hidden cards"}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>Real-time pull tracking</span>
            </div>
            <Link href="/transparency" className="flex items-center gap-1.5 shrink-0 text-primary hover:underline">
              <FileCheck className="w-3.5 h-3.5" />
              <span>View our Transparency Policy</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container">
          <Tabs defaultValue="checklist" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" /> Full Checklist
              </TabsTrigger>
              {/* Recent Pulls tab hidden pre-launch */}
              {productShows && productShows.length > 0 && (
                <TabsTrigger value="shows" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Shows
                </TabsTrigger>
              )}
            </TabsList>

            {/* Checklist Tab */}
            <TabsContent value="checklist" className="space-y-8">
              {checklist && checklist.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ListChecks className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Checklist will be published soon. Check back before launch!</p>
                  </CardContent>
                </Card>
              )}

              {/* Pre-launch: blur the ENTIRE checklist */}
              {isPreLaunch(params.slug) && checklist && checklist.length > 0 && (
                <div className="relative">
                  {/* Overlay message */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-24 bg-background/40 backdrop-blur-sm rounded-lg">
                    <div className="bg-card border border-primary/30 rounded-xl p-8 text-center max-w-md shadow-2xl shadow-primary/20">
                      <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
                      <h4 className="font-bold text-2xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>CHECKLIST HIDDEN</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        The full checklist will be revealed on launch day. 
                        We want to keep the surprise until the product goes live!
                      </p>
                      <div className="inline-flex items-center gap-2 text-primary text-sm font-bold">
                        <Clock className="w-4 h-4" />
                        Cards across all tiers — revealed at launch
                      </div>
                    </div>
                  </div>
                  {/* Blurred content underneath */}
                  <div className="blur-lg select-none pointer-events-none opacity-40">
                    {tierOrder.map(tier => {
                      const items = grouped[tier];
                      if (!items || items.length === 0) return null;
                      const colors = tierColors[tier];
                      return (
                        <div key={tier} className="mb-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                              {tier === 'chase' && <TrendingUp className={`w-5 h-5 ${colors.icon}`} />}
                              {tier === 'hit' && <Zap className={`w-5 h-5 ${colors.icon}`} />}
                              {tier === 'base' && <Package className={`w-5 h-5 ${colors.icon}`} />}
                              {tier === 'bonus' && <Eye className={`w-5 h-5 ${colors.icon}`} />}
                            </div>
                            <h3 className="text-xl font-bold">{tierLabels[tier]}</h3>
                          </div>
                          <div className="grid gap-2">
                            {items.slice(0, 5).map(item => (
                              <div key={item.id} className="flex items-center gap-3 p-4 rounded-lg border bg-card border-border">
                                <div className="w-12 h-16 bg-muted rounded-md" />
                                <div>
                                  <div className="h-4 w-32 bg-muted rounded" />
                                  <div className="h-3 w-48 bg-muted/50 rounded mt-2" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Post-launch: show full checklist */}
              {!isPreLaunch(params.slug) && tierOrder.map(tier => {
                const items = grouped[tier];
                if (!items || items.length === 0) return null;
                const colors = tierColors[tier];
                const pulledCount = items.filter(i => i.isPulled).length;

                return (
                  <div key={tier}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                          {tier === 'chase' && <TrendingUp className={`w-5 h-5 ${colors.icon}`} />}
                          {tier === 'hit' && <Zap className={`w-5 h-5 ${colors.icon}`} />}
                          {tier === 'base' && <Package className={`w-5 h-5 ${colors.icon}`} />}
                          {tier === 'bonus' && <Eye className={`w-5 h-5 ${colors.icon}`} />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{tierLabels[tier]}</h3>
                          <p className="text-sm text-muted-foreground">{tierDescriptions[tier]}</p>
                        </div>
                      </div>
                      <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                        {items.length} cards
                      </Badge>
                    </div>

                    {/* Card Grid */}
                    <div className="relative">
                      <div className="grid gap-2">
                        {items.map(item => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-4 rounded-lg border transition-all bg-card border-border hover:border-primary/20`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Card Image */}
                              <div
                                className="relative shrink-0 cursor-pointer group"
                                onClick={() => !isPreLaunch(params.slug) && item.imageUrl && setLightboxImage({ url: item.imageUrl, name: `${item.cardName}${item.parallel ? ` (${item.parallel})` : ''}` })}
                              >
                                <img
                                  src={item.imageUrl || CARD_PLACEHOLDER}
                                  alt={item.cardName}
                                   className={`w-12 h-16 object-cover rounded-md border transition-all border-border ${item.imageUrl ? 'group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10' : ''}`}
                                  loading="lazy"
                                />
                                {item.imageUrl && !item.isPulled && (
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-md transition-all flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                  </div>
                                )}
                                {false && item.isPulled && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 drop-shadow-lg" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {item.cardName}
                                  {item.parallel && (
                                    <span className="text-primary ml-2 text-sm font-normal">({item.parallel})</span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-1.5">
                                  {item.cardSet && <span>{item.cardSet}</span>}
                                  {item.cardYear && <span>· {item.cardYear}</span>}
                                  {item.cardNumber && <span>· #{item.cardNumber}</span>}
                                  {item.cardCondition && <span>· {item.cardCondition}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* NOTE: estimatedValue intentionally NOT shown per Whatnot compliance rules */}
                              {/* PULLED badge hidden pre-launch */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            {/* Recent Pulls Tab */}
            <TabsContent value="pulls" className="space-y-4">
              {!pulls || pulls.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pulls recorded yet. Check back during live shows!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pulls.map(pull => {
                    const item = checklist?.find(c => c.id === pull.checklistItemId);
                    return (
                      <Card key={pull.id} className="hover:border-green-500/20 transition-colors">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <div className="font-bold">
                                  {item?.cardName || 'Unknown Card'}
                                  {item?.parallel && <span className="text-primary ml-2 font-normal text-sm">({item.parallel})</span>}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item?.cardSet && <span>{item.cardSet} · </span>}
                                  Pack #{pull.packNumber || '?'}
                                  {pull.pulledBy && <span> · {pull.pulledBy}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {/* NOTE: estimatedValue intentionally NOT shown per Whatnot compliance */}
                              <div className="text-xs text-muted-foreground">
                                {new Date(pull.pulledAt).toLocaleDateString()}
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

            {/* Shows Tab */}
            {productShows && productShows.length > 0 && (
              <TabsContent value="shows" className="space-y-4">
                {productShows.map(show => {
                  const statusColors: Record<string, string> = {
                    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                    live: "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse",
                    completed: "bg-green-500/10 text-green-400 border-green-500/30",
                    cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/30",
                  };
                  return (
                    <Card key={show.id} className="hover:border-primary/20 transition-colors">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                              <Radio className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">{show.title}</h3>
                                <Badge className={statusColors[show.status]}>{show.status}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(Number(show.showDate)).toLocaleString()}
                                {show.packsOpened > 0 && <span> · {show.packsOpened} packs opened</span>}
                              </div>
                            </div>
                          </div>
                          {show.whatnotUrl && (
                            <a href={show.whatnotUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <Radio className="w-4 h-4 mr-1" /> Watch on Whatnot
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
    </div>
  );
}
