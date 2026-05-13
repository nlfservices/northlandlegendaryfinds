import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, CheckCircle, Facebook, Sparkles, RefreshCw } from "lucide-react";
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
  const [variations, setVariations] = useState<{ tone: string; post: string }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Fetch all articles for the dropdown
  const { data: articles, isLoading: articlesLoading } = trpc.adminArticles.list.useQuery();

  // Single post generation
  const generateMutation = trpc.socialPosts.generateFromArticle.useMutation({
    onSuccess: (data) => {
      setGeneratedPost(data.post);
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
      setGeneratedPost("");
      toast.success(`${data.variations.length} variations generated!`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate variations");
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
          <p className="text-sm text-muted-foreground">Generate ready-to-copy Facebook posts from your articles</p>
        </div>
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
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400" />
                Generated Post ({selectedTone})
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generatedPost, -1)}
                className="gap-2"
              >
                {copiedIndex === -1 ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 border border-border rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed font-normal">
              {generatedPost}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multiple Variations */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Post Variations (pick your favorite)</h3>
          {variations.map((variation, index) => (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-medium uppercase">
                      {variation.tone}
                    </span>
                    Variation {index + 1}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(variation.post, index)}
                    className="gap-2"
                  >
                    {copiedIndex === index ? (
                      <><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 border border-border rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed font-normal">
                  {variation.post}
                </div>
              </CardContent>
            </Card>
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
              Posts are generated with AI and ready to copy-paste to Facebook
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
