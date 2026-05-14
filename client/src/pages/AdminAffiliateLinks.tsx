/**
 * Admin Affiliate Links Manager
 * Manage product recommendations for Collector's Corner sections on articles
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit2, ExternalLink, Tag, ToggleLeft, ToggleRight,
  ShoppingBag, Shirt, Gamepad2, BookOpen, Package, Layers,
} from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "cards", label: "Cards", icon: Layers },
  { value: "toys", label: "Toys", icon: Gamepad2 },
  { value: "clothing", label: "Clothing", icon: Shirt },
  { value: "collectibles", label: "Collectibles", icon: Package },
  { value: "comics", label: "Comics", icon: BookOpen },
  { value: "other", label: "Other", icon: ShoppingBag },
] as const;

type AffiliateLink = {
  id: number;
  name: string;
  url: string;
  imageUrl: string | null;
  category: string;
  characterTags: string[] | null;
  pinnedArticleIds: number[] | null;
  active: boolean;
  position: number;
  priceDisplay: string | null;
  retailer: string | null;
  isAffiliate: boolean;
};

export default function AdminAffiliateLinks() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    imageUrl: "",
    category: "cards" as string,
    characterTags: "",
    pinnedArticleIds: "",
    position: 0,
    priceDisplay: "",
    retailer: "",
    isAffiliate: false,
  });

  const utils = trpc.useUtils();
  const { data: links, isLoading } = trpc.adminAffiliateLinks.list.useQuery();
  const createMutation = trpc.adminAffiliateLinks.create.useMutation({
    onSuccess: () => {
      utils.adminAffiliateLinks.list.invalidate();
      toast.success("Link created!");
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.adminAffiliateLinks.update.useMutation({
    onSuccess: () => {
      utils.adminAffiliateLinks.list.invalidate();
      toast.success("Link updated!");
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.adminAffiliateLinks.delete.useMutation({
    onSuccess: () => {
      utils.adminAffiliateLinks.list.invalidate();
      toast.success("Link deleted!");
    },
    onError: (err) => toast.error(err.message),
  });
  const toggleMutation = trpc.adminAffiliateLinks.toggleActive.useMutation({
    onSuccess: () => {
      utils.adminAffiliateLinks.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({
      name: "", url: "", imageUrl: "", category: "cards",
      characterTags: "", pinnedArticleIds: "", position: 0,
      priceDisplay: "", retailer: "", isAffiliate: false,
    });
  }

  function handleEdit(link: AffiliateLink) {
    setEditingId(link.id);
    setShowForm(true);
    setForm({
      name: link.name,
      url: link.url,
      imageUrl: link.imageUrl || "",
      category: link.category,
      characterTags: (link.characterTags || []).join(", "),
      pinnedArticleIds: (link.pinnedArticleIds || []).join(", "),
      position: link.position,
      priceDisplay: link.priceDisplay || "",
      retailer: link.retailer || "",
      isAffiliate: link.isAffiliate,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      url: form.url,
      imageUrl: form.imageUrl || undefined,
      category: form.category as "cards" | "toys" | "clothing" | "collectibles" | "comics" | "other",
      characterTags: form.characterTags ? form.characterTags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
      pinnedArticleIds: form.pinnedArticleIds ? form.pinnedArticleIds.split(",").map(t => parseInt(t.trim())).filter(n => !isNaN(n)) : undefined,
      position: form.position,
      priceDisplay: form.priceDisplay || undefined,
      retailer: form.retailer || undefined,
      isAffiliate: form.isAffiliate,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Links Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage product recommendations for Collector's Corner. These show on articles matched by character tags.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {/* How it works */}
      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-3">How Collector's Corner Works</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground block mb-1">Auto-Match by Tags</strong>
            Add character tags (e.g., "Spider-Man", "Wolverine") and links automatically appear on articles about those characters.
          </div>
          <div>
            <strong className="text-foreground block mb-1">Pin to Articles</strong>
            Pin specific products to specific articles by entering article IDs. These always show regardless of tags.
          </div>
          <div>
            <strong className="text-foreground block mb-1">Global Links</strong>
            Leave character tags empty to show a link on ALL articles (great for general card sites like COMC, eBay).
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-lg mb-2">{editingId ? "Edit Link" : "Add New Link"}</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Name *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Spider-Man Action Figure" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">URL *</label>
              <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://amazon.com/..." required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Image URL</label>
              <Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Character Tags (comma-separated)</label>
              <Input value={form.characterTags} onChange={e => setForm(f => ({ ...f, characterTags: e.target.value }))} placeholder="Spider-Man, Venom, Miles Morales" />
              <p className="text-xs text-muted-foreground mt-1">Leave empty to show on ALL articles</p>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Pin to Article IDs (comma-separated)</label>
              <Input value={form.pinnedArticleIds} onChange={e => setForm(f => ({ ...f, pinnedArticleIds: e.target.value }))} placeholder="690001, 690005" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Retailer</label>
              <Input value={form.retailer} onChange={e => setForm(f => ({ ...f, retailer: e.target.value }))} placeholder="Amazon, eBay, COMC" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Price Display</label>
              <Input value={form.priceDisplay} onChange={e => setForm(f => ({ ...f, priceDisplay: e.target.value }))} placeholder="$29.99" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Position (lower = first)</label>
              <Input type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isAffiliate} onChange={e => setForm(f => ({ ...f, isAffiliate: e.target.checked }))} className="rounded" />
              <span className="text-sm">This is an affiliate link (shows FTC disclosure)</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? "Update Link" : "Create Link"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Links List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : !links || links.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">No Affiliate Links Yet</h3>
          <p className="text-muted-foreground mb-4">Add your first product recommendation to get started.</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Link
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link: AffiliateLink) => (
            <div key={link.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${link.active ? 'bg-card border-border' : 'bg-muted/30 border-border/50 opacity-60'}`}>
              {/* Image */}
              {link.imageUrl ? (
                <img src={link.imageUrl} alt={link.name} className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const Cat = CATEGORY_OPTIONS.find(c => c.value === link.category)?.icon || ShoppingBag;
                    return <Cat className="w-6 h-6 text-muted-foreground" />;
                  })()}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold truncate">{link.name}</h4>
                  {link.isAffiliate && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-bold">AFFILIATE</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  {link.retailer && <span>{link.retailer}</span>}
                  {link.priceDisplay && <span className="text-primary font-bold">{link.priceDisplay}</span>}
                  <span className="capitalize">{link.category}</span>
                </div>
                {link.characterTags && link.characterTags.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    {link.characterTags.map((tag: string) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => toggleMutation.mutate({ id: link.id })} title={link.active ? "Deactivate" : "Activate"}>
                  {link.active ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                </Button>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4" /></Button>
                </a>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(link)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this link?")) deleteMutation.mutate({ id: link.id }); }}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
