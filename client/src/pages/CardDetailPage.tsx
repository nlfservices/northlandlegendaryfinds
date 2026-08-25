/**
 * Card Detail Page - Individual card page with parallel breakdown,
 * set-specific character content, card art, and navigation
 */

import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { mediaUrl } from "@/lib/mediaUrl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyStreamdown } from "@/components/LazyStreamdown";
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
} from "lucide-react";

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


function getOddsLabel(odds?: string) {
  if (!odds) return "";
  const n = parseInt(String(odds).replace(/[^0-9]/g, ""), 10);
  if (!n) return "";
  if (n >= 700) return "ULTRA RARE";
  if (n >= 140) return "SHORT PRINT";
  if (n >= 29) return "LIMITED";
  return "";
}

function getOddsColor(odds?: string) {
  if (!odds) return "bg-zinc-700 text-zinc-200";
  const n = parseInt(String(odds).replace(/[^0-9]/g, ""), 10);
  if (!n) return "bg-zinc-700 text-zinc-200";
  if (n >= 700) return "bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold";
  if (n >= 280) return "bg-gradient-to-r from-red-600 to-red-500 text-white font-bold";
  if (n >= 140) return "bg-gradient-to-r from-purple-600 to-purple-500 text-white";
  if (n >= 29) return "bg-gradient-to-r from-blue-600 to-blue-500 text-white";
  if (n >= 10) return "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white";
  return "bg-zinc-600 text-zinc-100";
}

function NoCardImage() {
  return (
    <div className="aspect-[2/3] bg-card rounded-xl border border-border/30 flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Hash className="w-12 h-12 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No image available</p>
      </div>
    </div>
  );
}

const faceImgClass =
  "w-full rounded-xl shadow-2xl shadow-black/40 border border-border/30";

/** Front/back viewer: tap the card or Front/Back to flip when a back scan exists. */
function CardFaceViewer({
  cardId,
  frontUrl,
  backUrl,
  characterName,
  cardNumber,
  setName,
}: {
  cardId: number;
  frontUrl?: string | null;
  backUrl?: string | null;
  characterName: string;
  cardNumber: string;
  setName: string;
}) {
  const frontSrc = mediaUrl(frontUrl);
  const backSrc = mediaUrl(backUrl);
  const [frontDead, setFrontDead] = useState(false);
  const [backDead, setBackDead] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [loadBack, setLoadBack] = useState(false);

  useEffect(() => {
    setFrontDead(false);
    setBackDead(false);
    setShowBack(false);
    setLoadBack(false);
  }, [cardId, frontSrc, backSrc]);

  const canShowFront = !!frontSrc && !frontDead;
  const canShowBack = !!backSrc && !backDead;
  const showingBack = showBack && canShowBack;

  useEffect(() => {
    if (showBack && !canShowBack) setShowBack(false);
  }, [showBack, canShowBack]);

  if (!canShowFront && !canShowBack) {
    return <NoCardImage />;
  }

  if (!canShowFront || !canShowBack) {
    const src = canShowFront ? frontSrc : backSrc;
    const side = canShowFront ? "front" : "back";
    return (
      <img
        src={src}
        alt={`${characterName} #${cardNumber} ${side} - ${setName}`}
        className={faceImgClass}
        onError={() => {
          if (canShowFront) setFrontDead(true);
          else setBackDead(true);
        }}
      />
    );
  }

  return (
    <div>
      <div className="relative" style={{ perspective: "1400px" }}>
        <button
          type="button"
          onClick={() => { setLoadBack(true); setShowBack((prev) => !prev); }}
          aria-label={showingBack ? "Show card front" : "Show card back"}
          className="block w-full cursor-pointer bg-transparent p-0 border-0 text-left group"
        >
          <div
            className="relative w-full transition-transform duration-500 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: showingBack ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <img
              src={frontSrc}
              alt={`${characterName} #${cardNumber} front - ${setName}`}
              className={`${faceImgClass} transition-transform duration-300 group-hover:scale-[1.01]`}
              style={{ backfaceVisibility: "hidden" }}
              onError={() => setFrontDead(true)}
            />
            {loadBack ? (
            <img
              src={backSrc}
              alt={`${characterName} #${cardNumber} back - ${setName}`}
              className={`${faceImgClass} absolute inset-0`}
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              onError={() => setBackDead(true)}
            />
            ) : null}
          </div>
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <button
          type="button"
          onClick={() => setShowBack(false)}
          aria-pressed={!showingBack}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
            !showingBack
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground"
          }`}
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => { setLoadBack(true); setShowBack(true); }}
          aria-pressed={showingBack}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
            showingBack
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground"
          }`}
        >
          Back
        </button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-1.5">Tap the card to flip</p>
    </div>
  );
}

