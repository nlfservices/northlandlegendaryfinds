/**
 * Card Detail Page - Individual card page with parallel breakdown,
 * set-specific character content, card art, navigation, Quick Answer,
 * author byline, FAQ section, and LLMO-optimized structure
 */

import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Streamdown } from "streamdown";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Hash,
  Layers,
  Star,
  ExternalLink,
  Loader2,
  RefreshCw,
  User,
  BookOpen,
  Zap,
  Clock,
  HelpCircle,
} from "lucide-react";
import SEO, { breadcrumbJsonLd, articleJsonLd, collectibleCardJsonLd, faqJsonLd } from "@/components/SEO";

/** Rarity color mapping for parallel badges */
function getParallelColor(printRun: number | null): string {
  if (!printRun) return "bg-zinc-700 text-zinc-200";
  if (printRun === 1) return "bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold";
  if (printRun <= 5) return "bg-gradient-to-r from-red-600 to-red-500 text-white font-bold";
  if (printRun <= 10) return "bg-gradient-to-r from-purple-600 to-purple-500 text-white";
  if (printRun <= 25) return "bg-gradient-to-r from-blue-600 to-blue-500 text-white";
  if (printRun <= 50) return "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white";
  if (printRun <= 99) return "bg-gradient-to-r from-teal-600 to-teal-500 text-white";
  if (printRun <= 199) return "bg-zinc-600 text-zinc-100";
  return "bg-zinc-700 text-zinc-200";
}

function getRarityLabel(printRun: number | null): string {
  if (!printRun) return "";
  if (printRun === 1) return "ULTRA RARE";
  if (printRun <= 5) return "SUPER SHORT PRINT";
  if (printRun <= 10) return "SHORT PRINT";
  if (printRun <= 25) return "LIMITED";
  if (printRun <= 50) return "SCARCE";
  if (printRun <= 99) return "NUMBERED";
  return "";
}

