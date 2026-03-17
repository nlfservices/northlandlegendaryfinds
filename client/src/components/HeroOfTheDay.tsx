/**
 * Heroes & Villains of the Day — heraldic shield shape with green nebula background
 * Features: prev/next day navigation, no repeats within same month
 * Styling: bright orange border, neon green text, nebula space background
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Shield, Swords, Sparkles, Loader2 } from "lucide-react";

const NEBULA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-2025-emerald-green_6d5f07b4.png";

export default function HeroOfTheDay() {
  const [dayOffset, setDayOffset] = useState(0);
  const stableInput = useMemo(() => ({ dayOffset }), [dayOffset]);

  const { data, isLoading, error } = trpc.public.marvel.characterOfTheDay.useQuery(stableInput);

  if (error) return null;

  const formatDateLabel = (dateStr: string | undefined, offset: number) => {
    if (!dateStr) return "Today";
    if (offset === 0) return "Today's Pick";
    if (offset === -1) return "Yesterday's Pick";
    if (offset === 1) return "Tomorrow's Pick";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Determine hero or villain based on character name hash
  const isVillain = data?.characterName
    ? ["Doom", "Thanos", "Loki", "Magneto", "Ultron", "Venom", "Carnage", "Kingpin", "Goblin", "Killmonger", "Hela", "Kang", "Dormammu", "Mephisto", "Galactus", "Red Skull", "Abomination", "Taskmaster", "Crossbones", "Zemo", "Mandarin", "Whiplash", "Killian", "Ronan", "Ego", "Surtur", "Malekith", "Vulture", "Mysterio", "Scorpion", "Rhino", "Sandman", "Electro", "Lizard", "Doc Ock", "Fisk", "Bullseye", "Agatha", "Wenwu", "Yelena"].some(v =>
      data.characterName.toLowerCase().includes(v.toLowerCase())
    )
    : false;

  return (
    <section id="heroes-villains" className="py-16 relative overflow-hidden">
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-black/50 to-background" />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/15 border border-orange-500/40 rounded-full mb-4">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-bold tracking-wide">HEROES & VILLAINS OF THE DAY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #39FF14, #00FF41, #7CFC00)",
                WebkitTextStroke: "1px rgba(255,165,0,0.3)",
              }}
            >
              DAILY CHARACTER
            </span>
            <span className="text-white"> SPOTLIGHT</span>
          </h2>
        </div>

        {/* Navigation arrows + date */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setDayOffset(prev => prev - 1)}
            className="p-2 rounded-full border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/25 transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5 text-orange-400" />
          </button>

          <button
            onClick={() => setDayOffset(0)}
            className="px-4 py-1.5 text-sm font-medium text-green-400 border border-green-500/30 rounded-full bg-green-500/10 hover:bg-green-500/20 transition-colors min-w-[160px]"
          >
            {formatDateLabel(data?.date, dayOffset)}
          </button>

          <button
            onClick={() => setDayOffset(prev => prev + 1)}
            className="p-2 rounded-full border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/25 transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5 text-orange-400" />
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
          </div>
        )}

        {/* Character card */}
        {data && !isLoading && (
          <div className="max-w-4xl mx-auto">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "3px solid rgba(255, 165, 0, 0.6)",
                boxShadow: "0 0 30px rgba(255, 165, 0, 0.15), inset 0 0 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Nebula background */}
              <div className="absolute inset-0">
                <img src={NEBULA_BG} alt="" className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
              </div>

              <div className="relative z-10 grid md:grid-cols-[280px_1fr] gap-6 p-6 md:p-8">
                {/* Card image */}
                <div className="flex flex-col items-center gap-4">
                  {data.imageUrl ? (
                    <Link href={`/characters/${data.slug}`}>
                      <div
                        className="relative group cursor-pointer"
                        style={{
                          filter: "drop-shadow(0 0 15px rgba(57, 255, 20, 0.3))",
                        }}
                      >
                        <img
                          src={data.imageUrl}
                          alt={data.characterName}
                          className="w-[240px] h-auto rounded-lg border-2 border-orange-500/50 group-hover:border-green-400/70 transition-colors"
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                    </Link>
                  ) : (
                    <div className="w-[240px] h-[320px] rounded-lg border-2 border-orange-500/30 bg-black/50 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-orange-500/30" />
                    </div>
                  )}

                  {/* Alignment badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                      isVillain
                        ? "bg-red-500/20 border border-red-500/40 text-red-400"
                        : "bg-blue-500/20 border border-blue-500/40 text-blue-400"
                    }`}
                  >
                    {isVillain ? (
                      <>
                        <Swords className="w-3 h-3" />
                        VILLAIN
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        HERO
                      </>
                    )}
                  </div>
                </div>

                {/* Character info */}
                <div className="flex flex-col justify-center">
                  <h3
                    className="text-3xl sm:text-4xl font-black mb-3"
                    style={{
                      color: "#39FF14",
                      textShadow: "0 0 10px rgba(57, 255, 20, 0.4), 2px 2px 0 rgba(255, 165, 0, 0.5)",
                    }}
                  >
                    {data.characterName}
                  </h3>

                  {data.setName && (
                    <p className="text-orange-400/80 text-sm font-medium mb-4">
                      Featured in: <span className="text-orange-300">{data.setName}</span>
                      {data.cardNumber && <span className="text-orange-400/60"> · #{data.cardNumber}</span>}
                    </p>
                  )}

                  {data.metaDescription && (
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                      {data.metaDescription}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link href={`/characters/${data.slug}`}>
                      <button className="px-5 py-2.5 bg-green-500/20 border border-green-500/50 text-green-400 font-bold text-sm rounded-lg hover:bg-green-500/30 transition-colors">
                        View Character Profile
                      </button>
                    </Link>
                    {data.setSlug && data.cardNumber && (
                      <Link href={`/cards/${data.setSlug}/${data.cardNumber}`}>
                        <button className="px-5 py-2.5 bg-orange-500/20 border border-orange-500/50 text-orange-400 font-bold text-sm rounded-lg hover:bg-orange-500/30 transition-colors">
                          View Card Details
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Back to today link */}
            {dayOffset !== 0 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setDayOffset(0)}
                  className="text-sm text-green-400/70 hover:text-green-400 transition-colors underline underline-offset-4"
                >
                  Back to Today's Pick
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
