/**
 * Top5Manager - Admin component for managing the Marvelous Top 5 section
 * Supports card image upload (front/back) with green screen removal,
 * cosmic frame compositing, backstory editing, and reordering
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit, Loader2, ArrowUp, ArrowDown, Upload, RotateCcw,
  Image as ImageIcon, Flame, TrendingUp, Zap, Wand2, Eye
} from "lucide-react";
import { useState, useRef, useCallback } from "react";

const FRAME_TEMPLATES = [
  { key: "marvel_mint_gold", label: "Marvel Mint Gold", url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Gold_f3bc7dc2.png" },
  { key: "marvel_mint_silver", label: "Marvel Mint Silver", url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Silver_57c1219f.png" },
  { key: "marvel_mint_bronze", label: "Marvel Mint Bronze", url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Bronze_ca850e23.png" },
  { key: "marvel_mint_platinum", label: "Marvel Mint Platinum", url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Platinum_126c3799.png" },
  { key: "1975_era_gold_amber", label: "1975 Era Gold Amber", url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_1975_Era_Gold_Amber_137f3e23.png" },
  { key: "1976_era_blue_silver", label: "1976 Era Blue Silver", url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_1976_Era_Blue_Silver_7e6de901.png" },
  { key: "2025_era_emerald_green", label: "2025 Era Emerald Green", url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_2025_Era_Emerald_Green_4b7926e9.png" },
];

const HEAT_ICONS: Record<string, React.ReactNode> = {
  blazing: <Flame className="w-4 h-4 text-red-500" />,
  hot: <Zap className="w-4 h-4 text-orange-500" />,
  rising: <TrendingUp className="w-4 h-4 text-yellow-500" />,
};

const HEAT_COLORS: Record<string, string> = {
  blazing: "bg-red-500/20 text-red-400 border-red-500/30",
  hot: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  rising: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

type Source = { title: string; url: string };

const defaultForm = {
  rank: 1,
  title: "",
  character: "",
  tagline: "",
  backstory: "",
  cardImage: "",
  frontImage: null as string | null,
  backImage: null as string | null,
  frameTemplate: "marvel_mint_gold",
  cardLabel: "",
  cardLink: "",
  sources: [{ title: "", url: "" }] as Source[],
  heatLevel: "rising" as "blazing" | "hot" | "rising",
  category: "Movie",
  isActive: true,
};

export default function Top5Manager() {
  const { data: items, isLoading } = trpc.adminTop5.list.useQuery();
  const createItem = trpc.adminTop5.create.useMutation();
  const updateItem = trpc.adminTop5.update.useMutation();
  const deleteItem = trpc.adminTop5.delete.useMutation();
  const uploadImage = trpc.adminTop5.uploadCardImage.useMutation();
  const processAndUpload = trpc.adminTop5.processAndUpload.useMutation();
  const utils = trpc.useUtils();

  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [removeGreen, setRemoveGreen] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    const nextRank = items ? Math.max(...items.map((i: any) => i.rank), 0) + 1 : 1;
    setForm({ ...defaultForm, rank: nextRank });
    setEditingId(null);
    setRemoveGreen(true);
    setPreviewUrl(null);
    setShowDialog(true);
  };

  const openEdit = (item: any) => {
    setForm({
      rank: item.rank,
      title: item.title,
      character: item.character,
      tagline: item.tagline,
      backstory: item.backstory,
      cardImage: item.cardImage,
      frontImage: item.frontImage || null,
      backImage: item.backImage || null,
      frameTemplate: item.frameTemplate || "marvel_mint_gold",
      cardLabel: item.cardLabel,
      cardLink: item.cardLink,
      sources: item.sources && item.sources.length > 0 ? item.sources : [{ title: "", url: "" }],
      heatLevel: item.heatLevel,
      category: item.category,
      isActive: item.isActive,
    });
    setEditingId(item.id);
    setRemoveGreen(true);
    setPreviewUrl(null);
    setShowDialog(true);
  };

  const handleImageUpload = useCallback(async (file: File, side: "front" | "back") => {
    if (side === "front") setUploadingFront(true);
    else setUploadingBack(true);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      });

      if (removeGreen) {
        // Use the green screen processing pipeline
        const result = await processAndUpload.mutateAsync({
          fileName: file.name,
          fileData: base64,
          contentType: file.type || "image/png",
          side,
          frameTemplate: form.frameTemplate,
          removeGreen: true,
        });

        if (side === "front") {
          setForm(f => ({ ...f, frontImage: result.url, cardImage: result.rawUrl }));
        } else {
          setForm(f => ({ ...f, backImage: result.url }));
        }

        // Show composite preview
        if (result.compositedUrl) {
          setPreviewUrl(result.compositedUrl);
        }

        toast.success(
          result.compositedUrl
            ? `${side === "front" ? "Front" : "Back"} card processed with green screen removal and frame compositing`
            : `${side === "front" ? "Front" : "Back"} card uploaded (green screen processing was skipped)`
        );
      } else {
        // Simple upload without processing
        const result = await uploadImage.mutateAsync({
          fileName: file.name,
          fileData: base64,
          contentType: file.type || "image/png",
          side,
        });

        if (side === "front") {
          setForm(f => ({ ...f, frontImage: result.url }));
        } else {
          setForm(f => ({ ...f, backImage: result.url }));
        }
        toast.success(`${side === "front" ? "Front" : "Back"} card image uploaded`);
      }
    } catch (err: any) {
      toast.error(`Failed to upload ${side} image: ${err.message || "Unknown error"}`);
    } finally {
      if (side === "front") setUploadingFront(false);
      else setUploadingBack(false);
    }
  }, [removeGreen, form.frameTemplate, processAndUpload, uploadImage]);

  const handleSave = async () => {
    const cleanSources = form.sources.filter(s => s.title.trim() && s.url.trim());
    const data = { ...form, sources: cleanSources };

    try {
      if (editingId) {
        await updateItem.mutateAsync({ id: editingId, data });
        toast.success("Top 5 item updated");
      } else {
        await createItem.mutateAsync(data);
        toast.success("Top 5 item created");
      }
      utils.adminTop5.list.invalidate();
      utils.top5.list.invalidate();
      setShowDialog(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handleDelete = async (id: number, character: string) => {
    if (!confirm(`Delete "${character}" from Top 5?`)) return;
    try {
      await deleteItem.mutateAsync({ id });
      utils.adminTop5.list.invalidate();
      utils.top5.list.invalidate();
      toast.success(`Removed ${character}`);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleReorder = async (id: number, currentRank: number, direction: "up" | "down") => {
    const targetRank = direction === "up" ? currentRank - 1 : currentRank + 1;
    const swapItem = items?.find((i: any) => i.rank === targetRank);
    if (!swapItem) return;

    try {
      await updateItem.mutateAsync({ id, data: { rank: targetRank } });
      await updateItem.mutateAsync({ id: swapItem.id, data: { rank: currentRank } });
      utils.adminTop5.list.invalidate();
      utils.top5.list.invalidate();
      toast.success("Reordered");
    } catch (err) {
      toast.error("Failed to reorder");
    }
  };

  const addSource = () => setForm(f => ({ ...f, sources: [...f.sources, { title: "", url: "" }] }));
  const removeSource = (idx: number) => setForm(f => ({ ...f, sources: f.sources.filter((_, i) => i !== idx) }));
  const updateSource = (idx: number, field: "title" | "url", value: string) => {
    setForm(f => ({
      ...f,
      sources: f.sources.map((s, i) => i === idx ? { ...s, [field]: value } : s),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const selectedFrame = FRAME_TEMPLATES.find(f => f.key === form.frameTemplate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marvelous Top 5 Manager</h2>
          <p className="text-muted-foreground">Manage the Top 5 buzz characters on the homepage</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Character
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items && items.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              No Top 5 items yet. Click "Add Character" to get started.
            </CardContent>
          </Card>
        )}

        {items?.map((item: any) => (
          <Card key={item.id} className={`transition-all ${!item.isActive ? "opacity-50" : ""}`}>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex flex-col items-center gap-1">
                  <Button
                    variant="ghost" size="icon" className="h-6 w-6"
                    onClick={() => handleReorder(item.id, item.rank, "up")}
                    disabled={item.rank <= 1}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <span className="text-2xl font-black text-primary w-8 text-center">#{item.rank}</span>
                  <Button
                    variant="ghost" size="icon" className="h-6 w-6"
                    onClick={() => handleReorder(item.id, item.rank, "down")}
                    disabled={!items || item.rank >= items.length}
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                </div>

                {/* Card Preview */}
                <div className="w-16 h-20 rounded-md overflow-hidden bg-black/30 flex-shrink-0">
                  {(item.frontImage || item.cardImage) ? (
                    <img
                      src={item.frontImage || item.cardImage}
                      alt={item.character}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold truncate">{item.character}</h3>
                    <Badge variant="outline" className={HEAT_COLORS[item.heatLevel]}>
                      {HEAT_ICONS[item.heatLevel]} {item.heatLevel}
                    </Badge>
                    {item.frameTemplate && (
                      <Badge variant="outline" className="text-xs">
                        {FRAME_TEMPLATES.find(f => f.key === item.frameTemplate)?.label || item.frameTemplate}
                      </Badge>
                    )}
                    {!item.isActive && <Badge variant="destructive">Inactive</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.tagline}</p>
                </div>

                {/* Front/Back indicators */}
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className={item.frontImage ? "text-green-400" : "text-red-400"}>
                    Front: {item.frontImage ? "Processed" : "DB Image"}
                  </span>
                  <span className={item.backImage ? "text-green-400" : "text-yellow-400"}>
                    Back: {item.backImage ? "Uploaded" : "None"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id, item.character)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Top 5 Character</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Rank</Label>
                  <Input
                    type="number" min={1} max={10}
                    value={form.rank}
                    onChange={e => setForm(f => ({ ...f, rank: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label>Heat Level</Label>
                  <Select value={form.heatLevel} onValueChange={v => setForm(f => ({ ...f, heatLevel: v as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blazing">Blazing</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="rising">Rising</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Character Name</Label>
                <Input
                  value={form.character}
                  onChange={e => setForm(f => ({ ...f, character: e.target.value }))}
                  placeholder="e.g., Spider-Man"
                />
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Spider-Man: Brand New Day"
                />
              </div>

              <div>
                <Label>Tagline</Label>
                <Input
                  value={form.tagline}
                  onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                  placeholder="e.g., The trailer just dropped — and the hype is unreal"
                />
              </div>

              <div>
                <Label>Backstory</Label>
                <Textarea
                  value={form.backstory}
                  onChange={e => setForm(f => ({ ...f, backstory: e.target.value }))}
                  rows={5}
                  placeholder="Full backstory paragraph about why this character is buzzing..."
                />
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="e.g., Movie, Comics, TV Show"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))}
                />
                <Label>Active (visible on homepage)</Label>
              </div>
            </div>

            {/* Right Column: Card Images & Frame */}
            <div className="space-y-4">
              {/* Frame Template Picker */}
              <div>
                <Label className="mb-2 block">Cosmic Frame Template</Label>
                <div className="grid grid-cols-4 gap-2">
                  {FRAME_TEMPLATES.map(frame => (
                    <button
                      key={frame.key}
                      onClick={() => setForm(f => ({ ...f, frameTemplate: frame.key }))}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-[3/4] ${
                        form.frameTemplate === frame.key
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img src={frame.url} alt={frame.label} className="w-full h-full object-cover" />
                      {form.frameTemplate === frame.key && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">Selected</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFrame?.label || "Select a frame"}
                </p>
              </div>

              {/* Green Screen Toggle */}
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Wand2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={removeGreen}
                      onCheckedChange={setRemoveGreen}
                    />
                    <Label className="text-sm font-semibold text-green-300">Auto Green Screen Removal</Label>
                  </div>
                  <p className="text-xs text-green-400/70 mt-1">
                    Automatically removes green background and composites card onto the selected cosmic frame
                  </p>
                </div>
              </div>

              {/* Front Card Image Upload */}
              <div>
                <Label className="mb-2 block">Front Card Image</Label>
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "front");
                  }}
                />
                <div className="flex gap-3">
                  {form.frontImage ? (
                    <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-border group">
                      <img src={form.frontImage} alt="Front" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => frontInputRef.current?.click()}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => setForm(f => ({ ...f, frontImage: null }))}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-32 h-44 flex flex-col gap-2 border-dashed"
                      onClick={() => frontInputRef.current?.click()}
                      disabled={uploadingFront}
                    >
                      {uploadingFront ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="text-xs">Processing...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6" />
                          <span className="text-xs">Upload Front</span>
                          {removeGreen && <span className="text-[10px] text-green-400">+ Auto-crop</span>}
                        </>
                      )}
                    </Button>
                  )}

                  {/* Composite Preview */}
                  {previewUrl && (
                    <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-primary/30 bg-black">
                      <img src={previewUrl} alt="Composite Preview" className="w-full h-full object-contain" />
                      <div className="absolute top-1 left-1 bg-primary/80 text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                        PREVIEW
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Back Card Image Upload */}
              <div>
                <Label className="mb-2 block">Back Card Image (Optional)</Label>
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "back");
                  }}
                />
                {form.backImage ? (
                  <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-border group">
                    <img src={form.backImage} alt="Back" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => backInputRef.current?.click()}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => setForm(f => ({ ...f, backImage: null }))}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-32 h-44 flex flex-col gap-2 border-dashed"
                    onClick={() => backInputRef.current?.click()}
                    disabled={uploadingBack}
                  >
                    {uploadingBack ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6" />
                        <span className="text-xs">Upload Back</span>
                        {removeGreen && <span className="text-[10px] text-green-400">+ Auto-crop</span>}
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Card Database Reference */}
              <div>
                <Label>Card Image URL (from database)</Label>
                <Input
                  value={form.cardImage}
                  onChange={e => setForm(f => ({ ...f, cardImage: e.target.value }))}
                  placeholder="https://... (fallback if no front image uploaded)"
                />
              </div>

              <div>
                <Label>Card Label</Label>
                <Input
                  value={form.cardLabel}
                  onChange={e => setForm(f => ({ ...f, cardLabel: e.target.value }))}
                  placeholder="e.g., 2025 Topps Chrome #101"
                />
              </div>

              <div>
                <Label>Card Link</Label>
                <Input
                  value={form.cardLink}
                  onChange={e => setForm(f => ({ ...f, cardLink: e.target.value }))}
                  placeholder="e.g., /cards/chrome/101"
                />
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Source Articles</Label>
              <Button variant="ghost" size="sm" onClick={addSource} className="gap-1">
                <Plus className="w-3 h-3" /> Add Source
              </Button>
            </div>
            <div className="space-y-2">
              {form.sources.map((source, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={source.title}
                    onChange={e => updateSource(idx, "title", e.target.value)}
                    placeholder="Article title"
                    className="flex-1"
                  />
                  <Input
                    value={source.url}
                    onChange={e => updateSource(idx, "url", e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  {form.sources.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeSource(idx)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={createItem.isPending || updateItem.isPending}
            >
              {(createItem.isPending || updateItem.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
