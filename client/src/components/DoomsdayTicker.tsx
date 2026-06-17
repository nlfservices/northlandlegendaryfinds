/**
 * DoomsdayTicker — Cinematic full-width countdown bar.
 * Dramatic dark design with animated energy particles, glowing flip-style digits,
 * scanline texture, and a pulsing red/green Doom aesthetic.
 */

import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Link } from "wouter";

const DOOMSDAY_DATE = "2026-12-18T00:00:00Z";

function getMonthsAndDays(targetDateUtc: string) {
  const now = new Date();
  const target = new Date(targetDateUtc);
  if (target <= now) return { months: 0, remainingDays: 0 };
  let months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());
  if (now.getDate() > target.getDate()) months -= 1;
  const afterMonths = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
  const remainingDays = Math.floor(
    (target.getTime() - afterMonths.getTime()) / (1000 * 60 * 60 * 24)
  );
  return { months: Math.max(0, months), remainingDays: Math.max(0, remainingDays) };
}

/** Animated particle canvas — floating embers/energy dots */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    }[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5,
      size: 0.8 + Math.random() * 1.6,
      alpha: 0.3 + Math.random() * 0.6,
      color: Math.random() > 0.6 ? "#22c55e" : Math.random() > 0.5 ? "#ef4444" : "#fbbf24",
    }));

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.002;
        if (p.y < -2 || p.alpha <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 2;
          p.alpha = 0.3 + Math.random() * 0.6;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = -0.3 - Math.random() * 0.5;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/** Glowing digit block */
function DigitBlock({ value, label, color = "green" }: { value: number; label: string; color?: "green" | "red" | "gold" }) {
  const display = String(value).padStart(2, "0");
  const colors = {
    green: { border: "rgba(34,197,94,0.4)", glow: "rgba(34,197,94,0.6)", text: "#4ade80" },
    red:   { border: "rgba(239,68,68,0.4)",  glow: "rgba(239,68,68,0.5)",  text: "#f87171" },
    gold:  { border: "rgba(251,191,36,0.4)", glow: "rgba(251,191,36,0.5)", text: "#fbbf24" },
  }[color];

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "clamp(36px, 5vw, 56px)",
          height: "clamp(36px, 5vw, 56px)",
          background: "linear-gradient(160deg, #0a0a0a 0%, #111 100%)",
          border: `1px solid ${colors.border}`,
          borderRadius: "6px",
          boxShadow: `0 0 12px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          }}
        />
        {/* Center split line */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-black/50 z-10" />
        <span
          className="relative z-20 font-black tabular-nums leading-none"
          style={{
            fontFamily: "'Anton', 'Impact', sans-serif",
            fontSize: "clamp(16px, 2.8vw, 28px)",
            color: colors.text,
            textShadow: `0 0 12px ${colors.glow}`,
          }}
        >
          {display}
        </span>
      </div>
      <span
        className="font-bold tracking-widest uppercase"
        style={{ fontSize: "clamp(7px, 0.9vw, 10px)", color: colors.text, opacity: 0.7 }}
      >
        {label}
      </span>
    </div>
  );
}

function Separator({ color = "green" }: { color?: "green" | "red" }) {
  return (
    <div
      className="flex flex-col items-center gap-1 self-start"
      style={{ marginTop: "clamp(8px, 1.2vw, 14px)" }}
    >
      <div className="w-1 h-1 rounded-full" style={{ background: color === "green" ? "#22c55e" : "#ef4444", opacity: 0.7 }} />
      <div className="w-1 h-1 rounded-full" style={{ background: color === "green" ? "#22c55e" : "#ef4444", opacity: 0.7 }} />
    </div>
  );
}

export default function DoomsdayTicker() {
  const countdown = useLaunchCountdown(DOOMSDAY_DATE);
  const { months, remainingDays } = getMonthsAndDays(DOOMSDAY_DATE);
  const [dismissed, setDismissed] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Pulse every second on the seconds digit change
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 120);
    return () => clearTimeout(t);
  }, [countdown.seconds]);

  if (dismissed || countdown.isLaunched) return null;

  return (
    <div className="sticky top-0 z-50 w-full">
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #000 0%, #0a0a0a 20%, #0d1117 50%, #0a0a0a 80%, #000 100%)",
          borderBottom: "1px solid rgba(34,197,94,0.2)",
          borderTop: "1px solid rgba(239,68,68,0.15)",
          minHeight: "clamp(56px, 7vw, 72px)",
        }}
      >
        {/* Animated particles */}
        <ParticleCanvas />

        {/* Left red accent stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: "linear-gradient(180deg, #ef4444 0%, #7f1d1d 100%)", opacity: 0.8 }}
        />
        {/* Right green accent stripe */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1"
          style={{ background: "linear-gradient(180deg, #22c55e 0%, #14532d 100%)", opacity: 0.8 }}
        />

        {/* Top edge glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #ef4444 20%, #22c55e 80%, transparent)" }}
        />
        {/* Bottom edge glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgba(34,197,94,${pulse ? "0.8" : "0.4"}) 50%, transparent)`, transition: "all 0.1s" }}
        />

        {/* Pulse flash on seconds tick */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(34,197,94,0.06) 0%, transparent 70%)",
            opacity: pulse ? 1 : 0,
            transition: "opacity 0.1s",
          }}
        />

        {/* Content */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-5 md:gap-7 px-8 h-full" style={{ minHeight: "inherit" }}>

          {/* DOOM badge */}
          <Link href="/doomsday" className="flex-shrink-0 flex items-center gap-2 group">
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded"
              style={{
                background: "linear-gradient(135deg, #1a0000 0%, #2d0000 100%)",
                border: "1px solid rgba(239,68,68,0.4)",
                boxShadow: "0 0 10px rgba(239,68,68,0.2)",
              }}
            >
              <span style={{ fontSize: "14px" }}>⚡</span>
              <span
                className="font-black uppercase tracking-wider text-red-400"
                style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(9px, 1.2vw, 12px)" }}
              >
                DOOMSDAY
              </span>
            </div>
            <span className="sm:hidden text-red-400 font-black text-xs" style={{ fontFamily: "'Anton', sans-serif" }}>⚡</span>
          </Link>

          {/* Vertical divider */}
          <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-green-500/30 to-transparent" />

          {/* AVENGERS: DOOMSDAY label */}
          <Link href="/doomsday" className="hidden md:block flex-shrink-0 group">
            <span
              className="font-black uppercase tracking-widest group-hover:text-green-300 transition-colors"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(10px, 1.4vw, 14px)",
                background: "linear-gradient(90deg, #4ade80, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AVENGERS: DOOMSDAY
            </span>
          </Link>

          {/* Vertical divider */}
          <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-green-500/30 to-transparent" />

          {/* Countdown digits */}
          <Link href="/doomsday" className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <DigitBlock value={months} label="MO" color="green" />
            <Separator color="green" />
            <DigitBlock value={remainingDays} label="D" color="green" />
            <Separator color="green" />
            <DigitBlock value={countdown.hours} label="H" color="green" />
            <Separator color="green" />
            <DigitBlock value={countdown.minutes} label="M" color="green" />
            <Separator color="green" />
            <DigitBlock value={countdown.seconds} label="S" color="red" />
          </Link>

          {/* Vertical divider */}
          <div className="hidden lg:block w-px h-8 bg-gradient-to-b from-transparent via-green-500/30 to-transparent" />

          {/* Dec 18 2026 label */}
          <div className="hidden lg:flex flex-col items-start flex-shrink-0">
            <span className="text-gray-400 font-medium" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
              DEC 18, 2026
            </span>
            <span className="text-gray-600" style={{ fontSize: "9px" }}>
              RDJ as Doctor Doom
            </span>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-white transition-colors z-10 rounded"
            aria-label="Dismiss countdown"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
