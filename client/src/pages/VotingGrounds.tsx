/**
 * Voting Grounds - Dedicated page for all active article polls
 * Shareable from social media, shows all articles with voting
 */

import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import FanVoting from "@/components/FanVoting";
import SEO from "@/components/SEO";

const REACTION_EMOJIS: Record<string, string> = {
  loved: "\u{1F4AA}",
  fire: "\u{1F528}",
  meh: "\u{1F570}",
  thumbsdown: "\u{1F91C}",
};

export default function VotingGrounds() {
  const { data: voteSummaries = [], isLoading } = trpc.articles.allVoteSummaries.useQuery(undefined, { staleTime: 30_000 });
  const { data: allArticles = [] } = trpc.articles.list.useQuery();

  // Map article data to vote summaries
  const articlesWithVotes = voteSummaries.map(vs => {
    const article = allArticles.find(a => a.id === vs.articleId);
    if (!article) return null;
    return { ...vs, article };
  }).filter(Boolean) as Array<{
    articleId: number;
    totalVotes: number;
    topReaction: string;
    counts: Record<string, number>;
    article: { id: number; title: string; slug: string; featuredImageUrl: string | null; excerpt: string | null };
  }>;

  // Also show articles without votes yet (all articles are voteable)
  const articlesWithoutVotes = allArticles.filter(
    a => !voteSummaries.some(vs => vs.articleId === a.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Voting Grounds | Northland Legendary Finds"
        description="Cast your vote on the latest MCU topics. Share your opinion on Marvel news, shows, and card market moves."
        path="/voting-grounds"
      />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_60%)]" />
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/15 border border-red-600/30 rounded-full mb-4">
            <span className="text-xl">🗳️</span>
            <span className="text-red-400 text-sm font-bold tracking-wide">COMMUNITY POLLS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            VOTING GROUNDS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cast your vote on the latest MCU topics. Hulk Smash if you loved it, or Thanos thumbs down if it missed the mark.
          </p>
        </div>
      </section>

      {/* Active Polls */}
      <section className="py-8">
        <div className="container max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-card/50 border border-border animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Articles with votes first */}
              {articlesWithVotes.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center border border-red-600/40">
                      <span className="text-lg">🔥</span>
                    </div>
                    <h2 className="text-xl font-bold text-red-400">Hot Polls</h2>
                    <span className="text-xs text-muted-foreground bg-red-600/10 px-2 py-0.5 rounded-full border border-red-600/20">
                      {articlesWithVotes.reduce((sum, a) => sum + a.totalVotes, 0)} total votes
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articlesWithVotes.map(item => (
                      <div key={item.articleId} className="rounded-xl overflow-hidden bg-card border-2 border-red-600/40 shadow-lg shadow-red-900/10 hover:border-red-500/60 transition-all">
                        {/* Article Header */}
                        <Link
                          href={`/mcu-news/${item.article.slug}`}
                          className="block p-5 pb-3 group"
                        >
                          <div className="flex gap-4 items-start">
                            {item.article.featuredImageUrl && (
                              <img
                                src={item.article.featuredImageUrl}
                                alt={item.article.title}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                              />
                            )}
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-red-300 transition-colors">
                                {item.article.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-white/60 bg-white/5 px-2 py-0.5 rounded-full">
                                  {item.totalVotes} vote{item.totalVotes !== 1 ? "s" : ""}
                                </span>
                                <span className="text-xs text-white/60">
                                  Top: {REACTION_EMOJIS[item.topReaction] || "💀"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Voting Section */}
                        <div className="px-5 pb-5 pt-2">
                          <FanVoting articleId={item.articleId} compact />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles without votes yet */}
              {articlesWithoutVotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                      <span className="text-lg">📰</span>
                    </div>
                    <h2 className="text-xl font-bold text-white/80">Be the First to Vote</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articlesWithoutVotes.slice(0, 12).map(article => (
                      <div key={article.id} className="rounded-xl overflow-hidden bg-card border border-border hover:border-red-600/30 transition-all">
                        <Link
                          href={`/mcu-news/${article.slug}`}
                          className="block p-4 pb-2 group"
                        >
                          <div className="flex gap-3 items-start">
                            {article.featuredImageUrl && (
                              <img
                                src={article.featuredImageUrl}
                                alt={article.title}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                              />
                            )}
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-white/90 line-clamp-2 group-hover:text-red-300 transition-colors">
                                {article.title}
                              </h3>
                              <span className="text-xs text-muted-foreground mt-1 block">No votes yet — be first!</span>
                            </div>
                          </div>
                        </Link>
                        <div className="px-4 pb-4 pt-2">
                          <FanVoting articleId={article.id} compact />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {articlesWithVotes.length === 0 && articlesWithoutVotes.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-4xl mb-4 block">🗳️</span>
                  <h2 className="text-xl font-bold text-white/80 mb-2">No Polls Yet</h2>
                  <p className="text-muted-foreground">Check back soon — new polls drop with every article!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
