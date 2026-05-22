import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  ImagePlus,
  RefreshCw,
  Send,
  Trash2,
  Sparkles,
  Loader2,
  Eye,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Wand2,
} from "lucide-react";

type Tone = "hype" | "mystery" | "casual" | "educational" | "funny";

export default function SocialDraftsManager() {
  const [selectedTone, setSelectedTone] = useState<Tone>("hype");
  const [expandedDraft, setExpandedDraft] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<number | null>(null);
  const [editFb, setEditFb] = useState("");
  const [editIg, setEditIg] = useState("");
  const [editComment, setEditComment] = useState("");
  const [activeTab, setActiveTab] = useState<"unposted" | "drafts" | "published">("unposted");

  // Queries
  const unpostedArticles = trpc.socialDrafts.unpostedArticles.useQuery();
  const drafts = trpc.socialDrafts.listDrafts.useQuery({ status: "all" });
  const publishedHistory = trpc.socialDrafts.publishedHistory.useQuery();

  // Mutations
  const generateDraft = trpc.socialDrafts.generateDraft.useMutation({
    onSuccess: (data) => {
      toast.success(`Draft generated for "${data.articleTitle}"`);
      drafts.refetch();
      unpostedArticles.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const regenerateImage = trpc.socialDrafts.regenerateImage.useMutation({
    onSuccess: () => {
      toast.success("New image generated!");
      drafts.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const regenerateContent = trpc.socialDrafts.regenerateContent.useMutation({
    onSuccess: () => {
      toast.success("Content regenerated!");
      drafts.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateDraft = trpc.socialDrafts.updateDraft.useMutation({
    onSuccess: () => {
      toast.success("Draft updated!");
      setEditingDraft(null);
      drafts.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const publishDraft = trpc.socialDrafts.publishDraft.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Published to social media!");
      } else {
        toast.error(`Partial publish: ${data.errors?.join(", ")}`);
      }
      drafts.refetch();
      publishedHistory.refetch();
      unpostedArticles.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteDraft = trpc.socialDrafts.deleteDraft.useMutation({
    onSuccess: () => {
      toast.success("Draft deleted");
      drafts.refetch();
      unpostedArticles.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const pendingDrafts = drafts.data?.filter((d) => d.status !== "published") || [];
  const publishedDrafts = publishedHistory.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Facebook className="w-6 h-6 text-blue-400" />
            Social Media Drafts
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate AI content + images, preview, and publish to Facebook & Instagram
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
            {unpostedArticles.data?.length || 0} unposted
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400">
            {pendingDrafts.length} drafts
          </Badge>
          <Badge variant="outline" className="border-green-500/30 text-green-400">
            {publishedDrafts.length} published
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === "unposted" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("unposted")}
          className="gap-1.5"
        >
          <Sparkles className="w-4 h-4" /> Unposted Articles ({unpostedArticles.data?.length || 0})
        </Button>
        <Button
          variant={activeTab === "drafts" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("drafts")}
          className="gap-1.5"
        >
          <Eye className="w-4 h-4" /> Drafts ({pendingDrafts.length})
        </Button>
        <Button
          variant={activeTab === "published" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("published")}
          className="gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" /> Published ({publishedDrafts.length})
        </Button>
      </div>

      {/* UNPOSTED ARTICLES TAB */}
      {activeTab === "unposted" && (
        <div className="space-y-3">
          {unpostedArticles.isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {unpostedArticles.data?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              All published articles have social media drafts!
            </div>
          )}
          {unpostedArticles.data?.map((article) => (
            <Card key={article.id} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {article.featuredImageUrl && (
                    <img
                      src={article.featuredImageUrl}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{article.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      {article.publishedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select
                      value={selectedTone}
                      onValueChange={(v) => setSelectedTone(v as Tone)}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hype">Hype</SelectItem>
                        <SelectItem value="mystery">Mystery</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={() =>
                        generateDraft.mutate({ articleId: article.id, tone: selectedTone })
                      }
                      disabled={generateDraft.isPending}
                      className="gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      {generateDraft.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* DRAFTS TAB */}
      {activeTab === "drafts" && (
        <div className="space-y-4">
          {pendingDrafts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No drafts yet. Generate some from the Unposted Articles tab!
            </div>
          )}
          {pendingDrafts.map((draft) => (
            <Card
              key={draft.id}
              className={`border-border/50 ${
                draft.status === "failed" ? "border-red-500/30" : "border-border/50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">Article #{draft.articleId}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        draft.status === "ready"
                          ? "border-green-500/30 text-green-400"
                          : draft.status === "failed"
                          ? "border-red-500/30 text-red-400"
                          : "border-amber-500/30 text-amber-400"
                      }
                    >
                      {draft.status === "ready" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {draft.status === "failed" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {draft.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {draft.tone}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedDraft(expandedDraft === draft.id ? null : draft.id)
                    }
                  >
                    {expandedDraft === draft.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {/* Always show image preview and action buttons */}
              <CardContent className="space-y-4">
                {/* Image Preview */}
                {draft.generatedImageUrl && (
                  <div className="relative">
                    <img
                      src={draft.generatedImageUrl}
                      alt="Generated social media image"
                      className="w-full max-h-64 object-cover rounded-lg border border-border/30"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 gap-1 bg-background/80 backdrop-blur-sm"
                      onClick={() => regenerateImage.mutate({ draftId: draft.id })}
                      disabled={regenerateImage.isPending}
                    >
                      {regenerateImage.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="w-3.5 h-3.5" />
                      )}
                      New Image
                    </Button>
                  </div>
                )}

                {/* Expanded Content */}
                {expandedDraft === draft.id && (
                  <div className="space-y-4">
                    {/* Facebook Post */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Facebook className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-blue-400 uppercase">
                          Facebook Post
                        </span>
                      </div>
                      {editingDraft === draft.id ? (
                        <Textarea
                          value={editFb}
                          onChange={(e) => setEditFb(e.target.value)}
                          className="min-h-[200px] text-sm"
                        />
                      ) : (
                        <div className="bg-muted/30 border border-border/30 rounded-lg p-3 text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                          {draft.fbPostContent}
                        </div>
                      )}
                    </div>

                    {/* Instagram Caption */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <span className="text-xs font-medium text-pink-400 uppercase">
                          Instagram Caption
                        </span>
                      </div>
                      {editingDraft === draft.id ? (
                        <Textarea
                          value={editIg}
                          onChange={(e) => setEditIg(e.target.value)}
                          className="min-h-[150px] text-sm"
                        />
                      ) : (
                        <div className="bg-muted/30 border border-border/30 rounded-lg p-3 text-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                          {draft.igCaption}
                        </div>
                      )}
                    </div>

                    {/* First Comment */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-amber-400 uppercase">
                          First Comment
                        </span>
                      </div>
                      {editingDraft === draft.id ? (
                        <Textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                      ) : (
                        <div className="bg-muted/30 border border-border/30 rounded-lg p-3 text-sm whitespace-pre-wrap">
                          {draft.firstComment}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/30">
                  {editingDraft === draft.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          updateDraft.mutate({
                            draftId: draft.id,
                            fbPostContent: editFb,
                            igCaption: editIg,
                            firstComment: editComment,
                          });
                        }}
                        disabled={updateDraft.isPending}
                        className="gap-1.5"
                      >
                        {updateDraft.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingDraft(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingDraft(draft.id);
                          setEditFb(draft.fbPostContent || "");
                          setEditIg(draft.igCaption || "");
                          setEditComment(draft.firstComment || "");
                          if (expandedDraft !== draft.id) setExpandedDraft(draft.id);
                        }}
                        className="gap-1.5"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          regenerateContent.mutate({
                            draftId: draft.id,
                            tone: selectedTone,
                          })
                        }
                        disabled={regenerateContent.isPending}
                        className="gap-1.5"
                      >
                        {regenerateContent.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        Regen Content
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          publishDraft.mutate({
                            draftId: draft.id,
                            publishFb: true,
                            publishIg: true,
                          })
                        }
                        disabled={publishDraft.isPending}
                        className="gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {publishDraft.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        Publish FB + IG
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm("Delete this draft?")) {
                            deleteDraft.mutate({ draftId: draft.id });
                          }
                        }}
                        className="gap-1.5 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PUBLISHED TAB */}
      {activeTab === "published" && (
        <div className="space-y-3">
          {publishedDrafts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No published posts yet.
            </div>
          )}
          {publishedDrafts.map((draft) => (
            <Card key={draft.id} className="bg-card/50 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {draft.generatedImageUrl && (
                    <img
                      src={draft.generatedImageUrl}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">Article #{draft.articleId}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {draft.fbPostId && (
                        <Badge
                          variant="outline"
                          className="text-xs border-blue-500/30 text-blue-400"
                        >
                          <Facebook className="w-3 h-3 mr-1" /> Posted
                        </Badge>
                      )}
                      {draft.igMediaId && (
                        <Badge
                          variant="outline"
                          className="text-xs border-pink-500/30 text-pink-400"
                        >
                          <Instagram className="w-3 h-3 mr-1" /> Posted
                        </Badge>
                      )}
                      {draft.publishedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(draft.publishedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
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
