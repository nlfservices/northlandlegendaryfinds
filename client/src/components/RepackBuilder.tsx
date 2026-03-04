/**
 * Repack Builder - Assign inventory cards to repack products with tier assignment
 * When cards are assigned, they auto-sync to the public checklist
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Plus, Loader2, Search, Package, ArrowRight,
  Star, Trophy, Layers, Sparkles, CheckCircle2, XCircle
} from "lucide-react";
import { useState, useMemo } from "react";

const TIER_CONFIG = {
  chase: { label: "Top Hits", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  hit: { label: "Middle of Pack", icon: Star, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  base: { label: "Low Floor", icon: Layers, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  bonus: { label: "Bonus", icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
};

export default function RepackBuilder() {
  const { data: products, isLoading: productsLoading } = trpc.admin.products.list.useQuery();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const selectedProduct = products?.find((p: any) => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Product Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Repack Builder</CardTitle>
          <CardDescription>Select a repack product to assign cards from your inventory. Assigned cards auto-sync to the public checklist.</CardDescription>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : !products?.length ? (
            <p className="text-muted-foreground">No products yet. Create a product in the Products tab first.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product: any) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedProductId === product.id
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border bg-card/50 hover:bg-card hover:border-primary/30"
                  }`}
                >
                  <p className="font-medium">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{product.totalPacks} packs</span>
                    {product.isWhatnotExclusive && <Badge variant="outline" className="text-xs">Whatnot</Badge>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Repack Contents */}
      {selectedProduct && (
        <RepackContents product={selectedProduct} />
      )}
    </div>
  );
}

