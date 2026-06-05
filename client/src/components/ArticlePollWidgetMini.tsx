/**
 * ArticlePollWidgetMini — compact poll teaser shown near the top of the article.
 * Shows the question and a quick horizontal row of vote buttons.
 * After voting, shows a mini bar chart. Links down to the full poll widget.
 * Shares the same poll data as ArticlePollWidget.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { BarChart2, ChevronDown } from "lucide-react";

function getOrCreateVisitorId(): string {
  const key = "nlf_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

interface ArticlePollWidgetMiniProps {
  articleSlug: string;
}

export default function ArticlePollWidgetMini({ articleSlug }: ArticlePollWidgetMiniProps) {
  const [visitorId] = useState(() => getOrCreateVisitorId());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [localCounts, setLocalCounts] = useState<number[] | null>(null);
  const [localTotal, setLocalTotal] = useState<number>(0);

  const { data: poll, isLoading } = trpc.polls.getByArticle.useQuery({ articleSlug });

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
  const winnerIndex = total > 0 ? counts.indexOf(Math.max(...counts)) : -1;

  const handleVote = (index: number) => {
    if (hasVoted) return;
    setSelectedOption(index);
    voteMutation.mutate({ pollId: poll.id, optionIndex: index, visitorId });
  };

  const scrollToFullPoll = () => {
    const el = document.getElementById("article-poll-full");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-red-700/50 shadow-lg shadow-red-900/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-700 to-red-900 px-4 py-2.5 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-red-200" />
        <span className="text-red-100 text-xs font-black tracking-widest uppercase">Community Poll</span>
        {total > 0 && (
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-200 text-xs font-bold">{total.toLocaleString()} votes</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="bg-gradient-to-b from-red-950 to-zinc-950 px-4 py-3">
        {/* Question — compact */}
        <p className="text-white font-bold text-sm leading-snug mb-3">{poll.question}</p>

        {/* Options — compact rows */}
        <div className="space-y-2">
          {poll.options.map((option, i) => {
            const count = counts[i] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isSelected = selectedOption === i;
            const isWinner = winnerIndex === i;

            return (
              <button
                key={i}
                onClick={() => handleVote(i)}
                disabled={hasVoted || voteMutation.isPending}
                className={`relative w-full text-left rounded-lg overflow-hidden border transition-all duration-150 ${
                  hasVoted
                    ? isSelected
                      ? "border-red-400/70 bg-red-800/30"
                      : isWinner
                      ? "border-yellow-500/40 bg-yellow-900/10"
                      : "border-red-900/40 bg-red-950/50"
                    : "border-red-700/30 bg-red-900/20 hover:border-red-500 hover:bg-red-800/30 cursor-pointer"
                }`}
              >
                {/* Progress fill */}
                {hasVoted && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                      isWinner ? "bg-yellow-500/10" : isSelected ? "bg-red-500/15" : "bg-red-900/15"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between px-3 py-2 gap-2">
                  <span className={`text-xs font-semibold leading-snug flex-1 ${
                    isSelected ? "text-red-200" : hasVoted ? isWinner ? "text-yellow-200" : "text-zinc-400" : "text-white"
                  }`}>
                    {option}
                  </span>
                  {hasVoted && (
                    <span className={`text-xs font-black shrink-0 ${
                      isWinner ? "text-yellow-400" : isSelected ? "text-red-300" : "text-zinc-600"
                    }`}>
                      {pct}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll to full poll */}
        <button
          onClick={scrollToFullPoll}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-red-400/70 hover:text-red-300 transition-colors"
        >
          <span>See full results below</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
