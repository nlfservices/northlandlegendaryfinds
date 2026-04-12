/**
 * Giveaway Landing Page - $5,000 Marvel Giveaway + $15 Whatnot Credit
 * Designed for ad traffic. Compliant with Whatnot TOS & ad platform policies.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Gift, Radio, ExternalLink, Shield, CheckCircle2, Clock, DollarSign,
  Package, Star, Zap, Users, TrendingUp, ArrowRight, Play, Sparkles,
  Trophy, Target, Flame, Box, Award
} from "lucide-react";
import { toast } from "sonner";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const WHATNOT_STORE_URL = "https://www.whatnot.com/user/northlandfinds";
const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";
const QR_CODE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-whatnot-qr_a49cbbc8.jpg";
const NLF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png";

// Giveaway prize breakdown
const PRIZES = [
  {
    icon: Package,
    label: "FREE PACKS",
    description: "Sealed Marvel trading card packs — Topps Chrome, Platinum, and more",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: Box,
    label: "FREE BOXES",
    description: "Full sealed hobby boxes and blasters — the real deal, not resealed",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Award,
    label: "FREE GRADED CARDS",
    description: "PSA & CGC graded slabs — authenticated, graded, and ready for your collection",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Star,
    label: "FREE RAW CARDS",
    description: "Raw hits, inserts, parallels, and chase cards pulled from premium sets",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

export default function Giveaway() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showRules, setShowRules] = useState(false);

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
          value: 5000,
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
          title="$5,000 Marvel Card Giveaway — Join Our Live Stream"
          description="Northland Legendary Finds is giving away $5,000 in Marvel trading card products during our live Whatnot streams. Free packs, free boxes, free graded and raw cards. No purchase necessary."
          path="/giveaway"
          jsonLd={breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "$5K Giveaway", url: "/giveaway" },
          ])}
        />

        {/* ===== HERO: $5,000 GIVEAWAY ===== */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-background to-yellow-900/20" />
            <div className="absolute top-10 left-[5%] w-80 h-80 bg-red-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-10 right-[5%] w-80 h-80 bg-yellow-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[150px]" />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <div className="container relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/15 border border-red-500/40 rounded-full mb-8 animate-bounce" style={{ animationDuration: "2s" }}>
                <Flame className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm font-bold tracking-wider">
                  NO PURCHASE NECESSARY
                </span>
              </div>

              {/* Main headline */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-6"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                JOIN OUR{" "}
                <span className="text-primary">STREAM</span>
                <br />
                <span className="relative inline-block mt-2">
                  <span className="text-yellow-400">$5,000</span>
                  <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-yellow-400/60 rounded-full" />
                </span>{" "}
                IN <span className="text-red-400">GIVEAWAYS</span>
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
                Northland Legendary Finds is giving away{" "}
                <strong className="text-yellow-400">$5,000 in Marvel trading card products</strong>{" "}
                during our live Whatnot streams.
              </p>

              <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto mb-10">
                Free Packs. Free Boxes. Free Graded Cards. Free Raw Cards.{" "}
                <strong className="text-foreground">No purchase necessary.</strong>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <a
                  href={WHATNOT_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatnotClick}
                >
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-lg px-10 py-7 shadow-xl shadow-red-500/25 hover:shadow-red-500/40 transition-all hover:scale-[1.02] w-full sm:w-auto"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Join the Stream FREE
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="#get-notified">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-bold text-lg px-10 py-7 w-full sm:w-auto"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Get Notified + $15 Credit
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  100% Free to Watch
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  No Purchase Necessary
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400" />
                  Live on Whatnot
                </span>
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  $5,000+ in Prizes
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT YOU CAN WIN ===== */}
        <section className="py-16 lg:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-transparent" />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-yellow-500/30 text-yellow-400 px-4 py-1">
                <Trophy className="w-3.5 h-3.5 mr-1.5" />
                PRIZE BREAKDOWN
              </Badge>
              <h2
                className="text-4xl lg:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                WHAT YOU CAN <span className="text-yellow-400">WIN</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Over $5,000 in Marvel trading card products given away across our live streams.
                Every item is real, authenticated, and shipped to your door.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {PRIZES.map((prize) => (
                <Card
                  key={prize.label}
                  className={`${prize.bg} ${prize.border} border bg-opacity-50 hover:scale-[1.03] transition-transform duration-300`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-14 h-14 ${prize.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <prize.icon className={`w-7 h-7 ${prize.color}`} />
                    </div>
                    <h3
                      className={`text-lg font-bold mb-2 ${prize.color}`}
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      {prize.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prize.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 lg:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-400 px-4 py-1">
                <Target className="w-3.5 h-3.5 mr-1.5" />
                THREE SIMPLE STEPS
              </Badge>
              <h2
                className="text-4xl lg:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                HOW TO <span className="text-purple-400">ENTER</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                It takes less than 30 seconds. Completely free.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Follow Us on Whatnot",
                  desc: 'Click the link below to create a free Whatnot account (or log in). You\'ll automatically follow our page and get notified when we go live.',
                  icon: Radio,
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
                {
                  step: "02",
                  title: "Join the Live Stream",
                  desc: "When we go live, hop in! Our streams feature live Marvel card breaks, pack openings, and community fun. Free to watch.",
                  icon: Play,
                  color: "text-red-400",
                  bg: "bg-red-500/10",
                },
                {
                  step: "03",
                  title: 'Hit "Enter Giveaway"',
                  desc: "When a giveaway is pinned during the stream, press the Enter Giveaway button. That's it — you're entered. Winners are drawn live on stream.",
                  icon: Gift,
                  color: "text-yellow-400",
                  bg: "bg-yellow-500/10",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div
                    className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5`}
                  >
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span
                      className={`text-3xl font-bold ${item.color} opacity-40`}
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      {item.step}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 hidden md:block" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Big CTA */}
            <div className="text-center mt-12">
              <a
                href={WHATNOT_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatnotClick}
              >
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg px-10 py-7 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-[1.02]"
                >
                  <Radio className="w-5 h-5 mr-2" />
                  Follow on Whatnot — It's Free
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ===== $15 CREDIT BONUS ===== */}
        <section id="get-notified" className="py-16 lg:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/8 to-transparent" />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              {/* Left: Text + CTA */}
              <div>
                <Badge variant="outline" className="mb-4 border-yellow-500/30 text-yellow-400 px-4 py-1">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  BONUS OFFER
                </Badge>
                <h2
                  className="text-4xl lg:text-5xl font-bold mb-4 leading-[0.95]"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  GET{" "}
                  <span className="text-yellow-400">$15 OFF</span>
                  <br />
                  YOUR FIRST BUY
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  New to Whatnot? Sign up through our link and get{" "}
                  <strong className="text-yellow-400">$15 in free credit</strong> applied
                  automatically at checkout. Use it on any of our live shows — no minimum spend, no code needed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a
                    href={WHATNOT_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatnotClick}
                  >
                    <Button
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-7 shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all hover:scale-[1.02] w-full sm:w-auto"
                    >
                      <Gift className="w-6 h-6 mr-2" />
                      Get My $15 Credit
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>

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
              </div>

              {/* Right: Email capture + QR */}
              <div className="flex flex-col gap-6">
                {/* Email Capture */}
                <div className="bg-card border border-border rounded-3xl p-6">
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    GET <span className="text-primary">NOTIFIED</span> BEFORE EVERY STREAM
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
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

        {/* ===== WHO WE ARE ===== */}
        <section className="py-16 lg:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-8 items-center">
                {/* Left: Logo + info (3 cols) */}
                <div className="lg:col-span-3">
                  <Badge variant="outline" className="mb-4 border-green-500/30 text-green-400 px-4 py-1">
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    WHO WE ARE
                  </Badge>
                  <h2
                    className="text-3xl lg:text-4xl font-bold mb-4"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    NORTHLAND <span className="text-primary">LEGENDARY</span> FINDS
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    We're a Minnesota-based Marvel trading card company specializing in premium repacks, 
                    live card breaks, and building the best collector community in the hobby. Every pack 
                    is hand-built, every checklist is public, and every pull is live. We track over 1,700+ 
                    cards in our database and bring real transparency to the hobby.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { num: "1,700+", label: "Cards Tracked" },
                      { num: "$5,000+", label: "In Giveaways" },
                      { num: "100%", label: "Transparent" },
                      { num: "LIVE", label: "On Whatnot" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-2xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>
                          {stat.num}
                        </div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Logo (2 cols) */}
                <div className="lg:col-span-2 flex justify-center">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
                    <img
                      src={NLF_LOGO}
                      alt="Northland Legendary Finds"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-16 lg:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent" />
          <div className="container relative z-10 text-center">
            <h2
              className="text-4xl lg:text-6xl font-bold mb-4"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              DON'T MISS <span className="text-yellow-400">$5,000</span> IN{" "}
              <span className="text-red-400">FREE</span> CARDS
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Follow us on Whatnot to get notified when we go live. Every stream is free to watch.
              No purchase necessary to enter giveaways.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href={WHATNOT_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatnotClick}
              >
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xl px-12 py-8 shadow-xl shadow-red-500/25 hover:shadow-red-500/40 transition-all hover:scale-[1.02]"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Join the Stream — It's FREE
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>

            <p className="text-xs text-muted-foreground/60 max-w-lg mx-auto">
              NO PURCHASE NECESSARY TO ENTER OR WIN. Void where prohibited.
            </p>
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
                    <strong>Prizes:</strong> Approximate total retail value of all giveaway prizes
                    across the promotion period: $5,000 USD. Prizes include sealed Marvel trading
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
