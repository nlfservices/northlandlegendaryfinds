/**
 * SlabPackManager — Admin panel for managing Digital Slab Packs (Arena Club-style)
 * Manage pack types, assign cards, quick pull for in-person rips
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit, Package, Zap, Eye, ArrowLeft, Loader2,
  Crown, Star, Layers, Search, CheckCircle2, XCircle, AlertTriangle,
  Hand
} from "lucide-react";

// ==================== PACK TYPE MANAGER ====================

function PackTypeForm({ 
  onSubmit, 
  initialData, 
  isLoading 
}: { 
  onSubmit: (data: any) => void; 
  initialData?: any; 
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    priceCents: initialData?.priceCents ? initialData.priceCents / 100 : 50,
    slabsPerPack: initialData?.slabsPerPack ?? 1,
    totalPacks: initialData?.totalPacks ?? "",
    tier: initialData?.tier ?? "silver",
    status: initialData?.status ?? "draft",
    launchDate: initialData?.launchDate ? new Date(initialData.launchDate).toISOString().split("T")[0] : "",
    sortOrder: initialData?.sortOrder ?? 0,
  });

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Pack Name</Label>
          <Input
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm(f => ({ ...f, name, slug: initialData ? f.slug : autoSlug(name) }));
            }}
            placeholder="Silver Super Slab Pack"
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="silver-super-slab-pack" />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="1 graded Marvel slab per pack. Grails, chase hits, and lineup cards."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label>Price ($)</Label>
          <Input
            type="number"
            min={0.5}
            step={0.01}
            value={form.priceCents}
            onChange={(e) => setForm(f => ({ ...f, priceCents: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label>Slabs Per Pack</Label>
          <Input
            type="number"
            min={1}
            value={form.slabsPerPack}
            onChange={(e) => setForm(f => ({ ...f, slabsPerPack: parseInt(e.target.value) || 1 }))}
          />
        </div>
        <div>
          <Label>Total Packs (blank = unlimited)</Label>
          <Input
            type="number"
            value={form.totalPacks}
            onChange={(e) => setForm(f => ({ ...f, totalPacks: e.target.value === "" ? "" : parseInt(e.target.value) }))}
            placeholder="∞"
          />
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Pack Tier</Label>
          <Select value={form.tier} onValueChange={(v) => setForm(f => ({ ...f, tier: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="diamond">Diamond</SelectItem>
              <SelectItem value="infinity">Infinity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="coming_soon">Coming Soon</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="soldout">Sold Out</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Launch Date</Label>
          <Input
            type="date"
            value={form.launchDate}
            onChange={(e) => setForm(f => ({ ...f, launchDate: e.target.value }))}
          />
        </div>
      </div>

      <Button
        onClick={() => onSubmit({
          ...form,
          priceCents: Math.round(form.priceCents * 100),
          totalPacks: form.totalPacks === "" ? undefined : Number(form.totalPacks),
          launchDate: form.launchDate ? new Date(form.launchDate).getTime() : undefined,
        })}
        disabled={isLoading || !form.name || !form.slug}
        className="w-full"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {initialData ? "Update Pack" : "Create Pack"}
      </Button>
    </div>
  );
}

// ==================== CARD FORM ====================

function CardForm({
  slabPackId,
  onSubmit,
  initialData,
  isLoading,
}: {
  slabPackId: number;
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    cardName: initialData?.cardName ?? "",
    cardSet: initialData?.cardSet ?? "",
    cardYear: initialData?.cardYear ?? "",
    cardNumber: initialData?.cardNumber ?? "",
    parallel: initialData?.parallel ?? "",
    serialNumber: initialData?.serialNumber ?? "",
    gradingCompany: initialData?.gradingCompany ?? "BGS",
    grade: initialData?.grade ?? "",
    gradeNumeric: initialData?.gradeNumeric ?? "",
    tier: initialData?.tier ?? "lineup",
    estimatedValueCents: initialData?.estimatedValueCents ? initialData.estimatedValueCents / 100 : 0,
    sortOrder: initialData?.sortOrder ?? 0,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Character / Player Name *</Label>
          <Input value={form.cardName} onChange={(e) => setForm(f => ({ ...f, cardName: e.target.value }))} placeholder="Beast" />
        </div>
        <div>
          <Label>Card Set</Label>
          <Input value={form.cardSet} onChange={(e) => setForm(f => ({ ...f, cardSet: e.target.value }))} placeholder="2022-23 Upper Deck Marvel Annual" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label>Year</Label>
          <Input value={form.cardYear} onChange={(e) => setForm(f => ({ ...f, cardYear: e.target.value }))} placeholder="2022" />
        </div>
        <div>
          <Label>Card #</Label>
          <Input value={form.cardNumber} onChange={(e) => setForm(f => ({ ...f, cardNumber: e.target.value }))} placeholder="#3" />
        </div>
        <div>
          <Label>Parallel</Label>
          <Input value={form.parallel} onChange={(e) => setForm(f => ({ ...f, parallel: e.target.value }))} placeholder="Hologram" />
        </div>
        <div>
          <Label>Serial #</Label>
          <Input value={form.serialNumber} onChange={(e) => setForm(f => ({ ...f, serialNumber: e.target.value }))} placeholder="5/23" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label>Grading Company</Label>
          <Select value={form.gradingCompany} onValueChange={(v) => setForm(f => ({ ...f, gradingCompany: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BGS">BGS (Beckett)</SelectItem>
              <SelectItem value="PSA">PSA</SelectItem>
              <SelectItem value="CGC">CGC</SelectItem>
              <SelectItem value="SGC">SGC</SelectItem>
              <SelectItem value="AGS">AGS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Grade</Label>
          <Input value={form.grade} onChange={(e) => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="8.5" />
        </div>
        <div>
          <Label>Grade (Numeric)</Label>
          <Input value={form.gradeNumeric} onChange={(e) => setForm(f => ({ ...f, gradeNumeric: e.target.value }))} placeholder="8.5" />
        </div>
        <div>
          <Label>Est. Value ($)</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={form.estimatedValueCents}
            onChange={(e) => setForm(f => ({ ...f, estimatedValueCents: parseFloat(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rarity Tier</Label>
          <Select value={form.tier} onValueChange={(v) => setForm(f => ({ ...f, tier: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="grail">Grail (Top Hits)</SelectItem>
              <SelectItem value="chase">Chase (Mid Tier)</SelectItem>
              <SelectItem value="lineup">Lineup (Base)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <Button
        onClick={() => onSubmit({
          slabPackId,
          ...form,
          estimatedValueCents: Math.round(form.estimatedValueCents * 100) || undefined,
          gradeNumeric: form.gradeNumeric || undefined,
        })}
        disabled={isLoading || !form.cardName}
        className="w-full"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {initialData ? "Update Card" : "Add Card"}
      </Button>
    </div>
  );
}

// ==================== TIER BADGE ====================

function TierBadge({ tier }: { tier: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    grail: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: <Crown className="w-3 h-3" />, label: "GRAIL" },
    chase: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: <Star className="w-3 h-3" />, label: "CHASE" },
    lineup: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <Layers className="w-3 h-3" />, label: "LINEUP" },
  };
  const c = config[tier] ?? config.lineup;
  return (
    <Badge variant="outline" className={`${c.color} text-xs gap-1`}>
      {c.icon} {c.label}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    available: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: <CheckCircle2 className="w-3 h-3" /> },
    claimed: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <XCircle className="w-3 h-3" /> },
    removed: { color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const c = config[status] ?? config.available;
  return (
    <Badge variant="outline" className={`${c.color} text-xs gap-1`}>
      {c.icon} {status.toUpperCase()}
    </Badge>
  );
}

// ==================== MAIN COMPONENT ====================

export default function SlabPackManager() {
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
  const [showCreatePack, setShowCreatePack] = useState(false);
  const [showEditPack, setShowEditPack] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showQuickPull, setShowQuickPull] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const utils = trpc.useUtils();
  const { data: packs, isLoading: packsLoading } = trpc.adminSlabPacks.packs.list.useQuery();
  const selectedPack = packs?.find(p => p.id === selectedPackId);
  const { data: cards, isLoading: cardsLoading } = trpc.adminSlabPacks.cards.list.useQuery(
    { slabPackId: selectedPackId! },
    { enabled: !!selectedPackId }
  );
  const { data: stats } = trpc.adminSlabPacks.packs.stats.useQuery(
    { id: selectedPackId! },
    { enabled: !!selectedPackId }
  );

  const createPack = trpc.adminSlabPacks.packs.create.useMutation({
    onSuccess: () => { utils.adminSlabPacks.packs.list.invalidate(); setShowCreatePack(false); toast.success("Pack created!"); },
    onError: (e) => toast.error(e.message),
  });
  const updatePack = trpc.adminSlabPacks.packs.update.useMutation({
    onSuccess: () => { utils.adminSlabPacks.packs.list.invalidate(); setShowEditPack(false); toast.success("Pack updated!"); },
    onError: (e) => toast.error(e.message),
  });
  const deletePack = trpc.adminSlabPacks.packs.delete.useMutation({
    onSuccess: () => { utils.adminSlabPacks.packs.list.invalidate(); setSelectedPackId(null); toast.success("Pack deleted!"); },
    onError: (e) => toast.error(e.message),
  });
  const createCard = trpc.adminSlabPacks.cards.create.useMutation({
    onSuccess: () => { utils.adminSlabPacks.cards.list.invalidate({ slabPackId: selectedPackId! }); utils.adminSlabPacks.packs.stats.invalidate({ id: selectedPackId! }); setShowAddCard(false); toast.success("Card added!"); },
    onError: (e) => toast.error(e.message),
  });
  const pullCard = trpc.adminSlabPacks.cards.pull.useMutation({
    onSuccess: () => { utils.adminSlabPacks.cards.list.invalidate({ slabPackId: selectedPackId! }); utils.adminSlabPacks.packs.stats.invalidate({ id: selectedPackId! }); toast.success("Card pulled!"); },
    onError: (e) => toast.error(e.message),
  });
  const removeCard = trpc.adminSlabPacks.cards.remove.useMutation({
    onSuccess: () => { utils.adminSlabPacks.cards.list.invalidate({ slabPackId: selectedPackId! }); utils.adminSlabPacks.packs.stats.invalidate({ id: selectedPackId! }); toast.success("Card removed from pool"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteCard = trpc.adminSlabPacks.cards.delete.useMutation({
    onSuccess: () => { utils.adminSlabPacks.cards.list.invalidate({ slabPackId: selectedPackId! }); utils.adminSlabPacks.packs.stats.invalidate({ id: selectedPackId! }); toast.success("Card deleted"); },
    onError: (e) => toast.error(e.message),
  });

  // Filtered cards
  const filteredCards = useMemo(() => {
    if (!cards) return [];
    return cards.filter(c => {
      if (tierFilter !== "all" && c.tier !== tierFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.cardName.toLowerCase().includes(q) ||
          (c.cardSet?.toLowerCase().includes(q)) ||
          (c.parallel?.toLowerCase().includes(q)) ||
          (c.gradingCompany?.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [cards, tierFilter, statusFilter, searchQuery]);

  // ---- PACK LIST VIEW ----
  if (!selectedPackId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Digital Slab Packs</h2>
            <p className="text-sm text-muted-foreground">Manage pack types and card pools (Arena Club-style)</p>
          </div>
          <Button onClick={() => setShowCreatePack(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Create Pack
          </Button>
        </div>

        {packsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !packs?.length ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Slab Packs Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first digital slab pack to get started</p>
              <Button onClick={() => setShowCreatePack(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Create Pack
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packs.map(pack => (
              <Card key={pack.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedPackId(pack.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pack.name}</CardTitle>
                    <Badge variant="outline" className={
                      pack.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      pack.status === "coming_soon" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                      pack.status === "soldout" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                      "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                    }>
                      {pack.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-bold">${(pack.priceCents / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier</span>
                      <Badge variant="outline" className="capitalize">{pack.tier}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Packs Sold</span>
                      <span>{pack.packsSold}{pack.totalPacks ? ` / ${pack.totalPacks}` : ""}</span>
                    </div>
                    {pack.launchDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Launch</span>
                        <span>{new Date(pack.launchDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Pack Dialog */}
        <Dialog open={showCreatePack} onOpenChange={setShowCreatePack}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Slab Pack</DialogTitle>
              <DialogDescription>Set up a new digital slab pack type</DialogDescription>
            </DialogHeader>
            <PackTypeForm onSubmit={(data) => createPack.mutate(data)} isLoading={createPack.isPending} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ---- PACK DETAIL VIEW (Card Management) ----
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setSelectedPackId(null)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{selectedPack?.name}</h2>
          <p className="text-sm text-muted-foreground">
            ${selectedPack ? (selectedPack.priceCents / 100).toFixed(2) : "0"} · {selectedPack?.tier} tier · {selectedPack?.status.replace("_", " ")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowQuickPull(true)} className="gap-2">
            <Hand className="w-4 h-4" /> Quick Pull
          </Button>
          <Button variant="outline" onClick={() => setShowEditPack(true)} className="gap-2">
            <Edit className="w-4 h-4" /> Edit Pack
          </Button>
          <Button variant="destructive" size="icon" onClick={() => {
            if (confirm("Delete this pack and all its cards?")) deletePack.mutate({ id: selectedPackId });
          }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Cards</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-green-400">{stats.available}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-red-400">{stats.claimed}</p>
              <p className="text-xs text-muted-foreground">Claimed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-zinc-400">{stats.removed}</p>
              <p className="text-xs text-muted-foreground">Removed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tier Breakdown */}
      {stats?.byTier && Object.keys(stats.byTier).length > 0 && (
        <div className="flex gap-4">
          {(["grail", "chase", "lineup"] as const).map(tier => {
            const t = stats.byTier[tier];
            if (!t) return null;
            return (
              <div key={tier} className="flex items-center gap-2 text-sm">
                <TierBadge tier={tier} />
                <span className="text-muted-foreground">{t.available}/{t.total} available</span>
              </div>
            );
          })}
        </div>
      )}

      <Separator />

      {/* Card Filters + Add */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            className="pl-9"
          />
        </div>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Tier" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="grail">Grail</SelectItem>
            <SelectItem value="chase">Chase</SelectItem>
            <SelectItem value="lineup">Lineup</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="claimed">Claimed</SelectItem>
            <SelectItem value="removed">Removed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowAddCard(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Card
        </Button>
      </div>

      {/* Card List */}
      {cardsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !filteredCards.length ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Cards Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add graded slabs to this pack's card pool</p>
            <Button onClick={() => setShowAddCard(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{filteredCards.length} card{filteredCards.length !== 1 ? "s" : ""}</p>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-card">
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Card</th>
                  <th className="text-left p-3 font-medium">Set / Parallel</th>
                  <th className="text-left p-3 font-medium">Grade</th>
                  <th className="text-left p-3 font-medium">Tier</th>
                  <th className="text-left p-3 font-medium">Value</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map(card => (
                  <tr key={card.id} className="border-b border-border/50 hover:bg-card/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {card.frontImageUrl ? (
                          <img src={card.frontImageUrl} alt={card.cardName} className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{card.cardName}</p>
                          {card.serialNumber && <p className="text-xs text-muted-foreground">#{card.serialNumber}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-xs">{card.cardSet || "—"}</p>
                      {card.parallel && <p className="text-xs text-muted-foreground">{card.parallel}</p>}
                    </td>
                    <td className="p-3">
                      {card.gradingCompany && card.grade ? (
                        <span className="font-mono text-xs">{card.gradingCompany} {card.grade}</span>
                      ) : "—"}
                    </td>
                    <td className="p-3"><TierBadge tier={card.tier} /></td>
                    <td className="p-3">
                      {card.estimatedValueCents ? `$${(card.estimatedValueCents / 100).toFixed(0)}` : "—"}
                    </td>
                    <td className="p-3"><StatusBadge status={card.status} /></td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {card.status === "available" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-xs"
                              onClick={() => {
                                if (confirm(`Pull "${card.cardName}" as in-person?`)) {
                                  pullCard.mutate({ cardId: card.id, method: "in_person", pulledBy: "In-Person" });
                                }
                              }}
                            >
                              <Hand className="w-3 h-3" /> Pull
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-xs text-amber-400"
                              onClick={() => {
                                if (confirm(`Remove "${card.cardName}" from pool?`)) {
                                  removeCard.mutate({ cardId: card.id });
                                }
                              }}
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            if (confirm(`Permanently delete "${card.cardName}"?`)) {
                              deleteCard.mutate({ id: card.id });
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Card to {selectedPack?.name}</DialogTitle>
            <DialogDescription>Add a graded slab to this pack's card pool</DialogDescription>
          </DialogHeader>
          <CardForm
            slabPackId={selectedPackId}
            onSubmit={(data) => createCard.mutate(data)}
            isLoading={createCard.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Pack Dialog */}
      <Dialog open={showEditPack} onOpenChange={setShowEditPack}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pack</DialogTitle>
          </DialogHeader>
          {selectedPack && (
            <PackTypeForm
              initialData={selectedPack}
              onSubmit={(data) => updatePack.mutate({ id: selectedPackId, ...data })}
              isLoading={updatePack.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Pull Dialog (mobile-friendly) */}
      <Dialog open={showQuickPull} onOpenChange={setShowQuickPull}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hand className="w-5 h-5" /> Quick Pull Mode
            </DialogTitle>
            <DialogDescription>Tap a card to mark it as pulled (in-person). Perfect for card shows.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-2">
            {cards?.filter(c => c.status === "available").map(card => (
              <button
                key={card.id}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                onClick={() => {
                  if (confirm(`Pull "${card.cardName}" (${card.gradingCompany} ${card.grade})?`)) {
                    pullCard.mutate({ cardId: card.id, method: "in_person", pulledBy: "In-Person" });
                  }
                }}
              >
                <TierBadge tier={card.tier} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{card.cardName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {card.cardSet} {card.parallel ? `· ${card.parallel}` : ""} {card.serialNumber ? `· #${card.serialNumber}` : ""}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {card.gradingCompany} {card.grade}
                </span>
                <Zap className="w-4 h-4 text-primary shrink-0" />
              </button>
            ))}
            {cards?.filter(c => c.status === "available").length === 0 && (
              <p className="text-center text-muted-foreground py-8">No available cards to pull</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