export default function CardDetailPage() {
  const { setSlug, cardNumber } = useParams<{ setSlug: string; cardNumber: string }>();
  const [, navigate] = useLocation();

  const { data, isLoading, error } = trpc.public.marvel.cardDetail.useQuery(
    { setSlug: setSlug || "", cardNumber: decodeURIComponent(cardNumber || "") },
    { enabled: !!setSlug && !!cardNumber }
  );

  const generateContent = trpc.public.marvel.generateCardContent.useMutation();
  const utils = trpc.useUtils();

  // Auto-trigger content generation if not yet generated
  const [autoTriggered, setAutoTriggered] = useState(false);
  useEffect(() => {
    if (data && !data.detailContent?.contentMarkdown && !autoTriggered && !generateContent.isPending) {
      setAutoTriggered(true);
      generateContent.mutate(
        { setSlug: setSlug || "", cardNumber: decodeURIComponent(cardNumber || "") },
        {
          onSuccess: () => {
            utils.public.marvel.cardDetail.invalidate({ setSlug, cardNumber: decodeURIComponent(cardNumber || "") });
          },
        }
      );
    }
  }, [data, autoTriggered, generateContent.isPending]);

  // Reset auto-trigger when route changes
  useEffect(() => {
    setAutoTriggered(false);
  }, [setSlug, cardNumber]);

  // Build FAQ targeting "People Also Ask" (must be before early returns)
  const cardFaqs = useMemo(() => {
    if (!data?.card) return [];
    const { card, parallels } = data;
    return [
      {
        question: `What parallels are available for ${card.characterName} #${card.cardNumber} in ${card.setName}?`,
        answer: parallels.length > 0
          ? `${card.characterName} #${card.cardNumber} has ${parallels.length} parallel versions at Northland Legendary Finds: ${parallels.map((p: any) => p.printRun ? `${p.name} (/${p.printRun})` : p.name).join(", ")}. The lower the print run, the more valuable and collectible the card.`
          : `${card.characterName} #${card.cardNumber} is a base card in ${card.setName}. Check Northland Legendary Finds for availability.`,
      },
      {
        question: `What set is ${card.characterName} card #${card.cardNumber} from?`,
        answer: `This card is from the ${card.setName} trading card set by Topps, featuring Marvel characters. Browse the full set checklist at Northland Legendary Finds.`,
      },
      {
        question: `How much is ${card.characterName} #${card.cardNumber} worth?`,
        answer: `The value of ${card.characterName} #${card.cardNumber} from ${card.setName} depends on the parallel version and condition. ${parallels.some((p: any) => p.printRun === 1) ? "The 1/1 Superfractor is the most valuable." : parallels.length > 0 ? `Numbered parallels like ${parallels.filter((p: any) => p.printRun && p.printRun <= 25).map((p: any) => `/${p.printRun}`).join(", ") || "low print runs"} command the highest prices.` : "Base versions are the most accessible for collectors."} Check recent sales on eBay for current market values.`,
      },
      {
        question: `Is ${card.characterName} #${card.cardNumber} a good card to collect?`,
        answer: `${card.characterName} is a popular Marvel character with strong collector demand. The ${card.setName} set features premium card design and multiple parallel tiers, making it appealing for both casual collectors and investors. Visit Northland Legendary Finds for the complete parallel breakdown and availability.`,
      },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <Skeleton className="aspect-[2/3] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Card Not Found</h1>
          <p className="text-muted-foreground">This card doesn't exist in our database.</p>
          <Button variant="outline" onClick={() => navigate("/card-database")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Card Database
          </Button>
        </div>
      </div>
    );
  }

  const { card, parallels, adjacent, sameCharCards, characterSlug, detailContent } = data;
  const contentMarkdown = detailContent?.contentMarkdown || generateContent.data?.content;
  const isGenerating = generateContent.isPending || detailContent?.status === "generating";

  // Build SEO data
  const cardTitle = `${card.characterName} #${card.cardNumber} - ${card.setName} | Northland Legendary Finds`;
  const cardMetaDesc = `Complete guide to ${card.characterName} card #${card.cardNumber} from ${card.setName} at Northland Legendary Finds. ${parallels.length > 0 ? `${parallels.length} parallel versions including ${parallels.map((p: any) => p.printRun ? `/${p.printRun}` : p.name).slice(0, 4).join(", ")}.` : ""} Card art, collecting tips, and parallel breakdown.`;
  const cardUrl = `/cards/${card.setSlug}/${card.cardNumber}`;

  const jsonLdSchemas: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Card Database", url: "/card-database" },
      { name: card.setName, url: `/cards/${card.setSlug}` },
      { name: `#${card.cardNumber} ${card.characterName}`, url: cardUrl },
    ]),
    collectibleCardJsonLd({
      name: cardTitle,
      description: cardMetaDesc,
      image: card.imageUrl || undefined,
      url: cardUrl,
      cardNumber: card.cardNumber,
      setName: card.setName,
      characterName: card.characterName,
    }),
    faqJsonLd(cardFaqs),
  ];

  if (contentMarkdown) {
    jsonLdSchemas.push(
      articleJsonLd({
        title: `${card.characterName} in ${card.setName} - Collector's Guide | Northland Legendary Finds`,
        description: cardMetaDesc,
        url: cardUrl,
        image: card.imageUrl || undefined,
        datePublished: "2025-03-15",
        dateModified: new Date().toISOString().split("T")[0],
        keywords: [
          card.characterName,
          card.setName,
          `${card.characterName} trading card`,
          `card #${card.cardNumber}`,
          "2025 Topps",
          "Marvel cards",
          "parallel checklist",
          "Northland Legendary Finds",
        ],
        about: {
          name: card.characterName,
          description: `${card.characterName} trading card from ${card.setName}`,
        },
      })
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={cardTitle}
        description={cardMetaDesc}
        path={cardUrl}
        image={card.imageUrl || undefined}
        type="article"
        jsonLd={jsonLdSchemas}
      >
        <meta name="keywords" content={`${card.characterName}, ${card.setName}, trading card, parallels, #${card.cardNumber}, Marvel, Topps, 2025, Northland Legendary Finds`} />
      </SEO>

      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/card-database" className="hover:text-primary transition-colors">Card Database</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/cards/${card.setSlug}`} className="hover:text-primary transition-colors">{card.setName}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">#{card.cardNumber} {card.characterName}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        {/* Main Layout: Card Image + Info */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-8 xl:gap-12">
          {/* Left: Card Image */}
          <div className="space-y-4">
            <div className="sticky top-24">
              <div className="relative group">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={`${card.characterName} #${card.cardNumber} ${card.setName} trading card - Northland Legendary Finds`}
                    className="w-full rounded-xl shadow-2xl shadow-black/40 border border-border/30 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="aspect-[2/3] bg-card rounded-xl border border-border/30 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Hash className="w-12 h-12 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Prev/Next Navigation */}
              <div className="flex items-center justify-between mt-4 gap-3">
                {adjacent.prev ? (
                  <Link
                    href={`/cards/${card.setSlug}/${encodeURIComponent(adjacent.prev.cardNumber)}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors text-sm flex-1 min-w-0"
                  >
                    <ChevronLeft className="w-4 h-4 text-primary shrink-0" />
                    <div className="truncate">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Previous</div>
                      <div className="text-foreground truncate">#{adjacent.prev.cardNumber} {adjacent.prev.characterName}</div>
                    </div>
                  </Link>
                ) : <div className="flex-1" />}

                {adjacent.next ? (
                  <Link
                    href={`/cards/${card.setSlug}/${encodeURIComponent(adjacent.next.cardNumber)}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors text-sm flex-1 min-w-0 text-right"
                  >
                    <div className="truncate flex-1">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Next</div>
                      <div className="text-foreground truncate">#{adjacent.next.cardNumber} {adjacent.next.characterName}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                  </Link>
                ) : <div className="flex-1" />}
              </div>
            </div>
          </div>

          {/* Right: Card Info + Content */}
          <div className="space-y-8">
            {/* Card Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 text-xs">
                  {card.setName}
                </Badge>
                {card.cardType && card.cardType !== "Base" && (
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10 text-xs">
                    {card.cardType}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-2">
                {card.characterName}
              </h1>
              <p className="text-xl text-muted-foreground">
                Card #{card.cardNumber}
              </p>

              {/* Author Byline & Last Updated */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>By <strong className="text-foreground">Northland Legendary Finds</strong> &middot; Collecting Since 1993</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>

              {/* Quick links */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Link href={`/characters/${characterSlug}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Character Profile
                  </Button>
                </Link>
                <Link href={`/cards/${card.setSlug}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Full Set Checklist
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Answer Box - AEO/GEO/AIO Optimization */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-primary mb-1">Quick Answer</h2>
                  <p className="text-sm text-foreground leading-relaxed">
                    {card.characterName} #{card.cardNumber} from <strong>{card.setName}</strong>
                    {parallels.length > 0 ? (
                      <> has <strong>{parallels.length} parallel versions</strong>, including {parallels.filter((p: any) => p.printRun).slice(0, 3).map((p: any) => `/${p.printRun}`).join(", ")}{parallels.some((p: any) => p.printRun === 1) ? ", and a 1/1 Superfractor" : ""}.</>
                    ) : (
                      <> is a base card in this set.</>
                    )}
                    {" "}Browse the full parallel breakdown and collecting guide below at Northland Legendary Finds.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Parallel Breakdown */}
            {parallels.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-primary" />
                  Parallel Breakdown
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {parallels.map((p: any, i: number) => {
                    const rarityLabel = getRarityLabel(p.printRun);
                    return (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded-lg border border-border/30 bg-card p-3 hover:border-primary/40 transition-colors"
                      >
                        <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-2 ${getParallelColor(p.printRun)}`}>
                          {p.name}
                        </div>
                        {rarityLabel && (
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {rarityLabel}
                          </div>
                        )}
                        {p.printRun && p.printRun > 1 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Print run: {p.printRun}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator className="bg-border/30" />

            {/* LLM-Generated Content */}
            <div>
              {contentMarkdown ? (
                <article className="prose prose-invert prose-green max-w-none
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-strong:text-foreground
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-li:text-muted-foreground
                ">
                  <Streamdown>{contentMarkdown}</Streamdown>
                </article>
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground text-lg">Generating card analysis...</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">This takes a few seconds on first visit</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-muted-foreground mb-4">Content not yet generated for this card.</p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      generateContent.mutate(
                        { setSlug: setSlug || "", cardNumber: decodeURIComponent(cardNumber || "") },
                        {
                          onSuccess: () => {
                            utils.public.marvel.cardDetail.invalidate({ setSlug, cardNumber: decodeURIComponent(cardNumber || "") });
                          },
                        }
                      )
                    }
                    disabled={generateContent.isPending}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate Content
                  </Button>
                </div>
              )}
            </div>

            {/* FAQ Section - Targeting "People Also Ask" */}
            <section className="pt-6 border-t border-border/30">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {cardFaqs.map((faq, i) => (
                  <details
                    key={i}
                    className="bg-card border border-border rounded-xl group"
                    open={i === 0}
                  >
                    <summary className="p-4 cursor-pointer text-foreground font-medium hover:text-primary transition-colors list-none flex items-center justify-between">
                      <span className="text-sm">{faq.question}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                    </summary>
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Other cards of same character in this set */}
            {sameCharCards.length > 0 && (
              <>
                <Separator className="bg-border/30" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-primary" />
                    More {card.characterName} in {card.setName}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sameCharCards.map((sc: any) => (
                      <Link
                        key={sc.id}
                        href={`/cards/${card.setSlug}/${encodeURIComponent(sc.cardNumber)}`}
                        className="group"
                      >
                        <div className="rounded-lg border border-border/30 bg-card overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                          {sc.imageUrl ? (
                            <img
                              src={sc.imageUrl}
                              alt={`${sc.characterName} #${sc.cardNumber} ${card.setName} - Northland Legendary Finds`}
                              className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center">
                              <Hash className="w-8 h-8 text-zinc-600" />
                            </div>
                          )}
                          <div className="p-2">
                            <div className="text-xs font-medium text-foreground truncate">#{sc.cardNumber}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{sc.cardType}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Internal Links Section */}
            <section className="pt-6 border-t border-border/30">
              <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Continue Exploring at Northland Legendary Finds</h3>
              <div className="flex flex-wrap gap-2">
                <Link href={`/characters/${characterSlug}`}>
                  <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                    {card.characterName} Character Profile
                  </Badge>
                </Link>
                <Link href={`/cards/${card.setSlug}`}>
                  <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                    {card.setName} Full Checklist
                  </Badge>
                </Link>
                <Link href="/characters">
                  <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                    Browse All 880+ Characters
                  </Badge>
                </Link>
                <Link href="/cards">
                  <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                    Full Card Database
                  </Badge>
                </Link>
                <Link href="/shop">
                  <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                    Shop Repack Packs
                  </Badge>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
