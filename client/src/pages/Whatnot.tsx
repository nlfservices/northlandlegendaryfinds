/**
 * Whatnot Page - Exclusive live stream repacks
 * Showcases the 500-pack series, upcoming shows, and past show results
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Radio, Zap, Package, Calendar, ArrowRight, ExternalLink,
  Loader2, Clock, Users, TrendingUp, Eye, Star, Gift, Shield,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const WHATNOT_STORE_URL = "https://www.whatnot.com/user/northlandfinds";
const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";

export default function Whatnot() {
  const { data: products, isLoading: productsLoading } = trpc.public.products.list.useQuery();
  const { data: upcomingShows, isLoading: showsLoading } = trpc.public.shows.upcoming.useQuery();
  const { data: allShows } = trpc.public.shows.list.useQuery();

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
          content_name: "Whatnot Page Free Credit",
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
    <div className="min-h-screen">
      <SEO
        title="Live on Whatnot"
        description="Watch Northland Legendary Finds live pack openings on Whatnot. Join our streams for real-time Marvel trading card breaks and exclusive deals."
        path="/whatnot"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Whatnot", url: "/whatnot" }])}
      />
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full mb-6">
              <Radio className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-bold tracking-wide">LIVE ON WHATNOT</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              <span className="text-purple-400">EXCLUSIVE</span> LIVE
              <br />
              <span className="text-primary">STREAM REPACKS</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the thrill of live card breaks on Whatnot. Our exclusive 500-pack series 
              drops 50 packs per show — creating an unforgettable experience for collectors. 
              Watch the pulls happen live, track every card in real-time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-6">
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

            {/* QR Code */}
            <div className="mt-8 flex flex-col items-center">
              <div className="bg-white rounded-xl p-3 shadow-lg shadow-purple-500/20">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-whatnot-qr_a49cbbc8.jpg"
                  alt="Scan to follow us on Whatnot"
                  className="w-32 h-32"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Scan to follow on Whatnot</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card border-y border-border py-12 lg:py-16">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              HOW THE <span className="text-purple-400">500-PACK SERIES</span> WORKS
            </h2>
            <p className="text-muted-foreground text-lg">
              A limited series designed for the ultimate live stream experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <Package className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>500</div>
              <h3 className="font-bold mb-1">Total Packs</h3>
              <p className="text-sm text-muted-foreground">
                Each series is limited to exactly 500 packs. Once they're gone, they're gone forever.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Radio className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>50</div>
              <h3 className="font-bold mb-1">Packs Per Show</h3>
              <p className="text-sm text-muted-foreground">
                50 packs opened live each show. That's 10 shows to complete the entire series.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>LIVE</div>
              <h3 className="font-bold mb-1">Real-Time Pulls</h3>
              <p className="text-sm text-muted-foreground">
                Every pull is logged live during the stream. Check the checklist to see what's been pulled.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Star className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>ONLY</div>
              <h3 className="font-bold mb-1">Whatnot Exclusive</h3>
              <p className="text-sm text-muted-foreground">
                These repacks are ONLY available on Whatnot live streams. Not sold on the website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== $15 FREE CREDIT SECTION ===== */}
      <section className="py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 via-purple-900/15 to-yellow-900/10" />
        <div className="absolute top-10 left-1/4 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="container max-w-5xl relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/15 border border-yellow-500/40 rounded-full mb-4">
              <Gift className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold tracking-wide">NEW TO WHATNOT?</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              GET <span className="text-yellow-400">$15 FREE</span> TO SHOP OUR SHOWS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Sign up through our link and Whatnot gives you $15 credit instantly. Use it on your first purchase at any of our live shows.
            </p>
          </div>

          {/* 3-Step How To */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="relative text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                <span className="text-3xl font-bold text-yellow-400" style={{ fontFamily: "'Anton', sans-serif" }}>1</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Sign Up on Whatnot</h3>
              <p className="text-sm text-muted-foreground">Click our link and create your free account. Takes 30 seconds.</p>
              <div className="hidden md:block absolute top-8 -right-3 text-muted-foreground/30">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <span className="text-3xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>2</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Get $15 Instantly</h3>
              <p className="text-sm text-muted-foreground">Credit auto-applied to your account. No code needed.</p>
              <div className="hidden md:block absolute top-8 -right-3 text-muted-foreground/30">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <span className="text-3xl font-bold text-purple-400" style={{ fontFamily: "'Anton', sans-serif" }}>3</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Shop Our Live Shows</h3>
              <p className="text-sm text-muted-foreground">Follow us and use your credit at our next live show!</p>
            </div>
          </div>

          {/* CTA + Email Capture side by side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Claim Credit CTA */}
            <div className="bg-gradient-to-br from-yellow-900/20 via-card to-purple-900/10 border border-yellow-500/20 rounded-2xl p-8 text-center flex flex-col justify-center">
              <div className="w-20 h-20 bg-yellow-500/15 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/30">
                <Gift className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-yellow-400">$15</span> WAITING FOR YOU
              </h3>
              <p className="text-muted-foreground mb-5">
                100% free. No catch. Sign up and start shopping.
              </p>
              <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-6 w-full shadow-lg shadow-yellow-500/20">
                  <Gift className="w-5 h-5 mr-2" />
                  Claim Your $15 Free Credit
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-primary" />100% Free</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" />No Catch</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" />30 Seconds</span>
              </div>
            </div>

            {/* Stay in the Loop */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                STAY IN THE <span className="text-primary">LOOP</span>
              </h3>
              <p className="text-muted-foreground mb-5">
                Get notified about upcoming shows, exclusive drawings, and new drops.
              </p>
              {submitted ? (
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-primary mb-2">You're In!</h4>
                  <p className="text-muted-foreground mb-4">We'll keep you posted on upcoming shows.</p>
                  <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
                    <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                      <Gift className="w-4 h-4 mr-2" />
                      Now Claim Your $15 Credit
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="email"
                    placeholder="Your email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
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
      </section>

      {/* Upcoming Shows */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
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
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Shows Scheduled Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Shows will be announced soon. Follow us on Whatnot to get notified when we go live!
                </p>
                <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Radio className="w-4 h-4 mr-2" /> Follow on Whatnot
                  </Button>
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingShows.map(show => (
                <Card key={show.id} className="hover:border-purple-500/30 transition-colors overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-purple-600 to-red-600" />
                  <CardContent className="py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                          <Radio className="w-7 h-7 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{show.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
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

      {/* Whatnot Exclusive Products */}
      {whatnotProducts.length > 0 && (
        <section className="py-12 lg:py-16 bg-card border-y border-border">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                WHATNOT <span className="text-purple-400">EXCLUSIVE</span> PRODUCTS
              </h2>
              <p className="text-muted-foreground text-lg">
                These repacks are ONLY available during live streams
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whatnotProducts.map(product => (
                <Link key={product.id} href={`/whatnot/checklist/${product.slug}`}>
                  <Card className="group hover:border-purple-500/30 transition-all duration-300 cursor-pointer overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-purple-600 to-red-600" />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                          <Radio className="w-3 h-3 mr-1" /> Whatnot Only
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

      {/* Past Shows */}
      {pastShows.length > 0 && (
        <section className="py-12 lg:py-16">
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

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            DON'T MISS THE <span className="text-purple-400">ACTION</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Follow Northland Legendary Finds on Whatnot to get notified when we go live. 
            The 500-pack series won't last forever!
          </p>

          {/* QR Code */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white rounded-xl p-3 shadow-lg shadow-purple-500/20">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/whatnot-qr-2_8fab5940.png"
                alt="Scan to follow us on Whatnot"
                className="w-36 h-36"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Scan to follow on Whatnot</p>
          </div>

          <a href={WHATNOT_STORE_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-10 py-6">
              <Radio className="w-5 h-5 mr-2" />
              Follow on Whatnot
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
