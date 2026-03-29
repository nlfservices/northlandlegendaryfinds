/**
 * BlogManager - Admin CMS for "The Collector" blog
 * Supports create, edit, delete, toggle publish/featured, AI generation, bulk scheduling
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
  ArrowLeft, Sparkles, Clock, Zap, BarChart3, Calendar
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { value: "market_trends", label: "Market Trends" },
  { value: "character_spotlight", label: "Character Spotlight" },
  { value: "grading_guide", label: "Grading Guide" },
  { value: "set_breakdown", label: "Set Breakdown" },
  { value: "investment_strategy", label: "Investment Strategy" },
  { value: "collecting_tips", label: "Collecting Tips" },
  { value: "nlf_news", label: "NLF News" },
  { value: "behind_the_scenes", label: "Behind the Scenes" },
  { value: "card_history", label: "Card History" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  market_trends: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  character_spotlight: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  grading_guide: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  set_breakdown: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  investment_strategy: "bg-green-500/20 text-green-400 border-green-500/30",
  collecting_tips: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  nlf_news: "bg-primary/20 text-primary border-primary/30",
  behind_the_scenes: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  card_history: "bg-red-500/20 text-red-400 border-red-500/30",
};

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  featuredImageUrl: string;
  category: string;
  tags: string;
  isFeatured: boolean;
  isPublished: boolean;
  authorName: string;
  metaDescription: string;
  focusKeyword: string;
}

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  contentMarkdown: "",
  featuredImageUrl: "",
  category: "market_trends",
  tags: "",
  isFeatured: false,
  isPublished: false,
  authorName: "NLF Team",
  metaDescription: "",
  focusKeyword: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function BlogManager() {
  const { data: posts, isLoading } = trpc.adminBlog.list.useQuery();
  const createPost = trpc.adminBlog.create.useMutation();
  const updatePost = trpc.adminBlog.update.useMutation();
  const deletePost = trpc.adminBlog.delete.useMutation();
  const toggleFeatured = trpc.adminBlog.toggleFeatured.useMutation();
  const togglePublished = trpc.adminBlog.togglePublished.useMutation();
  const generateArticle = trpc.adminBlog.generateArticle.useMutation();
  const bulkGenerate = trpc.adminBlog.bulkGenerate.useMutation();
  const publishScheduled = trpc.adminBlog.publishScheduled.useMutation();
  const utils = trpc.useUtils();

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogForm>({ ...emptyForm });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // AI Generation state
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiCategory, setAiCategory] = useState<string>("market_trends");
  const [aiFocusKeyword, setAiFocusKeyword] = useState("");
  const [aiAutoPublish, setAiAutoPublish] = useState(false);

  // Bulk generation state
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkCount, setBulkCount] = useState(24);
  const [bulkInterval, setBulkInterval] = useState(60);

  const filteredPosts = posts?.filter((p: any) => {
    if (filter === "all") return true;
    if (filter === "published") return p.isPublished;
    if (filter === "draft") return !p.isPublished;
    if (filter === "featured") return p.isFeatured;
    if (filter === "scheduled") return p.scheduledAt && !p.isPublished;
    if (filter === "ai") return p.isAiGenerated;
    return p.category === filter;
  });

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      contentMarkdown: post.contentMarkdown,
      featuredImageUrl: post.featuredImageUrl || "",
      category: post.category,
      tags: post.tags ? (Array.isArray(post.tags) ? post.tags.join(", ") : typeof post.tags === "string" ? post.tags : JSON.parse(post.tags).join(", ")) : "",
      isFeatured: post.isFeatured,
      isPublished: post.isPublished,
      authorName: post.authorName || "NLF Team",
      metaDescription: post.metaDescription || "",
      focusKeyword: post.focusKeyword || "",
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...form,
        category: form.category as any,
        tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        await updatePost.mutateAsync({ id: editingId, data: data as any });
        toast.success("Blog post updated");
      } else {
        await createPost.mutateAsync(data as any);
        toast.success("Blog post created");
      }
      utils.adminBlog.list.invalidate();
      setShowEditor(false);
      setEditingId(null);
      setForm({ ...emptyForm });
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog post");
    }
  };

  const handleAiGenerate = async () => {
    try {
      const result = await generateArticle.mutateAsync({
        topic: aiTopic || undefined,
        category: aiCategory as any,
        focusKeyword: aiFocusKeyword || undefined,
        autoPublish: aiAutoPublish,
      });
      toast.success(`Article generated: ${result.title}`);
      utils.adminBlog.list.invalidate();
      setShowAiDialog(false);
      setAiTopic("");
      setAiFocusKeyword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate article");
    }
  };

  const handleBulkGenerate = async () => {
    try {
      const result = await bulkGenerate.mutateAsync({
        count: bulkCount,
        intervalMinutes: bulkInterval,
        startTime: Date.now(),
      });
      toast.success(`Generated ${result.generated} articles for scheduled publishing`);
      utils.adminBlog.list.invalidate();
      setShowBulkDialog(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to bulk generate");
    }
  };

  const handlePublishScheduled = async () => {
    try {
      const result = await publishScheduled.mutateAsync();
      toast.success(`Published ${result.published} scheduled articles`);
      utils.adminBlog.list.invalidate();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish scheduled articles");
    }
  };

  // ==================== EDITOR VIEW ====================
  if (showEditor) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setShowEditor(false); setEditingId(null); setForm({ ...emptyForm }); }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle>{editingId ? "Edit Blog Post" : "New Blog Post"}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) });
                }}
                placeholder="Article title..."
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="url-friendly-slug" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Focus Keyword (SEO)</Label>
              <Input value={form.focusKeyword} onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })} placeholder="e.g., Marvel card investment" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Excerpt (Preview Text)</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short preview for cards..." />
          </div>

          <div className="space-y-2">
            <Label>Content (Markdown)</Label>
            <Textarea
              value={form.contentMarkdown}
              onChange={(e) => setForm({ ...form, contentMarkdown: e.target.value })}
              rows={20}
              placeholder="Write your article in Markdown..."
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Featured Image URL</Label>
            <Input value={form.featuredImageUrl} onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Marvel, CGC, investment" />
            </div>
            <div className="space-y-2">
              <Label>Meta Description (SEO)</Label>
              <Input value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Max 160 chars..." maxLength={160} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
              <Label>Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
              <Label>Featured</Label>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={createPost.isPending || updatePost.isPending}>
              {(createPost.isPending || updatePost.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? "Update Post" : "Create Post"}
            </Button>
            <Button variant="outline" onClick={() => { setShowEditor(false); setEditingId(null); setForm({ ...emptyForm }); }}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => { setForm({ ...emptyForm }); setShowEditor(true); }}>
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
        <Button variant="outline" onClick={() => setShowAiDialog(true)}>
          <Sparkles className="w-4 h-4 mr-2" /> AI Generate
        </Button>
        <Button variant="outline" onClick={() => setShowBulkDialog(true)}>
          <Zap className="w-4 h-4 mr-2" /> Bulk Generate
        </Button>
        <Button variant="outline" onClick={handlePublishScheduled} disabled={publishScheduled.isPending}>
          {publishScheduled.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Clock className="w-4 h-4 mr-2" />}
          Publish Scheduled
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-card/50 border-border cursor-pointer" onClick={() => setFilter("all")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{posts?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border cursor-pointer" onClick={() => setFilter("published")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{posts?.filter((p: any) => p.isPublished).length || 0}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border cursor-pointer" onClick={() => setFilter("draft")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{posts?.filter((p: any) => !p.isPublished).length || 0}</p>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border cursor-pointer" onClick={() => setFilter("scheduled")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-cyan-400">{posts?.filter((p: any) => p.scheduledAt && !p.isPublished).length || 0}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border cursor-pointer" onClick={() => setFilter("ai")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-purple-400">{posts?.filter((p: any) => p.isAiGenerated).length || 0}</p>
            <p className="text-xs text-muted-foreground">AI Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Posts</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Drafts</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="ai">AI Generated</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Post List */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : !filteredPosts?.length ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            No blog posts found. Create one or use AI to generate content!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post: any) => (
            <Card key={post.id} className="bg-card/50 border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {post.featuredImageUrl && (
                    <img src={post.featuredImageUrl} alt="" className="w-20 h-14 object-cover rounded-md flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{post.title}</h3>
                      {post.isAiGenerated && <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">AI</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className={CATEGORY_COLORS[post.category] || ""}>
                        {CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
                      </Badge>
                      {post.isPublished ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
                      ) : post.scheduledAt ? (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.scheduledAt).toLocaleString()}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-400 border-amber-500/30">Draft</Badge>
                      )}
                      {post.isFeatured && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Featured</Badge>}
                      <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{post.viewCount || 0} views</span>
                      {post.readTimeMinutes && <span>{post.readTimeMinutes} min read</span>}
                    </div>
                    {post.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.excerpt}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={async () => {
                        await togglePublished.mutateAsync({ id: post.id });
                        utils.adminBlog.list.invalidate();
                        toast.success(post.isPublished ? "Unpublished" : "Published");
                      }}
                    >
                      {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={async () => {
                        await toggleFeatured.mutateAsync({ id: post.id });
                        utils.adminBlog.list.invalidate();
                        toast.success(post.isFeatured ? "Unfeatured" : "Featured");
                      }}
                    >
                      {post.isFeatured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="text-destructive"
                      onClick={() => { setDeletingId(post.id); setShowDeleteDialog(true); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* AI Generate Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Article Generator</DialogTitle>
            <DialogDescription>Generate a single SEO-optimized article with AI-created featured image.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Topic (optional — AI will choose if blank)</Label>
              <Input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g., Top 5 Marvel cards that doubled in value" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={aiCategory} onValueChange={setAiCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Focus Keyword (SEO)</Label>
              <Input value={aiFocusKeyword} onChange={(e) => setAiFocusKeyword(e.target.value)} placeholder="e.g., Marvel card investment" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={aiAutoPublish} onCheckedChange={setAiAutoPublish} />
              <Label>Auto-publish immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAiDialog(false)}>Cancel</Button>
            <Button onClick={handleAiGenerate} disabled={generateArticle.isPending}>
              {generateArticle.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Generate Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> Bulk Article Generator</DialogTitle>
            <DialogDescription>Generate multiple articles scheduled at intervals. Great for launch day content blitz!</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Number of Articles</Label>
              <Input type="number" value={bulkCount} onChange={(e) => setBulkCount(Number(e.target.value))} min={1} max={24} />
              <p className="text-xs text-muted-foreground">Max 24 articles per batch</p>
            </div>
            <div className="space-y-2">
              <Label>Interval (minutes between each)</Label>
              <Input type="number" value={bulkInterval} onChange={(e) => setBulkInterval(Number(e.target.value))} min={15} />
              <p className="text-xs text-muted-foreground">60 = one per hour, 480 = three per day (every 8 hours)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>Cancel</Button>
            <Button onClick={handleBulkGenerate} disabled={bulkGenerate.isPending}>
              {bulkGenerate.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
              Generate {bulkCount} Articles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deletingId) {
                  await deletePost.mutateAsync({ id: deletingId });
                  utils.adminBlog.list.invalidate();
                  toast.success("Blog post deleted");
                }
                setShowDeleteDialog(false);
                setDeletingId(null);
              }}
              disabled={deletePost.isPending}
            >
              {deletePost.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
