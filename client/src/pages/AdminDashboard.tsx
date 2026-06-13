/**
 * Admin Dashboard - Manage products, checklists, pulls, and shows
 * Uses DashboardLayout with sidebar navigation
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import {
  Package, ListChecks, Zap, Radio, Plus, Trash2, Edit, Eye,
  CheckCircle2, Circle, ArrowLeft, Loader2, Calendar, ExternalLink,
  ShoppingBag, Truck, CreditCard, Boxes, Hammer, Download, BarChart3, FileSpreadsheet, Flame, Sparkles, Settings, Clock, Facebook, Key, Users
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import CsvUploader from "@/components/CsvUploader";
import InventoryManager from "@/components/InventoryManager";
import RepackBuilder from "@/components/RepackBuilder";
import EbayCompsPanel from "@/components/EbayCompsPanel";
import ChecklistSheet from "@/components/ChecklistSheet";
import ArticleManager from "@/components/ArticleManager";
import Top5Manager from "@/components/Top5Manager";
import BlogManager from "@/components/BlogManager";
import PageContentManager from "@/components/PageContentManager";
import SocialPostGenerator from "@/components/admin/SocialPostGenerator";
import SocialDraftsManager from "@/components/admin/SocialDraftsManager";
import GHLCommentManager from "@/components/admin/GHLCommentManager";
import TokenExpirationAlert from "@/components/admin/TokenExpirationAlert";
import FacebookBotManager from "@/components/admin/FacebookBotManager";
import AdminAffiliateLinks from "@/pages/AdminAffiliateLinks";
import ApiKeysManager from "@/components/admin/ApiKeysManager";
import UserPortal from "@/components/admin/UserPortal";

// ==================== SITE SETTINGS (COUNTDOWN TIMER) ====================

function SiteSettingsManager() {
  const utils = trpc.useUtils();
  const { data: countdownSetting, isLoading } = trpc.admin.siteSettings.get.useQuery({ key: "giveaway_countdown_target" });
  const updateMutation = trpc.admin.siteSettings.update.useMutation({
    onSuccess: () => {
      utils.admin.siteSettings.get.invalidate();
      utils.public.settings.get.invalidate();
      toast.success("Countdown timer updated!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update"),
  });

  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

  // Parse existing value into date/time inputs
  useEffect(() => {
    if (countdownSetting?.value) {
      const d = new Date(Number(countdownSetting.value));
      if (!isNaN(d.getTime())) {
        // Format to local date/time for the inputs
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        setDateStr(`${year}-${month}-${day}`);
        setTimeStr(`${hours}:${mins}`);
      }
    }
  }, [countdownSetting?.value]);

  const handleSave = () => {
    if (!dateStr || !timeStr) {
      toast.error("Please set both date and time");
      return;
    }
    // Parse as local time, store as UTC ms
    const target = new Date(`${dateStr}T${timeStr}:00`);
    if (isNaN(target.getTime())) {
      toast.error("Invalid date/time");
      return;
    }
    updateMutation.mutate({
      key: "giveaway_countdown_target",
      value: String(target.getTime()),
      label: "Giveaway Countdown Target (UTC ms)",
    });
  };

  const handleClear = () => {
    updateMutation.mutate({
      key: "giveaway_countdown_target",
      value: "",
      label: "Giveaway Countdown Target (UTC ms)",
    });
    setDateStr("");
    setTimeStr("");
  };

  const previewTarget = dateStr && timeStr ? new Date(`${dateStr}T${timeStr}:00`) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-400" />
          Giveaway Countdown Timer
        </CardTitle>
        <CardDescription>
          Set the date and time for the next stream. A live countdown will appear on the /giveaway page.
          Leave blank or clear to hide the countdown.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                />
              </div>
              <div>
                <Label>Time (your local time)</Label>
                <Input
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                />
              </div>
            </div>

            {previewTarget && !isNaN(previewTarget.getTime()) && (
              <p className="text-sm text-muted-foreground">
                Preview: <strong className="text-foreground">{previewTarget.toLocaleString()}</strong> (your local time)
              </p>
            )}

            {countdownSetting?.value && (
              <p className="text-sm text-green-400">
                Currently set to: {new Date(Number(countdownSetting.value)).toLocaleString()}
              </p>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Countdown
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={updateMutation.isPending}>
                Clear (Hide Timer)
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== PRODUCT MANAGEMENT ====================

function ProductManager() {
  const { data: products, isLoading } = trpc.admin.products.list.useQuery();
  const createProduct = trpc.admin.products.create.useMutation();
  const deleteProduct = trpc.admin.products.delete.useMutation();
  const updateProduct = trpc.admin.products.update.useMutation();
  const utils = trpc.useUtils();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: 0, totalPacks: 500,
    category: "marvel" as const, status: "draft" as const,
    isWhatnotExclusive: false, whatnotSeriesName: "", packsPerShow: 50,
    shopifyUrl: "", sortOrder: 0,
  });

  const resetForm = () => {
    setForm({
      name: "", slug: "", description: "", price: 0, totalPacks: 500,
      category: "marvel", status: "draft",
      isWhatnotExclusive: false, whatnotSeriesName: "", packsPerShow: 50,
      shopifyUrl: "", sortOrder: 0,
    });
  };

  const handleCreate = async () => {
    try {
      await createProduct.mutateAsync({
        ...form,
        price: form.price * 100, // convert to cents
        whatnotSeriesName: form.whatnotSeriesName || undefined,
        packsPerShow: form.isWhatnotExclusive ? form.packsPerShow : undefined,
        shopifyUrl: form.shopifyUrl || undefined,
      });
      toast.success("Product created!");
      utils.admin.products.list.invalidate();
      setShowCreateDialog(false);
      resetForm();
    } catch (e: any) {
      toast.error(e.message || "Failed to create product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product and all its checklist items?")) return;
    try {
      await deleteProduct.mutateAsync({ id });
      toast.success("Product deleted");
      utils.admin.products.list.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateProduct.mutateAsync({ id, data: { status: status as any } });
      toast.success("Status updated");
      utils.admin.products.list.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    }
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground text-sm">Manage your repack products</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2" /> New Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
              <DialogDescription>Add a new repack product</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) })); }} placeholder="NLF Variant Vol. 1" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="nlf-variant-vol-1" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price ($)</Label>
                  <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <Label>Total Packs</Label>
                  <Input type="number" value={form.totalPacks} onChange={e => setForm(f => ({ ...f, totalPacks: parseInt(e.target.value) || 500 }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="soldout">Sold Out</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Shopify Checkout URL</Label>
                <Input value={form.shopifyUrl} onChange={e => setForm(f => ({ ...f, shopifyUrl: e.target.value }))} placeholder="https://shop.example.com/..." />
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Switch checked={form.isWhatnotExclusive} onCheckedChange={v => setForm(f => ({ ...f, isWhatnotExclusive: v }))} />
                <Label>Whatnot Exclusive</Label>
              </div>
              {form.isWhatnotExclusive && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Series Name</Label>
                    <Input value={form.whatnotSeriesName} onChange={e => setForm(f => ({ ...f, whatnotSeriesName: e.target.value }))} placeholder="500 Pack Series" />
                  </div>
                  <div>
                    <Label>Packs Per Show</Label>
                    <Input type="number" value={form.packsPerShow} onChange={e => setForm(f => ({ ...f, packsPerShow: parseInt(e.target.value) || 50 }))} />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createProduct.isPending}>
                {createProduct.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {(!products || products.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No products yet. Create your first repack product!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map(product => (
            <Card key={product.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{product.name}</h3>
                        <Badge variant={product.status === 'active' ? 'default' : product.status === 'draft' ? 'secondary' : 'outline'}>
                          {product.status}
                        </Badge>
                        {product.isWhatnotExclusive && (
                          <Badge variant="outline" className="border-purple-500/50 text-purple-400">Whatnot</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {product.category} · {product.packsRemaining}/{product.totalPacks} packs remaining
                        {product.price ? ` · $${(product.price / 100).toFixed(2)}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={product.status} onValueChange={v => handleStatusChange(product.id, v)}>
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="soldout">Sold Out</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

// ==================== CHECKLIST SHEET WRAPPER ====================

function ChecklistSheetWrapper() {
  const { data: products, isLoading } = trpc.admin.products.list.useQuery();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Auto-select the first product when products load
  useEffect(() => {
    if (products && products.length > 0 && selectedProductId === null) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Checklist Sheet</h2>
          <p className="text-sm text-muted-foreground">Spreadsheet-style tool to add cards, mark pulled, and manage your checklist</p>
        </div>
        <Select
          value={selectedProductId?.toString() || ""}
          onValueChange={v => setSelectedProductId(parseInt(v))}
        >
          <SelectTrigger className="w-64"><SelectValue placeholder="Select a product..." /></SelectTrigger>
          <SelectContent>
            {products?.map(p => (
              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProductId ? (
        <ChecklistSheet productId={selectedProductId} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Select a product above to manage its checklist</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==================== CHECKLIST EDITOR ====================

function ChecklistEditor() {
  const { data: products, isLoading: productsLoading } = trpc.admin.products.list.useQuery();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { data: checklist, isLoading: checklistLoading } = trpc.admin.checklist.getByProduct.useQuery(
    { productId: selectedProductId! },
    { enabled: !!selectedProductId }
  );
  const createItem = trpc.admin.checklist.create.useMutation();
  const bulkCreate = trpc.admin.checklist.bulkCreate.useMutation();
  const deleteItem = trpc.admin.checklist.delete.useMutation();
  const updateItem = trpc.admin.checklist.update.useMutation();
  const csvImportChecklist = trpc.admin.checklist.csvImport.useMutation();
  const csvMarkPulled = trpc.admin.checklist.csvMarkPulled.useMutation();
  const utils = trpc.useUtils();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkTier, setBulkTier] = useState<"chase" | "hit" | "base" | "bonus">("base");
  const [itemForm, setItemForm] = useState({
    cardName: "", cardSet: "", cardYear: "", cardNumber: "",
    parallel: "", tier: "base" as const, estimatedValue: "",
  });

  const handleAddItem = async () => {
    if (!selectedProductId) return;
    try {
      await createItem.mutateAsync({
        productId: selectedProductId,
        ...itemForm,
        cardSet: itemForm.cardSet || undefined,
        cardYear: itemForm.cardYear || undefined,
        cardNumber: itemForm.cardNumber || undefined,
        parallel: itemForm.parallel || undefined,
        estimatedValue: itemForm.estimatedValue || undefined,
      });
      toast.success("Card added to checklist!");
      utils.admin.checklist.getByProduct.invalidate({ productId: selectedProductId });
      setShowAddDialog(false);
      setItemForm({ cardName: "", cardSet: "", cardYear: "", cardNumber: "", parallel: "", tier: "base", estimatedValue: "" });
    } catch (e: any) {
      toast.error(e.message || "Failed to add card");
    }
  };

  const handleBulkAdd = async () => {
    if (!selectedProductId || !bulkText.trim()) return;
    const lines = bulkText.trim().split('\n').filter(l => l.trim());
    const items = lines.map((line, index) => {
      // Format: CardName | Set | Year | Number | Parallel | Value
      const parts = line.split('|').map(p => p.trim());
      return {
        cardName: parts[0] || line.trim(),
        cardSet: parts[1] || undefined,
        cardYear: parts[2] || undefined,
        cardNumber: parts[3] || undefined,
        parallel: parts[4] || undefined,
        tier: bulkTier,
        estimatedValue: parts[5] || undefined,
        sortOrder: index,
      };
    });
    try {
      await bulkCreate.mutateAsync({ productId: selectedProductId, items });
      toast.success(`${items.length} cards added!`);
      utils.admin.checklist.getByProduct.invalidate({ productId: selectedProductId });
      setShowBulkDialog(false);
      setBulkText("");
    } catch (e: any) {
      toast.error(e.message || "Failed to bulk add");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!selectedProductId) return;
    try {
      await deleteItem.mutateAsync({ id });
      toast.success("Card removed");
      utils.admin.checklist.getByProduct.invalidate({ productId: selectedProductId });
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const tierColors: Record<string, string> = {
    chase: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    hit: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    base: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    bonus: "text-green-400 bg-green-500/10 border-green-500/30",
  };

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

  if (productsLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Checklist Editor</h2>
        <p className="text-muted-foreground text-sm">Add and manage cards in each product's checklist</p>
      </div>

      {/* Product Selector */}
      <div className="flex items-center gap-4">
        <Select value={selectedProductId?.toString() || ""} onValueChange={v => setSelectedProductId(parseInt(v))}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a product..." />
          </SelectTrigger>
          <SelectContent>
            {products?.map(p => (
              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedProductId && (
          <div className="flex gap-2">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Card</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Card to Checklist</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Card Name *</Label>
                    <Input value={itemForm.cardName} onChange={e => setItemForm(f => ({ ...f, cardName: e.target.value }))} placeholder="Spider-Man" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Set</Label>
                      <Input value={itemForm.cardSet} onChange={e => setItemForm(f => ({ ...f, cardSet: e.target.value }))} placeholder="2024 Topps Chrome" />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input value={itemForm.cardYear} onChange={e => setItemForm(f => ({ ...f, cardYear: e.target.value }))} placeholder="2024" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Card Number</Label>
                      <Input value={itemForm.cardNumber} onChange={e => setItemForm(f => ({ ...f, cardNumber: e.target.value }))} placeholder="#42" />
                    </div>
                    <div>
                      <Label>Parallel</Label>
                      <Input value={itemForm.parallel} onChange={e => setItemForm(f => ({ ...f, parallel: e.target.value }))} placeholder="Gold Refractor /50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Tier</Label>
                      <Select value={itemForm.tier} onValueChange={v => setItemForm(f => ({ ...f, tier: v as any }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chase">Chase (Top Tier)</SelectItem>
                          <SelectItem value="hit">Hit</SelectItem>
                          <SelectItem value="base">Base</SelectItem>
                          <SelectItem value="bonus">Bonus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Est. Value</Label>
                      <Input value={itemForm.estimatedValue} onChange={e => setItemForm(f => ({ ...f, estimatedValue: e.target.value }))} placeholder="$50-$100" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button onClick={handleAddItem} disabled={!itemForm.cardName || createItem.isPending}>Add Card</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><ListChecks className="w-4 h-4 mr-1" /> Bulk Add</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Bulk Add Cards</DialogTitle>
                  <DialogDescription>
                    One card per line. Format: CardName | Set | Year | Number | Parallel | Value
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Tier for all cards</Label>
                    <Select value={bulkTier} onValueChange={v => setBulkTier(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chase">Chase</SelectItem>
                        <SelectItem value="hit">Hit</SelectItem>
                        <SelectItem value="base">Base</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={bulkText}
                    onChange={e => setBulkText(e.target.value)}
                    placeholder={`Spider-Man | 2024 Topps Chrome | 2024 | #1 | Gold /50 | $100-$200\nIron Man | 2024 Topps Chrome | 2024 | #2 | Base | $5-$10`}
                    rows={10}
                  />
                  <p className="text-xs text-muted-foreground">{bulkText.trim().split('\n').filter(l => l.trim()).length} cards to add</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowBulkDialog(false)}>Cancel</Button>
                  <Button onClick={handleBulkAdd} disabled={!bulkText.trim() || bulkCreate.isPending}>
                    {bulkCreate.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Add All Cards
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Checklist Display */}
      {selectedProductId && checklistLoading && (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      )}

      {selectedProductId && !checklistLoading && checklist && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{checklist.length} total cards</span>
            <span>{checklist.filter(c => c.isPulled).length} pulled</span>
            <span>{checklist.filter(c => !c.isPulled).length} remaining</span>
          </div>

          {tierOrder.map(tier => {
            const items = grouped[tier];
            if (!items || items.length === 0) return null;
            return (
              <div key={tier}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={tierColors[tier]}>{tier.toUpperCase()}</Badge>
                  <span className="text-sm text-muted-foreground">({items.length} cards)</span>
                </div>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${item.isPulled ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border'}`}>
                      <div className="flex items-center gap-3">
                        {item.isPulled ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">
                            {item.cardName}
                            {item.parallel && <span className="text-primary ml-2 text-sm">({item.parallel})</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {[item.cardSet, item.cardYear, item.cardNumber].filter(Boolean).join(' · ')}
                            {item.estimatedValue && <span className="text-green-400 ml-2">{item.estimatedValue}</span>}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProductId && !checklistLoading && checklist?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ListChecks className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No cards in this checklist yet. Add cards individually, use bulk add, or upload a CSV!</p>
          </CardContent>
        </Card>
      )}

      {/* CSV Upload Section */}
      {selectedProductId && (
        <Separator className="my-6" />
      )}
      {selectedProductId && (
        <CsvUploader
          title="CSV Checklist Import"
          description="Upload a CSV file to bulk-add cards. Includes image URL and price columns. Use tier values: Top Hits, Middle of Pack, Low Floor, or Bonus."
          templateName="nlf-checklist-template"
          columns={[
            { key: "cardName", label: "Card Name", required: true },
            { key: "cardSet", label: "Set" },
            { key: "cardYear", label: "Year" },
            { key: "cardNumber", label: "Card Number" },
            { key: "parallel", label: "Parallel / Variant" },
            { key: "tier", label: "Tier" },
            { key: "estimatedValue", label: "Estimated Value" },
            { key: "imageUrl", label: "Image URL" },
          ]}
          onImport={async (rows) => {
            try {
              const res = await csvImportChecklist.mutateAsync({
                productId: selectedProductId,
                rows: rows.map(r => ({
                  cardName: r.cardName || "",
                  cardSet: r.cardSet,
                  cardYear: r.cardYear,
                  cardNumber: r.cardNumber,
                  parallel: r.parallel,
                  tier: r.tier,
                  estimatedValue: r.estimatedValue,
                  imageUrl: r.imageUrl,
                })),
              });
              utils.admin.checklist.getByProduct.invalidate({ productId: selectedProductId });
              return { success: true, count: res.count };
            } catch (e: any) {
              return { success: false, errors: [e.message || "Import failed"] };
            }
          }}
        />
      )}

      {/* Mark as Pulled CSV Upload */}
      {selectedProductId && checklist && checklist.length > 0 && (
        <>
          <Separator className="my-6" />
          <CsvUploader
            title="Mark Cards as Pulled (CSV)"
            description='Upload a CSV with a "Pulled" column (YES/NO). Cards marked YES will be flagged as pulled and removed from the active checklist. Match is by Card Name + Parallel.'
            templateName="nlf-mark-pulled-template"
            columns={[
              { key: "cardName", label: "Card Name", required: true },
              { key: "cardNumber", label: "Card Number" },
              { key: "parallel", label: "Parallel / Variant" },
              { key: "pulled", label: "Pulled", required: true },
            ]}
            onImport={async (rows) => {
              try {
                const res = await csvMarkPulled.mutateAsync({
                  productId: selectedProductId,
                  rows: rows.map(r => ({
                    cardName: r.cardName || "",
                    cardNumber: r.cardNumber,
                    parallel: r.parallel,
                    pulled: r.pulled,
                  })),
                });
                utils.admin.checklist.getByProduct.invalidate({ productId: selectedProductId });
                const msgs: string[] = [`${res.markedCount} cards marked as pulled`];
                if (res.totalNotFound > 0) {
                  msgs.push(`${res.totalNotFound} cards not found: ${res.notFound.join(", ")}`);
                }
                return { success: true, count: res.markedCount, errors: res.totalNotFound > 0 ? [`${res.totalNotFound} card(s) not found in checklist`] : undefined };
              } catch (e: any) {
                return { success: false, errors: [e.message || "Import failed"] };
              }
            }}
          />
        </>
      )}

      {/* Export Checklist Button */}
      {selectedProductId && checklist && checklist.length > 0 && (
        <>
          <Separator className="my-6" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Export Checklist</h3>
              <p className="text-sm text-muted-foreground">Download the current checklist as a CSV file. Edit it and re-upload to mark cards as pulled.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!checklist) return;
                const headers = ["Card Name", "Set", "Year", "Card Number", "Parallel / Variant", "Tier", "Estimated Value", "Image URL", "Pulled"];
                const rows = checklist.map(item => [
                  item.cardName,
                  item.cardSet || "",
                  item.cardYear || "",
                  item.cardNumber || "",
                  item.parallel || "",
                  item.tier,
                  item.estimatedValue || "",
                  item.imageUrl || "",
                  item.isPulled ? "YES" : "NO",
                ]);
                const csvContent = [headers, ...rows].map(row => row.map(cell => `"${(cell || "").replace(/"/g, '""')}"`).join(",")).join("\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `checklist-export-${selectedProductId}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== PULL LOGGER ====================

function PullLogger() {
  const { data: products } = trpc.admin.products.list.useQuery();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);

  const { data: checklist } = trpc.admin.checklist.getByProduct.useQuery(
    { productId: selectedProductId! },
    { enabled: !!selectedProductId }
  );
  const { data: productShows } = trpc.admin.shows.getByProduct.useQuery(
    { productId: selectedProductId! },
    { enabled: !!selectedProductId }
  );
  const { data: productPulls } = trpc.admin.pulls.getByProduct.useQuery(
    { productId: selectedProductId! },
    { enabled: !!selectedProductId }
  );

  const createPull = trpc.admin.pulls.create.useMutation();
  const deletePull = trpc.admin.pulls.delete.useMutation();
  const csvImportPulls = trpc.admin.pulls.csvImport.useMutation();
  const utils = trpc.useUtils();

  const [pullForm, setPullForm] = useState({
    packNumber: 1, pulledBy: "", notes: "",
  });

  const unpulledItems = useMemo(() => {
    return checklist?.filter(item => !item.isPulled) || [];
  }, [checklist]);

  const handleLogPull = async (checklistItemId: number) => {
    if (!selectedProductId) return;
    try {
      await createPull.mutateAsync({
        checklistItemId,
        productId: selectedProductId,
        showId: selectedShowId || undefined,
        packNumber: pullForm.packNumber || undefined,
        pulledBy: pullForm.pulledBy || undefined,
        notes: pullForm.notes || undefined,
      });
      toast.success("Pull logged!");
      setPullForm(f => ({ ...f, packNumber: f.packNumber + 1, notes: "" }));
      utils.admin.checklist.getByProduct.invalidate({ productId: selectedProductId });
      utils.admin.pulls.getByProduct.invalidate({ productId: selectedProductId });
    } catch (e: any) {
      toast.error(e.message || "Failed to log pull");
    }
  };

  const handleUndoPull = async (pullId: number) => {
    if (!selectedProductId) return;
    try {
      await deletePull.mutateAsync({ id: pullId });
      toast.success("Pull undone");
      utils.admin.checklist.getByProduct.invalidate({ productId: selectedProductId });
      utils.admin.pulls.getByProduct.invalidate({ productId: selectedProductId });
    } catch (e: any) {
      toast.error(e.message || "Failed to undo pull");
    }
  };

  const tierColors: Record<string, string> = {
    chase: "border-l-amber-400",
    hit: "border-l-purple-400",
    base: "border-l-blue-400",
    bonus: "border-l-green-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" /> Pull Logger
        </h2>
        <p className="text-muted-foreground text-sm">Log pulls during live shows — quick and easy</p>
      </div>

      {/* Product & Show Selector */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedProductId?.toString() || ""} onValueChange={v => { setSelectedProductId(parseInt(v)); setSelectedShowId(null); }}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select product..." />
          </SelectTrigger>
          <SelectContent>
            {products?.map(p => (
              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedProductId && productShows && productShows.length > 0 && (
          <Select value={selectedShowId?.toString() || "none"} onValueChange={v => setSelectedShowId(v === "none" ? null : parseInt(v))}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select show (optional)..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No show (website sale)</SelectItem>
              {productShows.map(s => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedProductId && (
        <>
          {/* Quick Entry Fields */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <Label className="text-xs">Pack #</Label>
                  <Input type="number" className="w-24" value={pullForm.packNumber} onChange={e => setPullForm(f => ({ ...f, packNumber: parseInt(e.target.value) || 1 }))} />
                </div>
                <div>
                  <Label className="text-xs">Pulled By</Label>
                  <Input className="w-40" value={pullForm.pulledBy} onChange={e => setPullForm(f => ({ ...f, pulledBy: e.target.value }))} placeholder="Customer name" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <Label className="text-xs">Notes</Label>
                  <Input value={pullForm.notes} onChange={e => setPullForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Cards to Pull */}
          <div>
            <h3 className="font-bold mb-3">Available Cards ({unpulledItems.length} remaining)</h3>
            <div className="grid gap-2">
              {unpulledItems.map(item => (
                <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border border-l-4 ${tierColors[item.tier]} bg-card hover:bg-accent/50 transition-colors`}>
                  <div>
                    <div className="font-medium">
                      {item.cardName}
                      {item.parallel && <span className="text-primary ml-2 text-sm">({item.parallel})</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {[item.cardSet, item.cardYear, item.cardNumber].filter(Boolean).join(' · ')}
                      {item.estimatedValue && <span className="text-green-400 ml-2">{item.estimatedValue}</span>}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleLogPull(item.id)} disabled={createPull.isPending}>
                    <Zap className="w-4 h-4 mr-1" /> Log Pull
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Pulls */}
          {productPulls && productPulls.length > 0 && (
            <div>
              <h3 className="font-bold mb-3">Recent Pulls ({productPulls.length})</h3>
              <div className="space-y-2">
                {productPulls.slice(0, 20).map(pull => (
                  <div key={pull.id} className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div>
                      <div className="text-sm">
                        Pack #{pull.packNumber || '?'}
                        {pull.pulledBy && <span className="text-muted-foreground"> — {pull.pulledBy}</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(pull.pulledAt).toLocaleString()}
                        {pull.notes && <span className="ml-2">· {pull.notes}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleUndoPull(pull.id)}>
                      Undo
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* CSV Pull Import */}
          <Separator className="my-6" />
          <CsvUploader
            title="CSV Pull Import"
            description="Upload a CSV of pulls to log them in bulk. Card names must match checklist items exactly."
            templateName="nlf-pulls-template"
            columns={[
              { key: "cardName", label: "Card Name", required: true },
              { key: "packNumber", label: "Pack Number" },
              { key: "pulledBy", label: "Pulled By" },
              { key: "notes", label: "Notes" },
            ]}
            onImport={async (rows) => {
              try {
                const res = await csvImportPulls.mutateAsync({
                  productId: selectedProductId,
                  showId: selectedShowId || undefined,
                  rows: rows.map(r => ({
                    cardName: r.cardName || "",
                    packNumber: r.packNumber ? parseInt(r.packNumber) : undefined,
                    pulledBy: r.pulledBy,
                    notes: r.notes,
                  })),
                });
                utils.admin.checklist.getByProduct.invalidate({ productId: selectedProductId });
                utils.admin.pulls.getByProduct.invalidate({ productId: selectedProductId });
                const errors: string[] = [];
                if (res.unmatched > 0) {
                  errors.push(`${res.unmatched} cards could not be matched: ${res.unmatchedCards.join(", ")}`);
                }
                return { success: true, count: res.matched, errors: errors.length > 0 ? errors : undefined };
              } catch (e: any) {
                return { success: false, errors: [e.message || "Import failed"] };
              }
            }}
          />
        </>
      )}
    </div>
  );
}

// ==================== SHOW MANAGER ====================

function ShowManager() {
  const { data: products } = trpc.admin.products.list.useQuery();
  const { data: allShows, isLoading } = trpc.admin.shows.list.useQuery();
  const createShow = trpc.admin.shows.create.useMutation();
  const updateShow = trpc.admin.shows.update.useMutation();
  const deleteShow = trpc.admin.shows.delete.useMutation();
  const utils = trpc.useUtils();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [form, setForm] = useState({
    title: "", productId: 0, showDate: "", whatnotUrl: "",
    startingPackNumber: 1, notes: "",
  });

  const handleCreate = async () => {
    if (!form.productId || !form.title || !form.showDate) {
      toast.error("Please fill in title, product, and date");
      return;
    }
    try {
      await createShow.mutateAsync({
        title: form.title,
        productId: form.productId,
        showDate: new Date(form.showDate).getTime(),
        whatnotUrl: form.whatnotUrl || undefined,
        startingPackNumber: form.startingPackNumber || undefined,
        notes: form.notes || undefined,
      });
      toast.success("Show scheduled!");
      utils.admin.shows.list.invalidate();
      setShowCreateDialog(false);
      setForm({ title: "", productId: 0, showDate: "", whatnotUrl: "", startingPackNumber: 1, notes: "" });
    } catch (e: any) {
      toast.error(e.message || "Failed to create show");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateShow.mutateAsync({ id, data: { status: status as any } });
      toast.success("Show status updated");
      utils.admin.shows.list.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this show?")) return;
    try {
      await deleteShow.mutateAsync({ id });
      toast.success("Show deleted");
      utils.admin.shows.list.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    live: "bg-red-500/10 text-red-400 border-red-500/30",
    completed: "bg-green-500/10 text-green-400 border-green-500/30",
    cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-400" /> Whatnot Shows
          </h2>
          <p className="text-muted-foreground text-sm">Schedule and manage live stream shows</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Schedule Show</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a Show</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="NLF Variant Vol. 1 - Show #1" />
              </div>
              <div>
                <Label>Product</Label>
                <Select value={form.productId?.toString() || ""} onValueChange={v => setForm(f => ({ ...f, productId: parseInt(v) }))}>
                  <SelectTrigger><SelectValue placeholder="Select product..." /></SelectTrigger>
                  <SelectContent>
                    {products?.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date & Time</Label>
                <Input type="datetime-local" value={form.showDate} onChange={e => setForm(f => ({ ...f, showDate: e.target.value }))} />
              </div>
              <div>
                <Label>Whatnot URL</Label>
                <Input value={form.whatnotUrl} onChange={e => setForm(f => ({ ...f, whatnotUrl: e.target.value }))} placeholder="https://whatnot.com/live/..." />
              </div>
              <div>
                <Label>Starting Pack #</Label>
                <Input type="number" value={form.startingPackNumber} onChange={e => setForm(f => ({ ...f, startingPackNumber: parseInt(e.target.value) || 1 }))} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createShow.isPending}>Schedule Show</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {(!allShows || allShows.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No shows scheduled yet. Create your first Whatnot show!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allShows.map(show => (
            <Card key={show.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <Radio className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{show.title}</h3>
                        <Badge className={statusColors[show.status]}>{show.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Number(show.showDate)).toLocaleString()} · {show.packsOpened} packs opened
                        {show.whatnotUrl && (
                          <a href={show.whatnotUrl} target="_blank" rel="noopener noreferrer" className="text-primary ml-2 inline-flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Whatnot
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={show.status} onValueChange={v => handleStatusChange(show.id, v)}>
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(show.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

// ==================== ORDER MANAGER ====================

function OrderManager() {
  const { data: allOrders, isLoading } = trpc.checkout.allOrders.useQuery();
  const updateStatus = trpc.checkout.updateOrderStatus.useMutation();
  const utils = trpc.useUtils();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await updateStatus.mutateAsync({
        orderId,
        status: status as any,
        trackingNumber: trackingInput || undefined,
        notes: notesInput || undefined,
      });
      toast.success(`Order #${orderId} updated to ${status}`);
      utils.checkout.allOrders.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to update order");
    }
  };

  const handleShip = async (orderId: number) => {
    if (!trackingInput.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    try {
      await updateStatus.mutateAsync({
        orderId,
        status: "shipped",
        trackingNumber: trackingInput,
        notes: notesInput || undefined,
      });
      toast.success(`Order #${orderId} marked as shipped!`);
      utils.checkout.allOrders.invalidate();
      setTrackingInput("");
      setNotesInput("");
      setExpandedOrder(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to update order");
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    paid: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    shipped: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    delivered: "bg-green-500/10 text-green-400 border-green-500/30",
    cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    refunded: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <CreditCard className="w-5 h-5 text-yellow-400" />,
    paid: <CreditCard className="w-5 h-5 text-blue-400" />,
    shipped: <Truck className="w-5 h-5 text-purple-400" />,
    delivered: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    cancelled: <Circle className="w-5 h-5 text-gray-400" />,
    refunded: <Circle className="w-5 h-5 text-red-400" />,
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  // Stats
  const totalOrders = allOrders?.length || 0;
  const paidOrders = allOrders?.filter(o => ["paid", "shipped", "delivered"].includes(o.status)) || [];
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amountCents, 0);
  const pendingShipment = allOrders?.filter(o => o.status === "paid").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" /> Orders
        </h2>
        <p className="text-muted-foreground text-sm">Manage customer orders and fulfillment</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalOrders}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-green-400">${(totalRevenue / 100).toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{pendingShipment}</div>
            <div className="text-xs text-muted-foreground">Needs Shipping</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{allOrders?.filter(o => o.status === "shipped").length || 0}</div>
            <div className="text-xs text-muted-foreground">In Transit</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {(!allOrders || allOrders.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders yet. Orders will appear here when customers make purchases.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allOrders.map(order => (
            <Card key={order.id} className={expandedOrder === order.id ? "border-primary/50" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                      {statusIcons[order.status]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Order #{order.id}</span>
                        <Badge className={statusColors[order.status]}>{order.status.toUpperCase()}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerName || order.customerEmail || "Guest"} · 
                        ${(order.amountCents / 100).toFixed(2)} · 
                        {order.quantity} pack{order.quantity > 1 ? "s" : ""} · 
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status === "paid" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                        onClick={() => {
                          setExpandedOrder(expandedOrder === order.id ? null : order.id);
                          setTrackingInput(order.trackingNumber || "");
                          setNotesInput(order.notes || "");
                        }}
                      >
                        <Truck className="w-4 h-4 mr-1" /> Ship
                      </Button>
                    )}
                    <Select
                      value={order.status}
                      onValueChange={v => handleStatusChange(order.id, v)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Expanded shipping form */}
                {expandedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Customer Email</Label>
                        <p className="text-sm text-muted-foreground">{order.customerEmail || "N/A"}</p>
                      </div>
                      <div>
                        <Label>Shipping Address</Label>
                        <p className="text-sm text-muted-foreground">
                          {order.shippingAddress ? (
                            typeof order.shippingAddress === "object" ? (
                              Object.values(order.shippingAddress as Record<string, string>).filter(Boolean).join(", ")
                            ) : String(order.shippingAddress)
                          ) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label>Tracking Number</Label>
                      <Input
                        value={trackingInput}
                        onChange={e => setTrackingInput(e.target.value)}
                        placeholder="Enter USPS/UPS/FedEx tracking number..."
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={notesInput}
                        onChange={e => setNotesInput(e.target.value)}
                        placeholder="Optional fulfillment notes..."
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleShip(order.id)} disabled={updateStatus.isPending}>
                        <Truck className="w-4 h-4 mr-2" /> Mark as Shipped
                      </Button>
                      <Button variant="outline" onClick={() => setExpandedOrder(null)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {/* Show tracking if already shipped */}
                {order.trackingNumber && order.status !== "paid" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-purple-400" />
                      <span className="text-muted-foreground">Tracking:</span>
                      <span className="font-mono text-primary">{order.trackingNumber}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== SIDEBAR NAV CONFIG ====================
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "overview", label: "Dashboard", icon: BarChart3 },
    ],
  },
  {
    label: "Commerce",
    items: [
      { id: "products", label: "Products", icon: Package },
      { id: "orders", label: "Orders", icon: ShoppingBag },
      { id: "inventory", label: "Inventory", icon: Boxes },
      { id: "repack-builder", label: "Repack Builder", icon: Hammer },
    ],
  },
  {
    label: "Events",
    items: [
      { id: "shows", label: "Shows", icon: Radio },
      { id: "pulls", label: "Pull Logger", icon: Zap },
      { id: "checklist-sheet", label: "Checklist Sheet", icon: FileSpreadsheet },
      { id: "checklists", label: "Checklists", icon: ListChecks },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "articles", label: "MCU News", icon: Sparkles },
      { id: "blog", label: "The Collector", icon: Flame },
      { id: "top5", label: "Top 5", icon: BarChart3 },
      { id: "ebay-comps", label: "eBay Comps", icon: CreditCard },
      { id: "pages", label: "Pages", icon: FileSpreadsheet },
    ],
  },
  {
    label: "Social",
    items: [
      { id: "social", label: "Social Posts", icon: Facebook },
    ],
  },
  {
    label: "System",
    items: [
      { id: "users", label: "User Portal", icon: Users },
      { id: "affiliates", label: "Affiliates", icon: ExternalLink },
      { id: "api-keys", label: "API Keys", icon: Key },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

// ==================== OVERVIEW PANEL ====================
function OverviewPanel({ user }: { user: { name?: string | null; email?: string | null } }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickLinks = [
    { label: "View Site", href: "/", icon: ExternalLink, color: "text-primary" },
    { label: "MCU News", href: "/mcu-news", icon: Sparkles, color: "text-yellow-400" },
    { label: "Card Database", href: "/cards", icon: Package, color: "text-blue-400" },
    { label: "API Docs", href: "/api-docs", icon: Key, color: "text-green-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative">
          <p className="text-muted-foreground text-sm font-medium mb-1">{greeting},</p>
          <h2 className="text-3xl font-bold mb-2">{user.name || "Admin"} 👋</h2>
          <p className="text-muted-foreground">Welcome to the NLF Command Center. Everything you need to run the site is in the sidebar.</p>
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                <link.icon className={`w-5 h-5 ${link.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium">{link.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Section Cards */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">All Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_GROUPS.filter(g => g.label !== "Overview").map((group) => (
            <div key={group.label} className="rounded-xl bg-card border border-border p-5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-colors text-left"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN ADMIN DASHBOARD ====================
export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading command center...</p>
        </div>
      </div>
    );
  }

  const ALLOWED_ADMIN_ROLES = ['owner', 'super_admin', 'admin'];
  if (!user || !ALLOWED_ADMIN_ROLES.includes(user.role)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 border-border">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in as an admin to access this page.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/">
                <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Site</Button>
              </Link>
              <a href={getLoginUrl()}>
                <Button>Log In</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeGroup = NAV_GROUPS.find(g => g.items.some(i => i.id === activeSection));
  const activeItem = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === activeSection);
  const ActiveIcon = activeItem?.icon ?? BarChart3;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground flex flex-col">
      {/* ===== TOP HEADER BAR ===== */}
      <header className="h-14 border-b border-white/[0.06] bg-[#0d0d14]/80 backdrop-blur-xl sticky top-0 z-50 flex items-center px-4 gap-4">
        {/* Left: Logo + collapse toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(c => !c)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">N</span>
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:block">NLF Command Center</span>
          </div>
        </div>

        {/* Center: Breadcrumb */}
        <div className="flex-1 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground hidden md:block">{activeGroup?.label}</span>
          {activeGroup && <span className="text-muted-foreground hidden md:block">/</span>}
          <span className="font-medium">{activeItem?.label ?? "Dashboard"}</span>
        </div>

        {/* Right: Token alert + user */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <TokenExpirationAlert />
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {(user.name || user.email || "A")[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium leading-none">{user.name || user.email}</p>
              <p className="text-[10px] text-primary mt-0.5">Admin</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 px-2.5">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline text-xs">View Site</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ===== SIDEBAR ===== */}
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside
          className={[
            "fixed lg:relative z-40 lg:z-auto inset-y-0 left-0 top-14 lg:top-0",
            "bg-[#0d0d14] border-r border-white/[0.06]",
            "flex flex-col transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "w-[60px]" : "w-[220px]",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          ].join(" ")}
        >
          <ScrollArea className="flex-1 py-4">
            <nav className="px-2 space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  {!sidebarCollapsed && (
                    <p className="px-3 mb-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em]">
                      {group.label}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                          title={sidebarCollapsed ? item.label : undefined}
                          className={[
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                          ].join(" ")}
                        >
                          <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                          {!sidebarCollapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                          {!sidebarCollapsed && isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar footer */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-white/[0.06]">
              <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[10px] text-primary font-bold mb-0.5">NLF Admin v2</p>
                <p className="text-[10px] text-muted-foreground">Command Center</p>
              </div>
            </div>
          )}
        </aside>

        {/* ===== MAIN CONTENT AREA ===== */}
        <main className="flex-1 overflow-auto">
          {/* Mobile token alert */}
          <div className="md:hidden px-4 pt-3">
            <TokenExpirationAlert />
          </div>

          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]">
            {/* Section Header */}
            {activeSection !== "overview" && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <ActiveIcon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold leading-none">{activeItem?.label}</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeGroup?.label}</p>
                </div>
              </div>
            )}

            {/* Section Content */}
            {activeSection === "overview" && <OverviewPanel user={user} />}
            {activeSection === "products" && <ProductManager />}
            {activeSection === "checklist-sheet" && <ChecklistSheetWrapper />}
            {activeSection === "checklists" && <ChecklistEditor />}
            {activeSection === "pulls" && <PullLogger />}
            {activeSection === "shows" && <ShowManager />}
            {activeSection === "orders" && <OrderManager />}
            {activeSection === "inventory" && <InventoryManager />}
            {activeSection === "repack-builder" && <RepackBuilder />}
            {activeSection === "ebay-comps" && <EbayCompsPanel />}
            {activeSection === "articles" && <ArticleManager />}
            {activeSection === "top5" && <Top5Manager />}
            {activeSection === "blog" && <BlogManager />}
            {activeSection === "pages" && <PageContentManager />}
            {activeSection === "social" && (
              <div className="space-y-8">
                <FacebookBotManager />
                <Separator />
                <GHLCommentManager />
                <Separator />
                <SocialDraftsManager />
                <div className="border-t border-border pt-8">
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Legacy Post Generator (Single Article)</h3>
                  <SocialPostGenerator />
                </div>
              </div>
            )}
            {activeSection === "affiliates" && <AdminAffiliateLinks />}
            {activeSection === "settings" && <SiteSettingsManager />}
            {activeSection === "api-keys" && <ApiKeysManager />}
            {activeSection === "users" && <UserPortal />}
          </div>
        </main>
      </div>
    </div>
  );
}
