/**
 * Doomsday Countdown Page — /doomsday
 * Dedicated cinematic countdown to Avengers: Doomsday (Dec 18, 2026)
 * with collector context and Spider-Man: Brand New Day secondary timer.
 */

import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Film,
  Ticket,
  ArrowRight,
  Flame,
  Shield,
  Star,
  Users,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import SEO from "@/components/SEO";

const DOOMSDAY_DATE = "2026-12-18T00:00:00Z";
const SPIDERMAN_DATE = "2026-07-31T00:00:00Z";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-countdown-hero-bg-ZUzWAXtQmXgxuxPRmaHfh6.webp";

const CONFIRMED_DETAILS = [
  { icon: Film, label: "Director", value: "Anthony & Joe Russo" },
  { icon: Star, label: "Doctor Doom", value: "Robert Downey Jr." },
  { icon: Users, label: "Release", value: "December 18, 2026" },
  { icon: Shield, label: "Studio", value: "Marvel Studios" },
];

const COLLECTOR_ANGLES = [
  {
    title: "Doctor Doom Cards",
    desc: "RDJ stepping into Doom is the biggest MCU casting news in years. Numbered Doom cards are already moving.",
    href: "https://riseofdoom.com",
  },
  {
    title: "Fantastic Four Connection",
    desc: "The Fantastic Four are central to Doomsday's story. Reed Richards, Sue Storm, and the team are all in play.",
    href: "/marvel-characters",
  },
  {
    title: "The Avengers Roster",
    desc: "Every Avenger on screen means every Avenger card gets a spotlight. Now is the time to build your set.",
    href: "/marvel-characters",
  },
];

function CountdownDigit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-xl scale-110" />
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 flex items-center justify-center rounded-2xl bg-black/80 border border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <span
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tabular-nums tracking-tight"
            style={{ fontFamily: "'Anton', sans-serif", textShadow: "0 0 20px rgba(34,197,94,0.4)" }}
          >
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-green-400/80 font-semibold">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col items-center gap-2 self-start mt-8 sm:mt-10 md:mt-12 lg:mt-14">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
      <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
    </div>
  );
}

function MiniDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-black/60 border border-blue-500/30">
        <span
          className="text-lg sm:text-xl font-bold text-blue-300 tabular-nums"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </span>
    </div>
  );
}

function getMonthsAndDays(targetDateUtc: string) {
  const now = new Date();
  const target = new Date(targetDateUtc);
  if (target <= now) return { months: 0, remainingDays: 0 };
  let months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());
  const dayOfMonth = now.getDate();
  const targetDay = target.getDate();
  if (dayOfMonth > targetDay) months -= 1;
  const afterMonths = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
  const remainingDays = Math.floor(
    (target.getTime() - afterMonths.getTime()) / (1000 * 60 * 60 * 24)
  );
  return { months: Math.max(0, months), remainingDays: Math.max(0, remainingDays) };
}

