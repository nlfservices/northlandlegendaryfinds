import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ICON_HULK = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/vote-hulk-smash-LvEJ9sdaX8HXtgsRE9jHda.webp";
const ICON_MJOLNIR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/vote-mjolnir-nhKZ9cfYJagRVeLScRQRBp.webp";
const ICON_TIME_STONE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/vote-time-stone-c7shjpNVbQjS4Zo2R98WeE.webp";
const ICON_GAUNTLET = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/vote-thanos-gauntlet-gurG2wRKw3f4Woc6YqquUp.webp";

const REACTIONS = [
  { key: "loved", icon: ICON_HULK, label: "Hulk Smash" },
  { key: "fire", icon: ICON_MJOLNIR, label: "Worthy" },
  { key: "meh", icon: ICON_TIME_STONE, label: "Needed More Time" },
  { key: "thumbsdown", icon: ICON_GAUNTLET, label: "Not For Me" },
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
  /** Compact mode for use in listing cards (Voting Grounds) */
  compact?: boolean;
}

export default function FanVoting({ articleId, articleTitle, compact = false }: FanVotingProps) {
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

  // Compact mode for Voting Grounds cards
  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {REACTIONS.map((r) => {
          const isSelected = selectedReaction === r.key;
          const pct = getPercentage(r.key);

          return (
            <button
              key={r.key}
              onClick={() => handleVote(r.key)}
              disabled={voteMutation.isPending}
              className={`
                relative flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200
                ${isSelected
                  ? "border-white bg-white/20 scale-[1.05]"
                  : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <img src={r.icon} alt={r.label} className="w-7 h-7 object-contain" />
              <span className="text-[10px] font-semibold text-white/80 text-center leading-tight">{r.label}</span>
              {(hasVoted || totalVotes > 0) && (
                <span className="text-[10px] text-white/60 font-medium">{pct}%</span>
              )}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Full mode for article pages
  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-2xl shadow-red-900/30">
      {/* Red gradient background */}
      <div className="bg-gradient-to-br from-red-700 via-red-600 to-red-800 relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Header */}
        <div className="relative px-5 sm:px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <span className="text-xl">🗳️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Fan Vote
              </h3>
              <p className="text-sm text-white/75">
                {hasVoted ? "Thanks for voting! Here's what everyone thinks:" : "How did you feel about this one? Cast your vote!"}
              </p>
            </div>
          </div>
        </div>

        {/* Voting Buttons */}
        <div className="relative px-5 sm:px-6 pb-5 pt-2">
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
                    relative group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm
                    ${isSelected
                      ? "border-white bg-white/25 shadow-lg shadow-black/20 scale-[1.03]"
                      : "border-white/20 bg-white/10 hover:border-white/50 hover:bg-white/20"
                    }
                    ${isAnimating ? "animate-bounce" : ""}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {/* Icon */}
                  <img
                    src={r.icon}
                    alt={r.label}
                    className={`w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}
                  />

                  {/* Label */}
                  <span className={`text-xs sm:text-sm font-bold text-center leading-tight ${isSelected ? "text-white" : "text-white/80"}`}>
                    {r.label}
                  </span>

                  {/* Results bar */}
                  {(hasVoted || totalVotes > 0) && (
                    <div className="w-full mt-1">
                      <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white transition-all duration-700 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[11px] text-white/90 font-bold">{pct}%</span>
                        <span className="text-[10px] text-white/60">{count} vote{count !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
              <span className="text-sm text-white/70 font-medium">
                {totalVotes.toLocaleString()} total vote{totalVotes !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
