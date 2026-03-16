import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Swords, Shield, Sparkles } from "lucide-react";

/**
 * Heroes & Villains of the Day
 * 
 * Shows a daily featured Marvel character with their card image.
 * Color scheme: Bright orange bordering with neon green solid letters.
 * The character changes each day based on a deterministic hash.
 */
export default function HeroOfTheDay() {
  const { data, isLoading, error } = trpc.public.characterOfTheDay.get.useQuery();

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-400" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) return null;

  // Determine hero vs villain based on character name hash
  const nameHash = data.characterName.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
  const isVillain = nameHash % 3 === 0; // roughly 1/3 are villains
  const alignment = isVillain ? "VILLAIN" : "HERO";

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden" id="heroes-villains">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-background to-green-900/10" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              border: "2px solid #f97316",
              background: "rgba(249, 115, 22, 0.1)",
            }}
          >
            <Swords className="w-4 h-4" style={{ color: "#39ff14" }} />
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: "#39ff14" }}
            >
              DAILY SPOTLIGHT
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{
              fontFamily: "'Anton', sans-serif",
              color: "#39ff14",
              textShadow: "0 0 20px rgba(57,255,20,0.3), 2px 2px 0 #f97316, -1px -1px 0 #f97316",
            }}
          >
            HEROES & VILLAINS
          </h2>
          <h3
            className="text-2xl md:text-3xl font-bold"
            style={{
              fontFamily: "'Anton', sans-serif",
              color: "#39ff14",
              textShadow: "0 0 15px rgba(57,255,20,0.3), 1px 1px 0 #f97316, -1px -1px 0 #f97316",
            }}
          >
            OF THE DAY
          </h3>
        </div>

        {/* Card display */}
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-1 relative overflow-hidden"
            style={{
              border: "3px solid #f97316",
              boxShadow: "0 0 30px rgba(249,115,22,0.2), inset 0 0 30px rgba(249,115,22,0.05)",
            }}
          >
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Card image */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div
                      className="absolute -inset-3 rounded-xl opacity-50 blur-lg group-hover:opacity-80 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #f97316, #39ff14)" }}
                    />
                    <div
                      className="relative rounded-lg overflow-hidden"
                      style={{ border: "3px solid #f97316" }}
                    >
                      <img
                        src={data.cardImage!}
                        alt={data.characterName}
                        className="w-64 md:w-72 h-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Character info */}
                <div className="text-center md:text-left">
                  {/* Alignment badge */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                    style={{
                      border: "2px solid #f97316",
                      background: isVillain ? "rgba(239,68,68,0.15)" : "rgba(57,255,20,0.15)",
                    }}
                  >
                    {isVillain ? (
                      <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <Shield className="w-3.5 h-3.5" style={{ color: "#39ff14" }} />
                    )}
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{ color: isVillain ? "#f87171" : "#39ff14" }}
                    >
                      {alignment} OF THE DAY
                    </span>
                  </div>

                  {/* Character name */}
                  <h3
                    className="text-3xl md:text-4xl font-bold mb-3"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      color: "#39ff14",
                      textShadow: "0 0 15px rgba(57,255,20,0.3), 1px 1px 0 #f97316",
                    }}
                  >
                    {data.characterName}
                  </h3>

                  {/* Real name */}
                  {data.realName && (
                    <p className="text-muted-foreground text-sm mb-3 italic">
                      a.k.a. {data.realName}
                    </p>
                  )}

                  {/* Card info */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <span style={{ color: "#f97316" }} className="font-semibold">{data.setName}</span>
                      {data.cardNumber && <> &middot; #{data.cardNumber}</>}
                    </p>
                    {data.cardType && (
                      <p className="text-xs text-muted-foreground">{data.cardType}</p>
                    )}
                  </div>

                  {/* Powers */}
                  {data.notablePowers && data.notablePowers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                      {data.notablePowers.slice(0, 4).map((power: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            border: "1.5px solid #f97316",
                            color: "#39ff14",
                            background: "rgba(249,115,22,0.1)",
                          }}
                        >
                          {power}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <p className="text-sm text-muted-foreground mb-5">
                    Appears on <span style={{ color: "#39ff14" }} className="font-bold">{data.cardCount}</span> cards in our database
                  </p>

                  {/* CTA */}
                  <Link href={`/characters/${data.slug}`}>
                    <button
                      className="font-bold py-2.5 px-6 rounded-lg transition-all hover:brightness-110 text-sm"
                      style={{
                        background: "linear-gradient(135deg, #f97316, #ea580c)",
                        color: "#39ff14",
                        border: "2px solid #f97316",
                        boxShadow: "0 0 15px rgba(249,115,22,0.3)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      VIEW CHARACTER PROFILE →
                    </button>
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
