/**
 * Card Database / Marvel Encyclopedia Page
 * SEO-optimized, image-rich card browser with CSS flip animation
 * Lazy loading images for performance
 */

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, ChevronRight, BookOpen, Layers, Hash, ArrowLeft,
  Star, X, Grid3X3, List, DollarSign, Sparkles
} from "lucide-react";
import { useLocation } from "wouter";
import { CARD_TYPE_TO_THEME } from "./CardDisplay";

// Default placeholder for cards without images
const PLACEHOLDER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk_9ebdacfa.png";

// ==================== ERA COLOR THEMES ====================
// Different color themes for each card era/subset
// Cosmic nebula background images for CBH eras
const COSMIC_BG: Record<string, string> = {
  "COMIC BOOK HEROES 1975": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-1975-gold-amber_4a450d14.png",
  "COMIC BOOK HEROES 1976": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-1976-blue-silver_6b1bd586.png",
  "COMIC BOOK HEROES 2025": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-2025-emerald-green_6d5f07b4.png",
  "BASE CARDS \u2013 BRONZE": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-mint-bronze_ab7d9bd7.png",
  "BASE CARDS \u2013 SILVER": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-mint-silver_4a175856.png",
  "BASE CARDS \u2013 GOLD": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-mint-gold_d9dc1d49.png",
  "BASE CARDS \u2013 PLATINUM": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-mint-platinum_0fe0fc77.png",
};

const ERA_THEMES: Record<string, {
  bg: string;       // card background gradient
  border: string;   // border color on hover
  badge: string;    // badge styling
  glow: string;     // hover glow color
  accent: string;   // accent text color
  headerBg: string; // section header gradient
  label: string;    // display label
  borderColor: string; // raw border color for cosmic frame
  glowColor: string;   // raw glow color for cosmic frame
}> = {
  "COMIC BOOK HEROES 1975": {
    bg: "bg-gradient-to-b from-amber-950/40 via-card to-card",
    border: "hover:border-amber-500/60",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    glow: "hover:shadow-amber-500/10",
    accent: "text-amber-400",
    headerBg: "from-amber-900/30 via-amber-950/20 to-background",
    label: "1975 Era",
    borderColor: "rgba(245, 158, 11, 0.7)",
    glowColor: "rgba(245, 158, 11, 0.35)",
  },
  "COMIC BOOK HEROES 1976": {
    bg: "bg-gradient-to-b from-blue-950/40 via-card to-card",
    border: "hover:border-blue-400/60",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    glow: "hover:shadow-blue-500/10",
    accent: "text-blue-400",
    headerBg: "from-blue-900/30 via-blue-950/20 to-background",
    label: "1976 Era",
    borderColor: "rgba(100, 149, 237, 0.7)",
    glowColor: "rgba(100, 149, 237, 0.35)",
  },
  "COMIC BOOK HEROES 2025": {
    bg: "bg-gradient-to-b from-emerald-950/40 via-card to-card",
    border: "hover:border-emerald-400/60",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    glow: "hover:shadow-emerald-500/10",
    accent: "text-emerald-400",
    headerBg: "from-emerald-900/30 via-emerald-950/20 to-background",
    label: "2025 Era",
    borderColor: "rgba(16, 185, 129, 0.7)",
    glowColor: "rgba(16, 185, 129, 0.35)",
  },
  // Marvel Mint subset themes (for future use)
  "BASE CARDS – BRONZE": {
    bg: "bg-gradient-to-b from-orange-950/40 via-card to-card",
    border: "hover:border-orange-500/60",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    glow: "hover:shadow-orange-500/10",
    accent: "text-orange-400",
    headerBg: "from-orange-900/30 via-orange-950/20 to-background",
    label: "Bronze",
    borderColor: "rgba(249, 115, 22, 0.7)",
    glowColor: "rgba(249, 115, 22, 0.35)",
  },
  "BASE CARDS – SILVER": {
    bg: "bg-gradient-to-b from-slate-800/40 via-card to-card",
    border: "hover:border-slate-400/60",
    badge: "bg-slate-400/15 text-slate-300 border-slate-400/30",
    glow: "hover:shadow-slate-400/10",
    accent: "text-slate-300",
    headerBg: "from-slate-700/30 via-slate-800/20 to-background",
    label: "Silver",
    borderColor: "rgba(148, 163, 184, 0.7)",
    glowColor: "rgba(148, 163, 184, 0.35)",
  },
  "BASE CARDS – GOLD": {
    bg: "bg-gradient-to-b from-yellow-900/40 via-card to-card",
    border: "hover:border-yellow-500/60",
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    glow: "hover:shadow-yellow-500/10",
    accent: "text-yellow-400",
    headerBg: "from-yellow-900/30 via-yellow-950/20 to-background",
    label: "Gold",
    borderColor: "rgba(234, 179, 8, 0.7)",
    glowColor: "rgba(234, 179, 8, 0.35)",
  },
  "BASE CARDS – PLATINUM": {
    bg: "bg-gradient-to-b from-zinc-700/40 via-card to-card",
    border: "hover:border-zinc-300/60",
    badge: "bg-zinc-300/15 text-zinc-200 border-zinc-300/30",
    glow: "hover:shadow-zinc-300/10",
    accent: "text-zinc-200",
    headerBg: "from-zinc-600/30 via-zinc-800/20 to-background",
    label: "Platinum",
    borderColor: "rgba(212, 212, 216, 0.7)",
    glowColor: "rgba(212, 212, 216, 0.35)",
  },
};

