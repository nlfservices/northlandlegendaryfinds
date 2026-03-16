/**
 * Hero / Villain of the Day - Homepage character spotlight
 * Shows a deterministic daily character with their lore, key facts, featured card,
 * and links to the character page and card detail page.
 * Alternates between "Hero of the Day" and "Villain of the Day" based on alignment.
 */

import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  Sparkles, ArrowRight, Calendar, Layers, Swords, Shield,
  BookOpen, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Known villains list — used to determine Hero vs Villain label
const VILLAINS = new Set([
  "abomination", "aldrich killian", "annihilus", "apocalypse", "attuma",
  "baron strucker", "baron zemo", "bullseye", "carnage", "cassandra nova",
  "crossbones", "dark phoenix", "doctor doom", "dormammu", "ego",
  "enchantress", "erik killmonger", "galactus", "gorr", "green goblin",
  "hela", "helmut zemo", "hobgoblin", "juggernaut", "kang the conqueror",
  "kingpin", "knull", "loki", "magneto", "malekith", "mandarin",
  "mephisto", "mister sinister", "modok", "mysterio", "mystique",
  "namor", "nimrod", "omega red", "red skull", "ronan", "ronan the accuser",
  "sabretooth", "stryfe", "super-skrull", "surtur", "taskmaster",
  "thanos", "the high evolutionary", "the leader", "ultron", "venom",
  "vulture", "whiplash",
]);

function isVillain(name: string): boolean {
  return VILLAINS.has(name.toLowerCase().trim());
}

