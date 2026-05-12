/**
 * Nerd Gossip - Rumors, Leaks & Speculation Hub
 * A purple-themed gossip page for MCU rumors with a fun, edgy personality
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Newspaper, TrendingUp, Calendar, Users, Film, Tv, MessageSquare,
  Search, ChevronRight, Clock, Tag, ExternalLink, Sparkles, Zap,
  ArrowRight, Filter, Eye, AlertTriangle, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const CATEGORIES = [
  { key: "all", label: "All Gossip", icon: Newspaper },
  { key: "nerd_gossip", label: "Nerd Gossip", icon: MessageSquare },
  { key: "rumors", label: "Rumors", icon: Eye },
  { key: "movie_news", label: "Movie Leaks", icon: Film },
  { key: "casting", label: "Casting Buzz", icon: Users },
  { key: "analysis", label: "Analysis", icon: Sparkles },
];

const CATEGORY_COLORS: Record<string, string> = {
  nerd_gossip: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  movie_news: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  casting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  card_market: "bg-primary/20 text-primary border-primary/30",
  rumors: "bg-red-500/20 text-red-400 border-red-500/30",
  analysis: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

// Character-themed color accents for article cards
const CHARACTER_THEMES: Record<string, { border: string; glow: string; accent: string; bg: string }> = {
  "spider-man": { border: "border-red-500/50", glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-500/10 via-blue-500/5 to-transparent" },
  "spiderman": { border: "border-red-500/50", glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-500/10 via-blue-500/5 to-transparent" },
  "wolverine": { border: "border-yellow-500/50", glow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]", accent: "text-yellow-400", bg: "bg-gradient-to-r from-yellow-500/10 to-transparent" },
  "doom": { border: "border-green-500/50", glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]", accent: "text-green-400", bg: "bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent" },
  "doomsday": { border: "border-green-500/50", glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]", accent: "text-green-400", bg: "bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent" },
  "deadpool": { border: "border-red-500/50", glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-500/10 to-transparent" },
  "x-men": { border: "border-yellow-400/50", glow: "shadow-[0_0_15px_rgba(250,204,21,0.15)]", accent: "text-yellow-400", bg: "bg-gradient-to-r from-yellow-400/10 via-blue-500/5 to-transparent" },
  "gambit": { border: "border-pink-500/50", glow: "shadow-[0_0_15px_rgba(236,72,153,0.15)]", accent: "text-pink-400", bg: "bg-gradient-to-r from-pink-500/10 to-transparent" },
  "thanos": { border: "border-purple-600/50", glow: "shadow-[0_0_15px_rgba(147,51,234,0.15)]", accent: "text-purple-500", bg: "bg-gradient-to-r from-purple-600/10 via-yellow-500/5 to-transparent" },
  "avengers": { border: "border-indigo-500/50", glow: "shadow-[0_0_15px_rgba(99,102,241,0.15)]", accent: "text-indigo-400", bg: "bg-gradient-to-r from-indigo-500/10 to-transparent" },
  "secret wars": { border: "border-violet-500/50", glow: "shadow-[0_0_15px_rgba(139,92,246,0.15)]", accent: "text-violet-400", bg: "bg-gradient-to-r from-violet-500/10 to-transparent" },
  "ghost rider": { border: "border-orange-500/50", glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]", accent: "text-orange-400", bg: "bg-gradient-to-r from-orange-500/10 to-transparent" },
  "blade": { border: "border-red-700/50", glow: "shadow-[0_0_15px_rgba(185,28,28,0.15)]", accent: "text-red-600", bg: "bg-gradient-to-r from-red-700/10 to-transparent" },
  "daredevil": { border: "border-red-700/50", glow: "shadow-[0_0_15px_rgba(185,28,28,0.15)]", accent: "text-red-600", bg: "bg-gradient-to-r from-red-700/10 to-transparent" },
  "fantastic four": { border: "border-blue-400/50", glow: "shadow-[0_0_15px_rgba(96,165,250,0.15)]", accent: "text-blue-400", bg: "bg-gradient-to-r from-blue-400/10 to-transparent" },
  "scarlet witch": { border: "border-red-400/50", glow: "shadow-[0_0_15px_rgba(248,113,113,0.15)]", accent: "text-red-400", bg: "bg-gradient-to-r from-red-400/10 via-rose-500/5 to-transparent" },
};

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

function formatDate(timestamp: number | null): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getCategoryLabel(key: string): string {
  return CATEGORIES.find(c => c.key === key)?.label ?? key;
}

// Rumor credibility levels
function getCredibilityBadge(tags: string[] | string | null) {
  const tagList = Array.isArray(tags) ? tags : [];
  const tagStr = tagList.join(" ").toLowerCase();
  if (tagStr.includes("confirmed")) return { label: "CONFIRMED", color: "bg-green-500/20 text-green-400 border-green-500/30" };
  if (tagStr.includes("likely") || tagStr.includes("reliable")) return { label: "HIGHLY LIKELY", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
  if (tagStr.includes("debunked")) return { label: "DEBUNKED", color: "bg-red-500/20 text-red-400 border-red-500/30" };
  return { label: "RUMOR", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
}

export default function NerdGossip() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch articles that are nerd_gossip OR rumors category
  const { data: gossipArticles = [], isLoading } = trpc.articles.list.useQuery(
    activeCategory === "all" ? { category: "nerd_gossip" } : { category: activeCategory }
  );
  // Also fetch rumors to combine
  const { data: rumorArticles = [] } = trpc.articles.list.useQuery({ category: "rumors" });

  // Combine nerd_gossip and rumors for the "all" view
  const allArticles = useMemo(() => {
    if (activeCategory === "all") {
      const combined = [...gossipArticles, ...rumorArticles];
      // Deduplicate by id
      const seen = new Set<number>();
      return combined.filter(a => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      }).sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
    }
    return gossipArticles;
  }, [gossipArticles, rumorArticles, activeCategory]);

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

  return (
    <div className="min-h-screen">
      <SEO
        title="Rumors & Nerd Gossip — MCU Leaks, Speculation & Insider Buzz"
        description="The hottest MCU rumors, leaked plot details, casting gossip, and insider speculation. Every rumor analyzed with card market impact for collectors."
        path="/nerd-gossip"
        type="website"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Nerd Gossip", url: "/nerd-gossip" },
        ])}
      />

      {/* ===== HERO SECTION — Purple-themed ===== */}
      <section className="relative min-h-[400px] lg:min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-purple-950/50" />
        {/* Animated gossip particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-30 left-1/3 w-2 h-2 bg-purple-300/25 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-60 right-1/4 w-4 h-4 bg-purple-600/15 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-20 right-10 w-2 h-2 bg-violet-400/30 rounded-full animate-pulse" style={{ animationDelay: "0.7s" }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="container relative z-10 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-full mb-6">
              <AlertTriangle className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-bold tracking-wide">UNVERIFIED INTEL</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-4">
              RUMORS & <span className="text-purple-400">NERD GOSSIP</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-4">
              The hottest MCU leaks, insider speculation, and unverified intel from across the multiverse. Every rumor analyzed with card market impact for collectors.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400/80 text-xs">
              <Eye className="w-3 h-3" />
              <span>Disclaimer: The following content is unconfirmed rumor and speculation. The Watcher neither confirms nor denies these reports.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY FILTERS ===== */}
      <section className="py-6 border-b border-purple-500/20 bg-purple-950/10">
        <div className="container">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-purple-400 mr-1" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  activeCategory === cat.key
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    : "bg-transparent text-muted-foreground border-transparent hover:bg-purple-500/10 hover:text-purple-400"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
            {/* Search */}
            <div className="ml-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search gossip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-background/50 border border-purple-500/20 rounded-lg text-sm focus:outline-none focus:border-purple-500/50 w-48"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARTICLES GRID ===== */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl bg-card border border-purple-500/10 overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-purple-500/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-purple-500/10 rounded w-1/4" />
                    <div className="h-6 bg-purple-500/10 rounded w-3/4" />
                    <div className="h-4 bg-purple-500/5 rounded w-full" />
                    <div className="h-4 bg-purple-500/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-16 h-16 text-purple-500/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Gossip Yet</h3>
              <p className="text-muted-foreground">The multiverse is quiet... for now. Check back soon for the latest rumors and leaks.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const theme = getArticleTheme({ ...article, tags: article.tags as string[] | null, relatedCharacters: article.relatedCharacters as string[] | null });
                const credibility = getCredibilityBadge(article.tags as string[] | null);
                return (
                  <Link
                    key={article.id}
                    href={`/mcu-news/${article.slug}`}
                    className={`group rounded-xl overflow-hidden bg-card border transition-all duration-300 hover:scale-[1.02] ${
                      theme
                        ? `${theme.border} ${theme.glow} hover:${theme.border.replace("/50", "/70")}`
                        : "border-purple-500/20 hover:border-purple-500/50"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {article.featuredImageUrl ? (
                        <img
                          src={article.featuredImageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-purple-600/20 flex items-center justify-center">
                          <MessageSquare className="w-12 h-12 text-purple-500/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Credibility badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${credibility.color}`}>
                          {credibility.label}
                        </span>
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${
                          CATEGORY_COLORS[article.category] ?? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        }`}>
                          {getCategoryLabel(article.category)}
                        </span>
                      </div>
                      {/* Card market impact */}
                      {article.cardMarketImpact && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
                            <TrendingUp className="w-3 h-3 text-primary flex-shrink-0" />
                            <span className="text-[11px] text-primary font-medium truncate">{article.cardMarketImpact}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`p-5 ${theme ? theme.bg : ""}`}>
                      <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <span className="flex items-center gap-1 text-purple-400 font-medium group-hover:gap-2 transition-all">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== SOURCES SECTION ===== */}
      <section className="py-12 border-t border-purple-500/20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Our <span className="text-purple-400">Sources</span></h2>
            <p className="text-muted-foreground mb-8">
              We aggregate rumors and speculation from the most trusted MCU leak and analysis channels across the internet, then break down the card market implications for collectors.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Den of Nerds", url: "https://youtube.com/@thedenofnerds" },
                { name: "Den of Nerds Live", url: "https://youtube.com/@thedenofnerdslive" },
                { name: "Cosmic Wonder", url: "https://youtube.com/@thecosmicwonder" },
                { name: "Everything Always", url: "https://youtube.com/@everythingalways" },
              ].map((source) => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/5 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 hover:border-purple-500/40 transition-all text-sm font-medium text-purple-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {source.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-12 border-t border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-background to-purple-950/30">
        <div className="container text-center">
          <Flame className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Want the Cards Before the Hype?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Every rumor we cover ties back to real cards you can collect right now. Check out the full Marvel Mint and Comic Book Heroes sets before prices spike.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/cards">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white">
                Browse Card Database
              </Button>
            </Link>
            <a href="https://mintcomiccards.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                Marvel Mint Cards
              </Button>
            </a>
            <a href="https://comicbookcard.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                Comic Book Heroes
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
