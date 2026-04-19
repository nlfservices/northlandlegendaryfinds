/**
 * Giveaway Landing Page — Redesigned for Maximum Hype
 * Hero with treasure chest → What We Give Away → Live Show Experience → $15 Credit → Stats → Cards → Legal
 * Designed for ad traffic. Facebook Pixel fires on page load + clicks.
 * MOBILE-FIRST: Sticky CTA bar, large touch targets, optimized spacing
 */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import {
  Gift, Radio, ExternalLink, Shield, CheckCircle2, Clock, DollarSign,
  Sparkles, Trophy, Star, Flame, Zap, Package, Crown,
} from "lucide-react";

import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";
const WHATNOT_PROFILE = "https://www.whatnot.com/user/northlandfinds";

// Hero images
const HERO_TREASURE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/NLFStudio-1_a59bb3e4.webp";
const LIVE_TABLE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlfstudio2_7ffc29b2.webp";

// Card images
const CARD_IMAGES = {
  spiderman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/spiderman-cgc-card_cf73b504.png",
  gambit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Gambit-Comic_0e247f0b.png",
  ironman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/IronMan-Comic_25f3c15d.png",
  wolverine: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Wolverine-Comic_cb2b9fd2.png",
  magneto: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Magneto-Comic2_5df7b4c4.png",
};

// Countdown hook — takes a UTC timestamp (ms), returns live d/h/m/s
function useCountdown(targetMs: number | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!targetMs) return;
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, [targetMs]);
  if (!targetMs || targetMs <= now) return null;
  const diff = targetMs - now;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

/** Reusable Whatnot Invite CTA button */
function WhatnotInviteButton({ label = "Get $15 Free Credit", size = "lg" as const, className = "", onClick }: { label?: string; size?: "lg" | "default" | "sm"; className?: string; onClick?: () => void }) {
  return (
    <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      <Button
        size={size}
        className={`bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all hover:scale-[1.02] ${className}`}
      >
        <Gift className="w-5 h-5 mr-2 flex-shrink-0" />
        {label}
      </Button>
    </a>
  );
}

/** Reusable Upcoming Shows button */
function UpcomingShowsButton({ label = "See Upcoming Shows", size = "lg" as const, className = "" }: { label?: string; size?: "lg" | "default" | "sm"; className?: string }) {
  return (
    <a href={WHATNOT_PROFILE} target="_blank" rel="noopener noreferrer">
      <Button
        size={size}
        variant="outline"
        className={`border-green-500 bg-green-600 text-white hover:bg-green-500 font-bold ${className}`}
      >
        <Radio className="w-5 h-5 mr-2 flex-shrink-0" />
        {label}
      </Button>
    </a>
  );
}

