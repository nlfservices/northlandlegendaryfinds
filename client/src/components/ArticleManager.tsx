/**
 * ArticleManager - Admin CMS for MCU News articles
 * Supports create, edit, delete, toggle publish/featured
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit, Eye, EyeOff, Star, StarOff, Loader2,
  ExternalLink, FileText, Newspaper, ArrowLeft
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { value: "movie_news", label: "Movies" },
  { value: "show_news", label: "Shows" },
  { value: "casting", label: "Casting" },
  { value: "card_market", label: "Card Market" },
  { value: "release_dates", label: "Releases" },
  { value: "rumors", label: "Rumors" },
  { value: "analysis", label: "Analysis" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  movie_news: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  show_news: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  casting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  card_market: "bg-green-500/20 text-green-400 border-green-500/30",
  release_dates: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  rumors: "bg-red-500/20 text-red-400 border-red-500/30",
  analysis: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  featuredImageUrl: string;
  category: string;
  tags: string;
  cardMarketImpact: string;
  relatedCharacters: string;
  sources: { title: string; url: string }[];
  isFeatured: boolean;
  isPublished: boolean;
  authorName: string;
  metaDescription: string;
}

const emptyForm: ArticleForm = {
  title: "",
  slug: "",
  excerpt: "",
  contentMarkdown: "",
  featuredImageUrl: "",
  category: "movie_news",
  tags: "",
  cardMarketImpact: "",
  relatedCharacters: "",
  sources: [{ title: "", url: "" }],
  isFeatured: false,
  isPublished: false,
  authorName: "NLF Team",
  metaDescription: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function ArticleManager() {
  const { data: articles, isLoading } = trpc.adminArticles.list.useQuery();
  const createArticle = trpc.adminArticles.create.useMutation();
  const updateArticle = trpc.adminArticles.update.useMutation();
  const deleteArticle = trpc.adminArticles.delete.useMutation();
  const toggleFeatured = trpc.adminArticles.toggleFeatured.useMutation();
  const togglePublished = trpc.adminArticles.togglePublished.useMutation();
  const utils = trpc.useUtils();

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ArticleForm>({ ...emptyForm });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredArticles = articles?.filter((a: any) => {
    if (filter === "all") return true;
    if (filter === "published") return a.isPublished;
    if (filter === "draft") return !a.isPublished;
    if (filter === "featured") return a.isFeatured;
    return a.category === filter;
  });

  const handleEdit = (article: any) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      contentMarkdown: article.contentMarkdown,
      featuredImageUrl: article.featuredImageUrl || "",
      category: article.category,
      tags: article.tags ? (typeof article.tags === "string" ? article.tags : JSON.parse(article.tags).join(", ")) : "",
      cardMarketImpact: article.cardMarketImpact || "",
      relatedCharacters: article.relatedCharacters
        ? (typeof article.relatedCharacters === "string" ? article.relatedCharacters : JSON.parse(article.relatedCharacters).join(", "))
        : "",
      sources: article.sources
        ? (typeof article.sources === "string" ? JSON.parse(article.sources) : article.sources)
        : [{ title: "", url: "" }],
      isFeatured: article.isFeatured,
      isPublished: article.isPublished,
      authorName: article.authorName || "NLF Team",
      metaDescription: article.metaDescription || "",
    });
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.contentMarkdown) {
      toast.error("Title and content are required");
      return;
    }

    const slug = form.slug || slugify(form.title);
    const payload = {
      title: form.title,
      slug,
      excerpt: form.excerpt || undefined,
      contentMarkdown: form.contentMarkdown,
      featuredImageUrl: form.featuredImageUrl || undefined,
      category: form.category as any,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      cardMarketImpact: form.cardMarketImpact || undefined,
      relatedCharacters: form.relatedCharacters
        ? form.relatedCharacters.split(",").map((c) => c.trim()).filter(Boolean)
        : undefined,
      sources: form.sources.filter((s) => s.title && s.url),
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      authorName: form.authorName,
      metaDescription: form.metaDescription || undefined,
    };

    try {
      if (editingId) {
        await updateArticle.mutateAsync({ id: editingId, data: payload });
        toast.success("Article updated");
      } else {
        await createArticle.mutateAsync(payload);
        toast.success("Article created");
      }
      utils.adminArticles.list.invalidate();
      utils.articles.list.invalidate();
      utils.articles.featured.invalidate();
      setShowEditor(false);
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save article");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteArticle.mutateAsync({ id: deletingId });
      toast.success("Article deleted");
      utils.adminArticles.list.invalidate();
      utils.articles.list.invalidate();
      setShowDeleteDialog(false);
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await toggleFeatured.mutateAsync({ id });
      utils.adminArticles.list.invalidate();
      utils.articles.featured.invalidate();
      toast.success("Featured status toggled");
    } catch {
      toast.error("Failed to toggle featured");
    }
  };

  const handleTogglePublished = async (id: number) => {
    try {
      await togglePublished.mutateAsync({ id });
      utils.adminArticles.list.invalidate();
      utils.articles.list.invalidate();
      toast.success("Published status toggled");
    } catch {
      toast.error("Failed to toggle published");
    }
  };

  const addSource = () => {
    setForm((f) => ({ ...f, sources: [...f.sources, { title: "", url: "" }] }));
  };

  const removeSource = (index: number) => {
    setForm((f) => ({ ...f, sources: f.sources.filter((_, i) => i !== index) }));
  };

  const updateSource = (index: number, field: "title" | "url", value: string) => {
    setForm((f) => ({
      ...f,
      sources: f.sources.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  // ==================== EDITOR VIEW ====================
  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => { setShowEditor(false); setEditingId(null); }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
          </Button>
          <h2 className="text-xl font-bold">{editingId ? "Edit Article" : "New Article"}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-sm">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm((f) => ({
                        ...f,
                        title,
                        slug: editingId ? f.slug : slugify(title),
                      }));
                    }}
                    placeholder="Article title..."
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="url-friendly-slug"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL: /mcu-intel/{form.slug || "..."}
                  </p>
                </div>
                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                    placeholder="Brief summary for article cards..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Content (Markdown) *</Label>
                  <Textarea
                    value={form.contentMarkdown}
                    onChange={(e) => setForm((f) => ({ ...f, contentMarkdown: e.target.value }))}
                    placeholder="## Section Title&#10;&#10;Write your article content in Markdown..."
                    rows={16}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports Markdown: ## headings, **bold**, *italic*, bullet lists, blockquotes, links
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sources */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Sources & References</CardTitle>
                <Button variant="outline" size="sm" onClick={addSource}>
                  <Plus className="w-3 h-3 mr-1" /> Add Source
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.sources.map((source, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <Input
                        value={source.title}
                        onChange={(e) => updateSource(i, "title", e.target.value)}
                        placeholder="Source name (e.g., Variety)"
                        className="text-sm"
                      />
                      <Input
                        value={source.url}
                        onChange={(e) => updateSource(i, "url", e.target.value)}
                        placeholder="https://..."
                        className="text-sm"
                      />
                    </div>
                    {form.sources.length > 1 && (
                      <Button variant="ghost" size="icon" className="shrink-0 mt-1" onClick={() => removeSource(i)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-sm">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Published</Label>
                  <Switch
                    checked={form.isPublished}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Featured</Label>
                  <Switch
                    checked={form.isFeatured}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
                  />
                </div>
                <Separator />
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Author</Label>
                  <Input
                    value={form.authorName}
                    onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-sm">SEO & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Featured Image URL</Label>
                  <Input
                    value={form.featuredImageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, featuredImageUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                  {form.featuredImageUrl && (
                    <img
                      src={form.featuredImageUrl}
                      alt="Preview"
                      className="mt-2 rounded-lg border border-border/50 w-full h-32 object-cover"
                    />
                  )}
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Textarea
                    value={form.metaDescription}
                    onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                    placeholder="SEO description..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-sm">Card Market & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Card Market Impact</Label>
                  <Input
                    value={form.cardMarketImpact}
                    onChange={(e) => setForm((f) => ({ ...f, cardMarketImpact: e.target.value }))}
                    placeholder="e.g., Spider-Man card prices up 15%"
                  />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="Doomsday, Doctor Doom, Box Office"
                  />
                </div>
                <div>
                  <Label>Related Characters (comma-separated)</Label>
                  <Input
                    value={form.relatedCharacters}
                    onChange={(e) => setForm((f) => ({ ...f, relatedCharacters: e.target.value }))}
                    placeholder="Doctor Doom, Iron Man, Spider-Man"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              onClick={handleSave}
              disabled={createArticle.isPending || updateArticle.isPending}
            >
              {(createArticle.isPending || updateArticle.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingId ? "Update Article" : "Publish Article"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" /> MCU News Articles
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {articles?.length || 0} articles total
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Article
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          { value: "published", label: "Published" },
          { value: "draft", label: "Drafts" },
          { value: "featured", label: "Featured" },
          ...CATEGORIES,
        ].map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value)}
            className="text-xs"
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !filteredArticles?.length ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No articles found</p>
            <Button variant="outline" className="mt-4" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" /> Create your first article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article: any) => (
            <Card key={article.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  {article.featuredImageUrl && (
                    <img
                      src={article.featuredImageUrl}
                      alt=""
                      className="w-20 h-14 rounded-md object-cover shrink-0 border border-border/30"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-[10px] ${CATEGORY_COLORS[article.category] || ""}`}>
                        {CATEGORIES.find((c) => c.value === article.category)?.label || article.category}
                      </Badge>
                      {article.isPublished ? (
                        <Badge variant="outline" className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Draft
                        </Badge>
                      )}
                      {article.isFeatured && (
                        <Badge variant="outline" className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">
                          <Star className="w-3 h-3 mr-0.5" /> Featured
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm truncate">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{article.excerpt}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      By {article.authorName} · /mcu-intel/{article.slug}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={article.isPublished ? "Unpublish" : "Publish"}
                      onClick={() => handleTogglePublished(article.id)}
                    >
                      {article.isPublished ? (
                        <Eye className="w-4 h-4 text-green-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={article.isFeatured ? "Unfeature" : "Feature"}
                      onClick={() => handleToggleFeatured(article.id)}
                    >
                      {article.isFeatured ? (
                        <Star className="w-4 h-4 text-amber-400" />
                      ) : (
                        <StarOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(article)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    {article.isPublished && (
                      <a href={`/mcu-intel/${article.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => { setDeletingId(article.id); setShowDeleteDialog(true); }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              This will permanently delete this article. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteArticle.isPending}>
              {deleteArticle.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
