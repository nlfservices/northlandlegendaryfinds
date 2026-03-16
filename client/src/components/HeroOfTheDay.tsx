import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Swords, Shield, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Heroes & Villains of the Day
 * 
 * Shows a daily featured Marvel character with their card image.
 * Color scheme: Bright orange bordering with neon green solid letters.
 * The character changes each day based on a deterministic hash.
 * Users can navigate to previous/next days with arrow buttons.
 */
export default function HeroOfTheDay() {
  const [dayOffset, setDayOffset] = useState(0);

  const { data, isLoading, error } = trpc.public.characterOfTheDay.get.useQuery(
    { dayOffset },
    { keepPreviousData: true }
  );

  const goToPrevDay = () => setDayOffset((prev) => prev - 1);
  const goToNextDay = () => setDayOffset((prev) => prev + 1);
  const goToToday = () => setDayOffset(0);

  // Format the date label
  const getDateLabel = () => {
    if (dayOffset === 0) return "Today";
    if (dayOffset === -1) return "Yesterday";
    if (dayOffset === 1) return "Tomorrow";
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (isLoading && !data) {
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
  const isVillain = nameHash % 3 === 0;

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

        {/* Day navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={goToPrevDay}
            className="group flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
            style={{
              border: "2px solid #f97316",
              background: "rgba(249, 115, 22, 0.15)",
            }}
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: "#39ff14" }} />
          </button>

          <button
            onClick={goToToday}
            className="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide transition-all hover:scale-105 min-w-[120px]"
            style={{
              border: "2px solid #f97316",
              background: dayOffset === 0 ? "rgba(57, 255, 20, 0.15)" : "rgba(249, 115, 22, 0.1)",
              color: "#39ff14",
              textShadow: "0 0 8px rgba(57,255,20,0.3)",
            }}
          >
            {getDateLabel()}
          </button>

          <button
            onClick={goToNextDay}
            className="group flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
            style={{
              border: "2px solid #f97316",
              background: "rgba(249, 115, 22, 0.15)",
            }}
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: "#39ff14" }} />
          </button>
        </div>

        {/* Card display */}
        <div className="max-w-4xl mx-auto relative">
          {/* Loading overlay when switching days */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-green-400" />
            </div>
          )}

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
                      style={{ color: "#39ff14" }}
                    >
                      HEROES & VILLAINS OF THE DAY
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

          {/* Mobile-friendly prev/next arrows on the card itself */}
          <button
            onClick={goToPrevDay}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 md:hidden"
            style={{
              border: "2px solid #f97316",
              background: "rgba(0,0,0,0.7)",
            }}
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: "#39ff14" }} />
          </button>
          <button
            onClick={goToNextDay}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 md:hidden"
            style={{
              border: "2px solid #f97316",
              background: "rgba(0,0,0,0.7)",
            }}
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5" style={{ color: "#39ff14" }} />
          </button>
        </div>

        {/* Back to today hint */}
        {dayOffset !== 0 && (
          <div className="text-center mt-4">
            <button
              onClick={goToToday}
              className="text-xs font-medium transition-colors hover:underline"
              style={{ color: "#f97316" }}
            >
              ← Back to Today's Pick
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