function RepackContents({ product }: { product: any }) {
  const { data: cardSets } = trpc.admin.cardSets.list.useQuery();
  const { data: allocatedCards, isLoading: allocatedLoading } = trpc.admin.inventory.list.useQuery({ allocatedToProductId: product.id });
  const { data: availableCards, isLoading: availableLoading } = trpc.admin.inventory.list.useQuery({ status: "in_stock" });
  const allocateCard = trpc.admin.inventory.allocateToRepack.useMutation();
  const deallocateCard = trpc.admin.inventory.deallocateFromRepack.useMutation();
  const utils = trpc.useUtils();

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("chase");
  const [filterSetId, setFilterSetId] = useState<string>("all");

  const filteredAvailable = useMemo(() => {
    if (!availableCards) return [];
    let filtered = availableCards.filter((c: any) => !c.allocatedToProductId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((c: any) =>
        c.cardName.toLowerCase().includes(q) ||
        (c.parallel && c.parallel.toLowerCase().includes(q)) ||
        (c.cardNumber && c.cardNumber.toLowerCase().includes(q))
      );
    }
    if (filterSetId !== "all") {
      filtered = filtered.filter((c: any) => c.cardSetId === parseInt(filterSetId));
    }
    return filtered;
  }, [availableCards, searchQuery, filterSetId]);

  const tierCounts = useMemo(() => {
    if (!allocatedCards) return { chase: 0, hit: 0, base: 0, bonus: 0 };
    return {
      chase: allocatedCards.filter((c: any) => c.tier === "chase").length,
      hit: allocatedCards.filter((c: any) => c.tier === "hit").length,
      base: allocatedCards.filter((c: any) => c.tier === "base").length,
      bonus: allocatedCards.filter((c: any) => c.tier === "bonus").length,
    };
  }, [allocatedCards]);

  const getSetName = (setId: number) => {
    return cardSets?.find((s: any) => s.id === setId)?.name || "Unknown";
  };

  const handleAllocate = async (cardId: number) => {
    try {
      await allocateCard.mutateAsync({
        cardIds: [cardId],
        productId: product.id,
        tier: selectedTier as any,
      });
      utils.admin.inventory.list.invalidate();
      utils.admin.inventory.stats.invalidate();
      utils.admin.checklist.invalidate();
      utils.public.invalidate();
      toast.success("Card assigned to repack & checklist updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to assign card");
    }
  };

  const handleDeallocate = async (cardId: number) => {
    try {
      await deallocateCard.mutateAsync({ cardIds: [cardId] });
      utils.admin.inventory.list.invalidate();
      utils.admin.inventory.stats.invalidate();
      utils.admin.checklist.invalidate();
      utils.public.invalidate();
      toast.success("Card removed from repack & checklist updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to remove card");
    }
  };

  return (
    <>
      {/* Tier Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(TIER_CONFIG).map(([key, config]) => (
          <Card key={key} className={`border ${config.bg}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <config.icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-medium">{config.label}</span>
              </div>
              <p className="text-2xl font-bold">{tierCounts[key as keyof typeof tierCounts]}</p>
              <p className="text-xs text-muted-foreground">cards assigned</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Allocated Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {product.name} — {allocatedCards?.length || 0} Cards Assigned
              </CardTitle>
              <CardDescription>Cards currently in this repack. These appear on the public checklist.</CardDescription>
            </div>
            <Button onClick={() => setShowAssignDialog(true)}>
              <Plus className="w-4 h-4 mr-1" /> Assign Cards
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {allocatedLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : !allocatedCards?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No cards assigned yet. Click "Assign Cards" to add cards from your inventory.</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {/* Group by tier */}
                {(["chase", "hit", "base", "bonus"] as const).map(tier => {
                  const tierCards = allocatedCards.filter((c: any) => c.tier === tier);
                  if (!tierCards.length) return null;
                  const config = TIER_CONFIG[tier];
                  return (
                    <div key={tier} className="mb-4">
                      <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background py-1 z-10">
                        <config.icon className={`w-4 h-4 ${config.color}`} />
                        <span className="font-semibold text-sm">{config.label}</span>
                        <Badge variant="outline" className="text-xs">{tierCards.length}</Badge>
                      </div>
                      {tierCards.map((card: any) => (
                        <div key={card.id} className="flex items-center justify-between p-2 rounded-md hover:bg-card/80 transition-colors">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${config.color}`} />
                            <span className="font-medium truncate">{card.cardName}</span>
                            {card.parallel && card.parallel !== "Base" && (
                              <Badge variant="outline" className="text-xs flex-shrink-0">{card.parallel}</Badge>
                            )}
                            {card.serialNumber && (
                              <Badge variant="outline" className="text-xs flex-shrink-0 bg-yellow-500/10 text-yellow-400 border-yellow-500/30">/{card.serialNumber}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground flex-shrink-0">{getSetName(card.cardSetId)}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {card.estimatedValueCents > 0 && (
                              <span className="text-xs text-emerald-400">${(card.estimatedValueCents / 100).toFixed(2)}</span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeallocate(card.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Assign Cards Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Cards to {product.name}</DialogTitle>
            <DialogDescription>Select cards from your inventory to add to this repack. Choose a tier for each card.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tier Selector */}
            <div className="space-y-2">
              <Label>Assign to Tier</Label>
              <div className="flex gap-2">
                {Object.entries(TIER_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTier(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm transition-all ${
                      selectedTier === key
                        ? `${config.bg} border-current ${config.color} font-medium`
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <config.icon className="w-3.5 h-3.5" />
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search available cards..."
                  className="pl-9"
                />
              </div>
              <Select value={filterSetId} onValueChange={setFilterSetId}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Sets" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sets</SelectItem>
                  {cardSets?.map((s: any) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Available Cards */}
            <div className="text-sm text-muted-foreground">
              {filteredAvailable.length} available card{filteredAvailable.length !== 1 ? "s" : ""}
            </div>

            {availableLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : !filteredAvailable.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No available cards. Add cards to inventory first.</p>
              </div>
            ) : (
              <ScrollArea className="h-[350px]">
                <div className="space-y-1">
                  {filteredAvailable.map((card: any) => (
                    <div key={card.id} className="flex items-center justify-between p-2.5 rounded-md border border-border hover:border-primary/30 hover:bg-card/80 transition-all">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{card.cardName}</span>
                          {card.parallel && card.parallel !== "Base" && (
                            <Badge variant="outline" className="text-xs">{card.parallel}</Badge>
                          )}
                          {card.serialNumber && (
                            <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/30">/{card.serialNumber}</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {getSetName(card.cardSetId)}
                          {card.cardNumber && <> · #{card.cardNumber}</>}
                          {card.estimatedValueCents > 0 && <> · <span className="text-emerald-400">${(card.estimatedValueCents / 100).toFixed(2)}</span></>}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAllocate(card.id)}
                        disabled={allocateCard.isPending}
                        className="ml-2 flex-shrink-0"
                      >
                        <ArrowRight className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
