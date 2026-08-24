/**
 * RelatedArticles
 * Displays up to 3 articles that share tags with the current article.
 * Falls back to most-recent articles when tag matches are sparse.
 */

import { Link } from "wouter";
import { Clock, ArrowRight, Newspaper } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SafeImage, HULK_PLACEHOLDER } from "@/components/SafeImage";

interface RelatedArticlesProps {
  currentSlug: string;
  tags: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  movie_news: "Movie News",
  show_news: "Show News",
  casting: "Casting",
  card_market: "Card Market",
  release_dates: "Release Dates",
  rumors: "Rumors",
  analysis: "Analysis",
};

const CATEGORY_COLORS: Record<string, string> = {
  movie_news: "bg-blue-500/20 text-blue-400",
  show_news: "bg-purple-500/20 text-purple-400",
  casting: "bg-amber-500/20 text-amber-400",
  card_market: "bg-primary/20 text-primary",
  release_dates: "bg-cyan-500/20 text-cyan-400",
  rumors: "bg-red-500/20 text-red-400",
  analysis: "bg-emerald-500/20 text-emerald-400",
};

function formatDate(timestamp: number | null): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RelatedArticles({ currentSlug, tags }: RelatedArticlesProps) {
  const { data: related, isLoading } = trpc.articles.getRelated.useQuery(
    { slug: currentSlug, tags, limit: 3 },
    { enabled: !!currentSlug }
  );

  if (isLoading) {
    return (
      <div className="mt-12 mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          Related Articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          Related Articles
        </h2>
        <Link
          href="/mcu-news"
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          All Articles
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map(article => {
          const articleTags = (article.tags as string[] | null) || [];
          const sharedTags = articleTags.filter(t =>
            tags.some(ct => ct.toLowerCase() === t.toLowerCase())
          ).slice(0, 2);

          return (
            <Link
              key={article.id}
              href={`/mcu-news/${article.slug}`}
              className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/9] overflow-hidden bg-muted relative">
                {article.featuredImageUrl ? (
                  <SafeImage
                    src={article.featuredImageUrl}
                    fallbackSrc={HULK_PLACEHOLDER}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Newspaper className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
                {/* Category badge overlay */}
                <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.movie_news}`}>
                  {CATEGORY_LABELS[article.category] || article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                  {/* Shared tags */}
                  <div className="flex gap-1 flex-wrap">
                    {sharedTags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Date */}
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
