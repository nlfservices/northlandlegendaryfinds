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
  Sparkles, Zap,
} from "lucide-react";
import { toast } from "sonner";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";
const QR_CODE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-whatnot-invite-qr_4f04b557.png";

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
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);
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

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      localStorage.setItem("nlf_popup_closed", "permanent");
      toast.success("You're in! We'll notify you before every stream.");
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "Giveaway Landing Page",
          content_category: "email_signup",
          value: 0,
          currency: "USD",
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeMutation.isPending) return;
    subscribeMutation.mutate({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      source: "giveaway-landing",
    });
  };

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
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
              {/* Left: $15 Credit CTA */}
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
                <p className="text-lg lg:text-xl text-muted-foreground mb-6 leading-relaxed max-w-lg">
                  {c("hero_description", "New to Whatnot? Sign up through our link and get")}
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
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <a
                    href={WHATNOT_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatnotClick}
                  >
                    <Button
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-10 py-7 shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all hover:scale-[1.02] w-full sm:w-auto"
                    >
                      <Gift className="w-6 h-6 mr-2" />
                      Get My $15 Credit
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                    <div className="flex gap-3 sm:gap-5">
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

              {/* Right: Email capture + QR */}
              <div className="flex flex-col gap-6">
                {/* Email Capture */}
                <div className="bg-card border border-border rounded-3xl p-6 lg:p-8">
                  <h2
                    className="text-xl font-bold mb-1"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    GET <span className="text-primary">NOTIFIED</span> BEFORE EVERY STREAM
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    We'll email you before we go live so you never miss a giveaway.
                  </p>
                  {submitted ? (
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 text-center">
                      <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="font-bold text-primary">You're on the list!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        We'll notify you before every stream.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="text"
                        placeholder="First Name (optional)"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <input
                        type="email"
                        placeholder="Your email address *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 font-bold py-6"
                        disabled={subscribeMutation.isPending}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {subscribeMutation.isPending
                          ? "Signing up..."
                          : "Get Stream Alerts & $15 Credit Info"}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        No spam, ever. Unsubscribe anytime.
                      </p>
                    </form>
                  )}
                </div>

                {/* QR Code */}
                <div className="bg-gradient-to-br from-purple-900/30 via-card to-yellow-900/10 border border-purple-500/20 rounded-3xl p-6 text-center backdrop-blur-sm">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full mb-3">
                    <Radio className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-400 text-xs font-bold tracking-wide">
                      SCAN TO FOLLOW
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 shadow-2xl shadow-purple-500/20 mx-auto w-fit mb-3">
                    <img
                      src={QR_CODE}
                      alt="Scan to follow us on Whatnot"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Scan with your phone to follow us on Whatnot
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== OFFICIAL RULES / LEGAL DISCLAIMER ===== */}
        <section className="py-12 border-t border-border/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
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
                <div className="mt-6 p-6 bg-card border border-border rounded-2xl text-xs text-muted-foreground space-y-4 leading-relaxed">
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
                    permitted, except at Sponsor's sole discretion.
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
