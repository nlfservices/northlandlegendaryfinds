/** * MCU News Article Detail Page
 * Full article view with markdown rendering, sources, related characters, and card market impact
 */

import { Link, useParams, useLocation } from "wouter";
import { useMemo } from "react";
import {
  ArrowLeft, Clock, Tag, ExternalLink, User, Share2,
  ChevronRight, Newspaper, Facebook, Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import RichContent from "@/components/RichContent";
import SEO, { breadcrumbJsonLd, articleJsonLd, organizationJsonLd, faqJsonLd, itemListJsonLd, speakableJsonLd } from "@/components/SEO";
import { toast } from "sonner";
// FanVoting removed per user request
import CollectorsCorner from "@/components/CollectorsCorner";
import { ArticleTemplateRenderer, getArticleTemplate, type ArticleTemplate } from "@/components/ArticleTemplates";

const CARD_MARKET_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-card-market-Lt56dsta4y7Hzfj6pzAysR.webp";

// Character-themed color schemes for "Who Would Win?" articles
const WHO_WOULD_WIN_THEMES: Record<string, { accent: string; accentBg: string; accentBorder: string; gradient: string; headingColor: string }> = {
  "who-would-win-wolverine-vs-captain-america": {
    accent: "text-yellow-400",
    accentBg: "bg-yellow-500/10",
    accentBorder: "border-yellow-500/30",
    gradient: "from-yellow-500/20 via-blue-600/10 to-red-500/20",
    headingColor: "text-yellow-400",
  },
  "who-would-win-storm-vs-thor": {
    accent: "text-sky-300",
    accentBg: "bg-sky-500/10",
    accentBorder: "border-sky-500/30",
    gradient: "from-white/10 via-sky-500/20 to-blue-600/10",
    headingColor: "text-sky-300",
  },
  "who-would-win-magneto-vs-iron-man": {
    accent: "text-red-400",
    accentBg: "bg-red-500/10",
    accentBorder: "border-red-500/30",
    gradient: "from-red-500/20 via-gray-400/10 to-red-700/20",
    headingColor: "text-red-400",
  },
  "who-would-win-phoenix-vs-scarlet-witch": {
    accent: "text-orange-400",
    accentBg: "bg-orange-500/10",
    accentBorder: "border-orange-500/30",
    gradient: "from-orange-500/20 via-red-500/10 to-purple-500/20",
    headingColor: "text-orange-400",
  },
  "who-would-win-hulk-vs-colossus": {
    accent: "text-green-400",
    accentBg: "bg-green-500/10",
    accentBorder: "border-green-500/30",
    gradient: "from-green-500/20 via-green-700/10 to-gray-400/10",
    headingColor: "text-green-400",
  },
  "who-would-win-cyclops-vs-captain-america": {
    accent: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/30",
    gradient: "from-blue-500/20 via-yellow-500/10 to-red-500/10",
    headingColor: "text-blue-400",
  },
  "who-would-win-deadpool-vs-spider-man": {
    accent: "text-red-500",
    accentBg: "bg-red-500/10",
    accentBorder: "border-red-500/30",
    gradient: "from-red-600/20 via-red-500/10 to-blue-500/10",
    headingColor: "text-red-500",
  },
  "who-would-win-doctor-doom-vs-magneto": {
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    gradient: "from-emerald-500/20 via-gray-500/10 to-purple-500/20",
    headingColor: "text-emerald-400",
  },
  "who-would-win-black-panther-vs-wolverine": {
    accent: "text-purple-400",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/30",
    gradient: "from-purple-500/20 via-black/10 to-yellow-500/10",
    headingColor: "text-purple-400",
  },
  "who-would-win-thor-vs-hulk-rematch": {
    accent: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/30",
    gradient: "from-blue-500/20 via-yellow-500/10 to-green-500/20",
    headingColor: "text-blue-400",
  },
};

function getWhoWouldWinTheme(slug: string) {
  return WHO_WOULD_WIN_THEMES[slug] || null;
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

/**
 * Splits article markdown content and inserts a mid-article Whatnot banner
 * after the first major section (first H2/H3 heading break or ~30% through content)
 */
function ArticleContentWithBanner({ content }: { content: string }) {
  const { firstHalf, secondHalf } = useMemo(() => {
    const lines = content.split('\n');
    // Find a good split point: after the first ## or ### heading that appears
    // after at least 8 lines of content (to ensure we're past the intro)
    let splitIndex = -1;
    for (let i = 8; i < lines.length; i++) {
      if (lines[i].match(/^#{2,3}\s/) && i < lines.length * 0.6) {
        splitIndex = i;
        break;
      }
    }
    // Fallback: split at roughly 35% through the content
    if (splitIndex === -1) {
      splitIndex = Math.floor(lines.length * 0.35);
    }
    return {
      firstHalf: lines.slice(0, splitIndex).join('\n'),
      secondHalf: lines.slice(splitIndex).join('\n'),
    };
  }, [content]);

  const proseClasses = `prose prose-invert prose-lg max-w-none
    prose-headings:text-foreground prose-headings:font-bold
    prose-p:text-muted-foreground prose-p:leading-relaxed
    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
    prose-strong:text-foreground
    prose-blockquote:border-primary prose-blockquote:text-muted-foreground
    prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
    prose-img:rounded-lg prose-img:border prose-img:border-border`;

  return (
    <div className="mb-12">
      {/* First half of article */}
      <RichContent className={proseClasses}>{firstHalf}</RichContent>

      {/* Mid-Article Whatnot Banner */}
      <div className="my-8 relative">
        {/* Decorative divider lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
        
        <div className="py-6 px-4 sm:px-6 bg-yellow-500/5 border-l-4 border-yellow-500 rounded-r-lg">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Tv className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="font-bold text-foreground text-base sm:text-lg mb-1">
                We're going LIVE this week — free cards every stream
              </p>
              <p className="text-sm text-muted-foreground">
                New to Whatnot? Get <span className="text-yellow-400 font-semibold">$15 off</span> your first purchase. No strings attached.
              </p>
            </div>
            <a
              href="https://northlandlegendaryfinds.com/whatnot"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg transition-all hover:scale-[1.02] flex-shrink-0 whitespace-nowrap"
            >
              Watch Free
            </a>
          </div>
        </div>
      </div>

      {/* Second half of article */}
      <RichContent className={proseClasses}>{secondHalf}</RichContent>
    </div>
  );
}

export default function MCUNewsArticle() {
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
          <Link href="/mcu-news">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to MCU News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tags = (article.tags as string[] | null) || [];
  const sources = (article.sources as Array<{ title: string; url: string }> | null) || [];
  const relatedCharacters = (article.relatedCharacters as string[] | null) || [];

  // Extract H2 headings for ItemList schema (great for listicle/ranking articles)
  const h2Headings = (article.contentMarkdown || "").match(/^## (.+)$/gm)?.map((h, i) => ({
    name: h.replace(/^## /, ""),
    position: i + 1,
  })) || [];

  const wwwTheme = getWhoWouldWinTheme(slug || "");

  return (
    <div className={`min-h-screen ${getArticleTemplate(article.templateLayout as ArticleTemplate | null) === 'patriotic' ? 'bg-white' : ''}`}>
      {/* Who Would Win? themed gradient banner */}
      {wwwTheme && (
        <div className={`w-full h-2 bg-gradient-to-r ${wwwTheme.gradient}`} />
      )}
      <SEO
        title={article.title}
        description={article.metaDescription || article.excerpt || ""}
        path={`/mcu-news/${article.slug}`}
        image={article.featuredImageUrl || CARD_MARKET_IMG}
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "MCU News", url: "/mcu-news" },
            { name: article.title, url: `/mcu-news/${article.slug}` },
          ]),
          articleJsonLd({
            title: article.title,
            description: article.metaDescription || article.excerpt || "",
            image: article.featuredImageUrl || undefined,
            datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
            dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
            authorName: article.authorName || "NLF Team",
            slug: article.slug,
            category: article.category,
            tags: tags,
            wordCount: article.contentMarkdown ? article.contentMarkdown.split(/\s+/).length : undefined,
          }),
          organizationJsonLd(),
          // ItemList for articles with multiple H2 sections (listicle/ranking rich results)
          ...(h2Headings.length >= 3 ? [itemListJsonLd({
            name: article.title,
            description: article.metaDescription || article.excerpt || "",
            url: `/mcu-news/${article.slug}`,
            items: h2Headings,
          })] : []),
          // Speakable for voice search optimization
          speakableJsonLd({ url: `/mcu-news/${article.slug}` }),
        ]}
      />

      {/* Back nav — hidden for patriotic template (it has its own full-width layout) */}
      {getArticleTemplate(article.templateLayout as ArticleTemplate | null) !== 'patriotic' && (
        <div className="border-b border-border bg-card/30">
          <div className="container max-w-4xl py-3">
            <Link href="/mcu-news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />            Back to MCU News
            </Link>          </div>
        </div>
      )}

      <article className={getArticleTemplate(article.templateLayout as ArticleTemplate | null) === 'patriotic' ? 'py-0' : 'container max-w-4xl py-8 lg:py-12'}>
        {/* Header — patriotic template renders its own header inside the template */}
        {getArticleTemplate(article.templateLayout as ArticleTemplate | null) !== 'patriotic' && (
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

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${wwwTheme ? wwwTheme.headingColor : ''}`}>
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
        )}


        {/* Featured Image — only for Classic template; other templates render their own hero */}
        {article.featuredImageUrl && getArticleTemplate(article.templateLayout as ArticleTemplate | null) === 'classic' && (
          <div className="rounded-xl overflow-hidden mb-8 border border-border">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}


        {/* Article Content — Template-based rendering */}
        {(() => {
          const template = getArticleTemplate(article.templateLayout as ArticleTemplate | null);
          if (template === 'classic') {
            // Classic uses the existing banner-split layout
            return <ArticleContentWithBanner content={article.contentMarkdown} />;
          }
          return (
            <div className="mb-12">
              <ArticleTemplateRenderer
                template={template}
                content={article.contentMarkdown}
                title={article.title}
                featuredImageUrl={article.featuredImageUrl}
                category={article.category}
                cardMarketImpact={article.cardMarketImpact}
                tags={tags}
                excerpt={article.excerpt}
              />
            </div>
          );
        })()}

        {/* Collector's Corner and CTAs — wrapped in container for patriotic template */}
        <div className={getArticleTemplate(article.templateLayout as ArticleTemplate | null) === 'patriotic' ? 'container max-w-4xl px-4 sm:px-6' : ''}>
        <CollectorsCorner
          articleId={article.id}
          tags={tags}
          relatedCharacters={relatedCharacters}
        />

        {/* Whatnot Live Stream CTA */}
        <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border-2 border-yellow-500/40 rounded-xl p-6 sm:p-8 mb-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Like Marvel Cards? Come Hang Out Live</h3>
          <p className="text-muted-foreground mb-5 max-w-lg mx-auto">
            We rip packs, give away free cards every stream, and talk Marvel with collectors like you. New to Whatnot? You'll get <span className="text-yellow-400 font-bold">$15 off</span> your first purchase just for signing up.
          </p>
          <a
            href="https://northlandlegendaryfinds.com/whatnot"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-lg transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.02]"
          >
            Watch Us Live — Free Giveaways Every Show
          </a>
          <p className="text-xs text-muted-foreground mt-3">No purchase necessary to watch or win. Just show up.</p>
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
            <h3 className="font-bold mb-1">Want more MCU News?</h3>
            <p className="text-sm text-muted-foreground">Browse all our articles or check out the card database.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/mcu-news">
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

        {/* Facebook Follow CTA */}
        <div className="mt-6 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 flex-shrink-0">
              <Facebook className="w-7 h-7 text-white" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-bold text-lg mb-1">Follow NLF on Facebook</h3>
              <p className="text-sm text-muted-foreground">Get breaking MCU news, card market updates, and exclusive drops in your feed.</p>
            </div>
            <a
              href="https://www.facebook.com/profile.php?id=61575227498498"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex-shrink-0"
            >
              <Facebook className="w-5 h-5" />
              Like Our Page
            </a>
          </div>
        </div>
        </div>
      </article>
    </div>
  );
}
