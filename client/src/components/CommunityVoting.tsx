/**
 * CommunityVoting — "Shape The Next Drop" section
 * Lets collectors vote on what products/features they want next
 * and submit their own suggestions. Builds community ownership.
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Vote, MessageSquarePlus, Send, ThumbsUp, Sparkles,
  Users, TrendingUp, Crown, ChevronDown, Loader2,
  Megaphone, Lightbulb, CheckCircle2, Star
} from "lucide-react";

// Fingerprint for anonymous vote tracking
function getFingerprint(): string {
  let fp = localStorage.getItem("nlf_fp");
  if (!fp) {
    fp = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("nlf_fp", fp);
  }
  return fp;
}

const CATEGORY_LABELS: Record<string, string> = {
  product: "New Product",
  feature: "Feature",
  set: "Card Set",
  format: "Format",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  product: "bg-primary/10 text-primary border-primary/30",
  feature: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  set: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  format: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  other: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
};

export default function CommunityVoting() {
  const fingerprint = useMemo(() => getFingerprint(), []);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState<string>("product");
  const [votedPolls, setVotedPolls] = useState<Record<number, number>>({});

  // Fetch active polls
  const { data: polls, isLoading: pollsLoading, refetch: refetchPolls } = trpc.public.community.activePolls.useQuery();

  // Fetch planned suggestions (community ideas the admin has approved)
  const { data: plannedSuggestions } = trpc.public.community.suggestions.useQuery();

  // Mutations
  const voteMutation = trpc.public.community.vote.useMutation({
    onSuccess: () => {
      refetchPolls();
      toast.success("Vote recorded! Thanks for your input.");
    },
    onError: (err) => {
      if (err.message.includes("already voted")) {
        toast.info("You've already voted on this poll.");
      } else {
        toast.error("Failed to record vote. Try again.");
      }
    },
  });

  const suggestionMutation = trpc.public.community.submitSuggestion.useMutation({
    onSuccess: () => {
      toast.success("Suggestion submitted! We'll review it soon.");
      setSuggestion("");
      setDisplayName("");
      setShowSuggestionForm(false);
    },
    onError: () => {
      toast.error("Failed to submit suggestion. Try again.");
    },
  });

  // Check if user has voted on each poll
  useEffect(() => {
    if (!polls) return;
    const checkVotes = async () => {
      const voted: Record<number, number> = {};
      // Check localStorage for vote records
      polls.forEach((poll: any) => {
        const stored = localStorage.getItem(`nlf_vote_${poll.id}`);
        if (stored) voted[poll.id] = parseInt(stored);
      });
      setVotedPolls(voted);
    };
    checkVotes();
  }, [polls]);

  const handleVote = useCallback((pollId: number, optionId: number) => {
    if (votedPolls[pollId]) {
      toast.info("You've already voted on this poll.");
      return;
    }
    voteMutation.mutate({ pollId, optionId, fingerprint });
    // Optimistically mark as voted
    setVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
    localStorage.setItem(`nlf_vote_${pollId}`, optionId.toString());
  }, [votedPolls, fingerprint, voteMutation]);

  const handleSubmitSuggestion = () => {
    if (!suggestion.trim()) {
      toast.error("Please enter a suggestion.");
      return;
    }
    suggestionMutation.mutate({
      suggestion: suggestion.trim(),
      displayName: displayName.trim() || undefined,
      category: category as any,
    });
  };

  const hasPolls = polls && polls.length > 0;
  const hasPlannedSuggestions = plannedSuggestions && plannedSuggestions.length > 0;

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-950/10 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />

      <div className="container relative max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full mb-4">
            <Megaphone className="w-4 h-4 text-violet-400" />
            <span className="text-violet-400 text-sm font-bold tracking-wider">YOUR VOICE MATTERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            SHAPE THE <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">NEXT DROP</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            This is <span className="text-white font-semibold">your community</span>. Vote on what you want to see next, 
            suggest new ideas, and help us build the repacks you actually want to buy.
          </p>
        </div>

        {/* Community Stats Bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border">
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-sm"><span className="font-bold text-white">{polls?.reduce((acc: number, p: any) => acc + (p.totalVotes || 0), 0) || 0}</span> total votes</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border">
            <Vote className="w-4 h-4 text-violet-400" />
            <span className="text-sm"><span className="font-bold text-white">{polls?.length || 0}</span> active polls</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-sm"><span className="font-bold text-white">{hasPlannedSuggestions ? plannedSuggestions.length : 0}</span> community ideas planned</span>
          </div>
        </div>

        {/* Active Polls */}
        {pollsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          </div>
        ) : hasPolls ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {polls.map((poll: any) => (
              <PollCard
                key={poll.id}
                poll={poll}
                votedOptionId={votedPolls[poll.id]}
                onVote={handleVote}
                isVoting={voteMutation.isPending}
              />
            ))}
          </div>
        ) : (
          /* No polls yet — show a teaser */
          <div className="mb-12">
            <Card className="border-violet-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-violet-500/20">
                  <Vote className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Polls Coming Soon</h3>
                <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                  We're preparing the first community poll. In the meantime, submit your suggestions below — 
                  your ideas will shape what we vote on first!
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /> DC Comics?</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /> Star Wars?</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /> Pokémon?</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /> Sports?</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Planned Community Ideas */}
        {hasPlannedSuggestions && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Community Ideas We're Building</h3>
                <p className="text-sm text-muted-foreground">These suggestions came from collectors like you</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plannedSuggestions.map((s: any) => (
                <div key={s.id} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{s.suggestion}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">by {s.displayName || "Anonymous"}</span>
                        {s.category && (
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${CATEGORY_COLORS[s.category] || CATEGORY_COLORS.other}`}>
                            {CATEGORY_LABELS[s.category] || s.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestion Box */}
        <Card className="border-violet-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left: Info */}
              <div className="lg:w-1/3">
                <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4 border border-violet-500/20">
                  <MessageSquarePlus className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Got An Idea?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Tell us what you want to see next. New card sets? Different pack formats? 
                  Special themes? We read every suggestion and the best ones become reality.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span>Every suggestion is reviewed</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    <span>Top ideas become future polls</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Best suggestions get built</span>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:w-2/3 w-full">
                {!showSuggestionForm ? (
                  <button
                    onClick={() => setShowSuggestionForm(true)}
                    className="w-full p-6 rounded-xl border-2 border-dashed border-violet-500/30 hover:border-violet-500/60 
                             bg-violet-500/5 hover:bg-violet-500/10 transition-all duration-300 text-center group cursor-pointer"
                  >
                    <MessageSquarePlus className="w-8 h-8 text-violet-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-lg mb-1">Submit Your Suggestion</p>
                    <p className="text-sm text-muted-foreground">Click here to share your idea with the NLF community</p>
                  </button>
                ) : (
                  <div className="space-y-4">
                    {/* Category selector */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => setCategory(key)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                              category === key
                                ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                                : "bg-card border-border text-muted-foreground hover:border-violet-500/30"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Suggestion text */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Suggestion</label>
                      <textarea
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="I'd love to see a DC Comics repack with Batman chase cards..."
                        className="w-full p-4 rounded-xl bg-background border border-border focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 
                                 outline-none resize-none h-28 text-sm placeholder:text-muted-foreground/50"
                        maxLength={1000}
                      />
                      <div className="text-xs text-muted-foreground text-right mt-1">{suggestion.length}/1000</div>
                    </div>

                    {/* Display name */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name <span className="text-muted-foreground">(optional)</span></label>
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Anonymous Collector"
                        className="bg-background"
                        maxLength={100}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleSubmitSuggestion}
                        disabled={!suggestion.trim() || suggestionMutation.isPending}
                        className="gap-2 bg-violet-600 hover:bg-violet-700"
                      >
                        {suggestionMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Submit Suggestion
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setShowSuggestionForm(false); setSuggestion(""); }}
                        className="border-white/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ── Poll Card Component ──────────────────────────────────

function PollCard({ poll, votedOptionId, onVote, isVoting }: {
  poll: any;
  votedOptionId?: number;
  onVote: (pollId: number, optionId: number) => void;
  isVoting: boolean;
}) {
  const hasVoted = !!votedOptionId;
  const totalVotes = poll.totalVotes || poll.options?.reduce((acc: number, o: any) => acc + (o.voteCount || 0), 0) || 0;

  return (
    <Card className="border-violet-500/20 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-violet-500/40 transition-all">
      <CardContent className="p-6">
        {/* Poll Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            {poll.category && (
              <Badge variant="outline" className={`text-xs mb-2 ${CATEGORY_COLORS[poll.category] || CATEGORY_COLORS.other}`}>
                {CATEGORY_LABELS[poll.category] || poll.category}
              </Badge>
            )}
            <h3 className="text-lg font-bold">{poll.title}</h3>
            {poll.description && (
              <p className="text-sm text-muted-foreground mt-1">{poll.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 rounded-full shrink-0">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-bold text-violet-300">{totalVotes}</span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {poll.options?.map((option: any) => {
            const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
            const isSelected = votedOptionId === option.id;
            const isWinning = hasVoted && option.voteCount === Math.max(...(poll.options?.map((o: any) => o.voteCount || 0) || [0]));

            return (
              <button
                key={option.id}
                onClick={() => !hasVoted && onVote(poll.id, option.id)}
                disabled={hasVoted || isVoting}
                className={`w-full text-left rounded-xl border transition-all duration-300 overflow-hidden relative cursor-pointer
                  ${hasVoted
                    ? isSelected
                      ? "border-violet-500/50 bg-violet-500/10"
                      : "border-border bg-card/30"
                    : "border-border hover:border-violet-500/40 hover:bg-violet-500/5 bg-card/30"
                  }
                  ${!hasVoted && !isVoting ? "active:scale-[0.98]" : ""}
                `}
              >
                {/* Progress bar background */}
                {hasVoted && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                      isWinning ? "bg-violet-500/15" : "bg-white/5"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                <div className="relative p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Vote indicator */}
                    {!hasVoted ? (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                    ) : isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/20 shrink-0" />
                    )}

                    <div>
                      <span className={`text-sm font-medium ${isSelected ? "text-violet-300" : ""}`}>
                        {option.label}
                      </span>
                      {option.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Vote count / percentage */}
                  {hasVoted && (
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-bold ${isWinning ? "text-violet-400" : "text-muted-foreground"}`}>
                        {percentage}%
                      </span>
                      <p className="text-xs text-muted-foreground">{option.voteCount} votes</p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {hasVoted ? "Thanks for voting!" : "Click an option to vote"}
          </span>
          {hasVoted && totalVotes > 0 && (
            <span className="text-xs text-violet-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {totalVotes} total votes
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper to check if a poll has a clear leader
function isWinning(poll: any): boolean {
  if (!poll.options || poll.options.length === 0) return false;
  const counts = poll.options.map((o: any) => o.voteCount || 0);
  const max = Math.max(...counts);
  return max > 0 && counts.filter((c: number) => c === max).length === 1;
}
