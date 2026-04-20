/**
 * MCU News - News, Rumors & Card Market Impact Hub
 * A content-rich page with featured articles, category filters, MCU timeline, and card market analysis
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Newspaper, TrendingUp, Calendar, Users, Film, Tv, MessageSquare,
  Search, ChevronRight, Clock, Tag, ExternalLink, Sparkles, Zap,
  ArrowRight, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-hero-VcDNx3cvdPSwJjVGxWMfTo.webp";
const CARD_MARKET_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-card-market-Lt56dsta4y7Hzfj6pzAysR.webp";

const CATEGORIES = [
  { key: "all", label: "All News", icon: Newspaper },
  { key: "movie_news", label: "Movies", icon: Film },
  { key: "show_news", label: "Shows", icon: Tv },
  { key: "casting", label: "Casting", icon: Users },
  { key: "card_market", label: "Card Market", icon: TrendingUp },
  { key: "release_dates", label: "Releases", icon: Calendar },
  { key: "rumors", label: "Rumors", icon: MessageSquare },
  { key: "analysis", label: "Analysis", icon: Sparkles },
];

const CATEGORY_COLORS: Record<string, string> = {
  movie_news: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  show_news: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  casting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  card_market: "bg-primary/20 text-primary border-primary/30",
  release_dates: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  rumors: "bg-red-500/20 text-red-400 border-red-500/30",
  analysis: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

// Character-themed color accents for article cards
// Each entry: [borderColor, glowColor, accentTextColor]
const CHARACTER_THEMES: Record<string, { border: string; glow: string; accent: string; bg: string }> = {
  // Heroes
  "spider-man": { border: "border-red-500/50", glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-500/10 via-blue-500/5 to-transparent" },
  "spiderman": { border: "border-red-500/50", glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-500/10 via-blue-500/5 to-transparent" },
  "iron man": { border: "border-red-600/50", glow: "shadow-[0_0_15px_rgba(220,38,38,0.15)]", accent: "text-red-500", bg: "bg-gradient-to-r from-red-600/10 via-yellow-500/5 to-transparent" },
  "captain america": { border: "border-blue-500/50", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", accent: "text-blue-400", bg: "bg-gradient-to-r from-blue-500/10 via-red-500/5 to-transparent" },
  "thor": { border: "border-sky-400/50", glow: "shadow-[0_0_15px_rgba(56,189,248,0.15)]", accent: "text-sky-400", bg: "bg-gradient-to-r from-sky-400/10 via-yellow-500/5 to-transparent" },
  "hulk": { border: "border-green-500/50", glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]", accent: "text-green-400", bg: "bg-gradient-to-r from-green-500/10 to-transparent" },
  "black panther": { border: "border-purple-500/50", glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]", accent: "text-purple-400", bg: "bg-gradient-to-r from-purple-500/10 via-violet-500/5 to-transparent" },
  "wolverine": { border: "border-yellow-500/50", glow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]", accent: "text-yellow-400", bg: "bg-gradient-to-r from-yellow-500/10 to-transparent" },
  "deadpool": { border: "border-red-500/50", glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-500/10 to-transparent" },
  "scarlet witch": { border: "border-red-400/50", glow: "shadow-[0_0_15px_rgba(248,113,113,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-400/10 via-rose-500/5 to-transparent" },
  "wanda": { border: "border-red-400/50", glow: "shadow-[0_0_15px_rgba(248,113,113,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-400/10 via-rose-500/5 to-transparent" },
  "doctor strange": { border: "border-orange-500/50", glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]", accent: "text-orange-400", bg: "bg-gradient-to-r from-orange-500/10 via-purple-500/5 to-transparent" },
  "fantastic four": { border: "border-blue-400/50", glow: "shadow-[0_0_15px_rgba(96,165,250,0.15)]", accent: "text-blue-400", bg: "bg-gradient-to-r from-blue-400/10 to-transparent" },
  "daredevil": { border: "border-red-700/50", glow: "shadow-[0_0_15px_rgba(185,28,28,0.15)]", accent: "text-red-600", bg: "bg-gradient-to-r from-red-700/10 to-transparent" },
  "punisher": { border: "border-zinc-400/50", glow: "shadow-[0_0_15px_rgba(161,161,170,0.15)]", accent: "text-zinc-300", bg: "bg-gradient-to-r from-zinc-500/10 to-transparent" },
  "x-men": { border: "border-yellow-400/50", glow: "shadow-[0_0_15px_rgba(250,204,21,0.15)]", accent: "text-yellow-400", bg: "bg-gradient-to-r from-yellow-400/10 via-blue-500/5 to-transparent" },
  // Villains
  "doom": { border: "border-green-500/50", glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]", accent: "text-green-400", bg: "bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent" },
  "doomsday": { border: "border-green-500/50", glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]", accent: "text-green-400", bg: "bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent" },
  "thanos": { border: "border-purple-600/50", glow: "shadow-[0_0_15px_rgba(147,51,234,0.15)]", accent: "text-purple-500", bg: "bg-gradient-to-r from-purple-600/10 via-yellow-500/5 to-transparent" },
  "loki": { border: "border-emerald-500/50", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]", accent: "text-emerald-400", bg: "bg-gradient-to-r from-emerald-500/10 via-yellow-500/5 to-transparent" },
  "venom": { border: "border-zinc-300/50", glow: "shadow-[0_0_15px_rgba(212,212,216,0.15)]", accent: "text-zinc-300", bg: "bg-gradient-to-r from-zinc-400/10 to-transparent" },
  "kang": { border: "border-blue-500/50", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", accent: "text-blue-400", bg: "bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent" },
  "galactus": { border: "border-purple-500/50", glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]", accent: "text-purple-400", bg: "bg-gradient-to-r from-purple-500/10 to-transparent" },
  "red skull": { border: "border-red-600/50", glow: "shadow-[0_0_15px_rgba(220,38,38,0.15)]", accent: "text-red-500", bg: "bg-gradient-to-r from-red-600/10 to-transparent" },
  // Movies/Events
  "secret wars": { border: "border-violet-500/50", glow: "shadow-[0_0_15px_rgba(139,92,246,0.15)]", accent: "text-violet-400", bg: "bg-gradient-to-r from-violet-500/10 to-transparent" },
  "avengers": { border: "border-indigo-500/50", glow: "shadow-[0_0_15px_rgba(99,102,241,0.15)]", accent: "text-indigo-400", bg: "bg-gradient-to-r from-indigo-500/10 to-transparent" },
  "thunderbolts": { border: "border-yellow-500/50", glow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]", accent: "text-yellow-400", bg: "bg-gradient-to-r from-yellow-500/10 to-transparent" },
};

/** Get character theme from article title, tags, or related characters */
function getArticleTheme(article: { title: string; tags?: string[] | string | null; relatedCharacters?: string[] | string | null }) {
  const searchText = [
    article.title,
    ...(Array.isArray(article.tags) ? article.tags : []),
    ...(Array.isArray(article.relatedCharacters) ? article.relatedCharacters : []),
  ].join(" ").toLowerCase();

  for (const [keyword, theme] of Object.entries(CHARACTER_THEMES)) {
    if (searchText.includes(keyword)) return theme;
  }
  return null;
}

