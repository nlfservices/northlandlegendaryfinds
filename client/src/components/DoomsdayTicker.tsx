/**
 * DoomsdayTicker — Sticky countdown bar with Doctor Doom lightning/electrical effects.
 * Shows a compact, always-visible countdown to Avengers: Doomsday (Dec 18, 2026).
 * Features animated SVG lightning bolts, crackling energy, and electrical glow.
 */

import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import { useState, useEffect, useCallback } from "react";
import { Zap, X, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const DOOMSDAY_DATE = "2026-12-18T00:00:00Z";

/** Generates a random jagged lightning bolt SVG path */
function generateBoltPath(startX: number, startY: number, endX: number, endY: number, segments: number = 6): string {
  const dx = (endX - startX) / segments;
  const dy = (endY - startY) / segments;
  let path = `M ${startX} ${startY}`;
  for (let i = 1; i < segments; i++) {
    const jitterX = (Math.random() - 0.5) * 20;
    const jitterY = (Math.random() - 0.5) * 4;
    path += ` L ${startX + dx * i + jitterX} ${startY + dy * i + jitterY}`;
  }
  path += ` L ${endX} ${endY}`;
  return path;
}

/** Animated lightning bolt that randomly appears and fades */
function LightningBolt({ side }: { side: "left" | "right" }) {
  const [bolts, setBolts] = useState<{ id: number; path: string; opacity: number }[]>([]);

  const spawnBolt = useCallback(() => {
    const startX = side === "left" ? 0 : 200;
    const endX = side === "left" ? 180 + Math.random() * 60 : Math.random() * 60;
    const startY = Math.random() * 36;
    const endY = Math.random() * 36;
    const path = generateBoltPath(startX, startY, endX, endY, 5 + Math.floor(Math.random() * 4));
    const id = Date.now() + Math.random();
    setBolts(prev => [...prev.slice(-2), { id, path, opacity: 0.6 + Math.random() * 0.4 }]);
    setTimeout(() => {
      setBolts(prev => prev.filter(b => b.id !== id));
    }, 150 + Math.random() * 200);
  }, [side]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.55) spawnBolt();
    }, 800 + Math.random() * 1200);
    return () => clearInterval(interval);
  }, [spawnBolt]);

  return (
    <svg
      className={`absolute top-0 ${side === "left" ? "left-0" : "right-0"} h-full pointer-events-none`}
      width="260"
      height="36"
      viewBox="0 0 260 36"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      {bolts.map(bolt => (
        <g key={bolt.id}>
          {/* Outer glow */}
          <path
            d={bolt.path}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            opacity={bolt.opacity * 0.3}
            filter="url(#bolt-glow)"
          />
          {/* Core bolt */}
          <path
            d={bolt.path}
            fill="none"
            stroke="#4ade80"
            strokeWidth="1.5"
            opacity={bolt.opacity}
            strokeLinecap="round"
          />
          {/* Bright center */}
          <path
            d={bolt.path}
            fill="none"
            stroke="#bbf7d0"
            strokeWidth="0.5"
            opacity={bolt.opacity}
            strokeLinecap="round"
          />
        </g>
      ))}
      <defs>
        <filter id="bolt-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/** Small sparks that crackle around the countdown numbers */
function ElectricalSparks() {
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSparks = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => ({
        id: Date.now() + Math.random(),
        x: 20 + Math.random() * 60,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
      }));
      setSparks(prev => [...prev.slice(-6), ...newSparks]);
      setTimeout(() => {
        setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
      }, 100 + Math.random() * 150);
    }, 400 + Math.random() * 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="absolute rounded-full"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: spark.size,
            height: spark.size,
            backgroundColor: "#4ade80",
            boxShadow: `0 0 ${spark.size * 3}px ${spark.size}px rgba(74, 222, 128, 0.8)`,
          }}
        />
      ))}
    </div>
  );
}

function TickerUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-0.5 relative">
      <span
        className="text-sm sm:text-base md:text-lg font-bold text-white tabular-nums drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]"
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
  const [flash, setFlash] = useState(false);

  // Random full-bar flash effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
      }
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed || countdown.isLaunched) return null;

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="relative overflow-hidden border-b border-green-500/30"
        style={{
          background: "linear-gradient(90deg, #000 0%, #052e16 30%, #14532d 50%, #052e16 70%, #000 100%)",
        }}
      >
        {/* Electrical energy background — pulsing */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/8 to-transparent animate-pulse" />

        {/* Flash overlay on random lightning strikes */}
        {flash && (
          <div className="absolute inset-0 bg-green-400/10 transition-opacity duration-75" />
        )}

        {/* Lightning bolts on both sides */}
        <LightningBolt side="left" />
        <LightningBolt side="right" />

        {/* Electrical sparks around the content */}
        <ElectricalSparks />

        {/* Crackling edge lines — top */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-green-400/60 to-transparent animate-pulse" />
        </div>

        <div className="relative flex items-center justify-center gap-2 sm:gap-4 px-3 py-1.5 sm:py-2">
          {/* Zap icon + Title — links to MCU News */}
          <Link href="/mcu-news" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 shrink-0 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)] group-hover:drop-shadow-[0_0_12px_rgba(74,222,128,1)]" />
            <span
              className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-green-400 font-bold hidden sm:inline drop-shadow-[0_0_4px_rgba(74,222,128,0.4)]"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              Avengers: Doomsday
            </span>
            <span
              className="text-[10px] uppercase tracking-wider text-green-400 font-bold sm:hidden drop-shadow-[0_0_4px_rgba(74,222,128,0.4)]"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              Doomsday
            </span>
          </Link>

          {/* Separator — electrified */}
          <div className="w-px h-4 bg-green-400/40 hidden sm:block shadow-[0_0_4px_rgba(74,222,128,0.5)]" />

          {/* Countdown units — links to MCU News */}
          <Link href="/mcu-news" className="flex items-center gap-1.5 sm:gap-2.5 hover:opacity-80 transition-opacity relative">
            <TickerUnit value={countdown.days} label="D" />
            <span className="text-green-400/60 text-xs font-light drop-shadow-[0_0_3px_rgba(74,222,128,0.4)]">:</span>
            <TickerUnit value={countdown.hours} label="H" />
            <span className="text-green-400/60 text-xs font-light drop-shadow-[0_0_3px_rgba(74,222,128,0.4)]">:</span>
            <TickerUnit value={countdown.minutes} label="M" />
            <span className="text-green-400/60 text-xs font-light drop-shadow-[0_0_3px_rgba(74,222,128,0.4)]">:</span>
            <TickerUnit value={countdown.seconds} label="S" />
          </Link>

          {/* Separator — electrified */}
          <div className="w-px h-4 bg-green-400/40 hidden md:block shadow-[0_0_4px_rgba(74,222,128,0.5)]" />

          {/* CTA link — desktop only */}
          <Link href="/mcu-news" className="hidden md:flex items-center gap-1 text-[10px] sm:text-xs text-green-400/70 hover:text-green-300 transition-colors group">
            <span className="drop-shadow-[0_0_3px_rgba(74,222,128,0.3)]">MCU News</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors z-10"
            aria-label="Dismiss countdown"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* Bottom edge glow line — crackling */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-green-400/60 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
