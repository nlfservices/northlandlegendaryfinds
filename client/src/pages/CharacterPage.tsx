/**
 * Character Page - SEO-optimized individual character pages
 * Features: 1000+ word LLM-generated history, key facts sidebar, card gallery across sets
 * Content is generated on-demand and cached in the database
 */

import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, BookOpen, Sparkles, Shield, Zap, Users,
  Calendar, Pen, Layers, ChevronRight, Loader2, RefreshCw,
  ExternalLink
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { LazyStreamdown } from "@/components/LazyStreamdown";

const PLACEHOLDER_IMG = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/character-placeholder-v2-CY48bnu9TGVPXs9qZJnG7S.webp";

// Static image overrides for characters without trading cards in the database
const CHARACTER_IMAGE_OVERRIDES: Record<string, string> = {
  "kang": "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/kang-character-3ikm66jFTWEESTn5mpNv6X.webp",
  "red-skull": "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/red-skull-character-WZAUMsSGJp4nqcvHpwhX5L.webp",
};

export default function CharacterPage() {
  const [, params] = useRoute("/characters/:slug");
  const slug = params?.slug || "";

  const { data, isLoading, error } = trpc.public.marvel.getCharacter.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const generateContent = trpc.public.marvel.generateCharacterContent.useMutation();
  const utils = trpc.useUtils();

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Auto-generate content if not available (only trigger once)
  useEffect(() => {
    if (data && !data.content && !isGenerating && !hasTriggered && !generateContent.isPending) {
      setIsGenerating(true);
      setHasTriggered(true);
      generateContent.mutate(
        { slug },
        {
          onSuccess: () => {
            utils.public.marvel.getCharacter.invalidate({ slug });
            setIsGenerating(false);
          },
          onError: () => {
            setIsGenerating(false);
          },
        }
      );
    }
  }, [data?.content, slug, hasTriggered]);

  // Reset trigger when slug changes
  useEffect(() => {
    setHasTriggered(false);
    setIsGenerating(false);
  }, [slug]);

  // Group cards by set
  const cardsBySet = useMemo(() => {
    if (!data?.cards) return [];
    const groups: Record<string, { setName: string; setSlug: string; cards: typeof data.cards }> = {};
    for (const card of data.cards) {
      const key = card.setName || "Unknown Set";
      if (!groups[key]) {
        groups[key] = { setName: key, setSlug: card.setSlug || "", cards: [] };
      }
      groups[key].cards.push(card);
    }
    return Object.values(groups);
  }, [data?.cards]);

  // Parse key facts
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

  // Pick the best representative image: check overrides first, then cards
  const characterImage = useMemo(() => {
    // Check static overrides first (for characters without cards in DB)
    if (CHARACTER_IMAGE_OVERRIDES[slug]) return CHARACTER_IMAGE_OVERRIDES[slug];
    if (!data?.cards?.length) return PLACEHOLDER_IMG;
    const charWords = data.characterName.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    // Try to find a card whose image URL contains the character name
    const matchingCard = data.cards.find(c => {
      if (!c.imageUrl) return false;
      const filename = c.imageUrl.split('/').pop()?.toLowerCase() || '';
      return charWords.some(w => filename.includes(w));
    });
    if (matchingCard?.imageUrl) return matchingCard.imageUrl;
    // Fallback: first card with an image
    const firstWithImage = data.cards.find(c => c.imageUrl);
    return firstWithImage?.imageUrl || PLACEHOLDER_IMG;
  }, [data?.cards, data?.characterName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-12 w-96 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
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
          <p className="text-muted-foreground">The character you're looking for doesn't exist in our database.</p>
          <Link href="/characters">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse All Characters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const metaDesc = data.content?.metaDescription ||
    `Explore ${data.characterName}'s history, powers, and ${data.cardCount} trading cards across multiple Marvel sets at Northland Legendary Finds.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${data.characterName} - Marvel Trading Cards & Character History`}
        description={metaDesc}
        path={`/characters/${slug}`}
        image={characterImage}
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Characters", url: "/characters" },
          { name: data.characterName, url: `/characters/${slug}` },
        ])}
      />

      {/* Hero Section — Cinematic character card art banner */}
      <section className="relative border-b border-border/50 overflow-hidden">
        {/* Background: blurred character image */}
        <div className="absolute inset-0">
          <img
            src={characterImage}
            alt=""
            className="w-full h-full object-cover scale-110 blur-2xl opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="container max-w-6xl relative py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/characters" className="hover:text-foreground transition-colors">Characters</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{data.characterName}</span>
          </nav>

          <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-6 lg:gap-10 items-start">
            {/* Character Card Art — Large */}
            <div className="mx-auto md:mx-0 w-48 md:w-full">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary/40 shadow-2xl shadow-primary/20 ring-1 ring-primary/10">
                <img
                  src={characterImage}
                  alt={data.characterName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Character Info */}
            <div className="flex-1 pt-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {data.characterName}
              </h1>
              {keyFacts?.realName && keyFacts.realName !== data.characterName && (
                <p className="text-lg text-muted-foreground mb-4">
                  Real Name: <span className="text-foreground">{keyFacts.realName}</span>
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  <Layers className="w-3 h-3 mr-1" />
                  {data.cardCount} Cards
                </Badge>
                <Badge variant="outline" className="border-blue-500/40 text-blue-400">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {cardsBySet.length} Sets
                </Badge>
                {keyFacts?.firstAppearance && (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {keyFacts.firstAppearance}
                  </Badge>
                )}
              </div>
              {keyFacts?.notablePowers && keyFacts.notablePowers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {keyFacts.notablePowers.slice(0, 6).map((power: string, i: number) => (
                    <Badge key={i} className="bg-primary/10 text-primary border-primary/20 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {power}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Quick summary from meta description */}
              {metaDesc && (
                <p className="text-muted-foreground leading-relaxed max-w-xl">
                  {metaDesc}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Article Content - Left 2/3 */}
          <div className="lg:col-span-2">
            {/* Content Loading / Generation State */}
            {(!data.content || isGenerating || generateContent.isPending) && (
              <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Generating Character History
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Our AI is writing a comprehensive history of {data.characterName}. 
                  This takes about 10-15 seconds...
                </p>
              </div>
            )}

            {/* Error State */}
            {generateContent.isError && !data.content && (
              <div className="bg-card border border-destructive/30 rounded-xl p-8 text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Content Generation Failed
                </h3>
                <p className="text-muted-foreground">
                  We couldn't generate the character history. Please try again.
                </p>
                <Button
                  onClick={() => {
                    setIsGenerating(true);
                    generateContent.mutate(
                      { slug },
                      {
                        onSuccess: () => {
                          utils.public.marvel.getCharacter.invalidate({ slug });
                          setIsGenerating(false);
                        },
                        onError: () => setIsGenerating(false),
                      }
                    );
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            )}

            {/* Generated Article */}
            {data.content?.historyMarkdown && (
              <article className="prose prose-invert prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-2
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-strong:text-foreground
                prose-li:text-muted-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              ">
                <LazyStreamdown>{data.content.historyMarkdown}</LazyStreamdown>
              </article>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <aside className="space-y-6">
            {/* Key Facts Card */}
            {keyFacts && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Key Facts
                </h3>
                <dl className="space-y-3 text-sm">
                  {keyFacts.realName && (
                    <div>
                      <dt className="text-muted-foreground font-medium">Real Name</dt>
                      <dd className="text-foreground">{keyFacts.realName}</dd>
                    </div>
                  )}
                  {keyFacts.firstAppearance && (
                    <div>
                      <dt className="text-muted-foreground font-medium">First Appearance</dt>
                      <dd className="text-foreground">{keyFacts.firstAppearance}</dd>
                    </div>
                  )}
                  {keyFacts.creators && (
                    <div>
                      <dt className="text-muted-foreground font-medium">Creators</dt>
                      <dd className="text-foreground">{keyFacts.creators}</dd>
                    </div>
                  )}
                  {keyFacts.teams && keyFacts.teams.length > 0 && (
                    <div>
                      <dt className="text-muted-foreground font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" /> Teams
                      </dt>
                      <dd className="flex flex-wrap gap-1 mt-1">
                        {keyFacts.teams.map((team: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {team}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Card Gallery by Set */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Trading Cards ({data.cardCount})
              </h3>
              {cardsBySet.map((group) => (
                <div key={group.setName} className="space-y-2">
                  <Link
                    href={`/cards/${group.setSlug}`}
                    className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {group.setName}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <div className="grid grid-cols-3 gap-2">
                    {group.cards.slice(0, 6).map((card: any) => (
                      <div
                        key={card.id}
                        className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group"
                        title={`${card.characterName} #${card.cardNumber} - ${card.cardType || ""}`}
                      >
                        <img
                          src={card.imageUrl || PLACEHOLDER_IMG}
                          alt={`${card.characterName} #${card.cardNumber}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                          <p className="text-[10px] text-white/80 truncate">
                            #{card.cardNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {group.cards.length > 6 && (
                    <p className="text-xs text-muted-foreground">
                      +{group.cards.length - 6} more cards in this set
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Browse More Characters */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Explore More</h3>
              <div className="space-y-2">
                <Link href="/characters">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Browse All Characters
                  </Button>
                </Link>
                <Link href="/cards">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Layers className="w-4 h-4 mr-2" />
                    Card Database
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Shop Packs
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Characters Section */}
        <RelatedCharactersSection slug={slug} characterName={data.characterName} />
      </div>
    </div>
  );
}

/** Related Characters grid component */
function RelatedCharactersSection({ slug, characterName }: { slug: string; characterName: string }) {
  const { data: related, isLoading } = trpc.public.marvel.relatedCharacters.useQuery(
    { slug, limit: 12 },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <section className="mt-12 pt-8 border-t border-border/50">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Related Characters
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2.5/3.5] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border/50">
      <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        Related Characters
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Characters who appear alongside {characterName} across multiple card sets
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {related.map((char) => (
          <Link key={char.slug} href={`/characters/${char.slug}`}>
            <div className="group cursor-pointer">
              <div className="relative aspect-[2.5/3.5] rounded-xl overflow-hidden border-2 border-border/50 group-hover:border-primary/60 transition-all duration-300 shadow-md group-hover:shadow-primary/20 group-hover:shadow-lg">
                <img
                  src={char.imageUrl || PLACEHOLDER_IMG}
                  alt={char.characterName}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-2">
                  <p className="text-white text-xs font-bold truncate">
                    {char.characterName}
                  </p>
                  <p className="text-white/60 text-[10px]">
                    {char.cardCount} cards &middot; {char.sharedSets} shared {char.sharedSets === 1 ? 'set' : 'sets'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