// MCU Phase 6 Timeline Data
const MCU_TIMELINE = [
  { title: "Thunderbolts*", date: "May 2, 2025", type: "movie", status: "released" },
  { title: "Fantastic Four: First Steps", date: "Jul 25, 2025", type: "movie", status: "released" },
  { title: "Wonder Man", date: "Jan 27, 2026", type: "show", status: "released" },
  { title: "Daredevil: Born Again S2", date: "Mar 24, 2026", type: "show", status: "streaming" },
  { title: "The Punisher Special", date: "2026", type: "show", status: "upcoming" },
  { title: "Spider-Man: Brand New Day", date: "Jul 31, 2026", type: "movie", status: "upcoming" },
  { title: "X-Men '97 Season 2", date: "2026", type: "show", status: "upcoming" },
  { title: "Avengers: Doomsday", date: "Dec 18, 2026", type: "movie", status: "upcoming" },
  { title: "VisionQuest", date: "Late 2026", type: "show", status: "upcoming" },
  { title: "Avengers: Secret Wars", date: "Dec 17, 2027", type: "movie", status: "upcoming" },
];

function formatDate(timestamp: number | null): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCategoryLabel(key: string): string {
  return CATEGORIES.find(c => c.key === key)?.label ?? key;
}

export default function MCUNews() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allArticles = [], isLoading } = trpc.articles.list.useQuery(
    activeCategory === "all" ? undefined : { category: activeCategory }
  );
  const { data: featuredArticles = [] } = trpc.articles.featured.useQuery();



  const filteredArticles = useMemo(() => {
    let list = allArticles;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          (a.tags as string[] | null)?.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allArticles, searchQuery]);

  // Featured articles: newest first (no rotation)
  const mainFeatured = featuredArticles.length > 0 ? featuredArticles[0] : null;
  const sideFeatured = featuredArticles.slice(1, 3);

  return (
    <div className="min-h-screen">
      <SEO
        title="MCU News — Marvel News, Rumors & Card Market Impact"
        description="Your command center for MCU news, casting updates, release dates, and how they impact the Marvel trading card market. Stay ahead of the curve."
        path="/mcu-news"
        image={HERO_IMG}
        type="website"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "MCU News", url: "/mcu-news" },
        ])}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[400px] lg:min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">MCU NEWS HUB</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-4">
              MCU <span className="text-primary">NEWS</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Your command center for Marvel Cinematic Universe news, casting updates, release dates, and how every announcement impacts the trading card market.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FEATURED ARTICLES ===== */}
      {featuredArticles.length > 0 && (
        <section className="py-12 border-b border-border">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Featured News</h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Featured */}
              {mainFeatured && (
                <Link
                  href={`/mcu-news/${mainFeatured.slug}`}
                  className="lg:col-span-2 group rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300"
                >
                  {/* Image section */}
                  <div className="relative aspect-[16/9] lg:aspect-[2/1] overflow-hidden">
                    <img
                      src={mainFeatured.featuredImageUrl || CARD_MARKET_IMG}
                      alt={mainFeatured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Desktop: overlay text on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent hidden lg:block" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 hidden lg:block">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border mb-3 ${CATEGORY_COLORS[mainFeatured.category] || CATEGORY_COLORS.movie_news}`}>
                        {getCategoryLabel(mainFeatured.category)}
                      </span>
                      <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {mainFeatured.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 mb-3">{mainFeatured.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(mainFeatured.publishedAt)}
                        </span>
                        {mainFeatured.authorName && (
                          <span>By {mainFeatured.authorName}</span>
                        )}
                      </div>
                      {mainFeatured.cardMarketImpact && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium">{mainFeatured.cardMarketImpact}</span>
                        </div>
                      )}
                    </div>
                    {/* Mobile: category badge on image */}
                    <div className="absolute top-3 left-3 lg:hidden">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${CATEGORY_COLORS[mainFeatured.category] || CATEGORY_COLORS.movie_news}`}>
                        {getCategoryLabel(mainFeatured.category)}
                      </span>
                    </div>
                  </div>
                  {/* Mobile: text below image */}
                  <div className="p-4 lg:hidden">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {mainFeatured.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{mainFeatured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(mainFeatured.publishedAt)}
                      </span>
                      {mainFeatured.authorName && (
                        <span>By {mainFeatured.authorName}</span>
                      )}
                    </div>
                    {mainFeatured.cardMarketImpact && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="font-medium line-clamp-2">{mainFeatured.cardMarketImpact}</span>
                      </div>
                    )}
                  </div>
                </Link>
              )}

              {/* Side Featured */}
              <div className="flex flex-col gap-6">
                {sideFeatured.map(article => (
                  <Link
                    key={article.id}
                    href={`/mcu-news/${article.slug}`}
                    className="group rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 flex-1"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={article.featuredImageUrl || CARD_MARKET_IMG}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Desktop: overlay text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent hidden lg:block" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 hidden lg:block">
                        <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full border mb-2 ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.movie_news}`}>
                          {getCategoryLabel(article.category)}
                        </span>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      {/* Mobile: category badge on image */}
                      <div className="absolute top-3 left-3 lg:hidden">
                        <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full border ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.movie_news}`}>
                          {getCategoryLabel(article.category)}
                        </span>
                      </div>
                    </div>
                    {/* Mobile: text below image */}
                    <div className="p-3 lg:hidden">
                      <h3 className="text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
                {sideFeatured.length === 0 && (
                  <div className="flex-1 rounded-xl bg-card/50 border border-dashed border-border flex items-center justify-center p-8">
                    <p className="text-muted-foreground text-center text-sm">More featured news coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== MCU PHASE 6 TIMELINE ===== */}
      <section className="py-12 border-b border-border bg-card/30">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">MCU Phase 6 Timeline</h2>
          </div>
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
              {MCU_TIMELINE.map((item, i) => {
                const isReleased = item.status === "released";
                const isStreaming = item.status === "streaming";
                const isActive = isStreaming;
                return (
                  <div
                    key={i}
                    className={`relative flex-shrink-0 w-48 rounded-lg border p-4 transition-all ${
                      isActive
                        ? "bg-primary/10 border-primary/50 ring-1 ring-primary/30"
                        : isReleased
                        ? "bg-card/50 border-border/50 opacity-70"
                        : "bg-card border-border hover:border-primary/30"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-2 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Now Streaming
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === "movie" ? (
                        <Film className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      ) : (
                        <Tv className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      )}
                      <span className={`text-xs font-medium uppercase ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {item.type}
                      </span>
                    </div>
                    <h3 className={`font-bold text-sm mb-1 ${isReleased && !isActive ? "text-muted-foreground" : ""}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    {isReleased && !isActive && (
                      <span className="mt-2 inline-block text-[10px] font-bold text-muted-foreground/60 uppercase">Released</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY FILTERS + SEARCH + ARTICLES ===== */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground hidden sm:inline">Filter:</span>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Article List */}
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-48 h-32 bg-muted rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded w-20" />
                          <div className="h-6 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-full" />
                          <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-16 bg-card/50 rounded-xl border border-dashed border-border">
                  <Newspaper className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No News Found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? `No articles matching "${searchQuery}"`
                      : "No articles published yet in this category. Check back soon."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredArticles.map(article => {
                    const theme = getArticleTheme(article as any);
                    return (
                    <Link
                      key={article.id}
                      href={`/mcu-news/${article.slug}`}
                      className={`group flex flex-col sm:flex-row gap-4 rounded-xl border p-4 transition-all duration-300 ${
                        theme
                          ? `${theme.border} ${theme.glow} ${theme.bg} hover:shadow-lg`
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={article.featuredImageUrl || CARD_MARKET_IMG}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full border ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.movie_news}`}>
                            {getCategoryLabel(article.category)}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.excerpt}</p>

                        {/* Tags */}
                        {(article.tags as string[] | null)?.length ? (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {(article.tags as string[]).slice(0, 4).map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {/* Card Market Impact */}
                        {article.cardMarketImpact && (
                          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {article.cardMarketImpact}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="hidden sm:flex items-center">
                        <ChevronRight className={`w-5 h-5 transition-colors ${theme ? `text-muted-foreground group-hover:${theme.accent}` : "text-muted-foreground group-hover:text-primary"}`} />
                      </div>
                    </Link>
                  );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
              {/* Card Market Pulse */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={CARD_MARKET_IMG} alt="Card Market" className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Card Market Pulse</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Marvel trading card market showing positive momentum since Topps 2025 product cycle. Collectibles market projected to hit $602.4B in 2026.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Market Trend</span>
                      <span className="text-primary font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Bullish
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Doomsday Hype</span>
                      <span className="text-amber-400 font-bold">Very High</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">New Sets</span>
                      <span className="text-foreground font-bold">6 Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link href="/cards" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5">
                    <ArrowRight className="w-3.5 h-3.5" /> Browse Card Database
                  </Link>
                  <Link href="/characters" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5">
                    <ArrowRight className="w-3.5 h-3.5" /> Character Encyclopedia
                  </Link>
                  <Link href="/shop" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5">
                    <ArrowRight className="w-3.5 h-3.5" /> Shop Repacks
                  </Link>
                  <Link href="/checklists" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5">
                    <ArrowRight className="w-3.5 h-3.5" /> View Checklists
                  </Link>
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-5">
                <h3 className="font-bold mb-2">Stay in the Loop</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get MCU news and card market updates delivered to your inbox.
                </p>
                <Link href="/subscribe">
                  <Button className="w-full" size="sm">
                    Subscribe to Updates
                  </Button>
                </Link>
              </div>

              {/* Facebook Follow CTA */}
              <a
                href="https://www.facebook.com/profile.php?id=61575227498498"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-blue-600/10 to-blue-500/5 rounded-xl border border-blue-500/20 p-5 group hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/20">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <h3 className="font-bold group-hover:text-blue-400 transition-colors">Follow on Facebook</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Join the NLF community for breaking MCU news, card drops, and live stream alerts.
                </p>
                <span className="text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">Like Our Page &rarr;</span>
              </a>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
