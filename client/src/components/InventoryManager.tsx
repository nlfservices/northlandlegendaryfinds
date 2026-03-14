/**
 * Inventory Manager - Admin component for managing card inventory
 * Features: Card set management, inventory CRUD, search/filter, CSV import/export
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit, Loader2, Search,
  Upload, Download, Database, DollarSign, Boxes, BarChart3,
  CheckCircle2, Archive, Package
} from "lucide-react";
import { useState, useMemo } from "react";
import CsvUploader from "@/components/CsvUploader";

// ==================== CARD SET MANAGER ====================

function CardSetManager() {
  const { data: cardSets, isLoading } = trpc.admin.cardSets.list.useQuery();
  const createSet = trpc.admin.cardSets.create.useMutation();
  const deleteSet = trpc.admin.cardSets.delete.useMutation();
  const updateSet = trpc.admin.cardSets.update.useMutation();
  const utils = trpc.useUtils();

  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", slug: "", year: "", manufacturer: "Topps",
    category: "marvel" as const, totalBaseCards: 0, notes: "",
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", year: "", manufacturer: "Topps", category: "marvel", totalBaseCards: 0, notes: "" });
    setEditingId(null);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateSet.mutateAsync({ id: editingId, data: { ...form, totalBaseCards: form.totalBaseCards || undefined, notes: form.notes || undefined } });
        toast.success("Card set updated");
      } else {
        await createSet.mutateAsync({ ...form, totalBaseCards: form.totalBaseCards || undefined, notes: form.notes || undefined });
        toast.success("Card set created");
      }
      utils.admin.cardSets.list.invalidate();
      setShowDialog(false);
      resetForm();
    } catch (e: any) {
      toast.error(e.message || "Failed to save card set");
    }
  };

  const handleEdit = (set: any) => {
    setForm({
      name: set.name, slug: set.slug, year: set.year || "",
      manufacturer: set.manufacturer || "Topps", category: set.category,
      totalBaseCards: set.totalBaseCards || 0, notes: set.notes || "",
    });
    setEditingId(set.id);
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this card set? Cards in inventory will remain but lose their set reference.")) return;
    try {
      await deleteSet.mutateAsync({ id });
      utils.admin.cardSets.list.invalidate();
      toast.success("Card set deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> Card Sets</CardTitle>
            <CardDescription>Manage your card set reference library (e.g., 2025 Topps Chrome, Marvel Sapphire)</CardDescription>
          </div>
          <Button onClick={() => { resetForm(); setShowDialog(true); }} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Set
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : !cardSets?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No card sets yet. Create your first set to start adding inventory.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {cardSets.map((set: any) => (
              <div key={set.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{set.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{set.manufacturer || "Unknown"}</span>
                      {set.year && <><span>·</span><span>{set.year}</span></>}
                      {set.totalBaseCards && <><span>·</span><span>{set.totalBaseCards} base cards</span></>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{set.category}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(set)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(set.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Card Set" : "New Card Set"}</DialogTitle>
            <DialogDescription>Define a card set to organize your inventory</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Set Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }))} placeholder="2025 Topps Chrome" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="2025-topps-chrome" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2025" />
              </div>
              <div className="space-y-2">
                <Label>Manufacturer</Label>
                <Input value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} placeholder="Topps" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marvel">Marvel</SelectItem>
                    <SelectItem value="starwars">Star Wars</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="pokemon">Pokemon</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Base Cards</Label>
                <Input type="number" value={form.totalBaseCards || ""} onChange={e => setForm(f => ({ ...f, totalBaseCards: parseInt(e.target.value) || 0 }))} placeholder="200" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this set..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.slug || createSet.isPending || updateSet.isPending}>
              {(createSet.isPending || updateSet.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ==================== INVENTORY STATS ====================

function InventoryStats() {
  const { data: stats, isLoading } = trpc.admin.inventory.stats.useQuery();

  if (isLoading) return <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!stats) return null;

  const statItems = [
    { label: "Total Cards", value: stats.totalCards, icon: Boxes, color: "text-blue-400" },
    { label: "In Stock", value: stats.inStock, icon: CheckCircle2, color: "text-green-400" },
    { label: "Allocated", value: stats.allocated, icon: Package, color: "text-yellow-400" },
    { label: "Pulled", value: stats.pulled, icon: BarChart3, color: "text-purple-400" },
    { label: "Total Value", value: `$${(stats.totalValue / 100).toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
    { label: "Total Cost", value: `$${(stats.totalCost / 100).toLocaleString()}`, icon: DollarSign, color: "text-orange-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map(item => (
        <Card key={item.label} className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <p className="text-xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ==================== INVENTORY CARD LIST ====================

function InventoryCardList() {
  const { data: cardSets } = trpc.admin.cardSets.list.useQuery();
  const { data: products } = trpc.admin.products.list.useQuery();
  const [filters, setFilters] = useState<{ cardSetId?: number; status?: string }>({});
  const { data: cards, isLoading } = trpc.admin.inventory.list.useQuery(filters);
  const createCard = trpc.admin.inventory.create.useMutation();
  const deleteCard = trpc.admin.inventory.delete.useMutation();
  const updateCard = trpc.admin.inventory.update.useMutation();
  const csvImport = trpc.admin.inventory.csvImport.useMutation();
  const utils = trpc.useUtils();

  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvSetId, setCsvSetId] = useState<number | null>(null);

  const [form, setForm] = useState({
    cardSetId: 0, cardName: "", cardNumber: "", parallel: "Base",
    serialNumber: "", condition: "raw" as const, gradingCompany: "",
    gradeValue: "", quantity: 1, purchasePriceCents: 0,
    estimatedValueCents: 0, source: "", notes: "",
  });

  const resetForm = () => {
    setForm({
      cardSetId: 0, cardName: "", cardNumber: "", parallel: "Base",
      serialNumber: "", condition: "raw", gradingCompany: "",
      gradeValue: "", quantity: 1, purchasePriceCents: 0,
      estimatedValueCents: 0, source: "", notes: "",
    });
    setEditingId(null);
  };

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    if (!searchQuery) return cards;
    const q = searchQuery.toLowerCase();
    return cards.filter((c: any) =>
      c.cardName.toLowerCase().includes(q) ||
      (c.parallel && c.parallel.toLowerCase().includes(q)) ||
      (c.cardNumber && c.cardNumber.toLowerCase().includes(q))
    );
  }, [cards, searchQuery]);

  const getSetName = (setId: number) => {
    return cardSets?.find((s: any) => s.id === setId)?.name || "Unknown Set";
  };

  const getProductName = (productId: number | null) => {
    if (!productId) return null;
    return products?.find((p: any) => p.id === productId)?.name || "Unknown Product";
  };

  const statusColors: Record<string, string> = {
    in_stock: "bg-green-500/20 text-green-400 border-green-500/30",
    allocated: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pulled: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    sold: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    traded: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    grading: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCard.mutateAsync({
          id: editingId,
          data: {
            ...form,
            cardNumber: form.cardNumber || undefined,
            parallel: form.parallel || undefined,
            serialNumber: form.serialNumber || undefined,
            gradingCompany: form.gradingCompany || undefined,
            gradeValue: form.gradeValue || undefined,
            purchasePriceCents: form.purchasePriceCents || undefined,
            estimatedValueCents: form.estimatedValueCents || undefined,
            source: form.source || undefined,
            notes: form.notes || undefined,
          },
        });
        toast.success("Card updated");
      } else {
        await createCard.mutateAsync({
          ...form,
          cardNumber: form.cardNumber || undefined,
          parallel: form.parallel || undefined,
          serialNumber: form.serialNumber || undefined,
          gradingCompany: form.gradingCompany || undefined,
          gradeValue: form.gradeValue || undefined,
          purchasePriceCents: form.purchasePriceCents || undefined,
          estimatedValueCents: form.estimatedValueCents || undefined,
          source: form.source || undefined,
          notes: form.notes || undefined,
        });
        toast.success("Card added to inventory");
      }
      utils.admin.inventory.list.invalidate();
      utils.admin.inventory.stats.invalidate();
      setShowDialog(false);
      resetForm();
    } catch (e: any) {
      toast.error(e.message || "Failed to save card");
    }
  };

  const handleEdit = (card: any) => {
    setForm({
      cardSetId: card.cardSetId,
      cardName: card.cardName,
      cardNumber: card.cardNumber || "",
      parallel: card.parallel || "Base",
      serialNumber: card.serialNumber || "",
      condition: card.condition || "raw",
      gradingCompany: card.gradingCompany || "",
      gradeValue: card.gradeValue || "",
      quantity: card.quantity || 1,
      purchasePriceCents: card.purchasePriceCents || 0,
      estimatedValueCents: card.estimatedValueCents || 0,
      source: card.source || "",
      notes: card.notes || "",
    });
    setEditingId(card.id);
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this card from inventory?")) return;
    try {
      await deleteCard.mutateAsync({ id });
      utils.admin.inventory.list.invalidate();
      utils.admin.inventory.stats.invalidate();
      toast.success("Card deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const handleCsvImport = async (rows: Record<string, string>[]): Promise<{ success: boolean; count?: number; errors?: string[] }> => {
    if (!csvSetId) {
      toast.error("Please select a card set first");
      return { success: false, errors: ["Please select a card set first"] };
    }
    try {
      const result = await csvImport.mutateAsync({ cardSetId: csvSetId, rows: rows as any });
      utils.admin.inventory.list.invalidate();
      utils.admin.inventory.stats.invalidate();
      toast.success(`Imported ${result.count} cards`);
      setShowCsvUpload(false);
      return { success: true, count: result.count };
    } catch (e: any) {
      toast.error(e.message || "Import failed");
      return { success: false, errors: [e.message || "Import failed"] };
    }
  };

  const downloadTemplate = () => {
    const csv = "cardName,cardNumber,parallel,serialNumber,condition,quantity,purchasePrice,estimatedValue,source,notes\nSpider-Man,1,Base,,raw,1,2.50,5.00,Box Break,\nIron Man,5,Gold Refractor,/50,raw,1,25.00,75.00,eBay,Numbered /50";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2"><Boxes className="w-5 h-5" /> Inventory Cards</CardTitle>
            <CardDescription>Your master card inventory — add, search, filter, and manage all cards</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-1" /> CSV Template
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowCsvUpload(!showCsvUpload)}>
              <Upload className="w-4 h-4 mr-1" /> Import CSV
            </Button>
            <Button size="sm" onClick={() => { resetForm(); setShowDialog(true); }}>
              <Plus className="w-4 h-4 mr-1" /> Add Card
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CSV Upload Section */}
        {showCsvUpload && (
          <Card className="border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <Label>Select Card Set for Import *</Label>
                <Select value={csvSetId?.toString() || ""} onValueChange={v => setCsvSetId(parseInt(v))}>
                  <SelectTrigger><SelectValue placeholder="Choose a card set..." /></SelectTrigger>
                  <SelectContent>
                    {cardSets?.map((s: any) => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {csvSetId && (
                <CsvUploader
                  onImport={handleCsvImport}
                  templateName="inventory_import"
                  columns={[
                    { key: "cardName", label: "Card Name", required: true },
                    { key: "cardNumber", label: "Card Number" },
                    { key: "parallel", label: "Parallel" },
                    { key: "serialNumber", label: "Serial Number" },
                    { key: "condition", label: "Condition" },
                    { key: "quantity", label: "Quantity" },
                    { key: "purchasePrice", label: "Purchase Price" },
                    { key: "estimatedValue", label: "Estimated Value" },
                    { key: "source", label: "Source" },
                    { key: "notes", label: "Notes" },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search cards by name, parallel, or number..."
              className="pl-9"
            />
          </div>
          <Select value={filters.cardSetId?.toString() || "all"} onValueChange={v => setFilters(f => ({ ...f, cardSetId: v === "all" ? undefined : parseInt(v) }))}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Sets" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sets</SelectItem>
              {cardSets?.map((s: any) => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.status || "all"} onValueChange={v => setFilters(f => ({ ...f, status: v === "all" ? undefined : v }))}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="allocated">Allocated</SelectItem>
              <SelectItem value="pulled">Pulled</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="grading">Grading</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Card Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredCards.length} card{filteredCards.length !== 1 ? "s" : ""}
        </div>

        {/* Card List */}
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : !filteredCards.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <Boxes className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No cards found. Add cards manually or import via CSV.</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {filteredCards.map((card: any) => (
                <div key={card.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate">{card.cardName}</p>
                        {card.parallel && card.parallel !== "Base" && (
                          <Badge variant="outline" className="text-xs">{card.parallel}</Badge>
                        )}
                        {card.serialNumber && (
                          <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/30">/{card.serialNumber}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        <span>{getSetName(card.cardSetId)}</span>
                        {card.cardNumber && <><span>·</span><span>#{card.cardNumber}</span></>}
                        {card.condition !== "raw" && <><span>·</span><span className="uppercase">{card.condition}</span></>}
                        {card.quantity > 1 && <><span>·</span><span>Qty: {card.quantity}</span></>}
                        {card.allocatedToProductId && (
                          <><span>·</span><span className="text-yellow-400">→ {getProductName(card.allocatedToProductId)}</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    {card.estimatedValueCents > 0 && (
                      <span className="text-sm font-medium text-emerald-400">${(card.estimatedValueCents / 100).toFixed(2)}</span>
                    )}
                    <Badge className={`text-xs ${statusColors[card.status] || ""}`}>
                      {card.status.replace("_", " ")}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(card)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(card.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Add/Edit Card Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Card" : "Add Card to Inventory"}</DialogTitle>
            <DialogDescription>Enter the card details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Card Set *</Label>
                <Select value={form.cardSetId?.toString() || ""} onValueChange={v => setForm(f => ({ ...f, cardSetId: parseInt(v) }))}>
                  <SelectTrigger><SelectValue placeholder="Select set..." /></SelectTrigger>
                  <SelectContent>
                    {cardSets?.map((s: any) => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Character/Player Name *</Label>
                <Input value={form.cardName} onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))} placeholder="Spider-Man" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input value={form.cardNumber} onChange={e => setForm(f => ({ ...f, cardNumber: e.target.value }))} placeholder="1" />
              </div>
              <div className="space-y-2">
                <Label>Parallel/Variant</Label>
                <Input value={form.parallel} onChange={e => setForm(f => ({ ...f, parallel: e.target.value }))} placeholder="Gold Refractor" />
              </div>
              <div className="space-y-2">
                <Label>Serial # (if numbered)</Label>
                <Input value={form.serialNumber} onChange={e => setForm(f => ({ ...f, serialNumber: e.target.value }))} placeholder="50" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={form.condition} onValueChange={v => setForm(f => ({ ...f, condition: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw">Raw (Ungraded)</SelectItem>
                    <SelectItem value="ags10">AGS 10</SelectItem>
                    <SelectItem value="ags9.5">AGS 9.5</SelectItem>
                    <SelectItem value="ags9">AGS 9</SelectItem>
                    <SelectItem value="cgc10">CGC 10</SelectItem>
                    <SelectItem value="cgc9.5">CGC 9.5</SelectItem>
                    <SelectItem value="cgc9">CGC 9</SelectItem>
                    <SelectItem value="psa10">PSA 10</SelectItem>
                    <SelectItem value="psa9">PSA 9</SelectItem>
                    <SelectItem value="psa8">PSA 8</SelectItem>
                    <SelectItem value="psa7">PSA 7</SelectItem>
                    <SelectItem value="bgs10">BGS 10</SelectItem>
                    <SelectItem value="bgs9.5">BGS 9.5</SelectItem>
                    <SelectItem value="bgs9">BGS 9</SelectItem>
                    <SelectItem value="sgc10">SGC 10</SelectItem>
                    <SelectItem value="sgc9.5">SGC 9.5</SelectItem>
                    <SelectItem value="sgc9">SGC 9</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))} min={1} />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="Box Break, eBay, etc." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Purchase Price ($)</Label>
                <Input type="number" step="0.01" value={(form.purchasePriceCents / 100) || ""} onChange={e => setForm(f => ({ ...f, purchasePriceCents: Math.round(parseFloat(e.target.value || "0") * 100) }))} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Estimated Value ($)</Label>
                <Input type="number" step="0.01" value={(form.estimatedValueCents / 100) || ""} onChange={e => setForm(f => ({ ...f, estimatedValueCents: Math.round(parseFloat(e.target.value || "0") * 100) }))} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.cardSetId || !form.cardName || createCard.isPending || updateCard.isPending}>
              {(createCard.isPending || updateCard.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? "Update" : "Add Card"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ==================== MAIN INVENTORY MANAGER ====================

export default function InventoryManager() {
  return (
    <div className="space-y-6">
      <InventoryStats />
      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <Boxes className="w-4 h-4" /> Cards
          </TabsTrigger>
          <TabsTrigger value="sets" className="flex items-center gap-2">
            <Database className="w-4 h-4" /> Card Sets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cards">
          <InventoryCardList />
        </TabsContent>
        <TabsContent value="sets">
          <CardSetManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
