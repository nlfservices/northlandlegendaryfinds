/**
 * The Collector - Blog listing page
 * Named after the MCU character Taneleer Tivan
 * SEO-optimized with structured data, categories, and featured posts
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  BookOpen, TrendingUp, Gem, Shield, Sparkles, Search,
  ChevronRight, Clock, Tag, ArrowRight, Filter, Eye,
  BarChart3, Lightbulb, Newspaper, Star, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const CATEGORIES = [
  { key: "all", label: "All Posts", icon: BookOpen },
  { key: "market_trends", label: "Market Trends", icon: TrendingUp },
  { key: "character_spotlight", label: "Characters", icon: Star },
  { key: "grading_guide", label: "Grading", icon: Shield },
  { key: "set_breakdown", label: "Sets", icon: Gem },
  { key: "investment_strategy", label: "Investment", icon: BarChart3 },
  { key: "collecting_tips", label: "Tips", icon: Lightbulb },
  { key: "nlf_news", label: "NLF News", icon: Newspaper },
  { key: "behind_the_scenes", label: "Behind the Scenes", icon: Eye },
  { key: "card_history", label: "History", icon: BookOpen },
  { key: "sports_crossover", label: "Sports Crossover", icon: Trophy },
];

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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TheCollector() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery({
    category: activeCategory === "all" ? undefined : activeCategory,
    limit: 50,
  });

  const { data: featuredPosts } = trpc.blog.featured.useQuery();

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p: any) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.tags && JSON.stringify(p.tags).toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Collector — Marvel Card Intelligence",
    description: "Expert insights on Marvel trading card collecting, market trends, grading guides, and investment strategies from Northland Legendary Finds.",
    url: "https://northlandlegendaryfinds.com/the-collector",
    publisher: {
      "@type": "Organization",
      name: "Northland Legendary Finds",
      url: "https://northlandlegendaryfinds.com",
    },
  };

  return (
    <>
      <SEO
        title="The Collector — Marvel Card Intelligence"
        description="Expert insights on Marvel trading card collecting, market trends, grading guides, and investment strategies. Your source for card collecting knowledge."
        path="/the-collector"
        type="website"
        jsonLd={[
          blogJsonLd,
          breadcrumbJsonLd([
            { name: "Home", url: "https://northlandlegendaryfinds.com" },
            { name: "The Collector", url: "https://northlandlegendaryfinds.com/the-collector" },
          ]),
        ]}
      />

      <div className="min-h-screen">
        {/* ===== HERO ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-bold tracking-wide uppercase">The Collector</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
                Marvel Card <span className="text-primary">Intelligence</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Expert insights on market trends, grading guides, character spotlights, and investment strategies.
                Everything you need to collect smarter.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="pl-10 bg-card/50 border-border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURED POSTS ===== */}
        {featuredPosts && featuredPosts.length > 0 && (
          <section className="container mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> Featured
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.slice(0, 3).map((post: any) => (
                <Link key={post.id} href={`/the-collector/${post.slug}`}>
                  <article className="group bg-card/50 border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full">
                    {post.featuredImageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[post.category] || ""}`}>
                          {CATEGORIES.find((c) => c.key === post.category)?.label || post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTimeMinutes || 3} min
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="mt-3 text-xs text-muted-foreground">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== CATEGORY FILTERS ===== */}
        <section className="container mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card border border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ===== POST GRID ===== */}
        <section className="container pb-20">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card/30 border border-border rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try a different search term." : "New content is coming soon!"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post: any) => (
                  <Link key={post.id} href={`/the-collector/${post.slug}`}>
                    <article className="group bg-card/50 border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full flex flex-col">
                      {post.featuredImageUrl ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featuredImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-emerald-500/10 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[post.category] || ""}`}>
                            {CATEGORIES.find((c) => c.key === post.category)?.label || post.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.readTimeMinutes || 3} min
                          </span>
                          {post.viewCount > 0 && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {post.viewCount}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{post.excerpt}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                          <span className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                            Read <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>


            </>
          )}
        </section>
      </div>
    </>
  );
}
