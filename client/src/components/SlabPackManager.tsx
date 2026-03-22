/**
 * SlabPackManager - Admin component for managing Digital Slab Packs
 * Features: Create/edit packs, add cards, upload images, quick pull, test reveal
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus, Trash2, Package, Zap, ArrowLeft, Loader2,
  Upload, Eye, Crown, Star, Layers, Image as ImageIcon
} from "lucide-react";

type ViewMode = "list" | "detail" | "create";

const TIER_COLORS: Record<string, string> = {
  silver: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  gold: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  diamond: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  infinity: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const CARD_TIER_COLORS: Record<string, string> = {
  grail: "bg-red-500/20 text-red-300 border-red-500/30",
  chase: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  lineup: "bg-green-500/20 text-green-300 border-green-500/30",
};

const CARD_TIER_ICONS: Record<string, React.ReactNode> = {
  grail: <Crown className="w-3 h-3" />,
  chase: <Star className="w-3 h-3" />,
  lineup: <Layers className="w-3 h-3" />,
};

export default function SlabPackManager() {
  const [view, setView] = useState<ViewMode>("list");
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const utils = trpc.useUtils();

  const { data: packs, isLoading } = trpc.adminSlabPacks.list.useQuery();
  const { data: packDetail } = trpc.adminSlabPacks.get.useQuery(
    { id: selectedPackId! },
    { enabled: !!selectedPackId }
  );

  const createPack = trpc.adminSlabPacks.create.useMutation({
    onSuccess: () => { utils.adminSlabPacks.list.invalidate(); setView("list"); toast.success("Pack created!"); },
    onError: (e) => toast.error(e.message),
  });
  const deletePack = trpc.adminSlabPacks.delete.useMutation({
    onSuccess: () => { utils.adminSlabPacks.list.invalidate(); setView("list"); toast.success("Pack deleted"); },
    onError: (e) => toast.error(e.message),
  });
  const addCard = trpc.adminSlabPacks.addCard.useMutation({
    onSuccess: () => { utils.adminSlabPacks.get.invalidate({ id: selectedPackId! }); setShowAddCard(false); toast.success("Card added!"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteCard = trpc.adminSlabPacks.deleteCard.useMutation({
    onSuccess: () => { utils.adminSlabPacks.get.invalidate({ id: selectedPackId! }); toast.success("Card removed"); },
    onError: (e) => toast.error(e.message),
  });
  const quickPull = trpc.adminSlabPacks.quickPull.useMutation({
    onSuccess: () => { utils.adminSlabPacks.get.invalidate({ id: selectedPackId! }); toast.success("Card pulled!"); },
    onError: (e) => toast.error(e.message),
  });
  const uploadCardImage = trpc.adminSlabPacks.uploadCardImage.useMutation({
    onSuccess: () => { utils.adminSlabPacks.get.invalidate({ id: selectedPackId! }); toast.success("Image uploaded!"); },
    onError: (e) => toast.error(e.message),
  });
  const testReveal = trpc.slabPacks.testReveal.useMutation({
    onError: (e) => toast.error(e.message),
  });

  // Pack form uses the actual router field names
  const [packForm, setPackForm] = useState({
    name: "", slug: "", tier: "silver" as string, priceCents: 5000,
    description: "", slabsPerPack: 1, totalPacks: 100,
    status: "draft" as string, launchDate: "",
  });

  // Card form uses the actual router field names
  const [cardForm, setCardForm] = useState({
    cardName: "", cardSet: "", cardNumber: "", cardYear: "",
    parallel: "", gradingCompany: "BGS", grade: "", serialNumber: "",
    tier: "lineup" as string, estimatedValueCents: 0,
  });

  const resetPackForm = () => setPackForm({
    name: "", slug: "", tier: "silver", priceCents: 5000,
    description: "", slabsPerPack: 1, totalPacks: 100,
    status: "draft", launchDate: "",
  });

  const resetCardForm = () => setCardForm({
    cardName: "", cardSet: "", cardNumber: "", cardYear: "",
    parallel: "", gradingCompany: "BGS", grade: "", serialNumber: "",
    tier: "lineup", estimatedValueCents: 0,
  });

  const handleImageUpload = async (cardId: number, side: "front" | "back") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await uploadCardImage.mutateAsync({
          cardId, side, base64, filename: file.name, contentType: file.type,
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleTestReveal = async (packId: number) => {
    try {
      const result = await testReveal.mutateAsync({ packId });
      window.open(`/reveal/${result.orderId}`, "_blank");
    } catch {}
  };

  // ==================== LIST VIEW ====================
  if (view === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Digital Slab Packs</h2>
            <p className="text-muted-foreground text-sm">Manage pack types, cards, and checklists</p>
          </div>
          <Button onClick={() => { resetPackForm(); setView("create"); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Pack
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !packs?.length ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No Slab Packs Yet</p>
              <p className="text-muted-foreground mb-4">Create your first digital slab pack to get started</p>
              <Button onClick={() => { resetPackForm(); setView("create"); }}>
                <Plus className="w-4 h-4 mr-2" /> Create Pack
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {packs.map((pack) => (
              <Card key={pack.id} className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => { setSelectedPackId(pack.id); setView("detail"); }}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {pack.imageUrl ? (
                        <img src={pack.imageUrl} alt={pack.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{pack.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={TIER_COLORS[pack.tier]}>
                            {pack.tier.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={
                            pack.status === "active" ? "bg-green-500/20 text-green-300 border-green-500/30" :
                            pack.status === "draft" ? "bg-zinc-500/20 text-zinc-300 border-zinc-500/30" :
                            "bg-red-500/20 text-red-300 border-red-500/30"
                          }>
                            {pack.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ${(pack.priceCents / 100).toFixed(2)} · {pack.slabsPerPack} slab{pack.slabsPerPack > 1 ? "s" : ""}/pack
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{pack.packsSold}/{pack.totalPacks ?? "∞"} sold</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==================== CREATE VIEW ====================
  if (view === "create") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView("list")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-bold">Create Slab Pack</h2>
        </div>

        <Card>
          <CardContent className="py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pack Name</Label>
                <Input value={packForm.name} onChange={(e) => setPackForm(p => ({
                  ...p, name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                }))} placeholder="Silver Super Slab Pack" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={packForm.slug} onChange={(e) => setPackForm(p => ({ ...p, slug: e.target.value }))} placeholder="silver-super-slab-pack" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Tier</Label>
                <Select value={packForm.tier} onValueChange={(v) => setPackForm(p => ({ ...p, tier: v }))}>
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
                <Label>Price (cents)</Label>
                <Input type="number" value={packForm.priceCents} onChange={(e) => setPackForm(p => ({ ...p, priceCents: +e.target.value }))} />
              </div>
              <div>
                <Label>Slabs Per Pack</Label>
                <Input type="number" value={packForm.slabsPerPack} onChange={(e) => setPackForm(p => ({ ...p, slabsPerPack: +e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Packs</Label>
                <Input type="number" value={packForm.totalPacks} onChange={(e) => setPackForm(p => ({ ...p, totalPacks: +e.target.value }))} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={packForm.status} onValueChange={(v) => setPackForm(p => ({ ...p, status: v }))}>
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
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={packForm.description} onChange={(e) => setPackForm(p => ({ ...p, description: e.target.value }))} placeholder="Pack description..." />
            </div>

            <Button onClick={() => createPack.mutate({
              name: packForm.name, slug: packForm.slug,
              tier: packForm.tier as any, priceCents: packForm.priceCents,
              description: packForm.description || undefined,
              slabsPerPack: packForm.slabsPerPack, totalPacks: packForm.totalPacks,
              status: packForm.status as any,
              launchDate: packForm.launchDate ? new Date(packForm.launchDate).getTime() : undefined,
            })} disabled={createPack.isPending || !packForm.name || !packForm.slug}>
              {createPack.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Create Pack
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==================== DETAIL VIEW ====================
  const pack = packDetail?.pack;
  const cards = packDetail?.cards ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView("list")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-bold">{pack?.name ?? "Loading..."}</h2>
          {pack && (
            <Badge variant="outline" className={TIER_COLORS[pack.tier]}>
              {pack.tier.toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => pack && handleTestReveal(pack.id)}
            disabled={testReveal.isPending || cards.filter(c => c.status === "available").length === 0}>
            {testReveal.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Eye className="w-4 h-4 mr-1" />}
            Test Reveal
          </Button>
          <Button variant="destructive" size="sm" onClick={() => {
            if (confirm("Delete this pack and all its cards?")) deletePack.mutate({ id: selectedPackId! });
          }}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete Pack
          </Button>
        </div>
      </div>

      {pack && (
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="py-4 text-center">
            <p className="text-2xl font-bold">{cards.length}</p>
            <p className="text-xs text-muted-foreground">Total Cards</p>
          </CardContent></Card>
          <Card><CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-green-400">{cards.filter(c => c.status === "available").length}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent></Card>
          <Card><CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{cards.filter(c => c.status === "claimed").length}</p>
            <p className="text-xs text-muted-foreground">Claimed</p>
          </CardContent></Card>
          <Card><CardContent className="py-4 text-center">
            <p className="text-2xl font-bold">${(pack.priceCents / 100).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Price</p>
          </CardContent></Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Cards in Pack</h3>
        <Button size="sm" onClick={() => { resetCardForm(); setShowAddCard(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Card
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No cards yet. Add cards to this pack to build the checklist.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {cards.map((card) => (
            <Card key={card.id} className={card.status === "claimed" ? "opacity-60" : ""}>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {card.frontImageUrl ? (
                      <img src={card.frontImageUrl} alt={card.cardName} className="w-12 h-16 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-16 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{card.cardName}</p>
                      <p className="text-sm text-muted-foreground">
                        {card.cardSet || ''} {card.cardNumber ? `#${card.cardNumber}` : ""} {card.cardYear ? `(${card.cardYear})` : ""}
                        {card.parallel ? ` · ${card.parallel}` : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={CARD_TIER_COLORS[card.tier]}>
                          {CARD_TIER_ICONS[card.tier]} <span className="ml-1">{card.tier.toUpperCase()}</span>
                        </Badge>
                        {card.grade && (
                          <span className="text-xs text-muted-foreground">{card.gradingCompany || ''} {card.grade}</span>
                        )}
                        {card.estimatedValueCents && (
                          <span className="text-xs text-green-400">${(card.estimatedValueCents / 100).toFixed(2)}</span>
                        )}
                        {card.status === "claimed" && (
                          <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">CLAIMED</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleImageUpload(card.id, "front")} title="Upload front image">
                      <Upload className="w-4 h-4" />
                    </Button>
                    {card.status === "available" && (
                      <Button variant="ghost" size="sm" onClick={() => {
                        if (confirm(`Quick pull ${card.cardName}?`)) quickPull.mutate({ cardId: card.id });
                      }} title="Quick Pull (in-person)">
                        <Zap className="w-4 h-4 text-amber-400" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => {
                      if (confirm("Delete this card?")) deleteCard.mutate({ id: card.id });
                    }}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Card to Pack</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Card Name</Label>
                <Input value={cardForm.cardName} onChange={(e) => setCardForm(f => ({ ...f, cardName: e.target.value }))} placeholder="Spider-Man" />
              </div>
              <div>
                <Label>Card Set</Label>
                <Input value={cardForm.cardSet} onChange={(e) => setCardForm(f => ({ ...f, cardSet: e.target.value }))} placeholder="2024 Topps Chrome" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Card #</Label>
                <Input value={cardForm.cardNumber} onChange={(e) => setCardForm(f => ({ ...f, cardNumber: e.target.value }))} placeholder="42" />
              </div>
              <div>
                <Label>Year</Label>
                <Input value={cardForm.cardYear} onChange={(e) => setCardForm(f => ({ ...f, cardYear: e.target.value }))} placeholder="2024" />
              </div>
              <div>
                <Label>Parallel</Label>
                <Input value={cardForm.parallel} onChange={(e) => setCardForm(f => ({ ...f, parallel: e.target.value }))} placeholder="Refractor /99" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Grading Co.</Label>
                <Select value={cardForm.gradingCompany} onValueChange={(v) => setCardForm(f => ({ ...f, gradingCompany: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BGS">BGS</SelectItem>
                    <SelectItem value="PSA">PSA</SelectItem>
                    <SelectItem value="CGC">CGC</SelectItem>
                    <SelectItem value="SGC">SGC</SelectItem>
                    <SelectItem value="RAW">RAW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Grade</Label>
                <Input value={cardForm.grade} onChange={(e) => setCardForm(f => ({ ...f, grade: e.target.value }))} placeholder="9.5" />
              </div>
              <div>
                <Label>Serial #</Label>
                <Input value={cardForm.serialNumber} onChange={(e) => setCardForm(f => ({ ...f, serialNumber: e.target.value }))} placeholder="001751" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Rarity Tier</Label>
                <Select value={cardForm.tier} onValueChange={(v) => setCardForm(f => ({ ...f, tier: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grail">Grail (rarest)</SelectItem>
                    <SelectItem value="chase">Chase (uncommon)</SelectItem>
                    <SelectItem value="lineup">Lineup (common)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Est. Value (cents)</Label>
                <Input type="number" value={cardForm.estimatedValueCents} onChange={(e) => setCardForm(f => ({ ...f, estimatedValueCents: +e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCard(false)}>Cancel</Button>
            <Button onClick={() => addCard.mutate({
              slabPackId: selectedPackId!,
              cardName: cardForm.cardName,
              cardSet: cardForm.cardSet || undefined,
              cardNumber: cardForm.cardNumber || undefined,
              cardYear: cardForm.cardYear || undefined,
              parallel: cardForm.parallel || undefined,
              gradingCompany: cardForm.gradingCompany,
              grade: cardForm.grade || undefined,
              serialNumber: cardForm.serialNumber || undefined,
              tier: cardForm.tier as any,
              estimatedValueCents: cardForm.estimatedValueCents || undefined,
            })} disabled={addCard.isPending || !cardForm.cardName}>
              {addCard.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
