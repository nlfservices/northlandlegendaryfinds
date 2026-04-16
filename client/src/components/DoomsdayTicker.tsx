/**
 * DoomsdayTicker — Sticky countdown bar that follows the user on the homepage.
 * Shows a compact, always-visible countdown to Avengers: Doomsday (Dec 18, 2026).
 * Appears below the main navigation and sticks to the top on scroll.
 */

import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import { useState } from "react";
import { Flame, X } from "lucide-react";

const DOOMSDAY_DATE = "2026-12-18T00:00:00Z";

function TickerUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-0.5">
      <span
        className="text-sm sm:text-base md:text-lg font-bold text-white tabular-nums"
        style={{ fontFamily: "'Anton', sans-serif" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-green-300/80 font-medium">
        {label}
      </span>
    </div>
  );
}

export default function DoomsdayTicker() {
  const countdown = useLaunchCountdown(DOOMSDAY_DATE);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || countdown.isLaunched) return null;

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-green-950/90 to-black border-b border-green-500/30">
        {/* Animated pulse glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent animate-pulse" />

        <div className="relative flex items-center justify-center gap-2 sm:gap-4 px-3 py-1.5 sm:py-2">
          {/* Flame icon */}
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 shrink-0 animate-pulse" />

          {/* Title */}
          <span
            className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-green-400 font-bold hidden sm:inline"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            Avengers: Doomsday
          </span>
          <span
            className="text-[10px] uppercase tracking-wider text-green-400 font-bold sm:hidden"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            Doomsday
          </span>

          {/* Separator */}
          <div className="w-px h-4 bg-green-500/30 hidden sm:block" />

          {/* Countdown units */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <TickerUnit value={countdown.days} label="D" />
            <span className="text-green-500/50 text-xs font-light">:</span>
            <TickerUnit value={countdown.hours} label="H" />
            <span className="text-green-500/50 text-xs font-light">:</span>
            <TickerUnit value={countdown.minutes} label="M" />
            <span className="text-green-500/50 text-xs font-light">:</span>
            <TickerUnit value={countdown.seconds} label="S" />
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-green-500/30 hidden md:block" />

          {/* CTA text — desktop only */}
          <span className="text-[10px] sm:text-xs text-gray-400 hidden md:inline">
            Dec 18, 2026
          </span>

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors"
            aria-label="Dismiss countdown"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* Bottom edge glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      </div>
    </div>
  );
}
