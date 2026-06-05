/**
 * ArticlePollWidget — community poll embedded in articles.
 * One vote per visitor (tracked by localStorage fingerprint).
 * Shows live results with animated progress bars after voting.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BarChart2 } from "lucide-react";

function getOrCreateVisitorId(): string {
  const key = "nlf_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

interface ArticlePollWidgetProps {
  articleSlug: string;
}

export default function ArticlePollWidget({ articleSlug }: ArticlePollWidgetProps) {
  const [visitorId] = useState(() => getOrCreateVisitorId());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [localCounts, setLocalCounts] = useState<number[] | null>(null);
  const [localTotal, setLocalTotal] = useState<number>(0);

  const { data: poll, isLoading } = trpc.polls.getByArticle.useQuery({ articleSlug });

  // Check if already voted on mount
  const { data: voteStatus } = trpc.polls.hasVoted.useQuery(
    { pollId: poll?.id ?? 0, visitorId },
    { enabled: !!poll?.id }
  );

  useEffect(() => {
    if (voteStatus?.voted) {
      setHasVoted(true);
      setSelectedOption(voteStatus.optionIndex ?? null);
    }
  }, [voteStatus]);

  const voteMutation = trpc.polls.vote.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setHasVoted(true);
        setLocalCounts(data.counts);
        setLocalTotal(data.totalVotes);
      } else if (data.alreadyVoted) {
        setHasVoted(true);
      }
    },
  });

  if (isLoading || !poll) return null;

  const counts = localCounts ?? poll.counts;
  const total = localTotal || poll.totalVotes;

  const handleVote = (index: number) => {
    if (hasVoted) return;
    setSelectedOption(index);
    voteMutation.mutate({ pollId: poll.id, optionIndex: index, visitorId });
  };

  return (
    <div className="my-8 rounded-xl border border-emerald-500/30 bg-black/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-5 py-3 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Community Poll</span>
        {total > 0 && (
          <span className="ml-auto text-xs text-zinc-400">{total.toLocaleString()} vote{total !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Question */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-white font-bold text-base leading-snug">{poll.question}</p>
      </div>

      {/* Options */}
      <div className="px-5 pb-5 space-y-3 mt-2">
        {poll.options.map((option, i) => {
          const count = counts[i] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isSelected = selectedOption === i;
          const isWinner = hasVoted && counts.indexOf(Math.max(...counts)) === i && total > 0;

          return (
            <button
              key={i}
              onClick={() => handleVote(i)}
              disabled={hasVoted || voteMutation.isPending}
              className={`relative w-full text-left rounded-lg overflow-hidden border transition-all duration-200 ${
                hasVoted
                  ? isSelected
                    ? "border-emerald-400 bg-emerald-500/10"
                    : "border-zinc-700 bg-zinc-900/50"
                  : "border-zinc-600 bg-zinc-900/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer"
              }`}
            >
              {/* Progress bar background */}
              {hasVoted && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                    isWinner ? "bg-emerald-500/20" : "bg-zinc-700/30"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative flex items-center justify-between px-4 py-3 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {hasVoted && isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {(!hasVoted || !isSelected) && (
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                      hasVoted ? "border-zinc-600" : "border-zinc-500"
                    }`} />
                  )}
                  <span className={`text-sm font-medium truncate ${
                    isSelected ? "text-emerald-300" : hasVoted ? "text-zinc-300" : "text-white"
                  }`}>
                    {option}
                  </span>
                </div>
                {hasVoted && (
                  <span className={`text-sm font-bold shrink-0 ${
                    isWinner ? "text-emerald-400" : "text-zinc-400"
                  }`}>
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {hasVoted && (
        <div className="px-5 pb-4 text-xs text-zinc-500 text-center">
          Thanks for voting! Results update in real time. 🎯
        </div>
      )}
      {!hasVoted && (
        <div className="px-5 pb-4 text-xs text-zinc-600 text-center">
          Cast your vote — results revealed instantly
        </div>
      )}
    </div>
  );
}