export default function HeroVillainOfTheDay() {
  const { data: character, isLoading } = trpc.public.marvel.characterOfTheDay.useQuery(undefined, {
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full mb-4">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-bold tracking-wide">LOADING SPOTLIGHT...</span>
            </div>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-2 aspect-[3/4] bg-muted rounded-xl" />
                <div className="lg:col-span-3 space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                  <div className="h-24 bg-muted rounded" />
                  <div className="h-10 bg-muted rounded w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!character) return null;

  const villain = isVillain(character.characterName);
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Color scheme based on alignment
  const accentColor = villain ? "red" : "cyan";
  const IconComponent = villain ? Swords : Shield;
  const label = villain ? "VILLAIN OF THE DAY" : "HERO OF THE DAY";
  const headingWord = villain ? "VILLAIN" : "HERO";

  const keyFacts = character.keyFacts as {
    realName?: string;
    firstAppearance?: string;
    creators?: string;
    notablePowers?: string[];
    teams?: string[];
  } | null;

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ backgroundColor: villain ? "rgba(239,68,68,0.05)" : "rgba(6,182,212,0.05)" }}
        />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: villain ? "rgba(239,68,68,0.15)" : "rgba(6,182,212,0.15)",
              borderWidth: 1,
              borderColor: villain ? "rgba(239,68,68,0.3)" : "rgba(6,182,212,0.3)",
            }}
          >
            <IconComponent className="w-4 h-4" style={{ color: villain ? "#f87171" : "#22d3ee" }} />
            <span className="text-sm font-bold tracking-wide" style={{ color: villain ? "#f87171" : "#22d3ee" }}>
              {label}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
            TODAY'S{" "}
            <span style={{ color: villain ? "#f87171" : "#22d3ee" }}>{headingWord}</span>
          </h2>
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            {todayStr}
          </p>
        </div>

        {/* Character Spotlight Card */}
        <div className="max-w-5xl mx-auto">
          <div
            className="relative bg-card/80 backdrop-blur-sm border rounded-2xl overflow-hidden transition-colors duration-300"
            style={{
              borderColor: villain ? "rgba(239,68,68,0.2)" : "rgba(6,182,212,0.2)",
            }}
          >
            {/* Decorative corner accents */}
            <div
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl to-transparent pointer-events-none"
              style={{ background: `linear-gradient(to bottom left, ${villain ? "rgba(239,68,68,0.1)" : "rgba(6,182,212,0.1)"}, transparent)` }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr to-transparent pointer-events-none"
              style={{ background: `linear-gradient(to top right, ${villain ? "rgba(239,68,68,0.08)" : "rgba(6,182,212,0.08)"}, transparent)` }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Left: Card Image (2 cols) */}
              <div className="lg:col-span-2 relative p-6 lg:p-8 flex items-center justify-center bg-gradient-to-br from-black/20 to-transparent">
                <Link href={character.featuredCard ? `/cards/${character.featuredCard.setSlug}/${character.featuredCard.cardNumber}` : `/characters/${character.characterSlug}`}>
                  <div className="group cursor-pointer relative">
                    <div
                      className="absolute -inset-4 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ backgroundColor: villain ? "rgba(239,68,68,0.1)" : "rgba(6,182,212,0.1)" }}
                    />
                    {character.featuredCard?.imageUrl ? (
                      <img
                        src={character.featuredCard.imageUrl}
                        alt={`${character.characterName} trading card`}
                        className="relative w-full max-w-[280px] rounded-xl shadow-2xl shadow-black/40 group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="relative w-full max-w-[280px] aspect-[3/4] rounded-xl border flex flex-col items-center justify-center"
                        style={{
                          background: villain
                            ? "linear-gradient(to bottom right, rgba(239,68,68,0.2), var(--card), rgba(239,68,68,0.1))"
                            : "linear-gradient(to bottom right, rgba(6,182,212,0.2), var(--card), rgba(6,182,212,0.1))",
                          borderColor: villain ? "rgba(239,68,68,0.3)" : "rgba(6,182,212,0.3)",
                        }}
                      >
                        <IconComponent className="w-16 h-16 mb-3" style={{ color: villain ? "#f87171" : "#22d3ee" }} />
                        <span className="text-2xl font-bold" style={{ fontFamily: "'Anton', sans-serif", color: villain ? "#f87171" : "#22d3ee" }}>
                          {character.characterName}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {/* Right: Character Details (3 cols) */}
              <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col justify-center">
                {/* Alignment Badge */}
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide w-fit mb-3"
                  style={{
                    backgroundColor: villain ? "rgba(239,68,68,0.05)" : "rgba(6,182,212,0.05)",
                    borderWidth: 1,
                    borderColor: villain ? "rgba(239,68,68,0.2)" : "rgba(6,182,212,0.2)",
                    color: villain ? "#f87171" : "#22d3ee",
                  }}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {villain ? "VILLAIN" : "HERO"}
                </span>

                {/* Character Name */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <Link href={`/characters/${character.characterSlug}`}>
                    <span className="hover:opacity-80 transition-opacity cursor-pointer">
                      {character.characterName}
                    </span>
                  </Link>
                </h3>

                {/* Real Name */}
                {keyFacts?.realName && keyFacts.realName !== character.characterName && (
                  <p className="text-muted-foreground text-sm mb-3 italic">
                    {keyFacts.realName}
                  </p>
                )}

                {/* Key Facts Row */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4 text-sm">
                  {keyFacts?.firstAppearance && (
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" style={{ color: villain ? "#f87171" : "#22d3ee" }} />
                      <span className="text-muted-foreground">{keyFacts.firstAppearance}</span>
                    </div>
                  )}
                  {character.totalCards > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" style={{ color: villain ? "#f87171" : "#22d3ee" }} />
                      <span className="text-muted-foreground">
                        <span className="text-foreground font-semibold">{character.totalCards}</span> Cards in Database
                      </span>
                    </div>
                  )}
                  {keyFacts?.teams && keyFacts.teams.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" style={{ color: villain ? "#f87171" : "#22d3ee" }} />
                      <span className="text-muted-foreground">{keyFacts.teams.slice(0, 2).join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Notable Powers (compact pills) */}
                {keyFacts?.notablePowers && keyFacts.notablePowers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {keyFacts.notablePowers.slice(0, 4).map((power, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: villain ? "rgba(239,68,68,0.05)" : "rgba(6,182,212,0.05)",
                          borderWidth: 1,
                          borderColor: villain ? "rgba(239,68,68,0.2)" : "rgba(6,182,212,0.2)",
                          color: villain ? "#f87171" : "#22d3ee",
                        }}
                      >
                        {power}
                      </span>
                    ))}
                    {keyFacts.notablePowers.length > 4 && (
                      <span className="px-2.5 py-0.5 bg-muted/50 rounded-full text-xs text-muted-foreground">
                        +{keyFacts.notablePowers.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Content Snippet */}
                {character.contentSnippet && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                    {character.contentSnippet}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link href={`/characters/${character.characterSlug}`}>
                    <Button
                      className="font-bold"
                      style={{
                        backgroundColor: villain ? "#dc2626" : "#0891b2",
                        color: "white",
                      }}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      Explore {character.characterName}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  {character.featuredCard && (
                    <Link href={`/cards/${character.featuredCard.setSlug}/${character.featuredCard.cardNumber}`}>
                      <Button
                        variant="outline"
                        className="font-bold"
                        style={{
                          borderColor: villain ? "rgba(239,68,68,0.3)" : "rgba(6,182,212,0.3)",
                          color: villain ? "#f87171" : "#22d3ee",
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        View Featured Card
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
