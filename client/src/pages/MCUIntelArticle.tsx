/**
 * MCU Intel Article Detail Page
 * Full article view with markdown rendering, sources, related characters, and card market impact
 */

import { Link, useParams, useLocation } from "wouter";
import {
  ArrowLeft, Clock, Tag, TrendingUp, ExternalLink, User, Share2,
  ChevronRight, Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { toast } from "sonner";

const CARD_MARKET_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-card-market-Lt56dsta4y7Hzfj6pzAysR.webp";

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
  movie_news: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  show_news: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  casting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  card_market: "bg-primary/20 text-primary border-primary/30",
  release_dates: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  rumors: "bg-red-500/20 text-red-400 border-red-500/30",
  analysis: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function formatDate(timestamp: number | null): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function MCUIntelArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const { data: article, isLoading, error } = trpc.articles.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: article?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container max-w-4xl py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="aspect-[16/9] bg-muted rounded-xl" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">This article may have been removed or doesn't exist.</p>
          <Link href="/mcu-intel">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to MCU Intel
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tags = (article.tags as string[] | null) || [];
  const sources = (article.sources as Array<{ title: string; url: string }> | null) || [];
  const relatedCharacters = (article.relatedCharacters as string[] | null) || [];

  return (
    <div className="min-h-screen">
      <SEO
        title={article.title}
        description={article.metaDescription || article.excerpt || ""}
        path={`/mcu-intel/${article.slug}`}
        image={article.featuredImageUrl || CARD_MARKET_IMG}
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "MCU Intel", url: "/mcu-intel" },
            { name: article.title, url: `/mcu-intel/${article.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            description: article.metaDescription || article.excerpt,
            image: article.featuredImageUrl,
            datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
            author: { "@type": "Organization", name: article.authorName || "NLF Team" },
          },
        ]}
      />

      {/* Back nav */}
      <div className="border-b border-border bg-card/30">
        <div className="container max-w-4xl py-3">
          <Link href="/mcu-intel" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to MCU Intel
          </Link>
        </div>
      </div>

      <article className="container max-w-4xl py-8 lg:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.movie_news}`}>
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.authorName || "NLF Team"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </Button>
          </div>
        </header>

        {/* Card Market Impact Banner */}
        {article.cardMarketImpact && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-primary mb-1">Card Market Impact</h4>
              <p className="text-sm text-foreground">{article.cardMarketImpact}</p>
            </div>
          </div>
        )}

        {/* Featured Image */}
        {article.featuredImageUrl && (
          <div className="rounded-xl overflow-hidden mb-8 border border-border">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-12
          prose-headings:text-foreground prose-headings:font-bold
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-blockquote:border-primary prose-blockquote:text-muted-foreground
          prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
          prose-img:rounded-lg prose-img:border prose-img:border-border
        ">
          <Streamdown>{article.contentMarkdown}</Streamdown>
        </div>

        {/* Sources */}
        {sources.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-primary" />
              Sources & References
            </h3>
            <div className="space-y-2">
              {sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="underline-offset-2 hover:underline">{source.title}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related Characters */}
        {relatedCharacters.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Related Characters
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedCharacters.map(name => (
                <Link
                  key={name}
                  href={`/characters/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 rounded-xl border border-border p-6">
          <div>
            <h3 className="font-bold mb-1">Want more MCU Intel?</h3>
            <p className="text-sm text-muted-foreground">Browse all our articles or check out the card database.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/mcu-intel">
              <Button variant="outline" size="sm">
                All Articles
              </Button>
            </Link>
            <Link href="/cards">
              <Button size="sm">
                Card Database
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
