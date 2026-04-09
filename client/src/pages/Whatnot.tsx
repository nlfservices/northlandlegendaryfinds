/**
 * Whatnot Page - Live stream card breaks & community
 * Layout: $15 Promo Hero → 3-Step Claim → 500-Pack Explainer → Upcoming Shows → Live Products → Past Shows → Follow CTA
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Radio, Zap, Package, Calendar, ArrowRight, ExternalLink,
  Loader2, Clock, Users, TrendingUp, Eye, Star, Gift, Shield,
  CheckCircle2, Sparkles, DollarSign, UserPlus, ShoppingBag, Play
} from "lucide-react";
import { toast } from "sonner";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const WHATNOT_STORE_URL = "https://www.whatnot.com/user/northlandfinds";
const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";
const QR_CODE_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-whatnot-qr_a49cbbc8.jpg";
const QR_CODE_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/whatnot-qr-2_8fab5940.png";

export default function Whatnot() {
  const { data: products, isLoading: productsLoading } = trpc.public.products.list.useQuery();
  const { data: upcomingShows, isLoading: showsLoading } = trpc.public.shows.upcoming.useQuery();
  const { data: allShows } = trpc.public.shows.list.useQuery();

  // Sticky button visibility — show after scrolling past hero
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatnotProducts = products?.filter(p => p.isWhatnotExclusive) || [];
  const pastShows = allShows?.filter(s => s.status === 'completed') || [];

  // Free credit section state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      localStorage.setItem("nlf_popup_closed", "permanent");
      toast.success("You're in! Check your inbox for updates.");
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "Whatnot Page Credit Offer",
          content_category: "email_signup",
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeMutation.isPending) return;
    subscribeMutation.mutate({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      source: "whatnot-page-free-credit",
    });
  };

  const handleWhatnotClick = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("trackCustom", "WhatnotReferralClick", {
        content_name: "Whatnot Page Invite Link",
        referral_url: WHATNOT_INVITE,
      });
    }
  };

  return (
    <>
    <div className="min-h-screen">
      <SEO
        title="Live on Whatnot"
        description="Watch Northland Legendary Finds live card breaks on Whatnot. Join our streams for real-time Marvel trading card reveals, giveaways, and great deals. New users get $15 credit towards their first purchase!"
        path="/whatnot"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Whatnot", url: "/whatnot" }])}
      />

      {/* ===== SECTION 1: $15 CREDIT HERO ===== */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-background to-purple-900/20" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-[10%] w-72 h-72 bg-yellow-500/15 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-10 right-[10%] w-72 h-72 bg-purple-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/8 rounded-full blur-[120px]" />
          </div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Big promo text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/15 border border-yellow-500/40 rounded-full mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
                <Gift className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-bold tracking-wider">NEW TO WHATNOT? GET $15 OFF YOUR FIRST BUY</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                GET{" "}
                <span className="relative inline-block">
                  <span className="text-yellow-400">$15 OFF</span>
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400/60 rounded-full" />
                </span>
                <br />
                <span className="text-purple-400">YOUR FIRST</span>
                <br />
                LIVE PURCHASE
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Sign up through our link and Whatnot gives you <strong className="text-yellow-400">$15 in credit</strong> — applied 
                automatically at checkout on your first purchase. Use it at any of our live Marvel card break shows. No code needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-7 shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all hover:scale-[1.02] w-full sm:w-auto">
                    <Gift className="w-6 h-6 mr-2" />
                    Get My $15 Credit
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-500 font-bold text-lg px-8 py-7 w-full sm:w-auto">
                    <Radio className="w-5 h-5 mr-2" />
                    Follow on Whatnot
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  No Minimum Spend
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  Auto-Follow Our Shows
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-400" />
                  </div>
                  30-Second Signup
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  Applied at Checkout
                </span>
              </div>
            </div>

            {/* Right: QR code + email capture card */}
            <div className="flex flex-col gap-6">
              {/* QR Code Card */}
              <div className="bg-gradient-to-br from-purple-900/30 via-card to-yellow-900/10 border border-purple-500/20 rounded-3xl p-8 text-center backdrop-blur-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full mb-4">
                  <Radio className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-400 text-xs font-bold tracking-wide">SCAN TO FOLLOW</span>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-2xl shadow-purple-500/20 mx-auto w-fit mb-4">
                  <img
                    src={QR_CODE_1}
                    alt="Scan to follow us on Whatnot"
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan with your phone to follow us on Whatnot
                </p>
              </div>

              {/* Email Capture */}
              <div className="bg-card border border-border rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
                  STAY IN THE <span className="text-primary">LOOP</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified about upcoming shows, drawings, and new drops.
                </p>
                {submitted ? (
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 text-center">
                    <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2" />
                    <h4 className="text-lg font-bold text-primary mb-1">You're In!</h4>
                    <p className="text-sm text-muted-foreground mb-3">We'll keep you posted on upcoming shows.</p>
                    <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
                      <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                        <Gift className="w-4 h-4 mr-2" />
                        Get My $15 Credit
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleCreditSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="First Name (optional)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="email"
                      placeholder="Your email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-5"
                      disabled={subscribeMutation.isPending}
                    >
                      {subscribeMutation.isPending ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Signing Up...</>
                      ) : (
                        <><Zap className="w-5 h-5 mr-2" />Get Show Alerts & Updates</>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">No spam, ever. Unsubscribe anytime.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: HOW TO CLAIM — 3 STEPS ===== */}
      <section className="relative py-14 lg:py-20 bg-card border-y border-border overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="container max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              HOW TO <span className="text-yellow-400">GET</span> YOUR $15 CREDIT
            </h2>
            <p className="text-muted-foreground text-lg">Three simple steps. Takes less than 30 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-8 text-center h-full transition-all group-hover:border-yellow-500/40 group-hover:shadow-lg group-hover:shadow-yellow-500/10">
                <div className="w-20 h-20 bg-yellow-500/15 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-yellow-500/30 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-10 h-10 text-yellow-400" />
                </div>
                <div className="text-5xl font-bold text-yellow-400/20 mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>01</div>
                <h3 className="text-xl font-bold mb-2">Sign Up via Our Link</h3>
                <p className="text-sm text-muted-foreground">
                  Click our referral link and create your free Whatnot account. Takes 30 seconds.
                </p>
              </div>
              <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-yellow-500/30" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-8 text-center h-full transition-all group-hover:border-green-500/40 group-hover:shadow-lg group-hover:shadow-green-500/10">
                <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-green-500/30 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-5xl font-bold text-green-400/20 mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>02</div>
                <h3 className="text-xl font-bold mb-2">$15 Credit Added</h3>
                <p className="text-sm text-muted-foreground">
                  $15 is added to your account automatically. You'll also auto-follow our page.
                </p>
              </div>
              <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-green-500/30" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-8 text-center h-full transition-all group-hover:border-purple-500/40 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                <div className="w-20 h-20 bg-purple-500/15 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-purple-500/30 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-10 h-10 text-purple-400" />
                </div>
                <div className="text-5xl font-bold text-purple-400/20 mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>03</div>
                <h3 className="text-xl font-bold mb-2">Use It on Your First Buy</h3>
                <p className="text-sm text-muted-foreground">
                  Credit applies automatically at checkout on your first purchase. No minimum spend!
                </p>
              </div>
            </div>
          </div>

          {/* CTA under steps */}
          <div className="text-center mt-10">
            <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-10 py-7 shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all hover:scale-[1.02]">
                <Gift className="w-6 h-6 mr-2" />
                Get My $15 Credit
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: HOW THE 500-PACK SERIES WORKS ===== */}
      <section className="py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
        <div className="container max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-full mb-4">
              <Play className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-bold tracking-wide">OUR LIVE SHOWS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              HOW THE <span className="text-purple-400">500-PACK SERIES</span> WORKS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A limited series designed for the ultimate live stream experience. Every card is real, every pull is live, every checklist is public.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <Package className="w-7 h-7 text-purple-400" />
              </div>
              <div className="text-4xl font-bold text-purple-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>500</div>
              <h3 className="font-bold mb-1 text-sm">Total Packs</h3>
              <p className="text-xs text-muted-foreground">
                Limited to exactly 500 packs. Once they're gone, they're gone forever.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-500/5">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Radio className="w-7 h-7 text-red-400" />
              </div>
              <div className="text-4xl font-bold text-red-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>50</div>
              <h3 className="font-bold mb-1 text-sm">Packs Per Show</h3>
              <p className="text-xs text-muted-foreground">
                50 packs opened live each show. 10 shows to complete the series.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>LIVE</div>
              <h3 className="font-bold mb-1 text-sm">Real-Time Pulls</h3>
              <p className="text-xs text-muted-foreground">
                Every pull logged live. Check the checklist to see what's been pulled.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/5">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Star className="w-7 h-7 text-amber-400" />
              </div>
              <div className="text-4xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>WIN</div>
              <h3 className="font-bold mb-1 text-sm">Giveaways & Deals</h3>
              <p className="text-xs text-muted-foreground">
                Every show features giveaways, deals, and surprises. Don't miss out.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-6">
                <Radio className="w-5 h-5 mr-2" />
                Follow on Whatnot
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Link href="/checklists">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold text-lg px-8 py-6">
                <Eye className="w-5 h-5 mr-2" />
                View Checklists
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MID-PAGE WHATNOT BANNER ===== */}
      <section className="py-6">
        <div className="container">
          <a
            href={WHATNOT_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gradient-to-r from-green-600/20 via-green-500/10 to-green-600/20 border border-green-500/30 hover:border-green-400/50 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-green-500/10"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform">
                  <Radio className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-400" style={{ fontFamily: "'Anton', sans-serif" }}>VISIT OUR WHATNOT STORE</h3>
                  <p className="text-sm text-muted-foreground">Browse our profile, see reviews, and follow for live show notifications</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-400 font-bold">
                <span>Go to Whatnot</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ===== SECTION 4: UPCOMING SHOWS ===== */}
      <section className="py-14 lg:py-20 bg-card border-y border-border">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-red-400">UPCOMING</span> SHOWS
              </h2>
              <p className="text-muted-foreground">Don't miss a show — follow us on Whatnot for notifications</p>
            </div>
          </div>

          {showsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !upcomingShows || upcomingShows.length === 0 ? (
            <div className="bg-gradient-to-br from-purple-900/10 via-card to-card border border-purple-500/10 rounded-2xl p-12 text-center">
              <Calendar className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>NO SHOWS SCHEDULED YET</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Shows will be announced soon. Follow us on Whatnot to get notified when we go live!
              </p>
              <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-5">
                  <Radio className="w-4 h-4 mr-2" /> Whatnot Live
                </Button>
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingShows.map(show => (
                <Card key={show.id} className="hover:border-purple-500/30 transition-colors overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-purple-600 to-red-600" />
                  <CardContent className="py-5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                          <Radio className="w-7 h-7 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{show.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(Number(show.showDate)).toLocaleDateString('en-US', {
                                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(Number(show.showDate)).toLocaleTimeString('en-US', {
                                hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
                              })}
                            </span>
                          </div>
                          {show.notes && <p className="text-sm text-muted-foreground mt-1">{show.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                          <Clock className="w-3 h-3 mr-1" /> Upcoming
                        </Badge>
                        {show.whatnotUrl && (
                          <a href={show.whatnotUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                              <ExternalLink className="w-4 h-4 mr-1" /> Whatnot
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION 5: WHATNOT LIVE PRODUCTS ===== */}
      {whatnotProducts.length > 0 && (
        <section className="py-14 lg:py-20">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                WHATNOT <span className="text-purple-400">LIVE</span> PRODUCTS
              </h2>
              <p className="text-muted-foreground text-lg">
                Available during our live shows on Whatnot
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whatnotProducts.map(product => (
                <Link key={product.id} href={`/checklist/${product.slug}`}>
                  <Card className="group hover:border-purple-500/30 transition-all duration-300 cursor-pointer overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-purple-600 to-red-600" />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                          <Radio className="w-3 h-3 mr-1" /> Live Show
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {product.packsRemaining}/{product.totalPacks} packs left
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 6: PAST SHOWS ===== */}
      {pastShows.length > 0 && (
        <section className="py-14 lg:py-20 bg-card border-y border-border">
          <div className="container">
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
              PAST <span className="text-green-400">SHOWS</span>
            </h2>
            <div className="grid gap-3">
              {pastShows.map(show => (
                <Card key={show.id} className="hover:border-green-500/20 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <Radio className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-bold">{show.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            {new Date(Number(show.showDate)).toLocaleDateString()} · {show.packsOpened} packs opened
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Completed</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 7: FINAL CTA — DON'T MISS THE ACTION ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/15 via-transparent to-transparent" />
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]" />

        <div className="container max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-bold tracking-wide">JOIN THE COMMUNITY</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            DON'T MISS THE <span className="text-purple-400">ACTION</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Follow Northland Legendary Finds on Whatnot to get notified when we go live. 
            Every show is free to watch.
          </p>

          {/* QR Code */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-2xl shadow-purple-500/20">
              <img
                src={QR_CODE_2}
                alt="Scan to follow us on Whatnot"
                className="w-40 h-40"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Scan to follow on Whatnot</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-10 py-7 shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all hover:scale-[1.02]">
                <Radio className="w-5 h-5 mr-2" />
                Follow on Whatnot
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-10 py-7">
                <Gift className="w-5 h-5 mr-2" />
                Get $15 Credit
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>

    {/* ===== STICKY FLOATING WHATNOT BUTTON ===== */}
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <a
        href={WHATNOT_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold px-6 py-4 rounded-full shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105 ring-2 ring-green-400/30"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <span className="text-base tracking-wide">Visit Our Whatnot</span>
        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
    </>
  );
}
