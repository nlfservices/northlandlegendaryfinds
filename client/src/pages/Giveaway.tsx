/**
 * Giveaway Landing Page — Lean Facebook Funnel
 * Main hero: $15 Credit offer → CTA to Whatnot → Email Capture → Legal
 * Designed for ad traffic. Facebook Pixel fires on page load + clicks.
 */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import {
  Gift, Radio, ExternalLink, Shield, CheckCircle2, Clock, DollarSign,
  Sparkles,
} from "lucide-react";

import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";

// Card images
const CARD_IMAGES = {
  doom: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Doom_bff032b0.png",
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
      <div className="min-h-screen">
        <SEO
          title="Get $15 Free Credit — Whatnot Live Streams"
          description="New to Whatnot? Sign up through our link and get $15 in free credit. Join Northland Legendary Finds live streams for free Marvel card giveaways."
          path="/giveaway"
          jsonLd={breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Giveaway", url: "/giveaway" },
          ])}
        />

        {/* ===== MAIN HERO — $15 CREDIT OFFER ===== */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 via-background to-background" />
            <div className="absolute top-10 left-[10%] w-96 h-96 bg-yellow-500/15 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div>
                <Badge variant="outline" className="mb-6 border-yellow-500/30 text-yellow-400 px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  BONUS OFFER
                </Badge>
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 leading-[0.9]"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  GET{" "}
                  <span className="text-yellow-400">$15 OFF</span>
                  <br />
                  YOUR FIRST BUY
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground mb-6 leading-relaxed max-w-lg mx-auto">
                  New to Whatnot? Sign up through our link and get
                  {" "}<strong className="text-yellow-400">$15 in free credit</strong> applied
                  automatically at checkout. Use it on any of our live shows — no minimum spend, no code needed.
                </p>

                {/* Whatnot invite link pill */}
                <a
                  href={WHATNOT_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatnotClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/15 border border-primary/40 rounded-full mb-6 hover:bg-primary/25 transition-all group"
                >
                  <Radio className="w-4 h-4 text-primary" />
                  <span className="text-primary font-bold text-sm sm:text-base tracking-wide">whatnot.com/invite/northlandfinds</span>
                  <ExternalLink className="w-3.5 h-3.5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* Big CTA */}
                <div className="flex justify-center mb-6">
                  <a
                    href={WHATNOT_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatnotClick}
                  >
                    <Button
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-10 py-7 shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all hover:scale-[1.02]"
                    >
                      <Gift className="w-6 h-6 mr-2" />
                      Get My $15 Credit
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    No Minimum Spend
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Auto-Follow Our Shows
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    30-Second Signup
                  </span>
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    Applied at Checkout
                  </span>
                </div>

                {/* Countdown Timer — only shows when admin sets a target time */}
                {countdown && (
                  <div className="mt-8 p-5 bg-card/50 border border-border rounded-2xl">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3 font-bold">
                      <Clock className="w-4 h-4 inline mr-1.5 text-red-400" />
                      Next Stream Starts In
                    </p>
                    <div className="flex justify-center gap-3 sm:gap-5">
                      {[
                        { val: countdown.days, label: "Days" },
                        { val: countdown.hours, label: "Hours" },
                        { val: countdown.minutes, label: "Min" },
                        { val: countdown.seconds, label: "Sec" },
                      ].map((t) => (
                        <div key={t.label} className="flex flex-col items-center">
                          <span className="text-2xl sm:text-4xl font-bold text-white tabular-nums" style={{ fontFamily: "'Anton', sans-serif" }}>
                            {String(t.val).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CARD SHOWCASE — FLOATING CARDS ===== */}
        <section className="relative py-16 lg:py-20 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[180px]" />
          </div>

          <div className="container relative z-10">
            <p className="text-center text-sm uppercase tracking-[0.3em] text-primary/70 font-bold mb-10">
              Cards You Could Win on Stream
            </p>

            {/* Desktop: 5 cards in a row with varied rotations */}
            <div className="hidden md:flex justify-center items-end gap-4 lg:gap-6">
              {[
                { src: CARD_IMAGES.doom, alt: "Doctor Doom — Mystery Men 1/5 Limited Edition", rotate: "-6deg", delay: "0s" },
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

            {/* Mobile: Horizontal scroll strip */}
            <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4 w-max">
                {[
                  { src: CARD_IMAGES.doom, alt: "Doctor Doom — Mystery Men 1/5 Limited Edition" },
                  { src: CARD_IMAGES.gambit, alt: "Gambit — Marvel Mint CGC 9" },
                  { src: CARD_IMAGES.ironman, alt: "Iron Man — Topps Chrome 45/50" },
                  { src: CARD_IMAGES.wolverine, alt: "Wolverine — Marvel Mint CGC 10" },
                  { src: CARD_IMAGES.magneto, alt: "Magneto — Marvel Mint CGC 10" },
                ].map((card, i) => (
                  <div key={i} className="flex-shrink-0">
                    <img
                      src={card.src}
                      alt={card.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-40 rounded-xl shadow-2xl shadow-black/50 border border-white/10"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA under cards */}
            <div className="mt-10 text-center">
              <a
                href={WHATNOT_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatnotClick}
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold text-sm transition-colors"
              >
                <Gift className="w-4 h-4" />
                Join a live stream to win cards like these
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ===== OFFICIAL RULES / LEGAL DISCLAIMER ===== */}
        <section className="py-12 border-t border-border/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <button
                onClick={() => setShowRules(!showRules)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                <Shield className="w-4 h-4" />
                <span className="underline underline-offset-2">
                  {showRules ? "Hide" : "View"} Official Giveaway Rules & Disclaimers
                </span>
              </button>

              {showRules && (
                <div className="mt-6 p-6 bg-card border border-border rounded-2xl text-xs text-muted-foreground space-y-4 leading-relaxed text-left">
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
    </>
  );
}
