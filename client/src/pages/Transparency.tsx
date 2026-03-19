/**
 * Transparency & Compliance Page — Redesigned
 * Industry context from Whatnot repack crackdowns, reputation-first messaging,
 * rich imagery, and full compliance details.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ShieldCheck, FileCheck, Eye, ListChecks, Radio,
  ArrowRight, CheckCircle2, Lock, Scale, Users,
  BookOpen, Zap, Package, AlertTriangle, ExternalLink,
  TrendingDown, Ban, Camera, Heart, Award
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/transparency-hero-DG9HzM4frVzyY8TTPhm6MS.webp";
const INDUSTRY_CRISIS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/transparency-industry-crisis-Ddw9bgQ3Wea8w4AZHNJJwX.webp";
const REPUTATION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/transparency-reputation-VoPjk9YchG3kWMe7f8jQZN.webp";
const LIVE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/transparency-live-accountability-3yzwF9JYXGCTquCNta8Xrs.webp";
const CHECKLIST_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/transparency-checklist-verification-EAKzYMimMWhupMiyiQsLua.webp";

const INDUSTRY_PROBLEMS = [
  {
    icon: Ban,
    title: "Resealed Packs",
    description: "Sellers exposed for resealing tampered packs and selling them as factory-fresh. Glue residue, mismatched crimps, and suspicious card alignment caught on camera.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: TrendingDown,
    title: "Price Gouging",
    description: "Packs retailing for $20–30 auctioned for $70+ during live breaks. Collectors paying double or triple market value, driven by manufactured hype and scarcity tactics.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: AlertTriangle,
    title: "Filler-Heavy Products",
    description: "Repacks padded with worthless commons to hit a card count. Collectors reported \"worthless hits\" from $100 repacks — one chase card buried in junk.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Eye,
    title: "Hidden Checklists",
    description: "No published checklists, no odds disclosure, no way to verify what you're buying. Sellers with non-public knowledge about contents, giving them an unfair advantage.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

const NLF_COMMITMENTS = [
  {
    icon: ListChecks,
    title: "Complete Checklists Published",
    description: "Every repack series has a full checklist published before the first pack is opened. You see exactly what cards are in the series — no hidden cards, no surprises about what's included.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Camera,
    title: "Every Pack Opened Live",
    description: "All packs are opened live on Whatnot streams. Every pull is witnessed by the community in real-time. Our show history and pull logs are permanently recorded on this site.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Lock,
    title: "Finalized & Locked Series",
    description: "Once a series checklist is finalized, it is locked. The number of packs and individual items will not change. This is stated on every checklist page with the finalization date.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Scale,
    title: "Fair, Honest Pricing",
    description: "No auction gouging, no manufactured scarcity. Our prices reflect the real value we put into every pack. Strong floor, loaded middle, healthy ceiling — at a fair price.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Eye,
    title: "Real-Time Pull Tracking",
    description: "Every card pulled is logged in real-time with the date, show, and pack number. Our checklist pages update live so you always know what's been pulled and what's still available.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: BookOpen,
    title: "Full Platform Compliance",
    description: "We follow all Whatnot policies for Professionally Sealed Surprise Products. Our checklists include all required information: card year, player name, variation, condition, and series details.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

const CHECKLIST_FIELDS = [
  { field: "Brand / Manufacturer", value: "Northland Legendary Finds", required: true },
  { field: "Product Title", value: "Listed on each product page", required: true },
  { field: "Series Name", value: "Listed on each product page", required: true },
  { field: "Item Condition", value: "Listed per card (Raw, Graded, etc.)", required: true },
  { field: "Quantity of Items", value: "Total card count displayed on checklist", required: true },
  { field: "Card Year", value: "Listed per card", required: true },
  { field: "Player / Card Name", value: "Listed per card", required: true },
  { field: "Variation / Parallel", value: "Listed per card (Base, Refractor, Gold /50, etc.)", required: true },
  { field: "Grade (if applicable)", value: "Listed per card when graded", required: true },
  { field: "Finalization Statement", value: "Date-stamped statement on each checklist", required: true },
];

export default function Transparency() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Transparency & Trust — Our Reputation Is Everything"
        description="The repack industry has a trust problem. See how Northland Legendary Finds is building reputation through radical transparency — published checklists, live pulls, fair pricing, and full compliance."
        path="/transparency"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Transparency", url: "/transparency" }])}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/15 border border-green-500/30 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-bold tracking-wide">OUR REPUTATION IS EVERYTHING</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
              BUILDING{" "}
              <span className="text-green-400">TRUST</span>{" "}
              IN AN INDUSTRY<br />
              THAT NEEDS IT MOST
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
              The trading card repack industry is facing a reckoning. Resealed packs, price gouging, hidden checklists,
              and filler-heavy products have eroded collector trust. At Northland Legendary Finds, we believe
              building our reputation isn't just important — <strong className="text-white">it's our top priority</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INDUSTRY CRISIS SECTION ===== */}
      <section className="py-16 lg:py-24 border-t border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Badge variant="outline" className="text-red-400 border-red-500/30 mb-4">
                <AlertTriangle className="w-3 h-3 mr-1" /> INDUSTRY IN CRISIS
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                THE REPACK INDUSTRY HAS A{" "}
                <span className="text-red-400">TRUST PROBLEM</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In late 2025, Whatnot — the largest live shopping platform for trading cards — was forced to implement
                a sweeping crackdown on repacks and mystery boxes. Their new{" "}
                <strong className="text-foreground">Professionally Sealed Surprise Products policy</strong>{" "}
                came after years of community complaints about fraud, misleading sales, and sellers who treated
                collectors as marks rather than customers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The problems were widespread: streamers caught selling resealed packs as factory-fresh, packs retailing
                for $20 being auctioned for $70+ during hype-driven live breaks, and repacks stuffed with worthless
                filler to hit a card count. Collectors reported losing hundreds on "premium" repacks filled with commons.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The crackdown was necessary — but it also revealed just how broken the system had become. Platforms like
                Whatnot, Fanatics, and PSA are now racing to rebuild trust through mandatory audits, public checklists,
                and seller vetting programs.
              </p>

              {/* Source Links */}
              <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">Sources</p>
                <div className="space-y-2">
                  <a
                    href="https://athlonsports.com/collectibles/whatnot-repack-crackdown-2025-gouging"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span>Athlon Sports — "Whatnot Repack Chaos: How Crackdowns and Gouging Are Crushing Card Worth"</span>
                  </a>
                  <a
                    href="https://www.cllct.com/sports-collectibles/sports-cards/whatnot-to-regulate-sale-of-repacks-surprise-products"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span>CLLCT — "Whatnot to Regulate Sale of Repacks, Surprise Products"</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={INDUSTRY_CRISIS_IMG}
                alt="The contrast between shady repack practices and transparent, verified operations"
                className="rounded-2xl border border-border shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 backdrop-blur-sm">
                <p className="text-red-400 text-sm font-bold">10–20% of breakers removed after crackdown</p>
              </div>
            </div>
          </div>

          {/* Problem Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRY_PROBLEMS.map((problem) => (
              <Card key={problem.title} className="bg-card/50 border-red-500/10 hover:border-red-500/20 transition-colors">
                <CardContent className="pt-6">
                  <div className={`w-10 h-10 ${problem.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <problem.icon className={`w-5 h-5 ${problem.color}`} />
                  </div>
                  <h3 className="text-sm font-bold mb-1.5">{problem.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REPUTATION FIRST SECTION ===== */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-transparent to-transparent" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src={REPUTATION_IMG}
                alt="NLF's professional workspace with organized cards, printed checklists, and verified stamp"
                className="rounded-2xl border border-border shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -left-4 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2 backdrop-blur-sm">
                <p className="text-green-400 text-sm font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Every card verified & documented
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="text-green-400 border-green-500/30 mb-4">
                <Heart className="w-3 h-3 mr-1" /> OUR COMMITMENT
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                REPUTATION ISN'T BUILT OVERNIGHT.{" "}
                <span className="text-green-400">IT'S EARNED.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We started Northland Legendary Finds with a simple belief: collectors deserve better. Not better
                marketing — better <em>practices</em>. Every decision we make is guided by one question:{" "}
                <strong className="text-foreground">"Would I buy this if I were the customer?"</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                While other sellers were cutting corners, we were publishing checklists. While others were gouging
                prices during live breaks, we were setting fair prices and sticking to them. While others were
                hiding what's in their packs, we were building tools so you could verify everything yourself.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Building our reputation is always our top priority — not because it's good marketing, but because
                it's the right way to run a business. We want to be the brand you trust with your collection,
                your money, and your time. That trust has to be earned through actions, not promises.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <p className="text-2xl font-bold text-green-400">100%</p>
                  <p className="text-xs text-muted-foreground mt-1">Packs Opened Live</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <p className="text-2xl font-bold text-green-400">100%</p>
                  <p className="text-xs text-muted-foreground mt-1">Checklists Published</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <p className="text-2xl font-bold text-green-400">$0</p>
                  <p className="text-xs text-muted-foreground mt-1">Hidden Fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW WE'RE DIFFERENT SECTION ===== */}
      <section className="py-16 lg:py-24 border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="outline" className="text-green-400 border-green-500/30 mb-4">
              <ShieldCheck className="w-3 h-3 mr-1" /> THE NLF STANDARD
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              HOW WE DO THINGS{" "}
              <span className="text-green-400">DIFFERENTLY</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These aren't aspirations — they're the standards we hold ourselves to on every single product.
              We comply with Whatnot's{" "}
              <a
                href="https://help.whatnot.com/hc/en-us/articles/39618879679757-Professionally-Sealed-Surprise-Products"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Professionally Sealed Surprise Products policy
              </a>{" "}
              and go well beyond the minimum requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {NLF_COMMITMENTS.map((item) => (
              <Card key={item.title} className="bg-card/50 hover:border-green-500/20 transition-colors">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE ACCOUNTABILITY SECTION ===== */}
      <section className="py-16 lg:py-24 bg-card/30 border-y border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 mb-4">
                <Camera className="w-3 h-3 mr-1" /> LIVE ACCOUNTABILITY
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                EVERY PACK OPENED{" "}
                <span className="text-blue-400">ON CAMERA</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                One of the biggest problems exposed in the repack industry was sellers opening packs off-camera,
                cherry-picking the best cards, and resealing what's left. At NLF, that's impossible — because
                every single pack is opened live on our Whatnot streams with the community watching.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every pull is logged in real-time on our website. Every show is recorded. Every card pulled
                is documented with the date, show number, and pack number. Our pull tracker updates live,
                so you always know exactly what's been pulled and what's still available in the series.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This isn't just transparency — it's accountability. When every action happens in front of
                an audience, there's no room for manipulation.
              </p>
            </div>

            <div className="relative">
              <img
                src={LIVE_IMG}
                alt="Professional live streaming setup for trading card breaks with community chat"
                className="rounded-2xl border border-border shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DON'T DO ===== */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="text-amber-400 border-amber-500/30 mb-4">
                <AlertTriangle className="w-3 h-3 mr-1" /> ZERO TOLERANCE
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                WHAT WE{" "}
                <span className="text-red-400">REFUSE</span>{" "}
                TO DO
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transparency isn't just about what we show — it's about the practices we've committed to never engaging in.
                These are the industry problems we stand firmly against.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { text: "We do NOT list estimated values, floor/ceiling prices, or value comparisons on checklists", detail: "Cards speak for themselves — research market values independently" },
                { text: "We do NOT change the contents of a series after finalization", detail: "Once locked, the checklist is permanent and immutable" },
                { text: "We do NOT add or remove packs from a series after finalization", detail: "The pack count is set and published before the first pack opens" },
                { text: "We do NOT hide cards from the checklist", detail: "Every possible pull is listed — no hidden inventory" },
                { text: "We do NOT use misleading terms like \"guaranteed hit\"", detail: "Unless we define exactly what qualifies as a hit" },
                { text: "We do NOT open packs off-camera", detail: "All pulls happen live on stream, witnessed by the community" },
                { text: "We do NOT gouge prices during live breaks", detail: "Our prices are set fairly and don't change based on hype" },
                { text: "We do NOT reseal or tamper with any products", detail: "Every pack is freshly assembled and professionally sealed" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-400 text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CHECKLIST COMPLIANCE ===== */}
      <section className="py-16 lg:py-24 bg-card/30 border-y border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Badge variant="outline" className="text-green-400 border-green-500/30 mb-4">
                <FileCheck className="w-3 h-3 mr-1" /> FULL COMPLIANCE
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                CHECKLIST{" "}
                <span className="text-green-400">COMPLIANCE</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every NLF checklist includes all fields required by Whatnot's Professionally Sealed Surprise Products
                policy for trading cards. Here's exactly what we publish for every series:
              </p>

              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 text-sm font-bold">Required Field</th>
                      <th className="text-left px-4 py-3 text-sm font-bold">How We Provide It</th>
                      <th className="text-center px-4 py-3 text-sm font-bold w-16">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHECKLIST_FIELDS.map((row, i) => (
                      <tr key={row.field} className={i % 2 === 0 ? "bg-card/50" : ""}>
                        <td className="px-4 py-3 text-sm font-medium">{row.field}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{row.value}</td>
                        <td className="px-4 py-3 text-center">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <img
                src={CHECKLIST_IMG}
                alt="Trading card repack verification checklist with magnifying glass and graded cards"
                className="rounded-2xl border border-border shadow-2xl w-full"
              />
              <p className="text-xs text-muted-foreground text-center mt-3 italic">
                Every card in every series is documented, verified, and published before the first pack opens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VERIFY IT YOURSELF ===== */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 mb-4">
                <Eye className="w-3 h-3 mr-1" /> DON'T TAKE OUR WORD FOR IT
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                VERIFY IT{" "}
                <span className="text-blue-400">YOURSELF</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We've built the tools for you to verify everything yourself. Browse our checklists, watch our live shows,
                check our card database, and inspect our graded inventory.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/checklists">
                <Card className="bg-card hover:border-green-500/30 transition-colors cursor-pointer h-full group">
                  <CardContent className="pt-6">
                    <ListChecks className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="font-bold mb-1 group-hover:text-green-400 transition-colors">Browse Checklists</h3>
                    <p className="text-sm text-muted-foreground">View every card in every series with real-time pull status</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/whatnot">
                <Card className="bg-card hover:border-purple-500/30 transition-colors cursor-pointer h-full group">
                  <CardContent className="pt-6">
                    <Radio className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="font-bold mb-1 group-hover:text-purple-400 transition-colors">Watch Live Shows</h3>
                    <p className="text-sm text-muted-foreground">See every pack opened live on Whatnot with real-time pull logging</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/cards">
                <Card className="bg-card hover:border-blue-500/30 transition-colors cursor-pointer h-full group">
                  <CardContent className="pt-6">
                    <Package className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="font-bold mb-1 group-hover:text-blue-400 transition-colors">Card Database</h3>
                    <p className="text-sm text-muted-foreground">Browse our complete card encyclopedia with set details and images</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/graded">
                <Card className="bg-card hover:border-amber-500/30 transition-colors cursor-pointer h-full group">
                  <CardContent className="pt-6">
                    <Zap className="w-8 h-8 text-amber-400 mb-3" />
                    <h3 className="font-bold mb-1 group-hover:text-amber-400 transition-colors">Graded Inventory</h3>
                    <p className="text-sm text-muted-foreground">See our graded card submissions and results — full transparency on what we own</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-green-900/10 to-transparent border-t border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <ShieldCheck className="w-14 h-14 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              QUESTIONS ABOUT{" "}
              <span className="text-green-400">OUR PROCESS?</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We're happy to answer any questions about how we build our repacks, source our cards, or comply
              with platform rules. Transparency means being open to questions — reach out anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline" size="lg">
                  Read Our FAQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
