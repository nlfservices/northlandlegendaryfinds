/**
 * Individual Card Detail Page
 * 
 * SEO-optimized page for each trading card with:
 * - Unique meta title, description, OG tags
 * - JSON-LD Product structured data
 * - Cross-links to same character in other sets
 * - Prev/Next card navigation within the set
 * - Breadcrumb navigation
 * - Card image with cosmic frame styling
 * - Parallels, rarity, card type info
 */

import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { trpc } from "@/lib/trpc";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ChevronLeft, ChevronRight, ExternalLink,
  Layers, Hash, Sparkles, Share2, BookOpen
} from "lucide-react";
import { toast } from "sonner";

// ==================== HELPERS ====================

const PLACEHOLDER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk_9ebdacfa.png";

function cardSlug(characterName: string, cardNumber: string): string {
  const name = characterName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  const num = cardNumber.toLowerCase().replace(/[^a-z0-9-]/g, "");
  return `${name}-${num}`;
}

// Set-specific accent colors
const SET_ACCENTS: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  "2025-topps-chrome": { color: "#a3e635", bg: "rgba(163,230,53,0.1)", border: "rgba(163,230,53,0.3)", glow: "rgba(163,230,53,0.15)" },
  "2025-topps-marvel-sapphire": { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)", glow: "rgba(96,165,250,0.15)" },
  "2025-topps-comic-book-heroes": { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", glow: "rgba(245,158,11,0.15)" },
  "2025-topps-marvel-mint": { color: "#cd7f32", bg: "rgba(205,127,50,0.1)", border: "rgba(205,127,50,0.3)", glow: "rgba(205,127,50,0.15)" },
  "2025-marvel-studios": { color: "#e879f9", bg: "rgba(232,121,249,0.1)", border: "rgba(232,121,249,0.3)", glow: "rgba(232,121,249,0.15)" },
};

const DEFAULT_ACCENT = { color: "#a3e635", bg: "rgba(163,230,53,0.1)", border: "rgba(163,230,53,0.3)", glow: "rgba(163,230,53,0.15)" };

function getAccent(setSlug: string) {
  return SET_ACCENTS[setSlug] || DEFAULT_ACCENT;
}

// ==================== COMPONENT ====================

