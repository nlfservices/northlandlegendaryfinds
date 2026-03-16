/**
 * Card of the Day - Homepage spotlight component
 * Shows a deterministic daily card with image, character info, set details, and a content snippet.
 * Links to the full card detail page and character page.
 */

import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Sparkles, ArrowRight, Calendar, Layers, User } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function CardOfTheDay() {
  const { data: card, isLoading } = trpc.public.marvel.cardOfTheDay.useQuery(undefined, {
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since it changes daily
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">CARD OF THE DAY</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
              TODAY'S <span className="text-amber-400">SPOTLIGHT</span>
            </h2>
          </div>
          {/* Skeleton */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="aspect-[3/4] bg-muted rounded-xl" />
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                  <div className="h-20 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!card) return null;

  // Count parallels from comma-separated string
  const parallelCount = card.parallels ? card.parallels.split(',').filter(Boolean).length : 0;
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-bold tracking-wide">CARD OF THE DAY</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
            TODAY'S <span className="text-amber-400">SPOTLIGHT</span>
          </h2>
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            {todayStr}
          </p>
        </div>

        {/* Card Spotlight */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-card/80 backdrop-blur-sm border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-colors duration-300">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Card Image */}
              <div className="relative p-6 lg:p-8 flex items-center justify-center bg-gradient-to-br from-black/20 to-transparent">
                <Link href={`/cards/${card.setSlug}/${card.cardNumber}`}>
                  <div className="group cursor-pointer relative">
                    {/* Glow behind card */}
                    <div className="absolute -inset-4 bg-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={`${card.characterName} - ${card.setName} #${card.cardNumber}`}
                        className="relative w-full max-w-[300px] rounded-xl shadow-2xl shadow-black/40 group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative w-full max-w-[300px] aspect-[3/4] rounded-xl bg-gradient-to-br from-amber-500/20 via-card to-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center">
                        <Sparkles className="w-12 h-12 text-amber-400 mb-3" />
                        <span className="text-xl font-bold text-amber-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                          {card.characterName}
                        </span>
                        <span className="text-sm text-muted-foreground mt-1">#{card.cardNumber}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {/* Right: Card Details */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                {/* Card Type Badge */}
                {card.cardType && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold tracking-wide w-fit mb-4">
                    {card.cardType}
                  </span>
                )}

                {/* Character Name */}
                <h3 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <Link href={`/cards/${card.setSlug}/${card.cardNumber}`}>
                    <span className="hover:text-amber-400 transition-colors cursor-pointer">
                      {card.characterName}
                    </span>
                  </Link>
                </h3>

                {/* Set & Card Number */}
                <p className="text-muted-foreground mb-4">
                  {card.setName} · <span className="text-foreground font-semibold">#{card.cardNumber}</span>
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 mb-5">
                  {parallelCount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span className="text-muted-foreground">
                        <span className="text-foreground font-semibold">{parallelCount}</span> Parallels
                      </span>
                    </div>
                  )}
                  <Link href={`/characters/${card.characterSlug}`}>
                    <div className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground hover:text-primary transition-colors">
                        View <span className="text-foreground font-semibold hover:text-primary">{card.characterName}</span> Profile
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Content Snippet */}
                {card.contentSnippet && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-4">
                    {card.contentSnippet}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link href={`/cards/${card.setSlug}/${card.cardNumber}`}>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
                      View Full Card Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href={`/cards/${card.setSlug}`}>
                    <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-bold">
                      Browse {card.setShortName || "Set"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