function HideableThumb({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const resolved = mediaUrl(src);
  const [dead, setDead] = useState(false);
  useEffect(() => {
    setDead(false);
  }, [resolved]);
  if (!resolved || dead) return null;
  return <img src={resolved} alt={alt} className={className} onError={() => setDead(true)} />;
}

export default function CardDetailPage() {
  const { setSlug, cardNumber } = useParams<{ setSlug: string; cardNumber: string }>();
  const [, navigate] = useLocation();

  const { data, isLoading, error } = trpc.public.marvel.cardDetail.useQuery(
    { setSlug: setSlug || "", cardNumber: decodeURIComponent(cardNumber || "") },
    { enabled: !!setSlug && !!cardNumber }
  );

  const { data: setData } = trpc.public.marvel.getSetBySlug.useQuery(
    { slug: setSlug || "" },
    { enabled: !!setSlug }
  );

  const generateContent = trpc.public.marvel.generateCardContent.useMutation();
  const utils = trpc.useUtils();

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

  useEffect(() => {
    setAutoTriggered(false);
  }, [setSlug, cardNumber]);

  useEffect(() => {
    if (data?.card) {
      document.title = `${data.card.characterName} #${data.card.cardNumber} - ${data.card.setName} | Northland Legendary Finds`;
    }
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

  return (
    <div className="min-h-screen bg-background">
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
        <div className="grid lg:grid-cols-[400px_1fr] gap-8 xl:gap-12">
          <div className="space-y-4">
            <div className="sticky top-24">
              <div className="relative group">
                <CardFaceViewer
                  cardId={card.id}
                  frontUrl={card.imageUrl}
                  backUrl={card.backImageUrl || setData?.cards.find((c) => c.id === card.id)?.backImageUrl}
                  characterName={card.characterName}
                  cardNumber={card.cardNumber}
                  setName={card.setName}
                />
              </div>

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

          <div className="space-y-8">
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

            <Separator className="bg-border/30" />

            {parallels.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-primary" />
                  Parallel Breakdown
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {parallels.map((p, i) => {
                    const odds = (p as { odds?: string }).odds;
                    const rarityLabel = odds ? getOddsLabel(odds) : getRarityLabel(p.printRun);
                    const badgeClass = odds ? getOddsColor(odds) : getParallelColor(p.printRun);
                    return (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded-lg border border-border/30 bg-card p-3 hover:border-primary/40 transition-colors"
                      >
                        <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-2 ${badgeClass}`}>
                          {p.name}
                        </div>
                        {rarityLabel && (
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {rarityLabel}
                          </div>
                        )}
                        {odds && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Odds {odds}
                          </div>
                        )}
                        {!odds && p.printRun && p.printRun > 1 && (
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
                  <LazyStreamdown>{contentMarkdown}</LazyStreamdown>
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

            {sameCharCards.length > 0 && (
              <>
                <Separator className="bg-border/30" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-primary" />
                    More {card.characterName} in {card.setName}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sameCharCards.map((sc) => (
                      <Link
                        key={sc.id}
                        href={`/cards/${card.setSlug}/${encodeURIComponent(sc.cardNumber)}`}
                        className="group"
                      >
                        <div className="rounded-lg border border-border/30 bg-card overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                          {sc.imageUrl ? (
                            <HideableThumb
                              src={sc.imageUrl}
                              alt={`${sc.characterName} #${sc.cardNumber}`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
