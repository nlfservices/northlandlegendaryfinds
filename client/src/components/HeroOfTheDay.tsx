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
  const accentColor = isVillain ? "text-red-500" : "text-primary";
  const accentBg = isVillain ? "bg-red-500/10 border-red-500/30" : "bg-primary/10 border-primary/30";
  const accentGlow = isVillain
    ? "shadow-[0_0_40px_rgba(239,68,68,0.15)]"
    : "shadow-[0_0_40px_rgba(0,255,65,0.15)]";
  const gradientFrom = isVillain ? "from-red-500/5" : "from-primary/5";

  return (
    <section className={`py-10 lg:py-14 bg-gradient-to-r ${gradientFrom} via-transparent to-transparent`}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${accentBg} border rounded-full mb-3`}>
            {isVillain ? (
              <Skull className="w-4 h-4 text-red-500" />
            ) : (
              <Shield className="w-4 h-4 text-primary" />
            )}
            <span className={`${accentColor} text-sm font-bold tracking-wide uppercase`}>
              {isVillain ? "Villain" : "Hero"} of the Day
            </span>
          </div>
        </div>

        {/* Card + Info Layout */}
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* Card Image */}
          <Link href={`/characters/${data.slug}`}>
            <div className={`relative group cursor-pointer flex-shrink-0`}>
              <div className={`absolute -inset-2 rounded-2xl ${accentGlow} opacity-60 group-hover:opacity-100 transition-opacity`} />
              {data.cardImage ? (
                <img
                  src={data.cardImage}
                  alt={data.characterName}
                  className="relative w-48 lg:w-56 rounded-xl border border-border/50 group-hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="relative w-48 lg:w-56 h-64 lg:h-72 rounded-xl border border-border/50 bg-muted flex items-center justify-center">
                  <Swords className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
              {/* Type Badge */}
              <div className={`absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isVillain
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-primary/20 border-primary/50 text-primary"
              }`}>
                {isVillain ? "VILLAIN" : "HERO"}
              </div>
            </div>
          </Link>

          {/* Character Info */}
          <div className="flex-1 text-center md:text-left">
            <h2
              className="text-4xl lg:text-5xl font-bold mb-2"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              <span className={accentColor}>{data.characterName.toUpperCase()}</span>
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
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card/80 border border-border/50 rounded-full px-3 py-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{data.firstAppearance}</span>
                </div>
              )}
              {data.powers?.map((power, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 text-xs ${
                    isVillain ? "text-red-400/80" : "text-primary/80"
                  } bg-card/80 border border-border/50 rounded-full px-3 py-1.5`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{power}</span>
                </div>
              ))}
            </div>

            {/* Card Info + CTA */}
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              {data.cardSet && (
                <span className="text-xs text-muted-foreground">
                  Featured in <span className="text-foreground font-medium">{data.totalCards} cards</span> across our collection
                </span>
              )}
              <Link href={`/characters/${data.slug}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className={`${
                    isVillain
                      ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                      : "border-primary/30 text-primary hover:bg-primary/10"
                  } font-bold`}
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
