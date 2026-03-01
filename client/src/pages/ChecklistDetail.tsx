/**
 * Checklist Detail Page - Full checklist for a single product
 * Shows all cards grouped by tier, with pull status and real-time tracking
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "wouter";
import {
  ListChecks, ArrowLeft, CheckCircle2, Circle, Loader2,
  Radio, Zap, Package, Calendar, TrendingUp, Eye
} from "lucide-react";
import { useMemo } from "react";

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

  const tierOrder = ["chase", "hit", "base", "bonus"];
  const tierLabels: Record<string, string> = {
    chase: "Chase Cards",
    hit: "Hit Cards",
    base: "Base Cards",
    bonus: "Bonus Cards",
  };
  const tierDescriptions: Record<string, string> = {
    chase: "The top-tier cards — the ones everyone is chasing",
    hit: "Guaranteed hits — autos, relics, and numbered parallels",
    base: "Solid base cards with great value",
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

  const progressPercent = stats ? Math.round(((stats.totalPacks - stats.packsRemaining) / stats.totalPacks) * 100) : 0;

  return (
    <div className="min-h-screen">
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
                    <Radio className="w-3 h-3 mr-1" /> Whatnot Exclusive
                  </Badge>
                )}
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {product.status}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                {product.name}
              </h1>
              {product.description && (
                <p className="text-muted-foreground text-lg max-w-2xl">{product.description}</p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {stats?.totalChecklist || 0}
                </div>
                <div className="text-xs text-muted-foreground">Total Cards</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-green-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {stats?.totalPulls || 0}
                </div>
                <div className="text-xs text-muted-foreground">Pulled</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {stats?.packsRemaining || 0}
                </div>
                <div className="text-xs text-muted-foreground">Packs Left</div>
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

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container">
          <Tabs defaultValue="checklist" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" /> Full Checklist
              </TabsTrigger>
              <TabsTrigger value="pulls" className="flex items-center gap-2">
                <Zap className="w-4 h-4" /> Recent Pulls
              </TabsTrigger>
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

              {tierOrder.map(tier => {
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
                        {pulledCount}/{items.length} pulled
                      </Badge>
                    </div>

                    {/* Card Grid */}
                    <div className="grid gap-2">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                            item.isPulled
                              ? 'bg-green-500/5 border-green-500/20'
                              : 'bg-card border-border hover:border-primary/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.isPulled ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                            )}
                            <div>
                              <div className="font-medium">
                                {item.cardName}
                                {item.parallel && (
                                  <span className="text-primary ml-2 text-sm font-normal">({item.parallel})</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {[item.cardSet, item.cardYear, item.cardNumber].filter(Boolean).join(' · ')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {item.estimatedValue && (
                              <span className="text-sm font-bold text-green-400">{item.estimatedValue}</span>
                            )}
                            {item.isPulled && (
                              <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">PULLED</Badge>
                            )}
                          </div>
                        </div>
                      ))}
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
                              {item?.estimatedValue && (
                                <div className="font-bold text-green-400">{item.estimatedValue}</div>
                              )}
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
