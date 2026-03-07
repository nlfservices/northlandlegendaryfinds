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
  Star, X, RotateCcw, Eye, Grid3X3, List
} from "lucide-react";

// Default placeholder for cards without images
const PLACEHOLDER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk_9ebdacfa.png";

// ==================== LAZY IMAGE ====================
function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className || ""}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse rounded-lg" />
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

// ==================== CARD FLIP ====================
function FlipCard({ frontImg, backImg, name, cardNumber }: {
  frontImg: string;
  backImg?: string | null;
  name: string;
  cardNumber: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={() => backImg && setFlipped(!flipped)}
      title={backImg ? "Click to flip" : name}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          aspectRatio: "2.5/3.5",
        }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-lg overflow-hidden bg-card border border-border/50" style={{ backfaceVisibility: "hidden" }}>
          <LazyImage
            src={frontImg}
            alt={`${name} #${cardNumber} - 2025 Topps Marvel Trading Card`}
            className="w-full h-full scale-[1.08]"
          />
          {backImg && (
            <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <RotateCcw className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        {/* Back */}
        {backImg && (
          <div
            className="absolute inset-0 rounded-lg overflow-hidden bg-card border border-border/50"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <LazyImage
              src={backImg}
              alt={`${name} #${cardNumber} back - 2025 Topps Marvel Trading Card`}
              className="w-full h-full"
            />
            <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <RotateCcw className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {searchResults.map((card: any) => (
                  <article key={card.id} className="group">
                    <div className="rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                      <FlipCard
                        frontImg={card.imageUrl || PLACEHOLDER_IMG}
                        backImg={card.backImageUrl}
                        name={card.characterName}
                        cardNumber={card.cardNumber}
                      />
                      <div className="p-3">
                        <p className="font-semibold text-sm truncate">{card.characterName}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">#{card.cardNumber}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{card.cardType || "Base"}</Badge>
                        </div>
                        {card.setName && (
                          <p className="text-[10px] text-muted-foreground mt-1 truncate">{card.setName}</p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
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
                  <div key={i} className="h-48 rounded-xl bg-card animate-pulse border border-border" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sets?.map((set) => (
                  <Link key={set.id} href={`/cards/${set.slug}`}>
                    <article className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="min-w-0">
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">
                              {set.name}
                            </h3>
                            {set.shortName && set.shortName !== set.name && (
                              <p className="text-sm text-muted-foreground mt-1">{set.shortName}</p>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Hash className="w-4 h-4" />
                            <span>{set.totalCards} cards</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4" />
                            <span>{set.releaseYear}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-1.5">
                          {['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'].map((color, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${color} opacity-60`} />
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
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

// ==================== SET DETAIL ====================

function SetDetail({ slug }: { slug: string }) {
  const { data, isLoading } = trpc.public.marvel.getSetBySlug.useQuery({ slug });
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const cardTypes = useMemo(() => {
    if (!data?.cards) return [];
    const types = new Set(data.cards.map(c => c.cardType || 'Base'));
    return Array.from(types).sort();
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
    return cards;
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
            {hasImages && (
              <>
                <span>&bull;</span>
                <span className="text-primary text-sm flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Click cards to flip
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
          /* Grid View with Card Images */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredCards.map((card) => (
              <article key={card.id} className="group">
                <div className="rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                  <FlipCard
                    frontImg={card.imageUrl || PLACEHOLDER_IMG}
                    backImg={(card as any).backImageUrl}
                    name={card.characterName}
                    cardNumber={card.cardNumber}
                  />
                  <div className="p-2.5">
                    <p className="font-semibold text-sm truncate" title={card.characterName}>
                      {card.characterName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground font-mono">#{card.cardNumber}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {card.cardType || "Base"}
                      </Badge>
                    </div>
                    {card.parallels && (
                      <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-1" title={card.parallels}>
                        {card.parallels}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
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
