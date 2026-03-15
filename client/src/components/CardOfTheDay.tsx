/**
 * Card of the Day - Homepage spotlight component
 * Shows a deterministic daily card with art, character info, and link to detail page
 */

import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star, ArrowRight, Calendar, Layers, Sparkles
} from "lucide-react";

function characterNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CardOfTheDay() {
  const { data, isLoading } = trpc.public.marvel.cardOfTheDay.useQuery(
    undefined,
    { staleTime: 1000 * 60 * 60 } // Cache for 1 hour since it's daily
  );

  if (isLoading) {
    return (
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <Skeleton className="aspect-[2/3] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const cardUrl = `/cards/${data.setSlug}/${data.cardNumber}`;
  const characterUrl = `/characters/${characterNameToSlug(data.characterName)}`;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Card of the Day
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{today}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 border-primary/30 text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            Daily Pick
          </Badge>
        </div>

        {/* Card Spotlight */}
        <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />

          <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-0">
            {/* Card Image */}
            <Link href={cardUrl} className="block relative group">
              <div className="p-6 md:p-8">
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={`${data.characterName} #${data.cardNumber} - ${data.setName}`}
                    className="w-full rounded-xl shadow-2xl shadow-black/40 border border-border/30 transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-primary/20"
                  />
                ) : (
                  <div className="aspect-[2/3] bg-muted rounded-xl border border-border/30 flex items-center justify-center">
                    <Layers className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </Link>

            {/* Card Info */}
            <div className="p-6 md:p-8 md:pl-0 flex flex-col justify-center">
              <div className="space-y-4">
                {/* Character Name & Card Number */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs border-primary/40 text-primary font-mono">
                      #{data.cardNumber}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-border/60 text-muted-foreground">
                      {data.cardType || "Base"}
                    </Badge>
                  </div>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                    {data.characterName}
                  </h3>
                </div>

                {/* Set Name */}
                <p className="text-lg text-muted-foreground">
                  From <span className="text-foreground font-medium">{data.setName}</span>
                </p>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed max-w-lg">
                  Today's featured card spotlights {data.characterName} from the {data.setName} set.
                  Explore the full parallel breakdown, card art, and collecting guide.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href={cardUrl}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                      View Card Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={characterUrl}>
                    <Button variant="outline" className="gap-2 border-border/60 hover:border-primary/40">
                      Explore {data.characterName}
                      <ArrowRight className="w-4 h-4" />
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