export default function DoomsdayCountdown() {
  const doomsday = useLaunchCountdown(DOOMSDAY_DATE);
  const spiderman = useLaunchCountdown(SPIDERMAN_DATE);
  const { months: doomMonths, remainingDays: doomRemainingDays } = getMonthsAndDays(DOOMSDAY_DATE);

  return (
    <>
      <SEO
        title="Avengers: Doomsday Countdown | Northland Legendary Finds"
        description={`Live countdown to Avengers: Doomsday — December 18, 2026. ${doomsday.days} days remaining. Robert Downey Jr. as Doctor Doom. Track the MCU's biggest event with NLF.`}
        path="/doomsday"
      />

      <div className="min-h-screen bg-black">

        {/* ===== STOCK TICKER BAR ===== */}
        <div className="sticky top-[80px] z-40 bg-black border-y border-green-500/30 overflow-hidden">
          <div className="flex items-center">
            {/* Label badge */}
            <div className="flex-shrink-0 bg-green-500 text-black text-[11px] font-black tracking-widest uppercase px-3 py-2 z-10">
              DOOMSDAY
            </div>
            {/* Scrolling ticker */}
            <div className="flex-1 overflow-hidden relative">
              <div
                className="flex items-center gap-0 whitespace-nowrap"
                style={{
                  animation: "nlf-ticker-scroll 40s linear infinite",
                }}
              >
                {[0, 1].map((copy) => (
                  <span key={copy} className="inline-flex items-center gap-6 pr-6">
                    <span className="text-green-400 text-xs font-bold tracking-wider">
                      ⚡ AVENGERS: DOOMSDAY
                    </span>
                    <span className="text-gray-400 text-xs">DEC 18, 2026</span>
                    <span className="text-green-500/40">|</span>
                    <span className="text-white text-xs font-semibold">
                      {doomMonths}M {doomRemainingDays}D {String(doomsday.hours).padStart(2,"0")}H {String(doomsday.minutes).padStart(2,"0")}M {String(doomsday.seconds).padStart(2,"0")}S
                    </span>
                    <span className="text-green-500/40">|</span>
                    <span className="text-gray-400 text-xs">🎬 DIRECTED BY THE RUSSO BROTHERS</span>
                    <span className="text-green-500/40">|</span>
                    <span className="text-yellow-400 text-xs font-semibold">★ RDJ AS DOCTOR DOOM</span>
                    <span className="text-green-500/40">|</span>
                    <span className="text-gray-400 text-xs">🕷 SPIDER-MAN: BRAND NEW DAY — JUL 31, 2026</span>
                    <span className="text-green-500/40">|</span>
                    <span className="text-blue-400 text-xs font-semibold">
                      {String(spiderman.days).padStart(3,"0")}D {String(spiderman.hours).padStart(2,"0")}H {String(spiderman.minutes).padStart(2,"0")}M AWAY
                    </span>
                    <span className="text-green-500/40">|</span>
                    <span className="text-gray-400 text-xs">🃏 NUMBERED TOPPS MARVEL CARDS — LIMITED FOREVER</span>
                    <span className="text-green-500/40">|</span>
                    <span className="text-green-400 text-xs font-semibold">NORTHLANDLEGENDARYFINDS.COM</span>
                    <span className="text-green-500/40 pr-8">|</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <style>{`
            @keyframes nlf-ticker-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        {/* ===== HERO — Full cinematic countdown ===== */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={HERO_BG}
              alt=""
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
            {/* Green radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(34,197,94,0.08),transparent)]" />
          </div>

          {/* Animated scan lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)" }}
          />

          <div className="relative z-10 container text-center px-4 py-24">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full mb-6 sm:mb-8">
              <Flame className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-green-400 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase">
                MCU Phase 6 — Live Countdown
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none mb-2 sm:mb-4"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.02em" }}
            >
              <span className="text-green-400">AVENGERS:</span>
            </h1>
            <h1
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none mb-6 sm:mb-10"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.02em" }}
            >
              DOOMSDAY
            </h1>

            {/* Countdown */}
            {!doomsday.isLaunched ? (
              <div className="flex flex-col items-center gap-4 mb-8 sm:mb-12">
                <div className="flex items-start justify-center gap-2 sm:gap-4 md:gap-6">
                  <CountdownDigit value={doomMonths} label="Months" />
                  <Separator />
                  <CountdownDigit value={doomRemainingDays} label="Days" />
                  <Separator />
                  <CountdownDigit value={doomsday.hours} label="Hours" />
                  <Separator />
                  <CountdownDigit value={doomsday.minutes} label="Min" />
                  <Separator />
                  <CountdownDigit value={doomsday.seconds} label="Sec" />
                </div>
              </div>
            ) : (
              <div className="mb-12">
                <p
                  className="text-5xl font-black text-green-400"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  NOW IN THEATERS
                </p>
              </div>
            )}

            {/* Release info */}
            <p className="text-gray-400 text-base sm:text-lg mb-2">
              December 18, 2026 &middot; Directed by the Russo Brothers
            </p>
            <p className="text-green-400/80 text-sm sm:text-base font-semibold mb-8 sm:mb-10">
              Robert Downey Jr. returns as Victor von Doom
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://riseofdoom.com" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-400 text-black font-bold text-base px-8 w-full sm:w-auto"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Browse Doom Cards
                </Button>
              </a>
              <Link href="/mcu-news">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-bold text-base px-8 w-full sm:w-auto"
                >
                  MCU News
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-green-500/60 to-transparent" />
          </div>
        </section>

        {/* ===== CONFIRMED DETAILS ===== */}
        <section className="py-16 sm:py-20 border-t border-green-500/10">
          <div className="container">
            <div className="text-center mb-10">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                CONFIRMED <span className="text-green-400">DETAILS</span>
              </h2>
              <p className="text-gray-500 text-sm">What we know for certain about Avengers: Doomsday</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {CONFIRMED_DETAILS.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-card/30 border border-green-500/15 rounded-xl p-4 sm:p-5 text-center"
                >
                  <Icon className="w-6 h-6 text-green-400 mx-auto mb-3" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm sm:text-base font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== COLLECTOR ANGLE ===== */}
        <section className="py-16 sm:py-20 bg-card/10 border-t border-border/30">
          <div className="container">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-bold tracking-wider uppercase">
                  Collector's Perspective
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                WHY YOUR <span className="text-green-400">CARDS MATTER</span> NOW
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Every movie that drops sends collectors scrambling. The smart move is building your collection before the hype hits — not after.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {COLLECTOR_ANGLES.map(({ title, desc, href }) => (
                <Link key={title} href={href}>
                  <div className="group bg-card/30 border border-green-500/15 hover:border-green-500/40 rounded-xl p-5 sm:p-6 cursor-pointer transition-all duration-200 hover:bg-card/50 h-full">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    <div className="flex items-center gap-1 mt-3 text-green-500/60 text-xs font-semibold group-hover:text-green-400 transition-colors">
                      Explore <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SPIDER-MAN SECONDARY COUNTDOWN ===== */}
        <section className="py-14 sm:py-16 border-t border-border/30">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-card/30 border border-blue-500/20 rounded-2xl p-6 sm:p-8 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4">
                    <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Film className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3
                        className="text-xl sm:text-2xl font-black text-white"
                        style={{ fontFamily: "'Anton', sans-serif" }}
                      >
                        <span className="text-blue-400">SPIDER-MAN:</span>{" "}
                        <span className="text-white">BRAND NEW DAY</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">July 31, 2026 &middot; Coming up fast</p>
                    </div>
                  </div>

                  {!spiderman.isLaunched ? (
                    <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                      <MiniDigit value={spiderman.days} label="Days" />
                      <span className="text-blue-500/40 font-bold text-lg mb-3">:</span>
                      <MiniDigit value={spiderman.hours} label="Hrs" />
                      <span className="text-blue-500/40 font-bold text-lg mb-3">:</span>
                      <MiniDigit value={spiderman.minutes} label="Min" />
                      <span className="text-blue-500/40 font-bold text-lg mb-3">:</span>
                      <MiniDigit value={spiderman.seconds} label="Sec" />
                    </div>
                  ) : (
                    <p className="text-blue-400 font-bold text-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
                      NOW IN THEATERS
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SELL YOUR CARDS CTA ===== */}
        <section className="py-14 sm:py-16 border-t border-border/30 bg-gradient-to-b from-transparent to-green-500/5">
          <div className="container text-center">
            <h2
              className="text-2xl sm:text-3xl font-black text-white mb-3"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              GOT <span className="text-green-400">TOPPS MARVEL</span> CARDS TO SELL?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-6 text-sm sm:text-base">
              We buy numbered and autograph Topps Marvel cards. Submit yours before Doomsday hype drives prices even higher.
            </p>
            <Link href="/sell-cards">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-400 text-black font-bold text-base px-8"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Sell Your Cards
              </Button>
            </Link>
          </div>
        </section>

        {/* ===== FOOTER NOTE ===== */}
        <div className="border-t border-border/20 py-6 text-center">
          <p className="text-xs text-gray-600">
            Release dates subject to change &middot; Fan-made countdown &middot; Not affiliated with Marvel Studios or Disney
          </p>
          <p className="text-xs text-gray-700 mt-1">
            <a
              href="https://northlandlegendaryfinds.com/mcu-news"
              className="hover:text-green-500 transition-colors"
            >
              northlandlegendaryfinds.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