export default function CardDetail() {
  const [, params] = useRoute("/cards/:setSlug/:cardSlug");
  const setSlug = params?.setSlug || "";
  const cardSlugParam = params?.cardSlug || "";

  const { data, isLoading } = trpc.public.marvel.getCardBySlug.useQuery(
    { setSlug, cardSlug: cardSlugParam },
    { enabled: !!setSlug && !!cardSlugParam }
  );

  const accent = useMemo(() => getAccent(setSlug), [setSlug]);

  // Build prev/next slugs
  const prevSlug = useMemo(() => {
    if (!data?.adjacent?.prev) return null;
    const p = data.adjacent.prev;
    return cardSlug(p.characterName, p.cardNumber);
  }, [data?.adjacent?.prev]);

  const nextSlug = useMemo(() => {
    if (!data?.adjacent?.next) return null;
    const n = data.adjacent.next;
    return cardSlug(n.characterName, n.cardNumber);
  }, [data?.adjacent?.next]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: document.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  // ==================== LOADING ====================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-[2.5/3.5] bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-10 w-64 bg-muted rounded" />
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== NOT FOUND ====================
  if (!data?.card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Card Not Found</h1>
          <p className="text-muted-foreground">This card doesn't exist in our database.</p>
          <Link href={`/cards/${setSlug}`}>
            <Button>Back to Set</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { card, related, adjacent } = data;
  const imageUrl = card.imageUrl || PLACEHOLDER_IMG;
  const parallels = card.parallels ? card.parallels.split(",").map((p: string) => p.trim()).filter(Boolean) : [];
  const canonicalUrl = `https://northlandlegendaryfinds.com/cards/${card.setSlug}/${cardSlugParam}`;

  // SEO content
  const pageTitle = `${card.characterName} #${card.cardNumber} | ${card.setName} | Northland Legendary Finds`;
  const pageDescription = `${card.characterName} #${card.cardNumber} ${card.cardType || "Base"} card from ${card.setName}. ${parallels.length > 0 ? `Available parallels: ${parallels.join(", ")}.` : ""} Browse the complete checklist and find this card in NLF repacks.`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${card.characterName} #${card.cardNumber}`,
    description: pageDescription,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: "Topps",
    },
    category: card.setName,
    url: canonicalUrl,
    offers: {
      "@type": "AggregateOffer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      seller: {
        "@type": "Organization",
        name: "Northland Legendary Finds",
        url: "https://northlandlegendaryfinds.com",
      },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Card Number", value: card.cardNumber },
      { "@type": "PropertyValue", name: "Card Type", value: card.cardType || "Base" },
      { "@type": "PropertyValue", name: "Set", value: card.setName },
      ...(parallels.length > 0
        ? [{ "@type": "PropertyValue", name: "Parallels", value: parallels.join(", ") }]
        : []),
    ],
  };

  // Breadcrumb JSON-LD
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://northlandlegendaryfinds.com" },
      { "@type": "ListItem", position: 2, name: "Card Database", item: "https://northlandlegendaryfinds.com/cards" },
      { "@type": "ListItem", position: 3, name: card.setName, item: `https://northlandlegendaryfinds.com/cards/${card.setSlug}` },
      { "@type": "ListItem", position: 4, name: `${card.characterName} #${card.cardNumber}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ==================== SEO HEAD ==================== */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Northland Legendary Finds" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${card.characterName} #${card.cardNumber} | ${card.setName}`} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      {/* ==================== BREADCRUMB ==================== */}
      <div className="border-b border-border/50">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/cards" className="hover:text-foreground transition-colors">Card Database</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/cards/${card.setSlug}`} className="hover:text-foreground transition-colors">{card.setName}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{card.characterName}</span>
          </nav>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="container py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT: Card Image */}
          <div className="space-y-4">
            <div
              className="relative max-w-md mx-auto rounded-xl overflow-hidden"
              style={{
                boxShadow: `0 0 30px 5px ${accent.glow}, 0 20px 60px rgba(0,0,0,0.5)`,
                border: `2px solid ${accent.border}`,
              }}
            >
              <div style={{ aspectRatio: "2.5/3.5" }} className="bg-card">
                <img
                  src={imageUrl}
                  alt={`${card.characterName} #${card.cardNumber} - ${card.setName} Trading Card`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Prev / Next Navigation */}
            <div className="flex items-center justify-between max-w-md mx-auto">
              {adjacent?.prev && prevSlug ? (
                <Link href={`/cards/${card.setSlug}/${prevSlug}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    #{adjacent.prev.cardNumber}
                  </Button>
                </Link>
              ) : <div />}

              <Link href={`/cards/${card.setSlug}`}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                  <Layers className="w-3.5 h-3.5" />
                  View Full Set
                </Button>
              </Link>

              {adjacent?.next && nextSlug ? (
                <Link href={`/cards/${card.setSlug}/${nextSlug}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    #{adjacent.next.cardNumber}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* RIGHT: Card Details */}
          <div className="space-y-6">
            {/* Character Name + Card Number */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{card.characterName}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant="outline"
                  className="font-mono text-sm px-3 py-1"
                  style={{ borderColor: accent.border, color: accent.color }}
                >
                  <Hash className="w-3.5 h-3.5 mr-1" />
                  {card.cardNumber}
                </Badge>
                {card.cardType && (
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1"
                    style={{ borderColor: accent.border, color: accent.color, background: accent.bg }}
                  >
                    {card.cardType}
                  </Badge>
                )}
              </div>
            </div>

            {/* Set Info */}
            <div
              className="rounded-lg p-4"
              style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" style={{ color: accent.color }} />
                <span className="font-semibold text-sm" style={{ color: accent.color }}>Set Information</span>
              </div>
              <Link href={`/cards/${card.setSlug}`} className="text-foreground hover:underline font-medium">
                {card.setName}
              </Link>
            </div>

            {/* Parallels */}
            {parallels.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: accent.color }} />
                  Available Parallels
                </h2>
                <div className="flex flex-wrap gap-2">
                  {parallels.map((parallel: string, i: number) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs px-2.5 py-1"
                      style={{ borderColor: accent.border, color: accent.color, background: accent.bg }}
                    >
                      {parallel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {card.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">About This Card</h2>
                <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Link href={`/card-display?img=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(card.characterName)}&from=database`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  style={{ borderColor: accent.border, color: accent.color }}
                >
                  <Sparkles className="w-4 h-4" />
                  Display in Cosmic Viewer
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ==================== SAME CHARACTER IN OTHER SETS ==================== */}
        {related && related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Layers className="w-6 h-6" style={{ color: accent.color }} />
              {card.characterName} in Other Sets
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.map((r: any) => {
                const rSlug = cardSlug(r.characterName, r.cardNumber);
                return (
                  <Link key={r.id} href={`/cards/${r.setSlug}/${rSlug}`}>
                    <article className="group rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 bg-card cursor-pointer">
                      <div style={{ aspectRatio: "2.5/3.5" }} className="overflow-hidden bg-muted">
                        <img
                          src={r.imageUrl || PLACEHOLDER_IMG}
                          alt={`${r.characterName} #${r.cardNumber} - ${r.setName}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{r.setName}</p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-mono">#{r.cardNumber}</span>
                          {r.cardType && (
                            <span className="text-[10px] text-muted-foreground truncate ml-1">{r.cardType}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ==================== BACK TO SET ==================== */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <Link href={`/cards/${card.setSlug}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to {card.setName}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