const DEFAULT_THEME = {
  bg: "",
  border: "hover:border-primary/50",
  badge: "",
  glow: "hover:shadow-primary/5",
  accent: "text-primary",
  headerBg: "from-primary/10 via-background to-purple-900/10",
  label: "",
  borderColor: "rgba(132, 204, 22, 0.5)",
  glowColor: "rgba(132, 204, 22, 0.2)",
};

function getEraTheme(cardType: string) {
  return ERA_THEMES[cardType] || DEFAULT_THEME;
}

// ==================== LAZY IMAGE ====================
function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className || ""}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse rounded-lg" />
      )}
      {inView && !error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 16vw"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="w-6 h-6 text-muted-foreground">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== CARD IMAGE (no flip) ====================
function CardImage({ frontImg, name, cardNumber, cosmicBg, borderColor, glowColor }: {
  frontImg: string;
  name: string;
  cardNumber: string;
  cosmicBg?: string;
  borderColor?: string;
  glowColor?: string;
}) {
  const hasCosmic = !!cosmicBg;

  return (
    <div
      className="relative group"
      title={name}
    >
      {/* Cosmic background container */}
      {hasCosmic && (
        <div
          className="absolute inset-[-8px] rounded-xl overflow-hidden opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          style={{
            backgroundImage: `url(${cosmicBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(1px)",
          }}
        />
      )}
      {/* Cosmic glow ring */}
      {hasCosmic && glowColor && (
        <div
          className="absolute inset-[-4px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: `0 0 20px 4px ${glowColor}, 0 0 40px 8px ${glowColor?.replace('0.35', '0.15')}`,
          }}
        />
      )}
      <div
        className="relative w-full"
        style={{ aspectRatio: "2.5/3.5" }}
      >
        <div
          className="absolute inset-0 rounded-lg overflow-hidden bg-card"
          style={{
            border: hasCosmic ? `2px solid ${borderColor || 'rgba(255,255,255,0.3)'}` : '1px solid rgba(255,255,255,0.1)',
            boxShadow: hasCosmic ? `0 4px 15px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)` : 'none',
          }}
        >
          <LazyImage
            src={frontImg}
            alt={`${name} #${cardNumber} - 2025 Topps Marvel Trading Card`}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

// ==================== QUICK COMP BUTTON ====================
function QuickCompButton({ cardName, setName, compact }: { cardName: string; setName: string; compact?: boolean }) {
  const [, navigate] = useLocation();
  
  const handleComp = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const query = encodeURIComponent(`${cardName} ${setName}`);
    navigate(`/admin/ebay-comps?q=${query}`);
  };

  if (compact) {
    return (
      <button
        onClick={handleComp}
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
        title={`Check eBay price for ${cardName}`}
      >
        <DollarSign className="w-3 h-3" />
        Comp
      </button>
    );
  }

  return (
    <button
      onClick={handleComp}
      className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
      title={`Check eBay price for ${cardName}`}
    >
      <DollarSign className="w-3 h-3" />
      Quick Comp
    </button>
  );
}

// ==================== SET BROWSER ====================

export default function CardDatabase() {
  const [, params] = useRoute("/cards/:slug");

  if (params?.slug) {
    return <SetDetail slug={params.slug} />;
  }

  return <SetBrowser />;
}

function SetBrowser() {
  const { data: sets, isLoading } = trpc.public.marvel.sets.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults } = trpc.public.marvel.search.useQuery(
    { query: searchQuery, limit: 50 },
    { enabled: searchQuery.length >= 2 }
  );

  // SEO: structured data for the page
  useEffect(() => {
    document.title = "Marvel Card Database | 2025 Topps Sets | Northland Legendary Finds";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Browse every 2025 Topps Marvel trading card set. Complete checklists for Chrome, Comic Book Heroes, Marvel Mint, Sapphire, and more. Know what you could pull in NLF repacks.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-900/10" />
        <div className="container relative py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/15 border border-primary/30">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Card Database</h1>
              <p className="text-muted-foreground mt-1">
                Browse every 2025 Topps Marvel card set — know what you could pull
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-lg mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search cards by character name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base bg-card border-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container pb-16">
        {/* Search Results */}
        {searchQuery.length >= 2 && searchResults && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Results
              <Badge variant="secondary">{searchResults.length}</Badge>
            </h2>
            {searchResults.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No cards found matching "{searchQuery}"</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
                {searchResults.map((card: any) => {
                  const theme = getEraTheme(card.cardType || '');
                  const cosmicBgUrl = COSMIC_BG[card.cardType || ''];
                  const hasCosmic = !!cosmicBgUrl;
                  return (
                    <article key={card.id} className="group">
                      <div className={`rounded-lg overflow-hidden transition-all ${hasCosmic ? 'border-0 bg-transparent' : 'bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'}`}>
                        <div className={hasCosmic ? 'p-2 pt-3' : ''}>
                          <CardImage
                            frontImg={card.imageUrl || PLACEHOLDER_IMG}
                            name={card.characterName}
                            cardNumber={card.cardNumber}
                            cosmicBg={cosmicBgUrl}
                            borderColor={theme.borderColor}
                            glowColor={theme.glowColor}
                          />
                        </div>
                        <div className={`p-3 ${hasCosmic ? 'bg-black/40 backdrop-blur-sm rounded-b-lg' : ''}`}>
                          <p className="font-semibold text-sm truncate">{card.characterName}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">#{card.cardNumber}</span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${theme.badge}`}>{card.cardType || "Base"}</Badge>
                          </div>
                          {card.setName && (
                            <p className="text-[10px] text-muted-foreground mt-1 truncate">{card.setName}</p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Set Grid */}
        {(!searchQuery || searchQuery.length < 2) && (
          <>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              2025 Topps Marvel Sets
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-72 rounded-xl bg-card animate-pulse border border-border" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sets?.map((set) => (
                  <Link key={set.id} href={`/cards/${set.slug}`}>
                    <article className="group relative overflow-hidden rounded-xl border-2 border-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/15 cursor-pointer">
                      {/* Green gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.20_0.08_145)] via-[oklch(0.15_0.06_155)] to-[oklch(0.12_0.04_165)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.30_0.12_145/0.3),transparent_60%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.25_0.10_195/0.2),transparent_60%)]" />
                      
                      <div className="relative z-10 p-5">
                        {/* Box image + info layout */}
                        <div className="flex gap-4 items-start">
                          {/* Box image */}
                          <div className="shrink-0 w-28 h-36 rounded-lg overflow-hidden border border-primary/20 bg-black/30 shadow-lg group-hover:scale-105 transition-transform duration-300">
                            {set.imageUrl ? (
                              <img
                                src={set.imageUrl}
                                alt={`${set.name} box`}
                                className="w-full h-full object-contain p-1"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Layers className="w-10 h-10 text-primary/40" />
                              </div>
                            )}
                          </div>

                          {/* Set info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors">
                              {set.name}
                            </h3>
                            {set.shortName && set.shortName !== set.name && (
                              <p className="text-xs text-primary/70 font-medium mt-0.5">{set.shortName}</p>
                            )}

                            <div className="flex items-center gap-3 mt-3 text-sm">
                              <div className="flex items-center gap-1.5 text-primary/80">
                                <Hash className="w-3.5 h-3.5" />
                                <span className="font-semibold">{set.totalCards}</span>
                                <span className="text-muted-foreground text-xs">cards</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-primary/80">
                                <Star className="w-3.5 h-3.5" />
                                <span className="font-semibold">{set.releaseYear}</span>
                              </div>
                            </div>

                            {/* View button */}
                            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                              <span>View Full Set</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {sets && (
              <div className="mt-8 text-center text-muted-foreground">
                <p>{sets.length} sets &bull; {sets.reduce((sum, s) => sum + (s.totalCards ?? 0), 0)} total cards in database</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ==================== PLAYING CARD SUIT LAYOUT ====================

const SUIT_ORDER = ["Clubs", "Diamonds", "Hearts", "Spades"];
const SUIT_SYMBOLS: Record<string, string> = { Clubs: "\u2663", Diamonds: "\u2666", Hearts: "\u2665", Spades: "\u2660" };
const SUIT_COLORS: Record<string, string> = { Clubs: "text-emerald-400", Diamonds: "text-blue-400", Hearts: "text-red-400", Spades: "text-purple-400" };
const RANK_ORDER = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function isPlayingCardType(cardType: string) {
  return cardType === "GAMBIT'S DECK" || cardType === "GAMBITS DECK DOUBLE SIDED CHROME PLAYING CARDS";
}

function getPlayingCardSuit(card: { cardNumber: string; characterName: string; cardType: string }): string {
  // Gambit's Deck: "2 of Clubs", "Jack of Hearts", etc.
  if (card.cardType === "GAMBIT'S DECK") {
    for (const suit of SUIT_ORDER) {
      if (card.characterName.toLowerCase().includes(suit.toLowerCase())) return suit;
    }
  }
  // Chrome Playing Cards: cardNumber like C-2, D-10, H-J, S-A
  const prefix = card.cardNumber.charAt(0);
  const suitMap: Record<string, string> = { C: "Clubs", D: "Diamonds", H: "Hearts", S: "Spades" };
  return suitMap[prefix] || "Clubs";
}

function getPlayingCardRank(card: { cardNumber: string; characterName: string; cardType: string }): string {
  if (card.cardType === "GAMBIT'S DECK") {
    const name = card.characterName.toLowerCase();
    if (name.startsWith("ace")) return "A";
    if (name.startsWith("king")) return "K";
    if (name.startsWith("queen")) return "Q";
    if (name.startsWith("jack")) return "J";
    const num = name.match(/^(\d+)/);
    return num ? num[1] : "?";
  }
  // Chrome: C-2, D-10, H-J, S-A, etc.
  const rank = card.cardNumber.split("-")[1];
  return rank || "?";
}

function PlayingCardSuitGrid({ cards, setName }: { cards: any[]; setName: string }) {
  // Group cards by suit
  const suitGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const suit of SUIT_ORDER) groups[suit] = [];
    for (const card of cards) {
      const suit = getPlayingCardSuit(card);
      if (groups[suit]) groups[suit].push(card);
    }
    // Sort each suit by rank order
    for (const suit of SUIT_ORDER) {
      groups[suit].sort((a, b) => {
        const rankA = RANK_ORDER.indexOf(getPlayingCardRank(a));
        const rankB = RANK_ORDER.indexOf(getPlayingCardRank(b));
        return rankA - rankB;
      });
    }
    return groups;
  }, [cards]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {SUIT_ORDER.map(suit => (
        <div key={suit} className="space-y-3">
          {/* Suit header */}
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <span className={`text-2xl ${SUIT_COLORS[suit]}`}>{SUIT_SYMBOLS[suit]}</span>
            <h3 className="font-bold text-lg">{suit}</h3>
            <Badge variant="secondary" className="text-xs ml-auto">{suitGroups[suit].length}</Badge>
          </div>
          {/* Cards in this suit */}
          <div className="space-y-3">
            {suitGroups[suit].map(card => (
              <article key={card.id} className="group">
                <div className="rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                  <CardImage
                    frontImg={card.imageUrl || PLACEHOLDER_IMG}
                    name={card.characterName}
                    cardNumber={card.cardNumber}
                  />
                  <div className="p-2 text-center">
                    <p className="font-semibold text-sm truncate" title={card.characterName}>
                      {card.characterName}
                    </p>
                    <span className="text-xs text-muted-foreground font-mono">#{card.cardNumber}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== SET DETAIL ====================

function SetDetail({ slug }: { slug: string }) {
  const { data, isLoading } = trpc.public.marvel.getSetBySlug.useQuery({ slug });
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Custom display order for card types
  const CARD_TYPE_ORDER: Record<string, number> = {
    "BASE CARDS – BRONZE": 1,
    "BASE CARDS – SILVER": 2,
    "BASE CARDS – GOLD": 3,
    "BASE CARDS – PLATINUM": 4,
    "Autograph": 5,
    "GAMBIT'S DECK": 6,
    "GAMBITS DECK DOUBLE SIDED CHROME PLAYING CARDS": 7,
  };

  const cardTypes = useMemo(() => {
    if (!data?.cards) return [];
    const types = new Set(data.cards.map(c => c.cardType || 'Base'));
    return Array.from(types).sort((a, b) => {
      const orderA = CARD_TYPE_ORDER[a] ?? 99;
      const orderB = CARD_TYPE_ORDER[b] ?? 99;
      return orderA - orderB;
    });
  }, [data?.cards]);

  const filteredCards = useMemo(() => {
    if (!data?.cards) return [];
    let cards = data.cards;
    if (filterType !== "all") {
      cards = cards.filter(c => (c.cardType || 'Base') === filterType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(c =>
        c.characterName?.toLowerCase().includes(q) ||
        c.cardNumber?.toLowerCase().includes(q)
      );
    }
    // Sort by card type order, then by card number within each type
    return [...cards].sort((a, b) => {
      const typeA = a.cardType || 'Base';
      const typeB = b.cardType || 'Base';
      const orderA = CARD_TYPE_ORDER[typeA] ?? 99;
      const orderB = CARD_TYPE_ORDER[typeB] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      // Within same type, sort by numeric card number
      const numA = parseInt(a.cardNumber.replace(/[^0-9]/g, '')) || 0;
      const numB = parseInt(b.cardNumber.replace(/[^0-9]/g, '')) || 0;
      return numA - numB;
    });
  }, [data?.cards, filterType, searchQuery]);

  // SEO: set page title and description
  useEffect(() => {
    if (data?.set) {
      document.title = `${data.set.name} Checklist | Card Database | Northland Legendary Finds`;
    }
  }, [data?.set]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading set...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Set not found</p>
          <Link href="/cards">
            <Button>Back to Card Database</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { set, cards } = data;
  const hasImages = cards.some(c => c.imageUrl);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-900/10" />
        <div className="container relative py-8 lg:py-12">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/cards">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> All Sets
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">{set.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{set.releaseYear}</span>
            <span>&bull;</span>
            <span>{cards.length} cards</span>
            {cardTypes.length > 1 && ERA_THEMES[cardTypes[0]] && (
              <>
                <span>&bull;</span>
                <span className="text-sm flex items-center gap-1.5">
                  {cardTypes.map(type => {
                    const theme = getEraTheme(type);
                    return (
                      <span key={type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${theme.badge}`}>
                        {theme.label || type}
                      </span>
                    );
                  })}
                </span>
              </>
            )}

          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search this set..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All ({cards.length})
              </Button>
              {cardTypes.map(type => {
                const count = cards.filter(c => (c.cardType || 'Base') === type).length;
                return (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type} ({count})
                  </Button>
                );
              })}
              {/* View toggle */}
              <div className="ml-auto flex gap-1 border border-border rounded-md p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="container pb-16">
        {viewMode === "grid" ? (
          /* Check if current filter is a playing card type for special layout */
          isPlayingCardType(filterType) ? (
            <PlayingCardSuitGrid cards={filteredCards} setName={set.name} />
          ) : (
          /* Standard Grid View with Card Images */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
            {filteredCards.map((card) => (
              <article key={card.id} className="group">
                {(() => {
                  const theme = getEraTheme(card.cardType || '');
                  // Gambit cards don't get cosmic backgrounds
                  const isGambit = isPlayingCardType(card.cardType || '');
                  const cosmicBgUrl = isGambit ? undefined : COSMIC_BG[card.cardType || ''];
                  const hasCosmic = !!cosmicBgUrl;
                  // Build display URL for the card display tool
                  const themeId = CARD_TYPE_TO_THEME[card.cardType || ''];
                  const displayUrl = `/card-display?img=${encodeURIComponent(card.imageUrl || PLACEHOLDER_IMG)}&theme=${themeId || 'gold-amber'}&name=${encodeURIComponent(card.characterName)}&from=database`;
                  return (
                    <div className={`rounded-lg overflow-hidden transition-all ${hasCosmic ? 'border-0 bg-transparent' : `border border-border ${theme.border} hover:shadow-lg ${theme.glow} ${theme.bg}`}`}>
                      {/* Cosmic card with nebula background */}
                      <div className={hasCosmic ? 'p-2 pt-3' : ''}>
                        <CardImage
                          frontImg={card.imageUrl || PLACEHOLDER_IMG}
                          name={card.characterName}
                          cardNumber={card.cardNumber}
                          cosmicBg={cosmicBgUrl}
                          borderColor={theme.borderColor}
                          glowColor={theme.glowColor}
                        />
                      </div>
                      <div className={`p-2.5 ${hasCosmic ? 'bg-black/40 backdrop-blur-sm rounded-b-lg' : ''}`}>
                        <p className="font-semibold text-sm truncate" title={card.characterName}>
                          {card.characterName}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground font-mono">#{card.cardNumber}</span>
                          <span className={`inline-flex items-center text-[10px] px-1.5 py-0 rounded-full border font-medium ${theme.badge}`}>
                            {theme.label || card.cardType || "Base"}
                          </span>
                        </div>
                        {card.parallels && (
                          <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-1" title={card.parallels}>
                            {card.parallels}
                          </p>
                        )}
                        <div className="flex gap-1.5 mt-2">
                          <QuickCompButton cardName={card.characterName} setName={set.name} />
                          {!isGambit && card.imageUrl && (
                            <Link href={displayUrl}>
                              <button
                                className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors border"
                                style={{
                                  background: `${theme.borderColor?.replace('0.7', '0.1') || 'rgba(132,204,22,0.1)'}`,
                                  color: theme.borderColor?.replace('0.7', '1') || theme.accent?.replace('text-', '') || '#a3e635',
                                  borderColor: theme.borderColor?.replace('0.7', '0.3') || 'rgba(132,204,22,0.3)',
                                }}
                                title={`Display ${card.characterName} in cosmic viewer`}
                              >
                                <Sparkles className="w-3 h-3" />
                                Display
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </article>
            ))}
          </div>
          )
        ) : (
          /* List View */
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {hasImages && <th className="text-left p-3 text-sm font-semibold text-muted-foreground w-16">Image</th>}
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground w-20">#</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Character</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Type</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Parallels</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground w-24">Comp</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground w-24">Display</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCards.map((card, idx) => (
                    <tr key={card.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/5'}`}>
                      {hasImages && (
                        <td className="p-2">
                          <div className="w-10 h-14 rounded overflow-hidden">
                            <LazyImage
                              src={card.imageUrl || PLACEHOLDER_IMG}
                              alt={`${card.characterName} trading card`}
                              className="w-full h-full"
                            />
                          </div>
                        </td>
                      )}
                      <td className="p-3 text-sm font-mono text-muted-foreground">{card.cardNumber}</td>
                      <td className="p-3">
                        <span className="font-medium">{card.characterName}</span>
                      </td>
                      <td className="p-3">
                        <Badge variant={card.cardType === 'Base' ? 'secondary' : 'outline'} className="text-xs">
                          {card.cardType || 'Base'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground max-w-xs">
                        {card.parallels ? (
                          <span className="line-clamp-2">{card.parallels}</span>
                        ) : (
                          <span className="text-muted-foreground/50">&mdash;</span>
                        )}
                      </td>
                      <td className="p-3">
                        <QuickCompButton cardName={card.characterName} setName={set.name} compact />
                      </td>
                      <td className="p-3">
                        {!isPlayingCardType(card.cardType || '') && card.imageUrl && (() => {
                          const themeId = CARD_TYPE_TO_THEME[card.cardType || ''];
                          const displayUrl = `/card-display?img=${encodeURIComponent(card.imageUrl || PLACEHOLDER_IMG)}&theme=${themeId || 'gold-amber'}&name=${encodeURIComponent(card.characterName)}&from=database`;
                          return (
                            <Link href={displayUrl}>
                              <button className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                                <Sparkles className="w-3 h-3" />
                                Display
                              </button>
                            </Link>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCards.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No cards match your filters
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {filteredCards.length} of {cards.length} cards
        </div>
      </div>
    </div>
  );
}
