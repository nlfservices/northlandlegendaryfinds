import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, Shield, Skull, Zap, Calendar, User, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroOfTheDay() {
  const { data, isLoading } = trpc.public.marvel.characterOfTheDay.useQuery();

  if (isLoading) {
    return (
      <section className="py-10 lg:py-14">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-8 animate-pulse">
            <div className="w-48 h-64 rounded-xl bg-muted" />
            <div className="flex-1 space-y-4">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-10 w-72 bg-muted rounded" />
              <div className="h-4 w-full max-w-lg bg-muted rounded" />
              <div className="h-4 w-3/4 max-w-lg bg-muted rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const isVillain = data.type === "villain";

  return (
    <section className="py-10 lg:py-14 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-green-500/5 pointer-events-none" />

      <div className="container relative z-10">
        {/* Section Header - "Heroes & Villains of the Day" */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-black/40 border-2 border-orange-500 rounded-full mb-3 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            {isVillain ? (
              <Skull className="w-5 h-5 text-[#39ff14]" />
            ) : (
              <Shield className="w-5 h-5 text-[#39ff14]" />
            )}
            <span
              className="text-sm font-black tracking-wider uppercase"
              style={{
                color: "#39ff14",
                textShadow: "0 0 8px rgba(57,255,20,0.5)",
                WebkitTextStroke: "0.5px rgba(249,115,22,0.7)",
              }}
            >
              Heroes & Villains of the Day
            </span>
          </div>
        </div>

        {/* Card + Info Layout */}
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* Card Image */}
          <Link href={`/characters/${data.slug}`}>
            <div className="relative group cursor-pointer flex-shrink-0">
              <div className="absolute -inset-2 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.25)] opacity-60 group-hover:opacity-100 transition-opacity" />
              {data.cardImage ? (
                <img
                  src={data.cardImage}
                  alt={data.characterName}
                  className="relative w-48 lg:w-56 rounded-xl border-2 border-orange-500/60 group-hover:border-orange-400 group-hover:scale-[1.03] transition-all duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="relative w-48 lg:w-56 h-64 lg:h-72 rounded-xl border-2 border-orange-500/60 bg-muted flex items-center justify-center">
                  <Swords className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
              {/* Type Badge */}
              <div
                className={`absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-black border-2 ${
                  isVillain
                    ? "bg-black/80 border-orange-500 text-[#39ff14]"
                    : "bg-black/80 border-orange-500 text-[#39ff14]"
                }`}
                style={{
                  textShadow: "0 0 6px rgba(57,255,20,0.5)",
                }}
              >
                {isVillain ? "VILLAIN" : "HERO"}
              </div>
            </div>
          </Link>

          {/* Character Info */}
          <div className="flex-1 text-center md:text-left">
            <h2
              className="text-4xl lg:text-5xl font-black mb-2 uppercase"
              style={{
                fontFamily: "'Anton', sans-serif",
                color: "#39ff14",
                textShadow: "0 0 10px rgba(57,255,20,0.4), 0 0 20px rgba(57,255,20,0.2)",
                WebkitTextStroke: "1.5px rgba(249,115,22,0.9)",
                paintOrder: "stroke fill",
              }}
            >
              {data.characterName}
            </h2>

            {data.realName && (
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm">{data.realName}</span>
              </div>
            )}

            {data.metaDescription && (
              <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-4 max-w-lg">
                {data.metaDescription}
              </p>
            )}

            {/* Key Facts */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-5">
              {data.firstAppearance && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card/80 border border-orange-500/30 rounded-full px-3 py-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>{data.firstAppearance}</span>
                </div>
              )}
              {data.powers?.map((power, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs bg-card/80 border border-orange-500/30 rounded-full px-3 py-1.5"
                  style={{ color: "#39ff14" }}
                >
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                  <span>{power}</span>
                </div>
              ))}
            </div>

            {/* Card Info + CTA */}
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              {data.cardSet && (
                <span className="text-xs text-muted-foreground">
                  Featured in{" "}
                  <span className="font-medium" style={{ color: "#39ff14" }}>
                    {data.totalCards} cards
                  </span>{" "}
                  across our collection
                </span>
              )}
              <Link href={`/characters/${data.slug}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-500/50 hover:bg-orange-500/10 font-bold"
                  style={{
                    color: "#39ff14",
                    textShadow: "0 0 4px rgba(57,255,20,0.3)",
                  }}
                >
                  View Profile
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