export default function Giveaway() {
  const [showRules, setShowRules] = useState(false);

  // Fetch countdown target from DB (admin-configurable)
  const { data: countdownSetting } = trpc.public.settings.get.useQuery(
    { key: "giveaway_countdown_target" },
    { refetchInterval: 60_000 }
  );
  const countdownTarget = countdownSetting?.value ? Number(countdownSetting.value) : null;
  const countdown = useCountdown(countdownTarget);

  // Editable page content from DB (falls back to hardcoded defaults)
  const { data: pageContent } = trpc.public.pageContent.getPage.useQuery(
    { page: "giveaway" },
    { staleTime: 30_000 }
  );
  const c = (key: string, fallback: string) => pageContent?.[key] ?? fallback;

  const handleWhatnotClick = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("trackCustom", "WhatnotReferralClick", {
        content_name: "Giveaway Landing Page Invite Link",
        referral_url: WHATNOT_INVITE,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen pb-20 md:pb-0">
        <SEO
          title="Free Marvel Card Giveaways + $15 Credit — Whatnot Live Shows"
          description="Join Northland Legendary Finds live on Whatnot for free Marvel card giveaways, graded slabs, sealed packs, and more. New users get $15 free credit."
          path="/giveaway"
          jsonLd={breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Giveaway", url: "/giveaway" },
          ])}
        />

        {/* ===== HERO SECTION — TREASURE CHEST ===== */}
        <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img src={HERO_TREASURE} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40 md:to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left: Text Content */}
              <div className="py-8 sm:py-12 lg:py-0">
                <Badge variant="outline" className="mb-4 border-yellow-500/40 text-yellow-400 px-3 sm:px-4 py-1.5 animate-pulse text-xs sm:text-sm">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                  FREE GIVEAWAYS EVERY SHOW
                </Badge>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-5 leading-[0.9] text-white"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  WE GIVE AWAY
                  <br />
                  <span className="text-yellow-400">LEGENDARY</span>
                  <br />
                  CARDS
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-lg">
                  Every live show on Whatnot, we give away <strong className="text-yellow-400">graded cards, raw singles, sealed packs, and hobby boxes</strong> — completely free. We're always switching it up, dropping random cards throughout our shows to keep things fresh. No catch. Just show up and enter.
                </p>

                {/* Dual CTAs — stacked on mobile, side by side on sm+ */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                  <WhatnotInviteButton
                    label="Get $15 Free Credit"
                    onClick={handleWhatnotClick}
                    className="text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 w-full sm:w-auto"
                  />
                  <UpcomingShowsButton
                    label="See Upcoming Shows"
                    className="text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 w-full sm:w-auto"
                  />
                </div>

                {/* Trust badges — wrap nicely on mobile */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star className="w-4 h-4 fill-yellow-400 flex-shrink-0" />
                    <span className="font-bold">5.0 Seller Rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <Zap className="w-4 h-4 flex-shrink-0" />
                    <span className="font-bold">Lightning-Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span className="font-bold">Our Reviews Speak for Themselves</span>
                  </div>
                </div>
              </div>

              {/* Right: Countdown Timer (if active) — desktop only */}
              <div className="hidden lg:flex justify-center">
                {countdown && (
                  <div className="p-8 bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-3xl">
                    <p className="text-center text-sm text-yellow-400 uppercase tracking-widest mb-4 font-bold">
                      <Flame className="w-4 h-4 inline mr-1.5 text-red-500 animate-pulse" />
                      Next Live Show Starts In
                    </p>
                    <div className="flex justify-center gap-4">
                      {[
                        { val: countdown.days, label: "Days" },
                        { val: countdown.hours, label: "Hours" },
                        { val: countdown.minutes, label: "Min" },
                        { val: countdown.seconds, label: "Sec" },
                      ].map((t) => (
                        <div key={t.label} className="flex flex-col items-center">
                          <span className="text-4xl sm:text-5xl font-bold text-white tabular-nums" style={{ fontFamily: "'Anton', sans-serif" }}>
                            {String(t.val).padStart(2, "0")}
                          </span>
                          <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">{t.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <a href={WHATNOT_PROFILE} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white font-bold">
                          <Radio className="w-4 h-4 mr-2 animate-pulse" />
                          Set Reminder
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile countdown — shows below hero on small screens */}
        {countdown && (
          <section className="lg:hidden py-6 bg-card/50 border-y border-border/30">
            <div className="container">
              <p className="text-center text-sm text-yellow-400 uppercase tracking-widest mb-3 font-bold">
                <Flame className="w-4 h-4 inline mr-1.5 text-red-500 animate-pulse" />
                Next Live Show Starts In
              </p>
              <div className="flex justify-center gap-4">
                {[
                  { val: countdown.days, label: "Days" },
                  { val: countdown.hours, label: "Hours" },
                  { val: countdown.minutes, label: "Min" },
                  { val: countdown.seconds, label: "Sec" },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-white tabular-nums" style={{ fontFamily: "'Anton', sans-serif" }}>
                      {String(t.val).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{t.label}</span>
                  </div>
                ))}
              </div>
              {/* Mobile countdown CTA */}
              <div className="mt-4 text-center">
                <a href={WHATNOT_PROFILE} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-5">
                    <Radio className="w-4 h-4 mr-2 animate-pulse" />
                    Set Reminder
                  </Button>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ===== WHAT WE GIVE AWAY — Side by Side Layout ===== */}
        <section className="relative py-14 sm:py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-[10%] w-96 h-96 bg-green-500/10 rounded-full blur-[160px]" />
            <div className="absolute bottom-20 left-[10%] w-80 h-80 bg-yellow-500/8 rounded-full blur-[140px]" />
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Image */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img
                  src={LIVE_TABLE}
                  alt="Marvel graded cards and sealed products laid out for a live show"
                  className="relative w-full rounded-2xl shadow-2xl shadow-black/50 border border-white/10"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Right: What We Give Away */}
              <div>
                <Badge variant="outline" className="mb-4 border-green-500/30 text-green-400 px-3 py-1 text-xs sm:text-sm">
                  <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                  EVERY SINGLE SHOW
                </Badge>

                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 leading-[0.95]"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  WHAT WE
                  <br />
                  <span className="text-green-400">GIVE AWAY</span>
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {[
                    { icon: Crown, color: "text-yellow-400", bg: "bg-yellow-500/10", title: "Graded Raw Cards", desc: "Top-tier graded and raw Marvel cards — Spider-Man, Wolverine, Doctor Doom, and more" },
                    { icon: Package, color: "text-blue-400", bg: "bg-blue-500/10", title: "Sealed Hobby Boxes & Packs", desc: "Factory-sealed Marvel Mint, Topps Chrome, and new release products" },
                    { icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", title: "Rare Singles & Parallels", desc: "Numbered parallels, refractors, and chase cards you won't find anywhere else" },
                    { icon: Sparkles, color: "text-pink-400", bg: "bg-pink-500/10", title: "Surprise Drops", desc: "Random bonus giveaways throughout the show — you never know what's next" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 sm:gap-4 items-start">
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${item.bg} rounded-xl flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base sm:text-lg">{item.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA buttons after prize list */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <WhatnotInviteButton
                    label="Get $15 Free Credit"
                    size="default"
                    onClick={handleWhatnotClick}
                    className="px-6 py-5 text-base w-full sm:w-auto"
                  />
                  <UpcomingShowsButton
                    label="Follow Us on Whatnot"
                    size="default"
                    className="px-6 py-5 text-base w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== $15 CREDIT SECTION ===== */}
        <section className="relative py-14 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-yellow-900/10 via-background to-background">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-yellow-500/8 rounded-full blur-[200px]" />
          </div>

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 sm:mb-6 border-yellow-500/30 text-yellow-400 px-3 sm:px-4 py-1.5 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                NEW TO WHATNOT?
              </Badge>

              <h2
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-5 leading-[0.9]"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                GET{" "}
                <span className="text-yellow-400">$15 FREE</span>
                <br />
                JUST FOR SIGNING UP
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto px-2">
                Sign up through our link and get <strong className="text-yellow-400">$15 in free credit</strong> applied automatically at checkout. 
                Use it on any of our live Marvel singles shows — no minimum spend, no code needed.
              </p>

              {/* Whatnot invite link pill */}
              <a
                href={WHATNOT_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatnotClick}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary/15 border border-primary/40 rounded-full mb-6 hover:bg-primary/25 transition-all group"
              >
                <Radio className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-primary font-bold text-xs sm:text-sm md:text-base tracking-wide break-all sm:break-normal">whatnot.com/invite/northlandfinds</span>
                <ExternalLink className="w-3.5 h-3.5 text-primary opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>

              {/* Big CTA */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6 sm:mb-8 px-4 sm:px-0">
                <WhatnotInviteButton
                  label="Get My $15 Credit"
                  onClick={handleWhatnotClick}
                  className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 w-full sm:w-auto"
                />
                <UpcomingShowsButton
                  label="Browse Our Shows"
                  className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 w-full sm:w-auto"
                />
              </div>

              {/* Trust badges — 2x2 grid on mobile, row on desktop */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground px-2 sm:px-0">
                <span className="flex items-center justify-center gap-1.5 sm:gap-2 bg-card/50 border border-border/50 rounded-full px-3 sm:px-4 py-2">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  No Minimum Spend
                </span>
                <span className="flex items-center justify-center gap-1.5 sm:gap-2 bg-card/50 border border-border/50 rounded-full px-3 sm:px-4 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  Auto-Follow Shows
                </span>
                <span className="flex items-center justify-center gap-1.5 sm:gap-2 bg-card/50 border border-border/50 rounded-full px-3 sm:px-4 py-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  30-Second Signup
                </span>
                <span className="flex items-center justify-center gap-1.5 sm:gap-2 bg-card/50 border border-border/50 rounded-full px-3 sm:px-4 py-2">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  Applied at Checkout
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS — 3 STEPS ===== */}
        <section className="py-14 sm:py-20 lg:py-24 border-t border-border/20">
          <div className="container">
            <div className="text-center mb-10 sm:mb-14">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                HOW IT <span className="text-primary">WORKS</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">Three steps. Thirty seconds. Free cards.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  icon: Gift,
                  color: "text-yellow-400",
                  border: "border-yellow-500/30",
                  glow: "bg-yellow-500/10",
                  title: "Sign Up Free",
                  desc: "Use our referral link to create a Whatnot account. You'll get $15 in free credit instantly — no code needed.",
                },
                {
                  step: "02",
                  icon: Radio,
                  color: "text-green-400",
                  border: "border-green-500/30",
                  glow: "bg-green-500/10",
                  title: "Join the Live Show",
                  desc: "Tune into our Marvel Singles shows. We go live regularly with graded cards, sealed packs, and rare pulls.",
                },
                {
                  step: "03",
                  icon: Trophy,
                  color: "text-purple-400",
                  border: "border-purple-500/30",
                  glow: "bg-purple-500/10",
                  title: "Win Free Cards",
                  desc: "We run giveaways throughout every show. Just hit 'Enter Giveaway' when it pops up. That's it. Free legendary cards.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`relative p-6 sm:p-8 bg-card/50 border ${item.border} rounded-2xl text-center group hover:border-opacity-60 transition-all duration-500`}
                >
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${item.glow} rounded-full px-4 py-1`}>
                    <span className={`text-xs font-bold ${item.color} tracking-widest`}>STEP {item.step}</span>
                  </div>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 ${item.glow} rounded-2xl flex items-center justify-center`}>
                    <item.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${item.color}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA after How It Works */}
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-muted-foreground text-sm sm:text-base mb-4">Ready to get started? It takes 30 seconds.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <WhatnotInviteButton
                  label="Sign Up & Get $15"
                  onClick={handleWhatnotClick}
                  className="text-base px-8 py-6 w-full sm:w-auto"
                />
                <UpcomingShowsButton
                  label="See When We're Live"
                  className="text-base px-8 py-6 w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== CARD SHOWCASE — FLOATING CARDS ===== */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[180px]" />
          </div>

          <div className="container relative z-10">
            <div className="text-center mb-8 sm:mb-10">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                CARDS WE'VE <span className="text-yellow-400">GIVEN AWAY</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">Real cards. Real winners. Real legends.</p>
            </div>

            {/* Desktop: 5 cards in a row with varied rotations */}
            <div className="hidden md:flex justify-center items-end gap-4 lg:gap-6">
              {[
                { src: CARD_IMAGES.spiderman, alt: "Spider-Man — Marvel Mint Gambit's Deck CGC 9", rotate: "-6deg", delay: "0s" },
                { src: CARD_IMAGES.gambit, alt: "Gambit — Marvel Mint CGC 9", rotate: "3deg", delay: "0.1s" },
                { src: CARD_IMAGES.ironman, alt: "Iron Man — Topps Chrome 45/50", rotate: "-2deg", delay: "0.2s" },
                { src: CARD_IMAGES.wolverine, alt: "Wolverine — Marvel Mint CGC 10", rotate: "4deg", delay: "0.3s" },
                { src: CARD_IMAGES.magneto, alt: "Magneto — Marvel Mint CGC 10", rotate: "-5deg", delay: "0.4s" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="group relative flex-shrink-0 transition-all duration-500 hover:scale-110 hover:z-20"
                  style={{
                    transform: `rotate(${card.rotate})`,
                    animationDelay: card.delay,
                  }}
                >
                  <div className="relative">
                    {/* Card glow on hover */}
                    <div className="absolute -inset-3 bg-yellow-500/0 group-hover:bg-yellow-500/20 rounded-2xl blur-xl transition-all duration-500" />
                    <img
                      src={card.src}
                      alt={card.alt}
                      loading="lazy"
                      decoding="async"
                      className="relative w-36 lg:w-44 xl:w-48 rounded-xl shadow-2xl shadow-black/50 border border-white/10 group-hover:border-yellow-500/40 transition-all duration-500 group-hover:shadow-yellow-500/20"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: Horizontal scroll strip — larger cards, better touch */}
            <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
              <div className="flex gap-4 w-max">
                {[
                  { src: CARD_IMAGES.spiderman, alt: "Spider-Man — Marvel Mint Gambit's Deck CGC 9" },
                  { src: CARD_IMAGES.gambit, alt: "Gambit — Marvel Mint CGC 9" },
                  { src: CARD_IMAGES.ironman, alt: "Iron Man — Topps Chrome 45/50" },
                  { src: CARD_IMAGES.wolverine, alt: "Wolverine — Marvel Mint CGC 10" },
                  { src: CARD_IMAGES.magneto, alt: "Magneto — Marvel Mint CGC 10" },
                ].map((card, i) => (
                  <div key={i} className="flex-shrink-0 snap-center">
                    <img
                      src={card.src}
                      alt={card.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-44 rounded-xl shadow-2xl shadow-black/50 border border-white/10"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA under cards — full button instead of text link */}
            <div className="mt-8 sm:mt-10 text-center">
              <p className="text-muted-foreground text-sm sm:text-base mb-4">Want cards like these? They're free at our shows.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <WhatnotInviteButton
                  label="Get $15 Free Credit"
                  onClick={handleWhatnotClick}
                  className="text-base px-8 py-6 w-full sm:w-auto"
                />
                <UpcomingShowsButton
                  label="See Upcoming Shows"
                  className="text-base px-8 py-6 w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA — BOTTOM BANNER ===== */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 via-background to-green-900/20" />
          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                DON'T MISS THE
                <br />
                <span className="text-yellow-400">NEXT SHOW</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 px-4 sm:px-0">
                Follow us on Whatnot to get notified when we go live. Free giveaways. Legendary cards. Every single show.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                <WhatnotInviteButton
                  label="Claim $15 Free Credit"
                  onClick={handleWhatnotClick}
                  className="text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 w-full sm:w-auto"
                />
                <UpcomingShowsButton
                  label="View Upcoming Shows"
                  className="text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== OFFICIAL RULES / LEGAL DISCLAIMER ===== */}
        <section className="py-8 sm:py-12 border-t border-border/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <button
                onClick={() => setShowRules(!showRules)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto min-h-[48px] px-4"
              >
                <Shield className="w-4 h-4" />
                <span className="underline underline-offset-2">
                  {showRules ? "Hide" : "View"} Official Giveaway Rules & Disclaimers
                </span>
              </button>

              {showRules && (
                <div className="mt-6 p-4 sm:p-6 bg-card border border-border rounded-2xl text-xs text-muted-foreground space-y-4 leading-relaxed text-left">
                  <h4 className="text-sm font-bold text-foreground">
                    OFFICIAL GIVEAWAY RULES — NORTHLAND LEGENDARY FINDS
                  </h4>

                  <p>
                    <strong>NO PURCHASE NECESSARY TO ENTER OR WIN.</strong> Void where prohibited.
                    Open to legal residents of the 50 United States and the District of Columbia
                    who are 18 years of age or older (19+ in AL and NE, 21+ in MS) at the time of entry.
                  </p>

                  <p>
                    <strong>Sponsor:</strong> Northland Legendary Finds, Minnesota, USA.
                    Contact: support@northlandlegendaryfinds.com
                  </p>

                  <p>
                    <strong>Promotion Period:</strong> Giveaways occur during live streams on the
                    Whatnot platform hosted by Northland Legendary Finds (username: northlandfinds).
                    Specific dates and times will be announced on our Whatnot page and via email
                    notifications to subscribers. Each individual giveaway runs for up to five (5)
                    minutes during the live stream.
                  </p>

                  <p>
                    <strong>How to Enter:</strong> During a live stream on Whatnot, when a giveaway
                    is pinned to the livestream, press the "Enter Giveaway" button to gain entry.
                    You must be present in the live stream to win. Limit one (1) entry per person
                    per giveaway, regardless of method of entry.
                  </p>

                  <p>
                    <strong>Alternative Method of Entry (AMOE):</strong> To enter without making a
                    purchase or being present on Whatnot, send an email to
                    support@northlandlegendaryfinds.com with the subject line "Giveaway Entry" and
                    include your full name, email address, and mailing address. Entries must be
                    received during the applicable giveaway period. Limit one (1) AMOE entry per
                    person per giveaway.
                  </p>

                  <p>
                    <strong>Prizes:</strong> Prizes include sealed Marvel trading
                    card packs, sealed hobby boxes, PSA/CGC graded cards, and raw trading cards.
                    Individual prize values and descriptions will be announced at the time of each
                    giveaway. Prizes are non-transferable and no substitution or cash equivalent is
                    available unless at Sponsor's sole discretion.
                  </p>

                  <p>
                    <strong>Winner Selection:</strong> Winners are selected at random using Whatnot's
                    built-in giveaway feature during the live stream. Odds of winning depend on the
                    number of eligible entries received for each individual giveaway.
                  </p>

                  <p>
                    <strong>Winner Notification & Prize Fulfillment:</strong> Winners will be
                    announced live during the stream and notified via the Whatnot platform. Winners
                    must provide a valid shipping address within the United States for prize delivery.
                    Prizes will be shipped within 14 business days of winner confirmation.
                  </p>

                  <p>
                    <strong>General Conditions:</strong> By entering, participants agree to be bound
                    by these Official Rules. Sponsor reserves the right to disqualify any entrant
                    who tampers with the entry process or violates these rules. All federal, state,
                    and local taxes on prizes are the sole responsibility of the winner.
                  </p>

                  <p>
                    <strong>Release of Liability:</strong> By entering, participants agree to release
                    and hold harmless Sponsor, Whatnot Inc., Meta Platforms Inc. (Facebook), and
                    their respective officers, directors, employees, agents, and affiliates from any
                    and all liability for injuries, losses, or damages of any kind arising from
                    participation in the promotion or acceptance of any prize.
                  </p>

                  <p>
                    <strong>Platform Disclaimer:</strong> This promotion is in no way sponsored,
                    endorsed, administered by, or associated with Whatnot, Inc. or its affiliates.
                    This promotion is in no way sponsored, endorsed, administered by, or associated
                    with Meta Platforms, Inc. (Facebook/Instagram) or its affiliates. Participants
                    are providing information to Northland Legendary Finds and not to Whatnot or Meta.
                  </p>

                  <p>
                    <strong>Privacy:</strong> Information collected from entrants is subject to
                    Sponsor's Privacy Policy available at northlandlegendaryfinds.com/privacy.
                  </p>

                  <p>
                    <strong>Governing Law:</strong> This promotion is governed by the laws of the
                    State of Minnesota, without regard to conflict of law principles.
                  </p>

                  <p className="text-muted-foreground/50 italic">
                    Last updated: April 2026. These rules may be updated periodically. Check this
                    page for the most current version.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ===== STICKY MOBILE CTA BAR — Always visible on phones ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 py-3 safe-area-bottom">
        <div className="flex gap-2">
          <a
            href={WHATNOT_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatnotClick}
            className="flex-1"
          >
            <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-5 text-sm shadow-lg">
              <Gift className="w-4 h-4 mr-1.5 flex-shrink-0" />
              $15 Free Credit
            </Button>
          </a>
          <a
            href={WHATNOT_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-5 text-sm shadow-lg">
              <Radio className="w-4 h-4 mr-1.5 flex-shrink-0" />
              Our Shows
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}
