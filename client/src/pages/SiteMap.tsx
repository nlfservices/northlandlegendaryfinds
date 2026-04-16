/**
 * Site Map - Auto-discovered page directory with dedicated blog section
 * Pulls all routes from a central registry and blog articles from tRPC
 * SEO-optimized with structured data
 */

import { Link } from "wouter";
import {
  Map, ShoppingCart, BookOpen, Database, Users, Shield,
  FileText, Info, Newspaper, TrendingUp, Sparkles, Zap,
  ExternalLink, ChevronRight, Clock, Tag, Calendar,
  Globe, Layers, Star, Eye,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

// ===== CENTRAL PAGE REGISTRY =====
// Add new pages here and they auto-appear on the site map

interface SitePage {
  path: string;
  label: string;
  description: string;
  isExternal?: boolean;
}

interface SiteSection {
  title: string;
  icon: typeof Map;
  color: string;
  pages: SitePage[];
}

const SITE_SECTIONS: SiteSection[] = [
  {
    title: "Shop & Products",
    icon: ShoppingCart,
    color: "text-primary",
    pages: [
      { path: "/shop", label: "Shop All Products", description: "Browse our full collection of premium Marvel trading card repacks" },
      { path: "/marvel", label: "Marvel Collection", description: "Explore our Marvel-focused repack products and exclusive drops" },
      { path: "/star-wars", label: "Star Wars Collection", description: "Coming Fall 2026 — Star Wars trading card repacks" },
      { path: "/checklists", label: "Product Checklists", description: "Full transparency — see every card that could be in your repack" },
      { path: "/whatnot", label: "Whatnot Live Shows", description: "Watch our live card breaks and exclusive Whatnot drops" },
      { path: "/free-credit", label: "Get $15 Free on Whatnot", description: "Sign up through our referral link and get $15 to shop live shows" },
    ],
  },
  {
    title: "Card Database & Research",
    icon: Database,
    color: "text-blue-400",
    pages: [
      { path: "/cards", label: "Card Database", description: "Browse all 2025 Topps Marvel card sets with images and details" },
      { path: "/characters", label: "Character Directory", description: "Explore Marvel characters and their cards across all sets" },
      { path: "/marvel-card-hub", label: "Marvel Card Hub", description: "Central hub for all Marvel trading card information" },
      { path: "/market-intel", label: "Market Intel", description: "Analysis and insights on the Marvel trading card market" },
      { path: "/market-intel/2024-vs-2025-topps-marvel", label: "2024 vs 2025 Topps Marvel", description: "Side-by-side comparison of Topps Marvel Chrome releases" },
      { path: "/market-intel/topps-vs-upper-deck-marvel", label: "Topps vs Upper Deck", description: "Which Marvel card manufacturer offers better value?" },
      { path: "/market-intel/marvel-vs-pokemon-cards", label: "Marvel vs Pokemon Cards", description: "Comparing the two biggest trading card markets" },
      { path: "/market-intel/why-fanatics-trading-cards", label: "Why Fanatics Matters", description: "How Fanatics is reshaping the trading card industry" },
      { path: "/market-intel/best-topps-marvel-cards", label: "Best Topps Marvel Cards", description: "Top cards to watch from 2025 Topps Marvel sets" },
      { path: "/trending", label: "Trending Cards", description: "Marvel cards to collect right now — movie-driven picks and beginner tips" },
    ],
  },
  {
    title: "Community & Content",
    icon: Users,
    color: "text-purple-400",
    pages: [
      { path: "/the-collector", label: "The Collector Blog", description: "Articles, guides, and insights for Marvel card collectors" },
      { path: "/mcu-news", label: "MCU News", description: "Marvel Cinematic Universe news and card market impact analysis" },
      { path: "/card-shows", label: "Card Shows & Events", description: "Find upcoming card shows, conventions, and collector events" },
      { path: "/submit-show", label: "Submit a Card Show", description: "Know about an upcoming show? Submit it to our directory" },
      { path: "/subscribers", label: "Subscriber Hub", description: "Exclusive content and perks for NLF subscribers" },
    ],
  },
  {
    title: "About NLF",
    icon: Info,
    color: "text-emerald-400",
    pages: [
      { path: "/about", label: "About Us", description: "Learn about Northland Legendary Finds and our mission" },
      { path: "/our-process", label: "Our Process", description: "How we build premium repacks — from sourcing to shipping" },
      { path: "/transparency", label: "Transparency", description: "Real-time pull tracking and full checklist disclosure" },
      { path: "/contact", label: "Contact Us", description: "Get in touch with the NLF team" },
      { path: "/faq", label: "FAQ", description: "Frequently asked questions about our products and services" },
    ],
  },
  {
    title: "Policies & Legal",
    icon: Shield,
    color: "text-muted-foreground",
    pages: [
      { path: "/shipping", label: "Shipping & Returns", description: "Shipping zones, rates, and return policy information" },
      { path: "/terms", label: "Terms of Service", description: "Terms and conditions for using our website and services" },
      { path: "/privacy", label: "Privacy Policy", description: "How we collect, use, and protect your personal information" },
      { path: "/refund-policy", label: "Refund Policy", description: "Our refund and exchange policy for all purchases" },
    ],
  },
  {
    title: "Tools & Experiences",
    icon: Sparkles,
    color: "text-yellow-400",
    pages: [
      { path: "/matrix", label: "The Matrix Portal", description: "Interactive card discovery experience" },
      { path: "/login", label: "Jarvis Protocol (Login)", description: "Sign in to access subscriber features and order history" },
    ],
  },
];

// Category label/color mapping for blog articles
const BLOG_CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  market_trends: { label: "Market Trends", color: "bg-emerald-500/20 text-emerald-400" },
  character_spotlight: { label: "Characters", color: "bg-blue-500/20 text-blue-400" },
  grading_guide: { label: "Grading", color: "bg-amber-500/20 text-amber-400" },
  set_breakdown: { label: "Sets", color: "bg-purple-500/20 text-purple-400" },
  investment_strategy: { label: "Investment", color: "bg-green-500/20 text-green-400" },
  collecting_tips: { label: "Tips", color: "bg-cyan-500/20 text-cyan-400" },
  nlf_news: { label: "NLF News", color: "bg-primary/20 text-primary" },
  behind_the_scenes: { label: "Behind the Scenes", color: "bg-orange-500/20 text-orange-400" },
  card_history: { label: "History", color: "bg-red-500/20 text-red-400" },
  sports_crossover: { label: "Sports", color: "bg-yellow-500/20 text-yellow-400" },
  movie_news: { label: "Movie News", color: "bg-pink-500/20 text-pink-400" },
  show_news: { label: "Show News", color: "bg-indigo-500/20 text-indigo-400" },
  casting: { label: "Casting", color: "bg-rose-500/20 text-rose-400" },
  card_market: { label: "Card Market", color: "bg-emerald-500/20 text-emerald-400" },
  release_dates: { label: "Release Dates", color: "bg-sky-500/20 text-sky-400" },
  rumors: { label: "Rumors", color: "bg-orange-500/20 text-orange-400" },
  analysis: { label: "Analysis", color: "bg-violet-500/20 text-violet-400" },
};

