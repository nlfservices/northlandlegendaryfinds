/**
 * BlogPost - Individual blog post page for The Collector
 * Full SEO with Article structured data, social sharing, related posts
 */

import { useParams, Link } from "wouter";
import {
  ArrowLeft, Clock, Eye, Tag, Calendar, ChevronRight,
  BookOpen, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { Streamdown } from "streamdown";
import {
  SocialShareInline,
  SocialShareFloating,
  SocialShareBottomBar,
} from "@/components/SocialShareButtons";

const CATEGORY_LABELS: Record<string, string> = {
  market_trends: "Market Trends",
  character_spotlight: "Character Spotlight",
  grading_guide: "Grading Guide",
  set_breakdown: "Set Breakdown",
  investment_strategy: "Investment Strategy",
  collecting_tips: "Collecting Tips",
  nlf_news: "NLF News",
  behind_the_scenes: "Behind the Scenes",
  card_history: "Card History",
  sports_crossover: "Sports Crossover",
};

const CATEGORY_COLORS: Record<string, string> = {
  market_trends: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  character_spotlight: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  grading_guide: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  set_breakdown: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  investment_strategy: "bg-green-500/20 text-green-400 border-green-500/30",
  collecting_tips: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  nlf_news: "bg-primary/20 text-primary border-primary/30",
  behind_the_scenes: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  card_history: "bg-red-500/20 text-red-400 border-red-500/30",
  sports_crossover: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: relatedPosts = [] } = trpc.blog.list.useQuery(
    { category: post?.category, limit: 4 },
    { enabled: !!post?.category }
  );

  const related = relatedPosts.filter((p: any) => p.id !== post?.id).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container max-w-4xl py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="aspect-video bg-muted rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">This article may have been removed or doesn't exist.</p>
          <Link href="/the-collector">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to The Collector
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tags = post.tags
    ? Array.isArray(post.tags)
      ? post.tags
      : typeof post.tags === "string"
        ? JSON.parse(post.tags)
        : []
    : [];

  const shareUrl = `https://northlandlegendaryfinds.com/the-collector/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt || "",
    image: post.featuredImageUrl || undefined,
    datePublished: post.publishedAt ? new Date(Number(post.publishedAt)).toISOString() : new Date(Number(post.createdAt)).toISOString(),
    dateModified: new Date(Number(post.updatedAt)).toISOString(),
    author: {
      "@type": "Organization",
      name: post.authorName || "Northland Legendary Finds",
    },
    publisher: {
      "@type": "Organization",
      name: "Northland Legendary Finds",
      url: "https://northlandlegendaryfinds.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl,
    },
    wordCount: post.contentMarkdown ? post.contentMarkdown.split(/\s+/).length : undefined,
    articleSection: CATEGORY_LABELS[post.category] || post.category,
    keywords: tags.join(", "),
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.metaDescription || post.excerpt || `Read ${post.title} on The Collector by Northland Legendary Finds.`}
        path={`/the-collector/${post.slug}`}
        image={post.featuredImageUrl || undefined}
        type="article"
        jsonLd={[
          articleJsonLd,
          breadcrumbJsonLd([
            { name: "Home", url: "https://northlandlegendaryfinds.com" },
            { name: "The Collector", url: "https://northlandlegendaryfinds.com/the-collector" },
            { name: post.title, url: shareUrl },
          ]),
        ]}
      />

      {/* Floating share sidebar — desktop only, appears on scroll */}
      <SocialShareFloating
        url={shareUrl}
        title={post.title}
        excerpt={post.excerpt || undefined}
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="container max-w-4xl pt-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/the-collector" className="hover:text-foreground transition-colors">The Collector</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>

        {/* Article Header */}
        <header className="container max-w-4xl py-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className={CATEGORY_COLORS[post.category] || ""}>
              {CATEGORY_LABELS[post.category] || post.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes || 3} min read
            </span>
            {(post.viewCount ?? 0) > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {post.viewCount} views
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">{post.title}</h1>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{post.authorName || "NLF Team"}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt ? Number(post.publishedAt) : Number(post.createdAt))}
              </span>
            </div>

            {/* Inline share buttons — header row */}
            <SocialShareInline
              url={shareUrl}
              title={post.title}
              excerpt={post.excerpt || undefined}
            />
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="container max-w-4xl mb-8">
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="container max-w-4xl pb-12">
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-img:rounded-xl prose-img:border prose-img:border-border
            prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
            prose-li:text-muted-foreground
            prose-code:text-primary prose-code:bg-primary/10 prose-code:rounded prose-code:px-1
          ">
            <Streamdown>{post.contentMarkdown}</Streamdown>
          </div>
        </article>

        {/* Share bar after article content */}
        <div className="container max-w-4xl pb-8">
          <SocialShareBottomBar
            url={shareUrl}
            title={post.title}
            excerpt={post.excerpt || undefined}
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="container max-w-4xl pb-8">
            <Separator className="mb-6" />
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="container max-w-4xl pb-20">
            <Separator className="mb-8" />
            <h2 className="text-2xl font-bold mb-6">More from The Collector</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((rp: any) => (
                <Link key={rp.id} href={`/the-collector/${rp.slug}`}>
                  <article className="group bg-card/50 border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all cursor-pointer h-full">
                    {rp.featuredImageUrl ? (
                      <div className="aspect-video overflow-hidden">
                        <img src={rp.featuredImageUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-emerald-500/10 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-primary/30" />
                      </div>
                    )}
                    <div className="p-4">
                      <Badge variant="outline" className={`text-xs mb-2 ${CATEGORY_COLORS[rp.category] || ""}`}>
                        {CATEGORY_LABELS[rp.category] || rp.category}
                      </Badge>
                      <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2 text-sm">
                        {rp.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to The Collector */}
        <div className="container max-w-4xl pb-20 text-center">
          <Link href="/the-collector">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to The Collector
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
