/**
 * ArticlePollWidget — community poll embedded in articles.
 * One vote per visitor (tracked by localStorage fingerprint).
 * Shows live results with animated progress bars after voting.
 * Includes share buttons so users can post their vote to Twitter/X and Facebook.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, BarChart2, Share2, Twitter, Facebook } from "lucide-react";

function getOrCreateVisitorId(): string {
  const key = "nlf_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

/** Strip emoji from option text for cleaner share messages */
function stripEmoji(text: string): string {
  // Remove common emoji ranges using surrogate pairs (ES5-compatible)
  return text
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "") // surrogate pairs (emoji)
    .replace(/[\u2600-\u27BF]/g, "") // misc symbols
    .replace(/[\uFE00-\uFE0F]/g, "") // variation selectors
    .trim();
}

function buildShareUrls(question: string, chosenOption: string, articleUrl: string) {
  const cleanOption = stripEmoji(chosenOption);
  const tweetText = `I voted on the NLF community poll!\n\n"${question}"\n\nMy pick: ${cleanOption}\n\nCast your vote 👇`;
  const fbText = `I just voted in the NLF community poll — "${question}". My pick: ${cleanOption}. Come vote and see the results!`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(articleUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(fbText)}`;

  return { twitterUrl, facebookUrl };
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
  const [articleUrl] = useState(() =>
    typeof window !== "undefined" ? window.location.href : ""
  );

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

  const chosenOptionText =
    selectedOption !== null ? poll.options[selectedOption] ?? "" : "";
  const { twitterUrl, facebookUrl } = buildShareUrls(
    poll.question,
    chosenOptionText,
    articleUrl
  );

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

      {/* Footer — share buttons shown after voting */}
      {hasVoted && selectedOption !== null && (
        <div className="px-5 pb-5 border-t border-emerald-500/10 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-xs text-zinc-400 font-medium">Share your vote</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Twitter / X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 transition-all text-sm font-medium text-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Post on X
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/40 hover:bg-[#1877F2]/20 hover:border-[#1877F2]/70 transition-all text-sm font-medium text-[#4a9eff]"
            >
              <Facebook className="w-4 h-4" />
              Share on Facebook
            </a>
          </div>
          <p className="text-xs text-zinc-600 mt-3 text-center">
            Results update in real time. 🎯
          </p>
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
