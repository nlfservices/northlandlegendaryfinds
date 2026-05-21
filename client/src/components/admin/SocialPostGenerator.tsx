import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, CheckCircle, Facebook, Instagram, Sparkles, RefreshCw, Send, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Tone = "hype" | "mystery" | "casual" | "educational" | "funny";

const TONE_OPTIONS: { value: Tone; label: string; emoji: string }[] = [
  { value: "hype", label: "Hype / FOMO", emoji: "🔥" },
  { value: "mystery", label: "Mystery / Teasing", emoji: "👀" },
  { value: "casual", label: "Casual / Friendly", emoji: "💬" },
  { value: "educational", label: "Educational / Value", emoji: "📊" },
  { value: "funny", label: "Funny / Relatable", emoji: "😂" },
];

export default function SocialPostGenerator() {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [selectedTone, setSelectedTone] = useState<Tone>("hype");
  const [generatedPost, setGeneratedPost] = useState<string>("");
  const [articleUrl, setArticleUrl] = useState<string>("");
  const [articleImage, setArticleImage] = useState<string | null>(null);
  const [variations, setVariations] = useState<{ tone: string; post: string }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Fetch all articles for the dropdown
  const { data: articles, isLoading: articlesLoading } = trpc.adminArticles.list.useQuery();

  // Check Facebook configuration status
  const { data: fbStatus } = trpc.socialPosts.facebookStatus.useQuery();
  // Check Instagram configuration status
  const { data: igStatus } = trpc.socialPosts.instagramStatus.useQuery();

  // Single post generation
  const generateMutation = trpc.socialPosts.generateFromArticle.useMutation({
    onSuccess: (data) => {
      setGeneratedPost(data.post);
      setArticleUrl(data.articleUrl);
      setArticleImage(data.articleImage);
      setVariations([]);
      toast.success("Facebook post generated!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate post");
    },
  });

  // Multiple variations
  const variationsMutation = trpc.socialPosts.generateVariations.useMutation({
    onSuccess: (data) => {
      setVariations(data.variations);
      setArticleUrl(data.articleUrl);
      setGeneratedPost("");
      toast.success(`${data.variations.length} variations generated!`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate variations");
    },
  });

  // Publish to Facebook
  const publishMutation = trpc.socialPosts.publishToFacebook.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Published to Facebook!", {
          description: `Post ID: ${data.postId}`,
        });
      } else {
        toast.error(data.error || "Failed to publish");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish to Facebook");
    },
  });

  // Publish to Instagram
  const publishIgMutation = trpc.socialPosts.publishToInstagram.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Published to Instagram!", {
          description: `Media ID: ${data.mediaId}`,
        });
      } else {
        toast.error(data.error || "Failed to publish to Instagram");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish to Instagram");
    },
  });

  const handleGenerate = () => {
    if (!selectedArticleId) {
      toast.error("Please select an article first");
      return;
    }
    generateMutation.mutate({
      articleId: selectedArticleId,
      tone: selectedTone,
      includeHashtags: true,
      includeEmoji: true,
      includeLink: true,
    });
  };

  const handleGenerateVariations = () => {
    if (!selectedArticleId) {
      toast.error("Please select an article first");
      return;
    }
    variationsMutation.mutate({
      articleId: selectedArticleId,
      count: 3,
    });
  };

  const handlePublishToFacebook = (postText: string) => {
    publishMutation.mutate({
      message: postText,
      link: articleUrl || undefined,
      photoUrl: articleImage || undefined,
    });
  };

  const handlePublishToInstagram = (postText: string) => {
    if (!articleImage) {
      toast.error("Instagram requires an image. Select an article with a featured image.");
      return;
    }
    publishIgMutation.mutate({
      caption: postText,
      imageUrl: articleImage,
    });
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const isGenerating = generateMutation.isPending || variationsMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
          <Facebook className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Social Post Generator</h2>
          <p className="text-sm text-muted-foreground">Generate and publish Facebook posts from your articles</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className={`border ${fbStatus?.configured ? "border-green-500/30 bg-green-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-3">
              {fbStatus?.configured ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-green-400">Facebook Connected</span>
                    <span className="text-xs text-muted-foreground ml-2">Auto-publish enabled</span>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-yellow-400">Facebook Not Connected</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className={`border ${igStatus?.configured ? "border-green-500/30 bg-green-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-3">
              {igStatus?.configured ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-green-400">Instagram Connected</span>
                    <span className="text-xs text-muted-foreground ml-2">Auto-publish enabled</span>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-yellow-400">Instagram Not Connected</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6 space-y-4">
          {/* Article selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Article</label>
            <Select
              value={selectedArticleId?.toString() || ""}
              onValueChange={(val) => setSelectedArticleId(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={articlesLoading ? "Loading articles..." : "Choose an article..."} />
              </SelectTrigger>
              <SelectContent>
                {articles?.map((article: any) => (
                  <SelectItem key={article.id} value={article.id.toString()}>
                    <span className="truncate">{article.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tone selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tone / Style</label>
            <Select value={selectedTone} onValueChange={(val) => setSelectedTone(val as Tone)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.emoji} {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleGenerate}
              disabled={!selectedArticleId || isGenerating}
              className="flex-1"
            >
              {generateMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Generate Post</>
              )}
            </Button>
            <Button
              onClick={handleGenerateVariations}
              disabled={!selectedArticleId || isGenerating}
              variant="outline"
              className="flex-1"
            >
              {variationsMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> 3 Variations</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Single Generated Post */}
      {generatedPost && (
        <PostCard
          title={`Generated Post (${selectedTone})`}
          post={generatedPost}
          index={-1}
          copiedIndex={copiedIndex}
          onCopy={copyToClipboard}
          onPublishFb={fbStatus?.configured ? handlePublishToFacebook : undefined}
          onPublishIg={igStatus?.configured ? handlePublishToInstagram : undefined}
          isPublishingFb={publishMutation.isPending}
          isPublishingIg={publishIgMutation.isPending}
          hasImage={!!articleImage}
        />
      )}

      {/* Multiple Variations */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Post Variations (pick your favorite)</h3>
          {variations.map((variation, index) => (
            <PostCard
              key={index}
              title={`Variation ${index + 1}`}
              tone={variation.tone}
              post={variation.post}
              index={index}
              copiedIndex={copiedIndex}
              onCopy={copyToClipboard}
              onPublishFb={fbStatus?.configured ? handlePublishToFacebook : undefined}
              onPublishIg={igStatus?.configured ? handlePublishToInstagram : undefined}
              isPublishingFb={publishMutation.isPending}
              isPublishingIg={publishIgMutation.isPending}
              hasImage={!!articleImage}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!generatedPost && variations.length === 0 && !isGenerating && (
        <Card className="bg-card/50 border-dashed border-border">
          <CardContent className="py-12 text-center">
            <Facebook className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Select an article and generate a Facebook post to get started
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              {fbStatus?.configured
                ? "Posts can be published directly to your Facebook Page or copied to clipboard"
                : "Posts are generated with AI and ready to copy-paste to Facebook"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** Reusable card for displaying a generated post with Copy + Publish actions */
function PostCard({
  title,
  tone,
  post,
  index,
  copiedIndex,
  onCopy,
  onPublishFb,
  onPublishIg,
  isPublishingFb,
  isPublishingIg,
  hasImage,
}: {
  title: string;
  tone?: string;
  post: string;
  index: number;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
  onPublishFb?: (text: string) => void;
  onPublishIg?: (text: string) => void;
  isPublishingFb?: boolean;
  isPublishingIg?: boolean;
  hasImage?: boolean;
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-400" />
            {tone && (
              <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-medium uppercase">
                {tone}
              </span>
            )}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCopy(post, index)}
              className="gap-1.5"
            >
              {copiedIndex === index ? (
                <><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </Button>
            {onPublishFb ? (
              <Button
                size="sm"
                onClick={() => onPublishFb(post)}
                disabled={isPublishingFb}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPublishingFb ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...</>
                ) : (
                  <><Facebook className="w-3.5 h-3.5" /> Publish to FB</>
                )}
              </Button>
            ) : (
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Facebook
              </a>
            )}
            {onPublishIg ? (
              <Button
                size="sm"
                onClick={() => onPublishIg(post)}
                disabled={isPublishingIg || !hasImage}
                className="gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                title={!hasImage ? "Instagram requires an article with a featured image" : undefined}
              >
                {isPublishingIg ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...</>
                ) : (
                  <><Instagram className="w-3.5 h-3.5" /> Publish to IG</>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 border border-border rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed font-normal">
          {post}
        </div>
      </CardContent>
    </Card>
  );
}
