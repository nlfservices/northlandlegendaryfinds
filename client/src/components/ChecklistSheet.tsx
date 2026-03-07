/**
 * ChecklistSheet - Unified Master Spreadsheet for checklist management
 * 
 * ONE spreadsheet view per series:
 *   - Upload all cards + images at once
 *   - Mark cards as pulled inline with date + show/episode
 *   - Remove pulled status inline
 *   - Live pack counter showing remaining inventory
 *   - Bulk import via CSV/paste
 *   - Sold-out detection
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Plus, Trash2, Upload, Image as ImageIcon, CheckCircle2,
  Loader2, FileSpreadsheet, X, Undo2, Calendar, Radio, Download,
  Package, TrendingUp, Eye, AlertTriangle, Zap, Search
} from "lucide-react";
import { useState, useRef, useCallback, useMemo } from "react";

// ==================== TYPES ====================

interface NewCardRow {
  id: string; // temp client ID
  cardName: string;
  cardSet: string;
  cardYear: string;
  cardNumber: string;
  parallel: string;
  tier: "chase" | "hit" | "base" | "bonus";
  estimatedValue: string;
  cardCondition: string;
  imageFile?: File;
  imagePreview?: string;
}

function createEmptyRow(): NewCardRow {
  return {
    id: Math.random().toString(36).substring(2, 10),
    cardName: "",
    cardSet: "",
    cardYear: "",
    cardNumber: "",
    parallel: "",
    tier: "base",
    estimatedValue: "",
    cardCondition: "Raw",
  };
}

// ==================== PACK COUNTER ====================

function PackCounter({ productId }: { productId: number }) {
  const { data: stats } = trpc.admin.products.getById.useQuery({ id: productId });
  const { data: productStats } = trpc.public.products.stats.useQuery({ id: productId });
  const { data: shows } = trpc.admin.shows.getByProduct.useQuery({ productId });

  const totalPacks = stats?.totalPacks || 0;
  const packsRemaining = stats?.packsRemaining || 0;
  const packsSold = totalPacks - packsRemaining;
  const progressPercent = totalPacks > 0 ? Math.round((packsSold / totalPacks) * 100) : 0;
  const isSoldOut = packsRemaining <= 0 && totalPacks > 0;

  const completedShows = shows?.filter(s => s.status === "completed") || [];
  const totalPacksFromShows = completedShows.reduce((sum, s) => sum + (s.packsOpened || 0), 0);

  return (
    <div className="space-y-4">
      {/* Main Counter */}
      <div className={`rounded-xl border p-6 ${isSoldOut ? 'bg-red-500/5 border-red-500/30' : 'bg-card border-border'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSoldOut ? 'bg-red-500/10' : 'bg-primary/10'}`}>
              <Package className={`w-6 h-6 ${isSoldOut ? 'text-red-400' : 'text-primary'}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isSoldOut ? 'SOLD OUT' : 'Pack Inventory'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isSoldOut ? 'All packs have been opened!' : 'Live inventory tracking'}
              </p>
            </div>
          </div>
          {!isSoldOut && (
            <div className="text-right">
              <div className="text-3xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>
                {packsRemaining}
              </div>
              <div className="text-xs text-muted-foreground">packs remaining</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">{packsSold} sold of {totalPacks}</span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSoldOut ? 'bg-red-500' : progressPercent > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-primary to-green-400'
              }`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{totalPacks}</div>
            <div className="text-xs text-muted-foreground">Total Packs</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-400">{packsSold}</div>
            <div className="text-xs text-muted-foreground">Sold</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-primary">{packsRemaining}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-amber-400">{completedShows.length}</div>
            <div className="text-xs text-muted-foreground">Shows Done</div>
          </div>
        </div>
      </div>

      {/* Show Log */}
      {completedShows.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" /> Show Log
          </h4>
          <div className="space-y-2">
            {completedShows.slice(0, 10).map(show => (
              <div key={show.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{new Date(Number(show.showDate)).toLocaleDateString()}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="font-medium">{show.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {show.packsOpened} packs
                </Badge>
              </div>
            ))}
          </div>
          {totalPacksFromShows > 0 && (
            <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
              Total packs opened across {completedShows.length} shows: <strong className="text-foreground">{totalPacksFromShows}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== MASTER SHEET (ALL CARDS VIEW) ====================

function MasterSheet({ productId }: { productId: number }) {
  const { data: checklist, isLoading } = trpc.admin.checklist.getByProduct.useQuery({ productId });
  const { data: shows } = trpc.admin.shows.getByProduct.useQuery({ productId });
  const { data: allPulls } = trpc.admin.pulls.getByProduct.useQuery({ productId });
  const bulkMarkPulled = trpc.admin.checklist.bulkMarkPulled.useMutation();
  const bulkUnpull = trpc.admin.checklist.bulkUnpull.useMutation();
  const uploadImage = trpc.admin.checklist.uploadImage.useMutation();
  const utils = trpc.useUtils();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pullDate, setPullDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [pullStream, setPullStream] = useState("");
  const [selectedShowId, setSelectedShowId] = useState<number | undefined>();
  const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);

  // Build pull lookup for show/date info
  const pullLookup = useMemo(() => {
    const lookup: Record<number, { pulledAt: string; showTitle?: string; notes?: string }> = {};
    if (!allPulls || !shows) return lookup;
    for (const pull of allPulls) {
      const show = pull.showId ? shows.find(s => s.id === pull.showId) : undefined;
      lookup[pull.checklistItemId] = {
        pulledAt: new Date(pull.pulledAt).toLocaleDateString(),
        showTitle: show?.title || undefined,
        notes: pull.notes || undefined,
      };
    }
    return lookup;
  }, [allPulls, shows]);

  const filteredItems = useMemo(() => {
    if (!checklist) return [];
    let items = [...checklist];
    if (filterTier !== "all") items = items.filter(i => i.tier === filterTier);
    if (filterStatus === "pulled") items = items.filter(i => i.isPulled);
    if (filterStatus === "available") items = items.filter(i => !i.isPulled);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.cardName.toLowerCase().includes(q) ||
        i.parallel?.toLowerCase().includes(q) ||
        i.cardNumber?.toLowerCase().includes(q) ||
        i.cardSet?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [checklist, filterTier, filterStatus, searchQuery]);

  const totalCards = checklist?.length || 0;
  const pulledCards = checklist?.filter(c => c.isPulled).length || 0;
  const availableCards = totalCards - pulledCards;
  const withImages = checklist?.filter(c => c.imageUrl).length || 0;

  const selectedPulled = useMemo(() => {
    if (!checklist) return 0;
    return Array.from(selectedIds).filter(id => checklist.find(c => c.id === id)?.isPulled).length;
  }, [selectedIds, checklist]);
  const selectedUnpulled = selectedIds.size - selectedPulled;

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)));
    }
  };

  const handleMarkPulled = async () => {
    const unpulledSelected = Array.from(selectedIds).filter(id =>
      checklist?.find(c => c.id === id && !c.isPulled)
    );
    if (unpulledSelected.length === 0) {
      toast.error("No unpulled cards selected");
      return;
    }

    try {
      const result = await bulkMarkPulled.mutateAsync({
        productId,
        showId: selectedShowId,
        streamName: pullStream.trim() || undefined,
        pulledDate: new Date(pullDate).getTime(),
        rows: unpulledSelected.map(id => ({ checklistItemId: id })),
      });
      toast.success(`${result.count} cards marked as pulled!`);
      setSelectedIds(new Set());
      utils.admin.checklist.getByProduct.invalidate({ productId });
      utils.admin.pulls.getByProduct.invalidate({ productId });
      utils.admin.products.getById.invalidate({ id: productId });
      utils.public.products.stats.invalidate({ id: productId });
    } catch (e: any) {
      toast.error(e.message || "Failed to mark cards as pulled");
    }
  };

  const handleUnpull = async () => {
    const pulledSelected = Array.from(selectedIds).filter(id =>
      checklist?.find(c => c.id === id && c.isPulled)
    );
    if (pulledSelected.length === 0) {
      toast.error("No pulled cards selected to unpull");
      return;
    }
    if (!confirm(`Remove pulled status from ${pulledSelected.length} card(s)?`)) return;

    try {
      const result = await bulkUnpull.mutateAsync({
        productId,
        checklistItemIds: pulledSelected,
      });
      toast.success(`${result.count} cards un-pulled!`);
      setSelectedIds(new Set());
      utils.admin.checklist.getByProduct.invalidate({ productId });
      utils.admin.pulls.getByProduct.invalidate({ productId });
      utils.admin.products.getById.invalidate({ id: productId });
      utils.public.products.stats.invalidate({ id: productId });
    } catch (e: any) {
      toast.error(e.message || "Failed to unpull cards");
    }
  };

  const handleImageUpload = async (itemId: number, file: File) => {
    setUploadingImageId(itemId);
    try {
      const base64 = await fileToBase64(file);
      await uploadImage.mutateAsync({
        checklistItemId: itemId,
        imageData: base64,
        contentType: file.type || "image/jpeg",
      });
      toast.success("Image uploaded!");
      utils.admin.checklist.getByProduct.invalidate({ productId });
    } catch (e: any) {
      toast.error(e.message || "Failed to upload image");
    } finally {
      setUploadingImageId(null);
    }
  };

  const tierColors: Record<string, string> = {
    chase: "text-amber-400 bg-amber-500/10",
    hit: "text-purple-400 bg-purple-500/10",
    base: "text-blue-400 bg-blue-500/10",
    bonus: "text-green-400 bg-green-500/10",
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex items-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-muted-foreground">Total:</span>
          <span className="font-bold">{totalCards}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-muted-foreground">Pulled:</span>
          <span className="font-bold text-green-400">{pulledCards}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-muted-foreground">Available:</span>
          <span className="font-bold">{availableCards}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-muted-foreground">With Images:</span>
          <span className="font-bold">{withImages}/{totalCards}</span>
        </div>
      </div>

      {/* Pull Info Bar (for marking pulled) */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pull Info:</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input
                type="datetime-local"
                value={pullDate}
                onChange={e => setPullDate(e.target.value)}
                className="w-48 h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-muted-foreground" />
              <Input
                value={pullStream}
                onChange={e => setPullStream(e.target.value)}
                placeholder="Stream / Episode"
                className="w-48 h-8 text-sm"
              />
            </div>
            {shows && shows.length > 0 && (
              <div className="flex items-center gap-2">
                <Label className="text-xs">Show</Label>
                <Select
                  value={selectedShowId?.toString() || "none"}
                  onValueChange={v => setSelectedShowId(v === "none" ? undefined : parseInt(v))}
                >
                  <SelectTrigger className="w-48 h-8 text-sm"><SelectValue placeholder="Select show..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No show</SelectItem>
                    {shows.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            className="w-64 h-8 text-sm pl-8"
          />
        </div>
        <Select value={filterTier} onValueChange={setFilterTier}>
          <SelectTrigger className="w-28 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="chase">Chase</SelectItem>
            <SelectItem value="hit">Hit</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="bonus">Bonus</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pulled">Pulled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">
          {selectedIds.size > 0 && (
            <span className="font-medium text-foreground">{selectedIds.size} selected · </span>
          )}
          {filteredItems.length} cards shown
        </span>
      </div>

      {/* Master Spreadsheet Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <ScrollArea className="max-h-[600px]">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={filteredItems.length > 0 && selectedIds.size === filteredItems.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="w-14">Status</TableHead>
                <TableHead className="w-14">Image</TableHead>
                <TableHead className="min-w-[160px]">Card Name</TableHead>
                <TableHead>Set</TableHead>
                <TableHead className="w-16">Card #</TableHead>
                <TableHead>Parallel</TableHead>
                <TableHead className="w-20">Tier</TableHead>
                <TableHead className="w-24">Condition</TableHead>
                <TableHead className="w-28">Pulled Date</TableHead>
                <TableHead className="w-32">Show / Stream</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    {totalCards === 0 ? "No cards in this checklist yet. Use 'Add Cards' to import." : "No cards match your filters."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map(item => {
                  const pullInfo = pullLookup[item.id];
                  return (
                    <TableRow
                      key={item.id}
                      className={`cursor-pointer transition-colors ${
                        selectedIds.has(item.id) ? 'bg-primary/5' :
                        item.isPulled ? 'bg-green-500/3' : ''
                      }`}
                      onClick={() => toggleSelect(item.id)}
                    >
                      <TableCell onClick={e => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(item.id)}
                          onCheckedChange={() => toggleSelect(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {item.isPulled ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                        )}
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        {uploadingImageId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-8 h-10 object-cover rounded border border-border cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload(item.id, file);
                              };
                              input.click();
                            }}
                          />
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload(item.id, file);
                              };
                              input.click();
                            }}
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          {item.cardName}
                          {item.parallel && (
                            <span className="text-primary ml-1.5 text-xs font-normal">({item.parallel})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.cardSet || '-'}
                        {item.cardYear && <span className="ml-1">({item.cardYear})</span>}
                      </TableCell>
                      <TableCell className="text-sm">{item.cardNumber || '-'}</TableCell>
                      <TableCell className="text-sm text-primary">{item.parallel || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${tierColors[item.tier] || ''}`}>
                          {item.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.cardCondition || 'Raw'}</TableCell>
                      <TableCell className="text-xs">
                        {item.isPulled ? (
                          <span className="text-green-400">{pullInfo?.pulledAt || 'Yes'}</span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {pullInfo?.showTitle ? (
                          <span className="text-muted-foreground">{pullInfo.showTitle}</span>
                        ) : pullInfo?.notes ? (
                          <span className="text-muted-foreground">{pullInfo.notes}</span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
          <span className="text-sm">
            <strong>{selectedIds.size}</strong> selected
            {selectedUnpulled > 0 && <span className="text-muted-foreground"> · {selectedUnpulled} unpulled</span>}
            {selectedPulled > 0 && <span className="text-green-400"> · {selectedPulled} pulled</span>}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
            {selectedUnpulled > 0 && (
              <Button
                size="sm"
                onClick={handleMarkPulled}
                disabled={bulkMarkPulled.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {bulkMarkPulled.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Mark {selectedUnpulled} Pulled
              </Button>
            )}
            {selectedPulled > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleUnpull}
                disabled={bulkUnpull.isPending}
              >
                {bulkUnpull.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Undo2 className="w-4 h-4 mr-2" />}
                Unpull {selectedPulled}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== ADD CARDS TAB ====================

function AddCardsTab({ productId }: { productId: number }) {
  const [rows, setRows] = useState<NewCardRow[]>(() =>
    Array.from({ length: 5 }, createEmptyRow)
  );
  const [defaultSet, setDefaultSet] = useState("");
  const [defaultYear, setDefaultYear] = useState("");
  const [defaultTier, setDefaultTier] = useState<"chase" | "hit" | "base" | "bonus">("base");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bulkCreate = trpc.admin.checklist.bulkCreate.useMutation();
  const uploadImage = trpc.admin.checklist.uploadImage.useMutation();
  const utils = trpc.useUtils();

  const updateRow = (id: string, field: keyof NewCardRow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRows = (count: number = 5) => {
    setRows(prev => [...prev, ...Array.from({ length: count }, createEmptyRow)]);
  };

  const removeRow = (id: string) => {
    setRows(prev => {
      const filtered = prev.filter(r => r.id !== id);
      return filtered.length === 0 ? [createEmptyRow()] : filtered;
    });
  };

  const handleImageSelect = (rowId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setRows(prev => prev.map(r =>
        r.id === rowId ? { ...r, imageFile: file, imagePreview: e.target?.result as string } : r
      ));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (rowId: string) => {
    setRows(prev => prev.map(r =>
      r.id === rowId ? { ...r, imageFile: undefined, imagePreview: undefined } : r
    ));
  };

  const handlePaste = useCallback((text: string) => {
    const lines = text.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) return;

    const firstLine = lines[0];
    const separator = firstLine.includes('\t') ? '\t' : '|';

    const headerKeywords = ['card name', 'name', 'set', 'year', 'number', 'parallel', 'tier', 'value'];
    const firstLineLower = firstLine.toLowerCase();
    const isHeader = headerKeywords.some(k => firstLineLower.includes(k));
    const dataLines = isHeader ? lines.slice(1) : lines;

    const newRows: NewCardRow[] = dataLines.map(line => {
      const parts = line.split(separator).map(p => p.trim());
      const tier = (parts[5] || defaultTier || "base").toLowerCase();
      const mappedTier = tier === "top hits" || tier === "top" || tier === "chase" ? "chase"
        : tier === "middle" || tier === "mid" || tier === "hit" ? "hit"
        : tier === "bonus" ? "bonus" : "base";

      return {
        id: Math.random().toString(36).substring(2, 10),
        cardName: parts[0] || "",
        cardSet: parts[1] || defaultSet,
        cardYear: parts[2] || defaultYear,
        cardNumber: parts[3] || "",
        parallel: parts[4] || "",
        tier: mappedTier as any,
        estimatedValue: parts[6] || "",
        cardCondition: parts[7] || "Raw",
      };
    }).filter(r => r.cardName);

    if (newRows.length > 0) {
      setRows(prev => {
        const nonEmpty = prev.filter(r => r.cardName.trim());
        return [...nonEmpty, ...newRows];
      });
      toast.success(`Pasted ${newRows.length} cards`);
    }
  }, [defaultSet, defaultYear, defaultTier]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handlePaste(text);
    };
    reader.readAsText(file);
  }, [handlePaste]);

  const validRows = rows.filter(r => r.cardName.trim());

  const handleSubmit = async () => {
    if (validRows.length === 0) {
      toast.error("No cards to add. Fill in at least one card name.");
      return;
    }

    setIsSubmitting(true);
    try {
      const items = validRows.map((row, index) => ({
        cardName: row.cardName.trim(),
        cardSet: row.cardSet.trim() || defaultSet || undefined,
        cardYear: row.cardYear.trim() || defaultYear || undefined,
        cardNumber: row.cardNumber.trim() || undefined,
        parallel: row.parallel.trim() || undefined,
        tier: row.tier || defaultTier,
        estimatedValue: row.estimatedValue.trim() || undefined,
        cardCondition: row.cardCondition.trim() || "Raw",
        sortOrder: index,
      }));

      const result = await bulkCreate.mutateAsync({ productId, items });
      toast.success(`${result.count} cards added to checklist!`);

      await utils.admin.checklist.getByProduct.invalidate({ productId });
      const updatedChecklist = await utils.admin.checklist.getByProduct.fetch({ productId });

      const rowsWithImages = validRows.filter(r => r.imageFile);
      if (rowsWithImages.length > 0 && updatedChecklist) {
        let uploadedCount = 0;
        for (const row of rowsWithImages) {
          const match = updatedChecklist.find(item =>
            item.cardName === row.cardName.trim() &&
            (!row.parallel.trim() || item.parallel === row.parallel.trim())
          );
          if (match && row.imageFile) {
            try {
              const base64 = await fileToBase64(row.imageFile);
              await uploadImage.mutateAsync({
                checklistItemId: match.id,
                imageData: base64,
                contentType: row.imageFile.type || "image/jpeg",
              });
              uploadedCount++;
            } catch (e) {
              console.error(`Failed to upload image for ${row.cardName}:`, e);
            }
          }
        }
        if (uploadedCount > 0) {
          toast.success(`${uploadedCount} card images uploaded!`);
          await utils.admin.checklist.getByProduct.invalidate({ productId });
        }
      }

      setRows(Array.from({ length: 5 }, createEmptyRow));
    } catch (e: any) {
      toast.error(e.message || "Failed to add cards");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Defaults Bar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Defaults:</span>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Set</Label>
              <Input
                value={defaultSet}
                onChange={e => setDefaultSet(e.target.value)}
                placeholder="e.g. 2025 Topps Chrome"
                className="w-48 h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Year</Label>
              <Input
                value={defaultYear}
                onChange={e => setDefaultYear(e.target.value)}
                placeholder="2025"
                className="w-20 h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Tier</Label>
              <Select value={defaultTier} onValueChange={v => setDefaultTier(v as any)}>
                <SelectTrigger className="w-28 h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="chase">Chase</SelectItem>
                  <SelectItem value="hit">Hit</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".csv,.tsv,.txt";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFileUpload(file);
            };
            input.click();
          }}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Import CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.readText().then(text => {
              if (text.trim()) handlePaste(text);
              else toast.error("Clipboard is empty");
            }).catch(() => toast.error("Cannot access clipboard. Try Ctrl+V in the table."));
          }}
        >
          <Upload className="w-4 h-4 mr-2" /> Paste from Clipboard
        </Button>
        <Button variant="outline" size="sm" onClick={() => addRows(5)}>
          <Plus className="w-4 h-4 mr-2" /> Add 5 Rows
        </Button>
        <Button variant="outline" size="sm" onClick={() => addRows(10)}>
          <Plus className="w-4 h-4 mr-2" /> Add 10 Rows
        </Button>
      </div>

      {/* Spreadsheet Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <ScrollArea className="max-h-[600px]">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-8 text-center">#</TableHead>
                <TableHead className="min-w-[180px]">Card Name *</TableHead>
                <TableHead className="min-w-[150px]">Set</TableHead>
                <TableHead className="w-16">Year</TableHead>
                <TableHead className="w-20">Card #</TableHead>
                <TableHead className="min-w-[120px]">Parallel</TableHead>
                <TableHead className="w-24">Tier</TableHead>
                <TableHead className="w-24">Est. Value</TableHead>
                <TableHead className="w-24">Condition</TableHead>
                <TableHead className="w-16">Image</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id} className="group">
                  <TableCell className="text-center text-xs text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      value={row.cardName}
                      onChange={e => updateRow(row.id, "cardName", e.target.value)}
                      placeholder="Spider-Man"
                      className="h-8 text-sm border-transparent hover:border-border focus:border-primary bg-transparent"
                      onPaste={(e) => {
                        const text = e.clipboardData.getData("text");
                        if (text.includes('\t') || text.includes('\n')) {
                          e.preventDefault();
                          handlePaste(text);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.cardSet}
                      onChange={e => updateRow(row.id, "cardSet", e.target.value)}
                      placeholder={defaultSet || "Set name"}
                      className="h-8 text-sm border-transparent hover:border-border focus:border-primary bg-transparent"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.cardYear}
                      onChange={e => updateRow(row.id, "cardYear", e.target.value)}
                      placeholder={defaultYear || "Year"}
                      className="h-8 text-sm border-transparent hover:border-border focus:border-primary bg-transparent w-16"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.cardNumber}
                      onChange={e => updateRow(row.id, "cardNumber", e.target.value)}
                      placeholder="#1"
                      className="h-8 text-sm border-transparent hover:border-border focus:border-primary bg-transparent w-16"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.parallel}
                      onChange={e => updateRow(row.id, "parallel", e.target.value)}
                      placeholder="Gold /50"
                      className="h-8 text-sm border-transparent hover:border-border focus:border-primary bg-transparent"
                    />
                  </TableCell>
                  <TableCell>
                    <Select value={row.tier} onValueChange={v => updateRow(row.id, "tier", v)}>
                      <SelectTrigger className="h-8 text-xs border-transparent hover:border-border w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chase">Chase</SelectItem>
                        <SelectItem value="hit">Hit</SelectItem>
                        <SelectItem value="base">Base</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.estimatedValue}
                      onChange={e => updateRow(row.id, "estimatedValue", e.target.value)}
                      placeholder="$50"
                      className="h-8 text-sm border-transparent hover:border-border focus:border-primary bg-transparent w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Select value={row.cardCondition || "Raw"} onValueChange={v => updateRow(row.id, "cardCondition", v)}>
                      <SelectTrigger className="h-8 text-xs border-transparent hover:border-border w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Raw">Raw</SelectItem>
                        <SelectItem value="Near Mint">Near Mint</SelectItem>
                        <SelectItem value="Mint">Mint</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Graded">Graded</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {row.imagePreview ? (
                      <div className="relative group/img">
                        <img src={row.imagePreview} alt="" className="w-8 h-10 object-cover rounded border border-border" />
                        <button
                          onClick={() => clearImage(row.id)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleImageSelect(row.id, file);
                          };
                          input.click();
                        }}
                      >
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeRow(row.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Submit Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {validRows.length} card{validRows.length !== 1 ? 's' : ''} ready to add
          {validRows.filter(r => r.imageFile).length > 0 && (
            <span className="ml-2">· {validRows.filter(r => r.imageFile).length} with images</span>
          )}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setRows(Array.from({ length: 5 }, createEmptyRow))}
            disabled={isSubmitting}
          >
            Clear All
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || validRows.length === 0}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Add {validRows.length} Card{validRows.length !== 1 ? 's' : ''} to Checklist
          </Button>
        </div>
      </div>
    </div>
  );
}

// ==================== HELPER ====================

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==================== MAIN COMPONENT ====================

export default function ChecklistSheet({ productId }: { productId: number }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="master" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="master" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Master Sheet
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Cards
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" /> Pack Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="master">
          <MasterSheet productId={productId} />
        </TabsContent>

        <TabsContent value="add">
          <AddCardsTab productId={productId} />
        </TabsContent>

        <TabsContent value="inventory">
          <PackCounter productId={productId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
