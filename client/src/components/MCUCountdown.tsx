/**
 * MCU Countdown Section â€” Cinematic Doomsday countdown with Star Wars hyperspace intro
 * Primary: Avengers: Doomsday (December 18, 2026)
 * Secondary: Spider-Man: Brand New Day (July 31, 2026)
 */

import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DOOMSDAY_DATE = "2026-12-18T00:00:00Z";
const SPIDERMAN_DATE = "2026-07-31T00:00:00Z";
const COUNTDOWN_BG = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-section-bg-BjSMCi7WHT8WWJNCqKkRAi.webp";

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

/** Flip-card style digit block matching the screenshot */
function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          width: "clamp(64px, 10vw, 110px)",
          height: "clamp(64px, 10vw, 110px)",
          background: "linear-gradient(160deg, #0d1a0d 0%, #030a03 100%)",
          border: "1px solid rgba(34,197,94,0.25)",
          boxShadow: "0 0 24px rgba(34,197,94,0.12), inset 0 1px 0 rgba(34,197,94,0.08)",
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(34,197,94,0.3) 19px,rgba(34,197,94,0.3) 20px), repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(34,197,94,0.3) 19px,rgba(34,197,94,0.3) 20px)",
          }}
        />
        {/* Center divider line */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-black/60 z-10" />
        <span
          className="relative z-20 text-white font-black tabular-nums leading-none"
          style={{
            fontFamily: "'Anton', 'Impact', sans-serif",
            fontSize: "clamp(28px, 5.5vw, 58px)",
            textShadow: "0 0 20px rgba(34,197,94,0.4)",
          }}
        >
          {display}
        </span>
      </div>
      <span
        className="text-green-400 font-bold tracking-widest uppercase"
        style={{ fontSize: "clamp(9px, 1.2vw, 13px)" }}
      >
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 self-start mt-4" style={{ paddingTop: "clamp(12px, 2vw, 24px)" }}>
      <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
      <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
    </div>
  );
}

/** Star Wars hyperspace canvas */
function HyperspaceCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const stars: { x: number; y: number; z: number; pz: number }[] = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * canvas.width,
      y: (Math.random() - 0.5) * canvas.height,
      z: Math.random() * canvas.width,
      pz: 0,
    }));

    let frame = 0;
    const maxFrames = 90; // ~1.5s at 60fps

    function draw() {
      if (!ctx || !canvas) return;
      const progress = Math.min(frame / maxFrames, 1);
      const speed = 20 + progress * 60;

      ctx.fillStyle = `rgba(0,0,0,${0.3 + progress * 0.4})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.pz = star.z;
        star.z -= speed;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
          star.z = canvas.width;
          star.pz = star.z;
        }
        const sx = (star.x / star.z) * canvas.width + cx;
        const sy = (star.y / star.z) * canvas.height + cy;
        const px = (star.x / star.pz) * canvas.width + cx;
        const py = (star.y / star.pz) * canvas.height + cy;
        const size = Math.max(0.5, (1 - star.z / canvas.width) * 3);
        const alpha = Math.min(1, (1 - star.z / canvas.width) * 2);
        ctx.strokeStyle = `rgba(180,255,180,${alpha * 0.9})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      frame++;
      if (frame < maxFrames + 20) {
        animRef.current = requestAnimationFrame(draw);
      }
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 0.6s ease",
        zIndex: 5,
      }}
    />
  );
}

export default function MCUCountdown() {
  const doomsday = useLaunchCountdown(DOOMSDAY_DATE);
  const spiderman = useLaunchCountdown(SPIDERMAN_DATE);
  const { months, remainingDays } = getMonthsAndDays(DOOMSDAY_DATE);

  const sectionRef = useRef<HTMLElement>(null);
  const [hyperactive, setHyperactive] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);

  // Trigger hyperspace when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          setHyperactive(true);
          // After hyperspace, reveal the countdown
          setTimeout(() => {
            setRevealed(true);
            setHyperactive(false);
          }, 1800);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 lg:py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img src={COUNTDOWN_BG} alt="" className="w-full h-full object-cover opacity-25" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-black/95 to-background" />
        {/* Green vein texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Hyperspace canvas */}
      <HyperspaceCanvas active={hyperactive} />

      <div
        className="container relative z-10"
        style={{
          opacity: revealed || !hyperactive ? 1 : 0,
          transform: revealed ? "none" : hyperactive ? "scale(0.95)" : "none",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* ===== TITLE ===== */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-green-400 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-3">
            âš¡ MARVEL CINEMATIC UNIVERSE
          </p>
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-2"
            style={{
              fontFamily: "'Anton', 'Impact', sans-serif",
              letterSpacing: "-0.02em",
              textShadow: "0 0 60px rgba(34,197,94,0.3)",
            }}
          >
            <span className="text-green-400">AVENGERS:</span>
          </h2>
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-6"
            style={{
              fontFamily: "'Anton', 'Impact', sans-serif",
              letterSpacing: "-0.02em",
              color: "white",
              textShadow: "0 0 60px rgba(255,255,255,0.1)",
            }}
          >
            DOOMSDAY
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            December 18, 2026 &nbsp;Â·&nbsp; Robert Downey Jr. as Doctor Doom &nbsp;Â·&nbsp; Directed by the Russo Brothers
          </p>
        </div>

        {/* ===== FLIP COUNTDOWN ===== */}
        <div className="flex items-start justify-center gap-2 sm:gap-3 md:gap-5 mb-10 sm:mb-14">
          <FlipDigit value={months} label="Months" />
          <Colon />
          <FlipDigit value={remainingDays} label="Days" />
          <Colon />
          <FlipDigit value={doomsday.hours} label="Hours" />
          <Colon />
          <FlipDigit value={doomsday.minutes} label="Min" />
          <Colon />
          <FlipDigit value={doomsday.seconds} label="Sec" />
        </div>

        {/* ===== CTAs ===== */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link href="/doomsday">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-400 text-black font-black text-base px-8 rounded-none uppercase tracking-wider w-full sm:w-auto"
            >
              Full Doomsday Intel
            </Button>
          </Link>
          <a href="https://riseofdoom.com" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-bold text-base px-8 rounded-none uppercase tracking-wider w-full sm:w-auto"
            >
              Browse Doom Cards
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>

        {/* ===== SECONDARY: Spider-Man ===== */}
        <div className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 border border-blue-500/20 rounded-xl px-5 py-4 backdrop-blur-sm">
            <div>
              <p className="text-blue-400 font-bold text-sm uppercase tracking-wider">
                ðŸ•· Spider-Man: Brand New Day
              </p>
              <p className="text-gray-500 text-xs mt-0.5">July 31, 2026</p>
            </div>
            {!spiderman.isLaunched ? (
              <div className="flex items-center gap-2 text-blue-300 font-bold tabular-nums text-sm sm:text-base" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span>{String(spiderman.days).padStart(3, "0")}D</span>
                <span className="text-blue-500/40">:</span>
                <span>{String(spiderman.hours).padStart(2, "0")}H</span>
                <span className="text-blue-500/40">:</span>
                <span>{String(spiderman.minutes).padStart(2, "0")}M</span>
                <span className="text-blue-500/40">:</span>
                <span>{String(spiderman.seconds).padStart(2, "0")}S</span>
              </div>
            ) : (
              <span className="text-blue-400 font-bold text-sm uppercase">Now in Theaters</span>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-6">
          Release dates subject to change Â· Start collecting now so you're ready when the movies drop
        </p>
      </div>
    </section>
  );
}

