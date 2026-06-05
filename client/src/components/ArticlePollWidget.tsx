/**
 * ArticlePollWidget — community poll embedded in articles.
 * One vote per visitor (tracked by localStorage fingerprint).
 * All options visible at once — no scrolling required.
 * Red background, grid layout, live results with animated bars.
 * Share buttons after voting for Twitter/X and Facebook.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, BarChart2, Share2 } from "lucide-react";

function getOrCreateVisitorId(): string {
  const key = "nlf_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function stripEmoji(text: string): string {
  return text
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
    .replace(/[\u2600-\u27BF]/g, "")
    .replace(/[\uFE00-\uFE0F]/g, "")
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
  const maxCount = total > 0 ? Math.max(...counts) : 0;
  const winnerIndex = total > 0 ? counts.indexOf(maxCount) : -1;

  const handleVote = (index: number) => {
    if (hasVoted) return;
    setSelectedOption(index);
    voteMutation.mutate({ pollId: poll.id, optionIndex: index, visitorId });
  };

  const chosenOptionText = selectedOption !== null ? poll.options[selectedOption] ?? "" : "";
  const { twitterUrl, facebookUrl } = buildShareUrls(poll.question, chosenOptionText, articleUrl);

  return (
    <div className="my-10 rounded-2xl overflow-hidden shadow-2xl shadow-red-900/40 border border-red-700/50">
      {/* Red header */}
      <div className="bg-gradient-to-r from-red-900 via-red-700 to-red-900 px-5 py-4 flex items-center gap-3">
        <BarChart2 className="w-5 h-5 text-red-200" />
        <span className="text-red-100 text-sm font-black tracking-widest uppercase">Community Poll</span>
        {total > 0 && (
          <div className="ml-auto flex items-center gap-1.5 bg-red-950/50 border border-red-600/40 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-200 text-xs font-bold">{total.toLocaleString()} votes</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="bg-gradient-to-b from-red-950 to-zinc-950 px-5 pt-5 pb-5">
        {/* Question */}
        <p className="text-white font-black text-lg leading-snug mb-4">{poll.question}</p>

        {/* All options — vertical stack, all visible */}
        <div className="space-y-3">
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
                className={`relative w-full text-left rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                  hasVoted
                    ? isSelected
                      ? "border-red-400 bg-red-800/40 shadow-md shadow-red-500/20"
                      : isWinner
                      ? "border-yellow-500/50 bg-yellow-900/10"
                      : "border-red-900/50 bg-red-950/60"
                    : "border-red-700/40 bg-red-900/30 hover:border-red-400 hover:bg-red-800/40 cursor-pointer hover:scale-[1.01] hover:shadow-md hover:shadow-red-500/20 active:scale-[0.99]"
                }`}
              >
                {/* Animated progress bar fill */}
                {hasVoted && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-xl ${
                      isWinner
                        ? "bg-yellow-500/15"
                        : isSelected
                        ? "bg-red-500/20"
                        : "bg-red-900/20"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                )}

                <div className="relative flex items-center gap-3 px-4 py-3">
                  {/* Radio / check indicator */}
                  <div className="shrink-0">
                    {hasVoted && isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-red-400" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        hasVoted
                          ? isWinner ? "border-yellow-500/60" : "border-red-800/60"
                          : "border-red-500/60"
                      }`}>
                        {isWinner && hasVoted && !isSelected && (
                          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Option label */}
                  <span className={`flex-1 text-sm font-semibold leading-snug ${
                    isSelected
                      ? "text-red-200"
                      : hasVoted
                      ? isWinner ? "text-yellow-200" : "text-zinc-300"
                      : "text-white"
                  }`}>
                    {option}
                  </span>

                  {/* Percentage */}
                  {hasVoted && (
                    <span className={`text-base font-black shrink-0 ${
                      isWinner ? "text-yellow-400" : isSelected ? "text-red-300" : "text-zinc-500"
                    }`}>
                      {pct}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Share buttons after voting */}
        {hasVoted && selectedOption !== null && (
          <div className="mt-5 pt-4 border-t border-red-800/30">
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-300 font-bold uppercase tracking-wider">Share your vote</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black border border-zinc-700 hover:border-zinc-400 hover:bg-zinc-900 transition-all text-sm font-bold text-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Post on X
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/40 hover:bg-[#1877F2]/20 hover:border-[#1877F2]/70 transition-all text-sm font-bold text-[#4a9eff]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Share on Facebook
              </a>
            </div>
            <p className="text-xs text-red-900/70 mt-3 text-center">Results update in real time 🎯</p>
          </div>
        )}

        {!hasVoted && (
          <p className="text-xs text-red-400/50 text-center mt-4">
            Cast your vote — results revealed instantly
          </p>
        )}
      </div>
    </div>
  );
}
