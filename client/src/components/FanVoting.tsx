import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const REACTIONS = [
  { key: "loved", emoji: "💀", label: "Loved It" },
  { key: "fire", emoji: "🔥", label: "Action Was Insane" },
  { key: "meh", emoji: "😐", label: "Too Short" },
  { key: "thumbsdown", emoji: "👎", label: "Not For Me" },
] as const;

type ReactionKey = (typeof REACTIONS)[number]["key"];

function getVisitorId(): string {
  const key = "nlf_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

interface FanVotingProps {
  articleId: number;
  articleTitle?: string;
}

export default function FanVoting({ articleId, articleTitle }: FanVotingProps) {
  const [visitorId] = useState(() => getVisitorId());
  const [selectedReaction, setSelectedReaction] = useState<ReactionKey | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [animating, setAnimating] = useState<string | null>(null);

  // Fetch existing vote counts
  const { data: voteCounts, refetch: refetchVotes } = trpc.articles.getVotes.useQuery(
    { articleId },
    { staleTime: 10_000 }
  );

  // Fetch visitor's existing vote
  const { data: myVote } = trpc.articles.getMyVote.useQuery(
    { articleId, visitorId },
    { staleTime: 30_000 }
  );

  // Vote mutation
  const voteMutation = trpc.articles.vote.useMutation({
    onSuccess: () => {
      refetchVotes();
      setHasVoted(true);
      toast.success("Vote counted! Thanks for sharing your opinion.");
    },
    onError: () => {
      toast.error("Something went wrong. Try again!");
    },
  });

  // Set existing vote on load
  useEffect(() => {
    if (myVote) {
      setSelectedReaction(myVote as ReactionKey);
      setHasVoted(true);
    }
  }, [myVote]);

  const totalVotes = useMemo(() => {
    if (!voteCounts) return 0;
    return Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
  }, [voteCounts]);

  const handleVote = (reaction: ReactionKey) => {
    setAnimating(reaction);
    setSelectedReaction(reaction);
    setTimeout(() => setAnimating(null), 600);
    voteMutation.mutate({ articleId, reaction, visitorId });
  };

  const getPercentage = (key: string): number => {
    if (!voteCounts || totalVotes === 0) return 0;
    return Math.round(((voteCounts[key] || 0) / totalVotes) * 100);
  };

  const getCount = (key: string): number => {
    return voteCounts?.[key] || 0;
  };

  return (
    <div className="my-8 rounded-xl border border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-primary/10 bg-primary/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗳️</span>
          <h3 className="text-lg font-bold text-foreground tracking-wide uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Fan Vote
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {hasVoted ? "Thanks for voting! Here's what everyone thinks:" : "How did you feel about this one? Cast your vote!"}
        </p>
      </div>

      {/* Voting Buttons */}
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {REACTIONS.map((r) => {
            const isSelected = selectedReaction === r.key;
            const pct = getPercentage(r.key);
            const count = getCount(r.key);
            const isAnimating = animating === r.key;

            return (
              <button
                key={r.key}
                onClick={() => handleVote(r.key)}
                disabled={voteMutation.isPending}
                className={`
                  relative group flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300
                  ${isSelected
                    ? "border-primary bg-primary/15 shadow-lg shadow-primary/20 scale-[1.02]"
                    : "border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5"
                  }
                  ${isAnimating ? "animate-bounce" : ""}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {/* Emoji */}
                <span className={`text-3xl sm:text-4xl transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}>
                  {r.emoji}
                </span>

                {/* Label */}
                <span className={`text-xs sm:text-sm font-semibold text-center leading-tight ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                  {r.label}
                </span>

                {/* Results bar (shows after voting or when votes exist) */}
                {(hasVoted || totalVotes > 0) && (
                  <div className="w-full mt-2">
                    <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-muted-foreground font-medium">{pct}%</span>
                      <span className="text-[10px] text-muted-foreground">{count} vote{count !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Total votes */}
        {totalVotes > 0 && (
          <div className="mt-4 text-center">
            <span className="text-xs text-muted-foreground">
              {totalVotes.toLocaleString()} total vote{totalVotes !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
