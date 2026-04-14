/**
 * TrendingCharacterPage — Reusable template for individual character card listing pages.
 * Auto-pulls cards from marvelCards DB + checklistItems across ALL products.
 * SEO-optimized for "[Character] Topps Marvel Cards" and graded card searches.
 * Linked from /trending, navigable to other characters and home.
 * New checklists automatically populate these pages — no manual updates needed.
 */

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Layers, ChevronRight, ExternalLink, ShoppingCart,
  Flame, TrendingUp, Star, Package, Tv, Users, BookOpen, Sparkles, Crown
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { Streamdown } from "streamdown";

const PLACEHOLDER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/character-placeholder-v2-CY48bnu9TGVPXs9qZJnG7S.webp";

// Static image overrides for characters without trading cards in the database
const CHARACTER_IMAGE_OVERRIDES: Record<string, string> = {
  "kang": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/kang-character-3ikm66jFTWEESTn5mpNv6X.webp",
  "red-skull": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/red-skull-character-WZAUMsSGJp4nqcvHpwhX5L.webp",
};

export default function TrendingCharacterPage() {
  const [, params] = useRoute("/trending/:slug");
  const slug = params?.slug || "";

  const { data, isLoading, error } = trpc.public.marvel.trendingCharacter.useQuery(
    { slug },
    { enabled: !!slug }
  );

  // Pick the best representative image (check overrides first)
  const characterImage = useMemo(() => {
    if (CHARACTER_IMAGE_OVERRIDES[slug]) return CHARACTER_IMAGE_OVERRIDES[slug];
    if (!data?.cardsBySet?.length) return PLACEHOLDER_IMG;
    for (const group of data.cardsBySet) {
      for (const card of group.cards) {
        if ((card as any).imageUrl) return (card as any).imageUrl;
      }
    }
    return PLACEHOLDER_IMG;
  }, [data?.cardsBySet]);

  // Parse key facts if content exists
  const keyFacts = useMemo(() => {
    if (!data?.content?.keyFacts) return null;
    try {
      return typeof data.content.keyFacts === "string"
        ? JSON.parse(data.content.keyFacts)
        : data.content.keyFacts;
    } catch {
      return null;
    }
  }, [data?.content?.keyFacts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-12 w-96 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Character Not Found</h1>
          <p className="text-muted-foreground">We don't have trending data for this character yet.</p>
          <Link href="/trending">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trending Cards
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalCards = data.totalMarvelCards + data.totalChecklistCards;
  const metaDesc = data.content?.metaDescription ||
    `Browse all ${data.characterName} Topps Marvel trading cards. ${totalCards} cards across ${data.cardsBySet.length} sets. Find graded and raw ${data.characterName} cards at Northland Legendary Finds.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${data.characterName} Topps Marvel Cards — Graded & Raw | Northland Legendary Finds`}
        description={metaDesc}
        path={`/trending/${slug}`}
        image={characterImage}
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Trending Cards", url: "/trending" },
          { name: `${data.characterName} Cards`, url: `/trending/${slug}` },
        ])}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0">
          <img src={characterImage} alt="" className="w-full h-full object-cover scale-110 blur-2xl opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="container max-w-6xl relative py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/trending" className="hover:text-foreground transition-colors">Trending Cards</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{data.characterName}</span>
          </nav>

          <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-6 lg:gap-10 items-start">
            {/* Character Card Image */}
            <div className="mx-auto md:mx-0 w-48 md:w-full">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary/40 shadow-2xl shadow-primary/20 ring-1 ring-primary/10">
                <img src={characterImage} alt={data.characterName} className="w-full h-full object-cover object-top" />
              </div>
            </div>

            {/* Character Info */}
            <div className="flex-1 pt-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {data.characterName} <span className="text-primary">Cards</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-4 max-w-xl">
                Every {data.characterName} Topps Marvel trading card across all sets and repack products.
                {data.totalChecklistCards > 0 && ` Including ${data.totalChecklistCards} cards available in our premium repacks.`}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  <Layers className="w-3 h-3 mr-1" />
                  {data.totalMarvelCards} Database Cards
                </Badge>
                <Badge variant="outline" className="border-blue-500/40 text-blue-400">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {data.cardsBySet.length} Sets
                </Badge>
                {data.totalChecklistCards > 0 && (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-400">
                    <Package className="w-3 h-3 mr-1" />
                    {data.totalChecklistCards} in Repacks
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/shop">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Shop Repacks
                  </Button>
                </Link>
                <Link href={`/characters/${slug}`}>
                  <Button variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Full Character Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container max-w-6xl py-8 lg:py-12">

        {/* ===== REPACK CHECKLIST CARDS (if any) ===== */}
        {data.checklistByProduct.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {data.characterName} in Our Repacks
                </h2>
                <p className="text-sm text-muted-foreground">
                  These {data.characterName} cards can be pulled from our premium repack products
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {data.checklistByProduct.map((group) => (
                <div key={group.productName} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500/10 to-transparent px-6 py-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{group.productName}</h3>
                        <p className="text-sm text-muted-foreground">{group.cards.length} {data.characterName} cards in this product</p>
                      </div>
                      {group.productSlug && (
                        <Link href={`/product/${group.productSlug}`}>
                          <Button variant="outline" size="sm">
                            View Product <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.cards.map((card) => (
                        <div key={card.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors">
                          {card.imageUrl ? (
                            <img src={card.imageUrl} alt={card.cardName} className="w-12 h-16 rounded object-cover border border-border/50" />
                          ) : (
                            <div className="w-12 h-16 rounded bg-muted flex items-center justify-center border border-border/50">
                              <Sparkles className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{card.cardName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {card.cardSet} {card.cardNumber ? `#${card.cardNumber}` : ""}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              {card.parallel && card.parallel !== "Base" && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                                  {card.parallel}
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 ${
                                  card.tier === "chase" ? "border-amber-500/40 text-amber-400" :
                                  card.tier === "hit" ? "border-purple-500/40 text-purple-400" :
                                  "border-border text-muted-foreground"
                                }`}
                              >
                                {card.tier}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== CARD DATABASE BY SET ===== */}
        {data.cardsBySet.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {data.characterName} Topps Marvel Cards by Set
                </h2>
                <p className="text-sm text-muted-foreground">
                  All {data.totalMarvelCards} cards across {data.cardsBySet.length} sets in our database
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {data.cardsBySet.map((group, groupIdx) => (
                <div key={group.setName} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-transparent px-6 py-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{data.characterName} — {group.setName}</h3>
                        <p className="text-sm text-muted-foreground">{group.cards.length} cards in this set</p>
                      </div>
                      {group.setSlug && (
                        <Link href={`/cards/${group.setSlug}`}>
                          <Button variant="outline" size="sm">
                            View Full Set <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {group.cards.map((card: any) => (
                        <Link
                          key={card.id}
                          href={group.setSlug && card.cardNumber ? `/cards/${group.setSlug}/${card.cardNumber}` : "#"}
                        >
                          <div className="group cursor-pointer">
                            <div className="relative aspect-[2.5/3.5] rounded-xl overflow-hidden border-2 border-border/50 group-hover:border-primary/60 transition-all duration-300 shadow-md group-hover:shadow-primary/20 group-hover:shadow-lg">
                              <img
                                src={card.imageUrl || PLACEHOLDER_IMG}
                                alt={`${data.characterName} #${card.cardNumber}`}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                              <div className="absolute bottom-0 inset-x-0 p-2">
                                <p className="text-white text-xs font-bold truncate">
                                  #{card.cardNumber}
                                </p>
                                <p className="text-white/60 text-[10px] truncate">
                                  {card.cardType || "Base"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== CHARACTER BIO (if generated) ===== */}
        {data.content?.historyMarkdown && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                About {data.characterName}
              </h2>
            </div>
            <article className="prose prose-invert prose-lg max-w-none bg-card border border-border rounded-xl p-6 lg:p-8
              prose-headings:text-foreground prose-headings:font-bold
              prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-2
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-strong:text-foreground
              prose-li:text-muted-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            ">
              <Streamdown>{data.content.historyMarkdown}</Streamdown>
            </article>
          </section>
        )}

        {/* ===== RELATED CHARACTERS ===== */}
        {data.relatedCharacters.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  More Marvel Characters to Collect
                </h2>
                <p className="text-sm text-muted-foreground">
                  Characters who appear alongside {data.characterName} in the same card sets
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.relatedCharacters.map((char) => (
                <Link key={char.slug} href={`/trending/${char.slug}`}>
                  <div className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                    <div className="relative aspect-[2.5/3.5] overflow-hidden">
                      <img
                        src={char.imageUrl || PLACEHOLDER_IMG}
                        alt={char.characterName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <p className="text-white font-bold truncate">{char.characterName}</p>
                        <p className="text-white/60 text-sm">{char.cardCount} cards</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== CTA SECTION ===== */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Want to Pull {data.characterName} Cards?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Our premium repack products include graded and raw {data.characterName} cards.
            Join a live stream on Whatnot for the best experience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Browse Repacks
              </Button>
            </Link>
            <Link href="/whatnot">
              <Button variant="outline">
                <Tv className="w-4 h-4 mr-2" />
                Watch Live Streams
              </Button>
            </Link>
            <Link href="/trending">
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                All Trending Cards
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