export default function SiteMap() {
  const { data: articles, isLoading: articlesLoading } = trpc.blog.list.useQuery({});

  // Count total pages
  const totalStaticPages = SITE_SECTIONS.reduce((sum, s) => sum + s.pages.length, 0);
  const totalArticles = articles?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Site Map"
        description="Complete directory of all pages on Northland Legendary Finds — shop, card database, blog articles, market intel, and more."
        path="/sitemap"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Site Map", url: "/sitemap" },
        ])}
      />

      {/* ===== HERO ===== */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Map className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">SITE DIRECTORY</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              <span className="text-primary">SITE</span>{" "}
              <span className="text-foreground">MAP</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your complete guide to everything on Northland Legendary Finds.
              {totalStaticPages + totalArticles > 0 && (
                <span className="text-foreground font-semibold">
                  {" "}{totalStaticPages} pages{totalArticles > 0 && ` + ${totalArticles} blog articles`}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ===== PAGE SECTIONS ===== */}
      <section className="pb-12">
        <div className="container max-w-6xl">
          <div className="grid gap-8">
            {SITE_SECTIONS.map((section) => (
              <div
                key={section.title}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                  <h2 className="text-lg font-bold tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
                    {section.title.toUpperCase()}
                  </h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
                    {section.pages.length} pages
                  </span>
                </div>

                {/* Page Links */}
                <div className="divide-y divide-border/50">
                  {section.pages.map((page) => (
                    <Link key={page.path} href={page.path}>
                      <div className="px-6 py-3.5 flex items-center gap-4 hover:bg-primary/5 transition-colors group cursor-pointer">
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {page.label}
                            </span>
                            {page.isExternal && (
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 truncate">
                            {page.description}
                          </p>
                        </div>
                        <code className="text-xs text-muted-foreground/60 hidden sm:block font-mono">
                          {page.path}
                        </code>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG ARTICLES SECTION ===== */}
      <section className="pb-16">
        <div className="container max-w-6xl">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Blog Section Header */}
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
                THE COLLECTOR — BLOG ARTICLES
              </h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
                {articlesLoading ? "..." : `${totalArticles} articles`}
              </span>
            </div>

            {/* Blog intro */}
            <div className="px-6 py-4 border-b border-border/50 bg-primary/5">
              <p className="text-sm text-muted-foreground">
                All published articles from{" "}
                <Link href="/the-collector" className="text-primary font-semibold hover:underline">
                  The Collector
                </Link>
                {" "}— our blog covering Marvel card market analysis, collecting guides, character spotlights, and industry news.
              </p>
            </div>

            {/* Articles List */}
            {articlesLoading ? (
              <div className="px-6 py-12 text-center">
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted/50 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="divide-y divide-border/50">
                {articles.map((article: any) => {
                  const cat = BLOG_CATEGORY_LABELS[article.category] || { label: article.category, color: "bg-muted text-muted-foreground" };
                  const publishedDate = article.publishedAt
                    ? new Date(typeof article.publishedAt === "number" ? article.publishedAt : Date.now())
                    : null;

                  return (
                    <Link key={article.id} href={`/the-collector/${article.slug}`}>
                      <div className="px-6 py-3.5 flex items-center gap-4 hover:bg-primary/5 transition-colors group cursor-pointer">
                        {/* Thumbnail */}
                        {article.featuredImageUrl ? (
                          <img
                            src={article.featuredImageUrl}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}

                        {/* Article Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {article.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.color}`}>
                              {cat.label}
                            </span>
                            {publishedDate && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {publishedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            )}
                            {article.authorName && (
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                by {article.authorName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Path */}
                        <code className="text-xs text-muted-foreground/60 hidden lg:block font-mono flex-shrink-0">
                          /the-collector/{article.slug}
                        </code>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No published articles yet. Check back soon!</p>
              </div>
            )}

            {/* View All CTA */}
            {articles && articles.length > 0 && (
              <div className="px-6 py-4 border-t border-border bg-muted/20">
                <Link href="/the-collector">
                  <div className="flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:underline cursor-pointer">
                    <BookOpen className="w-4 h-4" />
                    View all articles on The Collector
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== XML SITEMAP LINK ===== */}
      <section className="pb-16">
        <div className="container max-w-6xl">
          <div className="bg-muted/30 border border-border rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">XML Sitemap</p>
                <p className="text-xs text-muted-foreground">Machine-readable sitemap for search engines</p>
              </div>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
            >
              /sitemap.xml <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
