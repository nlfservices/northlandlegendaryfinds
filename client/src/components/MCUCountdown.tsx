/**
 * MCU Countdown Section — Dual countdown for upcoming Marvel movies
 * Primary: Avengers: Doomsday (December 18, 2026)
 * Secondary: Spider-Man: Brand New Day (July 31, 2026)
 */

import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Film, Ticket, ArrowRight, Flame } from "lucide-react";

// Release dates (UTC)
const DOOMSDAY_DATE = "2026-12-18T00:00:00Z";
const SPIDERMAN_DATE = "2026-07-31T00:00:00Z";

// Background image
const COUNTDOWN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-section-bg-BjSMCi7WHT8WWJNCqKkRAi.webp";

function CountdownUnit({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm border ${color} shadow-lg`}>
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tabular-nums" style={{ fontFamily: "'Anton', sans-serif" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">{label}</span>
    </div>
  );
}

function MiniCountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm border border-blue-500/30">
        <span className="text-base sm:text-lg font-bold text-blue-300 tabular-nums" style={{ fontFamily: "'Anton', sans-serif" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-500 mt-1">{label}</span>
    </div>
  );
}

export default function MCUCountdown() {
  const doomsday = useLaunchCountdown(DOOMSDAY_DATE);
  const spiderman = useLaunchCountdown(SPIDERMAN_DATE);

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={COUNTDOWN_BG} alt="" className="w-full h-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-black/90 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent" />
      </div>

      {/* Animated accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full mb-4">
            <Film className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-bold tracking-wide">MCU INCOMING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            THE <span className="text-primary">COUNTDOWN</span> IS ON
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Two massive Marvel movies are heading to theaters. Get your collection ready before the hype hits.
          </p>
        </div>

        {/* ===== PRIMARY: Avengers Doomsday ===== */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="relative bg-card/40 backdrop-blur-md border border-green-500/20 rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-green-500/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Movie title */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 sm:mb-8">
                <div className="w-12 h-12 bg-green-500/15 border border-green-500/30 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                    <span className="text-green-400">AVENGERS:</span>{" "}
                    <span className="text-white">DOOMSDAY</span>
                  </h3>
                  <p className="text-sm text-gray-400">
                    December 18, 2026 &middot; Robert Downey Jr. as Doctor Doom
                  </p>
                </div>
              </div>

              {/* Countdown */}
              {!doomsday.isLaunched ? (
                <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                  <CountdownUnit value={doomsday.days} label="Days" color="border-green-500/30" />
                  <div className="flex items-center text-green-500/50 text-2xl font-bold self-start mt-5 sm:mt-6 md:mt-7">:</div>
                  <CountdownUnit value={doomsday.hours} label="Hours" color="border-green-500/20" />
                  <div className="flex items-center text-green-500/50 text-2xl font-bold self-start mt-5 sm:mt-6 md:mt-7">:</div>
                  <CountdownUnit value={doomsday.minutes} label="Min" color="border-green-500/20" />
                  <div className="flex items-center text-green-500/50 text-2xl font-bold self-start mt-5 sm:mt-6 md:mt-7">:</div>
                  <CountdownUnit value={doomsday.seconds} label="Sec" color="border-green-500/20" />
                </div>
              ) : (
                <div className="text-center mb-8">
                  <p className="text-3xl font-bold text-green-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                    NOW IN THEATERS
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/doomsday">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold w-full sm:w-auto">
                    <Ticket className="w-5 h-5 mr-2" />
                    Explore Doomsday Intel
                  </Button>
                </Link>
                <Link href="/characters">
                  <Button size="lg" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10 font-bold w-full sm:w-auto">
                    Browse Characters
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SECONDARY: Spider-Man Brand New Day ===== */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-card/30 backdrop-blur-sm border border-blue-500/15 rounded-xl p-5 sm:p-6 overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Movie info */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/30 rounded-lg flex items-center justify-center">
                    <Film className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      <span className="text-blue-400">SPIDER-MAN:</span>{" "}
                      <span className="text-white">BRAND NEW DAY</span>
                    </h4>
                    <p className="text-xs text-gray-500">July 31, 2026</p>
                  </div>
                </div>

                {/* Mini countdown */}
                <div className="flex items-center gap-2">
                  {!spiderman.isLaunched ? (
                    <>
                      <MiniCountdownUnit value={spiderman.days} label="Days" />
                      <span className="text-blue-500/40 font-bold mt-[-12px]">:</span>
                      <MiniCountdownUnit value={spiderman.hours} label="Hrs" />
                      <span className="text-blue-500/40 font-bold mt-[-12px]">:</span>
                      <MiniCountdownUnit value={spiderman.minutes} label="Min" />
                      <span className="text-blue-500/40 font-bold mt-[-12px]">:</span>
                      <MiniCountdownUnit value={spiderman.seconds} label="Sec" />
                    </>
                  ) : (
                    <span className="text-blue-400 font-bold text-sm" style={{ fontFamily: "'Anton', sans-serif" }}>
                      NOW IN THEATERS
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          Release dates subject to change &middot; Start collecting now so you're ready when the movies drop
        </p>
      </div>
    </section>
  );
}
